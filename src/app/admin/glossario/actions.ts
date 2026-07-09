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


import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveWord(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradoras')
        .update({ is_pending: false, is_rejected: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function rejectWord(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradoras')
        .update({ is_rejected: true, is_pending: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function approveConstellation(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('signos_constelacoes')
        .update({ is_pending: false, is_rejected: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function rejectConstellation(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('signos_constelacoes')
        .update({ is_rejected: true, is_pending: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function approveGeneratedWord(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradas')
        .update({ is_pending: false, is_rejected: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function rejectGeneratedWord(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradas')
        .update({ is_rejected: true, is_pending: false })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

// ---- CRUD: Palavra Geradora ----
export async function updateWord(id: string, termo: string, codificacao_academica: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradoras')
        .update({ termo: termo.trim(), codificacao_academica: codificacao_academica.trim() })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

// ---- CRUD: Palavras Geradas ----
export async function addGeneratedWordAdmin(palavra_geradora_id: string, termo: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradas')
        .insert({ palavra_geradora_id, termo: termo.trim(), is_pending: false, is_rejected: false });

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function updateGeneratedWord(id: string, termo: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('palavras_geradas')
        .update({ termo: termo.trim() })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function deleteGeneratedWord(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from('palavras_geradas').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

// ---- CRUD: Constelações (Traduções) ----
export async function addConstellationAdmin(palavra_id: string, constelacao: string, descodificacao: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('signos_constelacoes')
        .insert({ palavra_id, constelacao: constelacao.trim(), descodificacao: descodificacao.trim(), is_pending: false, is_rejected: false });

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function updateConstellation(id: string, constelacao: string, descodificacao: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('signos_constelacoes')
        .update({ constelacao: constelacao.trim(), descodificacao: descodificacao.trim() })
        .eq('id', id);

    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}

export async function deleteConstellation(id: string) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.from('signos_constelacoes').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    revalidatePath('/admin/glossario');
    return { success: true };
}
