'use client';

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

import React, { useEffect, useState, useSyncExternalStore, useTransition } from 'react';
import { Download, Laptop, Monitor, Smartphone } from 'lucide-react';
import { getDesktopReleaseAction } from '@/app/actions/desktop';
import {
  checkAlreadyInstalled,
  detectClientPlatform,
  isNavbarInstallDismissed,
} from '@/lib/desktop-bridge';
import type { DesktopPlatform, DesktopReleasePayload } from '@/types/desktop';
import {
  DesktopDownloadModal,
  type BeforeInstallPromptEvent,
} from './DesktopDownloadModal';

const emptySubscribe = () => () => {};

function getPlatformMeta(platform: DesktopPlatform): {
  label: string;
  shortLabel: string;
} {
  switch (platform) {
    case 'linux':
      return { label: 'Baixar HUB para Linux (.deb / .AppImage)', shortLabel: 'Linux' };
    case 'windows':
      return { label: 'Baixar HUB para Windows (.exe / Store)', shortLabel: 'Windows' };
    case 'macos':
      return { label: 'Baixar HUB para macOS (.dmg)', shortLabel: 'macOS' };
    case 'android':
      return { label: 'Instalar HUB no Android (Play Store)', shortLabel: 'Android' };
    case 'ios':
      return { label: 'Instalar WebApp do HUB no iOS', shortLabel: 'iOS' };
    default:
      return { label: 'Baixar aplicativo HUB LabDiv', shortLabel: 'App' };
  }
}

function PlatformIcon({ platform }: { platform: DesktopPlatform }) {
  if (platform === 'android' || platform === 'ios') {
    return <Smartphone className="size-4 sm:size-[18px]" />;
  }
  if (platform === 'macos') {
    return <Laptop className="size-4 sm:size-[18px]" />;
  }
  if (platform === 'linux' || platform === 'windows') {
    return <Monitor className="size-4 sm:size-[18px]" />;
  }
  return <Download className="size-4 sm:size-[18px]" />;
}

export function NavbarInstallButton() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<DesktopPlatform>('unknown');
  const [isModalOpen, setModalOpen] = useState(false);
  const [release, setRelease] = useState<DesktopReleasePayload | null>(null);
  const [isLoadingRelease, startTransition] = useTransition();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    let active = true;

    const evaluate = async () => {
      const installed = await checkAlreadyInstalled();
      if (!active) return;
      if (isNavbarInstallDismissed() || installed) {
        setVisible(false);
        return;
      }
      setPlatform(detectClientPlatform());
      setVisible(true);
    };

    void evaluate();

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    const handleVisibilityChange = () => {
      void evaluate();
    };
    const handleAppInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('hub:install-visibility-changed', handleVisibilityChange);

    return () => {
      active = false;
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('hub:install-visibility-changed', handleVisibilityChange);
    };
  }, []);

  if (!mounted || !visible) return null;

  const meta = getPlatformMeta(platform);

  const handleOpen = () => {
    setModalOpen(true);
    if (!release) {
      startTransition(async () => {
        try {
          const res = await getDesktopReleaseAction();
          if (res.success) setRelease(res.data);
        } catch {
          // Modal exibe fallback para GitHub Releases
        }
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        aria-label={meta.label}
        title={meta.label}
        className="relative flex size-8 sm:size-10 items-center justify-center rounded-xl bg-[#1F9FCF]/12 dark:bg-[#1F9FCF]/15 text-[#0F4780] dark:text-[#1F9FCF] hover:bg-[#1F9FCF]/25 border border-[#1F9FCF]/30 transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <PlatformIcon platform={platform} />
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-[#FFCC00] ring-2 ring-white dark:ring-[#121212]"
        />
      </button>

      <DesktopDownloadModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        initialRelease={release}
        isLoadingRelease={isLoadingRelease}
        initialPlatform={platform}
        deferredInstallPrompt={deferredPrompt}
        onDismissNavbar={() => setVisible(false)}
      />
    </>
  );
}
