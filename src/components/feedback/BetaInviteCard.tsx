'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import { Smartphone, DownloadCloud } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';

interface BetaInviteCardProps {
    className?: string;
}

export function BetaInviteCard({ className = '' }: BetaInviteCardProps) {
    const setBetaModalOpen = useNavigationStore(state => state.setBetaModalOpen);

    return (
        <aside 
            suppressHydrationWarning
            className={`bg-white dark:bg-card-dark border border-gray-200 dark:border-white/20 rounded-2xl p-6 shadow-xl w-full flex flex-col gap-4 relative overflow-hidden group ${className}`}
        >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Smartphone className="w-24 h-24 text-brand-blue rotate-12" />
            </div>
            
            <div className="flex items-start justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-brand-blue" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest leading-tight">
                                App LabDiv
                            </h3>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-blue/10 text-brand-blue">
                                Versão Beta
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                            Participe do programa de testes fechados e baixe o nosso app Android antes do lançamento oficial.
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={() => setBetaModalOpen(true)}
                className="w-full relative z-10 flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-all border border-transparent dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 group"
            >
                <DownloadCloud className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                Quero Participar
            </button>
        </aside>
    );
}
