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
import { ChromeDino } from './ChromeDino';
import { ArrowRight, Terminal } from 'lucide-react';

interface HackerspaceCardProps {
    className?: string;
}

/**
 * Themed Hackerspace Card featuring the Google Chrome Offline Dinosaur and Matrix Green Aesthetics.
 * Leads the user directly to the dedicated Hackerspace overview page (/espacos/hackerspace).
 */
export function HackerspaceCard({ className = '' }: HackerspaceCardProps) {
    return (
        <div 
            className={`snap-center shrink-0 w-[300px] md:w-[320px] bg-white dark:bg-[#071109] text-gray-900 dark:text-white rounded-[40px] p-8 border-2 border-emerald-500/40 dark:border-[#00FF66]/40 hover:border-emerald-500 dark:hover:border-[#00FF66] shadow-md dark:shadow-[0_4px_25px_rgba(0,255,102,0.15)] hover:shadow-xl dark:hover:shadow-[0_0_35px_rgba(0,255,102,0.35)] flex flex-col justify-between group transition-all duration-500 relative overflow-hidden ${className}`}
        >
            {/* Ambient Matrix Glow */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 dark:bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 dark:group-hover:bg-[#00FF66]/20 transition-all duration-700" />
            
            {/* Subtle Matrix Binary Code stream in the background */}
            <div 
                className="absolute inset-0 opacity-[0.08] dark:opacity-[0.07] pointer-events-none select-none font-mono text-[10px] leading-3 text-emerald-700 dark:text-[#00FF66] overflow-hidden p-3 break-all"
                aria-hidden="true"
            >
                01001000 01010011 01001001 01000110 01010101 01010011 01010000 00100000 
                01001101 01000001 01001011 01000101 01010010 00100000 01010011 01010000 
                01000001 01000011 01000101 00100000 01001100 01001001 01010110 01010010 
                01000101 00100000 00110001 00111001 00110111 00110000 00100000 01010101 
            </div>

            <div className="relative z-10">
                {/* Header with Offline Dino & System Tag */}
                <div className="flex items-center justify-between mb-6">
                    <div className="size-16 bg-emerald-50 dark:bg-[#00FF66]/10 border border-emerald-200 dark:border-[#00FF66]/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-[#00FF66] shadow-sm dark:shadow-[0_0_15px_rgba(0,255,102,0.2)] group-hover:scale-105 group-hover:border-emerald-500 dark:group-hover:border-[#00FF66] transition-all">
                        <ChromeDino size={40} className="text-emerald-600 dark:text-[#00FF66]" animate={true} />
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-[#00FF66]/15 border border-emerald-300 dark:border-[#00FF66]/40 text-emerald-700 dark:text-[#00FF66] font-mono text-[9px] font-black uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#00FF66] animate-pulse"></span>
                            OFFLINE://DINO
                        </span>
                        <span className="font-mono text-[9px] text-emerald-600/70 dark:text-[#00FF66]/60 mt-1 uppercase">HS.IFUSP</span>
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-black uppercase mb-1 text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#00FF66] transition-colors font-bukra tracking-tight flex items-center gap-2">
                    Hackerspace
                </h3>
                <p className="font-mono text-[10px] text-emerald-700 dark:text-[#00FF66] font-bold uppercase tracking-wider mb-3">
                    &gt; Cultura Maker &amp; Software Livre
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mb-6 font-open-sans">
                    Cultura maker radical no IFUSP. Estação meteorológica própria, robótica, Arduinos, IoT, corte e impressão 3D aberta à comunidade.
                </p>
            </div>

            {/* Navigation Button */}
            <div className="relative z-10 mt-auto pt-2">
                <Link 
                    href="/espacos/hackerspace" 
                    className="w-full py-3 px-5 rounded-2xl bg-emerald-50 hover:bg-emerald-600 dark:bg-[#00FF66]/10 dark:hover:bg-[#00FF66] text-emerald-700 hover:text-white dark:text-[#00FF66] dark:hover:text-black border border-emerald-300 hover:border-emerald-600 dark:border-[#00FF66]/40 dark:hover:border-[#00FF66] transition-all text-xs font-black uppercase tracking-wider flex items-center justify-between shadow-sm dark:shadow-[0_0_15px_rgba(0,255,102,0.2)] font-mono group-hover:shadow-md dark:group-hover:shadow-[0_0_25px_rgba(0,255,102,0.4)]"
                >
                    <span className="flex items-center gap-2">
                        <Terminal className="w-4 h-4" /> Conhecer o Espaço
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
