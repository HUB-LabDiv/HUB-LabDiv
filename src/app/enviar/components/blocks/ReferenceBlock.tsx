import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function ReferenceBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const text = block.content.text || '';

    return (
        <div className="flex flex-col p-4 border border-gray-700 bg-gray-900/50 rounded-xl focus-within:border-gray-500 transition-colors">
            <div className="flex items-center gap-2 mb-4 text-gray-300">
                <span className="material-symbols-outlined text-2xl">format_quote</span>
                <span className="text-sm font-bold uppercase tracking-wider">Referências / Fontes</span>
            </div>
            
            <textarea 
                value={text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                placeholder="Ex: SILVA, J. A. Título do Livro. São Paulo: Editora, 2024..."
                className="w-full bg-transparent outline-none resize-y min-h-[100px] text-gray-400 placeholder-gray-600 text-sm font-mono leading-relaxed"
            />
        </div>
    );
}
