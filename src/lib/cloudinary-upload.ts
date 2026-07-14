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

export async function uploadFileToCloudinary(
    file: File,
    resourceType: 'auto' | 'raw' | 'image' | 'video' = 'auto'
): Promise<string> {
    if (file.size > 10 * 1024 * 1024) {
        throw new Error('O arquivo excede o limite de 10MB.');
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
    formData.append('file', file);
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
