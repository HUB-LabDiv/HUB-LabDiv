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


/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

import React, { useMemo, useCallback } from 'react';
import { ApresentacaoMarkdownRenderer, slugify } from './ApresentacaoMarkdownRenderer';
import { ArticleTocSidebar, buildHeadingIndexMap } from './ArticleTocSidebar';

interface StyledArticleViewProps {
    /** Raw markdown content for the current block */
    content: string;
    /** Palavras geradoras for tooltip overlays */
    palavrasGeradoras?: any[];
    /** 
     * Full concatenated text from all text blocks, used for
     * the unified TOC. Only the first text block should pass this
     * (subsequent blocks pass undefined to suppress duplicate TOCs). 
     */
    fullTextForToc?: string;
}

/**
 * Wrapper that combines:
 * 1. ArticleTocSidebar (mobile top / desktop right sidebar) — only for first text block
 * 2. ApresentacaoMarkdownRenderer (styled content)
 *
 * This is a 'use client' component so the page.tsx (Server Component) can
 * simply pass the raw data through.
 */
export function StyledArticleView({ content, palavrasGeradoras, fullTextForToc }: StyledArticleViewProps) {
    // Use the full text for the TOC headings map when available,
    // fall back to just this block's content otherwise
    const tocSource = fullTextForToc || content;
    const headingIndexMap = useMemo(() => buildHeadingIndexMap(tocSource), [tocSource]);

    const getHeadingIndex = useCallback((id: string) => {
        return headingIndexMap.get(id) ?? 0;
    }, [headingIndexMap]);

    return (
        <>
            {/* TOC sidebar — only rendered when fullTextForToc is provided (first block) */}
            {fullTextForToc && (
                <ArticleTocSidebar markdownContent={fullTextForToc} />
            )}

            {/* Styled article body */}
            <ApresentacaoMarkdownRenderer
                content={content}
                palavrasGeradoras={palavrasGeradoras}
                getHeadingIndex={getHeadingIndex}
            />
        </>
    );
}
