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

import React, { useRef, useCallback, useEffect, useState } from 'react';
import {
    type TextAlign,
    processAlignedText,
} from '@/lib/textAlignment';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { GlossaryModal } from '../GlossaryModal';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

interface TextBlockProps {
    block: Block;
    isActive: boolean;
}

interface IDVColor {
    label: string;
    color: string;
    bgClass: string;
}

const IDV_COLORS: IDVColor[] = [
    { label: 'Amarelo LabDiv', color: '#FFCC00', bgClass: 'bg-[#FFCC00]' },
    { label: 'Azul LabDiv', color: '#0F4780', bgClass: 'bg-[#0F4780]' },
    { label: 'Vermelho LabDiv', color: '#F14343', bgClass: 'bg-[#F14343]' },
];

interface LatexExample {
    label: string;
    formula: string;
    display: string;
}

const LATEX_EXAMPLES: LatexExample[] = [
    { label: 'Fração', formula: '\\frac{a}{b}', display: 'a/b' },
    { label: 'Raiz Quadrada', formula: '\\sqrt{x}', display: '√x' },
    { label: 'Expoente', formula: 'x^{n}', display: 'xⁿ' },
    { label: 'Subscrito', formula: 'x_{i}', display: 'xᵢ' },
    { label: 'Integral', formula: '\\int_{a}^{b} f(x) \\, dx', display: '∫ f(x)dx' },
    { label: 'Somatório', formula: '\\sum_{i=1}^{n} x_i', display: 'Σ xᵢ' },
    { label: 'Produtório', formula: '\\prod_{i=1}^{n} x_i', display: 'Π xᵢ' },
    { label: 'Limite', formula: '\\lim_{x \\to \\infty} f(x)', display: 'lim f(x)' },
    { label: 'Derivada Parcial', formula: '\\frac{\\partial f}{\\partial x}', display: '∂f/∂x' },
    { label: 'Vetor', formula: '\\vec{v}', display: 'v⃗' },
    { label: 'Matriz 2×2', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', display: '(a b; c d)' },
    { label: 'E = mc²', formula: 'E = mc^2', display: 'E=mc²' },
    { label: 'Eq. de Schrödinger', formula: 'i\\hbar \\frac{\\partial}{\\partial t}\\Psi = \\hat{H}\\Psi', display: 'iℏ∂Ψ/∂t' },
    { label: 'Lei de Newton', formula: 'F = m \\cdot a', display: 'F=ma' },
    { label: 'Eq. de Euler', formula: 'e^{i\\pi} + 1 = 0', display: 'eⁱᵖ+1=0' },
    { label: 'Seno / Cosseno', formula: '\\sin^2\\theta + \\cos^2\\theta = 1', display: 'sin²+cos²=1' },
    { label: 'Bloco Display', formula: '$$\nE = mc^2\n$$', display: '$$…$$' },
];

const ALIGN_OPTIONS: { value: TextAlign; command: string; icon: string; label: string }[] = [
    { value: 'left', command: 'justifyLeft', icon: 'format_align_left', label: 'Esquerda' },
    { value: 'center', command: 'justifyCenter', icon: 'format_align_center', label: 'Centro' },
    { value: 'right', command: 'justifyRight', icon: 'format_align_right', label: 'Direita' },
    { value: 'justify', command: 'justifyFull', icon: 'format_align_justify', label: 'Justificado' },
];

const MARGIN_OPTIONS = [
    { value: 'normal', label: 'Margem Padrão', desc: 'Espaçamento normal (24px)', icon: 'crop_free' },
    { value: 'compact', label: 'Margem Compacta', desc: 'Espaço reduzido (12px)', icon: 'compress' },
    { value: 'wide', label: 'Margem Ampla', desc: 'Espaço expandido (48px)', icon: 'expand' },
    { value: 'none', label: 'Sem Margem', desc: 'Largura total (0px)', icon: 'border_outer' },
];

export function sanitizeHtmlContent(rawHtml: string): string {
    if (!rawHtml || typeof window === 'undefined') return rawHtml || '';

    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        // 1. Remove dangerous or unwanted tags
        const unwanted = doc.querySelectorAll(
            'script, style, link, meta, title, svg, canvas, form, input, button, select, textarea, frame, iframe, object, embed, applet, noscript'
        );
        unwanted.forEach(el => el.remove());

        // 2. Remove HTML comments
        const removeComments = (node: Node) => {
            for (let i = node.childNodes.length - 1; i >= 0; i--) {
                const child = node.childNodes[i];
                if (child.nodeType === Node.COMMENT_NODE) {
                    node.removeChild(child);
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    removeComments(child);
                }
            }
        };
        removeComments(doc.body);

        // Helper to unwrap element (keep children, remove tag)
        const unwrap = (el: Element) => {
            const parent = el.parentNode;
            if (parent) {
                while (el.firstChild) {
                    parent.insertBefore(el.firstChild, el);
                }
                parent.removeChild(el);
            }
        };

        // 3. Unwrap Google Docs / Word root wrappers (e.g. <b id="docs-internal-guid-...">)
        doc.querySelectorAll('[id^="docs-internal-guid"], [id*="docs-internal-guid"]').forEach(el => {
            unwrap(el);
        });

        // 4. Unwrap any <b> or <strong> tags that explicitly have font-weight: normal/400
        doc.querySelectorAll('b, strong').forEach(el => {
            const style = el.getAttribute('style') || '';
            if (/font-weight:\s*(?:normal|400|300|200|100)/i.test(style)) {
                unwrap(el);
            }
        });

        // 5. Convert styled spans/fonts to semantic tags BEFORE stripping styles
        doc.querySelectorAll('span, font').forEach(el => {
            const style = el.getAttribute('style') || '';
            const isBold = /font-weight:\s*(?:bold|[7-9]00)/i.test(style) && !/font-weight:\s*(?:normal|400|300|200|100)/i.test(style);
            const isItalic = /font-style:\s*italic/i.test(style);
            const isUnderline = /text-decoration(?:-line)?:\s*[^;]*underline/i.test(style);
            const isStrike = /text-decoration(?:-line)?:\s*[^;]*line-through/i.test(style);

            if (isBold || isItalic || isUnderline || isStrike) {
                let inner = el.innerHTML;
                if (isStrike) inner = `<del>${inner}</del>`;
                if (isUnderline) inner = `<u>${inner}</u>`;
                if (isItalic) inner = `<i>${inner}</i>`;
                if (isBold) inner = `<b>${inner}</b>`;
                el.innerHTML = inner;
            }
        });

        // 6. Allowed tags
        const allowedTags = new Set([
            'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'b', 'strong', 'i', 'em', 'u', 's', 'del', 'strike',
            'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
            'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
            'br', 'hr', 'a', 'span'
        ]);

        const cleanElement = (el: Element) => {
            const tagName = el.tagName.toLowerCase();

            // Convert h4, h5, h6 into h3
            if (['h4', 'h5', 'h6'].includes(tagName)) {
                const h3 = doc.createElement('h3');
                h3.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(h3, el);
                cleanElement(h3);
                return;
            }

            // Normalize strong/em/strike
            if (tagName === 'strong') {
                const b = doc.createElement('b');
                b.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(b, el);
                cleanElement(b);
                return;
            }
            if (tagName === 'em') {
                const i = doc.createElement('i');
                i.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(i, el);
                cleanElement(i);
                return;
            }
            if (tagName === 'strike' || tagName === 's') {
                const del = doc.createElement('del');
                del.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(del, el);
                cleanElement(del);
                return;
            }

            // Convert block wrappers to p
            if (['div', 'section', 'article', 'header', 'footer', 'main', 'aside'].includes(tagName)) {
                const p = doc.createElement('p');
                p.innerHTML = el.innerHTML;
                el.parentNode?.replaceChild(p, el);
                cleanElement(p);
                return;
            }

            if (!allowedTags.has(tagName)) {
                unwrap(el);
                return;
            }

            // Strip ALL custom colors, background colors, font sizes, font families, widths, heights, margins, classes
            const attrs = Array.from(el.attributes);
            for (const attr of attrs) {
                if (tagName === 'a' && attr.name === 'href') {
                    const val = attr.value.trim();
                    if (val.startsWith('javascript:') || val.startsWith('data:')) {
                        el.removeAttribute(attr.name);
                    }
                    continue;
                }
                // LaTeX badges inside editor
                if (tagName === 'span' && attr.name === 'style' && attr.value.includes('monospace') && attr.value.includes('rgba(255,204,0')) {
                    el.setAttribute('style', 'color: #FFCC00; font-family: monospace; background: rgba(255,204,0,0.1); padding: 2px 4px; border-radius: 4px;');
                    continue;
                }
                // Strip all colors, fonts, background-colors, widths, heights, margins, classes, styles
                el.removeAttribute(attr.name);
            }

            Array.from(el.children).forEach(child => cleanElement(child));
        };

        Array.from(doc.body.children).forEach(child => cleanElement(child));

        // 7. CRITICAL: Unwrap any inline tags (b, i, u, del) that enclose block elements (p, h1, h2, h3, ul, ol, table)
        doc.querySelectorAll('b, i, u, del, span').forEach(inlineEl => {
            if (inlineEl.querySelector('p, h1, h2, h3, h4, h5, h6, div, ul, ol, li, table, blockquote')) {
                unwrap(inlineEl);
            }
        });

        // 8. Remove empty spans or unwrap spans with no attributes
        doc.querySelectorAll('span').forEach(span => {
            if (!span.hasAttributes()) {
                unwrap(span);
            }
        });

        // 9. Clean empty paragraphs with just whitespace
        doc.querySelectorAll('p').forEach(p => {
            if (!p.textContent?.trim() && !p.querySelector('br, img, table')) {
                if (!p.innerHTML.includes('<br>')) {
                    p.remove();
                }
            }
        });

        let cleaned = doc.body.innerHTML.trim();
        cleaned = cleaned.replace(/&nbsp;/g, ' ');

        return cleaned;
    } catch (e) {
        console.error('Error sanitizing HTML:', e);
        return rawHtml;
    }
}

