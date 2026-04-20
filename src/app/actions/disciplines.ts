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

export async function fetchAllDisciplines() {
    const supabase = await createServerSupabase();
    
    // Fetching from learning_trails which seems to be the main table for courses
    const { data, error } = await supabase
        .from('learning_trails')
        .select('*')
        .order('code', { ascending: true });

    if (error) {
        console.error('Error fetching disciplines:', error);
        return { error: 'Erro ao buscar disciplinas' };
    }

    return { success: true, data };
}

export async function fetchUserAcademicdata(userId?: string) {
    const supabase = await createServerSupabase();
    
    let targetUserId = userId;
    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'Não autorizado' };
        targetUserId = user.id;
    }

    const { data: progress } = await supabase
        .from('user_trail_progress')
        .select('*, learning_trails(title, course_code)')
        .eq('user_id', targetUserId)
        .eq('status', 'cursando');

    const { data: completed } = await supabase
        .from('user_completed_trails')
        .select('*, learning_trails(title, course_code)')
        .eq('user_id', targetUserId);

    return { 
        success: true, 
        data: { 
            inProgress: progress || [], 
            completed: completed || [] 
        } 
    };
}
