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


import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function addComment(submissionId: string, authorName: string, content: string, inlineParagraphId?: string) {
    if (!authorName.trim() || !content.trim()) {
        throw new Error('Nome e comentário são obrigatórios.');
    }

    const { error } = await supabase
        .from('comments')
        .insert([{
            submission_id: submissionId,
            author_name: authorName.trim(),
            content: content.trim(),
            inline_paragraph_id: inlineParagraphId || null,
            status: 'pendente' // Explicitly set as pending
        }]);

    if (error) {
        console.error("Error adding comment:", error);
        throw new Error('Falha ao adicionar comentário.');
    }

    // No revalidatePath here because it won't be visible yet
}

export async function approveComment(id: string, submissionId: string) {
    const { error } = await supabase
        .from('comments')
        .update({ status: 'aprovado' })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath(`/arquivo/${submissionId}`);
    revalidatePath('/admin');
}

export async function rejectComment(id: string, submissionId: string) {
    const { error } = await supabase
        .from('comments')
        .update({ status: 'rejeitado' })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath(`/arquivo/${submissionId}`);
    revalidatePath('/admin');
}

export async function deleteComment(id: string, submissionId: string) {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath(`/arquivo/${submissionId}`);
    revalidatePath('/admin');
}
