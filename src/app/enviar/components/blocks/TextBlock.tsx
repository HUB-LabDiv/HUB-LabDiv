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

function markdownToHtml(md: string): string {
    if (!md) return '';
    if (/<[a-z][\s\S]*>/i.test(md)) return md;

    return md
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>')
        .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.*?)\*/g, '<i>$1</i>')
        .replace(/~~(.*?)~~/g, '<del>$1</del>')
        .replace(/\n/g, '<br>');
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

    const [tableRows, setTableRows] = useState(3);
    const [tableCols, setTableCols] = useState(3);
    const [hoverRows, setHoverRows] = useState(0);
    const [hoverCols, setHoverCols] = useState(0);

    const formattingMenuRef = useRef<HTMLDivElement>(null);
    const latexMenuRef = useRef<HTMLDivElement>(null);
    const colorMenuRef = useRef<HTMLDivElement>(null);
    const tableMenuRef = useRef<HTMLDivElement>(null);

    // Tracks the last (blockId + isActive + localPreview) key that was initialized
    const initializedKeyRef = useRef<string | null>(null);

    useEffect(() => {
        const editorVisible = isActive && !localPreview;
        if (editorVisible && editorRef.current) {
            const key = `${block.id}::active`;
            if (initializedKeyRef.current !== key) {
                initializedKeyRef.current = key;
                editorRef.current.innerHTML = markdownToHtml(textContent);
            }
        }
        if (!editorVisible) {
            // Reset so re-entering edit mode always reloads the latest store text
            initializedKeyRef.current = null;
        }
    }, [block.id, isActive, localPreview]);

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
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            const html = editorRef.current.innerHTML;
            updateBlock(block.id, { text: html });
        }
    };

    const execCmd = (command: string, value: string = '') => {
        if (editorRef.current) {
            editorRef.current.focus();
        }
        document.execCommand(command, false, value);
        handleInput();
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
            headerColsHtml += `<th style="border: 1px solid #374151; padding: 8px; text-align: left; color: #FFFFFF;">Coluna ${j}</th>`;
        }

        let bodyRowsHtml = '';
        for (let i = 1; i <= rowsCount; i++) {
            let colsInRowHtml = '';
            for (let j = 1; j <= colsCount; j++) {
                colsInRowHtml += `<td style="border: 1px solid #374151; padding: 8px;">Dado ${i}.${j}</td>`;
            }
            bodyRowsHtml += `<tr>${colsInRowHtml}</tr>`;
        }

        const tableHtml = `
<table style="width: 100%; border-collapse: collapse; margin: 12px 0; border: 1px solid #374151;">
  <thead>
    <tr style="background-color: #1F2937;">
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

    const btnClass = "px-2.5 py-1.5 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors uppercase tracking-widest whitespace-nowrap shrink-0";
    const dropdownBtnClass = "w-full px-2.5 py-1.5 flex items-center gap-2 text-xs text-gray-300 hover:text-white hover:bg-gray-700/60 rounded-md transition-colors text-left";

    return (
        <div className="flex flex-col gap-2 relative">
            {isActive && (
                <div 
                    className="sticky z-30 bg-gray-900/95 backdrop-blur-md pt-2 pb-1 mb-2 border-b border-gray-800/80 w-full transition-all rounded-t-lg shadow-lg relative"
                    style={{ top: 'calc(9.5rem + env(safe-area-inset-top, 0px))' }}
                >
                    {/* Barra de Ferramentas com rolagem horizontal limpa */}
                    <div className="flex items-center gap-1 overflow-x-auto pb-2 px-1 w-full shrink-0 scrollbar-thin scrollbar-thumb-gray-700/60 scrollbar-track-transparent">

                        {/* ── Glossário ── */}
                        <button onClick={sendToGlossary} className={btnClass} title="Glossário Científico">
                            <span className="material-symbols-outlined text-[15px]">menu_book</span>
                            Glossário
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Botão: Texto Normal ── */}
                        <button 
                            onClick={() => execCmd('formatBlock', '<p>')} 
                            className={btnClass} 
                            title="Restaurar para Texto Normal / Parágrafo"
                        >
                            <span className="material-symbols-outlined text-[15px]">notes</span>
                            Texto Normal
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Botão: Formatação ── */}
                        <button
                            onClick={() => { setShowFormattingMenu(!showFormattingMenu); setShowLatexMenu(false); setShowColorMenu(false); }}
                            className={`${btnClass} ${showFormattingMenu ? 'text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30' : ''}`}
                        >
                            <span className="material-symbols-outlined text-[15px]">title</span>
                            Formatação
                            <span className="material-symbols-outlined text-[12px]">{showFormattingMenu ? 'expand_less' : 'expand_more'}</span>
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Botão: Cor IDV ── */}
                        <button
                            onClick={() => { setShowColorMenu(!showColorMenu); setShowFormattingMenu(false); setShowLatexMenu(false); }}
                            className={`${btnClass} ${showColorMenu ? 'text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30' : ''}`}
                            title="Cores da Identidade Visual"
                        >
                            <span className="material-symbols-outlined text-[15px]">palette</span>
                            Cor IDV
                            <span className="material-symbols-outlined text-[12px]">{showColorMenu ? 'expand_less' : 'expand_more'}</span>
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Botão: Tabela (com Menu de Configuração de Dimensões) ── */}
                        <button 
                            onClick={() => {
                                setShowTableMenu(!showTableMenu);
                                setShowFormattingMenu(false);
                                setShowColorMenu(false);
                                setShowLatexMenu(false);
                            }}
                            className={`${btnClass} ${showTableMenu ? 'text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30' : ''}`} 
                            title="Configurar e Inserir Tabela Visual"
                        >
                            <span className="material-symbols-outlined text-[15px] text-brand-yellow">grid_on</span>
                            <span className="text-brand-yellow">Tabela</span>
                            <span className="material-symbols-outlined text-[12px]">{showTableMenu ? 'expand_less' : 'expand_more'}</span>
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Botão: LaTeX ── */}
                        <button
                            onClick={() => { setShowLatexMenu(!showLatexMenu); setShowFormattingMenu(false); setShowColorMenu(false); setShowTableMenu(false); }}
                            className={`${btnClass} ${showLatexMenu ? 'text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/30' : ''}`}
                        >
                            <span className="material-symbols-outlined text-[15px]">functions</span>
                            LaTeX
                            <span className="material-symbols-outlined text-[12px]">{showLatexMenu ? 'expand_less' : 'expand_more'}</span>
                        </button>

                        <div className="w-px h-4 bg-gray-700/50 mx-0.5 shrink-0"></div>

                        {/* ── Alinhamento de Texto ── */}
                        <div className="flex items-center bg-gray-800/60 rounded-lg p-0.5 gap-0.5 shrink-0">
                            {ALIGN_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => {
                                        execCmd(opt.command);
                                        setCurrentLineAlign(opt.value);
                                    }}
                                    className={`p-1.5 rounded-md transition-all duration-150 ${
                                        currentLineAlign === opt.value
                                            ? 'bg-brand-yellow/15 text-brand-yellow shadow-sm'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
                                    }`}
                                    title={opt.label}
                                >
                                    <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* ── DROPDOWNS FORA DO CONTAINER OVERFLOW ── */}
                    {showFormattingMenu && (
                        <div ref={formattingMenuRef} className="absolute left-2 sm:left-44 top-full mt-1 w-72 sm:w-80 max-w-[90vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 p-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-2 py-1 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] border-b border-gray-800 mb-1.5 flex items-center justify-between">
                                <span>Estilos &amp; Títulos</span>
                                <span className="text-[8px] text-gray-600 font-normal">2 Colunas</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <button onClick={() => { execCmd('formatBlock', '<p>'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">notes</span>
                                    <span className="text-xs">Texto Normal</span>
                                </button>

                                <button onClick={() => { execCmd('formatBlock', '<h1>'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_h1</span>
                                    <span className="font-bold text-xs">Título 1</span>
                                </button>

                                <button onClick={() => { execCmd('bold'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_bold</span>
                                    <span className="font-bold text-xs">Negrito</span>
                                </button>

                                <button onClick={() => { execCmd('formatBlock', '<h2>'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_h2</span>
                                    <span className="font-bold text-xs">Título 2</span>
                                </button>

                                <button onClick={() => { execCmd('italic'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_italic</span>
                                    <span className="italic text-xs">Itálico</span>
                                </button>

                                <button onClick={() => { execCmd('formatBlock', '<h3>'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_h3</span>
                                    <span className="font-bold text-xs">Título 3</span>
                                </button>

                                <button onClick={() => { execCmd('strikeThrough'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">strikethrough_s</span>
                                    <span className="line-through text-xs">Tachado</span>
                                </button>

                                <button onClick={() => { execCmd('formatBlock', '<blockquote>'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_quote</span>
                                    <span className="text-xs">Citação</span>
                                </button>

                                <button onClick={() => { execCmd('insertUnorderedList'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_list_bulleted</span>
                                    <span className="text-xs">Bullets</span>
                                </button>

                                <button onClick={() => { execCmd('insertOrderedList'); setShowFormattingMenu(false); }} className={dropdownBtnClass}>
                                    <span className="material-symbols-outlined text-[16px] text-gray-400">format_list_numbered</span>
                                    <span className="text-xs">Números</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {showColorMenu && (
                        <div ref={colorMenuRef} className="absolute left-2 sm:left-48 top-full mt-1 w-48 max-w-[85vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Cores da Marca</div>
                            {IDV_COLORS.map((col) => (
                                <button
                                    key={col.color}
                                    onClick={() => applyColor(col.color)}
                                    className={dropdownBtnClass}
                                >
                                    <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass} shrink-0 border border-white/20`} />
                                    <span className="flex-1 text-xs">{col.label}</span>
                                </button>
                            ))}
                            <div className="border-t border-gray-800 my-1"></div>
                            <button onClick={() => applyColor('inherit')} className={dropdownBtnClass}>
                                <span className="material-symbols-outlined text-[16px] text-gray-400">format_color_reset</span>
                                <span className="flex-1 text-xs text-gray-400">Restaurar Padrão</span>
                            </button>
                        </div>
                    )}

                    {showTableMenu && (
                        <div ref={tableMenuRef} className="absolute left-2 sm:left-64 top-full mt-1 w-72 max-w-[90vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 p-3 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.15em] border-b border-gray-800 pb-1.5 mb-2.5 flex items-center justify-between">
                                <span>Configurar Tabela</span>
                                <span className="text-brand-yellow font-bold text-xs">
                                    {hoverRows > 0 && hoverCols > 0 ? `${hoverRows} × ${hoverCols}` : `${tableRows} × ${tableCols}`}
                                </span>
                            </div>

                            {/* Grade de Seleção Rápida (5x5 Grid Matrix) */}
                            <div className="mb-3">
                                <span className="text-[10px] text-gray-400 block mb-1.5 font-medium">Seleção Rápida:</span>
                                <div 
                                    className="grid grid-cols-5 gap-1 p-1.5 bg-gray-800/40 rounded-lg border border-gray-800 w-fit mx-auto"
                                    onMouseLeave={() => { setHoverRows(0); setHoverCols(0); }}
                                >
                                    {Array.from({ length: 5 }).map((_, rIdx) => (
                                        Array.from({ length: 5 }).map((_, cIdx) => {
                                            const r = rIdx + 1;
                                            const c = cIdx + 1;
                                            const isHighlighted = (hoverRows > 0 && hoverCols > 0)
                                                ? (r <= hoverRows && c <= hoverCols)
                                                : (r <= tableRows && c <= tableCols);
                                            return (
                                                <button
                                                    key={`${r}-${c}`}
                                                    type="button"
                                                    onMouseEnter={() => { setHoverRows(r); setHoverCols(c); }}
                                                    onClick={() => generateCustomTable(r, c)}
                                                    className={`w-5 h-5 rounded-[3px] border transition-all ${
                                                        isHighlighted 
                                                            ? 'bg-brand-yellow/80 border-brand-yellow shadow-[0_0_8px_rgba(255,204,0,0.4)]' 
                                                            : 'bg-gray-800/60 border-gray-700 hover:border-gray-500'
                                                    }`}
                                                    title={`Tabela ${r} × ${c}`}
                                                />
                                            );
                                        })
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-gray-800 my-2"></div>

                            {/* Ajuste Numérico de Linhas e Colunas */}
                            <div className="flex flex-col gap-2 mb-3">
                                <div className="flex items-center justify-between text-xs text-gray-300">
                                    <span className="font-semibold">Linhas:</span>
                                    <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg p-0.5">
                                        <button 
                                            type="button"
                                            onClick={() => setTableRows(Math.max(1, tableRows - 1))}
                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-mono font-bold text-brand-yellow">{tableRows}</span>
                                        <button 
                                            type="button"
                                            onClick={() => setTableRows(Math.min(15, tableRows + 1))}
                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-300">
                                    <span className="font-semibold">Colunas:</span>
                                    <div className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg p-0.5">
                                        <button 
                                            type="button"
                                            onClick={() => setTableCols(Math.max(1, tableCols - 1))}
                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="w-6 text-center font-mono font-bold text-brand-yellow">{tableCols}</span>
                                        <button 
                                            type="button"
                                            onClick={() => setTableCols(Math.min(10, tableCols + 1))}
                                            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-700 text-gray-300 font-bold cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Botão de Inserção */}
                            <button
                                type="button"
                                onClick={() => generateCustomTable(tableRows, tableCols)}
                                className="w-full py-2 px-3 bg-brand-yellow text-gray-900 font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-brand-yellow/90 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-yellow/10 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">grid_on</span>
                                Inserir Tabela {tableRows} × {tableCols}
                            </button>
                        </div>
                    )}

                    {showLatexMenu && (
                        <div ref={latexMenuRef} className="absolute right-2 sm:left-72 top-full mt-1 w-72 max-w-[85vw] bg-gray-900 border border-gray-700/80 rounded-xl shadow-2xl z-50 py-2 max-h-[350px] overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="px-3 py-1.5 text-[9px] font-black text-gray-500 uppercase tracking-[0.15em]">Inserir Fórmulas</div>
                            <div className="px-3 py-1 mb-1">
                                <p className="text-[10px] text-gray-500 leading-relaxed">Clique para inserir a fórmula no cursor. Use o botão Preview para ver o KaTeX formatado.</p>
                            </div>
                            {LATEX_EXAMPLES.map((ex) => (
                                <button
                                    key={ex.label}
                                    onClick={() => {
                                        const toInsert = ex.formula.startsWith('$$') ? ex.formula : `$${ex.formula}$`;
                                        insertLatex(toInsert);
                                    }}
                                    className={dropdownBtnClass}
                                >
                                    <code className="text-[11px] text-brand-yellow font-mono bg-brand-yellow/5 border border-brand-yellow/20 px-1.5 py-0.5 rounded shrink-0 min-w-[60px] text-center">{ex.display}</code>
                                    <span className="flex-1 text-[11px]">{ex.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isActive && !localPreview ? (
                <div
                    ref={editorRef}
                    contentEditable={true}
                    onInput={handleInput}
                    onBlur={handleInput}
                    suppressContentEditableWarning={true}
                    className="w-full min-h-[150px] bg-transparent text-gray-200 outline-none placeholder-gray-600 font-sans leading-relaxed prose prose-sm dark:prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-blockquote:border-brand-blue prose-blockquote:text-gray-400 prose-hr:border-gray-700 prose-table:border prose-table:border-gray-700 prose-th:bg-gray-800 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-gray-700 flex-1"
                />
            ) : (
                <div className={`w-full min-h-[50px] font-sans leading-relaxed ${textContent ? 'text-gray-200' : 'text-gray-600'}`}>
                    {textContent ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-code:text-brand-yellow prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded prose-blockquote:border-brand-blue prose-blockquote:text-gray-400 prose-hr:border-gray-700 prose-table:border prose-table:border-gray-700 prose-th:bg-gray-800 prose-th:p-2 prose-td:p-2 prose-td:border prose-td:border-gray-700">
                            {/<[a-z][\s\S]*>/i.test(textContent) ? (
                                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeRaw, rehypeKatex]}>
                                    {textContent}
                                </ReactMarkdown>
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
                    ) : 'Bloco de texto vazio. Clique em Editar.'}
                </div>
            )}

            {isActive && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-2 border-t border-gray-800/50 pt-2">
                    <div className="flex items-center gap-4 text-[10px] sm:text-xs font-mono text-gray-500">
                        <span>Editor Visual (Word-like)</span>
                        <span>LaTeX: $E=mc^2$</span>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                            {(editorRef.current?.innerText || textContent.replace(/<[^>]*>/g, '').trim()).length} Caracteres
                        </div>
                        <button
                            onClick={() => setLocalPreview(!localPreview)}
                            className={`px-2.5 sm:px-3 py-1.5 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest whitespace-nowrap ${localPreview ? 'text-brand-yellow border-brand-yellow/50 bg-brand-yellow/10 shadow-[0_0_15px_rgba(255,204,0,0.1)]' : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'}`}
                        >
                            <span className="material-symbols-outlined text-[14px] sm:text-[16px]">{localPreview ? 'edit' : 'visibility'}</span>
                            {localPreview ? 'Editar' : 'Preview (LaTeX)'}
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
