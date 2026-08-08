cat << 'INNEREOF' > src/app/enviar/components/blocks/LinkBlock.tsx
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

import React, { useState, useEffect } from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

interface ButtonData {
    id: string;
    label: string;
    url: string;
    style: string;
}

interface LinkBlockProps {
    block: Block;
    isActive: boolean;
}

const BUTTON_STYLES = [
    { value: 'solid-yellow', label: 'Sólido Amarelo' },
    { value: 'solid-blue', label: 'Sólido Azul' },
    { value: 'solid-red', label: 'Sólido Vermelho' },
    { value: 'hover-yellow', label: 'Preto Hover Amarelo' },
    { value: 'hover-blue', label: 'Preto Hover Azul' },
    { value: 'hover-red', label: 'Preto Hover Vermelho' },
    { value: 'hover-gradient', label: 'Preto Hover Degradê' },
    { value: 'gradient', label: 'Degradê Sólido' },
    { value: 'border-yellow', label: 'Borda Amarela' },
    { value: 'border-blue', label: 'Borda Azul' },
    { value: 'border-red', label: 'Borda Vermelha' },
];

export default function LinkBlock({ block, isActive }: LinkBlockProps) {
    const { updateBlock } = useSubmissionStore();

    // Migrate old format to new format
    const [buttons, setButtons] = useState<ButtonData[]>([]);

    useEffect(() => {
        if (block.content.buttons && Array.isArray(block.content.buttons)) {
            setButtons(block.content.buttons);
        } else if (block.content.url !== undefined) {
            // Legacy block
            setButtons([{
                id: Date.now().toString(),
                label: block.content.label || 'Clique Aqui',
                url: block.content.url || '',
                style: 'hover-blue'
            }]);
        }
    }, [block.content]);

    const updateButtons = (newButtons: ButtonData[]) => {
        setButtons(newButtons);
        updateBlock(block.id, { ...block.content, buttons: newButtons });
    };

    const addButton = () => {
        if (buttons.length < 3) {
            updateButtons([...buttons, {
                id: Date.now().toString() + Math.random(),
                label: 'Novo Botão',
                url: '',
                style: 'hover-blue'
            }]);
        }
    };

    const removeButton = (id: string) => {
        updateButtons(buttons.filter(b => b.id !== id));
    };

    const updateButtonField = (id: string, field: keyof ButtonData, value: string) => {
        updateButtons(buttons.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const getButtonStyle = (style: string, isPreview = false) => {
        const baseClasses = `group relative inline-flex items-center justify-center ${isPreview ? 'gap-1.5 px-3 py-2 rounded-lg text-[10px]' : 'gap-3 px-8 py-4 rounded-2xl'} transition-all duration-300 overflow-hidden font-bold tracking-wide w-full`;
        
        switch (style) {
            case 'solid-yellow':
                return `${baseClasses} bg-brand-yellow text-gray-900 hover:bg-brand-yellow/90 ${isPreview ? '' : 'shadow-[0_10px_30px_rgba(255,204,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.4)]'}`;
            case 'solid-blue':
                return `${baseClasses} bg-brand-blue text-white hover:bg-brand-blue/90 ${isPreview ? '' : 'shadow-[0_10px_30px_rgba(15,71,128,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.4)]'}`;
            case 'solid-red':
                return `${baseClasses} bg-brand-red text-white hover:bg-brand-red/90 ${isPreview ? '' : 'shadow-[0_10px_30px_rgba(241,67,67,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.4)]'}`;
            case 'hover-yellow':
                return `${baseClasses} bg-[#1E1E1E] text-white hover:text-gray-900 hover:bg-brand-yellow border border-white/10 hover:border-brand-yellow ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.3)]'}`;
            case 'hover-blue':
                return `${baseClasses} bg-[#1E1E1E] text-white hover:bg-brand-blue border border-white/10 hover:border-brand-blue ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.3)]'}`;
            case 'hover-red':
                return `${baseClasses} bg-[#1E1E1E] text-white hover:bg-brand-red border border-white/10 hover:border-brand-red ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.3)]'}`;
            case 'hover-gradient':
                return `${baseClasses} bg-[#1E1E1E] text-white hover:bg-gradient-to-r hover:from-brand-yellow hover:via-brand-blue hover:to-brand-red border border-white/10 hover:border-transparent ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]'}`;
            case 'gradient':
                return `${baseClasses} bg-gradient-to-r from-brand-yellow via-brand-blue to-brand-red text-white border border-transparent hover:opacity-90 ${isPreview ? '' : 'shadow-[0_10px_30px_rgba(15,71,128,0.3)] hover:-translate-y-1'}`;
            case 'border-yellow':
                return `${baseClasses} bg-[#1E1E1E] text-brand-yellow border-2 border-brand-yellow hover:bg-brand-yellow/10 ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.2)]'}`;
            case 'border-blue':
                return `${baseClasses} bg-[#1E1E1E] text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/10 ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.2)]'}`;
            case 'border-red':
                return `${baseClasses} bg-[#1E1E1E] text-brand-red border-2 border-brand-red hover:bg-brand-red/10 ${isPreview ? '' : 'hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.2)]'}`;
            default:
                return `${baseClasses} bg-[#1E1E1E] text-white border border-white/10 ${isPreview ? '' : 'hover:-translate-y-1'}`;
        }
    };

    const getIconClasses = (style: string) => {
        if (style.startsWith('solid-') && style !== 'solid-yellow') {
            return "text-white";
        }
        if (style === 'solid-yellow') {
            return "text-gray-900";
        }
        if (style === 'hover-yellow') {
            return "text-brand-yellow group-hover:text-gray-900";
        }
        if (style === 'hover-blue') {
            return "text-brand-blue group-hover:text-white";
        }
        if (style === 'hover-red') {
            return "text-brand-red group-hover:text-white";
        }
        if (style === 'hover-gradient' || style === 'gradient') {
            return "text-white";
        }
        if (style === 'border-yellow') {
            return "text-brand-yellow";
        }
        if (style === 'border-blue') {
            return "text-brand-blue";
        }
        if (style === 'border-red') {
            return "text-brand-red";
        }
        return "text-gray-400 group-hover:text-white";
    };

    return (
        <div className="flex flex-col gap-4 w-full items-center">
            {isActive && (
                <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800 w-full">
                    {buttons.map((btn, index) => (
                        <div key={btn.id} className="flex flex-col gap-4 p-4 bg-black/20 rounded-xl border border-gray-800 relative">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">Configuração do Botão {index + 1}</span>
                                {buttons.length > 1 && (
                                    <button onClick={() => removeButton(btn.id)} className="text-gray-500 hover:text-brand-red transition-colors" title="Remover Botão">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Texto do Botão</label>
                                        <input
                                            type="text"
                                            value={btn.label}
                                            onChange={(e) => updateButtonField(btn.id, 'label', e.target.value)}
                                            placeholder="Ex: Acesse o artigo completo..."
                                            className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL do Link</label>
                                        <input
                                            type="text"
                                            value={btn.url}
                                            onChange={(e) => updateButtonField(btn.id, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-blue transition-colors"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-2 mt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Escolha o Estilo (Cor)</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {BUTTON_STYLES.map(style => (
                                            <button
                                                key={style.value}
                                                onClick={() => updateButtonField(btn.id, 'style', style.value)}
                                                className={`
                                                    relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all 
                                                    ${btn.style === style.value ? 'border-brand-blue bg-brand-blue/10 shadow-[0_0_15px_rgba(15,71,128,0.3)] ring-1 ring-brand-blue' : 'border-gray-800 bg-background-dark hover:border-gray-600'}
                                                `}
                                            >
                                                {/* Mini preview */}
                                                <div className="w-full pointer-events-none mb-3">
                                                    <div className={getButtonStyle(style.value, true)}>
                                                        <span className={`material-symbols-outlined text-[14px] ${getIconClasses(style.value)}`}>hub</span>
                                                        <span className="truncate">Preview</span>
                                                    </div>
                                                </div>
                                                <span className={`text-[10px] font-bold mt-auto text-center uppercase tracking-wider ${btn.style === style.value ? 'text-brand-blue' : 'text-gray-400'}`}>
                                                    {style.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {buttons.length < 3 && (
                        <button
                            onClick={addButton}
                            className="flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-wider mt-2"
                        >
                            <span className="material-symbols-outlined text-lg">add_circle</span>
                            Adicionar Mais um Botão
                        </button>
                    )}
                </div>
            )}

            {!isActive && buttons.length > 0 && (
                <div className={`w-full py-4 flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-4`}>
                    {buttons.map((btn) => {
                        if (!btn.url) return null;
                        const isInternal = btn.url.includes('hublabdiv') || btn.url.startsWith('/') || btn.url.includes('localhost');
                        return (
                            <a
                                key={btn.id}
                                href={btn.url}
                                target={isInternal ? '_self' : '_blank'}
                                rel={isInternal ? '' : 'noopener noreferrer'}
                                className={getButtonStyle(btn.style)}
                            >
                                {isInternal ? (
                                    <span className={`material-symbols-outlined text-[20px] transition-colors ${getIconClasses(btn.style)}`}>hub</span>
                                ) : (
                                    <span className={`material-symbols-outlined text-[20px] transition-colors ${getIconClasses(btn.style)}`}>open_in_new</span>
                                )}
                                <span>{btn.label}</span>
                            </a>
                        );
                    })}
                </div>
            )}
            
            {!isActive && buttons.length > 0 && buttons.every(b => !b.url) && (
                <div className="text-gray-500 text-sm italic text-center py-4">Links não configurados.</div>
            )}
        </div>
    );
}
INNEREOF
