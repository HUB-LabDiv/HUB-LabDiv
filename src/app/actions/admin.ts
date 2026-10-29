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
import { createAdminSupabase } from '@/lib/supabase/admin';
import { createAdminToken, verifyAdminToken, AdminRole } from '@/lib/auth/admin-token';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { detectFacultyMember } from '@/lib/facultyDetector';
import { checkModerationQueueThresholds } from '@/lib/moderation-queue-monitor';

const BulkActionSchema = z.object({
    submission_ids: z.array(z.string().uuid()).min(1, "Selecione ao menos um item"),
});

export async function requireAdminOrModerator(): Promise<{ authorized: boolean; role?: string; error?: string }> {
    const session = await getAdminSessionRole();
    if (!session.role || (session.role !== 'admin' && session.role !== 'moderator')) {
        return { authorized: false, error: 'Acesso não autorizado. Permissão de administrador ou moderador requerida.' };
    }
    return { authorized: true, role: session.role };
}

/**
 * Valida sugestões de IA em massa com proteção Zod e RBAC
 */
export async function validateAISuggestionsBulk(ids: string[]) {
    // 0. Verificação de Permissão RBAC
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    // 1. Validação Strict
    const result = BulkActionSchema.safeParse({ submission_ids: ids });

    if (!result.success) {
        return { success: false, error: result.error.issues[0].message };
    }

    const adminSupabase = createAdminSupabase();

    // 2. Chamada RPC Atômica (tenta executar caso já migrado no Supabase)
    const { error: rpcError } = await adminSupabase.rpc('accept_ai_suggestions_bulk', {
        submission_ids: result.data.submission_ids
    });

    if (rpcError) {
        // Fallback resiliente direto no banco
        const { data: subs, error: fetchErr } = await adminSupabase
            .from('submissions')
            .select('id, tags, ai_suggested_tags, alt_text, ai_suggested_alt')
            .in('id', result.data.submission_ids);

        if (fetchErr) {
            console.error('Erro na leitura para aplicar sugestões IA:', fetchErr);
            return { success: false, error: 'Falha no processamento das sugestões de IA.' };
        }

        for (const sub of (subs || [])) {
            const mergedTags = Array.from(new Set([
                ...(sub.tags || []),
                ...(sub.ai_suggested_tags || [])
            ]));
            const newAlt = sub.ai_suggested_alt || sub.alt_text;

            await adminSupabase
                .from('submissions')
                .update({
                    tags: mergedTags,
                    alt_text: newAlt,
                    ai_status: 'applied'
                })
                .eq('id', sub.id);
        }
    }

    revalidatePath('/admin/acervo');
    return { success: true };
}

/**
 * Solicita re-processamento de IA para itens com erro
 */
export async function reprocessAI(submissionId: string) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('submissions')
        .update({ ai_status: 'pending' })
        .eq('id', submissionId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    return { success: true };
}

/**
 * Vincula uma submissão a uma trilha e tópico.
 */
