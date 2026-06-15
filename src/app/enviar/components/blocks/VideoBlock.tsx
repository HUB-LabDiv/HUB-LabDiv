import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';

export default function VideoBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const videoUrl = block.content.url || '';

    return (
        <div className="flex flex-col gap-4">
            {!videoUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-purple-500/30 rounded-xl flex flex-col items-center justify-center text-purple-400/70 transition-colors bg-purple-900/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">smart_display</span>
                    <span className="text-sm font-medium mb-4">Adicione um Vídeo</span>
                    
                    <CloudinaryUploader 
                        accept="video/*"
                        label="Upload de Vídeo"
                        icon="upload_file"
                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                    />
                    
                    <div className="flex items-center gap-4 w-3/4 mt-4 opacity-50">
                        <div className="flex-1 h-px bg-purple-500/50"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">OU</span>
                        <div className="flex-1 h-px bg-purple-500/50"></div>
                    </div>

                    <input 
                        type="url" 
                        placeholder="Cole um link de Vídeo, ou link de pasta do Drive (se arquivo > 10MB)..."
                        className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-purple-500 text-white text-sm w-3/4 text-center transition-colors hover:border-purple-500/50"
                        value={videoUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-black border border-gray-800">
                    {videoUrl.includes('drive.google') ? (
                        <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400 bg-gray-800/30">
                            <span className="material-symbols-outlined text-4xl mb-2 text-purple-500">folder_zip</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-purple-500 mb-2">Pasta do Google Drive</span>
                            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-purple-500 underline-offset-4">Acessar Materiais (Upload &gt; 10MB)</a>
                        </div>
                    ) : videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                        <iframe 
                            className="w-full aspect-video"
                            src={videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                            allowFullScreen
                        />
                    ) : (
                        <video src={videoUrl} controls className="w-full max-h-[500px]" />
                    )}
                    
                    {isActive && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => updateBlock(block.id, { url: '' })}
                                className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Substituir Vídeo
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
