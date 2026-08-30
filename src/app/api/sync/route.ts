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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mutations = Array.isArray(body) ? body : [body];

    if (mutations.length === 0) {
      return NextResponse.json({ success: true, message: 'Fila vazia.' });
    }

    const supabase = await createServerSupabase();

    for (const mutation of mutations) {
      const { payload } = mutation;
      const data = payload?._type === 'formData' ? payload.data : payload;

      if (!data) continue;

      // 1. Processa Reports e Feedbacks
      if (data.type && data.description) {
        await supabase.from('feedback_reports').insert([{
          type: data.type,
          description: data.description,
          metadata: {
            user_agent: data.user_agent,
            url: data.url,
            platform: 'web_offline_sync'
          }
        }]);

        try {
          const { sendAdminNotification } = await import('@/lib/notifications.server');
          await sendAdminNotification({
            type: 'bug_report',
            userName: 'Usuário Offline',
            content: data.description,
            url: data.url || ''
          });
        } catch (notifErr) {
          console.warn('[Sync Engine] Notificação de admin ignorada:', notifErr);
        }
      } 
      // 2. Processa Dúvidas do SAC
      else if (data.pergunta && data.nome) {
        await supabase.from('sac_faq').insert([{
          pergunta: data.pergunta,
          nome: data.nome,
          num_usp: data.num_usp,
          email: data.email || '',
          status: 'pending'
        }]);

        try {
          const { sendAdminNotification } = await import('@/lib/notifications.server');
          await sendAdminNotification({
            type: 'question',
            userName: `${data.nome} (Nº USP: ${data.num_usp}) - Via Sincronização Offline`,
            question: data.pergunta,
            details: data.email
          });
        } catch (notifErr) {
          console.warn('[Sync Engine] Notificação de admin ignorada para SAC:', notifErr);
        }
      }
      // 3. Processa Submissões do Diagramador (Lançar em Órbita)
      else if (data.title && data.authors) {
        const { createSubmission } = await import('@/app/actions/submissions');
        await createSubmission(data);
      }
    }

    return NextResponse.json({ 
      success: true, 
      processed: mutations.length,
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
