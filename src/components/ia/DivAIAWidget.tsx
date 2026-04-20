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


import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, X, MessageSquare, Bot, BrainCircuit, ShieldAlert, Database } from 'lucide-react';

type AIIdentity = {
    id: string;
    name: string;
    subtitle: string;
    icon: React.ElementType;
    botIcon: React.ElementType;
    gradientHeader: string;
    gradientFab: string;
    shadowFab: string;
    iconColor: string;
    fabIconColor: string;
    pulseColor: string;
    message: React.ReactNode;
    placeholder: string;
};

export function DivAIAWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const pathname = usePathname() || '';

    // Pequeno delay para aparecer graciosamente ao carregar a página
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    // Definição das 4 personalidades
    const identities: Record<string, AIIdentity> = {
        freire: {
            id: 'freire',
            name: 'Freire.IA',
            subtitle: 'Pedagogia (IAMAI)',
            icon: BrainCircuit,
            botIcon: BrainCircuit,
            gradientHeader: 'from-purple-600 to-indigo-900',
            gradientFab: 'from-purple-600 to-indigo-800',
            shadowFab: 'hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] shadow-[0_0_20px_rgba(147,51,234,0.3)]',
            iconColor: 'text-white',
            fabIconColor: 'text-purple-100',
            pulseColor: 'bg-purple-400',
            message: (
                <>
                    Saudações! Eu sou o <strong className="text-purple-600 dark:text-purple-400">Freire.IA</strong> 🧠.<br/><br/>
                    Estou absorvendo o acervo bibliográfico focado em Divulgação Científica. Em breve, analisarei a didática da sua submissão auxiliando na democratização do saber, fundamentado na teoria de Paulo Freire.
                </>
            ),
            placeholder: 'Analisando a didática...'
        },
        admin: {
            id: 'admin',
            name: 'Modera.IA',
            subtitle: 'Segurança (IAMAI)',
            icon: ShieldAlert,
            botIcon: ShieldAlert,
            gradientHeader: 'from-brand-red to-red-900',
            gradientFab: 'from-brand-red to-red-800',
            shadowFab: 'hover:shadow-[0_0_30px_rgba(241,67,67,0.5)] shadow-[0_0_20px_rgba(241,67,67,0.3)]',
            iconColor: 'text-white',
            fabIconColor: 'text-white',
            pulseColor: 'bg-red-400',
            message: (
                <>
                    Alerta de Sistema. Aqui é o <strong className="text-brand-red">Auto-Moderador (Modera.IA)</strong> 🛡️.<br/><br/>
                    Analiso submissões em tempo real buscando violações de conduta, aplicando filtros de segurança e garantindo o padrão científico do Hub Lab-Div.
                </>
            ),
            placeholder: 'Verificando logs de segurança...'
        },
        wiki: {
            id: 'wiki',
            name: 'Oráculo.IA',
            subtitle: 'Acervo (IAMAI)',
            icon: Database,
            botIcon: Database,
            gradientHeader: 'from-teal-600 to-teal-900',
            gradientFab: 'from-teal-600 to-teal-800',
            shadowFab: 'hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] shadow-[0_0_20px_rgba(13,148,136,0.3)]',
            iconColor: 'text-white',
            fabIconColor: 'text-teal-100',
            pulseColor: 'bg-teal-400',
            message: (
                <>
                    Saudações. Eu sou o <strong className="text-teal-600 dark:text-teal-400">Oráculo da Wiki</strong> 📚.<br/><br/>
                    Conheço todas as diretrizes, histórico e regras do Instituto de Física. Pergunte-me qualquer detalhe operacional e eu o iluminarei.
                </>
            ),
            placeholder: 'Indexando documentos da Wiki...'
        },
        diva: {
            id: 'diva',
            name: 'Diva.IA',
            subtitle: 'Treinamento (IAMAI)',
            icon: Sparkles,
            botIcon: Bot,
            gradientHeader: 'from-brand-blue to-blue-900',
            gradientFab: 'from-brand-blue to-blue-800',
            shadowFab: 'hover:shadow-[0_0_30px_rgba(255,204,0,0.4)] shadow-[0_0_20px_rgba(15,71,128,0.3)]',
            iconColor: 'text-brand-yellow',
            fabIconColor: 'text-brand-yellow animate-pulse',
            pulseColor: 'bg-green-400',
            message: (
                <>
                    Oiê! Eu sou a <strong className="text-brand-blue dark:text-brand-yellow">Diva.IA</strong> ✨.<br/><br/>
                    A minha estrutura neural conectada ao <strong className="font-semibold text-gray-900 dark:text-gray-100">Google Gemini</strong> e pelo <strong className="font-semibold text-gray-900 dark:text-gray-100">IAMAI</strong> está em desenvolvimento. Muito em breve serei a companheira brilhante de vocês nas navegações do IFUSP!
                </>
            ),
            placeholder: 'Estou indexando meus neurônios...'
        }
    };

    // Descobrir qual IA usar com base na rota
    let currentIdentity = identities.diva;
    if (pathname.startsWith('/enviar')) {
        currentIdentity = identities.freire;
    } else if (pathname.startsWith('/admin')) {
        currentIdentity = identities.admin;
    } else if (pathname.startsWith('/wiki')) {
        currentIdentity = identities.wiki;
    }

    const { name, subtitle, icon: Icon, botIcon: BotIcon, gradientHeader, gradientFab, shadowFab, iconColor, fabIconColor, pulseColor, message, placeholder } = currentIdentity;

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-4 z-[90] flex flex-col items-end pointer-events-none">
            {/* O modal de Chat (Abre de baixo para cima) */}
            <div 
                className={`pointer-events-auto bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl mb-4 w-[320px] sm:w-[380px] overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8 pointer-events-none'}`}
            >
                {/* Header do Chat */}
                <div className={`relative overflow-hidden bg-gradient-to-r ${gradientHeader} border-b border-white/10 px-6 py-5 transition-colors duration-500`}>
                    {/* Efeitos de brilho */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-inner">
                                <Icon className={`w-5 h-5 ${iconColor}`} />
                            </div>
                            <div>
                                <h3 className="font-bukra font-bold text-white text-sm tracking-wide">{name}</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${pulseColor} animate-pulse`}></span>
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-white/70">{subtitle}</span>
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
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradientHeader} flex items-center justify-center shrink-0 shadow-sm transition-colors duration-500`}>
                            <BotIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-white dark:bg-[#121212] p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-800 relative z-20">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-open-sans">
                                {message}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Input área mockada */}
                <div className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-gray-800">
                    <div className="bg-gray-100 dark:bg-black/40 rounded-xl px-4 py-3 flex items-center gap-3 w-full border border-transparent dark:border-gray-800 cursor-not-allowed opacity-70">
                        <MessageSquare className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-500 truncate">{placeholder}</span>
                    </div>
                </div>
            </div>

            {/* O Botão FAB dinâmico */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-500 hover:scale-105 active:scale-95 group overflow-hidden ${isOpen ? 'bg-gray-800 rotate-90 scale-90 shadow-lg' : `bg-gradient-to-r ${gradientFab} ${shadowFab}`}`}
                aria-label={`Abrir Assistente ${name}`}
            >
                {/* Aura ao redor quando fechada */}
                {!isOpen && currentIdentity.id === 'diva' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-yellow via-brand-red to-brand-blue opacity-0 group-hover:opacity-40 animate-spin-slow mix-blend-overlay"></div>
                )}
                {!isOpen && currentIdentity.id !== 'diva' && (
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300"></div>
                )}
                
                {isOpen ? (
                    <X className="w-6 h-6 text-white transition-opacity duration-300" />
                ) : (
                    <div className="relative transition-opacity duration-300">
                        <Icon className={`w-6 h-6 ${fabIconColor}`} />
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white/50 animate-bounce"></div>
                    </div>
                )}
            </button>
        </div>
    );
}
