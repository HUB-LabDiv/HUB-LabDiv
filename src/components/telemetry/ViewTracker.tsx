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


import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { registerPostAnalytics } from '@/app/actions/analytics';

interface ViewTrackerProps {
    submissionId: string;
}

export function ViewTracker({ submissionId }: ViewTrackerProps) {
    const hasTracked = useRef(false);
    const timeSpent = useRef(0);
    const maxScroll = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Track time spent
        intervalRef.current = setInterval(() => {
            timeSpent.current += 1;
        }, 1000);

        // Track scroll depth
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrollTop = window.scrollY;
            
            if (documentHeight > 0) {
                const depth = Math.min(100, Math.round((scrollTop / documentHeight) * 100));
                if (depth > maxScroll.current) {
                    maxScroll.current = depth;
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        if (!hasTracked.current) {
            const viewedKey = `viewed_${submissionId}`;
            const alreadyViewed = localStorage.getItem(viewedKey);

            if (!alreadyViewed) {
                async function incrementView() {
                    try {
                        const { error } = await supabase.rpc('increment_view_count', {
                            submission_id: submissionId
                        });
                        if (!error) {
                            hasTracked.current = true;
                            // Set a timestamp so we don't count again for a while (e.g., 24h)
                            localStorage.setItem(viewedKey, Date.now().toString());
                        }
                    } catch (err) {
                        console.error('Failed to increment view count:', err);
                    }
                }
                incrementView();
            } else {
                // If already viewed recently (e.g. within 24h)
                const viewedAt = parseInt(alreadyViewed, 10);
                const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
                
                if (Date.now() - viewedAt > TWENTY_FOUR_HOURS) {
                    // Expired, count again and reset
                    async function incrementViewAgain() {
                        try {
                            const { error } = await supabase.rpc('increment_view_count', {
                                submission_id: submissionId
                            });
                            if (!error) {
                                hasTracked.current = true;
                                localStorage.setItem(viewedKey, Date.now().toString());
                            }
                        } catch (err) {}
                    }
                    incrementViewAgain();
                } else {
                    hasTracked.current = true; // Mark as tracked so we don't try again this session
                }
            }
        }

        // Send analytics on unmount
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.removeEventListener('scroll', handleScroll);
            
            // Register analytics (runs asynchronously)
            registerPostAnalytics({
                submissionId,
                scrollDepth: maxScroll.current,
                timeSpentSeconds: timeSpent.current
            })
                .catch(err => console.error('Failed to register analytics:', err));
        };
    }, [submissionId]);

    // This component renders nothing
    return null;
}
