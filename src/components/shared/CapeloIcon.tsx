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

export function CapeloIcon({ size = 64, className = '', ...props }: CapeloIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width={size}
            height={size}
            className={className}
            {...props}
        >
            <defs>
                {/* Official LabDiv Brand Gradient: Blue -> Red -> Yellow */}
                <linearGradient id="capeloBrandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0F4780" />
                    <stop offset="48%" stopColor="#F14343" />
                    <stop offset="100%" stopColor="#FFCC00" />
                </linearGradient>

                {/* Diagonal Smooth Gradient for Cap Top Surface with Highlights */}
                <linearGradient id="capeloTopGradient" x1="5%" y1="20%" x2="95%" y2="80%">
                    <stop offset="0%" stopColor="#0E4277" />
                    <stop offset="22%" stopColor="#0F4780" />
                    <stop offset="48%" stopColor="#F14343" />
                    <stop offset="78%" stopColor="#FFCC00" />
                    <stop offset="100%" stopColor="#FCE055" />
                </linearGradient>

                {/* Horizontal Gradient for Skull Cap Base Ring */}
                <linearGradient id="capeloBaseGradient" x1="5%" y1="0%" x2="95%" y2="0%">
                    <stop offset="0%" stopColor="#0B3764" />
                    <stop offset="25%" stopColor="#0F4780" />
                    <stop offset="50%" stopColor="#F14343" />
                    <stop offset="80%" stopColor="#FFCC00" />
                    <stop offset="100%" stopColor="#E5B800" />
                </linearGradient>

                {/* Outer Soft Glow for Signal Waves */}
                <filter id="capeloWaveGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComponentTransfer in="blur" result="brightBlur">
                        <feFuncA type="linear" slope="0.7" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode in="brightBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                {/* Drop Shadow for Diamond Overhang */}
                <filter id="capeloOverhangShadow" x="-20%" y="-10%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="10" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
                </filter>
            </defs>

            {/* 1. SIGNAL WAVES CROWN (SITTING ABOVE THE CAP) */}
            <g filter="url(#capeloWaveGlow)" strokeLinecap="round" fill="none">
                {/* FAR LEFT WAVES (BLUE #0F4780) */}
                <path d="M 68 200 C 42 155 42 105 68 60" stroke="#000000" strokeWidth="22" />
                <path d="M 68 200 C 42 155 42 105 68 60" stroke="#0F4780" strokeWidth="12" />

                <path d="M 104 182 C 84 145 84 110 104 73" stroke="#000000" strokeWidth="22" />
                <path d="M 104 182 C 84 145 84 110 104 73" stroke="#0F4780" strokeWidth="12" />

                {/* MIDDLE LEFT WAVES (RED #F14343) */}
                <path d="M 148 165 C 132 135 132 105 148 75" stroke="#000000" strokeWidth="22" />
                <path d="M 148 165 C 132 135 132 105 148 75" stroke="#F14343" strokeWidth="12" />

                <path d="M 188 150 C 176 126 176 102 188 78" stroke="#000000" strokeWidth="22" />
                <path d="M 188 150 C 176 126 176 102 188 78" stroke="#F14343" strokeWidth="12" />

                {/* TOP CENTER WIFI ARCS (RED #F14343) */}
                <path d="M 210 42 C 235 24 277 24 302 42" stroke="#000000" strokeWidth="20" />
                <path d="M 210 42 C 235 24 277 24 302 42" stroke="#F14343" strokeWidth="10" />

                <path d="M 224 60 C 242 46 270 46 288 60" stroke="#000000" strokeWidth="20" />
                <path d="M 224 60 C 242 46 270 46 288 60" stroke="#F14343" strokeWidth="10" />

                <path d="M 238 78 C 248 68 264 68 274 78" stroke="#000000" strokeWidth="18" />
                <path d="M 238 78 C 248 68 264 68 274 78" stroke="#F14343" strokeWidth="9" />

                {/* MIDDLE RIGHT WAVES (RED #F14343) */}
                <path d="M 324 150 C 336 126 336 102 324 78" stroke="#000000" strokeWidth="22" />
                <path d="M 324 150 C 336 126 336 102 324 78" stroke="#F14343" strokeWidth="12" />

                <path d="M 364 165 C 380 135 380 105 364 75" stroke="#000000" strokeWidth="22" />
                <path d="M 364 165 C 380 135 380 105 364 75" stroke="#F14343" strokeWidth="12" />

                {/* FAR RIGHT WAVES (YELLOW #FFCC00) */}
                <path d="M 408 182 C 428 145 428 110 408 73" stroke="#000000" strokeWidth="22" />
                <path d="M 408 182 C 428 145 428 110 408 73" stroke="#FFCC00" strokeWidth="12" />

                <path d="M 444 200 C 470 155 470 105 444 60" stroke="#000000" strokeWidth="22" />
                <path d="M 444 200 C 470 155 470 105 444 60" stroke="#FFCC00" strokeWidth="12" />
            </g>

            {/* 2. SKULL CAP BASE / RING */}
            <g>
                <path
                    d="M 112 295 L 112 375 C 112 435 400 435 400 375 L 400 295 Z"
                    fill="url(#capeloBaseGradient)"
                    stroke="#000000"
                    strokeWidth="18"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                <path
                    d="M 112 295 C 180 345 330 345 400 295 C 330 365 180 365 112 295 Z"
                    fill="#000000"
                    opacity="0.35"
                />
            </g>

            {/* 3. CAP ISOMETRIC DIAMOND TOP (SURFACE) */}
            <g filter="url(#capeloOverhangShadow)">
                <path
                    d="M 256 165 L 476 270 L 256 375 L 36 270 Z"
                    fill="url(#capeloTopGradient)"
                    stroke="#000000"
                    strokeWidth="20"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />

                {/* Top Bevel Highlight */}
                <path
                    d="M 48 270 L 256 177 L 464 270"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="6"
                    strokeLinecap="round"
                    opacity="0.45"
                />

                {/* Bottom Rim Dark Shading */}
                <path
                    d="M 44 272 L 256 367 L 468 272"
                    fill="none"
                    stroke="#000000"
                    strokeWidth="8"
                    strokeLinecap="round"
                    opacity="0.3"
                />

                <ellipse cx="256" cy="270" rx="7" ry="4" fill="#000000" />
            </g>

            {/* 4. TASSEL */}
            <g strokeLinejoin="round" strokeLinecap="round">
                <path d="M 62 282 L 62 335" stroke="#000000" strokeWidth="16" />
                <path d="M 62 282 L 62 335" stroke="#0F4780" strokeWidth="8" />

                <circle cx="62" cy="347" r="14" fill="#0F4780" stroke="#000000" strokeWidth="10" />

                <path
                    d="M 46 365 L 32 448 Q 62 462 92 448 L 78 365 Z"
                    fill="#0F4780"
                    stroke="#000000"
                    strokeWidth="14"
                />

                <path d="M 52 375 L 42 442" stroke="#FFFFFF" strokeWidth="4" opacity="0.3" />
            </g>
        </svg>
    );
}
