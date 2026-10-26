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

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';
import { runGlobalTour, runEixoTour, runPageTour } from '@/lib/tour/tour-runner';
import { getPageTourInfo, getEixoTourInfo } from '@/lib/tour/tour-data';
import { Sparkles, X, Globe, Layers } from 'lucide-react';

export function OnboardingBanner() {
    const { isDismissed, dismissOnboarding } = useOnboarding();
    const { userCategory } = useUserRoleNavigation();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, setRenderTrigger] = useState(0);

    // Reatividade a cliques de troca de subaba no DOM e histórico com debounce
    useEffect(() => {
        let timeoutId: NodeJS.Timeout | null = null;
        const triggerUpdate = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setRenderTrigger(prev => prev + 1);
            }, 150);
        };

        window.addEventListener('popstate', triggerUpdate);

        let observer: MutationObserver | null = null;
        if (typeof document !== 'undefined') {
            observer = new MutationObserver(() => {
                triggerUpdate();
            });

            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['data-active', 'data-tour']
            });
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('popstate', triggerUpdate);
            if (observer) observer.disconnect();
        };
    }, []);

    if (isDismissed) return null;

    const currentPath = pathname || '/';
    const pageTour = getPageTourInfo(currentPath, searchParams);
    const eixoTour = getEixoTourInfo(currentPath);
    const isSocial = eixoTour.key === 'eixo-social';
    const isFerramentas = eixoTour.key === 'eixo-ferramentas' || eixoTour.key === 'eixo-observatorio' || eixoTour.key === 'eixo-ingresso';
    const isInformativo = eixoTour.key === 'eixo-informativo';

    const eixoColorConfig = isSocial
        ? {
            bg: 'bg-[#0F4780]/15 hover:bg-[#0F4780]/25 dark:bg-[#0F4780]/30 dark:hover:bg-[#0F4780]/45',
            text: 'text-[#0F4780] dark:text-blue-200',
            border: 'border-[#0F4780]/60 dark:border-blue-400/60',
            iconColor: 'text-[#0F4780] dark:text-[#1F9FCF]'
          }
        : isFerramentas
        ? {
            bg: 'bg-[#FFCC00]/20 hover:bg-[#FFCC00]/30 dark:bg-[#FFCC00]/25 dark:hover:bg-[#FFCC00]/35',
            text: 'text-amber-800 dark:text-[#FFCC00]',
            border: 'border-[#FFCC00]/80 dark:border-[#FFCC00]',
            iconColor: 'text-amber-600 dark:text-[#FFCC00]'
          }
        : {
            bg: 'bg-[#F14343]/15 hover:bg-[#F14343]/25 dark:bg-[#F14343]/25 dark:hover:bg-[#F14343]/35',
            text: 'text-[#F14343] dark:text-red-300',
            border: 'border-[#F14343]/60 dark:border-red-400/60',
            iconColor: 'text-[#F14343]'
          };

    return (
        <div className="w-[calc(100%-4.5rem)] md:w-full mx-auto md:mx-0 mb-3 sm:mb-4 relative p-[2px] rounded-2xl overflow-hidden shadow-lg shadow-[#0F4780]/15 transition-all animate-in fade-in slide-in-from-top-2 duration-300">
            {/* 🌀 Borda animada em degradê Azul -> Vermelho -> Amarelo com rotação a cada 7s */}
            <div 
                className="absolute inset-[-150%] pointer-events-none animate-border-spin-pause"
                style={{
                    background: 'conic-gradient(from 0deg, #0F4780 0deg, #F14343 120deg, #FFCC00 240deg, #0F4780 360deg)'
                }}
            />

            {/* Container Interno */}
            <div className="relative rounded-[14px] bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-2xl z-10 w-full h-full">
                <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3 text-xs">
                    {/* Left side: Icon + Title + Description */}
                    <div className="flex items-center justify-between xl:justify-start gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 truncate">
                            <span className="flex items-center justify-center size-8 sm:size-9 rounded-xl bg-gradient-to-br from-[#0F4780] to-[#1F9FCF] text-white border border-white/20 shrink-0 shadow-md shadow-[#0F4780]/25">
                                <Sparkles className="size-4 sm:size-4.5 animate-pulse" />
                            </span>
                            <div className="flex items-center gap-2 sm:gap-3 truncate">
                                <span className="font-bukra font-black text-xs sm:text-sm text-gray-900 dark:text-white tracking-wide uppercase truncate">
                                    Como usar o HUB?
                                </span>
                                <span className="hidden 2xl:inline text-gray-600 dark:text-gray-400 text-xs font-open-sans">
                                    Escolha entre o tour geral, o guia do eixo ou a explicação detalhada desta página.
                                </span>
                            </div>
                        </div>

                        {/* Botão Fechar no Mobile */}
                        <button
                            onClick={() => dismissOnboarding(true)}
                            className="xl:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                            title="Ocultar aviso de tutorial"
                            aria-label="Fechar aviso de tutorial"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Right side: 3 Action buttons (Geral, Eixo, Aba) + Close button */}
                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 w-full xl:w-auto shrink-0">
                        {/* Botão 1: Tutorial Geral (Global) - Degradê dos 3 Eixos */}
                        <button
                            onClick={() => runGlobalTour(userCategory)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] hover:brightness-110 text-white text-[10px] font-black font-bukra uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer truncate border-0"
                            title="Iniciar tutorial geral da plataforma (Navegação Global e 3 Eixos)"
                        >
                            <Globe className="size-3.5 text-white shrink-0" />
                            <span className="truncate">Geral</span>
                        </button>

                        {/* Botão 2: Tutorial do Eixo Atual (Cor Dinâmica do Eixo: Social=Azul, Ferramentas=Amarelo, Informativo=Vermelho) */}
                        <button
                            onClick={() => runEixoTour(currentPath)}
                            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl ${eixoColorConfig.bg} ${eixoColorConfig.text} text-[10px] font-black font-bukra uppercase tracking-wider border ${eixoColorConfig.border} active:scale-95 transition-all cursor-pointer shadow-sm truncate`}
                            title={`Iniciar ${eixoTour.title}`}
                        >
                            <Layers className={`size-3.5 ${eixoColorConfig.iconColor} shrink-0`} />
                            <span className="truncate sm:hidden">{eixoTour.shortLabel.replace(/^Eixo\s+/i, '')}</span>
                            <span className="truncate hidden sm:inline">{eixoTour.shortLabel}</span>
                        </button>

                        {/* Botão 3: Tutorial Específico da Aba Atual (Eixo 01 Azul) */}
                        <button
                            onClick={() => runPageTour(currentPath, searchParams)}
                            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] hover:brightness-110 text-white text-[10px] font-black font-bukra uppercase tracking-wider shadow-md shadow-[#0F4780]/30 active:scale-95 transition-all cursor-pointer truncate"
                            title={`Iniciar ${pageTour.title} (Explicação detalhada de cada seção)`}
                        >
                            <Sparkles className="size-3.5 shrink-0" />
                            <span className="truncate sm:hidden">{pageTour.shortLabel}</span>
                            <span className="truncate hidden sm:inline">Aba {pageTour.shortLabel}</span>
                        </button>

                        {/* Botão Fechar (Desktop) */}
                        <button
                            onClick={() => dismissOnboarding(true)}
                            className="hidden xl:inline-flex p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                            title="Ocultar aviso de tutorial"
                            aria-label="Fechar aviso de tutorial"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
