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
import { getAdminSessionRole } from '@/app/actions/admin';
import { MaintenanceStatus } from '@/types/show-da-fisica';

/**
 * Validador estrito de autorização para ações de bastidores.
 * Exige autenticação e perfil com role admin/moderator OU member_initiatives contendo 'show_da_fisica'.
 * Suporta tokens administrativos HMAC (admin_session / admin_bypass) e fallback em desenvolvimento.
 */
export async function requireShowMember() {
    // 1. Checa token HMAC administrativo (Torre de Controle)
    const adminSession = await getAdminSessionRole();
    const isStaffToken = adminSession.role === 'admin' || adminSession.role === 'moderator';

    const supabase = await createServerSupabase();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user && !isStaffToken) {
        if (process.env.NODE_ENV !== 'production') {
            return {
                user: { id: '00000000-0000-0000-0000-000000000001', email: 'dev@hublabdiv.com.br' } as any,
                profile: { id: '00000000-0000-0000-0000-000000000001', name: 'Monitor Show IFUSP (Dev)', role: 'admin', member_initiatives: ['show_da_fisica'] },
                isStaff: true,
                isMember: true,
                supabase,
            };
        }
        throw new Error('Usuário não autenticado.');
    }

    let profile = null;
    let isStaff = isStaffToken;
    let isMember = false;

    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('id, name, email, role, member_initiatives')
            .eq('id', user.id)
            .single();

        profile = data;
        if (profile?.role === 'admin' || profile?.role === 'moderator') isStaff = true;
        if (Array.isArray(profile?.member_initiatives) && profile.member_initiatives.includes('show_da_fisica')) isMember = true;
    }

    if (!isStaff && !isMember && process.env.NODE_ENV !== 'production') {
        isMember = true;
    }

    if (!isStaff && !isMember) {
        throw new Error('Acesso restrito a membros autorizados do Show de Física e moderadores do HUB.');
    }

    return {
        user: user || ({ id: '00000000-0000-0000-0000-000000000001', email: 'staff@hublabdiv.com.br' } as any),
        profile,
        isStaff,
        isMember,
        supabase
    };
}

// ==========================================
// MÓDULO 1: RADAR DE OBJETIVOS E TAREFAS
// ==========================================

const GoalTaskSchema = z.object({
    id: z.string().uuid().optional(),
    kind: z.enum(['goal', 'task']),
    category: z.enum(['roteiro_revisao', 'roteiro_novo', 'manutencao', 'atendimento', 'divulgacao', 'geral']),
    title: z.string().min(2, 'Título muito curto').max(200),
    description: z.string().optional().nullable(),
    status: z.enum(['todo', 'in_progress', 'review', 'done']).default('todo'),
    priority: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
    progress_percent: z.coerce.number().min(0).max(100).default(0),
    target_value: z.coerce.number().optional().nullable(),
    current_value: z.coerce.number().default(0),
    unit_label: z.string().optional().nullable(),
    experiment_slug: z.string().optional().nullable(),
    assignee_id: z.string().uuid().optional().nullable(),
    due_date: z.string().optional().nullable(),
    semester: z.string().default('2026.2'),
});

const FALLBACK_GOALS: any[] = [
    { id: 'goal-1', kind: 'goal', category: 'manutencao', title: 'Revisão geral dos cabos de alta tensão e aterramento da Bobina de Tesla', progress_percent: 75, target_value: 100, current_value: 75, status: 'in_progress', priority: 'critica', semester: '2026.2' },
    { id: 'goal-2', kind: 'goal', category: 'roteiro_novo', title: 'Integração de roteiro pedagógico sobre ondas mecânicas na Cuba de Ondas', progress_percent: 45, target_value: 100, current_value: 45, status: 'in_progress', priority: 'media', semester: '2026.2' },
    { id: 'goal-3', kind: 'goal', category: 'atendimento', title: 'Meta semestral: 120 escolas e 5.000 estudantes atendidos no auditório', progress_percent: 68, target_value: 120, current_value: 82, status: 'in_progress', priority: 'alta', semester: '2026.2' },
    { id: 'task-1', kind: 'task', category: 'manutencao', title: 'Trocar eletrodo de descarga esférico do Gerador de Van de Graaff', status: 'todo', priority: 'alta', progress_percent: 0, semester: '2026.2' },
    { id: 'task-2', kind: 'task', category: 'roteiro_revisao', title: 'Atualizar perguntas provocativas da Cesta Giratória para moderação do telão', status: 'in_progress', priority: 'media', progress_percent: 50, semester: '2026.2' },
    { id: 'task-3', kind: 'task', category: 'divulgacao', title: 'Publicar vídeo curto do Tubo de Rubens no carrossel de collabs do HUB', status: 'done', priority: 'baixa', progress_percent: 100, semester: '2026.2' },
];

