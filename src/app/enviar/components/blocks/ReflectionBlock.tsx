import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function ReflectionBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const question = block.content.question || '';

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-blue/30 bg-brand-blue/5 rounded-xl focus-within:border-brand-blue transition-colors">
            <div className="flex items-center gap-2 mb-4 opacity-70 text-brand-blue">
                <span className="material-symbols-outlined text-2xl">psychology</span>
                <span className="text-sm font-bold uppercase tracking-wider">Balão de Reflexão</span>
            </div>
            
            <textarea 
                value={question}
                onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                placeholder="Insira provocações dissertativas ou perguntas para o leitor refletir..."
                className="w-full bg-transparent outline-none resize-y min-h-[80px] text-brand-blue placeholder-brand-blue/50 font-medium"
            />
        </div>
    );
}
