import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

export default function DriveBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const driveUrl = block.content.url || '';

    return (
        <div className="flex flex-col gap-4">
            {!driveUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-brand-yellow/30 rounded-xl flex flex-col items-center justify-center text-gray-300 transition-colors bg-brand-yellow/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">folder_zip</span>
                    <span className="text-sm font-medium mb-2">Pasta do Google Drive</span>
                    <p className="text-xs text-center text-gray-300 mb-6 max-w-sm">
                        Deixe o link de uma pasta do Drive contendo roteiros, background ou arquivos que excedam 10MB.
                    </p>
                    
                    <input 
                        type="url" 
                        placeholder="Cole o link da pasta do Google Drive..."
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-brand-yellow text-white text-sm w-3/4 text-center transition-colors hover:border-brand-yellow/50"
                        value={driveUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-brand-yellow/30">
                    <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400 bg-brand-yellow/10">
                        <span className="material-symbols-outlined text-4xl mb-2 text-gray-200">folder_zip</span>
                        <span className="text-sm font-bold uppercase tracking-widest text-gray-200 mb-2">Pasta do Google Drive</span>
                        <a href={driveUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-brand-yellow underline-offset-4">
                            Acessar Roteiros / Arquivos Originais
                        </a>
                    </div>
                    
                    {isActive && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    updateBlock(block.id, { url: '' });
                                }}
                                className="p-2 bg-gray-900/80 hover:bg-brand-red text-white rounded-lg transition-colors backdrop-blur-sm shadow-xl"
                                title="Remover Link"
                            >
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
