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

'use client';

import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Compass,
    GraduationCap,
    Briefcase,
    Calendar,
    MapPin,
    ArrowUpRight,
    Wrench,
    FileText,
    Building2,
    Monitor,
    Sparkles,
    DollarSign,
    BookOpen,
    Send,
    ExternalLink,
    Search,
    Globe2,
    Layers,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { oportunidadesCuradas, OportunidadeCurada } from '@/data/oportunidadesData';

interface OportunidadeItem {
    id: string;
    titulo: string;
    descricao: string;
    tipo: string;
    data?: string | null;
    local?: string | null;
    link?: string | null;
    target_persona?: string | null;
    user_id?: string | null;
}

interface SegmentedInterativoSectionProps {
    dynamicOportunidades: OportunidadeItem[];
    activePersona: 'curioso' | 'aluno' | 'professor';
    onPersonaChange: (p: 'curioso' | 'aluno' | 'professor') => void;
    onOpenSubmitModal: () => void;
}

// Dados estáticos curados para a Persona Curiosos
const CURIOSOS_CONTENT = [
    {
        id: 'c1',
        title: 'Show da Física (Visitação & Agendamento)',
        category: 'Extensão & Divulgação',
        description: 'Demonstrações interativas ao vivo de óptica, mecânica, eletromagnetismo e termodinâmica para escolas e público geral.',
        badge: 'Aberto à Comunidade',
        icon: Sparkles,
        link: '/iniciativas/show-da-fisica',
        isInternal: true
    },
    {
        id: 'c2',
        title: 'Escola de Física Contemporânea (EFC)',
        category: 'Cursos de Difusão',
        description: 'Imersão intensiva de férias para estudantes de ensino médio do país inteiro com aulas e visitas aos laboratórios de pesquisa.',
        badge: 'CCEx IFUSP',
        icon: BookOpen,
        link: 'https://portal.if.usp.br/ccex/pt-br/node/304',
        isInternal: false
    },
    {
        id: 'c3',
        title: 'Visitas Guiadas aos Aceleradores (Pelletron & Microtron)',
        category: 'Patrimônio Científico',
        description: 'Visitação monitorada ao acelerador eletrostático Pelletron e instalações de física nuclear aplicada do IFUSP.',
        badge: 'Visita Técnica',
        icon: Building2,
        link: 'https://portal.if.usp.br/ccex/',
        isInternal: false
    },
    {
        id: 'c4',
        title: 'USP 60+ (Universidade Aberta à Terceira Idade)',
        category: 'Inclusão & Cidadania',
        description: 'Disciplinas regulares e atividades complementares no IFUSP abertas para pessoas com 60 anos ou mais.',
        badge: 'PRCEU USP',
        icon: Compass,
        link: 'https://prceu.usp.br/usp60/',
        isInternal: false
    }
];

// Dados estáticos curados para a Persona Alunos
const ALUNOS_CONTENT = [
    {
        id: 'a1',
        title: 'Programa Unificado de Bolsas (PUB - Ensino/Pesquisa/Extensão)',
        category: 'Bolsas Institucionais',
        description: 'Incentivo financeiro mensal para projetos de iniciação científica, apoio ao ensino didático ou projetos de extensão e cultura.',
        badge: 'R$ 800/mês',
        icon: DollarSign,
        link: 'https://uspdigital.usp.br/apolo/',
        isInternal: false
    },
    {
        id: 'a2',
        title: 'Iniciação Científica & Tecnológica (PIBIC / PIBITI - CNPq)',
        category: 'Pesquisa Acadêmica',
        description: 'Bolsas federais de pesquisa vinculadas à Comissão de Pesquisa (CPq-IFUSP) com duração de 12 meses.',
        badge: 'Edital Anual',
        icon: GraduationCap,
        link: 'https://portal.if.usp.br/pesquisa/',
        isInternal: false
    },
    {
        id: 'a3',
        title: 'Monitorias da Graduação (Física Geral & Experimental)',
        category: 'Apoio Pedagógico',
        description: 'Atuação como monitor remunerado ou voluntário nas disciplinas de Física I a IV e laboratórios básicos do IFUSP.',
        badge: 'Semestral',
        icon: BookOpen,
        link: 'https://portal.if.usp.br/graduacao/',
        isInternal: false
    },
    {
        id: 'a4',
        title: 'Auxílios de Permanência PAPFE (PRIP USP)',
        category: 'Apoio Estudantil',
        description: 'Auxílio financeiro e moradia para estudantes em situação de vulnerabilidade socioeconômica pela Pró-Reitoria de Inclusão e Pertencimento.',
        badge: 'Inclusão Social',
        icon: DollarSign,
        link: 'https://prip.usp.br/papfe/',
        isInternal: false
    }
];

