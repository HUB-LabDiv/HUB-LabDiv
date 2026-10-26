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

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    CheckCircle2,
    XCircle,
    RotateCcw,
    Sparkles,
    Trash2,
    Clock,
    FileText,
    ExternalLink,
    Layers,
    UserCheck,
    MessageSquare,
    Cpu,
    Briefcase,
    Share2,
    Compass,
    AlertTriangle,
    Undo2,
    Filter,
    ChevronRight,
    Loader2,
    Info,
    GraduationCap,
    Download
} from 'lucide-react';
import {
    fetchUnifiedModerationQueue,
    executeBatchModeration,
    getTeacherProofSignedUrl
} from '@/app/actions/admin';
import { ModerationItemType, QueueDecision } from '@/types';
import { FacultyMatch } from '@/lib/facultyDetector';

const STAGING_STORAGE_KEY = 'hub_admin_swipe_staging_queue';

interface UnifiedQueueItem {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    authorName?: string;
    authorEmail?: string;
    proofPath?: string;
    details?: any;
    facultyMatch?: FacultyMatch | null;
    createdAt: string;
    axis: 'comunidade' | 'informativo' | 'ferramentas' | 'personas';
}

const AXIS_CONFIG = {
    todos: { label: 'Todos os Eixos', color: '#0F4780', border: 'border-brand-blue/30', bg: 'bg-brand-blue/10' },
    comunidade: { label: 'Comunidade', color: '#0F4780', border: 'border-[#0F4780]/30', bg: 'bg-[#0F4780]/10' },
    informativo: { label: 'Informativo', color: '#F14343', border: 'border-[#F14343]/30', bg: 'bg-[#F14343]/10' },
    ferramentas: { label: 'Ferramentas', color: '#FFCC00', border: 'border-[#FFCC00]/30', bg: 'bg-[#FFCC00]/10' },
    personas: { label: 'Perfis & Docência', color: '#8B5CF6', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
};

function formatWaitingTime(createdAt: string): string {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'há poucos minutos';
    if (diffHours === 1) return 'há 1 hora';
    if (diffHours < 24) return `há ${diffHours} horas`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'há 1 dia';
    return `há ${diffDays} dias`;
}

export function SwipeModerationFeed() {
    const [queue, setQueue] = useState<UnifiedQueueItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAxis, setSelectedAxis] = useState<'todos' | 'comunidade' | 'informativo' | 'ferramentas' | 'personas'>('todos');
    const [stagedDecisions, setStagedDecisions] = useState<QueueDecision[]>([]);
    const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [itemToReject, setItemToReject] = useState<UnifiedQueueItem | null>(null);
    const [previewDocUrl, setPreviewDocUrl] = useState<string | null>(null);
    const [isLoadingDoc, setIsLoadingDoc] = useState(false);

    // Carrega a fila do servidor
    const loadQueue = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetchUnifiedModerationQueue();
            if (res.success && res.items) {
                setQueue(res.items);
            } else {
                toast.error(res.error || 'Erro ao carregar fila de moderação');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro de conexão');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Restaura decisões encadeadas no localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STAGING_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setStagedDecisions(parsed);
                }
            }
        } catch {
            // ignore
        }
        loadQueue();
    }, [loadQueue]);

    // Persiste decisões no localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STAGING_STORAGE_KEY, JSON.stringify(stagedDecisions));
        } catch {
            // ignore
        }
    }, [stagedDecisions]);

    // Fila filtrada ignorando os já encenados
    const stagedIds = useMemo(() => new Set(stagedDecisions.map(d => d.itemId)), [stagedDecisions]);

    const activeQueue = useMemo(() => {
        return queue.filter(item => {
            if (stagedIds.has(item.id)) return false;
            if (selectedAxis === 'todos') return true;
            return item.axis === selectedAxis;
        });
    }, [queue, stagedIds, selectedAxis]);

    const currentItem = activeQueue[0] || null;

    // Ações de encenação
    const stageDecision = useCallback((item: UnifiedQueueItem, decision: 'approve' | 'reject', reason?: string, editedPayload?: any) => {
        const newDecision: QueueDecision = {
            itemId: item.id,
            itemType: item.type as ModerationItemType,
            decision,
            feedback: reason || (decision === 'reject' ? 'Não atende aos critérios da moderação.' : undefined),
            proofPath: item.proofPath,
            editedPayload
        };

        setStagedDecisions(prev => [...prev, newDecision]);
        const isProfessorPromo = editedPayload?.promote_to_professor;
        toast(
            decision === 'approve'
                ? (isProfessorPromo ? `Marcado: Aprovar & Promover a Professor "${item.title.slice(0, 20)}..."` : `Marcado para Aprovar: "${item.title.slice(0, 24)}..."`)
                : `Marcado para Rejeitar: "${item.title.slice(0, 24)}..."`,
            {
                icon: decision === 'approve' ? (isProfessorPromo ? '🎓' : '✅') : '❌',
                duration: 2000,
                style: {
                    borderRadius: '16px',
                    background: '#1E1E1E',
                    color: '#fff',
                    border: decision === 'approve' ? (isProfessorPromo ? '1px solid rgba(255,204,0,0.5)' : '1px solid rgba(15,71,128,0.4)') : '1px solid rgba(241,67,67,0.4)'
                }
            }
        );
    }, []);

    const skipCurrent = useCallback(() => {
        if (!currentItem) return;
        setQueue(prev => {
            const index = prev.findIndex(i => i.id === currentItem.id);
            if (index === -1) return prev;
            const updated = [...prev];
            const [removed] = updated.splice(index, 1);
            updated.push(removed);
            return updated;
        });
        toast('Item movido para o fim da fila', { icon: '⏭️', duration: 1500 });
    }, [currentItem]);

    const undoLastDecision = useCallback(() => {
        setStagedDecisions(prev => {
            if (prev.length === 0) {
                toast('Nenhuma ação para desfazer', { icon: 'ℹ️' });
                return prev;
            }
            const copy = [...prev];
            const popped = copy.pop();
            toast(`Desfeita ação sobre item ${popped?.itemId.slice(0, 8)}`, { icon: '↩️' });
            return copy;
        });
    }, []);

    const clearStaging = useCallback(() => {
        if (stagedDecisions.length === 0) return;
        if (confirm('Deseja descartar todas as ações marcadas nesta sessão?')) {
            setStagedDecisions([]);
            localStorage.removeItem(STAGING_STORAGE_KEY);
            toast.success('Fila de ações em lote limpa!');
        }
    }, [stagedDecisions.length]);

    // Executa em lote atômico via RPC Supabase
    const handleExecuteBatch = async () => {
        if (stagedDecisions.length === 0) return;

        setIsSubmittingBatch(true);
        const toastId = toast.loading(`Executando ${stagedDecisions.length} ações em lote...`);

        try {
            const res = await executeBatchModeration(stagedDecisions);
            if (res.success) {
                toast.success(
                    `Sucesso! ${stagedDecisions.length} ações executadas com sucesso.`,
                    { id: toastId, duration: 4000 }
                );
                setStagedDecisions([]);
                localStorage.removeItem(STAGING_STORAGE_KEY);
                await loadQueue();
            } else {
                toast.error(res.error || 'Erro na execução em lote.', { id: toastId });
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro inesperado.', { id: toastId });
        } finally {
            setIsSubmittingBatch(false);
        }
    };

    // Atalhos de teclado no Desktop
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignora se o foco estiver num input ou textarea
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }

            if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                undoLastDecision();
                return;
            }

            if (!currentItem || showRejectModal) return;

            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                stageDecision(currentItem, 'approve');
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                setItemToReject(currentItem);
                setShowRejectModal(true);
            } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
                e.preventDefault();
                skipCurrent();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentItem, showRejectModal, stageDecision, skipCurrent, undoLastDecision]);

    // Contadores de encenação
    const stagedApproveCount = stagedDecisions.filter(d => d.decision === 'approve').length;
    const stagedRejectCount = stagedDecisions.filter(d => d.decision === 'reject').length;

    // Visualizar documento de professor
    const handleViewTeacherProof = async (path: string) => {
        setIsLoadingDoc(true);
        const res = await getTeacherProofSignedUrl(path);
        if (res.success && res.url) {
            setPreviewDocUrl(res.url);
            window.open(res.url, '_blank', 'noopener,noreferrer');
        } else {
            toast.error(res.error || 'Erro ao abrir comprovante');
        }
        setIsLoadingDoc(false);
    };

    // Ícone do tipo de item
    const getItemIcon = (type: string) => {
        switch (type) {
            case 'teacher_verification':
                return <GraduationCap className="w-4 h-4 text-[#FFCC00]" />;
            case 'submission':
            case 'submission_edit':
                return <FileText className="w-4 h-4 text-[#F14343]" />;
            case 'comment':
                return <MessageSquare className="w-4 h-4 text-[#0F4780]" />;
            case 'profile':
            case 'profile_edit':
                return <UserCheck className="w-4 h-4 text-purple-400" />;
            case 'software':
            case 'software_feedback':
                return <Cpu className="w-4 h-4 text-[#FFCC00]" />;
            case 'oportunidade':
                return <Briefcase className="w-4 h-4 text-[#F14343]" />;
            case 'constelacao_edge':
                return <Share2 className="w-4 h-4 text-[#0F4780]" />;
            default:
                return <Layers className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* 1. SELETOR DE EIXOS DA MARCA (M3 CHIPS) */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-2">
                    {(['todos', 'comunidade', 'informativo', 'ferramentas', 'personas'] as const).map(axis => {
                        const isSelected = selectedAxis === axis;
                        const config = AXIS_CONFIG[axis];
                        const count = queue.filter(item => {
                            if (stagedIds.has(item.id)) return false;
                            if (axis === 'todos') return true;
                            return item.axis === axis;
                        }).length;

                        return (
                            <button
                                key={axis}
                                onClick={() => setSelectedAxis(axis)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
                                    isSelected
                                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md scale-102'
                                        : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-400'
                                }`}
                            >
                                <span
                                    className="w-2 h-2 rounded-full"
                                    style={{ backgroundColor: config.color }}
                                />
                                <span>{config.label}</span>
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                                    isSelected
                                        ? 'bg-white/20 text-white dark:bg-black/20 dark:text-gray-900 font-bold'
                                        : 'bg-gray-100 dark:bg-white/10 text-gray-500'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={loadQueue}
                    disabled={isLoading}
                    title="Recarregar Fila"
                    className="p-2 rounded-full bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors shrink-0 disabled:opacity-50"
                >
                    <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {/* ATALHOS DESKTOP DICA */}
            <div className="hidden sm:flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-2xl text-[11px] text-gray-400 font-mono">
                <span className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
                    Atalhos Rápidos:
                </span>
                <div className="flex items-center gap-3">
                    <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold">A</kbd> Aprovar</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold">R</kbd> Rejeitar</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold">S</kbd> Pular</span>
                    <span><kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold">Ctrl+Z</kbd> Desfazer</span>
                </div>
            </div>

            {/* 2. ÁREA DE SWIPE INTERATIVO */}
            <div className="relative min-h-[460px] flex items-center justify-center">
                {isLoading ? (
                    <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 animate-pulse space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="h-6 w-32 bg-gray-200 dark:bg-white/10 rounded-full" />
                            <div className="h-4 w-20 bg-gray-200 dark:bg-white/10 rounded-full" />
                        </div>
                        <div className="h-8 w-3/4 bg-gray-200 dark:bg-white/10 rounded-xl" />
                        <div className="h-24 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                        <div className="h-12 w-full bg-gray-200 dark:bg-white/10 rounded-2xl" />
                    </div>
                ) : !currentItem ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-xl p-10 text-center rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 shadow-sm space-y-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-500 mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black font-bukra text-gray-900 dark:text-white uppercase tracking-tight">
                            Fila Zerada!
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto font-open-sans">
                            Não há itens pendentes para {selectedAxis === 'todos' ? 'nenhum eixo' : `o eixo ${selectedAxis}`}. Bom trabalho!
                        </p>
                        {stagedDecisions.length > 0 && (
                            <p className="text-xs text-brand-yellow font-bold uppercase tracking-wider">
                                {stagedDecisions.length} ações aguardando execução na barra inferior.
                            </p>
                        )}
                    </motion.div>
                ) : (
                    <SwipeDeckCard
                        item={currentItem}
                        remainingCount={activeQueue.length}
                        onApprove={() => stageDecision(currentItem, 'approve')}
                        onApproveAsProfessor={currentItem.facultyMatch ? () => stageDecision(currentItem, 'approve', undefined, { promote_to_professor: true }) : undefined}
                        onReject={() => {
                            setItemToReject(currentItem);
                            setShowRejectModal(true);
                        }}
                        onSkip={skipCurrent}
                        onViewTeacherProof={handleViewTeacherProof}
                        isLoadingDoc={isLoadingDoc}
                    />
                )}
            </div>

            {/* 3. BARRA FLUTUANTE DE EXECUÇÃO EM LOTE (M3 ELEVATION) */}
            <AnimatePresence>
                {stagedDecisions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-40 bg-white/95 dark:bg-[#1E1E1E]/95 backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-2xl rounded-3xl p-4 flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <button
                                onClick={undoLastDecision}
                                title="Desfazer Última Marcação (Ctrl+Z)"
                                className="p-2.5 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                            >
                                <Undo2 className="w-4 h-4" />
                            </button>

                            <button
                                onClick={clearStaging}
                                title="Descartar Fila"
                                className="p-2.5 rounded-2xl bg-brand-red/10 hover:bg-brand-red/20 text-brand-red transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="text-xs font-mono font-bold leading-tight">
                                <span className="text-[#0F4780] dark:text-blue-400 font-black">{stagedApproveCount} Aprov.</span>
                                <span className="text-gray-400 mx-1.5">•</span>
                                <span className="text-[#F14343] font-black">{stagedRejectCount} Rej.</span>
                            </div>
                        </div>

                        <button
                            onClick={handleExecuteBatch}
                            disabled={isSubmittingBatch}
                            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#0F4780] to-[#0A3056] text-white text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-102 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmittingBatch ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Executando...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                                    <span>Executar Lote ({stagedDecisions.length})</span>
                                </>
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MODAL DE MOTIVO DE REJEIÇÃO */}
            <AnimatePresence>
                {showRejectModal && itemToReject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-[#1E1E1E] w-full max-w-md rounded-3xl p-6 border border-gray-200 dark:border-white/10 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-2xl bg-brand-red/10 text-brand-red">
                                    <XCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase tracking-tight">
                                        Confirmar Rejeição
                                    </h4>
                                    <p className="text-xs text-gray-400">
                                        Item: {itemToReject.title.slice(0, 32)}...
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">
                                    Motivo da Recusa (Opcional):
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={e => setRejectionReason(e.target.value)}
                                    placeholder="Ex.: Imagem fora dos padrões, texto incompleto, etc."
                                    rows={3}
                                    className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-3 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-red transition-all"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setItemToReject(null);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        stageDecision(itemToReject, 'reject', rejectionReason);
                                        setShowRejectModal(false);
                                        setItemToReject(null);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 rounded-xl bg-brand-red hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
                                >
                                    Rejeitar Item
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Subcomponente do Cartão com Suporte a Drag/Swipe Touch 375px
interface SwipeDeckCardProps {
    item: UnifiedQueueItem;
    remainingCount: number;
    onApprove: () => void;
    onApproveAsProfessor?: () => void;
    onReject: () => void;
    onSkip: () => void;
    onViewTeacherProof: (path: string) => void;
    isLoadingDoc: boolean;
}

function SwipeDeckCard({
    item,
    remainingCount,
    onApprove,
    onApproveAsProfessor,
    onReject,
    onSkip,
    onViewTeacherProof,
    isLoadingDoc
}: SwipeDeckCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-18, 18]);
    const opacityApprove = useTransform(x, [40, 140], [0, 1]);
    const opacityReject = useTransform(x, [-40, -140], [0, 1]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 110) {
            onApprove();
        } else if (info.offset.x < -110) {
            onReject();
        }
    };

    const axisConfig = AXIS_CONFIG[item.axis] || AXIS_CONFIG.todos;

    return (
        <motion.div
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={handleDragEnd}
            whileTap={{ cursor: 'grabbing' }}
            className="w-full max-w-xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl hover:shadow-2xl transition-shadow relative overflow-hidden select-none cursor-grab"
        >
            {/* OVERLAY VISUAL DE SWIPE (APROVAR DIREITA / REJEITAR ESQUERDA) */}
            <motion.div
                style={{ opacity: opacityApprove }}
                className="absolute inset-0 bg-green-500/10 pointer-events-none flex items-center justify-end pr-8 z-30"
            >
                <div className="bg-green-600 text-white font-black text-xs font-mono uppercase px-4 py-2 rounded-2xl shadow-lg border border-white/20 transform rotate-12">
                    ✓ APROVAR
                </div>
            </motion.div>

            <motion.div
                style={{ opacity: opacityReject }}
                className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-start pl-8 z-30"
            >
                <div className="bg-[#F14343] text-white font-black text-xs font-mono uppercase px-4 py-2 rounded-2xl shadow-lg border border-white/20 transform -rotate-12">
                    ✕ REJEITAR
                </div>
            </motion.div>

            {/* CABEÇALHO DO CARD */}
            <div className="flex items-center justify-between gap-2 border-b border-gray-100 dark:border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                    <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: axisConfig.color }}
                    />
                    <span className="text-[11px] font-black uppercase font-mono tracking-wider text-gray-500 dark:text-gray-400">
                        {axisConfig.label}
                    </span>
                    <span className="text-gray-300 dark:text-white/10">•</span>
                    <span className="text-[10px] font-mono text-gray-400 uppercase bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-full">
                        {item.type.replace('_', ' ')}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>{formatWaitingTime(item.createdAt)}</span>
                </div>
            </div>

            {/* AUTOR & CONTEXTO */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-blue/20 to-brand-yellow/20 flex items-center justify-center font-black text-xs text-brand-blue font-bukra shrink-0 border border-brand-blue/20">
                    {item.authorName ? item.authorName.slice(0, 2).toUpperCase() : 'HB'}
                </div>
                <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white truncate">
                        {item.authorName || 'Autor Desconhecido'}
                    </p>
                    {item.authorEmail && (
                        <p className="text-[11px] text-gray-400 font-mono truncate">
                            {item.authorEmail}
                        </p>
                    )}
                </div>
            </div>

            {/* TÍTULO E DESCRIÇÃO PRINCIPAL */}
            <div className="space-y-2 mb-6">
                <h3 className="text-base sm:text-lg font-black font-bukra text-gray-900 dark:text-white uppercase tracking-tight leading-snug">
                    {item.title}
                </h3>
                {item.subtitle && (
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                        {item.subtitle}
                    </p>
                )}
            </div>

            {/* VISUALIZADORES ESPECÍFICOS POR TIPO */}
            {item.type === 'teacher_verification' && item.proofPath && (
                <div className="mb-6 p-4 rounded-2xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-black text-[#FFCC00] uppercase tracking-wider">
                        <GraduationCap className="w-4 h-4" /> Comprovante Docente Anexado
                    </div>
                    <p className="text-[11px] text-gray-400 font-mono">
                        Arquivo: {item.proofPath.split('/').pop()}
                    </p>
                    <button
                        onClick={() => onViewTeacherProof(item.proofPath!)}
                        disabled={isLoadingDoc}
                        className="py-2 px-3.5 rounded-xl bg-[#FFCC00] hover:bg-yellow-500 text-gray-900 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                    >
                        {isLoadingDoc ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                            <ExternalLink className="w-3.5 h-3.5" />
                        )}
                        Visualizar Comprovante Oficial (LGPD)
                    </button>
                </div>
            )}

            {(item.type === 'submission_edit' || item.type === 'profile_edit') && item.details && (
                <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                        Alterações Propostas (Diff):
                    </p>
                    <div className="text-xs font-mono bg-white dark:bg-[#121212] p-3 rounded-xl border border-gray-100 dark:border-white/5 max-h-36 overflow-y-auto space-y-1">
                        {Object.entries(item.details).map(([key, val]) => (
                            <div key={key} className="flex flex-col border-b border-gray-100 dark:border-white/5 pb-1">
                                <span className="text-[10px] text-brand-blue font-bold">{key}:</span>
                                <span className="text-gray-700 dark:text-gray-300 text-[11px]">
                                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* SUGESTÃO INTELIGENTE DE DOCENTE IFUSP */}
            {item.facultyMatch && (
                <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-amber-500" /> Sugestão Inteligente: Docente IFUSP
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                            Confiança {item.facultyMatch.confidence === 'high' ? 'Alta' : 'Média'}
                        </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                        {item.facultyMatch.title} — {item.facultyMatch.departmentName} ({item.facultyMatch.departmentCode})
                    </p>
                    <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                        {item.facultyMatch.building && <span>🏢 {item.facultyMatch.building} {item.facultyMatch.room ? `• Sala ${item.facultyMatch.room}` : ''}</span>}
                        {item.facultyMatch.phone && <span>📞 Ramal: {item.facultyMatch.phone}</span>}
                    </div>
                </div>
            )}

            {/* BOTÃO DOURADO DE PROMOÇÃO RÁPIDA A PROFESSOR */}
            {item.facultyMatch && onApproveAsProfessor && (
                <div className="mb-3">
                    <button
                        onClick={onApproveAsProfessor}
                        className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                    >
                        <GraduationCap className="w-4 h-4" />
                        <span>Aprovar & Promover a Professor</span>
                    </button>
                </div>
            )}

            {/* BOTÕES DE AÇÃO INFERIORES */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-gray-100 dark:border-white/5">
                <button
                    onClick={onReject}
                    className="py-3 px-3 rounded-2xl bg-brand-red/10 hover:bg-brand-red/20 border border-brand-red/30 text-brand-red text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <XCircle className="w-4 h-4 shrink-0" />
                    <span>Rejeitar [R]</span>
                </button>

                <button
                    onClick={onSkip}
                    className="py-3 px-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <span>Pular [S]</span>
                </button>

                <button
                    onClick={onApprove}
                    className="py-3 px-3 rounded-2xl bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-600 dark:text-green-400 text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Aprovar [A]</span>
                </button>
            </div>

            {/* INDICADOR DE RESTANTES */}
            <div className="mt-4 text-center">
                <span className="text-[10px] font-mono text-gray-400">
                    Restam {remainingCount} itens nesta visualização
                </span>
            </div>
        </motion.div>
    );
}
