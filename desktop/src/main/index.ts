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

import fs from 'node:fs';
import path from 'node:path';
import {
  BrowserWindow,
  Menu,
  Notification,
  app,
  powerMonitor,
  powerSaveBlocker,
  safeStorage,
  session,
  shell,
} from 'electron';
import { DesktopCredentialStore } from './credentials';
import { registerDesktopIpcHandlers } from './ipc';
import { OAuthLoopbackServer } from './oauth-loopback';
import { DesktopScheduler } from './scheduler';
import {
  AuthorizedPathsRegistry,
  PROD_APP_ORIGIN,
  isAllowedDeepLink,
  isAllowedMainFrameNavigationUrl,
  isSafeExternalUrl,
  isTrustedAppUrl,
} from './security';
import { DesktopSessionScopeManager } from './session-scope';
import { SyncMirrorCoordinator } from './sync-mirror';
import { DesktopTransferEngine } from './transfer-engine';
import { DesktopTrayController } from './tray';
import { DesktopUpdater } from './updater';

let mainWindow: BrowserWindow | null = null;
let powerSaveId: number | null = null;
let isQuitting = false;
let shutdownHook: (() => Promise<void>) | null = null;
let rendererReady = false;
const pendingDeepLinks: string[] = [];

const START_URL = process.env.HUB_DESKTOP_URL || PROD_APP_ORIGIN;
const IS_WINDOWS_STORE = Boolean((process as NodeJS.Process & { windowsStore?: boolean }).windowsStore);

const ALLOWED_PERMISSIONS = new Set(['notifications', 'clipboard-sanitized-write']);

function extractDeepLinkFromArgv(argv: string[]): string | null {
  for (const arg of argv) {
    if (isAllowedDeepLink(arg)) {
      return arg.trim();
    }
  }
  return null;
}

function dispatchDeepLink(rawUrl: string): void {
  if (!isAllowedDeepLink(rawUrl)) return;
  if (mainWindow && !mainWindow.isDestroyed()) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
    if (rendererReady) {
      mainWindow.webContents.send('hub:deep-link', rawUrl.trim());
    } else {
      pendingDeepLinks.push(rawUrl.trim());
    }
  } else {
    pendingDeepLinks.push(rawUrl.trim());
  }
}

const initialDeepLink = extractDeepLinkFromArgv(process.argv);
if (initialDeepLink) {
  pendingDeepLinks.push(initialDeepLink);
}

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    const deepLink = extractDeepLinkFromArgv(argv);
    if (deepLink) {
      dispatchDeepLink(deepLink);
    } else if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  dispatchDeepLink(url);
});

