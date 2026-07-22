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

import { Suspense } from 'react';
import InteracaoClient from './InteracaoClient';

export const metadata = {
    title: 'Interação | IFUSP Ciência',
    description: 'Hub central de interação, laboratório pessoal e emaranhamento científico.',
};

export default function InteracaoPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background-dark" />}>
            <InteracaoClient />
        </Suspense>
    );
}
