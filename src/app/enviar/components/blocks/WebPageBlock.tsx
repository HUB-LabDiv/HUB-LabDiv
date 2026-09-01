/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { BlockAccessibilityFields } from './BlockAccessibilityFields';

interface WebPageBlockProps {
    block: Block;
    isActive: boolean;
}

export default function WebPageBlock({ block, isActive }: WebPageBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const url = block.content.url || '';
    const height = block.content.height || 400;
    const caption = block.content.caption || '';
    const altText = block.content.altText || '';

    // Convert Drive link to preview link if needed
    const getEmbedUrl = (rawUrl: string) => {
        if (!rawUrl) return '';
        if (rawUrl.includes('drive.google.com/file/d/')) {
            const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }
        return rawUrl;
    };

    const embedUrl = getEmbedUrl(url);

    return (
        <div className="flex flex-col gap-4 w-full">
            {isActive && (
                <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL da Página ou Link do Drive com os arquivos</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => updateBlock(block.id, { url: e.target.value, height, caption, altText })}
                            placeholder="https://..."
                            className="w-full bg-background-dark/40 border border-gray-700/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-blue/50 text-white placeholder-gray-600 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Altura do iFrame</label>
                            <span className="text-[10px] font-bold text-gray-200">{height}px</span>
                        </div>
                        <input
                            type="range"
                            min="200"
                            max="600"
                            step="50"
                            value={height}
                            onChange={(e) => updateBlock(block.id, { url, height: parseInt(e.target.value), caption, altText })}
                            className="w-full accent-brand-blue"
                        />
                    </div>
                </div>
            )}

            {embedUrl ? (
                <div className="w-full rounded-xl overflow-hidden border border-gray-800/50 bg-background-dark/20 transition-all duration-300 max-h-[75vh]" style={{ height: `${height}px` }}>
                    <iframe 
                        src={embedUrl} 
                        className="w-full h-full border-0"
                        title={caption || altText || "Embedded Web Page"}
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="w-full h-32 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                    <span className="material-symbols-outlined text-3xl mb-1">web</span>
                    <span className="text-xs">Nenhuma URL configurada</span>
                </div>
            )}

            {caption && !isActive && (
                <p className="text-xs text-gray-400 text-center italic font-sans">
                    {caption}
                </p>
            )}

            <BlockAccessibilityFields
                caption={caption}
                altText={altText}
                onCaptionChange={(val) => updateBlock(block.id, { caption: val })}
                onAltTextChange={(val) => updateBlock(block.id, { altText: val })}
                captionLabel="Legenda / Identificação da Página Incorporada"
                captionPlaceholder="Ex: Ferramenta interativa do laboratório para simulação..."
                altTextLabel="Texto Alternativo (Acessibilidade)"
                altTextPlaceholder="Descreva o conteúdo e o objetivo da página web incorporada..."
                isActive={isActive}
            />
        </div>
    );
}
