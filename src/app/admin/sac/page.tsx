'use client';

import React, { useEffect, useState } from 'react';
import { getAdminFAQs, updateFAQStatus } from '@/app/actions/sac';
import { toast } from 'react-hot-toast';
import { Loader2, MessageSquare, Check, X, Edit3, Send, Undo2 } from 'lucide-react';

interface FAQ {
    id: string;
    pergunta: string;
    resposta: string | null;
    status: string;
    nome: string;
    num_usp: string;
    email: string;
    created_at: string;
}

export default function AdminSacPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
    
    const [respondingTo, setRespondingTo] = useState<FAQ | null>(null);
    const [resposta, setResposta] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const loadFaqs = async () => {
        setIsLoading(true);
        const res = await getAdminFAQs(filter);
        if (res.success) {
            setFaqs(res.data as FAQ[]);
        } else {
            toast.error('Erro ao carregar FAQs.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadFaqs();
    }, [filter]);

    const handleAction = async (id: string, newStatus: string, novaResposta?: string) => {
        setIsSaving(true);
        const res = await updateFAQStatus(id, newStatus, novaResposta);
        setIsSaving(false);
        
        if (res.success) {
            toast.success(`Dúvida ${newStatus === 'approved' ? 'aprovada e respondida' : 'rejeitada'}.`);
            setRespondingTo(null);
            setResposta('');
            loadFaqs();
        } else {
            toast.error(res.error || 'Erro ao atualizar.');
        }
    };

    const handleResponder = (faq: FAQ) => {
        setRespondingTo(faq);
        setResposta(faq.resposta || '');
    };

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-brand-blue" />
                        Central SAC
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie e responda as dúvidas da Seção de Alunos (SAC).</p>
                </div>

                {/* Filters */}
                <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'pending'
                            ? 'bg-white dark:bg-gray-700 text-brand-yellow shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ⏳ Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'approved'
                            ? 'bg-white dark:bg-gray-700 text-brand-blue shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ✅ Aprovadas
                    </button>
                    <button
                        onClick={() => setFilter('rejected')}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${filter === 'rejected'
                            ? 'bg-white dark:bg-gray-700 text-brand-red shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        ❌ Rejeitadas
                    </button>
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            ) : faqs.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-white dark:bg-card-dark rounded-2xl border border-gray-100 dark:border-gray-800">
                    Nenhuma dúvida encontrada.
                </div>
            ) : (
                <div className="grid gap-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="bg-white dark:bg-card-dark rounded-xl border border-gray-100 dark:border-gray-800 p-5">
                            <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-bold text-gray-900 dark:text-white text-lg">{faq.nome}</span>
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-bold text-gray-500">Nº USP: {faq.num_usp}</span>
                                        <span className="text-xs text-gray-400">{new Date(faq.created_at).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border-l-4 border-brand-red text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {faq.pergunta}
                                    </div>
                                    {faq.resposta && (
                                        <div className="p-4 bg-brand-blue/5 border-l-4 border-brand-blue rounded-lg">
                                            <span className="text-xs font-bold text-brand-blue uppercase tracking-widest block mb-2">Resposta Oficial</span>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{faq.resposta}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {filter !== 'rejected' && (
                                        <button
                                            onClick={() => handleResponder(faq)}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-brand-blue/10 text-brand-blue rounded-lg text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            {faq.status === 'approved' ? 'Editar Resposta' : 'Responder e Aprovar'}
                                        </button>
                                    )}
                                    {filter === 'pending' && (
                                        <button
                                            onClick={() => handleAction(faq.id, 'rejected')}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-brand-red/10 text-brand-red rounded-lg text-xs font-bold hover:bg-brand-red hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Rejeitar
                                        </button>
                                    )}
                                    {filter === 'rejected' && (
                                        <button
                                            onClick={() => handleAction(faq.id, 'pending')}
                                            className="inline-flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <Undo2 className="w-4 h-4" />
                                            Restaurar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Resposta */}
            {respondingTo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl w-full max-w-2xl shadow-xl border border-gray-200 dark:border-white/10 flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center bg-gray-50 dark:bg-black/20">
                            <h2 className="text-xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-brand-blue" />
                                Responder Dúvida
                            </h2>
                            <button onClick={() => setRespondingTo(null)} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl text-sm text-gray-700 dark:text-gray-300">
                                <strong>Pergunta:</strong> {respondingTo.pergunta}
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Resposta Oficial *</label>
                                <textarea
                                    rows={6}
                                    value={resposta}
                                    onChange={e => setResposta(e.target.value)}
                                    className="w-full bg-white dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue transition-colors resize-none"
                                    placeholder="Escreva a resposta aqui. Ao aprovar, esta dúvida ficará visível publicamente na aba Ferramentas."
                                />
                            </div>
                            <p className="text-[10px] text-gray-400">Um email automático será enviado para o aluno (se disponível) notificando que a dúvida foi respondida.</p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-white/10 flex justify-end gap-3 rounded-b-2xl">
                            <button
                                onClick={() => setRespondingTo(null)}
                                className="px-5 py-3 text-xs font-bold uppercase text-gray-500 hover:text-gray-700 dark:hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleAction(respondingTo.id, 'approved', resposta)}
                                disabled={isSaving || !resposta.trim()}
                                className="px-6 py-3 bg-brand-blue text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-blue/90 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                Publicar Resposta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
