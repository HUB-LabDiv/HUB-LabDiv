/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { unstable_cache } from 'next/cache';
import { GcifInterativoView } from '@/components/gcif/GcifInterativoView';
import { supabase } from '@/lib/supabase';
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata = {
    title: 'Interativo & Oportunidades | Informativo HUB LabDiv',
    description: 'Oportunidades de IC, quiz de física, SAC de suporte e constelações linguísticas.',
};

const getCachedInterativoPublicData = unstable_cache(
    async () => {
        const { getGlossary } = await import('@/app/enviar/actions/glossaryActions');
        const [{ data: oportunidades }, { data: palavras_geradoras }] = await Promise.all([
            supabase
                .from('oportunidades')
                .select('*')
                .or('status.eq.approved,status.is.null')
                .order('created_at', { ascending: false })
                .limit(30),
            getGlossary(),
        ]);
        return {
            oportunidades: oportunidades || [],
            palavras_geradoras: palavras_geradoras || [],
        };
    },
    ['informativo-interativo-public'],
    { revalidate: 60 }
);

export default async function InformativoInterativoPage() {
    const [publicData, detectedPersona] = await Promise.all([
        getCachedInterativoPublicData(),
        (async (): Promise<'curioso' | 'aluno' | 'professor'> => {
            try {
                const serverSupabase = await createServerSupabase();
                const { data: { user } } = await serverSupabase.auth.getUser();
                if (!user) return 'curioso';
                const { data: profile } = await serverSupabase
                    .from('profiles')
                    .select('persona, user_category')
                    .eq('id', user.id)
                    .single();
                if (profile?.persona) return profile.persona as 'curioso' | 'aluno' | 'professor';
                const cat = String(profile?.user_category || '').toLowerCase();
                if (cat.includes('docente') || cat.includes('professor') || cat.includes('pesquisador')) {
                    return 'professor';
                }
                if (cat.includes('aluno') || cat.includes('pos_graduacao') || cat.includes('graduacao')) {
                    return 'aluno';
                }
            } catch {}
            return 'curioso';
        })(),
    ]);

    return (
        <GcifInterativoView
            oportunidades={publicData.oportunidades}
            glossario={publicData.palavras_geradoras}
            initialPersona={detectedPersona}
        />
    );
}
