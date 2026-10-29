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

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Zap, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { executeEmailModerationAction } from '@/app/actions/admin';
import type { EmailActionTokenPayload } from '@/lib/auth/email-action-token';

interface EmailActionClientCardProps {
    token: string;
    payload: EmailActionTokenPayload;
}

export function EmailActionClientCard({ token, payload }: EmailActionClientCardProps) {
    const [isPending, startTransition] = useTransition();
    const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

    const handleConfirm = () => {
        startTransition(async () => {
            const res = await executeEmailModerationAction(token);
            setResult(res);
        });
    };

    const isApproveAll = payload.decision === 'approve_all';
    const isApprove = payload.decision === 'approve' || isApproveAll;

    return (
        <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-3xl p-7 shadow-2xl space-y-6">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isApprove
                            ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                            : 'bg-[#F14343]/15 text-[#F14343] border border-[#F14343]/30'
                    }`}
                >
                    {isApproveAll ? (
                        <Zap className="w-6 h-6 text-[#FFCC00]" />
                    ) : isApprove ? (
                        <CheckCircle2 className="w-6 h-6" />
                    ) : (
                        <XCircle className="w-6 h-6" />
                    )}
                </div>
                <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4780] dark:text-[#FFCC00] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Ação Assinada • Torre de Controle
                    </span>
                    <h1 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        {isApproveAll
                            ? 'Aprovar Lote do E-mail'
                            : isApprove
                            ? 'Confirmar Aprovação'
                            : 'Confirmar Rejeição'}
                    </h1>
                </div>
            </div>

            {!result ? (
                <>
                    <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/10 space-y-1.5">
                        {isApproveAll ? (
                            <>
                                <p className="text-xs font-bold text-gray-900 dark:text-white">
                                    Você está prestes a aprovar{' '}
                                    <span className="text-[#0F4780] dark:text-[#FFCC00] font-black">
                                        {payload.batchItems?.length || 0} item(ns)
                                    </span>{' '}
                                    listados no resumo enviado em{' '}
                                    {new Date(payload.generatedAt).toLocaleString('pt-BR')}.
                                </p>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                    Itens que entraram na fila após o disparo deste e-mail permanecerão intactos para revisão.
                                </p>
                            </>
                        ) : (
                            <>
                                <span className="text-[10px] font-black uppercase text-gray-400">
                                    Tipo: {payload.itemType.replace('_', ' ')}
                                </span>
                                <p className="text-sm font-black text-gray-900 dark:text-white">
                                    {payload.title || `ID: ${payload.itemId.slice(0, 8)}`}
                                </p>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/admin"
                            className="flex-1 py-3 px-4 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-black uppercase tracking-wider text-center transition-all"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleConfirm}
                            className={`flex-[1.5] py-3 px-5 rounded-2xl text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
                                isApprove
                                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                                    : 'bg-[#F14343] hover:bg-red-600 shadow-[#F14343]/20'
                            }`}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Executando...
                                </>
                            ) : isApproveAll ? (
                                <>
                                    <Zap className="w-4 h-4" />
                                    Aprovar Todos ({payload.batchItems?.length || 0})
                                </>
                            ) : isApprove ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Confirmar Aprovação
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-4 h-4" />
                                    Confirmar Rejeição
                                </>
                            )}
                        </button>
                    </div>
                </>
            ) : (
                <div className="space-y-5 text-center">
                    <div
                        className={`p-4 rounded-2xl border text-xs font-bold leading-relaxed ${
                            result.success
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                                : 'bg-[#F14343]/10 border-[#F14343]/30 text-[#F14343]'
                        }`}
                    >
                        {result.success ? result.message : result.error}
                    </div>

                    <Link
                        href="/admin"
                        className="w-full py-3 px-5 rounded-2xl bg-[#0F4780] hover:bg-[#0F4780]/90 text-white text-xs font-black uppercase tracking-wider inline-flex items-center justify-center gap-2 transition-all"
                    >
                        <span>Ir para a Torre de Controle</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
}

