import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function GlossaryBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const word = block.content.word || '';
    const meaning = block.content.meaning || '';

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-yellow/30 bg-brand-yellow/5 rounded-xl focus-within:border-brand-yellow transition-colors">
            <div className="flex items-center gap-2 mb-4 opacity-70 text-brand-yellow">
                <span className="material-symbols-outlined text-2xl">menu_book</span>
                <span className="text-sm font-bold uppercase tracking-wider">Glossário</span>
            </div>
            
            <div className="flex flex-col gap-3">
                <input 
                    type="text"
                    value={word}
                    onChange={(e) => updateBlock(block.id, { word: e.target.value })}
                    placeholder="Palavra Difícil / Termo Técnico"
                    className="w-full bg-transparent outline-none border-b border-brand-yellow/30 focus:border-brand-yellow pb-1 text-white font-bold placeholder-brand-yellow/50"
                />
                <textarea 
                    value={meaning}
                    onChange={(e) => updateBlock(block.id, { meaning: e.target.value })}
                    placeholder="Significado / Explicação didática..."
                    className="w-full bg-transparent outline-none resize-y min-h-[60px] text-gray-300 placeholder-brand-yellow/30 text-sm mt-2"
                />
            </div>
        </div>
    );
}
