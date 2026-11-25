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

import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';
import { CURRENT_TERMS_VERSION } from '@/constants/terms';
import { ReAcceptTermsClient } from './ReAcceptTermsClient';

export const dynamic = 'force-dynamic';

export default async function ReAcceptTermsPage() {
    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('cpf_hash, birthdate, is_adult, accepted_terms_version')
        .eq('id', user.id)
        .maybeSingle();

    if (profile?.accepted_terms_version === CURRENT_TERMS_VERSION) {
        redirect('/');
    }

    const alreadyVerifiedAge = Boolean(
        profile?.cpf_hash && (profile?.birthdate || profile?.is_adult !== null)
    );
    const initialIsMinor = profile?.is_adult === false;

    return (
        <ReAcceptTermsClient
            alreadyVerifiedAge={alreadyVerifiedAge}
            initialIsMinor={initialIsMinor}
        />
    );
}
