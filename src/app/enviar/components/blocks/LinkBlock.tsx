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

interface LinkBlockProps {
    block: Block;
    isActive: boolean;
}

export default function LinkBlock({ block, isActive }: LinkBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const url = block.content.url || '';
    const label = block.content.label || 'Clique Aqui';

    const isInternal = url.includes('hublabdiv') || url.startsWith('/') || url.includes('localhost');

    return (
        <div className="flex flex-col gap-4 w-full items-center">
            {isActive && (
                <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800 w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Texto do Botão</label>
                        <input
                            type="text"
                            value={label}
                            onChange={(e) => updateBlock(block.id, { ...block.content, label: e.target.value })}
                            placeholder="Ex: Acesse o artigo completo..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL do Link</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                            placeholder="https://..."
                            className="w-full bg-[#121212] border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                </div>
            )}

            {!isActive && url && (
                <div className="w-full py-4 flex justify-center">
                    <a
                        href={url}
                        target={isInternal ? '_self' : '_blank'}
                        rel={isInternal ? '' : 'noopener noreferrer'}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E1E1E] hover:bg-white/5 border border-white/10 hover:border-brand-blue/50 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.3)] overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/0 via-brand-blue/10 to-brand-blue/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                        
                        {isInternal ? (
                            <div className="w-6 h-6 rounded bg-brand-blue/20 flex items-center justify-center border border-brand-blue/40 group-hover:bg-brand-blue group-hover:border-brand-blue transition-colors">
                                <span className="material-symbols-outlined text-[14px] text-brand-blue group-hover:text-white transition-colors">hub</span>
                            </div>
                        ) : (
                            <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors">open_in_new</span>
                        )}
                        
                        <span className="font-bold text-white tracking-wide">{label}</span>
                    </a>
                </div>
            )}
            
            {!isActive && !url && (
                <div className="text-gray-500 text-sm italic text-center py-4">Link não configurado.</div>
            )}
        </div>
    );
}
