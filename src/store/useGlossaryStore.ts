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
