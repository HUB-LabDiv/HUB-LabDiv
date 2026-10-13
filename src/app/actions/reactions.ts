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

export type ReactionType = 'atom_blue' | 'bulb_yellow' | 'spark_red';

const ToggleReactionSchema = z.object({
    submissionId: z.string().uuid(),
    type: z.enum(['atom_blue', 'bulb_yellow', 'spark_red'])
});

export async function toggleReaction(submissionId: string, userId: string | undefined, type: ReactionType) {
    const parse = ToggleReactionSchema.safeParse({ submissionId, type });
    if (!parse.success) {
        return { success: false, error: 'Parâmetros de reação inválidos' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Não autenticado' };
    }

    const currentUserId = user.id;
    const targetSubmissionId = parse.data.submissionId;
    const reactionType = parse.data.type;

    try {
        // 1. Check if reaction already exists
        const { data: existing } = await supabase
            .from('reactions')
            .select('id, reaction_type')
            .eq('submission_id', targetSubmissionId)
            .eq('user_id', currentUserId)
            .maybeSingle();

        if (existing) {
            // If same type, toggle off (delete)
            if (existing.reaction_type === reactionType) {
                const { error: delError } = await supabase
                    .from('reactions')
                    .delete()
                    .eq('id', existing.id);
                if (delError) throw delError;
            } else {
                // If different type, atomic update to avoid delete+insert race collisions
                const { error: updError } = await supabase
                    .from('reactions')
                    .update({ reaction_type: reactionType })
                    .eq('id', existing.id);
                if (updError) throw updError;
            }
        } else {
            // New reaction insert
            const { error: insError } = await supabase
                .from('reactions')
                .insert({
                    submission_id: targetSubmissionId,
                    user_id: currentUserId,
                    reaction_type: reactionType
                });
            if (insError) throw insError;
        }

        revalidatePath(`/arquivo/${targetSubmissionId}`);
        revalidatePath('/');
        return { success: true };
    } catch (err: any) {
        console.error('Error toggling reaction:', err);
        return { success: false, error: err.message || 'Erro ao registrar reação' };
    }
}

export async function getUserReaction(submissionId: string, userId: string | undefined) {
    const parsedId = z.string().uuid().safeParse(submissionId);
    if (!parsedId.success) return null;

    const supabase = await createServerSupabase();
    let effectiveUserId = userId;

    if (!effectiveUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        effectiveUserId = user?.id;
    }

    if (!effectiveUserId) return null;

    const { data } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('submission_id', parsedId.data)
        .eq('user_id', effectiveUserId)
        .maybeSingle();

    return data?.reaction_type as ReactionType | null;
}
