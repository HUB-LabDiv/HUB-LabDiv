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
        <div className="w-[calc(100%-4.5rem)] md:w-full mx-auto md:mx-0 mb-3 sm:mb-4 bg-white/85 dark:bg-[#1E1E1E]/90 border border-brand-yellow/40 dark:border-brand-yellow/30 rounded-2xl shadow-lg backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 overflow-hidden">
            <div className="px-3 sm:px-5 py-2 sm:py-2.5 flex flex-col xl:flex-row xl:items-center justify-between gap-2 sm:gap-3 text-xs">
                {/* Lado Esquerdo: Ícone + Título + Mensagem Explicativa */}
                <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <span className="flex items-center justify-center size-6 sm:size-7 rounded-lg sm:rounded-xl bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 shrink-0 shadow-sm mt-0.5 sm:mt-0">
                        <AlertTriangle className="size-3.5 sm:size-4" />
                    </span>
                    <div className="flex flex-col xl:flex-row xl:items-center gap-1 xl:gap-2.5 min-w-0">
                        <span className="font-bukra font-bold text-[10px] sm:text-xs text-brand-yellow tracking-wide uppercase shrink-0">
                            Aviso de Revisão Comunitária
                        </span>
                        <span className="text-gray-700 dark:text-gray-300 text-[11px] font-open-sans leading-snug">
                            Todos os conteúdos do Eixo de Informação ainda carecem de revisão permanente. Aconselhamos checar a veracidade das informações com fontes oficiais da USP antes de repassá-las ou de tomar decisões que afetem sua graduação.
                        </span>
                    </div>
                </div>

                {/* Lado Direito: Ação de Report / Sugerir Correção + Fechar */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 self-end xl:self-auto">
                    <button
                        onClick={handleReport}
                        className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 text-[9px] sm:text-[10px] font-black font-bukra uppercase tracking-wider border border-gray-200 dark:border-white/10 active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
                        title="Apontar erro ou sugerir revisão para este conteúdo"
                    >
                        <ShieldAlert className="size-3 text-brand-yellow shrink-0" />
                        <span>Sugerir Correção</span>
                    </button>

                    <button
                        onClick={handleDismiss}
                        className="p-1 sm:p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                        title="Ocultar aviso de revisão"
                        aria-label="Fechar aviso de revisão"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
