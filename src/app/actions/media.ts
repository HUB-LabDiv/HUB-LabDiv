'use server';

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
import { createServerSupabase } from '@/lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { uploadToFirestick } from '@/lib/firestick-storage';

const submissionSchema = z.object({
    submission_id: z.string().uuid(),
});

/**
 * V8.0 Rate Limiting: Simple in-memory strategy for Server Actions.
 * For high-scale production, use Redis (Upstash).
 */
const rateLimitMap = new Map<string, number[]>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 10000;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(ip) || [];
    const validTimestamps = timestamps.filter(ts => now - ts < WINDOW_MS);

    if (validTimestamps.length >= MAX_REQUESTS) return false;

    validTimestamps.push(now);
    rateLimitMap.set(ip, validTimestamps);
    return true;
}

export async function toggleLike(formData: { submission_id: string }) {
    const validated = submissionSchema.safeParse(formData);
    if (!validated.success) return { error: 'Invalid input' };

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    if (!checkRateLimit(user.id)) {
        return { error: 'Too many requests. Slow down, scientist.' };
    }

    const { data: existing } = await supabase
        .from('curtidas')
        .select('id')
        .eq('submission_id', validated.data.submission_id)
        .eq('user_id', user.id)
        .maybeSingle();

    try {
        if (existing) {
            const { error } = await supabase.from('curtidas').delete().eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('curtidas').insert({
                submission_id: validated.data.submission_id,
                user_id: user.id,
                fingerprint: user.id, // Use full ID as fingerprint to ensure uniqueness
            });
            if (error) throw error;
        }

        revalidatePath('/');
        revalidatePath(`/arquivo/${validated.data.submission_id}`);
        return { success: true, liked: !existing };
    } catch (err: any) {
        console.error('Action toggleLike error:', err);
        return { error: err.message || 'Error syncing atom (like)' };
    }
}

export async function checkUserLikes(submissionIds: string[]): Promise<string[]> {
    if (!submissionIds.length) return [];

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('curtidas')
        .select('submission_id')
        .eq('user_id', user.id)
        .in('submission_id', submissionIds);

    if (error) {
        console.error('Action checkUserLikes error:', error);
        return [];
    }
    return data?.map(d => d.submission_id) || [];
}

export async function toggleSave(formData: { submission_id: string }) {
    const validated = submissionSchema.safeParse(formData);
    if (!validated.success) return { error: 'Invalid input' };

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    const { data: existing } = await supabase
        .from('saved_posts')
        .select('id')
        .eq('submission_id', validated.data.submission_id)
        .eq('user_id', user.id)
        .maybeSingle();

    try {
        if (existing) {
            const { error } = await supabase.from('saved_posts').delete().eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('saved_posts').insert({
                submission_id: validated.data.submission_id,
                user_id: user.id,
            });
            if (error) throw error;
        }

        revalidatePath('/');
        return { success: true, saved: !existing };
    } catch (err: any) {
        console.error('Action toggleSave error:', err);
        return { error: err.message || 'Error syncing save' };
    }
}

export async function checkUserSaves(submissionIds: string[]): Promise<string[]> {
    if (!submissionIds.length) return [];

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('saved_posts')
        .select('submission_id')
        .eq('user_id', user.id)
        .in('submission_id', submissionIds);

    if (error) return [];
    return data?.map(d => d.submission_id) || [];
}

export async function generateCloudinarySignature() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Unauthorized' };

    // V8.0 Point 2: Timestamp sync for Cloudinary signing
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'assets/submissions';

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    // Cloudinary requer os parâmetros ordenados alfabeticamente na string a ser assinada
    const paramsToSign = {
        folder,
        timestamp,
    };

    const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        process.env.CLOUDINARY_API_SECRET!
    );

    return {
        signature,
        timestamp,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        folder
    };
}

