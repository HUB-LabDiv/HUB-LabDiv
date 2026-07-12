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
    description: '',
    category: '',
    title: 'Exemplo de Título',
    authors: '',
    year: new Date().getFullYear().toString(),
    description: '',
    whatsapp: '',
    blocks: [
        {
            id: 'mock-image-1',
            type: 'image' as BlockType,
            content: { url: '/labdiv-logo.png', caption: 'Logo do HUB LabDiv' }
        },
        {
            id: 'mock-text-1',
            type: 'text' as BlockType,
            content: { text: 'Exemplo de descrição, esse texto vai aparecer até x caracteres no post em miniatura e para ler mais o usuario deve ir para a pagina completa' }
        },
        {
            id: 'mock-reflection-1',
            type: 'reflection' as BlockType,
            content: { 
                questionType: 'discursive',
                question: 'Exemplo de reflexão do usuario após a introdução, esse balão o faz pensar em que visão ele tinha antes e sobre a sua nova visão que irá se desenvolver ainda mais ao decorrer do post',
                options: []
            }
        },
        {
            id: 'mock-text-2',
            type: 'text' as BlockType,
            content: { text: 'Este é um bloco de texto adicional para continuar o desenvolvimento da sua ideia.' }
        },
        {
            id: 'mock-reference-1',
            type: 'reference' as BlockType,
            content: { citation: 'Exemplo de Referência Bibliográfica' }
        },
        {
            id: 'mock-context-history-1',
            type: 'context_history' as BlockType,
            content: { text: 'Neste bloco você pode adicionar contexto histórico sobre o assunto.' }
        },
        {
            id: 'mock-context-social-1',
            type: 'context_social' as BlockType,
            content: { text: 'Neste bloco você pode adicionar o contexto social.' }
        },
        {
            id: 'mock-context-political-1',
            type: 'context_political' as BlockType,
            content: { text: 'Neste bloco você pode adicionar o contexto político.' }
        },
        {
            id: 'mock-quiz-1',
            type: 'quiz' as BlockType,
            content: { 
                questionType: 'multiple_choice',
                question: 'Exemplo de Pergunta', 
                options: ['Opção 1', 'Opção 2'], 
                correctAnswer: 0 
            }
        }
    ],
    activeBlockId: null,
    previewMode: 'fluxo' as 'fluxo' | 'arte' | 'preview',
    
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
    watchedValues: {},
    
    languageRegister: 'academica',
    needsModerationHelp: false,
    activeDraftId: null as string | null
};

interface SubmissionState {
    currentStep: SubmissionStep;
    description: string;
    category: string;

    // Metadados básicos
    title: string;
    authors: string;
    year: string;
    description: string;
    whatsapp: string;

    blocks: Block[];
    fluxoBlocks: Block[];
    arteBlocks: Block[];
    activeBlockId: string | null;
    activeDraftId: string | null;
    previewMode: 'fluxo' | 'arte' | 'preview';

    // Agreemenets
    readGuide: boolean;
    acceptedCc: boolean;

    // Curadoria e Outros
    isHistorical: boolean;
    isGoldenStandard: boolean;
    selectedDepartments: string[];
    selectedLaboratories: string[];
    selectedResearchers: string[];
    selectedResearchLines: string[];
    
    languageRegister: string;
    needsModerationHelp: boolean;

    // Setters
    watchedValues: any;
    setWatchedValues: (values: any) => void;
    setStep: (step: SubmissionStep) => void;
    setDescription: (description: string) => void;
    setCategory: (category: string) => void;

    setTitle: (title: string) => void;
    setAuthors: (authors: string) => void;
    setYear: (year: string) => void;
    setDescription: (description: string) => void;
    setWhatsapp: (whatsapp: string) => void;
    
    setLanguageRegister: (val: string) => void;
    setNeedsModerationHelp: (val: boolean) => void;

    // Block Setters
    addBlock: (type: BlockType, content?: any, insertAfterId?: string) => void;
    updateBlock: (id: string, content: any) => void;
    removeBlock: (id: string) => void;
    moveBlock: (id: string, direction: 'up' | 'down') => void;
    setActiveBlock: (id: string | null) => void;
    setPreviewMode: (mode: 'fluxo' | 'arte' | 'preview') => void;
    setBlocks: (blocks: Block[]) => void;
    restoreMockBlocks: () => void;

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

    // Setters especiais
    setActiveDraftId: (id: string | null) => void;
    loadState: (stateSnapshot: Partial<SubmissionState>) => void;

    // reset
    reset: () => void;
}

