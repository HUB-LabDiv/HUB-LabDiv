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


/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Licença AGPLv3
 */

import { createServerSupabase } from '@/lib/supabase/server';
import webpush from 'web-push';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails('mailto:hublabdiv@gmail.com', publicVapidKey, privateVapidKey);
}

export async function subscribeToWebPush(subscription: any) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { endpoint, keys } = subscription;

    const { error } = await supabase
        .from('web_push_subscriptions')
        .upsert(
            {
                user_id: user.id,
                endpoint: endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth
            },
            { onConflict: 'user_id, endpoint' }
        );

    if (error) {
        console.error('Error saving subscription:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function unsubscribeFromWebPush(endpoint: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { error } = await supabase
        .from('web_push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('endpoint', endpoint);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}

export interface NotificationPreferences {
    notify_classes: boolean;
    notify_exams: boolean;
    notify_reminders: boolean;
    notify_tips: boolean;
    notify_follows_posts: boolean;
    notify_dms: boolean;
}

export async function getNotificationPreferences() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { data, error } = await supabase
        .from('profiles')
        .select('notify_classes, notify_exams, notify_reminders, notify_tips, notify_follows_posts, notify_dms')
        .eq('id', user.id)
        .single();

    if (error) {
        return {
            success: true,
            data: {
                notify_classes: true,
                notify_exams: true,
                notify_reminders: true,
                notify_tips: true,
                notify_follows_posts: true,
                notify_dms: true
            }
        };
    }

    return {
        success: true,
        data: {
            notify_classes: data?.notify_classes ?? true,
            notify_exams: data?.notify_exams ?? true,
            notify_reminders: data?.notify_reminders ?? true,
            notify_tips: data?.notify_tips ?? true,
            notify_follows_posts: data?.notify_follows_posts ?? true,
            notify_dms: data?.notify_dms ?? true
        }
    };
}

export async function updateNotificationPreferences(preferences: Partial<NotificationPreferences>) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { error } = await supabase
        .from('profiles')
        .update(preferences)
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
