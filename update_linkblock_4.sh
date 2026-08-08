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
    { value: 'solid-black', label: 'Sólido Preto' },
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

    const getButtonStyle = (style: string, isPreview = false, forceHoverState = false) => {
        const baseClasses = `relative inline-flex items-center justify-center ${isPreview ? 'gap-1.5 px-3 py-2 rounded-lg text-[10px]' : 'gap-3 px-8 py-4 rounded-2xl group'} transition-all duration-300 overflow-hidden font-bold tracking-wide w-full`;
        
        let classes = '';
        switch (style) {
            case 'solid-black':
                if (forceHoverState) classes = `${baseClasses} bg-[#252525] text-white shadow-[0_10px_30px_rgba(0,0,0,0.6)] border border-white/20 -translate-y-1`;
                else classes = `${baseClasses} bg-[#151515] text-white shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:bg-[#252525] border border-white/10`;
                break;
            case 'solid-yellow':
                if (forceHoverState) classes = `${baseClasses} bg-brand-yellow/90 text-gray-900 shadow-[0_10px_30px_rgba(255,204,0,0.4)] border border-brand-yellow -translate-y-1`;
                else classes = `${baseClasses} bg-brand-yellow text-gray-900 shadow-[0_10px_30px_rgba(255,204,0,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.4)] border border-brand-yellow`;
                break;
            case 'solid-blue':
                if (forceHoverState) classes = `${baseClasses} bg-brand-blue/90 text-white shadow-[0_10px_30px_rgba(15,71,128,0.4)] border border-brand-blue -translate-y-1`;
                else classes = `${baseClasses} bg-brand-blue text-white shadow-[0_10px_30px_rgba(15,71,128,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.4)] border border-brand-blue`;
                break;
            case 'solid-red':
                if (forceHoverState) classes = `${baseClasses} bg-brand-red/90 text-white shadow-[0_10px_30px_rgba(241,67,67,0.4)] border border-brand-red -translate-y-1`;
                else classes = `${baseClasses} bg-brand-red text-white shadow-[0_10px_30px_rgba(241,67,67,0.2)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.4)] border border-brand-red`;
                break;
            
            case 'hover-yellow':
                if (forceHoverState) classes = `${baseClasses} bg-brand-yellow text-gray-900 border border-brand-yellow shadow-[0_10px_30px_rgba(255,204,0,0.4)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-white hover:text-gray-900 hover:bg-brand-yellow border border-white/10 hover:border-brand-yellow hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.3)]`;
                break;
            
            case 'hover-blue':
                if (forceHoverState) classes = `${baseClasses} bg-brand-blue text-white border border-brand-blue shadow-[0_10px_30px_rgba(15,71,128,0.4)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-white hover:bg-brand-blue border border-white/10 hover:border-brand-blue hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.3)]`;
                break;
            
            case 'hover-red':
                if (forceHoverState) classes = `${baseClasses} bg-brand-red text-white border border-brand-red shadow-[0_10px_30px_rgba(241,67,67,0.4)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-white hover:bg-brand-red border border-white/10 hover:border-brand-red hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.3)]`;
                break;
            
            case 'hover-gradient':
                if (forceHoverState) classes = `${baseClasses} bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow text-white border-0 shadow-[0_10px_30px_rgba(255,255,255,0.3)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-white hover:bg-gradient-to-r hover:from-brand-blue hover:via-brand-red hover:to-brand-yellow border border-white/10 hover:border-0 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]`;
                break;
            
            case 'gradient':
                if (forceHoverState) classes = `${baseClasses} bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow text-white border-0 opacity-90 shadow-[0_10px_30px_rgba(15,71,128,0.4)] -translate-y-1`;
                else classes = `${baseClasses} bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow text-white border-0 hover:opacity-90 shadow-[0_10px_30px_rgba(15,71,128,0.3)] hover:-translate-y-1`;
                break;
            
            case 'border-yellow':
                if (forceHoverState) classes = `${baseClasses} bg-brand-yellow/10 text-brand-yellow border-2 border-brand-yellow shadow-[0_10px_30px_rgba(255,204,0,0.3)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-brand-yellow border-2 border-brand-yellow hover:bg-brand-yellow/10 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,204,0,0.2)]`;
                break;
            
            case 'border-blue':
                if (forceHoverState) classes = `${baseClasses} bg-brand-blue/10 text-brand-blue border-2 border-brand-blue shadow-[0_10px_30px_rgba(15,71,128,0.3)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/10 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(15,71,128,0.2)]`;
                break;
            
            case 'border-red':
                if (forceHoverState) classes = `${baseClasses} bg-brand-red/10 text-brand-red border-2 border-brand-red shadow-[0_10px_30px_rgba(241,67,67,0.3)] -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-brand-red border-2 border-brand-red hover:bg-brand-red/10 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(241,67,67,0.2)]`;
                break;
            
            default:
                if (forceHoverState) classes = `${baseClasses} bg-[#252525] text-white border border-white/20 -translate-y-1`;
                else classes = `${baseClasses} bg-[#1E1E1E] text-white border border-white/10 hover:-translate-y-1 hover:bg-[#252525] hover:border-white/20`;
        }

        if (isPreview) {
            // Em modo preview, removemos todos os hover: para que o botão interno fique 100% estático,
            // reagindo apenas ao clique (que ativa o forceHoverState).
            classes = classes.replace(/hover:[^\s]+/g, '');
        }
        return classes;
    };

    const getIconClasses = (style: string, forceHoverState = false, isPreview = false) => {
        let classes = "text-gray-400 group-hover:text-white";
        
        if (style.startsWith('solid-') && style !== 'solid-yellow') {
            classes = "text-white";
        } else if (style === 'solid-yellow') {
            classes = "text-gray-900";
        } else if (style === 'hover-yellow') {
            if (forceHoverState) classes = "text-gray-900";
            else classes = "text-brand-yellow hover:text-gray-900";
        } else if (style === 'hover-blue') {
            if (forceHoverState) classes = "text-white";
            else classes = "text-brand-blue hover:text-white";
        } else if (style === 'hover-red') {
            if (forceHoverState) classes = "text-white";
            else classes = "text-brand-red hover:text-white";
        } else if (style === 'hover-gradient' || style === 'gradient') {
            classes = "text-white";
        } else if (style === 'border-yellow') {
            classes = "text-brand-yellow";
        } else if (style === 'border-blue') {
            classes = "text-brand-blue";
        } else if (style === 'border-red') {
            classes = "text-brand-red";
        }

        if (isPreview) {
            classes = classes.replace(/hover:[^\s]+/g, '');
            classes = classes.replace(/group-hover:[^\s]+/g, '');
        }
        return classes;
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
                                
                                <div className="flex flex-col gap-3 mt-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Escolha o Estilo (Cor)</label>
                                        <div className="text-[9px] text-gray-400 font-medium bg-black/30 px-2 py-1.5 rounded border border-gray-800 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[12px] text-brand-yellow">touch_app</span>
                                            <span className="opacity-90">Ao selecionar, veja o efeito final</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {BUTTON_STYLES.map(style => {
                                            const isSelected = btn.style === style.value;
                                            // Sempre forceHoverState = true quando selecionado, 
                                            // assim o botão fica "travado" no estado ativado.
                                            const forceHover = isSelected;
                                            
                                            return (
                                                <button
                                                    key={style.value}
                                                    onClick={() => updateButtonField(btn.id, 'style', style.value)}
                                                    className={`
                                                        relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all overflow-hidden
                                                        ${isSelected ? 'border-brand-blue bg-brand-blue/10 shadow-[0_0_15px_rgba(15,71,128,0.3)] ring-1 ring-brand-blue' : 'border-gray-800 bg-background-dark'}
                                                    `}
                                                >
                                                    {/* Mini preview */}
                                                    <div className="w-full pointer-events-none mb-3">
                                                        <div className={getButtonStyle(style.value, true, forceHover)}>
                                                            <span className={`material-symbols-outlined text-[14px] ${getIconClasses(style.value, forceHover, true)}`}>hub</span>
                                                            {/* Forçamos a cor explicitamente no span para evitar qualquer sumiço */}
                                                            <span className={`truncate max-w-[80px] ${style.value.includes('yellow') && (style.value === 'solid-yellow' || (style.value === 'hover-yellow' && forceHover)) ? 'text-gray-900' : ''}`}>{btn.label || 'Botão'}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`text-[10px] font-bold mt-auto text-center uppercase tracking-wider ${isSelected ? 'text-brand-blue' : 'text-gray-400'}`}>
                                                        {style.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
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
                                <span>{btn.label || 'Botão'}</span>
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
