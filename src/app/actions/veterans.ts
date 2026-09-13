'use server';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { CreateTipDTO } from '@/types/veterans';

const submitTipSchema = z.object({
    titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres.').max(120, 'O título não pode exceder 120 caracteres.'),
    conteudo: z.string().min(10, 'O conselho deve ter pelo menos 10 caracteres.').max(1000, 'O conselho não pode exceder 1000 caracteres.'),
    categoria: z.enum(['comunicacao', 'permanencia', 'academica']).default('comunicacao'),
    instituto: z.string().default('geral'),
});

const updateTipStatusSchema = z.object({
    id: z.string().uuid('ID inválido.'),
    status: z.enum(['pending', 'approved', 'rejected']),
});

/**
 * Submete um novo conselho de veterano (Geral ou por Instituto) para moderação.
 */
export async function submitTip(data: CreateTipDTO) {
    try {
        const parsed = submitTipSchema.safeParse(data);
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' };
        }

        const supabase = await createServerSupabase();
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            return { success: false, error: 'Usuário não autenticado.' };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, username')
            .eq('id', userData.user.id)
            .single();

        const autor_nome =
            profile?.full_name ||
            (profile?.username ? `@${profile.username}` : 'Veterano da USP');

        const { error } = await supabase
            .from('dicas_veteranos')
            .insert({
                titulo: parsed.data.titulo,
                conteudo: parsed.data.conteudo,
                categoria: parsed.data.categoria,
                instituto: parsed.data.instituto || 'geral',
                autor_id: userData.user.id,
                autor_nome,
                status: 'pending',
            });

        if (error) throw error;

        revalidatePath('/wiki/veteranos');
        revalidatePath('/admin/dicas');
        return { success: true };
    } catch (error: any) {
        console.error('Error submitting tip:', error);
        return { success: false, error: error.message || 'Falha ao submeter conselho.' };
    }
}

/**
 * Busca conselhos aprovados para a página USP 101, com filtro opcional por instituto.
 */
export async function getApprovedTips(institutoFilter?: string) {
    try {
        const supabase = await createServerSupabase();
        
        let query = supabase
            .from('dicas_veteranos')
            .select('*')
            .eq('status', 'approved');

        if (institutoFilter && institutoFilter !== 'todas') {
            query = query.eq('instituto', institutoFilter);
        }

        const { data, error } = await query.order('upvotes', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching approved tips:', error);
        return { success: false, error: error.message || 'Erro ao carregar conselhos.' };
    }
}

/**
 * Registra curtida/upvote em um conselho aprovado.
 */
export async function upvoteTip(id: string) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            return { success: false, error: 'Faça login para apoiar este conselho.' };
        }

        const { data: tip, error: fetchError } = await supabase
            .from('dicas_veteranos')
            .select('upvotes')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
            .from('dicas_veteranos')
            .update({ upvotes: (tip?.upvotes || 0) + 1 })
            .eq('id', id);

        if (updateError) throw updateError;
        
        return { success: true };
    } catch (error: any) {
        console.error('Error upvoting tip:', error);
        return { success: false, error: error.message || 'Erro ao registrar voto.' };
    }
}

/**
 * Busca conselhos para o painel de moderação com filtro de status opcional.
 */
export async function getAdminTips(statusFilter?: string) {
    try {
        const supabase = await createServerSupabase();
        
        let query = supabase.from('dicas_veteranos').select('*').order('created_at', { ascending: false });
        
        if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching admin tips:', error);
        return { success: false, error: error.message || 'Falha ao buscar conselhos para moderação.' };
    }
}

/**
 * Atualiza status de um conselho (pending, approved, rejected) com Zod.
 */
export async function updateTipStatus(id: string, status: 'pending' | 'approved' | 'rejected') {
    try {
        const parsed = updateTipStatusSchema.safeParse({ id, status });
        if (!parsed.success) {
            return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' };
        }

        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Acesso negado.' };
        }

        const { error } = await supabase
            .from('dicas_veteranos')
            .update({ status: parsed.data.status })
            .eq('id', parsed.data.id);

        if (error) throw error;
        
        revalidatePath('/wiki/veteranos');
        revalidatePath('/admin/dicas');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating tip status:', error);
        return { success: false, error: error.message || 'Erro ao atualizar status.' };
    }
}
