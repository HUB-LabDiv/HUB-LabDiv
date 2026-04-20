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


import { supabase } from '@/lib/supabase';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

/**
 * 🛰️ Telemetry Level 3 & 4 - useTelemetry Hook
 * Enhanced tracking for behavioral analytics and dissertation metrics.
 */
export function useTelemetry() {
    const pathname = usePathname();
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Initialize/Get Session ID from sessionStorage
    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        let sid = sessionStorage.getItem('telemetry_session_id');
        if (!sid) {
            sid = window.crypto?.randomUUID ? window.crypto.randomUUID() : 'temp-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('telemetry_session_id', sid);
        }
        setSessionId(sid);
    }, []);

    const trackEvent = useCallback(async (
        eventType: 'SEARCH_QUERY' | 'SCROLL_50' | 'SCROLL_90' | 'SCROLL_100' | 'TIME_ON_PAGE' | 'FILE_DOWNLOAD' | 'DEPT_FILTER' | 'TAB_CHANGE' | 'SEARCH_SUCCESS' | 'SEARCH_FAIL' | 'RAGE_CLICK' | 'HOVER_INTENT' | 'TOOLTIP_VIEWED' | 'TEXT_COPIED' | 'FIRST_ACTION_TAKEN' | 'FORM_ABANDONMENT' | 'LINK_SHARED' | 'CONTENT_RATING' | 'AUDIO_PLAY' | 'AUDIO_PAUSE' | 'AUDIO_ENDED' | 'IMAGE_VIEW_DETAIL',
        metadata: any = {}
    ) => {
        // Fire-and-forget
        const fire = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const originPath = typeof window !== 'undefined' ? sessionStorage.getItem('last_telemetry_path') : null;
                
                await supabase.from('telemetry_events').insert({
                    user_id: session?.user?.id || null,
                    session_id: sessionId,
                    event_type: eventType,
                    metadata: {
                        ...metadata,
                        viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
                        origin_path: metadata.origin_path || originPath,
                        timestamp: Date.now()
                    },
                    url: pathname,
                });

                // Update last path after tracking
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('last_telemetry_path', pathname);
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.warn(`[Telemetry] Failed to track ${eventType}:`, error);
                }
            }
        };

        fire();
    }, [pathname, sessionId]);

    return { trackEvent };
}
