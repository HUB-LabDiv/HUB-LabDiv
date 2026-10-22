'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

import { Capacitor } from '@capacitor/core';

export function BootLoader() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // No aplicativo nativo (Android Capacitor), a Splash Screen nativa já cumpre esse papel
        if (typeof window !== 'undefined' && Capacitor.isNativePlatform()) {
            setIsVisible(false);
            sessionStorage.setItem('bootLoaderShown', 'true');
            return;
        }

        // Only show the bootloader once per session (upon entering the site)
        const hasShown = sessionStorage.getItem('bootLoaderShown');
        if (hasShown) {
            setIsVisible(false);
            return;
        }

        const MIN_LOADING_TIME = 1000; // reduced to 1s
        const startTime = Date.now();

        const dismiss = () => {
            const timeElapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, MIN_LOADING_TIME - timeElapsed);

            setTimeout(() => {
                setIsVisible(false);
                sessionStorage.setItem('bootLoaderShown', 'true');
            }, remainingTime);
        };

        // Safety fallback: nunca travar a tela por mais de 2.5s caso o evento 'load' demore
        const safetyTimer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem('bootLoaderShown', 'true');
        }, 2500);

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            dismiss();
        } else {
            window.addEventListener('load', dismiss);
        }

        return () => {
            window.removeEventListener('load', dismiss);
            clearTimeout(safetyTimer);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white dark:bg-[#121212] transition-colors duration-300">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mb-6">
                <Image
                    src="/icone-HUBLabDiv.svg"
                    alt="HUB LabDiv Logo"
                    fill
                    className="object-contain animate-pulse"
                    priority
                />
            </div>
            <div className="w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00] w-full animate-shimmer-labdiv" />
            </div>
        </div>
    );
}
