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

import { fetchSubmissions } from "@/app/actions/submissions";
import { LabdivClient } from "./LabdivClient";

export const metadata = {
    title: 'Lab-Div | Iniciativas IFUSP',
    description: 'Laboratório de Divulgação Científica do IFUSP.',
};

export default async function LabdivPage() {
    const res = await fetchSubmissions({
        page: 1,
        limit: 15,
        query: '',
        categories: ['Lab-Div'],
        sort: 'recentes'
    });

    return <LabdivClient posts={res.items.map(item => item.post)} />;
}
