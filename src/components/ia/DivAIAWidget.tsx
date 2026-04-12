'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Bot } from 'lucide-react';

export function DivAIAWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Pequeno delay para aparecer graciosamente ao carregar a página
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-4 z-[90] flex flex-col items-end pointer-events-none">
            {/* O modal de Chat (Abre de baixo para cima) */}
            <div 
                className={`pointer-events-auto bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl mb-4 w-[320px] sm:w-[380px] overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'}`}
            >
                {/* Header do Chat (Glassmorphism LabDiv Colors) */}
                <div className="relative overflow-hidden bg-gradient-to-r from-brand-blue to-blue-900 border-b border-white/10 px-6 py-5">
                    {/* Efeitos de brilho */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-yellow/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-red/20 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                                <Sparkles className="w-5 h-5 text-brand-yellow" />
                            </div>
                            <div>
                                <h3 className="font-bukra font-bold text-white text-sm tracking-wide">Diva.IA</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">Treinamento (IAMAI)</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Corpo do Chat */}
                <div className="p-6 bg-gray-50 dark:bg-black/20 min-h-[250px] max-h-[400px] overflow-y-auto w-full flex flex-col gap-4">
                    
                    {/* Mensagem da IA */}
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-yellow flex items-center justify-center shrink-0 shadow-sm">
                            <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-open-sans">
                                Oiê! Eu sou a <strong className="text-brand-blue dark:text-brand-yellow">Diva.IA</strong> ✨. 
                                <br/><br/>
                                A minha estrutura neural conectada ao <strong className="font-semibold text-gray-900 dark:text-gray-100">Google Gemini</strong> e pelo <strong className="font-semibold text-gray-900 dark:text-gray-100">IAMAI</strong> está em desenvolvimento. 
                                Muito em breve serei a companheira brilhante de vocês nas navegações do IFUSP!
                            </p>
                        </div>
                    </div>

                </div>

                {/* Input área mockada */}
                <div className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-gray-800">
                    <div className="bg-gray-100 dark:bg-black/40 rounded-xl px-4 py-3 flex items-center gap-3 w-full border border-transparent dark:border-gray-800 cursor-not-allowed opacity-70">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500 truncate">Estou indexando meus neurônios...</span>
                    </div>
                </div>
            </div>

            {/* O Botão FAB da Diva */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_20px_rgba(15,71,128,0.3)] transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden ${isOpen ? 'bg-gray-800 rotate-90 scale-90' : 'bg-gradient-to-r from-brand-blue to-blue-800 hover:shadow-[0_0_30px_rgba(255,204,0,0.4)]'}`}
                aria-label="Abrir Assistente Diva.IA"
            >
                {/* Aura giratória quando fechada */}
                {!isOpen && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-blue opacity-0 group-hover:opacity-40 animate-spin-slow mix-blend-overlay"></div>
                )}
                
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <div className="relative">
                        <Sparkles className="w-6 h-6 text-brand-yellow animate-pulse" />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-brand-blue animate-bounce"></div>
                    </div>
                )}
            </button>
        </div>
    );
}