export async function uploadMediaServerAction(formData: FormData) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Usuário não autenticado.' };

    const file = formData.get('file') as File;
    if (!file) return { error: 'Nenhum arquivo fornecido para upload.' };

    const rawResourceType = (formData.get('resourceType') as string) || 'auto';
    const isPdf = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
    const effectiveResourceType = isPdf ? 'raw' : rawResourceType;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Tarefa 1: Upload Cloudinary (CDN Global Primário)
    const cloudinaryTask = (async (): Promise<string> => {
        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error('Credenciais Cloudinary não configuradas.');
        }

        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
        });

        const uploadOptions: any = {
            folder: 'assets/submissions',
            resource_type: effectiveResourceType as any,
        };
        if (isPdf) {
            uploadOptions.format = 'pdf';
        }

        return new Promise<string>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, res) => {
                    if (error) {
                        reject(error);
                    } else if (res?.secure_url) {
                        resolve(res.secure_url);
                    } else {
                        reject(new Error('Cloudinary sem URL de retorno.'));
                    }
                }
            );
            uploadStream.end(buffer);
        });
    })();

    // Tarefa 2: Upload Fire TV Stick (Backup Ativo em HD Físico)
    const firestickTask = uploadToFirestick(buffer, file.name || 'upload.bin', file.type || 'application/octet-stream');

    // Execução em Paralelo (Dual-Write)
    const [cldResult, fsResult] = await Promise.allSettled([cloudinaryTask, firestickTask]);

    const cldUrl = cldResult.status === 'fulfilled' ? cldResult.value : null;
    const cldError = cldResult.status === 'rejected' ? (cldResult.reason?.message || String(cldResult.reason)) : null;

    const fsResponse = fsResult.status === 'fulfilled' ? fsResult.value : null;
    const fsUrl = (fsResponse?.success && fsResponse?.url) ? fsResponse.url : null;
    const fsError = fsResult.status === 'rejected' ? (fsResult.reason?.message || String(fsResult.reason)) : (fsResponse?.error || null);

    if (cldError) {
        console.warn('[Storage Híbrido: Cloudinary falhou, avaliando contingência]:', cldError);
    }
    if (fsError) {
        console.warn('[Storage Híbrido: Fire Stick backup falhou ou offline]:', fsError);
    }

    // Cenário 1: Cloudinary OK (Primário)
    if (cldUrl) {
        // Registra par de espelho no Supabase (não-bloqueante para velocidade)
        try {
            await supabase.from('media_storage_mirrors').insert({
                primary_url: cldUrl,
                primary_provider: 'cloudinary',
                backup_url: fsUrl || null,
                firestick_filename: fsResponse?.filename || null,
                mime_type: file.type || null,
                size_bytes: file.size || buffer.length,
                mirror_status: fsUrl ? 'synced' : 'pending',
                uploaded_by: user.id
            });
        } catch (dbErr) {
            console.warn('[Storage Híbrido: Erro ao registrar espelho no banco]:', dbErr);
        }

        return { url: cldUrl };
    }

    // Cenário 2: Cloudinary FALHOU, mas Fire Stick está ONLINE (Failover Imediato)
    if (fsUrl) {
        console.info('[Storage Híbrido: Failover ativado com sucesso para o Fire Stick!]', fsUrl);
        try {
            await supabase.from('media_storage_mirrors').insert({
                primary_url: fsUrl,
                primary_provider: 'firestick',
                backup_url: null,
                firestick_filename: fsResponse?.filename || null,
                mime_type: file.type || null,
                size_bytes: file.size || buffer.length,
                mirror_status: 'primary_only',
                uploaded_by: user.id
            });
        } catch (dbErr) {
            console.warn('[Storage Híbrido: Erro ao registrar espelho do Fire Stick no banco]:', dbErr);
        }

        return { url: fsUrl };
    }

    // Cenário 3: Ambos falharam -> 3º Fallback de Emergência: Supabase Storage
    console.warn('[Storage Híbrido: Cloudinary e Fire Stick indisponíveis. Tentando 3º fallback Supabase Storage]');
    let supabaseError: string | null = null;
    try {
        const fileExt = file.name ? (file.name.split('.').pop() || 'bin') : 'bin';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const { error: storageErr } = await supabase.storage
            .from('submissions')
            .upload(filePath, buffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
            });

        if (!storageErr) {
            const { data: publicUrlData } = supabase.storage
                .from('submissions')
                .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
                try {
                    await supabase.from('media_storage_mirrors').insert({
                        primary_url: publicUrlData.publicUrl,
                        primary_provider: 'supabase',
                        backup_url: null,
                        mirror_status: 'pending',
                        uploaded_by: user.id
                    });
                } catch {}

                return { url: publicUrlData.publicUrl };
            }
        } else {
            supabaseError = storageErr.message;
        }
    } catch (supaErr: any) {
        supabaseError = supaErr?.message || String(supaErr);
    }

    const detailMsg = cldError || fsError || supabaseError || 'Verifique as permissões de armazenamento e conexão de rede.';
    return { error: `Não foi possível realizar o upload da mídia em nenhum dos servidores: ${detailMsg}` };
}

/**
 * Resolução dinâmica de backup caso uma mídia do Cloudinary falhe no frontend.
 */
export async function resolveBackupMediaUrl(failedUrl: string): Promise<{ success: boolean; backupUrl?: string; error?: string }> {
    if (!failedUrl) return { success: false, error: 'URL ausente.' };

    try {
        const supabase = await createServerSupabase();
        const { data, error } = await supabase
            .from('media_storage_mirrors')
            .select('backup_url, primary_url')
            .eq('primary_url', failedUrl)
            .maybeSingle();

        if (error || !data || !data.backup_url) {
            return { success: false, error: 'Espelho de backup não encontrado no Fire Stick.' };
        }

        return { success: true, backupUrl: data.backup_url };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao resolver espelho.' };
    }
}

