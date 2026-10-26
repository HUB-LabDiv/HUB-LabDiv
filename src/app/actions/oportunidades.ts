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
import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const submitOportunidadeSchema = z.object({
    titulo: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').max(150, 'Título muito longo'),
    descricao: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres').max(1000, 'Descrição muito longa'),
    tipo: z.enum(['vaga', 'palestra', 'evento', 'bolsa']),
    data: z.string().max(80).optional().default(''),
    local: z.string().max(100).optional().default(''),
    link: z.string().url('URL inválida').or(z.literal('')).optional().default(''),
    target_persona: z.enum(['curioso', 'aluno', 'professor', 'geral']).optional().default('geral')
});

export type SubmitOportunidadeInput = z.infer<typeof submitOportunidadeSchema>;

export async function submitOportunidade(rawInput: unknown) {
    try {
        const parsed = submitOportunidadeSchema.safeParse(rawInput);
        if (!parsed.success) {
            return {
                success: false,
                error: parsed.error.issues[0]?.message || 'Dados inválidos.'
            };
        }

        const data = parsed.data;
        const supabase = await createServerSupabase();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'Você precisa estar conectado com uma conta para publicar uma oportunidade.'
            };
        }

        const payload = {
            titulo: data.titulo.trim(),
            descricao: data.descricao.trim(),
            tipo: data.tipo,
            data: data.data?.trim() || null,
            local: data.local?.trim() || null,
            link: data.link?.trim() || null,
            target_persona: data.target_persona,
            user_id: user.id,
            status: 'pending' // Encaminhado para a moderação da Torre de Controle
        };

        const { error } = await supabase
            .from('oportunidades')
            .insert(payload);

        if (error) {
            console.error('Erro ao cadastrar oportunidade:', error);
            return { success: false, error: 'Falha ao registrar oportunidade no banco de dados.' };
        }

        try {
            const { sendAdminNotification } = await import('@/lib/notifications.server');
            await sendAdminNotification({
                type: 'hub_improvement',
                title: `Nova oportunidade: "${data.titulo}"`,
                details: data.descricao
            });
            const { checkModerationQueueThresholds } = await import('@/lib/moderation-queue-monitor');
            void checkModerationQueueThresholds().catch(() => {});
        } catch {
            // Notificação não bloqueante
        }

        revalidatePath('/gcif/interativo');
        revalidatePath('/admin');
        return { 
            success: true,
            message: 'Oportunidade enviada para moderação com sucesso!' 
        };
    } catch (err: any) {
        console.error('Erro inesperado ao cadastrar oportunidade:', err);
        return { success: false, error: err.message || 'Erro inesperado no servidor.' };
    }
}
