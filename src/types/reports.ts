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

export type FeedbackReportType = 'bug' | 'sugestao' | 'suggestion' | 'outro';
export type FeedbackReportStatus = 'open' | 'in_progress' | 'closed';

export interface FeedbackReport {
    id: string;
    user_id?: string | null;
    type: FeedbackReportType | string;
    description: string;
    screenshot_url?: string | null;
    status: FeedbackReportStatus | string;
    metadata?: {
        user_email?: string;
        user_agent?: string;
        url?: string;
        platform?: string;
        context?: {
            id?: string;
            titulo?: string;
            local?: string;
            [key: string]: any;
        };
        [key: string]: any;
    } | null;
    created_at: string;
    updated_at?: string;
    profiles?: {
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
    } | null;
}

export type ContentReportCategory =
    | 'spam'
    | 'plagio'
    | 'discurso_odio'
    | 'assedio'
    | 'desinformacao'
    | 'abuso_infantil'
    | 'outro';

export type ContentReportStatus = 'pendente' | 'em_analise' | 'resolvido' | 'descartado';

export interface ContentReport {
    id: string;
    reporter_id?: string | null;
    reported_item_id?: string;
    submission_id?: string;
    item_type?: 'submission' | 'micro_article' | 'comment' | 'pergunta' | 'emaranhamento_message' | string;
    category: ContentReportCategory | string;
    reason?: string;
    justification?: string;
    status: ContentReportStatus | string;
    metadata?: any;
    created_at: string;
    profiles?: {
        full_name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
    } | null;
}

export interface UnifiedReportItem {
    id: string;
    source: 'feedback' | 'content';
    title: string;
    typeOrCategory: string;
    description: string;
    status: string;
    reporterName: string;
    reporterEmail?: string;
    url?: string;
    screenshotUrl?: string;
    wikiContext?: {
        id?: string;
        titulo?: string;
        local?: string;
    };
    contentDetails?: {
        itemType?: string;
        reportedItemId?: string;
    };
    created_at: string;
    raw: any;
}
