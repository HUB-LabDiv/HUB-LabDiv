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
import { createAdminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyAdminToken } from '@/lib/auth/admin-token';
import { z } from 'zod';

const AddCommentSchema = z.object({
    submissionId: z.string().uuid("ID de submissão inválido"),
    authorName: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
    content: z.string().min(1, "Comentário é obrigatório").max(5000, "Comentário muito longo"),
    inlineParagraphId: z.string().optional().nullable(),
});

async function checkIsAdminOrModerator(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const bypassCookie = cookieStore.get('admin_bypass')?.value;
        const sessionCookie = cookieStore.get('admin_session')?.value;

        const bypassCheck = verifyAdminToken(bypassCookie);
        if (bypassCheck.valid && (bypassCheck.role === 'admin' || bypassCheck.role === 'moderator')) return true;

        const sessionCheck = verifyAdminToken(sessionCookie);
        if (sessionCheck.valid && (sessionCheck.role === 'admin' || sessionCheck.role === 'moderator')) return true;

        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        return ['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '');
    } catch {
        return false;
    }
}

export async function addComment(submissionId: string, authorName: string, content: string, inlineParagraphId?: string) {
    const validated = AddCommentSchema.parse({
        submissionId,
        authorName: authorName.trim(),
        content: content.trim(),
        inlineParagraphId: inlineParagraphId || null,
    });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('comments')
        .insert([{
            submission_id: validated.submissionId,
            author_name: validated.authorName,
            content: validated.content,
            inline_paragraph_id: validated.inlineParagraphId || null,
            user_id: user?.id || null,
            status: 'pendente' // Explicitamente pendente para moderação
        }]);

    if (error) {
        console.error("Error adding comment:", error);
        throw new Error('Falha ao adicionar comentário.');
    }

    return { success: true };
}

export async function approveComment(id: string, submissionId?: string) {
    const isAuthorized = await checkIsAdminOrModerator();
    if (!isAuthorized) {
        throw new Error('Acesso negado: Requer privilégios de moderação.');
    }

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('comments')
        .update({ status: 'aprovado' })
        .eq('id', id);

    if (error) throw new Error(error.message);

    if (submissionId) {
        revalidatePath(`/arquivo/${submissionId}`);
    }
    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    return { success: true };
}

export async function rejectComment(id: string, submissionId?: string) {
    const isAuthorized = await checkIsAdminOrModerator();
    if (!isAuthorized) {
        throw new Error('Acesso negado: Requer privilégios de moderação.');
    }

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('comments')
        .update({ status: 'rejeitado' })
        .eq('id', id);

    if (error) throw new Error(error.message);

    if (submissionId) {
        revalidatePath(`/arquivo/${submissionId}`);
    }
    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    return { success: true };
}

export async function deleteComment(id: string, submissionId?: string) {
    const isAuthorized = await checkIsAdminOrModerator();
    if (!isAuthorized) {
        throw new Error('Acesso negado: Requer privilégios de moderação.');
    }

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);

    if (submissionId) {
        revalidatePath(`/arquivo/${submissionId}`);
    }
    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    return { success: true };
}

export async function bulkUpdateCommentsStatus(ids: string[], status: 'aprovado' | 'rejeitado') {
    const isAuthorized = await checkIsAdminOrModerator();
    if (!isAuthorized) {
        throw new Error('Acesso negado: Requer privilégios de moderação.');
    }

    if (!ids || ids.length === 0) return { success: true };

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('comments')
        .update({ status })
        .in('id', ids);

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    return { success: true };
}

export async function bulkDeleteComments(ids: string[]) {
    const isAuthorized = await checkIsAdminOrModerator();
    if (!isAuthorized) {
        throw new Error('Acesso negado: Requer privilégios de moderação.');
    }

    if (!ids || ids.length === 0) return { success: true };

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('comments')
        .delete()
        .in('id', ids);

    if (error) throw new Error(error.message);

    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    return { success: true };
}
