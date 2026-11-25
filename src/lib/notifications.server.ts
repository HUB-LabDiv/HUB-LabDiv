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

import 'server-only';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { createAdminSupabase } from '@/lib/supabase/admin';

const FALLBACK_ADMIN_EMAIL = 'hublabdiv@gmail.com';
const DEFAULT_EMAIL_FROM = 'HUB LabDiv <noreply@hublabdiv.com.br>';

export type EmailProviderName = 'gmail' | 'resend';

export interface EmailSendResult {
    success: boolean;
    provider: EmailProviderName;
    messageId?: string;
    latencyMs: number;
    error?: string;
}

export type NotificationType =
    | 'submission'
    | 'question'
    | 'comment'
    | 'profile_update'
    | 'profile_creation'
    | 'bug_report'
    | 'arena_suggestion'
    | 'hub_improvement'
    | 'drop_submission'
    | 'thread_reply'
    | 'jupiter_sync_error'
    | 'beta_registration'
    | 'queue_volume_alert'
    | 'queue_sla_alert'
    | 'queue_digest';

export interface NotificationData {
    type: NotificationType;
    authors?: string;
    title?: string;
    category?: string;
    question?: string;
    userName?: string;
    content?: string;
    submissionTitle?: string;
    details?: string;
    url?: string;
    targetEmail?: string;
    customHtml?: string;
}

function getGmailCredentials(): { user: string; pass: string } | null {
    const user = (process.env.GMAIL_USER || '').trim();
    const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '').trim();
    if (!user || !pass) return null;
    return { user, pass };
}

async function logDeliveryAttempt(entry: {
    channel: 'email' | 'in_app' | 'push';
    provider: 'resend' | 'gmail' | 'supabase' | 'webpush';
    eventType: string;
    status: 'sent' | 'failed' | 'skipped';
    recipientsCount: number;
    messageId?: string;
    errorMessage?: string;
    latencyMs?: number;
}) {
    try {
        const adminSupabase = createAdminSupabase();
        await adminSupabase.from('notification_delivery_logs').insert({
            channel: entry.channel,
            provider: entry.provider,
            event_type: entry.eventType,
            status: entry.status,
            recipients_count: entry.recipientsCount,
            message_id: entry.messageId || null,
            error_message: entry.errorMessage ? entry.errorMessage.slice(0, 500) : null,
            latency_ms: entry.latencyMs ?? null,
        });
    } catch {
        // Nunca interrompe fluxo se tabela de auditoria ainda não foi migrada
    }
}

/**
 * Resolve dinamicamente os destinatários administrativos:
 * ADMIN_NOTIFICATION_EMAILS (env) ∪ profiles(role in ['admin', 'moderator']).email ∪ fallback hublabdiv@gmail.com
 */
export async function resolveAdminEmails(): Promise<string[]> {
    const emails = new Set<string>();

    const envRaw = process.env.ADMIN_NOTIFICATION_EMAILS || '';
    for (const part of envRaw.split(',')) {
        const clean = part.trim().toLowerCase();
        if (clean && clean.includes('@')) emails.add(clean);
    }

    try {
        const adminSupabase = createAdminSupabase();
        const { data } = await adminSupabase
            .from('profiles')
            .select('email')
            .in('role', ['admin', 'moderator', 'labdiv adm'])
            .not('email', 'is', null);

        for (const row of data || []) {
            const clean = String((row as { email?: string | null }).email || '').trim().toLowerCase();
            if (clean && clean.includes('@')) emails.add(clean);
        }
    } catch {
        // Fallback garantido abaixo
    }

    if (emails.size === 0) {
        emails.add(FALLBACK_ADMIN_EMAIL);
    } else {
        emails.add(FALLBACK_ADMIN_EMAIL);
    }

    return Array.from(emails);
}

export function maskEmailAddress(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***';
    const prefix = local.slice(0, 2);
    return `${prefix}***@${domain}`;
}

/**
 * Envia e-mail via Gmail SMTP (Nodemailer) com sanitização de senha, timeouts curtos, bcc e close().
 */