export async function linkSubmissionToTrail(submissionId: string, trailId: string, topicIndex: number) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('trail_submissions')
        .insert({
            submission_id: submissionId,
            trail_id: trailId,
            topic_index: topicIndex,
            sort_order: 0
        });

    if (error) {
        console.error('Erro ao vincular trilha:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    revalidatePath(`/ferramentas/trilhas/${trailId}`);
    return { success: true };
}

/**
 * Remove o vínculo de uma submissão com uma trilha.
 */
export async function unlinkSubmissionFromTrail(linkId: string, trailId: string) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('trail_submissions')
        .delete()
        .eq('id', linkId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/acervo');
    revalidatePath(`/ferramentas/trilhas/${trailId}`);
    return { success: true };
}

/**
 * Busca todas as trilhas para o seletor administrativo.
 */
export async function fetchAllTrails() {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('learning_trails')
        .select('id, title, course_code, program')
        .order('title');

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

/**
 * Busca todas as trilhas às quais uma submissão já está vinculada.
 */
export async function fetchSubmissionTrails(submissionId: string) {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
        .from('trail_submissions')
        .select(`
            id,
            trail_id,
            topic_index,
            learning_trails(title, course_code)
        `)
        .eq('submission_id', submissionId);

    if (error) {
        return { success: false, error: error.message };
    }

    return { success: true, data };
}

export async function loginAdminBypass(login: string, senha: string) {
    const cookieStore = await import('next/headers').then(m => m.cookies());

    // Garante que qualquer modo impersonate anterior é encerrado
    cookieStore.delete('admin_impersonating_id');

    // ── Bypass via variáveis de ambiente (acesso manual de emergência) ──
    const adminEmail = process.env.ADMIN_EMAIL || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';
    const adminSecret = process.env.ADMIN_SECRET_KEY || '';

    const loginMatchesEmail = login.trim().toLowerCase() === adminEmail.trim().toLowerCase();
    const loginMatchesAlias = login.trim().toLowerCase() === 'adm' || login.trim().toLowerCase() === 'admin';
    const senhaCorreta = senha === adminPassword || senha === adminSecret;

    const cookieOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        maxAge: 60 * 60 * 8, // 8 horas
    };

    if ((loginMatchesEmail || loginMatchesAlias) && senhaCorreta && adminPassword) {
        const token = await createAdminToken('admin');
        cookieStore.set('admin_bypass', token, cookieOptions);
        cookieStore.set('admin_session', token, cookieOptions);
        return { success: true };
    }

    // ── Fallback: tenta login normal pelo Supabase com email ──
    try {
        const supabase = await createServerSupabase();
        const { data, error } = await supabase.auth.signInWithPassword({
            email: login,
            password: senha
        });
        if (error || !data.user) {
            return { success: false, error: 'Credenciais inválidas' };
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', data.user.id)
            .maybeSingle();

        if (profile?.id && (profile.role === 'admin' || profile.role === 'moderator')) {
            const role: AdminRole = profile.role === 'admin' ? 'admin' : 'moderator';
            const token = await createAdminToken(role);
            cookieStore.set('admin_bypass', token, cookieOptions);
            cookieStore.set('admin_session', token, cookieOptions);
        }

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message || 'Erro ao autenticar' };
    }
}

/**
 * Consulta de forma segura no servidor o papel administrativo atual (sessão Supabase ou token HMAC).
 */
export async function getAdminSessionRole(): Promise<{ role: string | null }> {
    const cookieStore = await import('next/headers').then(m => m.cookies());
    const bypassCookie = cookieStore.get('admin_bypass')?.value;
    const sessionCookie = cookieStore.get('admin_session')?.value;

    const bypassCheck = await verifyAdminToken(bypassCookie);
    if (bypassCheck.valid && bypassCheck.role) {
        return { role: bypassCheck.role };
    }

    const sessionCheck = await verifyAdminToken(sessionCookie);
    if (sessionCheck.valid && sessionCheck.role) {
        return { role: sessionCheck.role };
    }

    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();
            if (profile?.role === 'admin' || profile?.role === 'moderator') {
                return { role: profile.role };
            }
        }
    } catch {
        // Ignora erros na consulta do supabase
    }

    return { role: null };
}

const QueueDecisionSchema = z.object({
    itemId: z.string().uuid(),
    itemType: z.enum([
        'submission',
        'submission_edit',
        'profile',
        'profile_edit',
        'teacher_verification',
        'initiative_request',
        'comment',
        'software',
        'software_feedback',
        'oportunidade',
        'dica',
        'micro_article',
        'pergunta',
        'palavra_geradora',
        'constelacao_edge',
        'challenge_submission',
        'wiki_proposal',
        'report'
    ]),
    decision: z.enum(['approve', 'reject']),
    feedback: z.string().optional(),
    proofPath: z.string().optional(),
    editedPayload: z.any().optional()
});

