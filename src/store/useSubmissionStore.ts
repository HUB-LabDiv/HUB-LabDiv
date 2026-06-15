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
import { persist } from 'zustand/middleware';
import { Block, BlockType } from '@/app/enviar/schema';

export type SubmissionStep = 'category' | 'format' | 'basic' | 'optional' | 'curator' | 'diagrammer';

const initialState = {
    step: 'category' as SubmissionStep,
    category: '',
    title: 'Exemplo de Contribuição: A Dinâmica dos Buracos Negros',
    authors: '',
    description: '',
    whatsapp: '',
    blocks: [
        {
            id: 'mock-text-1',
            type: 'text' as BlockType,
            content: { text: 'Este é um exemplo de parágrafo introdutório. A divulgação científica é essencial para traduzir conceitos complexos para o público geral. Use blocos como este para narrar sua ideia.' }
        },
        {
            id: 'mock-image-1',
            type: 'image' as BlockType,
            content: { url: '/labdiv-logo.png', caption: 'Figura 1: Exemplo de imagem (Logo do LabDiv).' }
        },
        {
            id: 'mock-reflection-1',
            type: 'reflection' as BlockType,
            content: { question: 'Como esse conceito se aplica no seu dia a dia?' }
        }
    ],
    activeBlockId: null,
    previewMode: 'edit' as const,
    
    // Agreements
    readGuide: false,
    acceptedCc: false,

    // Curator fields
    isHistorical: false,
    isGoldenStandard: false,
    selectedDepartments: [],
    selectedLaboratories: [],
    selectedResearchers: [],
    selectedResearchLines: [],
    watchedValues: {}
};

interface SubmissionState {
    currentStep: SubmissionStep;
    category: string;

    // Metadados básicos
    title: string;
    authors: string;
    description: string;
    whatsapp: string;

    blocks: Block[];
    activeBlockId: string | null;
    previewMode: 'edit' | 'preview';

    // Agreemenets
    readGuide: boolean;
    acceptedCc: boolean;

    // Curator fields
    isHistorical: boolean;
    isGoldenStandard: boolean;
    selectedDepartments: string[];
    selectedLaboratories: string[];
    selectedResearchers: string[];
    selectedResearchLines: string[];

    // Setters
    watchedValues: any;
    setWatchedValues: (values: any) => void;
    setStep: (step: SubmissionStep) => void;
    setCategory: (category: string) => void;

    setTitle: (title: string) => void;
    setAuthors: (authors: string) => void;
    setDescription: (description: string) => void;
    setWhatsapp: (whatsapp: string) => void;

    // Block Setters
    addBlock: (type: BlockType, content?: any, insertAfterId?: string) => void;
    updateBlock: (id: string, content: any) => void;
    removeBlock: (id: string) => void;
    moveBlock: (id: string, direction: 'up' | 'down') => void;
    setActiveBlock: (id: string | null) => void;
    setPreviewMode: (mode: 'edit' | 'preview') => void;

    // Agreements Setters
    setReadGuide: (val: boolean) => void;
    setAcceptedCc: (val: boolean) => void;

    // Curator Setters
    setIsHistorical: (val: boolean) => void;
    setIsGoldenStandard: (val: boolean) => void;
    setSelectedDepartments: (val: string[]) => void;
    setSelectedLaboratories: (val: string[]) => void;
    setSelectedResearchers: (val: string[]) => void;
    setSelectedResearchLines: (val: string[]) => void;

    // reset
    reset: () => void;
}

export const useSubmissionStore = create<SubmissionState>()(
    persist(
        (set) => ({
            currentStep: 'diagrammer',
            category: initialState.category,
            title: initialState.title,
            authors: initialState.authors,
            description: initialState.description,
            whatsapp: initialState.whatsapp,
            blocks: initialState.blocks,
            activeBlockId: initialState.activeBlockId,
            previewMode: initialState.previewMode,

            readGuide: initialState.readGuide,
            acceptedCc: initialState.acceptedCc,

            isHistorical: initialState.isHistorical,
            isGoldenStandard: initialState.isGoldenStandard,
            selectedDepartments: initialState.selectedDepartments,
            selectedLaboratories: [],
            selectedResearchers: [],
            selectedResearchLines: [],

            watchedValues: {},
            setWatchedValues: (values) => set({ watchedValues: values }),
            setStep: (step) => set({ currentStep: step }),
            setCategory: (category) => set({ category }),

            setTitle: (title) => set({ title }),
            setAuthors: (authors) => set({ authors }),
            setDescription: (description) => set({ description }),
            setWhatsapp: (whatsapp) => set({ whatsapp }),

            addBlock: (type, content = {}, insertAfterId) => set((state) => {
                const newBlock: Block = {
                    id: crypto.randomUUID(),
                    type,
                    content
                };
                
                if (insertAfterId) {
                    const index = state.blocks.findIndex(b => b.id === insertAfterId);
                    if (index >= 0) {
                        const newBlocks = [...state.blocks];
                        newBlocks.splice(index + 1, 0, newBlock);
                        return {
                            blocks: newBlocks,
                            activeBlockId: newBlock.id
                        };
                    }
                }
                
                return {
                    blocks: [...state.blocks, newBlock],
                    activeBlockId: newBlock.id
                };
            }),
            updateBlock: (id, content) => set((state) => ({
                blocks: state.blocks.map(b => b.id === id ? { ...b, content: { ...b.content, ...content } } : b)
            })),
            removeBlock: (id) => set((state) => ({
                blocks: state.blocks.filter(b => b.id !== id),
                activeBlockId: state.activeBlockId === id ? null : state.activeBlockId
            })),
            moveBlock: (id, direction) => set((state) => {
                const index = state.blocks.findIndex(b => b.id === id);
                if (index < 0) return state;
                if (direction === 'up' && index === 0) return state;
                if (direction === 'down' && index === state.blocks.length - 1) return state;

                const newBlocks = [...state.blocks];
                const swapIndex = direction === 'up' ? index - 1 : index + 1;
                [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
                
                return { blocks: newBlocks };
            }),
            setActiveBlock: (id) => set({ activeBlockId: id }),
            setPreviewMode: (mode) => set({ previewMode: mode }),

            setReadGuide: (readGuide) => set({ readGuide }),
            setAcceptedCc: (acceptedCc) => set({ acceptedCc }),

            setIsHistorical: (isHistorical) => set({ isHistorical }),
            setIsGoldenStandard: (isGoldenStandard) => set({ isGoldenStandard }),
            setSelectedDepartments: (selectedDepartments) => set({ selectedDepartments }),
            setSelectedLaboratories: (selectedLaboratories) => set({ selectedLaboratories }),
            setSelectedResearchers: (selectedResearchers) => set({ selectedResearchers }),
            setSelectedResearchLines: (selectedResearchLines) => set({ selectedResearchLines }),

            reset: () => set({
                currentStep: 'diagrammer',
                category: '',
                title: '',
                authors: '',
                description: '',
                whatsapp: '',
                blocks: [],
                activeBlockId: null,
                readGuide: false,
                acceptedCc: false,
                isHistorical: false,
                isGoldenStandard: false,
                selectedDepartments: [],
                selectedLaboratories: [],
                selectedResearchers: [],
                selectedResearchLines: []
            }),
        }),
        {
            name: 'submission-store-storage',
            partialize: (state) => ({
                currentStep: state.currentStep,
                category: state.category,
                blocks: state.blocks,
                title: state.title,
                readGuide: state.readGuide,
                acceptedCc: state.acceptedCc,
            }),
        }
    )
);
