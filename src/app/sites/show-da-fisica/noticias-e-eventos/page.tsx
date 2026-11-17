import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Notícias, Eventos & Oportunidades',
    description: 'Acompanhe as novidades, editais de seleção de monitores bolsistas e eventos do Show de Física IFUSP.',
};

const NEWS_ITEMS = [
    {
        slug: 'edital-selecao-monitores-2026',
        title: 'Edital Aberto: Seleção de Novos Monitores Bolsistas (PUB & AEx 2026)',
        summary: 'Estudantes de graduação do IFUSP e de cursos de exatas da USP podem se inscrever para o processo seletivo da equipe de apresentação.',
        category: 'Edital de Monitoria',
        date: 'Novembro 2026',
        author: 'Coordenação Show de Física',
        borderClass: 'neon-border-red',
        textClass: 'neon-text-red',
    },
    {
        slug: 'virada-cientifica-ifusp',
        title: 'Show de Física na Virada Científica da USP com Sessões Noturnas Especiais',
        summary: 'Apresentações temáticas de óptica e eletricidade sem fio com a Bobina de Tesla iluminando o auditório à noite.',
        category: 'Evento Especial',
        date: 'Próxima Sexta',
        author: 'Comissão de Extensão',
        borderClass: 'neon-border-blue',
        textClass: 'neon-text-blue',
    },
    {
        slug: 'novo-aparato-vortice',
        title: 'Novo Canhão de Vórtices Toroidais Entra em Operação na Bancada',
        summary: 'Após três semanas de testes na oficina mecânica do IF, o aparato reformulado amplia a precisão dos anéis de fumaça disparados.',
        category: 'Bastidores da Oficina',
        date: 'Recente',
        author: 'Equipe Técnica',
        borderClass: 'neon-border-green',
        textClass: 'neon-text-green',
    },
    {
        slug: 'visitas-escolares-recorde',
        title: 'Show de Física Atinge a Marca de 15.000 Estudantes Atendidos no Ano',
        summary: 'Com a retomada completa dos agendamentos presenciais, escolas públicas representaram mais de 70% do público visitante.',
        category: 'Marco Histórico',
        date: 'Outubro 2026',
        author: 'HUB LabDiv',
        borderClass: 'neon-border-blue',
        textClass: 'neon-text-blue',
    },
];

export default function NoticiasEEventosPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#f60011] bg-red-500/10 text-[#f60011] text-xs font-mono font-bold uppercase tracking-widest">
                    <Newspaper className="w-4 h-4" />
                    <span>Mural Oficial de Divulgações</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-gray-950 dark:text-white">
                    <span className="neon-text-red">Notícias</span> &{' '}
                    <span className="neon-text-blue">Editais</span>
                </h1>
                <p className="text-base sm:text-lg font-sans text-gray-700 dark:text-gray-300">
                    Acompanhe editais de bolsas de monitoria, eventos especiais e relatos das atividades no auditório do IFUSP.
                </p>
            </div>

            {/* Grid das Publicações com Estilo Neon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {NEWS_ITEMS.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/noticias-e-eventos/${item.slug}`}
                        className={`p-8 bg-white dark:bg-black ${item.borderClass} flex flex-col justify-between group hover:-translate-y-2 transition-transform duration-300 rounded-none shadow-xl`}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="px-3 py-1 text-[10px] font-mono font-bold uppercase tracking-wider border border-current text-gray-700 dark:text-gray-300">
                                    {item.category}
                                </span>
                                <span className="text-xs font-mono text-gray-400">
                                    {item.date}
                                </span>
                            </div>

                            <h3 className={`text-xl font-bold uppercase tracking-wider leading-snug ${item.textClass}`}>
                                {item.title}
                            </h3>

                            <p className="text-sm font-sans text-gray-600 dark:text-gray-300 leading-relaxed">
                                {item.summary}
                            </p>
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:text-[#002ffe] dark:group-hover:text-[#38bdf8]">
                            <span>Por {item.author}</span>
                            <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                <span>Ler</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
