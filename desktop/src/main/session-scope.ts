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

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type { HubDesktopPreferences } from '../types/hub-desktop';
import type { DesktopCredentialStore } from './credentials';
import type { DesktopScheduler } from './scheduler';
import type { AuthorizedPathsRegistry } from './security';
import type { SyncMirrorCoordinator } from './sync-mirror';
import type { DesktopTransferEngine } from './transfer-engine';

const DEFAULT_PREFERENCES: HubDesktopPreferences = {
  closeToTray: true,
  eyeRestAutoOverlay: false,
  storageOptIn: false,
};

export function hashUserIdForDir(userId: string): string {
  return crypto.createHash('sha256').update(String(userId).trim()).digest('hex').slice(0, 32);
}

export class DesktopSessionScopeManager {
  private readonly userDataDir: string;
  private readonly prefsPath: string;
  private readonly baseAuthorizedDirs: string[];
  private readonly authorizedPaths: AuthorizedPathsRegistry;
  private readonly credentials: DesktopCredentialStore;
  private readonly transfers: DesktopTransferEngine;
  private readonly syncMirror: SyncMirrorCoordinator;
  private readonly scheduler: DesktopScheduler;
  private readonly onChanged?: () => void;

  private activeUserId: string | null = null;
  private preferences: HubDesktopPreferences = { ...DEFAULT_PREFERENCES };

  constructor(opts: {
    userDataDir: string;
    baseAuthorizedDirs: string[];
    authorizedPaths: AuthorizedPathsRegistry;
    credentials: DesktopCredentialStore;
    transfers: DesktopTransferEngine;
    syncMirror: SyncMirrorCoordinator;
    scheduler: DesktopScheduler;
    onChanged?: () => void;
  }) {
    this.userDataDir = opts.userDataDir;
    this.prefsPath = path.join(opts.userDataDir, 'preferences.json');
    this.baseAuthorizedDirs = opts.baseAuthorizedDirs;
    this.authorizedPaths = opts.authorizedPaths;
    this.credentials = opts.credentials;
    this.transfers = opts.transfers;
    this.syncMirror = opts.syncMirror;
    this.scheduler = opts.scheduler;
    this.onChanged = opts.onChanged;
  }

  async init(): Promise<void> {
    try {
      const raw = await fs.promises.readFile(this.prefsPath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<HubDesktopPreferences>;
      this.preferences = {
        closeToTray: typeof parsed.closeToTray === 'boolean' ? parsed.closeToTray : DEFAULT_PREFERENCES.closeToTray,
        eyeRestAutoOverlay:
          typeof parsed.eyeRestAutoOverlay === 'boolean'
            ? parsed.eyeRestAutoOverlay
            : DEFAULT_PREFERENCES.eyeRestAutoOverlay,
        storageOptIn: typeof parsed.storageOptIn === 'boolean' ? parsed.storageOptIn : DEFAULT_PREFERENCES.storageOptIn,
      };
    } catch {
      this.preferences = { ...DEFAULT_PREFERENCES };
    }
    this.scheduler.setEyeRestAutoOverlay(this.preferences.eyeRestAutoOverlay);
    // Boot seguro: inicia sempre sem usuário ativo até AuthProvider confirmar sessão autenticada
    await this.switchSession(null);
  }

  getActiveUserId(): string | null {
    return this.activeUserId;
  }

  getPreferences(): HubDesktopPreferences {
    return { ...this.preferences };
  }

  async setPreferences(partial: Partial<HubDesktopPreferences>): Promise<HubDesktopPreferences> {
    const next: HubDesktopPreferences = {
      closeToTray: typeof partial.closeToTray === 'boolean' ? partial.closeToTray : this.preferences.closeToTray,
      eyeRestAutoOverlay:
        typeof partial.eyeRestAutoOverlay === 'boolean'
          ? partial.eyeRestAutoOverlay
          : this.preferences.eyeRestAutoOverlay,
      storageOptIn: typeof partial.storageOptIn === 'boolean' ? partial.storageOptIn : this.preferences.storageOptIn,
    };
    this.preferences = next;
    this.scheduler.setEyeRestAutoOverlay(next.eyeRestAutoOverlay);

    await fs.promises.mkdir(path.dirname(this.prefsPath), { recursive: true });
    const tmp = `${this.prefsPath}.${process.pid}.${Date.now()}.tmp`;
    await fs.promises.writeFile(tmp, JSON.stringify(next, null, 2), { mode: 0o600 });
    await fs.promises.rename(tmp, this.prefsPath);

    return { ...next };
  }

  async switchSession(nextUserId: string | null): Promise<{ activeUserId: string | null }> {
    const normalized = typeof nextUserId === 'string' && nextUserId.trim() ? nextUserId.trim() : null;
    if (normalized !== null && normalized === this.activeUserId && this.transfers.isActive()) {
      return { activeUserId: this.activeUserId };
    }

    // Teardown completo da sessão anterior (ou boot limpo)
    await this.syncMirror.stopAll();
    await this.transfers.deactivate();
    this.scheduler.setActiveUser(null);
    this.credentials.setScopeDir(null);
    this.authorizedPaths.clearDynamicAuthorizations(this.baseAuthorizedDirs);

    this.activeUserId = normalized;

    if (normalized) {
      const userDir = path.join(this.userDataDir, 'users', hashUserIdForDir(normalized));
      await fs.promises.mkdir(userDir, { recursive: true });
      this.credentials.setScopeDir(userDir);
      await this.transfers.activateForUser(userDir);
      await this.syncMirror.activateForUser(userDir);
      this.scheduler.setActiveUser(normalized);
    }

    this.onChanged?.();
    return { activeUserId: this.activeUserId };
  }
}
