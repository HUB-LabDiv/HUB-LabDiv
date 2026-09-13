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
import { 
    Network, 
    Users, 
    Clock, 
    ShieldAlert, 
    Flag, 
    CheckCircle2, 
    XCircle, 
    RefreshCw, 
    MessageSquare, 
    ExternalLink, 
    Loader2 
} from 'lucide-react';
import { getEntanglementAdminData } from '@/app/actions/entanglements';
import { updateContentReportStatus } from '@/app/actions/reports';
import { toast } from 'react-hot-toast';

export default function AdminEmaranhamentoPage() {
    const [data, setData] = useState<{
        activeConnections: number;
        pendingConnections: number;
        chatReports: any[];
    }>({
        activeConnections: 0,
        pendingConnections: 0,
        chatReports: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pendente' | 'em_analise' | 'resolvido'>('all');
    const [isPending, startTransition] = useTransition();

    const loadData = async () => {
        setIsLoading(true);
        try {
            const res = await getEntanglementAdminData();
            if (res.success && res.data) {
                setData(res.data);
            }
        } catch {
            toast.error('Erro ao carregar dados do Emaranhamento.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleUpdateReportStatus = async (reportId: string, status: 'pendente' | 'em_analise' | 'resolvido' | 'descartado') => {
        startTransition(async () => {
            const res = await updateContentReportStatus(reportId, status);
            if (res.success) {
                toast.success(`Denúncia atualizada para: ${status.replace('_', ' ')}`);
                setData(prev => ({
                    ...prev,
                    chatReports: prev.chatReports.map(r => r.id === reportId ? { ...r, status } : r)
                }));
            } else {
                toast.error(res.error || 'Falha ao atualizar status.');
            }
        });
    };

    const filteredReports = data.chatReports.filter(r => {
        if (statusFilter === 'all') return true;
        return r.status === statusFilter;
    });

    return (
        <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3 font-bukra">
                        <Network className="w-8 h-8 text-purple-400" />
                        Emaranhamento Quântico
                    </h1>
                    <p className="text-gray-400 mt-1 text-xs sm:text-sm font-open-sans">
                        Monitoramento de conexões interpessoais e auditoria forense de mensagens denunciadas.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={loadData}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 font-bukra"
                    >
                        <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        Atualizar
                    </button>
                    <Link
                        href="/interacao?tab=emaranhamento"
                        target="_blank"
                        className="px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold font-bukra flex items-center gap-2 shadow-lg shadow-brand-blue/20 transition-all"
                    >
                        <ExternalLink className="size-3.5" />
                        Abrir Chat
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/10 flex items-center gap-4 shadow-xl">
                    <div className="size-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                        <Users className="size-6" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bukra">
                            Conexões Ativas
                        </span>
                        <h3 className="text-2xl font-black text-white font-bukra mt-0.5">
                            {data.activeConnections}
                        </h3>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/10 flex items-center gap-4 shadow-xl">
                    <div className="size-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shrink-0">
                        <Clock className="size-6" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bukra">
                            Convites Pendentes
                        </span>
                        <h3 className="text-2xl font-black text-white font-bukra mt-0.5">
                            {data.pendingConnections}
                        </h3>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/10 flex items-center gap-4 shadow-xl">
                    <div className="size-12 rounded-2xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red shrink-0">
                        <ShieldAlert className="size-6" />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-bukra">
                            Mensagens Denunciadas
                        </span>
                        <h3 className="text-2xl font-black text-white font-bukra mt-0.5">
                            {data.chatReports.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Painel de Auditoria de Mensagens Denunciadas */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-black uppercase text-white font-bukra flex items-center gap-2">
                            <Flag className="size-5 text-brand-red" />
                            Auditoria Forense de Mensagens
                        </h2>
                        <p className="text-xs text-gray-400 font-open-sans">
                            Snapshots preservados de conversas privadas denunciadas pela comunidade.
                        </p>
                    </div>

                    {/* Filtro de Status */}
                    <div className="flex items-center gap-1.5 bg-[#1E1E1E] p-1 rounded-2xl border border-white/10">
                        {[
                            { id: 'all', label: 'Todas' },
                            { id: 'pendente', label: 'Pendentes' },
                            { id: 'em_analise', label: 'Em Análise' },
                            { id: 'resolvido', label: 'Resolvidas' },
                        ].map((sf) => (
                            <button
                                key={sf.id}
                                onClick={() => setStatusFilter(sf.id as any)}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold font-bukra uppercase tracking-wider transition-all ${
                                    statusFilter === sf.id
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {sf.label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-16 flex items-center justify-center">
                        <Loader2 className="size-8 animate-spin text-purple-400" />
                    </div>
                ) : filteredReports.length === 0 ? (
                    <div className="p-16 rounded-3xl bg-[#1E1E1E] border border-white/10 text-center space-y-3">
                        <CheckCircle2 className="size-12 text-emerald-400 mx-auto" />
                        <h3 className="text-base font-bold text-white font-bukra">
                            Nenhuma denúncia pendente
                        </h3>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto font-open-sans">
                            O canal de Emaranhamento Quântico está seguro e sem ocorrências no momento.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredReports.map((report) => (
                            <div
                                key={report.id}
                                className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/10 space-y-4 hover:border-purple-500/40 transition-all shadow-xl"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-brand-red/15 border border-brand-red/30 text-brand-red text-[10px] font-black uppercase tracking-wider font-bukra">
                                            {report.category}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                            ID: {report.id.slice(0, 8)}
                                        </span>
                                        <span className="text-gray-600">•</span>
                                        <span className="text-[10px] text-gray-400 font-open-sans">
                                            {new Date(report.created_at).toLocaleString('pt-BR')}
                                        </span>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            report.status === 'pendente'
                                                ? 'bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30'
                                                : report.status === 'em_analise'
                                                ? 'bg-brand-blue/15 text-brand-blue border border-brand-blue/30'
                                                : report.status === 'resolvido'
                                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                : 'bg-white/10 text-gray-400'
                                        }`}>
                                            {report.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Snapshot Forense da Mensagem */}
                                <div className="p-4 rounded-2xl bg-black/50 border border-purple-500/30 space-y-2">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-purple-300 uppercase">
                                        <span>Mensagem Denunciada (Autor: <strong>{report.metadata?.sender_name || 'Desconhecido'}</strong>)</span>
                                        <span className="text-[8px] px-2 py-0.5 rounded bg-purple-500/20">Snapshot Forense</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-mono text-gray-100 bg-white/5 p-3 rounded-xl border border-white/5 whitespace-pre-wrap leading-relaxed">
                                        "{report.metadata?.message_content || report.justification}"
                                    </p>
                                    <div className="text-[9px] text-gray-500 font-mono flex flex-wrap gap-4 pt-1">
                                        <span>Sender ID: {report.metadata?.sender_id || 'N/A'}</span>
                                        <span>Denunciante: {report.profiles?.full_name || report.profiles?.username || report.reporter_id}</span>
                                    </div>
                                </div>

                                {/* Justificativa do Denunciante */}
                                {report.justification && (
                                    <div className="text-xs text-gray-300 font-open-sans">
                                        <span className="font-bold text-gray-400 uppercase text-[10px] font-bukra">Motivo informado: </span>
                                        {report.justification}
                                    </div>
                                )}

                                {/* Ações de Moderação */}
                                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                                    <button
                                        onClick={() => handleUpdateReportStatus(report.id, 'em_analise')}
                                        disabled={isPending}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-brand-blue/20 text-brand-blue text-xs font-bold border border-brand-blue/30 transition-all font-bukra"
                                    >
                                        Em Análise
                                    </button>
                                    <button
                                        onClick={() => handleUpdateReportStatus(report.id, 'descartado')}
                                        disabled={isPending}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold border border-white/10 transition-all font-bukra"
                                    >
                                        Descartar
                                    </button>
                                    <button
                                        onClick={() => handleUpdateReportStatus(report.id, 'resolvido')}
                                        disabled={isPending}
                                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold border border-emerald-500/40 transition-all font-bukra"
                                    >
                                        Marcar como Resolvido
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
