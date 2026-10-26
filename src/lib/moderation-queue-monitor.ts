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

interface QueueMonitorState {
    lastVolume5Alert: number;
    lastVolume10Alert: number;
    lastSla10Alert: number;
    lastSla30Alert: number;
    isChecking: boolean;
}

const state: QueueMonitorState = {
    lastVolume5Alert: 0,
    lastVolume10Alert: 0,
    lastSla10Alert: 0,
    lastSla30Alert: 0,
    isChecking: false
};

// Intervalos de cooldown para prevenir inundações de email
const COOLDOWN_VOLUME_5_MS = 30 * 60 * 1000;   // 30 min
const COOLDOWN_VOLUME_10_MS = 15 * 60 * 1000;  // 15 min
const COOLDOWN_SLA_10_MS = 15 * 60 * 1000;     // 15 min
const COOLDOWN_SLA_30_MS = 20 * 60 * 1000;     // 20 min
const REPEAT_DELAY_MS = 2 * 60 * 1000;         // 2 minutos de intervalo para o segundo e-mail

/**
 * 🛰️ Monitor de Limiares da Fila de Moderação da Torre de Controle
 * 
 * Regras implementadas:
 * 1. > 5 itens na fila: Dispara 1 e-mail de alerta.
 * 2. >= 10 itens na fila: Dispara 2 e-mails espaçados por 2 minutos.
 * 3. Item > 10 min na fila: Dispara 1 e-mail de aviso de tempo/SLA.
 * 4. Item >= 30 min na fila: Dispara 2 e-mails espaçados por 2 minutos.
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

        // Consulta paralela de todas as fontes de aprovação pendentes
        const [
            subsRes,
            subEditsRes,
            profEditsRes,
            pendingProfilesRes,
            teacherVerifsRes,
            commentsRes,
            softwaresRes,
            feedbacksRes,
            oportunidadesRes,
            dicasRes,
            dropsRes,
            perguntasRes,
            palavrasRes,
            constelacaoEdgesRes,
            challengesRes,
            propostasRes,
            reportsRes
        ] = await Promise.all([
            adminSupabase.from('submissions').select('created_at').eq('status', 'pendente').order('created_at', { ascending: true }).limit(50),
            adminSupabase.from('submissions').select('created_at').not('pending_edits', 'is', null).order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('profiles').select('created_at').not('pending_edits', 'is', null).order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('profiles').select('created_at').eq('review_status', 'pending').order('created_at', { ascending: true }).limit(30),
            adminSupabase.from('profiles').select('created_at').eq('teacher_verification_status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('comments').select('created_at').eq('status', 'pendente').order('created_at', { ascending: true }).limit(30),
            adminSupabase.from('academic_softwares').select('created_at').eq('status', 'pendente').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('software_feedbacks').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('oportunidades').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('dicas_veteranos').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('micro_articles').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('perguntas').select('created_at').eq('status', 'pendente').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('palavras_geradoras').select('created_at').eq('is_pending', true).order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('constelacao_edges').select('created_at').eq('is_pending', true).order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('challenge_submissions').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('wiki_topic_proposals').select('created_at').eq('status', 'pendente').order('created_at', { ascending: true }).limit(20),
            adminSupabase.from('reports').select('created_at').eq('status', 'pending').order('created_at', { ascending: true }).limit(20)
        ]);

        const allResults = [
            subsRes.data || [],
            subEditsRes.data || [],
            profEditsRes.data || [],
            pendingProfilesRes.data || [],
            teacherVerifsRes.data || [],
            commentsRes.data || [],
            softwaresRes.data || [],
            feedbacksRes.data || [],
            oportunidadesRes.data || [],
            dicasRes.data || [],
            dropsRes.data || [],
            perguntasRes.data || [],
            palavrasRes.data || [],
            constelacaoEdgesRes.data || [],
            challengesRes.data || [],
            propostasRes.data || [],
            reportsRes.data || []
        ];

        let totalCount = 0;
        let oldestTimestamp: number | null = null;
        const now = Date.now();

        for (const list of allResults) {
            totalCount += list.length;
            for (const item of list) {
                if (item?.created_at) {
                    const itemTime = new Date(item.created_at).getTime();
                    if (!isNaN(itemTime)) {
                        if (oldestTimestamp === null || itemTime < oldestTimestamp) {
                            oldestTimestamp = itemTime;
                        }
                    }
                }
            }
        }

        const oldestAgeMinutes = oldestTimestamp ? Math.floor((now - oldestTimestamp) / (60 * 1000)) : 0;

        // -------------------------------------------------------------------------
        // REGRA 1 & 2: MONITORAMENTO DE VOLUME
        // -------------------------------------------------------------------------
        if (totalCount >= 10) {
            // >= 10 itens: Disparar 2 e-mails espaçados por 2 minutos
            if (now - state.lastVolume10Alert > COOLDOWN_VOLUME_10_MS) {
                state.lastVolume10Alert = now;
                state.lastVolume5Alert = now; // Suprime o alerta menor

                // 1º Envio Imediato
                await sendAdminNotification({
                    type: 'queue_volume_alert',
                    title: `🚨 URGENTE: Fila de Moderação com ${totalCount} itens (Aviso 1 de 2)`,
                    content: `Atenção: A Torre de Controle atingiu nível crítico com ${totalCount} itens pendentes de aprovação.`,
                    details: `Um segundo e-mail de reforço será disparado em 2 minutos caso a fila permaneça acumulada.`
                });

                // 2º Envio em 2 minutos
                setTimeout(async () => {
                    try {
                        await sendAdminNotification({
                            type: 'queue_volume_alert',
                            title: `🚨 URGENTE: Fila de Moderação ainda com ${totalCount}+ itens (Aviso 2 de 2 - Reforço)`,
                            content: `Reforço do alerta de volume: A fila da moderação ainda possui mais de 10 pendências acumuladas.`,
                            details: `Por favor, acesse o painel da Torre de Controle para analisar as submissões pendentes.`
                        });
                    } catch (err) {
                        console.error('[QueueMonitor] Falha ao enviar segundo e-mail de volume crítico:', err);
                    }
                }, REPEAT_DELAY_MS);
            }
        } else if (totalCount > 5) {
            // > 5 itens: Disparar 1 e-mail
            if (now - state.lastVolume5Alert > COOLDOWN_VOLUME_5_MS) {
                state.lastVolume5Alert = now;
                await sendAdminNotification({
                    type: 'queue_volume_alert',
                    title: `⚠️ Fila de Moderação com ${totalCount} itens pendentes`,
                    content: `A Torre de Controle acumulou mais de 5 itens aguardando aprovação (${totalCount} pendentes no total).`,
                    details: `Acesse o Painel Administrativo para aprovar ou rejeitar os materiais.`
                });
            }
        }

        // -------------------------------------------------------------------------
        // REGRA 3 & 4: MONITORAMENTO DE SLA DE TEMPO
        // -------------------------------------------------------------------------
        if (oldestAgeMinutes >= 30) {
            // >= 30 min: Disparar 2 e-mails espaçados por 2 minutos
            if (now - state.lastSla30Alert > COOLDOWN_SLA_30_MS) {
                state.lastSla30Alert = now;
                state.lastSla10Alert = now; // Suprime o alerta de 10min

                // 1º Envio Imediato
                await sendAdminNotification({
                    type: 'queue_sla_alert',
                    title: `🚨 SLA CRÍTICO: Item aguardando há mais de ${oldestAgeMinutes} minutos (Aviso 1 de 2)`,
                    content: `Alerta de SLA Excedido: Existe pelo menos uma submissão parada na fila há mais de 30 minutos sem moderação.`,
                    details: `Tempo do item mais antigo: ${oldestAgeMinutes} minutos. Um segundo aviso será enviado em 2 minutos.`
                });

                // 2º Envio em 2 minutos
                setTimeout(async () => {
                    try {
                        await sendAdminNotification({
                            type: 'queue_sla_alert',
                            title: `🚨 SLA CRÍTICO: Item parado na fila há mais de 30 minutos (Aviso 2 de 2 - Reforço)`,
                            content: `Reforço de SLA: As submissões pendentes ainda não foram moderadas após o alerta inicial.`,
                            details: `Por favor, revise a Torre de Controle para evitar gargalos na experiência dos usuários.`
                        });
                    } catch (err) {
                        console.error('[QueueMonitor] Falha ao enviar segundo e-mail de SLA crítico:', err);
                    }
                }, REPEAT_DELAY_MS);
            }
        } else if (oldestAgeMinutes > 10) {
            // > 10 min: Disparar 1 e-mail
            if (now - state.lastSla10Alert > COOLDOWN_SLA_10_MS) {
                state.lastSla10Alert = now;
                await sendAdminNotification({
                    type: 'queue_sla_alert',
                    title: `⏰ Alerta de SLA: Item aguardando há ${oldestAgeMinutes} minutos`,
                    content: `Aviso de tempo: Há submissões aguardando aprovação na fila há mais de 10 minutos.`,
                    details: `Tempo do item mais antigo: ${oldestAgeMinutes} minutos.`
                });
            }
        }

        return {
            checked: true,
            totalCount,
            oldestAgeMinutes
        };
    } catch (error) {
        console.error('[QueueMonitor] Erro na checagem da fila:', error);
        return { checked: false, totalCount: 0, oldestAgeMinutes: 0 };
    } finally {
        state.isChecking = false;
    }
}
