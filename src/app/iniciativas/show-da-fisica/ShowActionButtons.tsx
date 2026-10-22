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

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal, Lock, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateShowPin } from '@/app/actions/show-da-fisica';
import { useAuth } from '@/providers/AuthProvider';
import toast from 'react-hot-toast';

interface ShowActionButtonsProps {
    initialIsAdmin?: boolean;
}

export function ShowActionButtons({ initialIsAdmin = false }: ShowActionButtonsProps) {
    const [mode, setMode] = useState<'buttons' | 'input'>('buttons');
    const [pin, setPin] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user, profile } = useAuth();

    const isAdmin = Boolean(
        initialIsAdmin || 
        profile?.role === 'admin' || 
        user?.role === 'admin'
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin.trim()) return;

        startTransition(async () => {
            const res = await validateShowPin(pin);
            if (res.success) {
                if (res.role === 'teacher') {
                    router.push(`/iniciativas/show-da-fisica/sessao/professor/${res.code}`);
                } else {
                    router.push(`/iniciativas/show-da-fisica/sessao/aluno/${res.code}`);
                }
            } else {
                toast.error(res.error || 'Código inválido');
            }
        });
    };

    const handleMonteSeuShowClick = () => {
        toast('O "Monte seu Show" está em desenvolvimento e temporariamente indisponível. Para agendar sua escola, acesse o portal oficial.', {
            icon: '🔒',
            style: {
                background: '#1E1E1E',
                color: '#fff',
                border: '1px solid #f60011',
            },
        });
    };

    const handleBlockedAcompanheClick = () => {
        toast('O acesso interativo ao Show de Física está temporariamente restrito a administradores.', {
            icon: '🔒',
            style: {
                background: '#1E1E1E',
                color: '#fff',
                border: '1px solid #01f300',
            },
        });
    };

    return (
        <div className="mt-20 text-center relative min-h-[120px]">
            <p className="text-lg font-sans text-gray-600 dark:text-gray-400 mb-6 transition-opacity duration-300">
                {mode === 'buttons' 
                    ? "Pronto para agendar a sua escola ou acessar as interações do seu show?" 
                    : "Digite o PIN (Ex: S1-ALUNO-ABCD) e pressione Enter"}
            </p>

            {!isAdmin && mode === 'buttons' && (
                <p className="text-sm font-sans text-amber-800 dark:text-amber-300/80 mb-6 max-w-xl mx-auto bg-amber-500/10 border border-amber-500/20 py-2 px-4 rounded">
                    O agendamento e o acompanhamento interativo pelo Hub estão temporariamente restritos a administradores. Para agendar visitas, utilize o portal oficial abaixo.
                </p>
            )}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
                {mode === 'buttons' ? (
                    <>
                        {/* Botão Monte seu Show - Liberado para Administradores, Bloqueado para o público geral */}
                        {isAdmin ? (
                            <Link 
                                href="/iniciativas/show-da-fisica/monte-seu-show"
                                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white dark:bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_20px_#f60011] transition-all duration-300 rounded-none shrink-0"
                            >
                                <span>Monte seu Show</span>
                                <ArrowRight className="w-6 h-6" />
                            </Link>
                        ) : (
                            <button 
                                type="button"
                                onClick={handleMonteSeuShowClick}
                                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-5 bg-gray-100 dark:bg-black/60 border-2 border-[#f60011]/40 text-[#f60011]/70 font-bold uppercase tracking-widest cursor-not-allowed hover:bg-[#f60011]/10 transition-all duration-300 rounded-none shrink-0 group select-none"
                                title="Monte seu Show temporariamente restrito a administradores"
                            >
                                <Lock className="w-5 h-5 text-[#f60011]/70 group-hover:scale-110 transition-transform" />
                                <span>Monte seu Show</span>
                                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#f60011]/20 border border-[#f60011]/40 text-[#f60011] rounded font-mono ml-1">
                                    Restrito
                                </span>
                            </button>
                        )}

                        {/* Botão Acompanhe seu Show - Liberado apenas para Administradores */}
                        {isAdmin ? (
                            <button 
                                onClick={() => setMode('input')}
                                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] font-bold uppercase tracking-widest hover:bg-[#009900] dark:hover:bg-[#01f300] hover:text-white dark:hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all duration-300 rounded-none shrink-0"
                            >
                                <span>Acompanhe seu Show</span>
                                <Terminal className="w-6 h-6" />
                            </button>
                        ) : (
                            <button 
                                type="button"
                                onClick={handleBlockedAcompanheClick}
                                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-5 bg-gray-100 dark:bg-black/60 border-2 border-[#009900]/40 dark:border-[#01f300]/40 text-[#009900]/80 dark:text-[#01f300]/70 font-bold uppercase tracking-widest cursor-not-allowed hover:bg-[#009900]/10 dark:hover:bg-[#01f300]/10 transition-all duration-300 rounded-none shrink-0 group select-none"
                                title="Acesso restrito a administradores"
                            >
                                <Lock className="w-5 h-5 text-[#009900]/80 dark:text-[#01f300]/70 group-hover:scale-110 transition-transform" />
                                <span>Acompanhe seu Show</span>
                                <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[#01f300]/20 border border-[#01f300]/40 text-[#009900] dark:text-[#01f300] rounded font-mono ml-1">
                                    Restrito
                                </span>
                            </button>
                        )}
                    </>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full relative flex items-center animate-in zoom-in-95 duration-300">
                        <input
                            type="text"
                            placeholder="S1-ALUNO-XXXX"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.toUpperCase())}
                            autoFocus
                            className="w-full bg-white dark:bg-black border-2 border-[#009900] dark:border-[#01f300] shadow-[0_0_20px_rgba(1,243,0,0.15),inset_0_0_10px_rgba(1,243,0,0.05)] dark:shadow-[0_0_20px_rgba(1,243,0,0.3),inset_0_0_10px_rgba(1,243,0,0.1)] rounded-none px-6 py-5 text-center text-xl font-black uppercase tracking-widest text-[#009900] dark:text-[#01f300] outline-none transition-all placeholder:text-[#009900]/40 dark:placeholder:text-[#01f300]/30"
                        />
                        <button
                            type="submit"
                            disabled={isPending || pin.length < 5}
                            className="absolute right-3 top-3 bottom-3 aspect-square flex items-center justify-center bg-[#009900] dark:bg-[#01f300] hover:bg-[#007700] dark:hover:bg-[#00cc00] text-white dark:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(1,243,0,0.4)]"
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <ArrowRight className="w-6 h-6" />
                            )}
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => {
                                setMode('buttons');
                                setPin('');
                            }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider transition-colors"
                        >
                            Voltar
                        </button>
                    </form>
                )}
            </div>

            {/* Botão de redirecionamento para o site atual do Show da Física (especialmente visível quando não for admin) */}
            {mode === 'buttons' && (
                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10 max-w-xl mx-auto flex flex-col items-center gap-3">
                    <a
                        href="https://portal.if.usp.br/showdefisica/pt-br/node/323"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#0F4780] hover:bg-[#145ca5] border-2 border-[#FFCC00] text-white font-bold uppercase tracking-widest text-sm sm:text-base hover:shadow-[0_0_25px_rgba(255,204,0,0.5)] transition-all duration-300 rounded-none group"
                    >
                        <span className="font-sans">Ir para o site atual do Show</span>
                        <ExternalLink className="w-5 h-5 text-[#FFCC00] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400">
                        Consulte o calendário, regras de agendamento e informações no portal oficial do Show de Física IFUSP.
                    </p>
                </div>
            )}
        </div>
    );
}

