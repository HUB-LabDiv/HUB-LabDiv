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
import Link from 'next/link';
import { ArrowRight, Sparkles, Terminal } from 'lucide-react';

export function Block1HeroMarquee() {
    return (
        <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b-2 border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
                {/* Badge Superior */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-black text-xs font-mono uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] font-bold">
                    <span>Espetáculo Interativo &bull; Instituto de Física IFUSP</span>
                </div>

                {/* Letreiro Show de Física Neon Idêntico à Vitrine */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-widest mb-8 uppercase flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                    <span className="neon-text-red">Show</span>
                    <span className="neon-text-blue">de</span>
                    <span className="neon-text-green">Física</span>
                </h1>

                {/* Texto Introdutório de 4 a 5 linhas */}
                <p className="max-w-4xl mx-auto text-lg sm:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-sans tracking-wide mb-12">
                    O Show de Física é um espetáculo de demonstrações experimentais que abordam os mais variados temas.
                    Contamos com uma performance lúdica, divertida, dinâmica, envolvente e fortemente interativa!
                    Nossa proposta é permitir que os visitantes contextualizem, ampliem e estimulem o seu perfil científico
                    em um palco vivo de descobertas no Instituto de Física da USP.
                </p>

                {/* CTAs de Ação em Estilo Neon Reto */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
                    <Link
                        href="/monte-seu-show"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest text-sm hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_25px_#f60011] transition-all rounded-none"
                    >
                        <span>Monte seu Show</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link
                        href="/conheca"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] font-bold uppercase tracking-widest text-sm hover:bg-[#002ffe] hover:text-white dark:hover:text-black hover:shadow-[0_0_25px_#002ffe] transition-all rounded-none"
                    >
                        <span>Nossa Proposta</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
