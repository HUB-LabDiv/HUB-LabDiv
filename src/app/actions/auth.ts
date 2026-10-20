'use server';

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
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createAdminToken } from '@/lib/auth/admin-token';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminPassword && password === adminPassword) {
        const token = await createAdminToken('admin');
        const cookieStore = await cookies();
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            maxAge: 60 * 60 * 8, // 8 horas
            path: '/',
        };

        cookieStore.set('admin_session', token, cookieOptions);
        cookieStore.set('admin_bypass', token, cookieOptions);
        redirect('/admin');
    } else {
        return { error: 'Senha incorreta. Tente novamente.' };
    }
}

export async function signOut(redirectTo?: string) {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    cookieStore.delete('admin_bypass');
    cookieStore.delete('admin_impersonating_id');

    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');

    if (redirectTo) {
        redirect(redirectTo);
    }
    return { success: true };
}

