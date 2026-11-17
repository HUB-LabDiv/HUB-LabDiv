'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import { useEffect } from 'react';

/**
 * Camada global de micro-interação M3 para todos os botões/links-botão:
 * - Magnetic Hover sutil (até 3px) em dispositivos com mouse (pointer: fine).
 * - Reação tátil elástica ao pressionar/clicar sem interferir em submits.
 */
export function GlobalButtonEffects() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const getInteractiveTarget = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      const el = target.closest('button, [role="button"], a[class*="rounded-"]') as HTMLElement | null;
      if (!el || el.dataset.noMagnetic === 'true' || (el as HTMLButtonElement).disabled) return null;
      return el;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!finePointer) return;
      const el = getInteractiveTarget(e.target);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.width > 360 || rect.height > 120) return;

      const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      const moveX = Math.max(-3, Math.min(3, relX * 3));
      const moveY = Math.max(-3, Math.min(3, relY * 3));

      el.style.setProperty('--mag-x', `${moveX.toFixed(2)}px`);
      el.style.setProperty('--mag-y', `${moveY.toFixed(2)}px`);
      el.dataset.magActive = '1';
    };

    const handlePointerOut = (e: PointerEvent) => {
      const el = getInteractiveTarget(e.target);
      if (!el) return;
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
      delete el.dataset.magActive;
    };

    const handlePointerDown = (e: PointerEvent) => {
      const el = getInteractiveTarget(e.target);
      if (!el) return;
      el.dataset.m3Pressed = '1';
      setTimeout(() => {
        delete el.dataset.m3Pressed;
      }, 180);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerout', handlePointerOut, { passive: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return null;
}

