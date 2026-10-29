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

import 'server-only';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { sendAdminNotification } from '@/lib/notifications.server';
import { signEmailActionToken } from '@/lib/auth/email-action-token';
import { ModerationItemType } from '@/types';

interface QueueMonitorState {
    lastDigestSentAt: number;
    isChecking: boolean;
}

const state: QueueMonitorState = {
    lastDigestSentAt: 0,
    isChecking: false,
};

// Cooldown de 30 minutos entre resumos para nunca inundar a caixa de entrada
const COOLDOWN_DIGEST_MS = 30 * 60 * 1000;

function formatHumanDuration(ageMinutes: number): string {
    if (ageMinutes <= 1) return 'há poucos instantes';
    if (ageMinutes < 60) return `há ${ageMinutes} min`;
    const hours = Math.floor(ageMinutes / 60);
    if (hours < 24) return `há ${hours}h`;
    const days = Math.floor(hours / 24);
    return days === 1 ? 'há 1 dia' : `há ${days} dias`;
}

interface DigestQueueItem {
    id: string;
    type: ModerationItemType;
    label: string;
    title: string;
    author: string;
    summary: string;
    timestampMs: number;
}

/**
 * 📡 Monitor de Resumo Inteligente da Fila de Moderação (Torre de Controle LabDiv)
 * Envia um Digest limpo com botões assinados (HMAC-SHA256) para aprovar/rejeitar cada item direto do e-mail.
 */
