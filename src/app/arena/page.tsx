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

import { createServerSupabase } from '@/lib/supabase/server';
import ArenaClient from './ArenaClient';
import { redirect } from 'next/navigation';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export default async function ArenaPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile || (profile.user_category !== 'pesquisador' && profile.user_category !== 'docente_pesquisador')) {
        // Only researchers have access to the Arena
        redirect('/lab');
    }

    return (
        <MainLayoutWrapper userId={user.id}>
            <div data-tour="arena-content" className="w-full space-y-8">
                <header className="px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight dark:text-white">
                        Observatório de Pesquisa
                    </h1>
                </header>
                <ArenaClient profile={profile} />
            </div>
        </MainLayoutWrapper>
    );
}