// Dados estáticos curados para a Persona Professores
const PROFESSORES_FORMULARIOS = [
    {
        id: 'f1',
        title: 'Ordem de Serviço: Conserto de Cadeiras & Mobiliário',
        category: 'Manutenção Predial',
        description: 'Solicitação direta à Seção de Manutenção do IFUSP para conserto de cadeiras, mesas, fechaduras e infraestrutura de salas.',
        icon: Wrench,
        actionLabel: 'Abrir Chamado',
        link: 'https://portal.if.usp.br/servicos/manutencao'
    },
    {
        id: 'f2',
        title: 'Central de Compras & Almoxarifado (DAF)',
        category: 'Suprimentos & Orçamentos',
        description: 'Formulários para pedidos de cotação, compra de insumos de laboratório, importações e requisição de material de consumo.',
        icon: FileText,
        actionLabel: 'Acessar Formulários',
        link: 'https://portal.if.usp.br/daf/compras'
    },
    {
        id: 'f3',
        title: 'Reserva de Auditórios & Salas Didáticas',
        category: 'Infraestrutura de Eventos',
        description: 'Agendamento dos Auditórios Abrahão de Moraes, Jayme Tiomno e salas multimídia da Ala Central e Didática.',
        icon: Building2,
        actionLabel: 'Solicitar Reserva',
        link: 'https://portal.if.usp.br/reserva-espacos'
    },
    {
        id: 'f4',
        title: 'Suporte Técnico de Redes & DTI IFUSP',
        category: 'Tecnologia da Informação',
        description: 'Abertura de chamados para liberação de IP, conectividade cabeada em laboratórios, e-mail institucional e servidores.',
        icon: Monitor,
        actionLabel: 'Suporte DTI',
        link: 'https://portal.if.usp.br/dti/'
    }
];

const PROFESSORES_FOMENTO = [
    {
        id: 'pf1',
        title: 'FAPESP: Auxílios Regulares & Projetos Temáticos',
        category: 'Fomento Estadual',
        description: 'Chamadas contínuas de financiamento para linhas de pesquisa, bolsas de pós-doutorado e grandes equipamentos.',
        link: 'https://fapesp.br/'
    },
    {
        id: 'pf2',
        title: 'CNPq: Bolsas de Produtividade & Universal',
        category: 'Fomento Federal',
        description: 'Bolsas PQ, auxílios a projetos científicos colaborativos e editais de infraestrutura laboratorial.',
        link: 'https://www.gov.br/cnpq/pt-br'
    }
];

