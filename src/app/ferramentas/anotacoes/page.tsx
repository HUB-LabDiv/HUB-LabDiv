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
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import {
    fetchUserEnrolledSubjects,
    fetchAllSubjectsCatalog
} from '@/app/actions/anotacoes';
import { AnotacoesClientView } from '@/components/ferramentas/anotacoes/AnotacoesClientView';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Central de Anotações & Cadernos | Hub Lab-Div IFUSP',
    description: 'Acesse resumos, cadernos digitalizados, listas resolvidas e notas de matérias do IFUSP e da USP sincronizadas com seu JúpiterWeb.',
};

export default async function FerramentasAnotacoesPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Buscar perfil
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Buscar matérias em curso e catálogo em paralelo
    const [enrolledData, catalogSubjects] = await Promise.all([
        fetchUserEnrolledSubjects(user.id),
        fetchAllSubjectsCatalog()
    ]);

    return (
        <AnotacoesClientView
            initialEnrolledSubjects={enrolledData.enrolledSubjects}
            hasJupiterCache={enrolledData.hasJupiterCache}
            lastSyncedAt={enrolledData.lastSyncedAt}
            catalogSubjects={catalogSubjects}
            user={user}
            profile={profile}
        />
    );
}
