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

/*!
 * Hub de Comunicação Científica Lab - Div V3.0
    * Copyright(C) 2026 João Paulo Stangorlini de Carvalho
        * * Este programa é software livre: você pode redistribuí - lo e / ou modificá - lo
            * sob os termos da Licença Pública Geral Affero GNU(AGPLv3) conforme
                * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
    * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
        * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { supabase } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase/server';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ShareButtons } from './ShareButtons';
import { ExportPDFButton } from './ExportPDFButton';
import { CommentsSection, Comment } from './CommentsSection';
import { ImageCarouselClient } from './ImageCarouselClient';
import { getDownloadUrl, parseMediaUrl, formatYoutubeUrl, getPdfViewerUrl, getPdfEmbedUrl } from '@/lib/media-utils';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { stripAllAlignmentMarkers, processAlignedText } from '@/lib/textAlignment';
import rehypeSanitize from 'rehype-sanitize';
import { MarkdownImage } from '@/components/reading/MarkdownImageLightbox';
import { ViewTracker } from "@/components/telemetry/ViewTracker";
import { ReadingExperienceProvider } from '@/components/reading/ReadingExperienceProvider';
import { ReadingViewManager } from '@/components/reading/ReadingViewManager';
import { ReadingHistoryTracker } from '@/components/reading/ReadingHistoryTracker';
import { FollowTagButton } from '@/components/engagement/FollowTagButton';
import { PostQuiz } from '@/components/media/PostQuiz';
import { ContentRating } from '@/components/feedback/ContentRating';
import { ReportButton } from './ReportButton';
import { StyledArticleView } from '@/components/reading/StyledArticleView';
import { SdocxHtmlBlock } from '@/components/reading/SdocxHtmlBlock';
import { SdocxHeroImage, SdocxInlineImage } from '@/components/reading/SdocxImageBlock';
import { RelatedMaterialCard } from '@/components/media/RelatedMaterialCard';

interface PageProps {
    params: Promise<{ id: string }>;
}

import { institutoData } from '@/data/institutoData';

async function getSubmission(id: string) {
    // 1. Try Supabase if ID is UUID-like
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUUID) {
        const { data, error } = await supabase
            .from('submissions')
            .select('*')
            .eq('id', id)
            .eq('status', 'aprovado')
            .neq('moderation_status', 'suspended')
            .single();

        if (data && !error) return data;
    }

    // 2. Fallback: Search in institutoData static winners
    const allWinners = Object.values(institutoData).flatMap(dept => dept.postsGanhadores.map(w => ({ ...w, dept })));
    const staticWinner = allWinners.find(w => w.postId === id || w.id === id);

    if (staticWinner) {
        return {
            id: staticWinner.postId || staticWinner.id,
            title: staticWinner.title,
            authors: staticWinner.autor,
            description: `Vencedor da Arena (${staticWinner.ano}) na categoria ${staticWinner.categoria}. Este material foi destaque no departamento ${staticWinner.dept.sigla} (${staticWinner.dept.nome}).`,
            media_type: 'image',
            media_url: staticWinner.mediaUrl,
            category: 'Arena',
            is_featured: true,
            is_golden_standard: true,
            tags: [staticWinner.ano, staticWinner.dept.sigla],
            created_at: new Date().toISOString(),
            status: 'aprovado',
            user_id: 'system'
        };
    }

    return null;
}

async function getRelatedSubmissions(categoryId: string, currentSubmissionId: string) {
    if (!categoryId) return [];

    const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'aprovado')
        .neq('moderation_status', 'suspended')
        .eq('category', categoryId)
        .neq('id', currentSubmissionId)
        .order('created_at', { ascending: false })
        .limit(3);

    if (error || !data) return [];
    return data;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const submission = await getSubmission(id);

    if (!submission) {
        return { title: 'Submissão não encontrada' };
    }

    const urls = parseMediaUrl(submission.media_url);

    // [I06] Robust SEO Fallback Logic
    let previewImage = '';

    if (submission.media_type === 'image' && urls[0]) {
        previewImage = urls[0];
    } else if (submission.media_type === 'video' && urls[0]) {
        const vidId = urls[0].split('/').pop()?.split('?')[0]; // Simple extract
        if (vidId && vidId.length === 11) {
            previewImage = `https://img.youtube.com/vi/${vidId}/maxresdefault.jpg`;
        }
    }

    // Final fallback to brand logo
    const finalImage = previewImage || 'https://hub-lab-div.vercel.app/arquivo-logo.png';

    const cleanDescription = submission.description
        ? submission.description.replace(/[#*`$]/g, '').substring(0, 160).trim() + '...'
        : `Contribuição de ${submission.authors} na categoria ${submission.category}.`;

    return {
        title: `${submission.title} — Hub Lab-Div`,
        description: cleanDescription,
        alternates: {
            canonical: `https://hub-lab-div.vercel.app/arquivo/${id}`,
        },
        openGraph: {
            title: submission.title,
            description: cleanDescription,
            images: [{ url: finalImage, width: 1200, height: 630, alt: submission.title }],
            type: 'article',
            publishedTime: submission.created_at,
            authors: [submission.authors],
            siteName: 'Hub de Comunicação Científica Lab-Div'
        },
        twitter: {
            card: 'summary_large_image',
            title: submission.title,
            description: cleanDescription,
            images: [finalImage],
        },
    };
}

// Utility functions moved to @/lib/media-utils.ts

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

import { ContextPanel } from '@/components/reading/ContextPanel';
import { BalloonReflexao } from '@/components/reading/BalloonReflexao';
import { TranslationalTooltip } from '@/components/reading/TranslationalTooltip';

export default async function ArquivoItemPage({ params }: PageProps) {
    const { id } = await params;
    const submission = await getSubmission(id);

    if (!submission) {
        notFound();
    }

    const urls = parseMediaUrl(submission.media_url);

    // Para posts sdocx: extrai o primeiro bloco de mídia para usar como hero
    let sdocxHeroBlock: any = null;
    let sdocxHeroUrl: string | null = null;
    if (submission.media_type === 'sdocx') {
        try {
            let blocks = [];
            if (typeof submission.media_url === 'string') {
                blocks = JSON.parse(submission.media_url || '[]');
            } else if (Array.isArray(submission.media_url)) {
                blocks = submission.media_url;
            }
            if (Array.isArray(blocks)) {
                const mediaBlock = blocks.find((b: any) => {
                    if (!b || !b.type) return false;
                    if (b.type === 'image' || b.type === 'video' || b.type === 'pdf') {
                        return Boolean(b.content?.url || b.content?.src);
                    }
                    if (b.type === 'carousel' && Array.isArray(b.content?.items) && b.content.items.length > 0) {
                        return Boolean(b.content.items[0]?.url || b.content.items[0]?.src);
                    }
                    return false;
                });
                if (mediaBlock) {
                    sdocxHeroBlock = mediaBlock;
                    if (mediaBlock.type === 'carousel') {
                        sdocxHeroUrl = mediaBlock.content.items[0]?.url || mediaBlock.content.items[0]?.src || null;
                    } else {
                        sdocxHeroUrl = mediaBlock.content?.url || mediaBlock.content?.src || null;
                    }
                }
            }
        } catch {}
    }

    let authorAvatarUrl = null;
    if (submission.user_id) {
        const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', submission.user_id).single();
        if (profile) authorAvatarUrl = profile.avatar_url;
    }

    const relatedSubmissions = await getRelatedSubmissions(submission.category, submission.id);

    // Fetch reflections for this post
    const { data: reflections } = await supabase
        .from('reflexoes_inline')
        .select('*')
        .eq('post_id', submission.id);

    // Fetch all words for tooltip replacement
    const { data: palavrasGeradoras } = await supabase
        .from('palavras_geradoras')
        .select(`
            id,
            termo,
            codificacao_academica,
            signos_constelacoes (
                constelacao,
                descodificacao
            )
        `);

    // Fetch likes for related submissions
    let likeMap: Record<string, number> = {};
    if (relatedSubmissions.length > 0) {
        const subIds = relatedSubmissions.map(s => s.id);
        const { data: likes } = await supabase
            .from('curtidas')
            .select('submission_id')
            .in('submission_id', subIds);

        if (likes) {
            likes.forEach(l => {
                likeMap[l.submission_id] = (likeMap[l.submission_id] || 0) + 1;
            });
        }
    }

    // [GRAFO] Fetch departments the submission is linked to (Graph Backlinks)
    const { data: linkedDepts } = await supabase
        .from('submission_departments')
        .select(`
            departments (
                id,
                sigla,
                nome
            )
        `)
        .eq('submission_id', submission.id);
    const associatedDepartments = linkedDepts?.map((rel: any) => rel.departments).filter(Boolean) || [];

    // Fetch comments
    const { data: routeComments } = await supabase
        .from('comments')
        .select('*')
        .eq('submission_id', submission.id)
        .eq('status', 'aprovado')
        .neq('moderation_status', 'suspended')
        .order('created_at', { ascending: false });

    const serverSupabase = await createServerSupabase();
    const { data: { user } } = await serverSupabase.auth.getUser();
    
    let isLabDiv = false;
    if (user) {
        const { data: profile } = await serverSupabase.from('profiles').select('is_labdiv').eq('id', user.id).single();
        if (profile?.is_labdiv) {
            isLabDiv = true;
        }
    }

    const breadcrumbItems = [
        { label: 'Arquivo Lab-Div', href: '/arquivo-labdiv' },
        { label: submission.category, href: `/?collection=${encodeURIComponent(submission.category)}` },
        { label: submission.title }
    ];

    return (
        <ReadingExperienceProvider>
            <MainLayoutWrapper focusMode={true}>
                <ReadingViewManager submission={submission}>
                    <main id="main-content" className="flex-1 max-w-5xl mx-auto w-full py-8 sm:py-12 px-4 outline-none">
                        <ViewTracker submissionId={submission.id} />
                        {user?.id && <ReadingHistoryTracker submissionId={submission.id} userId={user.id} />}

                        <Breadcrumbs items={breadcrumbItems} />

                        {/* ─── Card de Introdução ao Índice (Hierarquia: 2º após Fogo) ─── */}
                        {submission.description && submission.description.length > 500 && (
                            <div className="mb-6 bg-white dark:bg-card-dark rounded-2xl p-4 sm:p-5 border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#0055ff]/10 text-[#0055ff] shrink-0">
                                    <span className="material-symbols-outlined text-2xl">format_list_bulleted</span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Este artigo possui um índice estruturado</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Use o botão <span className="inline-flex items-center align-middle mx-0.5 px-1.5 py-0.5 bg-[#0055ff]/10 text-[#0055ff] rounded text-[10px] font-bold">≡</span> no topo direito para navegar entre as seções.</p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white dark:bg-card-dark rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
                            <div className="p-6 md:p-10 space-y-0">
                                
                                {/* 1. TAGS E CATEGORIAS NO TOPO */}
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    {submission.category && (
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-bold tracking-wide uppercase">
                                            {submission.category}
                                        </span>
                                    )}
                                    {submission.is_featured && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-brand-red to-brand-yellow text-white rounded-full text-xs font-bold tracking-wide uppercase">
                                            Destaque
                                        </span>
                                    )}
                                    {associatedDepartments.map((dept: any) => (
                                        <Link
                                            key={dept.id}
                                            href={`/wiki/instituto/${dept.sigla.toLowerCase()}`}
                                            className="px-3 py-1 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow/20 border border-brand-yellow/20 rounded-full text-[10px] font-black transition-all flex items-center gap-1 uppercase tracking-widest"
                                            title={`Retornar ao Departamento: ${dept.nome}`}
                                        >
                                            <span className="material-symbols-outlined text-[14px]">account_balance</span>
                                            {dept.sigla}
                                        </Link>
                                    ))}
                                    {submission.tags?.map((tag: string, idx: number) => (
                                        <Link
                                            key={idx}
                                            href={`/?tag=${tag.replace('#', '')}`}
                                            className="px-3 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-brand-blue border border-gray-100 dark:border-gray-700 rounded-full text-xs font-bold transition-all"
                                        >
                                            #{tag.replace('#', '')}
                                        </Link>
                                    ))}
                                </div>

                                {/* 2. AUTORES */}
                                <div className="flex flex-col border-b border-gray-100 dark:border-gray-800 pb-6 mb-8">
                                    <div className="flex items-center gap-3">
                                        {authorAvatarUrl ? (
                                            <img src={authorAvatarUrl} alt={submission.authors} className="size-10 rounded-full object-cover shrink-0" />
                                        ) : (
                                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary dark:text-brand-blue font-bold text-xs uppercase shrink-0">
                                                {submission.authors.substring(0, 2)}
                                            </div>
                                        )}
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Autore(s)</span>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{submission.authors}</span>
                                        </div>
                                    </div>
                                    
                                    {submission.co_authors && Array.isArray(submission.co_authors) && submission.co_authors.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3 pl-[52px]">
                                            {submission.co_authors.map((co: any, idx: number) => (
                                                <span key={idx} className="text-[10px] bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700/50">
                                                    {co.full_name}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Links Internos (Somente LabDiv) */}
                                    {isLabDiv && (submission.docs_link || submission.drive_link) && (
                                        <div className="flex flex-wrap gap-4 mt-4 pl-[52px]">
                                            {submission.docs_link && (
                                                <a
                                                    href={submission.docs_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[10px] bg-brand-yellow/10 hover:bg-brand-yellow/20 px-3 py-1.5 rounded-full text-brand-yellow border border-brand-yellow/20 transition-colors uppercase tracking-widest font-black"
                                                    title="Abrir Documento"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">description</span>
                                                    Acessar Docs
                                                </a>
                                            )}
                                            {submission.drive_link && (
                                                <a
                                                    href={submission.drive_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-[10px] bg-brand-yellow/10 hover:bg-brand-yellow/20 px-3 py-1.5 rounded-full text-brand-yellow border border-brand-yellow/20 transition-colors uppercase tracking-widest font-black"
                                                    title="Abrir Pasta no Drive"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">folder</span>
                                                    Acessar Drive
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* 3. TÍTULO */}
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-8">
                                    {submission.title}
                                </h1>

                                {/* 4. OBJETO PRINCIPAL */}
                                {submission.media_type !== 'text' && submission.media_type !== 'zip' && submission.media_type !== 'sdocx' && urls.length > 0 && (
                                    <div className="w-full bg-background-dark rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 min-h-[300px] md:min-h-[500px] flex items-center justify-center mb-8">
                                        {submission.media_type === 'video' ? (
                                            <div className="w-full h-full aspect-video">
                                                <iframe
                                                    src={formatYoutubeUrl(urls[0])}
                                                    className="w-full h-full"
                                                    allowFullScreen
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                />
                                            </div>
                                        ) : (
                                            <ImageCarouselClient
                                                urls={urls}
                                                title={submission.title}
                                                slides={submission.slides}
                                            />
                                        )}
                                    </div>
                                )}
                                {submission.media_type === 'sdocx' && sdocxHeroBlock && sdocxHeroUrl && (
                                    <>
                                        {(sdocxHeroBlock.type === 'image' || sdocxHeroBlock.type === 'carousel') && (
                                            <div className="-mx-6 md:-mx-10 mb-8 overflow-hidden rounded-xl shadow-lg">
                                                <SdocxHeroImage src={sdocxHeroUrl} alt={submission.title} allowBlob={true} />
                                            </div>
                                        )}
                                        {(sdocxHeroBlock.type === 'video' || sdocxHeroBlock.type === 'pdf') && (
                                            <div className="w-full bg-background-dark rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 min-h-[300px] md:min-h-[500px] flex items-center justify-center mb-8">
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                                    <span className="material-symbols-outlined text-6xl text-brand-blue/40">
                                                        {sdocxHeroBlock.type === 'video' ? 'play_circle' : 'picture_as_pdf'}
                                                    </span>
                                                    <span className="text-brand-blue/60 text-sm font-bold uppercase tracking-wider">
                                                        {sdocxHeroBlock.type === 'video' ? 'Player de Vídeo' : 'Leitor de PDF'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* 5. BOTÕES DE AÇÃO */}
                                <div className="flex items-center justify-between gap-4 py-4 border-y border-gray-100 dark:border-gray-800 mb-8">
                                    <div className="flex items-center gap-2">
                                        <ReportButton submissionId={submission.id} />
                                        <ExportPDFButton />
                                        <ShareButtons title={submission.title} id={submission.id} />
                                    </div>
                                </div>

                                {/* 6. DESCRIÇÃO */}
                                {submission.description && (
                                    <div className="mb-10">
                                        {submission.media_type !== 'sdocx' && <ContextPanel context={submission.contexto_hsec} />}
                                        <StyledArticleView
                                            content={submission.description}
                                            palavrasGeradoras={palavrasGeradoras || undefined}
                                            fullTextForToc={submission.description}
                                        />
                                    </div>
                                )}

                                {/* 7. CONTEÚDO E BLOCOS (SDOCX) */}
                                {submission.media_type === 'sdocx' && (
                                    <div id="submission-content">
                                        <ContextPanel context={submission.contexto_hsec} />

                                        <div className="flex flex-col gap-8 w-full mt-8">
                                            {(() => {
                                                let blocks: any[] = [];
                                                try { blocks = JSON.parse(submission.media_url || '[]'); } catch {}
                                                if (!Array.isArray(blocks)) blocks = [];

                                                {/* Collect all text blocks for the unified TOC */}
                                                const allTextContent = blocks
                                                    .filter((b: any) => b.type === 'text')
                                                    .map((b: any) => b.content.text)
                                                    .join('\n\n');
                                                let tocRendered = false;
                                                
                                                return blocks.map((block) => {
                                                    if (block.type === 'text') {
                                                        // TextBlock saves HTML (via contenteditable/execCommand)
                                                        // SdocxHtmlBlock renders it safely with browser DOMParser sanitization
                                                        return (
                                                            <div key={block.id} className="py-4">
                                                                <SdocxHtmlBlock html={block.content.text || ''} />
                                                            </div>
                                                        );
                                                    } else if (block.type === 'image') {
                                                        // Ignora o bloco hero (já exibido no topo)
                                                        if (sdocxHeroBlock && (block.id === sdocxHeroBlock.id || block.content?.url === sdocxHeroBlock.content?.url)) return null;
                                                        return (
                                                            <SdocxInlineImage
                                                                key={block.id}
                                                                src={block.content.url}
                                                                altText={block.content.altText}
                                                            />
                                                        );
                                                    } else if (block.type === 'video') {
                                                        const isGif = block.content.url?.toLowerCase().endsWith('.gif');
                                                        return isGif ? (
                                                            <div key={block.id} className="relative rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 my-8 w-full flex items-center justify-center p-4">
                                                                <img src={block.content.url} alt="GIF Animado" className="w-full h-auto max-h-[600px] object-contain rounded-lg" loading="lazy" />
                                                            </div>
                                                        ) : (
                                                            <div key={block.id} className="w-full aspect-video bg-background-dark rounded-xl overflow-hidden my-8 shadow-lg">
                                                                <iframe src={formatYoutubeUrl(block.content.url)} className="w-full h-full border-none" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                                                            </div>
                                                        );
                                                    } else if (block.type === 'audio') {
                                                        return (
                                                            <div key={block.id} className="w-full my-6 p-6 bg-gray-50 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                                                                    <span className="material-symbols-outlined">audiotrack</span>
                                                                </div>
                                                                <audio src={block.content.url} controls className="w-full h-10 outline-none" />
                                                            </div>
                                                        );
                                                    } else if (block.type === 'pdf') {
                                                        return (
                                                            <div key={block.id} className="w-full h-[700px] my-8 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl bg-gray-50 dark:bg-gray-900">
                                                                <iframe src={getPdfEmbedUrl(block.content.url)} className="w-full h-full border-none" />
                                                            </div>
                                                        );
                                                    } else if (block.type === '3d_object') {
                                                         const modelUrl = block.content?.url || '';
                                                         const caption = block.content?.caption || '';
                                                         const altText = block.content?.altText || '';
                                                         return (
                                                             <figure key={block.id} className="w-full my-8 flex flex-col items-center gap-2">
                                                                 <div className="w-full h-[450px] bg-background-dark/30 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl flex items-center justify-center relative">
                                                                     {modelUrl.includes('drive.google') ? (
                                                                         <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-800/30">
                                                                             <span className="material-symbols-outlined text-5xl mb-2 text-brand-yellow">folder_zip</span>
                                                                             <span className="text-sm font-bold uppercase tracking-widest text-gray-200 mb-2">Pasta do Google Drive</span>
                                                                             <a href={modelUrl} target="_blank" rel="noopener noreferrer" className="text-xs hover:text-white transition-colors underline decoration-brand-yellow underline-offset-4">Acessar Modelo 3D no Drive</a>
                                                                         </div>
                                                                     ) : modelUrl.includes('sketchfab.com') ? (
                                                                         <iframe 
                                                                             title={caption || altText || "Sketchfab 3D Model"}
                                                                             src={modelUrl.includes('/embed') ? modelUrl : `${modelUrl}/embed`}
                                                                             className="w-full h-full border-0"
                                                                             allow="autoplay; fullscreen; xr-spatial-tracking"
                                                                             allowFullScreen
                                                                         />
                                                                     ) : (
                                                                         // @ts-ignore
                                                                         <model-viewer 
                                                                             src={modelUrl} 
                                                                             alt={altText || caption || 'Modelo 3D Interativo'}
                                                                             aria-label={altText || caption || 'Visualizador de Modelo 3D Interativo'}
                                                                             auto-rotate="true" 
                                                                             camera-controls="true" 
                                                                             ar="true"
                                                                             style={{ width: '100%', height: '100%' }}
                                                                         >
                                                                         {/* @ts-ignore */}
                                                                         </model-viewer>
                                                                     )}
                                                                 </div>
                                                                 {caption && (
                                                                     <figcaption className="text-xs text-gray-500 dark:text-gray-400 text-center italic mt-1 font-sans">
                                                                         {caption}
                                                                     </figcaption>
                                                                 )}
                                                                 {altText && (
                                                                     <span className="sr-only">{altText}</span>
                                                                 )}
                                                             </figure>
                                                         );
                                                    } else if (block.type === 'reflection') {
                                                        return (
                                                            <div key={block.id} className="my-10">
                                                                <BalloonReflexao reflexaoId={block.id} ancoraId={`reflexao-${block.id}`} pergunta={block.content.question} tipo="aberta" />
                                                            </div>
                                                        );
                                                    } else if (['reference', 'notes', 'context_history', 'context_social', 'context_political'].includes(block.type)) {
                                                        const titles: Record<string, string> = { reference: 'Referências', notes: 'Notas da Autoria', context_history: 'Contexto Histórico', context_social: 'Contexto Social', context_political: 'Contexto Político' };
                                                        const icons: Record<string, string> = { reference: 'menu_book', notes: 'edit_note', context_history: 'history_edu', context_social: 'groups', context_political: 'gavel' };
                                                        return (
                                                            <div key={block.id} className="p-6 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 my-8 shadow-sm">
                                                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                                    <span className="material-symbols-outlined text-[18px]">{icons[block.type]}</span>
                                                                    {titles[block.type]}
                                                                </h3>
                                                                <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none">
                                                                    {processAlignedText(block.content.text).map((seg: any, i: number) => (
                                                                        <div key={i} style={{ textAlign: seg.align }}>
                                                                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{seg.text}</ReactMarkdown>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                });
                                            })()}
                                        </div>
                                    </div>
                                )}

                                {/* Download and Security Notice */}
                                {(submission.media_type === 'image' || submission.media_type === 'pdf' || submission.media_type === 'zip' || submission.media_type === 'sdocx') && urls.length > 0 && (
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 dark:bg-background-dark/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <a
                                            href={getDownloadUrl(urls[0])}
                                            className="px-6 py-2.5 bg-brand-blue hover:bg-brand-darkBlue text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">download</span>
                                            Baixar arquivo
                                        </a>
                                        <div className="flex items-center gap-2">
                                            <span className="material-symbols-outlined text-brand-green text-[20px]">verified_user</span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                Segurança: Arquivo verificado contra vírus pela curadoria administrativa.
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Interactive Quiz Section */}
                        {submission.quiz && Array.isArray(submission.quiz) && submission.quiz.length > 0 && (
                            <div className="mt-8 mb-12">
                                <PostQuiz
                                    submissionId={submission.id}
                                    quiz={submission.quiz}
                                    authorId={submission.user_id}
                                    currentUserId={user?.id}
                                />
                            </div>
                        )}

                        {/* Content Rating */}
                        <div className="mt-8 mb-12 w-full">
                            <ContentRating
                                postId={submission.id}
                                contentFormat={submission.content_format || (submission.media_type === 'video' ? 'video' : submission.media_type === 'image' ? 'image' : 'text')}
                            />
                        </div>

                        {/* Interactive Comments */}
                        <CommentsSection
                            submissionId={submission.id}
                            submissionTitle={submission.title}
                            initialComments={(routeComments as Comment[]) || []}
                        />

                        {/* Related Materials Section */}
                        {relatedSubmissions.length > 0 && (
                            <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                                    <div>
                                        <h3 className="text-2xl font-bold font-display text-gray-900 dark:text-white">Materiais Relacionados</h3>
                                        <p className="text-gray-500 dark:text-gray-400">Outras submissões aprovadas na categoria <span className="font-semibold text-brand-blue">{submission.category}</span></p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {relatedSubmissions.map(rel => (
                                        <RelatedMaterialCard key={rel.id} submission={rel} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </main>
                </ReadingViewManager>
            </MainLayoutWrapper>

        </ReadingExperienceProvider>
    );
}
