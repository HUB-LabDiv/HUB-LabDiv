'use server'

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


import { createServerSupabase } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitQuizResults(score: number, xpAwarded: number) {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autenticado' }

    // Award XP via the RPC function we defined in SQL
    const { error: xpError } = await supabase.rpc('add_radiation_xp', {
        p_profile_id: user.id,
        p_points: xpAwarded
    })

    if (xpError) {
        console.error('XP Award Error:', xpError);
        return { error: 'Erro ao atribuir radiação' }
    }

    // Log the attempt
    const { error: attemptError } = await supabase.from('quiz_attempts').insert({
        user_id: user.id,
        score,
        xp_awarded: xpAwarded
    })

    if (attemptError) {
        console.error('Quiz attempt log error:', attemptError);
    }

    revalidatePath('/lab')
    revalidatePath('/wiki/quiz')

    return { success: true }
}
