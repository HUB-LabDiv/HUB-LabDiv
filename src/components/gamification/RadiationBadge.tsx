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
import { getRadiationTier, RadiationTier } from '@/lib/radiation';

interface RadiationBadgeProps {
    xp: number;
    level: number;
    size?: 'sm' | 'md' | 'lg';
    showTierName?: boolean;
}

/**
 * Compact radiation level badge showing "NVD: X" with tier color.
 * Used in profiles, sidebar cards, and media cards.
 */
export function RadiationBadge({ xp, level, size = 'sm', showTierName = false }: RadiationBadgeProps) {
    const tier = getRadiationTier(xp);

    const sizeClasses = {
        sm: 'text-[9px] px-1.5 py-0.5 gap-1',
        md: 'text-[10px] px-2 py-1 gap-1.5',
        lg: 'text-xs px-3 py-1.5 gap-2',
    };

    const isDarkMatter = tier.id === 'materia_escura';

    return (
        <span
            className={`inline-flex items-center font-black uppercase tracking-tight rounded-md border ${sizeClasses[size]} ${tier.color} ${tier.borderColor} bg-white/5 ${isDarkMatter ? 'shadow-[0_0_8px_rgba(168,85,247,0.4)] animate-pulse' : ''}`}
            title={`${tier.name} — ${xp} RAD`}
        >
            <span className="text-[10px]">☢️</span>
            <span>TIER: {level}</span>
            {showTierName && (
                <span className="opacity-70 ml-0.5">({tier.name})</span>
            )}
        </span>
    );
}
