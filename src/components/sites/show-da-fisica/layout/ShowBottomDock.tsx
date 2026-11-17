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

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Info, Sparkles, Radio, Home } from 'lucide-react';

export function ShowBottomDock() {
    const pathname = usePathname() || '/';
    const isHome = pathname === '/' || pathname === '/sites/show-da-fisica';

    const backHref = isHome ? '/iniciativas/show-da-fisica' : '/';
    const isHubReturn = isHome;

    return (
        <aside aria-label="Navegação rápida do Show de Física" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg pointer-events-none">
            <nav className="pointer-events-auto bg-white/95 dark:bg-black/95 backdrop-blur-2xl neon-border-blue px-3 py-2 flex items-center justify-between gap-1 shadow-2xl">
                {/* 1. Voltar / HUB */}
                {isHubReturn ? (
                    <a
                        href={backHref}
                        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 text-gray-700 dark:text-gray-300 hover:text-[#f60011] dark:hover:text-[#f60011] transition-colors group"
                        title="Voltar para a vitrine do HUB LabDiv"
                    >
                        <ArrowLeft className="w-4 h-4 mb-0.5 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[9px] font-bold uppercase tracking-widest font-mono">HUB</span>
                    </a>
                ) : (
                    <Link
                        href="/"
                        className="flex-1 flex flex-col items-center justify-center py-1.5 px-2 text-gray-700 dark:text-gray-300 hover:text-[#002ffe] dark:hover:text-[#38bdf8] transition-colors group"
                        title="Voltar para o início do Show"
                    >
                        <Home className="w-4 h-4 mb-0.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Início</span>
                    </Link>
                )}

                {/* 2. Info / Conheça */}
                <Link
                    href="/conheca"
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 transition-colors ${
                        pathname.startsWith('/conheca')
                            ? 'text-[#002ffe] dark:text-[#38bdf8] font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:text-[#002ffe] dark:hover:text-[#38bdf8]'
                    }`}
                    title="Conheça o Espetáculo"
                >
                    <Info className="w-4 h-4 mb-0.5" />
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Info</span>
                </Link>

                {/* 3. Agendar (Botão Central em Destaque Neon Vermelho) */}
                <div className="flex-1 flex justify-center -my-4">
                    <Link
                        href="/monte-seu-show"
                        className="flex flex-col items-center justify-center w-16 h-16 bg-white dark:bg-black neon-border-red text-[#f60011] hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_25px_#f60011] hover:scale-105 active:scale-95 transition-all"
                        title="Monte seu Show / Agendamento"
                    >
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">
                            Agendar
                        </span>
                    </Link>
                </div>

                {/* 4. Ferramenta / Acompanhe Ao Vivo com Verde Neon */}
                <Link
                    href="/acompanhe"
                    className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 transition-colors ${
                        pathname.startsWith('/acompanhe')
                            ? 'text-[#009900] dark:text-[#01f300] font-bold'
                            : 'text-gray-700 dark:text-gray-300 hover:text-[#009900] dark:hover:text-[#01f300]'
                    }`}
                    title="Acompanhe o show ao vivo"
                >
                    <Radio className="w-4 h-4 mb-0.5 text-[#01f300] animate-pulse" />
                    <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Ao Vivo</span>
                </Link>
            </nav>
        </aside>
    );
}
