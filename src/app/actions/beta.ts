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
import { sendAdminNotification } from '@/lib/notifications.server';

export async function registerBetaUser(playStoreEmail: string, surveyCompleted: boolean = false) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuário não autenticado.' };
        }

        // Check if the user is already registered with this email
        const { data: existingUser, error: checkError } = await supabase
            .from('beta_users')
            .select('id')
            .eq('play_store_email', playStoreEmail)
            .single();

        if (existingUser) {
            return { success: false, error: 'Este e-mail já está inscrito no programa Beta.' };
        }

        const { error: insertError } = await supabase
            .from('beta_users')
            .insert({
                user_id: user.id,
                play_store_email: playStoreEmail,
                survey_completed: surveyCompleted,
                status: 'pending'
            });

        if (insertError) {
            console.error('Database error on beta insert:', insertError);
            if (insertError.code === '23505') { // Unique constraint violation
                return { success: false, error: 'Este e-mail já está inscrito no programa Beta.' };
            }
            return { success: false, error: 'Falha ao processar inscrição. Tente novamente mais tarde.' };
        }

        return { success: true };
    } catch (error: any) {
        console.error('Beta registration error:', error);
        return { success: false, error: 'Ocorreu um erro interno. Tente novamente mais tarde.' };
    }
}

export async function approveBetaAccess(betaUserId: string, playStoreEmail: string) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Usuário não autenticado.' };
        }

        // In a real scenario, we should check if the user is an admin.
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || profile.role !== 'admin') {
            return { success: false, error: 'Acesso negado. Apenas administradores podem realizar esta ação.' };
        }

        const { error: updateError } = await supabase
            .from('beta_users')
            .update({ status: 'approved', invited_at: new Date().toISOString() })
            .eq('id', betaUserId);

        if (updateError) {
            console.error('Error approving beta user:', updateError);
            return { success: false, error: 'Erro ao atualizar status do usuário.' };
        }

        // Send email to the user notifying them
        try {
            await sendAdminNotification({
                type: 'beta_registration' as any,
                targetEmail: playStoreEmail
            } as any);
        } catch (e) {
            console.error('Erro ao enviar email de aprovação beta:', e);
            // It succeeds the db update, so we return true but could log a warning.
        }

        revalidatePath('/admin/beta');
        return { success: true };
    } catch (error: any) {
        console.error('Beta approval error:', error);
        return { success: false, error: 'Ocorreu um erro interno. Tente novamente mais tarde.' };
    }
}
