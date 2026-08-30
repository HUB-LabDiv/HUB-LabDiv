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

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ReadingHistoryTrackerProps {
    submissionId: string;
    userId: string;
}

export function ReadingHistoryTracker({ submissionId, userId }: ReadingHistoryTrackerProps) {
    useEffect(() => {
        if (!submissionId || !userId) return;

        const recordHistory = async () => {
            try {
                await supabase.from('reading_history').upsert(
                    {
                        user_id: userId,
                        submission_id: submissionId,
                        last_read_at: new Date().toISOString(),
                    },
                    { onConflict: 'user_id,submission_id' }
                );
            } catch (err) {
                console.error('Failed to record reading history:', err);
            }
        };

        const timer = setTimeout(recordHistory, 3000);
        return () => clearTimeout(timer);
    }, [submissionId, userId]);

    return null;
}
