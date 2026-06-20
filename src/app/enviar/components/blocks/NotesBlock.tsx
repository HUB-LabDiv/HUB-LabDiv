import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function NotesBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const text = block.content.text || '';

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-yellow/50 bg-brand-yellow/10 rounded-xl focus-within:border-brand-yellow transition-colors">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-200">
                    <span className="material-symbols-outlined text-2xl">shield_person</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Comentários da Autoria</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black uppercase text-gray-200 bg-brand-yellow/20 px-2 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[12px]">visibility_off</span>
                    Invisível ao Público
                </div>
            </div>
            
            <p className="text-xs text-gray-300 mb-3 font-medium">
                Use este espaço exclusivo para enviar notas, metadados ou justificativas para a Curadoria/Moderação avaliar o seu envio.
            </p>
            
            <textarea 
                value={text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                placeholder="Escreva seus comentários aqui..."
                className="w-full bg-black/40 border border-brand-yellow/20 rounded-lg p-3 outline-none resize-y min-h-[100px] text-gray-300 placeholder-gray-600 focus:border-brand-yellow/50"
            />
        </div>
    );
}
