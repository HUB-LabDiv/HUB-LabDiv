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

// Preload estritamente autocontido (compatível com sandbox: true — sem imports runtime locais)
import { contextBridge, ipcRenderer } from 'electron';
import type {
  DesktopAcademicSyncPayload,
  DesktopSelfCareSyncPayload,
  HubDesktopBridge,
  HubDesktopPreferences,
  OAuthLoopbackCallbackPayload,
} from '../types/hub-desktop';

const bridge: HubDesktopBridge = {
  getAppInfo: () => ipcRenderer.invoke('hub:getAppInfo'),
  getPreferences: () => ipcRenderer.invoke('hub:getPreferences'),
  setPreferences: (partial: Partial<HubDesktopPreferences>) =>
    ipcRenderer.invoke('hub:setPreferences', partial),
  checkForUpdates: () => ipcRenderer.invoke('hub:checkForUpdates'),
  setActiveSession: (input: { userId: string | null }) =>
    ipcRenderer.invoke('hub:setActiveSession', input),
  beginOAuthLoopback: () => ipcRenderer.invoke('hub:beginOAuthLoopback'),
  cancelOAuthLoopback: () => ipcRenderer.invoke('hub:cancelOAuthLoopback'),
  openExternalUrl: (url: string) => ipcRenderer.invoke('hub:openExternalUrl', url),
  showNotification: (input: { title: string; body: string; route?: string }) =>
    ipcRenderer.invoke('hub:showNotification', input),
  probeLan: (url: string) => ipcRenderer.invoke('hub:probeLan', url),
  getCredentialStatus: () => ipcRenderer.invoke('hub:getCredentialStatus'),
  saveCredential: (input: { scopeKey: string; tokenId: string; secret: string }) =>
    ipcRenderer.invoke('hub:saveCredential', input),
  clearCredential: (scopeKey: string) => ipcRenderer.invoke('hub:clearCredential', scopeKey),
  selectUploadFiles: () => ipcRenderer.invoke('hub:selectUploadFiles'),
  selectMirrorFolder: (input) => ipcRenderer.invoke('hub:selectMirrorFolder', input),
  listMirrorFolders: () => ipcRenderer.invoke('hub:listMirrorFolders'),
  removeMirrorFolder: (id: string) => ipcRenderer.invoke('hub:removeMirrorFolder', id),
  triggerMirrorSync: (id: string) => ipcRenderer.invoke('hub:triggerMirrorSync', id),
  enqueueUpload: (input) => ipcRenderer.invoke('hub:enqueueUpload', input),
  enqueueDownload: (input) => ipcRenderer.invoke('hub:enqueueDownload', input),
  pauseTransfer: (id: string) => ipcRenderer.invoke('hub:pauseTransfer', id),
  resumeTransfer: (id: string) => ipcRenderer.invoke('hub:resumeTransfer', id),
  cancelTransfer: (id: string) => ipcRenderer.invoke('hub:cancelTransfer', id),
  listTransfers: () => ipcRenderer.invoke('hub:listTransfers'),
  syncAcademicEvents: (payload: DesktopAcademicSyncPayload) =>
    ipcRenderer.invoke('hub:syncAcademicEvents', payload),
  syncSelfCareAlarms: (payload: DesktopSelfCareSyncPayload) =>
    ipcRenderer.invoke('hub:syncSelfCareAlarms', payload),
  onOAuthCallback: (cb: (payload: OAuthLoopbackCallbackPayload) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, payload: OAuthLoopbackCallbackPayload) => cb(payload);
    ipcRenderer.on('hub:oauth-callback', handler);
    return () => ipcRenderer.removeListener('hub:oauth-callback', handler);
  },
  onDeepLink: (cb: (url: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, url: string) => cb(url);
    ipcRenderer.on('hub:deep-link', handler);
    return () => ipcRenderer.removeListener('hub:deep-link', handler);
  },
  onNavigate: (cb: (route: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, route: string) => cb(route);
    ipcRenderer.on('hub:navigate', handler);
    return () => ipcRenderer.removeListener('hub:navigate', handler);
  },
  onQuickWater: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('hub:quick-water', handler);
    return () => ipcRenderer.removeListener('hub:quick-water', handler);
  },
  onTriggerEyeRest: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('hub:trigger-eye-rest', handler);
    return () => ipcRenderer.removeListener('hub:trigger-eye-rest', handler);
  },
  onToggleHyperfocus: (cb: () => void) => {
    const handler = () => cb();
    ipcRenderer.on('hub:toggle-hyperfocus', handler);
    return () => ipcRenderer.removeListener('hub:toggle-hyperfocus', handler);
  },
};

contextBridge.exposeInMainWorld('hubDesktop', bridge);
