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

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, ArrowRight, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

export function Block5LiveInteract() {
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) {
            toast.error('Digite o código da sessão');
            return;
        }
        router.push(`/acompanhe/${trimmed}`);
    };

    return (
        <section className="py-20 border-b-2 border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="p-8 sm:p-14 bg-white dark:bg-black neon-border-green rounded-none">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Texto */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#01f300] bg-green-500/10 text-[#009900] dark:text-[#01f300] text-xs font-mono font-bold uppercase tracking-widest">
                                <Radio className="w-3.5 h-3.5 animate-pulse text-[#01f300]" />
                                <span>Interação em Tempo Real no Auditório</span>
                            </div>

                            <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-green leading-tight">
                                Acompanhe seu Show & Converse com o Palco
                            </h2>

                            <p className="text-base sm:text-lg font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                                Está no auditório Alessandro Volta acompanhando a apresentação agora? Conecte-se com o código da sua escola para enviar dúvidas para o telão, votar nas enquetes conceituais e explorar o roteiro do dia.
                            </p>

                            <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Terminal className="w-4 h-4 text-[#01f300]" />
                                    Perguntas diretas aos monitores
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Terminal className="w-4 h-4 text-[#01f300]" />
                                    Desafios e Quizzes conceituais
                                </span>
                            </div>
                        </div>

                        {/* Terminal Neon de Entrada */}
                        <div className="lg:col-span-5 bg-white dark:bg-black p-8 border-2 border-gray-300 dark:border-white/15 space-y-4 rounded-none">
                            <span className="text-xs font-mono uppercase font-bold tracking-widest text-[#009900] dark:text-[#01f300] block text-center">
                                Digite o PIN da Apresentação
                            </span>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="ALUNO-XXXX"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="w-full bg-white dark:bg-black border-2 border-[#009900] dark:border-[#01f300] shadow-[0_0_20px_rgba(1,243,0,0.15),inset_0_0_10px_rgba(1,243,0,0.05)] dark:shadow-[0_0_20px_rgba(1,243,0,0.3),inset_0_0_10px_rgba(1,243,0,0.1)] rounded-none px-6 py-4 text-center text-xl font-black uppercase tracking-widest text-[#009900] dark:text-[#01f300] outline-none transition-all placeholder:text-[#009900]/40 dark:placeholder:text-[#01f300]/30"
                                />

                                <button
                                    type="submit"
                                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#009900] dark:bg-[#01f300] text-white dark:text-black font-black uppercase tracking-widest text-xs hover:bg-[#007700] dark:hover:bg-[#00cc00] shadow-[0_0_15px_rgba(1,243,0,0.4)] transition-all rounded-none"
                                >
                                    <span>Entrar na Sessão</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
