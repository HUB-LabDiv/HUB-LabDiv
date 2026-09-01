'use client';

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

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getDraftSubmission } from '@/app/actions/submissions';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { StyledArticleView } from '@/components/reading/StyledArticleView';
import { SdocxHtmlBlock } from '@/components/reading/SdocxHtmlBlock';
import { SdocxHeroImage, SdocxInlineImage } from '@/components/reading/SdocxImageBlock';
import { ImageCarouselClient } from '@/app/arquivo/[id]/ImageCarouselClient';
import { PostQuiz } from '@/components/media/PostQuiz';
import { formatYoutubeUrl, getPdfEmbedUrl } from '@/lib/media-utils';
import { Eye, Copy, Check, Share2, Edit3, MessageCircle, AlertTriangle, ArrowLeft, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DraftPreviewPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;

        const loadDraft = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getDraftSubmission(id);
                if (res.success && res.data) {
                    setSubmission(res.data);
                } else {
                    setError(res.error || 'Rascunho não encontrado.');
                }
            } catch (err: any) {
                console.error('Erro ao carregar prévia:', err);
                setError('Falha ao carregar rascunho.');
            } finally {
                setLoading(false);
            }
        };

        loadDraft();
    }, [id]);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            toast.success('Link de pré-visualização copiado!');
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsApp = () => {
        if (typeof window === 'undefined') return;
        const title = submission?.title || 'Rascunho';
        const text = `Confira a prévia do rascunho de divulgação científica "${title}" no HUB LabDiv:\n\n${window.location.href}`;
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) {
        return (
            <MainLayoutWrapper focusMode={true}>
                <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                    <div className="size-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bukra font-bold text-gray-300 uppercase tracking-wider">
                        Carregando Prévia do Rascunho...
                    </p>
                </div>
            </MainLayoutWrapper>
        );
    }

    if (error || !submission) {
        return (
            <MainLayoutWrapper focusMode={true}>
                <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 text-center max-w-md mx-auto px-4">
                    <div className="size-16 rounded-full bg-brand-red/10 border border-brand-red/30 flex items-center justify-center text-brand-red">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bukra font-bold text-white uppercase">
                            Rascunho Indisponível
                        </h2>
                        <p className="text-sm text-gray-400 font-sans">
                            {error || 'Não foi possível encontrar o rascunho solicitado. Verifique se o link está correto ou se o autor gerou uma nova versão.'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href="/"
                            className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                        >
                            Ir para o Feed
                        </Link>
                        <Link
                            href="/enviar"
                            className="px-6 py-3 bg-brand-yellow text-gray-950 hover:bg-[#E5B800] font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                        >
                            Criar Nova Publicação
                        </Link>
                    </div>
                </div>
            </MainLayoutWrapper>
        );
    }

    // Processamento dos blocos SDOCX
    let sdocxBlocks: any[] = [];
    if (submission.media_type === 'sdocx' && submission.media_url) {
        try {
            const parsed = JSON.parse(submission.media_url);
            if (Array.isArray(parsed)) {
                sdocxBlocks = parsed;
            }
        } catch (e) {
            console.error('Erro ao analisar blocos SDOCX:', e);
        }
    }

    const heroImageBlock = sdocxBlocks.find((b) => b.type === 'image' && b.content?.url);
    const inlineBlocks = sdocxBlocks.filter((b) => b !== heroImageBlock);

    return (
        <MainLayoutWrapper focusMode={true}>
            <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-fade-in">
                {/* ============================================================== */}
                {/* 1. TOP FLOATING PREVIEW BANNER                                 */}
                {/* ============================================================== */}
                <div className="sticky top-20 z-50 w-full bg-[#1A1A1A]/95 backdrop-blur-xl border-2 border-brand-yellow/50 rounded-2xl p-4 sm:p-5 shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-brand-yellow/20 border border-brand-yellow/40 flex items-center justify-center text-brand-yellow shrink-0 animate-pulse">
                            <Eye className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest bg-brand-yellow text-gray-950 px-2 py-0.5 rounded-full font-bukra">
                                    Modo Pré-Visualização
                                </span>
                                <span className="text-xs text-gray-400 font-mono hidden sm:inline">
                                    • Rascunho não publicado
                                </span>
                            </div>
                            <p className="text-xs text-gray-300 font-sans mt-0.5">
                                Você está visualizando o post exatamente como os leitores o verão.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto shrink-0 flex-wrap">
                        <button
                            onClick={handleCopyLink}
                            className={`flex-1 md:flex-none px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 ${
                                copied
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                            }`}
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copied ? 'Copiado' : 'Copiar Link'}</span>
                        </button>

                        <button
                            onClick={handleWhatsApp}
                            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 transition-all flex items-center justify-center gap-1.5"
                            title="Compartilhar no WhatsApp"
                        >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">WhatsApp</span>
                        </button>

                        <Link
                            href={`/enviar?editId=${id}`}
                            className="flex-1 md:flex-none px-4 py-2 rounded-xl text-xs font-bukra font-bold uppercase bg-brand-yellow text-gray-950 hover:bg-[#E5B800] transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Abrir no Diagramador</span>
                        </Link>
                    </div>
                </div>

                {/* ============================================================== */}
                {/* 2. ARTIGO PRINCIPAL                                            */}
                {/* ============================================================== */}
                <article className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                    {/* Header do Post */}
                    <div className="space-y-4 border-b border-white/10 pb-8">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-3 py-1 bg-brand-blue/20 text-brand-blue-accent border border-brand-blue/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                                {submission.category || 'Geral'}
                            </span>
                            <span className="px-3 py-1 bg-white/5 text-gray-300 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                                {submission.institute?.toUpperCase() || 'IFUSP'}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                Editado em {new Date(submission.updated_at || submission.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bukra font-black text-white leading-tight tracking-tight">
                            {submission.title || 'Sem título'}
                        </h1>

                        <div className="flex items-center gap-3 pt-2">
                            <div className="size-10 rounded-full bg-brand-yellow/20 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow font-bukra font-black text-sm uppercase">
                                {(submission.authors || 'A').charAt(0)}
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white block">
                                    {submission.authors || 'Autor(a)'}
                                </span>
                                <span className="text-xs text-gray-400 font-sans">
                                    Rascunho em Desenvolvimento
                                </span>
                            </div>
                        </div>

                        {submission.description && (
                            <p className="text-base sm:text-lg text-gray-300 leading-relaxed font-sans pt-2 italic border-l-4 border-brand-yellow/60 pl-4 bg-white/5 py-3 rounded-r-2xl">
                                {submission.description}
                            </p>
                        )}
                    </div>

                    {/* Imagem de Destaque / Hero (se houver) */}
                    {heroImageBlock && (
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                            <SdocxHeroImage
                                src={heroImageBlock.content.url}
                                alt={heroImageBlock.content.caption || 'Hero Image'}
                            />
                        </div>
                    )}

                    {/* Renderização dos Blocos Secundários */}
                    {inlineBlocks.length > 0 ? (
                        <div className="space-y-8 pt-4">
                            {inlineBlocks.map((block, index) => {
                                switch (block.type) {
                                    case 'text':
                                        return (
                                            <div key={block.id || index} className="prose dark:prose-invert max-w-none">
                                                <StyledArticleView content={block.content?.text || ''} />
                                            </div>
                                        );
                                    case 'image':
                                        return (
                                            <div key={block.id || index} className="rounded-2xl overflow-hidden border border-white/10">
                                                <SdocxInlineImage
                                                    src={block.content?.url}
                                                    altText={block.content?.caption}
                                                />
                                            </div>
                                        );
                                    case 'carousel':
                                        return (
                                            <figure key={block.id || index} className="w-full flex flex-col gap-2">
                                                <div className="rounded-2xl overflow-hidden border border-white/10">
                                                    <ImageCarouselClient
                                                        urls={block.content?.urls || []}
                                                        title={submission.title || 'Carrossel'}
                                                    />
                                                </div>
                                                {block.content?.caption && (
                                                    <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                                        {block.content.caption}
                                                    </figcaption>
                                                )}
                                                {block.content?.altText && (
                                                    <span className="sr-only">{block.content.altText}</span>
                                                )}
                                            </figure>
                                        );
                                    case 'video':
                                        return (
                                            <figure key={block.id || index} className="w-full flex flex-col gap-2">
                                                <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                                                    <iframe
                                                        src={formatYoutubeUrl(block.content?.url)}
                                                        className="w-full h-full"
                                                        allowFullScreen
                                                    />
                                                </div>
                                                {block.content?.caption && (
                                                    <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                                        {block.content.caption}
                                                    </figcaption>
                                                )}
                                                {block.content?.altText && (
                                                    <span className="sr-only">{block.content.altText}</span>
                                                )}
                                            </figure>
                                        );
                                    case 'audio':
                                        return (
                                            <figure key={block.id || index} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-2">
                                                <span className="text-xs font-bold text-brand-red uppercase tracking-wider">Áudio de Apoio</span>
                                                <audio controls src={block.content?.url} className="w-full" />
                                                {block.content?.caption && (
                                                    <figcaption className="text-xs text-gray-400 italic mt-1 font-sans">
                                                        {block.content.caption}
                                                    </figcaption>
                                                )}
                                                {block.content?.altText && (
                                                    <span className="sr-only">{block.content.altText}</span>
                                                )}
                                            </figure>
                                        );
                                    case 'pdf':
                                        return (
                                            <figure key={block.id || index} className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col gap-3">
                                                <span className="text-xs font-bold text-brand-yellow uppercase tracking-wider">Documento PDF Anexo</span>
                                                <iframe src={getPdfEmbedUrl(block.content?.url)} className="w-full h-96 rounded-xl" />
                                                {block.content?.caption && (
                                                    <figcaption className="text-xs text-gray-400 italic mt-1 font-sans">
                                                        {block.content.caption}
                                                    </figcaption>
                                                )}
                                                {block.content?.altText && (
                                                    <span className="sr-only">{block.content.altText}</span>
                                                )}
                                            </figure>
                                        );
                                    case '3d_object': {
                                        const modelUrl = block.content?.url || '';
                                        const caption = block.content?.caption || '';
                                        const altText = block.content?.altText || '';
                                        return (
                                            <figure key={block.id || index} className="w-full my-6 flex flex-col items-center gap-2">
                                                <div className="w-full h-[450px] bg-background-dark/40 rounded-2xl overflow-hidden border border-white/10 shadow-xl flex items-center justify-center relative">
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
                                                    <figcaption className="text-xs text-gray-400 text-center italic mt-1 font-sans">
                                                        {caption}
                                                    </figcaption>
                                                )}
                                                {altText && (
                                                    <span className="sr-only">{altText}</span>
                                                )}
                                            </figure>
                                        );
                                    }
                                    case 'quiz':
                                        return (
                                            <div key={block.id || index}>
                                                <PostQuiz quiz={[block.content]} submissionId={id} />
                                            </div>
                                        );
                                    case 'reflection':
                                        return (
                                            <div key={block.id || index} className="p-5 bg-brand-yellow/10 border-l-4 border-brand-yellow rounded-r-2xl space-y-2">
                                                <span className="text-xs font-black uppercase tracking-wider text-brand-yellow font-bukra block">
                                                    💡 Reflexão Provocativa
                                                </span>
                                                <p className="text-sm text-gray-200 font-sans">
                                                    {block.content?.question}
                                                </p>
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            })}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 font-sans text-sm italic">
                            Nenhum bloco de texto ou mídia adicional foi inserido neste rascunho ainda.
                        </div>
                    )}
                </article>

                {/* ============================================================== */}
                {/* 3. CARD DE FEEDBACK / PARECER PARA O REVISOR                   */}
                {/* ============================================================== */}
                <div className="bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
                    <div className="space-y-1">
                        <h4 className="text-lg font-bukra font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-yellow" />
                            Gostou deste rascunho?
                        </h4>
                        <p className="text-xs text-gray-400 font-sans max-w-xl">
                            Envie suas considerações, correções ou sugestões diretamente ao autor para ajudar a lapidar este material antes do lançamento oficial.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={handleWhatsApp}
                            className="w-full md:w-auto px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-gray-950 font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span>Mandar Parecer</span>
                        </button>
                    </div>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
