import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function VideoBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-purple-500/30 bg-purple-500/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-purple-400">smart_display</span>
            <span className="text-sm font-bold text-purple-400">Vídeo</span>
            <p className="text-xs mt-1 text-gray-500">Insira um link do YouTube ou envie um arquivo de vídeo.</p>
        </div>
    );
}
