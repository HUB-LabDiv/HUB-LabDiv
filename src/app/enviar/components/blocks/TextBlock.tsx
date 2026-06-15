import React, { useRef } from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

interface TextBlockProps {
    block: Block;
    isActive: boolean;
}

export default function TextBlock({ block, isActive }: TextBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const textContent = block.content.text || '';
    const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    return (
        <div className="flex flex-col gap-2">
            {isActive && (
                <div className="flex items-center justify-between border-b border-gray-800/50 pb-2 mb-2">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        <button onClick={() => insertText('**', '**')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_bold</span> Negrito</button>
                        <button onClick={() => insertText('*', '*')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_italic</span> Itálico</button>
                        <button onClick={() => insertText('[', '](url)')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">link</span> Link</button>
                        <button onClick={() => insertText('`', '`')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">code</span> Código</button>
                        <button onClick={() => insertText('$', '$')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">functions</span> LaTeX</button>
                        <button onClick={() => insertText('- ', '')} className="px-2 py-1 flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors uppercase tracking-widest"><span className="material-symbols-outlined text-[14px]">format_list_bulleted</span> Lista</button>
                    </div>
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest whitespace-nowrap">
                        {textContent.length} Caracteres
                    </div>
                </div>
            )}
            
            {isActive ? (
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
                    {textContent || 'Bloco de texto vazio. Clique para editar.'}
                </div>
            )}
            
            {isActive && (
                <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-2 border-t border-gray-800/50 pt-2">
                    <span>Apoio a Markdown</span>
                    <span>LaTeX: $E=mc^2$</span>
                </div>
            )}
        </div>
    );
}
