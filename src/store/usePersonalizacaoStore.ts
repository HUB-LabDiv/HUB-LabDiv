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

import { create } from 'zustand';
import { PersonalizacaoStoreState, ThemeInstitution } from '@/types';

// Helper to check if window is available
const isBrowser = typeof window !== 'undefined';

const applyInstitutionAttribute = (inst: ThemeInstitution) => {
    if (isBrowser) {
        document.documentElement.setAttribute('data-institution', inst);
        if (document.body) {
            document.body.setAttribute('data-institution', inst);
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

export const usePersonalizacaoStore = create<PersonalizacaoStoreState>((set) => ({
    institution: getSavedInstitution(),
    setInstitution: (inst: ThemeInstitution) => {
        if (isBrowser) {
            localStorage.setItem('hub-theme-institution', inst);
            applyInstitutionAttribute(inst);
        }
        set({ institution: inst });
    }
}));
