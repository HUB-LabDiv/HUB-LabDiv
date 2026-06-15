import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

interface TextBlockProps {
    block: Block;
    isActive: boolean;
}

export default function TextBlock({ block, isActive }: TextBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const textContent = block.content.text || '';

    return (
        <div className="flex flex-col gap-2">
            {isActive ? (
                <textarea
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
