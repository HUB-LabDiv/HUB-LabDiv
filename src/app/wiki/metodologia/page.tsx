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

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Search,
    BookOpen,
    GraduationCap,
    Laptop,
    ExternalLink,
    Copy,
    Check,
    HelpCircle,
    Bookmark,
    Layers,
    Share2,
    Shield,
    Globe,
    Zap,
    Download,
    FileText,
    Clock,
    Sparkles,
    Key,
    Database,
    Library,
    Compass,
    AlertTriangle,
    Mail,
    Phone,
    MapPin,
    Tag,
    ShoppingBag,
    HeartHandshake,
    Sparkle
} from 'lucide-react';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { ContentRating } from '@/components/feedback/ContentRating';
import { toast } from 'react-hot-toast';

interface SearchOperator {
    operator: string;
    description: string;
    example: string;
    tip: string;
}

const SEARCH_OPERATORS: SearchOperator[] = [
    {
        operator: '"termo exato"',
        description: 'Força a busca pela frase ou termo exatamente na ordem digitada, sem sinônimos ou variações.',
        example: '"quantum entanglement" "bell state"',
        tip: 'Essencial para termos técnicos compostos e nomes de experimentos.'
    },
    {
        operator: 'author:"Nome"',
        description: 'Filtra os artigos para retornar apenas aqueles de autoria do pesquisador indicado.',
        example: 'author:"L. Landau" "superfluidity"',
        tip: 'Use aspas se o nome do autor tiver mais de uma palavra.'
    },
    {
        operator: 'intitle:"termo"',
        description: 'Exige que a palavra ou expressão esteja presente no título do artigo.',
        example: 'intitle:"black hole" thermodynamics',
        tip: 'Ótimo para encontrar papers pioneiros sobre um tópico específico.'
    },
    {
        operator: 'source:"Revista"',
        description: 'Restringe a busca a uma revista, periódico ou conferência específica.',
        example: 'source:"Physical Review Letters" graphene',
        tip: 'Experimente usar siglas conhecidas como PRB, Nature, JHEP.'
    },
    {
        operator: 'filetype:pdf',
        description: 'Retorna exclusivamente documentos que estejam disponíveis diretamente em formato PDF.',
        example: '"mecanica classica" filetype:pdf',
        tip: 'Ideal para apostilas, teses e relatórios técnicos disponíveis na web.'
    },
    {
        operator: '-termo (Exclusão)',
        description: 'Exclui resultados que contenham a palavra indesejada especificada após o hífen.',
        example: 'supercondutividade -quimica',
        tip: 'Não coloque espaço entre o hífen e a palavra excluída.'
    },
    {
        operator: 'site:usp.br / site:.edu',
        description: 'Filtra resultados hospedados exclusivamente dentro do domínio institucional indicado.',
        example: 'site:portal.if.usp.br eletromagnetismo',
        tip: 'Excelente para encontrar notas de aula e listas de exercícios de professores da USP.'
    }
];

const BORROWING_CATEGORIES = [
    {
        role: 'Alunos de Graduação & Técnicos',
        items: '10 itens',
        days: '10 dias',
        color: 'border-brand-yellow/40 bg-brand-yellow/5 text-brand-yellow'
    },
    {
        role: 'Alunos de Pós-Graduação',
        items: '15 itens',
        days: '20 dias',
        color: 'border-brand-blue/40 bg-brand-blue/5 text-[#00A3FF]'
    },
    {
        role: 'Docentes da USP',
        items: '20 itens',
        days: '30 dias',
        color: 'border-brand-red/40 bg-brand-red/5 text-brand-red'
    }
];

const STUDY_SPOTS = [
    {
        name: 'Biblioteca do IFUSP',
        status: 'Alocada temporariamente no Lab de Ressonância Magnética',
        features: 'Salão de leitura, mesas silenciosas e atendimento humanizado.',
        hours: 'Seg-Sex: 08h às 21h45 (Letivo) | 09h às 19h (Férias)'
    },
    {
        name: 'Sala 1001 (Pró-Aluno)',
        status: 'Edifício Principal IFUSP',
        features: 'Computadores com Linux/Windows, softwares técnicos (Python, Mathematica) e tomadas.',
        hours: 'Durante horário de funcionamento do IFUSP'
    },
    {
        name: 'Sala de Estudos (Entrada Matão)',
        status: 'Em frente à portaria da Rua do Matão',
        features: 'Espaço para estudo em grupo, discussões e intervalos de aula.',
        hours: 'Acesso livre aos estudantes'
    },
    {
        name: 'Sala 24 Horas do IME-USP',
        status: 'Prédio do IME (vizinho ao IFUSP)',
        features: 'Excelente refúgio 24h para noites intensas de estudo em finais de semestre.',
        hours: 'Aberta 24 horas por dia'
    },
    {
        name: 'Biblioteca Brasiliana Guita e José Mindlin (BBM)',
        status: 'Próxima à Reitoria',
        features: 'Espaço silencioso, climatizado, excelente iluminação e cafeteria.',
        hours: 'Seg-Sex das 08h30 às 17h30'
    }
];

