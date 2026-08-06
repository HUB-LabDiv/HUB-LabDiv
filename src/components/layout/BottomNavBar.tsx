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


import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavigationStore } from '@/store/useNavigationStore';
import { NavItem, AppRoutes } from '@/types/navigation';
import FocusLock from 'react-focus-lock';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/lib/supabase';
import { ColisorIcon } from '../icons/ColisorIcon';



/**
 * V8.0 BottomNavBar - Fort Knox Edition
 * Implements Sharded State, Touch-Action Priority, and Defensive UI Hardening.
 */
export const BottomNavBar = () => {
    const pathname = usePathname();
    const { user: authUser } = useAuth();
    const { closeAll } = useNavigationStore();
    const [userCategory, setUserCategory] = React.useState<'aluno_usp' | 'pesquisador' | 'curioso'>('curioso');
    const [isAdult, setIsAdult] = React.useState<boolean>(false);

    // V8.0 Role-Based Navigation Protocol
    useEffect(() => {
        const fetchCategory = async () => {
            if (!authUser) {
                setUserCategory('curioso');
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('user_category, is_usp_member, is_adult')
                .eq('id', authUser.id)
                .single();

            const isUspMember = profile?.is_usp_member || authUser.email?.endsWith('@usp.br') || authUser.email?.endsWith('@if.usp.br');
            const category = profile?.user_category;
            setIsAdult(profile?.is_adult === true);

            if (['pesquisador', 'docente_pesquisador'].includes(category)) {
                setUserCategory('pesquisador');
            } else if (isUspMember || ['aluno_usp', 'licenciatura', 'bacharelado', 'pos_graduacao'].includes(category)) {
                setUserCategory('aluno_usp');
            } else {
                setUserCategory('curioso');
            }
        };

        fetchCategory();
    }, [authUser]);

    const dynamicNavItems = [
        { name: 'Comunidade', href: '/', icon: 'groups', color: 'brand-red' },
        { name: 'GCIF', href: '/gcif', icon: 'colisor', color: 'brand-blue' },
        ...( (isAdult || userCategory === 'pesquisador') ? [{ name: 'Lançar à Órbita', href: AppRoutes.ENVAR, icon: 'rocket_launch', isAction: true, color: 'brand-blue' }] : []),
        ...(userCategory === 'pesquisador' 
            ? [{ name: 'Pesquisa', href: '/arena', icon: 'visibility', color: 'brand-red' }]
            : userCategory === 'aluno_usp'
            ? [{ name: 'Ferramentas', href: '/ferramentas', icon: 'construction', color: 'brand-yellow' }]
            : [{ name: 'Ingressar', href: '/ingresso', icon: 'login', color: 'brand-yellow' }]
        ),
        { name: 'Interações', href: '/interacao?tab=emaranhamento', icon: 'hub', color: 'brand-blue' },
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
                        const isActive = pathname === item.href;
                        const activeColor = item.color || 'brand-blue';

                        {/* Central rocket button */ }
                        if (item.isAction) {
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="group relative -top-6 flex flex-col items-center"
                                >
                                    <div className={`size-14 bg-${activeColor} rounded-2xl flex items-center justify-center text-white shadow-xl shadow-${activeColor}/30 transform transition-transform active:scale-90 group-hover:-translate-y-1 border-4 border-white dark:border-gray-900`}>
                                        <span className="material-symbols-outlined text-3xl font-black">rocket_launch</span>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-tighter text-${activeColor} mt-0.5`}>{item.name}</span>
                                </Link>
                            );
                        }



                        {/* Normal nav item */ }
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 p-2 rounded-2xl transition-all relative ${isActive ? `text-${activeColor}` : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'}`}
                            >
                                <div className="size-[22px] flex items-center justify-center">
                                    {item.icon === 'colisor' ? (
                                        <ColisorIcon className="w-full h-full" animate={isActive} />
                                    ) : (
                                        <span className={`material-symbols-outlined text-[22px] ${isActive ? 'filled' : ''}`}>
                                            {item.icon}
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
