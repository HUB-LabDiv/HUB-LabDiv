import React, { useState } from 'react';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { BlockType } from '@/app/enviar/schema';

interface InlineAddMenuProps {
    insertAfterId?: string;
}

export function InlineAddMenu({ insertAfterId }: InlineAddMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { addBlock, previewMode } = useSubmissionStore();

    if (previewMode !== 'edit') return null;

    const handleAdd = (type: BlockType) => {
        addBlock(type, {}, insertAfterId);
        setIsOpen(false);
    };

    return (
        <div className="relative flex justify-center py-2 group">
            {/* Linha horizontal visível apenas em hover */}
            <div className="absolute top-1/2 left-0 w-full h-px bg-brand-blue/30 opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg text-white font-bold
                    ${isOpen ? 'bg-brand-blue rotate-45' : 'bg-gray-800 border border-gray-600 hover:bg-brand-blue/80 opacity-20 group-hover:opacity-100'}
                `}
            >
                <span className="material-symbols-outlined text-sm">add</span>
            </button>

            {isOpen && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-max z-50 flex gap-4 p-4 rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-gray-700 shadow-2xl">
                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">Mídia</span>
                        <div className="grid grid-cols-2 gap-2">
                            <MenuBtn icon="notes" label="Texto" onClick={() => handleAdd('text')} />
                            <MenuBtn icon="image" label="Imagem" onClick={() => handleAdd('image')} />
                            <MenuBtn icon="smart_display" label="Vídeo" onClick={() => handleAdd('video')} />
                            <MenuBtn icon="mic" label="Áudio" onClick={() => handleAdd('audio')} />
                            <MenuBtn icon="view_in_ar" label="Modelo 3D" onClick={() => handleAdd('3d_object')} />
                            <MenuBtn icon="language" label="Web Page" onClick={() => handleAdd('web_page')} />
                            <MenuBtn icon="picture_as_pdf" label="PDF" onClick={() => handleAdd('pdf')} />
                            <MenuBtn icon="folder_zip" label="Drive" onClick={() => handleAdd('drive')} />
                            <MenuBtn icon="format_quote" label="Referências" onClick={() => handleAdd('reference')} />
                            <MenuBtn icon="shield_person" label="Comentários" onClick={() => handleAdd('notes')} />
                        </div>
                    </div>
                    
                    <div className="w-px bg-gray-700"></div>

                    <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider mb-1">Pedagógico</span>
                        <div className="grid grid-cols-1 gap-2">
                            <MenuBtn icon="psychology" label="Reflexão" onClick={() => handleAdd('reflection')} />
                            <MenuBtn icon="quiz" label="Quiz" onClick={() => handleAdd('quiz')} />
                            <MenuBtn icon="history_edu" label="Contexto Histórico" onClick={() => handleAdd('context_history')} />
                            <MenuBtn icon="groups" label="Contexto Social" onClick={() => handleAdd('context_social')} />
                            <MenuBtn icon="gavel" label="Contexto Político" onClick={() => handleAdd('context_political')} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function MenuBtn({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-left"
        >
            <span className="material-symbols-outlined text-lg">{icon}</span>
            <span className="text-xs font-medium whitespace-nowrap">{label}</span>
        </button>
    );
}
