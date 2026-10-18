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
import Link from 'next/link';
import { Sparkles, Palette, Laptop, MessageSquare, Users2, ArrowRight, CheckCircle2, Zap, Rocket, ShieldCheck } from 'lucide-react';

interface ComoLabDivAjudaSectionProps {
    onRequestPartnership: () => void;
}

export function ComoLabDivAjudaSection({ onRequestPartnership }: ComoLabDivAjudaSectionProps) {
    const pillars = [
        {
            icon: <Palette className="w-6 h-6 text-[#FFCC00]" />,
            title: "Identidade Visual & Mídia",
            description: "Criação de marcas, design de apresentações, pôsteres para conferências e peças de alta qualidade para redes sociais, fortalecendo a presença do seu grupo.",
            color: "border-[#FFCC00]/30 bg-[#FFCC00]/5",
            textColor: "text-[#FFCC00]"
        },
        {
            icon: <Laptop className="w-6 h-6 text-[#0F4780]" />,
            title: "Plataformas Digitais & Software",
            description: "Desenvolvimento de páginas web interativas, sistemas de agendamento, aplicativos de demonstração científica e ferramentas educativas sob medida.",
            color: "border-[#0F4780]/40 bg-[#0F4780]/10",
            textColor: "text-brand-blue"
        },
        {
            icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
            title: "Tradução de Linguagem Científica",
            description: "Adaptação de conceitos complexos para linguagens acessíveis (jovem, nerd/geek, leiga), permitindo que seu conteúdo chegue a escolas e à sociedade.",
            color: "border-emerald-500/30 bg-emerald-500/5",
            textColor: "text-emerald-400"
        },
        {
            icon: <Users2 className="w-6 h-6 text-[#F14343]" />,
            title: "Captação de Talentos & Match",
            description: "Conexão direta com graduandos e pós-graduandos engajados no HUB para atuação como monitores, bolsistas PUB e pesquisadores de Iniciação Científica.",
            color: "border-[#F14343]/30 bg-[#F14343]/5",
            textColor: "text-[#F14343]"
        }
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-500">
            {/* Header da Seção */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-[10px] font-black uppercase tracking-widest font-bukra">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ecossistema LabDiv
                </div>
                <h2 className="text-3xl md:text-5xl font-bukra font-bold text-white uppercase tracking-tight">
                    Como o <span className="text-brand-yellow">LabDiv</span> Pode Impulsionar seu Projeto
                </h2>
                <p className="text-sm md:text-base text-gray-300 font-open-sans leading-relaxed">
                    O Laboratório de Comunicação e Divulgação Científica do IFUSP oferece suporte técnico, de design e articulação comunitária para iniciativas científicas, projetos de extensão e laboratórios de pesquisa.
                </p>
            </div>

            {/* Case de Sucesso em Destaque: Show da Física */}
            <div className="glass-card rounded-[36px] border border-[#FFCC00]/40 bg-gradient-to-br from-[#1E1E1E] via-[#1E1E1E] to-[#FFCC00]/10 p-8 md:p-10 relative overflow-hidden shadow-2xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFCC00]/10 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none group-hover:bg-[#FFCC00]/15 transition-all duration-700" />
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFCC00]/20 text-[#FFCC00] text-[10px] font-black uppercase tracking-wider font-bukra border border-[#FFCC00]/30">
                            <Zap className="w-3.5 h-3.5 fill-current" />
                            Case Real de Sucesso: Show da Física
                        </div>
                        <h3 className="text-2xl md:text-4xl font-bukra font-bold text-white uppercase tracking-tight">
                            Da bancada ao ecossistema digital interativo
                        </h3>
                        <p className="text-sm md:text-base text-gray-300 font-open-sans leading-relaxed">
                            O tradicional <strong>Show da Física</strong> do IFUSP uniu forças com o LabDiv para modernizar sua identidade visual, estruturar o sistema interativo <em>Monte seu Show</em> (onde o público e professores escolhem experimentos em tempo real) e recrutar uma nova geração de monitores pelo HUB.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[10px] font-black text-[#FFCC00] uppercase font-bukra block">Plataforma Web</span>
                                <span className="text-xs text-gray-300 font-open-sans">Sessões interativas e escolha de experimentos</span>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[10px] font-black text-[#0F4780] uppercase font-bukra block">Identidade Visual</span>
                                <span className="text-xs text-gray-300 font-open-sans">Padrão visual marcante, cartazes e crachás</span>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[10px] font-black text-emerald-400 uppercase font-bukra block">Captação Monitores</span>
                                <span className="text-xs text-gray-300 font-open-sans">Integração com alunos via Match Acadêmico</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col items-center justify-center space-y-4 text-center p-6 bg-black/40 rounded-3xl border border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-[#FFCC00]/20 text-[#FFCC00] flex items-center justify-center shadow-lg">
                            <Rocket className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-black uppercase text-white font-bukra block">Experiência Completa</span>
                            <span className="text-[11px] text-gray-400 font-open-sans">Veja na prática o que o LabDiv construiu para o Show da Física</span>
                        </div>
                        <Link
                            href="/iniciativas/show-da-fisica"
                            className="w-full py-3 px-4 bg-[#FFCC00] text-black font-bukra font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#FFCC00]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FFCC00]/20 hover:scale-105"
                        >
                            <span>Ver Show da Física</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Os 4 Pilares de Apoio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pillars.map((pillar, idx) => (
                    <div 
                        key={idx}
                        className={`p-6 rounded-3xl border ${pillar.color} backdrop-blur-sm space-y-4 hover:border-white/30 transition-all duration-300`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-black/40 rounded-2xl border border-white/10">
                                {pillar.icon}
                            </div>
                            <h4 className={`text-xl font-bukra font-bold uppercase tracking-tight ${pillar.textColor}`}>
                                {pillar.title}
                            </h4>
                        </div>
                        <p className="text-sm text-gray-300 font-open-sans leading-relaxed">
                            {pillar.description}
                        </p>
                    </div>
                ))}
            </div>

            {/* Banner de CTA para Proposta de Parceria */}
            <div className="glass-card rounded-[32px] border border-white/10 bg-[#1E1E1E] p-8 md:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
                <div className="max-w-2xl mx-auto space-y-3">
                    <h3 className="text-2xl md:text-4xl font-bukra font-bold text-white uppercase tracking-tight">
                        Quer levar seu projeto para o próximo nível?
                    </h3>
                    <p className="text-sm md:text-base text-gray-400 font-open-sans leading-relaxed">
                        Seja para criar o site do seu laboratório, desenvolver um aplicativo para uma disciplina, produzir materiais de extensão ou atrair bolsistas, o LabDiv está de portas abertas.
                    </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <button
                        onClick={onRequestPartnership}
                        className="px-8 py-4 bg-brand-yellow text-black font-bukra font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-brand-yellow/20 flex items-center gap-2"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Solicitar Parceria / Apoio do LabDiv</span>
                    </button>
                    <Link
                        href="/iniciativas/show-da-fisica"
                        className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bukra font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all flex items-center gap-2"
                    >
                        <span>Explorar Projetos no HUB</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
