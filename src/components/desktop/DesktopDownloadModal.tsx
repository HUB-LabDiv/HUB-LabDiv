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

import React, { useState, useTransition } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Laptop,
  Monitor,
  Share,
  Smartphone,
  Terminal,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDesktopReleaseAction } from '@/app/actions/desktop';
import { detectClientPlatform, dismissNavbarInstall } from '@/lib/desktop-bridge';
import type { DesktopPlatform, DesktopReleasePayload } from '@/types/desktop';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface DesktopDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRelease?: DesktopReleasePayload | null;
  isLoadingRelease?: boolean;
  initialPlatform?: DesktopPlatform;
  deferredInstallPrompt?: BeforeInstallPromptEvent | null;
  onDismissNavbar?: () => void;
}

const PLATFORMS: { id: Exclude<DesktopPlatform, 'unknown'>; label: string }[] = [
  { id: 'linux', label: 'Linux' },
  { id: 'windows', label: 'Windows' },
  { id: 'macos', label: 'macOS' },
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS (WebApp)' },
];

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=br.usp.ifusp.hublabdiv&pcampaignid=web_share';

function formatSizeMb(bytes?: number | null): string {
  if (!bytes || bytes <= 0) return '';
  return ` (${(bytes / (1024 * 1024)).toFixed(1)} MB)`;
}

