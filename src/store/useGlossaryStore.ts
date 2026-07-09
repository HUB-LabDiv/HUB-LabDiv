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
import { getGlossary } from '@/app/enviar/actions/glossaryActions';

interface GlossaryWord {
    id: string;
    termo: string;
    codificacao_academica: string;
    is_pending: boolean;
    signos_constelacoes: Array<{
        id: string;
        constelacao: string;
        descodificacao: string;
        is_pending: boolean;
    }>;
}

interface GlossaryState {
    glossary: GlossaryWord[];
    isLoaded: boolean;
    fetchGlossary: () => Promise<void>;
}

export const useGlossaryStore = create<GlossaryState>((set, get) => ({
    glossary: [],
    isLoaded: false,
    fetchGlossary: async () => {
        if (get().isLoaded) return;
        const res = await getGlossary();
        if (res.success) {
            set({ glossary: res.data, isLoaded: true });
        }
    }
}));
