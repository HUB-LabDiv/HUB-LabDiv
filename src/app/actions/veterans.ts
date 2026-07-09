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

export async function submitTip(data: { titulo: string; conteudo: string; categoria: string }) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            return { success: false, error: 'Usuário não autenticado.' };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('nome')
            .eq('id', userData.user.id)
            .single();

        const { error } = await supabase
            .from('dicas_veteranos')
            .insert({
                titulo: data.titulo,
                conteudo: data.conteudo,
                categoria: data.categoria,
                autor_id: userData.user.id,
                autor_nome: profile?.nome || 'Usuário Desconhecido',
                status: 'pending'
            });

        if (error) throw error;
        
        return { success: true };
    } catch (error: any) {
        console.error('Error submitting tip:', error);
        return { success: false, error: error.message };
    }
}

export async function getApprovedTips() {
    try {
        const supabase = await createServerSupabase();
        
        const { data, error } = await supabase
            .from('dicas_veteranos')
            .select('*')
            .eq('status', 'approved')
            .order('upvotes', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching approved tips:', error);
        return { success: false, error: error.message };
    }
}

export async function upvoteTip(id: string) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
            return { success: false, error: 'Usuário não autenticado.' };
        }

        // Atomically increment using RPC or fetch and update
        // We'll do fetch and update for simplicity, ideally an RPC should be used for atomic operations
        const { data: tip, error: fetchError } = await supabase
            .from('dicas_veteranos')
            .select('upvotes')
            .eq('id', id)
            .single();

        if (fetchError) throw fetchError;

        const { error: updateError } = await supabase
            .from('dicas_veteranos')
            .update({ upvotes: tip.upvotes + 1 })
            .eq('id', id);

        if (updateError) throw updateError;
        
        return { success: true };
    } catch (error: any) {
        console.error('Error upvoting tip:', error);
        return { success: false, error: error.message };
    }
}

export async function getAdminTips(statusFilter?: string) {
    try {
        const supabase = await createServerSupabase();
        
        let query = supabase.from('dicas_veteranos').select('*').order('created_at', { ascending: false });
        
        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error('Error fetching admin tips:', error);
        return { success: false, error: error.message };
    }
}

export async function updateTipStatus(id: string, status: string) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Acesso negado.' };
        }

        const { error } = await supabase
            .from('dicas_veteranos')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
        
        revalidatePath('/wiki/veteranos');
        revalidatePath('/admin/dicas');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating tip status:', error);
        return { success: false, error: error.message };
    }
}
