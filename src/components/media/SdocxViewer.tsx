'use client';

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
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import { MarkdownImage } from '@/components/reading/MarkdownImageLightbox';
import { BalloonReflexao } from '@/components/reading/BalloonReflexao';
import { TranslationalTooltip } from '@/components/reading/TranslationalTooltip';
import { formatYoutubeUrl, getPdfViewerUrl } from '@/lib/media-utils';

interface SdocxViewerProps {
    blocks: any[];
    reflections?: any[];
    palavrasGeradoras?: any[];
}

export function SdocxViewer({ blocks, reflections, palavrasGeradoras }: SdocxViewerProps) {
    if (!Array.isArray(blocks)) return null;

    return (
        <div className="flex flex-col gap-8 w-full">
            {blocks.map((block) => {
                if (block.type === 'text') {
                    return (
                        <div key={block.id} className="text-gray-600 dark:text-gray-400 leading-relaxed prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-800 dark:prose-headings:text-gray-200 prose-a:text-brand-blue prose-img:rounded-xl overflow-x-auto w-full">
                            <ReactMarkdown
                                remarkPlugins={[remarkMath]}
                                rehypePlugins={[rehypeSanitize, rehypeKatex]}
                                components={{
                                    p: ({ node, children, ...props }) => {
                                        const renderWithTooltips = (content: any): any => {
                                            if (typeof content === 'string') {
                                                if (!palavrasGeradoras || palavrasGeradoras.length === 0) return content;
                                                const sortedWords = [...palavrasGeradoras].sort((a, b) => b.termo.length - a.termo.length);
                                                const pattern = new RegExp(`\\b(${sortedWords.map(w => w.termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');
                                                const parts = [];
                                                let lastIndex = 0;
                                                let match: RegExpExecArray | null;
                                                while ((match = pattern.exec(content)) !== null) {
                                                    parts.push(content.substring(lastIndex, match.index));
                                                    const word = sortedWords.find(w => w.termo.toLowerCase() === match![0].toLowerCase());
                                                    if (word) {
                                                        parts.push(
                                                            <TranslationalTooltip
                                                                key={`${word.id}-${match.index}`}
                                                                term={word.termo}
                                                                academicDefinition={word.codificacao_academica}
                                                                constellations={word.signos_constelacoes as any}
                                                            >
                                                                {match[0]}
                                                            </TranslationalTooltip>
                                                        );
                                                    } else {
                                                        parts.push(match[0]);
                                                    }
                                                    lastIndex = pattern.lastIndex;
                                                }
                                                parts.push(content.substring(lastIndex));
                                                return parts;
                                            }
                                            if (React.isValidElement(content)) {
                                                const element = content as React.ReactElement<any>;
                                                return React.cloneElement(element, { children: React.Children.map(element.props.children, renderWithTooltips) });
                                            }
                                            if (Array.isArray(content)) return content.map((child, i) => <React.Fragment key={i}>{renderWithTooltips(child)}</React.Fragment>);
                                            return content;
                                        };
                                        return <p data-block-id={`p-${node?.position?.start.line}`} {...props}>{renderWithTooltips(children)}</p>;
                                    },
                                    h1: ({ node, ...props }) => <h1 data-block-id={`h1-${node?.position?.start.line}`} {...props} />,
                                    h2: ({ node, ...props }) => <h2 data-block-id={`h2-${node?.position?.start.line}`} {...props} />,
                                    h3: ({ node, ...props }) => <h3 data-block-id={`h3-${node?.position?.start.line}`} {...props} />,
                                    blockquote: ({ node, ...props }) => <blockquote data-block-id={`bq-${node?.position?.start.line}`} {...props} />,
                                    img: (props) => <MarkdownImage {...props} />,
                                }}
                            >
                                {block.content.text}
                            </ReactMarkdown>
                        </div>
                    );
                } else if (block.type === 'image') {
                    return (
                        <div key={block.id} className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8 w-full flex items-center justify-center p-4">
                            <img src={block.content.url} alt={block.content.altText || 'Imagem do bloco'} className="w-full h-auto max-h-[600px] object-contain rounded-lg" loading="lazy" />
                        </div>
                    );
                } else if (block.type === 'video') {
                    return (
                        <div key={block.id} className="w-full aspect-video bg-black rounded-xl overflow-hidden my-8 shadow-lg">
                            <iframe src={formatYoutubeUrl(block.content.url)} className="w-full h-full border-none" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                        </div>
                    );
                } else if (block.type === 'audio') {
                    return (
                        <div key={block.id} className="w-full my-6 p-6 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined">audiotrack</span>
                            </div>
                            <audio src={block.content.url} controls className="w-full h-10 outline-none" />
                        </div>
                    );
                } else if (block.type === 'pdf') {
                    return (
                        <div key={block.id} className="w-full h-[700px] my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-50 dark:bg-gray-900">
                            <iframe src={getPdfViewerUrl(block.content.url)} className="w-full h-full border-none" />
                        </div>
                    );
                } else if (block.type === 'reflection') {
                    return (
                        <div key={block.id} className="my-10">
                            <BalloonReflexao reflexaoId={block.id} ancoraId={`reflexao-${block.id}`} pergunta={block.content.question} tipo="aberta" />
                        </div>
                    );
                } else if (['reference', 'notes', 'context_history', 'context_social', 'context_political'].includes(block.type)) {
                    const titles: Record<string, string> = { reference: 'Referências', notes: 'Notas da Autoria', context_history: 'Contexto Histórico', context_social: 'Contexto Social', context_political: 'Contexto Político' };
                    const icons: Record<string, string> = { reference: 'menu_book', notes: 'edit_note', context_history: 'history_edu', context_social: 'groups', context_political: 'gavel' };
                    return (
                        <div key={block.id} className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 my-8 shadow-sm">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">{icons[block.type]}</span>
                                {titles[block.type]}
                            </h3>
                            <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{block.content.text}</ReactMarkdown>
                            </div>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    );
}
