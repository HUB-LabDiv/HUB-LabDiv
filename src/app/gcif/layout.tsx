import React from 'react';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { SwipeWrapper } from '@/components/layout/SwipeWrapper';
import { GcifSubNav } from '@/components/layout/GcifSubNav';

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

export const metadata = {
    title: 'Grande Colisor do IF (GCIF) | Hub Lab-Div',
    description: 'Wiki, Instituto e Recursos Interativos unificados para exploração simplificada.',
};

export const dynamic = 'force-dynamic';

const gcifRoutes = [
    '/gcif/wiki',
    '/gcif/instituto',
    '/gcif/interativo'
];

export default function GcifLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <SwipeWrapper routes={gcifRoutes}>
                <div data-tour="cgif-content" className="w-full py-6 px-4 max-w-7xl mx-auto flex-1">
                    <GcifSubNav />
                    {children}
                </div>
            </SwipeWrapper>
        </MainLayoutWrapper>
    );
}
