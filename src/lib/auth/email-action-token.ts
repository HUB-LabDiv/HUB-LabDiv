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
import crypto from 'crypto';
import { ModerationItemType } from '@/types';

export interface EmailActionTokenPayload {
    itemId: string;
    itemType: ModerationItemType | 'all';
    decision: 'approve' | 'reject' | 'approve_all';
    title?: string;
    /** Timestamp ISO ou epoch ms do momento de geração do digest (impede aprovar itens posteriores no approve_all) */
    generatedAt: number;
    /** Lista explícita de itens contidos no digest quando decision === 'approve_all' */
    batchItems?: { itemId: string; itemType: ModerationItemType }[];
    exp: number;
}

function getSigningSecret(): string {
    const secret =
        process.env.ADMIN_JWT_SECRET ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        'hub-labdiv-fallback-hmac-secret';
    return secret;
}

/**
 * Assina um token de ação rápida para botões de e-mail da Torre de Controle (HMAC-SHA256, validade padrão 48h).
 */
export function signEmailActionToken(
    payload: Omit<EmailActionTokenPayload, 'exp' | 'generatedAt'> & { generatedAt?: number; ttlHours?: number }
): string {
    const now = Date.now();
    const ttlMs = (payload.ttlHours ?? 48) * 60 * 60 * 1000;

    const fullPayload: EmailActionTokenPayload = {
        itemId: payload.itemId,
        itemType: payload.itemType,
        decision: payload.decision,
        title: payload.title,
        generatedAt: payload.generatedAt ?? now,
        batchItems: payload.batchItems,
        exp: now + ttlMs,
    };

    const encodedPayload = Buffer.from(JSON.stringify(fullPayload), 'utf-8').toString('base64url');
    const signature = crypto
        .createHmac('sha256', getSigningSecret())
        .update(encodedPayload)
        .digest('base64url');

    return `${encodedPayload}.${signature}`;
}

/**
 * Verifica a integridade e validade temporal do token HMAC-SHA256 de ação via e-mail.
 */
export function verifyEmailActionToken(token: string): {
    valid: boolean;
    payload?: EmailActionTokenPayload;
    error?: string;
} {
    if (!token || typeof token !== 'string' || !token.includes('.')) {
        return { valid: false, error: 'Token de ação inválido ou malformado.' };
    }

    const [encodedPayload, providedSignature] = token.split('.');
    if (!encodedPayload || !providedSignature) {
        return { valid: false, error: 'Assinatura ausente no token.' };
    }

    const expectedSignature = crypto
        .createHmac('sha256', getSigningSecret())
        .update(encodedPayload)
        .digest('base64url');

    const sigBuffer = Buffer.from(providedSignature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
        return { valid: false, error: 'Assinatura criptográfica inválida.' };
    }

    try {
        const decoded = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8')) as EmailActionTokenPayload;
        if (!decoded.exp || Date.now() > decoded.exp) {
            return { valid: false, error: 'Este link de ação rápida expirou (validade de 48h). Acesse o painel da Torre de Controle.' };
        }
        return { valid: true, payload: decoded };
    } catch {
        return { valid: false, error: 'Não foi possível decodificar os dados do token.' };
    }
}

