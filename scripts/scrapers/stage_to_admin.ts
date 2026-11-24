#!/usr/bin/env npx tsx

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

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { institutoData } from '../../src/data/institutoData';
import { initiativesData } from '../../src/data/initiativesData';
import { eventsData } from '../../src/data/eventsData';
import { newsData } from '../../src/data/newsData';
import { spacesData } from '../../src/data/spacesData';
import { disciplinesData } from '../../src/data/disciplinesData';
import { coursesData } from '../../src/data/coursesData';
import type {
    ModuleHealthReport,
    PipelineBaselinesResponse,
    PipelineIngestPayload,
    PipelineModule,
    PipelineProposalIngestInput,
    PipelineRunStatus,
    PipelineTriggerSource,
} from '../../src/types/data-pipeline';

const CACHE_DIR = path.resolve(__dirname, 'cache');
const CHUNK_SIZE = 80;
const CIRCUIT_BREAKER_DROP_RATIO = 0.45;

const DEFAULT_BASELINES: Record<PipelineModule, unknown> = {
    departments: institutoData,
    initiatives: initiativesData,
    events: eventsData,
    news: newsData,
    spaces: spacesData,
    disciplines: disciplinesData,
    courses: coursesData,
};

const MODULE_SOURCE_FALLBACK: Record<PipelineModule, string> = {
    departments: 'https://portal.if.usp.br/ifusp/usuarios/docentes',
    initiatives: 'https://portal.if.usp.br/extensao/pt-br/node/607',
    events: 'https://portal.if.usp.br/ifusp/pt-br/eventos',
    news: 'https://portal.if.usp.br/ifusp/pt-br/noticias',
    spaces: 'https://portal.if.usp.br/ifusp/',
    disciplines: 'https://uspdigital.usp.br/jupiterweb/',
    courses: 'https://uspdigital.usp.br/jupiterweb/',
};

function stableNormalize(value: unknown): unknown {
    if (Array.isArray(value)) {
        return value.map(stableNormalize);
    }
    if (value !== null && typeof value === 'object') {
        const sorted: Record<string, unknown> = {};
        for (const key of Object.keys(value as Record<string, unknown>).sort()) {
            const v = (value as Record<string, unknown>)[key];
            if (v !== undefined) {
                sorted[key] = stableNormalize(v);
            }
        }
        return sorted;
    }
    return value;
}

export function stableStringify(value: unknown): string {
    return JSON.stringify(stableNormalize(value));
}

