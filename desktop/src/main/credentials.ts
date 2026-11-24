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

export interface SecretCipherAdapter {
  isAvailable(): boolean;
  getBackendName?(): string;
  encryptString(plain: string): Buffer;
  decryptString(cipher: Buffer): string;
}

export interface StoredDeviceCredential {
  scopeKey: string;
  tokenId: string;
  secret: string;
  updatedAt: string;
}

export class DesktopCredentialStore {
  private storePath: string | null = null;
  private readonly cipher: SecretCipherAdapter;
  private writeChain: Promise<void> = Promise.resolve();

  constructor(scopeDir: string | null, cipher: SecretCipherAdapter) {
    this.cipher = cipher;
    this.setScopeDir(scopeDir);
  }

  setScopeDir(scopeDir: string | null): void {
    this.storePath = scopeDir ? path.join(scopeDir, 'credentials.enc.json') : null;
  }

  private requireStorePath(): string {
    if (!this.storePath) {
      throw new Error('Nenhuma sessão de usuário ativa para acessar credenciais locais.');
    }
    return this.storePath;
  }

  getSecurityStatus(): { secureAvailable: boolean; backend: string; reason?: string } {
    const backend = this.cipher.getBackendName?.() || 'unknown';
    if (backend === 'basic_text') {
      return {
        secureAvailable: false,
        backend,
        reason: 'Chaveiro do sistema (GNOME Keyring/libsecret) indisponível ou bloqueado; armazenamento basic_text recusado.',
      };
    }
    if (!this.cipher.isAvailable()) {
      return {
        secureAvailable: false,
        backend,
        reason: 'safeStorage indisponível neste ambiente.',
      };
    }
    return { secureAvailable: true, backend };
  }

  private async readMap(): Promise<Record<string, { tokenId: string; encryptedSecretB64: string; updatedAt: string }>> {
    if (!this.storePath) return {};
    try {
      const raw = await fs.promises.readFile(this.storePath, 'utf8');
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private async writeMap(map: Record<string, { tokenId: string; encryptedSecretB64: string; updatedAt: string }>): Promise<void> {
    const targetPath = this.requireStorePath();
    const content = JSON.stringify(map, null, 2);
    this.writeChain = this.writeChain.then(async () => {
      await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
      const tmp = `${targetPath}.${process.pid}.${Date.now()}.tmp`;
      await fs.promises.writeFile(tmp, content, { mode: 0o600 });
      await fs.promises.rename(tmp, targetPath);
    });
    return this.writeChain;
  }

  async saveCredential(scopeKey: string, tokenId: string, secret: string): Promise<void> {
    this.requireStorePath();
    const status = this.getSecurityStatus();
    if (!status.secureAvailable) {
      throw new Error(status.reason || 'safeStorage indisponível para cifrar credenciais.');
    }
    const cleanScope = String(scopeKey || 'personal').trim() || 'personal';
    const encBuf = this.cipher.encryptString(secret);
    const map = await this.readMap();
    map[cleanScope] = {
      tokenId: String(tokenId).trim(),
      encryptedSecretB64: encBuf.toString('base64'),
      updatedAt: new Date().toISOString(),
    };
    await this.writeMap(map);
  }

  async getCredential(scopeKey: string): Promise<StoredDeviceCredential | null> {
    if (!this.storePath) return null;
    const cleanScope = String(scopeKey || 'personal').trim() || 'personal';
    const map = await this.readMap();
    const entry = map[cleanScope];
    if (!entry) return null;
    const status = this.getSecurityStatus();
    if (!status.secureAvailable) {
      throw new Error(status.reason || 'safeStorage indisponível para decifrar credencial.');
    }
    const secret = this.cipher.decryptString(Buffer.from(entry.encryptedSecretB64, 'base64'));
    return {
      scopeKey: cleanScope,
      tokenId: entry.tokenId,
      secret,
      updatedAt: entry.updatedAt,
    };
  }

  async getBasicAuthHeader(scopeKey: string): Promise<string | null> {
    const cred = await this.getCredential(scopeKey);
    if (!cred) return null;
    return `Basic ${Buffer.from(`${cred.tokenId}:${cred.secret}`, 'utf8').toString('base64')}`;
  }

  async clearCredential(scopeKey: string): Promise<void> {
    if (!this.storePath) return;
    const cleanScope = String(scopeKey || 'personal').trim() || 'personal';
    const map = await this.readMap();
    if (cleanScope in map) {
      delete map[cleanScope];
      await this.writeMap(map);
    }
  }
}
