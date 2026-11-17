'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect } from 'react';

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                setProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className="fixed left-0 right-0 z-[200] h-[3px] bg-transparent print:hidden pointer-events-none"
            style={{ top: 'env(safe-area-inset-top, 0px)' }}
        >
            <div
                className="h-full w-full origin-left transition-transform duration-100 ease-out"
                style={{
                    transform: `scaleX(${progress})`,
                    background: 'linear-gradient(90deg, #1F9FCF 0%, #FFCC00 50%, #F14343 100%)',
                    willChange: 'transform',
                }}
            />
        </div>
    );
}
