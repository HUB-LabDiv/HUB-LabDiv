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

export async function submitFeedback(formData: FormData) {
    const supabase = await createServerSupabase();

    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const file = formData.get('screenshot') as File | null;
    const userEmail = formData.get('email') as string | '';

    let screenshot_url = null;

    if (file && file.size > 0) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('reports')
            .upload(filePath, file);

        if (uploadError) {
            console.error('Error uploading screenshot:', uploadError);
        } else {
            const { data: { publicUrl } } = supabase.storage
                .from('reports')
                .getPublicUrl(filePath);
            screenshot_url = publicUrl;
        }
    }

    // Get current user if any
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('feedback_reports')
        .insert([
            {
                user_id: user?.id || null,
                type,
                description,
                screenshot_url,
                metadata: {
                    user_email: userEmail || user?.email,
                    user_agent: formData.get('user_agent'),
                    url: formData.get('url'),
                    platform: 'web'
                }
            }
        ]);

    if (error) {
        console.error('Error submitting feedback:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/reports');

    // Notify Admins
    const { sendAdminNotification } = await import('@/lib/notifications.server');
    await sendAdminNotification({
        type: 'bug_report',
        userName: userEmail || 'Anônimo',
        content: description,
        url: formData.get('url') as string
    });

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
