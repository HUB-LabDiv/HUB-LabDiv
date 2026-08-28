'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3).
 */

import React from 'react';

interface CapeloIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

/**
 * CapeloIcon: Símbolo minimalista e limpo de capelo acadêmico (mortarboard).
 * Sem ondas de sinal ou elementos de logotipo — apenas o símbolo acadêmico puro.
 */
export function CapeloIcon({ size = 24, className = '', ...props }: CapeloIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            {...props}
        >
            {/* Topo do capelo (losango) */}
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            {/* Base da cabeça e pingente */}
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
    );
}
