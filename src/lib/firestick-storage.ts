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

import { FirestickHealthStatus, FirestickUploadResponse } from '@/types/storage';

const STORAGE_BASE_URL = (process.env.NEXT_PUBLIC_STORAGE_BASE_URL || 'https://storage.hublabdiv.com.br').replace(/\/+$/, '');
const STORAGE_KEY = process.env.STORAGE_SERVER_KEY || '';

/**
 * Envia um arquivo Buffer diretamente ao servidor Fire TV Stick (Termux) via HTTPS.
 * Possui timeout de proteção de 8 segundos para evitar travamento em flutuações de rede doméstica.
 */
export async function uploadToFirestick(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string
): Promise<FirestickUploadResponse> {
    if (!STORAGE_KEY) {
        return {
            success: false,
            filename: '',
            url: '',
            size: 0,
            mimetype: mimeType,
            error: 'STORAGE_SERVER_KEY não configurada no servidor.'
        };
    }

    try {
        const formData = new FormData();
        const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
        formData.append('file', blob, originalFilename || 'upload.bin');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const response = await fetch(`${STORAGE_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'x-storage-key': STORAGE_KEY,
            },
            body: formData,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errText = await response.text().catch(() => '');
            return {
                success: false,
                filename: '',
                url: '',
                size: 0,
                mimetype: mimeType,
                error: `Fire Stick retornou status ${response.status}: ${errText}`
            };
        }

        const data = await response.json();
        const relativeUrl = data.url?.startsWith('/') ? data.url : `/${data.url || ''}`;
        const absoluteUrl = `${STORAGE_BASE_URL}${relativeUrl}`;

        return {
            success: true,
            filename: data.filename || originalFilename,
            url: absoluteUrl,
            size: data.size || fileBuffer.length,
            mimetype: data.mimetype || mimeType
        };
    } catch (err: any) {
        const isTimeout = err?.name === 'AbortError';
        return {
            success: false,
            filename: '',
            url: '',
            size: 0,
            mimetype: mimeType,
            error: isTimeout
                ? 'Timeout de 8s excedido na conexão com o Fire Stick.'
                : (err?.message || 'Falha na conexão com o Fire Stick.')
        };
    }
}

/**
 * Remove fisicamente o arquivo do HD do Fire Stick via endpoint DELETE.
 */
export async function deleteFromFirestick(filenameOrUrl: string): Promise<{ success: boolean; error?: string }> {
    if (!filenameOrUrl || !STORAGE_KEY) return { success: false, error: 'Parâmetro ou chave ausente.' };

    try {
        // Extrai apenas o nome do arquivo se for passado URL completa
        const cleaned = filenameOrUrl.split('?')[0].split('#')[0];
        const filename = cleaned.split('/').pop();

        if (!filename || filename.length < 3) {
            return { success: false, error: 'Nome de arquivo inválido para exclusão.' };
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${STORAGE_BASE_URL}/api/media/${encodeURIComponent(filename)}`, {
            method: 'DELETE',
            headers: {
                'x-storage-key': STORAGE_KEY,
            },
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok && response.status !== 404) {
            const errText = await response.text().catch(() => '');
            return { success: false, error: `Erro ${response.status}: ${errText}` };
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao deletar no Fire Stick.' };
    }
}

/**
 * Diagnóstico ao vivo do servidor Fire Stick.
 */
export async function checkFirestickHealth(): Promise<FirestickHealthStatus> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(`${STORAGE_BASE_URL}/health`, {
            method: 'GET',
            signal: controller.signal,
            cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return { online: false, error: `Status ${response.status}` };
        }

        const data = await response.json();
        return {
            online: true,
            uptime: data.uptime,
            device: data.device || 'FireTV-Termux'
        };
    } catch (err: any) {
        return {
            online: false,
            error: err?.message || 'Offline ou inacessível'
        };
    }
}

