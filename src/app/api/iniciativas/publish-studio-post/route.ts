/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Licença Pública Geral Affero GNU (AGPLv3)
 */
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orgSlug, title, body: content, imageDataUrl, images, isCarousel, aspect } = body;

    const slides: string[] = Array.isArray(images) && images.length > 0 ? images : (imageDataUrl ? [imageDataUrl] : []);

    if (!title || slides.length === 0) {
      return NextResponse.json({ ok: false, error: 'Título e imagem são obrigatórios.' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Tenta upload de imagens para o Supabase Storage via Service Role caso configurado
    const uploadedUrls: string[] = [];
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const adminSupabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          serviceRoleKey,
          { auth: { persistSession: false } }
        );
        for (let idx = 0; idx < slides.length; idx++) {
          const rawData = slides[idx];
          const match = rawData.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (match) {
            const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
            const buffer = Buffer.from(match[2], 'base64');
            const fileName = `studio_${orgSlug || 'org'}_${Date.now()}_${idx}.${ext}`;
            const { data: uploadRes, error: uploadErr } = await adminSupabase.storage
              .from('posts')
              .upload(fileName, buffer, {
                contentType: `image/${match[1]}`,
                upsert: true,
              });
            if (!uploadErr && uploadRes) {
              const { data: pubUrl } = adminSupabase.storage.from('posts').getPublicUrl(uploadRes.path);
              if (pubUrl?.publicUrl) uploadedUrls.push(pubUrl.publicUrl);
            }
          }
        }
      } catch {
        // Fallback silencioso se bucket 'posts' não estiver criado
      }
    }

    const postId = `post_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const submissionRecord = {
      title: title.trim(),
      description: content ? content.trim() : '',
      categoria: 'divulgacao',
      status: 'aprovado',
      user_id: user?.id || null,
      metadata: {
        orgSlug: orgSlug || 'labdiv',
        aspect: aspect || '4:5',
        source: 'aurtistic_studio',
        isCarousel: Boolean(isCarousel || slides.length > 1),
        slidesCount: slides.length,
        mediaUrls: uploadedUrls.length > 0 ? uploadedUrls : undefined,
        published_at: new Date().toISOString(),
      },
    };

    try {
      await supabase.from('submissions').insert([
        {
          id: postId,
          ...submissionRecord,
        },
      ]);
    } catch {
      // Ignora erro se tabela não existir
    }

    return NextResponse.json({
      ok: true,
      postId,
      slidesCount: slides.length,
      uploadedUrls,
      message: `Post ${slides.length > 1 ? `(Carrossel com ${slides.length} slides) ` : ''}publicado com sucesso no feed de @${orgSlug || 'iniciativa'}!`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao processar postagem.' },
      { status: 500 }
    );
  }
}
