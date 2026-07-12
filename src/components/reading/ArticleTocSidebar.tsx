'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { slugify } from './ApresentacaoMarkdownRenderer';

interface TocHeading {
    id: string;
    text: string;
    level: number;
}

interface ArticleTocSidebarProps {
    /** Raw markdown text to extract headings from */
    markdownContent: string;
}

/**
 * Extracts headings from raw markdown text.
 */
function extractHeadings(markdown: string): TocHeading[] {
    const headings: TocHeading[] = [];
    const lines = markdown.split('\n');
    let inCodeBlock = false;

    for (const line of lines) {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            continue;
        }
        if (inCodeBlock) continue;

        const match = line.match(/^(#{1,3})\s+(.+)/);
        if (match) {
            const level = match[1].length;
            const text = match[2].replace(/[*_`#]/g, '').trim();
            headings.push({
                id: slugify(text),
                text,
                level,
            });
        }
    }
    return headings;
}

const themeMap = [
    { text: 'text-brand-blue', bg: 'bg-brand-blue', bgLight: 'bg-brand-blue/10', border: 'border-brand-blue/30' },
    { text: 'text-brand-yellow', bg: 'bg-brand-yellow', bgLight: 'bg-brand-yellow/10', border: 'border-brand-yellow/30' },
    { text: 'text-brand-red', bg: 'bg-brand-red', bgLight: 'bg-brand-red/10', border: 'border-brand-red/30' },
];

export function ArticleTocSidebar({ markdownContent }: ArticleTocSidebarProps) {
    const headings = useMemo(() => extractHeadings(markdownContent), [markdownContent]);
    const [activeId, setActiveId] = useState<string>('');
    const observerRef = useRef<IntersectionObserver | null>(null);

    const scrollToHeading = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveId(id);
        }
    }, []);

    useEffect(() => {
        // Observe heading elements for active state
        const headingElements = headings
            .map(h => document.getElementById(h.id))
            .filter(Boolean) as HTMLElement[];

        if (headingElements.length === 0) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the first visible heading
                const visibleEntries = entries.filter(e => e.isIntersecting);
                if (visibleEntries.length > 0) {
                    setActiveId(visibleEntries[0].target.id);
                }
            },
            {
                rootMargin: '-80px 0px -60% 0px',
                threshold: 0.1,
            }
        );

        headingElements.forEach(el => observerRef.current?.observe(el));

        return () => {
            observerRef.current?.disconnect();
        };
    }, [headings]);

    if (headings.length < 2) return null;

    return (
        <>
            {/* Mobile TOC — shown at top on small screens */}
            <div className="xl:hidden mb-8">
                <details className="group bg-[#11141a] rounded-2xl border border-white/5 overflow-hidden">
                    <summary className="flex items-center gap-3 p-4 cursor-pointer select-none text-gray-300 hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-brand-blue text-[20px]">format_list_bulleted</span>
                        <span className="font-bold text-sm uppercase tracking-wider">Sumário</span>
                        <span className="ml-auto material-symbols-outlined text-[18px] transition-transform group-open:rotate-180">expand_more</span>
                    </summary>
                    <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {headings.map((h, i) => {
                            const theme = themeMap[i % 3];
                            return (
                                <button
                                    key={h.id}
                                    onClick={() => scrollToHeading(h.id)}
                                    className={`text-left bg-white/[0.02] hover:bg-white/5 border border-white/5 p-3 rounded-xl transition-all text-gray-400 hover:text-white font-medium flex items-center gap-3 group/item ${h.level > 1 ? 'pl-6' : ''}`}
                                >
                                    <div className={`w-8 h-8 shrink-0 rounded-lg bg-white/5 flex items-center justify-center text-xs font-black transition-transform group-hover/item:scale-110 ${theme.text}`}>
                                        {i + 1}
                                    </div>
                                    <span className="line-clamp-2 text-sm">{h.text}</span>
                                </button>
                            );
                        })}
                    </div>
                </details>
            </div>

            {/* Desktop TOC — sticky sidebar on the right */}
            <aside className="hidden xl:block fixed right-4 2xl:right-8 top-28 w-64 2xl:w-72 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin z-30">
                <div className="bg-[#11141a]/80 backdrop-blur-xl rounded-2xl border border-white/5 p-4 shadow-2xl">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-brand-blue text-[14px]">format_list_bulleted</span>
                        Sumário
                    </h4>
                    <nav className="flex flex-col gap-1">
                        {headings.map((h, i) => {
                            const theme = themeMap[i % 3];
                            const isActive = activeId === h.id;
                            return (
                                <button
                                    key={h.id}
                                    onClick={() => scrollToHeading(h.id)}
                                    className={`
                                        text-left text-xs font-medium rounded-lg px-3 py-2 transition-all duration-200 flex items-center gap-2 group/nav
                                        ${h.level === 2 ? 'pl-6' : h.level === 3 ? 'pl-9' : ''}
                                        ${isActive
                                            ? `${theme.bgLight} ${theme.text} ${theme.border} border font-bold`
                                            : 'text-gray-500 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                                        }
                                    `}
                                >
                                    <div className={`w-1 h-4 rounded-full shrink-0 transition-all ${isActive ? theme.bg : 'bg-white/10'}`}></div>
                                    <span className="line-clamp-2">{h.text}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
}

/**
 * Utility: Builds a mapping from heading slug to its sequential index.
 * Used by ApresentacaoMarkdownRenderer to assign cycling colors.
 */
export function buildHeadingIndexMap(markdown: string): Map<string, number> {
    const headings = extractHeadings(markdown);
    const map = new Map<string, number>();
    headings.forEach((h, i) => map.set(h.id, i));
    return map;
}
