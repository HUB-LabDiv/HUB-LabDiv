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

export const formatYoutubeUrl = (url: string) => {
    if (url.includes('/embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export const getYoutubeThumbnail = (url: string) => {
    if (!url) return "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=800";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
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

export const getPdfViewerUrl = (url: string) => {
    if (!url || typeof url !== 'string') return '';
    let viewerUrl = url;

    // Remover transformações Cloudinary (ex: /upload/w_800,q_70/v123/...)
    if (viewerUrl.includes('/upload/')) {
        viewerUrl = viewerUrl.replace(/\/upload\/.*?(\/v\d+\/)/, '/upload$1');
    }

    if (viewerUrl.toLowerCase().endsWith('.jpg')) {
        viewerUrl = viewerUrl.replace(/\.jpg$/i, '.pdf');
    }
    return viewerUrl;
};

export const getPdfEmbedUrl = (url: string) => {
    const rawPdfUrl = getPdfViewerUrl(url);
    if (!rawPdfUrl) return '';
    return `${rawPdfUrl}#toolbar=0`;
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
