import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function ReflectionBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-500 border-2 border-dashed border-brand-blue/30 bg-brand-blue/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-brand-blue">psychology</span>
            <span className="text-sm font-bold text-brand-blue">Bloco de Reflexão Histórica</span>
            <p className="text-xs mt-1">Insira contextos HSEC ou provocações dissertativas.</p>
        </div>
    );
}
