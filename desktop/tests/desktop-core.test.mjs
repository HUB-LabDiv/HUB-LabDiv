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

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const {
  PROD_APP_ORIGIN,
  isTrustedAppUrl,
  isAllowedMainFrameNavigationUrl,
  isAllowedDeepLink,
  isAllowedLanOrigin,
  isAllowedStorageBaseUrl,
  isSafeExternalUrl,
  normalizeRelPath,
  AuthorizedPathsRegistry,
} = require('../dist/main/security.js');

const { OAuthLoopbackServer } = require('../dist/main/oauth-loopback.js');
const { DesktopCredentialStore } = require('../dist/main/credentials.js');
const { DesktopTransferEngine } = require('../dist/main/transfer-engine.js');
const { SyncMirrorCoordinator, hasInvalidWindowsSegment, planSyncActions } = require('../dist/main/sync-mirror.js');
const { DesktopScheduler } = require('../dist/main/scheduler.js');
const { DesktopSessionScopeManager } = require('../dist/main/session-scope.js');
const { isNewerSemver, isAutoUpdateSupported, resolveUpdateChannel } = require('../dist/main/updater.js');

test('security: valida origens confiáveis e restringe mainFrame ao HUB LabDiv', () => {
  assert.equal(PROD_APP_ORIGIN, 'https://www.hublabdiv.com.br');
  assert.equal(isTrustedAppUrl('https://www.hublabdiv.com.br/login', { isPackaged: true }), true);
  assert.equal(isTrustedAppUrl('https://hublabdiv.com.br/', { isPackaged: true }), true);
  assert.equal(isTrustedAppUrl('http://localhost:3000', { isPackaged: true }), false);
  assert.equal(isTrustedAppUrl('http://localhost:3000', { isPackaged: false, allowDev: true }), true);

  assert.equal(isAllowedMainFrameNavigationUrl('https://showdefisica.hublabdiv.com.br/painel', { isPackaged: true }), true);
  // Domínios externos como Aurtistic/Google/GitHub NÃO devem navegar no mainFrame (abrem no navegador do SO)
  assert.equal(isAllowedMainFrameNavigationUrl('https://aurtistic.vercel.app', { isPackaged: true }), false);
  assert.equal(isAllowedMainFrameNavigationUrl('https://accounts.google.com', { isPackaged: true }), false);
  assert.equal(isAllowedMainFrameNavigationUrl('https://github.com', { isPackaged: true }), false);
});

test('security: bloqueia SSRF 169.254.x.x, credenciais na URL e path traversal', () => {
  assert.equal(isAllowedLanOrigin('http://192.168.1.40:3000'), true);
  assert.equal(isAllowedLanOrigin('http://10.0.0.12:8080'), true);
  assert.equal(isAllowedLanOrigin('http://storage.local:8080'), true);
  assert.equal(isAllowedLanOrigin('http://169.254.169.254/latest/meta-data'), false);
  assert.equal(isAllowedLanOrigin('http://user:pass@192.168.1.40:3000'), false);
  assert.equal(isAllowedLanOrigin('http://0.0.0.0:3000'), false);

  assert.equal(isAllowedStorageBaseUrl('https://storage.hublabdiv.com.br'), true);
  assert.equal(isAllowedStorageBaseUrl('https://169.254.169.254'), false);
  assert.equal(isAllowedStorageBaseUrl('http://example.com'), false);
  assert.equal(isAllowedStorageBaseUrl('http://192.168.0.50:4000'), true);

  assert.equal(isSafeExternalUrl('https://accounts.google.com/o/oauth2/v2/auth'), true);
  assert.equal(isSafeExternalUrl('javascript:alert(1)'), false);
  assert.equal(isSafeExternalUrl('file:///etc/passwd'), false);

  assert.equal(isAllowedDeepLink('hublabdiv://trilhas'), true);
  assert.equal(isAllowedDeepLink('https://www.hublabdiv.com.br'), false);

  assert.equal(normalizeRelPath('pasta/arquivo.pdf'), 'pasta/arquivo.pdf');
  assert.throws(() => normalizeRelPath('../segredo.txt'));

  const reg = new AuthorizedPathsRegistry();
  reg.addAuthorizedDir('/tmp/hub-mirror');
  assert.equal(reg.isAuthorizedPath('/tmp/hub-mirror/a.txt'), true);
  assert.equal(reg.isAuthorizedPath('/etc/passwd'), false);
});

