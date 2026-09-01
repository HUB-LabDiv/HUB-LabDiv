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
    Sparkles,
    Brain,
    ArrowRight,
    ChevronRight,
    Calendar,
    MapPin,
    Radio,
    Plus
} from 'lucide-react';
import { ColisorIcon } from '@/components/icons/ColisorIcon';
import { SacSection } from '@/components/sac/SacSection';
import { ConstelacoesLinguisticas } from '@/components/explorar/ConstelacoesLinguisticas';
import { SubmitOportunidadeModal } from '@/components/gcif/SubmitOportunidadeModal';

interface GcifInterativoViewProps {
    oportunidades: any[] | null;
    glossario?: any[];
}

export function GcifInterativoView({ oportunidades, glossario }: GcifInterativoViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full space-y-16 pb-16">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#0f0f0f] border border-white/10 p-6 sm:p-10 shadow-2xl">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/15 border border-brand-red/30 text-brand-red text-xs font-black uppercase tracking-wider mb-3">
                        <Radio className="w-3.5 h-3.5 animate-pulse" />
                        Módulos Dinâmicos & Engajamento Comunitário
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-white font-bukra tracking-tight">
                        Interativo & Oportunidades
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-3 leading-relaxed">
                        Encontre oportunidades ativas de Iniciação Científica e monitoria, teste seus conhecimentos no quiz, tire dúvidas pelo SAC e explore as constelações semânticas da física.
                    </p>
                </div>
            </div>

            {/* 1. Oportunidades Ativas */}
            <div data-tour="gcif-interativo-oportunidades" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-red/10 rounded-2xl text-brand-red">
                            <ColisorIcon size={28} animate={false} />
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tighter">
                                Oportunidades Ativas
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-400 font-open-sans">
                                Vagas de IC, monitorias, palestras e editais selecionados para o seu momento acadêmico.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/20 transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Divulgar Oportunidade</span>
                    </button>
                </div>

                {!oportunidades || oportunidades.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 bg-[#1E1E1E] border border-white/10 rounded-[32px] italic">
                        Varredura concluída. Nenhuma anomalia de oportunidade detectada no momento.
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-3">
                        {oportunidades.map((item) => (
                            <div
                                key={item.id}
                                className="bg-[#1E1E1E] rounded-[32px] border border-white/10 p-6 sm:p-8 flex flex-col justify-between hover:border-brand-blue/40 transition-all hover:-translate-y-1 shadow-xl group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="px-3 py-1 bg-brand-blue/15 text-brand-blue border border-brand-blue/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                                            {item.tipo}
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white font-bukra group-hover:text-brand-blue transition-colors line-clamp-2 mb-2">
                                        {item.titulo}
                                    </h3>
                                    <p className="text-xs text-gray-400 font-open-sans leading-relaxed line-clamp-3 mb-4">
                                        {item.descricao}
                                    </p>

                                    {/* Data & Local */}
                                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                                        {item.data && (
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                                <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                                                <span>{item.data}</span>
                                            </div>
                                        )}
                                        {item.local && (
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-semibold">
                                                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                                                <span>{item.local}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/5">
                                    {item.link && (
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-brand-blue font-black text-xs uppercase tracking-wider group-hover:gap-3 transition-all"
                                        >
                                            <span>Acessar</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                    className="relative flex flex-col md:flex-row items-center justify-between w-full p-8 md:p-12 rounded-[32px] bg-[#1E1E1E] border border-white/10 hover:border-brand-red/50 transition-all overflow-hidden text-left shadow-xl"
                >
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="size-20 bg-brand-red/15 text-brand-red rounded-[28px] flex items-center justify-center ring-1 ring-brand-red/30 group-hover:scale-110 transition-transform shadow-2xl">
                            <Brain className="w-10 h-10 text-brand-red" />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl sm:text-4xl font-black text-white font-bukra italic uppercase tracking-tighter mb-2">
                                Teste de Radiação (Quiz)
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-400 font-open-sans max-w-xl leading-relaxed">
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
            <div data-tour="gcif-interativo-sac" className="pt-6 border-t border-white/10">
                <SacSection />
            </div>

            {/* 4. Glossário Translacional & Constelações Linguísticas */}
            <div data-tour="gcif-interativo-glossario" className="pt-6 border-t border-white/10">
                {glossario && glossario.length > 0 ? (
                    <ConstelacoesLinguisticas glossario={glossario} />
                ) : (
                    <div className="p-12 text-center text-gray-400 bg-[#1E1E1E] border border-white/10 rounded-[32px] italic">
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
