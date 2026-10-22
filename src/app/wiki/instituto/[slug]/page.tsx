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


import React, { useState, useEffect } from 'react';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { institutoData, Laboratory, Researcher } from '@/data/institutoData';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Reusing icons from Lucide for consistency with the project
import { 
    ChevronLeft as ChevronLeftIcon, 
    ChevronDown as ChevronDownIcon,
    ExternalLink as ExternalLinkIcon,
    Users as UsersIcon,
    FlaskConical as ScienceIcon,
    Atom as ResearchIcon
} from 'lucide-react';

export default function DepartmentWikiPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const department = institutoData[slug.toLowerCase()];
    const [activeSection, setActiveSection] = useState('info');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!department) {
        return (
            <MainLayoutWrapper>
                <div className="flex flex-col items-center justify-center py-40">
                    <h1 className="text-4xl font-black text-gray-300 uppercase">404</h1>
                    <p className="text-gray-500 mt-2 font-bold">Departamento não encontrado no Grafo.</p>
                    <Link href="/gcif/instituto" className="mt-8 text-brand-blue font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <ChevronLeftIcon className="w-4 h-4" /> Voltar ao Instituto
                    </Link>
                </div>
            </MainLayoutWrapper>
        );
    }

    return (
        <MainLayoutWrapper>
            <div className="flex flex-col w-full pb-20">
                {/* 1. Header & Breadcrumbs */}
                <div className="mb-8">
                    <Link
                        href="/gcif/instituto"
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-blue transition-colors w-fit mb-6 group"
                    >
                        <ChevronLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        O Instituto / {department.sigla}
                    </Link>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                Departamento • {department.sigla}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                            {department.nome}
                        </h1>
                        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed">
                            {department.descricao}
                        </p>
                    </motion.div>
                </div>

                {/* 2. Sticky Navigation Bar */}
                <div className={`sticky top-0 z-40 -mx-4 px-4 py-2 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm' : ''}`}>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {[
                            { id: 'laboratorios', label: 'Laboratórios', icon: <ScienceIcon className="w-4 h-4" /> },
                            { id: 'pesquisadores', label: 'Pesquisadores', icon: <UsersIcon className="w-4 h-4" /> },
                            { id: 'linhas', label: 'Linhas de Pesquisa', icon: <ResearchIcon className="w-4 h-4" /> }
                        ].map((nav) => (
                            <button
                                key={nav.id}
                                onClick={() => {
                                    setActiveSection(nav.id);
                                    const element = document.getElementById(nav.id);
                                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                                    ${activeSection === nav.id 
                                        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30' 
                                        : 'text-gray-500 hover:text-brand-red hover:bg-brand-red/5'
                                    }`}
                            >
                                {nav.icon}
                                {nav.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 3. Sections */}
                <div className="mt-16 space-y-32">
                    {/* Laboratórios Section */}
                    <SectionWrapper id="laboratorios" title="Laboratórios de Pesquisa" icon={<ScienceIcon className="w-6 h-6" />} color="brand-red">
                        <div className="grid grid-cols-1 gap-4">
                            {department.laboratorios.map((lab, idx) => (
                                <LabAccordion key={lab.id} lab={lab} index={idx} />
                            ))}
                        </div>
                    </SectionWrapper>

                    {/* Pesquisadores Section */}
                    <SectionWrapper id="pesquisadores" title="Corpo Docente & Pesquisa" icon={<UsersIcon className="w-6 h-6" />} color="brand-yellow">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                            {department.pesquisadores.map((res, idx) => (
                                <ResearcherCard key={res.id} researcher={res} index={idx} />
                            ))}
                        </div>
                    </SectionWrapper>

                    {/* Linhas de Pesquisa Section */}
                    <SectionWrapper id="linhas" title="Linhas de Pesquisa" icon={<ResearchIcon className="w-6 h-6" />} color="brand-blue">
                        <div className="flex flex-wrap gap-3">
                            {department.linhasPesquisa.map((linha, idx) => (
                                <motion.span 
                                    key={linha}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="px-6 py-3 bg-white dark:bg-card-dark border-2 border-gray-100 dark:border-white/5 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-brand-blue/30 hover:text-brand-blue transition-all cursor-default"
                                >
                                    {linha}
                                </motion.span>
                            ))}
                        </div>
                    </SectionWrapper>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}

function SectionWrapper({ id, title, icon, color, children }: { id: string, title: string, icon: React.ReactNode, color: string, children: React.ReactNode }) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-10">
                <div className={`w-12 h-12 rounded-2xl bg-${color}/10 border border-${color}/20 flex items-center justify-center text-${color}`}>
                    {icon}
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter italic">
                    {title}
                </h2>
                <div className="h-[1px] flex-grow bg-gray-100 dark:bg-white/5 ml-4"></div>
            </div>
            {children}
        </section>
    );
}

function LabAccordion({ lab, index }: { lab: Laboratory, index: number }) {
    const [isOpen, setIsOpen] = useState(index === 0);

    return (
        <div className="group">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-left
                    ${isOpen ? 'border-brand-red bg-brand-red/5' : 'border-gray-100 dark:border-white/5 bg-white dark:bg-card-dark hover:border-brand-red/30'}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isOpen ? 'bg-brand-red text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                        {String(index + 1).padStart(2, '0')}
                    </div>
                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-red transition-colors">
                        {lab.nome}
                    </h4>
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-red' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-8 pb-10 text-gray-500 dark:text-gray-400 leading-relaxed bg-white/50 dark:bg-card-dark/30 rounded-b-2xl -mt-4 border-x-2 border-b-2 border-brand-red/10">
                            <p className="mb-6">{lab.description}</p>
                            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-red hover:underline">
                                <ExternalLinkIcon className="w-3 h-3" /> Acessar Página do Laboratório
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function ResearcherCard({ researcher, index }: { researcher: Researcher, index: number }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex flex-col items-center p-6 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-yellow/30 transition-all text-center"
        >
            <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-brand-yellow rounded-full blur-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-card-dark shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                    {researcher.avatar ? (
                        <Image src={researcher.avatar} alt={researcher.nome} fill className="object-cover" />
                    ) : (
                        <span className="text-2xl font-black text-gray-400 uppercase tracking-tighter">
                            {researcher.iniciais}
                        </span>
                    )}
                </div>
            </div>
            <h5 className="font-bold text-gray-900 dark:text-white leading-tight mb-1">
                {researcher.nome}
            </h5>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                {researcher.role}
            </p>
            <a 
                href={researcher.lattes} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-brand-yellow hover:bg-brand-yellow/10 transition-all flex items-center gap-2 text-[9px] font-black uppercase tracking-widest"
            >
                <ExternalLinkIcon className="w-3 h-3" /> Currículo Lattes
            </a>
        </motion.div>
    );
}
