import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';

export default function AudioBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const audioUrl = block.content.url || '';

    return (
        <div className="flex flex-col gap-4">
            {!audioUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-brand-yellow/30 rounded-xl flex flex-col items-center justify-center text-gray-300 transition-colors bg-brand-yellow/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">mic</span>
                    <span className="text-sm font-medium mb-4">Adicione um Áudio</span>
                    
                    <CloudinaryUploader 
                        accept="audio/*"
                        label="Upload de Áudio"
                        icon="upload_file"
                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                    />
                    
                    <div className="flex items-center gap-4 w-3/4 mt-4 opacity-50">
                        <div className="flex-1 h-px bg-brand-yellow/50"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">OU</span>
                        <div className="flex-1 h-px bg-brand-yellow/50"></div>
                    </div>

                    <input 
                        type="url" 
                        placeholder="Cole o link direto do Áudio, ou link de pasta do Drive (se arquivo > 10MB)..."
                        className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-brand-yellow text-white text-sm w-3/4 text-center transition-colors hover:border-brand-yellow/50"
                        value={audioUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 p-6 flex flex-col items-center">
                    {audioUrl.includes('drive.google') ? (
                        <div className="w-full h-32 flex flex-col items-center justify-center text-gray-400 bg-gray-800/30 rounded-lg">
                            <span className="material-symbols-outlined text-4xl mb-2 text-gray-200">folder_zip</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-gray-200 mb-2">Pasta do Google Drive</span>
                            <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-brand-yellow underline-offset-4">Acessar Materiais (Upload &gt; 10MB)</a>
                        </div>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-4xl text-gray-200 mb-4">graphic_eq</span>
                            <audio 
                                src={audioUrl} 
                                controls 
                                className="w-full max-w-md"
                            />
                        </>
                    )}
                    
                    {isActive && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => updateBlock(block.id, { url: '' })}
                                className="px-3 py-1 bg-brand-red text-white text-xs rounded-lg font-medium shadow-lg hover:bg-brand-red transition-colors"
                            >
                                Remover
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
