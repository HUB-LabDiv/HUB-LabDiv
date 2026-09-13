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

import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { WikiTopicProposal, WikiProposalType, WikiProposalStatus } from '@/types/wiki';

const createWikiProposalSchema = z.object({
    author_name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').max(100, 'Nome muito longo'),
    author_email: z.string().email('E-mail inválido').optional().or(z.literal('')),
    proposal_type: z.enum(['new_topic', 'complement', 'related_topic']).default('new_topic'),
    target_topic_id: z.string().optional().nullable(),
    target_topic_title: z.string().optional().nullable(),
    title: z.string().min(3, 'O título deve ter no mínimo 3 caracteres').max(150, 'Título muito longo'),
    category: z.string().min(2, 'Categoria é obrigatória'),
    description: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres').max(5000, 'Descrição muito longa'),
    justification: z.string().max(2000, 'Justificativa muito longa').optional().nullable()
});

const updateWikiProposalStatusSchema = z.object({
    id: z.string().uuid('ID inválido'),
    status: z.enum(['pending', 'approved', 'rejected']),
    admin_feedback: z.string().max(2000, 'Feedback muito longo').optional().nullable()
});

export async function submitWikiProposal(rawData: z.infer<typeof createWikiProposalSchema>) {
    try {
        const validated = createWikiProposalSchema.parse(rawData);
        const supabase = await createServerSupabase();

        const { data: { user } } = await supabase.auth.getUser();

        const payload = {
            user_id: user?.id || null,
            author_name: validated.author_name,
            author_email: validated.author_email || user?.email || null,
            proposal_type: validated.proposal_type,
            target_topic_id: validated.target_topic_id || null,
            target_topic_title: validated.target_topic_title || null,
            title: validated.title,
            category: validated.category,
            description: validated.description,
            justification: validated.justification || null,
            status: 'pending' as WikiProposalStatus
        };

        let { data, error } = await supabase
            .from('wiki_topic_proposals')
            .insert([payload])
            .select()
            .single();

        if (error) {
            console.warn('[WikiProposals] Standard insert failed, retrying with Admin client:', error.message);
            const adminSupabase = createAdminSupabase();
            const { data: adminData, error: adminErr } = await adminSupabase
                .from('wiki_topic_proposals')
                .insert([payload])
                .select()
                .single();

            if (adminErr) {
                console.error('[WikiProposals] Admin insert also failed:', adminErr.message);
                return { success: false, error: adminErr.message };
            }
            data = adminData;
        }

        revalidatePath('/admin/wiki');
        revalidatePath('/admin/cgif');
        return { success: true, data };
    } catch (err: any) {
        console.error('[WikiProposals] Erro ao submeter proposta:', err);
        return { success: false, error: err?.errors?.[0]?.message || err.message || 'Erro ao enviar proposta.' };
    }
}

export async function getAdminWikiProposals(statusFilter?: string, typeFilter?: string) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Acesso não autorizado.' };
        }

        // Check if admin
        const adminSupabase = createAdminSupabase();
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return { success: false, error: 'Permissão negada. Apenas administradores podem acessar.' };
        }

        let query = adminSupabase
            .from('wiki_topic_proposals')
            .select('*')
            .order('created_at', { ascending: false });

        if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        if (typeFilter && typeFilter !== 'all') {
            query = query.eq('proposal_type', typeFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('[WikiProposals] Erro ao buscar propostas:', error.message);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as WikiTopicProposal[] };
    } catch (err: any) {
        console.error('[WikiProposals] Erro inesperado ao buscar propostas:', err);
        return { success: false, error: err.message || 'Erro interno do servidor.' };
    }
}

export async function updateWikiProposalStatus(
    id: string,
    status: 'pending' | 'approved' | 'rejected',
    adminFeedback?: string
) {
    try {
        const validated = updateWikiProposalStatusSchema.parse({
            id,
            status,
            admin_feedback: adminFeedback
        });

        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Não autenticado.' };
        }

        const adminSupabase = createAdminSupabase();
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return { success: false, error: 'Apenas administradores podem moderar propostas.' };
        }

        const { error } = await adminSupabase
            .from('wiki_topic_proposals')
            .update({
                status: validated.status,
                admin_feedback: validated.admin_feedback || null,
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', validated.id);

        if (error) {
            console.error('[WikiProposals] Erro ao atualizar status da proposta:', error.message);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/wiki');
        revalidatePath('/admin/cgif');
        revalidatePath('/wiki');
        return { success: true };
    } catch (err: any) {
        console.error('[WikiProposals] Erro inesperado ao atualizar status:', err);
        return { success: false, error: err?.errors?.[0]?.message || err.message || 'Erro ao atualizar proposta.' };
    }
}

export async function deleteWikiProposal(id: string) {
    try {
        const zId = z.string().uuid().parse(id);
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Não autenticado.' };
        }

        const adminSupabase = createAdminSupabase();
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return { success: false, error: 'Permissão negada.' };
        }

        const { error } = await adminSupabase
            .from('wiki_topic_proposals')
            .delete()
            .eq('id', zId);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/wiki');
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err.message || 'Erro ao excluir proposta.' };
    }
}
