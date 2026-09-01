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
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { ToolsSubNav } from '@/components/layout/ToolsSubNav';
import { SwipeWrapper } from '@/components/layout/SwipeWrapper';
import { isUserAllowedSoftwaresTab } from '@/constants/softwares';

export default async function FerramentasLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const hasSoftwaresAccess = isUserAllowedSoftwaresTab(user.id);

    const routes = [
        '/ferramentas',
        '/ferramentas/trilhas',
        '/ferramentas/match',
        '/ferramentas/anotacoes',
        ...(hasSoftwaresAccess ? ['/ferramentas/softwares'] : [])
    ];

    return (
        <MainLayoutWrapper
            userId={user.id}
            fullWidth={true}
        >
            <SwipeWrapper routes={routes}>
                <div className="py-8 w-full px-4 lg:px-8 flex-1">
                    <ToolsSubNav hasSoftwaresAccess={hasSoftwaresAccess} />
                    {children}
                </div>
            </SwipeWrapper>
        </MainLayoutWrapper>
    );
}
