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
import { useRouter } from 'next/navigation';
import { Radio, ArrowRight, Terminal } from 'lucide-react';
import { validateShowPin } from '@/app/actions/show-da-fisica';
import toast from 'react-hot-toast';

export default function AcompanheEntradaPage() {
    const [pin, setPin] = useState('');
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanPin = pin.trim().toUpperCase();
        if (!cleanPin) {
            toast.error('Informe o código da sessão');
            return;
        }

        startTransition(async () => {
            const res = await validateShowPin(cleanPin);
            if (res.success && res.code) {
                router.push(`/acompanhe/${res.code}`);
            } else {
                toast.error(res.error || 'Código de sessão inválido ou expirado.');
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[#01f300] bg-green-500/10 text-[#009900] dark:text-[#01f300] text-xs font-mono font-bold uppercase tracking-widest">
                    <Radio className="w-3.5 h-3.5 animate-pulse text-[#01f300]" />
                    <span>Conexão ao Vivo no Palco</span>
                </div>
                <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-gray-950 dark:text-white">
                    <span className="neon-text-green">Acompanhe</span>{' '}
                    <span className="neon-text-blue">seu Show</span>
                </h1>
                <p className="text-base sm:text-lg font-sans text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                    Conecte-se à apresentação do auditório para enviar dúvidas para o telão e participar das dinâmicas interativas da sua turma.
                </p>
            </div>

            {/* Terminal de Entrada com Borda Neon Verde */}
            <div className="bg-white dark:bg-black neon-border-green p-8 sm:p-14 shadow-2xl rounded-none space-y-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-xs font-mono uppercase font-bold tracking-widest text-center text-gray-700 dark:text-gray-300">
                            Digite o Código da Sua Turma (ALUNO-XXXX ou PROF-XXXX)
                        </label>
                        <input
                            type="text"
                            placeholder="ALUNO-XXXX"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.toUpperCase())}
                            autoFocus
                            className="w-full bg-white dark:bg-black border-2 border-[#009900] dark:border-[#01f300] shadow-[0_0_20px_rgba(1,243,0,0.2),inset_0_0_10px_rgba(1,243,0,0.05)] rounded-none px-6 py-5 text-center font-mono font-black text-2xl uppercase tracking-widest text-[#009900] dark:text-[#01f300] outline-none placeholder:text-[#009900]/30 dark:placeholder:text-[#01f300]/20"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending || pin.trim().length < 4}
                        className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-[#009900] dark:bg-[#01f300] text-white dark:text-black font-black uppercase tracking-widest text-sm hover:bg-[#007700] dark:hover:bg-[#00cc00] shadow-[0_0_20px_rgba(1,243,0,0.4)] transition-all rounded-none disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        {isPending ? (
                            <div className="w-5 h-5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Entrar na Sessão</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-6 border-t border-gray-200 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                        <Terminal className="w-4 h-4 text-[#01f300] shrink-0 mt-0.5" />
                        <span><strong>Alunos:</strong> Código <code>ALUNO-...</code> para interagir com o palco.</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <Terminal className="w-4 h-4 text-[#002ffe] shrink-0 mt-0.5" />
                        <span><strong>Professores:</strong> Código <code>PROF-...</code> para acompanhamento pedagógico.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
