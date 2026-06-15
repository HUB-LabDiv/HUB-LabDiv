import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function PdfBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-red-500/30 bg-red-500/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-red-400">picture_as_pdf</span>
            <span className="text-sm font-bold text-red-400">Visualizador PDF</span>
            <p className="text-xs mt-1 text-gray-500">Faça o upload de um documento PDF para visualização in-line.</p>
        </div>
    );
}
