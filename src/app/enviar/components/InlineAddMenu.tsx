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

import React, { useState } from 'react';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { BlockType } from '@/app/enviar/schema';

interface InlineAddMenuProps {
    insertAfterId?: string;
    variant?: 'blue' | 'yellow' | 'red' | 'all';
    large?: boolean;
}

export function InlineAddMenu({ insertAfterId, variant = 'all', large = false }: InlineAddMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { addBlock, previewMode } = useSubmissionStore();
    const menuRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (previewMode === 'preview') return null;

    const handleAdd = (type: BlockType) => {
        addBlock(type, {}, insertAfterId);
        setIsOpen(false);
    };

    const bgColor = variant === 'yellow' ? 'bg-brand-yellow text-gray-900' : variant === 'red' ? 'bg-brand-red text-white' : variant === 'blue' ? 'bg-brand-blue text-white' : 'bg-brand-blue text-white';
    const hoverColor = variant === 'yellow' ? 'hover:bg-brand-yellow/80 hover:text-gray-900' : variant === 'red' ? 'hover:bg-brand-red/80' : variant === 'blue' ? 'hover:bg-brand-blue/80' : 'hover:bg-brand-blue/80';
    const lineColor = variant === 'yellow' ? 'bg-brand-yellow/30' : variant === 'red' ? 'bg-brand-red/30' : variant === 'blue' ? 'bg-brand-blue/30' : 'bg-gray-600/30';
    const sizeClasses = large ? 'w-12 h-12' : 'w-8 h-8';
    const iconSizeClasses = large ? 'text-2xl' : 'text-sm';

    return (
        <div className="relative flex justify-center py-2 group" ref={menuRef}>
            {/* Linha horizontal visível apenas em hover */}
            <div className={`absolute top-1/2 left-0 w-full h-px ${lineColor} opacity-0 group-hover:opacity-100 transition-opacity -z-10`}></div>
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${sizeClasses} rounded-full flex items-center justify-center transition-all shadow-lg font-bold
                    ${isOpen ? `${bgColor} rotate-45` : `bg-gray-800 text-white border border-gray-600 ${hoverColor} opacity-20 group-hover:opacity-100`}
                `}
            >
                <span className={`material-symbols-outlined ${iconSizeClasses}`}>add</span>
            </button>

            {isOpen && (
                <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[90vw] sm:w-max max-w-[320px] sm:max-w-none z-[100] flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-gray-700 shadow-2xl max-h-[60vh] overflow-y-auto">
                    
                    {previewMode === 'arte' ? (
                        <div className="flex flex-col gap-1 sm:gap-2">
                            <span className="text-[10px] sm:text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">Mídia / Arte</span>
                            <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                <MenuBtn icon="notes" label="Texto" onClick={() => handleAdd('text')} />
                                <MenuBtn icon="image" label="Imagem" onClick={() => handleAdd('image')} />
                                <MenuBtn icon="smart_display" label="Vídeo" onClick={() => handleAdd('video')} />
                                <MenuBtn icon="view_in_ar" label="Modelo 3D" onClick={() => handleAdd('3d_object')} />
                                <MenuBtn icon="mic" label="Áudio" onClick={() => handleAdd('audio')} />
                                <MenuBtn icon="picture_as_pdf" label="PDF" onClick={() => handleAdd('pdf')} />
                            </div>
                        </div>
                    ) : (
                        <>
                            {variant !== 'red' && (
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <span className="text-[10px] sm:text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">Mídia / Conteúdo</span>
                                    <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                        <MenuBtn icon="notes" label="Texto" onClick={() => handleAdd('text')} />
                                        {(variant === 'yellow' || variant === 'all') && <MenuBtn icon="image" label="Imagem" onClick={() => handleAdd('image')} />}
                                        {(variant === 'yellow' || variant === 'all') && <MenuBtn icon="smart_display" label="Vídeo" onClick={() => handleAdd('video')} />}
                                        {(variant === 'yellow' || variant === 'all') && <MenuBtn icon="view_in_ar" label="Modelo 3D" onClick={() => handleAdd('3d_object')} />}
                                        
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="mic" label="Áudio" onClick={() => handleAdd('audio')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="link" label="Link / Botão" onClick={() => handleAdd('link')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="language" label="Web Page" onClick={() => handleAdd('web_page')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="picture_as_pdf" label="PDF" onClick={() => handleAdd('pdf')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="folder_zip" label="Drive" onClick={() => handleAdd('drive')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="format_quote" label="Referências" onClick={() => handleAdd('reference')} />}
                                        {(variant === 'blue' || variant === 'all') && <MenuBtn icon="shield_person" label="Anotações" onClick={() => handleAdd('notes')} />}
                                    </div>
                                </div>
                            )}
                            
                            {variant === 'all' && <div className="h-px w-full sm:h-auto sm:w-px bg-gray-700 shrink-0"></div>}

                            {(variant === 'red' || variant === 'all') && (
                                <div className="flex flex-col gap-1 sm:gap-2">
                                    <span className="text-[10px] sm:text-xs font-bold text-brand-red uppercase tracking-wider mb-1">Pedagógico</span>
                                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2">
                                        <MenuBtn icon="psychology" label="Reflexão" onClick={() => handleAdd('reflection')} />
                                        <MenuBtn icon="quiz" label="Quiz" onClick={() => handleAdd('quiz')} />
                                        <MenuBtn icon="history_edu" label="Contexto Histórico" onClick={() => handleAdd('context_history')} />
                                        <MenuBtn icon="groups" label="Contexto Social" onClick={() => handleAdd('context_social')} />
                                        <MenuBtn icon="gavel" label="Contexto Político" onClick={() => handleAdd('context_political')} />
                                        <MenuBtn icon="public" label="Objeto-Mundo" onClick={() => handleAdd('context_object_world')} />
                                        <MenuBtn icon="travel_explore" label="Mundo-Objeto" onClick={() => handleAdd('context_world_object')} />
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function MenuBtn({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-left"
        >
            <span className="material-symbols-outlined text-base sm:text-[20px]">{icon}</span>
            <span className="text-[9px] sm:text-xs font-medium whitespace-nowrap">{label}</span>
        </button>
    );
}
