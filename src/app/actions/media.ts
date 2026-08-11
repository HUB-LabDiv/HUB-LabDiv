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
    const resourceType = (formData.get('resourceType') as string) || 'auto';
    if (!file) return { error: 'Nenhum arquivo fornecido para upload.' };

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    let cloudinaryError: string | null = null;

    // 1. Tentar upload seguro direto pelo SDK Server-Side do Cloudinary
    if (cloudName && apiKey && apiSecret) {
        try {
            cloudinary.config({
                cloud_name: cloudName,
                api_key: apiKey,
                api_secret: apiSecret,
                secure: true,
            });

            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'assets/submissions',
                        resource_type: resourceType as any,
                    },
                    (error, res) => {
                        if (error) {
                            console.error('[Cloudinary Server Upload Error Detail]', error);
                            reject(error);
                        } else if (res?.secure_url) {
                            resolve(res);
                        } else {
                            reject(new Error('Upload sem URL de retorno.'));
                        }
                    }
                );
                uploadStream.end(buffer);
            });

            return { url: result.secure_url };
        } catch (err: any) {
            cloudinaryError = err?.message || String(err);
            console.warn('[Cloudinary Stream Upload Falhou, tentando fallback Supabase Storage]:', cloudinaryError);
        }
    } else {
        cloudinaryError = 'Credenciais Cloudinary (API Key/Secret) não encontradas nas variáveis de ambiente.';
    }

    // 2. Fallback: Supabase Storage (bucket 'submissions' - bucket público dedicado)
    let supabaseError: string | null = null;
    try {
        const fileExt = file.name ? (file.name.split('.').pop() || 'bin') : 'bin';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `media/${fileName}`;

        const arrayBuffer = await file.arrayBuffer();
        const { error: storageErr } = await supabase.storage
            .from('submissions')
            .upload(filePath, arrayBuffer, {
                contentType: file.type || 'application/octet-stream',
                upsert: true
            });

        if (!storageErr) {
            const { data: publicUrlData } = supabase.storage
                .from('submissions')
                .getPublicUrl(filePath);

            if (publicUrlData?.publicUrl) {
                return { url: publicUrlData.publicUrl };
            }
        } else {
            supabaseError = storageErr.message;
            console.error('[Supabase Storage Upload Error]', storageErr);
        }
    } catch (supaErr: any) {
        supabaseError = supaErr?.message || String(supaErr);
        console.error('[Supabase Storage Exception]', supaErr);
    }

    const detailMsg = supabaseError || cloudinaryError || 'Verifique as permissões de armazenamento e conexão de rede.';
    return { error: `Não foi possível realizar o upload do arquivo: ${detailMsg}` };
}
