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

import React, { useState, useEffect, useRef } from 'react';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { apresentacaoData } from '@/data/apresentacaoData';
import { ArrowLeft, BookOpen, ChevronRight, Layout, Info } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function ApresentacaoClient() {
    const [activeSection, setActiveSection] = useState<string>(apresentacaoData.sections[0].id);
    const sectionRefs = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
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
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const RightSidebar = () => (
        <div className="sticky top-20 flex flex-col gap-4">
            <div className="glass-card rounded-3xl p-6 border-brand-blue/10">
                <h3 className="font-black uppercase tracking-widest text-xs text-brand-blue flex items-center gap-2 mb-6">
                    <BookOpen className="w-4 h-4" /> Sumário
                </h3>
                <nav className="flex flex-col gap-3">
                    {apresentacaoData.sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`text-left text-sm font-medium transition-all flex items-center gap-2 ${
                                activeSection === section.id 
                                    ? 'text-brand-yellow font-bold translate-x-2' 
                                    : 'text-gray-500 hover:text-white hover:translate-x-1'
                            }`}
                        >
                            <ChevronRight className={`w-3 h-3 transition-opacity ${activeSection === section.id ? 'opacity-100' : 'opacity-0'}`} />
                            {section.title}
                        </button>
                    ))}
                </nav>
            </div>
            
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
            <div className="max-w-4xl mx-auto px-4 py-12 pb-32">
                
                {/* Hero */}
                <div className="mb-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-black uppercase tracking-widest mb-8">
                        <Info className="w-4 h-4" />
                        Documento Institucional Oficial
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 uppercase italic leading-none">
                        {apresentacaoData.title}
                    </h1>
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-400 mb-8">
                        {apresentacaoData.subtitle}
                    </h2>

                    <div className="glass-card rounded-3xl p-8 md:p-12 text-left relative overflow-hidden border-brand-blue/20">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-medium relative z-10">
                            {apresentacaoData.intro}
                        </p>
                    </div>
                    
                    {/* Imagem do Ícone Oficial do HUB */}
                    <div className="mt-16 rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative bg-white p-8 max-w-md mx-auto flex items-center justify-center">
                         <Image 
                            src="/icone-HUBLabDiv-white.png" 
                            alt="Ícone Oficial HUB LabDiv" 
                            width={512} 
                            height={512} 
                            className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                            priority
                        />
                    </div>

                    {/* Créditos */}
                    <div className="mt-8 max-w-2xl mx-auto text-center text-sm font-medium tracking-wide">
                        <p className="mb-1 text-gray-300">Projeto de João Stangorlini - Licenciatura em física</p>
                        <p className="mb-1 text-gray-500">desenvolvido pelo Laboratório de Divulgação do IFUSP.</p>
                        <p className="text-gray-500">Orientado por Caetano Miranda (coordenador do LabDiv)</p>
                    </div>
                </div>

                {/* Seções de Conteúdo */}
                <div className="space-y-24">
                    {apresentacaoData.sections.map((section, index) => {
                        const themeMap = [
                            { text: 'text-brand-blue', border: 'border-brand-blue/20', hover: 'hover:border-brand-blue/20', bg: 'bg-brand-blue/10' },
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
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className={`text-3xl md:text-4xl font-bold uppercase italic tracking-tighter ${theme.text}`}>
                                        {section.title}
                                    </h3>
                                    <div className={`h-px ${theme.bg} flex-1`}></div>
                                </div>

                                {section.id === 'sumario' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                        {apresentacaoData.sections.filter(s => s.id !== 'sumario' && s.id !== 'guia-leitura').map((s, i) => (
                                            <button
                                                key={s.id}
                                                onClick={() => scrollToSection(s.id)}
                                                className={`text-left bg-[#11141a] hover:bg-white/5 border border-white/5 p-4 rounded-2xl transition-all text-gray-300 hover:text-white font-medium flex items-center gap-4 group ${theme.hover}`}
                                            >
                                                <div className={`w-10 h-10 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-sm font-black transition-transform group-hover:scale-110 ${theme.text}`}>
                                                    {i + 1}
                                                </div>
                                                <span className="line-clamp-2">{s.title.replace(/^\d+\.\s*/, '')}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {section.paragraphs && (
                                    <div className="space-y-6 mb-8">
                                        {section.paragraphs.map((para, i) => (
                                            <p key={i} className="text-gray-400 text-lg leading-relaxed font-medium">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {section.content && (
                                    <div className="grid gap-6">
                                        {section.content.map((item, i) => (
                                            <div key={i} className={`glass-card rounded-2xl p-6 border-white/5 transition-colors ${theme.hover}`}>
                                                <h4 className={`${theme.text} font-bold text-lg mb-2`}>{item.subtitle}</h4>
                                                <p className="text-gray-300 leading-relaxed">{item.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        );
                    })}
                </div>

            </div>
        </MainLayoutWrapper>
    );
}
