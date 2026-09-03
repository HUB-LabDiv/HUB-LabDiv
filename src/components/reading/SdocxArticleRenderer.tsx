'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V4.0
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
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

import { processAlignedText } from '@/lib/textAlignment';
import { SdocxHeroImage, SdocxInlineImage } from '@/components/reading/SdocxImageBlock';
import { ImageCarouselClient } from '@/app/arquivo/[id]/ImageCarouselClient';
import { PostQuiz } from '@/components/media/PostQuiz';
import { formatYoutubeUrl, getPdfEmbedUrl } from '@/lib/media-utils';
import { Block } from '@/app/enviar/schema';

interface SdocxArticleRendererProps {
    blocks: Block[] | any[];
    submissionId?: string;
    submissionTitle?: string;
    isPreview?: boolean;
}

/** Estilos dos botões de Link conforme IDV do LabDiv */
function getLinkButtonStyle(style: string) {
    const base = "relative inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl group transition-all duration-300 overflow-hidden font-bukra font-bold text-xs sm:text-sm tracking-wide w-full shadow-lg";
    switch (style) {
        case 'solid-black':
            return `${base} bg-[#151515] text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:bg-[#252525] border border-white/10`;
        case 'solid-yellow':
            return `${base} bg-brand-yellow text-gray-950 shadow-[0_10px_30px_rgba(255,204,0,0.25)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.4)] border border-brand-yellow`;
        case 'solid-blue':
            return `${base} bg-brand-blue text-white shadow-[0_10px_30px_rgba(15,71,128,0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,71,128,0.5)] border border-brand-blue`;
        case 'solid-red':
            return `${base} bg-brand-red text-white shadow-[0_10px_30px_rgba(241,67,67,0.3)] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(241,67,67,0.5)] border border-brand-red`;
        case 'hover-yellow':
            return `${base} bg-[#1E1E1E] text-white hover:text-gray-950 hover:bg-brand-yellow border border-white/10 hover:border-brand-yellow hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.3)]`;
        case 'hover-blue':
            return `${base} bg-[#1E1E1E] text-white hover:bg-brand-blue hover:text-white border border-white/10 hover:border-brand-blue hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,71,128,0.3)]`;
        case 'hover-red':
            return `${base} bg-[#1E1E1E] text-white hover:bg-brand-red hover:text-white border border-white/10 hover:border-brand-red hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(241,67,67,0.3)]`;
        case 'hover-gradient':
            return `${base} bg-[#1E1E1E] text-white hover:bg-gradient-to-r hover:from-brand-blue hover:via-brand-red hover:to-brand-yellow border border-white/10 hover:border-0 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]`;
        case 'gradient':
            return `${base} bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow text-white border-0 hover:opacity-90 shadow-[0_10px_30px_rgba(15,71,128,0.3)] hover:-translate-y-0.5`;
        case 'border-yellow':
            return `${base} bg-[#1E1E1E] text-brand-yellow border-2 border-brand-yellow hover:bg-brand-yellow/10 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.2)]`;
        case 'border-blue':
            return `${base} bg-[#1E1E1E] text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/10 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(15,71,128,0.2)]`;
        case 'border-red':
            return `${base} bg-[#1E1E1E] text-brand-red border-2 border-brand-red hover:bg-brand-red/10 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(241,67,67,0.2)]`;
        default:
            return `${base} bg-[#1E1E1E] text-white border border-white/10 hover:-translate-y-0.5 hover:bg-[#252525] hover:border-white/20`;
    }
}

function getLinkIconClass(style: string) {
    if (style.startsWith('solid-') && style !== 'solid-yellow') {
        return "text-white";
    } else if (style === 'solid-yellow') {
        return "text-gray-950";
    } else if (style === 'hover-yellow') {
        return "text-brand-yellow group-hover:text-gray-950";
    } else if (style === 'hover-blue') {
        return "text-brand-blue group-hover:text-white";
    } else if (style === 'hover-red') {
        return "text-brand-red group-hover:text-white";
    } else if (style === 'hover-gradient' || style === 'gradient') {
        return "text-white";
    } else if (style === 'border-yellow') {
        return "text-brand-yellow";
    } else if (style === 'border-blue') {
        return "text-brand-blue";
    } else if (style === 'border-red') {
        return "text-brand-red";
    }
    return "text-gray-400 group-hover:text-white";
}