const REMOTE_ACCESS_STEPS = [
    {
        step: '01',
        title: 'Configurar FullText@USP no Google Scholar',
        desc: 'Acesse o Google Scholar > Menu lateral > **Configurações** > **Links de biblioteca** > Digite "Universidade de São Paulo" > Marque as opções e clique em **Salvar**. Agora, todos os artigos pagos com convênio USP exibirão o link `[FullText@USP]` na lateral direita!'
    },
    {
        step: '02',
        title: 'VPN USP (OpenVPN / Cisco AnyConnect)',
        desc: 'Baixe o cliente de VPN da USP (STI USP) e faça login com seu **Número USP e Senha Única**. Seu computador navegará com endereço IP institucional da USP, liberando o acesso a todas as bases científicas de casa.'
    },
    {
        step: '03',
        title: 'Acesso Remoto CAFe (Periódicos CAPES)',
        desc: 'Ao entrar em sites de editoras (ScienceDirect, Springer, Nature, IEEE, APS), clique em **Sign in via Institution** e busque por **"Comunidade Acadêmica Federada (CAFe) - USP"** para autenticar com suas credenciais USP.'
    },
    {
        step: '04',
        title: 'arXiv.org & Repositórios Abertos',
        desc: 'Quase todo artigo de Física Teórica, Experimental e Astronomia é publicado gratuitamente em pré-print no **arXiv.org** meses antes de sair em revistas pagas. Busque sempre primeiro no arXiv!'
    }
];

const TOOLS_LIST = [
    {
        name: 'Google Scholar (Acadêmico)',
        category: 'Motor de Busca',
        desc: 'A ferramenta mais ampla para encontrar artigos, citações, patentes e exportar referências em BibTeX.',
        href: 'https://scholar.google.com.br',
        color: '#4285F4'
    },
    {
        name: 'Portal de Busca Integrada (Dedalus USP)',
        category: 'Catálogo ABCD USP',
        desc: 'Consulte o acervo físico de todas as 60 bibliotecas da USP, faça reservas de livros e realize até 3 renovações online.',
        href: 'https://buscaintegrada.usp.br',
        color: '#FFCC00'
    },
    {
        name: 'Portal CAPES Periódicos',
        category: 'Bases Internacionais',
        desc: 'Acesso a mais de 33 mil periódicos com texto completo, 130 bases referenciais e 10 de patentes financiado para a USP.',
        href: 'https://www.periodicos.capes.gov.br',
        color: '#0F4780'
    },
    {
        name: 'Banco de Teses e Dissertações da USP',
        category: 'Produção Acadêmica USP',
        desc: 'Acesso aberto e digital a todos os trabalhos de mestrado e doutorado defendidos na Universidade de São Paulo.',
        href: 'https://www.teses.usp.br',
        color: '#10b981'
    },
    {
        name: 'Portal de Revistas da USP',
        category: 'Revistas Científicas',
        desc: 'Biblioteca eletrônica com as revistas periódicas credenciadas produzidas pela USP.',
        href: 'https://www.revistas.usp.br',
        color: '#EC4899'
    },
    {
        name: 'arXiv.org',
        category: 'Pré-prints de Física',
        desc: 'O repositório aberto mundial mais importante para física teórica, experimental, matemática e astrofísica.',
        href: 'https://arxiv.org',
        color: '#F14343'
    },
    {
        name: 'Zotero',
        category: 'Gerenciador de Referências',
        desc: 'Extensão gratuita e open-source para salvar artigos com 1 clique, organizar PDFs e gerar citações para LaTeX / Overleaf.',
        href: 'https://www.zotero.org',
        color: '#8B5CF6'
    }
];

