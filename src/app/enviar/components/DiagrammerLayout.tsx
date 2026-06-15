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

export function DiagrammerLayout() {
    const { 
        blocks, addBlock, setActiveBlock, activeBlockId, title, setTitle,
        authors, setAuthors, year, setYear,
        readGuide, setReadGuide, acceptedCc, setAcceptedCc, previewMode,
        category, setCategory, isHistorical, isGoldenStandard
    } = useSubmissionStore();

    const [pseudonyms, setPseudonyms] = React.useState<{id: string; name: string}[]>([]);
    const [mainName, setMainName] = React.useState<string>('');
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

    const handleCanvasClick = () => {
        if (activeBlockId !== null) {
            setActiveBlock(null);
        }
    };

    return (
        <div className="flex w-full min-h-[70vh] px-4 py-8 lg:px-8 max-w-[1920px] mx-auto justify-center relative">
            
            {/* Coluna Esquerda: Mídia (Fixo) */}
            {previewMode === 'edit' && (
                <aside className="hidden xl:flex fixed left-8 top-32 w-64 flex-col z-10">
                    <div className="bg-gray-900/60 backdrop-blur-md border border-brand-blue/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(15,71,128,0.3)]">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">Mídia / Conteúdo</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ToolboxButton icon="notes" label="Texto" onClick={() => addBlock('text')} colorClass="hover:bg-white/10 hover:text-white text-gray-300" />
                            <ToolboxButton icon="image" label="Imagem" onClick={() => addBlock('image')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="view_in_ar" label="Modelo 3D" onClick={() => addBlock('3d_object')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="mic" label="Áudio" onClick={() => addBlock('audio')} colorClass="hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30 text-gray-300" />
                            <ToolboxButton icon="smart_display" label="Vídeo" onClick={() => addBlock('video')} colorClass="hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30 text-gray-300" />
                            <ToolboxButton icon="sports_esports" label="Jogo Web" onClick={() => addBlock('web_game')} colorClass="hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/30 text-gray-300" />
                            <ToolboxButton icon="language" label="Web Page" onClick={() => addBlock('web_page')} colorClass="hover:bg-teal-500/20 hover:text-teal-400 hover:border-teal-500/30 text-gray-300" />
                            <ToolboxButton icon="picture_as_pdf" label="PDF" onClick={() => addBlock('pdf')} colorClass="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-300" />
                            <ToolboxButton icon="edit_note" label="Anotações" onClick={() => addBlock('notes')} colorClass="hover:bg-yellow-500/20 hover:text-yellow-400 hover:border-yellow-500/30 text-gray-300" />
                        </div>
                    </div>
                </aside>
            )}

            {/* Coluna Central: Canvas & Preview */}
            <main 
                className={`w-full transition-all duration-500 mt-16 lg:mt-24 ${previewMode === 'edit' ? 'max-w-4xl' : 'max-w-3xl'} flex flex-col gap-12`}
                onClick={handleCanvasClick}
            >
                
                {/* 
                  ========== MODO PREVIEW ==========
                  Mostra Miniatura no topo + Página Completa logo abaixo 
                */}
                {previewMode === 'preview' && (
                    <div className="flex flex-col gap-16 w-full items-center animate-fade-in-up">
                        
                        {/* Miniatura do Feed (Card Real Renderizado com Mock) */}
                        <div className="w-full max-w-sm mx-auto shrink-0 pointer-events-none">
                            <MediaCard 
                                post={{
                                    id: 'preview-id',
                                    title: title || 'Exemplo de Contribuição',
                                    authors: user?.user_metadata?.full_name || user?.user_metadata?.name || 'Autor(a)',
                                    description: blocks.find((b: any) => b.type === 'text')?.content?.text || 'A verdadeira Entropia do conhecimento diminui apenas quando a ciência não termina quando o experimento é concluído ou quando o paper é publicado.',
                                    category: category || 'Outros',
                                    mediaType: 'text',
                                    mediaUrl: '',
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
                                    avatarUrl: user?.user_metadata?.avatar_url
                                } as PostDTO} 
                            />
                        </div>

                        {/* Divisor Visual */}
                        <div className="flex items-center gap-4 w-full opacity-50">
                            <div className="h-px bg-gray-700 flex-1"></div>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Layout do Artigo</span>
                            <div className="h-px bg-gray-700 flex-1"></div>
                        </div>

                        {/* Corpo do Artigo Fictício (Post Completo) */}
                        <div className="w-full max-w-5xl mx-auto bg-[#1E1E1E] rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-gray-800 pointer-events-none mt-8">
                            <div className="p-6 md:p-10 space-y-6">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs font-bold tracking-wide uppercase">
                                        {category || 'Todos'}
                                    </span>
                                    {isGoldenStandard && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-brand-yellow via-brand-yellow/80 to-brand-yellow text-gray-900 rounded-full text-xs font-black tracking-wide uppercase">
                                            Padrão Ouro
                                        </span>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                                    {title || 'Sem Título'}
                                </h1>

                                <div className="flex flex-col py-4 border-y border-gray-800">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-blue-400 font-bold text-xs uppercase shrink-0">
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
                                            {blocks.map((block) => (
                                                <BlockRenderer key={block.id} block={block} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 
                  ========== MODO EDIÇÃO ==========
                */}
                {previewMode === 'edit' && (
                    <div className="flex flex-col w-full animate-fade-in-up">
                        
                        {/* Título de Cabeçalho na Coluna Central */}
                        <div className="flex flex-col items-center justify-center text-center mb-8 gap-2">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Plataforma de Lançamento</h2>
                            <p className="text-sm text-gray-400">Aqui você pode diagramar seu post.</p>
                        </div>

                        {/* Card Horizontal de Dicas (V3) */}
                        <div className="w-full bg-gray-900/60 backdrop-blur-md border border-brand-yellow/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 shadow-[0_0_30px_rgba(255,204,0,0.1)]">
                            <div className="flex items-center gap-4 text-brand-yellow">
                                <span className="material-symbols-outlined text-3xl">lightbulb</span>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-wider text-brand-yellow/70">Dica de Redação</span>
                                    <span className="text-sm font-medium">Use analogias simples para explicar conceitos complexos.</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase rounded-lg transition-colors border border-gray-700">
                                    Base Teórica
                                </button>
                                <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold uppercase rounded-lg transition-colors border border-gray-700">
                                    Instruções
                                </button>
                                <button className="px-4 py-2 bg-brand-yellow/20 hover:bg-brand-yellow/30 text-brand-yellow text-xs font-bold uppercase rounded-lg transition-colors border border-brand-yellow/30">
                                    Ver Todas
                                </button>
                            </div>
                        </div>

                        {/* Editor Principal */}
                        <div className="bg-gray-900/60 border-brand-blue/30 shadow-[0_0_50px_rgba(15,71,128,0.2)] border rounded-[32px] p-6 lg:p-12 relative min-h-[500px]">
                            <div className="mb-12 border-b border-brand-blue/30 pb-6 flex flex-col gap-6">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Título da sua Contribuição Científica..."
                                    className="w-full text-4xl lg:text-5xl font-black bg-transparent outline-none text-white placeholder-gray-500 tracking-tight"
                                />
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                    <div className="flex items-center gap-3 flex-1 w-full">
                                        <div className="size-10 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue font-bold text-xs uppercase shrink-0">
                                            <span className="material-symbols-outlined text-[20px]">person_edit</span>
                                        </div>
                                        <div className="flex flex-col flex-1 max-w-sm">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Como você quer ser chamado(a)?</span>
                                                <span className={`text-[10px] font-bold ${authors.length > 60 ? 'text-brand-red' : 'text-gray-600'}`}>{authors.length}/60</span>
                                            </div>
                                            <input
                                                type="text"
                                                value={authors}
                                                maxLength={60}
                                                onChange={(e) => setAuthors(e.target.value)}
                                                placeholder={user?.user_metadata?.full_name || 'Seu Nome ou Pseudônimo'}
                                                className="w-full bg-transparent border-b border-gray-700/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium placeholder-gray-600 transition-colors py-1"
                                            />
                                            {(mainName || pseudonyms.length > 0) && (
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    {mainName && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setAuthors(mainName)}
                                                            className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-colors border ${authors === mainName ? 'bg-brand-blue text-white border-brand-blue' : 'text-gray-500 border-gray-800 hover:border-brand-blue/50 hover:text-brand-blue'}`}
                                                        >
                                                            {mainName}
                                                        </button>
                                                    )}
                                                    {pseudonyms.map(p => (
                                                        <button 
                                                            key={p.id}
                                                            type="button"
                                                            onClick={() => setAuthors(p.name)}
                                                            className={`px-2 py-1 text-[9px] font-black uppercase rounded-md transition-colors border ${authors === p.name ? 'bg-brand-blue text-white border-brand-blue' : 'text-gray-500 border-gray-800 hover:border-brand-blue/50 hover:text-brand-blue'}`}
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
                                        <div className="flex flex-col max-w-[200px] w-full">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Categoria</span>
                                            <select 
                                                value={category} 
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-transparent border-b border-gray-700/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium transition-colors py-1 appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-gray-900 text-gray-500">Selecione...</option>
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col max-w-[120px] w-full">
                                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Ano</span>
                                            <input
                                                type="number"
                                                value={year}
                                                onChange={(e) => setYear(e.target.value)}
                                                min="1934"
                                                max={new Date().getFullYear()}
                                                className="w-full bg-transparent border-b border-gray-700/50 hover:border-brand-blue/50 focus:border-brand-blue outline-none text-white text-lg font-medium transition-colors py-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Área de Inserção Inicial */}
                            {blocks.length === 0 ? (
                                <div className="w-full h-48 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-brand-blue/40 bg-gray-800/40 rounded-2xl mb-4">
                                    <span className="material-symbols-outlined text-4xl mb-3 opacity-60 text-brand-blue">note_add</span>
                                    <p className="font-medium text-gray-300">Seu canvas está vazio.</p>
                                    <p className="text-sm mt-1 mb-4">Clique no botão + abaixo ou nas barras laterais para começar.</p>
                                    <InlineAddMenu />
                                </div>
                            ) : null}

                            {/* Renderização dos Blocos em Edição */}
                            <div className="flex flex-col gap-2 max-w-full mx-auto">
                                {blocks.length > 0 && <InlineAddMenu />}
                                {blocks.map((block) => (
                                    <React.Fragment key={block.id}>
                                        <div className="w-full">
                                            <BlockRenderer block={block} />
                                        </div>
                                        <InlineAddMenu insertAfterId={block.id} />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Coluna Direita: Pedagógico (Fixo) */}
            {previewMode === 'edit' && (
                <aside className="hidden xl:flex fixed right-8 top-32 w-64 flex-col z-10">
                    <div className="bg-gray-900/60 backdrop-blur-md border border-brand-yellow/30 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_0_30px_rgba(255,204,0,0.15)]">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase mb-2">Conexões Pedagógicas</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <ToolboxButton icon="psychology" label="Reflexão" onClick={() => addBlock('reflection')} colorClass="hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30 text-gray-300" />
                            <ToolboxButton icon="quiz" label="Quiz" onClick={() => addBlock('quiz')} colorClass="hover:bg-brand-red/20 hover:text-brand-red hover:border-brand-red/30 text-gray-300" />
                            <ToolboxButton icon="history_edu" label="Contexto Histórico" onClick={() => addBlock('context_history')} colorClass="hover:bg-brand-yellow/20 hover:text-brand-yellow hover:border-brand-yellow/30 text-gray-300" />
                            <ToolboxButton icon="groups" label="Contexto Social" onClick={() => addBlock('context_social')} colorClass="hover:bg-brand-blue/20 hover:text-brand-blue hover:border-brand-blue/30 text-gray-300" />
                            <ToolboxButton icon="gavel" label="Contexto Político" onClick={() => addBlock('context_political')} colorClass="hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-gray-300" />
                        </div>
                    </div>
                </aside>
            )}

            {/* Seção de Aceites e Lançamento (Fixa no Canto Inferior Direito) */}
            <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4 items-end pointer-events-none w-80 lg:w-96">
                <div className="flex flex-col gap-4 bg-gray-900/95 backdrop-blur-xl p-5 rounded-2xl border border-gray-700 shadow-2xl pointer-events-auto w-full">
                    
                    {/* Guia de Boas Práticas */}
                    <div className="flex flex-col gap-2">
                        <span className="text-brand-blue text-[10px] font-bold uppercase tracking-wider">Documentação Legal</span>
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 max-h-24 overflow-y-auto text-[10px] text-gray-400 leading-relaxed custom-scrollbar">
                            <strong className="text-gray-200 block mb-1">Guia de Boas Práticas da Comunidade LabDiv</strong>
                            1. Respeito Mútuo: Mantenha um ambiente acolhedor e construtivo.<br/>
                            2. Rigor Científico: Todo conteúdo deve ser embasado e referenciado.<br/>
                            3. Acessibilidade: Evite jargões desnecessários; seja claro e didático.<br/>
                            4. Originalidade: O plágio não é tolerado. Dê crédito às fontes.<br/>
                            5. Responsabilidade: Você é responsável pelas afirmações que publica.
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group mt-1">
                            <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center transition-colors border ${readGuide ? 'bg-brand-blue border-brand-blue' : 'bg-gray-800 border-brand-blue/60 group-hover:border-brand-blue'}`}>
                                {readGuide && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={readGuide} onChange={(e) => setReadGuide(e.target.checked)} />
                            <span className="text-gray-200 text-xs font-medium group-hover:text-white transition-colors">Li e concordo com o Guia</span>
                        </label>
                    </div>

                    <div className="h-px w-full bg-gray-800"></div>

                    {/* Licença CC-BY */}
                    <div className="flex flex-col gap-2">
                        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 max-h-24 overflow-y-auto text-[10px] text-gray-400 leading-relaxed custom-scrollbar">
                            <strong className="text-gray-200 block mb-1">Licença Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)</strong>
                            Ao licenciar sua contribuição sob a licença CC BY, você permite que outras pessoas distribuam, remixem, adaptem e criem a partir do seu trabalho, mesmo para fins comerciais, desde que lhe atribuam o devido crédito pela criação original.<br/><br/>
                            Você é livre para:<br/>
                            - Compartilhar: copiar e redistribuir o material em qualquer suporte ou formato.<br/>
                            - Adaptar: remixar, transformar e criar a partir do material para qualquer fim.<br/>
                            Sob os seguintes termos:<br/>
                            - Atribuição: Você deve dar o crédito apropriado, prover um link para a licença e indicar se mudanças foram feitas.
                        </div>
                        <label className="flex items-center gap-3 cursor-pointer group mt-1">
                            <div className={`w-5 h-5 shrink-0 rounded flex items-center justify-center transition-colors border ${acceptedCc ? 'bg-brand-red border-brand-red' : 'bg-gray-800 border-brand-red/60 group-hover:border-brand-red'}`}>
                                {acceptedCc && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
                            </div>
                            <input type="checkbox" className="hidden" checked={acceptedCc} onChange={(e) => setAcceptedCc(e.target.checked)} />
                            <span className="text-gray-200 text-xs font-medium group-hover:text-white transition-colors">Aceito os termos da Licença CC-BY</span>
                        </label>
                    </div>
                </div>

                <button
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red text-white font-bold text-lg hover:opacity-90 transition-all shadow-[0_0_30px_rgba(255,204,0,0.3)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed pointer-events-auto"
                    disabled={!readGuide || !acceptedCc}
                    title={(!readGuide || !acceptedCc) ? "Você precisa aceitar os termos acima para continuar" : ""}
                >
                    Lançar Conteúdo 🚀
                </button>
            </div>

        </div>
    );
}

function ToolboxButton({ icon, label, onClick, colorClass }: { icon: string, label: string, onClick: () => void, colorClass: string }) {
    return (
        <button 
            onClick={onClick}
            className={`flex items-center gap-3 w-full p-3 rounded-xl border border-transparent transition-all bg-gray-800/30 ${colorClass}`}
        >
            <span className="material-symbols-outlined text-xl">{icon}</span>
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );
}
