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

export async function fetchUserCollections(userId: string) {
    const { data, error } = await supabase
        .from('collections')
        .select(`
            *,
            item_count:collection_items(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) return [];
    return data;
}

export async function createCollection(userId: string, name: string, isPrivate: boolean = true) {
    const { data, error } = await supabase
        .from('collections')
        .insert({ user_id: userId, name, is_private: isPrivate })
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function toggleItemInCollection(collectionId: string, submissionId: string) {
    // Check if item is already in collection
    const { data: existing } = await supabase
        .from('collection_items')
        .select('*')
        .eq('collection_id', collectionId)
        .eq('submission_id', submissionId)
        .single();

    if (existing) {
        await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', collectionId)
            .eq('submission_id', submissionId);
        return { action: 'removed' };
    } else {
        await supabase
            .from('collection_items')
            .insert({ collection_id: collectionId, submission_id: submissionId });
        return { action: 'added' };
    }
}
