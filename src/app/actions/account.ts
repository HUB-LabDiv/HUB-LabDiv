'use server';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */


import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

/**
 * TAREFA 1: Takeout de Dados (Portabilidade LGPD)
 * Reúne todas as informações do usuário e gera um objeto estruturado.
 */
export async function exportUserData() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const userId = user.id;

  // Busca paralela de todos os dados do usuário
  const [
    profile,
    submissions,
    articles,
    comments,
    questions,
    follows,
    followers,
    likes,
    saved
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).single(),
    supabase.from('submissions').select('*').eq('user_id', userId),
    supabase.from('micro_articles').select('*').eq('author_id', userId),
    supabase.from('comments').select('*').eq('user_id', userId),
    supabase.from('perguntas').select('*').eq('email', user.email),
    supabase.from('follows').select('*').eq('follower_id', userId),
    supabase.from('follows').select('*').eq('following_id', userId),
    supabase.from('curtidas').select('*').eq('user_id', userId),
    supabase.from('saved_posts').select('*').eq('user_id', userId),
  ]);

  const exportData = {
    metadata: {
      exported_at: new Date().toISOString(),
      platform: 'HUB Lab-Div',
      version: '1.0',
    },
    user_info: user,
    profile: profile.data,
    content: {
      submissions: submissions.data || [],
      articles: articles.data || [],
      comments: comments.data || [],
      questions: questions.data || [],
    },
    social: {
      following_count: follows.data?.length || 0,
      followers_count: followers.data?.length || 0,
      likes_given: likes.data || [],
      saved_items: saved.data || [],
    }
  };

  return exportData;
}

/**
 * TAREFA 3: Gatilho de Exclusão (Inicia o processo)
 * Nota: A exclusão real de auth.users deve ser feita via API Route 
 * usando a service_role_key, pois Server Actions usam a role do usuário.
 */
export async function requestAccountDeletion() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Sessão expirada' };
  }

  // A UI chamará a API Route /api/account/delete com o token da sessão
  return { success: true };
}