export async function sendEmailViaGmail({
    recipients,
    subject,
    html,
    eventType = 'admin_email',
}: {
    recipients: string[];
    subject: string;
    html: string;
    eventType?: string;
}): Promise<EmailSendResult> {
    const start = Date.now();
    const creds = getGmailCredentials();
    if (!creds) {
        const error = 'GMAIL_USER ou GMAIL_APP_PASSWORD não configurados.';
        await logDeliveryAttempt({
            channel: 'email',
            provider: 'gmail',
            eventType,
            status: 'skipped',
            recipientsCount: recipients.length,
            errorMessage: error,
            latencyMs: Date.now() - start,
        });
        return { success: false, provider: 'gmail', latencyMs: Date.now() - start, error };
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: creds.user, pass: creds.pass },
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
    });

    try {
        const cleanRecipients = Array.from(new Set(recipients.map((r) => r.trim()).filter(Boolean)));
        if (cleanRecipients.length === 0) {
            return { success: false, provider: 'gmail', latencyMs: Date.now() - start, error: 'Nenhum destinatário válido.' };
        }

        const mailOptions: nodemailer.SendMailOptions =
            cleanRecipients.length > 1
                ? {
                      from: `"Hub Lab-Div" <${creds.user}>`,
                      to: creds.user,
                      bcc: cleanRecipients,
                      subject,
                      html,
                  }
                : {
                      from: `"Hub Lab-Div" <${creds.user}>`,
                      to: cleanRecipients[0],
                      subject,
                      html,
                  };

        const info = await transporter.sendMail(mailOptions);
        const latencyMs = Date.now() - start;
        await logDeliveryAttempt({
            channel: 'email',
            provider: 'gmail',
            eventType,
            status: 'sent',
            recipientsCount: cleanRecipients.length,
            messageId: info.messageId,
            latencyMs,
        });
        return { success: true, provider: 'gmail', messageId: info.messageId, latencyMs };
    } catch (error: any) {
        const latencyMs = Date.now() - start;
        const msg = error?.message || 'Erro desconhecido no Gmail SMTP.';
        console.error('[Gmail SMTP] Erro ao enviar e-mail:', msg);
        await logDeliveryAttempt({
            channel: 'email',
            provider: 'gmail',
            eventType,
            status: 'failed',
            recipientsCount: recipients.length,
            errorMessage: msg,
            latencyMs,
        });
        return { success: false, provider: 'gmail', latencyMs, error: msg };
    } finally {
        try {
            transporter.close();
        } catch {}
    }
}

/**
 * Envia e-mail transacional via Resend usando EMAIL_FROM configurável e bcc para múltiplos destinatários.
 */
export async function sendEmailViaResend({
    recipients,
    subject,
    html,
    eventType = 'admin_email',
}: {
    recipients: string[];
    subject: string;
    html: string;
    eventType?: string;
}): Promise<EmailSendResult> {
    const start = Date.now();
    const apiKey = (process.env.RESEND_API_KEY || '').trim();
    if (!apiKey) {
        const error = 'RESEND_API_KEY não configurada.';
        await logDeliveryAttempt({
            channel: 'email',
            provider: 'resend',
            eventType,
            status: 'skipped',
            recipientsCount: recipients.length,
            errorMessage: error,
            latencyMs: Date.now() - start,
        });
        return { success: false, provider: 'resend', latencyMs: Date.now() - start, error };
    }

    const cleanRecipients = Array.from(new Set(recipients.map((r) => r.trim()).filter(Boolean)));
    if (cleanRecipients.length === 0) {
        return { success: false, provider: 'resend', latencyMs: Date.now() - start, error: 'Nenhum destinatário válido.' };
    }

    const fromAddress = (process.env.EMAIL_FROM || DEFAULT_EMAIL_FROM).trim();
    const resend = new Resend(apiKey);

    try {
        const payload =
            cleanRecipients.length > 1
                ? {
                      from: fromAddress,
                      to: [cleanRecipients[0]],
                      bcc: cleanRecipients.slice(1),
                      subject,
                      html,
                  }
                : {
                      from: fromAddress,
                      to: cleanRecipients,
                      subject,
                      html,
                  };

        const { data, error } = await resend.emails.send(payload);
        const latencyMs = Date.now() - start;

        if (error || !data?.id) {
            const msg = error?.message || 'Falha sem ID de resposta do Resend.';
            console.error('[Resend] Erro ao enviar e-mail:', msg);
            await logDeliveryAttempt({
                channel: 'email',
                provider: 'resend',
                eventType,
                status: 'failed',
                recipientsCount: cleanRecipients.length,
                errorMessage: msg,
                latencyMs,
            });
            return { success: false, provider: 'resend', latencyMs, error: msg };
        }

        await logDeliveryAttempt({
            channel: 'email',
            provider: 'resend',
            eventType,
            status: 'sent',
            recipientsCount: cleanRecipients.length,
            messageId: data.id,
            latencyMs,
        });
        return { success: true, provider: 'resend', messageId: data.id, latencyMs };
    } catch (err: any) {
        const latencyMs = Date.now() - start;
        const msg = err?.message || 'Exceção ao chamar Resend.';
        console.error('[Resend] Exceção:', msg);
        await logDeliveryAttempt({
            channel: 'email',
            provider: 'resend',
            eventType,
            status: 'failed',
            recipientsCount: cleanRecipients.length,
            errorMessage: msg,
            latencyMs,
        });
        return { success: false, provider: 'resend', latencyMs, error: msg };
    }
}

