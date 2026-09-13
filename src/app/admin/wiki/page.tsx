'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    ArrowLeft,
    Check,
    X,
    Trash2,
    MessageSquare,
    Loader2,
    Calendar,
    User,
    Tag,
    AlertCircle,
    PlusCircle,
    Edit3,
    GitBranch,
    Send
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import {
    getAdminWikiProposals,
    updateWikiProposalStatus,
    deleteWikiProposal
} from '@/app/actions/wiki-proposals';
import { WikiTopicProposal } from '@/types/wiki';

export default function AdminWikiModerationPage() {
    const [proposals, setProposals] = useState<WikiTopicProposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [feedbackInputs, setFeedbackInputs] = useState<Record<string, string>>({});

    const loadProposals = async () => {
        setIsLoading(true);
        try {
            const res = await getAdminWikiProposals(statusFilter, typeFilter);
            if (res.success && res.data) {
                setProposals(res.data);
                // Pre-fill feedback inputs
                const initialFeedbacks: Record<string, string> = {};
                res.data.forEach((p) => {
                    if (p.admin_feedback) {
                        initialFeedbacks[p.id] = p.admin_feedback;
                    }
                });
                setFeedbackInputs(initialFeedbacks);
            } else {
                toast.error(res.error || 'Erro ao carregar propostas.');
            }
        } catch (err: any) {
            toast.error('Erro de conexão ao buscar propostas.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProposals();
    }, [statusFilter, typeFilter]);

    const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
        setActionLoadingId(id);
        const feedback = feedbackInputs[id] || '';
        try {
            const res = await updateWikiProposalStatus(id, status, feedback);
            if (res.success) {
                toast.success(
                    status === 'approved'
                        ? 'Proposta aprovada com sucesso!'
                        : 'Proposta rejeitada com feedback registrado.'
                );
                await loadProposals();
            } else {
                toast.error(res.error || 'Erro ao atualizar proposta.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro inesperado.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente excluir permanentemente esta proposta?')) return;

        setActionLoadingId(id);
        try {
            const res = await deleteWikiProposal(id);
            if (res.success) {
                toast.success('Proposta excluída com sucesso.');
                setProposals((prev) => prev.filter((p) => p.id !== id));
            } else {
                toast.error(res.error || 'Erro ao excluir proposta.');
            }
        } catch (err: any) {
            toast.error('Erro ao excluir proposta.');
        } finally {
            setActionLoadingId(null);
        }
    };

    const getTypeBadge = (type: string, targetTitle?: string | null) => {
        switch (type) {
            case 'complement':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                        <Edit3 className="w-3 h-3 shrink-0" />
                        Complemento {targetTitle ? `• ${targetTitle}` : ''}
                    </span>
                );
            case 'related_topic':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                        <GitBranch className="w-3 h-3 shrink-0" />
                        Tópico Conexo {targetTitle ? `• Ref: ${targetTitle}` : ''}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-blue/15 text-brand-blue border border-brand-blue/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                        <PlusCircle className="w-3 h-3 shrink-0" />
                        Novo Tópico
                    </span>
                );
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="px-3 py-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                        Aprovada
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 bg-brand-red/15 text-brand-red border border-brand-red/30 text-[10px] font-black uppercase rounded-full tracking-wider">
                        Rejeitada
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-black uppercase rounded-full tracking-wider animate-pulse">
                        Pendente
                    </span>
                );
        }
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header & Navigation */}
            <div>
                <Link
                    href="/admin/cgif"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-brand-blue transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Eixo de Informação
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3 font-bukra">
                            <BookOpen className="w-8 h-8 text-brand-blue" />
                            Moderação da Wiki
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            Eixo de Informação • Avalie novos tópicos, complementos e ramificações sugeridas por estudantes.
                        </p>
                    </div>
                    <button
                        onClick={loadProposals}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2 transition-all self-start sm:self-auto"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                {/* Status Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'pending', label: 'Pendentes' },
                        { id: 'approved', label: 'Aprovadas' },
                        { id: 'rejected', label: 'Rejeitadas' },
                        { id: 'all', label: 'Todas' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setStatusFilter(tab.id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                                statusFilter === tab.id
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                    : 'bg-white/5 text-gray-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Type Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tipo:</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-blue font-medium"
                    >
                        <option value="all" className="bg-[#1E1E1E]">Todos os Tipos</option>
                        <option value="new_topic" className="bg-[#1E1E1E]">Novos Tópicos</option>
                        <option value="complement" className="bg-[#1E1E1E]">Complementos</option>
                        <option value="related_topic" className="bg-[#1E1E1E]">Tópicos Conexos</option>
                    </select>
                </div>
            </div>

            {/* Content List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="p-6 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 animate-pulse space-y-4">
                            <div className="h-4 w-1/4 bg-white/10 rounded-lg" />
                            <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                            <div className="h-16 w-full bg-white/5 rounded-2xl" />
                        </div>
                    ))}
                </div>
            ) : proposals.length === 0 ? (
                <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5">
                    <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-40" />
                    <h3 className="text-base font-bold text-gray-400 font-bukra uppercase">Nenhuma proposta encontrada</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {statusFilter === 'pending'
                            ? 'Não há propostas de tópicos ou complementos pendentes de revisão.'
                            : 'Nenhuma contribuição encontrada para os filtros selecionados.'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {proposals.map((item) => {
                        const isActionLoading = actionLoadingId === item.id;
                        return (
                            <div
                                key={item.id}
                                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 shadow-xl hover:border-white/10 transition-all flex flex-col gap-6"
                            >
                                {/* Top Badges & Meta */}
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 dark:border-white/5 pb-4">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {getTypeBadge(item.proposal_type, item.target_topic_title)}
                                        <span className="px-2.5 py-1 bg-white/5 text-gray-400 border border-white/10 text-[10px] font-bold uppercase rounded-full">
                                            Categoria: {item.category}
                                        </span>
                                        {getStatusBadge(item.status)}
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5" />
                                            <span className="font-bold text-gray-300">{item.author_name}</span>
                                            {item.author_email && (
                                                <span className="text-gray-500">({item.author_email})</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{new Date(item.created_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Title & Content */}
                                <div>
                                    <h3 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white font-bukra mb-2">
                                        {item.title}
                                    </h3>
                                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5 text-gray-300 text-xs sm:text-sm font-open-sans whitespace-pre-wrap leading-relaxed">
                                        {item.description}
                                    </div>
                                </div>

                                {/* Justification if any */}
                                {item.justification && (
                                    <div className="p-3 rounded-xl bg-brand-yellow/5 border border-brand-yellow/20 text-xs text-gray-300">
                                        <strong className="text-brand-yellow font-bold uppercase text-[10px] tracking-wider block mb-1">
                                            Justificativa do Autor:
                                        </strong>
                                        {item.justification}
                                    </div>
                                )}

                                {/* Admin Feedback & Actions */}
                                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                                    {/* Feedback input */}
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={feedbackInputs[item.id] ?? ''}
                                            onChange={(e) =>
                                                setFeedbackInputs((prev) => ({
                                                    ...prev,
                                                    [item.id]: e.target.value
                                                }))
                                            }
                                            placeholder="Nota interna ou feedback para o autor (opcional)..."
                                            className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue"
                                        />
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {item.status !== 'approved' && (
                                            <button
                                                onClick={() => handleUpdateStatus(item.id, 'approved')}
                                                disabled={isActionLoading}
                                                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                                            >
                                                {isActionLoading ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Check className="w-3.5 h-3.5" />
                                                )}
                                                Aprovar
                                            </button>
                                        )}

                                        {item.status !== 'rejected' && (
                                            <button
                                                onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                                disabled={isActionLoading}
                                                className="px-4 py-2 rounded-xl bg-brand-red/80 hover:bg-brand-red text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                                            >
                                                {isActionLoading ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <X className="w-3.5 h-3.5" />
                                                )}
                                                Rejeitar
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={isActionLoading}
                                            title="Excluir Permanentemente"
                                            className="p-2 rounded-xl bg-white/5 hover:bg-brand-red/20 text-gray-400 hover:text-brand-red transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
