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

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Laptop,
    Search,
    Plus,
    Sparkles,
    ShieldCheck,
    Filter,
    Layers,
    Code2,
    BookOpen,
    X,
    Heart,
    Flame
} from 'lucide-react';
import { AcademicSoftware } from '@/types/softwares';
import { SoftwareCard } from './SoftwareCard';
import { SubmitSoftwareModal } from './SubmitSoftwareModal';
import { SOFTWARE_CATEGORIES } from '@/constants/softwares';

interface SoftwaresClientViewProps {
    initialSoftwares: AcademicSoftware[];
    currentUserId?: string;
    currentUserName?: string;
}

export function SoftwaresClientView({
    initialSoftwares,
    currentUserId,
    currentUserName
}: SoftwaresClientViewProps) {
    const [softwares, setSoftwares] = useState<AcademicSoftware[]>(initialSoftwares);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'comunitario' | 'essencial'>('all');
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // Filter & Search Logic
    const filteredSoftwares = useMemo(() => {
        return softwares.filter((item) => {
            // Category filter
            if (selectedCategory === 'Feitos por Alunos/USP') {
                if (item.software_type !== 'comunitario') return false;
            } else if (selectedCategory !== 'Todos') {
                if (item.category !== selectedCategory) return false;
            }

            // Type filter
            if (filterType === 'comunitario' && item.software_type !== 'comunitario') return false;
            if (filterType === 'essencial' && item.software_type !== 'essencial') return false;

            // Text search
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchTitle = item.title.toLowerCase().includes(q);
                const matchTagline = item.tagline.toLowerCase().includes(q);
                const matchAuthor = item.author_name.toLowerCase().includes(q);
                const matchDesc = item.description.toLowerCase().includes(q);
                const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
                if (!matchTitle && !matchTagline && !matchAuthor && !matchDesc && !matchTags) {
                    return false;
                }
            }

            return true;
        });
    }, [softwares, selectedCategory, filterType, searchQuery]);

    const stats = useMemo(() => {
        const total = softwares.length;
        const comunitarios = softwares.filter(s => s.software_type === 'comunitario').length;
        const essenciais = softwares.filter(s => s.software_type === 'essencial').length;
        return { total, comunitarios, essenciais };
    }, [softwares]);

    return (
        <div className="w-full space-y-6">
            {/* Header Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#0d0d0d] border border-white/10 p-6 sm:p-8 shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow text-xs font-black uppercase tracking-wider mb-3">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Biblioteca LabDiv • Softwares & Códigos Acadêmicos
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-white font-bukra tracking-tight">
                            Softwares da Comunidade & Ferramentas
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-2 leading-relaxed">
                            Descubra softwares didáticos e utilitários criados por alunos e pesquisadores da USP (como o <strong className="text-brand-yellow font-semibold">LumiFI</strong> e o <strong className="text-brand-yellow font-semibold">Aurtistic</strong>) e ferramentas indispensáveis para a graduação em Física e Ciências Exatas.
                        </p>
                    </div>

                    {/* Stats & Submit Action */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                        <button
                            onClick={() => setIsSubmitModalOpen(true)}
                            className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-brand-yellow hover:bg-[#FFE066] text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-yellow/20 hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Enviar Software / Código</span>
                        </button>

                        <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-gray-300">
                            <div>
                                <strong className="text-brand-yellow font-bold">{stats.comunitarios}</strong> da USP
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-600" />
                            <div>
                                <strong className="text-brand-blue font-bold">{stats.essenciais}</strong> Essenciais
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por nome, autor, descrição, raio-x, cálculo..."
                            className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#1E1E1E] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow transition-all"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Type Filter Pills */}
                    <div className="flex p-1 rounded-2xl bg-[#1E1E1E] border border-white/10 shrink-0">
                        <button
                            onClick={() => setFilterType('all')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                filterType === 'all'
                                    ? 'bg-brand-blue text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Todos ({softwares.length})
                        </button>
                        <button
                            onClick={() => setFilterType('comunitario')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                filterType === 'comunitario'
                                    ? 'bg-brand-yellow text-black font-black shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Sparkles className="w-3 h-3" />
                            USP ({stats.comunitarios})
                        </button>
                        <button
                            onClick={() => setFilterType('essencial')}
                            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                filterType === 'essencial'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Essenciais ({stats.essenciais})
                        </button>
                    </div>
                </div>

                {/* Categories Bar */}
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                    {SOFTWARE_CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                                    ${active
                                        ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                                        : 'bg-[#1E1E1E]/80 text-gray-400 hover:text-white hover:bg-[#252525] border border-white/5'
                                    }
                                `}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid of Cards */}
            {filteredSoftwares.length === 0 ? (
                <div className="py-16 px-6 rounded-3xl bg-[#1E1E1E]/50 border border-white/5 text-center flex flex-col items-center justify-center">
                    <Laptop className="w-12 h-12 text-gray-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-300 font-bukra">
                        Nenhum software encontrado
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 max-w-sm font-open-sans">
                        Tente ajustar os termos da busca ou selecione outra categoria. Você também pode enviar um novo software para a comunidade!
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('Todos');
                            setFilterType('all');
                        }}
                        className="mt-4 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
                    >
                        Limpar Filtros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSoftwares.map((software) => (
                        <SoftwareCard
                            key={software.id}
                            software={software}
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}

            {/* Submit Modal */}
            <SubmitSoftwareModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                currentUserName={currentUserName}
                onSuccess={() => {
                    // Refetch or update list
                }}
            />
        </div>
    );
}
