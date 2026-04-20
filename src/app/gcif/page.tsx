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

import React from 'react';
import { ExplorarClient } from '@/components/explorar/ExplorarClient';
import { fetchSubmissions } from '@/app/actions/submissions';
import { supabase } from '@/lib/supabase';

export const metadata = {
    title: 'O Grande Colisor do IF | Hub Lab-Div',
    description: 'Wiki, Mapa e Grande Colisor unificados para exploração simplificada.',
};

export const dynamic = 'force-dynamic';

export default async function ExplorarPage() {
    // Fetch Mapa Data
    const { items: mapItems } = await fetchSubmissions({
        page: 1,
        limit: 100,
        query: '',
        sort: 'recentes'
    });

    // Fetch Colisor Data
    const { data: oportunidades } = await supabase
        .from('oportunidades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

    return <ExplorarClient mapItems={mapItems || []} oportunidades={oportunidades || []} />;
}
