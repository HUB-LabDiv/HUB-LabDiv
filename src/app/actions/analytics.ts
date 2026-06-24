'use server';

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
    interactionData: any;
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

        const blockInteractions = existing?.block_interactions || {};
        
        // Save the interaction (e.g. array of answers)
        if (!blockInteractions[data.blockId]) {
            blockInteractions[data.blockId] = [];
        }
        
        blockInteractions[data.blockId].push({
            data: data.interactionData,
            timestamp: new Date().toISOString()
        });

        if (existing) {
            const { error: updateError } = await supabase
                .from('post_analytics')
                .update({
                    block_interactions: blockInteractions,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing.id);
            if (updateError) return { success: false, error: updateError.message };
        } else {
            const { error: insertError } = await supabase
                .from('post_analytics')
                .insert({
                    submission_id: data.submissionId,
                    block_interactions: blockInteractions,
                    total_reads: 0
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
