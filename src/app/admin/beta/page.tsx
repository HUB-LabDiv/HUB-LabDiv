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
import { redirect } from 'next/navigation';
import { BetaAdminClient } from './BetaAdminClient';

export const metadata = {
    title: 'Acessos Beta | Admin HUB',
};

export const revalidate = 0;

export default async function AdminBetaPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/login');
    }

    const { data: betaUsers } = await supabase
        .from('beta_users')
        .select(`
            *,
            profiles(name, avatar_url, user_category)
        `)
        .order('created_at', { ascending: false });

    return <BetaAdminClient initialUsers={betaUsers || []} />;
}
