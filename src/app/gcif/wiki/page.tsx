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
import { GcifWikiView } from '@/components/gcif/GcifWikiView';

export const metadata = {
    title: 'Wiki do IFUSP | Grande Colisor do IF',
    description: 'O Síncrotron de Conhecimento do IFUSP. Repositório para sobrevivência, ética e divulgação científica.',
};

export const dynamic = 'force-dynamic';

export default function GcifWikiPage() {
    return <GcifWikiView />;
}
