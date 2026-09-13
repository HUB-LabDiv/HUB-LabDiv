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
import { ContentReport } from '@/types/reports';

const updateContentStatusSchema = z.object({
    id: z.string().uuid('ID da denúncia inválido.'),
    status: z.enum(['pendente', 'em_analise', 'resolvido', 'descartado']),
});

const deleteContentReportSchema = z.object({
    id: z.string().uuid('ID da denúncia inválido.'),
});

/**
 * Taxonomic Reporting System - Safe Harbor Implementation
 * Handles both standard and "Gravíssima" categories with automatic moderation triggers via DB.
 */
export async function submitContentReport(formData: FormData) {
    const supabase = await createServerSupabase();
    
    const submission_id = formData.get('submission_id') as string;
    const category = formData.get('category') as string;
    const reason = formData.get('reason') as string;
    const url = formData.get('url') as string;

    if (!submission_id || !category) {
        return { success: false, error: 'Campos obrigatórios ausentes.' };
    }

    // Get current user if any
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('reports')
        .insert([
            {
                submission_id,
                reporter_id: user?.id || null,
                category,
                reason: reason || `Denúncia por ${category}`,
                status: 'pendente',
                metadata: {
                    url,
                    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server Action',
                    timestamp: new Date().toISOString()
                }
            }
        ]);

    if (error) {
        console.error('Error submitting content report:', error);
        return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath(`/arquivo/${submission_id}`);
    revalidatePath('/admin/reports');

    return { success: true };
}

/**
 * Busca todas as denúncias de conteúdo (tabela public.reports) para o painel de moderação.
 */
export async function getContentReports(): Promise<{ success: boolean; data?: ContentReport[]; error?: string }> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Não autenticado.' };
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '')) {
        return { success: false, error: 'Acesso negado.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        // Tenta buscar com join de profiles
        const { data, error } = await adminSupabase
            .from('reports')
            .select('*, profiles:reporter_id(full_name, username, avatar_url)')
            .order('created_at', { ascending: false });

        if (error) {
            console.warn('[getContentReports] Join error, falling back to simple query:', error.message);
            const { data: fallback, error: fbError } = await adminSupabase
                .from('reports')
                .select('*')
                .order('created_at', { ascending: false });

            if (fbError) {
                return { success: false, error: fbError.message };
            }
            return { success: true, data: (fallback || []) as ContentReport[] };
        }

        return { success: true, data: (data || []) as ContentReport[] };
    } catch (e: any) {
        console.error('[getContentReports] Exception:', e);
        return { success: false, error: e.message || 'Falha ao buscar denúncias.' };
    }
}

/**
 * Atualiza status de uma denúncia de conteúdo (pendente, em_analise, resolvido, descartado).
 */
export async function updateContentReportStatus(
    id: string,
    status: 'pendente' | 'em_analise' | 'resolvido' | 'descartado'
): Promise<{ success: boolean; error?: string }> {
    const parsed = updateContentStatusSchema.safeParse({ id, status });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos.' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Não autenticado.' };
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '')) {
        return { success: false, error: 'Acesso negado.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        const { error } = await adminSupabase
            .from('reports')
            .update({ status: parsed.data.status })
            .eq('id', parsed.data.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/reports');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || 'Erro ao atualizar status.' };
    }
}

/**
 * Exclui uma denúncia de conteúdo da tabela reports.
 */
export async function deleteContentReport(id: string): Promise<{ success: boolean; error?: string }> {
    const parsed = deleteContentReportSchema.safeParse({ id });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'ID inválido.' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Não autenticado.' };
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '')) {
        return { success: false, error: 'Acesso negado.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        const { error } = await adminSupabase
            .from('reports')
            .delete()
            .eq('id', parsed.data.id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/reports');
        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || 'Erro ao excluir denúncia.' };
    }
}

const reportChatMessageSchema = z.object({
    messageId: z.string().min(1, 'ID da mensagem inválido.'),
    messageContent: z.string().min(1, 'O conteúdo da mensagem não pode ser vazio.'),
    senderId: z.string().min(1, 'ID do remetente inválido.'),
    recipientId: z.string().optional(),
    senderName: z.string().optional(),
    category: z.enum(['assedio', 'discurso_odio', 'desinformacao', 'spam', 'plagio', 'abuso_infantil', 'outro']),
    justification: z.string().max(500, 'Justificativa muito longa.').optional(),
});

/**
 * Registra a denúncia de uma mensagem individual de chat (Emaranhamento 1-to-1 ou grupo)
 * com salvamento de snapshot forense em public.reports.
 */
export async function reportChatMessage(input: z.infer<typeof reportChatMessageSchema>): Promise<{ success: boolean; error?: string }> {
    const parsed = reportChatMessageSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos para denúncia.' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Você precisa estar autenticado para denunciar uma mensagem.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        const { error } = await adminSupabase
            .from('reports')
            .insert([{
                reporter_id: user.id,
                reported_item_id: parsed.data.messageId,
                item_type: 'emaranhamento_message',
                category: parsed.data.category,
                justification: parsed.data.justification || `Denúncia por ${parsed.data.category}`,
                status: 'pendente',
                metadata: {
                    message_content: parsed.data.messageContent,
                    sender_id: parsed.data.senderId,
                    sender_name: parsed.data.senderName || 'Membro do Hub',
                    recipient_id: parsed.data.recipientId || user.id,
                    chat_type: 'emaranhamento',
                    reported_at: new Date().toISOString()
                }
            }]);

        if (error) {
            console.error('[reportChatMessage] Supabase error:', error);
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/reports');
        revalidatePath('/admin/emaranhamento');
        return { success: true };
    } catch (e: any) {
        console.error('[reportChatMessage] Exception:', e);
        return { success: false, error: e.message || 'Falha ao processar denúncia da mensagem.' };
    }
}

