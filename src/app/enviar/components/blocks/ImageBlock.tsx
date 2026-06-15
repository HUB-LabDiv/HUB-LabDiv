import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';

interface ImageBlockProps {
    block: Block;
    isActive: boolean;
}

export default function ImageBlock({ block, isActive }: ImageBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const imageUrl = block.content.url || '';
    const altText = block.content.altText || '';

    return (
        <div className="flex flex-col gap-4">
            {!imageUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-gray-700/50 rounded-xl flex flex-col items-center justify-center text-gray-500 transition-colors bg-gray-900/50 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">add_photo_alternate</span>
                    <span className="text-sm font-medium mb-4">Adicione uma Imagem</span>
                    
                    <CloudinaryUploader 
                        accept="image/*"
                        label="Upload de Imagem"
                        icon="add_photo_alternate"
                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                    />
                    
                    <div className="flex items-center gap-4 w-3/4 mt-4 opacity-50">
                        <div className="flex-1 h-px bg-gray-600"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">OU</span>
                        <div className="flex-1 h-px bg-gray-600"></div>
                    </div>

                    <input 
                        type="url" 
                        placeholder="Cole a URL de uma imagem da internet..."
                        className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-brand-yellow text-white text-sm w-3/4 text-center transition-colors hover:border-brand-blue/50"
                        value={imageUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-gray-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt={altText} className="w-full h-auto max-h-[400px] object-contain" />
                    
                    {isActive && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => updateBlock(block.id, { url: '' })}
                                className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Substituir Imagem
                            </button>
                        </div>
                    )}
                </div>
            )}

            {(isActive || altText) && (
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Texto Alternativo (Acessibilidade)</label>
                    <input
                        type="text"
                        value={altText}
                        onChange={(e) => updateBlock(block.id, { altText: e.target.value })}
                        placeholder="Descreva a imagem para leitores de tela..."
                        className="w-full bg-transparent border-b border-gray-700 focus:border-brand-yellow text-gray-300 outline-none py-1 text-sm transition-colors"
                        disabled={!isActive}
                    />
                </div>
            )}
        </div>
    );
}