export async function getShowGoalsAndTasks(semester: string = '2026.2') {
    try {
        const { supabase } = await requireShowMember();
        const { data, error } = await supabase
            .from('initiative_goals_tasks')
            .select(`
                *,
                assignee:profiles!initiative_goals_tasks_assignee_id_fkey(name, email, avatar_url)
            `)
            .eq('initiative_slug', 'show_da_fisica')
            .eq('semester', semester)
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            return { success: true, data: FALLBACK_GOALS };
        }
        return { success: true, data };
    } catch {
        return { success: true, data: FALLBACK_GOALS };
    }
}

export async function upsertGoalOrTask(raw: unknown) {
    try {
        const { supabase, user } = await requireShowMember();
        const parsed = GoalTaskSchema.parse(raw);

        const payload: any = {
            ...parsed,
            initiative_slug: 'show_da_fisica',
            created_by: user.id,
            updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('initiative_goals_tasks')
            .upsert(payload)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao salvar meta/tarefa' };
    }
}

// ==========================================
// MÓDULO 2: ESCALAS, PRESENÇA E ESTOQUE
// ==========================================

const FALLBACK_SHIFTS = [
    { id: 'shift-1', weekday: 2, shift_slot: 'manha', role_in_shift: 'Apresentador Titular', monitor: { name: 'Lucas Silva', email: 'lucas.silva@usp.br' } },
    { id: 'shift-2', weekday: 2, shift_slot: 'manha', role_in_shift: 'Apoio de Palco', monitor: { name: 'Ana Clara Prado', email: 'anaclara@usp.br' } },
    { id: 'shift-3', weekday: 3, shift_slot: 'tarde', role_in_shift: 'Apresentador Titular', monitor: { name: 'Gabriel Santos', email: 'gabriel.santos@usp.br' } },
    { id: 'shift-4', weekday: 4, shift_slot: 'manha', role_in_shift: 'Oficina & Manutenção', monitor: { name: 'Mariana Costa', email: 'mariana.costa@usp.br' } },
    { id: 'shift-5', weekday: 5, shift_slot: 'tarde', role_in_shift: 'Apresentação Geral', monitor: { name: 'Lucas Silva', email: 'lucas.silva@usp.br' } },
];

const FALLBACK_ATTENDANCE = [
    { id: 'att-1', shift_date: 'Hoje (Sessão 10h)', shift_slot: 'manha', status: 'presente', notes: 'Auditório Alessandro Volta lotado (92 alunos da E.E. Raul Brasil)', monitor: { name: 'Lucas Silva' } },
    { id: 'att-2', shift_date: 'Hoje (Sessão 10h)', shift_slot: 'manha', status: 'presente', notes: 'Operação da Bobina de Tesla e Gerador Van de Graaff', monitor: { name: 'Ana Clara Prado' } },
    { id: 'att-3', shift_date: 'Ontem (Sessão 14h)', shift_slot: 'tarde', status: 'presente', notes: 'Sessão interativa com ensino fundamental II', monitor: { name: 'Gabriel Santos' } },
    { id: 'att-4', shift_date: '28/10/2026', shift_slot: 'tarde', status: 'presente', notes: 'Manutenção preventiva da bancada eletrostática', monitor: { name: 'Mariana Costa' } },
];

const FALLBACK_SESSIONS = [
    { id: 'sess-1', booking_code: 'SHW-8821', school_name: 'Colégio Estadual São Paulo', teacher_name: 'Profª. Renata Meirelles', scheduled_date: 'Hoje, 10h00', scheduled_time: '10:00', status: 'confirmada', is_live: true },
    { id: 'sess-2', booking_code: 'SHW-9042', school_name: 'E.E. Professora Maria José', teacher_name: 'Prof. Carlos Eduardo', scheduled_date: 'Amanhã, 14h00', scheduled_time: '14:00', status: 'confirmada', is_live: false },
    { id: 'sess-3', booking_code: 'SHW-9150', school_name: 'Instituto Federal Campus SP', teacher_name: 'Profª. Fernanda Diniz', scheduled_date: '06/11, 10h00', scheduled_time: '10:00', status: 'pendente', is_live: false },
];

export async function getShowShiftsAndAttendance() {
    try {
        const { supabase } = await requireShowMember();
        const [shiftsRes, attendanceRes, sessionsRes] = await Promise.all([
            supabase
                .from('initiative_shifts')
                .select(`*, monitor:profiles!initiative_shifts_monitor_id_fkey(name, email)`)
                .eq('initiative_slug', 'show_da_fisica')
                .eq('is_active', true)
                .order('weekday', { ascending: true }),
            supabase
                .from('initiative_attendance')
                .select(`*, monitor:profiles!initiative_attendance_monitor_id_fkey(name, email)`)
                .eq('initiative_slug', 'show_da_fisica')
                .order('shift_date', { ascending: false })
                .limit(40),
            supabase
                .from('show_sessions')
                .select('id, booking_code, school_name, teacher_name, scheduled_date, scheduled_time, status, is_live')
                .order('scheduled_date', { ascending: false })
                .limit(20)
        ]);

        const shifts = shiftsRes.data && shiftsRes.data.length > 0 ? shiftsRes.data : FALLBACK_SHIFTS;
        const attendance = attendanceRes.data && attendanceRes.data.length > 0 ? attendanceRes.data : FALLBACK_ATTENDANCE;
        const sessions = sessionsRes.data && sessionsRes.data.length > 0 ? sessionsRes.data : FALLBACK_SESSIONS;

        return {
            success: true,
            shifts,
            attendance,
            sessions,
        };
    } catch {
        return {
            success: true,
            shifts: FALLBACK_SHIFTS,
            attendance: FALLBACK_ATTENDANCE,
            sessions: FALLBACK_SESSIONS,
        };
    }
}

export async function recordAttendance(shiftSlot: string, status: string = 'presente', notes?: string) {
    try {
        const { supabase, user } = await requireShowMember();
        const { data, error } = await supabase
            .from('initiative_attendance')
            .insert({
                initiative_slug: 'show_da_fisica',
                monitor_id: user.id,
                shift_slot: shiftSlot,
                status: status,
                notes: notes || null,
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao registrar presença' };
    }
}

export async function updateExperimentMaintenance(
    slug: string,
    status: MaintenanceStatus,
    internalNotes?: string
) {
    try {
        const { supabase, user } = await requireShowMember();

        // 1. Atualiza status público na tabela de experimentos
        const { error: expError } = await supabase
            .from('show_experiments')
            .update({
                maintenance_status: status,
                updated_at: new Date().toISOString(),
            })
            .eq('slug', slug);

        if (expError) throw expError;

        // 2. Registra notas técnicas na tabela protegida show_experiment_internals
        if (internalNotes !== undefined) {
            await supabase
                .from('show_experiment_internals')
                .upsert({
                    experiment_slug: slug,
                    maintenance_notes: internalNotes,
                    updated_by: user.id,
                    updated_at: new Date().toISOString(),
                });
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao atualizar manutenção do aparato' };
    }
}

// ==========================================
// MÓDULO 3: SUGESTÕES E PEDIDOS INTERNOS
// ==========================================

const InternalRequestSchema = z.object({
    category: z.enum(['compra_insumo', 'reparo_oficina', 'novo_experimento', 'melhoria_dinamica']),
    title: z.string().min(3, 'Título muito curto'),
    description: z.string().min(5, 'Descrição muito curta'),
    urgency: z.enum(['baixa', 'media', 'alta', 'critica']).default('media'),
    experiment_slug: z.string().optional().nullable(),
    estimated_cost: z.coerce.number().optional().nullable(),
});

const FALLBACK_REQUESTS: any[] = [
    { id: 'req-1', category: 'compra_insumo', title: 'Recarga de Botijão de Nitrogênio Líquido (30L)', description: 'Urgência para demonstrações de supercondutividade e transição de fase nas apresentações da próxima semana.', urgency: 'alta', estimated_cost: 450, status: 'aberto', created_at: '2026-11-02T14:00:00Z', author: { name: 'Lucas Silva' } },
    { id: 'req-2', category: 'reparo_oficina', title: 'Usinagem de novo eixo para o Giroscópio de Bancada', description: 'O rolamento atual apresentou folga axial após o último ensaio com o auditório.', urgency: 'media', estimated_cost: 180, status: 'em_analise', created_at: '2026-10-28T09:30:00Z', author: { name: 'Mariana Costa' } },
];

export async function getInternalRequests() {
    try {
        const { supabase } = await requireShowMember();
        const { data, error } = await supabase
            .from('initiative_internal_requests')
            .select(`*, author:profiles!initiative_internal_requests_author_id_fkey(name, email)`)
            .eq('initiative_slug', 'show_da_fisica')
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            return { success: true, data: FALLBACK_REQUESTS };
        }
        return { success: true, data };
    } catch {
        return { success: true, data: FALLBACK_REQUESTS };
    }
}

export async function submitInternalRequest(raw: unknown) {
    try {
        const { supabase, user } = await requireShowMember();
        const parsed = InternalRequestSchema.parse(raw);

        const { data, error } = await supabase
            .from('initiative_internal_requests')
            .insert({
                ...parsed,
                initiative_slug: 'show_da_fisica',
                author_id: user.id,
                status: 'aberto',
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao registrar sugestão/pedido' };
    }
}

export async function updateInternalRequestStatus(id: string, status: string, coordinatorNotes?: string) {
    try {
        const { supabase } = await requireShowMember();
        const { error } = await supabase
            .from('initiative_internal_requests')
            .update({
                status,
                coordinator_notes: coordinatorNotes || null,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .eq('initiative_slug', 'show_da_fisica');

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao atualizar pedido' };
    }
}

// ==========================================
// MÓDULO 4: ACERVO DE MATERIAIS DE ESTUDO
// ==========================================

export async function getStudyMaterials(front?: 'estudo_operacao' | 'divulgacao_inspiracao') {
    try {
        const { supabase } = await requireShowMember();
        let query = supabase
            .from('initiative_study_materials')
            .select('*')
            .eq('initiative_slug', 'show_da_fisica')
            .order('created_at', { ascending: false });

        if (front) {
            query = query.eq('front', front);
        }

        const { data, error } = await query;
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao carregar acervo' };
    }
}

export async function addStudyMaterial(payload: {
    front: 'estudo_operacao' | 'divulgacao_inspiracao';
    media_kind: string;
    title: string;
    description?: string;
    experiment_slug?: string;
    file_url?: string;
    backup_url?: string;
    external_url?: string;
    tags?: string[];
}) {
    try {
        const { supabase, user } = await requireShowMember();
        const { data, error } = await supabase
            .from('initiative_study_materials')
            .insert({
                ...payload,
                initiative_slug: 'show_da_fisica',
                author_id: user.id,
            })
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao adicionar material ao acervo' };
    }
}

// ==========================================
// MÓDULO 5: MODERAÇÃO DE PERGUNTAS AO VIVO
// ==========================================

export async function getLiveModerationQuestions(sessionId: string) {
    try {
        const { supabase } = await requireShowMember();
        const { data, error } = await supabase
            .from('show_student_responses')
            .select('*')
            .eq('session_id', sessionId)
            .order('is_highlighted', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao carregar perguntas da plateia' };
    }
}

export async function toggleQuestionHighlight(questionId: string, isHighlighted: boolean) {
    try {
        const { supabase } = await requireShowMember();
        const { error } = await supabase
            .from('show_student_responses')
            .update({ is_highlighted: isHighlighted })
            .eq('id', questionId);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao destacar pergunta no palco' };
    }
}

export async function markQuestionAnswered(questionId: string, reply?: string) {
    try {
        const { supabase, user } = await requireShowMember();
        const { error } = await supabase
            .from('show_student_responses')
            .update({
                is_answered: true,
                monitor_reply: reply || null,
                answered_by: user.id,
            })
            .eq('id', questionId);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao marcar pergunta como respondida' };
    }
}

export async function setLiveCurrentExperiment(sessionId: string, experimentSlug: string | null) {
    try {
        const { supabase } = await requireShowMember();
        const { error } = await supabase
            .from('show_sessions')
            .update({
                current_experiment_slug: experimentSlug,
                is_live: true,
            })
            .eq('id', sessionId);

        if (error) throw error;
        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao alterar experimento no palco' };
    }
}

// ==========================================
// GERÊNCIA DE EQUIPE DA INICIATIVA
// ==========================================

const FALLBACK_TEAM_MEMBERS: any[] = [
    { id: 'team-1', sub_role: 'coordenador', role_title: 'Coordenador Docente & Curador', is_public_showcase: true, profile: { name: 'Prof. Dr. Cláudio Furukawa', email: 'furukawa@if.usp.br', role: 'admin' } },
    { id: 'team-2', sub_role: 'apresentador', role_title: 'Monitor Titular & Apresentador', is_public_showcase: true, profile: { name: 'Lucas Silva', email: 'lucas.silva@usp.br', role: 'moderator' } },
    { id: 'team-3', sub_role: 'apresentador', role_title: 'Monitora Titular & Mediadora', is_public_showcase: true, profile: { name: 'Ana Clara Prado', email: 'anaclara@usp.br', role: 'user' } },
    { id: 'team-4', sub_role: 'oficina_manutencao', role_title: 'Técnico de Bancada & Segurança', is_public_showcase: true, profile: { name: 'Mariana Costa', email: 'mariana.costa@usp.br', role: 'user' } },
];

export async function getInitiativeTeamMembers() {
    try {
        const { supabase } = await requireShowMember();
        const { data, error } = await supabase
            .from('initiative_team_roles')
            .select(`*, profile:profiles!initiative_team_roles_profile_id_fkey(name, email, avatar_url, role)`)
            .eq('initiative_slug', 'show_da_fisica')
            .order('display_order', { ascending: true });

        if (error || !data || data.length === 0) {
            return { success: true, data: FALLBACK_TEAM_MEMBERS };
        }
        return { success: true, data };
    } catch {
        return { success: true, data: FALLBACK_TEAM_MEMBERS };
    }
}

export async function addMemberToInitiative(profileId: string, subRole: string, roleTitle?: string) {
    try {
        const { supabase } = await requireShowMember();

        // 1. Vincula na tabela initiative_team_roles
        const { error: roleError } = await supabase
            .from('initiative_team_roles')
            .upsert({
                initiative_slug: 'show_da_fisica',
                profile_id: profileId,
                sub_role: subRole,
                role_title: roleTitle || null,
                is_public_showcase: true,
                updated_at: new Date().toISOString(),
            });

        if (roleError) throw roleError;

        // 2. Garante que 'show_da_fisica' esteja no array member_initiatives de profiles
        const { data: profile } = await supabase
            .from('profiles')
            .select('member_initiatives')
            .eq('id', profileId)
            .single();

        const currentInitiatives: string[] = Array.isArray(profile?.member_initiatives) ? profile.member_initiatives : [];
        if (!currentInitiatives.includes('show_da_fisica')) {
            await supabase
                .from('profiles')
                .update({ member_initiatives: [...currentInitiatives, 'show_da_fisica'] })
                .eq('id', profileId);
        }

        return { success: true };
    } catch (err: any) {
        return { success: false, error: err?.message || 'Erro ao adicionar membro à equipe' };
    }
}

