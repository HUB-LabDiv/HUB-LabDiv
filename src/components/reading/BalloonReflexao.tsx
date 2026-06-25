'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V4.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pause, Send, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { useReadingExperience } from './ReadingExperienceProvider';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { registerBlockInteraction } from '@/app/actions/analytics';

interface BalloonReflexaoProps {
    reflexaoId: string;
    ancoraId: string;
    pergunta: string;
    tipo: 'fechada' | 'aberta';
    opcoes?: string[];
    feedback?: string;
}

export function BalloonReflexao({ 
    reflexaoId, 
    ancoraId, 
    pergunta, 
    tipo, 
    opcoes = [], 
    feedback 
}: BalloonReflexaoProps) {
    const { isRulerEnabled } = useReadingExperience();
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [response, setResponse] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const params = useParams<{ id: string }>();
    const submissionId = params?.id;

    // Monitoring Reading Ruler (Fixed at 40vh)
    useEffect(() => {
        if (!isRulerEnabled || isSubmitted) return;

        const checkPosition = () => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const rulerY = window.innerHeight * 0.4; // 40vh

            // If the ruler is overlapping with this component's anchor
            if (rect.top <= rulerY && rect.bottom >= rulerY) {
                if (!isExpanded) setIsExpanded(true);
            } else {
                // Optionally collapse if moved away
                // if (isExpanded) setIsExpanded(false);
            }
        };

        window.addEventListener('scroll', checkPosition);
        checkPosition(); // Initial check

        return () => window.removeEventListener('scroll', checkPosition);
    }, [isRulerEnabled, isSubmitted, isExpanded]);

    const handleSubmit = async () => {
        if (!response.trim() || !user) {
            if (!user) toast.error('Você precisa estar logado para salvar sua reflexão.');
            return;
        }
        
        setIsSubmitting(true);
        try {
            if (submissionId) {
                await registerBlockInteraction({
                    submissionId,
                    blockId: reflexaoId,
                    interactionData: { type: tipo, response }
                });
            }
            
            // await new Promise(resolve => setTimeout(resolve, 800)); // Simulate lag
            setIsSubmitted(true);
            toast.success('Ressignificação capturada com sucesso!');
        } catch (err) {
            toast.error('Erro ao salvar reflexão.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div ref={containerRef} id={ancoraId} className="relative my-8 flex justify-end">
            <AnimatePresence>
                {!isExpanded && !isSubmitted && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsExpanded(true)}
                        className="p-3 bg-brand-blue/10 text-brand-blue rounded-full border border-brand-blue/20 hover:bg-brand-blue/20 transition-colors shadow-lg shadow-brand-blue/5"
                        title="Pausa para Reflexão"
                    >
                        <Pause className="w-5 h-5 fill-current" />
                    </motion.button>
                )}

                {(isExpanded || isSubmitted) && (
                    <motion.div
                        initial={{ x: 50, opacity: 0, scale: 0.9 }}
                        animate={{ x: 0, opacity: 1, scale: 1 }}
                        className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl backdrop-blur-xl ${
                            isSubmitted 
                            ? 'bg-green-50/90 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' 
                            : 'bg-white/90 dark:bg-[#1E1E1E]/90 border-gray-100 dark:border-white/10'
                        }`}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            <div className={`p-2 rounded-xl ${isSubmitted ? 'bg-green-500/20 text-green-500' : 'bg-brand-blue/10 text-brand-blue'}`}>
                                {isSubmitted ? <CheckCircle2 className="w-5 h-5" /> : <MessageSquareQuote className="w-5 h-5" />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                    {isSubmitted ? 'Ressignificação Concluída' : 'Pausa Ativa: Descodificação'}
                                </h4>
                                <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                    {pergunta}
                                </p>
                            </div>
                        </div>

                        {!isSubmitted ? (
                            <div className="space-y-4">
                                {tipo === 'aberta' ? (
                                    <textarea
                                        value={response}
                                        onChange={(e) => setResponse(e.target.value)}
                                        placeholder="O que isso significa no seu universo?"
                                        className="w-full h-24 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all resize-none"
                                    />
                                ) : (
                                    <div className="grid grid-cols-1 gap-2">
                                        {opcoes.map((op, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setResponse(op)}
                                                className={`p-3 text-left text-xs font-bold rounded-xl border transition-all ${
                                                    response === op 
                                                    ? 'bg-brand-blue text-white border-brand-blue shadow-lg' 
                                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/5 text-gray-500 hover:border-brand-blue/30'
                                                }`}
                                            >
                                                {op}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <button 
                                        onClick={() => setIsExpanded(false)}
                                        className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        Ignorar por enquanto
                                    </button>
                                    <button
                                        disabled={!response || isSubmitting}
                                        onClick={handleSubmit}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Processando...' : 'Enviar'}
                                        <Send className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium italic border-l-2 border-green-500 pl-4 py-1">
                                    "{response}"
                                </p>
                                {feedback && (
                                    <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <h5 className="text-[10px] font-black uppercase tracking-widest text-brand-blue mb-2">Síntese do Lab-Div</h5>
                                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                            {feedback}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
