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
    X,
    Plus,
    Code2,
    Laptop,
    Globe,
    Layers,
    Send,
    Sparkles,
    CheckCircle2,
    BookOpen
} from 'lucide-react';
import { submitSoftware } from '@/app/actions/softwares';
import { SOFTWARE_CATEGORIES, SOFTWARE_PLATFORMS } from '@/constants/softwares';
import { toast } from 'react-hot-toast';

interface SubmitSoftwareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    currentUserName?: string;
}

export function SubmitSoftwareModal({
    isOpen,
    onClose,
    onSuccess,
    currentUserName
}: SubmitSoftwareModalProps) {
    const [title, setTitle] = useState('');
    const [tagline, setTagline] = useState('');
    const [description, setDescription] = useState('');
    const [authorName, setAuthorName] = useState(currentUserName || '');
    const [category, setCategory] = useState<string>('Física & Simulação');
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Web']);
    const [accessUrl, setAccessUrl] = useState('');
    const [repositoryUrl, setRepositoryUrl] = useState('');
    const [guideMarkdown, setGuideMarkdown] = useState('');
    const [tagsInput, setTagsInput] = useState('');
    const [pricingType, setPricingType] = useState('Gratuito / Open Source');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const togglePlatform = (plat: string) => {
        if (selectedPlatforms.includes(plat)) {
            if (selectedPlatforms.length > 1) {
                setSelectedPlatforms(selectedPlatforms.filter(p => p !== plat));
            }
        } else {
            setSelectedPlatforms([...selectedPlatforms, plat]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !tagline.trim() || !description.trim() || !accessUrl.trim()) {
            toast.error('Preencha os campos obrigatórios.');
            return;
        }

        const tags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase().replace(/^#/, ''))
            .filter(Boolean);

        setIsSubmitting(true);
        try {
            const res = await submitSoftware({
                title: title.trim(),
                tagline: tagline.trim(),
                description: description.trim(),
                author_name: authorName.trim() || 'Estudante IFUSP',
                category,
                software_type: 'comunitario',
                pricing_type: pricingType,
                platforms: selectedPlatforms,
                access_url: accessUrl.trim(),
                repository_url: repositoryUrl.trim() || undefined,
                guide_markdown: guideMarkdown.trim() || undefined,
                tags,
                target_audience: ['Graduação', 'Iniciação Científica']
            });

            if (!res.success) {
                toast.error(res.error || 'Erro ao enviar software.');
            } else {
                toast.success('Software publicado com sucesso na biblioteca!', { icon: '🚀' });
                onSuccess?.();
                onClose();
            }
        } catch {
            toast.error('Erro de conexão ao submeter software.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto text-left"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 text-brand-yellow">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white font-bukra">
                                    Enviar Software / Código
                                </h3>
                                <p className="text-xs text-gray-400 font-open-sans">
                                    Compartilhe seu projeto ou ferramenta acadêmica com a comunidade do IFUSP.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                        {/* Title & Author */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Nome do Software *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: LumiFI, FísicApp, etc."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Nome do Criador / Autor *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    placeholder="Seu nome ou grupo de pesquisa"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                                />
                            </div>
                        </div>

                        {/* Tagline */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                Frase Resumo (Tagline) *
                            </label>
                            <input
                                type="text"
                                required
                                value={tagline}
                                onChange={(e) => setTagline(e.target.value)}
                                placeholder="Ex: Software didático para exploração de espectroscopia de raios X"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                            />
                        </div>

                        {/* Category & Pricing */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Categoria
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-yellow"
                                >
                                    {SOFTWARE_CATEGORIES.filter(c => c !== 'Todos' && c !== 'Feitos por Alunos/USP').map((c) => (
                                        <option key={c} value={c} className="bg-[#1E1E1E]">
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Licença / Preço
                                </label>
                                <input
                                    type="text"
                                    value={pricingType}
                                    onChange={(e) => setPricingType(e.target.value)}
                                    placeholder="Ex: Gratuito / Open Source"
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                                />
                            </div>
                        </div>

                        {/* Platforms */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                Plataformas Suportadas
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {SOFTWARE_PLATFORMS.map((plat) => {
                                    const selected = selectedPlatforms.includes(plat);
                                    return (
                                        <button
                                            type="button"
                                            key={plat}
                                            onClick={() => togglePlatform(plat)}
                                            className={`
                                                px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                                                ${selected
                                                    ? 'bg-brand-blue text-white border border-brand-blue shadow-sm'
                                                    : 'bg-black/30 text-gray-400 hover:text-white border border-white/5'
                                                }
                                            `}
                                        >
                                            {plat}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Link de Acesso / Download *
                                </label>
                                <input
                                    type="url"
                                    required
                                    value={accessUrl}
                                    onChange={(e) => setAccessUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                    Repositório GitHub (Opcional)
                                </label>
                                <input
                                    type="url"
                                    value={repositoryUrl}
                                    onChange={(e) => setRepositoryUrl(e.target.value)}
                                    placeholder="https://github.com/..."
                                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                Descrição Completa *
                            </label>
                            <textarea
                                required
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Explique o que o software faz, para que serve e como foi desenvolvido..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow resize-none"
                            />
                        </div>

                        {/* Guide Markdown */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                Guia / Instruções de Uso (Opcional)
                            </label>
                            <textarea
                                rows={4}
                                value={guideMarkdown}
                                onChange={(e) => setGuideMarkdown(e.target.value)}
                                placeholder="Dicas de uso, módulos, atalhos ou requisitos de instalação..."
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow resize-none"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-1.5">
                                Tags (separadas por vírgula)
                            </label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => setTagsInput(e.target.value)}
                                placeholder="ex: espectroscopia, raios-x, cálculo, simulação"
                                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-yellow"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-yellow hover:bg-[#FFE066] text-black text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-brand-yellow/20 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <span>Enviando...</span>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Publicar Software</span>
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
