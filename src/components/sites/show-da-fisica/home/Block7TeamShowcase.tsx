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
import { Shield, ArrowRight, GraduationCap } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

interface TeamMember {
    name: string;
    role: string;
    course: string;
    tag: string;
    borderClass: string;
    textClass: string;
}

const DEFAULT_TEAM: TeamMember[] = [
    {
        name: 'Coordenação Docente',
        role: 'Professores Coordenadores IFUSP',
        course: 'Instituto de Física da Universidade de São Paulo',
        tag: 'Coordenação',
        borderClass: 'neon-border-blue',
        textClass: 'neon-text-blue',
    },
    {
        name: 'Monitores de Palco',
        role: 'Apresentadores & Mediadores Científicos',
        course: 'Graduandos em Física (Bacharelado & Licenciatura)',
        tag: 'Bolsistas PUB / AEx',
        borderClass: 'neon-border-green',
        textClass: 'neon-text-green',
    },
    {
        name: 'Oficina Mecânica & Apoio',
        role: 'Manutenção de Aparatos & Alta Tensão',
        course: 'Corpo Técnico Especializado IFUSP',
        tag: 'Apoio Técnico',
        borderClass: 'neon-border-red',
        textClass: 'neon-text-red',
    },
];

export function Block7TeamShowcase() {
    const { user, profile } = useAuth();

    const isMemberOrAdmin = Boolean(
        profile?.role === 'admin' ||
        profile?.role === 'moderator' ||
        user?.role === 'admin' ||
        (Array.isArray(profile?.member_initiatives) && profile.member_initiatives.includes('show_da_fisica'))
    );

    return (
        <section className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-red mb-4">
                        Equipe do Show de Física
                    </h2>
                    <p className="text-base sm:text-lg font-sans text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Docentes, graduandos bolsistas e técnicos dedicados à comunicação pública da física no palco do auditório Alessandro Volta.
                    </p>
                </div>

                {/* 3 Blocos da Equipe com Bordas Neon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {DEFAULT_TEAM.map((member, idx) => (
                        <div
                            key={idx}
                            className={`p-8 bg-white dark:bg-black ${member.borderClass} text-center flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 rounded-none shadow-lg dark:shadow-none`}
                        >
                            <div>
                                <div className="w-16 h-16 mx-auto mb-6 bg-white dark:bg-black border border-current flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8 text-current" />
                                </div>

                                <span className="inline-block px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-widest border border-current mb-4">
                                    {member.tag}
                                </span>

                                <h3 className={`text-xl font-bold uppercase tracking-wider mb-2 ${member.textClass}`}>
                                    {member.name}
                                </h3>

                                <p className="text-xs font-mono font-semibold uppercase text-gray-700 dark:text-gray-300 mb-2">
                                    {member.role}
                                </p>

                                <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                                    {member.course}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bloco de Entrada para os Bastidores /painel */}
                <div className="p-8 sm:p-12 bg-white dark:bg-black neon-border-blue flex flex-col md:flex-row items-center justify-between gap-8 rounded-none">
                    <div className="flex items-center gap-5 text-center md:text-left">
                        <div className="w-14 h-14 bg-black neon-border-green flex items-center justify-center shrink-0">
                            <Shield className="w-7 h-7 text-[#01f300]" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white tracking-wider">
                                Gestão & Bastidores da Equipe
                            </h4>
                            <p className="text-xs font-sans text-gray-600 dark:text-gray-300">
                                {isMemberOrAdmin
                                    ? "Acesso autenticado aos módulos de radar, escalas de apresentação, estoque de aparatos e moderação do telão ao vivo."
                                    : "Área exclusiva para monitores, técnicos e coordenação credenciada do Show de Física IFUSP."}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/painel"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] font-black text-xs uppercase tracking-widest hover:bg-[#01f300] hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all rounded-none shrink-0"
                    >
                        <span>Acessar Bastidores</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
