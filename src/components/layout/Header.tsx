'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/app/actions/auth';
import { getAvatarUrl } from '@/lib/utils';
import { NotificationBell } from './NotificationBell';
import { ReportModal } from '../feedback/ReportModal';
import { SearchOverlay } from './SearchOverlay';
import { useTheme } from '@/hooks/useTheme';
import { useNavigationStore } from '@/store/useNavigationStore';
import { Avatar } from '../ui/Avatar';
import { UserMinimalDTO } from '@/types/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTelemetry } from '@/hooks/useTelemetry';

/**
 * V8.0 Header - Fort Knox Edition
 * Implements Layer Isolation, Strict Typing, and Sharded Navigation State.
 */
export function Header() {
    const { trackEvent } = useTelemetry();
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    // Sharded UI State (V8.0 Navigation Store)
    const {
        isProfileMenuOpen,
        setProfileMenuOpen,
        isReportModalOpen,
        setReportModalOpen,
        closeAll
    } = useNavigationStore();

    const [user, setUser] = useState<UserMinimalDTO | null>(null);
    const { user: authUser } = useAuth();
    const [isSearchOverlayOpen, setSearchOverlayOpen] = useState(false);

    // Handle Clicks Outside (Profile menu only)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-menu-container')) {
                setProfileMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [setProfileMenuOpen]);

    // Sync with AuthProvider — no duplicate auth calls
    useEffect(() => {
        if (!authUser) {
            setUser(null);
            return;
        }
        const baseUser: UserMinimalDTO = {
            id: authUser.id,
            full_name: authUser.user_metadata?.full_name || 'Usuário',
            avatar_url: authUser.user_metadata?.avatar_url,
            email: authUser.email || '',
        };
        setUser(baseUser);
        supabase
            .from('profiles')
            .select('xp, level, avatar_url, full_name, is_labdiv')
            .eq('id', authUser.id)
            .single()
            .then(({ data: profile }) => {
                if (profile) {
                    setUser(prev => prev ? {
                        ...prev,
                        full_name: profile.full_name || prev.full_name,
                        avatar_url: profile.avatar_url || prev.avatar_url,
                        xp: profile.xp || 0,
                        level: profile.level || 1,
                        is_labdiv: profile.is_labdiv || false,
                    } : prev);
                }
            });
    }, [authUser]);

    // Close all menus on route change
    useEffect(() => {
        closeAll();
    }, [pathname, closeAll]);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 h-16 glass-surface z-50 transition-colors"
            >
                <div className="max-w-[1800px] mx-auto h-full px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Left: Branding */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0" onClick={closeAll}>
                        <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute -inset-1 bg-gradient-to-r from-brand-red via-brand-blue to-brand-yellow rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity animate-premium-glow"></div>
                                <div className="relative w-full h-full">
                                    <div className="absolute w-[60%] h-[75%] bg-brand-blue rounded-[2px] top-0 left-0 z-0 shadow-sm"></div>
                                    <div className="absolute w-[60%] h-[75%] bg-brand-red rounded-[2px] bottom-0 right-0 z-0 translate-y-1 shadow-sm"></div>
                                    <div className="absolute w-[60%] h-[60%] bg-brand-yellow rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-md border-2 border-white dark:border-[#1A1A1A]"></div>
                                </div>
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <div className="text-xl font-sans font-bold tracking-tight flex items-center gap-1.5 leading-tight">
                                    <span className="text-gray-900 dark:text-white">Hub</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-blue to-brand-yellow font-black">Lab-Div</span>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                                    <span className="text-[7px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Instituto de Física</span>
                                    <span className="text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-400/80 shrink-0">v3.1.5</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Middle: Nav Tabs + Search */}
                    <div className="flex-1 hidden md:flex items-center justify-center gap-1">
                        {[
                            { label: 'Comunidade', href: '/', color: 'brand-red' },
                            { label: 'GCI', href: '/explorar', color: 'brand-yellow' },
                            { label: 'LabDiv', href: '/sobre', color: 'brand-blue' },
                            { label: 'Ferramentas', href: '/ferramentas', color: 'brand-red' },
                            { label: 'Interações', href: '/interacao', color: 'brand-blue' },
                        ].map((tab) => {
                            const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
                            const colorMap: Record<string, { active: string; hover: string }> = {
                                'brand-red': { active: 'text-brand-red bg-brand-red/10 border border-brand-red/20', hover: 'hover:text-brand-red hover:bg-brand-red/5' },
                                'brand-yellow': { active: 'text-brand-yellow bg-brand-yellow/10 border border-brand-yellow/20', hover: 'hover:text-brand-yellow hover:bg-brand-yellow/5' },
                                'brand-blue': { active: 'text-brand-blue bg-brand-blue/10 border border-brand-blue/20', hover: 'hover:text-brand-blue hover:bg-brand-blue/5' },
                            };
                            const styles = colorMap[tab.color];
                            return (
                                <Link
                                    key={tab.href}
                                    href={tab.href}
                                    className={`px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all whitespace-nowrap ${
                                        isActive
                                            ? styles.active
                                            : `text-gray-500 ${styles.hover}`
                                    }`}
                                >
                                    {tab.label}
                                </Link>
                            );
                        })}

                        {/* Global Search Trigger */}
                        <button
                            onClick={() => setSearchOverlayOpen(true)}
                            className="ml-3 flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-500 hover:text-brand-yellow hover:border-brand-yellow/30 hover:bg-brand-yellow/5 transition-all group"
                        >
                            <span className="material-symbols-outlined text-[18px] group-hover:text-brand-yellow transition-colors">search</span>
                            <span className="hidden lg:inline">Buscar...</span>
                            <kbd className="hidden lg:flex items-center px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-mono text-gray-600">/</kbd>
                        </button>
                    </div>

                    {/* Right: Sharded Actions */}
                    <div className="flex items-center gap-1 sm:gap-4 shrink-0">
                        {/* Mobile Search Toggle */}
                        <button
                            onClick={() => setSearchOverlayOpen(true)}
                            className="md:hidden size-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-brand-yellow transition-all border border-gray-200 dark:border-white/10"
                            aria-label="Abrir Busca"
                        >
                            <span className="material-symbols-outlined text-[22px]">search</span>
                        </button>

                        <div className="flex items-center gap-1 sm:gap-2 pr-1.5 sm:pr-4 border-r border-gray-100 dark:border-white/10">


                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setReportModalOpen(true)}
                                    aria-label="Reportar Erro ou Enviar Feedback"
                                    className="relative size-10 flex items-center justify-center rounded-xl bg-brand-red/10 text-red-700 dark:text-brand-red hover:bg-brand-red/20 transition-all border border-brand-red/20 group animate-pulse hover:animate-none"
                                    title="Reportar Erro / Feedback"
                                >
                                    <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">report</span>
                                    <span className="absolute -top-1 -right-1 size-2 bg-brand-red rounded-full ring-2 ring-background-dark"></span>
                                </button>

                                <NotificationBell userId={user?.id} />

                                {user ? (
                                    <div className="relative" id="profile-menu-container">
                                        <button
                                            onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                                            className="relative flex items-center justify-center group"
                                        >
                                            <Avatar
                                                src={user.avatar_url}
                                                name={user.full_name}
                                                size="md"
                                                customSize="w-10 h-10"
                                                xp={user.xp}
                                                level={user.level}
                                                isLabDiv={user.is_labdiv}
                                            />
                                        </button>

                                        {/* Profile Menu Dropdown - CSS Animation */}
                                        <div
                                            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-[60] flex flex-col transition-all duration-200 transform origin-top-right ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none translate-y-2'}`}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                    {user.full_name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            <Link
                                                href="/lab"
                                                onClick={() => setProfileMenuOpen(false)}
                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">science</span>
                                                Meu Laboratório
                                            </Link>
                                            <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-1"></div>
                                            <button
                                                onClick={async () => {
                                                    setProfileMenuOpen(false);
                                                    await signOut('/login');
                                                    window.location.reload();
                                                }}
                                                className="px-4 py-3 text-sm text-brand-red hover:bg-brand-red/10 transition-colors flex items-center gap-2 font-bold w-full text-left"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                Sair
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link href="/login" className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-brand-blue font-semibold px-4 py-2 transition-colors">
                                        <span className="material-symbols-outlined">login</span>
                                        <span className="hidden sm:inline">Entrar</span>
                                    </Link>
                                )}
                            </div>

                            <button
                                onClick={toggleTheme}
                                aria-label="Alternar Tema Claro e Escuro"
                                className="relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                            >
                                <div className="relative size-full flex items-center justify-center">
                                    <span
                                        key={theme}
                                        className={`material-symbols-outlined absolute text-[20px] transition-all duration-300 transform ${theme === 'dark' ? 'opacity-100 rotate-0' : 'opacity-100 rotate-0'}`}
                                    >
                                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                                    </span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <SearchOverlay
                isOpen={isSearchOverlayOpen}
                onClose={() => setSearchOverlayOpen(false)}
            />

            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
            />
        </>
    );
}
