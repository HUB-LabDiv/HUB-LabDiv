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

export async function getSubjectAbsences(subjectCode: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { data, error } = await supabase
        .from('user_subject_absences')
        .select('*')
        .eq('user_id', user.id)
        .eq('subject_code', subjectCode)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        return { success: false, error: error.message };
    }

    return { success: true, data: data || { absences: 0, max_absences: 15 } };
}

export async function updateSubjectAbsences(subjectCode: string, absences: number, maxAbsences: number) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { data, error } = await supabase
        .from('user_subject_absences')
        .upsert(
            { 
                user_id: user.id, 
                subject_code: subjectCode, 
                absences, 
                max_absences: maxAbsences,
                updated_at: new Date().toISOString()
            },
            { onConflict: 'user_id,subject_code' }
        )
        .select()
        .single();

    if (error) return { success: false, error: error.message };
    
    revalidatePath('/ferramentas');
    return { success: true, data };
}

export async function getAllUserAbsences() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { data, error } = await supabase
        .from('user_subject_absences')
        .select('*')
        .eq('user_id', user.id);

    if (error) return { success: false, error: error.message };

    const { data: trails } = await supabase
        .from('learning_trails')
        .select('course_code, credits_aula');

    const creditsMap: Record<string, number> = {};
    if (trails) {
        trails.forEach((t: any) => {
            if (t.course_code && t.credits_aula != null) {
                const raw = String(t.course_code).trim();
                creditsMap[raw] = Number(t.credits_aula);
                creditsMap[raw.toUpperCase()] = Number(t.credits_aula);
            }
        });
    }

    return { success: true, data: data || [], creditsMap };
}

