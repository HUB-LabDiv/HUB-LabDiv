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

    const signatureData = await generateCloudinarySignature();
    if (!signatureData) {
        throw new Error("Server action falhou em retornar dados.");
    }
    if ('error' in signatureData) {
        throw new Error("Erro do Servidor: " + signatureData.error);
    }

    const { signature, timestamp, cloudName, apiKey, folder } = signatureData;
    
    if (!cloudName) {
        throw new Error("Cloud Name não está configurado no servidor.");
    }

    const formData = new FormData();
    formData.append('file', fileToUpload, file.name);
    formData.append('api_key', apiKey!);
    formData.append('timestamp', String(timestamp));
    formData.append('signature', signature);
    formData.append('folder', folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
        method: 'POST',
        body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error?.message || 'Erro no upload do Cloudinary');
    }
    
    return data.secure_url;
}
