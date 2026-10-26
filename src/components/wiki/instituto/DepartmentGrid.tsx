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


import React from 'react';
import { motion } from 'framer-motion';
import { 
    Atom, 
    Microscope, 
    Magnet, 
    Globe, 
    Layers, 
    Cpu,
    Flag
} from 'lucide-react';
import Link from 'next/link';
import { useTelemetry } from '@/hooks/useTelemetry';
import { useNavigationStore } from '@/store/useNavigationStore';
import { institutoData } from '@/data/institutoData';

const departments = [
    {
        id: 'FAP',
        name: 'Física Aplicada',
        description: 'Desenvolvimento de tecnologias a partir de princípios físicos fundamentais.',
        Icon: Cpu,
        metrics: { researchers: 42, labs: 12 }
    },
    {
        id: 'FMT',
        name: 'Física dos Materiais',
        description: 'Estudo da estrutura e propriedades macroscópicas da matéria.',
        Icon: Layers,
        metrics: { researchers: 38, labs: 15 }
    },
    {
        id: 'FEP',
        name: 'Física Experimental',
        description: 'Investigação empírica dos fenômenos físicos em diversas escalas.',
        Icon: Microscope,
        metrics: { researchers: 55, labs: 20 }
    },
    {
        id: 'FGE',
        name: 'Física Geral',
        description: 'Fundamentos da física clássica e moderna e ensino de física.',
        Icon: Globe,
        metrics: { researchers: 30, labs: 8 }
    },
    {
        id: 'DFMA',
        name: 'Física Matemática',
        description: 'Pesquisa fundamentada em cosmologia, teoria quântica de campos e informação quântica.',
        Icon: Atom,
        metrics: { researchers: 14, labs: 0 }
    },
    {
        id: 'FNC',
        name: 'Física Nuclear',
        description: 'Estudo das propriedades e interações dos núcleos atômicos.',
        Icon: Magnet,
        metrics: { researchers: 35, labs: 10 }
    }
];

export function DepartmentGrid() {
    const { trackEvent } = useTelemetry();
    const { setReportModalOpen } = useNavigationStore();

    return (
        <section className="py-6 sm:py-10 md:py-12">
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 md:mb-8">
               <div className="h-[2px] w-6 sm:w-8 bg-brand-blue"></div>
               <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white italic uppercase tracking-tighter font-bukra">
                   Departamentos
               </h2>
               <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bukra px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                   IFUSP (6)
               </span>
            </div>

            {/* Grid: 2 colunas no mobile (3 linhas) e 2 a 3 colunas em telas maiores */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
                {departments.map((dept, idx) => {
                    const deptData = institutoData[dept.id.toLowerCase()];
                    const researchersCount = deptData ? deptData.pesquisadores.length : dept.metrics.researchers;
                    const labsCount = deptData ? deptData.laboratorios.length : dept.metrics.labs;
                    const Icon = dept.Icon;

                    return (
                        <Link 
                            key={dept.id} 
                            href={`/wiki/instituto/${dept.id.toLowerCase()}`}
                            className="block group"
                            onClick={() => trackEvent('DEPT_FILTER', { dept_id: dept.id, dept_name: dept.name })}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.05 }}
                                className="glass-card p-3 sm:p-5 md:p-6 rounded-2xl sm:rounded-[28px] md:rounded-[32px] border-gray-100 dark:border-white/5 hover:border-brand-blue/30 bg-white/40 dark:bg-[#1E1E1E]/40 hover:bg-gray-100 dark:hover:bg-[#1E1E1E]/60 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between active:scale-[0.98]"
                            >
                                <div>
                                    {/* Top line: Icon + Sigla + Report Flag */}
                                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-gray-100 dark:bg-white/5 group-hover:bg-brand-blue/20 transition-colors shrink-0">
                                                <span className="text-gray-500 dark:text-gray-400 group-hover:text-brand-blue transition-colors">
                                                    <Icon className="size-4 sm:size-5 md:size-6" />
                                                </span>
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-black text-brand-blue/80 dark:text-blue-300 uppercase tracking-wider font-bukra truncate">
                                                {dept.id}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setReportModalOpen(true, 'outro', { id: dept.id, titulo: dept.name, local: 'Departamento' });
                                            }}
                                            title="Sugerir Alteração / Reportar Erro"
                                            className="text-gray-400 hover:text-brand-red transition-colors p-1 sm:p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
                                        >
                                            <Flag className="size-3 sm:size-3.5" />
                                        </button>
                                    </div>

                                    {/* Department Name */}
                                    <h3 className="text-xs sm:text-base md:text-lg font-bold text-gray-900 dark:text-white leading-tight underline-offset-4 group-hover:underline group-hover:text-brand-blue transition-all font-bukra line-clamp-1 mb-1 sm:mb-2">
                                        {dept.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-tight sm:leading-relaxed mb-3 sm:mb-5 line-clamp-2 h-7 sm:h-9 md:h-11 overflow-hidden font-open-sans">
                                        {dept.description}
                                    </p>
                                </div>

                                {/* Metrics Badges (Compact on mobile) */}
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 pt-1 border-t border-gray-100/60 dark:border-white/5">
                                    <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-brand-red/10 border border-brand-red/20">
                                        <span className="text-[8px] sm:text-[10px] font-black text-brand-red flex items-center gap-1 font-bukra tracking-tight">
                                            <div className="size-1 bg-brand-red rounded-full shrink-0"></div>
                                            <span>{researchersCount}</span>
                                            <span className="hidden sm:inline">PESQUISADORES</span>
                                            <span className="sm:hidden">PESQ.</span>
                                        </span>
                                    </div>
                                    
                                    {labsCount > 0 && (
                                        <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg sm:rounded-xl bg-brand-yellow/10 border border-brand-yellow/20">
                                            <span className="text-[8px] sm:text-[10px] font-black text-amber-700 dark:text-brand-yellow flex items-center gap-1 font-bukra tracking-tight">
                                                <div className="size-1 bg-amber-500 dark:bg-brand-yellow rounded-full shrink-0"></div>
                                                <span>{labsCount}</span>
                                                <span className="hidden sm:inline">LABORATÓRIOS</span>
                                                <span className="sm:hidden">LABS</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
