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

export const dynamic = 'force-dynamic';

export async function GET() {
    const rawFingerprints = (process.env.ANDROID_ASSETLINKS_SHA256 || '').trim();
    const fingerprints = rawFingerprints
        .split(',')
        .map((fp) => fp.trim())
        .filter((fp) => fp.length > 0);

    if (fingerprints.length === 0) {
        return NextResponse.json([], {
            status: 200,
            headers: {
                'Cache-Control': 'public, max-age=3600',
            },
        });
    }

    const statements = [
        {
            relation: ['delegate_permission/common.handle_all_urls'],
            target: {
                namespace: 'android_app',
                package_name: 'br.usp.ifusp.hublabdiv',
                sha256_cert_fingerprints: fingerprints,
            },
        },
    ];

    return NextResponse.json(statements, {
        status: 200,
        headers: {
            'Cache-Control': 'public, max-age=3600',
        },
    });
}
