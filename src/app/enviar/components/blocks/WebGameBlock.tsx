import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function WebGameBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-green-500/30 bg-green-500/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-green-400">sports_esports</span>
            <span className="text-sm font-bold text-green-400">Jogo Web</span>
            <p className="text-xs mt-1 text-gray-500">Incorpore um jogo web ou simulação interativa via link.</p>
        </div>
    );
}
