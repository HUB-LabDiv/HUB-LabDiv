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

const ToggleTagSchema = z.object({
    userId: z.string().uuid().optional(),
    tagName: z.string().trim().min(1).max(100)
});

export async function toggleTagFollow(userId: string | undefined, tagName: string) {
    const parseResult = ToggleTagSchema.safeParse({ userId, tagName });
    if (!parseResult.success) {
        return { error: 'Dados inválidos para seguir tag' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Não autenticado' };
    }

    const safeTagName = parseResult.data.tagName;
    const targetUserId = user.id;

    const { data: existing } = await supabase
        .from('tag_follows')
        .select('id')
        .eq('user_id', targetUserId)
        .eq('tag_name', safeTagName)
        .maybeSingle();

    if (existing) {
        await supabase
            .from('tag_follows')
            .delete()
            .eq('user_id', targetUserId)
            .eq('tag_name', safeTagName);
        revalidatePath('/');
        return { action: 'unfollowed' };
    } else {
        await supabase
            .from('tag_follows')
            .insert({ user_id: targetUserId, tag_name: safeTagName });
        revalidatePath('/');
        return { action: 'followed' };
    }
}

export async function checkTagFollow(userId: string | undefined, tagName: string) {
    if (!tagName) return false;
    const supabase = await createServerSupabase();
    let effectiveUserId = userId;

    if (!effectiveUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        effectiveUserId = user?.id;
    }

    if (!effectiveUserId) return false;

    const { data } = await supabase
        .from('tag_follows')
        .select('id')
        .eq('user_id', effectiveUserId)
        .eq('tag_name', tagName.trim())
        .maybeSingle();

    return !!data;
}
