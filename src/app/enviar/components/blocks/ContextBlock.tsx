/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function ContextBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const text = block.content.text || '';

    let icon = 'history_edu';
    let label = 'Contexto Histórico';
    let colorClass = 'text-gray-200 border-brand-yellow/30 bg-brand-yellow/5 focus-within:border-brand-yellow';

    if (block.type === 'context_social') {
        icon = 'groups';
        label = 'Contexto Social';
        colorClass = 'text-gray-200 border-brand-blue/30 bg-brand-blue/5 focus-within:border-brand-blue';
    } else if (block.type === 'context_political') {
        icon = 'gavel';
        label = 'Contexto Político';
        colorClass = 'text-gray-200 border-brand-red/30 bg-brand-red/5 focus-within:border-brand-red';
    }

    return (
        <div className={`flex flex-col p-4 border-2 border-dashed rounded-xl transition-colors ${colorClass}`}>
            <div className="flex items-center gap-2 mb-4 opacity-70">
                <span className="material-symbols-outlined text-2xl">{icon}</span>
                <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
            </div>
            
            <textarea 
                value={text}
                onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                placeholder="Desenvolva as nuances textuais relativas a este eixo..."
                className="w-full bg-transparent outline-none resize-y min-h-[100px] text-gray-300 placeholder-gray-600"
            />
        </div>
    );
}
