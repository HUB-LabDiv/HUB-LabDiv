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

import React, { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  History,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  reviewPipelineProposalsAction,
  rollbackOfficialSnapshotAction,
} from '@/app/actions/data-pipeline';
import type {
  DataPipelineProposal,
  DataPipelineRun,
  OfficialSnapshotHistorySummary,
  PipelineChangeType,
  PipelineModule,
} from '@/types/data-pipeline';

interface Props {
  pendingProposals: DataPipelineProposal[];
  historyProposals: DataPipelineProposal[];
  recentRuns: DataPipelineRun[];
  snapshotVersions: Partial<Record<PipelineModule, number>>;
  snapshotHistory: OfficialSnapshotHistorySummary[];
}

const MODULE_LABELS: Record<PipelineModule, string> = {
  departments: 'Departamentos & Docentes',
  initiatives: 'Iniciativas CCEx',
  events: 'Eventos & Colóquios',
  news: 'Notícias IFUSP',
  spaces: 'Espaços & Auditórios',
  disciplines: 'Disciplinas (JúpiterWeb)',
  courses: 'Matrizes Curriculares',
};

const CHANGE_BADGE: Record<
  PipelineChangeType,
  { label: string; className: string }
> = {
  added: {
    label: 'Novo',
    className:
      'bg-[#1F9FCF]/15 text-[#0F4780] dark:text-[#1F9FCF] border-[#1F9FCF]/30',
  },
  updated: {
    label: 'Editado',
    className:
      'bg-[#FFCC00]/20 text-[#0F4780] dark:text-[#FFCC00] border-[#FFCC00]/40',
  },
  removed: {
    label: 'Remoção',
    className:
      'bg-[#F14343]/15 text-[#F14343] border-[#F14343]/35',
  },
};

function formatPreviewValue(val: unknown): string {
  if (val === undefined) return '—';
  if (val === null) return 'null';
  if (typeof val === 'string') return val.length > 260 ? `${val.slice(0, 260)}...` : val;
  const serialized = JSON.stringify(val);
  return serialized.length > 260 ? `${serialized.slice(0, 260)}...` : serialized;
}

