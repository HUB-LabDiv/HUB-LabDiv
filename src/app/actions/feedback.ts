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

export async function submitFeedback(data: { type: string; description: string; user_agent?: string; url?: string; email?: string }) {
    const supabase = await createServerSupabase();

    const { type, description, user_agent, url, email } = data;
    let screenshot_url = null;

    // Get current user if any
    const { data: { user } } = await supabase.auth.getUser();

    const reportPayload = {
        user_id: user?.id || null,
        type,
        description,
        screenshot_url,
        metadata: {
            user_email: email || user?.email,
            user_agent: user_agent || '',
            url: url || '',
            platform: 'web'
        }
    };

    let { error } = await supabase
        .from('feedback_reports')
        .insert([reportPayload]);

    if (error) {
        console.warn('[Feedback] Standard insert failed (likely RLS), retrying with Admin Client:', error.message);
        try {
            const { createAdminSupabase } = await import('@/lib/supabase/admin');
            const adminSupabase = createAdminSupabase();
            const { error: adminErr } = await adminSupabase.from('feedback_reports').insert([reportPayload]);
            if (!adminErr) {
                error = null; // Sucesso via bypass de admin
            } else {
                console.error('[Feedback] Admin insert also failed:', adminErr.message);
            }
        } catch (adminException) {
            console.error('[Feedback] Failed to invoke Admin Supabase client:', adminException);
        }
    }

    if (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');

    // Notify Admins
    try {
        const { sendAdminNotification } = await import('@/lib/notifications.server');
        await sendAdminNotification({
            type: 'bug_report',
            userName: email || user?.email || 'Anônimo',
            content: description,
            url: url || ''
        });
    } catch (emailErr) {
        console.warn('[Feedback] Email notification failed, but report was saved:', emailErr);
    }

    return { success: true };
}

export async function submitHubSuggestion(description: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('feedback_reports')
        .insert([
            {
                user_id: user?.id || null,
                type: 'suggestion',
                description,
                metadata: {
                    platform: 'web',
                    source: 'arena_researcher'
                }
            }
        ]);

    if (error) {
        console.error('Error submitting suggestion:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');

    // Notify Admins
    const { sendAdminNotification } = await import('@/lib/notifications.server');
    const { data: profile } = await supabase.from('profiles').select('full_name, username').eq('id', user?.id).single();

    await sendAdminNotification({
        type: 'hub_improvement',
        userName: profile?.full_name || (profile?.username ? `@${profile.username}` : user?.email) || 'Pesquisador Anônimo',
        content: description
    });

    return { success: true };
}
