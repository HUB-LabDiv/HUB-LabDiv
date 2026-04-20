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
import { useTelemetry } from './useTelemetry';

/**
 * 📜 useScrollTracker Hook
 * Tracks 50% and 100% scroll depth once per page view.
 */
export function useScrollTracker() {
    const { trackEvent } = useTelemetry();
    const hasTracked50 = useRef(false);
    const hasTracked90 = useRef(false);
    const hasTracked100 = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            if (typeof window === 'undefined') return;

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercent = (scrollY + windowHeight) / documentHeight * 100;

            if (scrollPercent >= 50 && !hasTracked50.current) {
                trackEvent('SCROLL_50');
                hasTracked50.current = true;
            }

            if (scrollPercent >= 90 && !hasTracked90.current) {
                trackEvent('SCROLL_90');
                hasTracked90.current = true;
            }

            if (scrollPercent >= 98 && !hasTracked100.current) { // 98% because 100% is hard to hit
                trackEvent('SCROLL_100');
                hasTracked100.current = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [trackEvent]);

    // Reset tracking on mount (useful for SPA navigation if handleScroll is in a component that remounts)
}
