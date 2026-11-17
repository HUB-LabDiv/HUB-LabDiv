'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { EXPERIMENTS_CATALOG, SHOW_ACTS } from '@/app/iniciativas/show-da-fisica/data/experiments';

export default function ExperimentosCatalogPage() {
    const [selectedAct, setSelectedAct] = useState<string>('todos');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filtered = EXPERIMENTS_CATALOG.filter((exp) => {
        const matchesAct = selectedAct === 'todos' || exp.act === selectedAct;
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            exp.title.toLowerCase().includes(search) ||
            exp.subtitle.toLowerCase().includes(search) ||
            exp.concept.toLowerCase().includes(search) ||
            exp.description.toLowerCase().includes(search);
        return matchesAct && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
            {/* Header */}
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-black text-xs font-mono uppercase tracking-widest text-[#01f300] font-bold">
                    <Layers className="w-4 h-4" />
                    <span>Acervo Experimental do Show</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-gray-950 dark:text-white">
                    <span className="neon-text-green">Nossos</span>{' '}
                    <span className="neon-text-blue">Experimentos</span>
                </h1>
                <p className="text-base sm:text-lg font-sans text-gray-700 dark:text-gray-300">
                    Aparatos de alta voltagem, rotação, fluidos e criogenia demonstrados ao vivo no palco do auditório Alessandro Volta.
                </p>
            </div>

            {/* Barra de Filtros e Busca em Estilo Neon */}
            <div className="p-4 sm:p-6 bg-white dark:bg-black neon-border-blue flex flex-col md:flex-row items-center justify-between gap-6 rounded-none">
                {/* Abas dos Atos */}
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                    <button
                        onClick={() => setSelectedAct('todos')}
                        className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                            selectedAct === 'todos'
                                ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe]'
                                : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        Todos ({EXPERIMENTS_CATALOG.length})
                    </button>
                    {SHOW_ACTS.map((act) => {
                        const count = EXPERIMENTS_CATALOG.filter((e) => e.act === act.id).length;
                        return (
                            <button
                                key={act.id}
                                onClick={() => setSelectedAct(act.id)}
                                className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all rounded-none shrink-0 ${
                                    selectedAct === act.id
                                        ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe]'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {act.title} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Campo de Pesquisa */}
                <div className="relative w-full md:w-72 shrink-0">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou conceito..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-white dark:bg-black border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-mono uppercase tracking-wider focus:outline-none focus:border-[#002ffe]"
                    />
                </div>
            </div>

            {/* Grid dos Cards de Experimentos Neon */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filtered.map((exp) => {
                    const themeColor = exp.themeColor || 'blue';
                    const borderClass =
                        themeColor === 'green'
                            ? 'neon-border-green'
                            : themeColor === 'red'
                            ? 'neon-border-red'
                            : 'neon-border-blue';

                    const textClass =
                        themeColor === 'green'
                            ? 'neon-text-green'
                            : themeColor === 'red'
                            ? 'neon-text-red'
                            : 'neon-text-blue';

                    return (
                        <Link
                            key={exp.id}
                            href={`/experimentos/${exp.id}`}
                            className={`bg-white dark:bg-black ${borderClass} flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 rounded-none shadow-lg dark:shadow-none overflow-hidden`}
                        >
                            {/* Imagem do Experimento */}
                            <div className="relative aspect-video w-full overflow-hidden bg-black">
                                <Image
                                    src={exp.image}
                                    alt={exp.title}
                                    fill
                                    className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-black/80 text-white border border-white/30">
                                        {exp.concept}
                                    </span>
                                </div>
                            </div>

                            {/* Conteúdo */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block mb-1">
                                        {exp.subtitle}
                                    </span>
                                    <h3 className={`text-xl font-bold uppercase tracking-wider ${textClass} mb-2`}>
                                        {exp.title}
                                    </h3>
                                    <p className="text-xs font-sans text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                                        {exp.description}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-wider">
                                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-[#01f300]">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Bancada Ativa</span>
                                    </div>

                                    <span className="inline-flex items-center gap-1 text-[#002ffe] dark:text-[#38bdf8] group-hover:translate-x-1 transition-transform">
                                        <span>Explorar</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
