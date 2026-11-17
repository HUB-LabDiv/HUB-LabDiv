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


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationStore } from '@/store/useNavigationStore';
import { AppRoutes } from '@/types/navigation';
import { ColisorIcon } from '../icons/ColisorIcon';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';

/**
 * V8.0 BottomNavBar - Fort Knox Edition
 * Implements Sharded State, Touch-Action Priority, and Defensive UI Hardening.
 */
export const BottomNavBar = () => {
    const pathname = usePathname();
    const { closeAll } = useNavigationStore();
    const { bottomNavThirdAxis, isAdult, userCategory, isLoggedIn } = useUserRoleNavigation();
    const [isLaunching, setIsLaunching] = useState(false);

    const colorStyles: Record<string, { text: string; bg: string }> = {
        'brand-blue': { text: 'text-brand-blue', bg: 'bg-brand-blue' },
        'brand-red': { text: 'text-brand-red', bg: 'bg-brand-red' },
        'brand-yellow': { text: 'text-brand-yellow', bg: 'bg-brand-yellow' },
    };

    const dynamicNavItems = [
        { name: 'Social', href: '/', icon: 'groups', color: 'brand-blue', dataTour: 'mobile-eixo-comunidade' },
        { name: 'Informativo', href: '/informativo', icon: 'colisor', color: 'brand-red', dataTour: 'mobile-eixo-cgif' },
        ...(isLoggedIn
            ? ((isAdult || userCategory === 'pesquisador')
                ? [{ name: 'Lançar à Órbita', href: AppRoutes.ENVIAR, icon: 'rocket_launch', isAction: true, color: 'brand-blue' }]
                : [])
            : [{ name: 'Login', href: '/login', icon: 'login', isAction: true, color: 'brand-blue' }]
        ),
        bottomNavThirdAxis,
        { name: 'Interações', href: '/interacao?tab=emaranhamento', icon: 'hub', color: 'brand-blue', dataTour: 'mobile-eixo-interacoes' },
    ];

    // Close on route change
    useEffect(() => {
        closeAll();
    }, [pathname, closeAll]);

    const isItemActive = (itemHref: string) => {
        const baseHref = itemHref.split('?')[0];
        if (baseHref === '/gcif' || baseHref === '/informativo') {
            return pathname.startsWith('/informativo') || pathname.startsWith('/gcif') || pathname.startsWith('/wiki') || pathname.startsWith('/cgif');
        }
        if (baseHref === '/interacao') {
            return pathname.startsWith('/interacao') || pathname.startsWith('/emaranhamento');
        }
        if (baseHref === '/') {
            return pathname === '/';
        }
        return pathname === baseHref || pathname.startsWith(baseHref);
    };

    if (!dynamicNavItems?.length || pathname.startsWith('/gestao')) return null;

    return (
        <>
            <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pt-2 bg-gradient-to-t from-white/95 dark:from-background-dark/95 via-white/60 dark:via-background-dark/60 to-transparent pointer-events-none transition-all duration-300"
                style={{ 
                    touchAction: 'pan-y',
                    paddingBottom: 'max(1.25rem, calc(0.75rem + env(safe-area-inset-bottom, 0px)))'
                }} // V8.0 Native Scroll & Safe-Area Performance
            >
                <nav className="max-w-md mx-auto h-16 bg-white/70 dark:bg-[#1E1E1E]/80 backdrop-blur-3xl rounded-[32px] border border-white/30 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] flex items-center justify-around px-1 pointer-events-auto overflow-visible">
                    {dynamicNavItems.map((item) => {
                        const isActive = isItemActive(item.href);
                        const activeColor = item.color || 'brand-blue';
                        const cStyle = colorStyles[activeColor] || colorStyles['brand-blue'];

                        {/* Central action button (Rocket for authenticated adults/researchers, Login for unauthenticated) */ }
                        if (item.isAction) {
                            const isLoginAlert = item.name === 'Login';
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    data-tour="mobile-action-launch"
                                    onClick={() => {
                                        if (!isLoginAlert) {
                                            setIsLaunching(true);
                                            setTimeout(() => setIsLaunching(false), 450);
                                        }
                                    }}
                                    className="group relative -top-6 flex flex-col items-center"
                                >
                                    <div
                                        className={`relative size-14 bg-[#0F4780] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#0F4780]/30 transform transition-transform active:scale-90 group-hover:-translate-y-1 border-4 border-white dark:border-gray-900 ${isLoginAlert ? 'ring-2 ring-[#FFCC00]/80 ring-offset-2 ring-offset-transparent' : ''}`}
                                        style={isLoginAlert ? { animation: 'login-soft-pulse 2.2s ease-in-out infinite' } : undefined}
                                    >
                                        {isLoginAlert && (
                                            <span className="absolute -top-1 -right-1 size-3 rounded-full bg-[#FFCC00] animate-ping" />
                                        )}
                                        {isLoginAlert && (
                                            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-[#FFCC00] border border-gray-900" />
                                        )}
                                        <span className={`material-symbols-outlined text-3xl font-black ${!isLoginAlert && isLaunching ? 'animate-rocket-launch' : ''}`}>{item.icon}</span>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 ${isLoginAlert ? 'text-[#FFCC00]' : 'text-[#0F4780] dark:text-[#1F9FCF]'}`}>{item.name}</span>
                                </Link>
                            );
                        }

                        {/* Normal nav item */ }
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                data-tour={item.dataTour}
                                className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-2xl transition-all relative ${isActive ? cStyle.text : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <div className="size-[22px] flex items-center justify-center">
                                    {item.icon === 'colisor' ? (
                                        <ColisorIcon className="w-full h-full" animate={isActive} />
                                    ) : (
                                        <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                                            {item.icon === 'capelo' ? 'school' : item.icon}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[8px] font-black uppercase tracking-tighter">
                                    {item.name}
                                </span>
                                {isActive && (
                                    <div
                                        className={`absolute -bottom-1 w-1 h-1 rounded-full ${cStyle.bg} animate-fade-in`}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

        </>
    );
};
