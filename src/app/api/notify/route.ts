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

import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/notifications.server';
import { createServerSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const NotificationTypeEnum = z.enum([
    'submission',
    'question',
    'comment',
    'profile_update',
    'profile_creation',
    'bug_report',
    'arena_suggestion',
    'hub_improvement',
    'drop_submission',
    'thread_reply',
    'jupiter_sync_error',
    'beta_registration'
]);

const NotifyBodySchema = z.object({
    type: NotificationTypeEnum.default('submission'),
    title: z.string().max(300).optional(),
    message: z.string().max(3000).optional(),
    content: z.string().max(3000).optional(),
    userName: z.string().max(150).optional(),
    userEmail: z.string().email().optional(),
    submissionTitle: z.string().max(300).optional(),
    submissionId: z.string().max(100).optional(),
}).passthrough();

export async function POST(request: Request) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ success: false, error: 'Autenticação necessária para disparar notificações' }, { status: 401 });
        }

        const rawBody = await request.json();
        const parseResult = NotifyBodySchema.safeParse(rawBody);

        if (!parseResult.success) {
            return NextResponse.json({ success: false, error: 'Dados de notificação inválidos' }, { status: 400 });
        }

        const { type, ...rest } = parseResult.data;

        const response = await sendAdminNotification({
            type,
            ...rest,
            targetEmail: user.email || parseResult.data.userEmail
        } as any);

        return NextResponse.json(response);
    } catch (error: any) {
        console.error("Notification API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
