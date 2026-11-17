import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface NewsDetailPageProps {
    params: Promise<{ slug: string }>;
}

const ARTICLES_MAP: Record<string, {
    title: string;
    summary: string;
    date: string;
    category: string;
    author: string;
    content: string[];
}> = {
    'edital-selecao-monitores-2026': {
        title: 'Edital Aberto: Seleção de Novos Monitores Bolsistas (PUB & AEx 2026)',
        summary: 'Estudantes de graduação do IFUSP e de cursos de exatas da USP podem se inscrever para o processo seletivo da equipe de apresentação.',
        date: '03 de Novembro de 2026',
        category: 'Edital de Monitoria',
        author: 'Coordenação Show de Física IFUSP',
        content: [
            'O Instituto de Física da Universidade de São Paulo (IFUSP) torna público o processo seletivo simplificado para novos monitores bolsistas das iniciativas de extensão e divulgação científica do Show de Física para o ano letivo de 2026.',
            'O programa contempla bolsas de estímulo ao ensino e extensão dos editais unificados PUB (Programa Unificado de Bolsas da USP) e AEx (Apoio à Extensão). Os selecionados atuarão diretamente nas apresentações para escolas públicas e privadas, preparação dos aparatos cenográficos na bancada e desenvolvimento de novos roteiros didáticos.',
            'Requisitos: Estar regularmente matriculado em curso de graduação da USP (preferencialmente Bacharelado ou Licenciatura em Física, Engenharia Física ou áreas correlatas), ter disponibilidade para cumprir escalas presenciais no Auditório do Show de Física e perfil comunicativo para mediação pedagógica com alunos dos Ensinos Fundamental e Médio.',
            'Para se inscrever, envie histórico escolar atualizado e carta de motivação para o e-mail oficial da coordenação ou procure os monitores responsáveis no auditório do IFUSP.'
        ],
    },
    'virada-cientifica-ifusp': {
        title: 'Show de Física na Virada Científica da USP com Sessões Noturnas Especiais',
        summary: 'Apresentações temáticas de óptica e eletricidade sem fio com a Bobina de Tesla iluminando o auditório à noite.',
        date: '28 de Outubro de 2026',
        category: 'Evento Especial',
        author: 'Comissão de Cultura e Extensão',
        content: [
            'A Virada Científica da USP contará com sessões exclusivas e abertas ao público geral no Auditório do Show de Física.',
            'Nesta edição especial, a equipe preparou demonstrações noturnas focadas em fenômenos luminosos e eletromagnéticos: arco elétrico da Bobina de Tesla sincronizado com frequências audíveis, fluorescência e fosforescência sob radiação ultravioleta e descargas de alta tensão no Gerador de Wimshurst.',
            'A entrada é franca e por ordem de chegada até a lotação máxima de 120 lugares por sessão.'
        ],
    },
    'novo-aparato-vortice': {
        title: 'Novo Canhão de Vórtices Toroidais Entra em Operação na Bancada',
        summary: 'Após três semanas de testes na oficina mecânica do IF, o aparato reformulado amplia a precisão dos anéis de fumaça disparados.',
        date: '20 de Outubro de 2026',
        category: 'Bastidores da Oficina',
        author: 'Oficina Técnica do IFUSP',
        content: [
            'A equipe de técnicos da oficina mecânica do Instituto de Física finalizou a reformulação do Canhão de Vórtices Toroidais do Show.',
            'O novo sistema conta com membrana em silicone vulcanizado de retorno rápido e câmara com vedação aprimorada. Isso permite disparos com anéis de fumaça atóxica que mantêm sua estrutura laminar por mais de 15 metros, atravessando toda a extensão do auditório.',
            'O experimento continuará sendo um dos pontos altos do Ato 03 (Fenômenos de Fluidos e Eletromagnetismo).'
        ],
    },
    'visitas-escolares-recorde': {
        title: 'Show de Física Atinge a Marca de 15.000 Estudantes Atendidos no Ano',
        summary: 'Com a retomada completa dos agendamentos presenciais, escolas públicas representaram mais de 70% do público visitante.',
        date: '10 de Outubro de 2026',
        category: 'Marco Histórico',
        author: 'HUB LabDiv',
        content: [
            'Com a integração do agendamento digital pelo HUB LabDiv, o Show de Física celebrou neste semestre a marca de 15.000 estudantes e mais de 400 professores recebidos no auditório da USP.',
            'A grande maioria das caravanas escolares teve origem na rede pública estadual e municipal da Grande São Paulo e do interior paulista, reforçando o papel social da universidade pública na formação e inspiração de jovens talentos científicos.'
        ],
    },
};

export async function generateMetadata({ params }: NewsDetailPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const article = ARTICLES_MAP[resolvedParams.slug];
    if (!article) return { title: 'Publicação Não Encontrada' };
    return {
        title: `${article.title} | Notícias Show de Física`,
        description: article.summary,
    };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
    const resolvedParams = await params;
    const article = ARTICLES_MAP[resolvedParams.slug];

    if (!article) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-12">
            <div>
                <Link
                    href="/noticias-e-eventos"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-[#002ffe] dark:hover:text-[#38bdf8] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para Notícias</span>
                </Link>
            </div>

            <div className="p-8 sm:p-14 bg-white dark:bg-black neon-border-blue space-y-6 rounded-none shadow-2xl">
                <div className="flex items-center gap-4">
                    <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-current text-[#f60011]">
                        {article.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">
                        {article.date}
                    </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider neon-text-blue leading-tight">
                    {article.title}
                </h1>

                <p className="text-xs font-mono uppercase tracking-widest text-[#01f300]">
                    Publicado por: {article.author}
                </p>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10 space-y-6 text-base sm:text-lg text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                    {article.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