export function DesktopDownloadModal({
  isOpen,
  onClose,
  initialRelease = null,
  isLoadingRelease = false,
  initialPlatform,
  deferredInstallPrompt = null,
  onDismissNavbar,
}: DesktopDownloadModalProps) {
  const detected = initialPlatform && initialPlatform !== 'unknown' ? initialPlatform : detectClientPlatform();
  const defaultTab: Exclude<DesktopPlatform, 'unknown'> =
    detected === 'unknown' ? 'linux' : detected;

  const [activeTab, setActiveTab] = useState<Exclude<DesktopPlatform, 'unknown'>>(defaultTab);
  const [fetchedRelease, setFetchedRelease] = useState<DesktopReleasePayload | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const release = initialRelease ?? fetchedRelease;
  const loading = isLoadingRelease || isPending;

  const handleRetryReleaseFetch = () => {
    startTransition(async () => {
      try {
        const res = await getDesktopReleaseAction({ refresh: true });
        if (res.success && res.data) {
          setFetchedRelease(res.data);
          toast.success('Lista de versões atualizada!');
        }
      } catch {
        toast.error('Não foi possível consultar as versões agora.');
      }
    });
  };

  const handleCopy = async (text: string, key: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      toast.success(successMessage);
      setTimeout(() => setCopiedKey((curr) => (curr === key ? null : curr)), 2200);
    } catch {
      toast.error('Não foi possível copiar o comando automaticamente.');
    }
  };

  const handleInstallPwa = async () => {
    if (!deferredInstallPrompt) return;
    try {
      await deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        toast.success('HUB LabDiv instalado como WebApp!');
        onClose();
      }
    } catch {
      toast.error('Não foi possível iniciar a instalação PWA neste navegador.');
    }
  };

  const handleHideNavbarIcon = () => {
    dismissNavbarInstall();
    onDismissNavbar?.();
    toast.success('Ícone da barra ocultado. Você pode reativá-lo em Configurações.');
    onClose();
  };

  const fallbackReleasesUrl = release?.releasePageUrl || 'https://github.com/HUB-LabDiv/HUB-LabDiv/releases';

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-[#121212]/75 backdrop-blur-sm p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="hub-download-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#1E1E1E] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-white/10 shadow-2xl p-5 sm:p-7 space-y-5 font-open-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho M3 */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0F4780]/10 dark:bg-[#1F9FCF]/15 text-[#0F4780] dark:text-[#1F9FCF] text-[11px] font-bukra font-bold uppercase tracking-wider">
              <Monitor className="size-3.5" />
              <span>Multiplataforma • AGPLv3</span>
            </div>
            <h2
              id="hub-download-modal-title"
              className="text-lg sm:text-xl font-bukra font-black text-slate-900 dark:text-white leading-tight"
            >
              Baixar HUB LabDiv
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Use o HUB nativamente no Linux, Windows, macOS, Android ou WebApp no iOS.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela de download"
            className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer shrink-0"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* M3 Filter Chips de Plataforma */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Selecionar plataforma">
          {PLATFORMS.map((plat) => {
            const active = activeTab === plat.id;
            const isRecommended = detected === plat.id;
            return (
              <button
                key={plat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(plat.id)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-bukra font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  active
                    ? 'bg-[#0F4780] dark:bg-[#1F9FCF] text-white shadow-md'
                    : 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <span>{plat.label}</span>
                {isRecommended && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FFCC00] text-slate-950 text-[9px] font-black uppercase">
                    Seu SO
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Skeleton M3 durante carregamento */}
        {loading && !release ? (
          <div className="space-y-3 animate-pulse" aria-label="Carregando versões disponíveis">
            <div className="h-20 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06]" />
            <div className="h-24 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06]" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* LINUX */}
            {activeTab === 'linux' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={release?.assets.linuxDeb?.url || fallbackReleasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => toast.success('Iniciando download do pacote .deb')}
                    className="min-h-[48px] flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#1F9FCF] hover:brightness-110 text-white font-bukra font-bold text-xs shadow-lg shadow-[#1F9FCF]/20 transition-all"
                  >
                    <Download className="size-4 shrink-0" />
                    <span className="truncate">
                      Baixar .deb{formatSizeMb(release?.assets.linuxDeb?.sizeBytes)}
                    </span>
                  </a>

                  <a
                    href={release?.assets.linuxAppImage?.url || fallbackReleasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => toast.success('Iniciando download do .AppImage')}
                    className="min-h-[48px] flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-slate-100 dark:bg-white/[0.08] hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white font-bukra font-bold text-xs border border-slate-200 dark:border-white/10 transition-all"
                  >
                    <Laptop className="size-4 shrink-0" />
                    <span className="truncate">
                      Baixar .AppImage{formatSizeMb(release?.assets.linuxAppImage?.sizeBytes)}
                    </span>
                  </a>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bukra font-bold text-slate-800 dark:text-white">
                      <Terminal className="size-4 text-[#FFCC00]" />
                      <span>Repositório APT (Ubuntu / Zorin OS / Debian)</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFCC00]/20 text-amber-800 dark:text-[#FFCC00]">
                      {release?.version || 'v1.0.0'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-[11px] font-mono bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 overflow-x-auto whitespace-nowrap text-slate-800 dark:text-slate-200">
                      {release?.aptInstallCommand ||
                        'curl -fsSL https://hub-labdiv.github.io/HUB-LabDiv/apt/install.sh | sudo bash'}
                    </code>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          release?.aptInstallCommand ||
                            'curl -fsSL https://hub-labdiv.github.io/HUB-LabDiv/apt/install.sh | sudo bash',
                          'apt',
                          'Comando APT copiado!'
                        )
                      }
                      aria-label="Copiar comando APT"
                      className="min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl bg-[#0F4780] text-white hover:brightness-110 transition-all cursor-pointer shrink-0"
                    >
                      {copiedKey === 'apt' ? <Check className="size-4" /> : <Copy className="size-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    O pacote <strong>.deb</strong> integra com o menu do sistema e protocolo{' '}
                    <code>hublabdiv://</code>. O <strong>.AppImage</strong> possui auto-update embutido.
                  </p>
                </div>
              </div>
            )}

            {/* WINDOWS */}
            {activeTab === 'windows' && (
              <div className="space-y-3">
                <a
                  href={release?.assets.windowsExe?.url || fallbackReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => toast.success('Iniciando download do instalador Windows (.exe)')}
                  className="min-h-[48px] w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1F9FCF] hover:brightness-110 text-white font-bukra font-bold text-xs shadow-lg shadow-[#1F9FCF]/20 transition-all"
                >
                  <Download className="size-4 shrink-0" />
                  <span>
                    Baixar Instalador Windows (.exe x64){formatSizeMb(release?.assets.windowsExe?.sizeBytes)}
                  </span>
                </a>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-bukra font-bold text-slate-900 dark:text-white">
                      Microsoft Store (Windows 10/11)
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Atualizações gerenciadas diretamente pela loja oficial da Microsoft.
                    </p>
                  </div>
                  {release?.msStoreUrl ? (
                    <a
                      href={release.msStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[48px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#0F4780] text-white font-bukra font-bold text-xs shrink-0 hover:brightness-110"
                    >
                      <span>Abrir na Store</span>
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full bg-[#FFCC00]/20 text-amber-800 dark:text-[#FFCC00] text-[11px] font-bold shrink-0">
                      Em breve na Microsoft Store
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* MACOS */}
            {activeTab === 'macos' && (
              <div className="space-y-3">
                <a
                  href={release?.assets.macDmg?.url || fallbackReleasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => toast.success('Iniciando download do pacote macOS (.dmg)')}
                  className="min-h-[48px] w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#1F9FCF] hover:brightness-110 text-white font-bukra font-bold text-xs shadow-lg shadow-[#1F9FCF]/20 transition-all"
                >
                  <Download className="size-4 shrink-0" />
                  <span>
                    Baixar para macOS (.dmg Universal){formatSizeMb(release?.assets.macDmg?.sizeBytes)}
                  </span>
                </a>
                <p className="text-xs text-slate-600 dark:text-slate-400 px-1">
                  Compatível com Apple Silicon (M1–M4) e Intel. Arraste o <strong>HUB LabDiv</strong>{' '}
                  para a pasta Aplicativos após abrir a imagem.
                </p>
              </div>
            )}

            {/* ANDROID */}
            {activeTab === 'android' && (
              <div className="space-y-3">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[48px] w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#0F4780] hover:brightness-110 text-white font-bukra font-bold text-xs shadow-lg transition-all"
                >
                  <Smartphone className="size-4 shrink-0" />
                  <span>Instalar pela Google Play Store</span>
                  <ExternalLink className="size-3.5 shrink-0" />
                </a>
                <p className="text-xs text-slate-600 dark:text-slate-400 px-1">
                  Aplicativo nativo Android com notificações push, cache offline do CGIF e widgets rápidos.
                </p>
              </div>
            )}

            {/* IOS */}
            {activeTab === 'ios' && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bukra font-bold text-slate-900 dark:text-white">
                  <Share className="size-4 text-[#1F9FCF]" />
                  <span>Instalar como WebApp no iPhone / iPad</span>
                </div>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>
                    Abra <strong>www.hublabdiv.com.br</strong> no navegador <strong>Safari</strong>.
                  </li>
                  <li>
                    Toque no botão <strong>Compartilhar</strong> na barra inferior.
                  </li>
                  <li>
                    Escolha <strong>Adicionar à Tela de Início</strong> e confirme em{' '}
                    <strong>Adicionar</strong>.
                  </li>
                </ol>
              </div>
            )}

            {!release?.available && (
              <div className="p-3 rounded-2xl bg-[#F14343]/10 border border-[#F14343]/25 text-xs text-[#F14343] flex flex-wrap items-center justify-between gap-2">
                <span>Binários ainda não publicados na tag atual ou API do GitHub limitada.</span>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleRetryReleaseFetch}
                    className="font-bold underline cursor-pointer"
                  >
                    Tentar atualizar
                  </button>
                  <a
                    href={fallbackReleasesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline"
                  >
                    Ver Releases
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rodapé com opção PWA / Ocultar ícone da Navbar */}
        <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {deferredInstallPrompt && (
              <button
                type="button"
                onClick={handleInstallPwa}
                className="min-h-[44px] px-4 py-2 rounded-full bg-[#FFCC00] text-slate-950 font-bukra font-bold text-xs hover:brightness-105 transition-all cursor-pointer"
              >
                Instalar WebApp (PWA)
              </button>
            )}
            <a
              href={fallbackReleasesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-[#1F9FCF] transition-colors"
            >
              <span>Todas as versões no GitHub</span>
              <ExternalLink className="size-3.5" />
            </a>
          </div>

          <button
            type="button"
            onClick={handleHideNavbarIcon}
            className="min-h-[44px] px-3 py-2 rounded-full text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            Já instalei (ocultar ícone)
          </button>
        </div>
      </div>
    </div>
  );
}
