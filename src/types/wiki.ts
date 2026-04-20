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
