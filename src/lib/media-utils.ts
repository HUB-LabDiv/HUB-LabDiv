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

export const parseMediaUrl = (mediaUrl: string | string[]): string[] => {
    let parsedUrls: string[] = [];
    try {
        if (Array.isArray(mediaUrl)) {
            parsedUrls = mediaUrl.filter(item => typeof item === 'string');
        } else if (typeof mediaUrl === 'string') {
            if (mediaUrl.startsWith('[') && mediaUrl.endsWith(']')) {
                const parsed = JSON.parse(mediaUrl);
                if (Array.isArray(parsed)) {
                    parsedUrls = parsed.reduce((acc: string[], item: any) => {
                        if (typeof item === 'string') {
                            acc.push(item);
                        } else if (item && typeof item === 'object' && (item.type === 'image' || item.type === 'video') && item.content?.url) {
                            acc.push(item.content.url);
                        }
                        return acc;
                    }, []);
                } else {
                    parsedUrls = [mediaUrl];
                }
            } else {
                parsedUrls = [mediaUrl];
            }
        }
    } catch {
        parsedUrls = [typeof mediaUrl === 'string' ? mediaUrl : ''];
    }
    return parsedUrls.filter(Boolean);
};

export const formatYoutubeUrl = (url?: string | null) => {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    if (url.includes('/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2]?.length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export const getYoutubeThumbnail = (url?: string | null) => {
    if (!url || typeof url !== 'string' || !url.trim()) return "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2]?.length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800";
};

export const getDownloadUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        // Force the delivery domain (res.cloudinary.com) instead of the API domain
        let deliveryUrl = url.replace('api.cloudinary.com', 'res.cloudinary.com');

        // Cloudinary URLs typically have a version tag like /v1234567890/
        const versionMatch = deliveryUrl.match(/\/v\d+\//);
        if (versionMatch) {
            const parts = deliveryUrl.split(versionMatch[0]);
            const uploadIndex = parts[0].indexOf('/upload/') + 8;
            const base = parts[0].substring(0, uploadIndex);

            // Rebuild with ONLY fl_attachment transformation before the version
            return `${base}fl_attachment${versionMatch[0]}${parts[1]}`;
        } else {
            // Fallback: simply inject fl_attachment and strip other common transforms
            return deliveryUrl.replace('/upload/', '/upload/fl_attachment/')
                .replace(/f_[a-zA-Z0-9_]+,?/g, '')
                .replace(/q_[a-zA-Z0-9_]+,?/g, '')
                .replace(/\/upload\/,/, '/upload/'); // Clean up trailing comma
        }
    }
    return url;
};

export const getPdfViewerUrl = (url?: string | null) => {
    if (!url || typeof url !== 'string' || !url.trim()) return '';
    let viewerUrl = url.trim();

    // Remover transformações Cloudinary (ex: /upload/w_800,q_70/v123/...)
    if (viewerUrl.includes('/upload/')) {
        viewerUrl = viewerUrl.replace(/\/upload\/.*?(\/v\d+\/)/, '/upload$1');
    }

    if (viewerUrl.toLowerCase().endsWith('.jpg')) {
        viewerUrl = viewerUrl.replace(/\.jpg$/i, '.pdf');
    }
    return viewerUrl;
};

export const getPdfEmbedUrl = (url?: string | null) => {
    const rawPdfUrl = getPdfViewerUrl(url);
    if (!rawPdfUrl) return '';

    // 1. Se for blob local, o iframe do navegador renderiza nativamente
    if (rawPdfUrl.startsWith('blob:') || rawPdfUrl.startsWith('data:')) {
        return `${rawPdfUrl}#toolbar=0`;
    }

    // 2. Se for link do Google Drive
    if (rawPdfUrl.includes('drive.google.com')) {
        return rawPdfUrl.replace(/\/view(\?.*)?$/, '/preview');
    }

    // 3. Se for URL remota (Cloudinary, Supabase, etc.):
    // Usamos o Google Docs Viewer para contornar bloqueios de CORS / Content-Disposition nos iframes
    return `https://docs.google.com/viewer?url=${encodeURIComponent(rawPdfUrl)}&embedded=true`;
};
export const getOptimizedUrl = (url: string, width = 800, quality = 70, category?: string, type?: string) => {
    if (!url || typeof url !== 'string') return '';

    // Regra Sênior: Documentos, Textos e Scans (mesmo JPG) exigem q=85 para legibilidade
    let finalQuality = quality;
    const isDoc = category?.toLowerCase().includes('documento') ||
        category?.toLowerCase().includes('texto') ||
        category?.toLowerCase().includes('arquivo') ||
        category?.toLowerCase().includes('biblioteca') ||
        type === 'pdf' ||
        type === 'text' ||
        url.toLowerCase().endsWith('.pdf');

    if (isDoc) {
        finalQuality = 85;
    }

    // Cloudinary Optimization
    if (url.includes('cloudinary.com') && url.includes('/upload/')) {
        // Regra Master de Performance: SEMPRE forçar a leitura do CDN via res.cloudinary.com
        // Retirar requisições sobreétricas originadas da API.
        let cdnUrl = url.replace('api.cloudinary.com', 'res.cloudinary.com');

        // Regra Sênior: Se já existem transformações (w_, q_, f_), não aplicar novamente para evitar bugs de LCP/Otimização
        if (cdnUrl.includes('/upload/w_') || cdnUrl.includes('/upload/q_') || cdnUrl.includes('/upload/f_')) {
            return cdnUrl;
        }
        return cdnUrl.replace('/upload/', `/upload/w_${width},q_${finalQuality},f_auto/`);
    }

    // Supabase Storage - Default to no transformation to avoid 400s unless using render endpoint
    if (url.includes('/storage/v1/object/public/')) {
        return url;
    }

    return url;
};

/**
 * Detecta todos os formatos de mídia presentes em uma publicação,
 * analisando media_type, URLs, blocos de SDOCX (imagens, vídeos, pdfs, html),
 * links incorporados e texto descritivo.
 */
export function getPostMediaFormats(post: {
    media_type?: string;
    mediaType?: string;
    media_url?: any;
    mediaUrl?: any;
    description?: string;
}): Set<string> {
    const formats = new Set<string>();
    const rawType = (post.media_type || post.mediaType || '').toLowerCase().trim();
    if (rawType) {
        formats.add(rawType);
    }

    const rawMedia = post.media_url ?? post.mediaUrl;
    const desc = (post.description || '').toLowerCase();

    // Verificação na descrição (links do YouTube, markdown images, etc.)
    if (desc.includes('youtube.com') || desc.includes('youtu.be') || desc.includes('vimeo.com') || desc.includes('.mp4')) {
        formats.add('video');
    }
    if (desc.includes('![') || desc.includes('.jpg') || desc.includes('.png') || desc.includes('.webp')) {
        formats.add('image');
    }
    if (desc.trim().length > 15) {
        formats.add('text');
    }

    const checkUrl = (url: string) => {
        if (!url || typeof url !== 'string') return;
        const low = url.toLowerCase();
        if (
            low.includes('youtube.com') ||
            low.includes('youtu.be') ||
            low.includes('vimeo.com') ||
            low.includes('tiktok.com') ||
            low.endsWith('.mp4') ||
            low.endsWith('.webm') ||
            low.endsWith('.mov')
        ) {
            formats.add('video');
        }
        if (
            low.endsWith('.jpg') ||
            low.endsWith('.jpeg') ||
            low.endsWith('.png') ||
            low.endsWith('.webp') ||
            low.endsWith('.gif') ||
            low.endsWith('.svg') ||
            low.includes('cloudinary.com') ||
            low.includes('unsplash.com')
        ) {
            formats.add('image');
        }
        if (low.endsWith('.pdf') || low.includes('/pdf/')) {
            formats.add('pdf');
        }
        if (low.endsWith('.zip') || low.endsWith('.rar')) {
            formats.add('zip');
            formats.add('other');
        }
    };

    const inspectBlock = (block: any) => {
        if (!block || typeof block !== 'object') return;
        const type = (block.type || '').toLowerCase();
        if (type === 'image') {
            formats.add('image');
            if (block.content?.url) checkUrl(block.content.url);
            if (block.content?.src) checkUrl(block.content.src);
        } else if (type === 'video') {
            formats.add('video');
            if (block.content?.url) checkUrl(block.content.url);
            if (block.content?.src) checkUrl(block.content.src);
        } else if (type === 'carousel') {
            formats.add('image');
            if (Array.isArray(block.content?.items)) {
                block.content.items.forEach((it: any) => {
                    if (it?.url) checkUrl(it.url);
                    if (it?.src) checkUrl(it.src);
                    if (it?.type === 'video') formats.add('video');
                });
            }
        } else if (type === 'pdf') {
            formats.add('pdf');
            if (block.content?.url) checkUrl(block.content.url);
            if (block.content?.src) checkUrl(block.content.src);
        } else if (type === 'html' || type === 'text' || type === 'heading' || type === 'quote' || type === 'callout' || type === 'latex') {
            formats.add('text');
            formats.add('sdocx');
            const htmlStr = typeof block.content === 'string' ? block.content : (block.content?.html || '');
            if (htmlStr) {
                if (htmlStr.includes('<iframe') || htmlStr.includes('youtube.com') || htmlStr.includes('youtu.be') || htmlStr.includes('<video')) {
                    formats.add('video');
                }
                if (htmlStr.includes('<img') || htmlStr.includes('.jpg') || htmlStr.includes('.png') || htmlStr.includes('.webp')) {
                    formats.add('image');
                }
            }
        } else if (type === 'sdocx') {
            formats.add('sdocx');
            formats.add('text');
        }
    };

    if (rawMedia) {
        if (Array.isArray(rawMedia)) {
            rawMedia.forEach(item => {
                if (typeof item === 'string') {
                    checkUrl(item);
                } else if (item && typeof item === 'object') {
                    inspectBlock(item);
                }
            });
        } else if (typeof rawMedia === 'string') {
            const trimmed = rawMedia.trim();
            if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
                try {
                    const parsed = JSON.parse(trimmed);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(item => {
                            if (typeof item === 'string') {
                                checkUrl(item);
                            } else if (item && typeof item === 'object') {
                                inspectBlock(item);
                            }
                        });
                    } else if (parsed && typeof parsed === 'object') {
                        inspectBlock(parsed);
                    }
                } catch {
                    checkUrl(trimmed);
                }
            } else {
                checkUrl(trimmed);
            }
        }
    }

    // Se é do tipo sdocx, é também um documento com texto
    if (rawType === 'sdocx') {
        formats.add('sdocx');
        formats.add('text');
    }

    return formats;
}

