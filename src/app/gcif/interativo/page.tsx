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
import { GcifInterativoView } from '@/components/gcif/GcifInterativoView';
import { supabase } from '@/lib/supabase';

export const metadata = {
    title: 'Interativo & Oportunidades | Grande Colisor do IF',
    description: 'Oportunidades de IC, quiz de física, SAC de suporte e constelações linguísticas.',
};

export const dynamic = 'force-dynamic';

export default async function GcifInterativoPage() {
    // Fetch Oportunidades
    const { data: oportunidades } = await supabase
        .from('oportunidades')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);

    // Fetch Glossary
    const { getGlossary } = await import('@/app/enviar/actions/glossaryActions');
    const { data: palavras_geradoras } = await getGlossary();

    return (
        <GcifInterativoView
            oportunidades={oportunidades || []}
            glossario={palavras_geradoras || []}
        />
    );
}
