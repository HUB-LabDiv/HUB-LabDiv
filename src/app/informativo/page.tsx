/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { GcifWikiView } from '@/components/gcif/GcifWikiView';

export const metadata = {
    title: 'Informativo (Wiki & Instituto) | Hub LabDiv',
    description: 'Central de conhecimento, espaços, iniciativas e ferramentas interativas do IFUSP.',
};

export default function InformativoRootPage() {
    return <GcifWikiView />;
}