/**
 * Retorna se um post contém PELO MENOS UM dos formatos selecionados.
 */
export function postMatchesMediaTypes(
    post: { media_type?: string; mediaType?: string; media_url?: any; mediaUrl?: any; description?: string },
    selectedMediaTypes: string[]
): boolean {
    if (!selectedMediaTypes || selectedMediaTypes.length === 0) return true;
    const formats = getPostMediaFormats(post);
    return selectedMediaTypes.some(type => formats.has(type.toLowerCase()));
}

/**
 * Extrai a melhor URL de miniatura disponível para uma submissão
 * suportando blocos SDOCX, vídeos do YouTube, PDFs, imagens e carrosséis.
 */
export function extractSubmissionThumbnail(item: {
    media_type?: string | null;
    media_url?: string | string[] | null;
    thumbnail_url?: string | null;
}): string | null {
    if (!item) return null;

    if (item.thumbnail_url && typeof item.thumbnail_url === 'string' && item.thumbnail_url.trim().startsWith('http')) {
        return item.thumbnail_url.trim();
    }

    if (item.media_type === 'video') {
        const raw = Array.isArray(item.media_url) ? item.media_url[0] : item.media_url;
        if (typeof raw === 'string' && raw.trim()) {
            return getYoutubeThumbnail(raw.trim());
        }
    }

    if (!item.media_url) return null;

    // SDOCX JSON block parsing
    if (typeof item.media_url === 'string' && item.media_url.trim().startsWith('[')) {
        try {
            const blocks = JSON.parse(item.media_url);
            if (Array.isArray(blocks)) {
                for (const b of blocks) {
                    if (typeof b === 'string' && b.startsWith('http')) return b;
                    if (b && typeof b === 'object') {
                        if (b.type === 'image' && b.content?.url && typeof b.content.url === 'string') {
                            return b.content.url;
                        }
                        if (b.type === 'carousel' && Array.isArray(b.content?.images) && b.content.images[0]?.url) {
                            return b.content.images[0].url;
                        }
                        if (b.type === 'video' && b.content?.url && typeof b.content.url === 'string') {
                            return getYoutubeThumbnail(b.content.url);
                        }
                        if (b.type === 'pdf' && b.content?.url && typeof b.content.url === 'string') {
                            return b.content.url.replace(/\.pdf$/i, '.jpg');
                        }
                    }
                }
            }
        } catch {
            // Silently ignore JSON parse errors
        }
    }

    const urls = parseMediaUrl(item.media_url);
    if (urls.length > 0 && typeof urls[0] === 'string' && urls[0].trim().startsWith('http')) {
        let url = urls[0].trim();
        if (item.media_type === 'pdf' && url.toLowerCase().endsWith('.pdf')) {
            return url.replace(/\.pdf$/i, '.jpg');
        }
        return url;
    }

    return null;
}

