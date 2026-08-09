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

import { generateCloudinarySignature } from '@/app/actions/media';

/**
 * Compressa imagens no lado do cliente via HTML5 Canvas antes do envio ao Cloudinary
 */
export async function compressImageFile(file: File, maxDimension = 1920, quality = 0.82): Promise<Blob | File> {
    // Se não for imagem comum (ex: GIF, SVG), retorna sem compressão
    if (!file.type.startsWith('image/') || file.type.includes('svg') || file.type.includes('gif')) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);
            let { width, height } = img;

            // Redimensiona se exceder a dimensão máxima
            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(file);
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Exporta preferencialmente como WebP ou JPEG
            const mimeType = canvas.toDataURL('image/webp').startsWith('data:image/webp') ? 'image/webp' : 'image/jpeg';

            canvas.toBlob(
                (blob) => {
                    if (blob && blob.size < file.size) {
                        resolve(blob);
                    } else {
                        // Se por algum motivo o blob comprimido for maior, usa o original
                        resolve(file);
                    }
                },
                mimeType,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file);
        };

        img.src = url;
    });
}

import { uploadMediaServerAction } from '@/app/actions/media';

export async function uploadFileToCloudinary(
    file: File,
    resourceType: 'auto' | 'raw' | 'image' | 'video' = 'auto'
): Promise<string> {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de 10MB.');
    }

    // 1. Aplica compressão prévia para imagens
    let fileToUpload: File | Blob = file;
    if (file.type.startsWith('image/')) {
        try {
            fileToUpload = await compressImageFile(file);
        } catch (e) {
            console.warn('[Cloudinary Upload] Erro na compressão local, usando arquivo original:', e);
        }
    }

    // 2. Envia para o Server Action seguro de upload (garante fallback e dispensa assinatura no cliente)
    const formData = new FormData();
    const uploadFileObj = fileToUpload instanceof File 
        ? fileToUpload 
        : new File([fileToUpload], file.name || 'upload.webp', { type: fileToUpload.type || 'image/webp' });

    formData.append('file', uploadFileObj);
    formData.append('resourceType', resourceType);

    const res = await uploadMediaServerAction(formData);

    if ('error' in res && res.error) {
        throw new Error(res.error);
    }

    if (!('url' in res) || !res.url) {
        throw new Error('Falha ao obter URL pública do arquivo enviado.');
    }

    return res.url;
}