function buildAdminNotificationEmail(data: NotificationData): { subject: string; html: string } {
    let subject = '';
    let emailTemplate = '';
    let dashboardLink = 'https://www.hublabdiv.com.br/admin';

    const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hublabdiv.com.br';
    const baseUrl = rawBaseUrl.split(' ')[0].replace(/\/$/, '');

    switch (data.type) {
        case 'submission':
            subject = `📦 Hub: Nova Submissão - ${data.title}`;
            dashboardLink = `${baseUrl}/admin/acervo`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Nova submissão aguardando análise</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">Um novo material científico foi submetido ao Hub e precisa da sua aprovação.</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #0F4780; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #1a1a1a;">Autor(es):</strong> <span style="color: #4a5568;">${data.authors}</span></p>
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #1a1a1a;">Título:</strong> <span style="color: #4a5568;">${data.title}</span></p>
                    <p style="margin: 0; font-size: 14px;"><strong style="color: #1a1a1a;">Categoria:</strong> <span style="color: #4a5568;">${data.category}</span></p>
                </div>`;
            break;

        case 'question':
            subject = `❓ Hub: Pergunta de ${data.userName}`;
            dashboardLink = `${baseUrl}/admin/perguntas`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Nova Pergunta Científica</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">O usuário <strong>${data.userName}</strong> enviou uma nova dúvida.</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0; border-radius: 8px; font-style: italic; color: #2d3748;">
                    "${data.question}"
                </div>`;
            break;

        case 'comment':
            subject = `💬 Hub: Comentário de ${data.userName}`;
            dashboardLink = `${baseUrl}/admin`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Novo Comentário</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">O usuário <strong>${data.userName}</strong> comentou no material <strong>${data.submissionTitle}</strong>.</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; margin: 24px 0; border-radius: 8px; font-style: italic; color: #2d3748;">
                    "${data.content}"
                </div>`;
            break;

        case 'profile_creation':
            subject = `🆕 Hub: Novo Cadastro - ${data.userName}`;
            dashboardLink = `${baseUrl}/admin/profiles`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Novo Usuário Cadastrado</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">Um novo usuário completou seu cadastro no Hub e aguarda aprovação.</p>
                <div style="background-color: #f0f9ff; border-left: 4px solid #0F4780; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #1a1a1a;">Usuário:</strong> <span style="color: #4a5568;">${data.userName}</span></p>
                    ${data.details ? `<p style="margin: 0; font-size: 14px;"><strong style="color: #1a1a1a;">Email:</strong> <span style="color: #4a5568;">${data.details}</span></p>` : ''}
                </div>`;
            break;

        case 'profile_update':
            subject = `👤 Hub: Atualização de Perfil - ${data.userName}`;
            dashboardLink = `${baseUrl}/admin/profiles`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Perfil Editado</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">O usuário <strong>${data.userName}</strong> atualizou suas informações de perfil e aguarda revisão.</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #FFCC00; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0; font-size: 14px;"><strong style="color: #1a1a1a;">Usuário:</strong> <span style="color: #4a5568;">${data.userName}</span></p>
                </div>`;
            break;

        case 'bug_report': {
            const reportTypeLabel = data.details === 'sugestao' ? 'Sugestão' : data.details === 'outro' ? 'Outro' : 'Falha (Bug)';
            const reportBorderColor = data.details === 'sugestao' ? '#FFCC00' : data.details === 'outro' ? '#0F4780' : '#F14343';
            const reportLabelColor = data.details === 'sugestao' ? '#0F172A' : data.details === 'outro' ? '#0F4780' : '#F14343';
            const reportEmoji = data.details === 'sugestao' ? '💡' : data.details === 'outro' ? '💬' : '🚨';
            subject = `${reportEmoji} Hub: ${reportTypeLabel} — Enviado por ${data.userName || 'Anônimo'}`;
            dashboardLink = `${baseUrl}/admin/reports`;
            emailTemplate = `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">${reportEmoji} ${reportTypeLabel} Recebida</h2>
                <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px 20px; margin: 24px 0; border-radius: 8px;">
                    <p style="margin: 0; font-size: 16px; font-weight: 900; color: #0F4780;">${data.userName || 'Anônimo'}</p>
                    <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748B; text-transform: uppercase; font-weight: 700;">URL: ${data.url || 'N/A'}</p>
                </div>
                <div style="background-color: #F8FAFC; border-left: 4px solid ${reportBorderColor}; padding: 20px; border-radius: 4px;">
                    <strong style="display: block; margin-bottom: 8px; text-transform: uppercase; font-size: 11px; color: ${reportLabelColor}; letter-spacing: 0.1em;">Mensagem:</strong>
                    <p style="color: #334155; margin: 0; line-height: 1.7; font-size: 15px;">${data.content}</p>
                </div>`;
            break;
        }

        case 'arena_suggestion':
            subject = `🏆 Arena: Nova Proposta de Desafio - ${data.title}`;
            dashboardLink = `${baseUrl}/admin/desafios`;
            emailTemplate = `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">Nova Proposta de Desafio</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">O pesquisador <strong>${data.userName}</strong> enviou uma nova proposta para a Arena.</p>
                <div style="background-color: #F8FAFC; border-left: 4px solid #FFCC00; padding: 16px; margin: 24px 0; border-radius: 4px;">
                    <p style="margin: 0 0 8px 0; font-size: 14px;"><strong style="color: #121212;">Título:</strong> <span style="color: #475569;">${data.title}</span></p>
                    <p style="margin: 0; font-size: 14px;"><strong style="color: #121212;">Descrição:</strong> <span style="color: #475569;">${data.content}</span></p>
                </div>`;
            break;

        case 'hub_improvement':
            subject = `💡 Hub: Sugestão de Melhoria - ${data.userName}`;
            dashboardLink = `${baseUrl}/admin/desafios`;
            emailTemplate = `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">Sugestão de Melhoria do HUB</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">Um pesquisador enviou uma ideia para melhorar a plataforma.</p>
                <div style="background-color: #F8FAFC; border: 1px solid #1F9FCF; padding: 20px; margin: 24px 0; border-radius: 8px; color: #0F4780;">
                    <strong style="display: block; margin-bottom: 8px; text-transform: uppercase; font-size: 12px;">Sugestão:</strong>
                    "${data.content}"
                </div>
                <p style="font-size: 12px; color: #64748B;">Enviado por: ${data.userName}</p>`;
            break;

        case 'drop_submission':
            subject = `📝 Hub: Novo Log (Drop) - @${data.userName}`;
            dashboardLink = `${baseUrl}/admin/drops`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Novo Log Enviado (Drop)</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">O pesquisador <strong>@${data.userName}</strong> postou uma nova atualização rápida que aguarda moderação.</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #F14343; padding: 20px; margin: 24px 0; border-radius: 8px; font-style: italic; color: #2d3748;">
                    "${data.content}"
                </div>`;
            break;

        case 'thread_reply':
            subject = `💬 Hub: Resposta na Thread por @${data.userName}`;
            dashboardLink = `${baseUrl}/admin/logs`;
            emailTemplate = `
                <h2 style="color: #1a1a1a; margin-top: 0; font-size: 20px;">Nova Resposta (Thread)</h2>
                <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">O pesquisador <strong>@${data.userName}</strong> respondeu a um log.</p>
                <div style="background-color: #f8fafc; border-left: 4px solid #0F4780; padding: 20px; margin: 24px 0; border-radius: 8px; font-style: italic; color: #2d3748;">
                    "${data.content}"
                </div>`;
            break;

        case 'jupiter_sync_error':
            subject = `⚠️ Hub: Erro de Sincronização do Júpiter Web`;
            dashboardLink = `${baseUrl}/admin`;
            emailTemplate = `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">Erro no Scraper do Júpiter</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">O sistema tentou sincronizar a grade de um aluno, mas encontrou um erro ou não conseguiu capturar as disciplinas.</p>
                <div style="background-color: #F8FAFC; border: 1px solid #F14343; border-left: 4px solid #F14343; padding: 20px; margin: 24px 0; border-radius: 8px; color: #F14343;">
                    <strong style="display: block; margin-bottom: 8px; text-transform: uppercase; font-size: 12px;">Detalhes do Erro:</strong>
                    "${data.content}"
                </div>
                <p style="font-size: 12px; color: #64748B;">Usuário Afetado: ${data.userName || 'N/A'}</p>`;
            break;

        case 'beta_registration':
            subject = `🚀 Acesso Liberado: App HUB Lab-Div (Beta)`;
            dashboardLink = `https://play.google.com/apps/testing/com.hublabdiv.app`;
            emailTemplate = `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">Você já pode baixar o App Lab-Div!</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">A Google aprovou o seu e-mail <strong>${data.targetEmail}</strong> para a fase de testes (Closed Beta).</p>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">Para instalar no seu Android, certifique-se de que está logado no Google Play com este e-mail e clique no botão abaixo para aceitar o convite e fazer o download.</p>`;
            break;

        case 'queue_digest':
        case 'queue_volume_alert':
        case 'queue_sla_alert':
            subject = data.title || `📡 Torre de Controle LabDiv: Itens aguardando revisão`;
            dashboardLink = `${baseUrl}/admin`;
            emailTemplate =
                data.customHtml ||
                `
                <h2 style="color: #121212; margin-top: 0; font-size: 20px;">📡 Resumo da Fila de Moderação</h2>
                <p style="color: #475569; line-height: 1.6; font-size: 15px;">${data.content || 'Existem novos itens aguardando revisão na Torre de Controle.'}</p>
                ${data.details ? `<p style="margin: 12px 0 0 0; font-size: 14px; color: #475569;">${data.details}</p>` : ''}`;
            break;

        default:
            subject = `Notificação do Hub: ${data.title || 'Sistema'}`;
            emailTemplate = `<p>${data.content || 'Nenhuma informação adicional.'}</p>`;
    }

    const html = `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #0F4780; padding: 32px 24px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px;">LAB-DIV HUB</h1>
                <p style="color: #1F9FCF; margin: 6px 0 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px;">Instituto de Física | USP</p>
            </div>
            <div style="padding: 40px 32px; background-color: #ffffff;">
                ${emailTemplate}
                <div style="text-align: center; margin-top: 48px;">
                    <a href="${dashboardLink}" style="display: inline-block; padding: 14px 32px; background-color: #0F4780; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0,66,130,0.2);">
                        ${data.type === 'beta_registration' ? 'Acessar no Google Play' : 'Acessar Painel Admin'}
                    </a>
                </div>
            </div>
            <div style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #eaeaea;">
                <p style="color: #6c757d; margin: 0; font-size: 12px; line-height: 1.5;">Este é um e-mail automático enviado pelo Hub de Comunicação Científica do Lab-Div.<br>Por favor, não responda diretamente a este endereço.</p>
            </div>
        </div>
    `;

    return { subject, html };
}

