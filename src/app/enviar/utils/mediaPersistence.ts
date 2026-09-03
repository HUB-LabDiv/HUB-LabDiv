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

import { usePendingUploadsStore } from '@/store/usePendingUploadsStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { useDraftsStore } from '@/store/useDraftsStore';
import { uploadFileToCloudinary } from '@/lib/cloudinary-upload';
import { Block } from '../schema';

export interface PersistResult {
    success: boolean;
    uploadedCount: number;
    updatedBlocks: Block[];
    error?: string;
}

/**
 * Faz o upload de todas as mídias temporárias (blob:) presentes no canvas para o Cloudinary
 * e substitui as URLs nos blocos por links permanentes seguros (https://res.cloudinary.com/...).
 * Desta forma, o usuário pode recarregar a página ou abrir o rascunho depois sem risco de expiração.
 */
export async function persistPendingUploadsToCloudinary(): Promise<PersistResult> {
    try {
        const { blocks, setBlocks } = useSubmissionStore.getState();
        const { pendingFiles, removePendingFile } = usePendingUploadsStore.getState();

        // 1. Identifica apenas arquivos com blob:
        const blobEntries = Object.entries(pendingFiles).filter(([url]) => url.startsWith('blob:'));
        
        // Se não houver nenhum blob pendente, nada a fazer
        if (blobEntries.length === 0) {
            return {
                success: true,
                uploadedCount: 0,
                updatedBlocks: blocks
            };
        }

        const localToPublicUrls: Record<string, string> = {};
        let uploadedCount = 0;

        // 2. Upload paralelo de todos os arquivos pendentes para o Cloudinary
        await Promise.all(
            blobEntries.map(async ([localUrl, pending]) => {
                try {
                    const publicUrl = await uploadFileToCloudinary(pending.file, pending.resourceType);
                    localToPublicUrls[localUrl] = publicUrl;
                    uploadedCount++;
                    // Remove da fila de pendentes uma vez salvo
                    removePendingFile(localUrl);
                } catch (err) {
                    console.error(`Falha no upload do arquivo ${localUrl}:`, err);
                    throw err;
                }
            })
        );

        // 3. Substitui as URLs blob: pelas URLs permanentes no JSON dos blocos
        const updatedBlocks: Block[] = blocks.map(block => {
            const blockContentStr = JSON.stringify(block.content);
            let updatedContentStr = blockContentStr;

            for (const [localUrl, publicUrl] of Object.entries(localToPublicUrls)) {
                updatedContentStr = updatedContentStr.replaceAll(localUrl, publicUrl);
            }

            return {
                ...block,
                content: JSON.parse(updatedContentStr)
            };
        });

        // 4. Atualiza a store do Diagramador com os blocos permanentes
        setBlocks(updatedBlocks);

        // 5. Salva no useDraftsStore local para persistência imediata no localStorage
        const currentSubmissionState = useSubmissionStore.getState();
        useDraftsStore.getState().saveDraft({
            ...currentSubmissionState,
            blocks: updatedBlocks
        }, currentSubmissionState.activeDraftId || undefined, true);

        return {
            success: true,
            uploadedCount,
            updatedBlocks
        };
    } catch (error: any) {
        console.error('Erro em persistPendingUploadsToCloudinary:', error);
        return {
            success: false,
            uploadedCount: 0,
            updatedBlocks: useSubmissionStore.getState().blocks,
            error: error?.message || 'Falha ao salvar mídias no Cloudinary.'
        };
    }
}
