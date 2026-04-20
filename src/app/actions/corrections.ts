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


import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const CorrectionSchema = z.object({
    userId: z.string().uuid("ID de usuário inválido"),
    submissionId: z.string().uuid("ID de submissão inválido"),
    originalText: z.string().min(1, "Texto original é obrigatório"),
    suggestedText: z.string().min(1, "Sua sugestão de melhoria é obrigatória").max(10000, "Sugestão muito longa"),
    comment: z.string().max(5000, "Comentário muito longo").optional(),
});

export type CorrectionInput = z.infer<typeof CorrectionSchema>;

export async function addCorrection(params: CorrectionInput, token: string) {
    if (!token) {
        return { success: false, error: 'Sessão inválida. Por favor, faça login novamente.' };
    }

    try {
        // 1. Zod Validation
        const validatedData = CorrectionSchema.parse(params);

        // 2. Supabase Server Client setup with Authentication
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return { success: false, error: 'Configuração do Servidor ausente.' };
        }

        const supabaseServer = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        });

        // 3. User / Session check inside Server
        const { data: { user }, error: userError } = await supabaseServer.auth.getUser();
        if (userError || !user || user.id !== validatedData.userId) {
            console.error("Auth falhou na Server Action:", userError);
            return { success: false, error: 'Sessão de usuário inválida ou expirada. Pela RLS o acesso foi negado.' };
        }

        // 4. Insert
        const { error } = await supabaseServer
            .from('corrections')
            .insert({
                user_id: validatedData.userId,
                submission_id: validatedData.submissionId,
                original_text: validatedData.originalText,
                suggested_text: validatedData.suggestedText,
                comment: validatedData.comment || null,
                status: 'pendente'
            });

        if (error) {
            console.error("Erro SQL ao inserir sugestão de correção:", error);
            return { success: false, error: error.message || 'Falha ao enviar sua sugestão. Tente novamente mais tarde.' };
        }

        return { success: true };
    } catch (e: any) {
        console.error("Erro na Server Action (Correção):", e);
        if (e instanceof z.ZodError) {
            return { success: false, error: e.issues[0].message };
        }
        return { success: false, error: e.message || 'Erro inesperado no servidor.' };
    }
}
