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
import {
  CalendarClock,
  FolderSync,
  HardDrive,
  Monitor,
  Pause,
  Play,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Upload,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDesktopReleaseAction, getUpcomingAcademicEventsAction } from '@/app/actions/desktop';
import {
  getHubDesktopBridge,
  isDesktopApp,
  isNavbarInstallDismissed,
  resetNavbarInstallDismiss,
} from '@/lib/desktop-bridge';
import type {
  DesktopMirrorFolderDto,
  DesktopReleasePayload,
  DesktopTransferItemDto,
  HubDesktopAppInfo,
  HubDesktopPreferences,
} from '@/types/desktop';
import { DesktopDownloadModal } from './DesktopDownloadModal';

const emptySubscribe = () => () => {};
const subscribeNavbarVisibility = (cb: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('hub:install-visibility-changed', cb);
  return () => window.removeEventListener('hub:install-visibility-changed', cb);
};

export function DesktopControlPanel() {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const desktopMode = mounted && isDesktopApp();
  const navbarDismissed = useSyncExternalStore(
    subscribeNavbarVisibility,
    () => isNavbarInstallDismissed(),
    () => false
  );
  const [downloadOpen, setDownloadOpen] = useState(false);
  const [release, setRelease] = useState<DesktopReleasePayload | null>(null);
  const [isLoadingRelease, startReleaseTransition] = useTransition();

  const [appInfo, setAppInfo] = useState<HubDesktopAppInfo | null>(null);
  const [prefs, setPrefs] = useState<HubDesktopPreferences>({
    closeToTray: true,
    eyeRestAutoOverlay: false,
    storageOptIn: false,
  });
  const [credStatus, setCredStatus] = useState<{
    secureAvailable: boolean;
    backend: string;
    reason?: string;
  } | null>(null);
  const [mirrors, setMirrors] = useState<DesktopMirrorFolderDto[]>([]);
  const [transfers, setTransfers] = useState<DesktopTransferItemDto[]>([]);

  const [lanUrl, setLanUrl] = useState('http://192.168.1.50:3000');
  const [remoteUrl, setRemoteUrl] = useState('https://storage.hublabdiv.com.br');
  const [remoteFolder, setRemoteFolder] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenSecret, setTokenSecret] = useState('');
  const [isSyncingAgenda, startAgendaTransition] = useTransition();
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);

  const refreshDesktopLists = async () => {
    const bridge = getHubDesktopBridge();
    if (!bridge) return;
    try {
      const [info, p, cStatus, mList, tList] = await Promise.all([
        bridge.getAppInfo(),
        bridge.getPreferences(),
        bridge.getCredentialStatus(),
        bridge.listMirrorFolders(),
        bridge.listTransfers(),
      ]);
      setAppInfo(info);
      setPrefs(p);
      setCredStatus(cStatus);
      setMirrors(mList);
      setTransfers(tList);
    } catch {
      // Fallback silencioso
    }
  };

  useEffect(() => {
    if (!desktopMode) return;
    const bridge = getHubDesktopBridge();
    if (!bridge) return;
    let active = true;
    void (async () => {
      try {
        const [info, p, cStatus, mList, tList] = await Promise.all([
          bridge.getAppInfo(),
          bridge.getPreferences(),
          bridge.getCredentialStatus(),
          bridge.listMirrorFolders(),
          bridge.listTransfers(),
        ]);
        if (!active) return;
        setAppInfo(info);
        setPrefs(p);
        setCredStatus(cStatus);
        setMirrors(mList);
        setTransfers(tList);
      } catch {
        // Fallback silencioso
      }
    })();
    return () => {
      active = false;
    };
  }, [desktopMode]);

  if (!mounted) {
    return (
      <div className="p-5 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/5 animate-pulse h-24" />
    );
  }

  // Modo Web: CTA compacto para baixar o app ou reexibir ícone da Navbar
  if (!desktopMode) {
    return (
      <>
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-lg">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-[#1F9FCF]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide font-bukra">
                HUB LabDiv no Computador &amp; Celular
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400 leading-relaxed font-open-sans">
              Instale a versão Desktop nativa (Linux .deb/.AppImage, Windows ou macOS) com bandeja do sistema, notificações locais e login seguro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
            {navbarDismissed && (
              <button
                type="button"
                onClick={() => {
                  resetNavbarInstallDismiss();
                  toast.success('Ícone de instalação reativado na barra superior.');
                }}
                className="min-h-[44px] px-3 py-2 rounded-full bg-slate-200/70 dark:bg-white/10 text-slate-800 dark:text-white font-bukra text-[10px] font-bold uppercase tracking-wider cursor-pointer"
              >
                Reexibir ícone na barra
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setDownloadOpen(true);
                if (!release) {
                  startReleaseTransition(async () => {
                    try {
                      const res = await getDesktopReleaseAction();
                      if (res.success) setRelease(res.data);
                    } catch {
                      // Modal exibirá fallback
                    }
                  });
                }
              }}
              className="min-h-[48px] px-4 py-2 rounded-full bg-[#1F9FCF] hover:brightness-110 text-white font-bukra text-[11px] font-black uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              Baixar para PC / Celular
            </button>
          </div>
        </div>

        <DesktopDownloadModal
          isOpen={downloadOpen}
          onClose={() => setDownloadOpen(false)}
          initialRelease={release}
          isLoadingRelease={isLoadingRelease}
        />
      </>
    );
  }

  // Modo Electron Desktop: Painel Completo
  const bridge = getHubDesktopBridge();
  if (!bridge) return null;

  const updatePref = async (patch: Partial<HubDesktopPreferences>, msg: string) => {
    try {
      const updated = await bridge.setPreferences(patch);
      setPrefs(updated);
      toast.success(msg);
    } catch {
      toast.error('Erro ao salvar preferência do aplicativo Desktop.');
    }
  };

  const handleCheckUpdates = async () => {
    setIsCheckingUpdates(true);
    try {
      const res = await bridge.checkForUpdates();
      if (res.channel === 'apt') {
        toast('No pacote .deb, atualize com: sudo apt update && sudo apt upgrade hub-labdiv', {
          icon: '📦',
          duration: 6000,
        });
      } else if (res.channel === 'manual-github') {
        toast('Versão sem assinatura Apple: acompanhe novas builds no GitHub Releases.', {
          icon: '🍏',
          duration: 6000,
        });
      } else if (res.supported) {
        toast.success('Verificação de atualização iniciada.');
      }
    } catch {
      toast.error('Falha ao verificar atualizações.');
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const handleSyncAgenda = () => {
    startAgendaTransition(async () => {
      try {
        const res = await getUpcomingAcademicEventsAction({ daysAhead: 7 });
        if (!res.success || !res.data) {
          toast.error(res.error || 'Faça login para sincronizar sua agenda.');
          return;
        }
        const synced = await bridge.syncAcademicEvents(res.data);
        toast.success(`${synced.count} evento(s) acadêmico(s) sincronizado(s) com o Desktop!`);
      } catch {
        toast.error('Falha ao sincronizar eventos locais.');
      }
    });
  };

  const handleProbeLan = async () => {
    const res = await bridge.probeLan(lanUrl);
    if (res.reachable) {
      toast.success(`Servidor Local (LAN) acessível (${res.latencyMs ?? 0}ms).`);
    } else {
      toast.error('Servidor Local (LAN) inacessível ou bloqueado pela política de rede.');
    }
  };

  const handleSaveCred = async () => {
    if (!tokenId.trim() || !tokenSecret.trim()) {
      toast.error('Preencha ID do Token e Chave Secreta.');
      return;
    }
    try {
      await bridge.saveCredential({ scopeKey: 'personal', tokenId: tokenId.trim(), secret: tokenSecret.trim() });
      setTokenSecret('');
      toast.success('Credencial protegida no chaveiro seguro do sistema!');
      await refreshDesktopLists();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar credencial.');
    }
  };

  const handleSelectMirror = async () => {
    try {
      const added = await bridge.selectMirrorFolder({
        remoteFolder: remoteFolder.trim(),
        scopeKey: 'personal',
        remoteServerUrl: remoteUrl.trim(),
        lanServerUrl: lanUrl.trim() || undefined,
      });
      if (added) {
        toast.success('Pasta adicionada ao espelhamento automático.');
        await refreshDesktopLists();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Erro ao configurar pasta.');
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Versão, Bandeja & Atualizações */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Monitor className="size-4 text-[#1F9FCF]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide font-bukra">
                HUB LabDiv Desktop
              </span>
              {appInfo && (
                <span className="px-2 py-0.5 rounded-full bg-[#0F4780]/15 dark:bg-[#1F9FCF]/20 text-[#0F4780] dark:text-[#1F9FCF] text-[10px] font-bold">
                  v{appInfo.version} • {appInfo.updateChannel}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              {appInfo?.isWindowsStore
                ? 'Atualizações gerenciadas pela Microsoft Store.'
                : 'Configurações nativas do aplicativo Desktop.'}
            </p>
          </div>

          {!appInfo?.isWindowsStore && (
            <button
              type="button"
              disabled={isCheckingUpdates}
              onClick={handleCheckUpdates}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F4780] hover:bg-[#1F9FCF] text-white font-bukra text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`size-3.5 ${isCheckingUpdates ? 'animate-spin' : ''}`} />
              <span>Verificar atualizações</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="p-3.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Minimizar para a bandeja ao fechar janela
            </span>
            <input
              type="checkbox"
              checked={prefs.closeToTray}
              onChange={(e) =>
                void updatePref(
                  { closeToTray: e.target.checked },
                  e.target.checked
                    ? 'Fechar a janela minimizará para a bandeja.'
                    : 'Fechar a janela encerrará o aplicativo.'
                )
              }
              className="size-5 accent-[#1F9FCF]"
            />
          </label>

          <label className="p-3.5 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-3 cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Abrir janela na pausa visual 20-20-20
            </span>
            <input
              type="checkbox"
              checked={prefs.eyeRestAutoOverlay}
              onChange={(e) =>
                void updatePref(
                  { eyeRestAutoOverlay: e.target.checked },
                  'Preferência de pausa visual atualizada.'
                )
              }
              className="size-5 accent-[#1F9FCF]"
            />
          </label>
        </div>
      </div>

      {/* 2. Lembretes Acadêmicos Nativos */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="size-4 text-[#FFCC00]" />
            <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide font-bukra">
              Agenda Acadêmica na Bandeja
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-gray-400">
            Sincroniza suas aulas, provas e lembretes dos próximos 7 dias para alertas nativos no SO.
          </p>
        </div>
        <button
          type="button"
          disabled={isSyncingAgenda}
          onClick={handleSyncAgenda}
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFCC00] text-slate-950 font-bukra text-[11px] font-black uppercase tracking-wider hover:brightness-105 transition-all cursor-pointer shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`size-3.5 ${isSyncingAgenda ? 'animate-spin' : ''}`} />
          <span>Sincronizar agenda</span>
        </button>
      </div>

      {/* 3. Cofre Edge & Espelhamento (Opt-in) */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1E1E1E] border border-slate-200 dark:border-white/5 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <HardDrive className="size-4 text-[#1F9FCF]" />
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide font-bukra">
                Armazenamento &amp; Espelhamento Local (Opt-in)
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-gray-400">
              Conecte seu Servidor Local (LAN) ou storage remoto com credenciais cifradas no chaveiro do sistema.
            </p>
          </div>

          <input
            type="checkbox"
            aria-label="Ativar recursos de armazenamento e espelhamento local"
            checked={prefs.storageOptIn}
            onChange={(e) =>
              void updatePref(
                { storageOptIn: e.target.checked },
                e.target.checked ? 'Recursos avançados de armazenamento ativados.' : 'Recursos recolhidos.'
              )
            }
            className="size-5 accent-[#1F9FCF] cursor-pointer"
          />
        </div>

        {prefs.storageOptIn && (
          <div className="space-y-4 pt-3 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
              <span>
                Chaveiro do sistema ({credStatus?.backend || 'SO'}):{' '}
                <strong>{credStatus?.secureAvailable ? 'Ativo e cifrado' : credStatus?.reason || 'Indisponível'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Servidor Remoto (HTTPS)
                </label>
                <input
                  type="url"
                  value={remoteUrl}
                  onChange={(e) => setRemoteUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Servidor Local (LAN)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={lanUrl}
                    onChange={(e) => setLanUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleProbeLan}
                    className="px-3 py-2 rounded-xl bg-[#0F4780] text-white text-[11px] font-bold cursor-pointer"
                  >
                    Testar LAN
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="ID do Token"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs"
              />
              <input
                type="password"
                placeholder="Segredo do Token"
                value={tokenSecret}
                onChange={(e) => setTokenSecret(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs"
              />
              <button
                type="button"
                onClick={handleSaveCred}
                className="px-3 py-2 rounded-xl bg-[#1F9FCF] text-white text-xs font-bold cursor-pointer"
              >
                Salvar no Chaveiro
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Pasta remota opcional (ex: acervo/estudos)"
                value={remoteFolder}
                onChange={(e) => setRemoteFolder(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 text-xs"
              />
              <button
                type="button"
                onClick={handleSelectMirror}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F4780] text-white text-xs font-bold cursor-pointer"
              >
                <FolderSync className="size-4" />
                <span>Espelhar Pasta Local</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const files = await bridge.selectUploadFiles();
                  if (files.length > 0) {
                    toast.success(`${files.length} arquivo(s) selecionado(s) e autorizado(s).`);
                  }
                }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white text-xs font-bold cursor-pointer"
              >
                <Upload className="size-4" />
                <span>Selecionar Arquivos</span>
              </button>
            </div>

            {mirrors.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Pastas Espelhadas ({mirrors.length})
                </p>
                {mirrors.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{m.localDir}</p>
                      <p className="text-[11px] text-slate-500">
                        Status: {m.status} {m.lastError ? `• ${m.lastError}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={async () => {
                          await bridge.triggerMirrorSync(m.id);
                          await refreshDesktopLists();
                        }}
                        className="p-2 rounded-lg bg-[#1F9FCF]/15 text-[#1F9FCF] cursor-pointer"
                        title="Sincronizar agora"
                      >
                        <RefreshCw className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          await bridge.removeMirrorFolder(m.id);
                          await refreshDesktopLists();
                        }}
                        className="p-2 rounded-lg bg-[#F14343]/15 text-[#F14343] cursor-pointer"
                        title="Remover espelhamento"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {transfers.length > 0 && (
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Fila de Transferências ({transfers.length})
                </p>
                {transfers.slice(0, 5).map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{t.filename}</p>
                      <p className="text-[11px] text-slate-500">
                        {t.direction} • {t.state} • {t.progressPercent}%
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.state === 'running' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await bridge.pauseTransfer(t.id);
                            await refreshDesktopLists();
                          }}
                          className="p-2 rounded-lg bg-slate-200 dark:bg-white/10 cursor-pointer"
                        >
                          <Pause className="size-3.5" />
                        </button>
                      ) : t.state === 'paused' || t.state === 'failed' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            await bridge.resumeTransfer(t.id);
                            await refreshDesktopLists();
                          }}
                          className="p-2 rounded-lg bg-[#1F9FCF]/15 text-[#1F9FCF] cursor-pointer"
                        >
                          <Play className="size-3.5" />
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={async () => {
                          await bridge.cancelTransfer(t.id);
                          await refreshDesktopLists();
                        }}
                        className="p-2 rounded-lg bg-[#F14343]/15 text-[#F14343] cursor-pointer"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
