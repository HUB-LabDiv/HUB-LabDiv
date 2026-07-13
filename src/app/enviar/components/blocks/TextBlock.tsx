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

import React, { useRef, useCallback, useEffect } from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { GlossaryParser } from '@/components/GlossaryParser';
import { GlossaryModal } from '../GlossaryModal';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface TextBlockProps {
    block: Block;
    isActive: boolean;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Dados dos menus dropdown                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

interface MarkdownOption {
    label: string;
    icon: string;
    prefix: string;
    suffix: string;
    /** Se true, o prefixo é inserido no início da linha (sem wrap no texto selecionado) */
    linePrefix?: boolean;
}

const MARKDOWN_OPTIONS: MarkdownOption[] = [
    { label: 'Negrito', icon: 'format_bold', prefix: '**', suffix: '**' },
    { label: 'Itálico', icon: 'format_italic', prefix: '*', suffix: '*' },
    { label: 'Tachado', icon: 'strikethrough_s', prefix: '~~', suffix: '~~' },
    { label: 'Título 1', icon: 'format_h1', prefix: '# ', suffix: '', linePrefix: true },
    { label: 'Título 2', icon: 'format_h2', prefix: '## ', suffix: '', linePrefix: true },
    { label: 'Título 3', icon: 'format_h3', prefix: '### ', suffix: '', linePrefix: true },
    { label: 'Título 4', icon: 'format_h4', prefix: '#### ', suffix: '', linePrefix: true },
    { label: 'Citação', icon: 'format_quote', prefix: '> ', suffix: '', linePrefix: true },
    { label: 'Linha Horizontal', icon: 'horizontal_rule', prefix: '\n---\n', suffix: '', linePrefix: true },
    { label: 'Lista com Bullets', icon: 'format_list_bulleted', prefix: '- ', suffix: '', linePrefix: true },
    { label: 'Lista Numerada', icon: 'format_list_numbered', prefix: '1. ', suffix: '', linePrefix: true },
    { label: 'Checkbox / Checklist', icon: 'checklist', prefix: '- [ ] ', suffix: '', linePrefix: true },
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

export default function TextBlock({ block, isActive }: TextBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const textContent = block.content.text || '';
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showGlossaryModal, setShowGlossaryModal] = React.useState(false);
    const [glossarySearchTerm, setGlossarySearchTerm] = React.useState('');
    const [localPreview, setLocalPreview] = React.useState(false);

    /* ── Dropdown states ── */
    const [showMarkdownMenu, setShowMarkdownMenu] = React.useState(false);
    const [showLatexMenu, setShowLatexMenu] = React.useState(false);
    const markdownMenuRef = useRef<HTMLDivElement>(null);
    const latexMenuRef = useRef<HTMLDivElement>(null);

    /* ── Fecha menus ao clicar fora ── */
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (markdownMenuRef.current && !markdownMenuRef.current.contains(e.target as Node)) {
                setShowMarkdownMenu(false);
            }
            if (latexMenuRef.current && !latexMenuRef.current.contains(e.target as Node)) {
                setShowLatexMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    /* ── Core insert helper ── */
    const insertText = useCallback((prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textContent.substring(start, end);
        const newText = textContent.substring(0, start) + prefix + selectedText + suffix + textContent.substring(end);

        updateBlock(block.id, { text: newText });

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    }, [textContent, block.id, updateBlock]);

    /* ── Insert a raw string at cursor ── */
    const insertRawText = useCallback((raw: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const newText = textContent.substring(0, start) + raw + textContent.substring(start);

        updateBlock(block.id, { text: newText });

        setTimeout(() => {
            textarea.focus();
            const cursorPos = start + raw.length;
            textarea.setSelectionRange(cursorPos, cursorPos);
        }, 0);
    }, [textContent, block.id, updateBlock]);

    const sendToGlossary = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textContent.substring(start, end);

        setGlossarySearchTerm(selectedText.trim());
        setShowGlossaryModal(true);
    };

    /* ── Shared button class ── */
    const btnClass = "px-2 py-1.5 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest whitespace-nowrap";
    const dropdownBtnClass = "w-full px-3 py-2 flex items-center gap-2.5 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-lg transition-colors text-left";

    return (
        <div className="flex flex-col gap-2">
            {isActive && (
                <div className="flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
                    <div className="flex items-center gap-0.5 flex-wrap w-full">

                        {/* ── Glossário (esquerda) ── */}
                        <button onClick={sendToGlossary} className={btnClass} title="Glossário Científico">
                            <span className="material-symbols-outlined text-[14px]">menu_book</span>
                            Glossário
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Dropdown: Formatação Markdown ── */}
                        <div ref={markdownMenuRef} className="relative">
                            <button
                                onClick={() => { setShowMarkdownMenu(!showMarkdownMenu); setShowLatexMenu(false); }}
                                className={`${btnClass} ${showMarkdownMenu ? 'text-brand-yellow bg-brand-yellow/10' : ''}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">title</span>
                                Formatação
                                <span className="material-symbols-outlined text-[12px]">{showMarkdownMenu ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {showMarkdownMenu && (
                                <div className="absolute left-0 top-full mt-1 w-64 bg-gray-900 border border-gray-700/60 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Estilo &amp; Estrutura</div>
                                    <div className="px-3 py-1 mb-1">
                                        <p className="text-[10px] text-gray-500 leading-relaxed">Clique para inserir a formatação no cursor.</p>
                                    </div>
                                    {MARKDOWN_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.label}
                                            onClick={() => {
                                                insertText(opt.prefix, opt.suffix);
                                                setShowMarkdownMenu(false);
                                            }}
                                            className={dropdownBtnClass}
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-gray-500">{opt.icon}</span>
                                            <span className="flex-1">{opt.label}</span>
                                            <code className="text-[11px] text-brand-yellow font-mono bg-brand-yellow/5 border border-brand-yellow/20 px-1.5 py-0.5 rounded shrink-0">{opt.suffix ? `${opt.prefix}…${opt.suffix}` : opt.prefix.trim()}</code>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Dropdown: LaTeX (à direita) ── */}
                        <div ref={latexMenuRef} className="relative">
                            <button
                                onClick={() => { setShowLatexMenu(!showLatexMenu); setShowMarkdownMenu(false); }}
                                className={`${btnClass} ${showLatexMenu ? 'text-brand-yellow bg-brand-yellow/10' : ''}`}
                            >
                                <span className="material-symbols-outlined text-[14px]">functions</span>
                                LaTeX
                                <span className="material-symbols-outlined text-[12px]">{showLatexMenu ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {showLatexMenu && (
                                <div className="absolute left-0 top-full mt-1 w-72 bg-gray-900 border border-gray-700/60 rounded-xl shadow-2xl z-50 py-2 max-h-[400px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                                    <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Fórmulas &amp; Símbolos</div>
                                    <div className="px-3 py-1 mb-1">
                                        <p className="text-[10px] text-gray-500 leading-relaxed">Clique para inserir. Use <code className="bg-gray-800 px-1 rounded text-brand-yellow">$...$</code> para inline e <code className="bg-gray-800 px-1 rounded text-brand-yellow">$$...$$</code> para bloco.</p>
                                    </div>
                                    {LATEX_EXAMPLES.map((ex) => (
                                        <button
                                            key={ex.label}
                                            onClick={() => {
                                                const toInsert = ex.formula.startsWith('$$')
                                                    ? ex.formula
                                                    : `$${ex.formula}$`;
                                                insertRawText(toInsert);
                                                setShowLatexMenu(false);
                                            }}
                                            className={dropdownBtnClass}
                                        >
                                            <code className="text-[11px] text-brand-yellow font-mono bg-brand-yellow/5 border border-brand-yellow/20 px-1.5 py-0.5 rounded shrink-0 min-w-[60px] text-center">{ex.display}</code>
                                            <span className="flex-1 text-[11px]">{ex.label}</span>
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-800 mt-1 pt-1">
                                        <button
                                            onClick={() => {
                                                insertText('$', '$');
                                                setShowLatexMenu(false);
                                            }}
                                            className={`${dropdownBtnClass} text-brand-blue`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                            <span className="flex-1 text-[11px]">Inserir LaTeX personalizado (inline)</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                insertRawText('\n$$\n\n$$\n');
                                                setShowLatexMenu(false);
                                            }}
                                            className={`${dropdownBtnClass} text-brand-blue`}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">view_day</span>
                                            <span className="flex-1 text-[11px]">Inserir bloco display ($$…$$)</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Código (standalone com label, à direita do LaTeX) ── */}
                        <button onClick={() => insertText('`', '`')} className={btnClass} title="Código inline">
                            <span className="material-symbols-outlined text-[14px]">code</span>
                            Código
                        </button>

                    </div>
                </div>
            )}

            {isActive && !localPreview ? (
                <textarea
                    ref={textareaRef}
                    autoFocus
                    value={textContent}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    placeholder="Escreva seu texto (Markdown e LaTeX $...$ são suportados)..."
                    className="w-full min-h-[150px] bg-transparent text-gray-200 outline-none resize-y placeholder-gray-600 font-sans leading-relaxed"
                />
            ) : (
                <div className={`w-full min-h-[50px] font-sans leading-relaxed ${textContent ? 'text-gray-200' : 'text-gray-600'}`}>
                    {textContent ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-blockquote:border-brand-blue prose-blockquote:text-gray-400 prose-hr:border-gray-700">
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{textContent}</ReactMarkdown>
                        </div>
                    ) : 'Bloco de texto vazio. Clique em Editar.'}
                </div>
            )}

            {isActive && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 border-t border-gray-800/50 pt-2">
                    <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono text-gray-500">
                        <span>Apoio a Markdown</span>
                        <span>LaTeX: $E=mc^2$</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                            {textContent.length} Caracteres
                        </div>
                        <button
                            onClick={() => setLocalPreview(!localPreview)}
                            className={`px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest whitespace-nowrap ${localPreview ? 'text-brand-yellow border-brand-yellow/50 bg-brand-yellow/10 shadow-[0_0_15px_rgba(255,204,0,0.1)]' : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'}`}
                        >
                            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">{localPreview ? 'edit' : 'visibility'}</span>
                            {localPreview ? 'Editar' : 'Preview'}
                        </button>
                    </div>
                </div>
            )}

            {showGlossaryModal && (
                <GlossaryModal
                    isOpen={showGlossaryModal}
                    onClose={() => setShowGlossaryModal(false)}
                    initialSearchTerm={glossarySearchTerm}
                />
            )}
        </div>
    );
}
