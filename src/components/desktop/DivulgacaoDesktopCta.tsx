'use client';

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

import React, { useState, useSyncExternalStore } from 'react';
import { Monitor } from 'lucide-react';
import { isNativeOrDesktop } from '@/lib/desktop-bridge';
import type { DesktopReleasePayload } from '@/types/desktop';
import { DesktopDownloadModal } from './DesktopDownloadModal';

const emptySubscribe = () => () => {};

export function DivulgacaoDesktopCta({
  initialRelease,
}: {
  initialRelease: DesktopReleasePayload;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hidden = useSyncExternalStore(
    emptySubscribe,
    () => isNativeOrDesktop(),
    () => false
  );

  if (hidden) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="col-span-2 sm:col-span-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#1F9FCF]/15 hover:bg-[#1F9FCF]/25 border border-[#1F9FCF]/40 active:scale-[0.98] text-[#1F9FCF] font-bukra font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-lg transition-all text-center cursor-pointer"
      >
        <Monitor className="size-4 sm:size-[18px] shrink-0" />
        <span className="truncate">Baixar para PC</span>
      </button>

      <DesktopDownloadModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialRelease={initialRelease}
      />
    </>
  );
}
