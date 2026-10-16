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

function getAdminSecret(): string {
    const secret = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('[Security] ADMIN_SECRET_KEY ou SUPABASE_SERVICE_ROLE_KEY é obrigatória no ambiente de produção.');
        }
        return 'hub-labdiv-dev-only-secret-key-local';
    }
    return secret;
}

export type AdminRole = 'admin' | 'moderator';

interface TokenPayload {
    role: AdminRole;
    exp: number;
    iat: number;
}

function bytesToBase64Url(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(base64url: string): Uint8Array {
    let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return await crypto.subtle.importKey(
        'raw',
        encoder.encode(getAdminSecret()),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
    );
}

/**
 * Gera um token assinado com HMAC-SHA256 para sessão administrativa via Web Crypto API (Edge-safe)
 */
export async function createAdminToken(role: AdminRole = 'admin', ttlSeconds: number = 8 * 3600): Promise<string> {
    const now = Date.now();
    const payload: TokenPayload = {
        role,
        iat: now,
        exp: now + ttlSeconds * 1000,
    };

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(JSON.stringify(payload));
    const data = bytesToBase64Url(dataBytes);

    const key = await getHmacKey();
    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
    const signature = bytesToBase64Url(new Uint8Array(signatureBuffer));

    return `${data}.${signature}`;
}

/**
 * Valida a integridade criptográfica e expiração de um token administrativo via Web Crypto API (Edge-safe)
 */
export async function verifyAdminToken(token: string | undefined | null): Promise<{ valid: boolean; role?: AdminRole }> {
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

    try {
        const key = await getHmacKey();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        const signatureBytes = base64UrlToBytes(signature);
        const dataBytes = encoder.encode(data);

        // Prevenção contra timing attacks e validação criptográfica atômica
        const isValid = await crypto.subtle.verify('HMAC', key, signatureBytes as unknown as BufferSource, dataBytes);
        if (!isValid) {
            return { valid: false };
        }

        const payloadJson = decoder.decode(base64UrlToBytes(data));
        const payload: TokenPayload = JSON.parse(payloadJson);

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
