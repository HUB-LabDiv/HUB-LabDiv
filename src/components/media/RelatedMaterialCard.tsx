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

import React, { useState } from 'react';
import Link from 'next/link';
import { extractSubmissionThumbnail, getOptimizedUrl } from '@/lib/media-utils';

interface RelatedSubmission {
    id: string;
    title: string;
    authors?: string;
    category?: string;
    media_type?: string;
    media_url?: string | string[];
    thumbnail_url?: string;
    alt_text?: string;
    description?: string;
}

interface RelatedMaterialCardProps {
    submission: RelatedSubmission;
}

export function RelatedMaterialCard({ submission }: RelatedMaterialCardProps) {
    const [imgError, setImgError] = useState(false);
    const rawThumb = extractSubmissionThumbnail(submission);
    const optimizedThumb = rawThumb ? getOptimizedUrl(rawThumb, 600, 75, submission.category, submission.media_type) : null;
    const hasImage = !!optimizedThumb && !imgError;

    // Helper de ícones de mídia
    const getMediaBadge = () => {
        switch (submission.media_type) {
            case 'video':
                return { icon: 'play_circle', label: 'Vídeo' };
            case 'pdf':
                return { icon: 'picture_as_pdf', label: 'PDF' };
            case 'audio':
                return { icon: 'audiotrack', label: 'Áudio' };
            case 'sdocx':
                return { icon: 'auto_stories', label: 'Artigo / Guia' };
            case 'image':
                return { icon: 'image', label: 'Visual' };
            default:
                return { icon: 'article', label: 'Publicação' };
        }
    };

    const badge = getMediaBadge();

    // Paleta visual baseada na categoria
    const getCategoryAccent = () => {
        const cat = (submission.category || '').toLowerCase();
        if (cat.includes('mentorad') || cat.includes('deu ruim')) {
            return {
                border: 'group-hover:border-brand-yellow/40',
                glow: 'from-brand-yellow/20 via-brand-yellow/5 to-transparent',
                badgeBg: 'bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30',
                iconColor: 'text-brand-yellow',
                tag: 'text-brand-yellow'
            };
        }
        if (cat.includes('pesquisad') || cat.includes('história')) {
            return {
                border: 'group-hover:border-brand-red/40',
                glow: 'from-brand-red/20 via-brand-red/5 to-transparent',
                badgeBg: 'bg-brand-red/15 text-brand-red border-brand-red/30',
                iconColor: 'text-brand-red',
                tag: 'text-brand-red'
            };
        }
        return {
            border: 'group-hover:border-brand-blue/40',
            glow: 'from-brand-blue/20 via-brand-blue/5 to-transparent',
            badgeBg: 'bg-brand-blue/15 text-brand-blue border-brand-blue/30',
            iconColor: 'text-brand-blue',
            tag: 'text-brand-blue'
        };
    };

    const accent = getCategoryAccent();

    return (
        <Link
            href={`/arquivo/${submission.id}`}
            className={`group block bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${accent.border}`}
        >
            <div className="aspect-video bg-gray-100 dark:bg-[#121212] overflow-hidden relative flex items-center justify-center">
                {hasImage ? (
                    <>
                        <img
                            src={optimizedThumb}
                            alt={submission.alt_text || submission.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                        {/* Overlay Gradiente */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        {/* Badge de tipo no topo esquerdo */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                            <span>{badge.label}</span>
                        </div>
                    </>
                ) : (
                    /* Fallback Card com estética Lab-Div */
                    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#101010] p-5 flex flex-col justify-between">
                        {/* Efeito de brilho radial de fundo */}
                        <div className={`absolute -right-8 -top-8 w-40 h-40 rounded-full bg-gradient-to-br ${accent.glow} blur-2xl pointer-events-none`} />
                        
                        {/* Fórmulas / marcas d'água científicas sutis */}
                        <div className="absolute inset-0 select-none pointer-events-none opacity-5 font-mono text-[10px] p-2 leading-relaxed flex flex-wrap gap-3 overflow-hidden">
                            <span>∇×B = μ₀J</span>
                            <span>ψ(x,t)</span>
                            <span>iℏ ∂ψ/∂t = Ĥψ</span>
                            <span>E = mc²</span>
                            <span>S = k ln Ω</span>
                            <span>∮ E·da = Q/ε₀</span>
                        </div>

                        {/* Topo do Card: Badge de Categoria & Tipo */}
                        <div className="relative z-10 flex items-center justify-between w-full">
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-wider ${accent.badgeBg}`}>
                                <span className="material-symbols-outlined text-[12px]">{badge.icon}</span>
                                <span>{badge.label}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                {submission.category || 'Lab-Div'}
                            </span>
                        </div>

                        {/* Centro do Card: Ícone em destaque */}
                        <div className="relative z-10 my-auto flex flex-col items-center justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                                <span className={`material-symbols-outlined text-2xl ${accent.iconColor}`}>
                                    {badge.icon}
                                </span>
                            </div>
                        </div>

                        {/* Rodapé da miniatura: Marca HUB LabDiv */}
                        <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-gray-500">
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block animate-pulse" />
                                HUB LabDiv
                            </span>
                            <span className="opacity-75">Ler publicação →</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4">
                <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-brand-blue transition-colors text-sm sm:text-base">
                    {submission.title}
                </h4>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="truncate max-w-[70%] font-medium">
                        {submission.authors || 'Equipe Lab-Div'}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${accent.tag}`}>
                        {submission.category || 'Lab-Div'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
