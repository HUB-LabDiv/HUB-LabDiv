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
import { createAdminSupabase } from '@/lib/supabase/admin';
import { z } from 'zod';

const SubjectCodeSchema = z.string().trim().min(1).max(30);

export async function fetchClassmates(subjectCode: string) {
    const parsed = SubjectCodeSchema.safeParse(subjectCode);
    if (!parsed.success) {
        return { success: false, error: 'Código de disciplina inválido' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Não autenticado' };
    }

    const cleanSubjectCode = parsed.data;

    // Use admin client to query user_calendar_events across users for this subject
    // (RLS on user_calendar_events restricts standard client to viewing only own calendar)
    const adminSupabase = createAdminSupabase();
    const { data, error } = await adminSupabase
        .from('user_calendar_events')
        .select(`
            user_id,
            profiles:user_id (
                id,
                full_name,
                role,
                bio,
                avatar_url,
                user_category,
                entrance_year
            )
        `)
        .eq('type', `aula:${cleanSubjectCode}`);

    if (error) {
        console.error('[Fetch Classmates Error]', error);
        return { success: false, error: error.message };
    }

    // Deduplicate users (one user might have multiple events for the same subject)
    const uniqueUsers = new Map();
    data?.forEach((item: any) => {
        if (item.profiles && !uniqueUsers.has(item.user_id) && item.user_id !== user.id) {
            uniqueUsers.set(item.user_id, item.profiles);
        }
    });

    const results = Array.from(uniqueUsers.values());

    return { 
        success: true, 
        data: results.slice(0, 10),
        isMock: false 
    };
}
