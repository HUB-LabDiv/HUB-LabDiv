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
    MapPin, 
    Clock, 
    Users, 
    ArrowRight, 
    Building2, 
    Sparkles,
    Calendar,
    Wrench,
    BookOpen,
    Landmark,
    Coffee
} from 'lucide-react';
import { SpaceItem, SpaceCategory } from '@/types/spaces';

interface SpaceCardProps {
    space: SpaceItem;
    onOpenDetails: (space: SpaceItem) => void;
}

const CATEGORY_CONFIG: Record<SpaceCategory, { label: string; badgeClass: string; icon: string }> = {
    'estudo-biblioteca': {
        label: 'Estudo & Biblioteca',
        badgeClass: 'bg-blue-500/15 text-brand-blue dark:text-blue-400 border-blue-500/30',
        icon: 'local_library'
    },
    'auditorio': {
        label: 'Auditório',
        badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-brand-yellow border-amber-500/30',
        icon: 'theater_comedy'
    },
    'maker-convivencia': {
        label: 'Maker & Convivência',
        badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        icon: 'groups'
    },
    'oficina-tecnica': {
        label: 'Oficina Técnica',
        badgeClass: 'bg-rose-500/15 text-brand-red dark:text-rose-400 border-rose-500/30',
        icon: 'handyman'
    },
    'servico-alimentacao': {
        label: 'Serviço & Alimentação',
        badgeClass: 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30',
        icon: 'coffee'
    },
    'laboratorio-pesquisa': {
        label: 'Pesquisa & Acelerador',
        badgeClass: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
        icon: 'cyclone'
    }
};

export function SpaceCard({ space, onOpenDetails }: SpaceCardProps) {
    const config = CATEGORY_CONFIG[space.categoria] || CATEGORY_CONFIG['maker-convivencia'];

    return (
        <div 
            onClick={() => onOpenDetails(space)}
            className="snap-center shrink-0 w-[290px] sm:w-[340px] bg-white dark:bg-[#1E1E1E] rounded-[32px] p-6 border border-gray-200 dark:border-white/10 shadow-md hover:shadow-2xl dark:shadow-xl hover:border-brand-yellow/40 transition-all flex flex-col justify-between group cursor-pointer relative overflow-hidden"
        >
            {/* Ambient subtle glow for highlighted spaces */}
            {space.destaque && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none group-hover:bg-brand-yellow/20 transition-all" />
            )}

            <div>
                {/* Header: Category Badge + Capacity */}
                <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider font-bukra ${config.badgeClass}`}>
                        <span className="material-symbols-outlined text-[13px]">{config.icon}</span>
                        {config.label}
                    </span>

                    {space.capacidade && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 font-open-sans">
                            <Users className="w-3 h-3 text-brand-blue" />
                            {space.capacidade}
                        </span>
                    )}
                </div>

                {/* Space Title & Sigla */}
                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-bukra tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-brand-blue dark:group-hover:text-brand-yellow transition-colors">
                    {space.nome}
                </h3>

                {/* Building / Location */}
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 font-open-sans">
                    <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                    <span className="truncate">{space.predio}{space.sala ? ` • ${space.sala}` : ''}</span>
                </div>

                {/* Horário */}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 mb-3.5 font-open-sans">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{space.horario}</span>
                </div>

                {/* Resources tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {space.recursos.slice(0, 3).map((rec, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[9px] font-bold text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-white/5">
                            {rec}
                        </span>
                    ))}
                    {space.recursos.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-[9px] font-bold text-gray-500">
                            +{space.recursos.length - 3}
                        </span>
                    )}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-wider text-brand-blue dark:text-brand-yellow group-hover:underline">
                <span>Ver Detalhes & Acesso</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
        </div>
    );
}
