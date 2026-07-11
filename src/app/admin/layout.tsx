import React from 'react';
import { createServerSupabase } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';
import AdminLoginGate from './AdminLoginGate';
import { cookies } from 'next/headers';

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

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const bypassCookie = (await cookies()).get('admin_bypass')?.value;
    let finalRole: string | null = null;

    if (bypassCookie === 'admin' || bypassCookie === 'moderator') {
        finalRole = bypassCookie;
    } else {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (profile?.role === 'admin' || profile?.role === 'moderator') {
                finalRole = profile.role;
            }
        }
    }

    if (!finalRole) {
        return <AdminLoginGate />;
    }

    return (
        <AdminLayoutClient role={finalRole}>
            {children}
        </AdminLayoutClient>
    );
}
