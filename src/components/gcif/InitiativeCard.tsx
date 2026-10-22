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
import { 
    ExternalLink, 
    Info, 
    Sparkles, 
    GraduationCap, 
    Wrench, 
    HeartHandshake, 
    BookOpen,
    Users
} from 'lucide-react';
import { Initiative, InitiativeCategory } from '@/types/initiatives';

interface InitiativeCardProps {
    initiative: Initiative;
    onOpenDetails: (initiative: Initiative) => void;
}

const CATEGORY_ICONS: Record<InitiativeCategory, React.ReactNode> = {
    divulgacao: <Sparkles className="w-5 h-5 text-brand-blue" />,
    escolar: <GraduationCap className="w-5 h-5 text-emerald-400" />,
    maker: <Wrench className="w-5 h-5 text-brand-yellow" />,
    inclusao: <HeartHandshake className="w-5 h-5 text-purple-400" />,
    academica: <BookOpen className="w-5 h-5 text-brand-red" />
};

export function InitiativeCard({ initiative, onOpenDetails }: InitiativeCardProps) {
    // 1. Tema Especial: LabDiv
    if (initiative.temaVisual === 'labdiv') {
        return (
            <div className="snap-center shrink-0 w-[300px] md:w-[400px] bg-[#0F4780] rounded-[40px] p-8 shadow-[0_10px_30px_rgba(15,71,128,0.3)] relative overflow-hidden group flex flex-col justify-between transition-all hover:-translate-y-2">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-colors pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="mb-8 group-hover:scale-105 transition-transform origin-center select-none w-full">
                        <div className="flex items-baseline justify-center text-[56px] md:text-[64px] font-black leading-none tracking-tighter font-bukra drop-shadow-md">
                            <span className="text-white relative z-10">La</span>
                            <div className="relative flex items-baseline justify-center mx-[2px]">
                                <div className="absolute w-[70%] h-[120%] bg-[#22a5d8] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 shadow-sm" />
                                <div className="relative z-10 flex items-baseline isolate">
                                    <span className="text-[#F14343] relative z-10">b</span>
                                    <span className="text-[#FFCC00] relative z-20 mix-blend-multiply" style={{ marginLeft: '-0.35em' }}>d</span>
                                </div>
                            </div>
                            <span className="text-white relative z-10">iv</span>
                        </div>
                        <div className="text-[9px] md:text-[10px] font-black tracking-[0.4em] text-white/95 uppercase mt-3 font-sans text-center">
                            Expressão e Divulgação
                        </div>
                    </div>
                    <p className="text-xs text-white/90 font-open-sans leading-relaxed mb-6 text-center">
                        {initiative.resumo}
                    </p>
                </div>
                
                <div className="relative z-10 mt-auto flex items-center gap-2 w-full">
                    <Link 
                        href="/iniciativas/labdiv" 
                        className="flex-1 px-6 py-3.5 bg-[#FFCC00] hover:bg-[#ffe066] text-[#0F4780] rounded-xl font-black uppercase tracking-widest text-[11px] text-center shadow-lg transition-all group-hover:scale-105"
                    >
                        Conhecer o LabDiv
                    </Link>
                    <button
                        onClick={() => onOpenDetails(initiative)}
                        title="Ver ficha técnica"
                        className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // 2. Tema Especial: Show da Física (Neon Edition)
    if (initiative.temaVisual === 'show-da-fisica') {
        return (
            <div className="snap-center shrink-0 w-[300px] md:w-[400px] bg-white dark:bg-[#0a0a0c] rounded-[40px] p-8 border border-[#002ffe] shadow-[0_4px_20px_rgba(0,47,254,0.15)] dark:shadow-[0_0_20px_rgba(0,47,254,0.25)] relative overflow-hidden group flex flex-col justify-between transition-all hover:shadow-[0_4px_30px_rgba(1,243,0,0.25)] dark:hover:shadow-[0_0_30px_rgba(1,243,0,0.3)] hover:border-[#01f300]">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#f60011]/10 rounded-full blur-3xl group-hover:bg-[#01f300]/10 transition-colors pointer-events-none" />
                
                <div className="relative z-10">
                    <div className="size-16 bg-gray-100 dark:bg-black border border-gray-200 dark:border-white/10 rounded-2xl p-3 flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:rotate-6 transition-transform shadow-sm dark:shadow-[inset_0_0_15px_rgba(246,0,17,0.3)]">
                        <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_8px_#f60011]">experiment</span>
                    </div>
                    <h3 className="text-[22px] font-black uppercase mb-2 font-bukra tracking-wider">
                        <span className="text-[#f60011] dark:text-white" style={{ textShadow: '0 0 10px rgba(246,0,17,0.6)' }}>Show</span>{' '}
                        <span className="text-[#002ffe] dark:text-white" style={{ textShadow: '0 0 10px rgba(0,47,254,0.6)' }}>de</span>{' '}
                        <span className="text-[#009900] dark:text-white" style={{ textShadow: '0 0 10px rgba(1,243,0,0.6)' }}>Física</span>
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed mb-6">
                        {initiative.resumo}
                    </p>
                </div>
                
                <div className="relative z-10 mt-auto flex items-center gap-2">
                    <Link 
                        href="/iniciativas/show-da-fisica" 
                        className="flex-1 px-6 py-3 bg-gray-950 dark:bg-black text-white rounded-xl font-black uppercase tracking-widest text-[10px] text-center transition-all border border-[#01f300] hover:bg-[#01f300] hover:text-black shadow-[0_0_15px_rgba(1,243,0,0.4)] group-hover:scale-105"
                    >
                        Conhecer o Show
                    </Link>
                    <button
                        onClick={() => onOpenDetails(initiative)}
                        title="Ver ficha técnica"
                        className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors border border-gray-200 dark:border-white/10"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // 3. Tema Especial: Hackerspace IFUSP
    if (initiative.temaVisual === 'hackerspace') {
        return (
            <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-white dark:bg-[#1E1E1E] rounded-[40px] p-8 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl dark:shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all hover:border-brand-yellow/40">
                <div className="absolute top-0 right-0 bg-brand-yellow/90 text-black text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl shadow-md backdrop-blur-sm z-10">
                    Cultura Maker
                </div>
                <div>
                    <div className="size-14 bg-brand-yellow/10 rounded-2xl flex items-center justify-center text-amber-500 mb-6">
                        <Wrench className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-black uppercase mb-2 text-gray-900 dark:text-white font-bukra">
                        {initiative.nome}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed mb-6">
                        {initiative.resumo}
                    </p>
                </div>
                
                <div className="mt-auto flex items-center gap-2">
                    <Link 
                        href="/espacos/hackerspace" 
                        className="flex-1 px-6 py-3 border border-brand-yellow/40 text-amber-700 dark:text-brand-yellow rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-yellow/10 transition-colors"
                    >
                        Acessar Espaço
                    </Link>
                    <button
                        onClick={() => onOpenDetails(initiative)}
                        title="Ver detalhes"
                        className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors"
                    >
                        <Info className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    // 4. Tema Padrão Dinâmico (Para todas as demais iniciativas da CCEx e coletivos)
    const icon = CATEGORY_ICONS[initiative.categoria] || CATEGORY_ICONS.divulgacao;

    return (
        <div className="snap-center shrink-0 w-[300px] md:w-[350px] bg-white dark:bg-[#1E1E1E] rounded-[40px] p-8 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl dark:shadow-xl flex flex-col justify-between group relative overflow-hidden transition-all hover:border-brand-blue/40">
            {initiative.sigla && (
                <div className="absolute top-0 right-0 bg-white/10 dark:bg-white/5 text-gray-400 text-[9px] font-bold uppercase tracking-widest py-1.5 px-4 rounded-bl-2xl backdrop-blur-sm z-10 border-b border-l border-white/5">
                    {initiative.sigla}
                </div>
            )}
            
            <div>
                <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/5">
                    {icon}
                </div>
                <h3 className="text-xl font-black uppercase mb-2 text-gray-900 dark:text-white font-bukra line-clamp-2">
                    {initiative.nome}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed mb-6 line-clamp-3">
                    {initiative.resumo}
                </p>
            </div>

            <div className="mt-auto flex items-center gap-2">
                {initiative.links.interno ? (
                    <Link
                        href={initiative.links.interno}
                        className="flex-1 px-6 py-3 border border-brand-blue/30 text-brand-blue rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-blue/10 transition-colors"
                    >
                        Acessar no HUB
                    </Link>
                ) : (
                    <button
                        onClick={() => onOpenDetails(initiative)}
                        className="flex-1 px-6 py-3 border border-brand-blue/30 text-brand-blue rounded-xl font-black uppercase tracking-widest text-[10px] text-center hover:bg-brand-blue/10 transition-colors flex items-center justify-center gap-1.5"
                    >
                        Ver Detalhes
                    </button>
                )}

                {initiative.links.oficial && (
                    <a
                        href={initiative.links.oficial}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir página oficial do IFUSP"
                        className="p-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>
        </div>
    );
}
