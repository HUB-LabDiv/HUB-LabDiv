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

const CreateCollectionSchema = z.object({
    name: z.string().trim().min(1).max(100),
    isPrivate: z.boolean().default(true)
});

const ToggleItemSchema = z.object({
    collectionId: z.string().uuid(),
    submissionId: z.string().uuid()
});

export async function fetchUserCollections(userId?: string) {
    const supabase = await createServerSupabase();
    let targetUserId = userId;

    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        targetUserId = user?.id;
    }

    if (!targetUserId) return [];

    const { data, error } = await supabase
        .from('collections')
        .select(`
            *,
            item_count:collection_items(count)
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('fetchUserCollections error:', error);
        return [];
    }
    return data || [];
}

export async function createCollection(userId: string | undefined, name: string, isPrivate: boolean = true) {
    const parse = CreateCollectionSchema.safeParse({ name, isPrivate });
    if (!parse.success) {
        return { error: 'Nome de coleção inválido' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Não autenticado' };
    }

    const { data, error } = await supabase
        .from('collections')
        .insert({
            user_id: user.id,
            name: parse.data.name,
            is_private: parse.data.isPrivate
        })
        .select()
        .single();

    if (error) {
        console.error('createCollection error:', error);
        return { error: error.message };
    }

    revalidatePath('/lab');
    return { data };
}

export async function toggleItemInCollection(collectionId: string, submissionId: string) {
    const parse = ToggleItemSchema.safeParse({ collectionId, submissionId });
    if (!parse.success) {
        return { error: 'Parâmetros inválidos' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { error: 'Não autenticado' };
    }

    // Verify ownership of the collection
    const { data: collection } = await supabase
        .from('collections')
        .select('id, user_id')
        .eq('id', parse.data.collectionId)
        .maybeSingle();

    if (!collection || collection.user_id !== user.id) {
        return { error: 'Coleção não encontrada ou permissão negada' };
    }

    // Check if item is already in collection
    const { data: existing } = await supabase
        .from('collection_items')
        .select('id')
        .eq('collection_id', parse.data.collectionId)
        .eq('submission_id', parse.data.submissionId)
        .maybeSingle();

    if (existing) {
        await supabase
            .from('collection_items')
            .delete()
            .eq('collection_id', parse.data.collectionId)
            .eq('submission_id', parse.data.submissionId);
        revalidatePath(`/arquivo/${parse.data.submissionId}`);
        return { action: 'removed' };
    } else {
        await supabase
            .from('collection_items')
            .insert({ collection_id: parse.data.collectionId, submission_id: parse.data.submissionId });
        revalidatePath(`/arquivo/${parse.data.submissionId}`);
        return { action: 'added' };
    }
}
