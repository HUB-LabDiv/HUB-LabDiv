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
import { Calendar, ArrowRight, Award, Newspaper, BookOpen, FlaskConical, Landmark } from 'lucide-react';
import { NewsItem } from '@/types/news';

interface NewsCardProps {
    news: NewsItem;
    onOpenDetails: (news: NewsItem) => void;
}

const CATEGORY_STYLES: Record<string, { label: string; badgeClass: string; icon: React.ReactNode }> = {
    'Premiação': {
        label: 'Premiação',
        badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-brand-yellow border-amber-500/30',
        icon: <Award className="w-3.5 h-3.5" />
    },
    'Pesquisa': {
        label: 'Pesquisa',
        badgeClass: 'bg-blue-500/15 text-brand-blue dark:text-blue-400 border-blue-500/30',
        icon: <FlaskConical className="w-3.5 h-3.5" />
    },
    'Extensão': {
        label: 'Extensão',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: <BookOpen className="w-3.5 h-3.5" />
    },
    'Ensino': {
        label: 'Ensino',
        badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: <Newspaper className="w-3.5 h-3.5" />
    },
    'Institucional': {
        label: 'Institucional',
        badgeClass: 'bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/30',
        icon: <Landmark className="w-3.5 h-3.5" />
    }
};

export function NewsCard({ news, onOpenDetails }: NewsCardProps) {
    const catStyle = CATEGORY_STYLES[news.categoria] || CATEGORY_STYLES['Institucional'];

    return (
        <div 
            onClick={() => onOpenDetails(news)}
            className="snap-center shrink-0 w-[280px] sm:w-[320px] bg-white dark:bg-[#1E1E1E] rounded-[32px] p-6 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-2xl dark:shadow-xl hover:border-brand-blue/50 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
            <div>
                {/* Header: Category + Date */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider font-bukra ${catStyle.badgeClass}`}>
                        {catStyle.icon}
                        {catStyle.label}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-gray-400 font-open-sans">
                        <Calendar className="w-3 h-3 text-brand-blue" />
                        {news.data}
                    </span>
                </div>

                {/* News Title */}
                <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white font-bukra tracking-tight leading-snug line-clamp-3 mb-2.5 group-hover:text-brand-blue dark:group-hover:text-brand-yellow transition-colors">
                    {news.titulo}
                </h3>

                {/* News Summary Teaser */}
                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed line-clamp-3 mb-4">
                    {news.resumo}
                </p>
            </div>

            {/* Footer CTA */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-brand-blue dark:text-brand-yellow group-hover:underline">
                <span>Ler Matéria</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
}
