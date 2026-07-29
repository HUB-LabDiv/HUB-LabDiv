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
import { z } from 'zod';

// ============================================================
// Schema Validation
// ============================================================

const SendNotificationSchema = z.object({
    title: z.string().min(1, 'Título obrigatório').max(200),
    message: z.string().min(1, 'Mensagem obrigatória').max(1000),
    link: z.string().optional(),
    targetType: z.enum(['broadcast', 'user', 'group', 'automatic']),
    targetValue: z.string().optional(),
    scheduledAt: z.string().optional(), // ISO date string
});

// ============================================================
// Get Target User IDs
// ============================================================

async function getTargetUsers(
    supabase: any,
    targetType: string,
    targetValue?: string,
): Promise<{id: string, push_token: string | null}[]> {
    let query = supabase.from('profiles').select('id, push_token');

    if (targetType === 'user' && targetValue) {
        query = query.eq('id', targetValue);
    } else if (targetType === 'group' && targetValue) {
        query = query.eq('user_category', targetValue);
    }
    // 'broadcast' = all users, no filter

    const { data, error } = await query;
    if (error) throw new Error(`Erro ao buscar usuários: ${error.message}`);
    return data || [];
}

// ============================================================
// Send Notification
// ============================================================

export async function sendAdminNotificationAction(formData: z.infer<typeof SendNotificationSchema>) {
    const parsed = SendNotificationSchema.safeParse(formData);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Dados inválidos' };
    }

    const { title, message, link, targetType, targetValue, scheduledAt } = parsed.data;

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Não autenticado' };

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || !['admin', 'moderator'].includes(profile.role)) {
        return { success: false, error: 'Permissão negada' };
    }

    // If scheduled, just save and return
    if (scheduledAt) {
        const { error } = await supabase.from('admin_notifications').insert({
            sender_id: user.id,
            title,
            message,
            link: link || null,
            target_type: targetType,
            target_value: targetValue || null,
            scheduled_at: scheduledAt,
            status: 'scheduled',
        });

        if (error) return { success: false, error: error.message };
        revalidatePath('/admin/notificacoes');
        return { success: true, scheduled: true };
    }

    // Immediate send
    try {
        const targetUsers = await getTargetUsers(supabase, targetType, targetValue);

        if (targetUsers.length === 0) {
            return { success: false, error: 'Nenhum usuário encontrado para o destino selecionado' };
        }

        // Insert individual notifications for each user
        const notificationRows = targetUsers.map((user: any) => ({
            user_id: user.id,
            type: 'admin',
            title,
            message,
            link: link || null,
        }));

        // Batch insert in chunks of 500
        const CHUNK_SIZE = 500;
        for (let i = 0; i < notificationRows.length; i += CHUNK_SIZE) {
            const chunk = notificationRows.slice(i, i + CHUNK_SIZE);
            const { error } = await supabase.from('notifications').insert(chunk);
            if (error) throw new Error(error.message);
        }

        // Record in admin_notifications
        await supabase.from('admin_notifications').insert({
            sender_id: user.id,
            title,
            message,
            link: link || null,
            target_type: targetType,
            target_value: targetValue || null,
            recipients_count: targetUsers.length,
            sent_at: new Date().toISOString(),
            status: 'sent',
        });

        // Send Push Notifications async in background
        const pushTokens = targetUsers
            .filter((u: any) => !!u.push_token)
            .map((u: any) => u.push_token);

        if (pushTokens.length > 0) {
            // Promise.all in batches of 50 to avoid overloading the edge function concurrently
            (async () => {
                for (let i = 0; i < pushTokens.length; i += 50) {
                    const batchTokens = pushTokens.slice(i, i + 50);
                    await Promise.allSettled(batchTokens.map((token: string) => 
                        supabase.functions.invoke('send-push-notification', {
                            body: { title, body: message, user_token: token }
                        })
                    ));
                }
            })();
        }

        revalidatePath('/admin/notificacoes');
        return { success: true, count: targetUsers.length };
    } catch (err: any) {
        return { success: false, error: err.message };
    }
}

// ============================================================
// Fetch History
// ============================================================

export async function fetchAdminNotificationHistory() {
    const supabase = await createServerSupabase();

    const { data, error } = await supabase
        .from('admin_notifications')
        .select('*, sender:profiles!sender_id(full_name, username)')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) return [];
    return data || [];
}

// ============================================================
// Search Users (for autocomplete)
// ============================================================

export async function searchUsersForNotification(query: string) {
    const cleanQuery = query.trim();
    if (!cleanQuery) return [];

    const supabase = await createServerSupabase();

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, user_category')
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(10);

    if (error) return [];
    return data || [];
}

// ============================================================
// Process Scheduled Notifications (cron-callable)
// ============================================================

export async function processScheduledNotifications() {
    const supabase = await createServerSupabase();

    const { data: pending } = await supabase
        .from('admin_notifications')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', new Date().toISOString());

    if (!pending || pending.length === 0) return { processed: 0 };

    let processed = 0;

    for (const notif of pending) {
        try {
            const targetUsers = await getTargetUsers(supabase, notif.target_type, notif.target_value);

            const rows = targetUsers.map((u: any) => ({
                user_id: u.id,
                type: 'admin',
                title: notif.title,
                message: notif.message,
                link: notif.link,
            }));

            const CHUNK_SIZE = 500;
            for (let i = 0; i < rows.length; i += CHUNK_SIZE) {
                await supabase.from('notifications').insert(rows.slice(i, i + CHUNK_SIZE));
            }

            await supabase.from('admin_notifications')
                .update({ status: 'sent', sent_at: new Date().toISOString(), recipients_count: targetUsers.length })
                .eq('id', notif.id);

            // Send Push Notifications async in background
            const pushTokens = targetUsers
                .filter((u: any) => !!u.push_token)
                .map((u: any) => u.push_token);

            if (pushTokens.length > 0) {
                for (let i = 0; i < pushTokens.length; i += 50) {
                    const batchTokens = pushTokens.slice(i, i + 50);
                    await Promise.allSettled(batchTokens.map((token: string) => 
                        supabase.functions.invoke('send-push-notification', {
                            body: { title: notif.title, body: notif.message, user_token: token }
                        })
                    ));
                }
            }

            processed++;
        } catch (err) {
            console.error('Failed to process scheduled notification:', notif.id, err);
        }
    }

    return { processed };
}
