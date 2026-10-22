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
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ShieldAlert, CheckCircle, Unlock, Lock, ExternalLink } from 'lucide-react';
import { DisciplineItem } from '@/types/curriculum';
import { disciplinesData } from '@/data/disciplinesData';

interface PrerequisiteTreeProps {
    discipline: DisciplineItem;
    onSelectDiscipline: (codigo: string) => void;
}

export function PrerequisiteTree({ discipline, onSelectDiscipline }: PrerequisiteTreeProps) {
    const [activeTab, setActiveTab] = useState<'both' | 'requisitos' | 'libera'>('both');

    const preReqs = discipline.preRequisitos || [];
    const unlockedCodes = discipline.liberaDisciplinas || [];

    // Busca detalhes dos pré-requisitos
    const requiredDisciplinesList: { code: string; type: 'forte' | 'fraco'; desc?: string; item?: DisciplineItem }[] = [];
    preReqs.forEach(req => {
        req.disciplinas.forEach(code => {
            requiredDisciplinesList.push({
                code,
                type: req.tipo,
                desc: req.descricao,
                item: disciplinesData[code]
            });
        });
    });

    // Busca detalhes das disciplinas desbloqueadas
    const unlockedDisciplinesList: { code: string; item?: DisciplineItem }[] = unlockedCodes.map(code => ({
        code,
        item: disciplinesData[code]
    }));

    return (
        <div className="w-full space-y-4 font-open-sans">
            {/* Seletor de visualização de fluxo */}
            <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/5 text-xs">
                    <button
                        onClick={() => setActiveTab('both')}
                        className={`px-3 py-1.5 rounded-lg transition-all font-bukra text-[11px] ${
                            activeTab === 'both'
                                ? 'bg-[#0F4780] text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Fluxo Completo
                    </button>
                    <button
                        onClick={() => setActiveTab('requisitos')}
                        className={`px-3 py-1.5 rounded-lg transition-all font-bukra text-[11px] flex items-center gap-1.5 ${
                            activeTab === 'requisitos'
                                ? 'bg-brand-red text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Lock className="w-3.5 h-3.5" />
                        Exige Antes ({requiredDisciplinesList.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('libera')}
                        className={`px-3 py-1.5 rounded-lg transition-all font-bukra text-[11px] flex items-center gap-1.5 ${
                            activeTab === 'libera'
                                ? 'bg-brand-yellow text-black font-bold shadow-sm'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Unlock className="w-3.5 h-3.5" />
                        Desbloqueia Depois ({unlockedDisciplinesList.length})
                    </button>
                </div>

                <span className="text-[10px] text-gray-500 font-mono hidden sm:inline-block">
                    Grafo Bidirecional JúpiterWeb
                </span>
            </div>

            {/* Conteúdo do Grafo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Coluna 1: O que o aluno precisa ter cursado antes */}
                {(activeTab === 'both' || activeTab === 'requisitos') && (
                    <div className={`p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between ${activeTab === 'requisitos' ? 'md:col-span-2' : ''}`}>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-brand-red font-bukra text-xs font-bold uppercase tracking-wider">
                                    <Lock className="w-4 h-4" />
                                    <span>Pré-Requisitos Necessários</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-red/10 text-brand-red border border-brand-red/20 font-bold">
                                    {requiredDisciplinesList.length} Exigência(s)
                                </span>
                            </div>

                            {requiredDisciplinesList.length === 0 ? (
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center my-3">
                                    <CheckCircle className="w-6 h-6 text-emerald-400 mx-auto mb-1.5 opacity-80" />
                                    <p className="text-xs text-gray-300 font-medium">Sem Pré-Requisitos Formais</p>
                                    <span className="text-[10px] text-gray-500 block mt-0.5">
                                        Disciplina aberta para matrícula sem travas no JúpiterWeb.
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-2 mt-2">
                                    {requiredDisciplinesList.map((req, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => onSelectDiscipline(req.code)}
                                            className="p-3 rounded-xl bg-[#1E1E1E] hover:bg-[#252525] border border-white/5 hover:border-brand-red/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-white group-hover:text-brand-red transition-colors">
                                                        {req.code}
                                                    </span>
                                                    <span
                                                        className={`text-[9px] font-bukra px-1.5 py-0.5 rounded uppercase font-bold ${
                                                            req.type === 'forte'
                                                                ? 'bg-brand-red/20 text-brand-red border border-brand-red/30'
                                                                : 'bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30'
                                                        }`}
                                                    >
                                                        {req.type === 'forte' ? 'Aprovação' : 'Frequência'}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-300 font-medium mt-1">
                                                    {req.item ? req.item.nome : req.code}
                                                </div>
                                                {req.desc && (
                                                    <span className="text-[10px] text-gray-500 italic block mt-0.5">
                                                        {req.desc}
                                                    </span>
                                                )}
                                            </div>
                                            <ArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Coluna 2: Disciplinas posteriores desbloqueadas por esta */}
                {(activeTab === 'both' || activeTab === 'libera') && (
                    <div className={`p-4 rounded-2xl bg-black/30 border border-white/5 flex flex-col justify-between ${activeTab === 'libera' ? 'md:col-span-2' : ''}`}>
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-brand-yellow font-bukra text-xs font-bold uppercase tracking-wider">
                                    <Unlock className="w-4 h-4" />
                                    <span>Disciplinas Desbloqueadas</span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 font-bold">
                                    {unlockedDisciplinesList.length} Futura(s)
                                </span>
                            </div>

                            {unlockedDisciplinesList.length === 0 ? (
                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center my-3">
                                    <p className="text-xs text-gray-300 font-medium">Fim da Cadeia de Pré-requisitos</p>
                                    <span className="text-[10px] text-gray-500 block mt-0.5">
                                        Nenhuma disciplina posterior tem esta matéria como exigência cadastrada.
                                    </span>
                                </div>
                            ) : (
                                <div className="space-y-2 mt-2">
                                    {unlockedDisciplinesList.map((item, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => onSelectDiscipline(item.code)}
                                            className="p-3 rounded-xl bg-[#1E1E1E] hover:bg-[#252525] border border-white/5 hover:border-brand-yellow/40 transition-all cursor-pointer group flex items-start justify-between gap-3"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-bold text-white group-hover:text-brand-yellow transition-colors">
                                                        {item.code}
                                                    </span>
                                                    {item.item && (
                                                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10 uppercase">
                                                            {item.item.unidade}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-gray-300 font-medium mt-1">
                                                    {item.item ? item.item.nome : item.code}
                                                </div>
                                                {item.item && (
                                                    <span className="text-[10px] text-gray-500 block mt-0.5 font-mono">
                                                        {item.item.creditosAula} CA {item.item.creditosTrabalho > 0 ? `+ ${item.item.creditosTrabalho} CT` : ''}
                                                    </span>
                                                )}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-brand-yellow transition-colors shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
