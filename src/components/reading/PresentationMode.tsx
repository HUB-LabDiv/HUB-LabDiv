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

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { ExternalLink, FileText } from 'lucide-react';

interface PresentationModeProps {
    content: string;
    onClose: () => void;
}

export function PresentationMode({ content, onClose }: PresentationModeProps) {
    // Split content by "---" to create slides
    const slides = content.split(/\n---\n/).filter(s => s.trim().length > 0);
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
    const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-[#09090B] bg-[url('/bg-if.svg')] bg-repeat bg-center flex flex-col items-center justify-center p-8 md:p-16"
        >
            {/* Dark overlay over formulas SVG */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] pointer-events-none z-0"></div>

            <button
                onClick={onClose}
                className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors z-20"
                aria-label="Sair do Modo Apresentação"
            >
                <span className="material-symbols-outlined text-4xl">close</span>
            </button>

            <div className="flex-1 w-full max-w-5xl flex items-center justify-center z-10">
                <AnimatePresence mode="wait">
                    <m.div
                        key={currentSlide}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="w-full prose prose-2xl dark:prose-invert max-w-none text-center"
                    >
                        <ReactMarkdown 
                            remarkPlugins={[remarkMath]} 
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 my-3 rounded-2xl bg-brand-yellow text-black font-black text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all no-underline"
                                    >
                                        {href?.includes('drive.google.com') ? (
                                            <FileText className="w-4 h-4 shrink-0 text-black" />
                                        ) : (
                                            <ExternalLink className="w-4 h-4 shrink-0 text-black" />
                                        )}
                                        <span>{children}</span>
                                    </a>
                                )
                            }}
                        >
                            {slides[currentSlide]}
                        </ReactMarkdown>
                    </m.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-8 mt-12 pb-8 z-10">
                <button
                    onClick={prevSlide}
                    disabled={currentSlide === 0}
                    className="p-4 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-black text-white disabled:opacity-20 transition-all active:scale-95 border border-white/15"
                >
                    <span className="material-symbols-outlined text-3xl">chevron_left</span>
                </button>

                <div className="text-brand-yellow font-black tracking-widest uppercase text-sm bg-black/60 px-4 py-2 rounded-full border border-white/10">
                    Slide {currentSlide + 1} / {slides.length}
                </div>

                <button
                    onClick={nextSlide}
                    disabled={currentSlide === slides.length - 1}
                    className="p-4 rounded-full bg-white/10 hover:bg-brand-yellow hover:text-black text-white disabled:opacity-20 transition-all active:scale-95 border border-white/15"
                >
                    <span className="material-symbols-outlined text-3xl">chevron_right</span>
                </button>
            </div>

            {/* Progress Bar */}
            <div className="fixed bottom-0 left-0 h-1.5 bg-brand-blue/30 w-full overflow-hidden z-20">
                <m.div
                    className="h-full bg-brand-yellow"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
                />
            </div>
        </m.div>
    );
}
