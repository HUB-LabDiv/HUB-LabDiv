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

    // Reatividade a cliques de troca de subaba no DOM e histórico
    useEffect(() => {
        const handleStateChange = () => setRenderTrigger(prev => prev + 1);
        window.addEventListener('popstate', handleStateChange);

        const observer = new MutationObserver(() => {
            setRenderTrigger(prev => prev + 1);
        });

        if (typeof document !== 'undefined') {
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'data-active', 'data-tour']
            });
        }

        return () => {
            window.removeEventListener('popstate', handleStateChange);
            observer.disconnect();
        };
    }, []);

    if (isDismissed) return null;

    const currentPath = pathname || '/';
    const pageTour = getPageTourInfo(currentPath, searchParams);
    const eixoTour = getEixoTourInfo(currentPath);

    return (
        <div className="w-[calc(100%-4.5rem)] md:w-full mx-auto md:mx-0 mb-3 sm:mb-4 bg-white/85 dark:bg-[#1E1E1E]/90 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
            <div className="px-3 sm:px-5 py-2 sm:py-2.5 flex flex-col xl:flex-row xl:items-center justify-between gap-2 sm:gap-3 text-xs">
                {/* Left side: Icon + Title + Description */}
                <div className="flex items-center justify-between xl:justify-start gap-2 sm:gap-3.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 truncate">
                        <span className="flex items-center justify-center size-6 sm:size-7 rounded-lg sm:rounded-xl bg-brand-blue/15 text-brand-blue border border-brand-blue/25 shrink-0 shadow-sm">
                            <Sparkles className="size-3.5 sm:size-4 animate-pulse" />
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2.5 truncate">
                            <span className="font-bukra font-bold text-[10px] sm:text-xs text-gray-900 dark:text-white tracking-wide uppercase truncate">
                                Como usar o HUB?
                            </span>
                            <span className="hidden 2xl:inline text-gray-500 dark:text-gray-400 text-[11px] font-sans">
                                Escolha entre o tour geral, o guia do eixo ou a explicação detalhada desta página.
                            </span>
                        </div>
                    </div>

                    {/* Botão Fechar no Mobile */}
                    <button
                        onClick={() => dismissOnboarding(true)}
                        className="xl:hidden p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                        title="Ocultar aviso de tutorial"
                        aria-label="Fechar aviso de tutorial"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>

                {/* Right side: 3 Action buttons (Geral, Eixo, Aba) + Close button */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5 sm:gap-2 w-full xl:w-auto shrink-0">
                    {/* Botão 1: Tutorial Geral (Global) */}
                    <button
                        onClick={() => runGlobalTour(userCategory)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider border border-gray-200 dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm truncate"
                        title="Iniciar tutorial geral da plataforma (Navegação Global e 3 Eixos)"
                    >
                        <Globe className="size-3 text-brand-yellow shrink-0" />
                        <span className="truncate">Geral</span>
                    </button>

                    {/* Botão 2: Tutorial do Eixo Atual */}
                    <button
                        onClick={() => runEixoTour(currentPath)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider border border-gray-200 dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm truncate"
                        title={`Iniciar ${eixoTour.title}`}
                    >
                        <Layers className="size-3 text-brand-blue shrink-0" />
                        <span className="truncate">{eixoTour.shortLabel}</span>
                    </button>

                    {/* Botão 3: Tutorial Específico da Aba Atual (Seção por Seção) */}
                    <button
                        onClick={() => runPageTour(currentPath, searchParams)}
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider shadow-md shadow-brand-blue/20 active:scale-95 transition-all cursor-pointer truncate"
                        title={`Iniciar ${pageTour.title} (Explicação detalhada de cada seção)`}
                    >
                        <Sparkles className="size-3 shrink-0" />
                        <span className="truncate">Aba {pageTour.shortLabel}</span>
                    </button>

                    {/* Botão Fechar (Desktop) */}
                    <button
                        onClick={() => dismissOnboarding(true)}
                        className="hidden xl:inline-flex p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                        title="Ocultar aviso de tutorial"
                        aria-label="Fechar aviso de tutorial"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
