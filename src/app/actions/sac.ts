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
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function submitFAQ(data: { pergunta: string; nome: string; num_usp: string; email: string }) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: user } = await supabase.auth.getUser();

        const faqPayload = {
            pergunta: data.pergunta,
            nome: data.nome,
            num_usp: data.num_usp,
            email: data.email || user?.user?.email || '',
            status: 'pending'
        };

        let { error } = await supabase
            .from('sac_faq')
            .insert(faqPayload);

        if (error) {
            console.warn('[SAC] Standard insert failed, retrying with Admin Client:', error.message);
            try {
                const { createAdminSupabase } = await import('@/lib/supabase/admin');
                const adminSupabase = createAdminSupabase();
                const { error: adminErr } = await adminSupabase.from('sac_faq').insert(faqPayload);
                if (!adminErr) error = null;
            } catch (adminEx) {
                console.error('[SAC] Admin Supabase client error:', adminEx);
            }
        }

        if (error) {
            console.error('Erro ao submeter FAQ:', error);
            return { success: false, error: 'Falha ao registrar dúvida no sistema.' };
        }

        // Dispara notificação por e-mail para os administradores
        try {
            const { sendAdminNotification } = await import('@/lib/notifications.server');
            await sendAdminNotification({
                type: 'question',
                userName: `${data.nome} (Nº USP: ${data.num_usp})`,
                question: data.pergunta,
                details: data.email
            });
        } catch (notifErr) {
            console.warn('[SAC] Notificação por e-mail ignorada ou falhou:', notifErr);
        }

        revalidatePath('/admin/sac');
        return { success: true };
    } catch (err) {
        console.error('Erro de servidor:', err);
        return { success: false, error: 'Erro inesperado' };
    }
}

export async function getApprovedFAQs() {
    try {
        const supabase = await createServerSupabase();
        
        const { data, error } = await supabase
            .from('sac_faq')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Erro ao buscar FAQs aprovadas:', error);
            return { success: false, data: [] };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Erro de servidor:', err);
        return { success: false, data: [] };
    }
}

export async function getAdminFAQs(statusFilter?: string) {
    try {
        const supabase = await createServerSupabase();
        
        let query = supabase.from('sac_faq').select('*').order('created_at', { ascending: false });
        
        if (statusFilter && statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Erro ao buscar FAQs Admin:', error);
            return { success: false, data: [] };
        }

        return { success: true, data };
    } catch (err) {
        console.error('Erro de servidor:', err);
        return { success: false, data: [] };
    }
}

export async function updateFAQStatus(id: string, status: string, resposta?: string) {
    try {
        const supabase = await createServerSupabase();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, error: 'Acesso negado' };
        }

        // Recupera o faq antes de atualizar para pegar o e-mail do aluno
        const { data: faqItem, error: fetchError } = await supabase
            .from('sac_faq')
            .select('*')
            .eq('id', id)
            .single();

        if (fetchError || !faqItem) {
            return { success: false, error: 'FAQ não encontrado' };
        }

        const updateData: any = { status };
        if (resposta !== undefined) {
            updateData.resposta = resposta;
        }

        const { error } = await supabase
            .from('sac_faq')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar FAQ:', error);
            return { success: false, error: 'Erro ao atualizar.' };
        }

        // Se for aprovado e tiver resposta, envia email
        if (status === 'approved' && updateData.resposta && faqItem.email && resend) {
            try {
                await resend.emails.send({
                    from: 'HUB Lab-Div <noreply@labdiv.com.br>', // Ajuste o domínio depois se necessário
                    to: faqItem.email,
                    subject: 'Sua dúvida no HUB Lab-Div foi respondida!',
                    html: `
                        <div style="font-family: sans-serif; color: #1e1e1e;">
                            <h2 style="color: #0F4780;">Olá, ${faqItem.nome}!</h2>
                            <p>Sua dúvida enviada ao SAC do HUB Lab-Div acabou de ser respondida.</p>
                            <br/>
                            <p><strong>Sua Pergunta:</strong></p>
                            <blockquote style="border-left: 4px solid #F14343; padding-left: 10px; color: #555;">${faqItem.pergunta}</blockquote>
                            <br/>
                            <p><strong>Nossa Resposta:</strong></p>
                            <p>${updateData.resposta}</p>
                            <br/>
                            <p>Acesse o <a href="https://hub.labdiv.com.br/ferramentas">HUB Lab-Div</a> para ver essa e outras ferramentas!</p>
                            <hr style="border-top: 1px solid #ddd; margin: 20px 0;"/>
                            <p style="font-size: 12px; color: #888;">Este é um e-mail automático. Por favor, não responda.</p>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error('Erro ao enviar email via Resend:', emailError);
                // Continua o fluxo mesmo se o email falhar
            }
        }

        revalidatePath('/ferramentas');
        revalidatePath('/admin/sac');
        return { success: true };
    } catch (err) {
        console.error('Erro de servidor:', err);
        return { success: false, error: 'Erro inesperado' };
    }
}
