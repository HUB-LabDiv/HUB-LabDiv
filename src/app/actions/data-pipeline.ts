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

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { z } from 'zod';
import { createServerSupabase } from '@/lib/supabase/server';
import { institutoData } from '@/data/institutoData';
import { initiativesData } from '@/data/initiativesData';
import { eventsData } from '@/data/eventsData';
import { newsData } from '@/data/newsData';
import { spacesData } from '@/data/spacesData';
import { disciplinesData } from '@/data/disciplinesData';
import { coursesData } from '@/data/coursesData';
import type { DataPipelineProposal, PipelineModule } from '@/types/data-pipeline';

const ModuleSchema = z.enum([
  'departments',
  'initiatives',
  'events',
  'news',
  'spaces',
  'disciplines',
  'courses',
]);

const ReviewProposalsSchema = z.object({
  module: ModuleSchema,
  proposalIds: z.array(z.string().uuid()).min(1).max(300),
  decision: z.enum(['approved', 'rejected', 'reopen']),
  reviewNote: z.string().max(500).optional(),
});

const RollbackSchema = z.object({
  module: ModuleSchema,
  targetVersion: z.number().int().min(1),
});

const FALLBACK_BY_MODULE: Record<PipelineModule, unknown> = {
  departments: institutoData,
  initiatives: initiativesData,
  events: eventsData,
  news: newsData,
  spaces: spacesData,
  disciplines: disciplinesData,
  courses: coursesData,
};

async function requireAdminSession() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Sessão expirada. Faça login como administrador.');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Acesso restrito a administradores.');
  }

  return { supabase, userId: user.id };
}

function getNewsKey(item: Record<string, unknown>): string {
  return String(item.id || item.slug || item.link || item.url || item.titulo || '').trim();
}

function applyProposalsToPayload(
  module: PipelineModule,
  currentPayload: unknown,
  proposals: DataPipelineProposal[]
): unknown {
  if (module === 'news') {
    const list = Array.isArray(currentPayload)
      ? ([...currentPayload] as Array<Record<string, unknown>>)
      : [];
    const indexByKey = new Map<string, number>();
    list.forEach((item, idx) => {
      const k = getNewsKey(item);
      if (k) indexByKey.set(k, idx);
    });

    for (const prop of proposals) {
      if (prop.change_type === 'removed') {
        const idx = indexByKey.get(prop.entity_key);
        if (idx !== undefined) {
          list.splice(idx, 1);
          indexByKey.clear();
          list.forEach((item, i) => {
            const k = getNewsKey(item);
            if (k) indexByKey.set(k, i);
          });
        }
      } else if (prop.after_data) {
        const idx = indexByKey.get(prop.entity_key);
        if (idx !== undefined) {
          list[idx] = prop.after_data;
        } else {
          list.unshift(prop.after_data);
          indexByKey.clear();
          list.forEach((item, i) => {
            const k = getNewsKey(item);
            if (k) indexByKey.set(k, i);
          });
        }
      }
    }
    return list;
  }

  const record =
    currentPayload && typeof currentPayload === 'object' && !Array.isArray(currentPayload)
      ? { ...(currentPayload as Record<string, unknown>) }
      : {};

  for (const prop of proposals) {
    if (prop.change_type === 'removed') {
      delete record[prop.entity_key];
    } else if (prop.after_data) {
      record[prop.entity_key] = prop.after_data;
    }
  }

  return record;
}

function revalidateModuleViews(module: PipelineModule) {
  revalidateTag(`official-data:${module}`, 'max');
  revalidateTag('official-data', 'max');
  revalidatePath('/admin/cgif/pipeline');
  revalidatePath('/admin/cgif');
  revalidatePath('/admin');
  revalidatePath('/gcif');
  revalidatePath('/gcif/instituto');
  revalidatePath('/wiki/instituto');
  revalidatePath('/wiki/graduacao');
}

export async function reviewPipelineProposalsAction(
  rawInput: z.infer<typeof ReviewProposalsSchema>
): Promise<{ ok: boolean; updatedCount?: number; version?: number; error?: string }> {
  const parsed = ReviewProposalsSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'Parâmetros inválidos para revisão.' };
  }

  const { module, proposalIds, decision, reviewNote } = parsed.data;

  try {
    const { supabase } = await requireAdminSession();

    let expectedVersion = 0;
    let nextPayload: unknown = null;

    if (decision === 'approved') {
      const [{ data: snapshotRow }, { data: proposalsRows, error: propErr }] = await Promise.all([
        supabase
          .from('official_data_snapshots')
          .select('version, payload')
          .eq('module', module)
          .maybeSingle(),
        supabase
          .from('data_pipeline_proposals')
          .select('*')
          .eq('module', module)
          .eq('status', 'pending')
          .in('id', proposalIds),
      ]);

      if (propErr) {
        return { ok: false, error: propErr.message };
      }

      const proposals = (proposalsRows || []) as DataPipelineProposal[];
      if (proposals.length === 0) {
        return { ok: false, error: 'Nenhuma proposta pendente encontrada para este lote.' };
      }

      expectedVersion = snapshotRow?.version ?? 0;
      const basePayload = snapshotRow?.payload ?? FALLBACK_BY_MODULE[module];
      nextPayload = applyProposalsToPayload(module, basePayload, proposals);
    }

    const { data: rpcRes, error: rpcErr } = await supabase.rpc('commit_pipeline_review', {
      p_module: module,
      p_expected_version: expectedVersion,
      p_proposal_ids: proposalIds,
      p_decision: decision,
      p_next_payload: nextPayload,
      p_review_note: reviewNote ?? null,
    });

    if (rpcErr) {
      if (rpcErr.message.includes('CONFLICT_OPTIMISTIC_LOCK')) {
        return {
          ok: false,
          error: 'Conflito de concorrência detectado (snapshot atualizado por outro admin). Recarregue a fila.',
        };
      }
      return { ok: false, error: rpcErr.message };
    }

    revalidateModuleViews(module);

    const resObj = (rpcRes || {}) as { updated_count?: number; version?: number };
    return {
      ok: true,
      updatedCount: resObj.updated_count ?? proposalIds.length,
      version: resObj.version,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erro ao processar revisão.',
    };
  }
}

export async function rollbackOfficialSnapshotAction(
  rawInput: z.infer<typeof RollbackSchema>
): Promise<{ ok: boolean; version?: number; error?: string }> {
  const parsed = RollbackSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: 'Versão alvo inválida para rollback.' };
  }

  const { module, targetVersion } = parsed.data;

  try {
    const { supabase } = await requireAdminSession();

    const { data: currentSnap } = await supabase
      .from('official_data_snapshots')
      .select('version')
      .eq('module', module)
      .maybeSingle();

    if (!currentSnap) {
      return { ok: false, error: 'Snapshot oficial ainda não existe para este módulo.' };
    }

    const { data: rpcRes, error: rpcErr } = await supabase.rpc('rollback_official_snapshot', {
      p_module: module,
      p_target_version: targetVersion,
      p_expected_version: currentSnap.version,
    });

    if (rpcErr) {
      return { ok: false, error: rpcErr.message };
    }

    revalidateModuleViews(module);
    const resObj = (rpcRes || {}) as { version?: number };
    return { ok: true, version: resObj.version };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Erro ao restaurar versão.',
    };
  }
}
