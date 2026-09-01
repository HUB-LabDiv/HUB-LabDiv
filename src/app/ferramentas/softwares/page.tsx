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

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { isUserAllowedSoftwaresTab } from '@/constants/softwares';
import { fetchAcademicSoftwares } from '@/app/actions/softwares';
import { SoftwaresClientView } from '@/components/ferramentas/softwares/SoftwaresClientView';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Softwares & Ferramentas Acadêmicas | Hub Lab-Div IFUSP',
    description: 'Catálogo colaborativo de softwares, simuladores e códigos acadêmicos desenvolvidos pela comunidade do IFUSP e essenciais da graduação.',
};

export default async function SoftwaresPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Beta Whitelist Guard: apenas UIDs da Mari e do Andy (João) têm acesso no momento
    if (!isUserAllowedSoftwaresTab(user.id)) {
        redirect('/ferramentas');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const initialSoftwares = await fetchAcademicSoftwares({
        userId: user.id
    });

    return (
        <SoftwaresClientView
            initialSoftwares={initialSoftwares}
            currentUserId={user.id}
            currentUserName={profile?.full_name || profile?.username || ''}
        />
    );
}
