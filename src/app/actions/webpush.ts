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
import webpush from 'web-push';
import { z } from 'zod';

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails('mailto:hublabdiv@gmail.com', publicVapidKey, privateVapidKey);
}

const WebPushSubscriptionSchema = z.object({
    endpoint: z.string().url(),
    keys: z.object({
        p256dh: z.string().min(1),
        auth: z.string().min(1)
    })
});

const EndpointSchema = z.string().url();

const PreferencesSchema = z.object({
    notify_classes: z.boolean().optional(),
    notify_exams: z.boolean().optional(),
    notify_reminders: z.boolean().optional(),
    notify_tips: z.boolean().optional(),
    notify_follows_posts: z.boolean().optional(),
    notify_dms: z.boolean().optional(),
});

export async function subscribeToWebPush(subscription: any) {
    const parse = WebPushSubscriptionSchema.safeParse(subscription);
    if (!parse.success) {
        return { success: false, error: 'Inscrição de push inválida' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { endpoint, keys } = parse.data;

    const { error } = await supabase
        .from('web_push_subscriptions')
        .upsert(
            {
                user_id: user.id,
                endpoint: endpoint,
                p256dh: keys.p256dh,
                auth: keys.auth
            },
            { onConflict: 'user_id,endpoint' }
        );

    if (error) {
        console.error('Error saving subscription:', error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

export async function unsubscribeFromWebPush(endpoint: string) {
    const parse = EndpointSchema.safeParse(endpoint);
    if (!parse.success) {
        return { success: false, error: 'Endpoint inválido' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { error } = await supabase
        .from('web_push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('endpoint', parse.data);

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
    const parse = PreferencesSchema.safeParse(preferences);
    if (!parse.success) {
        return { success: false, error: 'Preferências inválidas' };
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { error } = await supabase
        .from('profiles')
        .update(parse.data)
        .eq('id', user.id);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true };
}
