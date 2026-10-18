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
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAdminToken, verifyAdminToken, AdminRole } from '@/lib/auth/admin-token';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const BulkActionSchema = z.object({
    submission_ids: z.array(z.string().uuid()).min(1, "Selecione ao menos um item"),
});

export async function requireAdminOrModerator(): Promise<{ authorized: boolean; role?: string; error?: string }> {
    const session = await getAdminSessionRole();
    if (!session.role || (session.role !== 'admin' && session.role !== 'moderator')) {
        return { authorized: false, error: 'Acesso não autorizado. Permissão de administrador ou moderador requerida.' };
    }
    return { authorized: true, role: session.role };
}

/**
 * Valida sugestões de IA em massa com proteção Zod e RBAC
 */
export async function validateAISuggestionsBulk(ids: string[]) {
    // 0. Verificação de Permissão RBAC
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    // 1. Validação Strict
    const result = BulkActionSchema.safeParse({ submission_ids: ids });

    if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
    }

    const adminSupabase = createAdminSupabase();

    // 2. Chamada RPC Atômica (tenta executar caso já migrado no Supabase)
    const { error: rpcError } = await adminSupabase.rpc('accept_ai_suggestions_bulk', {
        submission_ids: result.data.submission_ids
    });

    if (rpcError) {
        // Fallback resiliente direto no banco
        const { data: subs, error: fetchErr } = await adminSupabase
            .from('submissions')
            .select('id, tags, ai_suggested_tags, alt_text, ai_suggested_alt')
            .in('id', result.data.submission_ids);

        if (fetchErr) {
            console.error('Erro na leitura para aplicar sugestões IA:', fetchErr);
            return { success: false, error: 'Falha no processamento das sugestões de IA.' };
        }

        for (const sub of (subs || [])) {
            const mergedTags = Array.from(new Set([
                ...(sub.tags || []),
                ...(sub.ai_suggested_tags || [])
            ]));
            const newAlt = sub.ai_suggested_alt || sub.alt_text;

            await adminSupabase
                .from('submissions')
                .update({
                    tags: mergedTags,
                    alt_text: newAlt,
                    ai_status: 'applied'
                })
                .eq('id', sub.id);
        }
    }

    revalidatePath('/admin/acervo');
    return { success: true };
}

/**
 * Solicita re-processamento de IA para itens com erro
 */
export async function reprocessAI(submissionId: string) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('submissions')
        .update({ ai_status: 'pending' })
        .eq('id', submissionId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    return { success: true };
}

/**
 * Vincula uma submissão a uma trilha e tópico.
 */
export async function linkSubmissionToTrail(submissionId: string, trailId: string, topicIndex: number) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('trail_submissions')
        .insert({
            submission_id: submissionId,
            trail_id: trailId,
            topic_index: topicIndex,
            sort_order: 0
        });

    if (error) {
        console.error('Erro ao vincular trilha:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    revalidatePath(`/ferramentas/trilhas/${trailId}`);
    return { success: true };
}

/**
 * Remove o vínculo de uma submissão com uma trilha.
 */
export async function unlinkSubmissionFromTrail(linkId: string, trailId: string) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('trail_submissions')
        .delete()
        .eq('id', linkId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    revalidatePath(`/ferramentas/trilhas/${trailId}`);
    return { success: true };
}

/**
 * Busca todas as trilhas para o seletor administrativo.
 */
export async function fetchAllTrails() {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('learning_trails')
        .select('id, title, course_code, program')
        .order('title');

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Busca todas as trilhas às quais uma submissão já está vinculada.
 */
export async function fetchSubmissionTrails(submissionId: string) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('trail_submissions')
        .select(`
            id,
            trail_id,
            topic_index,
            learning_trails(title, course_code)
        `)
        .eq('submission_id', submissionId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function loginAdminBypass(login: string, senha: string) {
    const cookieStore = await import('next/headers').then(m => m.cookies());

    // Garante que qualquer modo impersonate anterior é encerrado
    cookieStore.delete('admin_impersonating_id');

    // ── Bypass via variáveis de ambiente (acesso manual de emergência) ──
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const adminSecret = process.env.ADMIN_SECRET_KEY || '';

    const loginMatchesEmail = login.trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const loginMatchesAlias = login.trim().toLowerCase() === 'adm' || login.trim().toLowerCase() === 'admin';
    const senhaCorreta = senha === adminPassword || senha === adminSecret;

    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 8, // 8 horas
    };

    if ((loginMatchesEmail || loginMatchesAlias) && senhaCorreta && adminPassword) {
        const token = await createAdminToken('admin');
        cookieStore.set('admin_bypass', token, cookieOptions);
        cookieStore.set('admin_session', token, cookieOptions);
        return { success: true };
    }

    // ── Fallback: tenta login normal pelo Supabase com email ──
    try {
        const supabase = await createServerSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: login,
            password: senha
        });
        if (error || !data.user) {
            return { success: false, error: 'Credenciais inválidas' };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', data.user.id)
            .maybeSingle();

        if (profile?.id && (profile.role === 'admin' || profile.role === 'moderator')) {
            const role: AdminRole = profile.role === 'admin' ? 'admin' : 'moderator';
            const token = await createAdminToken(role);
            cookieStore.set('admin_bypass', token, cookieOptions);
            cookieStore.set('admin_session', token, cookieOptions);
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || 'Erro ao autenticar' };
    }
}

/**
 * Consulta de forma segura no servidor o papel administrativo atual (sessão Supabase ou token HMAC).
 */
export async function getAdminSessionRole(): Promise<{ role: string | null }> {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const bypassCookie = cookieStore.get('admin_bypass')?.value;
    const sessionCookie = cookieStore.get('admin_session')?.value;

    const bypassCheck = await verifyAdminToken(bypassCookie);
    if (bypassCheck.valid && bypassCheck.role) {
        return { role: bypassCheck.role };
    }

    const sessionCheck = await verifyAdminToken(sessionCookie);
    if (sessionCheck.valid && sessionCheck.role) {
        return { role: sessionCheck.role };
    }

    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role === 'admin' || profile?.role === 'moderator') {
                return { role: profile.role };
            }
        }
    } catch {
        // Ignora erros na consulta do supabase
    }

    return { role: null };
}


