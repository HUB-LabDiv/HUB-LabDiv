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
import { Atom } from 'lucide-react';

interface MediaReactionProps {
    isActive: boolean;
    count: number;
    onClick: (e: React.MouseEvent) => void;
    size?: number;
    color?: string;
}

export const MediaReaction = ({ isActive, count, onClick, size = 24, color = 'brand-blue' }: MediaReactionProps) => {
    return (
        <button
            onClick={onClick}
            aria-label={`Curtir - Total: ${count}`}
            className={`flex items-center gap-2 group transition-colors p-2 rounded-lg min-h-[40px] ${isActive ? `bg-${color}/10` : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
        >
            <Atom
                size={size}
                className={`transition-colors ${isActive ? `text-${color} fill-current` : 'text-gray-700 dark:text-gray-200 group-hover:text-brand-blue'}`}
            />
            <span className={`text-xs font-bold tabular-nums ${isActive ? `text-${color}` : 'text-gray-500'}`}>
                {count}
            </span>
        </button>
    );
};
