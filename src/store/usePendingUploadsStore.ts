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

export interface PendingFile {
    file: File;
    resourceType: 'auto' | 'raw' | 'image' | 'video';
}

interface PendingUploadsState {
    pendingFiles: Record<string, PendingFile>; // Chave é o localUrl (blob URL)
    setPendingFile: (localUrl: string, file: File, resourceType: 'auto' | 'raw' | 'image' | 'video') => void;
    removePendingFile: (localUrl: string) => void;
    clearPendingFiles: () => void;
}

export const usePendingUploadsStore = create<PendingUploadsState>((set) => ({
    pendingFiles: {},
    setPendingFile: (localUrl, file, resourceType) => set((state) => ({
        pendingFiles: { ...state.pendingFiles, [localUrl]: { file, resourceType } }
    })),
    removePendingFile: (localUrl) => set((state) => {
        const { [localUrl]: _, ...rest } = state.pendingFiles;
        return { pendingFiles: rest };
    }),
    clearPendingFiles: () => set({ pendingFiles: {} }),
}));
