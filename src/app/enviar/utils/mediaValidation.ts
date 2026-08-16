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

import { Block } from '@/app/enviar/schema';

export interface BlockMediaErrorInfo {
    blockId: string;
    blockType: string;
    label: string;
    tab: 'fluxo' | 'arte';
    errorMessage: string;
    invalidUrls: string[];
    invalidCarouselIndices?: number[];
}

/**
 * Retorna um nome amigável e legível para o bloco
 */
export function getHumanBlockTitle(block: Block, index?: number): string {
    const prefix = typeof index === 'number' ? `Bloco ${index + 1}` : 'Bloco';
    switch (block.type) {
        case 'image':
            return `${prefix} (Imagem)`;
        case 'carousel':
            return `${prefix} (Carrossel)`;
        case 'video':
            return `${prefix} (Vídeo / GIF)`;
        case 'audio':
            return `${prefix} (Áudio)`;
        case 'pdf':
            return `${prefix} (Documento PDF)`;
        case '3d_object':
            return `${prefix} (Modelo 3D)`;
        case 'text':
            return `${prefix} (Texto)`;
        case 'quiz':
            return `${prefix} (Quiz)`;
        case 'reflection':
            return `${prefix} (Reflexão)`;
        case 'drive':
            return `${prefix} (Pasta do Drive)`;
        case 'reference':
            return `${prefix} (Referências)`;
        case 'notes':
            return `${prefix} (Comentários)`;
        default:
            return `${prefix} (${block.type})`;
    }
}

/**
 * Verifica se uma URL é um blob: local que não possui arquivo correspondente na memória
 */
export function isOrphanedBlob(url: string | undefined | null, pendingFiles: Record<string, any> = {}): boolean {
    if (!url || typeof url !== 'string') return false;
    if (!url.startsWith('blob:')) return false;
    return !pendingFiles[url];
}

/**
 * Analisa um bloco específico e retorna se há problemas com suas mídias
 */
export function validateBlockMedia(
    block: Block,
    pendingFiles: Record<string, any> = {},
    tab: 'fluxo' | 'arte' = 'fluxo',
    index?: number
): BlockMediaErrorInfo | null {
    if (!block || !block.content) return null;

    const invalidUrls: string[] = [];
    const invalidCarouselIndices: number[] = [];

    // 1. Bloco de Imagem, Vídeo, Áudio, PDF, 3D Object
    if (['image', 'video', 'audio', 'pdf', '3d_object'].includes(block.type)) {
        const url = block.content.url;
        if (url && typeof url === 'string' && url.startsWith('blob:') && !pendingFiles[url]) {
            invalidUrls.push(url);
        }
    }

    // 2. Bloco de Carrossel
    if (block.type === 'carousel' && Array.isArray(block.content.urls)) {
        block.content.urls.forEach((url: string, idx: number) => {
            if (url && typeof url === 'string' && url.startsWith('blob:') && !pendingFiles[url]) {
                invalidUrls.push(url);
                invalidCarouselIndices.push(idx);
            }
        });
    }

    // 3. Fallback: verificar se o JSON do conteúdo contém qualquer outro link blob: órfão
    if (invalidUrls.length === 0) {
        const contentStr = JSON.stringify(block.content);
        if (contentStr.includes('blob:')) {
            const matches = contentStr.match(/blob:[^"'\s\\]+/g) || [];
            for (const match of matches) {
                if (!pendingFiles[match] && !invalidUrls.includes(match)) {
                    invalidUrls.push(match);
                }
            }
        }
    }

    if (invalidUrls.length > 0) {
        let errorMessage = 'Arquivo temporário expirado ou não encontrado na fila de envio.';
        if (block.type === 'carousel' && invalidCarouselIndices.length > 0) {
            errorMessage = `A(s) imagem(ns) na posição #${invalidCarouselIndices.map(i => i + 1).join(', ')} do carrossel precisa(m) ser reenviada(s).`;
        } else if (block.type === 'image') {
            errorMessage = 'A imagem deste bloco expirou da sessão e precisa ser selecionada novamente.';
        }

        return {
            blockId: block.id,
            blockType: block.type,
            label: getHumanBlockTitle(block, index),
            tab,
            errorMessage,
            invalidUrls,
            invalidCarouselIndices: invalidCarouselIndices.length > 0 ? invalidCarouselIndices : undefined,
        };
    }

    return null;
}

/**
 * Escaneia uma lista de blocos e retorna todos que possuem erros de mídia
 */
export function findBlocksWithMediaErrors(
    blocks: Block[],
    pendingFiles: Record<string, any> = {},
    tab: 'fluxo' | 'arte' = 'fluxo'
): BlockMediaErrorInfo[] {
    const errors: BlockMediaErrorInfo[] = [];
    if (!Array.isArray(blocks)) return errors;

    blocks.forEach((block, idx) => {
        const error = validateBlockMedia(block, pendingFiles, tab, idx);
        if (error) {
            errors.push(error);
        }
    });

    return errors;
}
