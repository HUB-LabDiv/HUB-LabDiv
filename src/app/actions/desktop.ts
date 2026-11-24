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

import { z } from 'zod';
import { getLatestDesktopRelease } from '@/lib/desktop-release.server';
import { createServerSupabase } from '@/lib/supabase/server';
import type {
  DesktopAcademicEventItem,
  DesktopAcademicSyncPayload,
  DesktopReleasePayload,
} from '@/types/desktop';

const ReleaseQuerySchema = z
  .object({
    refresh: z.boolean().optional(),
  })
  .optional();

export async function getDesktopReleaseAction(
  input?: { refresh?: boolean }
): Promise<{ success: boolean; data: DesktopReleasePayload }> {
  ReleaseQuerySchema.parse(input);
  const data = await getLatestDesktopRelease();
  return { success: true, data };
}

const AcademicEventsInputSchema = z
  .object({
    daysAhead: z.number().int().min(1).max(30).optional().default(7),
  })
  .optional();

function mapEventType(rawType: string | null | undefined): DesktopAcademicEventItem['type'] {
  const low = (rawType || '').toLowerCase();
  if (low.includes('prova')) return 'prova';
  if (low.includes('aula')) return 'aula';
  if (low.includes('estudo')) return 'estudo';
  if (low.includes('custom') || low.includes('saude') || low.includes('lazer') || low.includes('trabalho')) {
    return 'lembrete';
  }
  return 'outro';
}

export async function getUpcomingAcademicEventsAction(input?: {
  daysAhead?: number;
}): Promise<{ success: boolean; data?: DesktopAcademicSyncPayload; error?: string }> {
  try {
    const parsed = AcademicEventsInputSchema.parse(input);
    const daysAhead = parsed?.daysAhead ?? 7;

    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Não autenticado.' };
    }

    const now = new Date();
    const maxFuture = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    const [{ data: events }, { data: prof }] = await Promise.all([
      supabase
        .from('user_calendar_events')
        .select('id, title, type, start_time, reminder_minutes, description')
        .eq('user_id', user.id)
        .gte('start_time', now.toISOString())
        .lte('start_time', maxFuture.toISOString())
        .order('start_time', { ascending: true })
        .limit(100),
      supabase
        .from('profiles')
        .select('enable_push_notifications, notify_classes, notify_exams, notify_reminders')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    const mappedEvents: DesktopAcademicEventItem[] = (events || []).map((ev) => ({
      id: String(ev.id),
      title: String(ev.title || 'Evento acadêmico'),
      type: mapEventType(ev.type),
      startTimeIso: String(ev.start_time),
      reminderMinutes: Number(ev.reminder_minutes) || 60,
      description: ev.description ? String(ev.description) : undefined,
      route: '/ferramentas',
    }));

    return {
      success: true,
      data: {
        events: mappedEvents,
        prefs: {
          enableNotifications: prof?.enable_push_notifications !== false,
          notifyClasses: prof?.notify_classes !== false,
          notifyExams: prof?.notify_exams !== false,
          notifyReminders: prof?.notify_reminders !== false,
        },
      },
    };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erro ao sincronizar agenda acadêmica.',
    };
  }
}