export async function checkModerationQueueThresholds(): Promise<{
    checked: boolean;
    totalCount: number;
    oldestAgeMinutes: number;
}> {
    if (state.isChecking) {
        return { checked: false, totalCount: 0, oldestAgeMinutes: 0 };
    }

    state.isChecking = true;

    try {
        const adminSupabase = createAdminSupabase();
        const now = Date.now();

        const [
            subsRes,
            subEditsRes,
            profEditsRes,
            pendingProfilesRes,
            teacherVerifsRes,
            initiativeReqsRes,
            commentsRes,
            softwaresRes,
            oportunidadesRes,
            dicasRes,
            dropsRes,
            perguntasRes,
        ] = await Promise.all([
            adminSupabase.from('submissions').select('id, title, authors, category, created_at').eq('status', 'pendente').limit(20),
            adminSupabase.from('submissions').select('id, title, authors, created_at').not('pending_edits', 'is', null).limit(15),
            adminSupabase.from('profiles').select('id, full_name, email, pending_edits, created_at').not('pending_edits', 'is', null).limit(20),
            adminSupabase.from('profiles').select('id, full_name, email, created_at').eq('review_status', 'pending').limit(20),
            adminSupabase.from('profiles').select('id, full_name, email, created_at').eq('teacher_verification_status', 'pending').limit(10),
            adminSupabase.from('initiative_requests').select('id, initiative_name, responsible_name, contact_info, created_at').eq('status', 'pending').limit(15),
            adminSupabase.from('comments').select('id, author_name, content, created_at').eq('status', 'pendente').limit(20),
            adminSupabase.from('academic_softwares').select('id, title, author_name, created_at').eq('status', 'pendente').limit(10),
            adminSupabase.from('oportunidades').select('id, titulo, tipo, created_at').eq('status', 'pending').limit(10),
            adminSupabase.from('dicas_veteranos').select('id, titulo, created_at').eq('status', 'pending').limit(10),
            adminSupabase.from('micro_articles').select('id, content, created_at').eq('status', 'pending').limit(10),
            adminSupabase.from('perguntas').select('id, pergunta, nome_autor, created_at').eq('status', 'pendente').limit(10),
        ]);

        const digestItems: DigestQueueItem[] = [];

        (subsRes.data || []).forEach((s) => {
            digestItems.push({
                id: s.id,
                type: 'submission',
                label: 'Nova Publicação',
                title: s.title || 'Submissão Científica',
                author: s.authors || 'Autor',
                summary: `Categoria: ${s.category || 'Geral'}`,
                timestampMs: new Date(s.created_at).getTime() || now,
            });
        });

        (subEditsRes.data || []).forEach((s) => {
            digestItems.push({
                id: s.id,
                type: 'submission_edit',
                label: 'Edição de Post',
                title: s.title || 'Post',
                author: s.authors || 'Autor',
                summary: 'Alteração de conteúdo aguardando validação',
                timestampMs: new Date(s.created_at).getTime() || now,
            });
        });

        const profileEditIds = new Set<string>();
        (profEditsRes.data || []).forEach((p) => {
            profileEditIds.add(p.id);
            const editKeys = Object.keys(p.pending_edits || {}).filter((k) => k !== '_submitted_at');
            const submittedAtStr = p.pending_edits?._submitted_at;
            const ts = submittedAtStr ? new Date(submittedAtStr).getTime() : now;
            digestItems.push({
                id: p.id,
                type: 'profile_edit',
                label: 'Edição de Perfil',
                title: p.full_name || p.email || 'Membro',
                author: p.email || '',
                summary: `Campos alterados: ${editKeys.join(', ') || 'dados cadastrais'}`,
                timestampMs: isNaN(ts) ? now : ts,
            });
        });

        (pendingProfilesRes.data || [])
            .filter((p) => !profileEditIds.has(p.id))
            .forEach((p) => {
                digestItems.push({
                    id: p.id,
                    type: 'profile',
                    label: 'Novo Perfil',
                    title: p.full_name || p.email || 'Novo Usuário',
                    author: p.email || '',
                    summary: 'Cadastro aguardando aprovação inicial',
                    timestampMs: new Date(p.created_at).getTime() || now,
                });
            });

        (teacherVerifsRes.data || []).forEach((t) => {
            digestItems.push({
                id: t.id,
                type: 'teacher_verification',
                label: 'Validação Docente',
                title: t.full_name || 'Docente USP',
                author: t.email || '',
                summary: 'Comprovante docente anexado para revisão (LGPD)',
                timestampMs: new Date(t.created_at).getTime() || now,
            });
        });

        (initiativeReqsRes.data || []).forEach((req: any) => {
            digestItems.push({
                id: req.id,
                type: 'initiative_request',
                label: 'Nova Iniciativa (Eixo 04)',
                title: req.initiative_name,
                author: `${req.responsible_name} (${req.contact_info})`,
                summary: 'Solicitação de inclusão de iniciativa/espaço no HUB',
                timestampMs: new Date(req.created_at).getTime() || now,
            });
        });

        (commentsRes.data || []).forEach((c) => {
            digestItems.push({
                id: c.id,
                type: 'comment',
                label: 'Comentário',
                title: `Comentário de ${c.author_name || 'Membro'}`,
                author: c.author_name || 'Membro',
                summary: (c.content || '').slice(0, 120),
                timestampMs: new Date(c.created_at).getTime() || now,
            });
        });

        (softwaresRes.data || []).forEach((sw) => {
            digestItems.push({
                id: sw.id,
                type: 'software',
                label: 'Software Acadêmico',
                title: sw.title,
                author: sw.author_name || 'Autor',
                summary: 'Ferramenta submetida para o catálogo',
                timestampMs: new Date(sw.created_at).getTime() || now,
            });
        });

        (oportunidadesRes.data || []).forEach((op) => {
            digestItems.push({
                id: op.id,
                type: 'oportunidade',
                label: 'Oportunidade',
                title: op.titulo,
                author: op.tipo || 'Mural',
                summary: 'Nova oportunidade acadêmica pendente',
                timestampMs: new Date(op.created_at).getTime() || now,
            });
        });

        (dicasRes.data || []).forEach((d) => {
            digestItems.push({
                id: d.id,
                type: 'dica',
                label: 'Dica de Veterano',
                title: d.titulo,
                author: 'Veterano USP',
                summary: 'Dica pendente no guia USP 101',
                timestampMs: new Date(d.created_at).getTime() || now,
            });
        });

        (dropsRes.data || []).forEach((dr) => {
            digestItems.push({
                id: dr.id,
                type: 'micro_article',
                label: 'Drop da Comunidade',
                title: 'Micro-artigo submetido',
                author: 'Membro',
                summary: (dr.content || '').slice(0, 120),
                timestampMs: new Date(dr.created_at).getTime() || now,
            });
        });

        (perguntasRes.data || []).forEach((pq) => {
            digestItems.push({
                id: pq.id,
                type: 'pergunta',
                label: 'Pergunte a um Cientista',
                title: pq.nome_autor || 'Dúvida Científica',
                author: pq.nome_autor || 'Curioso',
                summary: (pq.pergunta || '').slice(0, 120),
                timestampMs: new Date(pq.created_at).getTime() || now,
            });
        });

        const totalCount = digestItems.length;
        if (totalCount === 0) {
            return { checked: true, totalCount: 0, oldestAgeMinutes: 0 };
        }

        const oldestTs = Math.min(...digestItems.map((i) => i.timestampMs));
        const oldestAgeMinutes = Math.max(0, Math.floor((now - oldestTs) / (60 * 1000)));

        // Dispara o Digest somente se respeitar o cooldown de 30 minutos
        if (now - state.lastDigestSentAt >= COOLDOWN_DIGEST_MS) {
            state.lastDigestSentAt = now;

            const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hub-lab-div.vercel.app';
            const baseUrl = rawBaseUrl.split(' ')[0].replace(/\/$/, '');

            const batchApproveToken = signEmailActionToken({
                itemId: 'all',
                itemType: 'all',
                decision: 'approve_all',
                generatedAt: now,
                batchItems: digestItems.slice(0, 30).map((item) => ({
                    itemId: item.id,
                    itemType: item.type,
                })),
            });

            const cardsHtml = digestItems
                .slice(0, 12)
                .map((item) => {
                    const itemAgeMin = Math.max(0, Math.floor((now - item.timestampMs) / (60 * 1000)));
                    const approveToken = signEmailActionToken({
                        itemId: item.id,
                        itemType: item.type,
                        decision: 'approve',
                        title: item.title,
                        generatedAt: now,
                    });
                    const rejectToken = signEmailActionToken({
                        itemId: item.id,
                        itemType: item.type,
                        decision: 'reject',
                        title: item.title,
                        generatedAt: now,
                    });

                    return `
                        <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 14px; background-color: #f8fafc;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #0F4780; background: #e0f2fe; padding: 2px 8px; border-radius: 99px;">
                                    ${item.label}
                                </span>
                                <span style="font-size: 11px; color: #64748b; font-weight: 600;">
                                    ⏳ ${formatHumanDuration(itemAgeMin)}
                                </span>
                            </div>
                            <p style="margin: 4px 0; font-size: 15px; font-weight: 800; color: #0f172a;">${item.title}</p>
                            ${item.author ? `<p style="margin: 0 0 6px 0; font-size: 12px; color: #475569;"><strong>Responsável/Autor:</strong> ${item.author}</p>` : ''}
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #334155; line-height: 1.4;">${item.summary}</p>
                            <div style="display: flex; gap: 8px;">
                                <a href="${baseUrl}/admin/email-action?token=${encodeURIComponent(approveToken)}" style="display: inline-block; padding: 8px 14px; background-color: #16a34a; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 800;">
                                    ✅ Aprovar
                                </a>
                                <a href="${baseUrl}/admin/email-action?token=${encodeURIComponent(rejectToken)}" style="display: inline-block; padding: 8px 14px; background-color: #F14343; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 800;">
                                    ❌ Rejeitar
                                </a>
                            </div>
                        </div>
                    `;
                })
                .join('');

            const digestHtml = `
                <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">📡 Torre de Controle: ${totalCount} item(ns) aguardando revisão</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 14px;">
                    Confira abaixo os itens pendentes na fila unificada. Você pode aprovar ou rejeitar individualmente com um clique seguro ou aprovar o lote deste resumo.
                </p>
                <div style="margin: 20px 0; text-align: center;">
                    <a href="${baseUrl}/admin/email-action?token=${encodeURIComponent(batchApproveToken)}" style="display: inline-block; padding: 12px 24px; background-color: #FFCC00; color: #1E1E1E; text-decoration: none; border-radius: 8px; font-weight: 900; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                        ⚡ Aprovar Todos deste Resumo (${Math.min(totalCount, 30)})
                    </a>
                </div>
                <div style="margin-top: 20px;">
                    ${cardsHtml}
                </div>
            `;

            await sendAdminNotification({
                type: 'queue_digest',
                title: `📡 Torre de Controle LabDiv: ${totalCount} item(ns) aguardando revisão`,
                customHtml: digestHtml,
            });
        }

        return {
            checked: true,
            totalCount,
            oldestAgeMinutes,
        };
    } catch (error) {
        console.error('[QueueMonitor] Erro na geração do digest da fila:', error);
        return { checked: false, totalCount: 0, oldestAgeMinutes: 0 };
    } finally {
        state.isChecking = false;
    }
}
