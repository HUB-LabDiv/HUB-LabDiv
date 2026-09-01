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

import React, { useRef, useState } from 'react';
import { useDraftsStore, Draft } from '@/store/useDraftsStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { saveDraftForShare } from '@/app/actions/submissions';
import { ShareDraftModal } from './ShareDraftModal';

export function DraftsMenu() {
    const { drafts, deleteDraft, importDraft, saveDraft } = useDraftsStore();
    const submissionState = useSubmissionStore();
    const { loadState, reset } = submissionState;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleLoad = (draft: Draft) => {
        if (window.confirm('Atenção: Carregar este rascunho irá substituir todo o conteúdo atual da prancheta. Deseja continuar?')) {
            loadState(draft.stateSnapshot);
            submissionState.setActiveDraftId(draft.id);
            toast.success('Rascunho carregado!');
        }
    };

    const handleSync = async () => {
        try {
            setIsSyncing(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Você precisa estar logado para sincronizar da nuvem.');
                setIsSyncing(false);
                return;
            }
            
            // Buscar o rascunho mais recente na nuvem
            const { data, error } = await supabase
                .from('submissions')
                .select('*')
                .eq('user_id', user.id)
                .eq('status', 'rascunho')
                .order('updated_at', { ascending: false })
                .limit(1)
                .single();
                
            if (error || !data) {
                toast.error('Nenhum rascunho encontrado na nuvem.');
                setIsSyncing(false);
                return;
            }
            
            if (window.confirm('Atenção: Carregar o rascunho da nuvem irá substituir todo o conteúdo atual da prancheta. Deseja continuar?')) {
                submissionState.setTitle(data.title || 'Exemplo de Título');
                submissionState.setAuthors(data.authors || '');
                submissionState.setDescription(data.description || '');
                submissionState.setCategory(data.category || '');
                
                if (data.media_type === 'sdocx' && data.media_url) {
                    try {
                        const blocks = JSON.parse(data.media_url);
                        if (Array.isArray(blocks)) {
                            submissionState.setBlocks(blocks);
                        }
                    } catch(e) {
                        console.error('Erro ao ler blocos do rascunho:', e);
                    }
                }
                toast.success('Rascunho da nuvem sincronizado!');
            }
        } catch (e) {
            console.error('Erro ao sincronizar da nuvem:', e);
            toast.error('Ocorreu um erro ao buscar o rascunho.');
        } finally {
            setIsSyncing(false);
        }
    };

    const handleExport = (draft: Draft) => {
        const jsonString = JSON.stringify(draft, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `rascunho_${draft.title.replace(/\s+/g, '_') || 'sem_titulo'}.labdiv`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        // Libera URL da memória
        URL.revokeObjectURL(url);
        
        toast.success('Rascunho exportado!');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string) as Draft;
                if (!parsed.stateSnapshot || !parsed.id) {
                    throw new Error("Formato inválido");
                }
                
                parsed.id = crypto.randomUUID();
                
                const success = importDraft(parsed);
                if (success) {
                    toast.success('Rascunho importado com sucesso!');
                    loadState(parsed.stateSnapshot);
                } else {
                    toast.error('Você já possui 3 rascunhos. Exclua um antes de importar.');
                }
            } catch (error) {
                toast.error('Falha ao ler o arquivo. Certifique-se de que é um .labdiv válido.');
            }
        };
        reader.readAsText(file);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const [selectedDraftForShare, setSelectedDraftForShare] = useState<Draft | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const handleShareDraftCloud = async (): Promise<string | null> => {
        if (!selectedDraftForShare) return null;
        const state = selectedDraftForShare.stateSnapshot || {};
        const res = await saveDraftForShare({
            title: selectedDraftForShare.title || state.title || 'Rascunho Sem Título',
            authors: state.authors || 'Autor(a)',
            category: state.category || 'Outros',
            institute: state.institute || 'ifusp',
            description: state.description || '',
            media_type: 'sdocx',
            media_url: JSON.stringify(state.blocks || []),
            draftId: selectedDraftForShare.id
        });
        if (res.error) {
            toast.error(res.error);
            return null;
        }
        return res.draftId || null;
    };

    return (
        <div className="w-full flex flex-col gap-4 mt-8 mb-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                className="hidden" 
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">inventory_2</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">Meus Rascunhos ({drafts.length}/3)</h3>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSync}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase ${isSyncing ? 'text-gray-400 dark:text-gray-600' : 'text-brand-blue hover:text-brand-blue/80'} transition-colors`}
                        title="Busca o seu rascunho mais recente salvo na nuvem"
                    >
                        <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
                        Sincronizar da Nuvem
                    </button>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[14px]">upload</span>
                        Importar Rascunho
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {drafts.length === 0 ? (
                    <div className="col-span-1 sm:col-span-2 lg:grid-cols-3 p-8 rounded-[24px] border border-dashed border-gray-300 dark:border-white/10 bg-white/50 dark:bg-background-dark/50 flex flex-col items-center justify-center gap-2 text-gray-500 backdrop-blur-md">
                        <span className="material-symbols-outlined text-3xl opacity-30">draft</span>
                        <p className="text-sm font-sans">Nenhum rascunho salvo localmente.</p>
                    </div>
                ) : (
                    drafts.map(draft => (
                        <div 
                            key={draft.id} 
                            className="p-4 sm:p-5 rounded-[24px] bg-white dark:bg-gradient-to-br dark:from-[#1E1E1E] dark:to-[#121212] border border-gray-200 dark:border-white/10 hover:border-brand-blue/50 transition-all flex flex-col justify-between min-h-[160px] shadow-lg group relative"
                        >
                            <div 
                                className="flex-1 cursor-pointer flex flex-col justify-start mb-4"
                                onClick={() => handleLoad(draft)}
                                title="Clique para carregar e editar este rascunho"
                            >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className="text-sm font-bukra font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-brand-yellow transition-colors">
                                        {draft.title || 'Rascunho Sem Título'}
                                    </p>
                                    <span className="material-symbols-outlined text-xs text-gray-500 group-hover:text-brand-blue shrink-0 pt-0.5">
                                        edit
                                    </span>
                                </div>
                                <p className="text-[10px] font-mono text-gray-500 dark:text-gray-400">
                                    Editado em: {new Date(draft.updatedAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            
                            {/* Barra de 3 Ações */}
                            <div className="grid grid-cols-3 gap-1.5 w-full pt-3 border-t border-gray-100 dark:border-white/10">
                                <button 
                                    type="button"
                                    onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setSelectedDraftForShare(draft);
                                        setIsShareModalOpen(true);
                                    }}
                                    className="py-2 px-1.5 flex items-center justify-center gap-1 rounded-xl bg-brand-yellow/15 hover:bg-brand-yellow text-brand-yellow hover:text-gray-950 transition-all font-bukra text-[9.5px] font-bold uppercase tracking-wider min-w-0 shadow-sm"
                                    title="Compartilhar link de prévia deste rascunho"
                                >
                                    <span className="material-symbols-outlined text-[13px] shrink-0">share</span>
                                    <span className="truncate">Prévia</span>
                                </button>
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleExport(draft); }}
                                    className="py-2 px-1.5 flex items-center justify-center gap-1 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white transition-all font-bukra text-[9.5px] font-bold uppercase tracking-wider min-w-0 border border-transparent dark:border-white/5"
                                    title="Exportar arquivo .labdiv deste rascunho"
                                >
                                    <span className="material-symbols-outlined text-[13px] shrink-0">download</span>
                                    <span className="truncate">Exportar</span>
                                </button>
                                <button 
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); }}
                                    className="py-2 px-1.5 flex items-center justify-center gap-1 rounded-xl bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white transition-all font-bukra text-[9.5px] font-bold uppercase tracking-wider min-w-0 border border-brand-red/20"
                                    title="Excluir este rascunho"
                                >
                                    <span className="material-symbols-outlined text-[13px] shrink-0">delete</span>
                                    <span className="truncate">Excluir</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ShareDraftModal
                isOpen={isShareModalOpen}
                onClose={() => {
                    setIsShareModalOpen(false);
                    setSelectedDraftForShare(null);
                }}
                draftId={selectedDraftForShare?.id || null}
                title={selectedDraftForShare?.title || ''}
                onSaveAndGenerate={handleShareDraftCloud}
            />
        </div>
    );
}