/**
 * Envia notificação por e-mail usando EMAIL_PRIMARY_PROVIDER ('gmail' | 'resend') com fallback automático.
 * Nunca retorna success: true se todos os provedores falharem ou faltarem credenciais.
 */
export async function sendAdminNotification(data: NotificationData) {
    const recipients = data.targetEmail
        ? [data.targetEmail.trim()]
        : await resolveAdminEmails();
    const { subject, html } = buildAdminNotificationEmail(data);

    const primaryEnv = (process.env.EMAIL_PRIMARY_PROVIDER || 'gmail').toLowerCase();
    const order: EmailProviderName[] =
        primaryEnv === 'resend' ? ['resend', 'gmail'] : ['gmail', 'resend'];

    const errors: string[] = [];

    for (const provider of order) {
        const res =
            provider === 'resend'
                ? await sendEmailViaResend({ recipients, subject, html, eventType: data.type })
                : await sendEmailViaGmail({ recipients, subject, html, eventType: data.type });

        if (res.success) {
            return {
                success: true,
                provider: res.provider,
                messageId: res.messageId,
                latencyMs: res.latencyMs,
            };
        }
        if (res.error) errors.push(`${provider}: ${res.error}`);
    }

    return {
        success: false,
        error: errors.join(' | ') || 'Nenhum provedor de e-mail disponível.',
    };
}

