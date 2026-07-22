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
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';
import Image from 'next/image';

interface CarouselBlockProps {
    block: Block;
    isActive: boolean;
}

export default function CarouselBlock({ block, isActive }: CarouselBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const urls: string[] = block.content.urls || [];
    const altText = block.content.altText || '';
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleUploadSuccess = (url: string) => {
        const newUrls = [...urls, url];
        updateBlock(block.id, { urls: newUrls });
        setCurrentIndex(newUrls.length - 1);
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const newUrls = urls.filter((_, i) => i !== indexToRemove);
        if (currentIndex >= newUrls.length && newUrls.length > 0) {
            setCurrentIndex(newUrls.length - 1);
        } else if (newUrls.length === 0) {
            setCurrentIndex(0);
        }
        updateBlock(block.id, { urls: newUrls });
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : urls.length - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev < urls.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="flex flex-col gap-4">
            {urls.length === 0 ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-gray-700/50 rounded-xl flex flex-col items-center justify-center text-gray-500 transition-colors bg-gray-900/50 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">view_carousel</span>
                    <span className="text-sm font-medium mb-4">Carrossel de Imagens</span>
                    
                    <CloudinaryUploader 
                        accept="image/*"
                        label="Adicionar 1ª Imagem"
                        icon="add_photo_alternate"
                        onUploadSuccess={handleUploadSuccess}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {/* Visualização do Carrossel */}
                    <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
                        <div className="relative w-full h-[400px] min-h-[200px] bg-gray-900/50 flex items-center justify-center">
                            {urls[currentIndex] ? (
                                <Image 
                                    src={urls[currentIndex]} 
                                    alt={`${altText || 'Carrossel Imagem'} - ${currentIndex + 1}`} 
                                    fill 
                                    className="object-contain"
                                />
                            ) : null}
                        </div>
                        
                        {/* Navegação */}
                        {urls.length > 1 && (
                            <>
                                <button 
                                    onClick={handlePrev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-dark/50 hover:bg-background-dark/80 flex items-center justify-center text-white transition-colors z-10"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button 
                                    onClick={handleNext}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background-dark/50 hover:bg-background-dark/80 flex items-center justify-center text-white transition-colors z-10"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </>
                        )}
                        
                        {/* Indicadores */}
                        {urls.length > 1 && (
                            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-10">
                                {urls.map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-brand-yellow' : 'bg-white/30'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Área de Edição (Adicionar/Remover) */}
                    {isActive && (
                        <div className="flex flex-col gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Gerenciar Imagens ({urls.length})
                                </h4>
                            </div>
                            
                            {/* Lista de Miniaturas */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 items-center">
                                {urls.map((url, i) => (
                                    <div 
                                        key={i} 
                                        className={`relative w-24 h-24 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${i === currentIndex ? 'border-brand-yellow shadow-lg shadow-brand-yellow/20' : 'border-gray-700 opacity-70 hover:opacity-100'}`} 
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                                    >
                                        <Image src={url} alt={`Thumbnail ${i}`} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-background-dark/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(i); }}
                                                className="w-8 h-8 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-brand-red transition-colors shadow-lg"
                                                title="Remover Imagem"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {/* Botão para Adicionar Mais */}
                                <div className="w-24 h-24 shrink-0 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center bg-gray-800/50 hover:bg-gray-800 hover:border-brand-blue/50 transition-colors">
                                    <div className="scale-75 origin-center">
                                        <CloudinaryUploader 
                                            accept="image/*"
                                            label="+"
                                            icon="add"
                                            onUploadSuccess={handleUploadSuccess}
                                        />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Mais Fotos</span>
                                </div>
                            </div>
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
                        placeholder="Descreva as imagens para leitores de tela..."
                        className="w-full bg-transparent border-b border-gray-700 focus:border-brand-yellow text-gray-300 outline-none py-1 text-sm transition-colors"
                        disabled={!isActive}
                    />
                </div>
            )}
        </div>
    );
}
