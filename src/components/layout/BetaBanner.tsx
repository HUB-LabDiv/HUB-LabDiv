'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { motion } from 'framer-motion';

export function BetaBanner() {
    return (
        <motion.div 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="w-full bg-[#0F4780] dark:bg-background-dark text-white py-2.5 px-4 flex flex-col lg:flex-row items-center justify-center gap-x-8 gap-y-2 border-b border-white/10 relative z-[70] shadow-2xl"
        >
            <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black bg-brand-yellow text-brand-blue px-2.5 py-1 rounded shadow-lg uppercase tracking-tighter">
                        Comunidade Ativa
                    </span>
                    <span className="text-[9px] font-black text-brand-yellow/90 uppercase tracking-[0.2em] border border-brand-yellow/30 px-2 py-0.5 rounded-md bg-brand-yellow/5">
                        Versão Beta
                    </span>
                </div>
                <p className="text-[10px] md:text-[11px] font-bold text-white/80 max-w-4xl text-center sm:text-left leading-tight uppercase tracking-wider">
                    Este é o pulso do IFUSP em tempo real. Com a agilidade de uma rede social e o rigor da academia, aqui a divulgação passiva se transforma em comunicação científica interativa. <span className="text-brand-yellow">O ecossistema está em construção: como podemos melhorar?</span>
                </p>
            </div>
            <a 
                href="https://forms.gle/your-feedback-form" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex-shrink-0 text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 hover:bg-brand-yellow hover:text-brand-blue border border-white/20 rounded-full px-5 py-1.5 transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-brand-yellow/20"
            >
                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">campaign</span>
                Deixar Feedback
            </a>
            
            {/* Background pattern for premium feel */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 scale-150 rotate-12 bg-[radial-gradient(circle,#FFCC00_1px,transparent_1px)] [background-size:24px_24px]"></div>
            </div>
        </motion.div>
    );
}