export default function MetodologiaPage() {
    const [activeTab, setActiveTab] = useState<'biblioteca' | 'scholar' | 'locais' | 'remoto' | 'ferramentas' | 'faq'>('biblioteca');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // Interactive Query Builder State
    const [queryTopic, setQueryTopic] = useState('quantum entanglement');
    const [queryAuthor, setQueryAuthor] = useState('Aspect');
    const [queryYear, setQueryYear] = useState('2022');
    const [queryFormat, setQueryFormat] = useState('pdf');

    const builtQuery = `${queryTopic ? `"${queryTopic}"` : ''} ${queryAuthor ? `author:"${queryAuthor}"` : ''} ${queryYear ? `${queryYear}` : ''} ${queryFormat ? `filetype:${queryFormat}` : ''}`.trim();

    const handleCopy = (text: string, idx: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        toast.success('Exemplo copiado para a área de transferência!');
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleOpenScholar = () => {
        const url = `https://scholar.google.com.br/scholar?q=${encodeURIComponent(builtQuery)}`;
        window.open(url, '_blank');
    };

    const handleOpenArxiv = () => {
        const url = `https://arxiv.org/search/?query=${encodeURIComponent(queryTopic || builtQuery)}&searchtype=all`;
        window.open(url, '_blank');
    };

    return (
        <MainLayoutWrapper>
            <div className="min-h-screen bg-[#121212] text-white selection:bg-brand-blue selection:text-white pb-24 font-open-sans">
                {/* Top Navigation & Breadcrumbs */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    <nav className="flex items-center gap-3 text-xs font-bold font-bukra uppercase tracking-[0.2em] text-gray-400 mb-8 flex-wrap">
                        <Link
                            href="/gcif"
                            className="flex items-center gap-2 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full text-brand-blue hover:bg-brand-blue/10"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>Voltar ao CGIF</span>
                        </Link>
                        <Link href="/gcif/wiki" className="hover:text-brand-blue transition-colors">
                            Wiki do IFUSP
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-[#00A3FF] italic">Biblioteca & Metodologia</span>
                    </nav>

                    {/* Hero Header */}
                    <div className="relative rounded-[36px] bg-gradient-to-br from-[#1E1E1E] via-[#1A1A1A] to-[#121212] border border-white/10 p-8 sm:p-12 mb-10 overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-brand-yellow/5 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 max-w-4xl">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-[#00A3FF] text-[10px] font-black uppercase tracking-widest mb-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                Guia Oficial de Sobrevivência Acadêmica 2026
                            </div>
                            <h1 className="text-3xl sm:text-5xl font-black text-white font-bukra italic uppercase tracking-tighter mb-4 leading-tight">
                                Biblioteca do Instituto de Física & Como Pesquisar
                            </h1>
                            <p className="text-sm sm:text-base text-gray-300 font-open-sans leading-relaxed max-w-3xl">
                                O guia prático completo sobre a <b>Biblioteca do Instituto de Física (IFUSP)</b>: regras oficiais de empréstimo (10 livros por 10 dias na graduação), acervo de 200 mil itens, caixa de devolução 24h, <b>Google Scholar com FullText@USP</b>, acesso remoto via <b>VPN/CAFe</b> e dicas de locais de estudo no campus.
                            </p>

                            {/* Quick Metrics Bar */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
                                <div>
                                    <div className="text-[10px] font-black font-bukra uppercase tracking-wider text-gray-400">Acervo IFUSP</div>
                                    <div className="text-lg sm:text-xl font-black font-bukra text-white">+200 Mil Itens</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black font-bukra uppercase tracking-wider text-gray-400">Empréstimo Graduação</div>
                                    <div className="text-lg sm:text-xl font-black font-bukra text-brand-yellow">10 Livros / 10 Dias</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black font-bukra uppercase tracking-wider text-gray-400">Renovações Online</div>
                                    <div className="text-lg sm:text-xl font-black font-bukra text-[#00A3FF]">Até 3x no PBI</div>
                                </div>
                                <div>
                                    <div className="text-[10px] font-black font-bukra uppercase tracking-wider text-gray-400">Rede de Bibliotecas</div>
                                    <div className="text-lg sm:text-xl font-black font-bukra text-brand-red">60 Bibliotecas USP</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subnavigation Tabs */}
                    <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto scrollbar-hide py-2 mb-10">
                        <div className="flex p-1.5 bg-[#1E1E1E]/90 backdrop-blur-xl border border-white/10 rounded-[22px] shadow-lg">
                            <button
                                onClick={() => setActiveTab('biblioteca')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'biblioteca'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Library className="w-4 h-4" />
                                <span>Biblioteca IFUSP</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('scholar')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'scholar'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Search className="w-4 h-4" />
                                <span>Google Scholar</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('locais')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'locais'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <MapPin className="w-4 h-4" />
                                <span>Locais de Estudo</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('remoto')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'remoto'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Globe className="w-4 h-4" />
                                <span>Acesso USP & VPN</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('ferramentas')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'ferramentas'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <Database className="w-4 h-4" />
                                <span>Bases & Portais</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('faq')}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-[16px] text-xs font-black uppercase tracking-wider transition-all font-bukra whitespace-nowrap ${
                                    activeTab === 'faq'
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <HelpCircle className="w-4 h-4" />
                                <span>Dúvidas & Contatos</span>
                            </button>
                        </div>
                    </div>

                    {/* TAB CONTENT AREA */}
                    <AnimatePresence mode="wait">
                        {/* 1. BIBLIOTECA DO IFUSP */}
                        {activeTab === 'biblioteca' && (
                            <motion.div
                                key="biblioteca"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                {/* Header da Biblioteca */}
                                <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-br from-[#1E1E1E] via-[#1A1A1A] to-[#121212] border border-white/10 shadow-2xl">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                        <div className="space-y-4 max-w-3xl">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-[#00A3FF] text-[10px] font-black uppercase tracking-wider">
                                                <Library className="w-3.5 h-3.5" />
                                                Criada na década de 1970 • IFUSP
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra uppercase italic">
                                                Biblioteca do Instituto de Física
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                                Considerada uma das mais completas do país na área de Física. Seu acervo conta com <b>mais de 200 mil itens</b> entre livros, periódicos, teses, dissertações, apostilas, impressos e vasta coleção eletrônica integrada ao SIBiUSP / ABCD USP.
                                            </p>
                                            <div className="p-4 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 text-xs text-brand-yellow font-medium leading-relaxed">
                                                📍 <b>Localização Atual:</b> Com o prédio principal em reforma, a biblioteca está alocada temporariamente no <b>Laboratório de Ressonância Magnética</b>, com previsão de retorno ao espaço original.
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
                                            <a
                                                href="https://portal.if.usp.br/bib"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3.5 rounded-2xl bg-brand-yellow text-gray-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-yellow/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <span>Site Oficial da Biblioteca</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                            <a
                                                href="https://buscaintegrada.usp.br"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                                            >
                                                <span>Buscar no PBI / Dedalus</span>
                                                <Search className="w-4 h-4 text-[#00A3FF]" />
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Tabela de Prazos de Empréstimo */}
                                <div>
                                    <h3 className="text-xl font-black text-white font-bukra uppercase mb-6 flex items-center gap-3">
                                        <Clock className="w-6 h-6 text-brand-yellow" />
                                        Categorias & Prazos de Empréstimo Unificado
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {BORROWING_CATEGORIES.map((cat, idx) => (
                                            <div
                                                key={idx}
                                                className={`p-6 rounded-[28px] border ${cat.color} transition-all flex flex-col justify-between shadow-xl`}
                                            >
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-wider block mb-2 font-bukra">
                                                        {cat.role}
                                                    </span>
                                                    <div className="text-3xl font-black font-bukra text-white mb-1">
                                                        {cat.items}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-300 font-open-sans">
                                                        Prazo: {cat.days}
                                                    </div>
                                                </div>
                                                <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-gray-400">
                                                    Válido em todas as 60 bibliotecas da USP com cartão e-Card.
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Como Encontrar um Livro (Número de Chamada) */}
                                <div className="p-8 rounded-[36px] bg-[#1E1E1E] border border-white/10 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-brand-blue/15 text-[#00A3FF] flex items-center justify-center border border-brand-blue/30">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white font-bukra uppercase">
                                                Como Encontrar um Livro na Estante (Etiqueta da Lombada)
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                O número de chamada localizado na lombada determina a posição exata do livro nas prateleiras.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Visual Callout Label */}
                                    <div className="p-6 rounded-3xl bg-black/60 border border-white/10 mb-6">
                                        <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:text-left">
                                            <div className="p-3 rounded-2xl bg-brand-blue/20 border border-brand-blue/40">
                                                <div className="text-xl font-black font-mono text-[#00A3FF]">370</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400 mt-1">Assunto (CDU/CDD)</div>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-brand-yellow/20 border border-brand-yellow/40">
                                                <div className="text-xl font-black font-mono text-brand-yellow">S124e</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400 mt-1">Nº do Autor (Cutter)</div>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-brand-red/20 border border-brand-red/40">
                                                <div className="text-xl font-black font-mono text-brand-red">v.2</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400 mt-1">Volume da Coleção</div>
                                            </div>
                                            <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                                                <div className="text-xl font-black font-mono text-white">ex.3</div>
                                                <div className="text-[9px] uppercase font-bold text-gray-400 mt-1">Nº do Exemplar</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fitas de Circulação */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-black/40 border border-blue-500/30 flex items-center gap-3">
                                            <div className="w-4 h-10 rounded-full bg-blue-500 shrink-0" />
                                            <div>
                                                <div className="text-xs font-black text-white font-bukra">Fita Azul na Lombada</div>
                                                <div className="text-[11px] text-gray-400">Apenas para consulta no local (NÃO CIRCULA).</div>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-black/40 border border-yellow-500/30 flex items-center gap-3">
                                            <div className="w-4 h-10 rounded-full bg-yellow-500 shrink-0" />
                                            <div>
                                                <div className="text-xs font-black text-white font-bukra">Fita Amarela na Lombada</div>
                                                <div className="text-[11px] text-gray-400">Apenas para consulta no local (NÃO CIRCULA).</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Regras Cruciais: Renovações, Atrasos e Caixa de Devolução 24h */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 text-brand-blue flex items-center justify-center">
                                            <Layers className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-base font-black text-white font-bukra">
                                            Renovações & Reservas
                                        </h4>
                                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                                            São permitidas até <b>3 renovações online</b> no PBI (caso não haja reserva para o título). A renovação seguinte deve ser feita obrigatoriamente no balcão presencial com a apresentação dos livros.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-brand-red/30 shadow-xl space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-base font-black text-white font-bukra">
                                            Atrasos & Extravios
                                        </h4>
                                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                                            Conforme a <b>Portaria GR Nº 4830/2010</b>, cada dia de atraso por obra gera <b>1 dia de suspensão</b> em todas as bibliotecas da USP. Em caso de dano ou extravio (mesmo com B.O.), é obrigatório repor obra idêntica.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-brand-yellow/30 shadow-xl space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center">
                                            <Bookmark className="w-5 h-5" />
                                        </div>
                                        <h4 className="text-base font-black text-white font-bukra">
                                            Caixa de Devolução 24h
                                        </h4>
                                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                                            Localizada no saguão da portaria na ala central do prédio principal. Coloque um livro por vez, deitado, com a lombada para dentro e feche a portinhola. Baixa efetuada em todos os dias úteis.
                                        </p>
                                    </div>
                                </div>

                                {/* Regulamento Interno */}
                                <div className="p-6 rounded-3xl bg-black/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="text-xs font-black uppercase tracking-wider text-gray-400 font-bukra mb-1">
                                            Regulamento de Acesso ao Salão
                                        </div>
                                        <div className="text-xs text-gray-300 font-open-sans">
                                            🚫 <b>Não é permitido entrar com:</b> Bolsas, mochilas grandes, pastas/fichários volumosos e alimentos/bebidas. Utilize os armários com chave na entrada.
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-gray-400 shrink-0">
                                        Seg-Sex: 08h00 - 21h45
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 2. GOOGLE SCHOLAR */}
                        {activeTab === 'scholar' && (
                            <motion.div
                                key="scholar"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                {/* Dica de Ouro: FullText@USP */}
                                <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#0F4780]/20 via-[#1E1E1E] to-[#1E1E1E] border border-brand-blue/30 shadow-xl relative overflow-hidden">
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex items-start gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-brand-blue/20 text-[#00A3FF] border border-brand-blue/30 flex items-center justify-center shrink-0">
                                                <GraduationCap className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-[#00A3FF] text-[9px] font-black uppercase tracking-wider mb-2">
                                                    Passo Essencial
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-black text-white font-bukra mb-2">
                                                    Ative o recurso &quot;FullText@USP&quot; no Google Acadêmico
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed max-w-2xl">
                                                    Muitos artigos da Elsevier, Springer, Nature e APS custam mais de $35 por download. A USP já assina e paga o acesso para você! Vá em <b>Configurações do Scholar &gt; Links de biblioteca &gt; pesquise &quot;Universidade de São Paulo&quot;</b> e marque a caixa. O botão de download em 1 clique aparecerá ao lado de cada artigo.
                                                </p>
                                            </div>
                                        </div>
                                        <a
                                            href="https://scholar.google.com.br/scholar_settings?hl=pt-BR#2"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all shrink-0 hover:scale-105 active:scale-95"
                                        >
                                            <span>Configurar Scholar</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {/* Operadores de Busca */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-3">
                                                <Search className="w-6 h-6 text-brand-yellow" />
                                                Operadores Booleanos & Filtros Avançados
                                            </h2>
                                            <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                                                Economize horas filtrando papers irrelevantes com sintaxes de busca profissionais.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {SEARCH_OPERATORS.map((op, idx) => (
                                            <div
                                                key={idx}
                                                className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 hover:border-brand-yellow/40 transition-all flex flex-col justify-between group shadow-xl"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="px-3 py-1 rounded-xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow font-black font-bukra text-xs">
                                                            {op.operator}
                                                        </span>
                                                        <button
                                                            onClick={() => handleCopy(op.example, idx)}
                                                            className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                                                            title="Copiar exemplo"
                                                        >
                                                            {copiedIndex === idx ? <Check className="w-4 h-4 text-brand-green" /> : <Copy className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed mb-4">
                                                        {op.description}
                                                    </p>
                                                </div>

                                                <div className="pt-4 border-t border-white/5">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Exemplo de Uso:</div>
                                                    <code className="text-xs font-mono text-brand-blue bg-black/40 px-2.5 py-1.5 rounded-lg block overflow-x-auto">
                                                        {op.example}
                                                    </code>
                                                    <p className="text-[11px] text-gray-400 italic mt-2">
                                                        💡 {op.tip}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Construtor Interativo de Query */}
                                <div className="p-8 rounded-[36px] bg-[#1E1E1E] border border-white/10 shadow-2xl">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-brand-yellow/10 text-brand-yellow flex items-center justify-center border border-brand-yellow/20">
                                            <Zap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white font-bukra uppercase">
                                                Simulador & Construtor de Busca Acadêmica
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                Preencha os campos abaixo para gerar a sintaxe ideal e testar nos motores científicos.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-bukra">Tema / Conceito</label>
                                            <input
                                                type="text"
                                                value={queryTopic}
                                                onChange={(e) => setQueryTopic(e.target.value)}
                                                placeholder="Ex: superfluidity"
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-brand-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-bukra">Autor</label>
                                            <input
                                                type="text"
                                                value={queryAuthor}
                                                onChange={(e) => setQueryAuthor(e.target.value)}
                                                placeholder="Ex: Feynman"
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-brand-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-bukra">Ano / Período</label>
                                            <input
                                                type="text"
                                                value={queryYear}
                                                onChange={(e) => setQueryYear(e.target.value)}
                                                placeholder="Ex: 2023"
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-brand-blue focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-bukra">Formato</label>
                                            <select
                                                value={queryFormat}
                                                onChange={(e) => setQueryFormat(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:border-brand-blue focus:outline-none"
                                            >
                                                <option value="pdf">PDF (Artigos/Teses)</option>
                                                <option value="">Qualquer Formato</option>
                                                <option value="ps">PostScript (.ps)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Generated Output */}
                                    <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="w-full overflow-x-auto">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Query Booleana Gerada:</div>
                                            <code className="text-sm font-mono text-brand-yellow">{builtQuery || '(digite os termos acima)'}</code>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                                            <button
                                                onClick={handleOpenScholar}
                                                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                            >
                                                <Search className="w-3.5 h-3.5" />
                                                <span>Google Scholar</span>
                                            </button>
                                            <button
                                                onClick={handleOpenArxiv}
                                                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg"
                                            >
                                                <FileText className="w-3.5 h-3.5" />
                                                <span>arXiv</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 3. LOCAIS DE ESTUDO & DESCONTOS EM LIVROS */}
                        {activeTab === 'locais' && (
                            <motion.div
                                key="locais"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-3 mb-2">
                                        <MapPin className="w-6 h-6 text-brand-yellow" />
                                        Onde Estudar no IFUSP e na Cidade Universitária
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mb-8">
                                        Os melhores refúgios com tomadas, Wi-Fi Eduroam e ambiente silencioso para passar o dia estudando.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {STUDY_SPOTS.map((spot, idx) => (
                                            <div
                                                key={idx}
                                                className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 hover:border-brand-yellow/40 transition-all flex flex-col justify-between shadow-xl"
                                            >
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-brand-yellow font-bukra mb-2 block">
                                                        {spot.status}
                                                    </span>
                                                    <h3 className="text-lg font-black text-white font-bukra mb-2">
                                                        {spot.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed mb-4">
                                                        {spot.features}
                                                    </p>
                                                </div>
                                                <div className="pt-4 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                                                    🕒 {spot.hours}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Descontos na EDUSP & Festa do Livro da USP */}
                                <div className="p-8 rounded-[36px] bg-gradient-to-r from-brand-yellow/10 via-[#1E1E1E] to-[#1E1E1E] border border-brand-yellow/30 shadow-2xl">
                                    <div className="flex items-start gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 flex items-center justify-center shrink-0">
                                            <ShoppingBag className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white font-bukra mb-2">
                                                Descontos Especiais em Livros Físicos para Alunos USP
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-4">
                                                Alunos da USP têm direito a <b>30% a 50% de desconto permanente</b> em livros da <b>Editora da USP (EDUSP)</b> na loja física (prédio da Biblioteca Brasiliana) ou virtual. Além disso, todo final de ano acontece a <b>Festa do Livro da USP</b>, onde centenas de editoras renomadas vendem títulos acadêmicos e literários com no mínimo <b>50% de desconto real</b>.
                                            </p>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <a
                                                    href="https://www.edusp.com.br"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 rounded-xl bg-brand-yellow text-gray-900 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-brand-yellow/20"
                                                >
                                                    <span>Loja da EDUSP</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                                <a
                                                    href="https://festadolivro.usp.br"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                                                >
                                                    <span>Festa do Livro USP</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 4. ACESSO REMOTO & VPN */}
                        {activeTab === 'remoto' && (
                            <motion.div
                                key="remoto"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-3 mb-2">
                                        <Globe className="w-6 h-6 text-[#00A3FF]" />
                                        Como Ler Artigos Pagos Diretamente da sua Casa
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mb-8">
                                        A USP investe milhões anualmente para garantir que seus alunos tenham acesso irrestrito aos maiores periódicos do planeta. Siga o roteiro abaixo para liberar seu acesso remoto.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {REMOTE_ACCESS_STEPS.map((step, idx) => (
                                            <div
                                                key={idx}
                                                className="p-8 rounded-[32px] bg-[#1E1E1E] border border-white/10 hover:border-brand-blue/50 transition-all flex flex-col justify-between shadow-xl relative overflow-hidden"
                                            >
                                                <div className="absolute top-4 right-6 text-4xl font-black text-white/5 font-bukra">
                                                    {step.step}
                                                </div>
                                                <div className="relative z-10">
                                                    <div className="w-10 h-10 rounded-xl bg-brand-blue/15 text-[#00A3FF] border border-brand-blue/30 flex items-center justify-center font-black font-bukra text-sm mb-4">
                                                        {step.step}
                                                    </div>
                                                    <h3 className="text-lg font-black text-white font-bukra mb-3">
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Download VPN USP Box */}
                                <div className="p-8 rounded-[36px] bg-[#1E1E1E] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h4 className="text-lg font-black text-white font-bukra mb-2">
                                            Guia de Instalação da VPN USP (STI)
                                        </h4>
                                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed max-w-2xl">
                                            Acesse o tutorial oficial da Superintendência de Tecnologia da Informação (STI) para configurar a VPN no Windows, Linux, macOS, Android e iOS.
                                        </p>
                                    </div>
                                    <a
                                        href="https://uspdigital.usp.br/wsusuario/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all shrink-0 hover:scale-105 active:scale-95"
                                    >
                                        <span>Acessar Portal VPN USP</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </motion.div>
                        )}

                        {/* 5. BASES & PORTAIS */}
                        {activeTab === 'ferramentas' && (
                            <motion.div
                                key="ferramentas"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-3 mb-2">
                                        <Database className="w-6 h-6 text-brand-yellow" />
                                        Bases de Dados, Repositórios & Portais
                                    </h2>
                                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mb-8">
                                        Os principais portais oficiais e acadêmicos utilizados pela comunidade do Instituto de Física.
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {TOOLS_LIST.map((tool, idx) => (
                                            <a
                                                key={idx}
                                                href={tool.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 hover:border-white/30 transition-all flex flex-col justify-between group shadow-xl hover:-translate-y-1"
                                            >
                                                <div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">
                                                            {tool.category}
                                                        </span>
                                                        <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                                                    </div>
                                                    <h3 className="text-lg font-black text-white font-bukra mb-2 group-hover:text-brand-yellow transition-colors">
                                                        {tool.name}
                                                    </h3>
                                                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed mb-6">
                                                        {tool.desc}
                                                    </p>
                                                </div>

                                                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-black font-bukra text-brand-blue group-hover:translate-x-1 transition-transform">
                                                    <span>Acessar Portal</span>
                                                    <ArrowLeft className="w-4 h-4 rotate-180" />
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* 6. FAQ & CONTATOS OFICIAIS */}
                        {activeTab === 'faq' && (
                            <motion.div
                                key="faq"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-white font-bukra flex items-center gap-3 mb-6">
                                        <Phone className="w-6 h-6 text-brand-blue" />
                                        Atendimento & Contatos Oficiais da Biblioteca
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">E-mail Principal</div>
                                            <div className="text-sm font-bold text-brand-blue font-mono">bib@if.usp.br</div>
                                            <p className="text-[11px] text-gray-400">Para dúvidas sobre empréstimos, renovações e pesquisas.</p>
                                        </div>

                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">WhatsApp & Balcão</div>
                                            <div className="text-sm font-bold text-brand-yellow font-mono">(11) 3091-7137</div>
                                            <p className="text-[11px] text-gray-400">Atendimento direto do balcão de empréstimos.</p>
                                        </div>

                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">Serviço de Atendimento</div>
                                            <div className="text-sm font-bold text-white font-mono">(11) 3091-6923</div>
                                            <p className="text-[11px] text-gray-400">Orientação bibliográfica e normalização.</p>
                                        </div>

                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">Programa ECOS (Saúde Mental)</div>
                                            <div className="text-sm font-bold text-brand-red font-mono">ecos.prip@usp.br</div>
                                            <p className="text-[11px] text-gray-400">Acolhimento e suporte psicológico na USP.</p>
                                        </div>

                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">Seção de Graduação IFUSP</div>
                                            <div className="text-sm font-bold text-[#00A3FF] font-mono">salunosif@usp.br</div>
                                            <p className="text-[11px] text-gray-400">Matrículas, trancamentos e requerimentos.</p>
                                        </div>

                                        <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-xl space-y-2">
                                            <div className="text-[10px] font-black uppercase tracking-wider text-gray-400 font-bukra">Centro Acadêmico (CEFISMA)</div>
                                            <div className="text-sm font-bold text-brand-yellow font-mono">cefisma@cefisma.org.br</div>
                                            <p className="text-[11px] text-gray-400">Representação estudantil e vivência no IFUSP.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dúvidas Frequentes */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-black text-white font-bukra uppercase mb-4 flex items-center gap-3">
                                        <HelpCircle className="w-6 h-6 text-brand-yellow" />
                                        Perguntas Frequentes dos Alunos
                                    </h3>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-lg">
                                        <h4 className="text-base font-black text-white font-bukra mb-2">
                                            1. Como sei se o livro que preciso está disponível na biblioteca do IF?
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                            Acesse o <b>Portal de Busca Integrada (buscaintegrada.usp.br)</b>, digite o título ou autor e filtre por &quot;Instituto de Física&quot;. O sistema mostrará a quantidade de exemplares, a localização na estante (ex: 530.1 N974c) e se estão emprestados ou disponíveis para retirada imediata.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-lg">
                                        <h4 className="text-base font-black text-white font-bukra mb-2">
                                            2. O que acontece se eu atrasar a devolução de um livro?
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                            O sistema da USP não cobra multa em dinheiro, mas aplica <b>suspensão de 1 dia para cada dia de atraso por obra</b> (Portaria GR nº 4830/2010), válida em todas as 60 bibliotecas da USP. Renove sempre antes da data limite pelo Dedalus!
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-lg">
                                        <h4 className="text-base font-black text-white font-bukra mb-2">
                                            3. Posso devolver livros de outras unidades (IME, Poli, FFLCH) no IFUSP?
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                            <b>Sim!</b> Graças ao sistema de Empréstimo Unificado da ABCD USP, você pode devolver exemplares retirados em qualquer biblioteca da USP diretamente no balcão da Biblioteca do IFUSP ou na caixa de devolução 24h.
                                        </p>
                                    </div>

                                    <div className="p-6 rounded-[28px] bg-[#1E1E1E] border border-white/10 shadow-lg">
                                        <h4 className="text-base font-black text-white font-bukra mb-2">
                                            4. Como exportar citações direto para o Overleaf / LaTeX?
                                        </h4>
                                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed">
                                            No Google Scholar, clique no ícone de aspas <b>&quot;Citar&quot;</b> abaixo do artigo e selecione <b>BibTeX</b>. Copie o bloco de código gerado e cole no arquivo <code>references.bib</code> do seu projeto no Overleaf.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Feedback Rating */}
                    <div className="mt-16 pt-8 border-t border-white/10">
                        <ContentRating postId="wiki-metodologia" contentFormat="text" />
                    </div>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
