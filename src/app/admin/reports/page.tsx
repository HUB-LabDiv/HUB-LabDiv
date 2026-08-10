'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

import React, { useEffect, useState, useTransition } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    Calendar,
    User,
    Globe,
    Image as ImageIcon,
    ExternalLink,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    Search,
    RefreshCw,
} from 'lucide-react';
import { getFeedbackReports, updateFeedbackReportStatus } from '@/app/actions/feedback';
import { toast } from 'react-hot-toast';

const TYPE_LABELS: Record<string, string> = {
    bug: 'Falha',
    sugestao: 'Sugestão',
    suggestion: 'Sugestão',
    outro: 'Outro',
};

const STATUS_COLORS: Record<string, string> = {
    open: 'bg-brand-yellow/20 text-brand-yellow',
    in_progress: 'bg-brand-blue/20 text-brand-blue',
    closed: 'bg-green-500/20 text-green-400',
};

const STATUS_LABELS: Record<string, string> = {
    open: 'Aberto',
    in_progress: 'Em Foco',
    closed: 'Concluído',
};

export default function AdminReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any>(null);
    const [filter, setFilter] = useState('all');
    const [isPending, startTransition] = useTransition();

    const loadReports = async () => {
        setLoading(true);
        const { data, error } = await getFeedbackReports();
        if (error) {
            toast.error('Erro ao carregar reports: ' + error);
        } else {
            setReports(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReports();
    }, []);

    const handleUpdateStatus = (id: string, newStatus: string) => {
        // Optimistic update
        setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
        if (selectedReport?.id === id) {
            setSelectedReport((prev: any) => ({ ...prev, status: newStatus }));
        }

        startTransition(async () => {
            const result = await updateFeedbackReportStatus(id, newStatus);
            if (!result.success) {
                toast.error('Erro ao atualizar status: ' + result.error);
                await loadReports(); // revert via reload
            } else {
                toast.success('Status atualizado!');
            }
        });
    };

    const getReporterName = (report: any) => {
        // Tenta do join de profiles primeiro
        if (report.profiles?.full_name) return report.profiles.full_name;
        if (report.profiles?.username) return `@${report.profiles.username}`;
        // Fallback para metadata
        if (report.metadata?.user_email) return report.metadata.user_email;
        if (report.user_id) return `Usuário ${report.user_id.slice(0, 8)}`;
        return 'Anônimo';
    };

    const filteredReports = reports.filter(r => {
        if (filter === 'all') return true;
        return r.status === filter;
    });

    const counts = {
        all: reports.length,
        open: reports.filter(r => r.status === 'open').length,
        in_progress: reports.filter(r => r.status === 'in_progress').length,
        closed: reports.filter(r => r.status === 'closed').length,
    };

    return (
        <div className="min-h-screen bg-transparent text-gray-900 dark:text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="size-10 bg-brand-red/10 rounded-xl flex items-center justify-center border border-brand-red/20">
                                <AlertCircle className="text-brand-red size-6" />
                            </div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Central de Anomalias</h1>
                        </div>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">
                            Gestão de Feedback e Bugs Hub Lab-Div • {counts.all} registros
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={loadReports}
                            disabled={loading}
                            className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all disabled:opacity-50"
                            title="Recarregar"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>

                        <div className="flex gap-2 bg-gray-100/50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5 backdrop-blur-md">
                            {(['all', 'open', 'in_progress', 'closed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 ${filter === f
                                        ? 'bg-brand-red text-white'
                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                >
                                    {f === 'all' ? 'Todos' : f === 'open' ? 'Abertos' : f === 'in_progress' ? 'Em Foco' : 'Concluídos'}
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'}`}>
                                        {counts[f]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* List */}
                    <div className="lg:col-span-5 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 no-scrollbar">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="h-36 bg-white/5 animate-pulse rounded-3xl" />
                            ))
                        ) : filteredReports.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 backdrop-blur-sm">
                                <CheckCircle2 className="size-12 text-gray-400 dark:text-gray-700 mx-auto mb-4 opacity-20" />
                                <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Sem anomalias detectadas</p>
                                {filter !== 'all' && (
                                    <button onClick={() => setFilter('all')} className="mt-3 text-[10px] text-brand-blue uppercase tracking-widest hover:underline">
                                        Ver todos
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredReports.map((report) => (
                                <m.div
                                    key={report.id}
                                    layoutId={report.id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`p-6 rounded-[32px] border transition-all cursor-pointer group ${selectedReport?.id === report.id
                                        ? 'bg-brand-red/10 border-brand-red/30'
                                        : 'bg-white/40 dark:bg-white/5 border-gray-200 dark:border-white/5 hover:border-brand-red/20 hover:bg-white/60 dark:hover:bg-white/10'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${report.type === 'bug'
                                            ? 'bg-brand-red/20 text-brand-red'
                                            : report.type === 'sugestao' || report.type === 'suggestion'
                                                ? 'bg-brand-blue/20 text-brand-blue'
                                                : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                                            }`}>
                                            {TYPE_LABELS[report.type] || report.type}
                                        </span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">
                                            {new Date(report.created_at).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Reporter name */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <User size={11} className="text-gray-400 shrink-0" />
                                        <span className="text-[11px] font-bold text-gray-500 truncate">{getReporterName(report)}</span>
                                    </div>

                                    <p className="text-sm font-bold text-gray-600 dark:text-gray-300 line-clamp-2 mb-4 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                        {report.description}
                                    </p>
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                        <span className={`px-2 py-0.5 rounded-full ${STATUS_COLORS[report.status] || 'bg-gray-200 dark:bg-white/10 text-gray-500'}`}>
                                            {STATUS_LABELS[report.status] || report.status}
                                        </span>
                                        <ChevronRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </m.div>
                            ))
                        )}
                    </div>

                    {/* Detail View */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {selectedReport ? (
                                <m.div
                                    key={selectedReport.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-md rounded-[40px] p-10 overflow-y-auto no-scrollbar"
                                >
                                    <div className="flex items-start justify-between mb-10 gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Detalhes da Ocorrência</h2>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">ID: {selectedReport.id.slice(0, 8)}</p>
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            {(['open', 'in_progress', 'closed'] as const).map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => handleUpdateStatus(selectedReport.id, s)}
                                                    disabled={isPending}
                                                    className={`size-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-50 ${selectedReport.status === s
                                                        ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                                        : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
                                                        }`}
                                                    title={STATUS_LABELS[s]}
                                                >
                                                    {s === 'open' ? <Clock size={18} /> : s === 'in_progress' ? <Search size={18} /> : <CheckCircle2 size={18} />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Reporter card */}
                                        <div className="p-6 bg-brand-blue/5 border border-brand-blue/20 rounded-3xl flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                                                <User size={22} className="text-brand-blue" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Enviado por</p>
                                                <p className="text-base font-bold text-gray-900 dark:text-white">{getReporterName(selectedReport)}</p>
                                                {selectedReport.metadata?.user_email && selectedReport.metadata.user_email !== getReporterName(selectedReport) && (
                                                    <p className="text-xs text-gray-500">{selectedReport.metadata.user_email}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="p-8 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5">
                                            <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">Relato do Usuário</h3>
                                            <p className="text-lg font-medium text-gray-700 dark:text-gray-200 leading-relaxed">
                                                {selectedReport.description}
                                            </p>
                                        </div>

                                        {selectedReport.screenshot_url && (
                                            <div>
                                                <h3 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Captura de Tela</h3>
                                                <a href={selectedReport.screenshot_url} target="_blank" rel="noopener noreferrer" className="block relative group rounded-3xl overflow-hidden border border-white/10">
                                                    <img src={selectedReport.screenshot_url} alt="Evidência" className="w-full h-auto group-hover:scale-105 transition-transform duration-700" />
                                                    <div className="absolute inset-0 bg-background-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <ExternalLink className="text-white" />
                                                    </div>
                                                </a>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="p-6 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5">
                                                <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">Metadados</h3>
                                                <div className="space-y-3">
                                                    <div className="flex items-start gap-2 text-xs font-bold text-gray-400">
                                                        <Globe size={14} className="text-brand-blue mt-0.5 shrink-0" />
                                                        <span className="truncate">{selectedReport.metadata?.url || 'URL não capturada'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                                                        <Calendar size={14} className="text-brand-blue shrink-0" />
                                                        {new Date(selectedReport.created_at).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 bg-gray-50/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/5">
                                                <h3 className="text-[10px] font-black text-gray-500 dark:text-gray-600 uppercase tracking-[0.3em] mb-4">Status de Operação</h3>
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-12 rounded-2xl flex items-center justify-center ${selectedReport.status === 'closed'
                                                        ? 'bg-green-500/20'
                                                        : selectedReport.status === 'in_progress'
                                                            ? 'bg-brand-blue/20'
                                                            : 'bg-brand-yellow/20'
                                                        }`}>
                                                        {selectedReport.status === 'closed'
                                                            ? <CheckCircle2 className="text-green-400" />
                                                            : selectedReport.status === 'in_progress'
                                                                ? <Search className="text-brand-blue" />
                                                                : <Clock className="text-brand-yellow" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black uppercase text-gray-900 dark:text-white">
                                                            {STATUS_LABELS[selectedReport.status] || selectedReport.status}
                                                        </p>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase">Detectado no Hub</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </m.div>
                            ) : (
                                <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/5 rounded-[40px] border border-dashed border-white/5 opacity-40">
                                    <AlertCircle size={48} className="text-gray-700 mb-6" />
                                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">Selecione uma anomalia para analisar</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
