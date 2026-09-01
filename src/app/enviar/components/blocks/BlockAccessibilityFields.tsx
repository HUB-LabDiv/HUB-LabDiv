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

import React from 'react';

interface BlockAccessibilityFieldsProps {
    caption?: string;
    altText?: string;
    onCaptionChange: (val: string) => void;
    onAltTextChange: (val: string) => void;
    captionPlaceholder?: string;
    altTextPlaceholder?: string;
    captionLabel?: string;
    altTextLabel?: string;
    resourceType?: string;
    isActive?: boolean;
}

export function BlockAccessibilityFields({
    caption = '',
    altText = '',
    onCaptionChange,
    onAltTextChange,
    captionPlaceholder = 'Adicione uma legenda contextual ou descritivo deste conteúdo...',
    altTextPlaceholder = 'Descreva os elementos visuais, sonoros ou estruturais para pessoas com deficiência...',
    captionLabel = 'Legenda / Descrição do Conteúdo',
    altTextLabel = 'Texto Alternativo (Acessibilidade / Audiodescrição)',
    resourceType = 'recurso',
    isActive = true
}: BlockAccessibilityFieldsProps) {
    return (
        <div className="flex flex-col gap-3 mt-3 p-3.5 bg-black/40 border border-white/10 rounded-2xl shadow-inner animate-fade-in">
            {/* Campo 1: Legenda / Descrição Contextual */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bukra font-bold text-brand-yellow uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">subtitles</span>
                    <span>{captionLabel}</span>
                </label>
                <input
                    type="text"
                    value={caption}
                    onChange={(e) => onCaptionChange(e.target.value)}
                    placeholder={captionPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-brand-yellow focus:bg-white/10 transition-all font-sans placeholder:text-gray-500"
                    disabled={!isActive}
                />
            </div>

            {/* Campo 2: Texto Alternativo para Acessibilidade */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bukra font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-brand-blue-accent">accessibility_new</span>
                    <span>{altTextLabel}</span>
                </label>
                <input
                    type="text"
                    value={altText}
                    onChange={(e) => onAltTextChange(e.target.value)}
                    placeholder={altTextPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-gray-200 outline-none focus:border-brand-yellow focus:bg-white/10 transition-all font-sans placeholder:text-gray-500"
                    disabled={!isActive}
                />
            </div>
        </div>
    );
}
