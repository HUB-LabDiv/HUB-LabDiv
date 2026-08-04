import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import webpush from 'web-push';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Licença AGPLv3
 */

const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

if (publicVapidKey && privateVapidKey) {
    webpush.setVapidDetails('mailto:hublabdiv@gmail.com', publicVapidKey, privateVapidKey);
}

export async function GET(request: Request) {
    // Basic authorization for cron (you can configure a secret in vercel.json)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const supabase = await createServerSupabase();

    try {
        // Find events that start within their reminder_minutes and haven't been notified yet
        // In a real scenario, we'd calculate: (start_time - reminder_minutes) <= NOW()
        // Since Supabase RPC or direct query with interval calculation is tricky here,
        // we will fetch all un-notified events that start in the future and filter in JS for simplicity,
        // OR better yet, let's fetch events happening in the next 7 days that are not notified.
        
        const now = new Date();
        const maxFuture = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const { data: events, error: eventsError } = await supabase
            .from('user_calendar_events')
            .select('id, user_id, title, start_time, reminder_minutes, description')
            .eq('is_notified', false)
            .gte('start_time', now.toISOString())
            .lte('start_time', maxFuture);

        if (eventsError) throw eventsError;

        let notificationsSent = 0;

        for (const event of events) {
            const startTime = new Date(event.start_time);
            const reminderMinutes = event.reminder_minutes || 1440;
            const triggerTime = new Date(startTime.getTime() - reminderMinutes * 60 * 1000);

            // If it's time to trigger (or past the trigger time but before the event)
            if (now >= triggerTime && now <= startTime) {
                // Fetch user's subscriptions
                const { data: subscriptions, error: subError } = await supabase
                    .from('web_push_subscriptions')
                    .select('*')
                    .eq('user_id', event.user_id);

                if (!subError && subscriptions && subscriptions.length > 0) {
                    const payload = JSON.stringify({
                        title: `Lembrete: ${event.title}`,
                        body: event.description || `O evento começa em breve.`,
                        icon: '/icon.png'
                    });

                    for (const sub of subscriptions) {
                        try {
                            const pushSubscription = {
                                endpoint: sub.endpoint,
                                keys: {
                                    p256dh: sub.p256dh,
                                    auth: sub.auth
                                }
                            };
                            await webpush.sendNotification(pushSubscription, payload);
                            notificationsSent++;
                        } catch (pushErr: any) {
                            if (pushErr.statusCode === 404 || pushErr.statusCode === 410) {
                                // Subscription has expired or is no longer valid
                                await supabase.from('web_push_subscriptions').delete().eq('id', sub.id);
                            } else {
                                console.error('Error sending push:', pushErr);
                            }
                        }
                    }

                    // Mark as notified
                    await supabase
                        .from('user_calendar_events')
                        .update({ is_notified: true })
                        .eq('id', event.id);
                }
            }
        }

        return NextResponse.json({ success: true, sent: notificationsSent });

    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
