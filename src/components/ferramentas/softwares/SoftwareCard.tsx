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

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ExternalLink,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Laptop,
    CheckCircle2,
    Layers,
    BookOpen
} from 'lucide-react';
import { AcademicSoftware } from '@/types/softwares';

interface SoftwareCardProps {
    software: AcademicSoftware;
    currentUserId?: string;
}

export function SoftwareCard({ software, currentUserId }: SoftwareCardProps) {
    const isComunitario = software.software_type === 'comunitario';

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`
                group relative flex flex-col justify-between rounded-3xl p-5 sm:p-6
                bg-white dark:bg-[#1E1E1E]/90 hover:bg-gray-50/90 dark:hover:bg-[#232323]
                border transition-all duration-300
                shadow-md hover:shadow-xl dark:shadow-lg dark:hover:shadow-2xl hover:shadow-brand-blue/10
                ${isComunitario
                    ? 'border-brand-yellow/40 hover:border-brand-yellow dark:border-brand-yellow/30 dark:hover:border-brand-yellow/60'
                    : 'border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20'
                }
            `}
        >
            {/* Ambient Background Gradient for Community Software */}
            {isComunitario && (
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-yellow/20 transition-all duration-500" />
            )}

            <div>
                {/* Header: Badges */}
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {isComunitario ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow/15 text-amber-700 dark:text-brand-yellow border border-brand-yellow/30">
                                <Sparkles className="w-3 h-3 animate-pulse text-amber-600 dark:text-brand-yellow" />
                                Feito na USP
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                                <ShieldCheck className="w-3 h-3" />
                                Essencial
                            </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
                            {software.category}
                        </span>
                    </div>
                </div>

                {/* Title & Author */}
                <div className="mb-3">
                    <Link
                        href={`/ferramentas/softwares/${software.slug}`}
                        className="group/title inline-block"
                    >
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover/title:text-brand-blue dark:group-hover/title:text-brand-yellow transition-colors font-bukra flex items-center gap-2">
                            {software.title}
                        </h3>
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <span>Por</span>
                        <span className="text-gray-800 dark:text-gray-200 font-bold">{software.author_name}</span>
                        {isComunitario && (
                            <span className="px-1.5 py-0.2 text-[9px] bg-brand-blue/15 text-brand-blue dark:bg-brand-blue/20 dark:text-blue-300 rounded font-semibold">
                                LabDiv / USP
                            </span>
                        )}
                    </p>
                </div>

                {/* Tagline / Resumo */}
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-3 leading-relaxed mb-4 font-open-sans">
                    {software.tagline}
                </p>

                {/* Platforms & Audience Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                    {software.platforms.map((plat) => (
                        <span
                            key={plat}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center gap-1"
                        >
                            <Laptop className="w-2.5 h-2.5 text-gray-500 dark:text-gray-400" />
                            {plat}
                        </span>
                    ))}
                    {software.pricing_type && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                            {software.pricing_type}
                        </span>
                    )}
                </div>

                {/* Key Features Quick Preview */}
                {software.features_list && software.features_list.length > 0 && (
                    <div className="space-y-1.5 mb-5 p-3 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5">
                        <div className="text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-amber-600 dark:text-brand-yellow" />
                            Destaques
                        </div>
                        {software.features_list.slice(0, 2).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-brand-yellow shrink-0 mt-0.5" />
                                <span className="line-clamp-1">
                                    <strong className="text-gray-900 dark:text-white font-semibold">{feat.title}:</strong> {feat.description}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between gap-3">
                <Link
                    href={`/ferramentas/softwares/${software.slug}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-900 dark:text-white text-xs font-bold transition-all duration-200 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                >
                    <BookOpen className="w-3.5 h-3.5 text-amber-600 dark:text-brand-yellow" />
                    <span>Ver Guia & Tutorial</span>
                    <ArrowRight className="w-3 h-3 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                    href={software.access_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white transition-all shadow-md shadow-brand-blue/20 hover:scale-105"
                    title="Acessar software diretamente"
                >
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
        </motion.div>
    );
}
