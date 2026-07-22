'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReadingExperience } from './ReadingExperienceProvider';

/**
 * ReadingRuler - A Kindle-like reading ruler that stays fixed at 40% of the screen.
 * This allows users to scroll the text through the "window" of focus.
 */
export function ReadingRuler() {
    const { isRulerEnabled } = useReadingExperience();

    // Configuration for fixed position
    const RULER_TOP_PERCENT = 40; // 40% from top
    const RULER_HEIGHT = 60; // 60px height

    return (
        <AnimatePresence>
            {isRulerEnabled && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
                >
                    {/* Top Overlay: Dims content above the ruler */}
                    <div
                        className="absolute top-0 left-0 right-0 bg-background-dark/40 dark:bg-background-dark/60 backdrop-blur-[1px]"
                        style={{ height: `calc(${RULER_TOP_PERCENT}vh - ${RULER_HEIGHT / 2}px)` }}
                    />
                    
                    {/* Bottom Overlay: Dims content below the ruler */}
                    <div
                        className="absolute bottom-0 left-0 right-0 bg-background-dark/40 dark:bg-background-dark/60 backdrop-blur-[1px]"
                        style={{ top: `calc(${RULER_TOP_PERCENT}vh + ${RULER_HEIGHT / 2}px)` }}
                    />

                    {/* Ruler Highlight: Clear window with subtle border */}
                    <div
                        className="absolute left-0 right-0 border-y-2 border-brand-yellow/30 bg-brand-yellow/5 shadow-[0_0_40px_rgba(255,204,0,0.15)]"
                        style={{ 
                            top: `calc(${RULER_TOP_PERCENT}vh - ${RULER_HEIGHT / 2}px)`, 
                            height: RULER_HEIGHT 
                        }}
                    >
                        {/* Subtle line indicator */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-brand-yellow/20 -translate-y-1/2" />
                        
                        {/* Side accents for premium feel */}
                        <div className="absolute top-0 bottom-0 left-4 w-1 bg-brand-yellow/40 rounded-full my-2" />
                        <div className="absolute top-0 bottom-0 right-4 w-1 bg-brand-yellow/40 rounded-full my-2" />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
