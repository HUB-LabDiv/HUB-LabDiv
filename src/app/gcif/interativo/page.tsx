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
import { createServerSupabase } from '@/lib/supabase/server';

export const metadata = {
    title: 'Interativo & Oportunidades | Grande Colisor do IF',
    description: 'Oportunidades de IC, quiz de física, SAC de suporte e constelações linguísticas.',
};

export const dynamic = 'force-dynamic';

export default async function GcifInterativoPage() {
    // 1. Fetch Oportunidades
    const { data: oportunidades } = await supabase
        .from('oportunidades')
        .select('*')
        .or('status.eq.approved,status.is.null')
        .order('created_at', { ascending: false })
        .limit(30);

    // 2. Fetch Glossary
    const { getGlossary } = await import('@/app/enviar/actions/glossaryActions');
    const { data: palavras_geradoras } = await getGlossary();

    // 3. Detectar Persona do Perfil do Usuário
    let detectedPersona: 'curioso' | 'aluno' | 'professor' = 'curioso';
    try {
        const serverSupabase = await createServerSupabase();
        const { data: { user } } = await serverSupabase.auth.getUser();
        if (user) {
            const { data: profile } = await serverSupabase
                .from('profiles')
                .select('persona, user_category')
                .eq('id', user.id)
                .single();

            if (profile) {
                if (profile.persona) {
                    detectedPersona = profile.persona as any;
                } else if (profile.user_category) {
                    const cat = String(profile.user_category).toLowerCase();
                    if (cat.includes('docente') || cat.includes('professor') || cat.includes('pesquisador')) {
                        detectedPersona = 'professor';
                    } else if (cat.includes('aluno') || cat.includes('pos_graduacao') || cat.includes('graduacao')) {
                        detectedPersona = 'aluno';
                    }
                }
            }
        }
    } catch {
        // Fallback silencioso para curioso se deslogado
    }

    return (
        <GcifInterativoView
            oportunidades={oportunidades || []}
            glossario={palavras_geradoras || []}
            initialPersona={detectedPersona}
        />
    );
}
