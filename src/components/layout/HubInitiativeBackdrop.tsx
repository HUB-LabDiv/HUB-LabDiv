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
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { MatrixCodeRain } from '@/components/ui/MatrixCodeRain';
import { getInitiativeIdv } from '@/idv';

export function HubInitiativeBackdrop() {
  const { initiativeTheme } = usePersonalizacaoStore();
  const idv = getInitiativeIdv(initiativeTheme);

  if (initiativeTheme === 'hub') return null;

  if (initiativeTheme === 'hs') {
    return (
      <>
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle at 80% 20%, rgba(0, 255, 102, 0.14) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(255, 204, 0, 0.10) 0%, transparent 45%), #060a08',
          }}
        />
        <MatrixCodeRain opacity={0.34} />
      </>
    );
  }

  if (initiativeTheme === 'show-da-fisica') {
    return (
      <>
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            background:
              'radial-gradient(circle at 80% 15%, rgba(0, 212, 255, 0.16) 0%, transparent 45%), radial-gradient(circle at 15% 80%, rgba(255, 30, 86, 0.14) 0%, transparent 45%), #040714',
          }}
        />
        <div
          aria-hidden="true"
          style={{
            backgroundImage: "url('/bg-show.svg')",
            backgroundSize: '360px 360px',
            backgroundRepeat: 'repeat',
            opacity: 0.25,
          }}
          className="fixed inset-0 pointer-events-none select-none z-0"
        />
      </>
    );
  }

  if (initiativeTheme === 'profis') {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 85% 15%, rgba(245, 158, 11, 0.16) 0%, transparent 50%), radial-gradient(circle at 15% 85%, rgba(56, 189, 248, 0.12) 0%, transparent 45%), #080c16',
        }}
      >
        <span className="absolute top-[12%] left-[6%] text-xs font-mono font-bold text-[#F59E0B]/20">
          ∫ₐᵇ f(x)dx = F(b) − F(a)
        </span>
        <span className="absolute top-[28%] right-[8%] text-xs font-mono font-bold text-[#38BDF8]/20">
          ∑ F = dp / dt
        </span>
        <span className="absolute bottom-[18%] left-[10%] text-xs font-mono font-bold text-[#FFCC00]/20">
          E = K + U
        </span>
      </div>
    );
  }

  // Tema LabDiv Oficial (#0F4780, #1F9FCF, #F14343, #FFCC00)
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(circle at 12% 18%, ${idv.colors.primaryContainer}55 0%, transparent 48%), radial-gradient(circle at 52% 48%, ${idv.colors.tertiary}26 0%, transparent 50%), radial-gradient(circle at 88% 82%, ${idv.colors.secondary}28 0%, transparent 48%)`,
      }}
    />
  );
}

