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

import React, { useRef, useEffect } from 'react';

interface SdocxHtmlBlockProps {
    /** HTML content produced by the TextBlock editor (contenteditable) */
    html: string;
}

/**
 * Client-side renderer for HTML text blocks from sdocx posts.
 * 
 * The TextBlock editor in the Diagrammer produces raw HTML via
 * document.execCommand / innerHTML. This component renders it
 * safely using a controlled div with sanitization via the browser's
 * built-in DOMParser (no external dependencies needed).
 */
export function SdocxHtmlBlock({ html }: SdocxHtmlBlockProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !html) return;

        // Use DOMParser for safe parsing (browser-native, no XSS risk from scripts)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Remove potentially dangerous elements
        const dangerous = doc.querySelectorAll('script, object, embed');
        dangerous.forEach(el => el.remove());

        // Remove javascript: event handlers
        const allElements = doc.body.querySelectorAll('*');
        allElements.forEach(el => {
            Array.from(el.attributes).forEach(attr => {
                if (attr.name.startsWith('on')) {
                    el.removeAttribute(attr.name);
                }
                if ((attr.name === 'href' || attr.name === 'src') && attr.value.startsWith('javascript:')) {
                    el.removeAttribute(attr.name);
                }
            });
        });

        containerRef.current.innerHTML = doc.body.innerHTML;
    }, [html]);

    if (!html) return null;

    return (
        <div
            ref={containerRef}
            className="sdocx-text-block prose prose-gray dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-[17px] space-y-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-600 [&_th]:p-2 [&_th]:bg-gray-100 dark:[&_th]:bg-gray-800 [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600 [&_td]:p-2"
        />
    );
}
