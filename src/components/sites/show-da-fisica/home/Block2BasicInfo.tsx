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
import { BookOpen, MapPin, Clock, ArrowRight, Layers } from 'lucide-react';

export function Block2BasicInfo() {
    const pillars = [
        {
            icon: BookOpen,
            title: 'Conceito e Criação',
            desc: 'Formação de centenas de monitores com habilidades em ciências, comunicação e mediação. Transposição de limites frios da sala de aula para um palco rico de estímulos.',
            borderClass: 'neon-border-green',
            textClass: 'neon-text-green',
            iconColor: 'text-[#009900] dark:text-[#01f300]',
            iconShadow: 'drop-shadow-[0_0_10px_rgba(1,243,0,0.4)]',
        },
        {
            icon: MapPin,
            title: 'História e Localização',
            desc: 'Realizado desde os anos 90 no IFUSP, instalado no histórico Auditório Alessandro Volta (Praça do Relógio / R. do Matão, Travessa R, 187 - Cidade Universitária).',
            borderClass: 'neon-border-blue',
            textClass: 'neon-text-blue',
            iconColor: 'text-[#002ffe] dark:text-[#38bdf8]',
            iconShadow: 'drop-shadow-[0_0_10px_rgba(0,47,254,0.4)]',
        },
        {
            icon: Clock,
            title: 'Dinâmica das Sessões',
            desc: 'Sessões regulares às Terças, Quartas e Quintas-feiras nos turnos 10:00 e 14:00, com duração de 2 horas e atendimento a caravanas de até 120 alunos.',
            borderClass: 'neon-border-red',
            textClass: 'neon-text-red',
            iconColor: 'text-[#f60011]',
            iconShadow: 'drop-shadow-[0_0_10px_rgba(246,0,17,0.4)]',
        },
    ];

    return (
        <section className="py-20 border-b-2 border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-blue mb-4">
                        Nossa Trajetória e Proposta
                    </h2>
                    <p className="text-base sm:text-lg font-sans text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Conheça os fundamentos pedagógicos, a estrutura das apresentações e o espaço no Instituto de Física da USP.
                    </p>
                </div>

                {/* 3 Blocos de Pilares com Borda Neon e Fundo Preto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {pillars.map((p, idx) => {
                        const Icon = p.icon;
                        return (
                            <div
                                key={idx}
                                className={`bg-white dark:bg-black p-8 ${p.borderClass} shadow-lg dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 rounded-none`}
                            >
                                <Icon className={`w-14 h-14 ${p.iconColor} ${p.iconShadow} mb-6 group-hover:scale-110 transition-transform`} />
                                <h3 className={`text-xl font-bold mb-4 uppercase tracking-wider ${p.textClass}`}>
                                    {p.title}
                                </h3>
                                <p className="font-sans text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {p.desc}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Card de Gancho para o Catálogo de Experimentos com Visual Neon */}
                <div className="p-8 sm:p-10 bg-white dark:bg-black neon-border-blue flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl rounded-none">
                    <div className="space-y-2 text-center sm:text-left">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] font-bold block">
                            Catálogo Completo de Demonstrações
                        </span>
                        <h4 className="text-2xl sm:text-3xl font-black uppercase text-gray-950 dark:text-white tracking-wider">
                            Explore Nossos Experimentos
                        </h4>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-300 max-w-xl">
                            Consulte explicações físicas adaptadas, curiosidades, vídeos e o status operacional da bancada do Show de Física.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <Link
                            href="/conheca"
                            className="px-6 py-4 border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors text-center"
                        >
                            Conhecer História
                        </Link>
                        <Link
                            href="/experimentos"
                            className="px-8 py-4 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] font-bold text-xs uppercase tracking-widest hover:bg-[#01f300] hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all text-center flex items-center justify-center gap-2"
                        >
                            <span>Ver Experimentos</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