/**
 * Dispara notificação no Sino In-App para todos os administradores e moderadores usando Service Role (bypass seguro de RLS).
 */
export async function notifyAdminsInApp(input: {
    title: string;
    message: string;
    link?: string;
    type?: string;
}): Promise<{ success: boolean; count: number; error?: string }> {
    const start = Date.now();
    try {
        const adminSupabase = createAdminSupabase();
        const { data: admins, error: queryError } = await adminSupabase
            .from('profiles')
            .select('id')
            .in('role', ['admin', 'moderator', 'labdiv adm']);

        if (queryError) {
            await logDeliveryAttempt({
                channel: 'in_app',
                provider: 'supabase',
                eventType: input.type || 'admin_alert',
                status: 'failed',
                recipientsCount: 0,
                errorMessage: queryError.message,
                latencyMs: Date.now() - start,
            });
            return { success: false, count: 0, error: queryError.message };
        }

        const adminIds = Array.from(new Set((admins || []).map((a) => a.id).filter(Boolean)));
        if (adminIds.length === 0) {
            return { success: false, count: 0, error: 'Nenhum usuário admin/moderador encontrado.' };
        }

        const rows = adminIds.map((uid) => ({
            user_id: uid,
            title: input.title,
            message: input.message,
            link: input.link || '/admin',
            type: input.type || 'admin_queue',
        }));

        const { error: insertError } = await adminSupabase.from('notifications').insert(rows);
        if (insertError) {
            await logDeliveryAttempt({
                channel: 'in_app',
                provider: 'supabase',
                eventType: input.type || 'admin_alert',
                status: 'failed',
                recipientsCount: adminIds.length,
                errorMessage: insertError.message,
                latencyMs: Date.now() - start,
            });
            return { success: false, count: 0, error: insertError.message };
        }

        await logDeliveryAttempt({
            channel: 'in_app',
            provider: 'supabase',
            eventType: input.type || 'admin_alert',
            status: 'sent',
            recipientsCount: adminIds.length,
            latencyMs: Date.now() - start,
        });

        return { success: true, count: adminIds.length };
    } catch (err: any) {
        const msg = err?.message || 'Erro ao notificar administradores no Sino In-App.';
        await logDeliveryAttempt({
            channel: 'in_app',
            provider: 'supabase',
            eventType: input.type || 'admin_alert',
            status: 'failed',
            recipientsCount: 0,
            errorMessage: msg,
            latencyMs: Date.now() - start,
        });
        return { success: false, count: 0, error: msg };
    }
}