test('oauth-loopback: encerra servidor anterior, recebe callback limpo e fecha imediatamente', async () => {
  const srv = new OAuthLoopbackServer();
  const first = await srv.start(() => {});
  assert.match(first.callbackUrl, /^http:\/\/127\.0\.0\.1:\d+\/auth\/callback$/);
  assert.equal(new URL(first.callbackUrl).search, '');

  let captured = null;
  const second = await srv.start((payload) => {
    captured = payload;
  });
  assert.notEqual(second.callbackUrl, first.callbackUrl);

  const res = await fetch(`${second.callbackUrl}?code=pkce_test_123`);
  assert.equal(res.status, 200);
  assert.equal(captured?.code, 'pkce_test_123');

  // Servidor deve fechar logo após o callback
  await new Promise((r) => setTimeout(r, 80));
  await assert.rejects(() => fetch(second.callbackUrl));
});

test('session-scope: inicia pausado no boot e isola dados no login/logout', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-desktop-scope-'));
  try {
    const authPaths = new AuthorizedPathsRegistry();
    const creds = new DesktopCredentialStore(null, {
      isAvailable: () => true,
      getBackendName: () => 'gnome_libsecret',
      encryptString: (s) => Buffer.from(s, 'utf8'),
      decryptString: (b) => b.toString('utf8'),
    });
    const transfers = new DesktopTransferEngine({ credentials: creds });
    const syncMirror = new SyncMirrorCoordinator({ credentials: creds, transfers });
    const scheduler = new DesktopScheduler(() => {});

    const mgr = new DesktopSessionScopeManager({
      userDataDir: tmpDir,
      baseAuthorizedDirs: [],
      authorizedPaths: authPaths,
      credentials: creds,
      transfers,
      syncMirror,
      scheduler,
    });

    await mgr.init();
    assert.equal(mgr.getActiveUserId(), null);
    assert.equal(transfers.isActive(), false);
    assert.equal(syncMirror.isActive(), false);
    assert.equal(scheduler.isActive(), false);

    await mgr.switchSession('user-usp-1');
    assert.equal(mgr.getActiveUserId(), 'user-usp-1');
    assert.equal(transfers.isActive(), true);
    assert.equal(syncMirror.isActive(), true);
    assert.equal(scheduler.isActive(), true);
    await creds.saveCredential('personal', 'tok1', 'sec1');
    assert.equal((await creds.getCredential('personal'))?.secret, 'sec1');

    // Troca para outro usuário: não enxerga credenciais do usuário 1
    await mgr.switchSession('user-usp-2');
    assert.equal(await creds.getCredential('personal'), null);

    // Logout: pausa tudo novamente
    await mgr.switchSession(null);
    assert.equal(transfers.isActive(), false);
    assert.equal(syncMirror.isActive(), false);
    assert.equal(scheduler.isActive(), false);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('credentials: recusa armazenamento basic_text', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hub-desktop-cred-'));
  try {
    const store = new DesktopCredentialStore(tmpDir, {
      isAvailable: () => true,
      getBackendName: () => 'basic_text',
      encryptString: (s) => Buffer.from(s),
      decryptString: (b) => b.toString(),
    });
    assert.equal(store.getSecurityStatus().secureAvailable, false);
    await assert.rejects(() => store.saveCredential('personal', 'id', 'secret'));
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('updater: aplica regras de Windows Store, macOS não assinado, AppImage e semver', () => {
  assert.equal(isNewerSemver('desktop-v1.1.0', '1.0.0'), true);
  assert.equal(isNewerSemver('v1.0.0', '1.0.0'), false);

  // Windows Store nunca usa electron-updater
  assert.equal(isAutoUpdateSupported({ platform: 'win32', isWindowsStore: true }), false);
  assert.equal(resolveUpdateChannel({ platform: 'win32', isWindowsStore: true }), 'microsoft-store');

  // NSIS usa electron-updater
  assert.equal(isAutoUpdateSupported({ platform: 'win32', isWindowsStore: false }), true);
  assert.equal(resolveUpdateChannel({ platform: 'win32', isWindowsStore: false }), 'electron-updater');

  // macOS não assinado cai para notificação manual; assinado usa electron-updater
  assert.equal(isAutoUpdateSupported({ platform: 'darwin', isMacSigned: false }), false);
  assert.equal(resolveUpdateChannel({ platform: 'darwin', isMacSigned: false }), 'manual-github');
  assert.equal(isAutoUpdateSupported({ platform: 'darwin', isMacSigned: true }), true);

  // Linux AppImage vs .deb APT
  assert.equal(isAutoUpdateSupported({ platform: 'linux', env: { APPIMAGE: '/tmp/HUB.AppImage' } }), true);
  assert.equal(isAutoUpdateSupported({ platform: 'linux', env: {} }), false);
  assert.equal(resolveUpdateChannel({ platform: 'linux', env: {} }), 'apt');
});

test('scheduler: dispara eventos acadêmicos respeitando preferências e evita rajada no wake', () => {
  const events = [];
  const sched = new DesktopScheduler((e) => events.push(e));
  const now = Date.now();

  // Sem usuário ativo não dispara nada
  sched.syncAcademicEvents({
    events: [
      {
        id: 'ev1',
        title: 'Física IV',
        type: 'aula',
        startTimeIso: new Date(now + 30 * 60_000).toISOString(),
        reminderMinutes: 60,
      },
    ],
    prefs: { enableNotifications: true, notifyClasses: true, notifyExams: true, notifyReminders: true },
  });
  assert.equal(sched.tick(now).length, 0);

  sched.setActiveUser('user-1');
  sched.syncAcademicEvents({
    events: [
      {
        id: 'ev1',
        title: 'Física IV',
        type: 'aula',
        startTimeIso: new Date(now + 30 * 60_000).toISOString(),
        reminderMinutes: 60,
      },
      {
        id: 'ev2',
        title: 'Prova de Eletromag',
        type: 'prova',
        startTimeIso: new Date(now + 30 * 60_000).toISOString(),
        reminderMinutes: 60,
      },
    ],
    prefs: { enableNotifications: true, notifyClasses: true, notifyExams: false, notifyReminders: true },
  });

  const fired = sched.tick(now);
  assert.equal(fired.length, 1);
  assert.match(fired[0].title, /Física IV/);

  // Wake advancement
  sched.syncSelfCare({
    configs: [
      {
        id: 'eye',
        key: 'eye_rest_20_20_20',
        name: 'Pausa Visual',
        description: 'Olhe a 6m',
        enabled: true,
        intervalMinutes: 20,
        nextTriggerTimestamp: now - 40 * 60_000,
      },
    ],
    hyperfocusUntil: null,
    eyeRestAutoOverlay: false,
  });
  sched.handleSystemWake(now);
  assert.equal(sched.tick(now).length, 0);
});

test('sync-mirror: bloqueia nomes reservados Windows e preserva conflitos', () => {
  assert.equal(hasInvalidWindowsSegment('docs/CON.txt'), true);
  assert.equal(hasInvalidWindowsSegment('docs/relatorio.pdf'), false);

  const actions = planSyncActions({
    localFiles: [{ relPath: 'nota.md', sha256: 'aaa', mtimeMs: 2, sizeBytes: 10 }],
    remoteFiles: [{ relPath: 'nota.md', sha256: 'bbb', mtimeMs: 3, sizeBytes: 12 }],
    previousState: { 'nota.md': { sha256: '000', mtimeMs: 1, sizeBytes: 8, updatedAt: 1 } },
  });
  assert.equal(actions.length, 1);
  assert.equal(actions[0].type, 'conflict_preserve_both');
});
