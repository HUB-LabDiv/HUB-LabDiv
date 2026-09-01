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

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

function PreviewRedirectContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get('id');

    useEffect(() => {
        if (id) {
            router.replace(`/preview/${id}`);
        } else {
            router.replace('/enviar');
        }
    }, [id, router]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
            <div className="size-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bukra font-bold text-gray-300 uppercase tracking-wider">
                Carregando Prévia...
            </p>
        </div>
    );
}

export default function PreviewIndexPage() {
    return (
        <MainLayoutWrapper focusMode={true}>
            <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><div className="size-12 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin" /></div>}>
                <PreviewRedirectContent />
            </Suspense>
        </MainLayoutWrapper>
    );
}
