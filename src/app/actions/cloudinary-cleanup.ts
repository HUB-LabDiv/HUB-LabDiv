'use server';

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

import { v2 as cloudinary } from 'cloudinary';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';

// Configure Cloudinary Admin
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
}

export interface CloudinaryOrphanItem {
    public_id: string;
    url: string;
    format: string;
    bytes: number;
    created_at: string;
    resource_type: string;
}

export interface CloudinaryScanResult {
    success: boolean;
    totalInCloudinary: number;
    inUseCount: number;
    orphanedCount: number;
    totalOrphanedBytes: number;
    orphanedItems: CloudinaryOrphanItem[];
    error?: string;
}

/**
 * Escaneia a conta do Cloudinary e compara com todas as mídias registradas no banco de dados do HUB,
 * identificando fotos, vídeos, PDFs e modelos 3D que foram abandonados ou cujos posts foram excluídos.
 */
export async function scanOrphanedCloudinaryMedia(): Promise<CloudinaryScanResult> {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return { success: false, totalInCloudinary: 0, inUseCount: 0, orphanedCount: 0, totalOrphanedBytes: 0, orphanedItems: [], error: 'Não autenticado.' };

        const { data: profile } = await supabaseServer.from('profiles').select('is_labdiv, role').eq('id', user.id).single();
        if (!profile?.is_labdiv && profile?.role !== 'admin') {
            return { success: false, totalInCloudinary: 0, inUseCount: 0, orphanedCount: 0, totalOrphanedBytes: 0, orphanedItems: [], error: 'Acesso negado: Administrador necessário.' };
        }

        if (!cloudName || !apiKey || !apiSecret) {
            return { success: false, totalInCloudinary: 0, inUseCount: 0, orphanedCount: 0, totalOrphanedBytes: 0, orphanedItems: [], error: 'Credenciais do Cloudinary não configuradas no servidor.' };
        }

        // 1. Coleta todas as URLs em uso no Supabase
        const client = createAdminSupabase();
        const inUseUrls = new Set<string>();

        // 1.1 Submissions
        const { data: submissions } = await client
            .from('submissions')
            .select('media_url, thumbnail_url');

        if (submissions) {
            for (const sub of submissions) {
                if (sub.media_url) {
                    inUseUrls.add(sub.media_url);
                    // Tenta extrair URLs de dentro de blocos SDOCX
                    try {
                        const parsed = JSON.parse(sub.media_url);
                        if (Array.isArray(parsed)) {
                            const str = JSON.stringify(parsed);
                            const matches = str.match(/https:\/\/res\.cloudinary\.com\/[^\s"'\\]+/g) || [];
                            matches.forEach((m: string) => inUseUrls.add(m));
                        }
                    } catch {}
                }
                if (sub.thumbnail_url) inUseUrls.add(sub.thumbnail_url);
            }
        }

        // 1.2 Shared Drafts
        const { data: sharedDrafts } = await client
            .from('shared_drafts')
            .select('media_url');

        if (sharedDrafts) {
            for (const draft of sharedDrafts) {
                if (draft.media_url) {
                    inUseUrls.add(draft.media_url);
                    try {
                        const matches = draft.media_url.match(/https:\/\/res\.cloudinary\.com\/[^\s"'\\]+/g) || [];
                        matches.forEach((m: string) => inUseUrls.add(m));
                    } catch {}
                }
            }
        }

        // 1.3 Profiles Avatars
        const { data: profiles } = await client
            .from('profiles')
            .select('avatar_url');

        if (profiles) {
            for (const p of profiles) {
                if (p.avatar_url) inUseUrls.add(p.avatar_url);
            }
        }

        // 2. Busca recursos do Cloudinary na pasta de submissões
        const cloudResources: any[] = [];
        let nextCursor: string | undefined = undefined;

        // Itera para pegar até 1000 recursos
        for (let i = 0; i < 3; i++) {
            const res: any = await cloudinary.api.resources({
                type: 'upload',
                prefix: 'assets/submissions',
                max_results: 300,
                next_cursor: nextCursor
            });

            if (res?.resources && Array.isArray(res.resources)) {
                cloudResources.push(...res.resources);
            }

            nextCursor = res.next_cursor;
            if (!nextCursor) break;
        }

        // 3. Compara cada arquivo do Cloudinary com as URLs do banco
        const orphanedItems: CloudinaryOrphanItem[] = [];
        let inUseCount = 0;
        let totalOrphanedBytes = 0;

        for (const res of cloudResources) {
            const secureUrl = res.secure_url || res.url;
            const publicId = res.public_id;

            // Verifica se a URL ou public_id está contido em alguma URL em uso
            let isUsed = false;
            for (const usedUrl of inUseUrls) {
                if (usedUrl.includes(publicId) || usedUrl.includes(res.asset_id)) {
                    isUsed = true;
                    break;
                }
            }

            if (isUsed) {
                inUseCount++;
            } else {
                totalOrphanedBytes += (res.bytes || 0);
                orphanedItems.push({
                    public_id: publicId,
                    url: secureUrl,
                    format: res.format,
                    bytes: res.bytes || 0,
                    created_at: res.created_at,
                    resource_type: res.resource_type || 'image'
                });
            }
        }

        return {
            success: true,
            totalInCloudinary: cloudResources.length,
            inUseCount,
            orphanedCount: orphanedItems.length,
            totalOrphanedBytes,
            orphanedItems
        };
    } catch (e: any) {
        console.error('[Cloudinary Cleanup Scan Error]', e);
        return {
            success: false,
            totalInCloudinary: 0,
            inUseCount: 0,
            orphanedCount: 0,
            totalOrphanedBytes: 0,
            orphanedItems: [],
            error: e.message || 'Erro ao escanear o Cloudinary.'
        };
    }
}

/**
 * Exclui fisicamente do Cloudinary uma lista de mídias órfãs identificadas
 */
export async function deleteOrphanedCloudinaryMedia(publicIds: string[]) {
    try {
        const supabaseServer = await createServerSupabase();
        const { data: { user } } = await supabaseServer.auth.getUser();
        if (!user) return { error: 'Não autenticado.' };

        const { data: profile } = await supabaseServer.from('profiles').select('is_labdiv, role').eq('id', user.id).single();
        if (!profile?.is_labdiv && profile?.role !== 'admin') {
            return { error: 'Acesso negado: Administrador necessário.' };
        }

        if (!publicIds || publicIds.length === 0) {
            return { error: 'Nenhum ID de mídia fornecido para exclusão.' };
        }

        // Divide em lotes de 100 para respeitar limites da API Cloudinary
        const batchSize = 100;
        let deletedTotal = 0;

        for (let i = 0; i < publicIds.length; i += batchSize) {
            const chunk = publicIds.slice(i, i + batchSize);
            const result = await cloudinary.api.delete_resources(chunk);
            if (result?.deleted) {
                deletedTotal += Object.keys(result.deleted).length;
            }
        }

        return {
            success: true,
            deletedCount: deletedTotal
        };
    } catch (e: any) {
        console.error('[Cloudinary Cleanup Delete Error]', e);
        return { error: e.message || 'Erro ao excluir mídias do Cloudinary.' };
    }
}
