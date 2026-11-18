'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { RefObject } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';

interface ScrollJellyCardProps {
  children: React.ReactNode;
  className?: string;
  axis?: 'vertical' | 'horizontal';
  containerRef?: RefObject<HTMLElement | null>;
  staggerIndex?: number;
}

/**
 * Squash & Stretch bidirecional baseado na velocidade de scroll:
 * - Vertical  : achata topo/base (scaleY↓) e compensa nas laterais (scaleX↑) ao subir/descer rápido.
 * - Horizontal: achata as laterais (scaleX↓) e compensa em cima/baixo (scaleY↑) ao ir para os lados.
 */
export function ScrollJellyCard({
  children,
  className = '',
  axis = 'vertical',
  containerRef,
  staggerIndex,
}: ScrollJellyCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { scrollX } = useScroll(
    containerRef ? { container: containerRef } : undefined
  );

  const velY = useVelocity(scrollY);
  const velX = useVelocity(scrollX);

  const clampRatio = (v: number, denom = 950) => Math.min(Math.abs(v) / denom, 1);

  // Squash & Stretch correto:
  // Vertical  → scroll ↕ achata topo/base (scaleY−) e compensa nas laterais (scaleX+)
  // Horizontal → scroll ↔ achata laterais  (scaleX−) e compensa em cima/baixo (scaleY+)
  const isHoriz = axis === 'horizontal' || !!containerRef;

  const rawScaleX = useTransform([velX, velY], ([vx, vy]: number[]) => {
    const xBoost = isHoriz ? clampRatio(vx, 650) * 0.065 : clampRatio(vy) * 0.04; // estica X ao scrollar vertical
    const xSquash = isHoriz ? clampRatio(vx, 650) * 0.065 : 0; // eixo H: próprio squash
    return isHoriz ? 1 - xSquash : 1 + xBoost;
  });

  const rawScaleY = useTransform([velX, velY], ([vx, vy]: number[]) => {
    const ySquash = !isHoriz ? clampRatio(vy) * 0.055 : 0; // achata topo/base ao scrollar vertical
    const yBoost  = isHoriz  ? clampRatio(vx, 650) * 0.04 : 0; // estica Y ao scrollar horizontal
    return isHoriz ? 1 + yBoost : 1 - ySquash;
  });

  const springConfig = { stiffness: 300, damping: 18, mass: 0.45 };
  const scaleX = useSpring(rawScaleX, springConfig);
  const scaleY = useSpring(rawScaleY, springConfig);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const staggerDelay =
    typeof staggerIndex === 'number' && staggerIndex < 12
      ? Math.min(staggerIndex * 0.035, 0.35)
      : 0;

  return (
    <motion.div
      initial={typeof staggerIndex === 'number' ? { opacity: 0, y: 14 } : false}
      animate={typeof staggerIndex === 'number' ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.28, delay: staggerDelay, ease: 'easeOut' }}
      style={{
        scaleY,
        scaleX,
        transformOrigin: 'center center',
        willChange: 'transform',
        contentVisibility: 'auto',
        containIntrinsicSize: '380px',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
