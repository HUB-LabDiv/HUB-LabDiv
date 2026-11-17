/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { GcifInstitutoView } from '@/components/gcif/GcifInstitutoView';
import { getInstitutoMapSubmissions } from '@/app/actions/submissions';

export const metadata = {
    title: 'Instituto, Iniciativas & Espaços | Informativo HUB LabDiv',
    description: 'Estrutura, história, iniciativas, espaços e influenciadores do Instituto de Física da USP.',
};

export default async function InformativoInstitutoPage() {
    const mapItems = await getInstitutoMapSubmissions(60);
    return <GcifInstitutoView mapItems={mapItems} />;
}

