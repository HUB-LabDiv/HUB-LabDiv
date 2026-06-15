import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function Model3DBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-48 text-gray-500 border-2 border-dashed border-brand-yellow/30 bg-brand-yellow/5 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-2 text-brand-yellow">view_in_ar</span>
            <span className="text-sm font-bold text-brand-yellow">Visualizador 3D</span>
            <p className="text-xs mt-2 max-w-xs text-center text-gray-400">Cole a URL de um modelo Sketchfab ou faça upload de um arquivo .GLB</p>
        </div>
    );
}
