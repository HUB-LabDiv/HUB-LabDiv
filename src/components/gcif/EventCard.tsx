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
import { 
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    Video, 
    ArrowRight, 
    FileText,
    Sparkles,
    Radio
} from 'lucide-react';
import { EventItem, EventType } from '@/types/events';

interface EventCardProps {
    event: EventItem;
    onOpenDetails: (event: EventItem) => void;
}

const TYPE_CONFIG: Record<EventType, { label: string; badgeClass: string; icon: string }> = {
    'coloquio': {
        label: 'Colóquio',
        badgeClass: 'bg-amber-500/15 text-amber-500 dark:text-brand-yellow border-amber-500/30',
        icon: 'stars'
    },
    'convite-fisica': {
        label: 'Convite à Física',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: 'auto_stories'
    },
    'seminario': {
        label: 'Seminário Departamental',
        badgeClass: 'bg-blue-500/15 text-brand-blue dark:text-blue-400 border-blue-500/30',
        icon: 'psychology'
    },
    'workshop': {
        label: 'Workshop & Encontro',
        badgeClass: 'bg-rose-500/15 text-brand-red dark:text-rose-400 border-rose-500/30',
        icon: 'groups'
    },
    'institucional': {
        label: 'Institucional',
        badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: 'account_balance'
    }
};

export function EventCard({ event, onOpenDetails }: EventCardProps) {
    const config = TYPE_CONFIG[event.tipo] || TYPE_CONFIG.institucional;

    return (
        <div 
            onClick={() => onOpenDetails(event)}
            className="snap-center shrink-0 w-[300px] md:w-[360px] bg-white dark:bg-[#1E1E1E] rounded-[32px] p-6 sm:p-7 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-2xl dark:shadow-xl hover:border-brand-yellow/40 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
            {/* Ambient subtle glow for destaque/coloquios */}
            {event.destaque && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-yellow/20 transition-all" />
            )}

            <div>
                {/* Header: Type Badge & Transmission Pill */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider font-bukra ${config.badgeClass}`}>
                        <span className="material-symbols-outlined text-[13px]">{config.icon}</span>
                        {config.label}
                    </span>

                    {event.links.transmissao && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/30 text-[9px] font-black uppercase tracking-wider">
                            <Radio className="w-3 h-3 animate-pulse" />
                            YouTube
                        </span>
                    )}
                </div>

                {/* Date & Time Ribbon */}
                <div className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 font-open-sans">
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                        <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                        <span>{event.data}</span>
                    </div>
                    {event.horario && (
                        <div className="flex items-center gap-1 text-amber-700 dark:text-brand-yellow">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{event.horario}</span>
                        </div>
                    )}
                </div>

                {/* Event Title */}
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-bukra tracking-tight leading-snug line-clamp-3 mb-3 group-hover:text-brand-blue dark:group-hover:text-brand-yellow transition-colors">
                    {event.titulo}
                </h3>

                {/* Speaker info */}
                {event.palestrante && (
                    <div className="flex items-start gap-2 mb-4 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <User className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">
                                {event.palestrante.nome}
                            </p>
                            {event.palestrante.afiliacao && (
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                    {event.palestrante.afiliacao}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Location */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-600 dark:text-gray-400 mb-4 font-open-sans">
                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span className="truncate">{event.local.nome}</span>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-brand-blue dark:text-brand-yellow group-hover:underline">
                <span>Ver Resumo & Agenda</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
}
