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
import { use } from 'react';
import { Radio, Sparkles, MessageSquare, Maximize2 } from 'lucide-react';
import { getLiveModerationQuestions } from '@/app/actions/show-bastidores';
import { EXPERIMENTS_CATALOG } from '@/app/iniciativas/show-da-fisica/data/experiments';

interface StageScreenProps {
    params: Promise<{ code: string }>;
}

export default function StageScreenPage({ params }: StageScreenProps) {
    const resolvedParams = use(params);
    const sessionCode = (resolvedParams.code || '').toUpperCase();

    const [highlightedQuestion, setHighlightedQuestion] = useState<any>(null);
    const [currentExperimentSlug, setCurrentExperimentSlug] = useState<string>('basket');

    const checkUpdates = async () => {
        const res = await getLiveModerationQuestions(sessionCode);
        if (res.success && res.data) {
            const high = res.data.find((q: any) => q.is_highlighted === true);
            setHighlightedQuestion(high || null);
        }
    };

    useEffect(() => {
        checkUpdates();
        const interval = setInterval(checkUpdates, 3000);
        return () => clearInterval(interval);
    }, [sessionCode]);

    const expInfo = EXPERIMENTS_CATALOG.find((e) => e.id === currentExperimentSlug) || EXPERIMENTS_CATALOG[0];

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            document.exitFullscreen().catch(() => {});
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#060609] text-white flex flex-col justify-between p-8 sm:p-14 select-none overflow-hidden font-display">
            {/* Top Bar Telão */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
                <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#f60011]">
                        SHOW
                    </span>
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#38bdf8]">
                        DE
                    </span>
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#01f300]">
                        FÍSICA
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-white/10 text-white border border-white/20 ml-2">
                        IFUSP
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm">
                        <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                        <span>SESSÃO {sessionCode}</span>
                    </div>

                    <button
                        onClick={toggleFullScreen}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Tela Cheia"
                    >
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Conteúdo Central: Experimento Atual ou Pergunta da Plateia Destacada */}
            <div className="flex-1 flex flex-col items-center justify-center text-center my-8 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
                {highlightedQuestion ? (
                    <div className="space-y-6 bg-white/[0.03] border-2 border-emerald-500/50 rounded-3xl p-10 sm:p-14 shadow-[0_0_50px_rgba(1,243,0,0.15)]">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs uppercase tracking-widest border border-emerald-500/40">
                            <MessageSquare className="w-4 h-4" />
                            <span>Pergunta da Plateia em Destaque</span>
                        </div>

                        <blockquote className="text-3xl sm:text-5xl font-black leading-tight text-white tracking-tight font-sans">
                            "{highlightedQuestion.free_text_answer}"
                        </blockquote>

                        <p className="text-base sm:text-lg font-mono text-emerald-400 font-bold">
                            &bull; {highlightedQuestion.student_name || 'Estudante'} {highlightedQuestion.school_origin ? `(${highlightedQuestion.school_origin})` : ''}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <span className="text-sm font-mono font-bold uppercase tracking-widest text-[#FFCC00]">
                            {expInfo.concept}
                        </span>
                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            {expInfo.title}
                        </h1>
                        <p className="text-xl sm:text-2xl font-mono text-gray-400 max-w-3xl mx-auto font-sans">
                            {expInfo.subtitle}
                        </p>
                    </div>
                )}
            </div>

            {/* Rodapé Telão */}
            <div className="flex items-center justify-between border-t border-white/10 pt-6 text-xs font-mono text-gray-500">
                <span>Auditório Alessandro Volta &bull; Instituto de Física da USP</span>
                <span>Participe ao vivo: <strong>showdefisica.hublabdiv.com.br/acompanhe</strong></span>
            </div>
        </div>
    );
}

