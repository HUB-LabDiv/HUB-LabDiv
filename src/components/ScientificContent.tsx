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
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import "katex/dist/katex.min.css";

interface ScientificContentProps {
    content: string;
    className?: string;
}

/**
 * V8.0 isolated component for rendering Scientific content (Markdown + LaTeX).
 * This file is loaded dynamically by parent components to shard dependencies.
 */
export default function ScientificContent({ content, className = '' }: ScientificContentProps) {
    return (
        <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkMath as any]}
                rehypePlugins={[
                    [rehypeSanitize, {
                        ...defaultSchema,
                        tagNames: [
                            ...(defaultSchema.tagNames || []),
                            'math', 'annotation', 'semantics', 'mrow', 'msub', 'msup', 'msubsup', 'mover', 'munder', 'munderover',
                            'table', 'thead', 'tbody', 'tr', 'td', 'th', 'caption', 'colgroup', 'col'
                        ],
                        attributes: {
                            ...defaultSchema.attributes,
                            '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'style'],
                            code: [['className', /^language-./, 'math-inline', 'math-display']],
                            th: ['align', 'colSpan', 'rowSpan'],
                            td: ['align', 'colSpan', 'rowSpan']
                        }
                    }],
                    [rehypeKatex, { strict: false, throwOnError: false }]
                ] as any}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
