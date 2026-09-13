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

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, PlusCircle, Edit3, GitBranch, Send, Loader2, BookOpen, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';
import { submitWikiProposal } from '@/app/actions/wiki-proposals';
import { wikiCells, WIKI_CATEGORIES } from '@/components/wiki/WikiView';
import { WikiProposalType } from '@/types/wiki';

interface ProposeWikiTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialType?: WikiProposalType;
    initialTopicId?: string;
    initialTopicTitle?: string;
}

export function ProposeWikiTopicModal({
    isOpen,
    onClose,
    initialType = 'new_topic',
    initialTopicId,
    initialTopicTitle
}: ProposeWikiTopicModalProps) {
    const { user } = useAuth();

    const [proposalType, setProposalType] = useState<WikiProposalType>(initialType);
    const [targetTopicId, setTargetTopicId] = useState<string>(initialTopicId || '');
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<string>('vida-universitaria');
    const [description, setDescription] = useState('');
    const [justification, setJustification] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync when modal opens with props
    useEffect(() => {
        if (isOpen) {
            setProposalType(initialType);
            if (initialTopicId) {
                setTargetTopicId(initialTopicId);
            } else if (wikiCells.length > 0 && !targetTopicId) {
                setTargetTopicId(wikiCells[0].id);
            }
            if (user) {
                setAuthorName(user.user_metadata?.full_name || user.user_metadata?.nome || user.email?.split('@')[0] || '');
                setAuthorEmail(user.email || '');
            }
        }
    }, [isOpen, initialType, initialTopicId, user]);

    if (!isOpen) return null;

    const selectedTargetCell = wikiCells.find(c => c.id === targetTopicId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error('Informe o título da proposta.');
            return;
        }

        if (description.trim().length < 10) {
            toast.error('O conteúdo/descrição deve ter pelo menos 10 caracteres.');
            return;
        }

        if (!authorName.trim()) {
            toast.error('Informe seu nome ou apelido para créditos.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await submitWikiProposal({
                author_name: authorName.trim(),
                author_email: authorEmail.trim() || undefined,
                proposal_type: proposalType,
                target_topic_id: proposalType !== 'new_topic' ? targetTopicId : undefined,
                target_topic_title: proposalType !== 'new_topic' ? (selectedTargetCell?.title || initialTopicTitle || targetTopicId) : undefined,
                title: title.trim(),
                category,
                description: description.trim(),
                justification: justification.trim() || undefined
            });

            if (res.success) {
                toast.success(
                    proposalType === 'complement'
                        ? 'Complementação enviada! Ela foi encaminhada para a moderação da Wiki no Eixo de Informação.'
                        : proposalType === 'related_topic'
                        ? 'Sugestão de tópico relacionado enviada para a moderação da Wiki!'
                        : 'Proposta de novo tópico enviada com sucesso para o Eixo de Informação!',
                    { duration: 5000 }
                );
                // Reset form
                setTitle('');
                setDescription('');
                setJustification('');
                onClose();
            } else {
                toast.error(res.error || 'Erro ao enviar proposta.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro inesperado ao enviar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl overflow-hidden my-auto"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="relative flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-brand-blue/10 border border-brand-blue/30 text-brand-blue flex items-center justify-center">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg sm:text-xl font-black font-bukra text-white tracking-tight uppercase italic">
                                    Colaborar com a Wiki
                                </h3>
                                <p className="text-[11px] text-gray-400">
                                    Envie propostas para a curadoria no Eixo de Informação do Admin
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="size-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Type Selector Tabs */}
                    <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5 mb-6">
                        <button
                            type="button"
                            onClick={() => setProposalType('new_topic')}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                                proposalType === 'new_topic'
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <PlusCircle className="w-4 h-4 shrink-0" />
                            <span>Novo Tópico</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setProposalType('complement')}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                                proposalType === 'complement'
                                    ? 'bg-brand-yellow text-gray-900 shadow-lg shadow-brand-yellow/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Edit3 className="w-4 h-4 shrink-0" />
                            <span>Complementar</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setProposalType('related_topic')}
                            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                                proposalType === 'related_topic'
                                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <GitBranch className="w-4 h-4 shrink-0" />
                            <span>Tópico Conexo</span>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="relative space-y-4">
                        {/* Target Topic (When complementing or suggesting related) */}
                        {proposalType !== 'new_topic' && (
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                    {proposalType === 'complement' ? 'Tópico a ser Complementado' : 'Tópico de Referência'}
                                </label>
                                <select
                                    value={targetTopicId}
                                    onChange={(e) => setTargetTopicId(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-brand-blue"
                                >
                                    {wikiCells.map(cell => (
                                        <option key={cell.id} value={cell.id} className="bg-[#1E1E1E] text-white">
                                            {cell.title} ({cell.subtitle})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Title & Category Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                    {proposalType === 'complement' ? 'Resumo da Atualização *' : 'Título do Tópico *'}
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={
                                        proposalType === 'complement'
                                            ? 'Ex: Atualização dos horários do Circular em 2026'
                                            : 'Ex: Guia da Biblioteca do IFUSP e Empréstimos'
                                    }
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                    Categoria Temática
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs font-medium focus:outline-none focus:border-brand-blue"
                                >
                                    {WIKI_CATEGORIES.map(cat => (
                                        <option key={cat.id} value={cat.id} className="bg-[#1E1E1E] text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                    <option value="outro" className="bg-[#1E1E1E] text-white">Outro / Geral</option>
                                </select>
                            </div>
                        </div>

                        {/* Description / Proposed Content */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                {proposalType === 'complement'
                                    ? 'Conteúdo a Adicionar ou Corrigir *'
                                    : 'Conteúdo Proposto / Resumo do Artigo *'}
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={
                                    proposalType === 'complement'
                                        ? 'Escreva os novos detalhes, links de editais, avisos de disciplinas ou sugestões de parágrafos...'
                                        : 'Descreva a estrutura que este novo tópico deve ter: principais tópicos, dicas essenciais, referências...'
                                }
                                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue resize-none"
                            />
                        </div>

                        {/* Justification (Optional) */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                Justificativa / Por que é relevante para os estudantes? (Opcional)
                            </label>
                            <input
                                type="text"
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                placeholder="Ex: Muitos calouros têm dúvidas recorrentes sobre este procedimento no grupo..."
                                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue"
                            />
                        </div>

                        {/* Author details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                    Seu Nome / Apelido *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Nome para créditos na Wiki"
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-1.5">
                                    E-mail de Contato (Opcional)
                                </label>
                                <input
                                    type="email"
                                    value={authorEmail}
                                    onChange={(e) => setAuthorEmail(e.target.value)}
                                    placeholder="seuemail@usp.br"
                                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold uppercase transition-colors"
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/80 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-blue/20 flex items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Enviar Proposta
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
