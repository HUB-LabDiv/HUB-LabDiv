import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function QuizBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 border-2 border-dashed border-brand-red/30 bg-brand-red/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-brand-red">quiz</span>
            <span className="text-sm font-bold text-brand-red">Bloco de Quiz</span>
            <p className="text-xs mt-1">Crie perguntas interativas para testar o leitor.</p>
        </div>
    );
}
