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
import { useTheme } from '@/hooks/useTheme';
import { Sun, Moon, Sparkles, Shield, Radio } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';

export function ShowHeader() {
    const pathname = usePathname() || '/';
    const { theme, toggleTheme } = useTheme();
    const { user, profile } = useAuth();

    const isMemberOrAdmin = Boolean(
        profile?.role === 'admin' ||
        profile?.role === 'moderator' ||
        user?.role === 'admin' ||
        (Array.isArray(profile?.member_initiatives) && profile.member_initiatives.includes('show_da_fisica'))
    );

    const navLinks = [
        { label: 'Início', href: '/' },
        { label: 'Conheça', href: '/conheca' },
        { label: 'Experimentos', href: '/experimentos' },
        { label: 'Notícias & Eventos', href: '/noticias-e-eventos' },
    ];

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b-2 border-gray-200 dark:border-white/10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
                {/* Brand / Logo com Letreiro Neon da Vitrine */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-11 h-11 bg-black neon-border-blue flex items-center justify-center transition-transform group-hover:scale-105">
                        <span className="font-mono font-black text-xs text-[#01f300] tracking-tighter">
                            SF
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-lg sm:text-xl font-black tracking-widest uppercase text-gray-950 dark:text-white">
                                <span className="neon-text-red">Show</span>{' '}
                                <span className="neon-text-blue">de</span>{' '}
                                <span className="neon-text-green">Física</span>
                            </span>
                        </div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] font-bold">
                            IFUSP &bull; Instituto de Física
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-none ${
                                    isActive
                                        ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe]'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Botão Ao Vivo com Verde Neon */}
                    <Link
                        href="/acompanhe"
                        className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider neon-border-green text-[#009900] dark:text-[#01f300] hover:bg-[#01f300] hover:text-black transition-all rounded-none"
                        title="Acompanhe a sessão ao vivo com seu código"
                    >
                        <Radio className="w-3.5 h-3.5 animate-pulse text-[#01f300]" />
                        <span>Ao Vivo</span>
                    </Link>

                    {/* Botão Monte seu Show Neon Vermelho */}
                    <Link
                        href="/monte-seu-show"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest text-xs hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_20px_#f60011] transition-all rounded-none"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Agendar</span>
                    </Link>

                    {/* Alternar Tema */}
                    <button
                        onClick={toggleTheme}
                        aria-label="Alternar tema claro/escuro"
                        className="p-2.5 border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4 h-4 text-[#FFCC00]" />
                        ) : (
                            <Moon className="w-4 h-4 text-gray-800" />
                        )}
                    </button>

                    {/* Acesso Bastidores */}
                    {isMemberOrAdmin && (
                        <Link
                            href="/painel"
                            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                            title="Painel de Bastidores"
                        >
                            <Shield className="w-3.5 h-3.5 text-amber-500" />
                            <span>Bastidores</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
