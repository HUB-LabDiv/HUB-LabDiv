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

export interface SoftwareFeature {
    title: string;
    description: string;
}

export type SoftwareCategory = 
    | 'Física & Simulação'
    | 'Produtividade'
    | 'Cálculo & Matemática'
    | 'Geometria & Álgebra'
    | 'Química & Biologia'
    | 'Utilidades'
    | string;

export type SoftwareType = 'comunitario' | 'essencial';

export interface AcademicSoftware {
    id: string;
    title: string;
    slug: string;
    tagline: string;
    description: string;
    guide_markdown?: string | null;
    author_name: string;
    author_id?: string | null;
    category: SoftwareCategory;
    software_type: SoftwareType;
    pricing_type?: string | null;
    platforms: string[];
    access_url: string;
    download_url?: string | null;
    repository_url?: string | null;
    docs_url?: string | null;
    banner_url?: string | null;
    logo_url?: string | null;
    screenshots: string[];
    tags: string[];
    target_audience: string[];
    features_list: SoftwareFeature[];
    status: 'pendente' | 'aprovado' | 'rejeitado';
    submitted_by?: string | null;
    is_featured: boolean;
    upvotes_count: number;
    has_upvoted?: boolean;
    feedback_count?: number;
    created_at: string;
    updated_at: string;
    author_profile?: {
        avatar_url?: string | null;
        username?: string | null;
        full_name?: string | null;
        institute?: string | null;
    } | null;
}

export interface SoftwareFeedback {
    id: string;
    software_id: string;
    user_id: string;
    rating?: number | null;
    experience_level?: string | null;
    comment: string;
    feedback_type: 'review' | 'bug_report' | 'suggestion' | 'test_feedback';
    created_at: string;
    user_profile?: {
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
        user_category?: string | null;
        institute?: string | null;
    } | null;
}

export interface SubmitSoftwareInput {
    title: string;
    tagline: string;
    description: string;
    author_name: string;
    category: string;
    software_type: 'comunitario' | 'essencial';
    pricing_type?: string;
    platforms: string[];
    access_url: string;
    repository_url?: string;
    docs_url?: string;
    tags: string[];
    target_audience: string[];
    guide_markdown?: string;
    features_list?: SoftwareFeature[];
    screenshots?: string[];
}
