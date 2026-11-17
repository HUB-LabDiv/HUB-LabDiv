'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const SPLASH_SPRING = {
    duration: 0.38,
    ease: [0.16, 1, 0.3, 1] as const,
};

export type SplashOrigin =
    | 'top left'
    | 'top center'
    | 'top right'
    | 'left center'
    | 'center';

function resolveOriginCoords(origin: SplashOrigin): { originX: number; originY: number; xOffset: number; yOffset: number } {
    switch (origin) {
        case 'top right':
            return { originX: 1, originY: 0, xOffset: 8, yOffset: -8 };
        case 'top center':
            return { originX: 0.5, originY: 0, xOffset: 0, yOffset: -8 };
        case 'left center':
            return { originX: 0, originY: 0.5, xOffset: -8, yOffset: 0 };
        case 'center':
            return { originX: 0.5, originY: 0.5, xOffset: 0, yOffset: -6 };
        case 'top left':
        default:
            return { originX: 0, originY: 0, xOffset: -6, yOffset: -8 };
    }
}

/**
 * Props padronizadas de animação "splash" 100% GPU-composited (apenas transform + opacity,
 * sem animar borderRadius para manter 60fps constantes em mobile e desktop).
 */
export function getSplashMotionProps(
    origin: SplashOrigin = 'top left',
    _targetRadius?: string,
    yOffsetOverride?: number,
    originXOverride?: number
) {
    const resolved = resolveOriginCoords(origin);
    const originX = originXOverride ?? resolved.originX;
    const originY = resolved.originY;
    const yOffset = yOffsetOverride ?? resolved.yOffset;
    const xOffset = resolved.xOffset;

    return {
        initial: {
            opacity: 0,
            scale: 0.86,
            x: xOffset,
            y: yOffset,
        },
        animate: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            x: xOffset,
            y: yOffset,
        },
        transition: SPLASH_SPRING,
        style: {
            originX,
            originY,
            transformOrigin: `${originX * 100}% ${originY * 100}%`,
            willChange: 'transform, opacity',
        },
    };
}

interface SplashExpandProps {
    isOpen: boolean;
    origin?: SplashOrigin;
    targetRadius?: string;
    yOffset?: number;
    originXOverride?: number;
    className?: string;
    initial?: boolean;
    children: React.ReactNode;
}

/**
 * Container reutilizável para expansões fluidas com efeito splash originado do botão gatilho.
 */
export function SplashExpand({
    isOpen,
    origin = 'top left',
    targetRadius,
    yOffset,
    originXOverride,
    className = '',
    initial = false,
    children,
}: SplashExpandProps) {
    return (
        <AnimatePresence initial={initial}>
            {isOpen && (
                <motion.div
                    {...getSplashMotionProps(origin, targetRadius, yOffset, originXOverride)}
                    className={className}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
