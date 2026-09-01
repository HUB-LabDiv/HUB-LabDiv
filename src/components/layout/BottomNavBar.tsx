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


import React, { useEffect } from 'react';
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

    const dynamicNavItems = [
        { name: 'Comunidade', href: '/', icon: 'groups', color: 'brand-red', dataTour: 'mobile-eixo-comunidade' },
        { name: 'GCIF', href: '/gcif', icon: 'colisor', color: 'brand-blue', dataTour: 'mobile-eixo-cgif' },
        ...(isLoggedIn
            ? ((isAdult || userCategory === 'pesquisador')
                ? [{ name: 'Lançar à Órbita', href: AppRoutes.ENVAR, icon: 'rocket_launch', isAction: true, color: 'brand-blue' }]
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

    if (!dynamicNavItems?.length) return null;

    return (
        <>
            <div
                className="xl:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 h-24 bg-gradient-to-t from-white/90 dark:from-background-dark/90 via-white/40 dark:via-background-dark/40 to-transparent pointer-events-none"
                style={{ touchAction: 'pan-y' }} // V8.0 Native Scroll Performance
            >
                <nav className="max-w-md mx-auto h-16 bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl rounded-[32px] border border-white/30 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-around px-1 pointer-events-auto overflow-visible">
                    {dynamicNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                        const activeColor = item.color || 'brand-blue';

                        {/* Central action button (Rocket for authenticated adults/researchers, Login for unauthenticated) */ }
                        if (item.isAction) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    data-tour="mobile-action-launch"
                                    className="group relative -top-6 flex flex-col items-center"
                                >
                                    <div className="size-14 bg-brand-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-blue/30 transform transition-transform active:scale-90 group-hover:-translate-y-1 border-4 border-white dark:border-gray-900">
                                        <span className="material-symbols-outlined text-3xl font-black">{item.icon}</span>
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-tighter text-brand-blue mt-0.5">{item.name}</span>
                                </Link>
                            );
                        }



                        {/* Normal nav item */ }
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                data-tour={item.dataTour}
                                className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-2xl transition-all relative ${isActive ? `text-${activeColor}` : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
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
                                        className={`absolute -bottom-1 w-1 h-1 rounded-full bg-${activeColor} animate-fade-in`}
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
