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
import { ArrowRight, Newspaper } from 'lucide-react';

interface NewsItem {
    id: string;
    slug: string;
    title: string;
    summary: string;
    category: 'noticia' | 'evento' | 'oportunidade' | 'edital';
    date: string;
    badgeText: string;
    borderClass: string;
    titleClass: string;
}

const DEFAULT_NEWS: NewsItem[] = [
    {
        id: 'news-1',
        slug: 'edital-selecao-monitores-2026',
        title: 'Edital Aberto: Seleção de Novos Monitores Bolsistas (PUB & AEx 2026)',
        summary: 'Estudantes de graduação do IFUSP e de cursos de exatas da USP podem se inscrever para a equipe de apresentação.',
        category: 'edital',
        date: 'Novembro 2026',
        badgeText: 'Edital de Monitoria',
        borderClass: 'neon-border-red',
        titleClass: 'neon-text-red',
    },
    {
        id: 'news-2',
        slug: 'virada-cientifica-ifusp',
        title: 'Show de Física na Virada Científica com Sessões Noturnas Especiais',
        summary: 'Apresentações temáticas de óptica e eletricidade sem fio com a Bobina de Tesla iluminando o auditório à noite.',
        category: 'evento',
        date: 'Próxima Sexta',
        badgeText: 'Evento Especial',
        borderClass: 'neon-border-blue',
        titleClass: 'neon-text-blue',
    },
    {
        id: 'news-3',
        slug: 'novo-aparato-vortice',
        title: 'Novo Canhão de Vórtices Toroidais Entra em Operação na Bancada',
        summary: 'Após três semanas de testes na oficina do IF, o aparato reformulado amplia a precisão dos anéis de fumaça.',
        category: 'noticia',
        date: 'Recente',
        badgeText: 'Oficina Técnica',
        borderClass: 'neon-border-green',
        titleClass: 'neon-text-green',
    },
];

export function Block6NewsEventsMural() {
    return (
        <section className="py-20 border-b-2 border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-blue mb-3">
                            Eventos, Oportunidades & Notícias
                        </h2>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-300">
                            Avisos institucionais, editais de bolsas de monitoria e novidades da bancada do IFUSP.
                        </p>
                    </div>

                    <Link
                        href="/noticias-e-eventos"
                        className="inline-flex items-center gap-2 text-xs font-mono uppercase font-bold tracking-widest text-[#002ffe] dark:text-[#38bdf8] hover:underline"
                    >
                        <span>Ver Todas as Notícias</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {DEFAULT_NEWS.map((item) => (
                        <Link
                            key={item.id}
                            href={`/noticias-e-eventos/${item.slug}`}
                            className={`p-8 bg-white dark:bg-black ${item.borderClass} flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 rounded-none shadow-lg dark:shadow-none`}
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-current text-gray-700 dark:text-gray-300">
                                        {item.badgeText}
                                    </span>
                                    <span className="text-[11px] font-mono text-gray-400">
                                        {item.date}
                                    </span>
                                </div>

                                <h3 className={`text-lg font-bold uppercase tracking-wider leading-snug ${item.titleClass}`}>
                                    {item.title}
                                </h3>

                                <p className="text-xs font-sans text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.summary}
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-[#002ffe] dark:group-hover:text-[#38bdf8]">
                                <span>Ler Artigo</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
