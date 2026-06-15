import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';

interface WebPageBlockProps {
    block: Block;
    isActive: boolean;
}

export default function WebPageBlock({ block, isActive }: WebPageBlockProps) {
    const { updateBlock } = useSubmissionStore();
    const url = block.content.url || '';
    const height = block.content.height || 400;

    // Convert Drive link to preview link if needed
    const getEmbedUrl = (rawUrl: string) => {
        if (!rawUrl) return '';
        if (rawUrl.includes('drive.google.com/file/d/')) {
            const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/file/d/${match[1]}/preview`;
            }
        }
        return rawUrl;
    };

    const embedUrl = getEmbedUrl(url);

    return (
        <div className="flex flex-col gap-4 w-full">
            {isActive && (
                <div className="flex flex-col gap-4 p-4 bg-gray-900/40 rounded-xl border border-gray-800">
                    <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL da Página ou Link do Drive</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => updateBlock(block.id, { url: e.target.value, height })}
                            placeholder="https://..."
                            className="w-full bg-black/40 border border-gray-700/50 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500/50 text-white placeholder-gray-600 transition-colors"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Altura do iFrame</label>
                            <span className="text-[10px] font-bold text-teal-500">{height}px</span>
                        </div>
                        <input
                            type="range"
                            min="200"
                            max="600"
                            step="50"
                            value={height}
                            onChange={(e) => updateBlock(block.id, { url, height: parseInt(e.target.value) })}
                            className="w-full accent-teal-500"
                        />
                    </div>
                </div>
            )}

            {embedUrl ? (
                <div className="w-full rounded-xl overflow-hidden border border-gray-800/50 bg-black/20 transition-all duration-300 max-h-[75vh]" style={{ height: `${height}px` }}>
                    <iframe 
                        src={embedUrl} 
                        className="w-full h-full border-0"
                        title="Embedded Web Page"
                        allowFullScreen
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-teal-500/30 bg-teal-500/5 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-3xl mb-1 text-teal-400">language</span>
                    <span className="text-sm font-bold text-teal-400">Web Page Vazia</span>
                    <p className="text-xs mt-1 text-gray-500">Insira a URL para incorporar.</p>
                </div>
            )}
        </div>
    );
}
