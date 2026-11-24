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

import { Notification, app, dialog, ipcMain, shell } from 'electron';
import type { BrowserWindow } from 'electron';
import type {
  DesktopAcademicSyncPayload,
  DesktopSelfCareSyncPayload,
  HubDesktopPreferences,
} from '../types/hub-desktop';
import type { DesktopCredentialStore } from './credentials';
import type { OAuthLoopbackServer } from './oauth-loopback';
import type { DesktopScheduler } from './scheduler';
import {
  AuthorizedPathsRegistry,
  assertTrustedMainFrameIpcSender,
  isAllowedLanOrigin,
  isSafeExternalUrl,
} from './security';
import type { DesktopSessionScopeManager } from './session-scope';
import type { SyncMirrorCoordinator } from './sync-mirror';
import type { DesktopTransferEngine } from './transfer-engine';
import type { DesktopUpdater } from './updater';

export function registerDesktopIpcHandlers(deps: {
  isPackaged: boolean;
  isWindowsStore: boolean;
  getMainWindow: () => BrowserWindow | null;
  authorizedPaths: AuthorizedPathsRegistry;
  credentials: DesktopCredentialStore;
  transfers: DesktopTransferEngine;
  syncMirror: SyncMirrorCoordinator;
  scheduler: DesktopScheduler;
  sessionScope: DesktopSessionScopeManager;
  oauthLoopback: OAuthLoopbackServer;
  updater: DesktopUpdater;
  onTrayRefresh: () => void;
  onNavigateRoute: (route: string) => void;
}): void {
  const secOpts = { isPackaged: deps.isPackaged, allowDev: !deps.isPackaged };
  const guard = (event: Electron.IpcMainInvokeEvent) =>
    assertTrustedMainFrameIpcSender(event, deps.getMainWindow(), secOpts);

  ipcMain.handle('hub:getAppInfo', async (event) => {
    guard(event);
    return {
      version: app.getVersion(),
      platform: process.platform,
      arch: process.arch,
      isPackaged: deps.isPackaged,
      isWindowsStore: deps.isWindowsStore,
      isMacSigned: deps.updater.isMacSignedBuild(),
      updateChannel: deps.updater.getChannel(),
    };
  });

  ipcMain.handle('hub:getPreferences', async (event) => {
    guard(event);
    return deps.sessionScope.getPreferences();
  });

  ipcMain.handle(
    'hub:setPreferences',
    async (event, partial: Partial<HubDesktopPreferences>) => {
      guard(event);
      return deps.sessionScope.setPreferences(partial || {});
    }
  );

  ipcMain.handle('hub:checkForUpdates', async (event) => {
    guard(event);
    return deps.updater.checkNow();
  });

  ipcMain.handle(
    'hub:setActiveSession',
    async (event, input: { userId?: string | null }) => {
      guard(event);
      const res = await deps.sessionScope.switchSession(input?.userId ?? null);
      deps.onTrayRefresh();
      return res;
    }
  );

  ipcMain.handle('hub:beginOAuthLoopback', async (event) => {
    guard(event);
    return deps.oauthLoopback.start((payload) => {
      const win = deps.getMainWindow();
      if (win && !win.isDestroyed()) {
        if (win.isMinimized()) win.restore();
        win.show();
        win.focus();
        win.webContents.send('hub:oauth-callback', payload);
      }
    });
  });

  ipcMain.handle('hub:cancelOAuthLoopback', async (event) => {
    guard(event);
    await deps.oauthLoopback.stop();
    return { ok: true };
  });

  ipcMain.handle('hub:openExternalUrl', async (event, url: string) => {
    guard(event);
    if (!isSafeExternalUrl(url)) {
      throw new Error('URL externa bloqueada pela política de segurança.');
    }
    await shell.openExternal(url);
    return { ok: true };
  });

  ipcMain.handle(
    'hub:showNotification',
    async (event, input: { title?: string; body?: string; route?: string }) => {
      guard(event);
      const title = String(input?.title || 'HUB LabDiv').slice(0, 120);
      const body = String(input?.body || '').slice(0, 280);
      const route =
        typeof input?.route === 'string' && input.route.startsWith('/')
          ? input.route.slice(0, 200)
          : undefined;
      if (Notification.isSupported()) {
        const n = new Notification({ title, body });
        n.on('click', () => {
          const win = deps.getMainWindow();
          if (win) {
            win.show();
            win.focus();
          }
          if (route) deps.onNavigateRoute(route);
        });
        n.show();
      }
      return { ok: true };
    }
  );

  ipcMain.handle('hub:probeLan', async (event, url: string) => {
    guard(event);
    if (!isAllowedLanOrigin(url)) return { reachable: false };
    return deps.transfers.probeLan(url);
  });

  ipcMain.handle('hub:getCredentialStatus', async (event) => {
    guard(event);
    return deps.credentials.getSecurityStatus();
  });

  ipcMain.handle(
    'hub:saveCredential',
    async (event, input: { scopeKey: string; tokenId: string; secret: string }) => {
      guard(event);
      await deps.credentials.saveCredential(input.scopeKey, input.tokenId, input.secret);
      return { ok: true };
    }
  );

  ipcMain.handle('hub:clearCredential', async (event, scopeKey: string) => {
    guard(event);
    await deps.credentials.clearCredential(scopeKey);
    return { ok: true };
  });

  ipcMain.handle('hub:selectUploadFiles', async (event) => {
    guard(event);
    if (!deps.sessionScope.getActiveUserId()) {
      throw new Error('Faça login no HUB LabDiv para selecionar arquivos.');
    }
    const win = deps.getMainWindow();
    const openOpts: Electron.OpenDialogOptions = {
      title: 'Selecionar arquivos para envio',
      properties: ['openFile', 'multiSelections'],
    };
    const res = win ? await dialog.showOpenDialog(win, openOpts) : await dialog.showOpenDialog(openOpts);
    if (res.canceled) return [];
    for (const f of res.filePaths) {
      deps.authorizedPaths.addAuthorizedFile(f);
    }
    return res.filePaths;
  });

  ipcMain.handle(
    'hub:selectMirrorFolder',
    async (
      event,
      input: {
        remoteFolder: string;
        scopeKey: string;
        remoteServerUrl: string;
        lanServerUrl?: string;
      }
    ) => {
      guard(event);
      if (!deps.sessionScope.getActiveUserId()) {
        throw new Error('Faça login no HUB LabDiv para configurar pastas espelhadas.');
      }
      const win = deps.getMainWindow();
      const openOpts: Electron.OpenDialogOptions = {
        title: 'Escolher pasta local para espelhamento',
        properties: ['openDirectory', 'createDirectory'],
      };
      const res = win ? await dialog.showOpenDialog(win, openOpts) : await dialog.showOpenDialog(openOpts);
      if (res.canceled || !res.filePaths[0]) return null;
      const localDir = res.filePaths[0];
      deps.authorizedPaths.addAuthorizedDir(localDir);
      return deps.syncMirror.addFolder({
        localDir,
        remoteFolder: input.remoteFolder,
        scopeKey: input.scopeKey || 'personal',
        remoteServerUrl: input.remoteServerUrl,
        lanServerUrl: input.lanServerUrl,
      });
    }
  );

  ipcMain.handle('hub:listMirrorFolders', async (event) => {
    guard(event);
    return deps.syncMirror.listFolders();
  });

  ipcMain.handle('hub:removeMirrorFolder', async (event, id: string) => {
    guard(event);
    return { ok: await deps.syncMirror.removeFolder(id) };
  });

  ipcMain.handle('hub:triggerMirrorSync', async (event, id: string) => {
    guard(event);
    return deps.syncMirror.syncFolderOnce(id);
  });

  ipcMain.handle('hub:enqueueUpload', async (event, input) => {
    guard(event);
    const localPath = deps.authorizedPaths.assertAuthorizedPath(
      input.localPath || input.localUri,
      'upload'
    );
    await deps.transfers.enqueueUpload({
      id: input.id,
      scopeKey: input.credentialScopeKey || 'personal',
      remoteServerUrl: input.remoteServerUrl,
      lanServerUrl: input.lanServerUrl,
      relativePath: input.relativePath,
      localPath,
      overwrite: Boolean(input.overwrite),
    });
    deps.onTrayRefresh();
    return { ok: true };
  });

  ipcMain.handle('hub:enqueueDownload', async (event, input) => {
    guard(event);
    const localPath = deps.authorizedPaths.assertAuthorizedPath(input.localPath, 'download');
    await deps.transfers.enqueueDownload({
      id: input.id,
      scopeKey: input.credentialScopeKey || 'personal',
      remoteServerUrl: input.remoteServerUrl,
      lanServerUrl: input.lanServerUrl,
      relativePath: input.relativePath,
      localPath,
      sizeBytes: input.sizeBytes,
    });
    deps.onTrayRefresh();
    return { ok: true };
  });

  ipcMain.handle('hub:pauseTransfer', async (event, id: string) => {
    guard(event);
    const ok = await deps.transfers.pauseTransfer(id);
    deps.onTrayRefresh();
    return { ok };
  });

  ipcMain.handle('hub:resumeTransfer', async (event, id: string) => {
    guard(event);
    const ok = await deps.transfers.resumeTransfer(id);
    deps.onTrayRefresh();
    return { ok };
  });

  ipcMain.handle('hub:cancelTransfer', async (event, id: string) => {
    guard(event);
    const ok = await deps.transfers.cancelTransfer(id);
    deps.onTrayRefresh();
    return { ok };
  });

  ipcMain.handle('hub:listTransfers', async (event) => {
    guard(event);
    return deps.transfers.listTransfers();
  });

  ipcMain.handle(
    'hub:syncAcademicEvents',
    async (event, payload: DesktopAcademicSyncPayload) => {
      guard(event);
      deps.scheduler.syncAcademicEvents(payload);
      return { ok: true, count: Array.isArray(payload?.events) ? payload.events.length : 0 };
    }
  );

  ipcMain.handle(
    'hub:syncSelfCareAlarms',
    async (event, payload: DesktopSelfCareSyncPayload) => {
      guard(event);
      deps.scheduler.syncSelfCare(payload || { configs: [], hyperfocusUntil: null, eyeRestAutoOverlay: false });
      return { ok: true };
    }
  );
}
