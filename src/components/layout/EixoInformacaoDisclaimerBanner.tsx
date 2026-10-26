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

import React, { useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';

const DISCLAIMER_STORAGE_KEY = '@hub:eixo_info_disclaimer_dismissed';
const emptySubscribe = () => () => {};

export function EixoInformacaoDisclaimerBanner() {
    const pathname = usePathname();
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    const { setReportModalOpen } = useNavigationStore();

    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return sessionStorage.getItem(DISCLAIMER_STORAGE_KEY) === 'true';
        } catch {
            return false;
        }
    });

    // Renderiza estritamente no Eixo de Informação (Wiki, GCIF, Informativo)
    const isEixoInformacao = Boolean(
        pathname && (
            pathname.startsWith('/wiki') ||
            pathname.startsWith('/gcif') ||
            pathname.startsWith('/cgif') ||
            pathname.startsWith('/informativo')
        )
    );

    if (!isClient || !isEixoInformacao || isDismissed) {
        return null;
    }

    const handleDismiss = () => {
        setIsDismissed(true);
        try {
            sessionStorage.setItem(DISCLAIMER_STORAGE_KEY, 'true');
        } catch {
            // Ignore storage errors
        }
    };

    const handleReport = () => {
        setReportModalOpen(true, 'outro', {
            id: 'revisao-eixo-info',
            titulo: 'Revisão de Conteúdo do Eixo de Informação',
            local: pathname || 'Eixo de Informação'
        });
    };

    return (
        <div className="w-[calc(100%-4.5rem)] md:w-full mx-auto md:mx-0 mb-3 sm:mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 dark:from-amber-500/20 dark:via-red-500/15 dark:to-amber-500/20 border-2 border-amber-400/80 dark:border-amber-400/70 shadow-[0_0_25px_rgba(255,204,0,0.22)] backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Faixa decorativa superior com gradiente animado */}
            <div className="h-1 w-full bg-gradient-to-r from-[#FFCC00] via-[#F14343] to-[#FFCC00] animate-pulse" />

            <div className="px-3.5 sm:px-5 py-3 sm:py-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
                {/* Lado Esquerdo: Ícone Grande com Cores dos Eixos + Título + Mensagem Explicativa */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="relative shrink-0 mt-0.5 sm:mt-0">
                        <span className="flex items-center justify-center size-10 sm:size-11 rounded-2xl bg-gradient-to-br from-[#FFCC00] to-[#F14343] text-gray-950 shadow-md shadow-amber-500/40 border border-white/20">
                            <AlertTriangle className="size-5 sm:size-6 text-gray-950 stroke-[2.5] animate-bounce" style={{ animationDuration: '2.5s' }} />
                        </span>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F14343] opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F14343] border border-white dark:border-black" />
                        </span>
                    </div>

                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bukra font-black text-xs sm:text-sm text-amber-600 dark:text-[#FFCC00] tracking-wide uppercase">
                                Aviso de Revisão Comunitária
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-[9px] font-black uppercase tracking-wider">
                                <span className="size-1.5 rounded-full bg-red-500 animate-pulse" />
                                Moderação Aberta
                            </span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200 text-xs font-open-sans leading-relaxed">
                            Todos os conteúdos do Eixo de Informação carecem de revisão permanente. Cheque a veracidade das informações com fontes oficiais da USP antes de repassá-las ou de tomar decisões acadêmicas.
                        </p>
                    </div>
                </div>

                {/* Lado Direito: Ação de Report / Sugerir Correção + Fechar */}
                <div className="flex items-center gap-2 shrink-0 self-end xl:self-auto">
                    <button
                        onClick={handleReport}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-gray-950 text-[10px] sm:text-[11px] font-black font-bukra uppercase tracking-wider shadow-[0_4px_14px_rgba(241,67,67,0.35)] active:scale-95 transition-all cursor-pointer shrink-0 border-0 outline-none overflow-hidden hover:brightness-110"
                        style={{
                            background: 'linear-gradient(90deg, #F14343 0%, #F14343 35%, #FFCC00 100%)',
                            backgroundRepeat: 'no-repeat'
                        }}
                        title="Apontar erro ou sugerir revisão para este conteúdo"
                    >
                        <ShieldAlert className="size-4 text-gray-950 shrink-0" />
                        <span>Sugerir Correção</span>
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="p-1.5 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                        title="Ocultar aviso de revisão"
                        aria-label="Fechar aviso de revisão"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
