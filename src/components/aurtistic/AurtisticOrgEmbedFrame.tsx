'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, ExternalLink, Sparkles, LayoutDashboard, Palette, CheckCircle2, Download, Copy, Send, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

import Link from 'next/link';

export interface AurtisticOrgEmbedFrameProps {
  orgSlug?: 'show-da-fisica' | 'labdiv' | 'hs' | 'profis';
  mode?: 'org' | 'studio';
  heightClassName?: string;
  allowOrgSwitch?: boolean;
  hideInternalBar?: boolean;
}

function getAurtisticBase(): string {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost') || host.endsWith('.local')) {
      return process.env.NEXT_PUBLIC_AURTISTIC_URL || 'http://localhost:3000';
    }
  }
  return (process.env.NEXT_PUBLIC_AURTISTIC_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://aurtistic.vercel.app')).replace(/\/+$/, '');
}

export function AurtisticOrgEmbedFrame({
  orgSlug = 'labdiv',
  mode = 'org',
  heightClassName = 'h-[780px]',
  allowOrgSwitch = false,
  hideInternalBar = false,
}: AurtisticOrgEmbedFrameProps) {
  const [aurtisticBase, setAurtisticBase] = useState(getAurtisticBase);
  const [prevOrgSlug, setPrevOrgSlug] = useState(orgSlug);
  const [selectedSlug, setSelectedSlug] = useState<'show-da-fisica' | 'labdiv' | 'hs' | 'profis'>(orgSlug);
  const [prevMode, setPrevMode] = useState(mode);
  const [currentMode, setCurrentMode] = useState<'org' | 'studio'>(mode);
  const [authState, setAuthState] = useState<{
    path: string;
    ticket: string | null;
    error: string | null;
  }>({ path: '', ticket: null, error: null });

  if (orgSlug !== prevOrgSlug) {
    setPrevOrgSlug(orgSlug);
    setSelectedSlug(orgSlug);
  }
  if (mode !== prevMode) {
    setPrevMode(mode);
    setCurrentMode(mode);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const resolved = getAurtisticBase();
      setAurtisticBase((prev) => (prev === resolved ? prev : resolved));
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Preconnect e DNS-Prefetch dinâmicos para zerar latência TLS no handshake sem duplicação
  useEffect(() => {
    if (typeof document === 'undefined' || !aurtisticBase) return;
    const createdLinks: HTMLLinkElement[] = [];
    ['preconnect', 'dns-prefetch'].forEach((rel) => {
      const selector = `link[rel="${rel}"][href="${aurtisticBase}"]`;
      if (!document.head.querySelector(selector)) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = aurtisticBase;
        document.head.appendChild(link);
        createdLinks.push(link);
      }
    });
    return () => {
      createdLinks.forEach((l) => l.remove());
    };
  }, [aurtisticBase]);

  const [isIframeReady, setIsIframeReady] = useState(false);

  // Modal de Publicação do Studio no HUB
  const [studioPostData, setStudioPostData] = useState<{
    orgSlug: string;
    title: string;
    body: string;
    imageDataUrl: string;
    images?: string[];
    isCarousel?: boolean;
    aspect?: string;
    brandDisplayName?: string;
    badgeTag?: string;
    primaryColor?: string;
  } | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Listener para capturar posts do Studio, handshake pronto e navegação de retorno
  useEffect(() => {
    const handleStudioMessage = (event: MessageEvent) => {
      if (event.data?.type === 'AURTISTIC_EMBED_READY') {
        setIsIframeReady(true);
      }
      if (event.data?.type === 'AURTISTIC_STUDIO_PUBLISH_HUB') {
        const payload = event.data.payload;
        setStudioPostData(payload);
        setPreviewSlideIdx(0);
        setPublishSuccess(false);
      }
      if (event.data?.type === 'AURTISTIC_STUDIO_BACK_TO_ORG') {
        setCurrentMode('org');
      }
    };
    window.addEventListener('message', handleStudioMessage);
    return () => window.removeEventListener('message', handleStudioMessage);
  }, []);

  const targetPath =
    currentMode === 'studio'
      ? `/embed/org/${encodeURIComponent(selectedSlug)}?view=studio`
      : `/embed/org/${encodeURIComponent(selectedSlug)}`;

  useEffect(() => {
    setIsIframeReady(false);
  }, [targetPath, aurtisticBase]);

  const requestKey = `${aurtisticBase}::${targetPath}`;
  const loading = authState.path !== requestKey;
  const ticket = loading ? null : authState.ticket;
  const errorMsg = loading ? null : authState.error;

  useEffect(() => {
    let cancelled = false;

    fetch('/api/auth/sso/issue-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        redirectUri: `${aurtisticBase}${targetPath}`,
        next: targetPath,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ticket) {
          throw new Error(data?.error || 'Faça login no HUB para acessar o painel integrado.');
        }
        return data.ticket as string;
      })
      .then((t) => {
        if (!cancelled) {
          setAuthState({ path: requestKey, ticket: t, error: null });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setAuthState({
            path: requestKey,
            ticket: null,
            error: err instanceof Error ? err.message : 'Sessão não autenticada.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey, aurtisticBase, targetPath]);

  const handleConfirmPublishPost = async () => {
    if (!studioPostData) return;
    setIsPublishing(true);
    try {
      const res = await fetch('/api/iniciativas/publish-studio-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studioPostData),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setPublishSuccess(true);
        setTimeout(() => {
          setStudioPostData(null);
          setPublishSuccess(false);
        }, 2200);
      } else {
        alert(data.error || 'Erro ao publicar no HUB.');
      }
    } catch (e: unknown) {
      alert('Falha na conexão com o HUB: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDownloadImage = () => {
    if (!studioPostData?.imageDataUrl) return;
    const a = document.createElement('a');
    a.href = studioPostData.imageDataUrl;
    a.download = `${studioPostData.orgSlug}-post-${Date.now()}.png`;
    a.click();
  };

  const handleCopyCaption = () => {
    if (!studioPostData) return;
    const text = `${studioPostData.title}\n\n${studioPostData.body}\n\n#${studioPostData.orgSlug} #LabDiv #IFUSP`;
    navigator.clipboard.writeText(text);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  const iframeSrc = (() => {
    try {
      const url = new URL(targetPath, aurtisticBase);
      if (ticket) {
        url.searchParams.set('ticket', ticket);
      }
      return url.toString();
    } catch {
      return ticket
        ? `${aurtisticBase}${targetPath}${targetPath.includes('?') ? '&' : '?'}ticket=${encodeURIComponent(ticket)}`
        : `${aurtisticBase}${targetPath}`;
    }
  })();

  return (
    <div className={`w-full rounded-2xl border border-white/15 bg-[#07090e] overflow-hidden shadow-2xl flex flex-col ${heightClassName.includes('h-full') ? 'h-full flex-1' : ''}`}>
      {/* Modal / Drawer de Confirmação de Publicação no HUB */}
      {studioPostData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#0f172a] border border-[#1F9FCF]/30 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-5 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#1F9FCF]" />
                <h3 className="text-base font-bukra font-bold text-white">
                  Confirmar Publicação no HUB LabDiv
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setStudioPostData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Preview Imagem gerada no Studio (com suporte a Carrossel) */}
              <div className="md:col-span-5 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex flex-col items-center justify-center relative group min-h-[220px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    studioPostData.images && studioPostData.images.length > 0
                      ? studioPostData.images[previewSlideIdx] || studioPostData.imageDataUrl
                      : studioPostData.imageDataUrl
                  }
                  alt={studioPostData.title}
                  className="w-full h-auto object-contain max-h-56"
                />

                {/* Controles de Slide do Carrossel */}
                {studioPostData.images && studioPostData.images.length > 1 && (
                  <div className="absolute inset-x-0 bottom-2 flex items-center justify-between px-2 bg-black/70 py-1 backdrop-blur-sm rounded-lg mx-2 border border-white/10">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewSlideIdx((prev) =>
                          prev > 0 ? prev - 1 : (studioPostData.images?.length || 1) - 1
                        )
                      }
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-[10px] font-open-sans text-[#1F9FCF] font-bold">
                      Slide {previewSlideIdx + 1} de {studioPostData.images.length}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewSlideIdx((prev) =>
                          prev < (studioPostData.images?.length || 1) - 1 ? prev + 1 : 0
                        )
                      }
                      className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Textos e Ajustes */}
              <div className="md:col-span-7 space-y-3">
                <div>
                  <span className="text-[10px] font-open-sans uppercase tracking-wider text-[#1F9FCF] font-bold block mb-1">
                    @{studioPostData.orgSlug}
                  </span>
                  <input
                    type="text"
                    value={studioPostData.title}
                    onChange={(e) =>
                      setStudioPostData({ ...studioPostData, title: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-[#1F9FCF]"
                    placeholder="Título da publicação"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Legenda da postagem:
                  </label>
                  <textarea
                    rows={4}
                    value={studioPostData.body}
                    onChange={(e) =>
                      setStudioPostData({ ...studioPostData, body: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#1F9FCF] resize-none font-open-sans"
                    placeholder="Texto do post..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="flex-1 py-1.5 px-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar Imagem</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="flex-1 py-1.5 px-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCaption ? 'Copiado!' : 'Copiar Legenda'}</span>
                  </button>
                </div>
              </div>
            </div>

            {publishSuccess ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-center justify-center gap-2 font-bold animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Publicado com sucesso no feed do HUB LabDiv!</span>
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setStudioPostData(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-white/15 text-slate-300 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPublishPost}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-[#1F9FCF] hover:bg-[#198BB5] text-white shadow-lg shadow-[#1F9FCF]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPublishing ? 'Publicando...' : 'Confirmar e Publicar'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {!hideInternalBar ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-white/90 dark:bg-black/75 border-b border-slate-200 dark:border-white/10 backdrop-blur-md transition-colors">
          <div className="flex items-center gap-3">
            {/* Identidade Visual Aurtistic com Conexão Bilateral */}
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aurtistic/icon.png"
                alt="Aurtistic Icon"
                className="w-5 h-5 object-contain rounded-md shadow-sm"
              />
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 dark:text-slate-100">
                <span className="font-extrabold tracking-tight bg-gradient-to-r from-[#9D4EDD] via-[#C77DFF] to-[#FFCC00] bg-clip-text text-transparent">
                  Aurtistic
                </span>
                <span className="text-[10px] text-slate-400 font-normal">⇄</span>
                <span className="hidden sm:inline text-[10px] font-sans font-bold text-[#1F9FCF]">
                  HUB LabDiv
                </span>
              </div>
            </div>

            {/* Alternador de Modo / Botão Voltar */}
            <div className="flex items-center gap-2">
              {currentMode === 'studio' && (
                <button
                  type="button"
                  onClick={() => setCurrentMode('org')}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-[#FFCC00] bg-[#FFCC00]/15 border border-[#FFCC00]/30 hover:bg-[#FFCC00]/25 transition-all cursor-pointer"
                  title="Voltar para a gestão de operações da organização"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Voltar</span>
                </button>
              )}

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setCurrentMode('org')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentMode === 'org'
                    ? 'bg-[#FFCC00] text-black shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Painel da Equipe</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentMode('studio')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentMode === 'studio'
                    ? 'bg-[#1F9FCF] text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>HUB Studio</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {allowOrgSwitch && (
              <select
                value={selectedSlug}
                onChange={(e) => setSelectedSlug(e.target.value as 'show-da-fisica' | 'labdiv' | 'hs')}
                className="rounded-lg border border-white/20 bg-black px-2.5 py-1 text-xs font-bold text-white"
              >
                <option value="show-da-fisica">Show de Física</option>
                <option value="labdiv">LabDiv IFUSP</option>
                <option value="hs">Hackerspace IFUSP</option>
              </select>
            )}
            <a
              href={
                currentMode === 'studio'
                  ? `${aurtisticBase}/embed/studio?org=${encodeURIComponent(selectedSlug)}${ticket ? `&ticket=${encodeURIComponent(ticket)}` : ''}`
                  : `${aurtisticBase}/embed/org/${encodeURIComponent(selectedSlug)}${ticket ? `?ticket=${encodeURIComponent(ticket)}` : ''}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-300 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <span>Abrir em nova aba</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end px-4 py-1.5 bg-black/40 border-b border-white/5">
          <a
            href={
              currentMode === 'studio'
                ? `${aurtisticBase}/embed/studio?org=${encodeURIComponent(selectedSlug)}${ticket ? `&ticket=${encodeURIComponent(ticket)}` : ''}`
                : `${aurtisticBase}/embed/org/${encodeURIComponent(selectedSlug)}${ticket ? `?ticket=${encodeURIComponent(ticket)}` : ''}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-[#1F9FCF] transition-colors"
          >
            <span>Nova aba</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      {errorMsg ? (
        <div className="p-8 text-center space-y-4 rounded-3xl bg-[#0c1220] border border-white/10 max-w-lg mx-auto my-12">
          <div className="size-12 mx-auto rounded-2xl bg-brand-blue/20 text-brand-blue flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#FFCC00]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Acesso aos Bastidores da Organização</h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              {errorMsg.includes('autentic') || errorMsg.includes('ticket') || errorMsg.includes('sessão')
                ? 'Para visualizar os bastidores operacionais e o painel de equipe desta iniciativa, entre com sua conta do HUB.'
                : errorMsg}
            </p>
          </div>
          <Link
            href={`/login?next=${encodeURIComponent(`/gestao?org=${selectedSlug}`)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold font-bukra uppercase tracking-wider shadow-lg shadow-brand-blue/30 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-base">login</span>
            <span>Fazer Login no HUB para liberar o Painel</span>
          </Link>
        </div>
      ) : (
        <>
          {(loading || !isIframeReady) && (
            <div className={`w-full ${heightClassName} flex flex-col items-center justify-center gap-4 text-xs text-slate-300 p-8`}>
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9D4EDD]/30 via-[#C77DFF]/20 to-[#FFCC00]/20 animate-pulse border border-white/10 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/aurtistic/icon.png"
                    alt="Aurtistic"
                    className="w-6 h-6 object-contain opacity-80"
                  />
                </div>
                <Loader2 className="w-16 h-16 animate-spin text-[#1F9FCF]/40 absolute -inset-2" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold text-white tracking-wide">Conectando ecossistema integrado...</p>
                <p className="text-[11px] text-slate-400">Validando sessão segura SSO e liberando ferramentas</p>
              </div>
            </div>
          )}
          <iframe
            src={iframeSrc}
            title={currentMode === 'studio' ? 'Studio de Posts Aurtistic' : 'Gestão de Tarefas Aurtistic'}
            loading="eager"
            onLoad={() => setIsIframeReady(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads allow-modals"
            className={`w-full ${heightClassName} ${heightClassName.includes('h-full') ? 'flex-1 min-h-[580px]' : ''} border-0 bg-[#07090e] ${loading || !isIframeReady ? 'hidden' : ''}`}
            allow="camera; microphone; clipboard-write; clipboard-read"
          />
        </>
      )}
    </div>
  );
}
