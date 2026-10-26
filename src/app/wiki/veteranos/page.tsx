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

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    MessageSquare,
    ThumbsUp,
    Send,
    Loader2,
    X,
    AlertCircle,
    Search,
    Compass,
    ExternalLink,
    Sparkles,
    Building2,
    Filter,
    Share2,
    Check,
    Archive,
    GraduationCap,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getApprovedTips, submitTip, upvoteTip } from '@/app/actions/veterans';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { USP_INSTITUTES, VeteransTip } from '@/types/veterans';

const CATEGORIAS = [
    { id: 'comunicacao', label: 'Comunicação', color: 'brand-blue' },
    { id: 'permanencia', label: 'Permanência', color: 'brand-yellow' },
    { id: 'academica', label: 'Acadêmica', color: 'brand-red' }
];

/**
 * Dicas históricas essenciais mantidas nativamente no feed sob o autor "Perfil Legado"
 */
const DICAS_LEGADO: VeteransTip[] = [
    {
        id: 'legado-scholar',
        titulo: 'Google Scholar: Como liberar o FullText@USP e achar provas antigas',
        conteudo: 'Configure a Universidade de São Paulo (SIBiUSP) nas preferências de Bibliotecas do Scholar para liberar o botão "FullText @ USP" em papers pagos. Dica de ouro: use aspas duplas ("termo exato") para achar resoluções de provas antigas e artigos de IC do IFUSP rapidamente.',
        categoria: 'academica',
        instituto: 'geral',
        autor_nome: 'Perfil Legado',
        upvotes: 94,
        status: 'approved',
        created_at: '2026-01-01T00:00:00Z',
        url: 'https://scholar.google.com.br',
        urlLabel: 'Acessar Google Scholar',
        is_legacy: true
    },
    {
        id: 'legado-scihub',
        titulo: 'Sci-Hub: Acesso a papers fechados via busca direta por DOI',
        conteudo: 'Nunca tente buscar pelo título longo ou palavras-chave gerais. Copie diretamente o código DOI do artigo (ex: 10.1103/...) na barra de pesquisa; é o método garantido para abrir o PDF instantaneamente sem cair em bloqueios ou instabilidades de servidor.',
        categoria: 'academica',
        instituto: 'geral',
        autor_nome: 'Perfil Legado',
        upvotes: 88,
        status: 'approved',
        created_at: '2026-01-01T00:00:00Z',
        url: 'https://sci-hub.box',
        urlLabel: 'Acessar Sci-Hub',
        is_legacy: true
    },
    {
        id: 'legado-portal-ifusp',
        titulo: 'Portal do IFUSP: Salas, turmas e editais antes do JúpiterWeb',
        conteudo: 'Salve nos seus favoritos a aba de Graduação > Calendário e Oferecimento de Disciplinas e os Editais de Monitoria/PUB. As listas de turmas, salas de aula, bancas e datas de trancamento saem no portal dias antes de aparecerem no JúpiterWeb.',
        categoria: 'comunicacao',
        instituto: 'ifusp',
        autor_nome: 'Perfil Legado',
        upvotes: 67,
        status: 'approved',
        created_at: '2026-01-01T00:00:00Z',
        url: 'https://portal.if.usp.br',
        urlLabel: 'Acessar Portal do IFUSP',
        is_legacy: true
    },
    {
        id: 'legado-salunos',
        titulo: 'Seção de Alunos: Formate seu e-mail para resposta ágil e prioritária',
        conteudo: 'Ao mandar e-mail para a Seção de Alunos, coloque obrigatoriamente Nome Completo, Número USP e Curso logo na primeira linha. Pedidos já formatados com o código da disciplina (ex: FEP0111) são processados com prioridade e respondidos com muito mais agilidade.',
        categoria: 'permanencia',
        instituto: 'ifusp',
        autor_nome: 'Perfil Legado',
        upvotes: 73,
        status: 'approved',
        created_at: '2026-01-01T00:00:00Z',
        url: 'mailto:salunosif@usp.br?subject=Dúvida%20Acadêmica%20-%20IFUSP&body=Olá,%20saudações%20equipe%20da%20Seção%20de%20Alunos,%0D%0A%0D%0ASou%20aluno(a)%20do%20IFUSP.%0D%0ANome:%20%0D%0ANUSP:%20%0D%0ACurso:%20%0D%0ADisciplina/Turma:%20%0D%0A%0D%0ADúvida/Solicitação:%20',
        urlLabel: 'Escrever para Seção de Alunos',
        is_legacy: true
    }
];

