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

export async function registerPostAnalytics(data: {
    submissionId: string;
    scrollDepth: number;
    timeSpentSeconds: number;
}) {
    try {
        const supabase = await createServerSupabase();
        
        // 1. Ver se já existe analytics para este post
        const { data: existing, error: fetchError } = await supabase
            .from('post_analytics')
            .select('*')
            .eq('submission_id', data.submissionId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching analytics:', fetchError);
            return { success: false, error: fetchError.message };
        }

        if (existing) {
            // Média móvel simples ou incremental
            const newTotalReads = existing.total_reads + 1;
            const newScrollAvg = ((existing.scroll_depth_avg * existing.total_reads) + data.scrollDepth) / newTotalReads;
            const newTimeAvg = ((existing.time_spent_avg * existing.total_reads) + data.timeSpentSeconds) / newTotalReads;

            const { error: updateError } = await supabase
                .from('post_analytics')
                .update({
                    scroll_depth_avg: newScrollAvg,
                    time_spent_avg: newTimeAvg,
                    total_reads: newTotalReads,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);

            if (updateError) return { success: false, error: updateError.message };
        } else {
            const { error: insertError } = await supabase
                .from('post_analytics')
                .insert({
                    submission_id: data.submissionId,
                    scroll_depth_avg: data.scrollDepth,
                    time_spent_avg: data.timeSpentSeconds,
                    total_reads: 1
                });

            if (insertError) return { success: false, error: insertError.message };
        }

        return { success: true };
    } catch (e: any) {
        console.error('Error registering analytics:', e);
        return { success: false, error: e.message };
    }
}

export async function registerBlockInteraction(data: {
    submissionId: string;
    blockId: string;
    interactionData: { type: string; response: string; question?: string };
}) {
    try {
        const supabase = await createServerSupabase();

        const { data: existing, error: fetchError } = await supabase
            .from('post_analytics')
            .select('*')
            .eq('submission_id', data.submissionId)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            return { success: false, error: fetchError.message };
        }

        const blockInteractions: Record<string, any> = existing?.block_interactions || {};

        // Inicializa o bloco se ainda não existe
        if (!blockInteractions[data.blockId]) {
            blockInteractions[data.blockId] = {
                type: data.interactionData.type,
                question: data.interactionData.question || '',
                count: 0,
                answers: {} as Record<string, number>,
            };
        }

        const block = blockInteractions[data.blockId];
        block.count = (block.count || 0) + 1;

        // Agrega a resposta no dicionário answers: { "texto da resposta": N vezes }
        const responseText = (data.interactionData.response || '').trim();
        if (responseText) {
            if (!block.answers) block.answers = {};
            block.answers[responseText] = (block.answers[responseText] || 0) + 1;
        }

        if (existing) {
            const { error: updateError } = await supabase
                .from('post_analytics')
                .update({
                    block_interactions: blockInteractions,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id);
            if (updateError) return { success: false, error: updateError.message };
        } else {
            const { error: insertError } = await supabase
                .from('post_analytics')
                .insert({
                    submission_id: data.submissionId,
                    block_interactions: blockInteractions,
                    total_reads: 0,
                });
            if (insertError) return { success: false, error: insertError.message };
        }

        return { success: true };
    } catch (e: any) {
        console.error('Error registering interaction:', e);
        return { success: false, error: e.message };
    }
}

export async function getPostAnalytics(submissionId: string) {
    try {
        const supabase = await createServerSupabase();
        const { data, error } = await supabase
            .from('post_analytics')
            .select('*')
            .eq('submission_id', submissionId)
            .single();

        if (error && error.code !== 'PGRST116') {
            return { success: false, error: error.message };
        }
        
        return { success: true, data: data || null };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
