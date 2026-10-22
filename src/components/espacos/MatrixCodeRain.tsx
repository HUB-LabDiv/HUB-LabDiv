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

import React, { useEffect, useRef } from 'react';

interface MatrixCodeRainProps {
    className?: string;
    opacity?: number;
    speed?: number;
}

/**
 * Authentic Matrix Digital Rain Canvas Background.
 * Renders cascading streams of green characters, binary digits, and physics symbols:
 * - Fundo BRANCO com códigos VERDES nítidos descendo no modo claro.
 * - Fundo PRETO com códigos VERDES neon reluzentes descendo no modo escuro.
 */
export function MatrixCodeRain({ 
    className = '', 
    opacity = 1,
    speed = 33 
}: MatrixCodeRainProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lastTime = 0;

        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        };

        resize();
        window.addEventListener('resize', resize);

        // Mix of Katakana, Matrix glyphs, binary, and physics symbols (IFUSP vibe)
        const characters = '0101010101100111日ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ∂∇ħΨΣΩλπ';
        const fontSize = 16;
        const columns = Math.max(1, Math.floor(canvas.width / fontSize));
        
        // Start drops distributed across screen height so digital rain is instantly cascading
        const maxRows = Math.max(1, Math.floor(canvas.height / fontSize));
        let drops: number[] = Array.from({ length: columns }, () => Math.floor(Math.random() * maxRows));

        let currentIsDark = document.documentElement.classList.contains('dark');

        // Immediate solid paint on mount: pure white on light, pure black on dark
        ctx.fillStyle = currentIsDark ? '#000000' : '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Instant wipe upon toggling between light and dark modes
        const observer = new MutationObserver(() => {
            const isDarkNow = document.documentElement.classList.contains('dark');
            if (isDarkNow !== currentIsDark) {
                currentIsDark = isDarkNow;
                ctx.fillStyle = currentIsDark ? '#000000' : '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        const draw = (currentTime: number) => {
            if (currentTime - lastTime < speed) {
                animationFrameId = requestAnimationFrame(draw);
                return;
            }
            lastTime = currentTime;

            const isDark = document.documentElement.classList.contains('dark');

            // Trail fading:
            // Mode Claro: fundo branco puro com fade translúcido
            // Mode Escuro: fundo preto puro com fade translúcido
            ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = 'bold 15px monospace';

            // Recalculate columns if window was resized
            const currentColumns = Math.max(1, Math.floor(canvas.width / fontSize));
            if (currentColumns !== drops.length) {
                drops = Array.from({ length: currentColumns }, (_, i) => drops[i] ?? Math.floor(Math.random() * maxRows));
            }

            for (let i = 0; i < drops.length; i++) {
                const char = characters[Math.floor(Math.random() * characters.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                if (isDark) {
                    // Modo Escuro: Fundo Preto com códigos verde neon
                    const isHead = Math.random() > 0.88;
                    ctx.fillStyle = isHead ? '#FFFFFF' : '#00FF66';
                    ctx.shadowColor = '#00FF66';
                    ctx.shadowBlur = isHead ? 8 : 4;
                } else {
                    // Modo Claro: Fundo Branco com códigos verde Matrix vibrantes de alto contraste
                    const isHead = Math.random() > 0.88;
                    ctx.fillStyle = isHead ? '#004d1a' : '#008a2e';
                    ctx.shadowColor = '#00bb3f';
                    ctx.shadowBlur = isHead ? 2 : 0;
                }

                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;

                // Reset drop to top once it falls past screen height
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, [speed]);

    return (
        <canvas
            ref={canvasRef}
            className={`pointer-events-none absolute inset-0 z-0 ${className}`}
            style={{ opacity }}
            aria-hidden="true"
        />
    );
}
