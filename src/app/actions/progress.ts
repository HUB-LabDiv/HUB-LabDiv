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

export async function syncJupiterEvolution(data: { concluidas: string[], cursando: string[] }) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    try {
        const allCodes = [...data.concluidas, ...data.cursando];
        
        if (allCodes.length === 0) {
            return { success: true, message: 'Nenhuma disciplina foi encontrada para sincronizar.' };
        }

        // Fetch trail_ids for the matching course_codes
        const { data: trails, error: trailsError } = await supabase
            .from('learning_trails')
            .select('id, course_code')
            .in('course_code', allCodes);

        if (trailsError) throw trailsError;

        if (!trails || trails.length === 0) {
            return { success: true, message: 'Foram localizadas disciplinas, mas nenhuma está mapeada no atual catálogo do Hub Lab-Div.' };
        }

        const progressPayload = trails.map(trail => {
            const isConcluida = data.concluidas.includes(trail.course_code);
            return {
                user_id: user.id,
                trail_id: trail.id,
                status: isConcluida ? 'concluida' : 'cursando',
                is_stable: true,
                updated_at: new Date().toISOString()
            };
        });

        // 1. Atualizar user_trail_progress
        const { error: progressError } = await supabase
            .from('user_trail_progress')
            .upsert(progressPayload, { 
                onConflict: 'user_id, trail_id' 
            });

        if (progressError) throw progressError;

        // 2. Atualizar user_completed_trails (Persistent Tracker) apenas para as concluídas
        const concluidasTrails = trails.filter(t => data.concluidas.includes(t.course_code));
        if (concluidasTrails.length > 0) {
            const completedPayload = concluidasTrails.map(trail => ({
                user_id: user.id,
                trail_id: trail.id
            }));

            const { error: completedError } = await supabase
                .from('user_completed_trails')
                .upsert(completedPayload, {
                    onConflict: 'user_id, trail_id'
                });

            if (completedError) throw completedError;
        }

        revalidatePath('/trilhas');
        revalidatePath('/ferramentas');
        
        return { success: true, message: 'Sincronização de Progresso finalizada com sucesso!' };

    } catch (error: any) {
        console.error('[Jupiter Evolution Sync Error]', error);
        return { success: false, error: error.message || 'Falha catastrófica ao sincronizar com o banco de dados.' };
    }
}
