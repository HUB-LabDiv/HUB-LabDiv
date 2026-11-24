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

import path from 'node:path';
import type { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron';

export const PROD_APP_ORIGIN = 'https://www.hublabdiv.com.br';
export const PROD_APP_ORIGINS = new Set([
  'https://www.hublabdiv.com.br',
  'https://hublabdiv.com.br',
]);
export const DEV_APP_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
]);

export function isTrustedAppUrl(
  rawUrl: string | undefined | null,
  options?: { isPackaged?: boolean; allowDev?: boolean }
): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const isPackaged = Boolean(options?.isPackaged);
  const allowDev = !isPackaged && Boolean(options?.allowDev);
  try {
    const u = new URL(rawUrl);
    if (PROD_APP_ORIGINS.has(u.origin)) return true;
    if (allowDev && DEV_APP_ORIGINS.has(u.origin)) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Restringe estritamente a navegação no mainFrame às origens do HUB LabDiv e subdomínios oficiais.
 * Domínios externos (Google OAuth, GitHub, Aurtistic, YouTube) devem abrir via shell.openExternal.
 */
export function isAllowedMainFrameNavigationUrl(
  rawUrl: string,
  options?: { isPackaged?: boolean; allowDev?: boolean }
): boolean {
  if (isTrustedAppUrl(rawUrl, options)) return true;
  try {
    const u = new URL(rawUrl);
    if (u.protocol === 'https:') {
      const host = u.hostname.toLowerCase();
      if (host === 'hublabdiv.com.br' || host.endsWith('.hublabdiv.com.br')) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export function isAllowedDeepLink(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const clean = rawUrl.trim();
  if (!clean || clean.length > 2048 || /[\0\r\n]/.test(clean)) return false;
  try {
    const u = new URL(clean);
    return u.protocol === 'hublabdiv:';
  } catch {
    return false;
  }
}

function isLinkLocalOrMetadataHost(host: string): boolean {
  const clean = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (!clean) return true;
  if (clean === '0.0.0.0' || clean === '::') return true;
  if (clean.startsWith('169.254.')) return true;
  if (clean.startsWith('fe80:') || clean.startsWith('fe80%')) return true;
  if (clean.startsWith('::ffff:169.254.') || clean.startsWith('::ffff:0.0.0.0')) return true;
  return false;
}

function isRfc1918OrLocalHostname(host: string): boolean {
  const clean = host.toLowerCase();
  if (isLinkLocalOrMetadataHost(clean)) return false;
  return (
    clean === 'localhost' ||
    clean === '127.0.0.1' ||
    clean.endsWith('.local') ||
    clean.startsWith('192.168.') ||
    clean.startsWith('10.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(clean)
  );
}

/**
 * Permite estritamente hosts locais / RFC 1918 (LAN), bloqueando link-local (169.254.x.x),
 * IPv6 ambíguo e credenciais embutidas na URL.
 */
export function isAllowedLanOrigin(rawUrl: string): boolean {
  const clean = String(rawUrl || '').trim();
  if (!clean) return false;
  try {
    const u = new URL(clean);
    if (u.username || u.password) return false;
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
    return isRfc1918OrLocalHostname(u.hostname);
  } catch {
    return false;
  }
}

/**
 * Valida URLs de armazenamento (remoto HTTPS ou servidor LAN permitido),
 * aplicando a mesma trava anti-169.254.x.x e bloqueio de credenciais embutidas.
 */
export function isAllowedStorageBaseUrl(rawUrl: string): boolean {
  const clean = String(rawUrl || '').trim();
  if (!clean) return false;
  try {
    const u = new URL(clean);
    if (u.username || u.password) return false;
    if (isLinkLocalOrMetadataHost(u.hostname)) return false;
    if (u.protocol === 'https:') return true;
    if (u.protocol === 'http:') return isRfc1918OrLocalHostname(u.hostname);
    return false;
  } catch {
    return false;
  }
}

export function isSafeExternalUrl(rawUrl: string): boolean {
  const clean = String(rawUrl || '').trim();
  if (!clean) return false;
  try {
    const u = new URL(clean);
    if (u.username || u.password) return false;
    if (isLinkLocalOrMetadataHost(u.hostname)) return false;
    if (u.protocol === 'https:') return true;
    if (u.protocol === 'http:') return isRfc1918OrLocalHostname(u.hostname);
    return false;
  } catch {
    return false;
  }
}

export function assertTrustedMainFrameIpcSender(
  event: IpcMainInvokeEvent | IpcMainEvent,
  mainWindow: BrowserWindow | null,
  options?: { isPackaged?: boolean; allowDev?: boolean }
): string {
  const senderFrame = event.senderFrame;
  const frameUrl = senderFrame?.url || '';
  if (!senderFrame || !isTrustedAppUrl(frameUrl, options)) {
    throw new Error(`IPC bloqueado: origem não confiável (${frameUrl || 'desconhecida'}).`);
  }
  if (mainWindow && !mainWindow.isDestroyed()) {
    const expectedMainFrame = mainWindow.webContents.mainFrame;
    if (senderFrame !== expectedMainFrame) {
      throw new Error('IPC bloqueado: chamada originada fora do frame principal do HUB LabDiv.');
    }
  }
  return frameUrl;
}

export function normalizeRelPath(rawPath: string): string {
  const raw = String(rawPath || '')
    .replace(/\0/g, '')
    .replace(/\\/g, '/')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '')
    .trim();
  if (!raw) return '';
  const segs = raw.split('/');
  for (const s of segs) {
    if (!s || s === '.' || s === '..') {
      throw new Error(`Caminho relativo inválido (path traversal bloqueado): ${rawPath}`);
    }
  }
  return segs.join('/');
}

/**
 * Confinamento estrito de caminhos para IPC: impede leitura/escrita arbitrária
 * no filesystem vinda do renderer sem seleção via dialog nativo ou pasta autorizada.
 */
export class AuthorizedPathsRegistry {
  private readonly authorizedDirs = new Set<string>();
  private readonly authorizedFiles = new Set<string>();

  addAuthorizedDir(dirPath: string): void {
    if (dirPath) this.authorizedDirs.add(path.resolve(dirPath));
  }

  removeAuthorizedDir(dirPath: string): void {
    if (dirPath) this.authorizedDirs.delete(path.resolve(dirPath));
  }

  addAuthorizedFile(filePath: string): void {
    if (filePath) this.authorizedFiles.add(path.resolve(filePath));
  }

  clearDynamicAuthorizations(keepDirs: string[] = []): void {
    this.authorizedFiles.clear();
    this.authorizedDirs.clear();
    for (const dir of keepDirs) {
      this.addAuthorizedDir(dir);
    }
  }

  isAuthorizedPath(targetPath: string): boolean {
    if (!targetPath || typeof targetPath !== 'string' || targetPath.includes('\0')) return false;
    const resolved = path.resolve(targetPath);
    if (this.authorizedFiles.has(resolved)) return true;
    for (const dir of this.authorizedDirs) {
      if (resolved === dir || resolved.startsWith(`${dir}${path.sep}`)) {
        return true;
      }
    }
    return false;
  }

  assertAuthorizedPath(targetPath: string, actionLabel = 'acesso'): string {
    if (!this.isAuthorizedPath(targetPath)) {
      throw new Error(`Confinamento IPC bloqueou ${actionLabel} em caminho não autorizado: ${targetPath}`);
    }
    return path.resolve(targetPath);
  }
}
