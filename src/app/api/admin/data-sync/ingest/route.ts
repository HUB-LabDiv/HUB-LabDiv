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

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyDataPipelineSecret } from '@/lib/data-sync-auth.server';
import { createAdminSupabase } from '@/lib/supabase/admin';

const ModuleSchema = z.enum([
  'departments',
  'initiatives',
  'events',
  'news',
  'spaces',
  'disciplines',
  'courses',
]);

const ProposalSchema = z.object({
  module: ModuleSchema,
  entityKey: z.string().min(1).max(200),
  entityTitle: z.string().min(1).max(240),
  sourceUrl: z.string().url().max(600).nullable().optional(),
  changeType: z.enum(['added', 'updated', 'removed']),
  beforeData: z.record(z.string(), z.unknown()).nullable(),
  afterData: z.record(z.string(), z.unknown()).nullable(),
  changedFields: z.array(z.string().max(120)).max(120),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/i),
});

const ModuleReportSchema = z.object({
  module: z.string().min(1).max(60),
  status: z.enum(['ok', 'partial_failure', 'failed', 'skipped']),
  scrapedCount: z.number().int().min(0),
  baselineCount: z.number().int().min(0),
  proposalsCreated: z.number().int().min(0),
  proposalsSkipped: z.number().int().min(0),
  durationMs: z.number().int().min(0).optional(),
  message: z.string().max(500).optional(),
});

const IngestSchema = z.object({
  runId: z.string().uuid().optional(),
  githubRunId: z.string().max(80).nullable().optional(),
  triggerSource: z.enum(['schedule', 'workflow_dispatch', 'manual_cli']).default('schedule'),
  runStatus: z.enum(['success', 'partial_failure', 'failed']).optional(),
  finalizeRun: z.boolean().optional(),
  moduleReport: ModuleReportSchema.optional(),
  proposals: z.array(ProposalSchema).max(200),
});

export async function POST(request: NextRequest) {
  if (!verifyDataPipelineSecret(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = IngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const input = parsed.data;
  const admin = createAdminSupabase();

  try {
    let runId = input.runId;
    if (!runId) {
      const { data: runRow, error: runErr } = await admin
        .from('data_pipeline_runs')
        .insert({
          github_run_id: input.githubRunId ?? null,
          trigger_source: input.triggerSource,
          status: input.runStatus || 'success',
          modules_report: input.moduleReport ? [input.moduleReport] : [],
        })
        .select('id')
        .single();

      if (runErr || !runRow) {
        return NextResponse.json({ ok: false, error: runErr?.message || 'Run insert failed' }, { status: 500 });
      }
      runId = runRow.id;
    }

    let created = 0;
    let skipped = 0;

    if (input.proposals.length > 0) {
      // Verifica duplicidade ativa (pending/rejected) compatível com índice único parcial
      const hashes = Array.from(new Set(input.proposals.map((p) => p.contentHash)));
      const modules = Array.from(new Set(input.proposals.map((p) => p.module)));

      const { data: activeRows } = await admin
        .from('data_pipeline_proposals')
        .select('module, entity_key, content_hash')
        .in('module', modules)
        .in('content_hash', hashes)
        .in('status', ['pending', 'rejected']);

      const activeSet = new Set(
        (activeRows || []).map((r) => `${r.module}::${r.entity_key}::${r.content_hash}`)
      );

      const toInsert = input.proposals
        .filter((p) => !activeSet.has(`${p.module}::${p.entityKey}::${p.contentHash}`))
        .map((p) => ({
          run_id: runId,
          module: p.module,
          entity_key: p.entityKey,
          entity_title: p.entityTitle,
          source_url: p.sourceUrl ?? null,
          change_type: p.changeType,
          before_data: p.beforeData,
          after_data: p.afterData,
          changed_fields: p.changedFields,
          content_hash: p.contentHash,
          status: 'pending' as const,
        }));

      skipped = input.proposals.length - toInsert.length;

      if (toInsert.length > 0) {
        const { error: insErr } = await admin.from('data_pipeline_proposals').insert(toInsert);
        if (insErr) {
          // Em caso de race condition no índice único parcial, tenta linha a linha
          if (insErr.code === '23505') {
            for (const row of toInsert) {
              const { error: singleErr } = await admin.from('data_pipeline_proposals').insert(row);
              if (singleErr) {
                skipped++;
              } else {
                created++;
              }
            }
          } else {
            return NextResponse.json({ ok: false, error: insErr.message }, { status: 500 });
          }
        } else {
          created = toInsert.length;
        }
      }
    }

    // Atualiza agregados da execução
    const { data: currentRun } = await admin
      .from('data_pipeline_runs')
      .select('modules_report, proposals_created, proposals_skipped')
      .eq('id', runId)
      .single();

    if (currentRun) {
      const nextReports = Array.isArray(currentRun.modules_report)
        ? [...currentRun.modules_report]
        : [];
      if (input.moduleReport && input.runId) {
        nextReports.push(input.moduleReport);
      }

      await admin
        .from('data_pipeline_runs')
        .update({
          modules_report: nextReports,
          proposals_created: (currentRun.proposals_created || 0) + created,
          proposals_skipped: (currentRun.proposals_skipped || 0) + skipped,
          ...(input.runStatus ? { status: input.runStatus } : {}),
          ...(input.finalizeRun ? { finished_at: new Date().toISOString() } : {}),
        })
        .eq('id', runId);
    }

    return NextResponse.json({ ok: true, runId, created, skipped });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
