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

/**
 * SINGLE SOURCE OF TRUTH: Centralized Type Definitions
 * Hub Lab-Div IFUSP
 */

export type SubmissionStatus = 'pendente' | 'aprovado' | 'rejeitado';
export type MediaType = 'image' | 'video' | 'pdf' | 'text' | 'link' | 'zip' | 'sdocx';

export interface HobbyCard {
    id: string;
    type: 'photo' | 'video' | 'music' | 'text' | 'link';
    url: string;
    title: string;
    description?: string;
}

export type UserPersona = 'aluno' | 'professor' | 'curioso' | 'iniciativa';
export type TeacherVerificationStatus = 'none' | 'pending' | 'approved' | 'rejected';
export type InitiativeId = 'labdiv' | 'show_da_fisica' | 'hs' | 'profis';

export interface InitiativeRequest {
    id: string;
    user_id?: string;
    initiative_name: string;
    acronym?: string;
    description: string;
    responsible_name: string;
    contact_info: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_feedback?: string;
    reviewed_by?: string;
    reviewed_at?: string;
    created_at: string;
}

export interface Profile {
    id: string;
    email: string;
    full_name?: string;
    username?: string;
    use_nickname?: boolean;
    avatar_url?: string;
    bio?: string;
    institute?: string;
    xp?: number;
    level?: number;
    is_usp_member: boolean;
    entrance_year?: number;
    course?: string;
    whatsapp?: string;
    lattes_url?: string;
    linkedin_url?: string;
    github_url?: string;
    youtube_url?: string;
    tiktok_url?: string;
    instagram_url?: string;
    portfolio_url?: string;
    usp_proof_url?: string;
    available_to_mentor: boolean;
    seeking_mentor: boolean;
    education_level?: string;
    external_institution?: string;
    school_year?: string;
    objective?: string;
    interests: string[];
    artistic_interests: string[];
    role: string; // 'user', 'admin', 'moderator'
    is_labdiv: boolean;
    is_visible: boolean;
    is_public: boolean;
    review_status: 'pending' | 'approved' | 'rejected';
    cultural_language?: string;
    bio_draft?: string;
    completion_year?: number;
    major?: string;
    usp_status?: string;
    has_scholarship: boolean;
    seeking_scholarship: boolean;
    interest_in_team: boolean;
    user_category: 'curioso' | 'licenciatura' | 'bacharelado' | 'pos_graduacao' | 'docente_pesquisador' | 'aluno_usp' | 'pesquisador' | 'fisica_medica' | 'outro_instituto';
    persona: UserPersona;
    teacher_proof_path?: string;
    teacher_verification_status?: TeacherVerificationStatus;
    verified_at?: string;
    verified_by?: string;
    seeking_ic: boolean;
    seeking_assistant: boolean;
    ic_research_area?: string;
    ic_preferred_department?: string;
    ic_preferred_lab?: string;
    ic_letter_of_interest?: string;
    
    // Researcher fields (New Sprint V3.2.2)
    research_line?: string;
    office_room?: string;
    laboratory_name?: string;
    department?: string;

    interest_area?: string;
    areas_of_interest?: string[];
    member_initiatives?: string[];
    pending_edits?: any;
    hobbies_gallery?: HobbyCard[];
    is_adult?: boolean;
    accepted_terms_version?: string;
    accepted_at?: string;
    cpf_hash?: string;
    birthdate?: string;
    guardian_email?: string;
    push_token?: string;
    created_at: string;
}

export interface Freshman {
    id: string;
    full_name?: string;
    username?: string;
    use_nickname?: boolean;
    avatar_url?: string;
    course?: string;
    institute?: string;
    entrance_year?: number;
    bio?: string;
    whatsapp?: string;
    email?: string;
    xp?: number;
    level?: number;
    is_labdiv?: boolean;
    adoptionStatus?: 'pending' | 'approved' | 'rejected';
}

export interface Submission {
    id: string;
    user_id?: string;
    title: string;
    authors: string;
    description: string;
    category?: string;
    institute?: string;
    media_type: MediaType;
    media_url: string;
    status: SubmissionStatus;
    admin_feedback?: string;
    whatsapp?: string;
    external_link?: string;
    technical_details?: string;
    alt_text?: string;
    testimonial?: string;
    is_featured: boolean;
    view_count?: number;
    tags?: string[];
    reading_time?: number;
    co_author_ids?: string[];
    use_pseudonym?: boolean;
    event_date?: string;
    location_lat?: number;
    location_lng?: number;
    location_name?: string;
    ocr_content?: string;
    ai_suggested_tags?: string[];
    ai_suggested_alt?: string;
    ai_status?: 'pending' | 'processing' | 'completed' | 'error';
    ai_last_processed?: string;
    pending_edits?: any;
    created_at: string;
}