export function SegmentedInterativoSection({
    dynamicOportunidades,
    activePersona,
    onPersonaChange,
    onOpenSubmitModal
}: SegmentedInterativoSectionProps) {
    // Estados da Subseção 1 (Para Todos)
    const [generalCategory, setGeneralCategory] = useState<string>('Todas');
    const [generalSearch, setGeneralSearch] = useState<string>('');
    const [isOportunidadesExpanded, setIsOportunidadesExpanded] = useState<boolean>(true);

    const oportunidadesScrollRef = useRef<HTMLDivElement>(null);
    const scrollOportunidades = (direction: 'left' | 'right') => {
        if (oportunidadesScrollRef.current) {
            const scrollAmount = direction === 'left' ? -380 : 380;
            oportunidadesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Estados da Subseção 2 (Persona)
    const [personaCategory, setPersonaCategory] = useState<string>('Todas');
    const [personaSearch, setPersonaSearch] = useState<string>('');

    // --- 1. Consolidação da Subseção "Para Todos" ---
    // Combina as oportunidades curadas do sistema com as oportunidades gerais enviadas pela comunidade
    const allGeneralOportunidades = useMemo(() => {
        const communityGeneral: OportunidadeCurada[] = dynamicOportunidades
            .filter(item => !item.target_persona || item.target_persona === 'geral')
            .map(item => ({
                id: item.id,
                titulo: item.titulo,
                descricao: item.descricao,
                tipo: (item.tipo as any) || 'bolsa',
                categoria: item.tipo === 'bolsa' ? 'Bolsas & Auxílios' : item.tipo === 'vaga' ? 'Pesquisa & IC' : 'Eventos & Palestras',
                data: item.data || undefined,
                local: item.local || undefined,
                link: item.link || undefined,
                target_persona: 'geral',
                orgao_responsavel: 'Comunidade HUB LabDiv'
            }));

        return [...oportunidadesCuradas, ...communityGeneral];
    }, [dynamicOportunidades]);

    // Filtragem de "Para Todos"
    const filteredGeneralOportunidades = useMemo(() => {
        return allGeneralOportunidades.filter(item => {
            const matchesCategory = generalCategory === 'Todas' || item.categoria === generalCategory;
            const q = generalSearch.toLowerCase().trim();
            const matchesSearch = !q || 
                item.titulo.toLowerCase().includes(q) || 
                item.descricao.toLowerCase().includes(q) ||
                (item.orgao_responsavel && item.orgao_responsavel.toLowerCase().includes(q));
            return matchesCategory && matchesSearch;
        });
    }, [allGeneralOportunidades, generalCategory, generalSearch]);

    // --- 2. Consolidação da Subseção "Persona Ativa" ---
    const personaDynamic = useMemo(() => {
        return dynamicOportunidades.filter(item => item.target_persona === activePersona);
    }, [dynamicOportunidades, activePersona]);

    // Categorias disponíveis para a Persona Ativa
    const personaCategories = useMemo(() => {
        if (activePersona === 'aluno') {
            return ['Todas', 'Bolsas Institucionais', 'Pesquisa Acadêmica', 'Apoio Pedagógico', 'Apoio Estudantil'];
        }
        if (activePersona === 'professor') {
            return ['Todas', 'Manutenção Predial', 'Suprimentos & Orçamentos', 'Infraestrutura de Eventos', 'Tecnologia da Informação', 'Fomento à Pesquisa'];
        }
        return ['Todas', 'Extensão & Divulgação', 'Cursos de Difusão', 'Patrimônio Científico', 'Inclusão & Cidadania'];
    }, [activePersona]);

    // Filtragem de Alunos
    const filteredAlunos = useMemo(() => {
        return ALUNOS_CONTENT.filter(item => {
            const matchesCat = personaCategory === 'Todas' || item.category === personaCategory;
            const q = personaSearch.toLowerCase().trim();
            const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });
    }, [personaCategory, personaSearch]);

    // Filtragem de Curiosos
    const filteredCuriosos = useMemo(() => {
        return CURIOSOS_CONTENT.filter(item => {
            const matchesCat = personaCategory === 'Todas' || item.category === personaCategory;
            const q = personaSearch.toLowerCase().trim();
            const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });
    }, [personaCategory, personaSearch]);

    // Filtragem de Professores
    const filteredFormularios = useMemo(() => {
        return PROFESSORES_FORMULARIOS.filter(item => {
            const matchesCat = personaCategory === 'Todas' || item.category === personaCategory;
            const q = personaSearch.toLowerCase().trim();
            const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });
    }, [personaCategory, personaSearch]);

    const filteredFomento = useMemo(() => {
        return PROFESSORES_FOMENTO.filter(item => {
            const matchesCat = personaCategory === 'Todas' || personaCategory === 'Fomento à Pesquisa';
            const q = personaSearch.toLowerCase().trim();
            const matchesSearch = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
            return matchesCat && matchesSearch;
        });
    }, [personaCategory, personaSearch]);

    return (
        <section className="w-full space-y-16" data-tour="gcif-interativo-segmented">
            {/* ══════════════════════════════════════════════════════════════════════
                SUBSEÇÃO 1: 🌐 OPORTUNIDADES & RECURSOS PARA TODOS (GERAL / COMUNIDADE)
               ══════════════════════════════════════════════════════════════════════ */}
            {/* ══════════════════════════════════════════════════════════════════════
                SUBSEÇÃO 1: 🌐 OPORTUNIDADES & RECURSOS PARA TODOS (GERAL / COMUNIDADE)
               ══════════════════════════════════════════════════════════════════════ */}
            <div className="space-y-6 p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-white/70 via-white/40 to-transparent dark:from-[#1E1E1E]/70 dark:via-[#161616]/40 dark:to-transparent border border-gray-200 dark:border-white/10 shadow-lg transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 border border-brand-red/20 text-brand-red text-xs font-black uppercase tracking-wider mb-2">
                            <Globe2 className="w-3.5 h-3.5" />
                            Subseção 01 • Oportunidades Abertas
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white font-bukra tracking-tight">
                            Oportunidades para Todos
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans mt-1 max-w-2xl">
                            Editais abertos, bolsas de fomento, cursos de extensão e vagas de pesquisa compartilhados oficialmente pelo IFUSP e pela comunidade.
                        </p>
                    </div>

                    {/* Grupo de Ações do Cabeçalho: Alternar Expansão + Divulgar */}
                    <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
                        <button
                            onClick={() => setIsOportunidadesExpanded(!isOportunidadesExpanded)}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10 font-black text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer shadow-sm font-bukra"
                            title={isOportunidadesExpanded ? "Recolher seção de oportunidades" : "Expandir seção de oportunidades"}
                        >
                            <span>{isOportunidadesExpanded ? 'Recolher Seção' : 'Expandir Seção'}</span>
                            <span className="px-2 py-0.5 rounded-full bg-brand-red/10 text-brand-red font-mono text-[10px] font-bold">
                                {filteredGeneralOportunidades.length}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOportunidadesExpanded ? 'rotate-180 text-brand-red' : ''}`} />
                        </button>

                        <div className="hidden sm:flex items-center gap-1">
                            <button
                                onClick={() => scrollOportunidades('left')}
                                className="p-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                                aria-label="Rolar oportunidades para esquerda"
                                title="Rolar oportunidades para esquerda"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scrollOportunidades('right')}
                                className="p-3 rounded-2xl bg-white dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
                                aria-label="Rolar oportunidades para direita"
                                title="Rolar oportunidades para direita"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        <button
                            onClick={onOpenSubmitModal}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer font-bukra"
                        >
                            <Send className="w-4 h-4" />
                            <span>Divulgar Oportunidade</span>
                        </button>
                    </div>
                </div>

                {/* Prévia quando recolhido (permite passar direto sem poluir o scroll) */}
                {!isOportunidadesExpanded && (
                    <div 
                        onClick={() => setIsOportunidadesExpanded(true)}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 hover:border-brand-red/40 transition-all cursor-pointer gap-2 group"
                    >
                        <div className="flex items-center gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-open-sans">
                            <span className="size-2 rounded-full bg-brand-red animate-pulse" />
                            <span>
                                <strong>Visualização compacta ativa.</strong> Há {filteredGeneralOportunidades.length} oportunidades abertas disponíveis (Bolsas PUB, PIBIC, PAPFE, Monitorias e Extensão).
                            </span>
                        </div>
                        <span className="text-brand-red font-bold font-bukra uppercase text-[10px] group-hover:translate-x-1 transition-transform shrink-0">
                            Clique para expandir tudo ↓
                        </span>
                    </div>
                )}

                {/* Conteúdo Expansível com AnimatePresence */}
                <AnimatePresence initial={false}>
                    {isOportunidadesExpanded && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35, ease: 'easeInOut' }}
                            className="space-y-8 overflow-hidden"
                        >
                            {/* Barra de Filtros e Busca da Subseção Para Todos */}
                            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-2">
                                {/* Filtros em Pills M3 */}
                                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                                    {['Todas', 'Bolsas & Auxílios', 'Pesquisa & IC', 'Eventos & Palestras', 'Extensão & Cursos'].map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setGeneralCategory(cat)}
                                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer font-bukra ${
                                                generalCategory === cat
                                                    ? 'bg-brand-red text-white shadow-md'
                                                    : 'bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-brand-red/30'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Campo de Busca Rápida */}
                                <div className="relative min-w-[280px]">
                                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={generalSearch}
                                        onChange={(e) => setGeneralSearch(e.target.value)}
                                        placeholder="Buscar nas oportunidades abertas..."
                                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-red transition-all font-open-sans"
                                    />
                                </div>
                            </div>

                            {/* Grid de Cards da Subseção Para Todos */}
                            {filteredGeneralOportunidades.length === 0 ? (
                                <div className="p-12 text-center rounded-3xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 text-gray-500 font-open-sans">
                                    Nenhuma oportunidade encontrada para os filtros selecionados.
                                </div>
                            ) : (
                                <div
                                    ref={oportunidadesScrollRef}
                                    className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory gap-6 pb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
                                >
                                    {filteredGeneralOportunidades.map(op => (
                                        <div
                                            key={op.id}
                                            className="group snap-start shrink-0 w-[290px] sm:w-[340px] md:w-[360px] bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-7 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-brand-red/40 transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-3 mb-4">
                                                    <span className="px-3 py-1 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-full text-[10px] font-black uppercase tracking-wider font-bukra">
                                                        {op.remuneracao || op.categoria}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-gray-400 uppercase bg-gray-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full font-bold">
                                                        {op.tipo}
                                                    </span>
                                                </div>

                                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-bukra group-hover:text-brand-red transition-colors mb-2 leading-snug">
                                                    {op.titulo}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed line-clamp-3 mb-4">
                                                    {op.descricao}
                                                </p>

                                                <div className="space-y-1.5 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] font-open-sans text-gray-500 dark:text-gray-400">
                                                    {op.prazo && (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                                                            <span className="truncate">{op.prazo}</span>
                                                        </div>
                                                    )}
                                                    {op.local && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-3.5 h-3.5 text-brand-red shrink-0" />
                                                            <span className="truncate">{op.local}</span>
                                                        </div>
                                                    )}
                                                    {op.orgao_responsavel && (
                                                        <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400">
                                                            <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                                            <span className="truncate">{op.orgao_responsavel}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {op.link && (
                                                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
                                                    <a
                                                        href={op.link}
                                                        target={op.link.startsWith('/') ? '_self' : '_blank'}
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-brand-red hover:gap-3 transition-all font-bukra"
                                                    >
                                                        <span>Acessar Edital / Inscrição</span>
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════
                SUBSEÇÃO 2: 🎯 RECURSOS & CENTRAIS ESPECÍFICOS POR PERSONA
               ══════════════════════════════════════════════════════════════════════ */}
            <div className="space-y-8 p-6 sm:p-10 rounded-[36px] bg-gradient-to-b from-white/70 via-white/40 to-transparent dark:from-[#1E1E1E]/70 dark:via-[#161616]/40 dark:to-transparent border border-gray-200 dark:border-white/10 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4780]/15 border border-[#0F4780]/30 text-[#0F4780] dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2">
                            <Layers className="w-3.5 h-3.5" />
                            Subseção 02 • Recursos Segmentados
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white font-bukra tracking-tight">
                            {activePersona === 'aluno' && 'Centrais & Recursos para Alunos'}
                            {activePersona === 'professor' && 'Centrais & Recursos para Docentes'}
                            {activePersona === 'curioso' && 'Centrais & Recursos para a Comunidade'}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans mt-1 max-w-2xl">
                            {activePersona === 'aluno' && 'Bolsas institucionais da graduação, monitorias, auxílios de permanência e centrais pedagógicas.'}
                            {activePersona === 'professor' && 'Ordens de serviço predial, almoxarifado, reservas de auditórios, suporte DTI e editais FAPESP/CNPq.'}
                            {activePersona === 'curioso' && 'Visitas guiadas aos aceleradores, mostras interativas do Show da Física e cursos abertos à terceira idade.'}
                        </p>
                    </div>

                    {/* Seletor Rápido de Persona M3 */}
                    <div className="inline-flex p-1.5 rounded-2xl bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 shadow-inner">
                        <button
                            onClick={() => onPersonaChange('curioso')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bukra text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                activePersona === 'curioso'
                                    ? 'bg-[#FFCC00] text-gray-950 shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            <Compass className="w-4 h-4" />
                            <span>Curiosos</span>
                        </button>
                        <button
                            onClick={() => onPersonaChange('aluno')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bukra text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                activePersona === 'aluno'
                                    ? 'bg-[#0F4780] text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            <GraduationCap className="w-4 h-4" />
                            <span>Alunos</span>
                        </button>
                        <button
                            onClick={() => onPersonaChange('professor')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bukra text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                                activePersona === 'professor'
                                    ? 'bg-[#F14343] text-white shadow-md'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            <span>Docentes</span>
                        </button>
                    </div>
                </div>

                {/* Filtros em Pills e Busca de Recursos da Persona */}
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
                        {personaCategories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setPersonaCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                                    personaCategory === cat
                                        ? 'bg-[#0F4780] text-white shadow-md'
                                        : 'bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative min-w-[280px]">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={personaSearch}
                            onChange={(e) => setPersonaSearch(e.target.value)}
                            placeholder="Buscar nos recursos da persona..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#0F4780] transition-all"
                        />
                    </div>
                </div>

                {/* Conteúdo Dinâmico por Persona */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activePersona}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-8"
                    >
                        {/* 1. VISÃO CURIOSOS */}
                        {activePersona === 'curioso' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredCuriosos.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={card.id}
                                            className="group bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#FFCC00]/50 transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    <span className="px-3 py-1 bg-[#FFCC00]/15 text-gray-950 dark:text-[#FFCC00] border border-[#FFCC00]/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        {card.badge}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-2xl bg-[#FFCC00]/10 flex items-center justify-center text-[#FFCC00] group-hover:scale-110 transition-transform">
                                                        <Icon className="w-5 h-5 text-gray-900 dark:text-[#FFCC00]" />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white font-bukra mb-2">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                            <div className="pt-6 mt-4 border-t border-gray-100 dark:border-white/5">
                                                <a
                                                    href={card.link}
                                                    target={card.isInternal ? '_self' : '_blank'}
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-900 dark:text-[#FFCC00] hover:gap-3 transition-all"
                                                >
                                                    <span>{card.isInternal ? 'Explorar Módulo' : 'Ver Detalhes'}</span>
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 2. VISÃO ALUNOS */}
                        {activePersona === 'aluno' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredAlunos.map((card) => {
                                    const Icon = card.icon;
                                    return (
                                        <div
                                            key={card.id}
                                            className="group bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-[#0F4780]/50 transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between gap-4 mb-4">
                                                    <span className="px-3 py-1 bg-[#0F4780]/15 text-[#0F4780] dark:text-blue-300 border border-[#0F4780]/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        {card.badge}
                                                    </span>
                                                    <div className="w-10 h-10 rounded-2xl bg-[#0F4780]/10 flex items-center justify-center text-[#0F4780] dark:text-blue-400 group-hover:scale-110 transition-transform">
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                </div>
                                                <h3 className="text-lg font-black text-gray-900 dark:text-white font-bukra mb-2">
                                                    {card.title}
                                                </h3>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                                    {card.description}
                                                </p>
                                            </div>
                                            <div className="pt-6 mt-4 border-t border-gray-100 dark:border-white/5">
                                                <a
                                                    href={card.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#0F4780] dark:text-blue-300 hover:gap-3 transition-all"
                                                >
                                                    <span>Acessar Portal &amp; Editais</span>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 3. VISÃO PROFESSORES */}
                        {activePersona === 'professor' && (
                            <div className="space-y-10">
                                {/* Formulários Operacionais */}
                                {filteredFormularios.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-brand-red/10 rounded-xl text-brand-red">
                                                <Wrench className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-bukra">
                                                    Central de Formulários Operacionais do IFUSP
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-open-sans">
                                                    Requisições administrativas, manutenção predial, almoxarifado e reservas de salas.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {filteredFormularios.map((form) => {
                                                const Icon = form.icon;
                                                return (
                                                    <a
                                                        key={form.id}
                                                        href={form.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="group bg-white dark:bg-[#1E1E1E] rounded-3xl p-5 border border-gray-200 dark:border-white/10 hover:border-brand-red/40 hover:shadow-lg transition-all flex flex-col justify-between"
                                                    >
                                                        <div>
                                                            <div className="w-9 h-9 rounded-xl bg-brand-red/10 flex items-center justify-center text-brand-red mb-3 group-hover:scale-105 transition-transform">
                                                                <Icon className="w-4 h-4" />
                                                            </div>
                                                            <h4 className="text-sm font-black text-gray-900 dark:text-white font-bukra mb-1">
                                                                {form.title}
                                                            </h4>
                                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-open-sans leading-relaxed line-clamp-3">
                                                                {form.description}
                                                            </p>
                                                        </div>
                                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-brand-red text-xs font-bold">
                                                            <span>{form.actionLabel}</span>
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </div>
                                                    </a>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Editais de Fomento */}
                                {filteredFomento.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-bukra">
                                                    Editais de Fomento &amp; Financiamento à Pesquisa
                                                </h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 font-open-sans">
                                                    Agências de fomento para custeio de pesquisa, equipamentos e bolsas.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {filteredFomento.map((edital) => (
                                                <a
                                                    key={edital.id}
                                                    href={edital.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="bg-white dark:bg-[#1E1E1E] rounded-3xl p-6 border border-gray-200 dark:border-white/10 hover:border-blue-500/40 hover:shadow-md transition-all flex items-center justify-between"
                                                >
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">
                                                            {edital.category}
                                                        </span>
                                                        <h4 className="text-base font-black text-gray-900 dark:text-white font-bukra mt-1">
                                                            {edital.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-open-sans mt-1">
                                                            {edital.description}
                                                        </p>
                                                    </div>
                                                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors shrink-0 ml-4" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Divulgações Dinâmicas da Comunidade Segmentadas para esta Persona */}
                        {personaDynamic.length > 0 && (
                            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white font-bukra mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-brand-red" />
                                    <span>Divulgações da Comunidade para {activePersona === 'aluno' ? 'Alunos' : activePersona === 'professor' ? 'Docentes' : 'Curiosos'}</span>
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {personaDynamic.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-200 dark:border-white/10 p-6 flex flex-col justify-between hover:border-brand-red/50 transition-all shadow-sm group"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className="px-3 py-0.5 bg-brand-red/10 text-brand-red border border-brand-red/20 text-[10px] font-black uppercase rounded-full tracking-wider">
                                                        {item.tipo}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                                                        Exclusivo {activePersona}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-gray-900 dark:text-white font-bukra group-hover:text-brand-red transition-colors line-clamp-2 mb-2">
                                                    {item.titulo}
                                                </h4>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed line-clamp-3 mb-4">
                                                    {item.descricao}
                                                </p>
                                                <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-white/5">
                                                    {item.data && (
                                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                                                            <Calendar className="w-3.5 h-3.5 text-brand-yellow" />
                                                            <span>{item.data}</span>
                                                        </div>
                                                    )}
                                                    {item.local && (
                                                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-xs font-semibold">
                                                            <MapPin className="w-3.5 h-3.5 text-brand-red" />
                                                            <span>{item.local}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {item.link && (
                                                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/5">
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-brand-red font-black text-xs uppercase tracking-wider hover:gap-2.5 transition-all"
                                                    >
                                                        <span>Acessar</span>
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
