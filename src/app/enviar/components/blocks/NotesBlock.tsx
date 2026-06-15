import React from 'react';
import { Block } from '@/app/enviar/schema';

export default function NotesBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-yellow-500/30 bg-yellow-500/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-yellow-400">edit_note</span>
            <span className="text-sm font-bold text-yellow-400">Anotações</span>
            <p className="text-xs mt-1 text-gray-500">Campo livre para anotações soltas e rascunhos visíveis ao autor.</p>
        </div>
    );
}
