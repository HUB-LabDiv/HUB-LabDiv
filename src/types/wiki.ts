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

import { ReactNode } from 'react';

export interface Department {
    id: 'FAP' | 'FMT' | 'FEP' | 'FGE' | 'FMA' | 'FNC';
    name: string;
    description: string;
    icon: ReactNode;
    metrics: {
        researchers: number;
        labs: number;
    };
    color: string;
}

export interface TimelineEvent {
    year: string;
    title: string;
    description: string;
    category?: 'founding' | 'milestone' | 'discovery' | 'innovation';
}

export interface SemanticNode {
    id: string;
    label: string;
    type: 'post' | 'researcher' | 'lab' | 'line' | 'department';
    icon?: ReactNode;
}

export interface SemanticConnection {
    from: string;
    to: string;
}

export type WikiProposalType = 'new_topic' | 'complement' | 'related_topic';
export type WikiProposalStatus = 'pending' | 'approved' | 'rejected';

export interface WikiTopicProposal {
    id: string;
    user_id?: string | null;
    author_name: string;
    author_email?: string | null;
    proposal_type: WikiProposalType;
    target_topic_id?: string | null;
    target_topic_title?: string | null;
    title: string;
    category: string;
    description: string;
    justification?: string | null;
    status: WikiProposalStatus;
    admin_feedback?: string | null;
    reviewed_by?: string | null;
    reviewed_at?: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateWikiProposalDTO {
    author_name: string;
    author_email?: string;
    proposal_type: WikiProposalType;
    target_topic_id?: string;
    target_topic_title?: string;
    title: string;
    category: string;
    description: string;
    justification?: string;
}