export const useSubmissionStore = create<SubmissionState>()(
    persist(
        (set) => ({
            currentStep: 'diagrammer',
            description: initialState.description,
            category: initialState.category,
            title: initialState.title,
            authors: initialState.authors,
            year: initialState.year,
            description: initialState.description,
            whatsapp: initialState.whatsapp,
            blocks: initialState.blocks,
            fluxoBlocks: initialState.blocks,
            arteBlocks: [],
            activeBlockId: initialState.activeBlockId,
            activeDraftId: initialState.activeDraftId,
            previewMode: initialState.previewMode,

            readGuide: initialState.readGuide,
            acceptedCc: initialState.acceptedCc,

            isHistorical: initialState.isHistorical,
            isGoldenStandard: initialState.isGoldenStandard,
            selectedDepartments: initialState.selectedDepartments,
            selectedLaboratories: [],
            selectedResearchers: [],
            selectedResearchLines: [],
            
            languageRegister: initialState.languageRegister,
            needsModerationHelp: initialState.needsModerationHelp,

            watchedValues: {},
            setWatchedValues: (values) => set({ watchedValues: values }),
            setStep: (step) => set({ currentStep: step }),
            setDescription: (description) => set({ description }),
            setCategory: (category) => set({ category }),

            setTitle: (title) => set({ title }),
            setAuthors: (authors) => set({ authors }),
            setYear: (year) => set({ year }),
            setDescription: (description) => set({ description }),
            setWhatsapp: (whatsapp) => set({ whatsapp }),
            
            setLanguageRegister: (languageRegister) => set({ languageRegister }),
            setNeedsModerationHelp: (needsModerationHelp) => set({ needsModerationHelp }),

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
            setPreviewMode: (mode) => set((state) => {
                const updates: Partial<SubmissionState> = { previewMode: mode };
                
                // Salvar o canvas atual antes de trocar de aba ou ir para o preview
                if (state.previewMode === 'fluxo') updates.fluxoBlocks = state.blocks;
                if (state.previewMode === 'arte') updates.arteBlocks = state.blocks;
                
                if (mode === 'preview') {
                    return updates;
                }
                
                // Carregar o canvas novo se voltando para os editores
                if (mode === 'fluxo') {
                    updates.blocks = state.fluxoBlocks;
                    updates.category = state.category === 'Arte' ? '' : state.category;
                }
                if (mode === 'arte') {
                    updates.blocks = state.arteBlocks;
                    updates.category = 'Arte';
                }
                
                return updates;
            }),
            setBlocks: (blocks) => set({ blocks }),
            restoreMockBlocks: () => set({ blocks: initialState.blocks }),

            setReadGuide: (readGuide) => set({ readGuide }),
            setAcceptedCc: (acceptedCc) => set({ acceptedCc }),

            setIsHistorical: (isHistorical) => set({ isHistorical }),
            setIsGoldenStandard: (isGoldenStandard) => set({ isGoldenStandard }),
            setSelectedDepartments: (selectedDepartments) => set({ selectedDepartments }),
            setSelectedLaboratories: (selectedLaboratories) => set({ selectedLaboratories }),
            setSelectedResearchers: (selectedResearchers) => set({ selectedResearchers }),
            setSelectedResearchLines: (selectedResearchLines) => set({ selectedResearchLines }),

            setActiveDraftId: (id) => set({ activeDraftId: id }),
            loadState: (snapshot) => set({ ...snapshot }),

            reset: () => set({
                currentStep: 'diagrammer',
                description: initialState.description,
                category: initialState.category,
                title: initialState.title,
                authors: initialState.authors,
                year: initialState.year,
                description: initialState.description,
                whatsapp: initialState.whatsapp,
                blocks: initialState.blocks,
                fluxoBlocks: initialState.blocks,
                arteBlocks: [],
                activeBlockId: initialState.activeBlockId,
                activeDraftId: initialState.activeDraftId,
                readGuide: initialState.readGuide,
                acceptedCc: initialState.acceptedCc,
                isHistorical: initialState.isHistorical,
                isGoldenStandard: initialState.isGoldenStandard,
                selectedDepartments: initialState.selectedDepartments,
                selectedLaboratories: [],
                selectedResearchers: [],
                selectedResearchLines: [],
                languageRegister: initialState.languageRegister,
                needsModerationHelp: initialState.needsModerationHelp,
            }),
        }),
        {
            name: 'submission-store-storage',
            partialize: (state) => ({
                currentStep: state.currentStep,
                description: state.description,
                category: state.category,
                blocks: state.blocks,
                title: state.title,
                readGuide: state.readGuide,
                acceptedCc: state.acceptedCc,
                activeDraftId: state.activeDraftId,
            }),
        }
    )
);
