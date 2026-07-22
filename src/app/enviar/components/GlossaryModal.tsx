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


import React, { useEffect, useState } from 'react';
import { useGlossaryStore } from '@/store/useGlossaryStore';
import { addGeneratorWord, addConstellation } from '@/app/enviar/actions/glossaryActions';
import toast from 'react-hot-toast';

interface GlossaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialSearchTerm?: string;
}

export function GlossaryModal({ isOpen, onClose, initialSearchTerm = '' }: GlossaryModalProps) {
    const { glossary, fetchGlossary } = useGlossaryStore();
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [expandedWordId, setExpandedWordId] = useState<string | null>(null);
    
    // Add new word state
    const [showAddWord, setShowAddWord] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newAcad, setNewAcad] = useState('');
    const [pendingTranslations, setPendingTranslations] = useState<{language: string, text: string}[]>([]);
    const [pendingGenerated, setPendingGenerated] = useState<string[]>([]);
    const [tempLang, setTempLang] = useState('jovem');
    const [tempTransText, setTempTransText] = useState('');
    const [tempGenerated, setTempGenerated] = useState('');
    
    // Add new translation state
    const [showAddTrans, setShowAddTrans] = useState<string | null>(null); // palavra_id
    const [newLanguage, setNewLanguage] = useState('jovem');
    const [newTransText, setNewTransText] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchGlossary();
            setSearchTerm(initialSearchTerm);
            setNewWord(initialSearchTerm);
        }
    }, [isOpen, initialSearchTerm, fetchGlossary]);

    if (!isOpen) return null;

    const filteredWords = glossary.filter(w => w.termo.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleAddWord = async () => {
        if (!newWord || !newAcad) {
            toast.error('Preencha a palavra e o significado acadêmico.');
            return;
        }
        const toastId = toast.loading('Salvando ecossistema da palavra...');
        
        // 1. Save Generator Word
        const res = await addGeneratorWord(newWord, newAcad);
        if (!res.success || !res.data) {
            toast.error(`Erro: ${res.error || 'Falha ao obter ID'}`, { id: toastId });
            return;
        }
        
        const newWordId = res.data.id;

        // 2. Save Translations
        for (const pt of pendingTranslations) {
            await addConstellation(newWordId, pt.language, pt.text);
        }

        // 3. Save Generated Words
        // Import addGeneratedWord from glossaryActions
        const { addGeneratedWord } = await import('@/app/enviar/actions/glossaryActions');
        for (const gen of pendingGenerated) {
            await addGeneratedWord(newWordId, gen);
        }

        fetchGlossary();
        setShowAddWord(false);
        setSearchTerm(newWord);
        setPendingTranslations([]);
        setPendingGenerated([]);
        toast.success('Palavra e constelações salvas com sucesso!', { id: toastId });
    };

    const addTempTranslation = () => {
        if (!tempLang || !tempTransText) return;
        setPendingTranslations([...pendingTranslations, { language: tempLang, text: tempTransText }]);
        setTempTransText('');
    };

    const addTempGenerated = () => {
        if (!tempGenerated) return;
        setPendingGenerated([...pendingGenerated, tempGenerated]);
        setTempGenerated('');
    };

    const handleAddTrans = async (palavra_id: string) => {
        if (!newTransText) {
            toast.error('Preencha a tradução.');
            return;
        }
        const toastId = toast.loading('Salvando tradução...');
        const res = await addConstellation(palavra_id, newLanguage, newTransText);
        if (res.success) {
            fetchGlossary();
            setShowAddTrans(null);
            setNewTransText('');
            toast.success('Tradução salva!', { id: toastId });
        } else {
            toast.error(`Erro: ${res.error}`, { id: toastId });
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-2xl max-h-[90vh] bg-background-dark border border-brand-yellow/50 shadow-[0_0_30px_rgba(255,204,0,0.15)] rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-3 sm:p-4 border-b border-gray-800 bg-[#1E1E1E]">
                    <div className="flex items-center gap-2 text-brand-yellow">
                        <span className="material-symbols-outlined text-2xl">menu_book</span>
                        <span className="font-bold uppercase tracking-wider">Glossário Global</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                <div className="p-3 sm:p-4 overflow-y-auto flex-1 custom-scrollbar">
                    <p className="text-xs sm:text-sm text-gray-400 mb-4">
                        Qualquer palavra cadastrada no Glossário será automaticamente destacada em amarelo nos seus textos (Auto-Tooltip).
                    </p>

                    <div className="relative mb-6">
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setShowAddWord(false); }}
                            placeholder="Busque ou cadastre uma palavra..."
                            className="w-full bg-[#1E1E1E] outline-none border border-brand-yellow/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-brand-yellow transition-colors"
                        />
                    </div>
                    
                    <div className="flex flex-col gap-4">
                        {filteredWords.length > 0 ? (
                            filteredWords.map(w => {
                                const isExpanded = expandedWordId === w.id;
                                return (
                                    <div 
                                        key={w.id} 
                                        className={`p-3 sm:p-4 bg-[#1E1E1E] border ${isExpanded ? 'border-brand-yellow/30' : 'border-gray-800'} rounded-xl cursor-pointer hover:border-gray-700 transition-colors`}
                                        onClick={() => setExpandedWordId(isExpanded ? null : w.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-brand-yellow font-bold text-sm sm:text-base flex items-center gap-2 break-all">
                                                {w.termo} 
                                                {w.is_pending && <span className="text-[9px] bg-brand-red/20 text-brand-red px-1.5 py-0.5 rounded uppercase">Pendente</span>}
                                            </h4>
                                            <span className={`material-symbols-outlined text-gray-500 transition-transform ${isExpanded ? 'rotate-180 text-brand-yellow' : ''}`}>expand_more</span>
                                        </div>
                                        
                                        {isExpanded && (
                                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-800" onClick={e => e.stopPropagation()}>
                                                <div className="bg-background-dark/30 p-3 rounded border border-white/5">
                                                    <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Acadêmica</span>
                                                    <span className="text-sm text-gray-300 leading-relaxed">{w.codificacao_academica}</span>
                                                </div>
                                                
                                                {w.signos_constelacoes?.map((c: any) => (
                                                    <div key={c.id} className="bg-background-dark/30 p-3 rounded border border-white/5">
                                                        <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">
                                                            {c.constelacao} {c.is_pending && '(Pendente)'}
                                                        </span>
                                                        <span className="text-sm text-gray-300 leading-relaxed">{c.descodificacao}</span>
                                                    </div>
                                                ))}

                                                {showAddTrans === w.id ? (
                                                    <div className="mt-3 p-4 bg-brand-blue/10 border border-brand-blue/30 rounded-lg flex flex-col gap-3">
                                                        <span className="text-sm font-bold text-brand-blue">Nova Constelação (Linguagem) para {w.termo}</span>
                                                        <div className="flex flex-col gap-2">
                                                            <input type="text" list="language-options" value={newLanguage} onChange={e => setNewLanguage(e.target.value)} placeholder="Ex: jovem, artística, gamer..." className="bg-background-dark text-white p-2 rounded border border-white/10 outline-none focus:border-brand-blue" />
                                                            <datalist id="language-options">
                                                                <option value="jovem" />
                                                                <option value="nerd_geek" />
                                                                <option value="artistica" />
                                                                <option value="academica" />
                                                            </datalist>
                                                        </div>
                                                        <textarea value={newTransText} onChange={e => setNewTransText(e.target.value)} placeholder="Significado/Explicação nesta linguagem..." className="bg-background-dark text-white p-2 rounded border border-white/10 min-h-[80px] outline-none focus:border-brand-blue" />
                                                        <div className="flex gap-2">
                                                            <button onClick={() => handleAddTrans(w.id)} className="px-4 bg-brand-blue text-white py-2 rounded font-bold hover:bg-brand-blue transition-colors cursor-pointer">Salvar Tradução</button>
                                                            <button onClick={() => setShowAddTrans(null)} className="px-4 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors cursor-pointer">Cancelar</button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => setShowAddTrans(w.id)} className="text-sm text-brand-blue font-bold flex items-center gap-1 hover:text-white mt-2 w-fit transition-colors cursor-pointer">
                                                        <span className="material-symbols-outlined text-[16px]">add</span> Adicionar outra linguagem
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center bg-[#1E1E1E] border border-gray-800 border-dashed rounded-xl">
                                <span className="material-symbols-outlined text-4xl text-gray-600 mb-2">search_off</span>
                                <p className="text-gray-400 mb-4">A palavra <strong className="text-white">"{searchTerm}"</strong> não foi encontrada.</p>
                                <button onClick={() => { setNewWord(searchTerm); setShowAddWord(true); }} className="px-6 py-2 bg-brand-yellow text-black font-bold rounded-lg hover:bg-brand-yellow transition-colors cursor-pointer">
                                    Cadastrar nova palavra
                                </button>
                            </div>
                        )}

                        {showAddWord && (
                            <div className="bg-[#1E1E1E] p-6 rounded-xl border border-brand-yellow/50 shadow-lg flex flex-col gap-4 mt-4">
                                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                                    <span className="material-symbols-outlined text-brand-yellow">add_circle</span>
                                    Cadastrar Nova Palavra Geradora
                                </h4>
                                <input type="text" value={newWord} onChange={e => setNewWord(e.target.value)} placeholder="Termo / Palavra" className="bg-background-dark border border-gray-700 rounded p-3 text-white outline-none focus:border-brand-yellow" />
                                <textarea value={newAcad} onChange={e => setNewAcad(e.target.value)} placeholder="Significado / Codificação Acadêmica Base" className="bg-background-dark border border-gray-700 rounded p-3 text-white min-h-[100px] outline-none focus:border-brand-yellow" />
                                <div className="space-y-3 p-4 bg-background-dark/30 rounded-lg border border-white/5">
                                    <h5 className="text-sm font-bold text-gray-300 uppercase">Adicionar Traduções / Constelações</h5>
                                    
                                    {pendingTranslations.length > 0 && (
                                        <div className="flex flex-col gap-2 mb-3">
                                            {pendingTranslations.map((pt, i) => (
                                                <div key={i} className="flex items-start justify-between bg-background-dark p-2 rounded border border-brand-blue/30 text-sm">
                                                    <div>
                                                        <span className="font-bold text-brand-blue uppercase text-[10px] mr-2">{pt.language}</span>
                                                        <span className="text-gray-300">{pt.text}</span>
                                                    </div>
                                                    <button onClick={() => setPendingTranslations(pendingTranslations.filter((_, idx) => idx !== i))} className="text-brand-red hover:text-brand-red"><span className="material-symbols-outlined text-[16px]">close</span></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <input type="text" list="language-options-temp" value={tempLang} onChange={e => setTempLang(e.target.value)} placeholder="Nova linguagem (ex: jovem, artística, gamer...)" className="bg-background-dark border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-blue" />
                                        <datalist id="language-options-temp">
                                            <option value="jovem" />
                                            <option value="nerd_geek" />
                                            <option value="artistica" />
                                        </datalist>
                                        <textarea value={tempTransText} onChange={e => setTempTransText(e.target.value)} placeholder="Significado nesta linguagem..." className="bg-background-dark border border-gray-700 rounded p-2 text-white min-h-[60px] outline-none focus:border-brand-blue" />
                                        <button onClick={addTempTranslation} className="bg-brand-blue/20 text-brand-blue font-bold py-2 px-4 rounded hover:bg-brand-blue/30 transition-colors w-fit text-sm cursor-pointer">
                                            + Adicionar Tradução
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3 p-4 bg-background-dark/30 rounded-lg border border-white/5">
                                    <h5 className="text-sm font-bold text-gray-300 uppercase">Adicionar Palavras Filhas (Derivadas)</h5>
                                    
                                    {pendingGenerated.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {pendingGenerated.map((pg, i) => (
                                                <div key={i} className="flex items-center gap-1 bg-background-dark p-1.5 px-3 rounded-full border border-gray-600 text-sm text-gray-300">
                                                    <span>{pg}</span>
                                                    <button onClick={() => setPendingGenerated(pendingGenerated.filter((_, idx) => idx !== i))} className="text-brand-red hover:text-brand-red flex items-center"><span className="material-symbols-outlined text-[14px]">close</span></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <input type="text" value={tempGenerated} onChange={e => setTempGenerated(e.target.value)} placeholder="Ex: Integral, Derivada..." className="bg-background-dark border border-gray-700 rounded p-2 text-white outline-none focus:border-brand-blue flex-1" />
                                        <button onClick={addTempGenerated} className="bg-brand-blue/20 text-brand-blue font-bold py-2 px-4 rounded hover:bg-brand-blue/30 transition-colors cursor-pointer text-sm">
                                            + Adicionar
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
                                    <button onClick={handleAddWord} className="bg-brand-yellow text-black font-bold py-3 px-6 rounded-lg hover:bg-brand-yellow flex-1 transition-colors cursor-pointer">
                                        Salvar no Glossário Global
                                    </button>
                                    <button onClick={() => setShowAddWord(false)} className="bg-gray-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
