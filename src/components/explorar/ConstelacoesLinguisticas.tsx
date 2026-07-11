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
import { motion } from 'framer-motion';
import { ConstelacoesGraphView } from './ConstelacoesGraphView';

interface ConstelacoesProps {
    glossario: any[];
}

export function ConstelacoesLinguisticas({ glossario }: ConstelacoesProps) {
    const [viewMode, setViewMode] = useState<'palavras' | 'constelacoes'>('palavras');

    const cardThemes = [
        {
            borderHover: 'hover:border-brand-yellow/30',
            gradientStart: 'from-brand-yellow',
            gradientEnd: 'to-[#FFAA00]',
            shadow: 'shadow-[0_0_30px_rgba(255,204,0,0.2)]',
            textGradient: 'from-brand-yellow to-white'
        },
        {
            borderHover: 'hover:border-brand-blue/30',
            gradientStart: 'from-brand-blue',
            gradientEnd: 'to-[#1E60A4]',
            shadow: 'shadow-[0_0_30px_rgba(15,71,128,0.2)]',
            textGradient: 'from-brand-blue to-white'
        },
        {
            borderHover: 'hover:border-brand-red/30',
            gradientStart: 'from-brand-red',
            gradientEnd: 'to-[#FF6B6B]',
            shadow: 'shadow-[0_0_30px_rgba(241,67,67,0.2)]',
            textGradient: 'from-brand-red to-white'
        }
    ];

    if (!glossario || glossario.length === 0) return null;

    // Apenas mostrar as aprovadas
    const approvedWords = glossario.filter(w => !w.is_pending && !w.is_rejected);

    return (
        <div className="w-full relative py-12">
            <div className="absolute inset-0 bg-brand-yellow/5 rounded-[40px] blur-3xl pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 relative z-10 gap-6">
                <div>
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-widest flex items-center gap-3">
                        <span className="material-symbols-outlined text-brand-yellow text-4xl">menu_book</span>
                        Glossário Hub
                    </h3>
                    <p className="text-gray-400 mt-2 max-w-xl text-sm">
                        Explore nosso dicionário vivo e descubra as traduções que conectam o saber acadêmico com a linguagem das ruas, da internet e da arte.
                    </p>
                </div>
                
                {/* Switcher */}
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 backdrop-blur">
                    <button 
                        onClick={() => setViewMode('palavras')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'palavras' ? 'bg-brand-yellow text-black shadow-[0_0_15px_rgba(255,204,0,0.3)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Modo Palavras
                    </button>
                    <button 
                        onClick={() => setViewMode('constelacoes')}
                        className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'constelacoes' ? 'bg-brand-blue text-white shadow-[0_0_15px_rgba(15,71,128,0.5)]' : 'text-gray-400 hover:text-white'}`}
                    >
                        Modo Constelações
                    </button>
                </div>
            </div>

            {viewMode === 'palavras' ? (
                /* MODO PALAVRAS: Carrossel Horizontal Infinito */
                <div className="w-full overflow-x-auto no-scrollbar snap-x snap-mandatory py-4">
                    <div className="flex gap-8 w-max px-4">
                        {approvedWords.map((palavra, i) => {
                            const theme = cardThemes[i % cardThemes.length];
                            return (
                            <motion.div 
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                key={palavra.id} 
                                className={`relative bg-[#1E1E1E] rounded-3xl border border-white/10 p-8 shadow-2xl flex flex-col items-center text-center w-[350px] md:w-[450px] shrink-0 snap-center ${theme.borderHover} transition-colors group`}
                            >
                                <div className={`z-10 bg-gradient-to-br ${theme.gradientStart} ${theme.gradientEnd} p-[2px] rounded-2xl ${theme.shadow} mb-8 transform group-hover:scale-105 transition-transform`}>
                                    <div className="bg-[#121212] px-8 py-4 rounded-[14px]">
                                        <h3 className={`text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r ${theme.textGradient}`}>
                                            {palavra.termo}
                                        </h3>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">Núcleo Acadêmico</p>
                                    </div>
                                </div>

                                <div className="w-full text-left bg-black/30 p-5 rounded-xl border border-white/5 mb-6">
                                    <p className="text-sm text-gray-300 leading-relaxed">
                                        {palavra.codificacao_academica}
                                    </p>
                                </div>

                                {palavra.signos_constelacoes && palavra.signos_constelacoes.filter((c: any) => !c.is_rejected && !c.is_pending).length > 0 && (
                                    <div className="w-full mt-auto pt-6 border-t border-white/5 relative text-left">
                                        <h4 className="text-[11px] font-bold text-brand-blue uppercase tracking-widest mb-4">Traduções</h4>
                                        <div className="flex flex-col gap-3">
                                            {palavra.signos_constelacoes.filter((c: any) => !c.is_rejected && !c.is_pending).map((constelacao: any) => (
                                                <div key={constelacao.id} className="bg-[#121212] p-4 rounded-xl border border-white/5">
                                                    <span className="inline-block px-2 py-0.5 bg-brand-blue/20 text-brand-blue text-[10px] font-black uppercase rounded mb-2">
                                                        {constelacao.constelacao}
                                                    </span>
                                                    <p className="text-sm text-gray-400 leading-relaxed italic">
                                                        "{constelacao.descodificacao}"
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )})}
                    </div>
                </div>
            ) : (
                /* MODO CONSTELAÇÕES: Graph View interativo com xyflow */
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ConstelacoesGraphView glossario={approvedWords} />
                </motion.div>
            )}
        </div>
    );
}
