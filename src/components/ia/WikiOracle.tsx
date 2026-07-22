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
import { Search, Sparkles, Database, Code2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function WikiOracle() {
    const [query, setQuery] = useState('');

    return (
        <div className="w-full bg-gradient-to-r from-brand-blue/5 via-transparent to-brand-yellow/5 border-2 border-brand-blue/10 rounded-3xl p-6 sm:p-8 relative overflow-hidden mb-8 group">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-yellow/20 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-blue/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-brand-blue/20 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                
                {/* Ícone 3D Mock */}
                <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-blue-800 p-[2px] shadow-lg relative">
                    <div className="w-full h-full bg-white dark:bg-background-dark/80 rounded-2xl flex items-center justify-center overflow-hidden relative">
                        <Sparkles className="w-8 h-8 text-brand-yellow animate-pulse relative z-10" />
                        <div className="absolute inset-0 bg-brand-blue/10 backdrop-blur-sm"></div>
                    </div>
                </div>

                <div className="flex-1 w-full space-y-4">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white font-bukra">Oráculo do IF (IA)</h2>
                            <span className="px-2 py-0.5 rounded-md bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[9px] font-bold uppercase tracking-widest border border-purple-600/20 flex items-center gap-1">
                                <Code2 className="w-3 h-3" />
                                IAMAI Powered
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Pergunte qualquer coisa sobre as regras, história, ou laboratórios do Instituto de Física.
                        </p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pesquisar usando linguagem natural... (Ex: 'Quais são as áreas de pesquisa do IFusp?')"
                            className="w-full bg-white dark:bg-background-dark border-2 border-brand-blue/20 focus:border-brand-blue rounded-xl pl-12 pr-4 py-4 text-sm outline-none transition-all dark:text-white shadow-sm"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-blue text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand-blue transition-colors">
                            Buscar
                        </button>

                        <div className="absolute top-full left-0 mt-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-yellow">
                            <Database className="w-4 h-4 animate-spin-slow" />
                            Status: Indexando os documentos da Wiki...
                        </div>
                    </div>
                </div>
            </div>
            
            {/* O overlay disabled para indicar que está em dev */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-white/5 dark:bg-background-dark/5 backdrop-blur-[1px] flex items-center justify-center">
                {/* You can add a subtle diagonal stripe pattern here in future config if needed */}
            </div>
        </div>
    );
}
