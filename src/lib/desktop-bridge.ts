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

import { Capacitor } from '@capacitor/core';
import type { DesktopPlatform, HubDesktopBridge } from '@/types/desktop';

const DISMISS_NAVBAR_KEY = 'hub_install_navbar_dismissed';

interface WindowWithDesktop extends Window {
  hubDesktop?: HubDesktopBridge;
}

export function getHubDesktopBridge(): HubDesktopBridge | null {
  if (typeof window === 'undefined') return null;
  return (window as WindowWithDesktop).hubDesktop ?? null;
}

export function isDesktopApp(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as WindowWithDesktop).hubDesktop) return true;
  return typeof navigator !== 'undefined' && navigator.userAgent.includes('LabDiv-Desktop');
}

export function isNativeOrDesktop(): boolean {
  if (typeof window === 'undefined') return false;
  return isDesktopApp() || Capacitor.isNativePlatform();
}

export function detectClientPlatform(): DesktopPlatform {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = (navigator.userAgent || '').toLowerCase();
  const plat = (
    (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ||
    navigator.platform ||
    ''
  ).toLowerCase();

  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua) || (plat.includes('mac') && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (plat.includes('win') || ua.includes('windows')) return 'windows';
  if (plat.includes('mac') || ua.includes('macintosh') || ua.includes('mac os')) return 'macos';
  if (plat.includes('linux') || ua.includes('linux') || ua.includes('x11')) return 'linux';
  return 'unknown';
}

export function isNavbarInstallDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(DISMISS_NAVBAR_KEY) === '1';
  } catch {
    return false;
  }
}

export function dismissNavbarInstall(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DISMISS_NAVBAR_KEY, '1');
    window.dispatchEvent(new Event('hub:install-visibility-changed'));
  } catch {}
}

export function resetNavbarInstallDismiss(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(DISMISS_NAVBAR_KEY);
    window.dispatchEvent(new Event('hub:install-visibility-changed'));
  } catch {}
}

export async function checkAlreadyInstalled(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (isNativeOrDesktop()) return true;

  // PWA standalone mode (Desktop/Android/iOS WebApp instalado)
  const isStandaloneMatch =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches;
  const isIosStandalone =
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone);

  if (isStandaloneMatch || isIosStandalone) return true;

  // API getInstalledRelatedApps (Chrome/Edge/Android)
  const navWithRelated = navigator as Navigator & {
    getInstalledRelatedApps?: () => Promise<Array<{ platform?: string; id?: string; url?: string }>>;
  };
  if (typeof navWithRelated.getInstalledRelatedApps === 'function') {
    try {
      const related = await navWithRelated.getInstalledRelatedApps();
      if (Array.isArray(related) && related.length > 0) {
        return true;
      }
    } catch {
      // Ignora caso o browser restrinja a API
    }
  }

  return false;
}