export function DataPipelineModerationClient({
  pendingProposals,
  historyProposals,
  recentRuns,
  snapshotVersions,
  snapshotHistory,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'versions'>('pending');
  const [selectedModule, setSelectedModule] = useState<'all' | PipelineModule>('all');
  const [selectedChangeType, setSelectedChangeType] = useState<'all' | PipelineChangeType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedJsonIds, setExpandedJsonIds] = useState<Set<string>>(new Set());
  const [removalConfirmBatch, setRemovalConfirmBatch] = useState<{
    module: PipelineModule;
    proposals: DataPipelineProposal[];
  } | null>(null);

  const filteredPending = useMemo(() => {
    return pendingProposals.filter((p) => {
      if (selectedModule !== 'all' && p.module !== selectedModule) return false;
      if (selectedChangeType !== 'all' && p.change_type !== selectedChangeType) return false;
      return true;
    });
  }, [pendingProposals, selectedModule, selectedChangeType]);

  const filteredHistory = useMemo(() => {
    return historyProposals.filter((p) => {
      if (selectedModule !== 'all' && p.module !== selectedModule) return false;
      return true;
    });
  }, [historyProposals, selectedModule]);

  const latestRun = recentRuns[0];

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpandJson = (id: string) => {
    setExpandedJsonIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const executeBatchReview = (
    module: PipelineModule,
    proposals: DataPipelineProposal[],
    decision: 'approved' | 'rejected' | 'reopen'
  ) => {
    startTransition(async () => {
      const res = await reviewPipelineProposalsAction({
        module,
        proposalIds: proposals.map((p) => p.id),
        decision,
      });

      if (!res.ok) {
        toast.error(res.error || 'Falha ao processar lote.');
        return;
      }

      const verb =
        decision === 'approved'
          ? 'publicadas no site oficial'
          : decision === 'rejected'
          ? 'rejeitadas'
          : 'reabertas para revisão';
      toast.success(`${res.updatedCount || proposals.length} proposta(s) ${verb}!`);

      setSelectedIds((prev) => {
        const next = new Set(prev);
        proposals.forEach((p) => next.delete(p.id));
        return next;
      });
      setRemovalConfirmBatch(null);
      router.refresh();
    });
  };

  const handleApproveRequest = (proposals: DataPipelineProposal[]) => {
    if (proposals.length === 0) return;
    // Agrupa por módulo (a RPC valida Optimistic Lock por módulo)
    const byModule = new Map<PipelineModule, DataPipelineProposal[]>();
    for (const p of proposals) {
      const list = byModule.get(p.module) || [];
      list.push(p);
      byModule.set(p.module, list);
    }

    if (byModule.size > 1) {
      toast.error('Selecione propostas de um único módulo por vez para aprovação em lote.');
      return;
    }

    const [mod, modProposals] = Array.from(byModule.entries())[0];
    const hasRemovals = modProposals.some((p) => p.change_type === 'removed');
    if (hasRemovals) {
      setRemovalConfirmBatch({ module: mod, proposals: modProposals });
      return;
    }

    executeBatchReview(mod, modProposals, 'approved');
  };

  const handleRejectRequest = (proposals: DataPipelineProposal[]) => {
    if (proposals.length === 0) return;
    const byModule = new Map<PipelineModule, DataPipelineProposal[]>();
    for (const p of proposals) {
      const list = byModule.get(p.module) || [];
      list.push(p);
      byModule.set(p.module, list);
    }

    startTransition(async () => {
      let total = 0;
      for (const [mod, modProposals] of byModule.entries()) {
        const res = await reviewPipelineProposalsAction({
          module: mod,
          proposalIds: modProposals.map((p) => p.id),
          decision: 'rejected',
        });
        if (!res.ok) {
          toast.error(res.error || `Falha ao rejeitar módulo ${mod}`);
          return;
        }
        total += res.updatedCount || modProposals.length;
      }
      toast.success(`${total} proposta(s) rejeitada(s). Não reaparecerão enquanto idênticas.`);
      setSelectedIds(new Set());
      router.refresh();
    });
  };

  const handleRollback = (module: PipelineModule, targetVersion: number) => {
    startTransition(async () => {
      const res = await rollbackOfficialSnapshotAction({ module, targetVersion });
      if (!res.ok) {
        toast.error(res.error || 'Erro ao restaurar versão.');
        return;
      }
      toast.success(`Módulo ${MODULE_LABELS[module]} restaurado para v${targetVersion} (nova v${res.version}).`);
      router.refresh();
    });
  };

  const selectedList = filteredPending.filter((p) => selectedIds.has(p.id));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-gray-900 dark:text-white">
      {/* Cabeçalho M3 */}
      <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <Link
              href="/admin/cgif"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4780] dark:text-[#1F9FCF] hover:underline min-h-[36px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Moderação CGIF
            </Link>
            <h1 className="font-bukra text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-[#FFCC00] shrink-0" />
              Fila do Hub Data Pipeline
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl">
              Nenhuma alteração raspada do IFUSP ou JúpiterWeb vai direto para o site público. Revise o comparador
              Antes/Depois e aprove ou rejeite com atualização instantânea.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="rounded-2xl bg-[#FFCC00]/15 border border-[#FFCC00]/40 px-4 py-3 text-center">
              <div className="text-xs font-bold uppercase tracking-wider text-[#0F4780] dark:text-[#FFCC00]">
                Pendentes
              </div>
              <div className="font-bukra text-2xl font-bold">{pendingProposals.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Status das Execuções Diárias */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#1F9FCF]" />
            Última Execução Diária
          </div>
          <div className="mt-2 font-bukra text-base font-bold">
            {latestRun
              ? new Date(latestRun.started_at).toLocaleString('pt-BR', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })
              : 'Aguardando 1º disparo'}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Status do Robô</div>
          <div className="mt-2 flex items-center gap-2 font-bukra text-base font-bold">
            {latestRun?.status === 'success' && (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#1F9FCF]" />
                <span>Saudável</span>
              </>
            )}
            {latestRun?.status === 'partial_failure' && (
              <>
                <AlertTriangle className="w-5 h-5 text-[#FFCC00]" />
                <span>Parcial (Circuit Breaker)</span>
              </>
            )}
            {latestRun?.status === 'failed' && (
              <>
                <ShieldAlert className="w-5 h-5 text-[#F14343]" />
                <span>Falha</span>
              </>
            )}
            {!latestRun && <span>—</span>}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Propostas na Fila</div>
          <div className="mt-2 font-bukra text-xl font-bold text-[#0F4780] dark:text-[#1F9FCF]">
            {pendingProposals.length}
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">Snapshots Publicados</div>
          <div className="mt-2 font-bukra text-xl font-bold">
            {Object.keys(snapshotVersions).length} / 7 módulos
          </div>
        </div>
      </div>

      {/* Abas M3 */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'pending' as const, label: `Pendentes (${pendingProposals.length})` },
          { id: 'history' as const, label: `Histórico (${historyProposals.length})` },
          { id: 'versions' as const, label: `Versões & Rollback (${snapshotHistory.length})` },
        ].map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[48px] px-5 rounded-full text-sm font-bold transition-all ${
                active
                  ? 'bg-[#0F4780] text-white dark:bg-[#1F9FCF] dark:text-[#121212] shadow-sm'
                  : 'bg-white dark:bg-[#1E1E1E] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:border-[#1F9FCF]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filtros por Módulo e Tipo (Pendentes / Histórico) */}
      {activeTab !== 'versions' && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedModule('all')}
              className={`min-h-[40px] px-4 rounded-full text-xs font-bold border transition-colors ${
                selectedModule === 'all'
                  ? 'bg-[#1F9FCF]/15 border-[#1F9FCF] text-[#0F4780] dark:text-[#1F9FCF]'
                  : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
              }`}
            >
              Todos os Módulos
            </button>
            {(Object.keys(MODULE_LABELS) as PipelineModule[]).map((mod) => (
              <button
                key={mod}
                type="button"
                onClick={() => setSelectedModule(mod)}
                className={`min-h-[40px] px-4 rounded-full text-xs font-bold border transition-colors ${
                  selectedModule === mod
                    ? 'bg-[#1F9FCF]/15 border-[#1F9FCF] text-[#0F4780] dark:text-[#1F9FCF]'
                    : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
                }`}
              >
                {MODULE_LABELS[mod]}
              </button>
            ))}
          </div>

          {activeTab === 'pending' && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {(['all', 'added', 'updated', 'removed'] as const).map((ct) => (
                  <button
                    key={ct}
                    type="button"
                    onClick={() => setSelectedChangeType(ct)}
                    className={`min-h-[40px] px-4 rounded-full text-xs font-bold border transition-colors ${
                      selectedChangeType === ct
                        ? 'bg-[#FFCC00]/20 border-[#FFCC00] text-[#0F4780] dark:text-[#FFCC00]'
                        : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {ct === 'all'
                      ? 'Todas Operações'
                      : ct === 'added'
                      ? 'Novos'
                      : ct === 'updated'
                      ? 'Editados'
                      : 'Remoções'}
                  </button>
                ))}
              </div>

              {selectedModule !== 'all' && filteredPending.length > 0 && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleApproveRequest(filteredPending)}
                  className="min-h-[48px] px-5 rounded-full bg-[#0F4780] hover:bg-[#0F4780]/90 dark:bg-[#1F9FCF] dark:text-[#121212] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  Aprovar Módulo ({filteredPending.length})
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Barra Flutuante de Seleção em Lote */}
      {activeTab === 'pending' && selectedList.length > 0 && (
        <div className="sticky top-4 z-30 rounded-2xl bg-[#0F4780] dark:bg-[#1E1E1E] border border-[#1F9FCF]/40 text-white p-4 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm font-bold">
            {selectedList.length} item(ns) selecionado(s) para ação em lote
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleApproveRequest(selectedList)}
              className="min-h-[48px] px-5 rounded-full bg-[#1F9FCF] text-[#121212] text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              Aprovar Selecionados
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleRejectRequest(selectedList)}
              className="min-h-[48px] px-5 rounded-full bg-[#F14343] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Rejeitar Selecionados
            </button>
          </div>
        </div>
      )}

      {/* Aba Pendentes */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {filteredPending.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-10 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-[#1F9FCF] mx-auto" />
              <div className="font-bukra text-lg font-bold">Fila Limpa!</div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Nenhuma alteração pendente de aprovação para os filtros atuais.
              </p>
            </div>
          ) : (
            filteredPending.map((prop) => {
              const badge = CHANGE_BADGE[prop.change_type];
              const checked = selectedIds.has(prop.id);
              const isExpanded = expandedJsonIds.has(prop.id);

              return (
                <div
                  key={prop.id}
                  className={`rounded-3xl bg-white dark:bg-[#1E1E1E] border p-5 sm:p-6 transition-all ${
                    checked
                      ? 'border-[#1F9FCF] ring-2 ring-[#1F9FCF]/25'
                      : 'border-gray-200 dark:border-white/10'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSelect(prop.id)}
                        aria-label={`Selecionar ${prop.entity_title}`}
                        className="mt-1 h-5 w-5 rounded accent-[#1F9FCF] cursor-pointer"
                      />
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200">
                            {MODULE_LABELS[prop.module]}
                          </span>
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            {prop.entity_key}
                          </span>
                        </div>
                        <h2 className="font-bukra text-base sm:text-lg font-bold">
                          {prop.entity_title}
                        </h2>
                        {prop.source_url && (
                          <a
                            href={prop.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F4780] dark:text-[#1F9FCF] hover:underline"
                          >
                            Conferir na fonte oficial (IFUSP/JúpiterWeb)
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleApproveRequest([prop])}
                        className="min-h-[48px] px-5 rounded-full bg-[#0F4780] hover:bg-[#0F4780]/90 dark:bg-[#1F9FCF] dark:text-[#121212] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleRejectRequest([prop])}
                        className="min-h-[48px] px-5 rounded-full border border-[#F14343]/40 text-[#F14343] hover:bg-[#F14343]/10 text-xs font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>
                  </div>

                  {/* Comparador Visual Campo a Campo (Mobile: empilhado, Desktop: 2 colunas) */}
                  <div className="mt-4 space-y-2">
                    {(prop.changed_fields.length > 0
                      ? prop.changed_fields.slice(0, 8)
                      : ['registro_completo']
                    ).map((field) => (
                      <div
                        key={field}
                        className="rounded-2xl bg-gray-50 dark:bg-[#121212] border border-gray-200 dark:border-white/5 p-3 sm:p-4"
                      >
                        <div className="text-xs font-bold uppercase tracking-wider text-[#0F4780] dark:text-[#FFCC00] mb-2">
                          Campo: {field}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs font-mono break-words">
                          <div className="rounded-xl bg-[#F14343]/10 border border-[#F14343]/25 p-3">
                            <div className="font-sans font-bold text-[#F14343] mb-1">Antes</div>
                            <div className="text-gray-800 dark:text-gray-200">
                              {prop.before_data
                                ? formatPreviewValue(
                                    field === 'registro_completo'
                                      ? prop.before_data
                                      : prop.before_data[field]
                                  )
                                : 'Inexistente'}
                            </div>
                          </div>
                          <div className="rounded-xl bg-[#1F9FCF]/10 border border-[#1F9FCF]/30 p-3">
                            <div className="font-sans font-bold text-[#0F4780] dark:text-[#1F9FCF] mb-1">
                              Depois (Proposto)
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                              {prop.after_data
                                ? formatPreviewValue(
                                    field === 'registro_completo'
                                      ? prop.after_data
                                      : prop.after_data[field]
                                  )
                                : 'Será removido'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => toggleExpandJson(prop.id)}
                      className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline pt-1"
                    >
                      {isExpanded ? 'Ocultar JSON bruto' : 'Ver JSON bruto completo'}
                    </button>

                    {isExpanded && (
                      <pre className="mt-2 p-4 rounded-2xl bg-gray-950 text-gray-100 text-xs overflow-x-auto max-h-72">
                        {JSON.stringify(
                          { before: prop.before_data, after: prop.after_data },
                          null,
                          2
                        )}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Aba Histórico + Reabrir */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-8 text-center text-sm text-gray-500">
              Nenhuma proposta revisada recentemente.
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === 'approved'
                          ? 'bg-[#1F9FCF]/15 text-[#0F4780] dark:text-[#1F9FCF]'
                          : item.status === 'rejected'
                          ? 'bg-[#F14343]/15 text-[#F14343]'
                          : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {MODULE_LABELS[item.module]}
                    </span>
                  </div>
                  <div className="font-bold text-sm">{item.entity_title}</div>
                  {item.reviewed_at && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Revisado em {new Date(item.reviewed_at).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>

                {item.status === 'rejected' && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => executeBatchReview(item.module, [item], 'reopen')}
                    className="min-h-[48px] px-4 rounded-full border border-[#1F9FCF]/40 text-[#0F4780] dark:text-[#1F9FCF] text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reabrir
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Aba Versões & Rollback */}
      {activeTab === 'versions' && (
        <div className="space-y-3">
          {snapshotHistory.length === 0 ? (
            <div className="rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-8 text-center text-sm text-gray-500">
              Nenhuma versão publicada no banco ainda. Aprove o primeiro lote para gerar histórico de rollback.
            </div>
          ) : (
            snapshotHistory.map((ver) => (
              <div
                key={ver.id}
                className="rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#1F9FCF]" />
                    <span className="font-bukra font-bold text-sm">
                      {MODULE_LABELS[ver.module]} — v{ver.version}
                    </span>
                    {snapshotVersions[ver.module] === ver.version && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1F9FCF]/15 text-[#0F4780] dark:text-[#1F9FCF]">
                        Ativa
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Motivo: {ver.reason} • {new Date(ver.created_at).toLocaleString('pt-BR')}
                  </div>
                </div>

                {snapshotVersions[ver.module] !== ver.version && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleRollback(ver.module, ver.version)}
                    className="min-h-[48px] px-5 rounded-full border border-[#FFCC00] bg-[#FFCC00]/15 text-[#0F4780] dark:text-[#FFCC00] text-xs font-bold uppercase tracking-wider flex items-center gap-2 self-start sm:self-center"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Restaurar v{ver.version}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Dialog M3 de Confirmação Explícita para Remoções */}
      {removalConfirmBatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1E1E1E] border border-[#F14343]/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#F14343]">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-bukra text-lg font-bold">
                Confirmar Remoção do Catálogo Público
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Este lote contém{' '}
              <strong>
                {removalConfirmBatch.proposals.filter((p) => p.change_type === 'removed').length}
              </strong>{' '}
              remoção(ões) em <strong>{MODULE_LABELS[removalConfirmBatch.module]}</strong>. Ao confirmar,
              esses registros deixarão de aparecer imediatamente nas páginas públicas:
            </p>
            <ul className="max-h-40 overflow-y-auto rounded-2xl bg-gray-50 dark:bg-[#121212] p-3 space-y-1 text-xs">
              {removalConfirmBatch.proposals
                .filter((p) => p.change_type === 'removed')
                .map((p) => (
                  <li key={p.id} className="font-semibold text-[#F14343]">
                    • {p.entity_title} ({p.entity_key})
                  </li>
                ))}
            </ul>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRemovalConfirmBatch(null)}
                className="min-h-[48px] px-5 rounded-full border border-gray-300 dark:border-white/15 text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  executeBatchReview(
                    removalConfirmBatch.module,
                    removalConfirmBatch.proposals,
                    'approved'
                  )
                }
                className="min-h-[48px] px-5 rounded-full bg-[#F14343] text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50"
              >
                Confirmar e Publicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
