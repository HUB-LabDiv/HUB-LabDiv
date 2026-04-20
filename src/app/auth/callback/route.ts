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

import { createServerSupabase } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';

    // Improved Origin Detection for Local/Prod
    const getPublicOrigin = () => {
        const host = request.headers.get('host');
        const xForwardedHost = request.headers.get('x-forwarded-host');
        const xForwardedProto = request.headers.get('x-forwarded-proto') || 'https';

        console.log(`[Auth Callback] Detection - Host: ${host}, ForwardedHost: ${xForwardedHost}, Proto: ${xForwardedProto}`);

        // 1. Prioritize localhost for local development
        if (host?.includes('localhost')) {
            return `http://${host}`;
        }

        // 2. Use forwarded headers for production (SSL offloading)
        if (xForwardedHost && !xForwardedHost.includes('localhost')) {
            return `${xForwardedProto}://${xForwardedHost}`;
        }

        // 3. Fallback to request origin
        return request.nextUrl.origin;
    };

    const publicOrigin = getPublicOrigin();

    if (code) {
        const supabase = await createServerSupabase();
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
                return NextResponse.redirect(conflictUrl.toString());
            }

            const profileUpdate: any = { is_usp_member: isUspDomain };
            if (categoryHint) {
                profileUpdate.user_category = categoryHint;
            }

            await supabase
                .from('profiles')
                .update(profileUpdate)
                .eq('id', session.user.id);

            if (process.env.NODE_ENV === 'development') {
                console.log(`Auth Success: Redirecting to ${next} via ${publicOrigin}`);
            }
            const redirectUrl = new URL(next, publicOrigin);
            return NextResponse.redirect(redirectUrl.toString());
        }
        if (process.env.NODE_ENV === 'development') {
            console.error('Auth callback: Code exchange failed or no session', error);
        }
    }

    const errorUrl = new URL('/login', publicOrigin);
    errorUrl.searchParams.set('error', 'auth-code-error');
    return NextResponse.redirect(errorUrl.toString());
}
