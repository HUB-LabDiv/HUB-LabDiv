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

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with server-side environment variables
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/**
 * 💣 O Vácuo Nuclear: Deleta fisicamente todos os ativos do storage
 */
export async function purgeStorageFolder(folderPath: string = 'assets/submissions') {
    try {
        if (process.env.NODE_ENV === 'development') console.log(`[V3.1.0] Iniciando expurgo de storage: ${folderPath}`);
        const result = await cloudinary.api.delete_folder(folderPath);
        return { success: true, result };
    } catch (error: any) {
        if (process.env.NODE_ENV === 'development') console.error('[V3.1.0] Erro ao limpar storage:', error);
        return { success: false, error: error.message };
    }
}

export default cloudinary;
