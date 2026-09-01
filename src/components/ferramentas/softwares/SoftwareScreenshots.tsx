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
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

interface SoftwareScreenshotsProps {
    screenshots: string[];
    softwareTitle: string;
}

export function SoftwareScreenshots({ screenshots, softwareTitle }: SoftwareScreenshotsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    if (!screenshots || screenshots.length === 0) {
        return null;
    }

    const handleNext = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((selectedImageIndex + 1) % screenshots.length);
    };

    const handlePrev = () => {
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((selectedImageIndex - 1 + screenshots.length) % screenshots.length);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white font-bukra flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-brand-yellow" />
                    Capturas de Tela & Interface
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                    {screenshots.length} {screenshots.length === 1 ? 'imagem' : 'imagens'}
                </span>
            </div>

            {/* Thumbnail Grid / Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {screenshots.map((src, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedImageIndex(idx)}
                        className="group relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 hover:border-brand-yellow/50 cursor-pointer transition-all shadow-md"
                    >
                        {/* Fallback styled frame with real/mock representation */}
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1E1E1E] to-[#121212] p-4 text-center">
                            <div className="w-10 h-10 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-2 group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5 text-brand-yellow" />
                            </div>
                            <span className="text-xs font-bold text-gray-200 line-clamp-1">
                                {softwareTitle} — Tela {idx + 1}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1">Clique para ampliar</span>
                        </div>

                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
                                <Maximize2 className="w-5 h-5" />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImageIndex(null)}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl w-full bg-[#1A1A1A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center p-4 sm:p-6"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setSelectedImageIndex(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-full flex items-center justify-between mb-4 px-2">
                                <h4 className="text-base font-bold text-white font-bukra">
                                    {softwareTitle} — Visualização detalhada
                                </h4>
                                <span className="text-xs text-gray-400">
                                    {selectedImageIndex + 1} / {screenshots.length}
                                </span>
                            </div>

                            {/* Preview Area */}
                            <div className="w-full aspect-video rounded-2xl bg-black flex flex-col items-center justify-center p-8 border border-white/10 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-radial from-brand-blue/10 to-transparent" />
                                <Sparkles className="w-12 h-12 text-brand-yellow mb-3 animate-bounce" />
                                <h5 className="text-xl font-bold text-white mb-2 font-bukra">
                                    {softwareTitle}
                                </h5>
                                <p className="text-sm text-gray-300 max-w-lg">
                                    Captura de tela demonstrativa do módulo e interface em alta fidelidade.
                                </p>
                            </div>

                            {/* Navigation controls if multiple */}
                            {screenshots.length > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-4">
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
