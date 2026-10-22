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

interface ChromeDinoProps {
    className?: string;
    color?: string;
    size?: number;
    animate?: boolean;
}

/**
 * Pixel-perfect Google Chrome Offline T-Rex Dinosaur SVG.
 * Designed with authentic retro pixel aesthetics and Matrix neon green glow.
 */
export function ChromeDino({ 
    className = '', 
    color = 'currentColor', 
    size = 48,
    animate = false
}: ChromeDinoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 44 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`select-none transition-transform ${animate ? 'hover:-translate-y-1' : ''} ${className}`}
            style={{ shapeRendering: 'crispEdges' }}
        >
            {/* Dino Body & Head in Pixel Path */}
            <path
                d="
                M22,0 h17 v2 h-17 z
                M21,2 h19 v1 h-19 z
                M21,3 h4 v2 h-4 z M27,3 h13 v2 h-13 z
                M21,5 h20 v4 h-20 z
                M21,9 h16 v2 h-16 z
                M21,11 h19 v2 h-19 z
                M21,13 h11 v1 h-11 z
                M21,14 h14 v1 h-14 z
                M20,15 h16 v2 h-16 z
                M19,17 h17 v1 h-17 z
                M18,18 h18 v2 h-18 z
                M17,20 h19 v1 h-19 z
                M16,21 h20 v1 h-20 z
                M15,22 h21 v1 h-21 z
                M14,23 h21 v1 h-21 z
                M13,24 h22 v1 h-22 z
                M12,25 h23 v1 h-23 z
                M11,26 h23 v1 h-23 z
                M10,27 h22 v1 h-22 z
                M9,28 h22 v1 h-22 z
                M8,29 h22 v1 h-22 z
                M7,30 h22 v1 h-22 z
                M6,31 h22 v1 h-22 z
                M5,32 h22 v1 h-22 z
                M4,33 h22 v1 h-22 z
                M3,34 h21 v1 h-21 z
                M2,35 h20 v1 h-20 z
                M1,36 h19 v1 h-19 z
                M0,37 h18 v1 h-18 z
                M12,38 h5 v1 h-5 z M21,38 h4 v1 h-4 z
                M12,39 h4 v1 h-4 z M22,39 h3 v1 h-3 z
                M12,40 h3 v1 h-3 z M22,40 h3 v1 h-3 z
                M12,41 h3 v1 h-3 z M22,41 h3 v1 h-3 z
                M12,42 h3 v1 h-3 z M22,42 h3 v1 h-3 z
                M12,43 h3 v1 h-3 z M22,43 h3 v1 h-3 z
                M12,44 h3 v1 h-3 z M22,44 h3 v1 h-3 z
                M10,45 h5 v1 h-5 z M20,45 h5 v1 h-5 z
                M10,46 h5 v1 h-5 z M20,46 h5 v1 h-5 z
                M33,20 h3 v1 h-3 z
                M34,21 h2 v2 h-2 z
                "
                fill={color}
            />
            {/* Eye cutout pixel */}
            <rect x="25" y="3" width="2" height="2" fill="transparent" />
        </svg>
    );
}

/**
 * Pixel Art Cactus SVG for obstacles and retro game aesthetics
 */
export function PixelCactus({ 
    className = '', 
    color = 'currentColor', 
    size = 32 
}: { 
    className?: string; 
    color?: string; 
    size?: number; 
}) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ shapeRendering: 'crispEdges' }}
        >
            <path
                d="
                M10,0 h4 v32 h-4 z
                M4,8 h6 v4 h-6 z
                M4,12 h4 v10 h-4 z
                M4,18 h6 v4 h-6 z
                M14,12 h6 v4 h-6 z
                M16,16 h4 v10 h-4 z
                M14,22 h6 v4 h-6 z
                "
                fill={color}
            />
        </svg>
    );
}