const BatchModerateQueueSchema = z.array(QueueDecisionSchema);

/**
 * ⚡ Executa a moderação em lote atômica na Torre de Controle
 * Processa a Swipe Staging Queue via RPC e realiza expurgo físico de arquivos (LGPD)
 */
export async function executeBatchModeration(actions: z.infer<typeof QueueDecisionSchema>[]) {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    const parsed = BatchModerateQueueSchema.safeParse(actions);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0]?.message || 'Ações inválidas na fila.' };
    }

    const adminSupabase = createAdminSupabase();

    // 1. Executa a RPC transacional no banco
    const rpcPayload = parsed.data.map(a => ({
        item_id: a.itemId,
        item_type: a.itemType,
        decision: a.decision,
        feedback: a.feedback || null
    }));

    const { data: rpcResult, error: rpcError } = await adminSupabase.rpc('batch_moderate_queue', {
        actions: rpcPayload
    });

    if (rpcError) {
        console.warn('[Torre de Controle] RPC batch_moderate_queue indisponível ou com erro, aplicando fallback resiliente:', rpcError);
        // Fallback direto via Supabase Client para garantir execução mesmo antes da migration
        for (const item of parsed.data) {
            try {
                if (item.itemType === 'profile') {
                    const isPromo = item.feedback === 'promote_professor' || item.editedPayload?.promote_to_professor;
                    await adminSupabase.from('profiles').update({
                        review_status: item.decision === 'approve' ? 'approved' : 'rejected',
                        pending_edits: null,
                        ...(item.decision === 'approve' && isPromo ? { 
                            persona: 'professor', 
                            teacher_verification_status: 'approved', 
                            verified_at: new Date().toISOString() 
                        } : {})
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'submission') {
                    await adminSupabase.from('submissions').update({
                        status: item.decision === 'approve' ? 'aprovado' : 'rejeitado',
                        admin_feedback: item.feedback || null
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'submission_edit') {
                    if (item.decision === 'approve') {
                        const { data: sub } = await adminSupabase.from('submissions').select('pending_edits').eq('id', item.itemId).single();
                        if (sub?.pending_edits) {
                            await adminSupabase.from('submissions').update({
                                ...sub.pending_edits,
                                pending_edits: null
                            }).eq('id', item.itemId);
                        }
                    } else {
                        await adminSupabase.from('submissions').update({ pending_edits: null }).eq('id', item.itemId);
                    }
                } else if (item.itemType === 'profile_edit') {
                    const { data: prof } = await adminSupabase.from('profiles').select('pending_edits, full_name').eq('id', item.itemId).single();
                    if (item.decision === 'approve') {
                        if (prof?.pending_edits) {
                            const { pending_avatar_url, _submitted_at, ...cleanEdits } = prof.pending_edits;
                            const updatePayload: Record<string, any> = {
                                ...cleanEdits,
                                pending_edits: null,
                                review_status: 'approved'
                            };
                            if (pending_avatar_url) {
                                updatePayload.avatar_url = pending_avatar_url;
                            }
                            if (Array.isArray(cleanEdits.member_initiatives)) {
                                updatePayload.is_labdiv = cleanEdits.member_initiatives.includes('labdiv');
                            }
                            await adminSupabase.from('profiles').update(updatePayload).eq('id', item.itemId);
                        }
                    } else {
                        const alreadyHadApprovedProfile = Boolean(prof?.full_name && prof.full_name.trim().length > 0);
                        await adminSupabase.from('profiles').update({
                            pending_edits: null,
                            review_status: alreadyHadApprovedProfile ? 'approved' : 'rejected'
                        }).eq('id', item.itemId);
                    }
                } else if (item.itemType === 'initiative_request') {
                    await adminSupabase.from('initiative_requests').update({
                        status: item.decision === 'approve' ? 'approved' : 'rejected',
                        admin_notes: item.feedback || null,
                        reviewed_at: new Date().toISOString()
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'teacher_verification') {
                    await adminSupabase.from('profiles').update({
                        persona: item.decision === 'approve' ? 'professor' : undefined,
                        teacher_verification_status: item.decision === 'approve' ? 'approved' : 'rejected',
                        verified_at: new Date().toISOString()
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'comment') {
                    await adminSupabase.from('comments').update({
                        status: item.decision === 'approve' ? 'aprovado' : 'rejeitado'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'oportunidade') {
                    await adminSupabase.from('oportunidades').update({
                        status: item.decision === 'approve' ? 'approved' : 'rejected'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'software') {
                    await adminSupabase.from('academic_softwares').update({
                        status: item.decision === 'approve' ? 'aprovado' : 'rejeitado'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'software_feedback') {
                    await adminSupabase.from('software_feedbacks').update({
                        status: item.decision === 'approve' ? 'approved' : 'rejected'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'dica') {
                    await adminSupabase.from('dicas_veteranos').update({
                        status: item.decision === 'approve' ? 'approved' : 'rejected'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'micro_article') {
                    await adminSupabase.from('micro_articles').update({
                        status: item.decision === 'approve' ? 'approved' : 'rejected'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'pergunta') {
                    await adminSupabase.from('perguntas').update({
                        status: item.decision === 'approve' ? 'respondida' : 'rejeitada'
                    }).eq('id', item.itemId);
                } else if (item.itemType === 'palavra_geradora') {
                    if (item.decision === 'approve') {
                        await adminSupabase.from('palavras_geradoras').update({ is_pending: false }).eq('id', item.itemId);
                    } else {
                        await adminSupabase.from('palavras_geradoras').delete().eq('id', item.itemId);
                    }
                } else if (item.itemType === 'constelacao_edge') {
                    if (item.decision === 'approve') {
                        await adminSupabase.from('constelacao_edges').update({ is_pending: false }).eq('id', item.itemId);
                    } else {
                        await adminSupabase.from('constelacao_edges').delete().eq('id', item.itemId);
                    }
                } else if (item.itemType === 'report') {
                    await adminSupabase.from('reports').update({
                        status: item.decision === 'approve' ? 'resolved' : 'dismissed'
                    }).eq('id', item.itemId);
                }
            } catch (fallbackErr) {
                console.error(`[Torre de Controle Fallback] Erro ao moderar item ${item.itemId}:`, fallbackErr);
            }
        }
    }

    // 2. Expurgo Físico no Storage (LGPD) para Teacher Verifications
    const teacherVerifications = parsed.data.filter(a => a.itemType === 'teacher_verification');
    for (const tv of teacherVerifications) {
        try {
            let path = tv.proofPath;
            if (!path) {
                const { data: profile } = await adminSupabase
                    .from('profiles')
                    .select('teacher_proof_path')
                    .eq('id', tv.itemId)
                    .single();
                path = profile?.teacher_proof_path;
            }

            if (path) {
                await adminSupabase.storage.from('teacher-verifications').remove([path]);
                await adminSupabase.from('profiles').update({ teacher_proof_path: null }).eq('id', tv.itemId);
                console.log(`[LGPD Expurgo] Comprovante docente deletado com sucesso: ${path}`);
            }
        } catch (storageErr) {
            console.error('[LGPD Expurgo] Erro ao remover comprovante do storage:', storageErr);
        }
    }

    // 3. Revalidações das rotas do ecossistema
    revalidatePath('/admin');
    revalidatePath('/admin/moderacao');
    revalidatePath('/admin/profiles');
    revalidatePath('/gcif/interativo');
    revalidatePath('/lab');
    revalidatePath('/');

    return { 
        success: true, 
        result: rpcResult 
    };
}

/**
 * 🛰️ Carrega o feed unificado de todas as pendências da Torre de Controle
 */
export async function fetchUnifiedModerationQueue(): Promise<{ success: boolean; items: any[]; error?: string }> {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, items: [], error: auth.error };
    }

    const adminSupabase = createAdminSupabase();

    try {
        const [
            subsRes,
            subEditsRes,
            profEditsRes,
            pendingProfilesRes,
            teacherVerifsRes,
            initiativeReqsRes,
            commentsRes,
            softwaresRes,
            feedbacksRes,
            oportunidadesRes,
            dicasRes,
            dropsRes,
            perguntasRes,
            palavrasRes,
            constelacaoEdgesRes,
            challengesRes,
            propostasRes,
            reportsRes
        ] = await Promise.all([
            adminSupabase.from('submissions').select('id, title, authors, created_at, category').eq('status', 'pendente').limit(30),
            adminSupabase.from('submissions').select('id, title, authors, pending_edits, created_at').not('pending_edits', 'is', null).limit(20),
            adminSupabase.from('profiles').select('id, full_name, email, pending_edits, created_at').not('pending_edits', 'is', null).limit(20),
            adminSupabase.from('profiles').select('id, full_name, email, is_usp_member, user_category, persona, institute, course, created_at').eq('review_status', 'pending').limit(30),
            adminSupabase.from('profiles').select('id, full_name, email, teacher_proof_path, created_at').eq('teacher_verification_status', 'pending').limit(20),
            adminSupabase.from('initiative_requests').select('*').eq('status', 'pending').limit(20),
            adminSupabase.from('comments').select('id, author_name, content, created_at, submission_id').eq('status', 'pendente').limit(30),
            adminSupabase.from('academic_softwares').select('id, title, author_name, created_at, category').eq('status', 'pendente').limit(20),
            adminSupabase.from('software_feedbacks').select('id, comment, feedback_type, created_at, software_id').eq('status', 'pending').limit(20),
            adminSupabase.from('oportunidades').select('id, titulo, descricao, tipo, created_at').eq('status', 'pending').limit(20),
            adminSupabase.from('dicas_veteranos').select('id, titulo, conteudo, created_at').eq('status', 'pending').limit(20),
            adminSupabase.from('micro_articles').select('id, content, created_at, author_id').eq('status', 'pending').limit(20),
            adminSupabase.from('perguntas').select('id, pergunta, nome_autor, created_at').eq('status', 'pendente').limit(20),
            adminSupabase.from('palavras_geradoras').select('id, palavra, created_at').eq('is_pending', true).limit(20),
            adminSupabase.from('constelacao_edges').select('id, termo_origem, termo_destino, peso, created_at').eq('is_pending', true).limit(20),
            adminSupabase.from('challenge_submissions').select('id, challenge_id, researcher_id, status, created_at').eq('status', 'pending').limit(20),
            adminSupabase.from('wiki_topic_proposals').select('id, title, motivation, created_at').eq('status', 'pendente').limit(20),
            adminSupabase.from('reports').select('id, reason, item_type, created_at').eq('status', 'pending').limit(20)
        ]);

        const items: any[] = [];

        // 1. Submissões Novas (Informativo)
        (subsRes.data || []).forEach(s => {
            items.push({
                id: s.id,
                type: 'submission',
                title: s.title || 'Nova Submissão',
                subtitle: `Categoria: ${s.category || 'Geral'}`,
                authorName: s.authors || 'Autor Anônimo',
                createdAt: s.created_at,
                axis: 'informativo'
            });
        });

        // 2. Edições de Submissão (Informativo)
        (subEditsRes.data || []).forEach(s => {
            items.push({
                id: s.id,
                type: 'submission_edit',
                title: `Edição: ${s.title}`,
                subtitle: 'Alteração de post aguardando revisão',
                authorName: s.authors || 'Autor',
                details: s.pending_edits,
                createdAt: s.created_at,
                axis: 'informativo'
            });
        });

        // 3. Verificação de Docentes (Personas)
        (teacherVerifsRes.data || []).forEach(t => {
            items.push({
                id: t.id,
                type: 'teacher_verification',
                title: `Validação Docente: ${t.full_name || 'Professor'}`,
                subtitle: t.email,
                authorName: t.full_name || 'Docente',
                authorEmail: t.email,
                proofPath: t.teacher_proof_path,
                createdAt: t.created_at,
                axis: 'personas'
            });
        });

        // 4. Edições de Perfil (Personas)
        (profEditsRes.data || []).forEach(p => {
            items.push({
                id: p.id,
                type: 'profile_edit',
                title: `Edição de Perfil: ${p.full_name || p.email}`,
                subtitle: 'Atualização de dados cadastrais',
                authorName: p.full_name || p.email,
                details: p.pending_edits,
                createdAt: p.pending_edits?._submitted_at || p.created_at,
                axis: 'personas'
            });
        });

        // 4.05 Solicitações de Inclusão de Iniciativa (Personas & Governança — Eixo 04)
        (initiativeReqsRes.data || []).forEach((req: any) => {
            items.push({
                id: req.id,
                type: 'initiative_request',
                title: `🏛️ Nova Iniciativa: ${req.initiative_name}${req.acronym ? ` (${req.acronym})` : ''}`,
                subtitle: req.description,
                authorName: req.responsible_name,
                authorEmail: req.contact_info,
                details: {
                    initiative_name: req.initiative_name,
                    acronym: req.acronym,
                    description: req.description,
                    responsible_name: req.responsible_name,
                    contact_info: req.contact_info
                },
                createdAt: req.created_at,
                axis: 'personas'
            });
        });

        // 4.1 Novos Perfis Pendentes (Personas) — evita duplicar se já entrou como profile_edit
        const profileEditIds = new Set((profEditsRes.data || []).map(p => p.id));
        (pendingProfilesRes.data || []).filter(p => !profileEditIds.has(p.id)).forEach(p => {
            const facultyMatch = detectFacultyMember(p.email, p.full_name);
            items.push({
                id: p.id,
                type: 'profile',
                title: facultyMatch 
                    ? `🎓 Docente Detectado: ${p.full_name || facultyMatch.researcher.nome}`
                    : `Novo Perfil: ${p.full_name || p.email || 'Usuário'}`,
                subtitle: facultyMatch 
                    ? `Docente do IFUSP (${facultyMatch.department.sigla} - ${facultyMatch.department.nome}). Sugestão: Promover a Professor.`
                    : `E-mail: ${p.email} • Categoria: ${p.user_category || p.persona || 'Curioso'} • ${p.is_usp_member ? 'Membro USP' : 'Externo'}`,
                authorName: p.full_name || p.email,
                authorEmail: p.email,
                facultyMatch,
                createdAt: p.created_at,
                axis: 'personas'
            });
        });

        // 5. Comentários (Comunidade)
        (commentsRes.data || []).forEach(c => {
            items.push({
                id: c.id,
                type: 'comment',
                title: 'Novo Comentário',
                subtitle: c.content,
                authorName: c.author_name || 'Comentarista',
                createdAt: c.created_at,
                axis: 'comunidade'
            });
        });

        // 6. Softwares Acadêmicos (Ferramentas)
        (softwaresRes.data || []).forEach(sw => {
            items.push({
                id: sw.id,
                type: 'software',
                title: sw.title,
                subtitle: `Software - ${sw.category}`,
                authorName: sw.author_name || 'Desenvolvedor',
                createdAt: sw.created_at,
                axis: 'ferramentas'
            });
        });

        // 7. Feedbacks de Software (Ferramentas)
        (feedbacksRes.data || []).forEach(fb => {
            items.push({
                id: fb.id,
                type: 'software_feedback',
                title: `Relato de Teste: ${fb.feedback_type || 'Geral'}`,
                subtitle: fb.comment,
                authorName: 'Usuário',
                createdAt: fb.created_at,
                axis: 'ferramentas'
            });
        });

        // 8. Oportunidades (Informativo)
        (oportunidadesRes.data || []).forEach(op => {
            items.push({
                id: op.id,
                type: 'oportunidade',
                title: op.titulo,
                subtitle: `Tipo: ${op.tipo} - ${op.descricao}`,
                authorName: 'Comunidade',
                createdAt: op.created_at,
                axis: 'informativo'
            });
        });

        // 9. Dicas de Veteranos (Comunidade)
        (dicasRes.data || []).forEach(d => {
            items.push({
                id: d.id,
                type: 'dica',
                title: d.titulo,
                subtitle: d.conteudo,
                authorName: 'Veterano',
                createdAt: d.created_at,
                axis: 'comunidade'
            });
        });

        // 10. Drops / Micro-artigos (Comunidade)
        (dropsRes.data || []).forEach(dr => {
            items.push({
                id: dr.id,
                type: 'micro_article',
                title: 'Drop da Comunidade',
                subtitle: dr.content,
                authorName: 'Membro',
                createdAt: dr.created_at,
                axis: 'comunidade'
            });
        });

        // 11. Perguntas a um Cientista (Informativo)
        (perguntasRes.data || []).forEach(pq => {
            items.push({
                id: pq.id,
                type: 'pergunta',
                title: 'Dúvida da Comunidade',
                subtitle: pq.pergunta,
                authorName: pq.nome_autor || 'Curioso',
                createdAt: pq.created_at,
                axis: 'informativo'
            });
        });

        // 12. Palavras Geradoras (Comunidade)
        (palavrasRes.data || []).forEach(pal => {
            items.push({
                id: pal.id,
                type: 'palavra_geradora',
                title: `Termo Científico: ${pal.palavra}`,
                subtitle: 'Sugestão para o Glossário',
                authorName: 'Comunidade',
                createdAt: pal.created_at,
                axis: 'comunidade'
            });
        });

        // 12.1 Constelações Linguísticas (Comunidade)
        (constelacaoEdgesRes.data || []).forEach(edge => {
            items.push({
                id: edge.id,
                type: 'constelacao_edge',
                title: `Nova Conexão: ${edge.termo_origem} ↔ ${edge.termo_destino}`,
                subtitle: `Conexão semântica sugerida (Peso: ${edge.peso})`,
                authorName: 'Membro da Comunidade',
                createdAt: edge.created_at,
                axis: 'comunidade'
            });
        });

        // 12.2 Desafios da Arena (Ferramentas)
        (challengesRes.data || []).forEach(ch => {
            items.push({
                id: ch.id,
                type: 'challenge_submission',
                title: 'Submissão de Desafio da Arena',
                subtitle: 'Código/solução submetida para avaliação',
                authorName: 'Participante da Arena',
                createdAt: ch.created_at,
                axis: 'ferramentas'
            });
        });

        // 13. Propostas Wiki (Informativo)
        (propostasRes.data || []).forEach(pr => {
            items.push({
                id: pr.id,
                type: 'wiki_proposal',
                title: `Proposta Wiki: ${pr.title}`,
                subtitle: pr.motivation || 'Sem motivação',
                authorName: 'Pesquisador',
                createdAt: pr.created_at,
                axis: 'informativo'
            });
        });

        // 14. Denúncias e Reports (Informativo)
        (reportsRes.data || []).forEach(rep => {
            items.push({
                id: rep.id,
                type: 'report',
                title: `Denúncia: ${rep.item_type}`,
                subtitle: rep.reason,
                authorName: 'Alerta da Comunidade',
                createdAt: rep.created_at,
                axis: 'informativo'
            });
        });

        // Ordena tudo cronologicamente (mais antigos primeiro para resolução da fila)
        items.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

        return { success: true, items };
    } catch (err: any) {
        console.error('[Torre de Controle] Erro ao buscar fila unificada:', err);
        return { success: false, items: [], error: err.message };
    }
}

/**
 * 🔒 Gera URL assinada temporária para visualização de comprovante docente (LGPD)
 */
export async function getTeacherProofSignedUrl(path: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const auth = await requireAdminOrModerator();
    if (!auth.authorized) {
        return { success: false, error: auth.error };
    }

    if (!path) {
        return { success: false, error: 'Caminho do arquivo inválido.' };
    }

    try {
        const adminSupabase = createAdminSupabase();
        const { data, error } = await adminSupabase.storage
            .from('teacher-verifications')
            .createSignedUrl(path, 60 * 15); // 15 minutos

        if (error || !data?.signedUrl) {
            return { success: false, error: error?.message || 'Erro ao gerar link seguro para o arquivo.' };
        }

        return { success: true, url: data.signedUrl };
    } catch (err: any) {
        return { success: false, error: err.message || 'Erro ao obter comprovante.' };
    }
}

/**
 * ✉️ Executa uma decisão de moderação disparada a partir de um botão assinado (HMAC-SHA256) no E-mail da Torre de Controle.
 * Chamado exclusivamente via POST/form action para evitar execução acidental por scanners de antivírus em GET.
 */
export async function executeEmailModerationAction(token: string): Promise<{
    success: boolean;
    message?: string;
    error?: string;
    processedCount?: number;
}> {
    const { verifyEmailActionToken } = await import('@/lib/auth/email-action-token');
    const verification = verifyEmailActionToken(token);

    if (!verification.valid || !verification.payload) {
        return { success: false, error: verification.error || 'Token inválido ou expirado.' };
    }

    const payload = verification.payload;
    const adminSupabase = createAdminSupabase();

    try {
        let actionsToRun: { item_id: string; item_type: string; decision: 'approve' | 'reject'; feedback: string | null }[] = [];

        if (payload.decision === 'approve_all') {
            if (Array.isArray(payload.batchItems) && payload.batchItems.length > 0) {
                actionsToRun = payload.batchItems.map((b) => ({
                    item_id: b.itemId,
                    item_type: b.itemType,
                    decision: 'approve',
                    feedback: null,
                }));
            } else {
                return {
                    success: false,
                    error: 'Nenhum item elegível estava vinculado ao lote deste e-mail.',
                };
            }
        } else {
            actionsToRun = [
                {
                    item_id: payload.itemId,
                    item_type: payload.itemType,
                    decision: payload.decision,
                    feedback: payload.decision === 'reject' ? 'Rejeitado via ação rápida de e-mail da Torre de Controle.' : null,
                },
            ];
        }

        const { error: rpcError } = await adminSupabase.rpc('batch_moderate_queue', {
            actions: actionsToRun,
        });

        if (rpcError) {
            console.error('[EmailAction] Erro na RPC batch_moderate_queue:', rpcError);
            return { success: false, error: 'Erro ao executar a moderação no banco de dados.' };
        }

        revalidatePath('/admin');
        revalidatePath('/admin/profiles');
        revalidatePath('/lab');
        revalidatePath('/');

        return {
            success: true,
            processedCount: actionsToRun.length,
            message:
                payload.decision === 'approve_all'
                    ? `${actionsToRun.length} item(ns) do resumo foram aprovados com sucesso!`
                    : payload.decision === 'approve'
                    ? `Item "${payload.title || payload.itemId.slice(0, 8)}" aprovado com sucesso!`
                    : `Item "${payload.title || payload.itemId.slice(0, 8)}" rejeitado com sucesso!`,
        };
    } catch (err: any) {
        console.error('[EmailAction] Exceção ao processar token:', err);
        return { success: false, error: err.message || 'Erro inesperado ao processar ação.' };
    }
}



