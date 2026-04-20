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


import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReadingExperienceContextType {
    isFocusMode: boolean;
    setFocusMode: (val: boolean) => void;
    isPresentationMode: boolean;
    setPresentationMode: (val: boolean) => void;
    isAudioPlaying: boolean;
    setAudioPlaying: (val: boolean) => void;
    audioLanguage: 'pt-BR' | 'en-US';
    setAudioLanguage: (val: 'pt-BR' | 'en-US') => void;
}

const ReadingExperienceContext = createContext<ReadingExperienceContextType | undefined>(undefined);

export function ReadingExperienceProvider({ children }: { children: React.ReactNode }) {
    const [isFocusMode, setFocusMode] = useState(false);
    const [isPresentationMode, setPresentationMode] = useState(false);
    const [isAudioPlaying, setAudioPlaying] = useState(false);
    const [audioLanguage, setAudioLanguage] = useState<'pt-BR' | 'en-US'>('pt-BR');

    // Sync focus mode with body classes to hide global Header/Footer
    useEffect(() => {
        if (isFocusMode) {
            document.body.classList.add('reading-focus-mode');
        } else {
            document.body.classList.remove('reading-focus-mode');
        }
    }, [isFocusMode]);

    // Handle Escape key to exit modes
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isPresentationMode) setPresentationMode(false);
                else if (isFocusMode) setFocusMode(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFocusMode, isPresentationMode]);

    return (
        <ReadingExperienceContext.Provider
            value={{
                isFocusMode, setFocusMode,
                isPresentationMode, setPresentationMode,
                isAudioPlaying, setAudioPlaying,
                audioLanguage, setAudioLanguage
            }}
        >
            {children}
        </ReadingExperienceContext.Provider>
    );
}

export function useReadingExperience() {
    const context = useContext(ReadingExperienceContext);
    if (!context) {
        throw new Error('useReadingExperience must be used within a ReadingExperienceProvider');
    }
    return context;
}
