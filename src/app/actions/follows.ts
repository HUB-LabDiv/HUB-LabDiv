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

export async function toggleTagFollow(userId: string, tagName: string) {
    const { data: existing } = await supabase
        .from('tag_follows')
        .select('*')
        .eq('user_id', userId)
        .eq('tag_name', tagName)
        .single();

    if (existing) {
        await supabase
            .from('tag_follows')
            .delete()
            .eq('user_id', userId)
            .eq('tag_name', tagName);
        return { action: 'unfollowed' };
    } else {
        await supabase
            .from('tag_follows')
            .insert({ user_id: userId, tag_name: tagName });
        return { action: 'followed' };
    }
}

export async function checkTagFollow(userId: string | undefined, tagName: string) {
    if (!userId) return false;
    const { data } = await supabase
        .from('tag_follows')
        .select('*')
        .eq('user_id', userId)
        .eq('tag_name', tagName)
        .single();
    return !!data;
}
