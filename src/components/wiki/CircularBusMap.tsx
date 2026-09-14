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

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Maximize2,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Download,
    ExternalLink,
    X,
    Bus
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const CircularBusMap: React.FC = () => {
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isImageLoading, setIsImageLoading] = useState(true);

    const mapSrc = '/images/wiki/mapa-circulares-busp.png';
    const officialUspUrl = 'https://www5.usp.br/wp-content/uploads/2011/02/Captura-de-tela-2024-09-19-065302.png';

    // Fechar lightbox no Esc
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isLightboxOpen) {
                setIsLightboxOpen(false);
                setZoomLevel(1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen]);

    const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.3, 3));
    const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.3, 0.8));
    const handleResetZoom = () => setZoomLevel(1);

    return (
        <div className="glass-card p-6 sm:p-8 rounded-[40px] border border-black/5 dark:border-white/10 shadow-2xl relative overflow-hidden bg-white dark:bg-[#1E1E1E]">
            {/* Texto explicativo oficial */}
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed mb-6">
                As linhas circulares principais são: <strong className="text-gray-900 dark:text-white font-bold">8082-10</strong>, <strong className="text-gray-900 dark:text-white font-bold">8083-10</strong>, <strong className="text-gray-900 dark:text-white font-bold">8084-10</strong> e <strong className="text-gray-900 dark:text-white font-bold">8085-10</strong>. Nos fins de semana e madrugadas, operam apenas as linhas <strong className="text-gray-900 dark:text-white font-bold">8012-10</strong> e <strong className="text-gray-900 dark:text-white font-bold">8022-10</strong>. O cartão <strong className="text-[#FFCC00] font-bold">BUSP é obrigatório</strong> para gratuidade; sem ele, a tarifa é cobrada via Bilhete Único.
            </p>

            {/* Barra de Ações do Mapa */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-black/5 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-[#FFCC00]/15 text-[#FFCC00]">
                        <Bus className="w-4 h-4 text-[#FFCC00]" />
                    </div>
                    <div>
                        <h4 className="text-xs sm:text-sm font-black font-bukra uppercase tracking-wider text-gray-900 dark:text-white">
                            Mapa dos Caminhos dos Circulares BUSP
                        </h4>
                        <span className="text-[11px] text-gray-500 font-open-sans block">
                            Campus Butantã • Vigência a partir de setembro de 2024
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLightboxOpen(true);
                            setZoomLevel(1);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-[#FFCC00] hover:bg-[#E5B800] text-gray-950 font-black font-bukra text-xs uppercase tracking-wider shadow-md shadow-[#FFCC00]/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                        title="Ampliar mapa em tela cheia com zoom"
                    >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>Ampliar Mapa</span>
                    </button>

                    <a
                        href={mapSrc}
                        download="mapa-circulares-busp-campus-butanta.png"
                        onClick={() => toast.success('Iniciando download do mapa!')}
                        className="px-3.5 py-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 border border-black/10 dark:border-white/10 font-black font-bukra text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95"
                        title="Baixar imagem"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar</span>
                    </a>

                    <a
                        href={officialUspUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 hover:text-[#0F4780] dark:hover:text-[#FFCC00] border border-black/10 dark:border-white/10 transition-colors"
                        title="Abrir no portal da USP"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Imagem do Mapa */}
            <div
                onClick={() => {
                    setIsLightboxOpen(true);
                    setZoomLevel(1);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        setIsLightboxOpen(true);
                        setZoomLevel(1);
                    }
                }}
                className="relative rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-[#121212] cursor-pointer group/image transition-all hover:border-[#FFCC00]/40 shadow-lg"
                title="Clique para abrir e navegar no mapa com zoom"
            >
                {/* Skeleton Loading State */}
                {isImageLoading && (
                    <div className="w-full h-80 sm:h-96 md:h-[420px] flex flex-col items-center justify-center bg-gray-100 dark:bg-[#1A1A1A] animate-pulse">
                        <Bus className="w-10 h-10 text-gray-400 dark:text-gray-600 animate-bounce mb-2" />
                        <span className="text-xs font-black font-bukra uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Carregando Mapa...
                        </span>
                    </div>
                )}

                <Image
                    src={mapSrc}
                    alt="Mapa das Linhas de Ônibus BUSP Campus Butantã"
                    width={1271}
                    height={847}
                    onLoad={() => setIsImageLoading(false)}
                    className={`w-full h-auto object-contain max-h-[580px] transition-transform duration-500 group-hover/image:scale-[1.01] ${
                        isImageLoading ? 'hidden' : 'block'
                    }`}
                    priority
                />

                {/* Badge de instrução de zoom */}
                <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
                    <div className="px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-white text-[11px] font-black font-bukra uppercase tracking-wider shadow-lg flex items-center gap-1.5 group-hover/image:bg-[#FFCC00] group-hover/image:text-gray-950 transition-all">
                        <ZoomIn className="w-3.5 h-3.5 shrink-0" />
                        <span>Clique para Ampliar</span>
                    </div>
                </div>
            </div>

            {/* Modal Lightbox com Zoom & Tela Cheia */}
            <AnimatePresence>
                {isLightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                setIsLightboxOpen(false);
                                setZoomLevel(1);
                            }
                        }}
                    >
                        {/* Barra Superior do Modal */}
                        <div className="flex items-center justify-between gap-4 bg-[#1E1E1E] border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[#FFCC00]/20 text-[#FFCC00]">
                                    <Bus className="w-5 h-5 text-[#FFCC00]" />
                                </div>
                                <div>
                                    <h4 className="text-sm sm:text-base font-black font-bukra text-white uppercase italic tracking-tight">
                                        Mapa Oficial BUSP — Campus Butantã
                                    </h4>
                                    <p className="text-[11px] text-gray-400 font-open-sans">
                                        Vigência a partir de setembro de 2024
                                    </p>
                                </div>
                            </div>

                            {/* Controles de Zoom & Fechar */}
                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex items-center bg-black/40 border border-white/10 rounded-xl p-1 gap-1">
                                    <button
                                        type="button"
                                        onClick={handleZoomOut}
                                        disabled={zoomLevel <= 0.8}
                                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
                                        title="Diminuir Zoom"
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </button>
                                    <span className="text-[11px] font-mono text-gray-300 px-2 font-bold">
                                        {Math.round(zoomLevel * 100)}%
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleZoomIn}
                                        disabled={zoomLevel >= 3}
                                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition-colors"
                                        title="Aumentar Zoom"
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResetZoom}
                                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                        title="Resetar Zoom"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <a
                                    href={mapSrc}
                                    download="mapa-circulares-busp-campus-butanta.png"
                                    onClick={() => toast.success('Baixando mapa!')}
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all"
                                    title="Baixar imagem original"
                                >
                                    <Download className="w-4 h-4" />
                                </a>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLightboxOpen(false);
                                        setZoomLevel(1);
                                    }}
                                    className="p-2.5 rounded-xl bg-[#F14343]/20 hover:bg-[#F14343]/30 text-[#F14343] border border-[#F14343]/30 transition-all ml-1"
                                    title="Fechar visualizador (Esc)"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Área da Imagem com Zoom */}
                        <div className="flex-1 overflow-auto flex items-center justify-center p-2 sm:p-6 my-2">
                            <div
                                className="transition-transform duration-200 ease-out flex items-center justify-center"
                                style={{ transform: `scale(${zoomLevel})` }}
                            >
                                <Image
                                    src={mapSrc}
                                    alt="Mapa das Linhas de Ônibus BUSP em Alta Resolução"
                                    width={1271}
                                    height={847}
                                    className="max-w-none max-h-[85vh] w-auto h-auto rounded-2xl shadow-2xl border border-white/10 select-none"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>

                        {/* Barra Inferior */}
                        <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-xs">
                            <span className="font-open-sans text-gray-400 text-[11px]">
                                Linhas 8082, 8083, 8084 e 8085 • Terminal Metrô Butantã
                            </span>
                            <span className="text-[11px] text-gray-400 font-open-sans">
                                Pressione <strong>Esc</strong> para sair
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
