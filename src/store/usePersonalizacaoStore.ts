'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import { create } from 'zustand';
import { PersonalizacaoStoreState, ThemeInstitution, ThemeInitiative } from '@/types';

const isBrowser = typeof window !== 'undefined';

const applyInstitutionAttribute = (inst: ThemeInstitution) => {
    if (isBrowser) {
        document.documentElement.setAttribute('data-institution', inst);
        if (document.body) {
            document.body.setAttribute('data-institution', inst);
        }
    }
};

const applyInitiativeAttribute = (initTheme: ThemeInitiative) => {
    if (isBrowser) {
        document.documentElement.setAttribute('data-initiative-theme', initTheme);
        if (document.body) {
            document.body.setAttribute('data-initiative-theme', initTheme);
        }
    }
};

const getSavedInstitution = (): ThemeInstitution => {
    let inst: ThemeInstitution = 'ifusp';
    if (isBrowser) {
        const saved = localStorage.getItem('hub-theme-institution');
        if (saved === 'ime' || saved === 'ifusp' || saved === 'iag' || saved === 'igc' || saved === 'io') {
            inst = saved as ThemeInstitution;
        }
    }
    applyInstitutionAttribute(inst);
    return inst;
};

const getSavedInitiativeTheme = (): ThemeInitiative => {
    let initTheme: ThemeInitiative = 'hub';
    if (isBrowser) {
        const saved = localStorage.getItem('hub-theme-initiative');
        if (
            saved === 'hub' ||
            saved === 'labdiv' ||
            saved === 'show-da-fisica' ||
            saved === 'hs' ||
            saved === 'profis'
        ) {
            initTheme = saved;
        }
    }
    applyInitiativeAttribute(initTheme);
    return initTheme;
};

export const usePersonalizacaoStore = create<PersonalizacaoStoreState>((set) => ({
    institution: getSavedInstitution(),
    setInstitution: (inst: ThemeInstitution) => {
        if (isBrowser) {
            localStorage.setItem('hub-theme-institution', inst);
            applyInstitutionAttribute(inst);
        }
        set({ institution: inst });
    },
    initiativeTheme: getSavedInitiativeTheme(),
    setInitiativeTheme: (theme: ThemeInitiative) => {
        if (isBrowser) {
            localStorage.setItem('hub-theme-initiative', theme);
            applyInitiativeAttribute(theme);
        }
        set({ initiativeTheme: theme });
    },
}));
