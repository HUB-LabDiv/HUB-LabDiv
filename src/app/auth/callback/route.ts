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

import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/lab';

    // Improved Origin Detection for Local/Prod
    const getPublicOrigin = () => {
        const host = request.headers.get('host');
        const xForwardedHost = request.headers.get('x-forwarded-host');
        const xForwardedProto = request.headers.get('x-forwarded-proto') || 'https';

        // 1. Prioritize localhost for local development
        if (host?.includes('localhost')) {
            return `http://${host}`;
        }

        // 2. Use forwarded headers for production (SSL offloading)
        if (xForwardedHost && !xForwardedHost.includes('localhost')) {
            const cleanHost = xForwardedHost.split(',')[0].trim();
            return `${xForwardedProto}://${cleanHost}`;
        }

        // 3. Fallback to request origin
        return request.nextUrl.origin;
    };

    const publicOrigin = getPublicOrigin();

    // Sanitize redirect target against Open Redirects
    const sanitizeRedirectPath = (url: string | null): string => {
        if (!url || url === '/') return '/lab';
        if (!url.startsWith('/') || url.startsWith('//') || url.startsWith('/\\')) {
            return '/lab';
        }
        if (url === '/login' || url.startsWith('/login?') || url.startsWith('/login/')) {
            return '/lab';
        }
        return url;
    };

    if (code) {
        const safeTarget = sanitizeRedirectPath(next);
        const redirectUrl = new URL(safeTarget, publicOrigin);
        const response = NextResponse.redirect(redirectUrl.toString());

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && session) {
            const track = searchParams.get('track');
            const categoryHint = searchParams.get('category');
            const email = session.user.email || '';
            const isUspDomain = email.endsWith('@usp.br') || email.endsWith('@alumni.usp.br') || email.endsWith('@if.usp.br');

            if (track === 'usp' && !isUspDomain) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn(`Auth Conflict: Non-USP email attempted USP login: ${email}`);
                }
                const conflictUrl = new URL('/login', publicOrigin);
                conflictUrl.searchParams.set('conflict', 'true');
                conflictUrl.searchParams.set('email', email);
                conflictUrl.searchParams.set('next', next);
                const conflictResponse = NextResponse.redirect(conflictUrl.toString());
                response.cookies.getAll().forEach(c => conflictResponse.cookies.set(c.name, c.value));
                return conflictResponse;
            }

            const profileUpdate: any = { is_usp_member: isUspDomain };
            if (categoryHint) {
                profileUpdate.user_category = categoryHint;
            }

            await supabase
                .from('profiles')
                .update(profileUpdate)
                .eq('id', session.user.id);

            return response;
        }

        if (process.env.NODE_ENV === 'development') {
            console.error('Auth callback: Code exchange failed or no session', error);
        }
    }

    const errorUrl = new URL('/login', publicOrigin);
    errorUrl.searchParams.set('error', 'auth-code-error');
    return NextResponse.redirect(errorUrl.toString());
}
