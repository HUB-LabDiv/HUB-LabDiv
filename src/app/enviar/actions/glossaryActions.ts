'use server';

import { createServerSupabase } from '@/lib/supabase/server';

export async function getGlossary() {
    const supabase = await createServerSupabase();

    // Fetch all words. We also fetch pending ones so the user who added them can see them.
    // Wait, if it's pending, maybe we shouldn't show it to EVERYONE?
    // Let's just fetch all of them for now, the UI can filter or show a "Pending" badge.
    const { data, error } = await supabase.rpc('get_full_glossary');

    if (error) {
        console.error('Error fetching glossary:', JSON.stringify(error, null, 2));
        return { success: false, data: [] };
    }

    return { success: true, data };
}

export async function addGeneratorWord(termo: string, codificacao_academica: string) {
    const supabase = await createServerSupabase();
    
    // Obter usuário logado para auditoria futura, se necessário
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('palavras_geradoras')
        .insert({
            termo: termo.trim(),
            codificacao_academica: codificacao_academica.trim(),
            is_pending: true
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error adding word:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function addConstellation(palavra_id: string, constelacao: string, descodificacao: string) {
    const supabase = await createServerSupabase();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('signos_constelacoes')
        .insert({
            palavra_id: palavra_id,
            constelacao: constelacao,
            descodificacao: descodificacao.trim(),
            is_pending: true
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error adding constellation:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function addGeneratedWord(palavra_geradora_id: string, termo: string) {
    const supabase = await createServerSupabase();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { data, error } = await supabase
        .from('palavras_geradas')
        .insert({
            palavra_geradora_id,
            termo: termo.trim(),
            is_pending: true
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error adding generated word:', error);
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function updateNodePosition(id: string, x: number, y: number) {
    const supabase = await createServerSupabase();
    
    // Obter usuário logado
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('palavras_geradoras')
        .update({ pos_x: x, pos_y: y })
        .eq('id', id);

    if (error) {
        console.error('Error updating node position:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function addEdge(sourceId: string, targetId: string) {
    const supabase = await createServerSupabase();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('constelacao_edges')
        .insert({
            source_id: sourceId,
            target_id: targetId
        });

    if (error) {
        console.error('Error adding edge:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function removeEdge(edgeId: string) {
    const supabase = await createServerSupabase();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { success: false, error: 'Unauthorized' };

    const { error } = await supabase
        .from('constelacao_edges')
        .delete()
        .eq('id', edgeId);

    if (error) {
        console.error('Error removing edge:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
