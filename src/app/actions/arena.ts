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

export async function fetchChallenges() {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('researcher_challenges')
        .select('*, creator:profiles(full_name, username, use_nickname, avatar_url)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching challenges:', error);
        return { error: 'Erro ao buscar desafios' };
    }

    return { success: true, data };
}

export async function submitToChallenge(challengeId: string, content: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { data, error } = await supabase
        .from('challenge_submissions')
        .insert({
            challenge_id: challengeId,
            researcher_id: user.id,
            content
        });

    if (error) {
        console.error('Error submitting to challenge:', error);
        return { error: 'Erro ao enviar submissão' };
    }

    revalidatePath('/arena');
    return { success: true };
}

export async function voteSubmission(submissionId: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { error } = await supabase.rpc('increment_submission_vote', { sub_id: submissionId });

    if (error) {
        console.error('Error voting:', error);
        return { error: 'Erro ao votar' };
    }

    revalidatePath('/arena');
    return { success: true };
}

export async function proposeChallenge(title: string, description: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { error } = await supabase
        .from('arena_suggestions')
        .insert({
            researcher_id: user.id,
            title,
            description
        });

    if (error) {
        console.error('Error proposing challenge:', error);
        return { error: 'Erro ao enviar proposta' };
    }

    revalidatePath('/arena');

    // Notify Admins
    const { sendAdminNotification } = await import('@/lib/notifications.server');
    const { data: profile } = await supabase.from('profiles').select('full_name, username').eq('id', user.id).single();
    
    await sendAdminNotification({
        type: 'arena_suggestion',
        userName: profile?.full_name || (profile?.username ? `@${profile.username}` : user.email) || 'Pesquisador',
        title: title,
        content: description
    });

    return { success: true };
}

export async function fetchArenaSuggestions() {
    const supabase = await createServerSupabase();
    
    // Admin check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autorizado' };
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Apenas administradores podem ver sugestões' };

    const { data, error } = await supabase
        .from('arena_suggestions')
        .select('*, researcher:profiles(full_name, username, avatar_url)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching arena suggestions:', error);
        return { error: 'Erro ao buscar sugestões' };
    }

    return { success: true, data };
}

export async function updateSuggestionStatus(suggestionId: string, status: 'approved' | 'rejected' | 'pending') {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: 'Acesso negado' };
    }

    const { error } = await supabase
        .from('arena_suggestions')
        .update({ status })
        .eq('id', suggestionId);

    if (error) {
        console.error('Error updating suggestion status:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/arena');
    revalidatePath('/admin/desafios');
    return { success: true };
}

export async function createChallenge(title: string, description: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: 'Acesso negado' };
    }

    const { error } = await supabase
        .from('researcher_challenges')
        .insert({
            title,
            description,
            created_by: user?.id
        });

    if (error) {
        console.error('Error creating challenge:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/arena');
    revalidatePath('/admin/desafios');
    return { success: true };
}

export async function fetchArenaFeedback() {
    const supabase = await createServerSupabase();
    
    // Admin check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autorizado' };
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Apenas administradores podem ver feedbacks' };

    const { data, error } = await supabase
        .from('feedback_reports')
        .select('*, user:profiles(full_name, username, avatar_url)')
        .eq('metadata->source', 'arena_researcher')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching arena feedback:', error);
        return { error: 'Erro ao buscar feedbacks do HUB' };
    }

    return { success: true, data };
}

export async function submitHubAdoption(data: { discipline_name: string; summary: string; usage_intent: string; requested_features: string }) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { error } = await supabase
        .from('hub_adoptions')
        .insert({
            user_id: user.id,
            discipline_name: data.discipline_name,
            summary: data.summary,
            usage_intent: data.usage_intent,
            requested_features: data.requested_features
        });

    if (error) {
        console.error('Error submitting hub adoption:', error);
        return { error: 'Erro ao enviar adoção' };
    }

    // Send email to hublabdiv@gmail.com
    if (resend) {
        const { data: profile } = await supabase.from('profiles').select('full_name, email').eq('id', user.id).single();
        const userName = profile?.full_name || 'Pesquisador';
        const userEmail = profile?.email || user.email || 'Email não informado';

        try {
            await resend.emails.send({
                from: 'HUB Lab-Div <noreply@labdiv.com.br>',
                to: 'hublabdiv@gmail.com',
                subject: `Novo Pedido de Adoção de Disciplina: ${data.discipline_name}`,
                html: `
                    <div style="font-family: sans-serif; color: #1e1e1e;">
                        <h2 style="color: #0F4780;">Novo Pedido de Adoção do HUB</h2>
                        <p><strong>Pesquisador:</strong> ${userName} (${userEmail})</p>
                        <p><strong>Disciplina:</strong> ${data.discipline_name}</p>
                        <br/>
                        <p><strong>Ementa/Resumo:</strong></p>
                        <blockquote style="border-left: 4px solid #0F4780; padding-left: 10px; color: #555;">${data.summary || 'Não informado'}</blockquote>
                        <br/>
                        <p><strong>Como pretende usar:</strong></p>
                        <blockquote style="border-left: 4px solid #F14343; padding-left: 10px; color: #555;">${data.usage_intent || 'Não informado'}</blockquote>
                        <br/>
                        <p><strong>Recursos solicitados:</strong></p>
                        <blockquote style="border-left: 4px solid #FFCC00; padding-left: 10px; color: #555;">${data.requested_features || 'Não informado'}</blockquote>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Erro ao enviar email de adoção via Resend:', emailError);
            // Continua mesmo se falhar o e-mail
        }
    }

    revalidatePath('/arena');
    revalidatePath('/admin/observatorio');
    return { success: true };
}

export async function fetchHubAdoptions() {
    const supabase = await createServerSupabase();
    
    // Admin check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autorizado' };
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Apenas administradores podem ver adoções' };

    const { data, error } = await supabase
        .from('hub_adoptions')
        .select('*, user:profiles(full_name, username, email, avatar_url)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching hub adoptions:', error);
        return { error: 'Erro ao buscar adoções' };
    }

    return { success: true, data };
}

export async function updateHubAdoptionStatus(adoptionId: string, status: 'pendente' | 'aprovado' | 'rejeitado') {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // Verify admin role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user?.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: 'Acesso negado' };
    }

    const { error } = await supabase
        .from('hub_adoptions')
        .update({ status })
        .eq('id', adoptionId);

    if (error) {
        console.error('Error updating adoption status:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/observatorio');
    return { success: true };
}

