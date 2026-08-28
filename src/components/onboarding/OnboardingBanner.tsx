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

import React from 'react';
import { usePathname } from 'next/navigation';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';
import { runGlobalTour, runPageTour } from '@/lib/tour/tour-runner';
import { getPageTourInfo } from '@/lib/tour/tour-data';
import { Sparkles, X, Globe } from 'lucide-react';

export function OnboardingBanner() {
    const { isDismissed, dismissOnboarding } = useOnboarding();
    const { userCategory } = useUserRoleNavigation();
    const pathname = usePathname();

    if (isDismissed) return null;

    const pageTour = getPageTourInfo(pathname || '/');

    return (
        <div className="w-[calc(100%-4.5rem)] md:w-full mx-auto md:mx-0 mb-3 sm:mb-4 bg-white/85 dark:bg-[#1E1E1E]/90 border border-gray-200 dark:border-white/10 rounded-2xl shadow-lg backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
            <div className="px-3 sm:px-5 py-2 sm:py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2 sm:gap-3 text-xs">
                {/* Left side: Icon + Title + Description (Mobile displays close X on the right) */}
                <div className="flex items-center justify-between md:justify-start gap-2 sm:gap-3.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 truncate">
                        <span className="flex items-center justify-center size-6 sm:size-7 rounded-lg sm:rounded-xl bg-brand-blue/15 text-brand-blue border border-brand-blue/25 shrink-0 shadow-sm">
                            <Sparkles className="size-3.5 sm:size-4 animate-pulse" />
                        </span>
                        <div className="flex items-center gap-1.5 sm:gap-2.5 truncate">
                            <span className="font-bukra font-bold text-[10px] sm:text-xs text-gray-900 dark:text-white tracking-wide uppercase truncate">
                                Como usar o HUB?
                            </span>
                            <span className="hidden lg:inline text-gray-500 dark:text-gray-400 text-[11px] font-sans">
                                Conheça os 3 eixos globais ou explore os recursos desta aba.
                            </span>
                        </div>
                    </div>

                    {/* Botão Fechar no Mobile (posicionado ergonomicamente no topo à direita) */}
                    <button
                        onClick={() => dismissOnboarding(true)}
                        className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                        title="Ocultar aviso de tutorial"
                        aria-label="Fechar aviso de tutorial"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>

                {/* Right side: Action buttons + Close button (Desktop) */}
                <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto shrink-0">
                    {/* Botão 1: Tutorial Geral (Global) */}
                    <button
                        onClick={() => runGlobalTour(userCategory)}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider border border-gray-200 dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm truncate"
                        title="Iniciar tutorial geral da plataforma (Navegação Global e 3 Eixos)"
                    >
                        <Globe className="size-3 text-brand-yellow shrink-0" />
                        <span className="truncate"><span className="hidden sm:inline">Tutorial </span>Geral</span>
                    </button>

                    {/* Botão 2: Tutorial Específico da Aba Atual */}
                    <button
                        onClick={() => runPageTour(pathname || '/')}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider shadow-md shadow-brand-blue/20 active:scale-95 transition-all cursor-pointer truncate"
                        title={`Iniciar ${pageTour.title}`}
                    >
                        <Sparkles className="size-3 shrink-0" />
                        <span className="truncate"><span className="hidden sm:inline">Aba </span>{pageTour.shortLabel}</span>
                    </button>

                    {/* Botão 3: Fechar Banner (Desktop) */}
                    <button
                        onClick={() => dismissOnboarding(true)}
                        className="hidden md:inline-flex p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
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
