'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import { MarkdownImage } from '@/components/reading/MarkdownImageLightbox';
import { TranslationalTooltip } from '@/components/reading/TranslationalTooltip';

interface ApresentacaoMarkdownRendererProps {
    content: string;
    palavrasGeradoras?: any[];
    getHeadingIndex?: (id: string) => number;
}

const themeMap = [
    { text: 'text-brand-blue', border: 'border-brand-blue/20', hover: 'hover:border-brand-blue/20', bg: 'bg-brand-blue/10' },
    { text: 'text-brand-yellow', border: 'border-brand-yellow/20', hover: 'hover:border-brand-yellow/20', bg: 'bg-brand-yellow/10' },
    { text: 'text-brand-red', border: 'border-brand-red/20', hover: 'hover:border-brand-red/20', bg: 'bg-brand-red/10' },
];

export function slugify(text: string) {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
}

export function ApresentacaoMarkdownRenderer({ content, palavrasGeradoras, getHeadingIndex }: ApresentacaoMarkdownRendererProps) {
    return (
        <div className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-none overflow-x-auto w-full">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeSanitize, rehypeKatex]}
                components={{
                    p: ({ node, children, ...props }) => {
                        const renderWithTooltips = (content: any): any => {
                            if (typeof content === 'string') {
                                if (!palavrasGeradoras || palavrasGeradoras.length === 0) return content;
                                const sortedWords = [...palavrasGeradoras].sort((a, b) => b.termo.length - a.termo.length);
                                const pattern = new RegExp(`\\b(${sortedWords.map(w => w.termo.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})\\b`, 'gi');
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
                        return <p className="text-gray-700 dark:text-gray-300 text-[17px] md:text-lg leading-relaxed font-medium mb-6" data-block-id={`p-${node?.position?.start.line}`} {...props}>{renderWithTooltips(children)}</p>;
                    },
                    h1: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = slugify(text);
                        const index = getHeadingIndex ? getHeadingIndex(id) : 0;
                        const theme = themeMap[index % 3];
                        return (
                            <div className="flex items-center gap-4 mt-16 mb-8 scroll-mt-32" id={id}>
                                <h1 className={`text-3xl md:text-4xl font-bold uppercase italic tracking-tighter ${theme.text}`} data-block-id={`h1-${node?.position?.start.line}`} {...props}>
                                    {children}
                                </h1>
                                <div className={`h-px ${theme.bg} flex-1`}></div>
                            </div>
                        );
                    },
                    h2: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = slugify(text);
                        const index = getHeadingIndex ? getHeadingIndex(id) : 0;
                        const theme = themeMap[index % 3];
                        return (
                            <div className="flex items-center gap-4 mt-12 mb-6 scroll-mt-32" id={id}>
                                <h2 className={`text-2xl md:text-3xl font-bold uppercase italic tracking-tighter ${theme.text}`} data-block-id={`h2-${node?.position?.start.line}`} {...props}>
                                    {children}
                                </h2>
                                <div className={`h-px ${theme.bg} flex-1`}></div>
                            </div>
                        );
                    },
                    h3: ({ node, children, ...props }) => {
                        const text = String(children);
                        const id = slugify(text);
                        const index = getHeadingIndex ? getHeadingIndex(id) : 0;
                        const theme = themeMap[index % 3];
                        return (
                            <div className="flex items-center gap-4 mt-10 mb-4 scroll-mt-32" id={id}>
                                <h3 className={`text-xl md:text-2xl font-bold uppercase italic tracking-tighter ${theme.text}`} data-block-id={`h3-${node?.position?.start.line}`} {...props}>
                                    {children}
                                </h3>
                            </div>
                        );
                    },
                    blockquote: ({ node, children }) => {
                        // Attempt to extract text to check for "Reflexão"
                        let isReflexao = false;
                        React.Children.forEach(children, (child) => {
                            if (React.isValidElement(child) && child.props && child.props.children) {
                                const text = String(child.props.children).toLowerCase();
                                if (text.includes('reflexão') || text.includes('reflexao')) {
                                    isReflexao = true;
                                }
                            }
                        });

                        if (isReflexao) {
                            return (
                                <div className="glass-card rounded-3xl p-6 border-brand-yellow/30 bg-brand-yellow/5 my-8 shadow-2xl relative overflow-hidden group transition-all hover:bg-brand-yellow/10 hover:scale-[1.01]" data-block-id={`bq-${node?.position?.start.line}`}>
                                    <div className="absolute -top-6 -right-6 text-brand-yellow/20 group-hover:text-brand-yellow/40 transition-colors">
                                        <span className="material-symbols-outlined text-[100px]">lightbulb</span>
                                    </div>
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-yellow to-brand-red opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-yellow/20 flex items-center justify-center shrink-0 mt-1">
                                            <span className="material-symbols-outlined text-brand-yellow">psychology</span>
                                        </div>
                                        <div className="text-gray-300 leading-relaxed font-medium italic prose-p:mb-0">
                                            {children}
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div className="glass-card rounded-2xl p-6 border-white/5 bg-[#11141a] my-8 shadow-xl relative overflow-hidden group transition-all hover:bg-white/5" data-block-id={`bq-${node?.position?.start.line}`}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-brand-blue to-brand-red opacity-50 group-hover:opacity-100 transition-opacity"></div>
                                <div className="text-gray-300 leading-relaxed prose-p:mb-0 border-l-2 border-brand-blue/30 pl-4">
                                    {children}
                                </div>
                            </div>
                        );
                    },
                    ul: ({ children, ...props }) => (
                        <ul className="space-y-3 my-6 pl-4" {...props}>
                            {children}
                        </ul>
                    ),
                    li: ({ children, ...props }) => (
                        <li className="flex gap-3 text-gray-700 dark:text-gray-300 text-lg leading-relaxed font-medium" {...props}>
                            <span className="text-brand-blue shrink-0 mt-1.5 material-symbols-outlined text-[16px]">chevron_right</span>
                            <div>{children}</div>
                        </li>
                    ),
                    img: (props) => <MarkdownImage {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
