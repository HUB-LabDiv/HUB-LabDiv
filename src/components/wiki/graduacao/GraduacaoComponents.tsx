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
import {
    ChevronDown,
    Download,
    ExternalLink,
    Info
} from 'lucide-react';

export interface CourseMetric {
    label: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    color?: 'brand-yellow' | 'brand-blue' | 'brand-red';
}

export function CourseMetricsGrid({ metrics }: { metrics: CourseMetric[] }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 my-6">
            {metrics.map((m, idx) => {
                const colorClass =
                    m.color === 'brand-yellow'
                        ? 'border-brand-yellow/20 hover:border-brand-yellow/40 text-brand-yellow'
                        : m.color === 'brand-red'
                        ? 'border-brand-red/20 hover:border-brand-red/40 text-brand-red'
                        : 'border-[#0F4780]/30 hover:border-[#0F4780]/60 text-brand-blue-accent';

                return (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -2 }}
                        className="p-4 sm:p-5 rounded-2xl bg-[#1E1E1E] border border-white/5 transition-all shadow-lg flex flex-col justify-between"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-open-sans">
                                {m.label}
                            </span>
                            <div className={`p-2 rounded-xl bg-black/30 ${colorClass}`}>
                                {m.icon}
                            </div>
                        </div>
                        <div>
                            <div className="text-lg sm:text-xl font-black text-white font-bukra tracking-tight">
                                {m.value}
                            </div>
                            {m.sub && (
                                <span className="text-[11px] text-gray-400 font-open-sans mt-0.5 block">
                                    {m.sub}
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

export interface DisciplineItem {
    codigo?: string;
    nome: string;
    creditosAula: number;
    creditosTrab?: number;
    unidade?: string;
    tipo?: 'obrigatória' | 'optativa' | 'extensão' | 'estágio';
    observacao?: string;
}

export interface SemesterBlock {
    semestre: number | string;
    titulo: string;
    subtitulo?: string;
    disciplinas: DisciplineItem[];
}

export function SemestersAccordion({
    semestres,
    accentColor = 'brand-yellow'
}: {
    semestres: SemesterBlock[];
    accentColor?: 'brand-yellow' | 'brand-blue' | 'brand-red';
}) {
    const [openSemestre, setOpenSemestre] = useState<number | string>(semestres[0]?.semestre || 1);

    const toggleSemestre = (sem: number | string) => {
        setOpenSemestre(prev => (prev === sem ? -1 : sem));
    };

    return (
        <div className="space-y-3 my-6">
            {semestres.map(sem => {
                const isOpen = openSemestre === sem.semestre;
                const totalAula = sem.disciplinas.reduce((acc, d) => acc + d.creditosAula, 0);
                const totalTrab = sem.disciplinas.reduce((acc, d) => acc + (d.creditosTrab || 0), 0);

                return (
                    <div
                        key={sem.semestre}
                        className="rounded-2xl border border-white/5 bg-[#1E1E1E] overflow-hidden transition-all"
                    >
                        <button
                            onClick={() => toggleSemestre(sem.semestre)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bukra text-xs font-black shrink-0 ${
                                        accentColor === 'brand-yellow'
                                            ? 'bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20'
                                            : accentColor === 'brand-red'
                                            ? 'bg-brand-red/10 text-brand-red border border-brand-red/20'
                                            : 'bg-[#0F4780]/20 text-brand-blue-accent border border-[#0F4780]/30'
                                    }`}
                                >
                                    {typeof sem.semestre === 'number' ? `${sem.semestre}º` : sem.semestre}
                                </div>
                                <div>
                                    <h4 className="text-sm sm:text-base font-bold text-white font-bukra">
                                        {sem.titulo}
                                    </h4>
                                    {sem.subtitulo && (
                                        <p className="text-[11px] text-gray-400 font-open-sans">
                                            {sem.subtitulo}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline-block text-[10px] font-mono text-gray-400 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                                    {totalAula} CA {totalTrab > 0 ? `+ ${totalTrab} CT` : ''}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                        isOpen ? 'rotate-180 text-white' : ''
                                    }`}
                                />
                            </div>
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="border-t border-white/5 px-5 py-4 bg-black/20"
                                >
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs font-open-sans">
                                            <thead>
                                                <tr className="border-b border-white/5 text-[10px] uppercase text-gray-400 font-bukra">
                                                    <th className="pb-2.5">Código</th>
                                                    <th className="pb-2.5">Disciplina</th>
                                                    <th className="pb-2.5 text-center">Unidade</th>
                                                    <th className="pb-2.5 text-center">Créditos (CA/CT)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {sem.disciplinas.map((disc, idx) => (
                                                    <tr key={idx} className="hover:bg-white/[0.015] transition-colors">
                                                        <td className="py-2.5 font-mono text-[11px] text-gray-300 font-bold whitespace-nowrap">
                                                            {disc.codigo || '—'}
                                                        </td>
                                                        <td className="py-2.5 text-white pr-4">
                                                            <div className="font-semibold text-[13px]">{disc.nome}</div>
                                                            {disc.observacao && (
                                                                <div className="text-[11px] text-gray-400 italic mt-0.5">
                                                                    {disc.observacao}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="py-2.5 text-center whitespace-nowrap">
                                                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5">
                                                                {disc.unidade || 'IFUSP'}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 text-center font-mono font-bold whitespace-nowrap">
                                                            <span className="text-white">{disc.creditosAula} CA</span>
                                                            {disc.creditosTrab ? (
                                                                <span className="text-brand-yellow ml-1">
                                                                    + {disc.creditosTrab} CT
                                                                </span>
                                                            ) : null}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}

export function CalloutRule({
    title,
    description,
    tag = 'DIRETRIZ OFICIAL',
    color = 'brand-yellow'
}: {
    title: string;
    description: string;
    tag?: string;
    color?: 'brand-yellow' | 'brand-blue' | 'brand-red';
}) {
    const borderClass =
        color === 'brand-yellow'
            ? 'border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/10 via-[#1E1E1E] to-[#1E1E1E]'
            : color === 'brand-red'
            ? 'border-brand-red/30 bg-gradient-to-r from-brand-red/10 via-[#1E1E1E] to-[#1E1E1E]'
            : 'border-[#0F4780]/40 bg-gradient-to-r from-[#0F4780]/20 via-[#1E1E1E] to-[#1E1E1E]';

    const textClass =
        color === 'brand-yellow'
            ? 'text-brand-yellow'
            : color === 'brand-red'
            ? 'text-brand-red'
            : 'text-brand-blue-accent';

    return (
        <div className={`p-5 rounded-2xl border ${borderClass} shadow-xl my-6 flex items-start gap-4`}>
            <div className={`p-2 rounded-xl bg-black/40 ${textClass} shrink-0 mt-0.5`}>
                <Info className="w-5 h-5" />
            </div>
            <div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${textClass} font-open-sans block mb-1`}>
                    {tag}
                </span>
                <h4 className="text-base font-bold text-white font-bukra mb-1">
                    {title}
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}

export function DownloadCard({
    title,
    subtitle,
    href,
    isExternal = false
}: {
    title: string;
    subtitle: string;
    href: string;
    isExternal?: boolean;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 sm:p-5 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-white/20 transition-all flex items-center justify-between gap-4 shadow-lg hover:-translate-y-0.5"
        >
            <div className="flex items-center gap-3.5 min-w-0">
                <div className="p-3 rounded-xl bg-black/40 text-brand-yellow group-hover:scale-105 transition-transform shrink-0">
                    {isExternal ? <ExternalLink className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                </div>
                <div className="truncate">
                    <h5 className="text-sm font-bold text-white font-bukra truncate group-hover:text-brand-yellow transition-colors">
                        {title}
                    </h5>
                    <p className="text-[11px] text-gray-400 font-open-sans truncate">
                        {subtitle}
                    </p>
                </div>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 shrink-0 group-hover:bg-brand-yellow group-hover:text-gray-900 group-hover:border-brand-yellow transition-all">
                {isExternal ? 'Acessar' : 'Baixar PDF'}
            </span>
        </a>
    );
}
