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
import { motion } from 'framer-motion';
import {
    Brain,
    ArrowRight,
    ChevronRight,
    Calendar,
    MapPin,
    Radio,
    Plus,
    MessageSquare,
    GraduationCap,
    Briefcase,
    Compass,
    Info,
    RotateCcw
} from 'lucide-react';
import { ColisorIcon } from '@/components/icons/ColisorIcon';
import { SacSection } from '@/components/sac/SacSection';
import { SegmentedInterativoSection } from './SegmentedInterativoSection';
import { ConstelacoesLinguisticas } from '@/components/explorar/ConstelacoesLinguisticas';
import { SubmitOportunidadeModal } from '@/components/gcif/SubmitOportunidadeModal';

interface GcifInterativoViewProps {
    oportunidades: any[] | null;
    glossario?: any[];
    initialPersona?: 'curioso' | 'aluno' | 'professor';
}

export function GcifInterativoView({ oportunidades, glossario, initialPersona = 'aluno' }: GcifInterativoViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activePersona, setActivePersona] = useState<'curioso' | 'aluno' | 'professor'>(initialPersona);
    const [isCustomSelection, setIsCustomSelection] = useState(false);

    const handleSelectPersona = (p: 'curioso' | 'aluno' | 'professor') => {
        setActivePersona(p);
        setIsCustomSelection(true);
    };

    const handleResetPersona = () => {
        setActivePersona(initialPersona);
        setIsCustomSelection(false);
    };

    return (
        <div className="w-full space-y-16 pb-16">
            {/* Header Hero com Detecção Inteligente de Persona (Estilo Instituto) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/20 dark:from-[#1E1E1E] dark:via-[#161616] dark:to-[#0f0f0f] border border-gray-200 dark:border-white/10 p-6 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col xl:flex-row justify-between items-start gap-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-red text-xs font-black uppercase tracking-wider mb-3">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        Módulos Dinâmicos &amp; Engajamento Comunitário
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-bukra tracking-tight">
                        Interativo &amp; Oportunidades
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans mt-3 leading-relaxed">
                        Navegue pelas oportunidades e recursos de acordo com a sua vivência no IFUSP. A página adapta suas recomendações com base no seu perfil da comunidade.
                    </p>
                </div>

                {/* Card de Persona Identificada (Análogo ao Instituto_Identificado) */}
                <div className="relative z-10 w-full xl:w-auto">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-lg w-full xl:min-w-[340px]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-brand-red/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(241,67,67,0.3)] shrink-0">
                                {activePersona === 'aluno' && <GraduationCap className="text-white w-6 h-6" />}
                                {activePersona === 'professor' && <Briefcase className="text-white w-6 h-6" />}
                                {activePersona === 'curioso' && <Compass className="text-white w-6 h-6" />}
                            </div>
                            <div>
                                <div className="text-[9px] font-mono font-black uppercase text-brand-red tracking-widest flex items-center gap-1.5 mb-0.5">
                                    Persona_Identificada
                                    <span className="px-1.5 py-0.5 bg-brand-red/10 text-brand-red border border-brand-red/30 rounded text-[7px] font-black uppercase tracking-widest">
                                        {isCustomSelection ? 'VISÃO ALTERADA' : 'PERFIL AUTOMÁTICO'}
                                    </span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-200 font-bukra uppercase">
                                    {activePersona === 'aluno' && 'Alunos & Bolsas'}
                                    {activePersona === 'professor' && 'Professores & Formulários'}
                                    {activePersona === 'curioso' && 'Curiosos & Comunidade'}
                                </div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-1.5">
                                    <Info className="w-3.5 h-3.5 text-brand-yellow shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-open-sans text-gray-600 dark:text-gray-400 leading-snug">
                                        {isCustomSelection ? 'Explorando na visão de outra persona.' : 'Conteúdos adaptados automaticamente ao seu perfil.'}
                                    </p>
                                </div>
                                {isCustomSelection && (
                                    <button
                                        onClick={handleResetPersona}
                                        title="Restaurar persona original"
                                        className="text-[9px] text-gray-400 hover:text-white flex items-center gap-1 underline shrink-0 cursor-pointer"
                                    >
                                        <RotateCcw className="w-2.5 h-2.5" /> Redefinir
                                    </button>
                                )}
                            </div>

                            {/* Alternador Rápido de Persona */}
                            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10">
                                <button
                                    onClick={() => handleSelectPersona('curioso')}
                                    className={`py-1.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activePersona === 'curioso'
                                            ? 'bg-brand-red text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    Curioso
                                </button>
                                <button
                                    onClick={() => handleSelectPersona('aluno')}
                                    className={`py-1.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activePersona === 'aluno'
                                            ? 'bg-brand-red text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    Aluno
                                </button>
                                <button
                                    onClick={() => handleSelectPersona('professor')}
                                    className={`py-1.5 px-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                                        activePersona === 'professor'
                                            ? 'bg-brand-red text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    Docente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Oportunidades & Recursos Segmentados por Persona */}
            <SegmentedInterativoSection
                dynamicOportunidades={oportunidades || []}
                activePersona={activePersona}
                onPersonaChange={setActivePersona}
                onOpenSubmitModal={() => setIsModalOpen(true)}
            />

            {/* 2. Teste de Radiação (Quiz) Banner */}
            <motion.div
                data-tour="gcif-interativo-quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative group w-full"
            >
                <div className="absolute -inset-0.5 bg-brand-red/30 rounded-[32px] blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Link
                    href="/wiki/quiz"
                    className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 hover:border-brand-red/50 transition-all overflow-hidden text-left shadow-xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="size-20 bg-brand-red/15 text-brand-red rounded-[28px] flex items-center justify-center ring-1 ring-brand-red/30 group-hover:scale-110 transition-transform shadow-2xl">
                            <Brain className="w-10 h-10 text-brand-red" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white font-bukra italic uppercase tracking-tighter mb-2">
                                Teste de Radiação (Quiz)
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans max-w-xl leading-relaxed">
                                Desafie seus conhecimentos sobre física, história do IFUSP e divulgação científica. <span className="text-brand-red font-bold">Exploda o contador Geiger!</span>
                            </p>
                        </div>
                    </div>
                    <div className="mt-8 md:mt-0 relative z-10 shrink-0">
                        <div className="px-8 py-4 bg-brand-red text-white font-black rounded-2xl group-hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl">
                            <span>Iniciar Teste</span>
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </motion.div>

            {/* 3. SAC (Serviço de Atendimento / Canal de Suporte) */}
            <div data-tour="gcif-interativo-sac" className="pt-6 border-t border-gray-200 dark:border-white/10">
                <SacSection />
            </div>

            {/* 4. Glossário Translacional & Constelações Linguísticas */}
            <div data-tour="gcif-interativo-glossario" className="pt-6 border-t border-gray-200 dark:border-white/10">
                {glossario && glossario.length > 0 ? (
                    <ConstelacoesLinguisticas glossario={glossario} />
                ) : (
                    <div className="p-12 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-[32px] italic">
                        Nenhuma constelação formada ainda no ecossistema do IF.
                    </div>
                )}
            </div>

            {/* Modal de Divulgação de Oportunidade */}
            <SubmitOportunidadeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
