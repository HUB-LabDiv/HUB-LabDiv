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

import React from 'react';
import Link from 'next/link';
import { verifyEmailActionToken } from '@/lib/auth/email-action-token';
import { EmailActionClientCard } from './EmailActionClientCard';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

interface EmailActionPageProps {
    searchParams: Promise<{ token?: string }>;
}

export default async function EmailActionPage({ searchParams }: EmailActionPageProps) {
    const params = await searchParams;
    const token = typeof params.token === 'string' ? params.token : '';

    const verification = verifyEmailActionToken(token);

    if (!verification.valid || !verification.payload) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
                <div className="w-full max-w-md bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-3xl p-8 text-center space-y-4 shadow-xl">
                    <div className="w-14 h-14 rounded-2xl bg-[#F14343]/15 text-[#F14343] mx-auto flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7" />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        Link Inválido ou Expirado
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        {verification.error || 'Não foi possível validar a assinatura de segurança deste link.'}
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/admin"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0F4780] text-white text-xs font-black uppercase tracking-wider hover:bg-[#0F4780]/90 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Abrir Torre de Controle
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-[#121212]">
            <EmailActionClientCard token={token} payload={verification.payload} />
        </div>
    );
}

