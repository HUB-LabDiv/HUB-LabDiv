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
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Heart,
    Sparkles,
    ShieldCheck,
    Laptop,
    CheckCircle2,
    BookOpen,
    Layers,
    Share2,
    Info,
    Terminal,
    Download
} from 'lucide-react';
import { AcademicSoftware, SoftwareFeedback } from '@/types/softwares';
import { SoftwareScreenshots } from './SoftwareScreenshots';
import { SoftwareFeedbackSection } from './SoftwareFeedbackSection';
import { toggleSoftwareUpvote } from '@/app/actions/softwares';
import { toast } from 'react-hot-toast';

interface SoftwareGuideViewProps {
    software: AcademicSoftware;
    initialFeedbacks: SoftwareFeedback[];
    currentUserId?: string;
}

export function SoftwareGuideView({
    software,
    initialFeedbacks,
    currentUserId
}: SoftwareGuideViewProps) {
    const [upvoted, setUpvoted] = useState(software.has_upvoted ?? false);
    const [upvotesCount, setUpvotesCount] = useState(software.upvotes_count || 0);
    const [isLiking, setIsLiking] = useState(false);

    const handleUpvote = async () => {
        if (!currentUserId) {
            toast.error('Faça login para curtir e salvar softwares!');
            return;
        }
        if (isLiking) return;
        setIsLiking(true);

        const prevUpvoted = upvoted;
        const prevCount = upvotesCount;

        setUpvoted(!prevUpvoted);
        setUpvotesCount(prevUpvoted ? prevCount - 1 : prevCount + 1);

        try {
            const res = await toggleSoftwareUpvote(software.id);
            if (!res.success) {
                setUpvoted(prevUpvoted);
                setUpvotesCount(prevCount);
                toast.error(res.error || 'Erro ao curtir.');
            } else if (res.upvoted) {
                toast.success('Salvo nos favoritos!', { icon: '❤️' });
            }
        } catch {
            setUpvoted(prevUpvoted);
            setUpvotesCount(prevCount);
            toast.error('Erro ao registrar upvote.');
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${software.title} • Hub Lab-Div IFUSP`,
                text: software.tagline,
                url: window.location.href
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link do software copiado para a área de transferência!');
        }
    };

    const isComunitario = software.software_type === 'comunitario';

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Back to Catalog */}
            <div className="flex items-center justify-between">
                <Link
                    href="/ferramentas/softwares"
                    className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar para Catálogo de Softwares</span>
                </Link>

                <button
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                    title="Compartilhar este software"
                >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Compartilhar</span>
                </button>
            </div>

            {/* Hero Header */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/20 dark:from-[#1E1E1E] dark:via-[#161616] dark:to-[#101010] border border-gray-200 dark:border-white/10 p-6 sm:p-10 shadow-xl dark:shadow-2xl">
                {isComunitario && (
                    <div className="absolute top-0 right-0 w-80 h-80 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
                )}

                <div className="relative z-10 space-y-6">
                    {/* Top Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            {isComunitario ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-yellow/15 text-amber-700 dark:text-brand-yellow border border-brand-yellow/30 shadow-sm">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-brand-yellow animate-pulse" />
                                    Projeto Desenvolvido no IFUSP
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-blue/15 text-brand-blue border border-brand-blue/30">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Ferramenta Essencial
                                </span>
                            )}

                            <span className="px-3 py-1 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                                {software.category}
                            </span>

                            {software.pricing_type && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                                    {software.pricing_type}
                                </span>
                            )}
                        </div>

                        {/* Upvote Button */}
                        <button
                            onClick={handleUpvote}
                            disabled={isLiking}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer
                                ${upvoted
                                    ? 'bg-brand-red/20 text-brand-red border border-brand-red/40 shadow-md shadow-brand-red/20 scale-105'
                                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-white/10'
                                }
                            `}
                        >
                            <Heart className={`w-4 h-4 ${upvoted ? 'fill-brand-red text-brand-red' : ''}`} />
                            <span>{upvotesCount} {upvotesCount === 1 ? 'Favorito' : 'Favoritos'}</span>
                        </button>
                    </div>

                    {/* Title & Tagline */}
                    <div>
                        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-bukra tracking-tight">
                            {software.title}
                        </h1>
                        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 font-open-sans mt-3 leading-relaxed max-w-3xl">
                            {software.tagline}
                        </p>
                    </div>

                    {/* Author & Platforms */}
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <span>Criado por:</span>
                            <strong className="text-gray-900 dark:text-white font-bold text-sm">{software.author_name}</strong>
                        </div>

                        <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600" />

                        <div className="flex items-center gap-1.5 flex-wrap">
                            <span>Disponível para:</span>
                            {software.platforms.map((plat) => (
                                <span
                                    key={plat}
                                    className="px-2 py-0.5 rounded-md text-[11px] font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-transparent"
                                >
                                    {plat}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Main CTA Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                        <a
                            href={software.access_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-brand-yellow hover:bg-[#FFE066] text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-brand-yellow/25 hover:scale-105"
                        >
                            <ExternalLink className="w-4 h-4" />
                            <span>Acessar / Usar {software.title}</span>
                        </a>

                        {software.repository_url && (
                            <a
                                href={software.repository_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-900 dark:text-white font-bold text-xs sm:text-sm transition-all border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                            >
                                <Github className="w-4 h-4" />
                                <span>Código Fonte & GitHub</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Screenshots Gallery if available */}
            {software.screenshots && software.screenshots.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-xl">
                    <SoftwareScreenshots
                        screenshots={software.screenshots}
                        softwareTitle={software.title}
                    />
                </div>
            )}

            {/* Key Features Block */}
            {software.features_list && software.features_list.length > 0 && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-xl">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white font-bukra mb-6 flex items-center gap-2">
                        <Layers className="w-5 h-5 text-amber-600 dark:text-brand-yellow" />
                        Módulos & Principais Recursos
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {software.features_list.map((feat, idx) => (
                            <div
                                key={idx}
                                className="p-4 rounded-2xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/5 space-y-1 hover:border-brand-yellow/40 transition-colors"
                            >
                                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm font-bukra">
                                    <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-brand-yellow shrink-0" />
                                    <span>{feat.title}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans pl-6 leading-relaxed">
                                    {feat.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Full Usage Guide / Tutorial */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 shadow-lg dark:shadow-xl">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-bukra mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-600 dark:text-brand-yellow" />
                    Como Usar & Dicas de Estudo
                </h3>

                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed whitespace-pre-line space-y-4">
                    {software.guide_markdown || software.description}
                </div>
            </div>

            {/* Where to get & Installation info */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 via-white to-amber-50/50 dark:from-brand-blue/20 dark:to-brand-yellow/10 border border-brand-blue/20 dark:border-brand-blue/30 shadow-lg dark:shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white font-bukra flex items-center gap-2">
                        <Download className="w-5 h-5 text-amber-600 dark:text-brand-yellow" />
                        Onde Conseguir & Como Executar
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans mt-1">
                        O {software.title} está disponível gratuitamente para toda a comunidade.
                    </p>
                </div>

                <a
                    href={software.access_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-brand-blue/20 shrink-0 text-center"
                >
                    Abrir Página Oficial
                </a>
            </div>

            {/* Feedback & Community Test Reports */}
            <SoftwareFeedbackSection
                softwareId={software.id}
                softwareTitle={software.title}
                authorName={software.author_name}
                initialFeedbacks={initialFeedbacks}
                currentUserId={currentUserId}
            />
        </div>
    );
}
