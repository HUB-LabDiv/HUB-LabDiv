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

import React from 'react';
import { GcifInstitutoView } from '@/components/gcif/GcifInstitutoView';
import { fetchSubmissions } from '@/app/actions/submissions';

export const metadata = {
    title: 'Instituto, Iniciativas & Espaços | Grande Colisor do IF',
    description: 'Estrutura, história, iniciativas, espaços e influenciadores do Instituto de Física da USP.',
};

export const dynamic = 'force-dynamic';

export default async function GcifInstitutoPage() {
    const { items: mapItems } = await fetchSubmissions({
        page: 1,
        limit: 100,
        query: '',
        sort: 'recentes'
    });

    return <GcifInstitutoView mapItems={mapItems || []} />;
}