export interface ReadingHistory {
    id: string;
    user_id: string;
    submission_id: string;
    progress_percent: number;
    last_accessed_at: string;
}

export interface Comment {
    id: string;
    submission_id: string;
    user_id?: string;
    author_name: string;
    content: string;
    status: SubmissionStatus;
    inline_paragraph_id?: string;
    created_at: string;
}


export interface Correction {
    id: string;
    user_id: string;
    submission_id: string;
    original_text: string;
    suggested_text: string;
    comment?: string;
    status: 'pendente' | 'aceito' | 'rejeitado';
    created_at: string;
}

export interface PrivateNote {
    id: string;
    user_id: string;
    submission_id: string;
    selection_hash: string;
    note_text: string;
    created_at: string;
}

// 🏛️ O GRANDE COLISOR (Wiki Schema)
export interface WikiArticle {
    id: string;
    parent_id?: string;
    title: string;
    slug: string;
    content: string;
    technical_metadata: {
        equipment_id?: string;
        lab_room?: string;
        safety_level: number;
    };
    is_stable: boolean;
    author_id?: string;
    created_at: string;
    updated_at: string;
}

export interface WikiCitation {
    id: string;
    source_article_id: string;
    target_article_id: string;
    citation_type: 'reference' | 'equipment' | 'lab' | 'theory';
    created_at: string;
}

// 🛰️ EMARANHAMENTO (Chat)
export interface EntanglementMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    attachment_particle_id?: string;
    attachment_type?: 'particle' | 'article';
    is_read: boolean;
    created_at: string;
}

export interface MicroArticle {
    id: string;
    author_id: string;
    content: string;
    likes_count: number;
    created_at: string;
    author?: Profile;
}

// 🚀 TRILHAS (Learning Trails)
export interface Trail {
    id: string;
    title: string;
    description: string | null;
    axis: string;
    category: 'obrigatoria' | 'eletiva' | 'livre';
    category_map?: Record<string, 'obrigatoria' | 'eletiva' | 'livre' | 'nao_se_aplica'>;
    course_code: string | null;
    effectiveCategory?: 'obrigatoria' | 'eletiva' | 'livre';
    excitation_level: number | null;
    status: 'em_orbita' | 'estavel';
    credits_aula: number;
    credits_trabalho: number;
    submissionCount: number;
    created_at: string;
    equivalence_group: string | null;
    prerequisites: string[] | null;
    equivalency_map?: Record<string, { codes: string[]; logic: 'AND' | 'OR' }>;
}

// ALIASES PARA V3.2.0
export type Particle = Submission;

// PERSONALIZAÇÃO TEMAS
export type ThemeInstitution = 'ifusp' | 'ime' | 'iag' | 'igc' | 'io';

export interface PersonalizacaoStoreState {
    institution: ThemeInstitution;
    setInstitution: (inst: ThemeInstitution) => void;
}

// 🛡️ TORRE DE CONTROLE & MODERAÇÃO UNIFICADA
export type ModerationItemType = 
    | 'submission'
    | 'submission_edit'
    | 'profile'
    | 'profile_edit'
    | 'teacher_verification'
    | 'initiative_request'
    | 'comment'
    | 'software'
    | 'software_feedback'
    | 'oportunidade'
    | 'dica'
    | 'micro_article'
    | 'pergunta'
    | 'palavra_geradora'
    | 'constelacao_edge'
    | 'challenge_submission'
    | 'wiki_proposal'
    | 'report';

export interface ModerationQueueItem {
    id: string;
    type: ModerationItemType;
    title: string;
    subtitle: string;
    authorName: string;
    authorEmail?: string;
    createdAt: string;
    details?: Record<string, any>;
    proofPath?: string;
    facultyMatch?: any;
    axis: 'comunidade' | 'informativo' | 'ferramentas' | 'personas';
}

export interface QueueDecision {
    itemId: string;
    itemType: ModerationItemType;
    decision: 'approve' | 'reject';
    feedback?: string;
    proofPath?: string;
    editedPayload?: Record<string, any>;
}
