import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function WebPageBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-teal-500/30 bg-teal-500/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-teal-400">language</span>
            <span className="text-sm font-bold text-teal-400">Web Page</span>
            <p className="text-xs mt-1 text-gray-500">Incorpore uma página da web externa.</p>
        </div>
    );
}
