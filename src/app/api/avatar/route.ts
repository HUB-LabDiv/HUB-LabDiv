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

import { NextResponse } from 'next/server';

function isDisallowedHost(hostname: string): boolean {
    const lower = hostname.toLowerCase();
    if (
        lower === 'localhost' ||
        lower.endsWith('.local') ||
        lower.endsWith('.internal') ||
        lower.startsWith('127.') ||
        lower.startsWith('10.') ||
        lower.startsWith('192.168.') ||
        lower.startsWith('169.254.') ||
        lower === '0.0.0.0' ||
        lower === '::1'
    ) {
        return true;
    }
    // Check 172.16.0.0 - 172.31.255.255
    if (lower.startsWith('172.')) {
        const parts = lower.split('.');
        const second = parseInt(parts[1], 10);
        if (second >= 16 && second <= 31) return true;
    }
    return false;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const targetUrl = searchParams.get('url');

    if (!targetUrl) {
        return new NextResponse('Missing URL parameter', { status: 400 });
    }

    let parsedUrl: URL;
    try {
        parsedUrl = new URL(targetUrl);
    } catch {
        return new NextResponse('Invalid URL parameter', { status: 400 });
    }

    // SSRF Protection: Only allow secure HTTPS requests to external domains
    if (parsedUrl.protocol !== 'https:') {
        return new NextResponse('Only HTTPS URLs are allowed', { status: 400 });
    }

    if (isDisallowedHost(parsedUrl.hostname)) {
        return new NextResponse('Disallowed target host', { status: 403 });
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(parsedUrl.toString(), {
            signal: controller.signal,
            headers: {
                'User-Agent': 'HUB-LabDiv-AvatarProxy/1.0',
                'Accept': 'image/jpeg, image/png, image/webp, image/gif, image/*;q=0.8'
            }
        });
        clearTimeout(timeout);

        if (!response.ok) {
            return new NextResponse('Failed to fetch image', { status: response.status });
        }

        const rawContentType = response.headers.get('content-type') || 'image/jpeg';
        const contentType = rawContentType.toLowerCase();

        // Enforce strict image MIME types (allow image/svg+xml from trusted host api.dicebear.com, or standard raster images)
        const isDicebear = parsedUrl.hostname === 'api.dicebear.com';
        const isSvg = contentType.includes('svg');
        if (!contentType.startsWith('image/') || (isSvg && !isDicebear)) {
            return new NextResponse('Target resource is not a valid image format', { status: 415 });
        }

        const arrayBuffer = await response.arrayBuffer();
        if (arrayBuffer.byteLength > 5 * 1024 * 1024) {
            return new NextResponse('Image size exceeds 5MB limit', { status: 413 });
        }

        const buffer = Buffer.from(arrayBuffer);
        const headers = new Headers();

        headers.set('Content-Type', contentType.split(';')[0]);
        headers.set('X-Content-Type-Options', 'nosniff');
        headers.set('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

        // Se for SVG, protege contra qualquer execução de script ou XSS
        if (isSvg) {
            headers.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'");
            headers.set('Content-Disposition', 'inline; filename="avatar.svg"');
        }

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });
    } catch (error) {
        console.error('Error proxying avatar:', error);
        return new NextResponse('Error fetching avatar', { status: 500 });
    }
}
