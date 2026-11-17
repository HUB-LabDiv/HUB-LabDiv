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
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight, Heart } from 'lucide-react';

interface CollabPost {
    id: string;
    title: string;
    desc: string;
    experimentSlug?: string;
    img: string;
    themeClass: 'neon-border-red' | 'neon-border-blue' | 'neon-border-green';
    titleClass: 'neon-text-red' | 'neon-text-blue' | 'neon-text-green';
}

const COLLAB_EXPERIMENTS: CollabPost[] = [
    {
        id: '1',
        title: 'Máquina de Wimshurst',
        desc: 'Alta tensão eletrostática e descargas em cadeia com o público no palco.',
        experimentSlug: 'wimshurst',
        img: '/show/show-wimshurst.jpg',
        themeClass: 'neon-border-blue',
        titleClass: 'neon-text-blue',
    },
    {
        id: '2',
        title: 'Canhão de Vórtice',
        desc: 'Vórtices toroidais e conservação de momento com anéis gigantes viajando pelo auditório.',
        experimentSlug: 'fumaca',
        img: '/show/show-canhao-vortice.jpg',
        themeClass: 'neon-border-green',
        titleClass: 'neon-text-green',
    },
    {
        id: '3',
        title: 'Bobina de Tesla',
        desc: 'Centelhas no ar e lâmpadas fluorescentes acendendo nas mãos sem qualquer fio conectado.',
        experimentSlug: 'tesla',
        img: '/show/show-bobina-tesla.jpg',
        themeClass: 'neon-border-blue',
        titleClass: 'neon-text-blue',
    },
    {
        id: '4',
        title: 'Nitrogênio Líquido (-196°C)',
        desc: 'Criogenia extrema: nuvens colossais de vapor e transições de fase no clímax do espetáculo.',
        experimentSlug: 'nitrogenio',
        img: '/show/show-nuvem-nitrogenio.jpg',
        themeClass: 'neon-border-red',
        titleClass: 'neon-text-red',
    },
    {
        id: '5',
        title: 'Garrafa de Combustão & Gases',
        desc: 'Reação rápida de combustão de vapores e expansão térmica controlada no auditório.',
        experimentSlug: 'combustao',
        img: '/show/show-garrafa-combustao.jpg',
        themeClass: 'neon-border-green',
        titleClass: 'neon-text-green',
    },
];

export function Block3CollabCarousel() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <section className="py-20 border-b-2 border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-green mb-2">
                            Feed do Show & Nossos Experimentos
                        </h2>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-300">
                            Publicações e demonstrações do palco integradas à rede de divulgação do HUB LabDiv.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => scroll('left')}
                            aria-label="Rolar para a esquerda"
                            className="p-3 bg-white dark:bg-black neon-border-blue text-gray-900 dark:text-white hover:bg-[#002ffe] hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            aria-label="Rolar para a direita"
                            className="p-3 bg-white dark:bg-black neon-border-blue text-gray-900 dark:text-white hover:bg-[#002ffe] hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carrossel Horizontal com Molduras Neon */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scrollbar-none"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {COLLAB_EXPERIMENTS.map((post) => (
                        <div
                            key={post.id}
                            className={`min-w-[300px] sm:min-w-[380px] max-w-[420px] snap-start bg-black ${post.themeClass} overflow-hidden flex flex-col justify-between group shadow-xl rounded-none`}
                        >
                            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                                <Image
                                    src={post.img}
                                    alt={post.title}
                                    fill
                                    className="object-cover opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4 z-10">
                                    <h3 className={`text-xl font-bold uppercase tracking-wider ${post.titleClass} mb-1`}>
                                        {post.title}
                                    </h3>
                                    <p className="text-xs font-sans text-gray-200 line-clamp-2">
                                        {post.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 bg-black border-t border-white/10 flex items-center justify-between text-xs">
                                {post.experimentSlug ? (
                                    <Link
                                        href={`/experimentos/${post.experimentSlug}`}
                                        className="font-bold text-[#002ffe] dark:text-[#38bdf8] uppercase tracking-wider inline-flex items-center gap-1 hover:underline"
                                    >
                                        <span>Ver Detalhes</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                ) : (
                                    <span className="text-gray-400 font-mono text-[10px]">Show IFUSP</span>
                                )}

                                <div className="flex items-center gap-1 text-gray-400 font-mono text-[10px]">
                                    <Heart className="w-3 h-3 text-[#f60011] fill-current" />
                                    <span>HUB Collab</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
