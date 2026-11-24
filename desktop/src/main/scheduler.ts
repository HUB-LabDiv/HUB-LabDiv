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

import type {
  DesktopAcademicEventItem,
  DesktopAcademicSyncPayload,
  DesktopAlarmConfigItem,
  DesktopNotificationPrefs,
  DesktopSelfCareSyncPayload,
} from '../types/hub-desktop';

export interface DesktopNotificationEvent {
  tag: string;
  title: string;
  body: string;
  kind: 'academic' | 'self_care' | 'eye_rest_20_20_20';
  route?: string;
  autoOpenOverlay?: boolean;
}

const DEFAULT_PREFS: DesktopNotificationPrefs = {
  enableNotifications: true,
  notifyClasses: true,
  notifyExams: true,
  notifyReminders: true,
};

export class DesktopScheduler {
  private activeUserId: string | null = null;
  private academicEvents: DesktopAcademicEventItem[] = [];
  private academicPrefs: DesktopNotificationPrefs = { ...DEFAULT_PREFS };
  private alarmConfigs: DesktopAlarmConfigItem[] = [];
  private hyperfocusUntil: number | null = null;
  private eyeRestAutoOverlay = false;
  private notifiedKeys = new Set<string>();
  private timer: NodeJS.Timeout | null = null;
  private readonly onNotify: (evt: DesktopNotificationEvent) => void;

  constructor(onNotify: (evt: DesktopNotificationEvent) => void) {
    this.onNotify = onNotify;
  }

  setActiveUser(userId: string | null): void {
    if (this.activeUserId !== userId) {
      this.clearAll();
      this.activeUserId = userId;
    }
  }

  isActive(): boolean {
    return Boolean(this.activeUserId);
  }

  setEyeRestAutoOverlay(enabled: boolean): void {
    this.eyeRestAutoOverlay = Boolean(enabled);
  }

  getEyeRestAutoOverlay(): boolean {
    return this.eyeRestAutoOverlay;
  }

  syncAcademicEvents(payload: DesktopAcademicSyncPayload): void {
    if (!this.activeUserId) return;
    this.academicEvents = Array.isArray(payload?.events) ? payload.events.slice(0, 200) : [];
    if (payload?.prefs) {
      this.academicPrefs = {
        enableNotifications: Boolean(payload.prefs.enableNotifications),
        notifyClasses: Boolean(payload.prefs.notifyClasses),
        notifyExams: Boolean(payload.prefs.notifyExams),
        notifyReminders: Boolean(payload.prefs.notifyReminders),
      };
    }
  }

  syncSelfCare(payload: DesktopSelfCareSyncPayload): void {
    if (!this.activeUserId) return;
    if (Array.isArray(payload?.configs)) {
      this.alarmConfigs = payload.configs;
    }
    this.hyperfocusUntil = payload?.hyperfocusUntil ?? null;
    if (typeof payload?.eyeRestAutoOverlay === 'boolean') {
      this.eyeRestAutoOverlay = payload.eyeRestAutoOverlay;
    }
  }

  clearAll(): void {
    this.academicEvents = [];
    this.academicPrefs = { ...DEFAULT_PREFS };
    this.alarmConfigs = [];
    this.hyperfocusUntil = null;
    this.notifiedKeys.clear();
  }

  handleSystemWake(now = Date.now()): void {
    if (!this.activeUserId) return;
    for (const cfg of this.alarmConfigs) {
      if (!cfg.enabled || !cfg.nextTriggerTimestamp) continue;
      const intervalMs = Math.max(1, Number(cfg.intervalMinutes) || 20) * 60 * 1000;
      if (now - cfg.nextTriggerTimestamp > intervalMs) {
        cfg.nextTriggerTimestamp = now + intervalMs;
      }
    }
  }

  private isAcademicCategoryAllowed(type: DesktopAcademicEventItem['type']): boolean {
    if (!this.academicPrefs.enableNotifications) return false;
    if (type === 'aula' || type === 'estudo') return this.academicPrefs.notifyClasses;
    if (type === 'prova') return this.academicPrefs.notifyExams;
    return this.academicPrefs.notifyReminders;
  }

  tick(now = Date.now()): DesktopNotificationEvent[] {
    if (!this.activeUserId) return [];

    const fired: DesktopNotificationEvent[] = [];
    const hyperfocusActive = this.hyperfocusUntil !== null && this.hyperfocusUntil > now;
    const d = new Date(now);
    const hhmm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const dayKey = d.toISOString().slice(0, 10);

    // 1. Eventos acadêmicos reais (user_calendar_events)
    for (const ev of this.academicEvents) {
      if (!this.isAcademicCategoryAllowed(ev.type)) continue;
      const startMs = Date.parse(ev.startTimeIso);
      if (!Number.isFinite(startMs)) continue;
      const reminderMs = Math.max(1, Number(ev.reminderMinutes) || 60) * 60 * 1000;
      const triggerMs = startMs - reminderMs;

      if (now >= triggerMs && now <= startMs) {
        const dedupKey = `acad:${this.activeUserId}:${ev.id}:${ev.startTimeIso}`;
        if (this.notifiedKeys.has(dedupKey)) continue;
        this.notifiedKeys.add(dedupKey);

        const label =
          ev.type === 'prova'
            ? 'Prova em breve'
            : ev.type === 'aula' || ev.type === 'estudo'
              ? 'Aula / Estudo agendado'
              : 'Lembrete do HUB LabDiv';
        const evt: DesktopNotificationEvent = {
          tag: `acad-${ev.id}`,
          title: `${label}: ${ev.title}`,
          body: ev.description || 'Abra o HUB LabDiv para conferir os detalhes na sua agenda.',
          kind: 'academic',
          route: ev.route || '/ferramentas',
        };
        fired.push(evt);
        this.onNotify(evt);
      }
    }

    // 2. Autocuidado nos estudos (20-20-20, água, etc.)
    for (const cfg of this.alarmConfigs) {
      if (!cfg.enabled) continue;
      if (hyperfocusActive && cfg.key !== 'medication' && cfg.key !== 'nutrition_meals') continue;

      let due = Boolean(cfg.nextTriggerTimestamp && cfg.nextTriggerTimestamp <= now);
      if (!due && Array.isArray(cfg.fixedTimes)) {
        const checked = new Set(cfg.todayCheckedTimes || []);
        for (const t of cfg.fixedTimes) {
          if (t <= hhmm && !checked.has(t)) {
            due = true;
            break;
          }
        }
      }
      if (!due) continue;

      const dedupKey = `sc:${this.activeUserId}:${cfg.id}:${dayKey}:${Math.floor(now / 60_000)}`;
      if (this.notifiedKeys.has(dedupKey)) continue;
      this.notifiedKeys.add(dedupKey);

      const isEye = cfg.key === 'eye_rest_20_20_20';
      const evt: DesktopNotificationEvent = {
        tag: cfg.id,
        title: `HUB LabDiv Estudos: ${cfg.name}`,
        body: cfg.description || 'Hora da sua pausa de autocuidado durante os estudos.',
        kind: isEye ? 'eye_rest_20_20_20' : 'self_care',
        route: '/configuracoes',
        autoOpenOverlay: isEye ? this.eyeRestAutoOverlay : false,
      };
      fired.push(evt);
      this.onNotify(evt);
    }

    return fired;
  }

  start(intervalMs = 15_000): void {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), intervalMs);
    this.timer.unref?.();
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
