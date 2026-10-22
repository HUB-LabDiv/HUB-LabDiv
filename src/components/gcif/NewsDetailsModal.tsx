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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, ExternalLink, Newspaper, Share2 } from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { NewsItem } from '@/types/news';
import toast from 'react-hot-toast';

interface NewsDetailsModalProps {
    news: NewsItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function NewsDetailsModal({ news, isOpen, onClose }: NewsDetailsModalProps) {
    if (!isOpen || !news) return null;

    const handleShare = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(news.linkOficial);
            toast.success('Link da notícia copiado para a área de transferência!');
        }
    };

    return (
        <ModalPortal>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Window */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.35 }}
                        className="relative w-full max-w-xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden my-8 max-h-[85vh] flex flex-col"
                    >
                        {/* Header bar */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue dark:text-blue-300 text-xs font-black uppercase tracking-wider font-bukra">
                                    {news.categoria.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                                    {news.data}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button 
                                    onClick={handleShare}
                                    title="Compartilhar"
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra leading-tight mb-4">
                            {news.titulo}
                        </h2>

                        {/* Author */}
                        {news.autor && (
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 font-open-sans">
                                <User className="w-3.5 h-3.5 text-brand-blue" />
                                <span>{news.autor}</span>
                            </div>
                        )}

                        {/* Content text */}
                        <div className="overflow-y-auto space-y-4 pr-1 my-2 text-sm text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed">
                            <p className="whitespace-pre-line">
                                {news.resumo}
                            </p>

                            {news.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-3">
                                    {news.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer CTA */}
                        <div className="pt-4 mt-auto border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <a 
                                href={news.linkOficial} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Ler Matéria Completa no Portal IFUSP
                            </a>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </ModalPortal>
    );
}
