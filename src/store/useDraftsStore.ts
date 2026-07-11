import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Draft {
    id: string;
    updatedAt: string;
    title: string;
    category: string;
    stateSnapshot: any; // A partial SubmissionState
}

interface DraftsState {
    drafts: Draft[];
    saveDraft: (state: any, explicitId?: string, force?: boolean) => string | null; // returns id if successful, null if full and not forced
    deleteDraft: (id: string) => void;
    importDraft: (draft: Draft) => boolean;
}

export const useDraftsStore = create<DraftsState>()(
    persist(
        (set, get) => ({
            drafts: [],
            
            saveDraft: (state, explicitId, force) => {
                const { drafts } = get();
                const targetId = explicitId || state.activeDraftId;
                const existingDraftIndex = targetId ? drafts.findIndex(d => d.id === targetId) : -1;
                
                const newDraft: Draft = {
                    id: existingDraftIndex >= 0 ? drafts[existingDraftIndex].id : crypto.randomUUID(),
                    updatedAt: new Date().toISOString(),
                    title: state.title || 'Sem título',
                    category: state.category,
                    stateSnapshot: { ...state }
                };

                let updated = [...drafts];
                
                if (existingDraftIndex >= 0) {
                    updated[existingDraftIndex] = newDraft;
                } else {
                    if (updated.length >= 3) {
                        if (force) {
                            updated.pop(); // Remove the oldest
                        } else {
                            return null; // Full, must prompt user
                        }
                    }
                    updated = [newDraft, ...updated];
                }

                set({ drafts: updated });
                return newDraft.id;
            },
            
            deleteDraft: (id) => set((state) => ({
                drafts: state.drafts.filter(d => d.id !== id)
            })),

            importDraft: (draft) => {
                const { drafts } = get();
                if (drafts.length >= 3) return false;
                
                set({ drafts: [draft, ...drafts] });
                return true;
            }
        }),
        {
            name: 'drafts-store-storage'
        }
    )
);
