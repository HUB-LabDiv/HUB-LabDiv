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
import { MapPin, ExternalLink, Zap } from 'lucide-react';

export function ShowFooter() {
    return (
        <footer className="w-full bg-gray-50 dark:bg-black border-t-2 border-[#002ffe] dark:shadow-[0_0_20px_rgba(0,47,254,0.3)] pt-16 pb-32 sm:pb-24 text-gray-700 dark:text-gray-300 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200 dark:border-white/10">
                    {/* Coluna 1: Apresentação */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-black neon-border-red flex items-center justify-center font-mono font-black text-xs text-[#f60011]">
                                SF
                            </div>
                            <span className="text-xl font-black tracking-widest uppercase text-gray-950 dark:text-white">
                                <span className="neon-text-red">Show</span>{' '}
                                <span className="neon-text-blue">de</span>{' '}
                                <span className="neon-text-green">Física</span>
                            </span>
                        </div>
                        <p className="text-sm font-sans leading-relaxed max-w-md text-gray-600 dark:text-gray-300">
                            Espetáculo de demonstrações experimentais do Instituto de Física da Universidade de São Paulo. Performance lúdica, dinâmica e altamente interativa para despertar vocações científicas desde 1993.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#002ffe] dark:text-[#38bdf8]">
                            <MapPin className="w-4 h-4 text-[#f60011] shrink-0" />
                            <span>Auditório Alessandro Volta &bull; R. do Matão, Travessa R, 187 - Butantã, SP</span>
                        </div>
                    </div>

                    {/* Coluna 2: Navegação Rápida */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#002ffe] dark:text-blue-400">
                            Navegação
                        </h4>
                        <ul className="space-y-2 text-xs uppercase tracking-wider font-semibold">
                            <li>
                                <Link href="/conheca" className="hover:text-[#01f300] transition-colors">
                                    História & Proposta
                                </Link>
                            </li>
                            <li>
                                <Link href="/experimentos" className="hover:text-[#01f300] transition-colors">
                                    Nossos Experimentos
                                </Link>
                            </li>
                            <li>
                                <Link href="/monte-seu-show" className="hover:text-[#f60011] transition-colors">
                                    Monte seu Show
                                </Link>
                            </li>
                            <li>
                                <Link href="/acompanhe" className="hover:text-[#01f300] transition-colors">
                                    Acompanhe ao Vivo
                                </Link>
                            </li>
                            <li>
                                <Link href="/noticias-e-eventos" className="hover:text-[#38bdf8] transition-colors">
                                    Notícias & Editais
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Coluna 3: Institucional */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-widest text-[#f60011]">
                            Institucional
                        </h4>
                        <ul className="space-y-2 text-xs uppercase tracking-wider font-semibold">
                            <li>
                                <a
                                    href="https://portal.if.usp.br/showdefisica/pt-br/node/323"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 hover:text-[#FFCC00] transition-colors"
                                >
                                    <span>Portal Oficial IFUSP</span>
                                    <ExternalLink className="w-3 h-3 text-[#FFCC00]" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/iniciativas/show-da-fisica"
                                    className="hover:text-[#38bdf8] transition-colors"
                                >
                                    Vitrine no HUB LabDiv
                                </a>
                            </li>
                            <li>
                                <Link href="/painel" className="hover:text-[#FFCC00] transition-colors font-mono text-[#FFCC00]">
                                    Acesso Monitores (Bastidores)
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
                    <p>
                        &copy; 2026 Show de Física &bull; Instituto de Física da Universidade de São Paulo.
                    </p>
                    <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-[#01f300]" />
                        <span>Tecnologia & Plataforma por</span>
                        <a
                            href="/"
                            className="font-bold text-gray-900 dark:text-white hover:text-[#002ffe] dark:hover:text-[#38bdf8] transition-colors"
                        >
                            HUB LabDiv
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
