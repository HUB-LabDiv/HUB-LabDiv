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

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Atom, Microscope, GraduationCap } from 'lucide-react';
import BachareladoView from './BachareladoView';
import FisicaMedicaView from './FisicaMedicaView';
import LicenciaturaView from './LicenciaturaView';

export type CourseType = 'bacharelado' | 'fisica-medica' | 'licenciatura';

interface CourseTabOption {
    id: CourseType;
    label: string;
    shortLabel: string;
    sublabel: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: 'brand-blue' | 'brand-red' | 'brand-yellow';
    activeBgClass: string;
    activeTextClass: string;
    activeBorderClass: string;
}

const COURSE_TABS: CourseTabOption[] = [
    {
        id: 'bacharelado',
        label: 'Bacharelado em Física',
        shortLabel: 'Bacharelado',
        sublabel: 'CoC-B • Integral & Noturno',
        icon: Atom,
        accentColor: 'brand-blue',
        activeBgClass: 'bg-[#0F4780]/20',
        activeTextClass: 'text-brand-blue-accent',
        activeBorderClass: 'border-[#0F4780]/50'
    },
    {
        id: 'fisica-medica',
        label: 'Bacharelado em Física Médica',
        shortLabel: 'Física Médica',
        sublabel: 'CoC-FM • IFUSP & FMUSP',
        icon: Microscope,
        accentColor: 'brand-red',
        activeBgClass: 'bg-brand-red/15',
        activeTextClass: 'text-brand-red',
        activeBorderClass: 'border-brand-red/50'
    },
    {
        id: 'licenciatura',
        label: 'Licenciatura em Física',
        shortLabel: 'Licenciatura',
        sublabel: 'CoCLic • IFUSP & FEUSP',
        icon: GraduationCap,
        accentColor: 'brand-yellow',
        activeBgClass: 'bg-brand-yellow/15',
        activeTextClass: 'text-brand-yellow',
        activeBorderClass: 'border-brand-yellow/50'
    }
];

function GraduacaoCursosContentInner() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const paramCurso = searchParams.get('curso') as CourseType | null;
    const activeFromUrl: CourseType =
        paramCurso && ['bacharelado', 'fisica-medica', 'licenciatura'].includes(paramCurso)
            ? paramCurso
            : 'bacharelado';

    const [selectedCourse, setSelectedCourse] = useState<CourseType>(activeFromUrl);

    const handleSelectCourse = (courseId: CourseType) => {
        setSelectedCourse(courseId);
        const params = new URLSearchParams(searchParams.toString());
        params.set('curso', courseId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="w-full space-y-8">
            {/* Seletor Superior de 3 Vias (Switch de Cursos) */}
            <div className="p-2 sm:p-3 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-2xl backdrop-blur-xl sticky top-20 z-20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {COURSE_TABS.map(tab => {
                        const Icon = tab.icon;
                        const isSelected = selectedCourse === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleSelectCourse(tab.id)}
                                className={`relative p-3 sm:p-4 rounded-2xl flex items-center gap-3.5 transition-all text-left group overflow-hidden ${
                                    isSelected
                                        ? `${tab.activeBgClass} border ${tab.activeBorderClass} shadow-lg`
                                        : 'bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/5'
                                }`}
                            >
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeCourseTab"
                                        className="absolute inset-0 rounded-2xl bg-white/[0.03] pointer-events-none"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div
                                    className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                                        isSelected
                                            ? `${tab.activeTextClass} bg-black/40 shadow-inner`
                                            : 'text-gray-400 bg-white/5 group-hover:text-white group-hover:bg-white/10'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </div>

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5">
                                        <h3
                                            className={`text-xs sm:text-sm font-black font-bukra tracking-tight truncate ${
                                                isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                            }`}
                                        >
                                            <span className="sm:hidden">{tab.shortLabel}</span>
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </h3>
                                    </div>
                                    <p
                                        className={`text-[10px] font-open-sans truncate mt-0.5 ${
                                            isSelected ? tab.activeTextClass : 'text-gray-400'
                                        }`}
                                    >
                                        {tab.sublabel}
                                    </p>
                                </div>

                                {isSelected && (
                                    <div className="hidden md:block shrink-0 mr-1">
                                        <div
                                            className={`w-2 h-2 rounded-full ${
                                                tab.accentColor === 'brand-yellow'
                                                    ? 'bg-brand-yellow'
                                                    : tab.accentColor === 'brand-red'
                                                    ? 'bg-brand-red'
                                                    : 'bg-brand-blue-accent'
                                            } animate-pulse`}
                                        />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Transição Suave entre as Três Telas Dedicadas */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedCourse}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                >
                    {selectedCourse === 'bacharelado' && <BachareladoView />}
                    {selectedCourse === 'fisica-medica' && <FisicaMedicaView />}
                    {selectedCourse === 'licenciatura' && <LicenciaturaView />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default function GraduacaoCursosContent() {
    return (
        <Suspense
            fallback={
                <div className="w-full h-96 rounded-3xl bg-[#1E1E1E] border border-white/5 animate-pulse flex items-center justify-center text-gray-500 font-bukra text-sm">
                    Carregando matrizes curriculares do IFUSP...
                </div>
            }
        >
            <GraduacaoCursosContentInner />
        </Suspense>
    );
}
