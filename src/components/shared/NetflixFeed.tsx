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

import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NetflixFeedProps {
    title: string;
    icon?: React.ReactNode;
    subtitle?: string;
    badgeText?: string;
    filterBar?: React.ReactNode;
    children: React.ReactNode;
    expandable?: boolean;
    defaultExpanded?: boolean;
    headerAction?: React.ReactNode;
}

export function NetflixFeed({
    title,
    icon,
    subtitle,
    badgeText,
    filterBar,
    children,
    headerAction
}: NetflixFeedProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === 'left' ? -420 : 420;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="space-y-4">
            {/* Header com Título, Badges e Botões de Scroll Horizontal */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                    {icon && <div className="shrink-0">{icon}</div>}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white font-bukra">
                                {title}
                            </h2>
                            {badgeText && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-[#FFCC00] text-[10px] font-black uppercase tracking-wider font-bukra">
                                    {badgeText}
                                </span>
                            )}
                        </div>
                        {subtitle && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-0.5 line-clamp-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                {/* Controles de Ação e Navegação Horizontal */}
                <div className="flex items-center gap-2 shrink-0">
                    {headerAction}
                    <div className="hidden sm:flex items-center gap-1">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                            aria-label="Rolar para esquerda"
                            title="Rolar para esquerda"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                            aria-label="Rolar para direita"
                            title="Rolar para direita"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Barra de Filtros */}
            {filterBar && <div className="pt-0">{filterBar}</div>}

            {/* Feed Horizontal com Scroll Suave e Snap */}
            <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-5 sm:gap-6 pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 [&>*]:shrink-0"
            >
                {children}
            </div>
        </section>
    );
}
