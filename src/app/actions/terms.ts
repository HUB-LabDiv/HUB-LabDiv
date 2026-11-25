'use server';

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

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { CURRENT_TERMS_VERSION } from '@/constants/terms';

const AcceptTermsSchema = z.object({
    termsAccepted: z.literal(true, {
        message: 'Você deve aceitar os Termos de Uso para continuar.',
    }),
    privacyAccepted: z.boolean().optional(),
});

export async function acceptUpdatedTermsAction(rawInput: unknown): Promise<{
    success: boolean;
    error?: string;
}> {
    const parsed = AcceptTermsSchema.safeParse(rawInput);
    if (!parsed.success) {
        return {
            success: false,
            error: parsed.error.issues[0]?.message || 'Dados inválidos.',
        };
    }

    const supabase = await createServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Sessão expirada. Faça login novamente.' };
    }

    const adminSupabase = createAdminSupabase();
    const { data: profile, error: fetchError } = await adminSupabase
        .from('profiles')
        .select('cpf_hash, birthdate, is_adult')
        .eq('id', user.id)
        .single();

    if (fetchError || !profile) {
        return { success: false, error: 'Perfil não encontrado.' };
    }

    const hasVerifiedAge = Boolean(
        profile.cpf_hash && (profile.birthdate || profile.is_adult !== null)
    );

    if (!hasVerifiedAge) {
        return {
            success: false,
            error: 'É necessário concluir a verificação de idade (ECA Digital) antes de continuar.',
        };
    }

    if (profile.is_adult !== false && !parsed.data.privacyAccepted) {
        return {
            success: false,
            error: 'Aceite a Política de Privacidade para continuar.',
        };
    }

    const { error: updateError } = await adminSupabase
        .from('profiles')
        .update({
            accepted_terms_version: CURRENT_TERMS_VERSION,
            accepted_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (updateError) {
        console.error('[acceptUpdatedTermsAction] Erro ao atualizar termos:', updateError);
        return { success: false, error: 'Falha ao salvar aceite dos termos.' };
    }

    revalidatePath('/');
    revalidatePath('/re-accept-terms');

    return { success: true };
}
