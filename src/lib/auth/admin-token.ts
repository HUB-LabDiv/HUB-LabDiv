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

import crypto from 'crypto';

function getAdminSecret(): string {
    return (
        process.env.ADMIN_SECRET_KEY ||
        process.env.ADMIN_PASSWORD ||
        'hub-labdiv-secure-admin-token-salt-2026'
    );
}

export type AdminRole = 'admin' | 'moderator';

interface TokenPayload {
    role: AdminRole;
    exp: number;
    iat: number;
}

/**
 * Gera um token assinado com HMAC-SHA256 para sessão administrativa
 */
export function createAdminToken(role: AdminRole = 'admin', ttlSeconds: number = 8 * 3600): string {
    const now = Date.now();
    const payload: TokenPayload = {
        role,
        iat: now,
        exp: now + ttlSeconds * 1000,
    };

    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', getAdminSecret())
        .update(data)
        .digest('base64url');

    return `${data}.${signature}`;
}

/**
 * Valida a integridade criptográfica e expiração de um token administrativo
 */
export function verifyAdminToken(token: string | undefined | null): { valid: boolean; role?: AdminRole } {
    if (!token || typeof token !== 'string') {
        return { valid: false };
    }

    const parts = token.split('.');
    if (parts.length !== 2) {
        return { valid: false };
    }

    const [data, signature] = parts;
    if (!data || !signature) {
        return { valid: false };
    }

    const expectedSignature = crypto
        .createHmac('sha256', getAdminSecret())
        .update(data)
        .digest('base64url');

    // Prevenção contra timing attacks
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expectedSignature);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
        return { valid: false };
    }

    try {
        const payload: TokenPayload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
        if (typeof payload.exp !== 'number' || payload.exp < Date.now()) {
            return { valid: false };
        }
        if (payload.role !== 'admin' && payload.role !== 'moderator') {
            return { valid: false };
        }
        return { valid: true, role: payload.role };
    } catch {
        return { valid: false };
    }
}
