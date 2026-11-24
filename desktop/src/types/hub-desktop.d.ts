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

export type DesktopUpdateChannel =
  | 'electron-updater'
  | 'apt'
  | 'microsoft-store'
  | 'manual-github';

export interface HubDesktopAppInfo {
  version: string;
  platform: string;
  arch: string;
  isPackaged: boolean;
  isWindowsStore: boolean;
  isMacSigned: boolean;
  updateChannel: DesktopUpdateChannel;
}

export interface HubDesktopPreferences {
  closeToTray: boolean;
  eyeRestAutoOverlay: boolean;
  storageOptIn: boolean;
}

export interface DesktopAcademicEventItem {
  id: string;
  title: string;
  type: 'aula' | 'estudo' | 'prova' | 'lembrete' | 'outro';
  startTimeIso: string;
  reminderMinutes: number;
  description?: string;
  route?: string;
}

export interface DesktopNotificationPrefs {
  enableNotifications: boolean;
  notifyClasses: boolean;
  notifyExams: boolean;
  notifyReminders: boolean;
}

export interface DesktopAcademicSyncPayload {
  events: DesktopAcademicEventItem[];
  prefs: DesktopNotificationPrefs;
}

export interface DesktopAlarmConfigItem {
  id: string;
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  intervalMinutes: number;
  fixedTimes?: string[];
  todayCheckedTimes?: string[];
  nextTriggerTimestamp?: number;
}

export interface DesktopSelfCareSyncPayload {
  configs: DesktopAlarmConfigItem[];
  hyperfocusUntil: number | null;
  eyeRestAutoOverlay: boolean;
}

export interface OAuthLoopbackCallbackPayload {
  code?: string;
  error?: string;
  errorDescription?: string;
  rawQuery: string;
}

export interface DesktopTransferItemDto {
  id: string;
  direction: 'upload' | 'download';
  state: 'queued' | 'running' | 'finalizing' | 'paused' | 'completed' | 'failed' | 'cancelled';
  scopeKey: string;
  remoteServerUrl: string;
  lanServerUrl?: string;
  relativePath: string;
  localPath: string;
  filename: string;
  totalBytes: number;
  loadedBytes: number;
  progressPercent: number;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface DesktopMirrorFolderDto {
  id: string;
  localDir: string;
  remoteFolder: string;
  scopeKey: string;
  remoteServerUrl: string;
  lanServerUrl?: string;
  status: 'idle' | 'syncing' | 'paused_missing_root' | 'pin_locked' | 'error';
  lastSyncAt?: number;
  lastError?: string;
}

export interface HubDesktopBridge {
  getAppInfo: () => Promise<HubDesktopAppInfo>;
  getPreferences: () => Promise<HubDesktopPreferences>;
  setPreferences: (partial: Partial<HubDesktopPreferences>) => Promise<HubDesktopPreferences>;
  checkForUpdates: () => Promise<{ supported: boolean; channel: DesktopUpdateChannel; releasePageUrl?: string }>;
  setActiveSession: (input: { userId: string | null }) => Promise<{ activeUserId: string | null }>;
  beginOAuthLoopback: () => Promise<{ callbackUrl: string }>;
  cancelOAuthLoopback: () => Promise<{ ok: boolean }>;
  openExternalUrl: (url: string) => Promise<{ ok: boolean }>;
  showNotification: (input: { title: string; body: string; route?: string }) => Promise<{ ok: boolean }>;
  probeLan: (url: string) => Promise<{ reachable: boolean; latencyMs?: number; status?: number }>;
  getCredentialStatus: () => Promise<{ secureAvailable: boolean; backend: string; reason?: string }>;
  saveCredential: (input: { scopeKey: string; tokenId: string; secret: string }) => Promise<{ ok: boolean }>;
  clearCredential: (scopeKey: string) => Promise<{ ok: boolean }>;
  selectUploadFiles: () => Promise<string[]>;
  selectMirrorFolder: (input: {
    remoteFolder: string;
    scopeKey: string;
    remoteServerUrl: string;
    lanServerUrl?: string;
  }) => Promise<DesktopMirrorFolderDto | null>;
  listMirrorFolders: () => Promise<DesktopMirrorFolderDto[]>;
  removeMirrorFolder: (id: string) => Promise<{ ok: boolean }>;
  triggerMirrorSync: (id: string) => Promise<{ ok: boolean; status: string; actionsCount: number; error?: string }>;
  enqueueUpload: (input: {
    id?: string;
    credentialScopeKey?: string;
    remoteServerUrl: string;
    lanServerUrl?: string;
    relativePath: string;
    localPath: string;
    overwrite?: boolean;
  }) => Promise<{ ok: boolean }>;
  enqueueDownload: (input: {
    id?: string;
    credentialScopeKey?: string;
    remoteServerUrl: string;
    lanServerUrl?: string;
    relativePath: string;
    localPath: string;
    sizeBytes?: number;
  }) => Promise<{ ok: boolean }>;
  pauseTransfer: (id: string) => Promise<{ ok: boolean }>;
  resumeTransfer: (id: string) => Promise<{ ok: boolean }>;
  cancelTransfer: (id: string) => Promise<{ ok: boolean }>;
  listTransfers: () => Promise<DesktopTransferItemDto[]>;
  syncAcademicEvents: (payload: DesktopAcademicSyncPayload) => Promise<{ ok: boolean; count: number }>;
  syncSelfCareAlarms: (payload: DesktopSelfCareSyncPayload) => Promise<{ ok: boolean }>;
  onOAuthCallback: (cb: (payload: OAuthLoopbackCallbackPayload) => void) => () => void;
  onDeepLink: (cb: (url: string) => void) => () => void;
  onNavigate: (cb: (route: string) => void) => () => void;
  onQuickWater: (cb: () => void) => () => void;
  onTriggerEyeRest: (cb: () => void) => () => void;
  onToggleHyperfocus: (cb: () => void) => () => void;
}
