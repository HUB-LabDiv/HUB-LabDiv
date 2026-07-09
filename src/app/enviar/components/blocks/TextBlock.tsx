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

import React, { useRef } from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { GlossaryParser } from '@/components/GlossaryParser';
import { GlossaryModal } from '../GlossaryModal';

interface TextBlockProps {
    block: Block;
    isActive: boolean;
}

export default function TextBlock({ block, isActive }: TextBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const textContent = block.content.text || '';
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showGlossaryModal, setShowGlossaryModal] = React.useState(false);
    const [glossarySearchTerm, setGlossarySearchTerm] = React.useState('');
    const [localPreview, setLocalPreview] = React.useState(false);

    const insertText = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textContent.substring(start, end);
        const newText = textContent.substring(0, start) + prefix + selectedText + suffix + textContent.substring(end);
        
        updateBlock(block.id, { text: newText });

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const sendToGlossary = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textContent.substring(start, end);
        
        setGlossarySearchTerm(selectedText.trim());
        setShowGlossaryModal(true);
    };

    return (
        <div className="flex flex-col gap-2">
            {isActive && (
                <div className="flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
                    <div className="flex items-center gap-1 flex-wrap w-full">
                        <button onClick={() => insertText('**', '**')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_bold</span> Negrito</button>
                        <button onClick={() => insertText('*', '*')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_italic</span> Itálico</button>
                        <button onClick={() => insertText('[', '](url)')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">link</span> Link</button>
                        <button onClick={() => insertText('`', '`')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">code</span> Código</button>
                        <button onClick={() => insertText('$', '$')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">functions</span> LaTeX</button>
                        <button onClick={() => insertText('- ', '')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_list_bulleted</span> Lista</button>
                        <div className="w-px h-4 bg-gray-700/50 mx-1 shrink-0"></div>
                        <button onClick={sendToGlossary} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">menu_book</span> Glossário</button>
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
                    {textContent ? <GlossaryParser text={textContent} /> : 'Bloco de texto vazio. Clique em Editar.'}
                </div>
            )}
            
            {isActive && (
                <div className="flex items-center justify-between mt-2 border-t border-gray-800/50 pt-2">
                    <div className="flex items-center gap-4 text-xs font-mono text-gray-500">
                        <span>Apoio a Markdown</span>
                        <span>LaTeX: $E=mc^2$</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                            {textContent.length} Caracteres
                        </div>
                        <button 
                            onClick={() => setLocalPreview(!localPreview)} 
                            className={`px-3 py-1.5 flex items-center gap-1.5 text-[10px] font-bold rounded-lg border transition-all uppercase tracking-widest ${localPreview ? 'text-brand-yellow border-brand-yellow/50 bg-brand-yellow/10 shadow-[0_0_15px_rgba(255,204,0,0.1)]' : 'text-gray-400 border-gray-700 hover:text-white hover:bg-gray-800'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{localPreview ? 'edit' : 'visibility'}</span> 
                            {localPreview ? 'Editar Texto' : 'Ver Preview Final'}
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
