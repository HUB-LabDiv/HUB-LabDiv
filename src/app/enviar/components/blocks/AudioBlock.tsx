/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';
import { usePendingUploadsStore } from '@/store/usePendingUploadsStore';
import { BlockAccessibilityFields } from './BlockAccessibilityFields';

export default function AudioBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const pendingFiles = usePendingUploadsStore((state) => state.pendingFiles);
    const audioUrl = block.content.url || '';
    const caption = block.content.caption || '';
    const altText = block.content.altText || '';

    const isOrphaned = audioUrl.startsWith('blob:') && !pendingFiles[audioUrl];

    return (
        <div className="flex flex-col gap-4">
            {!audioUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-brand-yellow/30 rounded-xl flex flex-col items-center justify-center text-gray-300 transition-colors bg-brand-yellow/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2 text-brand-yellow">mic</span>
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
                        className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-brand-yellow text-white text-sm w-3/4 text-center transition-colors hover:border-brand-yellow/50 font-sans"
                        value={audioUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {/* Alerta de Áudio Expirado */}
                    {isOrphaned && (
                        <div className="p-3 bg-brand-red/15 border border-brand-red/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
                            <div className="flex items-center gap-2.5">
                                <span className="material-symbols-outlined text-brand-red text-2xl shrink-0">error</span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-black text-brand-red uppercase tracking-wider">Áudio Expirado / Erro de Envio</span>
                                    <span className="text-[11px] text-gray-200">O arquivo de áudio local expirou da sessão. Reenvie o arquivo para publicar.</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <div className="scale-90 origin-right">
                                    <CloudinaryUploader 
                                        accept="audio/*"
                                        label="Reenviar Áudio"
                                        icon="sync"
                                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                                    />
                                </div>
                                <button
                                    onClick={() => updateBlock(block.id, { url: '' })}
                                    className="px-2.5 py-1.5 bg-brand-red/20 hover:bg-brand-red text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                    title="Remover Áudio"
                                >
                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className={`relative group rounded-xl overflow-hidden bg-gray-900 border ${isOrphaned ? 'border-brand-red ring-2 ring-brand-red/30' : 'border-gray-800'} p-6 flex flex-col items-center`}>
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

                    {caption && !isActive && (
                        <p className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                            {caption}
                        </p>
                    )}
                </div>
            )}

            {/* Painel Padronizado de Acessibilidade e Transcrição/Legenda para Áudio */}
            <BlockAccessibilityFields
                caption={caption}
                altText={altText}
                onCaptionChange={(val) => updateBlock(block.id, { caption: val })}
                onAltTextChange={(val) => updateBlock(block.id, { altText: val })}
                captionLabel="Legenda / Identificação do Áudio"
                captionPlaceholder="Ex: Gravação de depoimento do pesquisador sobre a descoberta..."
                altTextLabel="Transcrição / Descrição de Acessibilidade (Leitores de Tela)"
                altTextPlaceholder="Forneça um resumo transcrito ou descrição do conteúdo sonoro para pessoas com deficiência auditiva..."
                isActive={isActive}
            />
        </div>
    );
}