export function formatPlainTextToHtml(text: string): string {
    if (!text) return '';
    const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalized.split('\n');

    let htmlResult = '';
    let currentListType: 'ul' | 'ol' | null = null;
    let listItems: string[] = [];

    const flushList = () => {
        if (currentListType && listItems.length > 0) {
            const itemsHtml = listItems.map(item => `<li>${item}</li>`).join('');
            htmlResult += `<${currentListType}>${itemsHtml}</${currentListType}>`;
            listItems = [];
            currentListType = null;
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (!line) {
            flushList();
            continue;
        }

        // Markdown headings
        if (/^###\s+(.*)/.test(line)) {
            flushList();
            htmlResult += `<h3>${line.replace(/^###\s+/, '')}</h3>`;
            continue;
        }
        if (/^##\s+(.*)/.test(line)) {
            flushList();
            htmlResult += `<h2>${line.replace(/^##\s+/, '')}</h2>`;
            continue;
        }
        if (/^#\s+(.*)/.test(line)) {
            flushList();
            htmlResult += `<h1>${line.replace(/^#\s+/, '')}</h1>`;
            continue;
        }

        // Bullet lists (-, *, •, ▪, ▫, ‣, ⁃)
        const bulletMatch = line.match(/^[-*•▪▫‣⁃]\s+(.*)/);
        if (bulletMatch) {
            if (currentListType !== 'ul') {
                flushList();
                currentListType = 'ul';
            }
            listItems.push(bulletMatch[1]);
            continue;
        }

        // Numbered lists (1., 2., 1), 2))
        const numMatch = line.match(/^\d+[\.\)]\s+(.*)/);
        if (numMatch) {
            if (currentListType !== 'ol') {
                flushList();
                currentListType = 'ol';
            }
            listItems.push(numMatch[1]);
            continue;
        }

        // Blockquotes (> quote)
        const quoteMatch = line.match(/^>\s*(.*)/);
        if (quoteMatch) {
            flushList();
            htmlResult += `<blockquote>${quoteMatch[1]}</blockquote>`;
            continue;
        }

        // Standard paragraph
        flushList();
        htmlResult += `<p>${line}</p>`;
    }

    flushList();

    return htmlResult;
}

