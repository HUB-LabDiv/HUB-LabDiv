import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function ContextBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    let icon = 'history_edu';
    let label = 'Contexto Histórico';
    let colorClass = 'text-brand-yellow border-brand-yellow/30 bg-brand-yellow/5';

    if (block.type === 'context_social') {
        icon = 'groups';
        label = 'Contexto Social';
        colorClass = 'text-brand-blue border-brand-blue/30 bg-brand-blue/5';
    } else if (block.type === 'context_political') {
        icon = 'gavel';
        label = 'Contexto Político';
        colorClass = 'text-brand-red border-brand-red/30 bg-brand-red/5';
    }

    return (
        <div className={`flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-xl ${colorClass}`}>
            <span className="material-symbols-outlined text-3xl mb-1">{icon}</span>
            <span className="text-sm font-bold">{label}</span>
            <p className="text-xs mt-1 text-gray-500">Desenvolva as nuances textuais relativas a este eixo.</p>
        </div>
    );
}
