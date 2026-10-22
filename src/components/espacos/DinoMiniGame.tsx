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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChromeDino, PixelCactus } from './ChromeDino';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Obstacle {
    x: number;
    width: number;
    height: number;
    type: 'cactus' | 'glitch';
}

type WindowWithAudio = Window & typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
};

/**
 * Playable Google Chrome Offline Dino Mini-Game with Matrix Green Visuals.
 * Embeddable inside the Hackerspace page for instant retro immersion.
 */
export function DinoMiniGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState<number>(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('hs_dino_highscore');
                if (saved) return parseInt(saved, 10);
            } catch {
                // Ignore storage restrictions
            }
        }
        return 0;
    });
    const [soundEnabled, setSoundEnabled] = useState(true);

    const [dinoY, setDinoY] = useState(0);
    const [obstacles, setObstacles] = useState<Obstacle[]>([]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const animationRef = useRef<number | null>(null);
    const lastTimeRef = useRef<number>(0);
    
    // Mutable refs for smooth 60fps loop
    const dinoYRef = useRef(0);
    const velocityRef = useRef(0);
    const obstaclesRef = useRef<Obstacle[]>([]);
    const scoreRef = useRef(0);
    const highScoreRef = useRef(highScore);
    const isPlayingRef = useRef(false);
    const gameOverRef = useRef(false);

    useEffect(() => {
        highScoreRef.current = highScore;
    }, [highScore]);

    // Audio beep helper
    const playBeep = useCallback((freq = 587.33, duration = 0.08) => {
        if (!soundEnabled || typeof window === 'undefined') return;
        try {
            const AudioContextClass = window.AudioContext || (window as WindowWithAudio).webkitAudioContext;
            if (!AudioContextClass) return;
            const ctx = new AudioContextClass();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch {
            // AudioContext not available
        }
    }, [soundEnabled]);

    const jump = useCallback(() => {
        if (!isPlayingRef.current || gameOverRef.current) {
            isPlayingRef.current = true;
            gameOverRef.current = false;
            setIsPlaying(true);
            setGameOver(false);
            scoreRef.current = 0;
            setScore(0);
            obstaclesRef.current = [];
            setObstacles([]);
            dinoYRef.current = 0;
            setDinoY(0);
            velocityRef.current = 14;
            playBeep(659.25, 0.1);
            return;
        }

        if (dinoYRef.current === 0) {
            velocityRef.current = 14;
            playBeep(659.25, 0.08);
        }
    }, [playBeep]);

    // Keyboard listener for Space and Arrow Up
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [jump]);

    // Main Game Loop
    useEffect(() => {
        if (!isPlaying || gameOver) {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            return;
        }

        let lastObstacleSpawn = 0;
        const gravity = 0.85;
        const groundSpeed = 6;

        const loop = (timestamp: number) => {
            if (!lastTimeRef.current) lastTimeRef.current = timestamp;
            const delta = timestamp - lastTimeRef.current;
            lastTimeRef.current = timestamp;

            // Physics for Dino Jump
            dinoYRef.current += velocityRef.current;
            velocityRef.current -= gravity;

            if (dinoYRef.current <= 0) {
                dinoYRef.current = 0;
                velocityRef.current = 0;
            }

            setDinoY(dinoYRef.current);

            // Move Obstacles
            obstaclesRef.current = obstaclesRef.current
                .map(obs => ({ ...obs, x: obs.x - groundSpeed }))
                .filter(obs => obs.x > -50);

            // Spawn new obstacle
            lastObstacleSpawn += delta;
            if (lastObstacleSpawn > 1400 + Math.random() * 1200) {
                lastObstacleSpawn = 0;
                const containerWidth = containerRef.current?.clientWidth || 600;
                obstaclesRef.current.push({
                    x: containerWidth + 20,
                    width: 24,
                    height: 32,
                    type: Math.random() > 0.3 ? 'cactus' : 'glitch'
                });
            }

            // Collision Detection
            const dinoBox = {
                x: 40,
                y: dinoYRef.current,
                width: 38,
                height: 42
            };

            for (const obs of obstaclesRef.current) {
                if (
                    dinoBox.x + dinoBox.width - 6 > obs.x &&
                    dinoBox.x + 6 < obs.x + obs.width &&
                    dinoBox.y < obs.height - 4
                ) {
                    // Collision detected!
                    gameOverRef.current = true;
                    setGameOver(true);
                    playBeep(220, 0.25);
                    const finalScore = scoreRef.current;
                    if (finalScore > highScoreRef.current) {
                        setHighScore(finalScore);
                        try {
                            localStorage.setItem('hs_dino_highscore', finalScore.toString());
                        } catch {}
                    }
                    return;
                }
            }

            setObstacles([...obstaclesRef.current]);
            scoreRef.current += 1;
            setScore(scoreRef.current);

            animationRef.current = requestAnimationFrame(loop);
        };

        animationRef.current = requestAnimationFrame(loop);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [isPlaying, gameOver, playBeep]);

    const formatScore = (num: number) => num.toString().padStart(5, '0');

    return (
        <div 
            ref={containerRef}
            onClick={jump}
            className="relative w-full h-[220px] sm:h-[240px] bg-emerald-50/60 dark:bg-[#070e09] border-2 border-emerald-500/40 dark:border-[#00FF66]/30 hover:border-emerald-500 dark:hover:border-[#00FF66]/70 rounded-3xl overflow-hidden shadow-md dark:shadow-[0_0_30px_rgba(0,255,102,0.15)] flex flex-col justify-between p-4 cursor-pointer select-none transition-all group"
            style={{
                backgroundImage: 'radial-gradient(rgba(5, 150, 105, 0.08) 1px, transparent 0)',
                backgroundSize: '16px 16px'
            }}
        >
            {/* Top Bar: Retro Score & Controls */}
            <div className="flex items-center justify-between z-10 font-mono text-xs sm:text-sm text-emerald-800 dark:text-[#00FF66] tracking-wider">
                <div className="flex items-center gap-2 font-black uppercase text-[10px] sm:text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-[#00FF66] animate-pulse"></span>
                    <span>IFUSP_OFFLINE_DINO.EXE</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 font-bold">
                        <span className="text-emerald-700/60 dark:text-[#00FF66]/50">HI {formatScore(highScore)}</span>
                        <span className="text-emerald-900 dark:text-[#00FF66] font-black">{formatScore(score)}</span>
                    </div>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSoundEnabled(!soundEnabled);
                        }}
                        className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-[#00FF66]/10 dark:hover:bg-[#00FF66]/20 text-emerald-800 dark:text-[#00FF66] transition-colors"
                        title={soundEnabled ? 'Silenciar' : 'Ativar Som'}
                    >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Game Canvas Area */}
            <div className="relative flex-1 w-full flex items-end pb-4 overflow-hidden">
                {/* Dino Sprite */}
                <div 
                    className="absolute left-10 transition-none z-10 text-emerald-700 dark:text-[#00FF66]"
                    style={{ 
                        bottom: `${16 + dinoY}px`,
                        transform: dinoY > 0 ? 'rotate(-6deg)' : 'none'
                    }}
                >
                    <ChromeDino size={42} className="text-emerald-700 dark:text-[#00FF66]" />
                </div>

                {/* Obstacles */}
                {obstacles.map((obs, idx) => (
                    <div 
                        key={idx}
                        className="absolute bottom-4 z-10"
                        style={{ left: `${obs.x}px` }}
                    >
                        {obs.type === 'cactus' ? (
                            <PixelCactus size={obs.height} className="text-emerald-700 dark:text-[#00FF66]" />
                        ) : (
                            <div className="w-6 h-8 bg-emerald-100 dark:bg-[#00FF66]/20 border border-emerald-400 dark:border-[#00FF66] rounded flex items-center justify-center font-mono text-[9px] text-emerald-800 dark:text-[#00FF66] font-black">
                                &lt;/&gt;
                            </div>
                        )}
                    </div>
                ))}

                {/* Ground Line */}
                <div className="absolute bottom-4 left-0 right-0 h-[2px] bg-emerald-400/50 dark:bg-[#00FF66]/40 flex items-center">
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-emerald-600/70 dark:via-[#00FF66]/80 to-transparent"></div>
                </div>
            </div>

            {/* Overlay Prompts / Game Over */}
            {!isPlaying && (
                <div className="absolute inset-0 bg-white/90 dark:bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
                    <div className="flex items-center gap-2 mb-2 text-emerald-800 dark:text-[#00FF66]">
                        <ChromeDino size={32} className="text-emerald-700 dark:text-[#00FF66]" />
                        <span className="font-mono text-sm sm:text-base font-black tracking-widest uppercase">
                            HACKERSPACE DINO RUN
                        </span>
                    </div>
                    <p className="font-mono text-xs text-gray-700 dark:text-gray-300 max-w-xs mb-4">
                        Pressione <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#00FF66]/20 dark:text-[#00FF66] dark:border-[#00FF66]/40 rounded font-black font-mono">ESPAÇO</span> ou toque na tela para pular!
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            jump();
                        }}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00FF66] dark:hover:bg-[#33ff85] dark:text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 dark:shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:scale-105 transition-transform"
                    >
                        <Play className="w-3.5 h-3.5 fill-current" /> Iniciar Corrida
                    </button>
                </div>
            )}

            {gameOver && (
                <div className="absolute inset-0 bg-white/95 dark:bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center z-20 text-center p-4">
                    <div className="font-mono font-black text-xl sm:text-2xl text-emerald-900 dark:text-[#00FF66] tracking-widest mb-1">
                        G A M E &nbsp; O V E R
                    </div>
                    <p className="font-mono text-xs text-emerald-700 dark:text-[#00FF66]/70 mb-4">
                        Pontuação: {formatScore(score)}
                    </p>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            jump();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00FF66] dark:hover:bg-[#33ff85] dark:text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-md dark:shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:scale-105 transition-transform"
                    >
                        <RotateCcw className="w-4 h-4" /> Jogar Novamente
                    </button>
                </div>
            )}

            {/* Bottom Status Tag */}
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-700/70 dark:text-[#00FF66]/60 pt-1 border-t border-emerald-200 dark:border-[#00FF66]/15">
                <span>[TAP / CLICK / SPACEBAR TO JUMP]</span>
                <span className="hidden sm:inline">HACKER ETHICS: REINVENT EVERYTHING</span>
            </div>
        </div>
    );
}
