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


import React from 'react';
import toast from 'react-hot-toast';
import { 
    approveWord, rejectWord, 
    approveConstellation, rejectConstellation, 
    approveGeneratedWord, rejectGeneratedWord,
    updateWord,
    addGeneratedWordAdmin, updateGeneratedWord, deleteGeneratedWord,
    addConstellationAdmin, updateConstellation, deleteConstellation
} from './actions';

export function AdminGlossaryCard({ palavra, allConstellations = [] }: { palavra: any, allConstellations?: string[] }) {
    const handleApproveWord = async () => {
        const tid = toast.loading('Aprovando palavra...');
        const res = await approveWord(palavra.id);
        if (res.success) toast.success('Palavra aprovada!', { id: tid });
        else toast.error('Erro ao aprovar', { id: tid });
    };

    const handleRejectWord = async () => {
        if (!confirm('Tem certeza que deseja recusar esta palavra?')) return;
        const tid = toast.loading('Recusando...');
        const res = await rejectWord(palavra.id);
        if (res.success) toast.success('Palavra recusada', { id: tid });
        else toast.error('Erro ao recusar', { id: tid });
    };

    const handleApproveConstellation = async (id: string) => {
        const tid = toast.loading('Aprovando tradução...');
        const res = await approveConstellation(id);
        if (res.success) toast.success('Tradução aprovada!', { id: tid });
        else toast.error('Erro ao aprovar', { id: tid });
    };

    const handleRejectConstellation = async (id: string) => {
        if (!confirm('Tem certeza que deseja recusar esta tradução?')) return;
        const tid = toast.loading('Recusando...');
        const res = await rejectConstellation(id);
        if (res.success) toast.success('Tradução recusada', { id: tid });
        else toast.error('Erro ao recusar', { id: tid });
    };

    const handleApproveGenerated = async (id: string) => {
        const tid = toast.loading('Aprovando palavra gerada...');
        const res = await approveGeneratedWord(id);
        if (res.success) toast.success('Aprovada!', { id: tid });
        else toast.error('Erro ao aprovar', { id: tid });
    };

    const handleRejectGenerated = async (id: string) => {
        if (!confirm('Tem certeza que deseja recusar esta palavra gerada?')) return;
        const tid = toast.loading('Recusando...');
        const res = await rejectGeneratedWord(id);
        if (res.success) toast.success('Recusada', { id: tid });
        else toast.error('Erro ao recusar', { id: tid });
    };

    // ---- Estados para Edição Inline ----
    const [isEditingMain, setIsEditingMain] = React.useState(false);
    const [mainForm, setMainForm] = React.useState({ termo: palavra.termo, codificacao_academica: palavra.codificacao_academica });

    const handleUpdateMain = async () => {
        const tid = toast.loading('Atualizando...');
        const res = await updateWord(palavra.id, mainForm.termo, mainForm.codificacao_academica);
        if (res.success) { toast.success('Atualizado', { id: tid }); setIsEditingMain(false); }
        else toast.error('Erro', { id: tid });
    };

    // Estados Palavras Geradas
    const handleAddGenerated = async () => {
        const t = prompt('Digite a nova palavra gerada (filha):');
        if (!t) return;
        const tid = toast.loading('Adicionando...');
        const res = await addGeneratedWordAdmin(palavra.id, t);
        if (res.success) toast.success('Adicionado', { id: tid });
        else toast.error('Erro', { id: tid });
    };

    const handleEditGenerated = async (id: string, current: string) => {
        const t = prompt('Editar palavra gerada:', current);
        if (!t || t === current) return;
        const tid = toast.loading('Atualizando...');
        const res = await updateGeneratedWord(id, t);
        if (res.success) toast.success('Atualizado', { id: tid });
        else toast.error('Erro', { id: tid });
    };

    const handleDeleteGenerated = async (id: string) => {
        if (!confirm('Excluir esta palavra gerada?')) return;
        const tid = toast.loading('Excluindo...');
        const res = await deleteGeneratedWord(id);
        if (res.success) toast.success('Excluída', { id: tid });
        else toast.error('Erro', { id: tid });
    };

    // Estados Constelações
    const [isAddingConst, setIsAddingConst] = React.useState(false);
    const [constForm, setConstForm] = React.useState({ constelacao: '', descodificacao: '' });
    
    const [editingConstId, setEditingConstId] = React.useState<string | null>(null);
    const [editConstForm, setEditConstForm] = React.useState({ constelacao: '', descodificacao: '' });

    const handleAddConstellation = async () => {
        if (!constForm.constelacao || !constForm.descodificacao) return;
        const tid = toast.loading('Adicionando...');
        const res = await addConstellationAdmin(palavra.id, constForm.constelacao, constForm.descodificacao);
        if (res.success) { toast.success('Adicionado', { id: tid }); setIsAddingConst(false); setConstForm({ constelacao: '', descodificacao: '' }); }
        else toast.error('Erro', { id: tid });
    };

    const handleUpdateConstellation = async (id: string) => {
        if (!editConstForm.constelacao || !editConstForm.descodificacao) return;
        const tid = toast.loading('Atualizando...');
        const res = await updateConstellation(id, editConstForm.constelacao, editConstForm.descodificacao);
        if (res.success) { toast.success('Atualizado', { id: tid }); setEditingConstId(null); }
        else toast.error('Erro', { id: tid });
    };

    const handleDeleteConstellation = async (id: string) => {
        if (!confirm('Excluir esta constelação?')) return;
        const tid = toast.loading('Excluindo...');
        const res = await deleteConstellation(id);
        if (res.success) toast.success('Excluída', { id: tid });
        else toast.error('Erro', { id: tid });
    };

    if (palavra.is_rejected) return null; // Não exibe palavras rejeitadas na listagem principal (poderia ser uma aba separada no futuro)

    return (
        <div className="bg-neutral-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${palavra.is_pending ? 'from-brand-yellow to-brand-red' : 'from-[#0055ff] to-brand-yellow'} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
            
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Academic Core */}
                <div className="lg:w-2/5 flex flex-col gap-2 border-b lg:border-b-0 lg:border-r border-gray-800 pb-4 lg:pb-0 lg:pr-8 min-w-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between mb-2">
                        {isEditingMain ? (
                            <input 
                                type="text" 
                                value={mainForm.termo} 
                                onChange={e => setMainForm({...mainForm, termo: e.target.value})}
                                className="bg-black/50 border border-gray-700 rounded px-3 py-1 text-white w-full text-xl font-bold"
                            />
                        ) : (
                            <h2 className="text-xl font-bold text-white flex flex-wrap items-center gap-2 break-all sm:break-words">
                                {palavra.termo}
                                {palavra.is_pending && <span className="px-2 py-0.5 bg-brand-yellow/20 text-brand-yellow text-[10px] uppercase font-bold rounded shrink-0">Pendente</span>}
                            </h2>
                        )}
                        
                        <div className="flex gap-2 shrink-0 mt-1">
                            {isEditingMain ? (
                                <>
                                    <button onClick={handleUpdateMain} className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors cursor-pointer" title="Salvar"><span className="material-symbols-outlined text-[18px]">save</span></button>
                                    <button onClick={() => setIsEditingMain(false)} className="p-1.5 text-gray-500 hover:bg-gray-800 rounded-lg transition-colors cursor-pointer" title="Cancelar"><span className="material-symbols-outlined text-[18px]">close</span></button>
                                </>
                            ) : (
                                <button onClick={() => setIsEditingMain(true)} className="p-1.5 text-blue-400 hover:bg-blue-400/20 rounded-lg transition-colors cursor-pointer" title="Editar Núcleo"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                            )}

                            {palavra.is_pending && (
                                <>
                                    <button onClick={handleApproveWord} className="p-1.5 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors cursor-pointer" title="Aprovar">
                                        <span className="material-symbols-outlined text-[18px]">check</span>
                                    </button>
                                    <button onClick={handleRejectWord} className="p-1.5 text-brand-red hover:bg-brand-red/20 rounded-lg transition-colors cursor-pointer" title="Recusar">
                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#0055ff] mt-2 block">Codificação Acadêmica</span>
                    {isEditingMain ? (
                        <textarea 
                            value={mainForm.codificacao_academica}
                            onChange={e => setMainForm({...mainForm, codificacao_academica: e.target.value})}
                            className="bg-black/50 border border-gray-700 rounded px-3 py-2 text-white w-full text-sm min-h-[100px]"
                        />
                    ) : (
                        <p className="text-sm text-gray-300 leading-relaxed mt-1">
                            {palavra.codificacao_academica}
                        </p>
                    )}

                    {/* Palavras Geradas (Filhas) */}
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 block">Palavras Geradas (Filhas)</span>
                            <button onClick={handleAddGenerated} className="text-[10px] uppercase font-bold text-brand-yellow hover:bg-brand-yellow/10 px-2 py-1 rounded flex items-center gap-1 transition-colors">
                                <span className="material-symbols-outlined text-[12px]">add</span> Adicionar
                            </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {palavra.palavras_geradas && palavra.palavras_geradas.filter((g: any) => !g.is_rejected).map((gerada: any) => (
                                <div key={gerada.id} className={`flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full text-xs font-bold border ${gerada.is_pending ? 'border-brand-yellow/50 bg-brand-yellow/10 text-brand-yellow' : 'border-gray-700 bg-gray-800 text-gray-300'}`}>
                                    <span>{gerada.termo}</span>
                                    
                                    <div className="flex items-center ml-1 border-l border-white/20 pl-1 gap-1">
                                        {!gerada.is_pending && (
                                            <>
                                                <button onClick={() => handleEditGenerated(gerada.id, gerada.termo)} className="text-blue-400 hover:text-blue-300" title="Editar"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                                                <button onClick={() => handleDeleteGenerated(gerada.id)} className="text-red-500 hover:text-red-400" title="Excluir"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                                            </>
                                        )}
                                        {gerada.is_pending && (
                                            <>
                                                <button onClick={() => handleApproveGenerated(gerada.id)} className="text-green-500 hover:text-green-400"><span className="material-symbols-outlined text-[14px]">check</span></button>
                                                <button onClick={() => handleRejectGenerated(gerada.id)} className="text-brand-red hover:text-red-400"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {(!palavra.palavras_geradas || palavra.palavras_geradas.filter((g: any) => !g.is_rejected).length === 0) && (
                                <span className="text-xs text-gray-600 italic">Nenhuma palavra gerada.</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Constellations */}
                <div className="lg:w-3/5 min-w-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-brand-yellow text-sm">stars</span>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Constelações Linguísticas</h3>
                        </div>
                        <button onClick={() => setIsAddingConst(true)} className="text-[10px] uppercase font-bold text-brand-blue hover:bg-brand-blue/10 border border-brand-blue/30 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                            <span className="material-symbols-outlined text-[14px]">add</span> Nova Constelação
                        </button>
                    </div>

                    {isAddingConst && (
                        <div className="bg-black/40 p-4 rounded-xl border border-brand-blue/50 mb-4 flex flex-col gap-3">
                            <input 
                                type="text" placeholder="Nome (Ex: NERD)" list={`const-list-${palavra.id}`}
                                value={constForm.constelacao} onChange={e => setConstForm({...constForm, constelacao: e.target.value})}
                                className="bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm"
                            />
                            <datalist id={`const-list-${palavra.id}`}>
                                {allConstellations.map(c => <option key={c} value={c} />)}
                            </datalist>
                            <textarea 
                                placeholder="Tradução..." 
                                value={constForm.descodificacao} onChange={e => setConstForm({...constForm, descodificacao: e.target.value})}
                                className="bg-black border border-gray-700 rounded px-3 py-2 text-white text-sm min-h-[60px]"
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsAddingConst(false)} className="text-xs text-gray-500 hover:text-white px-3 py-1">Cancelar</button>
                                <button onClick={handleAddConstellation} className="text-xs bg-brand-blue text-white font-bold px-4 py-1.5 rounded">Adicionar</button>
                            </div>
                        </div>
                    )}
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                        {palavra.signos_constelacoes?.filter((c: any) => !c.is_rejected).map((constelacao: any) => (
                            <div key={constelacao.id} className={`bg-neutral-800/50 p-4 rounded-xl border ${constelacao.is_pending ? 'border-brand-yellow/50 shadow-[0_0_15px_rgba(255,204,0,0.1)]' : 'border-gray-700/50'} flex flex-col gap-2 relative group/const`}>
                                {editingConstId === constelacao.id ? (
                                    <div className="flex flex-col gap-2">
                                        <input 
                                            type="text" value={editConstForm.constelacao} onChange={e => setEditConstForm({...editConstForm, constelacao: e.target.value})}
                                            list={`const-list-edit-${palavra.id}`}
                                            className="bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs font-bold uppercase"
                                        />
                                        <datalist id={`const-list-edit-${palavra.id}`}>
                                            {allConstellations.map(c => <option key={c} value={c} />)}
                                        </datalist>
                                        <textarea 
                                            value={editConstForm.descodificacao} onChange={e => setEditConstForm({...editConstForm, descodificacao: e.target.value})}
                                            className="bg-black border border-gray-700 rounded px-2 py-1 text-white text-xs min-h-[60px]"
                                        />
                                        <div className="flex justify-end gap-1 mt-1">
                                            <button onClick={() => setEditingConstId(null)} className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">Cancelar</button>
                                            <button onClick={() => handleUpdateConstellation(constelacao.id)} className="text-[10px] text-white bg-green-600 px-2 py-1 rounded font-bold">Salvar</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex justify-between items-start">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest ${constelacao.is_pending ? 'bg-brand-yellow/20 text-brand-yellow' : 'bg-gray-800 text-gray-300'} w-fit`}>
                                                {constelacao.constelacao} {constelacao.is_pending && '(Pendente)'}
                                            </span>
                                            
                                            <div className="flex gap-1 bg-black/40 rounded p-0.5 opacity-0 group-hover/const:opacity-100 transition-opacity">
                                                {!constelacao.is_pending && (
                                                    <>
                                                        <button onClick={() => { setEditingConstId(constelacao.id); setEditConstForm({ constelacao: constelacao.constelacao, descodificacao: constelacao.descodificacao }); }} className="text-blue-400 hover:bg-blue-400/20 rounded p-1" title="Editar"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                                                        <button onClick={() => handleDeleteConstellation(constelacao.id)} className="text-red-500 hover:bg-red-500/20 rounded p-1" title="Excluir"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                                                    </>
                                                )}
                                                {constelacao.is_pending && (
                                                    <>
                                                        <button onClick={() => handleApproveConstellation(constelacao.id)} className="text-green-500 hover:bg-green-500/20 rounded p-1" title="Aprovar">
                                                            <span className="material-symbols-outlined text-[16px]">check</span>
                                                        </button>
                                                        <button onClick={() => handleRejectConstellation(constelacao.id)} className="text-brand-red hover:bg-brand-red/20 rounded p-1" title="Recusar">
                                                            <span className="material-symbols-outlined text-[16px]">close</span>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 italic mt-2">
                                            "{constelacao.descodificacao}"
                                        </p>
                                    </>
                                )}
                            </div>
                        ))}
                        {(!palavra.signos_constelacoes || palavra.signos_constelacoes.filter((c: any) => !c.is_rejected).length === 0) && !isAddingConst && (
                            <div className="col-span-2 text-sm text-gray-500 italic py-2">
                                Nenhuma constelação cadastrada. Apenas o sentido acadêmico será exibido.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
