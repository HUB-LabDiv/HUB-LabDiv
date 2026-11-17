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
import { ArrowRight, Terminal, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { validateShowPin } from '@/app/actions/show-da-fisica';
import { useAuth } from '@/providers/AuthProvider';
import { getShowSiteHref } from '@/lib/subdomain-urls';
import toast from 'react-hot-toast';

interface ShowActionButtonsProps {
    initialIsStaff?: boolean;
}

export function ShowActionButtons({ initialIsStaff = false }: ShowActionButtonsProps) {
    const [mode, setMode] = useState<'buttons' | 'input'>('buttons');
    const [pin, setPin] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { user, profile } = useAuth();

    const isStaff = Boolean(
        initialIsStaff || 
        profile?.role === 'admin' || 
        profile?.role === 'moderator' ||
        user?.role === 'admin' ||
        user?.role === 'moderator'
    );

    const previewSiteHref = typeof window !== 'undefined' 
        ? getShowSiteHref('/', window.location.host) 
        : 'https://showdefisica.hublabdiv.com.br';

    const handleSubmitPin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pin.trim()) return;

        startTransition(async () => {
            const res = await validateShowPin(pin);
            if (res.success && res.code) {
                const targetPath = getShowSiteHref(`/acompanhe/${res.code}`);
                if (targetPath.startsWith('http')) {
                    window.location.href = targetPath;
                } else {
                    router.push(targetPath);
                }
            } else {
                toast.error(res.error || 'Código de sessão inválido');
            }
        });
    };

    return (
        <div className="mt-20 text-center relative min-h-[120px]">
            {/* 1. VISÃO DO VISITANTE / USUÁRIO COMUM: Apenas botão da página atual */}
            {!isStaff && (
                <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
                    <p className="text-lg font-sans text-gray-700 dark:text-gray-300 mb-2">
                        Pronto para agendar a sua escola ou consultar as informações completas do espetáculo?
                    </p>
                    <a
                        href="https://portal.if.usp.br/showdefisica/pt-br/node/323"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-[#0F4780] hover:bg-[#145ca5] border-2 border-[#FFCC00] text-white font-bold uppercase tracking-widest text-base shadow-[0_4px_20px_rgba(15,71,128,0.3)] hover:shadow-[0_0_30px_rgba(255,204,0,0.6)] transition-all duration-300 rounded-none group"
                    >
                        <span className="font-sans">Ir para a página atual</span>
                        <ExternalLink className="w-5 h-5 text-[#FFCC00] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                    <p className="text-xs font-sans text-gray-500 dark:text-gray-400 mt-2">
                        Consulte o calendário, regras de agendamento e informações no portal oficial do Show de Física IFUSP.
                    </p>
                </div>
            )}

            {/* 2. VISÃO EXCLUSIVA DE ADMIN / MODERADOR DO HUB */}
            {isStaff && (
                <div className="max-w-2xl mx-auto flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Acesso de Coordenação & Moderação</span>
                    </div>

                    <p className="text-lg font-sans text-gray-700 dark:text-gray-300 mb-6">
                        {mode === 'buttons'
                            ? "Gerencie a iniciativa ou visualize o novo site dedicado por subdomínio."
                            : "Digite o PIN da sessão (Ex: ALUNO-XXXX ou PROF-XXXX) e pressione Enter:"}
                    </p>

                    {mode === 'buttons' ? (
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                            {/* Botão Oficial IFUSP */}
                            <a
                                href="https://portal.if.usp.br/showdefisica/pt-br/node/323"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 font-semibold uppercase tracking-wider text-xs transition-all duration-300 rounded-none"
                            >
                                <span>Página Atual (IFUSP)</span>
                                <ExternalLink className="w-4 h-4 text-gray-500" />
                            </a>

                            {/* Segundo Botão Exclusivo: Preview do Site Dedicado */}
                            <a
                                href={previewSiteHref}
                                className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-[#FFCC00] hover:bg-[#ffdb4d] text-gray-950 font-black uppercase tracking-widest text-sm shadow-[0_0_25px_rgba(255,204,0,0.5)] transition-all duration-300 rounded-none group"
                            >
                                <Sparkles className="w-5 h-5 text-[#0F4780] group-hover:rotate-12 transition-transform" />
                                <span>Ir para o Preview do Site</span>
                                <ArrowRight className="w-5 h-5 text-gray-950 group-hover:translate-x-1 transition-transform" />
                            </a>

                            {/* Testar PIN */}
                            <button
                                type="button"
                                onClick={() => setMode('input')}
                                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-4 border border-[#002ffe]/40 text-[#002ffe] dark:text-blue-400 font-mono text-xs uppercase tracking-wider hover:bg-[#002ffe]/10 transition-colors"
                            >
                                <Terminal className="w-4 h-4" />
                                <span>Testar PIN</span>
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmitPin} className="w-full max-w-md relative flex items-center animate-in zoom-in-95 duration-300">
                            <input
                                type="text"
                                placeholder="ALUNO-XXXX"
                                value={pin}
                                onChange={(e) => setPin(e.target.value.toUpperCase())}
                                autoFocus
                                className="w-full bg-white dark:bg-black border-2 border-[#002ffe] shadow-[0_0_20px_rgba(0,47,254,0.2)] rounded-none px-6 py-4 text-center text-lg font-black uppercase tracking-widest text-[#002ffe] dark:text-blue-400 outline-none transition-all placeholder:text-blue-300/40"
                            />
                            <button
                                type="submit"
                                disabled={isPending || pin.length < 4}
                                className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-[#002ffe] hover:bg-blue-700 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <ArrowRight className="w-5 h-5" />
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => {
                                    setMode('buttons');
                                    setPin('');
                                }}
                                className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white uppercase tracking-wider transition-colors"
                            >
                                Cancelar
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}
