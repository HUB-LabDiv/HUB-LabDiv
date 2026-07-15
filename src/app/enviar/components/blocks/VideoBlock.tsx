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
import { CloudinaryUploader } from './CloudinaryUploader';
import { usePendingUploadsStore } from '@/store/usePendingUploadsStore';

export default function VideoBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const videoUrl = block.content.url || '';

    // Verifica se é GIF ou YouTube
    const pendingFile = usePendingUploadsStore((state) => state.pendingFiles[videoUrl]);
    const isGif = videoUrl.toLowerCase().endsWith('.gif') || 
                  (pendingFile && pendingFile.file.type === 'image/gif') || 
                  videoUrl.startsWith('data:image/gif');

    const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');

    return (
        <div className="flex flex-col gap-4">
            {!videoUrl ? (
                <div className="w-full min-h-[14rem] border-2 border-dashed border-brand-red/30 rounded-xl flex flex-col items-center justify-center text-gray-300 transition-colors bg-brand-red/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2 text-brand-red">smart_display</span>
                    <span className="text-sm font-medium mb-4">Adicione um Vídeo (YouTube) ou GIF Animado</span>
                    
                    <CloudinaryUploader 
                        accept="image/gif"
                        label="Upload de GIF"
                        icon="gif"
                        resourceType="image"
                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                    />
                    
                    <div className="flex items-center gap-4 w-3/4 mt-4 opacity-50">
                        <div className="flex-1 h-px bg-brand-red/50"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">OU</span>
                        <div className="flex-1 h-px bg-brand-red/50"></div>
                    </div>

                    <input 
                        type="url" 
                        placeholder="Cole o link do vídeo do YouTube (ex: https://www.youtube.com/watch?v=...) "
                        className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-brand-red text-white text-sm w-3/4 text-center transition-colors hover:border-brand-red/50"
                        value={videoUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-black border border-gray-800">
                    {isGif ? (
                        <div className="w-full flex justify-center bg-gray-950 p-2">
                            <img 
                                src={videoUrl} 
                                alt="GIF Animado" 
                                className="w-full max-h-[500px] object-contain rounded-lg animate-fade-in" 
                            />
                        </div>
                    ) : isYouTube ? (
                        <iframe 
                            className="w-full aspect-video"
                            src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                            allowFullScreen
                        />
                    ) : (
                        <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400 bg-gray-800/30 p-6 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2 text-brand-red">warning</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-brand-red mb-2">Formato Inválido</span>
                            <span className="text-xs text-gray-400">Por favor, cole um link do YouTube ou envie um arquivo GIF.</span>
                        </div>
                    )}
                    
                    {isActive && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => updateBlock(block.id, { url: '' })}
                                className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium shadow-lg hover:bg-brand-red transition-colors"
                            >
                                Substituir Conteúdo
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
