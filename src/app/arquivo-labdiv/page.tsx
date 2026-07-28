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

import { fetchSubmissions } from "@/app/actions/submissions";
import { SobreClient } from "@/app/sobre/SobreClient";
import { createServerSupabase } from "@/lib/supabase/server";

export const metadata = {
    title: 'Arquivo Lab-Div | Hub LabDiv',
    description: 'Catálogo de materiais e publicações do Laboratório de Divulgação Científica.',
};

export default async function ArquivoLabDivPage() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    const [submissionsRes, profileRes] = await Promise.all([
        fetchSubmissions({
            page: 1,
            limit: 4,
            query: '',
            categories: ['Impacto e Conquistas'],
            sort: 'recentes'
        }),
        user ? supabase.from('profiles').select('*').eq('id', user.id).single() : Promise.resolve({ data: null })
    ]);

    return (
        <SobreClient 
            initialTestimonials={submissionsRes.items} 
            profile={profileRes.data ? { ...profileRes.data, email: user?.email } as any : null}
            initialTab="labdiv"
        />
    );
}