async function bootstrap(): Promise<void> {
  if (!gotSingleInstanceLock) return;

  try {
    if (process.defaultApp && process.argv.length >= 2) {
      app.setAsDefaultProtocolClient('hublabdiv', process.execPath, [path.resolve(process.argv[1])]);
    } else {
      app.setAsDefaultProtocolClient('hublabdiv');
    }
  } catch {
    // Registro de protocolo opcional (AppImage sem integração desktop ainda usa loopback RFC 8252)
  }

  if (process.platform !== 'darwin') {
    Menu.setApplicationMenu(null);
  } else {
    Menu.setApplicationMenu(
      Menu.buildFromTemplate([{ role: 'appMenu' }, { role: 'editMenu' }])
    );
  }

  const navSecOpts = { isPackaged: app.isPackaged, allowDev: !app.isPackaged };

  // Fail-closed para permissões de WebView / Renderer
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    const reqUrl = details?.requestingUrl || _webContents.getURL();
    callback(ALLOWED_PERMISSIONS.has(permission) && isTrustedAppUrl(reqUrl, navSecOpts));
  });
  session.defaultSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin) => {
    return ALLOWED_PERMISSIONS.has(permission) && isTrustedAppUrl(requestingOrigin, navSecOpts);
  });

  const userDataDir = app.getPath('userData');
  const baseAuthorizedDirs = [app.getPath('downloads')];
  const authorizedPaths = new AuthorizedPathsRegistry();
  for (const d of baseAuthorizedDirs) authorizedPaths.addAuthorizedDir(d);

  const credentials = new DesktopCredentialStore(null, {
    isAvailable: () => safeStorage.isEncryptionAvailable(),
    getBackendName: () => safeStorage.getSelectedStorageBackend?.() || 'os_native',
    encryptString: (plain) => safeStorage.encryptString(plain),
    decryptString: (cipher) => safeStorage.decryptString(cipher),
  });

  let trayCtrl: DesktopTrayController | null = null;
  const transfers = new DesktopTransferEngine({
    credentials,
    onProgress: () => trayCtrl?.refreshMenu(),
    onPowerSaveChanged: (active) => {
      if (active && powerSaveId === null) {
        powerSaveId = powerSaveBlocker.start('prevent-app-suspension');
      } else if (!active && powerSaveId !== null) {
        powerSaveBlocker.stop(powerSaveId);
        powerSaveId = null;
      }
    },
  });

  const syncMirror = new SyncMirrorCoordinator({
    credentials,
    transfers,
    onFolderRegistered: (dir) => authorizedPaths.addAuthorizedDir(dir),
    onFolderRemoved: (dir) => authorizedPaths.removeAuthorizedDir(dir),
  });

  const navigateRoute = (route: string) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.focus();
      mainWindow.webContents.send('hub:navigate', route);
    }
  };

  const scheduler = new DesktopScheduler((evt) => {
    if (evt.kind === 'eye_rest_20_20_20' && evt.autoOpenOverlay && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
      mainWindow.setAlwaysOnTop(true, 'screen-saver');
      mainWindow.webContents.send('hub:trigger-eye-rest');
      setTimeout(() => {
        if (mainWindow && !mainWindow.isDestroyed()) mainWindow.setAlwaysOnTop(false);
      }, 22_000);
      return;
    }
    if (Notification.isSupported()) {
      const n = new Notification({ title: evt.title, body: evt.body });
      n.on('click', () => {
        if (evt.route) {
          navigateRoute(evt.route);
        } else if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.show();
          mainWindow.focus();
        }
      });
      n.show();
    }
  });

  const sessionScope = new DesktopSessionScopeManager({
    userDataDir,
    baseAuthorizedDirs,
    authorizedPaths,
    credentials,
    transfers,
    syncMirror,
    scheduler,
    onChanged: () => trayCtrl?.refreshMenu(),
  });
  await sessionScope.init();
  scheduler.start();

  powerMonitor.on('resume', () => scheduler.handleSystemWake());
  powerMonitor.on('unlock-screen', () => scheduler.handleSystemWake());

  const oauthLoopback = new OAuthLoopbackServer();
  const updater = new DesktopUpdater();
  updater.start();

  shutdownHook = async () => {
    updater.stop();
    scheduler.stop();
    await oauthLoopback.stop();
    await syncMirror.stopAll();
    await transfers.deactivate();
    if (powerSaveId !== null) {
      powerSaveBlocker.stop(powerSaveId);
      powerSaveId = null;
    }
    trayCtrl?.destroy();
  };

  trayCtrl = new DesktopTrayController({
    isWindowsStore: IS_WINDOWS_STORE,
    getMainWindow: () => mainWindow,
    getTransfers: () => transfers.listTransfers(),
    onNavigateRoute: navigateRoute,
    onQuickWater: () => mainWindow?.webContents.send('hub:quick-water'),
    onQuickEyeRest: () => mainWindow?.webContents.send('hub:trigger-eye-rest'),
    onToggleHyperfocus: () => mainWindow?.webContents.send('hub:toggle-hyperfocus'),
    onCheckUpdates: () => {
      void updater.checkNow();
    },
    onQuit: () => {
      isQuitting = true;
      void shutdownHook?.();
    },
  });

  registerDesktopIpcHandlers({
    isPackaged: app.isPackaged,
    isWindowsStore: IS_WINDOWS_STORE,
    getMainWindow: () => mainWindow,
    authorizedPaths,
    credentials,
    transfers,
    syncMirror,
    scheduler,
    sessionScope,
    oauthLoopback,
    updater,
    onTrayRefresh: () => trayCtrl?.refreshMenu(),
    onNavigateRoute: navigateRoute,
  });

  const unpackedIcon = path.join(process.resourcesPath || '', 'app.asar.unpacked', 'build', 'icon.png');
  const windowIcon = fs.existsSync(unpackedIcon)
    ? unpackedIcon
    : path.join(app.getAppPath(), 'build', 'icon.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 920,
    minHeight: 620,
    title: 'HUB LabDiv',
    autoHideMenuBar: true,
    icon: windowIcon,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
    },
  });

  if (process.platform !== 'darwin') {
    mainWindow.setMenuBarVisibility(false);
  }

  // Identifica o cliente desktop no User-Agent mantendo compatibilidade com detecção LabDiv-App
  const currentUa = mainWindow.webContents.userAgent;
  if (!currentUa.includes('LabDiv-App')) {
    mainWindow.webContents.userAgent = `${currentUa} LabDiv-App LabDiv-Desktop`;
  }

  mainWindow.webContents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      void shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  const handleNavigationGuard = (event: { preventDefault: () => void }, targetUrl: string) => {
    if (!isAllowedMainFrameNavigationUrl(targetUrl, navSecOpts) && !targetUrl.startsWith('file://')) {
      event.preventDefault();
      if (isSafeExternalUrl(targetUrl)) {
        void shell.openExternal(targetUrl);
      }
    }
  };
  mainWindow.webContents.on('will-navigate', handleNavigationGuard);
  mainWindow.webContents.on('will-redirect', handleNavigationGuard);

  mainWindow.webContents.on('did-finish-load', () => {
    rendererReady = true;
    while (pendingDeepLinks.length > 0 && mainWindow && !mainWindow.isDestroyed()) {
      const nextLink = pendingDeepLinks.shift();
      if (nextLink) {
        mainWindow.webContents.send('hub:deep-link', nextLink);
      }
    }
  });

  mainWindow.webContents.on('did-fail-load', (_event, errorCode, _errorDescription, _validatedURL, isMainFrame) => {
    if (!isMainFrame || errorCode === -3) return;
    rendererReady = false;
    void mainWindow?.loadFile(path.join(app.getAppPath(), 'src/renderer/offline.html'));
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting && sessionScope.getPreferences().closeToTray) {
      e.preventDefault();
      mainWindow?.hide();
    }
  });

  trayCtrl.init();
  await mainWindow.loadURL(START_URL);
}

app.whenReady().then(() => void bootstrap());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  isQuitting = true;
  void shutdownHook?.();
});
