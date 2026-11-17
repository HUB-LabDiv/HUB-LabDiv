'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface PillOption<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ReactNode;
  activeBgClass?: string;
  activeTextClass?: string;
  hoverTextClass?: string;
  dataTour?: string;
}

interface SegmentedPillSwitchProps<T extends string = string> {
  options: PillOption<T>[];
  activeId: T;
  onChange: (id: T) => void;
  layoutId: string;
  className?: string;
  dataTour?: string;
}

/**
 * Switch em pílula padrão do ecossistema:
 * suporta clique, deslize horizontal com dois dedos no touchpad (wheel deltaX)
 * e arraste/swipe horizontal no celular ou mouse.
 */
export function SegmentedPillSwitch<T extends string = string>({
  options,
  activeId,
  onChange,
  layoutId,
  className = '',
  dataTour,
}: SegmentedPillSwitchProps<T>) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const wheelCooldownRef = useRef<number>(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 260);
    return () => clearTimeout(timer);
  }, [activeId]);

  const stepOption = (direction: 1 | -1) => {
    if (options.length <= 1) return;
    const currentIndex = options.findIndex((o) => o.id === activeId);
    if (currentIndex === -1) return;
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + direction));
    if (nextIndex !== currentIndex) {
      onChange(options[nextIndex].id);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 16) return;
    const now = Date.now();
    if (now - wheelCooldownRef.current < 320) return;
    wheelCooldownRef.current = now;
    stepOption(e.deltaX > 0 ? 1 : -1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (!t) return;
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 150);
      stepOption(dx < 0 ? 1 : -1);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy)) {
      suppressClickRef.current = true;
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 150);
      stepOption(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      data-tour={dataTour}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className={`inline-flex items-center gap-1.5 p-1.5 bg-white/75 dark:bg-background-dark/65 backdrop-blur-2xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl pointer-events-auto touch-pan-y select-none ${className}`}
    >
      {options.map((opt) => {
        const isActive = opt.id === activeId;
        const activeBg = opt.activeBgClass || 'bg-[#1F9FCF] shadow-lg shadow-[#1F9FCF]/25';
        const activeText = opt.activeTextClass || 'text-white';
        const hoverText = opt.hoverTextClass || 'hover:text-[#1F9FCF]';

        return (
          <button
            key={opt.id}
            type="button"
            data-tour={opt.dataTour}
            onClick={() => {
              if (!suppressClickRef.current) onChange(opt.id);
            }}
            className={`relative flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2 rounded-xl text-[10px] sm:text-xs font-black font-bukra uppercase tracking-widest transition-colors cursor-pointer active:scale-95 ${
              isActive ? activeText : `text-gray-500 dark:text-gray-400 ${hoverText}`
            }`}
          >
            {isActive && (
              <motion.div
                layoutId={layoutId}
                animate={
                  isTransitioning
                    ? { scaleY: [1, 0.82, 1], scaleX: [1, 1.14, 1] }
                    : { scaleY: 1, scaleX: 1 }
                }
                transition={{
                  layout: { type: 'spring', stiffness: 420, damping: 24 },
                  scaleY: { duration: 0.26, times: [0, 0.45, 1] },
                  scaleX: { duration: 0.26, times: [0, 0.45, 1] },
                }}
                className={`absolute inset-0 rounded-xl ${activeBg}`}
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
              {opt.icon}
              <span>{opt.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
