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

import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { z } from 'zod';

const FeedbackSyncSchema = z.object({
  type: z.string().min(1).max(50),
  description: z.string().min(5).max(3000),
  user_agent: z.string().max(500).optional(),
  url: z.string().max(500).optional(),
});

const SacSyncSchema = z.object({
  pergunta: z.string().min(5).max(2000),
  nome: z.string().min(2).max(120),
  num_usp: z.string().max(30).optional().default(''),
  email: z.string().email().or(z.literal('')).optional().default(''),
});

const MAX_MUTATIONS_BATCH = 15;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!Array.isArray(body) && typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Payload inválido.' }, { status: 400 });
    }

    const rawMutations = Array.isArray(body) ? body : [body];

    if (rawMutations.length === 0) {
      return NextResponse.json({ success: true, message: 'Fila vazia.' });
    }

    if (rawMutations.length > MAX_MUTATIONS_BATCH) {
      return NextResponse.json({ 
        success: false, 
        error: `Tamanho máximo de lote excedido (máximo: ${MAX_MUTATIONS_BATCH} itens por sincronização).` 
      }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    let processedCount = 0;

    for (const mutation of rawMutations) {
      const { payload } = mutation || {};
      const data = payload?._type === 'formData' ? payload.data : payload;

      if (!data || typeof data !== 'object') continue;

      // 1. Processa Reports e Feedbacks
      if (data.type && data.description) {
        const feedbackParsed = FeedbackSyncSchema.safeParse(data);
        if (!feedbackParsed.success) continue;

        const validFb = feedbackParsed.data;
        await supabase.from('feedback_reports').insert([{
          type: validFb.type,
          description: validFb.description,
          metadata: {
            user_agent: validFb.user_agent,
            url: validFb.url,
            platform: 'web_offline_sync'
          }
        }]);

        try {
          const { sendAdminNotification } = await import('@/lib/notifications.server');
          await sendAdminNotification({
            type: 'bug_report',
            userName: 'Usuário Offline',
            content: validFb.description,
            url: validFb.url || ''
          });
        } catch (notifErr) {
          console.warn('[Sync Engine] Notificação de admin ignorada:', notifErr);
        }
        processedCount++;
      } 
      // 2. Processa Dúvidas do SAC
      else if (data.pergunta && data.nome) {
        const sacParsed = SacSyncSchema.safeParse(data);
        if (!sacParsed.success) continue;

        const validSac = sacParsed.data;
        await supabase.from('sac_faq').insert([{
          pergunta: validSac.pergunta,
          nome: validSac.nome,
          num_usp: validSac.num_usp,
          email: validSac.email || '',
          status: 'pending'
        }]);

        try {
          const { sendAdminNotification } = await import('@/lib/notifications.server');
          await sendAdminNotification({
            type: 'question',
            userName: `${validSac.nome} (Nº USP: ${validSac.num_usp}) - Via Sincronização Offline`,
            question: validSac.pergunta,
            details: validSac.email
          });
        } catch (notifErr) {
          console.warn('[Sync Engine] Notificação de admin ignorada para SAC:', notifErr);
        }
        processedCount++;
      }
      // 3. Processa Submissões do Diagramador (Lançar em Órbita)
      else if (data.title && data.authors) {
        const { createSubmission } = await import('@/app/actions/submissions');
        await createSubmission(data);
        processedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: processedCount,
      message: 'Sincronização concluída com sucesso!'
    });

  } catch (error: any) {
    console.error('[Sync Engine] Erro durante a sincronização:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Falha ao sincronizar' },
      { status: 500 }
    );
  }
}
