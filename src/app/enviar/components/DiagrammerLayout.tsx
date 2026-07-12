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

import React from 'react';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { BlockRenderer } from './BlockRenderer';
import { BlockType } from '@/app/enviar/schema';
import { InlineAddMenu } from './InlineAddMenu';
import { useAuth } from '@/providers/AuthProvider';
import { MediaCard } from '@/components/media/MediaCard';
import { PostDTO } from '@/dtos/media';
import { CATEGORIES } from '@/lib/constants';
import { getProfileWithPseudonyms } from '@/app/actions/profiles';
import { createSubmission } from '@/app/actions/submissions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { TargetProfileModal } from './TargetProfileModal';
import { updateSubmission } from '@/app/actions/submissions';
import { DraftsMenu } from './DraftsMenu';
import { useDraftsStore } from '@/store/useDraftsStore';

interface DiagrammerLayoutProps {
    editId?: string | null;
}

export function DiagrammerLayout({ editId }: DiagrammerLayoutProps) {
    const {
        blocks, addBlock, setActiveBlock, activeBlockId, title, setTitle, setBlocks,
        authors, setAuthors, year, setYear,
        readGuide, setReadGuide, acceptedCc, setAcceptedCc, previewMode, setPreviewMode,
        category, setCategory, isHistorical, isGoldenStandard,
        languageRegister, setLanguageRegister, needsModerationHelp, setNeedsModerationHelp, activeDraftId, setActiveDraftId, restoreMockBlocks, fluxoBlocks, arteBlocks, description, setDescription
    } = useSubmissionStore();
    const { saveDraft, drafts } = useDraftsStore();
    const [selectedPreviewId, setSelectedPreviewId] = React.useState<string>(previewMode === 'arte' ? 'arte' : 'fluxo');

    const previewData = React.useMemo(() => {
        if (selectedPreviewId === 'fluxo') {
            const fb = previewMode === 'fluxo' ? blocks : fluxoBlocks;
            const mediaBlock = fb.find((b: any) => ['image', 'video'].includes(b.type));
            return {
                title,
                category: category === 'Arte' ? 'Outros' : category, // Fallback
                description: description || fb.find((b: any) => b.type === 'text')?.content?.text,
                mediaUrl: mediaBlock?.content?.url,
                mediaType: mediaBlock?.type,
                blocks: fb
            };
        }
        if (selectedPreviewId === 'arte') {
            const ab = previewMode === 'arte' ? blocks : arteBlocks;
            const mediaBlock = ab.find((b: any) => ['image', 'video'].includes(b.type));
            return {
                title,
                category: 'Arte',
                description: description || ab.find((b: any) => b.type === 'text')?.content?.text,
                mediaUrl: mediaBlock?.content?.url,
                mediaType: mediaBlock?.type,
                blocks: ab
            };
        }
        
        const draft = drafts.find(d => d.id === selectedPreviewId);
        if (!draft) {
            const mediaBlock = blocks.find((b: any) => ['image', 'video'].includes(b.type));
            return { title, category, description: blocks.find((b: any) => b.type === 'text')?.content?.text, mediaUrl: mediaBlock?.content?.url, mediaType: mediaBlock?.type, blocks };
        }
        
        const mediaBlock = draft.stateSnapshot?.blocks?.find((b: any) => ['image', 'video'].includes(b.type));
        return {
            title: draft.title,
            category: draft.stateSnapshot?.category,
            description: draft.stateSnapshot?.blocks?.find((b: any) => b.type === 'text')?.content?.text,
            mediaUrl: mediaBlock?.content?.url,
            mediaType: mediaBlock?.type,
            blocks: draft.stateSnapshot?.blocks || []
        };
    }, [selectedPreviewId, title, category, blocks, fluxoBlocks, arteBlocks, drafts, previewMode]);

    const [pseudonyms, setPseudonyms] = React.useState<{ id: string; name: string }[]>([]);
    const [mainName, setMainName] = React.useState<string>('');
    const [isGuideModalOpen, setIsGuideModalOpen] = React.useState(false);
    const [isLicenseModalOpen, setIsLicenseModalOpen] = React.useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
    const fetchedRef = React.useRef(false);

    React.useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        const fetchAliases = async () => {
            const res = await getProfileWithPseudonyms();
            if (!('error' in res)) {
                setPseudonyms(res.pseudonyms || []);
                const name = res.profile.username || res.profile.full_name || '';
                setMainName(name);
                if (useSubmissionStore.getState().authors === '' && res.profile.use_nickname && name) {
                    setAuthors(name);
                }
            }
        };
        fetchAliases();
    }, [setAuthors]);

    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handlePublish = async () => {
        if (!title.trim()) {
            toast.error('O título é obrigatório.');
            return;
        }
        if (!authors.trim()) {
            toast.error('O nome de autor/apelido é obrigatório.');
            return;
        }
        if (previewMode !== 'arte' && !category) {
            toast.error('A categoria é obrigatória.');
            return;
        }
        if (previewMode !== 'arte' && !year) {
            toast.error('O ano é obrigatório.');
            return;
        }
        if (previewMode !== 'arte' && (!description || !description.trim())) {
            toast.error('É obrigatório adicionar uma Descrição (limite de 5 linhas).');
            return;
        }

        if (!readGuide || (previewMode !== 'arte' && !acceptedCc)) {
            toast.error('Por favor, aceite os termos legais antes de publicar.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Enviando para moderação...');

        try {
            const reflexoesBlocks = blocks.filter(b => b.type === 'reflection');
            const reflexoes = reflexoesBlocks.map(b => ({
                ancora_paragrafo: b.id,
                pergunta_provocadora: b.content.question || 'Reflexão',
                tipo_reflexao: 'aberta'
            }));

            const quizBlock = blocks.find(b => b.type === 'quiz');

            const payload = {
                title,
                authors: authors || user?.user_metadata?.full_name || 'Autor(a)',
                category: previewMode === 'arte' ? 'Arte' : (category || 'Outros'),
                description: description || blocks.find(b => b.type === 'text')?.content?.text || 'Contribuição construída no Diagramador.',
                media_type: 'sdocx',
                media_url: JSON.stringify(blocks),
                event_year: previewMode === 'arte' ? new Date().getFullYear() : (year ? parseInt(year) : new Date().getFullYear()),
                is_historical: isHistorical,
                is_golden_standard: isGoldenStandard,
                accepted_cc: acceptedCc,
                language_register: previewMode === 'arte' ? 'artistica' : languageRegister,
                needs_moderation_help: needsModerationHelp,
                reflexoes: reflexoes.length > 0 ? reflexoes : undefined,
                quiz: quizBlock ? [quizBlock.content] : undefined,
            };

            const res = await createSubmission(payload as any);

            if (res.error) {
                console.error(res.error);
                toast.error('Erro ao lançar conteúdo: Verifique os campos.', { id: toastId });
            } else {
                toast.success('Conteúdo enviado com sucesso! Está no painel para análise.', { id: toastId });
                useSubmissionStore.getState().reset();
                router.push('/');
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro inesperado ao lançar conteúdo.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async () => {
        if (!editId) return;
        if (!title.trim()) {
            toast.error('O título é obrigatório.');
            return;
        }
        if (!authors.trim()) {
            toast.error('O nome de autor/apelido é obrigatório.');
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading('Atualizando postagem...');

        try {
            const reflexoesBlocks = blocks.filter(b => b.type === 'reflection');
            const reflexoes = reflexoesBlocks.map(b => ({
                ancora_paragrafo: b.id,
                pergunta_provocadora: b.content.question || 'Reflexão',
                tipo_reflexao: 'aberta'
            }));

            const quizBlock = blocks.find(b => b.type === 'quiz');

            const payload = {
                title,
                authors: authors || user?.user_metadata?.full_name || 'Autor(a)',
                category: previewData.category || 'Outros',
                description: blocks.find(b => b.type === 'text')?.content?.text || 'Contribuição construída no Diagramador.',
                media_type: 'sdocx',
                media_url: JSON.stringify(blocks),
                event_year: year ? parseInt(year) : new Date().getFullYear(),
                is_historical: isHistorical,
                is_golden_standard: isGoldenStandard,
                accepted_cc: acceptedCc,
                language_register: languageRegister,
                needs_moderation_help: needsModerationHelp,
                reflexoes: reflexoes.length > 0 ? reflexoes : undefined,
                quiz: quizBlock ? [quizBlock.content] : undefined,
            };

            const res = await updateSubmission(editId, payload);

            if (res.error) {
                console.error(res.error);
                toast.error('Erro ao atualizar conteúdo.', { id: toastId });
            } else {
                toast.success('Conteúdo atualizado com sucesso!', { id: toastId });
                useSubmissionStore.getState().reset();
                router.push(`/arquivo/${editId}`);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro inesperado ao atualizar conteúdo.', { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCanvasClick = () => {
        if (activeBlockId !== null) {
            setActiveBlock(null);
        }
    };

    const handleSaveDraft = () => {
        const state = useSubmissionStore.getState();
        const resultId = saveDraft(state);
        if (resultId) {
            setActiveDraftId(resultId);
            toast.success('Rascunho salvo com sucesso!');
        } else {
            if (window.confirm('Você já possui 3 rascunhos salvos. Salvar este novo irá substituir o rascunho mais antigo. Deseja continuar?')) {
                const forcedResultId = saveDraft(state, undefined, true);
                if (forcedResultId) {
                    setActiveDraftId(forcedResultId);
                    toast.success('Rascunho salvo com sucesso! O mais antigo foi substituído.');
                }
            }
        }
    };

    const elaboracaoTypes = ['text', 'drive', 'reference', 'notes'];
    const objetoTypes = ['image', 'carousel', 'video', 'audio', '3d_object', 'web_page', 'pdf'];
    const pedagogicoTypes = ['quiz', 'reflection', 'context_history', 'context_social', 'context_political'];

    const hasElaboracao = blocks.some(b => elaboracaoTypes.includes(b.type));
    const hasObjeto = blocks.some(b => objetoTypes.includes(b.type));
    const hasPedagogico = blocks.some(b => pedagogicoTypes.includes(b.type));
    const showSugerida = !hasElaboracao || !hasObjeto || !hasPedagogico;

    const objectBlock = blocks.find(b => objetoTypes.includes(b.type));
    const bottomBlocks = blocks.filter(b => b.id !== objectBlock?.id);

    return (
        <div className="flex w-full min-h-[70vh] px-4 py-8 lg:px-8 max-w-[1920px] mx-auto justify-center relative">

            {/* Coluna Esquerda: Mídia (Fixo) */}
            {previewMode === 'fluxo' && (
                <aside className="hidden xl:flex fixed left-8 top-32 w-64 flex-col z-10">
                    <div className="bg-[#1E1E1E]/80 backdrop-blur-md border border-brand-blue/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(15,71,128,0.3)]">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">Mídia / Conteúdo</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ToolboxButton icon="notes" label="Texto" onClick={() => addBlock('text')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="image" label="Imagem" onClick={() => addBlock('image')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="view_carousel" label="Carrossel" onClick={() => addBlock('carousel')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="view_in_ar" label="Modelo 3D" onClick={() => addBlock('3d_object')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="mic" label="Áudio" onClick={() => addBlock('audio')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                            <ToolboxButton icon="smart_display" label="Vídeo" onClick={() => addBlock('video')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="language" label="Web Page" onClick={() => addBlock('web_page')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="picture_as_pdf" label="PDF" onClick={() => addBlock('pdf')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                            <ToolboxButton icon="folder_zip" label="Pasta do Drive" onClick={() => addBlock('drive')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="format_quote" label="Referências" onClick={() => addBlock('reference')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="shield_person" label="Comentários Autoria" onClick={() => addBlock('notes')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                        </div>
                    </div>
                </aside>
            )}

            {/* Coluna Central: Canvas & Preview */}
            <main
                className={`w-full transition-all duration-500 mt-0 flex flex-col gap-8`}
                onClick={handleCanvasClick}
            >
                {/* Título Global da Ferramenta */}
                <div className="flex flex-col items-center justify-center text-center gap-2 animate-fade-in-up mt-8">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">Plataforma de Lançamento</h2>
                    <p className="text-sm text-gray-400">Aqui você pode diagramar seu post.</p>
                </div>

                {/* Tabs de Modo: Fluxo, Arte, Preview */}
                <div className="w-full flex justify-center sticky top-24 z-40 px-4">
                    <div className="bg-[#121212]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 flex items-center justify-center gap-2 shadow-lg w-fit mx-auto">
                        <button
                            onClick={() => setPreviewMode('fluxo')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${previewMode === 'fluxo' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Fluxo
                        </button>
                        <button
                            onClick={() => setPreviewMode('arte')}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${previewMode === 'arte' ? 'bg-brand-yellow text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Arte
                        </button>
                        <button
                            onClick={() => {
                                setSelectedPreviewId(previewMode === 'arte' ? 'arte' : 'fluxo');
                                setPreviewMode('preview');
                            }}
                            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase transition-all ${previewMode === 'preview' ? 'bg-brand-red text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                {/* 
                  ========== MODO PREVIEW ==========
                  Mostra Miniatura no topo + Página Completa logo abaixo 
                */}
                    {/* Preview Content */}
                    <div className={`flex-col gap-16 w-full max-w-4xl mx-auto items-center animate-fade-in-up ${previewMode === 'preview' ? 'flex' : 'hidden'} overflow-y-auto custom-scrollbar pb-32`}>
                        {/* Seletor de Preview */}
                        <div className="w-fit flex items-center justify-center gap-2 mb-4 bg-[#121212]/80 backdrop-blur-md p-2 rounded-2xl border border-white/5 mx-auto shadow-lg">
                            
                            <button
                                onClick={() => setSelectedPreviewId('fluxo')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${selectedPreviewId === 'fluxo' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Fluxo Atual
                            </button>
                            <button
                                onClick={() => setSelectedPreviewId('arte')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${selectedPreviewId === 'arte' ? 'bg-brand-yellow text-gray-900 shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Arte Atual
                            </button>
                            {drafts.length > 0 && drafts.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => setSelectedPreviewId(d.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${selectedPreviewId === d.id ? 'bg-brand-red text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Rascunho: {d.title.slice(0, 15)}...
                                </button>
                            ))}
                        </div>

                        {/* Miniatura do Feed (Card Real Renderizado com Mock) */}
                        <div className="w-full max-w-sm mx-auto shrink-0 pointer-events-none">
                            <MediaCard
                                post={{
                                    id: 'preview-id',
                                    title: previewData.title || 'Seu Título Aqui',
                                    authors: authors || user?.user_metadata?.full_name || user?.user_metadata?.name || 'Autor(a)',
                                    description: previewData.description || 'Aqui fica sua descrição. Ela funciona como um resumo da sua contribuição e deve atrair a atenção do leitor.',
                                    category: previewData.category || 'Outros',
                                    mediaType: previewData.mediaType || 'placeholder',
                                    mediaUrl: previewData.mediaUrl || '',
                                    createdAt: new Date().toISOString(),
                                    userId: user?.id || 'mock',
                                    likeCount: 0,
                                    saveCount: 0,
                                    commentCount: 0,
                                    views: 0,
                                    isFeatured: false,
                                    isHistorical: isHistorical,
                                    isGoldenStandard: isGoldenStandard,
                                    readingTime: 3,
                                    tags: [],
                                    avatarUrl: user?.user_metadata?.avatar_url,
                                    status: 'published'
                                } as PostDTO}
                            />
                        </div>

                        {previewData.category !== 'Arte' && (
                            <>
                                {/* Divisor Visual */}
                                <div className="flex items-center gap-4 w-full opacity-50">
                                    <div className="h-px bg-white/5 flex-1"></div>
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Layout do Artigo</span>
                                    <div className="h-px bg-white/5 flex-1"></div>
                                </div>

                                {/* Corpo do Artigo Fictício (Post Completo) */}
                                <div className="w-full max-w-5xl mx-auto bg-[#1E1E1E] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/5 pointer-events-none mt-8">
                                    <div className="p-6 md:p-10 space-y-6">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 rounded-full text-xs font-bold tracking-wide uppercase">
                                                {previewData.category || 'Todos'}
                                            </span>
                                            {isGoldenStandard && (
                                                <span className="px-3 py-1 bg-gradient-to-r from-brand-yellow via-brand-yellow/80 to-brand-yellow text-gray-900 rounded-full text-xs font-black tracking-wide uppercase">
                                                    Padrão Ouro
                                                </span>
                                            )}
                                        </div>

                                        <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                                            {previewData.title || 'Sem Título'}
                                        </h1>

                                        <div className="flex flex-col py-4 border-y border-white/5">
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs uppercase shrink-0">
                                                        {(authors || user?.user_metadata?.full_name || 'A').substring(0, 2)}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Autore(s)</span>
                                                        <span className="text-sm font-bold text-white">{authors || user?.user_metadata?.full_name || 'Autor(a)'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8">
                                            <h2 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">Descrição</h2>
                                            <div className="text-gray-400 leading-relaxed prose prose-lg prose-invert max-w-none">
                                                <div className="flex flex-col gap-8">
                                                    {previewData.blocks.map((block: any) => (
                                                        <BlockRenderer key={block.id} block={block} forcePreview={true} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                {/* 
                  ========== MODO EDIÇÃO ==========
                */}
                <div className="flex flex-col gap-8 w-full items-start">
                    {/* Editor Content */}
                    <div className={`flex-col w-full max-w-4xl mx-auto animate-fade-in-up ${previewMode !== 'preview' ? 'flex' : 'hidden'}`}>

                        {/* Título de Cabeçalho na Coluna Central */}
                        {/* (Movido para o topo global) */}

                        <div className="w-full flex flex-col gap-4 mb-8">
                            {/* Card Horizontal: Emissão de Luz (Oculto na Arte) */}
                            {previewMode !== 'arte' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a href="/wiki/divulgacao" target="_blank" rel="noopener noreferrer" className="bg-[#1E1E1E]/90 backdrop-blur-md border border-brand-yellow/30 hover:border-brand-yellow/60 hover:shadow-[0_0_20px_rgba(255,204,0,0.25)] transition-all duration-300 rounded-2xl p-4 flex flex-col items-start justify-between gap-4 cursor-pointer group shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-brand-yellow/10 flex items-center justify-center border border-brand-yellow/20 group-hover:border-brand-yellow/40 group-hover:scale-105 transition-all">
                                                <span className="material-symbols-outlined text-2xl text-brand-yellow">tips_and_updates</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wider text-white">Emissão de Luz</span>
                                                <span className="text-xs font-medium text-gray-300 mt-1">Acesse nosso guia com instruções, dicas e bases teóricas sobre comunicação</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-2.5 bg-brand-yellow hover:bg-[#E5B800] text-gray-900 text-xs font-black uppercase rounded-lg transition-colors shadow-md pointer-events-none">
                                            Ver o Guia
                                        </button>
                                    </a>
                                    <div onClick={() => setIsProfileModalOpen(true)} className="bg-[#1E1E1E]/90 backdrop-blur-md border border-brand-red/30 hover:border-brand-red/60 hover:shadow-[0_0_20px_rgba(241,67,67,0.35)] transition-all duration-300 rounded-2xl p-4 flex flex-col items-start justify-between gap-4 cursor-pointer group shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-full bg-brand-red/10 flex items-center justify-center border border-brand-red/20 group-hover:border-brand-red/40 group-hover:scale-105 transition-all">
                                                <span className="material-symbols-outlined text-2xl text-brand-red">query_stats</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold uppercase tracking-wider text-white">Público Alvo</span>
                                                <span className="text-xs font-medium text-gray-300 mt-1">Estatísticas do Público do HUB</span>
                                            </div>
                                        </div>
                                        <button className="w-full py-2.5 bg-brand-red hover:bg-[#D93030] text-white text-xs font-black uppercase rounded-lg transition-colors shadow-md pointer-events-none">
                                            Ver Estatísticas
                                        </button>
                                    </div>
                                </div>
                            )}

                            {previewMode !== 'arte' && <DraftsMenu />}
                        </div>

                        {/* Editor Principal */}
                        <div className="bg-[#121212]/60 border-brand-blue/30 shadow-[0_0_50px_rgba(15,71,128,0.2)] border rounded-[32px] p-6 lg:p-12 pb-64 relative min-h-[500px] z-20">
                            {/* 1. Warning for Mock Template */}
                            {previewMode !== 'arte' && blocks.some(b => String(b.id).startsWith('mock-')) && (
                                <div className="w-full bg-brand-yellow/10 border border-brand-yellow/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                                    <div className="flex items-start gap-3">
                                        <span className="material-symbols-outlined text-[20px] text-brand-yellow shrink-0 mt-0.5">warning</span>
                                        <p className="text-sm text-gray-300">
                                            <strong className="text-brand-yellow">Exemplo Didático:</strong> Você está visualizando um <strong>post pré-montado</strong> para entender como o diagrama funciona. Você pode editá-lo ou começar do zero.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setBlocks([])}
                                        className="shrink-0 px-4 py-2 bg-[#121212] border border-white/10 hover:border-brand-red hover:text-brand-red rounded-lg text-xs font-bold uppercase transition-colors"
                                    >
                                        Limpar Canvas
                                    </button>
                                </div>
                            )}

                            {/* 2. Metadados Obrigatórios (Author, Category, Language, Year) */}
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-brand-blue/30 pb-8">
                                <div className="flex items-center gap-3 flex-1 w-full">
                                    <div className="size-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs uppercase shrink-0">
                                        <span className="material-symbols-outlined text-[20px]">person_edit</span>
                                    </div>
                                    <div className="flex flex-col flex-1 max-w-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Autor/Apelido <span className="text-brand-red">*</span></span>
                                            <span className={`text-[10px] font-bold ${authors.length > 60 ? 'text-brand-red' : 'text-gray-600'}`}>{authors.length}/60</span>
                                        </div>
                                        <input
                                            type="text"
                                            value={authors}
                                            maxLength={60}
                                            onChange={(e) => setAuthors(e.target.value)}
                                            placeholder={user?.user_metadata?.full_name || 'Seu Nome ou Pseudônimo'}
                                            className="w-full bg-transparent border-b border-white/5/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium placeholder-gray-600 transition-colors py-1"
                                        />
                                        {(mainName || pseudonyms.length > 0) && (
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                {mainName && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setAuthors(mainName)}
                                                        className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-colors border ${authors === mainName ? 'bg-brand-blue text-white border-brand-blue' : 'text-gray-500 border-white/5 hover:border-brand-blue/50 hover:text-brand-blue'}`}
                                                    >
                                                        {mainName}
                                                    </button>
                                                )}
                                                {pseudonyms.map(p => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setAuthors(p.name)}
                                                        className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-colors border ${authors === p.name ? 'bg-brand-blue text-white border-brand-blue' : 'text-gray-500 border-white/5 hover:border-brand-blue/50 hover:text-brand-blue'}`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                ))}
                                                <span className="text-[8px] text-gray-600 uppercase tracking-widest ml-1 hidden sm:inline">(Gerenciar apelidos no perfil)</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    {previewMode !== 'arte' && (
                                        <>
                                            <div className="flex flex-col max-w-[150px] w-full">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Categoria <span className="text-brand-red">*</span></span>
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/5/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium transition-colors py-1 appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled className="bg-[#121212] text-gray-500">Selecione...</option>
                                                    {CATEGORIES.map(cat => (
                                                        <option key={cat} value={cat} className="bg-[#121212] text-white">{cat}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex flex-col max-w-[150px] w-full">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Linguagem <span className="text-brand-red">*</span></span>
                                                <select
                                                    value={languageRegister}
                                                    onChange={(e) => setLanguageRegister(e.target.value)}
                                                    className="w-full bg-transparent border-b border-white/5/50 hover:border-brand-yellow/50 focus:border-brand-yellow outline-none text-white text-lg font-medium transition-colors py-1 appearance-none cursor-pointer"
                                                >
                                                    <option value="jovem" className="bg-[#121212] text-white">Jovem</option>
                                                    <option value="nerd_geek" className="bg-[#121212] text-white">Nerd/Geek</option>
                                                    <option value="artistica" className="bg-[#121212] text-white">Artística</option>
                                                    <option value="academica" className="bg-[#121212] text-white">Acadêmica</option>
                                                </select>
                                            </div>
                                        </>
                                    )}

                                    <div className="flex flex-col max-w-[100px] w-full">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ano <span className="text-brand-red">*</span></span>
                                        <input
                                            type="number"
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            min="1934"
                                            max={new Date().getFullYear()}
                                            className="w-full bg-transparent border-b border-white/5/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium transition-colors py-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Bloco do Objeto ou Placeholders Principais */}
                            <div className="flex flex-col gap-8 max-w-full mx-auto">
                                {objectBlock ? (
                                    <React.Fragment key={objectBlock.id}>
                                        <div className="w-full">
                                            <BlockRenderer block={objectBlock} />
                                        </div>
                                    </React.Fragment>
                                ) : (
                                    <>
                                        {/* Canvas Vazio */}
                                        <div className="mt-8 mb-4 w-full flex flex-col items-center gap-6">
                                            {previewMode !== 'arte' && blocks.length === 0 && (
                                                <button
                                                    onClick={() => restoreMockBlocks()}
                                                    className="px-4 py-2 bg-brand-yellow text-gray-900 font-black text-xs uppercase tracking-widest rounded-lg hover:bg-[#E5B800] transition-colors shadow-lg"
                                                >
                                                    Voltar ao Post Pré-Montado
                                                </button>
                                            )}
                                        </div>

                                        {/* Empty State Arte */}
                                        {previewMode === 'arte' && !hasObjeto && (
                                            <div className="w-full flex flex-col items-center justify-center gap-6">
                                                <div className="scale-125">
                                                    <InlineAddMenu />
                                                </div>
                                                <p className="text-gray-500 text-sm font-medium">Comece a adicionar blocos à sua arte.</p>
                                            </div>
                                        )}

                                        {/* Placeholder Objeto (Fluxo) */}
                                        {(showSugerida && previewMode !== 'arte' && !hasObjeto) && (
                                            <div className="w-full relative z-50 flex flex-col gap-4">
                                                {blocks.length === 0 && <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest font-black mb-2 opacity-50">Estrutura Sugerida</p>}
                                                <div className="w-full border-2 border-dashed border-brand-yellow/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-[#121212]/30 hover:bg-brand-yellow/5 transition-colors group text-center">
                                                    <div className="w-10 h-10 rounded-full bg-brand-yellow/10 flex items-center justify-center">
                                                        <span className="material-symbols-outlined text-brand-yellow">category</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-brand-yellow font-black uppercase tracking-widest text-[10px]">1. Seu Objeto Principal *</span>
                                                        <span className="text-gray-500 text-xs mt-1">Insira imagens, modelos 3D, áudio ou vídeo</span>
                                                    </div>
                                                    <div className="scale-90 group-hover:scale-100 transition-transform mt-2 relative z-10">
                                                        <InlineAddMenu variant="yellow" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* 4. Título e Descrição */}
                            <div className="flex flex-col gap-6 my-12">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Título da Contribuição <span className="text-brand-red">*</span></span>
                                        <span className={`text-[10px] font-bold ${title.length > 100 ? 'text-brand-red' : 'text-gray-600'}`}>{title.length}/100</span>
                                    </div>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Digite aqui o título..."
                                        maxLength={100}
                                        className="w-full text-4xl lg:text-5xl font-black bg-transparent outline-none text-white placeholder-gray-600 tracking-tight"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">Descrição {previewMode !== 'arte' && <span className="text-brand-red">*</span>}</span>
                                        <span className={`text-[10px] font-bold ${description.length > 300 ? 'text-brand-red' : 'text-gray-600'}`}>{description.length}/300</span>
                                    </div>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={previewMode === 'arte' ? "Descrição opcional..." : "Resumo da contribuição..."}
                                        maxLength={300}
                                        rows={4}
                                        className="w-full text-sm font-medium bg-white/5 border border-white/10 rounded-xl p-4 outline-none text-white placeholder-gray-500 resize-none focus:border-brand-blue/50 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* 5. Separador Página Completa */}
                            <div className="flex items-center gap-4 w-full opacity-50 my-12">
                                <div className="h-px bg-white/5 flex-1"></div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Visível apenas na página completa</span>
                                <div className="h-px bg-white/5 flex-1"></div>
                            </div>

                            {/* 6. Blocos Secundários e Placeholders Restantes */}
                            <div className="flex flex-col gap-8 max-w-full mx-auto">
                                {objectBlock && objectBlock.type !== 'link' && (
                                    <InlineAddMenu insertAfterId={objectBlock.id} />
                                )}
                                {bottomBlocks.map((block) => (
                                    <React.Fragment key={block.id}>
                                        <div className="w-full">
                                            <BlockRenderer block={block} />
                                        </div>
                                        {block.type !== 'link' && <InlineAddMenu insertAfterId={block.id} />}
                                    </React.Fragment>
                                ))}

                                {/* Placeholders Secundários (Fluxo) */}
                                {(showSugerida && previewMode !== 'arte') && (
                                    <div className="w-full relative z-50 flex flex-col gap-4 mt-8">
                                        {(blocks.length > 0 && (!hasElaboracao || !hasPedagogico)) && (
                                            <p className="text-[10px] text-brand-yellow text-center uppercase tracking-widest font-black mb-2 opacity-80 mt-8">Eixos Obrigatórios Pendentes</p>
                                        )}
                                        
                                        {!hasElaboracao && (
                                            <div className="w-full border-2 border-dashed border-brand-blue/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-[#121212]/30 hover:bg-brand-blue/5 transition-colors group text-center">
                                                <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-brand-blue">notes</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-brand-blue font-black uppercase tracking-widest text-[10px]">2. Elaboração / Conceituação *</span>
                                                    <span className="text-gray-500 text-xs mt-1">Insira textos de apoio, anotações ou referências</span>
                                                </div>
                                                <div className="scale-90 group-hover:scale-100 transition-transform mt-2 relative z-10">
                                                    <InlineAddMenu variant="blue" />
                                                </div>
                                            </div>
                                        )}

                                        {!hasPedagogico && (
                                            <div className="w-full border-2 border-dashed border-brand-red/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-[#121212]/30 hover:bg-brand-red/5 transition-colors group text-center">
                                                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-brand-red">psychology</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-brand-red font-black uppercase tracking-widest text-[10px]">3. Reflexão Pedagógica *</span>
                                                    <span className="text-gray-500 text-xs mt-1">Adicione quizzes ou contexto histórico/social</span>
                                                </div>
                                                <div className="scale-90 group-hover:scale-100 transition-transform mt-2 relative z-10">
                                                    <InlineAddMenu variant="red" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Seção de Aceites e Lançamento (Fim da Página) */}
                <div className="flex flex-col gap-4 items-center w-full max-w-3xl mx-auto mt-24 mb-16">
                    <div className="flex flex-col gap-4 bg-[#121212]/40 backdrop-blur-md p-6 rounded-2xl border border-brand-blue/30 shadow-2xl w-full">

                        {/* Guia de Boas Práticas */}
                        <div className="flex flex-col gap-2">
                            <span className="text-brand-blue text-[10px] font-bold uppercase tracking-wider">Documentação Legal</span>
                            <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <strong className="text-gray-200 text-xs">Guia de Boas Práticas da Comunidade LabDiv *</strong>
                                    <button
                                        onClick={() => setIsGuideModalOpen(true)}
                                        className="px-3 py-1 bg-white/5 hover:bg-gray-600 text-white text-[10px] font-bold uppercase rounded transition-colors shadow flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                        Ler em Popup
                                    </button>
                                </div>
                                <div className="max-h-24 overflow-y-auto text-[11px] text-gray-400 leading-relaxed custom-scrollbar pr-2">
                                    1. Respeito Mútuo: Mantenha um ambiente acolhedor e construtivo.<br />
                                    2. Rigor Científico: Todo conteúdo deve ser embasado e referenciado.<br />
                                    3. Acessibilidade: Evite jargões desnecessários; seja claro e didático.<br />
                                    4. Originalidade: O plágio não é tolerado. Dê crédito às fontes.<br />
                                    5. Responsabilidade: Você é responsável pelas afirmações que publica.
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group mt-2">
                                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors border ${readGuide ? 'bg-brand-blue border-brand-blue' : 'bg-[#1E1E1E] border-brand-blue/60 group-hover:border-brand-blue'}`}>
                                    {readGuide && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={readGuide} onChange={(e) => setReadGuide(e.target.checked)} />
                                <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Li e concordo com o Guia</span>
                            </label>
                        </div>

                        <div className="h-px w-full bg-[#1E1E1E] my-2"></div>

                        {/* Licença CC-BY */}
                        <div className="flex flex-col gap-2">
                            <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <strong className="text-gray-200 text-xs">Licença Creative Commons (CC BY 4.0) {previewMode === 'arte' ? '(Opcional)' : '*'}</strong>
                                    <button
                                        onClick={() => setIsLicenseModalOpen(true)}
                                        className="px-3 py-1 bg-white/5 hover:bg-gray-600 text-white text-[10px] font-bold uppercase rounded transition-colors shadow flex items-center gap-1"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                                        Ler em Popup
                                    </button>
                                </div>
                                <div className="max-h-24 overflow-y-auto text-[11px] text-gray-400 leading-relaxed custom-scrollbar pr-2">
                                    Ao licenciar sua contribuição sob a licença CC BY, você permite que outras pessoas distribuam, remixem, adaptem e criem a partir do seu trabalho, mesmo para fins comerciais, desde que lhe atribuam o devido crédito pela criação original.<br /><br />
                                    Você é livre para:<br />
                                    - Compartilhar: copiar e redistribuir o material em qualquer suporte ou formato.<br />
                                    - Adaptar: remixar, transformar e criar a partir do material para qualquer fim.<br />
                                    Sob os seguintes termos:<br />
                                    - Atribuição: Você deve dar o crédito apropriado, prover um link para a licença e indicar se mudanças foram feitas.
                                    {previewMode === 'arte' && <><br /><br /><strong>Nota para Artes:</strong> Se você não aceitar esta licença, sua arte manterá os direitos autorais fechados (Todos os Direitos Reservados).</>}
                                </div>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer group mt-2">
                                <div className={`w-6 h-6 shrink-0 rounded flex items-center justify-center transition-colors border ${acceptedCc ? 'bg-brand-red border-brand-red' : 'bg-[#1E1E1E] border-brand-red/60 group-hover:border-brand-red'}`}>
                                    {acceptedCc && <span className="material-symbols-outlined text-white text-sm font-bold">check</span>}
                                </div>
                                <input type="checkbox" className="hidden" checked={acceptedCc} onChange={(e) => setAcceptedCc(e.target.checked)} />
                                <span className="text-gray-200 text-sm font-medium group-hover:text-white transition-colors">Aceito os termos da Licença CC-BY</span>
                            </label>
                        </div>

                        <div className="h-px w-full bg-[#1E1E1E] my-2"></div>



                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full mt-4">
                        {!editId && previewMode !== 'arte' && (
                            <button
                                onClick={handleSaveDraft}
                                className="w-full sm:w-auto flex flex-col items-center justify-center px-6 py-2 min-h-[68px] rounded-xl bg-[#1E1E1E]/80 backdrop-blur-md border border-dashed border-gray-500/50 hover:border-brand-blue/50 hover:bg-white/5 text-gray-300 font-bold transition-all hover:scale-[1.02] active:scale-95 group shadow-lg"
                            >
                                <div className="flex items-center gap-2 text-sm text-white group-hover:text-brand-blue transition-colors whitespace-nowrap">
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    <span>Salvar Rascunho</span>
                                </div>
                                <span className="text-[9px] font-medium text-gray-500 uppercase tracking-widest mt-1 group-hover:text-gray-400 transition-colors whitespace-nowrap">
                                    Salvo em Cache (Máx. 3)
                                </span>
                            </button>
                        )}
                        {editId && (
                            <button
                                onClick={handleUpdate}
                                className="w-full flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-[#1E1E1E] border border-brand-blue/50 text-brand-blue font-bold text-xl hover:bg-brand-blue/10 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                disabled={!readGuide || (previewMode !== 'arte' && !acceptedCc) || isSubmitting}
                                title={(!readGuide || (previewMode !== 'arte' && !acceptedCc)) ? "Você precisa aceitar os termos acima para continuar" : ""}
                            >
                                {isSubmitting ? 'Atualizando...' : 'Atualizar Original 🔄'}
                            </button>
                        )}
                        <button
                            onClick={handlePublish}
                            className="w-full flex items-center justify-center gap-2 px-8 py-5 rounded-xl bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red text-white font-bold text-xl hover:opacity-90 transition-all shadow-[0_0_30px_rgba(255,204,0,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            disabled={!readGuide || (previewMode !== 'arte' && !acceptedCc) || isSubmitting}
                            title={(!readGuide || (previewMode !== 'arte' && !acceptedCc)) ? "Você precisa aceitar os termos acima para continuar" : ""}
                        >
                            {isSubmitting ? 'Lançando...' : (editId ? 'Lançar como Novo Post 🚀' : 'Lançar Conteúdo 🚀')}
                        </button>
                    </div>
                </div>

            </main>

            {/* Coluna Direita: Pedagógico (Fixo) */}
            {previewMode === 'fluxo' && (
                <aside className="hidden xl:flex fixed right-8 top-32 w-64 flex-col z-10">
                    <div className="bg-[#121212]/60 backdrop-blur-md border border-brand-yellow/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(255,204,0,0.15)]">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">Conexões Pedagógicas</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ToolboxButton icon="psychology" label="Reflexão" onClick={() => addBlock('reflection')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="quiz" label="Quiz" onClick={() => addBlock('quiz')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                            <ToolboxButton icon="history_edu" label="Contexto Histórico" onClick={() => addBlock('context_history')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="groups" label="Contexto Social" onClick={() => addBlock('context_social')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="gavel" label="Contexto Político" onClick={() => addBlock('context_political')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                        </div>
                    </div>
                </aside>
            )}

            {/* Modal Guia de Boas Práticas */}
            {isGuideModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#121212] border border-brand-blue/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(15,71,128,0.2)] flex flex-col overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E1E]/50">
                            <h3 className="text-lg font-bold text-white">Guia de Boas Práticas</h3>
                            <button onClick={() => setIsGuideModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <strong className="text-white block mb-4">Guia de Boas Práticas da Comunidade LabDiv</strong>
                            <ol className="list-decimal list-inside space-y-3">
                                <li><strong>Respeito Mútuo:</strong> Mantenha um ambiente acolhedor e construtivo.</li>
                                <li><strong>Rigor Científico:</strong> Todo conteúdo deve ser embasado e referenciado.</li>
                                <li><strong>Acessibilidade:</strong> Evite jargões desnecessários; seja claro e didático.</li>
                                <li><strong>Originalidade:</strong> O plágio não é tolerado. Dê crédito às fontes.</li>
                                <li><strong>Responsabilidade:</strong> Você é responsável pelas afirmações que publica.</li>
                            </ol>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-[#1E1E1E]/30 flex justify-end gap-3">
                            <button
                                onClick={() => setIsGuideModalOpen(false)}
                                className="px-6 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => { setIsGuideModalOpen(false); setReadGuide(true); }}
                                className="px-6 py-2 bg-brand-blue hover:bg-[#0D3B6B] text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-lg"
                            >
                                Li e Concordo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Licença CC-BY */}
            {isLicenseModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#121212] border border-brand-red/30 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(241,67,67,0.2)] flex flex-col overflow-hidden animate-slide-up">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E1E]/50">
                            <h3 className="text-lg font-bold text-white">Licença CC BY 4.0</h3>
                            <button onClick={() => setIsLicenseModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6 text-sm text-gray-300 leading-relaxed overflow-y-auto max-h-[60vh] custom-scrollbar">
                            <strong className="text-white block mb-4">Licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)</strong>
                            <p className="mb-4">
                                Ao licenciar sua contribuição sob a licença CC BY, você permite que outras pessoas distribuam, remixem, adaptem e criem a partir do seu trabalho, mesmo para fins comerciais, desde que lhe atribuam o devido crédito pela criação original.
                            </p>
                            <strong className="text-white block mb-2">Você é livre para:</strong>
                            <ul className="list-disc list-inside space-y-2 mb-4">
                                <li><strong>Compartilhar:</strong> copiar e redistribuir o material em qualquer suporte ou formato.</li>
                                <li><strong>Adaptar:</strong> remixar, transformar e criar a partir do material para qualquer fim.</li>
                            </ul>
                            <strong className="text-white block mb-2">Sob os seguintes termos:</strong>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong>Atribuição:</strong> Você deve dar o crédito apropriado, prover um link para a licença e indicar se mudanças foram feitas.</li>
                            </ul>
                        </div>
                        <div className="p-4 border-t border-white/5 bg-[#1E1E1E]/30 flex justify-end gap-3">
                            <button
                                onClick={() => setIsLicenseModalOpen(false)}
                                className="px-6 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase rounded-lg transition-colors"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => { setIsLicenseModalOpen(false); setAcceptedCc(true); }}
                                className="px-6 py-2 bg-brand-red hover:bg-[#D93B3B] text-white text-xs font-bold uppercase rounded-lg transition-colors shadow-lg"
                            >
                                Aceito os Termos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modais */}
            <TargetProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
        </div>
    );
}

function ToolboxButton({ icon, label, onClick, colorClass }: { icon: string, label: string, onClick: () => void, colorClass: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full p-3 rounded-xl border border-transparent transition-all bg-[#1E1E1E]/30 ${colorClass}`}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}