function markdownToHtml(md: string): string {
    if (!md) return '';
    // If it already contains HTML tags, return it directly! Do not strip or re-sanitize it!
    if (/<[a-z][\s\S]*>/i.test(md)) return md;

    const converted = md
        .replace(/^#### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>');

    return `<p>${converted}</p>`;
}

export default function TextBlock({ block, isActive }: TextBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const textContent = block.content.text || '';
    const editorRef = useRef<HTMLDivElement>(null);

    const [showGlossaryModal, setShowGlossaryModal] = useState(false);
    const [glossarySearchTerm, setGlossarySearchTerm] = useState('');
    const [localPreview, setLocalPreview] = useState(false);
    const [currentLineAlign, setCurrentLineAlign] = useState<TextAlign>('left');

    const [showFormattingMenu, setShowFormattingMenu] = useState(false);
    const [showLatexMenu, setShowLatexMenu] = useState(false);
    const [showColorMenu, setShowColorMenu] = useState(false);
    const [showTableMenu, setShowTableMenu] = useState(false);
    const [showMarginMenu, setShowMarginMenu] = useState(false);

    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [hoverRows, setHoverRows] = useState(0);
    const [hoverCols, setHoverCols] = useState(0);

    const formattingMenuRef = useRef<HTMLDivElement>(null);
    const latexMenuRef = useRef<HTMLDivElement>(null);
    const colorMenuRef = useRef<HTMLDivElement>(null);
    const tableMenuRef = useRef<HTMLDivElement>(null);
    const marginMenuRef = useRef<HTMLDivElement>(null);

    // Tracks the last initialized state
    const initializedKeyRef = useRef<string | null>(null);
    const latestTextRef = useRef<string>(textContent);

    const handleInput = useCallback(() => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            latestTextRef.current = html;
            updateBlock(block.id, { text: html });
        }
    }, [block.id, updateBlock]);

    // Safety flush on unmount or block switch
    useEffect(() => {
        return () => {
            if (editorRef.current) {
                const html = editorRef.current.innerHTML;
                if (html && html !== latestTextRef.current) {
                    updateBlock(block.id, { text: html });
                }
            }
        };
    }, [block.id, updateBlock]);

    useEffect(() => {
        const editorVisible = isActive && !localPreview;
        if (editorVisible && editorRef.current) {
            const key = `${block.id}::active`;
            if (initializedKeyRef.current !== key) {
                initializedKeyRef.current = key;
                const htmlToLoad = markdownToHtml(textContent);
                if (editorRef.current.innerHTML !== htmlToLoad) {
                    editorRef.current.innerHTML = htmlToLoad;
                }
            }
        }
        if (!editorVisible) {
            initializedKeyRef.current = null;
        }
    }, [block.id, isActive, localPreview, textContent]);

    // Close menus on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (formattingMenuRef.current && !formattingMenuRef.current.contains(e.target as Node)) {
                setShowFormattingMenu(false);
            }
            if (latexMenuRef.current && !latexMenuRef.current.contains(e.target as Node)) {
                setShowLatexMenu(false);
            }
            if (colorMenuRef.current && !colorMenuRef.current.contains(e.target as Node)) {
                setShowColorMenu(false);
            }
            if (tableMenuRef.current && !tableMenuRef.current.contains(e.target as Node)) {
                setShowTableMenu(false);
            }
            if (marginMenuRef.current && !marginMenuRef.current.contains(e.target as Node)) {
                setShowMarginMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const rawHtml = e.clipboardData.getData('text/html');
        const rawText = e.clipboardData.getData('text/plain');

        let contentToInsert = '';

        if (rawHtml) {
            const cleaned = sanitizeHtmlContent(rawHtml);
            if (cleaned && cleaned !== '<p></p>' && cleaned !== '<p><br></p>') {
                contentToInsert = cleaned;
            }
        }

        if (!contentToInsert && rawText) {
            contentToInsert = formatPlainTextToHtml(rawText);
        }

        if (contentToInsert) {
            if (editorRef.current) {
                editorRef.current.focus();
            }
            document.execCommand('insertHTML', false, contentToInsert);
            handleInput();
        }
    };

    const execCmd = (command: string, value: string = '') => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, value);
        handleInput();
    };

    const formatBlockCmd = (tag: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
        }

        const tagLower = tag.toLowerCase();
        
        // Use standard formatBlock command
        const success = document.execCommand('formatBlock', false, `<${tagLower}>`);
        if (!success) {
            document.execCommand('formatBlock', false, tagLower);
        }

        // Direct DOM fallback if formatBlock fails to convert an active heading to <p>
        if (tagLower === 'p') {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                let node: Node | null = selection.getRangeAt(0).startContainer;
                while (node && node !== editorRef.current) {
                    if (node.nodeType === Node.ELEMENT_NODE && /^h[1-6]$/i.test((node as HTMLElement).tagName)) {
                        const h = node as HTMLElement;
                        const p = document.createElement('p');
                        p.innerHTML = h.innerHTML || '<br>';
                        h.parentNode?.replaceChild(p, h);

                        const newRange = document.createRange();
                        newRange.selectNodeContents(p);
                        newRange.collapse(false);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                        break;
                    }
                    node = node.parentNode;
                }
            }
        }

        handleInput();
        setShowFormattingMenu(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const range = selection.getRangeAt(0);
            let node: Node | null = range.startContainer;

            let headingEl: HTMLElement | null = null;
            while (node && node !== editorRef.current) {
                if (node.nodeType === Node.ELEMENT_NODE && /^h[1-6]$/i.test((node as HTMLElement).tagName)) {
                    headingEl = node as HTMLElement;
                    break;
                }
                node = node.parentNode;
            }

            if (headingEl && headingEl.parentNode) {
                e.preventDefault();

                // Extract any text/content after the cursor inside the heading
                const endRange = range.cloneRange();
                endRange.selectNodeContents(headingEl);
                endRange.setStart(range.startContainer, range.startOffset);
                const extracted = endRange.extractContents();

                const p = document.createElement('p');
                if (extracted.textContent?.trim() || extracted.childNodes.length > 0) {
                    p.appendChild(extracted);
                } else {
                    p.innerHTML = '<br>';
                }

                headingEl.parentNode.insertBefore(p, headingEl.nextSibling);

                // Set caret to start of new paragraph
                const newRange = document.createRange();
                newRange.setStart(p, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);

                handleInput();
            }
        }
    };

    const applyColor = (color: string) => {
        execCmd('foreColor', color);
        setShowColorMenu(false);
    };

    const generateCustomTable = (r: number, c: number) => {
        const rowsCount = Math.max(1, Math.min(15, r));
        const colsCount = Math.max(1, Math.min(10, c));

        let headerColsHtml = '';
        for (let j = 1; j <= colsCount; j++) {
            headerColsHtml += `<th style="border: 1px solid #374151; padding: 6px 10px; font-size: 13px; font-weight: 600; text-align: left; color: #E5E7EB; background-color: #1F2937;">Coluna ${j}</th>`;
        }

        let bodyRowsHtml = '';
        for (let i = 1; i <= rowsCount; i++) {
            let colsInRowHtml = '';
            for (let j = 1; j <= colsCount; j++) {
                colsInRowHtml += `<td style="border: 1px solid #374151; padding: 6px 10px; font-size: 13px; color: #D1D5DB;">Dado ${i}.${j}</td>`;
            }
            bodyRowsHtml += `<tr>${colsInRowHtml}</tr>`;
        }

        const tableHtml = `
<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #374151;">
  <thead>
    <tr>
      ${headerColsHtml}
    </tr>
  </thead>
  <tbody>
    ${bodyRowsHtml}
  </tbody>
</table><p><br></p>`;

        execCmd('insertHTML', tableHtml);
        setShowTableMenu(false);
    };

    const insertLatex = (formula: string) => {
        const latexSnippet = `<span style="color: #FFCC00; font-family: monospace; background: rgba(255,204,0,0.1); padding: 2px 4px; border-radius: 4px;">${formula}</span>&nbsp;`;
        execCmd('insertHTML', latexSnippet);
        setShowLatexMenu(false);
    };

    const sendToGlossary = () => {
        const selection = window.getSelection()?.toString() || '';
        setGlossarySearchTerm(selection.trim());
        setShowGlossaryModal(true);
    };

    const toolBtnClass = "w-8 h-8 flex items-center justify-center rounded transition-colors text-gray-400 hover:text-white hover:bg-gray-700/60 shrink-0";
    const toolBtnActive = "w-8 h-8 flex items-center justify-center rounded transition-colors text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20 shrink-0";
    const dividerClass = "w-px h-5 bg-gray-700/60 mx-1 shrink-0";
    const dropdownBtnClass = "w-full px-2.5 py-1.5 flex items-center gap-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-md transition-colors text-left";

    const currentPadding = (block.content as any)?.padding || 'normal';
    const paddingClass = {
        none: 'px-4 py-4',
        compact: 'px-6 py-6 sm:px-8 sm:py-8',
        normal: 'px-8 py-8 sm:px-12 sm:py-12',
        wide: 'px-12 py-12 sm:px-20 sm:py-20'
    }[currentPadding as string] || 'px-8 py-8 sm:px-12 sm:py-12';

    return (
        <div className="flex flex-col gap-0 relative w-full max-w-full">
            {isActive && (
                <div 
                    style={{ top: 'calc(6rem + 80px + env(safe-area-inset-top, 0px))' }}
                    className="sticky z-30 bg-[#1E1E1E]/95 backdrop-blur-md pt-2 pb-2 px-3 mb-4 border border-gray-800/80 w-full rounded-2xl shadow-md"
                >
                    {/* Toolbar Ribbon */}
                    <div className="flex flex-wrap items-center gap-1 w-full relative">
                        
                        {/* Group 1: Text Styles (Dropdown) */}
                        <div className="relative">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { setShowFormattingMenu(!showFormattingMenu); setShowLatexMenu(false); setShowColorMenu(false); setShowTableMenu(false); setShowMarginMenu(false); }}
                                className={`px-2.5 h-8 flex items-center gap-1.5 rounded transition-colors text-xs font-bold shrink-0 ${showFormattingMenu ? 'text-brand-yellow bg-brand-yellow/10' : 'text-gray-300 hover:bg-gray-700/60'}`}
                                title="Estilo de Texto"
                            >
                                <span className="material-symbols-outlined text-[16px]">match_case</span>
                                <span className="hidden sm:inline">Estilo</span>
                                <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
                            </button>

                            {showFormattingMenu && (
                                <div ref={formattingMenuRef} className="absolute left-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 p-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlockCmd('p')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">notes</span>
                                        <span className="text-xs">Texto Normal</span>
                                    </button>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlockCmd('h1')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">format_h1</span>
                                        <span className="font-bold text-xs">Título 1</span>
                                    </button>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlockCmd('h2')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">format_h2</span>
                                        <span className="font-bold text-xs">Título 2</span>
                                    </button>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlockCmd('h3')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">format_h3</span>
                                        <span className="font-bold text-xs">Título 3</span>
                                    </button>
                                    <div className="border-t border-gray-800 my-1"></div>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => formatBlockCmd('blockquote')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">format_quote</span>
                                        <span className="text-xs">Citação</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={dividerClass}></div>

                        {/* Group 2: Inline Formatting */}
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('bold')} className={toolBtnClass} title="Negrito (Ctrl+B)"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('italic')} className={toolBtnClass} title="Itálico (Ctrl+I)"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('underline')} className={toolBtnClass} title="Sublinhado (Ctrl+U)"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('strikeThrough')} className={toolBtnClass} title="Tachado"><span className="material-symbols-outlined text-[18px]">strikethrough_s</span></button>

                        <div className={dividerClass}></div>

                        {/* Group 3: Alignment & Lists */}
                        <div className="flex items-center gap-0.5">
                            {ALIGN_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                        execCmd(opt.command);
                                        setCurrentLineAlign(opt.value);
                                    }}
                                    className={currentLineAlign === opt.value ? toolBtnActive : toolBtnClass}
                                    title={opt.label}
                                >
                                    <span className="material-symbols-outlined text-[18px]">{opt.icon}</span>
                                </button>
                            ))}
                        </div>
                        <div className="w-px h-3 bg-gray-700/30 mx-0.5 shrink-0"></div>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('insertUnorderedList')} className={toolBtnClass} title="Lista com Marcadores"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                        <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('insertOrderedList')} className={toolBtnClass} title="Lista Numerada"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>

                        <div className={dividerClass}></div>

                        {/* Group 4: Insertions & Extras */}
                        <div className="relative">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { setShowTableMenu(!showTableMenu); setShowFormattingMenu(false); setShowColorMenu(false); setShowLatexMenu(false); setShowMarginMenu(false); }}
                                className={showTableMenu ? toolBtnActive : toolBtnClass}
                                title="Inserir Tabela"
                            >
                                <span className="material-symbols-outlined text-[18px]">grid_on</span>
                            </button>
                            {/* Re-use existing table menu JSX inside here */}
                            {showTableMenu && (
                                <div ref={tableMenuRef} className="absolute left-0 top-full mt-1 w-72 max-w-[90vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] border-b border-gray-800 pb-1.5 mb-2.5 flex items-center justify-between">
                                        <span>Configurar Tabela</span>
                                        <span className="text-brand-yellow font-bold text-xs">
                                            {hoverRows > 0 && hoverCols > 0 ? `${hoverRows} × ${hoverCols}` : `${tableRows} × ${tableCols}`}
                                        </span>
                                    </div>
                                    <div className="mb-3">
                                        <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">Seleção Rápida:</span>
                                        <div className="grid grid-cols-5 gap-1 p-1.5 bg-gray-800/40 rounded-lg border border-gray-800 w-fit mx-auto" onMouseLeave={() => { setHoverRows(0); setHoverCols(0); }}>
                                            {Array.from({ length: 5 }).map((_, rIdx) => (
                                                Array.from({ length: 5 }).map((_, cIdx) => {
                                                    const r = rIdx + 1; const c = cIdx + 1;
                                                    const isHighlighted = (hoverRows > 0 && hoverCols > 0) ? (r <= hoverRows && c <= hoverCols) : (r <= tableRows && c <= tableCols);
                                                    return (
                                                        <button key={`${r}-${c}`} type="button" onMouseEnter={() => { setHoverRows(r); setHoverCols(c); }} onClick={() => generateCustomTable(r, c)} className={`w-5 h-5 rounded-[3px] border transition-all ${isHighlighted ? 'bg-brand-yellow/80 border-brand-yellow shadow-[0_0_8px_rgba(255,204,0,0.4)]' : 'bg-gray-800/60 border-gray-700 hover:border-gray-500'}`} title={`Tabela ${r} × ${c}`} />
                                                    );
                                                })
                                            ))}
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-800 my-2"></div>
                                    <div className="flex flex-col gap-2 mb-3 bg-gray-800/20 p-2 rounded-lg border border-gray-800">
                                        <div className="flex items-center justify-between text-xs text-gray-300">
                                            <span className="font-semibold">Linhas:</span>
                                            <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg p-0.5">
                                                <button type="button" onClick={() => setTableRows(Math.max(1, tableRows - 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold">-</button>
                                                <span className="w-6 text-center font-mono font-bold text-brand-yellow">{tableRows}</span>
                                                <button type="button" onClick={() => setTableRows(Math.min(15, tableRows + 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold">+</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-300">
                                            <span className="font-semibold">Colunas:</span>
                                            <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg p-0.5">
                                                <button type="button" onClick={() => setTableCols(Math.max(1, tableCols - 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold">-</button>
                                                <span className="w-6 text-center font-mono font-bold text-brand-yellow">{tableCols}</span>
                                                <button type="button" onClick={() => setTableCols(Math.min(10, tableCols + 1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => generateCustomTable(tableRows, tableCols)} className="w-full py-2 px-3 bg-brand-yellow text-gray-900 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand-yellow/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-yellow/10">
                                        <span className="material-symbols-outlined text-[16px]">grid_on</span>
                                        Inserir Tabela {tableRows} × {tableCols}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { setShowLatexMenu(!showLatexMenu); setShowFormattingMenu(false); setShowColorMenu(false); setShowTableMenu(false); setShowMarginMenu(false); }}
                                className={showLatexMenu ? toolBtnActive : toolBtnClass}
                                title="Inserir LaTeX"
                            >
                                <span className="material-symbols-outlined text-[18px]">functions</span>
                            </button>
                            {showLatexMenu && (
                                <div ref={latexMenuRef} className="absolute left-0 top-full mt-1 w-72 max-w-[85vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 py-2 max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Inserir Fórmulas</div>
                                    {LATEX_EXAMPLES.map((ex) => (
                                        <button key={ex.label} onMouseDown={(e) => e.preventDefault()} onClick={() => { const toInsert = ex.formula.startsWith('$$') ? ex.formula : `$${ex.formula}$`; insertLatex(toInsert); }} className={dropdownBtnClass}>
                                            <code className="text-[11px] text-brand-yellow font-mono bg-brand-yellow/5 border border-brand-yellow/20 px-1.5 py-0.5 rounded shrink-0 min-w-[60px] text-center">{ex.display}</code>
                                            <span className="flex-1 text-[11px]">{ex.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { setShowColorMenu(!showColorMenu); setShowFormattingMenu(false); setShowLatexMenu(false); setShowTableMenu(false); setShowMarginMenu(false); }}
                                className={showColorMenu ? toolBtnActive : toolBtnClass}
                                title="Cor do Texto (IDV)"
                            >
                                <span className="material-symbols-outlined text-[18px]">palette</span>
                            </button>
                            {showColorMenu && (
                                <div ref={colorMenuRef} className="absolute left-0 top-full mt-1 w-48 max-w-[85vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Cores da Marca</div>
                                    {IDV_COLORS.map((col) => (
                                        <button key={col.color} onMouseDown={(e) => e.preventDefault()} onClick={() => applyColor(col.color)} className={dropdownBtnClass}>
                                            <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass} shrink-0 border border-white/20`} />
                                            <span className="flex-1 text-xs">{col.label}</span>
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-800 my-1"></div>
                                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => applyColor('inherit')} className={dropdownBtnClass}>
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">format_color_reset</span>
                                        <span className="flex-1 text-xs text-gray-400">Restaurar Padrão</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className={dividerClass}></div>

                        <div className="relative">
                            <button
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => { setShowMarginMenu(!showMarginMenu); setShowFormattingMenu(false); setShowColorMenu(false); setShowTableMenu(false); setShowLatexMenu(false); }}
                                className={showMarginMenu ? toolBtnActive : toolBtnClass}
                                title="Margens da Página"
                            >
                                <span className="material-symbols-outlined text-[18px]">space_dashboard</span>
                            </button>
                            {showMarginMenu && (
                                <div ref={marginMenuRef} className="absolute left-0 top-full mt-1 w-64 max-w-[90vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 p-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-2 py-1 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] border-b border-gray-800 mb-1.5">Margens &amp; Recuo</div>
                                    <div className="flex flex-col gap-1">
                                        {MARGIN_OPTIONS.map((opt) => (
                                            <button key={opt.value} onMouseDown={(e) => e.preventDefault()} onClick={() => { updateBlock(block.id, { padding: opt.value }); setShowMarginMenu(false); }} className={`${dropdownBtnClass} ${currentPadding === opt.value ? 'bg-brand-yellow/10 text-brand-yellow font-bold' : ''}`}>
                                                <span className="material-symbols-outlined text-[16px] text-gray-400">{currentPadding === opt.value ? 'check_circle' : opt.icon}</span>
                                                <div className="flex flex-col text-left"><span className="text-xs">{opt.label}</span><span className="text-[10px] text-gray-500">{opt.desc}</span></div>
                                            </button>
                                        ))}
                                        <div className="border-t border-gray-800 my-1"></div>
                                        <div className="px-2 py-1 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Recuo de Linha</div>
                                        <div className="grid grid-cols-2 gap-1">
                                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('outdent')} className={dropdownBtnClass} title="Diminuir Recuo"><span className="material-symbols-outlined text-[16px] text-gray-400">format_indent_decrease</span><span className="text-xs">Diminuir</span></button>
                                            <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('indent')} className={dropdownBtnClass} title="Aumentar Recuo"><span className="material-symbols-outlined text-[16px] text-gray-400">format_indent_increase</span><span className="text-xs">Aumentar</span></button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onMouseDown={(e) => e.preventDefault()} onClick={sendToGlossary} className={toolBtnClass} title="Adicionar ao Glossário">
                            <span className="material-symbols-outlined text-[18px]">menu_book</span>
                        </button>
                        
                    </div>
                </div>
            )}

            {/* The Document Canvas ("A4 Page" Style) */}
            <div className={`w-full max-w-full transition-all duration-300 ${isActive ? 'px-2 sm:px-6' : ''}`}>
                {isActive && !localPreview ? (
                    <div
                        ref={editorRef}
                        contentEditable={true}
                        onInput={handleInput}
                        onBlur={handleInput}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        suppressContentEditableWarning={true}
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        className={`w-full max-w-full min-w-0 min-h-[400px] bg-[#151515] text-gray-200 outline-none placeholder-gray-600 font-sans leading-relaxed prose prose-sm dark:prose-invert max-w-none break-words [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere] prose-headings:break-words prose-headings:max-w-full prose-headings:text-white prose-headings:m-0 prose-headings:mb-3 prose-p:text-gray-300 prose-p:break-words prose-p:max-w-full prose-p:m-0 prose-p:mb-2 prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-blockquote:border-brand-blue prose-blockquote:text-gray-400 prose-hr:border-gray-700 prose-ol:pl-6 prose-ul:pl-6 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-700 [&_table]:my-3 [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-gray-200 [&_th]:bg-gray-800/80 [&_th]:p-2.5 [&_th]:border [&_th]:border-gray-700 [&_th]:text-left [&_th]:align-middle [&_th]:m-0 [&_td]:text-[13px] [&_td]:font-normal [&_td]:text-gray-300 [&_td]:p-2.5 [&_td]:border [&_td]:border-gray-700 [&_td]:align-middle [&_td]:m-0 [&_th>*]:text-[13px] [&_th>*]:m-0 [&_th>*]:font-semibold [&_td>*]:text-[13px] [&_td>*]:m-0 rounded-xl border border-gray-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-colors focus-within:border-brand-yellow/30 focus-within:ring-1 focus-within:ring-brand-yellow/10 ${paddingClass}`}
                    />
                ) : (
                    <div 
                        style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', whiteSpace: 'normal', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}
                        className={`w-full max-w-full min-w-0 min-h-[50px] font-sans leading-relaxed break-words overflow-x-auto [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere] ${isActive ? 'bg-[#151515] rounded-xl border border-gray-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.3)]' : ''} ${paddingClass} ${textContent ? 'text-gray-200' : 'text-gray-600'}`}
                    >
                        {textContent ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none break-words [&_*]:max-w-full [&_*]:break-words [&_*]:[overflow-wrap:anywhere] prose-headings:break-words prose-headings:max-w-full prose-headings:text-white prose-headings:m-0 prose-headings:mb-3 prose-p:text-gray-300 prose-p:break-words prose-p:m-0 prose-p:mb-2 prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-blockquote:border-brand-blue prose-blockquote:text-gray-400 prose-hr:border-gray-700 prose-ol:pl-6 prose-ul:pl-6 [&_table]:w-full [&_table]:border-collapse [&_table]:border [&_table]:border-gray-700 [&_table]:my-3 [&_th]:text-[13px] [&_th]:font-semibold [&_th]:text-gray-200 [&_th]:bg-gray-800/80 [&_th]:p-2.5 [&_th]:border [&_th]:border-gray-700 [&_th]:text-left [&_th]:align-middle [&_th]:m-0 [&_td]:text-[13px] [&_td]:font-normal [&_td]:text-gray-300 [&_td]:p-2.5 [&_td]:border [&_td]:border-gray-700 [&_td]:align-middle [&_td]:m-0 [&_th>*]:text-[13px] [&_th>*]:m-0 [&_th>*]:font-semibold [&_td>*]:text-[13px] [&_td>*]:m-0">
                            {localPreview || /\$[^\$]+\$/.test(textContent) || /\$\$[\s\S]+\$\$/.test(textContent) ? (
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                                    {textContent}
                                </ReactMarkdown>
                            ) : /<[a-z][\s\S]*>/i.test(textContent) ? (
                                <div dangerouslySetInnerHTML={{ __html: textContent }} />
                            ) : (
                                processAlignedText(textContent).map((segment, idx) => (
                                    <div key={idx} style={{ textAlign: segment.align }}>
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                                            {segment.text}
                                        </ReactMarkdown>
                                    </div>
                                ))
                            )}
                            </div>
                        ) : 'Bloco de texto vazio. Clique para editar.'}
                    </div>
                )}
            </div>

            {/* Status Bar / Footer */}
            {isActive && (
                <div className="flex items-center justify-between px-2 sm:px-6 mt-3 text-[10px] text-gray-500 font-mono">
                    <div className="flex items-center gap-3">
                        <span className="uppercase tracking-widest">
                            {(editorRef.current?.innerText || textContent.replace(/<[^>]*>/g, '').trim()).length} Caracteres
                        </span>
                    </div>
                    <button
                        onClick={() => setLocalPreview(!localPreview)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all border font-bold uppercase tracking-widest ${localPreview ? 'text-brand-yellow border-brand-yellow/30 bg-brand-yellow/10' : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'}`}
                    >
                        <span className="material-symbols-outlined text-[14px]">{localPreview ? 'edit' : 'visibility'}</span>
                        {localPreview ? 'Modo Edição' : 'Preview KaTeX'}
                    </button>
                </div>
            )}

            {showGlossaryModal && (
                <GlossaryModal isOpen={showGlossaryModal} onClose={() => setShowGlossaryModal(false)} initialSearchTerm={glossarySearchTerm} />
            )}
        </div>
    );
}
