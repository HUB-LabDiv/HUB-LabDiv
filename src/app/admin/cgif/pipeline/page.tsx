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

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { DataPipelineModerationClient } from '@/components/admin/pipeline/DataPipelineModerationClient';
import type {
  DataPipelineProposal,
  DataPipelineRun,
  OfficialSnapshotHistorySummary,
  PipelineModule,
} from '@/types/data-pipeline';

export const dynamic = 'force-dynamic';

export default async function AdminDataPipelinePage() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/admin');
  }

  const [
    { data: pendingRows },
    { data: historyRows },
    { data: runsRows },
    { data: snapshotsRows },
    { data: snapHistoryRows },
  ] = await Promise.all([
    supabase
      .from('data_pipeline_proposals')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(200),
    supabase
      .from('data_pipeline_proposals')
      .select('*')
      .in('status', ['approved', 'rejected', 'superseded'])
      .order('reviewed_at', { ascending: false })
      .limit(80),
    supabase
      .from('data_pipeline_runs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10),
    supabase.from('official_data_snapshots').select('module, version'),
    supabase
      .from('official_data_snapshot_history')
      .select('id, module, version, reason, created_by, created_at')
      .order('created_at', { ascending: false })
      .limit(30),
  ]);

  const snapshotVersions: Partial<Record<PipelineModule, number>> = {};
  for (const row of snapshotsRows || []) {
    snapshotVersions[row.module as PipelineModule] = row.version;
  }

  return (
    <DataPipelineModerationClient
      pendingProposals={(pendingRows || []) as DataPipelineProposal[]}
      historyProposals={(historyRows || []) as DataPipelineProposal[]}
      recentRuns={(runsRows || []) as DataPipelineRun[]}
      snapshotVersions={snapshotVersions}
      snapshotHistory={(snapHistoryRows || []) as OfficialSnapshotHistorySummary[]}
    />
  );
}
