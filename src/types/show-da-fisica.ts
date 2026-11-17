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

export type ShowActType = 'pre-show' | 'abertura' | 'principal' | 'encerramento';
export type MaintenanceStatus = 'disponivel' | 'manutencao' | 'indisponivel';
export type LiveStage = 'pre' | 'demo' | 'post';

export interface ExperimentOption {
    id: string;
    slug?: string;
    act: ShowActType;
    act_number?: number;
    title: string;
    subtitle: string;
    description: string;
    concept: string;
    image: string;
    image_url?: string;
    backup_image_url?: string;
    themeColor: 'green' | 'blue' | 'red' | 'amber';
    theme_color?: 'green' | 'blue' | 'red' | 'amber';
    maintenance_status?: MaintenanceStatus;
    student_explanation?: string;
    curiosities?: string[];
    video_url?: string;
    is_active?: boolean;
}

export interface DbShowExperiment {
    slug: string;
    legacy_id: string;
    act: number;
    title: string;
    subtitle: string;
    concept: string;
    description: string;
    student_explanation: string | null;
    curiosities: string[];
    video_url: string | null;
    image_url: string | null;
    backup_image_url: string | null;
    theme_color: 'red' | 'blue' | 'green' | 'amber';
    maintenance_status: MaintenanceStatus;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ShowExperimentInternals {
    experiment_slug: string;
    technical_script_md: string | null;
    safety_notes: string | null;
    setup_checklist: string[];
    maintenance_notes: string | null;
    updated_by?: string | null;
    updated_at?: string;
}

export interface ShowSelectedExperiments {
    preShow: string[];
    abertura: string[];
    principal: string[];
    encerramento: string[];
}

export interface ShowBookingPayload {
    email: string;
    schoolName: string;
    teacherName: string;
    studentCount: number;
    schoolGrade: string;
    preferredShift: '10:00' | '14:00' | 'outro';
    preferredDate?: string;
    notes?: string;
    selectedExperiments: ShowSelectedExperiments;
}

export interface ShowBookingResult {
    success: boolean;
    message: string;
    bookingId?: string;
    error?: string;
}

export interface ShowSessionData {
    id: string;
    booking_code: string;
    school_name: string;
    teacher_name: string;
    teacher_email: string;
    show_number: number;
    teacher_code: string;
    student_code: string;
    scheduled_date: string | null;
    scheduled_time: string | null;
    status: 'scheduled' | 'live' | 'completed' | 'cancelled';
    selected_experiments: ShowSelectedExperiments;
    student_count: number;
    school_grade: string | null;
    preferred_shift: string | null;
    notes: string | null;
    is_live: boolean;
    current_experiment_slug: string | null;
    live_stage: LiveStage;
    created_at: string;
}

export interface ShowStudentResponseData {
    id: string;
    session_id: string;
    experiment_id: string | null;
    stage: string | null;
    free_text_answer: string | null;
    selected_misconception_id: string | null;
    student_name: string | null;
    school_origin: string | null;
    response_kind: 'question' | 'conceptual';
    is_answered: boolean;
    is_highlighted: boolean;
    monitor_reply: string | null;
    answered_by: string | null;
    created_at: string;
}

// ==========================================
// ENTIDADES MULTI-INICIATIVA (4 EIXOS)
// ==========================================

export interface InitiativeNewsEvent {
    id: string;
    initiative_slug: string;
    slug: string;
    title: string;
    summary: string;
    content_md: string;
    category: 'noticia' | 'evento' | 'oportunidade' | 'edital';
    cover_url: string | null;
    backup_cover_url: string | null;
    event_date: string | null;
    registration_url: string | null;
    is_pinned: boolean;
    is_published: boolean;
    author_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface InitiativeGoalTask {
    id: string;
    initiative_slug: string;
    kind: 'goal' | 'task';
    category: 'roteiro_revisao' | 'roteiro_novo' | 'manutencao' | 'atendimento' | 'divulgacao' | 'geral';
    title: string;
    description: string | null;
    status: 'todo' | 'in_progress' | 'review' | 'done';
    priority: 'baixa' | 'media' | 'alta' | 'critica';
    progress_percent: number;
    target_value: number | null;
    current_value: number;
    unit_label: string | null;
    experiment_slug: string | null;
    assignee_id: string | null;
    due_date: string | null;
    semester: string | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
    assignee?: {
        name: string | null;
        email: string | null;
        avatar_url: string | null;
    };
}

export interface InitiativeShift {
    id: string;
    initiative_slug: string;
    monitor_id: string;
    weekday: number; // 1 = Seg, 2 = Ter ... 6 = Sab
    shift_slot: 'manha' | 'tarde' | 'noite';
    role_in_shift: 'apresentador' | 'apoio_palco' | 'manutencao' | 'coordenacao';
    notes: string | null;
    is_active: boolean;
    created_at: string;
    monitor?: {
        name: string | null;
        email: string | null;
        avatar_url: string | null;
    };
}

export interface InitiativeAttendance {
    id: string;
    initiative_slug: string;
    monitor_id: string;
    session_id: string | null;
    shift_date: string;
    shift_slot: 'manha' | 'tarde' | 'noite';
    status: 'escalado' | 'presente' | 'falta_justificada' | 'substituido';
    notes: string | null;
    checked_in_at: string;
    monitor?: {
        name: string | null;
        email: string | null;
    };
}

export interface InitiativeInternalRequest {
    id: string;
    initiative_slug: string;
    author_id: string | null;
    category: 'compra_insumo' | 'reparo_oficina' | 'novo_experimento' | 'melhoria_dinamica';
    title: string;
    description: string;
    urgency: 'baixa' | 'media' | 'alta' | 'critica';
    experiment_slug: string | null;
    estimated_cost: number | null;
    status: 'aberto' | 'em_analise' | 'aprovado' | 'concluido' | 'arquivado';
    coordinator_notes: string | null;
    created_at: string;
    updated_at: string;
    author?: {
        name: string | null;
        email: string | null;
    };
}

export interface InitiativeStudyMaterial {
    id: string;
    initiative_slug: string;
    front: 'estudo_operacao' | 'divulgacao_inspiracao';
    media_kind: 'roteiro_tecnico' | 'manual_seguranca' | 'demo_interna' | 'midia_bruta' | 'documentario_ref' | 'inspiracao_post';
    title: string;
    description: string | null;
    experiment_slug: string | null;
    file_url: string | null;
    backup_url: string | null;
    external_url: string | null;
    tags: string[];
    author_id: string | null;
    created_at: string;
}

export interface InitiativeTeamRole {
    id: string;
    initiative_slug: string;
    profile_id: string;
    sub_role: 'coordenador' | 'apresentador' | 'apoio_palco' | 'oficina_manutencao' | 'divulgacao';
    role_title: string | null;
    custom_bio: string | null;
    is_public_showcase: boolean;
    display_order: number;
    updated_at: string;
    profile?: {
        name: string | null;
        email: string | null;
        avatar_url: string | null;
        role: string;
    };
}