export default function VeteranosPage() {
    const [tips, setTips] = useState<VeteransTip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('todas');
    const [selectedInstitute, setSelectedInstitute] = useState<string>('todas');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [copiedTipId, setCopiedTipId] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTip, setNewTip] = useState({
        titulo: '',
        conteudo: '',
        categoria: 'comunicacao',
        instituto: 'geral'
    });
    const [upvotedTips, setUpvotedTips] = useState<string[]>([]);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = async () => {
        setIsLoading(true);
        const res = await getApprovedTips();
        if (res.success) {
            setTips((res.data || []) as VeteransTip[]);
        } else {
            toast.error('Erro ao carregar dicas da comunidade');
        }
        setIsLoading(false);
    };

    const handleUpvote = async (id: string, isLegacy?: boolean) => {
        if (upvotedTips.includes(id)) return;

        setUpvotedTips(prev => [...prev, id]);

        if (isLegacy) {
            toast.success('Você apoiou este conselho do acervo histórico!', { icon: '⭐' });
            return;
        }

        const originalTips = [...tips];
        setTips(tips.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));

        const res = await upvoteTip(id);
        if (!res.success) {
            setTips(originalTips);
            setUpvotedTips(prev => prev.filter(t => t !== id));
            toast.error(res.error || 'Erro ao curtir. Você está logado?');
        } else {
            toast.success('Conselho apoiado!', { icon: '👍' });
        }
    };

    const handleShare = (tip: VeteransTip) => {
        if (typeof window === 'undefined') return;
        const shareText = `*${tip.titulo}*\n\n${tip.conteudo}\n\n— ${tip.autor_nome} (IFUSP 101 - HUB LabDiv)`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            setCopiedTipId(tip.id);
            toast.success('Dica copiada para a área de transferência!', { icon: '📋' });
            setTimeout(() => setCopiedTipId(null), 2500);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const res = await submitTip(newTip);
        if (res.success) {
            toast.success('Conselho transmitido! Ele foi para a fila de moderação da Torre de Controle.');
            setIsModalOpen(false);
            setNewTip({ titulo: '', conteudo: '', categoria: 'comunicacao', instituto: 'geral' });
        } else {
            toast.error(res.error || 'Erro ao enviar conselho. Você está logado?');
        }
        setIsSubmitting(false);
    };

    // Unifica dicas legadas nativas com dicas da comunidade
    const allUnifiedTips = useMemo(() => {
        const communityMap = new Set(tips.map(t => t.id));
        const filteredLegacy = DICAS_LEGADO.filter(leg => !communityMap.has(leg.id));
        return [...filteredLegacy, ...tips];
    }, [tips]);

    // Filtra por instituto, categoria e termo de busca
    const filteredTips = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return allUnifiedTips.filter(tip => {
            const tipInst = tip.instituto || 'geral';
            const matchesInstitute = selectedInstitute === 'todas' || tipInst === selectedInstitute;
            const matchesCategory = activeCategory === 'todas' || tip.categoria === activeCategory;
            const matchesSearch = !query || 
                tip.titulo.toLowerCase().includes(query) ||
                tip.conteudo.toLowerCase().includes(query) ||
                tip.autor_nome.toLowerCase().includes(query);

            return matchesInstitute && matchesCategory && matchesSearch;
        });
    }, [allUnifiedTips, selectedInstitute, activeCategory, searchQuery]);

    const getInstituteInfo = (id?: string) => {
        return USP_INSTITUTES.find(inst => inst.id === (id || 'geral')) || USP_INSTITUTES[0];
    };

    return (
        <MainLayoutWrapper>
            <div className="min-h-screen bg-transparent text-gray-900 dark:text-white selection:bg-brand-blue selection:text-white pb-24">
                {/* Header Superior Ergonômico M3 */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between mb-4 sm:mb-6 mt-2">
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/gcif/interativo" 
                            className="flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors px-3 py-1.5 border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-gray-200 shadow-sm text-xs font-black font-bukra uppercase tracking-wider"
                        >
                            <ArrowLeft className="w-4 h-4 text-brand-blue" />
                            <span>Interativo</span>
                        </Link>
                        <div className="h-4 w-[1px] bg-gray-300 dark:bg-white/10 hidden sm:block" />
                        <h1 className="text-sm sm:text-base font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-red to-brand-yellow flex items-center gap-2 font-bukra">
                            <Compass className="w-4 h-4 text-[#FFCC00]" />
                            <span>IFUSP 101</span>
                        </h1>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#FFCC00] to-amber-500 hover:brightness-105 text-[#0F4780] font-black uppercase tracking-wider text-[11px] sm:text-xs rounded-2xl transition-all flex items-center gap-2 shadow-md shadow-amber-500/20 active:scale-95 font-bukra cursor-pointer"
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>Transmitir Conselho</span>
                    </button>
                </div>

                {/* Banner de Apresentação */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-6">
                    <div className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-b from-white/90 via-white/50 to-transparent dark:from-[#1E1E1E]/90 dark:via-[#161616]/50 dark:to-transparent border border-gray-200/80 dark:border-white/10 shadow-lg backdrop-blur-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-[#FFCC00] text-[10px] font-black uppercase tracking-wider mb-2 font-bukra">
                            <Sparkles className="w-3 h-3" />
                            Feed Vertical de Dicas Rápidas • Conhecimento Transgeracional
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white font-bukra mb-2">
                            IFUSP 101: Dicas de Veteranos
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-open-sans leading-relaxed max-w-2xl">
                            Macetes práticos de estudo, resolução de perrengues e atalhos essenciais consolidados pela comunidade. Use os filtros de instituto abaixo para navegar direto ao que interessa.
                        </p>

                        {/* Barra de Pesquisa Rápida */}
                        <div className="mt-5 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Buscar por termo (ex: scholar, sci-hub, cálculo, provas, monitoria)..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white dark:bg-black/30 border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-brand-blue font-open-sans shadow-inner transition-colors"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filtros: 1. Institutos (Filtro Principal Solicitado) e 2. Categorias */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4 mb-8">
                    {/* Filtro por Instituto */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 flex items-center gap-1.5 font-bukra">
                                <Building2 className="w-3.5 h-3.5 text-brand-blue" />
                                Filtrar por Instituto:
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                                {filteredTips.length} dicas
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5 pt-0.5">
                            <button
                                onClick={() => setSelectedInstitute('todas')}
                                className={`px-3.5 py-1.5 rounded-full text-[11px] font-black font-bukra uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                    selectedInstitute === 'todas'
                                        ? 'bg-[#FFCC00] text-[#0F4780] shadow-md scale-105 border border-[#FFCC00]'
                                        : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                            >
                                Todos ({allUnifiedTips.length})
                            </button>
                            {USP_INSTITUTES.map((inst) => {
                                const isSelected = selectedInstitute === inst.id;
                                const count = allUnifiedTips.filter(t => (t.instituto || 'geral') === inst.id).length;
                                return (
                                    <button
                                        key={inst.id}
                                        onClick={() => setSelectedInstitute(inst.id)}
                                        className={`px-3 py-1.5 rounded-full text-[11px] font-black font-bukra uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                                            isSelected
                                                ? 'bg-[#0F4780] text-white shadow-md border border-[#0F4780] scale-105'
                                                : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                                        }`}
                                    >
                                        <span>{inst.shortLabel}</span>
                                        <span className="text-[10px] opacity-75 font-mono">({count})</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filtro por Categoria */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                        <button 
                            onClick={() => setActiveCategory('todas')}
                            className={`px-3 py-1 rounded-full text-[10px] font-black font-bukra uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                activeCategory === 'todas'
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                                    : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-transparent'
                            }`}
                        >
                            Todas as Categorias
                        </button>
                        {CATEGORIAS.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-3 py-1 rounded-full text-[10px] font-black font-bukra uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                                    activeCategory === cat.id
                                        ? cat.color === 'brand-yellow'
                                            ? 'bg-amber-500/20 text-amber-800 dark:text-[#FFCC00] border border-amber-500/40'
                                            : cat.color === 'brand-red'
                                            ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/40'
                                            : 'bg-blue-500/20 text-[#0F4780] dark:text-blue-300 border border-blue-500/40'
                                        : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400 border border-gray-200 dark:border-transparent'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- FEED VERTICAL DE DICAS RÁPIDAS (Layout Linear Ergonômico M3) --- */}
                <main className="max-w-4xl mx-auto px-4 sm:px-6">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-24 gap-3">
                            <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                            <p className="text-xs text-gray-400 font-bukra uppercase tracking-wider">
                                Sincronizando dicas do IFUSP 101...
                            </p>
                        </div>
                    ) : filteredTips.length > 0 ? (
                        <div className="space-y-4 sm:space-y-5">
                            {filteredTips.map((tip, idx) => {
                                const isUpvoted = upvotedTips.includes(tip.id);
                                const isLegacy = tip.is_legacy || tip.autor_nome === 'Perfil Legado';
                                const instituteInfo = getInstituteInfo(tip.instituto);

                                return (
                                    <motion.article 
                                        key={tip.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                                        className={`w-full p-5 sm:p-7 rounded-[28px] sm:rounded-[32px] transition-all shadow-md backdrop-blur-xl relative flex flex-col justify-between ${
                                            isLegacy
                                                ? 'bg-gradient-to-br from-amber-50/40 via-white to-white dark:from-[#1E1E1E] dark:via-[#1A1A1A] dark:to-[#161616] border-2 border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500/50'
                                                : 'bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 hover:border-brand-blue/40'
                                        }`}
                                    >
                                        <div>
                                            {/* Topo do Card: Identificação do Autor + Tags */}
                                            <div className="flex items-center justify-between gap-3 mb-3.5 flex-wrap">
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    {/* Avatar do Autor */}
                                                    <div className={`size-8 sm:size-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                                        isLegacy
                                                            ? 'bg-gradient-to-br from-[#FFCC00] to-amber-600 text-gray-950 font-black'
                                                            : 'bg-gradient-to-br from-[#0F4780] to-[#1F9FCF] text-white'
                                                    }`}>
                                                        {isLegacy ? (
                                                            <Archive className="size-4" />
                                                        ) : (
                                                            <GraduationCap className="size-4" />
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-bukra font-black text-xs text-gray-900 dark:text-white truncate">
                                                                {tip.autor_nome}
                                                            </span>
                                                            {isLegacy && (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-[#FFCC00] border border-amber-500/30 text-[9px] font-black uppercase font-bukra">
                                                                    <Sparkles className="size-2.5" />
                                                                    Perfil Legado
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-open-sans flex items-center gap-1">
                                                            <Clock className="size-2.5" />
                                                            {isLegacy ? 'Acervo Permanente' : 'Veterano Colaborador'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Badges de Metadados: Instituto & Categoria */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-[10px] font-black font-bukra uppercase tracking-wider">
                                                        <Building2 className="size-3 text-brand-blue" />
                                                        {instituteInfo.shortLabel}
                                                    </span>

                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider font-bukra ${
                                                        tip.categoria === 'academica'
                                                            ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                                                            : tip.categoria === 'permanencia'
                                                            ? 'bg-amber-500/10 text-amber-700 dark:text-[#FFCC00] border border-amber-500/20'
                                                            : 'bg-blue-500/10 text-brand-blue dark:text-blue-300 border border-blue-500/20'
                                                    }`}>
                                                        {tip.categoria}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Título do Conselho */}
                                            <h3 className="text-base sm:text-lg font-bold font-bukra text-gray-900 dark:text-white mb-2 leading-snug">
                                                {tip.titulo}
                                            </h3>

                                            {/* Conteúdo Detalhado */}
                                            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed mb-4 whitespace-pre-wrap">
                                                {tip.conteudo}
                                            </p>

                                            {/* Botão de Ação Rápida para Dicas com Link Externo (Google Scholar, Sci-Hub, Portal, etc.) */}
                                            {tip.url && (
                                                <div className="mb-4">
                                                    <a
                                                        href={tip.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/15 text-amber-800 dark:text-[#FFCC00] border border-amber-500/30 text-xs font-black uppercase tracking-wider font-bukra transition-all shadow-sm active:scale-95 cursor-pointer"
                                                    >
                                                        <span>{tip.urlLabel || 'Acessar Link Externo'}</span>
                                                        <ExternalLink className="size-3.5" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Rodapé do Card: Upvotes & Ações */}
                                        <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-white/5">
                                            <button 
                                                onClick={() => handleUpvote(tip.id, isLegacy)}
                                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black font-bukra uppercase tracking-wider transition-all cursor-pointer active:scale-95 ${
                                                    isUpvoted
                                                        ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30 shadow-sm'
                                                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10'
                                                }`}
                                                title="Apoiar este conselho"
                                            >
                                                <ThumbsUp className={`size-3.5 ${isUpvoted ? 'fill-current text-brand-blue' : ''}`} />
                                                <span>{tip.upvotes || 0}</span>
                                                <span className="hidden sm:inline">Apoios</span>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleShare(tip)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xs font-bold font-bukra transition-all cursor-pointer"
                                                    title="Copiar e compartilhar conselho"
                                                >
                                                    {copiedTipId === tip.id ? (
                                                        <>
                                                            <Check className="size-3.5 text-emerald-500" />
                                                            <span className="text-emerald-500 text-[10px]">Copiado!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Share2 className="size-3.5" />
                                                            <span className="text-[10px] hidden sm:inline">Compartilhar</span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 dark:bg-[#1E1E1E]/60 rounded-[32px] border border-dashed border-gray-300 dark:border-white/10 p-8">
                            <AlertCircle className="w-10 h-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                            <h4 className="text-gray-900 dark:text-white font-bold font-bukra uppercase tracking-wider text-sm mb-1">
                                Nenhum conselho encontrado
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 font-open-sans text-xs max-w-sm mx-auto mb-4">
                                Não há dicas com os filtros ou termos pesquisados. Transmita sua dica e seja o primeiro veterano a colaborar!
                            </p>
                            <button
                                onClick={() => { setSelectedInstitute('todas'); setActiveCategory('todas'); setSearchQuery(''); }}
                                className="px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-black font-bukra uppercase tracking-wider shadow-sm"
                            >
                                Limpar Filtros
                            </button>
                        </div>
                    )}
                </main>

                {/* Modal de Transmissão de Conselho (Multi-Instituto) */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl text-left"
                            >
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                
                                <div className="flex items-center gap-2 mb-2 text-brand-yellow text-xs font-black uppercase tracking-widest font-bukra">
                                    <Sparkles className="w-4 h-4" />
                                    IFUSP 101 • Transmissão de Conselho
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-gray-900 dark:text-white font-bukra mb-1">
                                    Transmitir Conselho
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-open-sans mb-6 leading-relaxed">
                                    Sua experiência pode salvar o semestre de alguém. Escolha se o conselho é válido para toda a USP ou para um instituto específico.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Destino / Instituto */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-400 mb-1.5 font-bukra">
                                            Destino do Conselho (Instituto)
                                        </label>
                                        <select 
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans"
                                            value={newTip.instituto}
                                            onChange={e => setNewTip({...newTip, instituto: e.target.value})}
                                            disabled={isSubmitting}
                                        >
                                            {USP_INSTITUTES.map(inst => (
                                                <option key={inst.id} value={inst.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                                    {inst.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Categoria */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-400 mb-1.5 font-bukra">
                                            Categoria
                                        </label>
                                        <select 
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans"
                                            value={newTip.categoria}
                                            onChange={e => setNewTip({...newTip, categoria: e.target.value})}
                                            disabled={isSubmitting}
                                        >
                                            {CATEGORIAS.map(c => (
                                                <option key={c.id} value={c.id} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Título */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-400 mb-1.5 font-bukra">
                                            Título do Conselho
                                        </label>
                                        <input 
                                            type="text" 
                                            required
                                            maxLength={100}
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-xs focus:border-brand-blue outline-none transition-colors font-open-sans placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="Ex: Como sobreviver a Física 1 ou Dicas do bandejão central"
                                            value={newTip.titulo}
                                            onChange={e => setNewTip({...newTip, titulo: e.target.value})}
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    {/* Conteúdo */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-gray-700 dark:text-gray-400 mb-1.5 font-bukra">
                                            Conselho / Dica de Veterano
                                        </label>
                                        <textarea 
                                            required
                                            maxLength={800}
                                            rows={4}
                                            className="w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl p-3 text-gray-900 dark:text-white text-xs focus:border-brand-blue outline-none transition-colors resize-none font-open-sans placeholder-gray-400 dark:placeholder-gray-500"
                                            placeholder="Escreva detalhadamente o conselho, macetes de provas, materiais recomendados ou rotas de sobrevivência..."
                                            value={newTip.conteudo}
                                            onChange={e => setNewTip({...newTip, conteudo: e.target.value})}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full mt-2 bg-gradient-to-r from-[#FFCC00] to-amber-500 text-[#0F4780] font-black uppercase tracking-widest py-3.5 rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 text-xs font-bukra cursor-pointer"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        <span>{isSubmitting ? 'Enviando à Moderação...' : 'Publicar Conselho no IFUSP 101'}</span>
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </MainLayoutWrapper>
    );
}
