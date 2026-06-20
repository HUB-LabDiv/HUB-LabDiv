import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function QuizBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const question = block.content.question || '';

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-red/30 bg-brand-red/5 rounded-xl focus-within:border-brand-red transition-colors">
            <div className="flex items-center gap-2 mb-4 opacity-70 text-gray-200">
                <span className="material-symbols-outlined text-2xl">quiz</span>
                <span className="text-sm font-bold uppercase tracking-wider">Bloco de Quiz</span>
            </div>
            
            <input 
                type="text"
                value={question}
                onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                placeholder="Digite a pergunta do quiz..."
                className="w-full bg-transparent outline-none border-b border-brand-red/30 pb-2 mb-4 text-white placeholder-gray-500 focus:border-brand-red font-bold transition-colors"
            />
            
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Respostas (Adição em Breve)</p>
        </div>
    );
}
