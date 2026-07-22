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
import { Sparkles, MessageSquarePlus } from 'lucide-react';

export interface ContextFeedbackCardProps {
    title: string;
    description: string;
    icon?: React.ReactNode;
    betaTag?: boolean;
    onFeedbackClick: () => void;
    className?: string; // Permite injeção de classes como 'block lg:hidden' na página consumidora
}

export const ContextFeedbackCard = ({
    title,
    description,
    icon,
    betaTag = false,
    onFeedbackClick,
    className = ''
}: ContextFeedbackCardProps) => {
    return (
        <aside 
            suppressHydrationWarning
            className={`bg-white dark:bg-card-dark border border-gray-200 dark:border-white/20 rounded-2xl p-6 shadow-xl w-full flex flex-col gap-4 ${className}`}
            aria-labelledby="feedback-card-title"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center shrink-0">
                        {icon || <Sparkles className="w-5 h-5 text-brand-blue" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 id="feedback-card-title" className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest leading-tight">
                                {title}
                            </h3>
                            {betaTag && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-brand-blue/10 text-brand-blue">
                                    Versão Beta
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 leading-relaxed font-medium">
                            {description}
                        </p>
                    </div>
                </div>
            </div>

            <button
                onClick={onFeedbackClick}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white py-2.5 px-4 rounded-lg text-xs font-bold transition-all border border-transparent dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 group"
            >
                <MessageSquarePlus className="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform" />
                Deixar Feedback
            </button>
        </aside>
    );
};
