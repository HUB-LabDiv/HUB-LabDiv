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

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ExternalLink,
    Clock,
    BookOpen,
    Target,
    Layers,
    Sparkles,
    Building2,
    ArrowLeft,
    Share2,
    Check
} from 'lucide-react';
import { DisciplineItem } from '@/types/curriculum';
import { disciplinesData } from '@/data/disciplinesData';
import { PrerequisiteTree } from './PrerequisiteTree';

interface DisciplineDetailsModalProps {
    disciplineCode: string | null;
    onClose: () => void;
    onSelectDiscipline?: (codigo: string) => void;
}

export function DisciplineDetailsModal({
    disciplineCode,
    onClose,
    onSelectDiscipline
}: DisciplineDetailsModalProps) {
    const [history, setHistory] = useState<string[]>([]);
    const [copied, setCopied] = useState(false);
    const [activeSection, setActiveSection] = useState<'ementa' | 'prereq' | 'bibliografia'>('ementa');

    // Inicializa histórico quando abre com um código
    useEffect(() => {
        if (disciplineCode) {
            setHistory([disciplineCode]);
            setActiveSection('ementa');
        } else {
            setHistory([]);
        }
    }, [disciplineCode]);

    // Trata ESC para fechar
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!disciplineCode) return null;

    const currentCode = history[history.length - 1] || disciplineCode;
    const currentDiscipline: DisciplineItem | undefined = disciplinesData[currentCode];

    const handleNavigate = (nextCode: string) => {
        setHistory(prev => [...prev, nextCode]);
        if (onSelectDiscipline) onSelectDiscipline(nextCode);
    };

    const handleBack = () => {
        if (history.length > 1) {
            setHistory(prev => prev.slice(0, prev.length - 1));
        }
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(currentCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop com blur escuro */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="relative w-full max-w-4xl bg-[#1E1E1E] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto max-h-[90vh] flex flex-col font-open-sans"
                >
                    {/* Header do Modal */}
                    <div className="p-5 sm:p-7 border-b border-white/5 bg-gradient-to-r from-[#181818] via-[#1E1E1E] to-[#181818] relative">
                        <div className="flex items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2">
                                {history.length > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
                                        title="Voltar à disciplina anterior"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="hidden sm:inline font-bukra text-[10px]">Voltar</span>
                                    </button>
                                )}
                                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#0F4780]/30 text-brand-blue-accent border border-[#0F4780]/50">
                                    {currentCode}
                                </span>
                                {currentDiscipline && (
                                    <>
                                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-white/5 text-gray-300 border border-white/10 uppercase">
                                            {currentDiscipline.unidade}
                                        </span>
                                        {currentDiscipline.departamento && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/30 text-gray-400 border border-white/5 uppercase">
                                                Depto. {currentDiscipline.departamento}
                                            </span>
                                        )}
                                        <span
                                            className={`px-2 py-0.5 rounded-md text-[10px] font-bukra uppercase font-bold ${
                                                currentDiscipline.tipo === 'obrigatoria'
                                                    ? 'bg-brand-red/15 text-brand-red border border-brand-red/30'
                                                    : 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
                                            }`}
                                        >
                                            {currentDiscipline.tipo}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopyCode}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    title="Copiar código da disciplina"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                                </button>
                                {currentDiscipline?.linkJupiter && (
                                    <a
                                        href={currentDiscipline.linkJupiter}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-xl bg-[#0F4780]/20 hover:bg-[#0F4780]/40 text-brand-blue-accent border border-[#0F4780]/30 transition-colors flex items-center gap-1.5 text-xs font-bukra"
                                        title="Abrir ementa oficial no JúpiterWeb"
                                    >
                                        <span className="hidden sm:inline text-[11px]">JúpiterWeb</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                    aria-label="Fechar Modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-black text-white font-bukra tracking-tight">
                            {currentDiscipline ? currentDiscipline.nome : currentCode}
                        </h3>

                        {currentDiscipline?.observacao && (
                            <p className="text-xs text-gray-400 mt-1.5 italic font-open-sans">
                                {currentDiscipline.observacao}
                            </p>
                        )}
                    </div>

                    {/* Barra de Métricas de Créditos */}
                    {currentDiscipline && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-black/40 border-b border-white/5 text-xs">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase font-bukra block">Créditos Aula</span>
                                <span className="text-base font-black text-white font-bukra mt-0.5 block">
                                    {currentDiscipline.creditosAula} CA <span className="text-xs text-gray-400 font-normal font-open-sans">({currentDiscipline.creditosAula * 15}h)</span>
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase font-bukra block">Créditos Trabalho</span>
                                <span className="text-base font-black text-brand-yellow font-bukra mt-0.5 block">
                                    {currentDiscipline.creditosTrabalho} CT <span className="text-xs text-gray-400 font-normal font-open-sans">({currentDiscipline.creditosTrabalho * 30}h)</span>
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase font-bukra block">Carga Horária Total</span>
                                <span className="text-base font-black text-brand-blue-accent font-bukra mt-0.5 block">
                                    {currentDiscipline.cargaHorariaTotal} Horas
                                </span>
                            </div>

                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-[10px] text-gray-400 uppercase font-bukra block">Extensão Curricular</span>
                                <span className="text-base font-black text-brand-red font-bukra mt-0.5 block">
                                    {currentDiscipline.horasExtensao ? `${currentDiscipline.horasExtensao}h AEx` : '0h AEx'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Abas de Navegação Interna */}
                    <div className="flex border-b border-white/5 px-6 pt-3 bg-black/20 gap-3">
                        <button
                            onClick={() => setActiveSection('ementa')}
                            className={`pb-3 font-bukra text-xs transition-colors relative ${
                                activeSection === 'ementa'
                                    ? 'text-white font-bold'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5" />
                                Ementa & Objetivos
                            </span>
                            {activeSection === 'ementa' && (
                                <motion.div layoutId="modal-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveSection('prereq')}
                            className={`pb-3 font-bukra text-xs transition-colors relative ${
                                activeSection === 'prereq'
                                    ? 'text-white font-bold'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5" />
                                Grafo de Pré-Requisitos
                            </span>
                            {activeSection === 'prereq' && (
                                <motion.div layoutId="modal-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveSection('bibliografia')}
                            className={`pb-3 font-bukra text-xs transition-colors relative ${
                                activeSection === 'bibliografia'
                                    ? 'text-white font-bold'
                                    : 'text-gray-400 hover:text-gray-200'
                            }`}
                        >
                            <span className="flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5" />
                                Bibliografia Recomendada
                            </span>
                            {activeSection === 'bibliografia' && (
                                <motion.div layoutId="modal-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-yellow" />
                            )}
                        </button>
                    </div>

                    {/* Corpo do Modal com Scroll */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1">
                        {currentDiscipline ? (
                            <>
                                {activeSection === 'ementa' && (
                                    <div className="space-y-6 animate-in fade-in duration-300">
                                        {/* Ementa Oficial */}
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-brand-yellow font-bukra mb-2 flex items-center gap-1.5">
                                                <BookOpen className="w-4 h-4" />
                                                Ementa Oficial do JúpiterWeb
                                            </h4>
                                            <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-gray-300 text-xs sm:text-sm leading-relaxed">
                                                {currentDiscipline.ementa}
                                            </div>
                                        </div>

                                        {/* Objetivos Pedagógicos */}
                                        {currentDiscipline.objetivos && (
                                            <div>
                                                <h4 className="text-xs font-black uppercase tracking-wider text-brand-blue-accent font-bukra mb-2 flex items-center gap-1.5">
                                                    <Target className="w-4 h-4" />
                                                    Objetivos Pedagógicos da Disciplina
                                                </h4>
                                                <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-gray-300 text-xs sm:text-sm leading-relaxed">
                                                    {currentDiscipline.objetivos}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeSection === 'prereq' && (
                                    <div className="animate-in fade-in duration-300">
                                        <PrerequisiteTree
                                            discipline={currentDiscipline}
                                            onSelectDiscipline={handleNavigate}
                                        />
                                    </div>
                                )}

                                {activeSection === 'bibliografia' && (
                                    <div className="space-y-4 animate-in fade-in duration-300">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-brand-yellow font-bukra mb-2 flex items-center gap-1.5">
                                            <BookOpen className="w-4 h-4" />
                                            Bibliografia Básica & Complementar Recomendada
                                        </h4>
                                        {currentDiscipline.bibliografia && currentDiscipline.bibliografia.length > 0 ? (
                                            <div className="space-y-2">
                                                {currentDiscipline.bibliografia.map((book, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex items-start gap-3 hover:border-brand-yellow/30 transition-colors"
                                                    >
                                                        <span className="w-6 h-6 rounded-lg bg-brand-yellow/10 text-brand-yellow font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                                            {idx + 1}
                                                        </span>
                                                        <div className="text-xs text-gray-300 font-medium leading-relaxed">
                                                            {book}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
                                                Consulte a bibliografia detalhada e atualizada do semestre no programa oficial no JúpiterWeb.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="p-8 text-center text-gray-400">
                                <p className="text-sm">Disciplina {currentCode} não encontrada no catálogo canônico local.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/5 bg-black/40 flex items-center justify-between text-[11px] text-gray-500 font-open-sans">
                        <span>Pressione <strong>ESC</strong> para sair ou clique fora do modal.</span>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bukra text-xs transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
