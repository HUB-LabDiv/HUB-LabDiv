'use server';

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
