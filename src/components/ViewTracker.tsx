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


import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface ViewTrackerProps {
    submissionId: string;
}

export function ViewTracker({ submissionId }: ViewTrackerProps) {
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;

        async function incrementView() {
            try {
                // Call the RPC function to increment views
                const { error } = await supabase.rpc('increment_view_count', {
                    submission_id: submissionId
                });

                if (!error) {
                    hasTracked.current = true;
                }
            } catch (err) {
                console.error('Failed to increment view count:', err);
            }
        }

        incrementView();
    }, [submissionId]);

    // This component renders nothing
    return null;
}
