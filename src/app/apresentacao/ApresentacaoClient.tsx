'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { apresentacaoData } from '@/data/apresentacaoData';
import { ArrowLeft, BookOpen, ChevronRight, Info, Presentation, GraduationCap, FileText, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlanoAulaSlideViewer } from './components/PlanoAulaSlideViewer';
import { HubSlideViewer } from './components/HubSlideViewer';

export function ApresentacaoClient() {
    const [viewMode, setViewMode] = useState<'hub-slides' | 'hub-text' | 'plano-aula'>('hub-slides');
    const [activeSection, setActiveSection] = useState<string>(apresentacaoData.sections[0].id);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        if (viewMode !== 'hub-text') return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -80% 0px' }
        );

        sectionRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [viewMode]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    // Right Sidebar
    const RightSidebar = () => (
        <div className="sticky top-20 flex flex-col gap-4">
            {viewMode === 'hub-text' ? (
                <div className="glass-card rounded-3xl p-6 border-brand-blue/10">
                    <h3 className="font-black uppercase tracking-widest text-xs text-brand-blue flex items-center gap-2 mb-6">
                        <BookOpen className="w-4 h-4" /> Sumário HUB
                    </h3>
                    <nav className="flex flex-col gap-3 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-brand-blue/30 pr-1">
                        {apresentacaoData.sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.id)}
                                className={`text-left text-xs font-medium transition-all flex items-center gap-2 ${
                                    activeSection === section.id 
                                        ? 'text-brand-yellow font-bold translate-x-2' 
                                        : 'text-gray-400 hover:text-white hover:translate-x-1'
                                }`}
                            >
                                <ChevronRight className={`w-3 h-3 transition-opacity ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`} />
                                {section.title}
                            </button>
                        ))}
                    </nav>
                </div>
            ) : (
                <div className="glass-card rounded-3xl p-6 border-white/5 space-y-4">
                    <div className="flex items-center gap-3 text-brand-yellow">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="font-extrabold text-sm uppercase tracking-wider text-white">Navegação Rápida</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        {viewMode === 'hub-slides'
                            ? 'Apresentação Interativa em Slides do HUB LabDiv (Institucional).' 
                            : 'Apresentação Interativa em Slides do Plano de Aula (Processos Criativos & Paulo Freire).'}
                    </p>
                </div>
            )}
            
            <Link href="/sobre?tab=sobre" className="glass-card rounded-3xl p-6 border-white/5 hover:border-white/20 transition-colors flex flex-col items-center justify-center text-center group">
                <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors mb-2 group-hover:-translate-x-1" />
                <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Voltar para o HUB</span>
            </Link>
        </div>
    );

    return (
        <MainLayoutWrapper
            rightSidebar={<RightSidebar />}
            fullWidth={true}
        >
            <div className="max-w-5xl mx-auto px-4 py-8 pb-32">
                
                {/* Switch / Toggle Control Bar */}
                <div className="mb-10 flex flex-col items-center gap-3">
                    <div className="bg-[#14171F] p-1.5 rounded-full border border-white/10 shadow-2xl inline-flex items-center gap-1 flex-wrap justify-center">
                        
                        {/* Option 1: Apresentação do HUB (Slides) */}
                        <button
                            onClick={() => setViewMode('hub-slides')}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                                viewMode === 'hub-slides'
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30 scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <Presentation className="w-4 h-4" />
                            Apresentação HUB (Slides)
                        </button>

                        {/* Option 2: Apresentação do HUB (Texto) */}
                        <button
                            onClick={() => setViewMode('hub-text')}
                            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                                viewMode === 'hub-text'
                                    ? 'bg-brand-blue/80 text-white shadow-lg shadow-brand-blue/30 scale-105'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <FileText className="w-4 h-4" />
                            Apresentação HUB (Texto)
                        </button>
                    </div>
                </div>

                {/* VIEW MODES */}
                {viewMode === 'hub-slides' && (
                    <div className="space-y-12">
                        <HubSlideViewer />

                        {/* Button linking to Plano de Aula Slides Below */}
                        <div className="glass-card p-8 rounded-3xl border border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/10 via-black/40 to-brand-blue/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Plano de Aula Prática (120 min)
                                </div>
                                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                                    Ver Apresentação em Slides do Plano de Aula
                                </h3>
                                <p className="text-xs text-gray-300 mt-1">
                                    Processos Criativos, Fotografia, Webdesign & Páginas do Livro de Paulo Freire
                                </p>
                            </div>
                            <button
                                onClick={() => setViewMode('plano-aula')}
                                className="px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-[#e6b800] text-black font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 shrink-0"
                            >
                                <span>Abrir Slides do Plano de Aula</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === 'hub-text' && (
                    <div className="space-y-12">
                        {/* Document Hero Header */}
                        <div className="text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-black uppercase tracking-widest mb-6 border border-brand-yellow/30">
                                <Info className="w-4 h-4" />
                                Documento Institucional Oficial (Texto Completo)
                            </div>
                            
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 uppercase italic leading-none">
                                {apresentacaoData.title}
                            </h1>
                            
                            <h2 className="text-xl md:text-2xl font-bold text-brand-yellow mb-8">
                                {apresentacaoData.subtitle}
                            </h2>

                            <div className="glass-card rounded-3xl p-8 md:p-10 text-left relative overflow-hidden border-brand-blue/20">
                                <p className="text-base md:text-lg text-gray-200 leading-relaxed font-medium relative z-10">
                                    {apresentacaoData.intro}
                                </p>
                            </div>
                            
                            {/* Official HUB Icon */}
                            <div className="mt-12 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-white p-6 max-w-xs mx-auto flex items-center justify-center">
                                <Image 
                                    src="/icone-HUBLabDiv-white.png" 
                                    alt="Ícone Oficial HUB LabDiv" 
                                    width={512} 
                                    height={512} 
                                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                                    priority
                                />
                            </div>

                            {/* Credits */}
                            <div className="mt-6 max-w-2xl mx-auto text-center text-xs font-medium tracking-wide text-gray-400">
                                <p className="mb-1 text-gray-200 font-semibold">Projeto de João Stangorlini — Licenciatura em Física</p>
                                <p className="mb-1">Desenvolvido pelo Laboratório de Divulgação do IFUSP.</p>
                                <p>Orientado por Prof. Caetano Miranda (Coordenador do LabDiv)</p>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <div className="space-y-16">
                            {apresentacaoData.sections.map((section, index) => {
                                const themeMap = [
                                    { text: 'text-brand-blue-accent', border: 'border-brand-blue/20', hover: 'hover:border-brand-blue/20', bg: 'bg-brand-blue/10' },
                                    { text: 'text-brand-yellow', border: 'border-brand-yellow/20', hover: 'hover:border-brand-yellow/20', bg: 'bg-brand-yellow/10' },
                                    { text: 'text-brand-red', border: 'border-brand-red/20', hover: 'hover:border-brand-red/20', bg: 'bg-brand-red/10' },
                                ];
                                const theme = themeMap[index % 3];

                                return (
                                    <section 
                                        key={section.id} 
                                        id={section.id}
                                        ref={(el) => { sectionRefs.current[index] = el; }}
                                        className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-5 duration-700"
                                    >
                                        <div className="flex items-center gap-4 mb-6">
                                            <h3 className={`text-2xl md:text-3xl font-extrabold uppercase italic tracking-tighter ${theme.text}`}>
                                                {section.title}
                                            </h3>
                                            <div className={`h-px ${theme.bg} flex-1`}></div>
                                        </div>

                                        {section.id === 'sumario' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                                {apresentacaoData.sections.filter(s => s.id !== 'sumario' && s.id !== 'guia-leitura').map((s, i) => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => scrollToSection(s.id)}
                                                        className={`text-left bg-[#11141a] hover:bg-white/5 border border-white/10 p-4 rounded-2xl transition-all text-gray-300 hover:text-white font-medium flex items-center gap-4 group ${theme.hover}`}
                                                    >
                                                        <div className={`w-9 h-9 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-xs font-black transition-transform group-hover:scale-110 ${theme.text}`}>
                                                            {i + 1}
                                                        </div>
                                                        <span className="line-clamp-2 text-xs">{s.title.replace(/^\d+\.\s*/, '')}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        {section.paragraphs && (
                                            <div className="space-y-4 mb-6">
                                                {section.paragraphs.map((para, i) => (
                                                    <p key={i} className="text-gray-300 text-base leading-relaxed font-medium">
                                                        {para}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {section.content && (
                                            <div className="grid gap-4">
                                                {section.content.map((item, i) => (
                                                    <div key={i} className={`glass-card rounded-2xl p-5 border-white/10 transition-colors ${theme.hover}`}>
                                                        <h4 className={`${theme.text} font-bold text-base mb-2`}>{item.subtitle}</h4>
                                                        <p className="text-gray-300 leading-relaxed text-sm">{item.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                );
                            })}
                        </div>

                        {/* Button linking to Plano de Aula Slides Below */}
                        <div className="glass-card p-8 rounded-3xl border border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/10 via-black/40 to-brand-blue/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Plano de Aula Prática (120 min)
                                </div>
                                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                                    Ver Apresentação em Slides do Plano de Aula
                                </h3>
                                <p className="text-xs text-gray-300 mt-1">
                                    Processos Criativos, Fotografia, Webdesign & Páginas do Livro de Paulo Freire
                                </p>
                            </div>
                            <button
                                onClick={() => setViewMode('plano-aula')}
                                className="px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-[#e6b800] text-black font-black text-xs uppercase tracking-wider transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 shrink-0"
                            >
                                <span>Abrir Slides do Plano de Aula</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {viewMode === 'plano-aula' && (
                    <div className="space-y-12">
                        <PlanoAulaSlideViewer />

                        {/* Button linking back to Apresentação do HUB Slides Below */}
                        <div className="glass-card p-8 rounded-3xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-black/40 to-brand-yellow/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2">
                                    <Presentation className="w-3.5 h-3.5" />
                                    Apresentação Institucional HUB
                                </div>
                                <h3 className="text-xl md:text-2xl font-extrabold text-white">
                                    Ver Apresentação Institucional do HUB LabDiv
                                </h3>
                                <p className="text-xs text-gray-300 mt-1">
                                    Super App, Arquitetura, Objetivos Estratégicos & Licenciamento AGPLv3
                                </p>
                            </div>
                            <button
                                onClick={() => setViewMode('hub-slides')}
                                className="px-6 py-3.5 rounded-2xl bg-brand-blue hover:bg-[#0c3866] text-white font-black text-xs uppercase tracking-wider border border-brand-blue/50 transition-all transform hover:scale-105 active:scale-95 shadow-xl flex items-center gap-2 shrink-0"
                            >
                                <span>Abrir Slides do HUB</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </MainLayoutWrapper>
    );
}
