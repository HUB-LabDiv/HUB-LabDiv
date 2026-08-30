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

import { MapClient } from '@/components/mapa/MapClient';
import { fetchSubmissions } from '@/app/actions/submissions';

export const metadata = {
    title: 'Mapa Interativo | Ferramentas Acadêmicas',
    description: 'Navegue pelo campus interativo do IFUSP.',
};

export const dynamic = 'force-dynamic';

export default async function FerramentasMapaPage() {
    const { items: mapItems } = await fetchSubmissions({
        page: 1,
        limit: 100,
        query: '',
        sort: 'recentes'
    });

    return (
        <div className="py-6 px-4 max-w-7xl mx-auto">
            <div className="bg-white/5 rounded-[40px] border border-white/5 overflow-hidden h-[80vh] relative">
                <MapClient initialItems={mapItems || []} />
            </div>
        </div>
    );
}
