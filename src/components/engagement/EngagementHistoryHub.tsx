'use client';

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


import React from 'react';
import { ViewTracker } from '@/components/ViewTracker';
import { ReadingHistoryTracker } from '@/components/history/ReadingHistoryTracker';

interface EngagementHistoryHubProps {
    submissionId: string;
    userId: string | undefined;
}

/**
 * Hub para trackers do lado do cliente.
 * Deve ser importado via 'dynamic' com { ssr: false } para garantir
 * que o tracking ocorra apenas no ambiente do browser.
 */
const EngagementHistoryHub = ({ submissionId, userId }: EngagementHistoryHubProps) => {
    return (
        <>
            <ViewTracker submissionId={submissionId} />
            {userId && <ReadingHistoryTracker submissionId={submissionId} userId={userId} />}
        </>
    );
};

export default EngagementHistoryHub;
