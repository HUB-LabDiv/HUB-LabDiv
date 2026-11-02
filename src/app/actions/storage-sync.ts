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

import { createServerSupabase } from '@/lib/supabase/server';
import { checkFirestickHealth, uploadToFirestick } from '@/lib/firestick-storage';
import { HybridStorageOverview } from '@/types/storage';

/**
 * Retorna visão geral do status do Fire Stick e espelhamento de mídias.
 */
export async function getHybridStorageOverview(): Promise<HybridStorageOverview> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return {
            firestickHealth: { online: false, error: 'Não autenticado' },
            totalTracked: 0,
            syncedCount: 0,
            pendingCount: 0,
            primaryOnlyCount: 0,
        };
    }

    const [health, mirrorsData] = await Promise.all([
        checkFirestickHealth(),
        supabase.from('media_storage_mirrors').select('mirror_status'),
    ]);

    const records = mirrorsData.data || [];
    const totalTracked = records.length;
    const syncedCount = records.filter(r => r.mirror_status === 'synced').length;
    const pendingCount = records.filter(r => r.mirror_status === 'pending').length;
    const primaryOnlyCount = records.filter(r => r.mirror_status === 'primary_only').length;

    return {
        firestickHealth: health,
        totalTracked,
        syncedCount,
        pendingCount,
        primaryOnlyCount,
    };
}

/**
 * Sincroniza em lotes controlados (default: 10 mídias) arquivos legados do Cloudinary
 * para o HD do Fire Stick.
 */
export async function syncLegacyBatchToFirestick(batchSize: number = 10): Promise<{
    success: boolean;
    syncedCount: number;
    errors: number;
    message: string;
}> {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, syncedCount: 0, errors: 0, message: 'Não autenticado.' };

    const { data: profile } = await supabase.from('profiles').select('is_labdiv').eq('id', user.id).single();
    if (!profile?.is_labdiv) return { success: false, syncedCount: 0, errors: 0, message: 'Acesso negado: Administrador necessário.' };

    // 1. Busca mídias marcadas como 'pending' no espelho
    const { data: pendingMirrors } = await supabase
        .from('media_storage_mirrors')
        .select('*')
        .eq('mirror_status', 'pending')
        .limit(batchSize);

    const urlsToProcess: string[] = [];
    if (pendingMirrors && pendingMirrors.length > 0) {
        urlsToProcess.push(...pendingMirrors.map(m => m.primary_url));
    }

    // 2. Se houver vaga no lote, busca mídias em submissions que ainda não estejam em media_storage_mirrors
    if (urlsToProcess.length < batchSize) {
        const remaining = batchSize - urlsToProcess.length;
        const { data: subs } = await supabase
            .from('submissions')
            .select('media_url, media_type')
            .ilike('media_url', '%cloudinary.com%')
            .order('created_at', { ascending: false })
            .limit(50);

        if (subs) {
            for (const sub of subs) {
                if (urlsToProcess.length >= batchSize) break;
                let extractedUrls: string[] = [];
                try {
                    extractedUrls = JSON.parse(sub.media_url);
                } catch {
                    extractedUrls = [sub.media_url];
                }

                for (const u of extractedUrls) {
                    if (typeof u === 'string' && u.includes('cloudinary.com') && !urlsToProcess.includes(u)) {
                        urlsToProcess.push(u);
                        if (urlsToProcess.length >= batchSize) break;
                    }
                }
            }
        }
    }

    if (urlsToProcess.length === 0) {
        return {
            success: true,
            syncedCount: 0,
            errors: 0,
            message: 'Nenhuma mídia pendente de sincronização encontrada.'
        };
    }

    let syncedCount = 0;
    let errors = 0;

    for (const url of urlsToProcess) {
        try {
            // Download do Cloudinary
            const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
            if (!response.ok) {
                errors++;
                continue;
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const contentType = response.headers.get('content-type') || 'image/jpeg';
            const filename = url.split('/').pop()?.split('?')[0] || `legacy-${Date.now()}.jpg`;

            // Upload para o Fire Stick
            const fsRes = await uploadToFirestick(buffer, filename, contentType);
            if (fsRes.success && fsRes.url) {
                await supabase.from('media_storage_mirrors').upsert({
                    primary_url: url,
                    primary_provider: 'cloudinary',
                    backup_url: fsRes.url,
                    firestick_filename: fsRes.filename,
                    mime_type: contentType,
                    size_bytes: buffer.length,
                    mirror_status: 'synced',
                    uploaded_by: user.id
                }, { onConflict: 'primary_url' });

                syncedCount++;
            } else {
                errors++;
            }
        } catch {
            errors++;
        }
    }

    return {
        success: true,
        syncedCount,
        errors,
        message: `Lote processado: ${syncedCount} mídias espelhadas no Fire Stick com sucesso.${errors > 0 ? ` (${errors} falhas)` : ''}`
    };
}

