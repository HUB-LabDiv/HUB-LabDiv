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

import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';

export function useTheme() {
    const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
    const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

    const applyResolvedTheme = useCallback((resolved: 'light' | 'dark', persistCookie = true) => {
        setTheme(resolved);
        if (resolved === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        if (persistCookie) {
            document.cookie = `theme=${resolved}; path=/; max-age=31536000`;
        }
    }, []);

    useEffect(() => {
        const savedMode = localStorage.getItem('theme_mode') as ThemeMode | null;
        const legacyTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const initialMode: ThemeMode =
            savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto'
                ? savedMode
                : legacyTheme === 'light' || legacyTheme === 'dark'
                  ? legacyTheme
                  : 'auto';

        setThemeModeState(initialMode);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const syncFromMode = (mode: ThemeMode) => {
            if (mode === 'auto') {
                applyResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
            } else {
                applyResolvedTheme(mode);
            }
        };

        syncFromMode(initialMode);

        const handleSystemChange = (e: MediaQueryListEvent) => {
            const currentMode = (localStorage.getItem('theme_mode') as ThemeMode | null) || initialMode;
            if (currentMode === 'auto') {
                applyResolvedTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemChange);
        return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }, [applyResolvedTheme]);

    const setThemeMode = useCallback(
        (mode: ThemeMode) => {
            setThemeModeState(mode);
            localStorage.setItem('theme_mode', mode);
            if (mode === 'auto') {
                localStorage.removeItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                applyResolvedTheme(prefersDark ? 'dark' : 'light');
            } else {
                localStorage.setItem('theme', mode);
                applyResolvedTheme(mode);
            }
        },
        [applyResolvedTheme]
    );

    const toggleTheme = useCallback(() => {
        const nextMode: ThemeMode = theme === 'dark' ? 'light' : 'dark';
        setThemeMode(nextMode);
    }, [theme, setThemeMode]);

    return { theme, themeMode, setThemeMode, toggleTheme };
}
