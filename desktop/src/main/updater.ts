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
import type { AppUpdater } from 'electron-updater';
import type { DesktopUpdateChannel } from '../types/hub-desktop';
import { PROD_APP_ORIGIN, isSafeExternalUrl } from './security';

export interface AutoUpdateCheckOptions {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  isWindowsStore?: boolean;
  isMacSigned?: boolean;
}

export function readBuildMetaMacSigned(baseDir?: string): boolean {
  const candidates = [
    baseDir ? path.join(baseDir, 'build-meta.json') : '',
    path.join(process.resourcesPath || '', 'app.asar.unpacked', 'build-meta.json'),
    path.join(__dirname, '../../build-meta.json'),
  ].filter(Boolean);

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, 'utf8')) as { macSigned?: boolean };
        return Boolean(parsed?.macSigned);
      }
    } catch {
      // ignora erro de leitura
    }
  }
  return false;
}

export function isNewerSemver(candidateRaw: string, currentRaw: string): boolean {
  const parse = (v: string): [number, number, number] | null => {
    const cleaned = String(v || '')
      .trim()
      .replace(/^(desktop-)?v/i, '')
      .split('-')[0];
    const parts = cleaned.split('.').map((n) => Number.parseInt(n, 10));
    if (parts.length < 3 || parts.some((n) => !Number.isFinite(n) || n < 0)) return null;
    return [parts[0], parts[1], parts[2]];
  };

  const cand = parse(candidateRaw);
  const curr = parse(currentRaw);
  if (!cand || !curr) return false;

  for (let i = 0; i < 3; i++) {
    if (cand[i] > curr[i]) return true;
    if (cand[i] < curr[i]) return false;
  }
  return false;
}

export function isAutoUpdateSupported(opts: AutoUpdateCheckOptions = {}): boolean {
  const platform = opts.platform ?? process.platform;
  const env = opts.env ?? process.env;
  const isWindowsStore =
    opts.isWindowsStore ??
    Boolean((process as NodeJS.Process & { windowsStore?: boolean }).windowsStore);

  if (isWindowsStore) {
    return false;
  }
  if (platform === 'linux') {
    return Boolean(env.APPIMAGE && String(env.APPIMAGE).trim().length > 0);
  }
  if (platform === 'darwin') {
    // Squirrel.Mac exige assinatura Developer ID válida para auto-instalação
    return Boolean(opts.isMacSigned);
  }
  return platform === 'win32';
}

export function resolveUpdateChannel(opts: AutoUpdateCheckOptions = {}): DesktopUpdateChannel {
  const platform = opts.platform ?? process.platform;
  const isWindowsStore =
    opts.isWindowsStore ??
    Boolean((process as NodeJS.Process & { windowsStore?: boolean }).windowsStore);

  if (isWindowsStore) return 'microsoft-store';
  if (isAutoUpdateSupported(opts)) return 'electron-updater';
  if (platform === 'linux') return 'apt';
  return 'manual-github';
}

export class DesktopUpdater {
  private timer: NodeJS.Timeout | null = null;
  private started = false;
  private lastNotifiedVersion: string | null = null;
  private readonly isMacSigned: boolean;

  constructor(isMacSigned = readBuildMetaMacSigned()) {
    this.isMacSigned = isMacSigned;
  }

  isMacSignedBuild(): boolean {
    return this.isMacSigned;
  }

  getChannel(): DesktopUpdateChannel {
    return resolveUpdateChannel({ isMacSigned: this.isMacSigned });
  }

  private getElectron(): typeof import('electron') | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('electron') as typeof import('electron');
    } catch {
      return null;
    }
  }

  private getAutoUpdater(): AppUpdater | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return (require('electron-updater') as typeof import('electron-updater')).autoUpdater;
    } catch {
      return null;
    }
  }

  start(): void {
    const electron = this.getElectron();
    if (this.started || !electron?.app?.isPackaged) return;
    this.started = true;

    const channel = this.getChannel();
    if (channel === 'microsoft-store') {
      // Microsoft Store gerencia atualizações automaticamente (Regra 10.2.4)
      return;
    }

    if (channel === 'electron-updater') {
      const updater = this.getAutoUpdater();
      if (!updater) return;

      updater.autoDownload = true;
      updater.autoInstallOnAppQuit = true;

      updater.on('update-downloaded', (info) => {
        try {
          if (electron.Notification.isSupported()) {
            const n = new electron.Notification({
              title: 'Atualização do HUB LabDiv pronta',
              body: `Versão ${info.version} baixada e será aplicada ao reiniciar o app.`,
            });
            n.show();
          }
        } catch {
          // Ignora se Notification não estiver disponível
        }
      });

      updater.on('error', () => {
        // Silencioso em erro transitório / offline
      });
    }

    void this.checkNow();
    this.timer = setInterval(() => {
      void this.checkNow();
    }, 6 * 60 * 60 * 1000);
    this.timer.unref?.();
  }

  async checkNow(): Promise<{
    supported: boolean;
    channel: DesktopUpdateChannel;
    releasePageUrl?: string;
  }> {
    const electron = this.getElectron();
    const channel = this.getChannel();
    const supported = channel === 'electron-updater';

    if (!electron?.app?.isPackaged || channel === 'microsoft-store') {
      return { supported: false, channel };
    }

    if (!supported) {
      const releasePageUrl = await this.checkManualOrAptReleaseNotice(
        electron.app.getVersion(),
        channel
      );
      return { supported: false, channel, releasePageUrl };
    }

    const updater = this.getAutoUpdater();
    if (!updater) return { supported: false, channel };

    try {
      await updater.checkForUpdatesAndNotify();
    } catch {
      // Ignora falhas transitórias de rede
    }
    return { supported: true, channel };
  }

  private async checkManualOrAptReleaseNotice(
    currentVersion: string,
    channel: DesktopUpdateChannel
  ): Promise<string | undefined> {
    const electron = this.getElectron();
    try {
      const resp = await fetch(`${PROD_APP_ORIGIN}/api/app/desktop-release`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!resp.ok) return undefined;
      const data = (await resp.json()) as {
        available?: boolean;
        version?: string;
        releasePageUrl?: string;
      };
      if (!data.available || !data.version) return data.releasePageUrl;
      if (!isNewerSemver(data.version, currentVersion)) return data.releasePageUrl;
      if (this.lastNotifiedVersion === data.version) return data.releasePageUrl;
      this.lastNotifiedVersion = data.version;

      if (electron?.Notification?.isSupported()) {
        const isApt = channel === 'apt';
        const n = new electron.Notification({
          title: `Nova versão do HUB LabDiv (${data.version})`,
          body: isApt
            ? 'Atualize pelo APT: sudo apt update && sudo apt upgrade hub-labdiv'
            : 'Clique para abrir a página de releases e baixar a nova versão.',
        });
        if (!isApt && data.releasePageUrl && isSafeExternalUrl(data.releasePageUrl)) {
          n.on('click', () => {
            void electron.shell.openExternal(data.releasePageUrl!);
          });
        }
        n.show();
      }
      return data.releasePageUrl;
    } catch {
      return undefined;
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
