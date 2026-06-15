import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { CloudinaryUploader } from './CloudinaryUploader';

export default function PdfBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const pdfUrl = block.content.url || '';

    return (
        <div className="flex flex-col gap-4">
            {!pdfUrl ? (
                <div className="w-full min-h-[12rem] border-2 border-dashed border-red-500/30 rounded-xl flex flex-col items-center justify-center text-red-400/70 transition-colors bg-red-900/10 p-6">
                    <span className="material-symbols-outlined text-4xl mb-2">picture_as_pdf</span>
                    <span className="text-sm font-medium mb-4">Adicione um PDF</span>
                    
                    <CloudinaryUploader 
                        accept=".pdf,application/pdf"
                        label="Upload de PDF"
                        icon="upload_file"
                        onUploadSuccess={(url) => updateBlock(block.id, { url })}
                    />
                    
                    <div className="flex items-center gap-4 w-3/4 mt-4 opacity-50">
                        <div className="flex-1 h-px bg-red-500/50"></div>
                        <span className="text-xs uppercase tracking-widest font-bold">OU</span>
                        <div className="flex-1 h-px bg-red-500/50"></div>
                    </div>

                    <input 
                        type="url" 
                        placeholder="Cole o link do PDF, ou link de pasta do Drive (se arquivo > 10MB)..."
                        className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none focus:border-red-500 text-white text-sm w-3/4 text-center transition-colors hover:border-red-500/50"
                        value={pdfUrl}
                        onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden bg-gray-900 border border-gray-800 h-[500px]">
                    {pdfUrl.includes('drive.google') ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800/30">
                            <span className="material-symbols-outlined text-4xl mb-2 text-red-500">folder_zip</span>
                            <span className="text-sm font-bold uppercase tracking-widest text-red-500 mb-2">Pasta do Google Drive</span>
                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-red-500 underline-offset-4">Acessar Materiais (Upload &gt; 10MB)</a>
                        </div>
                    ) : (
                        <iframe 
                            src={`${pdfUrl}#toolbar=0`} 
                            className="w-full h-full"
                            title="PDF Viewer"
                        />
                    )}
                    
                    {isActive && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => updateBlock(block.id, { url: '' })}
                                className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium shadow-lg hover:bg-red-600 transition-colors"
                            >
                                Remover PDF
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