/** Componente de Reflexão Interativa (Enquete / Discursiva) */
function ReflectionCard({ block }: { block: Block | any }) {
    const question = block.content?.question || '';
    const questionType = block.content?.questionType || 'discursive';
    const options: string[] = block.content?.options || [];
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    return (
        <div className="p-5 sm:p-6 bg-[#0F4780]/15 border-l-4 border-brand-blue rounded-r-2xl space-y-4 my-6 shadow-md transition-all">
            <div className="flex items-center gap-2 flex-wrap">
                <span className="material-symbols-outlined text-brand-blue-accent text-xl">psychology</span>
                <span className="text-xs font-bukra font-bold uppercase tracking-wider text-brand-blue-accent">
                    Balão de Reflexão
                </span>
                <span className="text-[10px] font-mono text-gray-400 ml-auto bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                    {questionType === 'multiple_choice' ? 'Enquete / Múltipla Escolha' : 'Reflexão Discursiva'}
                </span>
            </div>

            <p className="text-sm sm:text-base text-gray-100 font-sans font-medium leading-relaxed">
                {question || 'Pergunta reflexiva não informada.'}
            </p>

            {questionType === 'multiple_choice' && options.length > 0 && (
                <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bukra font-bold text-gray-400 uppercase tracking-widest block">
                        Opções de Voto / Reflexão:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {options.map((opt: string, optIdx: number) => {
                            if (!opt || !opt.trim()) return null;
                            const isSelected = selectedOption === optIdx;
                            return (
                                <button
                                    key={optIdx}
                                    type="button"
                                    onClick={() => setSelectedOption(optIdx)}
                                    className={`px-4 py-3 rounded-xl border text-left text-xs font-sans transition-all flex items-center gap-3 cursor-pointer ${
                                        isSelected
                                            ? 'bg-brand-blue text-white border-brand-blue shadow-lg font-bold'
                                            : 'bg-white/5 border-white/10 text-gray-200 hover:border-brand-blue/50 hover:bg-brand-blue/10'
                                    }`}
                                >
                                    <div className={`size-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                        isSelected ? 'border-white bg-white' : 'border-gray-500'
                                    }`}>
                                        {isSelected && <span className="size-1.5 rounded-full bg-brand-blue" />}
                                    </div>
                                    <span className="flex-1">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {questionType === 'discursive' && (
                <div className="pt-1">
                    <textarea
                        rows={2}
                        placeholder="Escreva sua reflexão aqui (simulação do leitor)..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-gray-200 placeholder-gray-500 outline-none focus:border-brand-blue transition-all resize-none font-sans"
                    />
                </div>
            )}
        </div>
    );
}

/** Renderizador Universal de Conteúdo SDOCX */
export function SdocxArticleRenderer({
    blocks,
    submissionId = 'preview',
    submissionTitle = 'Artigo',
    isPreview = false
}: SdocxArticleRendererProps) {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 font-sans text-sm italic">
                Nenhum bloco de conteúdo foi inserido nesta publicação ainda.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full">
            {blocks.map((block: any, index: number) => {
                const blockKey = block.id || `block-${index}`;

                switch (block.type) {
                    // ==========================================
                    // 1. TEXTO (Markdown, KaTeX, HTML, Alinhamento)
                    // ==========================================
                    case 'text': {
                        const textContent = block.content?.text || '';
                        if (!textContent.trim()) return null;

                        const hasLatex = /\$[^\$]+\$/.test(textContent) || /\$\$[\s\S]+\$\$/.test(textContent);
                        const isPureHtml = /<[a-z][\s\S]*>/i.test(textContent) && !hasLatex;

                        return (
                            <div key={blockKey} className="w-full font-sans leading-relaxed text-gray-200">
                                <div className="prose dark:prose-invert max-w-none break-words [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere] prose-headings:font-bukra prose-headings:font-bold prose-headings:text-white prose-headings:mb-3 prose-p:text-gray-300 prose-p:mb-3 prose-p:font-sans prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-4 prose-blockquote:border-brand-yellow prose-blockquote:bg-white/5 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-300">
                                    {isPureHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: textContent }} />
                                    ) : (
                                        processAlignedText(textContent).map((segment, segIdx) => (
                                            <div key={segIdx} style={{ textAlign: segment.align }}>
                                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                                                    {segment.text}
                                                </ReactMarkdown>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    }

                    // ==========================================
                    // 2. CONTEXTOS (Histórico, Social, Político, etc.)
                    // ==========================================
                    case 'context_history':
                    case 'context_social':
                    case 'context_political':
                    case 'context_world_object':
                    case 'context_object_world': {
                        const text = block.content?.text || '';
                        const configMap: Record<string, { label: string; icon: string; borderClass: string; badgeClass: string }> = {
                            context_history: { label: 'Contexto Histórico', icon: 'history_edu', borderClass: 'border-brand-yellow/40 bg-brand-yellow/5', badgeClass: 'text-brand-yellow' },
                            context_social: { label: 'Contexto Social', icon: 'groups', borderClass: 'border-brand-blue/40 bg-brand-blue/5', badgeClass: 'text-brand-blue-accent' },
                            context_political: { label: 'Contexto Político', icon: 'gavel', borderClass: 'border-brand-red/40 bg-brand-red/5', badgeClass: 'text-brand-red' },
                            context_world_object: { label: 'Mundo → Objeto', icon: 'travel_explore', borderClass: 'border-brand-yellow/40 bg-brand-yellow/5', badgeClass: 'text-brand-yellow' },
                            context_object_world: { label: 'Objeto → Mundo', icon: 'public', borderClass: 'border-brand-yellow/40 bg-brand-yellow/5', badgeClass: 'text-brand-yellow' },
                        };
                        const cfg = configMap[block.type] || { label: 'Contexto', icon: 'info', borderClass: 'border-white/10 bg-white/5', badgeClass: 'text-gray-300' };

                        return (
                            <div key={blockKey} className={`p-5 sm:p-6 rounded-2xl border ${cfg.borderClass} space-y-3 shadow-md`}>
                                <div className="flex items-center gap-2">
                                    <span className={`material-symbols-outlined text-2xl ${cfg.badgeClass}`}>{cfg.icon}</span>
                                    <span className={`text-xs font-bukra font-bold uppercase tracking-wider ${cfg.badgeClass}`}>
                                        {cfg.label}
                                    </span>
                                </div>
                                {text.trim() ? (
                                    <div className="text-sm text-gray-200 font-sans leading-relaxed">
                                        {processAlignedText(text).map((seg: any, segIdx: number) => (
                                            <div key={segIdx} style={{ textAlign: seg.align }}>
                                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                                                    {seg.text}
                                                </ReactMarkdown>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 font-sans italic">
                                        Eixo de contextualização aguardando desenvolvimento textual.
                                    </p>
                                )}
                            </div>
                        );
                    }

                    // ==========================================
                    // 3. BOTÕES DE LINK (LabDiv Buttons)
                    // ==========================================
                    case 'link': {
                        let buttons = block.content?.buttons;
                        if (!buttons || !Array.isArray(buttons)) {
                            if (block.content?.url) {
                                buttons = [{ id: '1', label: block.content.label || 'Acessar Link', url: block.content.url, style: 'solid-yellow' }];
                            } else {
                                buttons = [];
                            }
                        }

                        if (buttons.length === 0) return null;

                        return (
                            <div key={blockKey} className="w-full py-3 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4">
                                {buttons.map((btn: any, btnIdx: number) => {
                                    if (!btn.url && !btn.label) return null;
                                    const isInternal = btn.url?.includes('hublabdiv') || btn.url?.startsWith('/') || btn.url?.includes('localhost');
                                    return (
                                        <a
                                            key={btn.id || btnIdx}
                                            href={btn.url || '#'}
                                            target={isInternal ? '_self' : '_blank'}
                                            rel={isInternal ? '' : 'noopener noreferrer'}
                                            className={getLinkButtonStyle(btn.style || 'solid-yellow')}
                                        >
                                            <span className={`material-symbols-outlined text-[20px] transition-colors ${getLinkIconClass(btn.style || 'solid-yellow')}`}>
                                                {isInternal ? 'hub' : 'open_in_new'}
                                            </span>
                                            <span>{btn.label || 'Acessar Link'}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        );
                    }

                    // ==========================================
                    // 4. PÁGINA INCORPORADA (Web Page / iFrame)
                    // ==========================================
                    case 'web_page': {
                        const rawUrl = block.content?.url || '';
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';
                        const height = block.content?.height || 400;

                        let embedUrl = rawUrl;
                        if (rawUrl.includes('drive.google.com/file/d/')) {
                            const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
                            if (match && match[1]) {
                                embedUrl = `https://drive.google.com/file/d/${match[1]}/preview`;
                            }
                        }

                        return (
                            <figure key={blockKey} className="w-full flex flex-col gap-2 my-4">
                                {embedUrl ? (
                                    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-xl" style={{ height: `${height}px` }}>
                                        <iframe
                                            src={embedUrl}
                                            className="w-full h-full border-0"
                                            title={caption || altText || 'Página Web Incorporada'}
                                            allowFullScreen
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full p-6 border-2 border-dashed border-brand-yellow/30 bg-brand-yellow/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
                                        <span className="material-symbols-outlined text-3xl text-brand-yellow">web</span>
                                        <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-300">
                                            {caption || altText || 'Página Web Incorporada (Rascunho)'}
                                        </span>
                                        <span className="text-[11px] text-gray-500 font-sans">
                                            Recurso web em diagramação aguardando endereço final.
                                        </span>
                                    </div>
                                )}
                                {caption && (
                                    <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                        {caption}
                                    </figcaption>
                                )}
                                {altText && <span className="sr-only">{altText}</span>}
                            </figure>
                        );
                    }

                    // ==========================================
                    // 5. BALÃO DE REFLEXÃO
                    // ==========================================
                    case 'reflection': {
                        return <ReflectionCard key={blockKey} block={block} />;
                    }

                    // ==========================================
                    // 6. IMAGEM
                    // ==========================================
                    case 'image': {
                        const url = block.content?.url;
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';

                        if (url) {
                            return (
                                <figure key={blockKey} className="w-full flex flex-col gap-2 my-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                        <SdocxInlineImage src={url} altText={altText || caption} />
                                    </div>
                                    {caption && (
                                        <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                            {caption}
                                        </figcaption>
                                    )}
                                    {altText && <span className="sr-only">{altText}</span>}
                                </figure>
                            );
                        }

                        // Fallback em modo de rascunho com legenda
                        return (
                            <div key={blockKey} className="rounded-2xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center gap-2 text-gray-400 my-4">
                                <span className="material-symbols-outlined text-4xl text-gray-500">add_photo_alternate</span>
                                <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-300">
                                    {caption || altText || 'Imagem em Rascunho'}
                                </span>
                                {altText && (
                                    <span className="text-[11px] text-gray-500 font-sans italic">
                                        Alt: {altText}
                                    </span>
                                )}
                            </div>
                        );
                    }

                    // ==========================================
                    // 7. CARROSSEL DE IMAGENS
                    // ==========================================
                    case 'carousel': {
                        const urls: string[] = block.content?.urls || [];
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';

                        if (urls.length > 0) {
                            return (
                                <figure key={blockKey} className="w-full flex flex-col gap-2 my-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                                        <ImageCarouselClient
                                            urls={urls}
                                            title={submissionTitle}
                                        />
                                    </div>
                                    {caption && (
                                        <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                            {caption}
                                        </figcaption>
                                    )}
                                    {altText && <span className="sr-only">{altText}</span>}
                                </figure>
                            );
                        }

                        return (
                            <div key={blockKey} className="rounded-2xl overflow-hidden border-2 border-dashed border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center text-center gap-2 text-gray-400 my-4">
                                <span className="material-symbols-outlined text-4xl text-gray-500">view_carousel</span>
                                <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-300">
                                    {caption || altText || 'Carrossel em Rascunho'}
                                </span>
                                <span className="text-[11px] text-gray-500 font-sans">
                                    Galeria sequencial de imagens.
                                </span>
                            </div>
                        );
                    }

                    // ==========================================
                    // 8. VÍDEO OU GIF
                    // ==========================================
                    case 'video': {
                        const videoUrl = block.content?.url || '';
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';
                        const isGif = videoUrl.toLowerCase().endsWith('.gif') || videoUrl.startsWith('data:image/gif');

                        if (videoUrl) {
                            return (
                                <figure key={blockKey} className="w-full flex flex-col gap-2 my-4">
                                    <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black shadow-xl">
                                        {isGif ? (
                                            <img
                                                src={videoUrl}
                                                alt={altText || caption || 'GIF Animado'}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <iframe
                                                src={formatYoutubeUrl(videoUrl)}
                                                className="w-full h-full border-0"
                                                allowFullScreen
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            />
                                        )}
                                    </div>
                                    {caption && (
                                        <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                            {caption}
                                        </figcaption>
                                    )}
                                    {altText && <span className="sr-only">{altText}</span>}
                                </figure>
                            );
                        }

                        return (
                            <div key={blockKey} className="rounded-2xl overflow-hidden border-2 border-dashed border-brand-red/30 bg-brand-red/5 p-8 flex flex-col items-center justify-center text-center gap-2 text-gray-400 my-4">
                                <span className="material-symbols-outlined text-4xl text-brand-red">smart_display</span>
                                <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-300">
                                    {caption || altText || 'Vídeo / GIF em Rascunho'}
                                </span>
                                <span className="text-[11px] text-gray-500 font-sans">
                                    Aguardando upload ou link do YouTube.
                                </span>
                            </div>
                        );
                    }

                    // ==========================================
                    // 9. ÁUDIO DE APOIO
                    // ==========================================
                    case 'audio': {
                        const audioUrl = block.content?.url || '';
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';

                        return (
                            <figure key={blockKey} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 my-4 shadow-md">
                                <div className="flex items-center gap-2 text-brand-red">
                                    <span className="material-symbols-outlined text-xl">audiotrack</span>
                                    <span className="text-xs font-bukra font-bold uppercase tracking-wider">Áudio de Apoio</span>
                                </div>
                                {audioUrl ? (
                                    <audio controls src={audioUrl} className="w-full outline-none" />
                                ) : (
                                    <div className="p-4 border-2 border-dashed border-white/10 rounded-xl text-center text-xs text-gray-500 italic">
                                        Faixa de áudio aguardando arquivo final.
                                    </div>
                                )}
                                {caption && (
                                    <figcaption className="text-xs text-gray-400 italic mt-1 font-sans">
                                        {caption}
                                    </figcaption>
                                )}
                                {altText && <span className="sr-only">{altText}</span>}
                            </figure>
                        );
                    }

                    // ==========================================
                    // 10. DOCUMENTO PDF
                    // ==========================================
                    case 'pdf': {
                        const pdfUrl = block.content?.url || '';
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';

                        return (
                            <figure key={blockKey} className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3 my-4 shadow-md">
                                <div className="flex items-center gap-2 text-brand-yellow">
                                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                    <span className="text-xs font-bukra font-bold uppercase tracking-wider">Documento PDF Anexo</span>
                                </div>
                                {pdfUrl ? (
                                    <iframe src={getPdfEmbedUrl(pdfUrl)} className="w-full h-96 rounded-xl border border-white/5" />
                                ) : (
                                    <div className="p-6 border-2 border-dashed border-brand-yellow/30 bg-brand-yellow/5 rounded-xl text-center text-xs text-gray-400 font-sans">
                                        Documento PDF anexado aguardando envio do arquivo final.
                                    </div>
                                )}
                                {caption && (
                                    <figcaption className="text-xs text-gray-400 italic mt-1 font-sans">
                                        {caption}
                                    </figcaption>
                                )}
                                {altText && <span className="sr-only">{altText}</span>}
                            </figure>
                        );
                    }

                    // ==========================================
                    // 11. MODELO 3D
                    // ==========================================
                    case '3d_object': {
                        const modelUrl = block.content?.url || '';
                        const caption = block.content?.caption || '';
                        const altText = block.content?.altText || '';

                        return (
                            <figure key={blockKey} className="w-full my-6 flex flex-col items-center gap-2">
                                <div className="w-full h-[450px] bg-background-dark/40 rounded-2xl overflow-hidden border border-white/10 shadow-xl flex items-center justify-center relative">
                                    {modelUrl ? (
                                        modelUrl.includes('drive.google') ? (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800/30">
                                                <span className="material-symbols-outlined text-5xl mb-2 text-brand-yellow">folder_zip</span>
                                                <span className="text-sm font-bukra font-bold uppercase tracking-widest text-gray-200 mb-2">Pasta do Google Drive</span>
                                                <a href={modelUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-brand-yellow underline-offset-4">
                                                    Acessar Modelo 3D no Drive
                                                </a>
                                            </div>
                                        ) : modelUrl.includes('sketchfab.com') ? (
                                            <iframe
                                                title={caption || altText || 'Sketchfab 3D Model'}
                                                src={modelUrl.includes('/embed') ? modelUrl : `${modelUrl}/embed`}
                                                className="w-full h-full border-0"
                                                allow="autoplay; fullscreen; xr-spatial-tracking"
                                                allowFullScreen
                                            />
                                        ) : (
                                            // @ts-ignore
                                            <model-viewer
                                                src={modelUrl}
                                                alt={altText || caption || 'Modelo 3D Interativo'}
                                                aria-label={altText || caption || 'Visualizador de Modelo 3D Interativo'}
                                                auto-rotate="true"
                                                camera-controls="true"
                                                ar="true"
                                                style={{ width: '100%', height: '100%' }}
                                            >
                                            {/* @ts-ignore */}
                                            </model-viewer>
                                        )
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl p-6">
                                            <span className="material-symbols-outlined text-4xl mb-2 text-brand-yellow">view_in_ar</span>
                                            <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-300">
                                                {caption || altText || 'Objeto 3D em Rascunho'}
                                            </span>
                                            <span className="text-[11px] text-gray-500 font-sans mt-1">
                                                Aguardando arquivo .glb/.gltf ou link do Sketchfab.
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {caption && (
                                    <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                        {caption}
                                    </figcaption>
                                )}
                                {altText && <span className="sr-only">{altText}</span>}
                            </figure>
                        );
                    }

                    // ==========================================
                    // 12. QUIZ INTERATIVO
                    // ==========================================
                    case 'quiz': {
                        return (
                            <div key={blockKey} className="my-6">
                                <PostQuiz quiz={[block.content]} submissionId={submissionId} />
                            </div>
                        );
                    }

                    // ==========================================
                    // 13. NOTAS DA AUTORIA / COMENTÁRIOS DE REVISÃO
                    // ==========================================
                    case 'notes': {
                        const text = block.content?.text || '';
                        if (!text.trim()) return null;

                        return (
                            <div key={blockKey} className="p-5 sm:p-6 bg-brand-yellow/10 border-2 border-dashed border-brand-yellow/40 rounded-2xl space-y-2.5 my-6 shadow-md">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-brand-yellow">
                                        <span className="material-symbols-outlined text-2xl">shield_person</span>
                                        <span className="text-xs font-bukra font-bold uppercase tracking-wider">
                                            Comentários da Autoria
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono text-brand-yellow bg-brand-yellow/20 px-2 py-0.5 rounded-full border border-brand-yellow/30">
                                        Notas para Revisão
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed whitespace-pre-wrap">
                                    {text}
                                </p>
                            </div>
                        );
                    }

                    // ==========================================
                    // 14. REFERÊNCIAS / FONTES
                    // ==========================================
                    case 'reference': {
                        const text = block.content?.text || '';
                        if (!text.trim()) return null;

                        return (
                            <div key={blockKey} className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl space-y-3 my-6 shadow-sm">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <span className="material-symbols-outlined text-2xl text-brand-yellow">format_quote</span>
                                    <span className="text-xs font-bukra font-bold uppercase tracking-wider text-gray-200">
                                        Referências / Fontes
                                    </span>
                                </div>
                                <div className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {text}
                                </div>
                            </div>
                        );
                    }

                    // ==========================================
                    // 15. PASTA DO GOOGLE DRIVE
                    // ==========================================
                    case 'drive': {
                        const driveUrl = block.content?.url || '';

                        return (
                            <div key={blockKey} className="p-5 sm:p-6 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-2xl">folder_zip</span>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-bukra font-bold text-white uppercase tracking-wide">
                                            Pasta do Google Drive
                                        </h5>
                                        <p className="text-xs text-gray-400 font-sans mt-0.5">
                                            Roteiros, background e materiais complementares
                                        </p>
                                    </div>
                                </div>
                                {driveUrl ? (
                                    <a
                                        href={driveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-brand-yellow text-gray-950 hover:bg-[#E5B800] rounded-xl text-xs font-bukra font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow"
                                    >
                                        <span>Acessar Drive</span>
                                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                                    </a>
                                ) : (
                                    <span className="text-xs text-gray-500 font-sans italic">Link do Drive não configurado</span>
                                )}
                            </div>
                        );
                    }

                    // ==========================================
                    // 16. JOGO WEB / SIMULAÇÃO
                    // ==========================================
                    case 'web_game': {
                        const gameUrl = block.content?.url;

                        return (
                            <div key={blockKey} className="p-6 border-2 border-dashed border-brand-red/30 bg-brand-red/5 rounded-2xl flex flex-col items-center justify-center text-center gap-2 my-4">
                                <span className="material-symbols-outlined text-3xl text-brand-red">sports_esports</span>
                                <span className="text-sm font-bukra font-bold text-gray-200 uppercase tracking-wide">
                                    Jogo Web / Simulação
                                </span>
                                {gameUrl ? (
                                    <a href={gameUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bukra font-bold text-brand-yellow underline mt-1">
                                        Abrir Simulação Interativa
                                    </a>
                                ) : (
                                    <p className="text-xs text-gray-400 font-sans">Simulação interativa em desenvolvimento.</p>
                                )}
                            </div>
                        );
                    }

                    default:
                        return null;
                }
            })}
        </div>
    );
}
