import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function AudioBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-24 text-gray-500 border-2 border-dashed border-gray-700/50 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-brand-blue">mic</span>
            <span className="text-sm">Bloco de Áudio - (Em breve)</span>
        </div>
    );
}
