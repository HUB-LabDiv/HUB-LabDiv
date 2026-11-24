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

export type PipelineModule =
  | 'departments'
  | 'initiatives'
  | 'events'
  | 'news'
  | 'spaces'
  | 'disciplines'
  | 'courses';

export type PipelineChangeType = 'added' | 'updated' | 'removed';

export type PipelineProposalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'superseded';

export type PipelineTriggerSource =
  | 'schedule'
  | 'workflow_dispatch'
  | 'manual_cli';

export type PipelineRunStatus = 'success' | 'partial_failure' | 'failed';

export interface ModuleHealthReport {
  module: PipelineModule | string;
  status: 'ok' | 'partial_failure' | 'failed' | 'skipped';
  scrapedCount: number;
  baselineCount: number;
  proposalsCreated: number;
  proposalsSkipped: number;
  durationMs?: number;
  message?: string;
}

export interface DataPipelineRun {
  id: string;
  github_run_id: string | null;
  trigger_source: PipelineTriggerSource;
  status: PipelineRunStatus;
  modules_report: ModuleHealthReport[];
  proposals_created: number;
  proposals_skipped: number;
  started_at: string;
  finished_at: string | null;
}

export interface DataPipelineProposal {
  id: string;
  run_id: string | null;
  module: PipelineModule;
  entity_key: string;
  entity_title: string;
  source_url: string | null;
  change_type: PipelineChangeType;
  before_data: Record<string, unknown> | null;
  after_data: Record<string, unknown> | null;
  changed_fields: string[];
  content_hash: string;
  status: PipelineProposalStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
}

export interface OfficialSnapshotRecord<T = unknown> {
  module: PipelineModule;
  payload: T;
  version: number;
  updated_at: string;
  updated_by: string | null;
}

export interface OfficialSnapshotHistorySummary {
  id: string;
  module: PipelineModule;
  version: number;
  reason: string;
  created_by: string | null;
  created_at: string;
}

export interface PipelineBaselinesResponse {
  ok: boolean;
  snapshots: Partial<Record<PipelineModule, { version: number; payload: unknown }>>;
}

export interface PipelineProposalIngestInput {
  module: PipelineModule;
  entityKey: string;
  entityTitle: string;
  sourceUrl?: string | null;
  changeType: PipelineChangeType;
  beforeData: Record<string, unknown> | null;
  afterData: Record<string, unknown> | null;
  changedFields: string[];
  contentHash: string;
}

export interface PipelineIngestPayload {
  runId?: string;
  githubRunId?: string | null;
  triggerSource: PipelineTriggerSource;
  runStatus?: PipelineRunStatus;
  finalizeRun?: boolean;
  moduleReport?: ModuleHealthReport;
  proposals: PipelineProposalIngestInput[];
}
