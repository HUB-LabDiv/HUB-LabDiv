'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageSquarePlus,
    Send,
    Star,
    Sparkles,
    Bug,
    Lightbulb,
    CheckCircle2,
    FlaskConical,
    MessageCircle,
    User,
    Clock
} from 'lucide-react';
import { SoftwareFeedback } from '@/types/softwares';
import { submitSoftwareFeedback } from '@/app/actions/softwares';
import { toast } from 'react-hot-toast';

interface SoftwareFeedbackSectionProps {
    softwareId: string;
    softwareTitle: string;
    authorName: string;
    initialFeedbacks: SoftwareFeedback[];
    currentUserId?: string;
}

const FEEDBACK_TYPES = [
    { id: 'test_feedback', label: 'Relato de Teste', icon: FlaskConical, color: 'text-brand-yellow' },
    { id: 'review', label: 'Avaliação Geral', icon: Star, color: 'text-amber-400' },
    { id: 'suggestion', label: 'Sugestão de Recurso', icon: Lightbulb, color: 'text-emerald-400' },
    { id: 'bug_report', label: 'Relatar Problema', icon: Bug, color: 'text-brand-red' },
] as const;

const EXPERIENCE_LEVELS = [
    'Iniciante / Nunca usei antes',
    'Estudante de Graduação (Física / Exatas)',
    'Pesquisador / Iniciação Científica',
    'Pós-Graduação / Docente',
    'Curioso'
];

export function SoftwareFeedbackSection({
    softwareId,
    softwareTitle,
    authorName,
    initialFeedbacks,
    currentUserId
}: SoftwareFeedbackSectionProps) {
    const [feedbacks, setFeedbacks] = useState<SoftwareFeedback[]>(initialFeedbacks);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState<number>(5);
    const [feedbackType, setFeedbackType] = useState<'test_feedback' | 'review' | 'suggestion' | 'bug_report'>('test_feedback');
    const [experienceLevel, setExperienceLevel] = useState(EXPERIENCE_LEVELS[1]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUserId) {
            toast.error('Você precisa estar conectado para enviar seu feedback.');
            return;
        }

        if (!comment.trim()) {
            toast.error('Por favor, escreva seu comentário ou relato de teste.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await submitSoftwareFeedback({
                softwareId,
                rating,
                experienceLevel,
                comment: comment.trim(),
                feedbackType
            });

            if (!res.success) {
                toast.error(res.error || 'Erro ao enviar feedback.');
            } else {
                toast.success('Feedback enviado com sucesso! O autor agradece imensamente.', { icon: '🎉' });
                if (res.feedback) {
                    setFeedbacks([res.feedback as SoftwareFeedback, ...feedbacks]);
                }
                setComment('');
                setIsFormOpen(false);
            }
        } catch {
            toast.error('Erro de conexão ao enviar feedback.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mt-10 pt-8 border-t border-white/10">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-bukra flex items-center gap-2">
                        <MessageCircle className="w-6 h-6 text-brand-yellow" />
                        Espaço de Testes & Feedback Comunitário
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                        Compartilhe como foi sua experiência usando o <strong className="text-gray-200">{softwareTitle}</strong>. Seu relato ajuda o criador ({authorName}) a aprimorar o projeto!
                    </p>
                </div>

                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-yellow hover:bg-[#FFE066] text-black font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-brand-yellow/20 self-start sm:self-auto"
                >
                    <MessageSquarePlus className="w-4 h-4" />
                    <span>{isFormOpen ? 'Fechar Formulário' : 'Enviar Relato de Teste'}</span>
                </button>
            </div>

            {/* Collapsible Submission Form */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#1E1E1E] border border-brand-yellow/30 shadow-xl overflow-hidden"
                    >
                        <h4 className="text-base font-bold text-white font-bukra mb-4 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-brand-yellow" />
                            Novo Relato para {softwareTitle}
                        </h4>

                        {/* Feedback Type Selector */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Tipo de Mensagem
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {FEEDBACK_TYPES.map((type) => {
                                    const active = feedbackType === type.id;
                                    const Icon = type.icon;
                                    return (
                                        <button
                                            type="button"
                                            key={type.id}
                                            onClick={() => setFeedbackType(type.id as any)}
                                            className={`
                                                flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all
                                                ${active
                                                    ? 'bg-brand-blue text-white border border-brand-blue shadow-md'
                                                    : 'bg-black/30 text-gray-400 hover:text-white border border-white/5'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 ${active ? 'text-white' : type.color}`} />
                                            <span className="truncate">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Experience Level & Rating */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                    Seu Nível / Contexto
                                </label>
                                <select
                                    value={experienceLevel}
                                    onChange={(e) => setExperienceLevel(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-yellow"
                                >
                                    {EXPERIENCE_LEVELS.map((lvl) => (
                                        <option key={lvl} value={lvl} className="bg-[#1E1E1E]">
                                            {lvl}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                    Avaliação Geral
                                </label>
                                <div className="flex items-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="p-1 text-gray-600 hover:text-brand-yellow transition-colors"
                                        >
                                            <Star
                                                className={`w-6 h-6 ${rating >= star ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-600'}`}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-brand-yellow ml-2">
                                        {rating} de 5 estrelas
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Comment Text Area */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                Suas Impressões, Dúvidas ou Sugestões
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Conte o que achou: se alguma ferramenta pareceu confusa, algo que facilitou seus estudos, ideias de melhorias ou botões que você colocaria em outro lugar..."
                                rows={4}
                                className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-yellow resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-brand-blue/20 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span>Enviando...</span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Enviar Relato</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* List of Feedback Cards */}
            {feedbacks.length === 0 ? (
                <div className="p-8 rounded-3xl bg-[#1E1E1E]/50 border border-white/5 text-center flex flex-col items-center justify-center">
                    <FlaskConical className="w-10 h-10 text-gray-500 mb-3" />
                    <h4 className="text-base font-bold text-gray-300 font-bukra">
                        Nenhum relato de teste registrado ainda
                    </h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-md font-open-sans">
                        Seja a primeira pessoa a testar o <strong className="text-gray-400">{softwareTitle}</strong> e enviar feedback valioso para {authorName}!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {feedbacks.map((fb) => (
                        <div
                            key={fb.id}
                            className="p-5 rounded-2xl bg-[#1E1E1E]/70 border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-xs font-bold text-white">
                                        {fb.user_profile?.full_name?.charAt(0) || fb.user_profile?.username?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                            <span>{fb.user_profile?.full_name || fb.user_profile?.username || 'Aluno(a) IFUSP'}</span>
                                            {fb.experience_level && (
                                                <span className="text-[10px] text-gray-400 font-normal">
                                                    • {fb.experience_level}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {fb.rating && (
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < fb.rating! ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-600'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed whitespace-pre-line pl-9">
                                {fb.comment}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