function sha256(input: string): string {
    return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function readJsonSafe<T>(filename: string): T | null {
    const filePath = path.join(CACHE_DIR, filename);
    if (!fs.existsSync(filePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    } catch {
        return null;
    }
}

function toRecordByKey(
    module: PipelineModule,
    raw: unknown
): Record<string, Record<string, unknown>> {
    if (!raw) return {};

    if (module === 'news' && Array.isArray(raw)) {
        const out: Record<string, Record<string, unknown>> = {};
        for (const item of raw) {
            if (!item || typeof item !== 'object') continue;
            const rec = item as Record<string, unknown>;
            const rawKey = String(rec.id || rec.slug || rec.link || rec.url || rec.titulo || '');
            const key = rawKey.trim() || sha256(stableStringify(rec)).slice(0, 16);
            out[key] = rec;
        }
        return out;
    }

    if (typeof raw === 'object' && !Array.isArray(raw)) {
        const out: Record<string, Record<string, unknown>> = {};
        for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
            if (v && typeof v === 'object') {
                out[k] = v as Record<string, unknown>;
            }
        }
        return out;
    }

    return {};
}

function loadScrapedSnapshotForModule(
    module: PipelineModule,
    baselineRaw: unknown
): Record<string, Record<string, unknown>> | null {
    if (module === 'departments') {
        const parsed = readJsonSafe<{ departments?: Record<string, { docentes?: Array<Record<string, unknown>> }> }>('parsed_departments.json');
        if (!parsed?.departments) return null;
        const base = toRecordByKey('departments', baselineRaw);
        const merged: Record<string, Record<string, unknown>> = {};
        for (const [slug, dept] of Object.entries(base)) {
            const scrapedDept = parsed.departments[slug];
            if (!scrapedDept) {
                merged[slug] = dept;
                continue;
            }
            const existingDocs = Array.isArray(dept.pesquisadores) ? (dept.pesquisadores as Array<Record<string, unknown>>) : [];
            const scrapedDocs = Array.isArray(scrapedDept.docentes) ? scrapedDept.docentes : [];
            const byName = new Map<string, Record<string, unknown>>();
            for (const doc of existingDocs) {
                const k = String(doc.name || doc.id || '').trim().toLowerCase();
                if (k) byName.set(k, { ...doc });
            }
            for (const sdoc of scrapedDocs) {
                const name = String(sdoc.name || sdoc.nome || '').trim();
                if (!name) continue;
                const k = name.toLowerCase();
                const prev = byName.get(k);
                if (prev) {
                    byName.set(k, {
                        ...prev,
                        role: sdoc.role || prev.role,
                        email: sdoc.email || prev.email,
                        lattes: sdoc.lattes || prev.lattes,
                        avatar: prev.avatar || sdoc.avatar,
                    });
                } else {
                    byName.set(k, sdoc);
                }
            }
            merged[slug] = {
                ...dept,
                pesquisadores: Array.from(byName.values()),
            };
        }
        return merged;
    }

    if (module === 'initiatives') {
        const parsed = readJsonSafe<{ initiatives?: Array<Record<string, unknown>> }>('parsed_initiatives.json');
        if (!parsed?.initiatives) return null;
        const base = toRecordByKey('initiatives', baselineRaw);
        const out: Record<string, Record<string, unknown>> = { ...base };
        for (const item of parsed.initiatives) {
            const key = String(item.id || item.slug || '').trim();
            if (!key) continue;
            const prev = out[key];
            out[key] = prev
                ? {
                      ...prev,
                      coordenacao: prev.coordenacao || item.coordenacao,
                      comoParticipar: prev.comoParticipar || item.comoParticipar,
                  }
                : item;
        }
        return out;
    }

    if (module === 'events') {
        const parsed = readJsonSafe<Array<Record<string, unknown>>>('parsed_events.json');
        if (!Array.isArray(parsed)) return null;
        const out: Record<string, Record<string, unknown>> = {};
        for (const item of parsed) {
            const key = String(item.id || item.slug || '').trim();
            if (key) out[key] = item;
        }
        return out;
    }

    if (module === 'news') {
        const parsed = readJsonSafe<Array<Record<string, unknown>>>('parsed_news.json');
        if (!Array.isArray(parsed)) return null;
        return toRecordByKey('news', parsed);
    }

    if (module === 'spaces') {
        const parsed = readJsonSafe<Record<string, Record<string, unknown>> | Array<Record<string, unknown>>>('parsed_spaces.json');
        if (!parsed) return null;
        if (Array.isArray(parsed)) {
            const out: Record<string, Record<string, unknown>> = {};
            for (const item of parsed) {
                const key = String(item.id || item.slug || '').trim();
                if (key) out[key] = item;
            }
            return out;
        }
        return toRecordByKey('spaces', parsed);
    }

    if (module === 'disciplines') {
        const parsed = readJsonSafe<Record<string, Record<string, unknown>>>('parsed_disciplines.json');
        return parsed ? toRecordByKey('disciplines', parsed) : null;
    }

    if (module === 'courses') {
        const parsed = readJsonSafe<Record<string, Record<string, unknown>>>('parsed_curriculum.json');
        return parsed ? toRecordByKey('courses', parsed) : null;
    }

    return null;
}

function inferEntityTitle(key: string, record: Record<string, unknown>): string {
    const candidate =
        record.titulo ||
        record.title ||
        record.nome ||
        record.name ||
        record.sigla ||
        record.codigo ||
        key;
    return String(candidate).slice(0, 180);
}

function inferSourceUrl(module: PipelineModule, record: Record<string, unknown>): string {
    const direct = record.link || record.url || record.sourceUrl || record.portalUrl || record.lattes;
    if (typeof direct === 'string' && direct.startsWith('http')) {
        return direct;
    }
    return MODULE_SOURCE_FALLBACK[module];
}

function computeChangedFields(
    beforeObj: Record<string, unknown>,
    afterObj: Record<string, unknown>
): string[] {
    const keys = new Set([...Object.keys(beforeObj), ...Object.keys(afterObj)]);
    const changed: string[] = [];
    for (const k of keys) {
        if (stableStringify(beforeObj[k]) !== stableStringify(afterObj[k])) {
            changed.push(k);
        }
    }
    return changed.sort();
}

async function fetchRemoteBaselines(apiBaseUrl: string, secret: string): Promise<PipelineBaselinesResponse['snapshots']> {
    try {
        const res = await fetch(`${apiBaseUrl}/api/admin/data-sync/baselines`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${secret}`,
            },
        });
        if (!res.ok) {
            console.warn(`[WARN] Baselines remotos retornaram HTTP ${res.status}; usando fallback estático.`);
            return {};
        }
        const json = (await res.json()) as PipelineBaselinesResponse;
        return json.snapshots || {};
    } catch (err) {
        console.warn(`[WARN] Falha ao consultar baselines remotos (${String(err)}); usando fallback estático.`);
        return {};
    }
}

async function postIngestChunk(
    apiBaseUrl: string,
    secret: string,
    payload: PipelineIngestPayload
): Promise<{ runId: string; created: number; skipped: number }> {
    const res = await fetch(`${apiBaseUrl}/api/admin/data-sync/ingest`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const bodyText = await res.text();
        throw new Error(`Ingest API HTTP ${res.status}: ${bodyText.slice(0, 300)}`);
    }

    return (await res.json()) as { runId: string; created: number; skipped: number };
}

export async function runStageToAdmin(options?: {
    modules?: PipelineModule[];
    triggerSource?: PipelineTriggerSource;
    githubRunId?: string | null;
}) {
    const apiBaseUrl = (process.env.HUB_SYNC_API_URL || 'https://www.hublabdiv.com.br').replace(/\/+$/, '');
    const secret = process.env.DATA_PIPELINE_SECRET || '';
    const dryRun = process.argv.includes('--dry-run') || !secret;

    if (!secret) {
        console.warn('[WARN] DATA_PIPELINE_SECRET ausente — executando stage_to_admin em modo DRY-RUN (sem envio remoto).');
    }

    const remoteBaselines = secret ? await fetchRemoteBaselines(apiBaseUrl, secret) : {};
    const targetModules: PipelineModule[] = options?.modules || [
        'departments',
        'initiatives',
        'events',
        'news',
        'spaces',
        'disciplines',
        'courses',
    ];

    const triggerSource: PipelineTriggerSource =
        options?.triggerSource ||
        (process.env.GITHUB_EVENT_NAME === 'schedule'
            ? 'schedule'
            : process.env.GITHUB_EVENT_NAME === 'workflow_dispatch'
            ? 'workflow_dispatch'
            : 'manual_cli');

    const githubRunId = options?.githubRunId ?? process.env.GITHUB_RUN_ID ?? null;

    let currentRunId: string | undefined;
    let totalCreated = 0;
    let totalSkipped = 0;
    let anyModuleFailed = false;
    let allModulesFailed = true;
    const reports: ModuleHealthReport[] = [];

    for (let mIdx = 0; mIdx < targetModules.length; mIdx++) {
        const mod = targetModules[mIdx];
        const baselineRaw = remoteBaselines[mod]?.payload ?? DEFAULT_BASELINES[mod];
        const baselineMap = toRecordByKey(mod, baselineRaw);
        const baselineKeys = Object.keys(baselineMap);
        const scrapedMap = loadScrapedSnapshotForModule(mod, baselineRaw);

        if (!scrapedMap) {
            anyModuleFailed = true;
            reports.push({
                module: mod,
                status: 'failed',
                scrapedCount: 0,
                baselineCount: baselineKeys.length,
                proposalsCreated: 0,
                proposalsSkipped: 0,
                message: 'Cache raspado ausente ou inválido.',
            });
            continue;
        }

        const scrapedKeys = Object.keys(scrapedMap);
        const dropRatio =
            baselineKeys.length > 0
                ? (baselineKeys.length - scrapedKeys.length) / baselineKeys.length
                : 0;

        // Circuit Breaker: 0 itens ou queda > 45% em relação ao baseline
        const circuitBroken =
            scrapedKeys.length === 0 ||
            (baselineKeys.length >= 4 && dropRatio > CIRCUIT_BREAKER_DROP_RATIO);

        if (circuitBroken) {
            anyModuleFailed = true;
            reports.push({
                module: mod,
                status: 'partial_failure',
                scrapedCount: scrapedKeys.length,
                baselineCount: baselineKeys.length,
                proposalsCreated: 0,
                proposalsSkipped: 0,
                message: `Circuit breaker ativado (scraped=${scrapedKeys.length}, baseline=${baselineKeys.length}). Nenhuma remoção gerada.`,
            });
            continue;
        }

        allModulesFailed = false;
        const proposals: PipelineProposalIngestInput[] = [];

        for (const key of scrapedKeys) {
            const afterObj = scrapedMap[key];
            const beforeObj = baselineMap[key];

            if (!beforeObj) {
                const canonicalAfter = stableStringify(afterObj);
                proposals.push({
                    module: mod,
                    entityKey: key,
                    entityTitle: inferEntityTitle(key, afterObj),
                    sourceUrl: inferSourceUrl(mod, afterObj),
                    changeType: 'added',
                    beforeData: null,
                    afterData: afterObj,
                    changedFields: Object.keys(afterObj).sort(),
                    contentHash: sha256(`${mod}|${key}|added|${canonicalAfter}`),
                });
            } else {
                const changedFields = computeChangedFields(beforeObj, afterObj);
                if (changedFields.length > 0) {
                    const canonicalAfter = stableStringify(afterObj);
                    proposals.push({
                        module: mod,
                        entityKey: key,
                        entityTitle: inferEntityTitle(key, afterObj),
                        sourceUrl: inferSourceUrl(mod, afterObj),
                        changeType: 'updated',
                        beforeData: beforeObj,
                        afterData: afterObj,
                        changedFields,
                        contentHash: sha256(`${mod}|${key}|updated|${canonicalAfter}`),
                    });
                }
            }
        }

        // Nunca gerar 'removed' por ausência na paginação para eventos e notícias
        if (mod !== 'events' && mod !== 'news') {
            for (const key of baselineKeys) {
                if (!scrapedMap[key]) {
                    const beforeObj = baselineMap[key];
                    proposals.push({
                        module: mod,
                        entityKey: key,
                        entityTitle: inferEntityTitle(key, beforeObj),
                        sourceUrl: inferSourceUrl(mod, beforeObj),
                        changeType: 'removed',
                        beforeData: beforeObj,
                        afterData: null,
                        changedFields: [],
                        contentHash: sha256(`${mod}|${key}|removed|null`),
                    });
                }
            }
        }

        const modReport: ModuleHealthReport = {
            module: mod,
            status: 'ok',
            scrapedCount: scrapedKeys.length,
            baselineCount: baselineKeys.length,
            proposalsCreated: proposals.length,
            proposalsSkipped: 0,
        };
        reports.push(modReport);

        if (dryRun) {
            console.log(`[DRY-RUN][${mod}] scraped=${scrapedKeys.length}, propostas=${proposals.length}`);
            continue;
        }

        // Envio por módulo/chunk (< 4.5 MB Vercel limit)
        const chunks: PipelineProposalIngestInput[][] = [];
        for (let i = 0; i < proposals.length; i += CHUNK_SIZE) {
            chunks.push(proposals.slice(i, i + CHUNK_SIZE));
        }
        if (chunks.length === 0) {
            chunks.push([]);
        }

        const isLastModule = mIdx === targetModules.length - 1;
        const finalRunStatus: PipelineRunStatus = allModulesFailed
            ? 'failed'
            : anyModuleFailed
            ? 'partial_failure'
            : 'success';

        for (let cIdx = 0; cIdx < chunks.length; cIdx++) {
            const isFinalChunk = isLastModule && cIdx === chunks.length - 1;
            const res = await postIngestChunk(apiBaseUrl, secret, {
                runId: currentRunId,
                githubRunId,
                triggerSource,
                runStatus: finalRunStatus,
                finalizeRun: isFinalChunk,
                moduleReport: cIdx === 0 ? modReport : undefined,
                proposals: chunks[cIdx],
            });
            currentRunId = res.runId;
            totalCreated += res.created;
            totalSkipped += res.skipped;
        }
    }

    if (process.env.GITHUB_STEP_SUMMARY) {
        const lines = [
            '## 📊 Relatório do Hub Data Pipeline (Staging -> /admin)',
            `Execução: \`${new Date().toISOString()}\` | Propostas enviadas: **${totalCreated}** | Ignoradas (duplicadas/rejeitadas): **${totalSkipped}**`,
            '',
            '| Módulo | Status | Raspados | Baseline | Propostas | Observação |',
            '|---|---|---:|---:|---:|---|',
            ...reports.map(
                (r) =>
                    `| \`${r.module}\` | ${r.status === 'ok' ? '✅ OK' : r.status === 'partial_failure' ? '⚠️ Circuit Breaker' : '❌ Falha'} | ${r.scrapedCount} | ${r.baselineCount} | ${r.proposalsCreated} | ${r.message || 'Enviado para /admin'} |`
            ),
        ];
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${lines.join('\n')}\n`, 'utf-8');
    }

    if (allModulesFailed) {
        console.error('[ERRO FATAL] Todos os módulos falharam ao gerar dados.');
        process.exit(1);
    }

    console.log(`\n[STAGE CONCLUÍDO] Criadas: ${totalCreated} | Deduplicadas: ${totalSkipped}`);
}

if (require.main === module) {
    runStageToAdmin().catch((err) => {
        console.error('[ERRO FATAL NO STAGE]', err);
        process.exit(1);
    });
}
