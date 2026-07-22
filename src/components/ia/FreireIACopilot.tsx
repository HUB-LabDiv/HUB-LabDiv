'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */


import React, { useState } from 'react';
import { Sparkles, BrainCircuit, X, BookOpen, PenTool } from 'lucide-react';

export function FreireIACopilot() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            {/* O botão do Copiloto */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600/10 to-brand-blue/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-widest hover:bg-purple-600/20 transition-all hover:scale-105"
            >
                <Sparkles className="w-4 h-4" />
                Freire.IA
            </button>

            {/* O painel popover (Mock) */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-3 w-[340px] bg-white dark:bg-[#1E1E1E] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 origin-top-right">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="relative z-10 flex justify-between items-start">
                            <div className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                                    <BrainCircuit className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bukra font-bold text-white text-sm">Freire.IA</h3>
                                    <span className="text-[9px] uppercase tracking-widest text-purple-200 font-bold block mt-0.5">Pedagogia Gemini (IAMAI)</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                Indexação Curatorial
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-open-sans">
                                Estou absorvendo o acervo bibliográfico focado em Divulgação Científica (Curadoria do Andy). Em breve, conseguirei te dar dicas baseadas nas teorias de Paulo Freire para deixar seu texto mais didático e acessível.
                            </p>
                        </div>

                        <button 
                            disabled 
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-background-dark/40 text-gray-400 dark:text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest cursor-not-allowed border border-dashed border-gray-300 dark:border-gray-700"
                        >
                            <PenTool className="w-4 h-4" />
                            Analisar a Didática
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
