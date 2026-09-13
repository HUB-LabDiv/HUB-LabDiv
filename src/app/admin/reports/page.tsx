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

import React, { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { m, AnimatePresence } from 'framer-motion';
import {
    Flag,
    AlertCircle,
    Calendar,
    User,
    Globe,
    ExternalLink,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    Search,
    RefreshCw,
    BookOpen,
    ShieldAlert,
    Trash2,
    Lightbulb,
    MessageSquare,
    Layers,
    SlidersHorizontal,
} from 'lucide-react';
import {
    getFeedbackReports,
    updateFeedbackReportStatus,
    deleteFeedbackReport,
} from '@/app/actions/feedback';
import {
    getContentReports,
    updateContentReportStatus,
    deleteContentReport,
} from '@/app/actions/reports';
import { toast } from 'react-hot-toast';
import { UnifiedReportItem } from '@/types/reports';

type ScopeCategory = 'all' | 'wiki' | 'content' | 'emaranhamento' | 'bug' | 'sugestao';
type StatusFilter = 'all' | 'open' | 'in_progress' | 'closed';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    open: { label: 'Pendente', color: 'text-brand-yellow', bg: 'bg-brand-yellow/15 border-brand-yellow/30' },
    pendente: { label: 'Pendente', color: 'text-brand-yellow', bg: 'bg-brand-yellow/15 border-brand-yellow/30' },
    in_progress: { label: 'Em Análise', color: 'text-brand-blue', bg: 'bg-brand-blue/15 border-brand-blue/30' },
    em_analise: { label: 'Em Análise', color: 'text-brand-blue', bg: 'bg-brand-blue/15 border-brand-blue/30' },
    closed: { label: 'Resolvido', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
    resolvido: { label: 'Resolvido', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30' },
    descartado: { label: 'Descartado', color: 'text-gray-400', bg: 'bg-white/10 border-white/15' },
};

const CATEGORY_LABELS: Record<string, string> = {
    spam: 'Spam / Divulgação Indevida',
    plagio: 'Plágio / Violação de Autoria',
    discurso_odio: 'Discurso de Ódio',
    assedio: 'Assédio / Ofensa',
    desinformacao: 'Desinformação Científica',
    abuso_infantil: 'Conteúdo Ilícito / Proteção',
    outro: 'Outro / Ajuste de Conteúdo',
    bug: 'Falha Técnica / Bug',
    sugestao: 'Sugestão de Melhoria',
    suggestion: 'Sugestão de Melhoria',
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState<UnifiedReportItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [scopeFilter, setScopeFilter] = useState<ScopeCategory>('all');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isPending, startTransition] = useTransition();

    const loadAllReports = async () => {
        setLoading(true);
        try {
            const [feedbackRes, contentRes] = await Promise.all([
                getFeedbackReports(),
                getContentReports(),
            ]);

            const unifiedList: UnifiedReportItem[] = [];

            // 1. Processar reports do feedback_reports
            if (feedbackRes.data) {
                feedbackRes.data.forEach((fb: any) => {
                    const ctx = fb.metadata?.context;
                    const isWiki =
                        Boolean(ctx?.id || ctx?.titulo || ctx?.local?.toLowerCase().includes('wiki')) ||
                        Boolean(fb.metadata?.url?.includes('/wiki') || fb.metadata?.url?.includes('/gcif'));

                    let title = 'Report Geral';
                    if (isWiki) {
                        title = ctx?.titulo ? `Wiki: ${ctx.titulo}` : 'Denúncia na Wiki IFUSP';
                    } else if (fb.type === 'bug') {
                        title = 'Falha Técnica Reportada';
                    } else if (fb.type === 'sugestao' || fb.type === 'suggestion') {
                        title = 'Sugestão da Comunidade';
                    }

                    unifiedList.push({
                        id: fb.id,
                        source: 'feedback',
                        title,
                        typeOrCategory: isWiki ? 'wiki' : fb.type || 'outro',
                        description: fb.description || '',
                        status: fb.status || 'open',
                        reporterName:
                            fb.profiles?.full_name ||
                            (fb.profiles?.username ? `@${fb.profiles.username}` : fb.metadata?.user_email || 'Usuário Anônimo'),
                        reporterEmail: fb.metadata?.user_email || undefined,
                        url: fb.metadata?.url || undefined,
                        screenshotUrl: fb.screenshot_url || undefined,
                        wikiContext: isWiki
                            ? {
                                  id: ctx?.id,
                                  titulo: ctx?.titulo,
                                  local: ctx?.local,
                              }
                            : undefined,
                        created_at: fb.created_at,
                        raw: fb,
                    });
                });
            }

            // 2. Processar denúncias de conteúdo (public.reports)
            if (contentRes.data) {
                contentRes.data.forEach((cr: any) => {
                    const itemTypeLabel =
                        cr.item_type === 'submission'
                            ? 'Publicação'
                            : cr.item_type === 'comment'
                            ? 'Comentário'
                            : cr.item_type === 'pergunta'
                            ? 'Pergunta Científica'
                            : cr.item_type === 'micro_article'
                            ? 'Micro-Artigo'
                            : cr.item_type === 'emaranhamento_message'
                            ? 'Mensagem (Emaranhamento)'
                            : 'Conteúdo Comunitário';

                    unifiedList.push({
                        id: cr.id,
                        source: 'content',
                        title: `Denúncia: ${itemTypeLabel}`,
                        typeOrCategory: cr.category || 'content',
                        description: cr.justification || cr.reason || 'Denúncia de violação de diretrizes.',
                        status: cr.status || 'pendente',
                        reporterName:
                            cr.profiles?.full_name ||
                            (cr.profiles?.username ? `@${cr.profiles.username}` : 'Usuário Anônimo'),
                        url: cr.metadata?.url || (cr.submission_id ? `/arquivo/${cr.submission_id}` : undefined),
                        contentDetails: {
                            itemType: cr.item_type || 'submission',
                            reportedItemId: cr.reported_item_id || cr.submission_id,
                        },
                        created_at: cr.created_at,
                        raw: cr,
                    });
                });
            }

            // Ordenar por data decrescente
            unifiedList.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            setReports(unifiedList);
            if (unifiedList.length > 0 && !selectedId) {
                setSelectedId(unifiedList[0].id);
            }
        } catch (err: any) {
            toast.error('Erro ao carregar denúncias: ' + (err?.message || 'Falha inesperada'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllReports();
    }, []);

    // Atualização de Status
    const handleUpdateStatus = (item: UnifiedReportItem, newStatus: string) => {
        // Atualização otimista
        setReports((prev) =>
            prev.map((r) => (r.id === item.id ? { ...r, status: newStatus } : r))
        );

        startTransition(async () => {
            if (item.source === 'feedback') {
                const normStatus =
                    newStatus === 'open' || newStatus === 'pendente'
                        ? 'open'
                        : newStatus === 'in_progress' || newStatus === 'em_analise'
                        ? 'in_progress'
                        : 'closed';
                const res = await updateFeedbackReportStatus(item.id, normStatus);
                if (!res.success) {
                    toast.error('Erro ao atualizar status: ' + res.error);
                    await loadAllReports();
                } else {
                    toast.success('Status do report atualizado!');
                }
            } else {
                const normStatus =
                    newStatus === 'open' || newStatus === 'pendente'
                        ? 'pendente'
                        : newStatus === 'in_progress' || newStatus === 'em_analise'
                        ? 'em_analise'
                        : newStatus === 'descartado'
                        ? 'descartado'
                        : 'resolvido';
                const res = await updateContentReportStatus(item.id, normStatus as any);
                if (!res.success) {
                    toast.error('Erro ao atualizar status: ' + res.error);
                    await loadAllReports();
                } else {
                    toast.success('Status da denúncia atualizado!');
                }
            }
        });
    };

    // Exclusão de Denúncia
    const handleDeleteReport = (item: UnifiedReportItem) => {
        if (!confirm('Tem certeza que deseja excluir esta denúncia/report permanentemente?')) {
            return;
        }

        setReports((prev) => prev.filter((r) => r.id !== item.id));
        if (selectedId === item.id) {
            const remaining = reports.filter((r) => r.id !== item.id);
            setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        }

        startTransition(async () => {
            if (item.source === 'feedback') {
                const res = await deleteFeedbackReport(item.id);
                if (!res.success) {
                    toast.error('Erro ao excluir: ' + res.error);
                    await loadAllReports();
                } else {
                    toast.success('Report excluído!');
                }
            } else {
                const res = await deleteContentReport(item.id);
                if (!res.success) {
                    toast.error('Erro ao excluir: ' + res.error);
                    await loadAllReports();
                } else {
                    toast.success('Denúncia excluída!');
                }
            }
        });
    };

    // Filtragem dos cards
    const filteredReports = reports.filter((item) => {
        // Filtro por Escopo / Categoria
        if (scopeFilter === 'wiki' && !item.wikiContext && item.typeOrCategory !== 'wiki') {
            return false;
        }
        if (scopeFilter === 'content' && item.source !== 'content') {
            return false;
        }
        if (scopeFilter === 'emaranhamento' && item.contentDetails?.itemType !== 'emaranhamento_message') {
            return false;
        }
        if (scopeFilter === 'bug' && item.typeOrCategory !== 'bug') {
            return false;
        }
        if (scopeFilter === 'sugestao' && item.typeOrCategory !== 'sugestao' && item.typeOrCategory !== 'suggestion') {
            return false;
        }

        // Filtro por Status
        if (statusFilter === 'open') {
            if (item.status !== 'open' && item.status !== 'pendente') return false;
        } else if (statusFilter === 'in_progress') {
            if (item.status !== 'in_progress' && item.status !== 'em_analise') return false;
        } else if (statusFilter === 'closed') {
            if (item.status !== 'closed' && item.status !== 'resolvido' && item.status !== 'descartado') {
                return false;
            }
        }

        // Busca por texto
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            const matchesText =
                item.title.toLowerCase().includes(q) ||
                item.description.toLowerCase().includes(q) ||
                item.reporterName.toLowerCase().includes(q) ||
                (item.url && item.url.toLowerCase().includes(q)) ||
                (item.wikiContext?.titulo && item.wikiContext.titulo.toLowerCase().includes(q));
            if (!matchesText) return false;
        }

        return true;
    });

    const selectedReport = reports.find((r) => r.id === selectedId) || null;

    // Contadores
    const counts = {
        all: reports.length,
        wiki: reports.filter((r) => r.wikiContext || r.typeOrCategory === 'wiki').length,
        content: reports.filter((r) => r.source === 'content').length,
        emaranhamento: reports.filter((r) => r.contentDetails?.itemType === 'emaranhamento_message').length,
        bug: reports.filter((r) => r.typeOrCategory === 'bug').length,
        sugestao: reports.filter((r) => r.typeOrCategory === 'sugestao' || r.typeOrCategory === 'suggestion').length,
        open: reports.filter((r) => r.status === 'open' || r.status === 'pendente').length,
        in_progress: reports.filter((r) => r.status === 'in_progress' || r.status === 'em_analise').length,
        closed: reports.filter((r) => r.status === 'closed' || r.status === 'resolvido' || r.status === 'descartado').length,
    };

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-white p-4 sm:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* --- Top Header --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-11 rounded-2xl bg-brand-red/15 text-brand-red flex items-center justify-center border border-brand-red/30 shadow-lg shadow-brand-red/10">
                                <Flag className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-black font-bukra uppercase tracking-tight text-white italic">
                                Central de Denúncias & Reports
                            </h1>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-400 font-open-sans max-w-2xl leading-relaxed">
                            Painel unificado de moderação e resolução. Monitore denúncias de tópicos da Wiki, violações de diretrizes na comunidade e relatórios de anomalias técnicas.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <button
                            onClick={loadAllReports}
                            disabled={loading}
                            className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-bold font-bukra uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                            title="Recarregar dados"
                        >
                            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                            Atualizar
                        </button>
                    </div>
                </div>

                {/* --- Filtros por Escopo / Categoria --- */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'all' as ScopeCategory, label: 'Todas as Ocorrências', count: counts.all, icon: Layers },
                        { id: 'wiki' as ScopeCategory, label: 'Wiki IFUSP', count: counts.wiki, icon: BookOpen, color: 'text-brand-yellow' },
                        { id: 'emaranhamento' as ScopeCategory, label: 'Emaranhamento', count: counts.emaranhamento, icon: MessageSquare, color: 'text-purple-400' },
                        { id: 'content' as ScopeCategory, label: 'Conteúdo Comunitário', count: counts.content, icon: ShieldAlert, color: 'text-brand-red' },
                        { id: 'bug' as ScopeCategory, label: 'Falhas Técnicas', count: counts.bug, icon: AlertCircle, color: 'text-brand-red' },
                        { id: 'sugestao' as ScopeCategory, label: 'Sugestões', count: counts.sugestao, icon: Lightbulb, color: 'text-brand-blue' },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        const isSelected = scopeFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setScopeFilter(tab.id)}
                                className={`px-4 py-2.5 rounded-2xl text-xs font-black font-bukra uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${
                                    isSelected
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20 border border-brand-blue/50'
                                        : 'bg-[#1E1E1E] text-gray-400 hover:text-white border border-white/5 hover:border-white/15'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${tab.color && !isSelected ? tab.color : ''}`} />
                                <span>{tab.label}</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                                        isSelected ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400'
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* --- Barra de Busca e Filtro de Status --- */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#1E1E1E]/80 p-3 rounded-2xl border border-white/5">
                    {/* Input de Busca */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por tópico, descrição, autor ou URL..."
                            className="w-full pl-10 pr-4 py-2 bg-black/30 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue font-open-sans"
                        />
                    </div>

                    {/* Filtro de Status */}
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'all' as StatusFilter, label: 'Todos', count: counts.all },
                            { id: 'open' as StatusFilter, label: 'Pendentes', count: counts.open },
                            { id: 'in_progress' as StatusFilter, label: 'Em Análise', count: counts.in_progress },
                            { id: 'closed' as StatusFilter, label: 'Resolvidos', count: counts.closed },
                        ].map((sf) => (
                            <button
                                key={sf.id}
                                onClick={() => setStatusFilter(sf.id)}
                                className={`px-3 py-1.5 rounded-xl text-[11px] font-black font-bukra uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 ${
                                    statusFilter === sf.id
                                        ? 'bg-white/20 text-white border border-white/30'
                                        : 'text-gray-400 hover:text-white bg-transparent'
                                }`}
                            >
                                <span>{sf.label}</span>
                                <span className="text-[10px] opacity-70 font-mono">({sf.count})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- Grid Principal: Lista + Detalhes --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Lista de Denúncias (Esquerda) */}
                    <div className="lg:col-span-5 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 no-scrollbar">
                        {loading ? (
                            Array(5)
                                .fill(0)
                                .map((_, i) => (
                                    <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                                ))
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-16 px-4 bg-[#1E1E1E]/60 rounded-3xl border border-dashed border-white/10">
                                <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-3 opacity-40" />
                                <h3 className="text-sm font-black font-bukra uppercase text-gray-300">
                                    Nenhuma denúncia encontrada
                                </h3>
                                <p className="text-xs text-gray-500 font-open-sans mt-1">
                                    Não há registros correspondentes aos filtros selecionados.
                                </p>
                            </div>
                        ) : (
                            filteredReports.map((item) => {
                                const isSelected = selectedId === item.id;
                                const isWiki = Boolean(item.wikiContext || item.typeOrCategory === 'wiki');
                                const isContent = item.source === 'content';
                                const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG['open'];

                                return (
                                    <m.div
                                        key={item.id}
                                        layout
                                        onClick={() => setSelectedId(item.id)}
                                        className={`p-5 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                                            isSelected
                                                ? 'bg-[#242424] border-brand-blue shadow-lg shadow-brand-blue/10 ring-1 ring-brand-blue/30'
                                                : 'bg-[#1E1E1E] border-white/5 hover:border-white/20 hover:bg-[#222222]'
                                        }`}
                                    >
                                        {/* Barra lateral de tipo */}
                                        <div
                                            className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                                                isWiki
                                                    ? 'bg-brand-yellow'
                                                    : isContent
                                                    ? 'bg-brand-red'
                                                    : item.typeOrCategory === 'bug'
                                                    ? 'bg-brand-red'
                                                    : 'bg-brand-blue'
                                            }`}
                                        />

                                        <div className="flex items-center justify-between gap-2 mb-2">
                                            {/* Tag de Origem */}
                                            {isWiki ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30">
                                                    <BookOpen className="w-3 h-3" />
                                                    Wiki IFUSP
                                                </span>
                                            ) : isContent ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-red/15 text-brand-red border border-brand-red/30">
                                                    <ShieldAlert className="w-3 h-3" />
                                                    Conteúdo Comunitário
                                                </span>
                                            ) : item.typeOrCategory === 'bug' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-red/15 text-brand-red border border-brand-red/30">
                                                    <AlertCircle className="w-3 h-3" />
                                                    Falha Técnica
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                                                    <Lightbulb className="w-3 h-3" />
                                                    Sugestão
                                                </span>
                                            )}

                                            {/* Status Badge */}
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusCfg.bg} ${statusCfg.color}`}
                                            >
                                                {statusCfg.label}
                                            </span>
                                        </div>

                                        {/* Título */}
                                        <h4 className="text-sm font-bold font-bukra text-white mb-1 line-clamp-1 group-hover:text-brand-blue transition-colors">
                                            {item.wikiContext?.titulo || item.title}
                                        </h4>

                                        {/* Descrição */}
                                        <p className="text-xs text-gray-300 font-open-sans line-clamp-2 leading-relaxed mb-3">
                                            {item.description}
                                        </p>

                                        {/* Footer do Card */}
                                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-open-sans pt-2 border-t border-white/5">
                                            <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                                                <User className="w-3 h-3 text-gray-500 shrink-0" />
                                                <span className="truncate">{item.reporterName}</span>
                                            </div>
                                            <span className="shrink-0 text-gray-500 font-mono">
                                                {new Date(item.created_at).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                })}
                                            </span>
                                        </div>
                                    </m.div>
                                );
                            })
                        )}
                    </div>

                    {/* Detalhes da Denúncia Selecionada (Direita) */}
                    <div className="lg:col-span-7 sticky top-6">
                        <AnimatePresence mode="wait">
                            {selectedReport ? (
                                <m.div
                                    key={selectedReport.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 15 }}
                                    className="bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
                                >
                                    {/* Header do Detalhe */}
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/10">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                                                    ID: {selectedReport.id.slice(0, 8)}
                                                </span>
                                                <span className="text-gray-600">•</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(selectedReport.created_at).toLocaleString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                            <h2 className="text-xl sm:text-2xl font-black font-bukra uppercase text-white tracking-tight">
                                                {selectedReport.title}
                                            </h2>
                                        </div>

                                        {/* Botões Rápidos de Status */}
                                        <div className="flex items-center gap-1.5 shrink-0 bg-black/40 p-1 rounded-2xl border border-white/10">
                                            <button
                                                onClick={() => handleUpdateStatus(selectedReport, 'open')}
                                                disabled={isPending}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                    selectedReport.status === 'open' || selectedReport.status === 'pendente'
                                                        ? 'bg-brand-yellow text-gray-950 font-bold shadow-md'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                                title="Marcar como Pendente"
                                            >
                                                Pendente
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedReport, 'in_progress')}
                                                disabled={isPending}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                    selectedReport.status === 'in_progress' || selectedReport.status === 'em_analise'
                                                        ? 'bg-brand-blue text-white font-bold shadow-md'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                                title="Marcar como Em Análise"
                                            >
                                                Em Análise
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(selectedReport, 'closed')}
                                                disabled={isPending}
                                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                                                    selectedReport.status === 'closed' || selectedReport.status === 'resolvido'
                                                        ? 'bg-emerald-500 text-white font-bold shadow-md'
                                                        : 'text-gray-400 hover:text-white'
                                                }`}
                                                title="Marcar como Resolvido"
                                            >
                                                Resolvido
                                            </button>
                                        </div>
                                    </div>

                                    {/* DESTAQUE ESPECIAL: Se for da Wiki */}
                                    {selectedReport.wikiContext && (
                                        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-yellow/15 via-brand-yellow/5 to-transparent border border-brand-yellow/30 relative overflow-hidden">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                                                <div className="flex items-start gap-3.5">
                                                    <div className="size-11 rounded-xl bg-brand-yellow text-gray-950 flex items-center justify-center shrink-0 font-bold shadow-lg shadow-brand-yellow/20">
                                                        <BookOpen className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black font-bukra uppercase tracking-widest text-brand-yellow">
                                                            Tópico da Wiki Denunciado
                                                        </span>
                                                        <h3 className="text-lg font-black font-bukra text-white">
                                                            {selectedReport.wikiContext.titulo || 'Tópico de Conhecimento'}
                                                        </h3>
                                                        <p className="text-xs text-gray-300 font-open-sans mt-0.5">
                                                            Local: <span className="font-semibold text-white">{selectedReport.wikiContext.local || 'Célula da Wiki'}</span>
                                                            {selectedReport.wikiContext.id && (
                                                                <> • ID do Tópico: <code className="text-brand-yellow">{selectedReport.wikiContext.id}</code></>
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={
                                                        selectedReport.wikiContext.id
                                                            ? `/wiki/${selectedReport.wikiContext.id}`
                                                            : selectedReport.url || '/gcif'
                                                    }
                                                    target="_blank"
                                                    className="px-4 py-2 rounded-xl bg-brand-yellow hover:bg-brand-yellow/90 text-gray-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 hover:scale-105 active:scale-95 shadow-md shadow-brand-yellow/20"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                    Ver Tópico
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* DESTAQUE ESPECIAL: Se for Denúncia de Conteúdo Comunitário / Chat */}
                                    {selectedReport.source === 'content' && (
                                        <div className="p-5 rounded-2xl bg-gradient-to-br from-brand-red/15 via-brand-red/5 to-transparent border border-brand-red/30 space-y-4">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-xl bg-brand-red text-white flex items-center justify-center shrink-0">
                                                        <ShieldAlert className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-black font-bukra uppercase tracking-widest text-brand-red">
                                                            {selectedReport.contentDetails?.itemType === 'emaranhamento_message' ? 'Emaranhamento (Chat)' : 'Violação Reportada'}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-white font-bukra">
                                                            {CATEGORY_LABELS[selectedReport.typeOrCategory] || selectedReport.typeOrCategory}
                                                        </h4>
                                                    </div>
                                                </div>

                                                {selectedReport.url && (
                                                    <Link
                                                        href={selectedReport.url}
                                                        target="_blank"
                                                        className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        Ver no HUB
                                                    </Link>
                                                )}
                                            </div>

                                            {/* Transcrição Forense se for Mensagem de Chat */}
                                            {selectedReport.contentDetails?.itemType === 'emaranhamento_message' && (
                                                <div className="p-4 rounded-xl bg-black/50 border border-purple-500/30 space-y-2">
                                                    <div className="flex items-center justify-between text-[10px] uppercase font-bold text-purple-400 font-mono">
                                                        <span>Autor: <strong>{selectedReport.raw?.metadata?.sender_name || 'Usuário'}</strong></span>
                                                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-[8px]">Snapshot Forense</span>
                                                    </div>
                                                    <p className="text-xs sm:text-sm font-mono text-gray-100 bg-white/5 p-3 rounded-lg border border-white/5 whitespace-pre-wrap">
                                                        "{selectedReport.raw?.metadata?.message_content || selectedReport.description}"
                                                    </p>
                                                    {selectedReport.raw?.metadata?.sender_id && (
                                                        <div className="text-[9px] text-gray-500 font-mono flex items-center gap-2">
                                                            <span>Sender ID: {selectedReport.raw.metadata.sender_id}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Relato / Descrição */}
                                    <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                                        <span className="text-[10px] font-black font-bukra uppercase tracking-widest text-gray-400">
                                            Descrição / Relato do Usuário
                                        </span>
                                        <p className="text-sm sm:text-base text-gray-200 font-open-sans leading-relaxed whitespace-pre-wrap">
                                            {selectedReport.description}
                                        </p>
                                    </div>

                                    {/* Screenshot se houver */}
                                    {selectedReport.screenshotUrl && (
                                        <div className="space-y-2">
                                            <span className="text-[10px] font-black font-bukra uppercase tracking-widest text-gray-400">
                                                Evidência Anexa (Captura de Tela)
                                            </span>
                                            <a
                                                href={selectedReport.screenshotUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block rounded-2xl overflow-hidden border border-white/10 hover:border-brand-blue transition-all group relative"
                                            >
                                                <img
                                                    src={selectedReport.screenshotUrl}
                                                    alt="Evidência"
                                                    className="w-full max-h-80 object-cover group-hover:scale-102 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs uppercase tracking-wider">
                                                    <ExternalLink className="w-4 h-4" />
                                                    Abrir imagem completa
                                                </div>
                                            </a>
                                        </div>
                                    )}

                                    {/* Metadados e Autor */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Autor */}
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <User className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div className="truncate">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 block">
                                                    Reportado por
                                                </span>
                                                <p className="text-xs font-bold text-white truncate">
                                                    {selectedReport.reporterName}
                                                </p>
                                                {selectedReport.reporterEmail && (
                                                    <span className="text-[10px] text-gray-400 truncate block">
                                                        {selectedReport.reporterEmail}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* URL de Origem */}
                                        <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center gap-3">
                                            <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                                <Globe className="w-5 h-5 text-brand-blue" />
                                            </div>
                                            <div className="truncate">
                                                <span className="text-[9px] font-black uppercase tracking-wider text-gray-500 block">
                                                    URL Detectada
                                                </span>
                                                {selectedReport.url ? (
                                                    <a
                                                        href={selectedReport.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs font-bold text-brand-blue hover:underline truncate block"
                                                    >
                                                        {selectedReport.url}
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-gray-500">Não informada</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rodapé com Ação de Excluir */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <button
                                            onClick={() => handleDeleteReport(selectedReport)}
                                            disabled={isPending}
                                            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-brand-red border border-red-500/20 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Excluir Denúncia
                                        </button>

                                        <span className="text-[11px] text-gray-500 font-open-sans">
                                            Origem: {selectedReport.source === 'feedback' ? 'Canal Geral / Wiki' : 'Moderação Comunitária'}
                                        </span>
                                    </div>
                                </m.div>
                            ) : (
                                <div className="h-96 flex flex-col items-center justify-center bg-[#1E1E1E]/40 rounded-3xl border border-dashed border-white/10 text-center p-8">
                                    <Flag className="w-12 h-12 text-gray-600 mb-4 opacity-40" />
                                    <h3 className="text-sm font-black font-bukra uppercase text-gray-400">
                                        Nenhuma denúncia selecionada
                                    </h3>
                                    <p className="text-xs text-gray-500 font-open-sans mt-1 max-w-xs">
                                        Clique em um item da lista ao lado para visualizar os detalhes completos e aplicar a moderação.
                                    </p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
