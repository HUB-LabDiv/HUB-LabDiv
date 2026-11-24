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


import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/app/actions/auth';
import { NotificationBell } from './NotificationBell';
import { ReportModal } from '../feedback/ReportModal';
import { SearchOverlay } from './SearchOverlay';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeInitiative } from '@/types';
import { useNavigationStore } from '@/store/useNavigationStore';
import { Avatar } from "@/components/ui/Avatar";
import { UserMinimalDTO } from '@/types/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { useTelemetry } from '@/hooks/useTelemetry';
import { IFUSPLogo } from '../icons/IFUSPLogo';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { CacheManagerModal } from '../pwa/CacheManagerModal';
import { getProfileDisplayName } from '@/lib/profile-visibility';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';
import { runGlobalTour, runEixoTour, runPageTour } from '@/lib/tour/tour-runner';
import { getEixoTourInfo, getPageTourInfo } from '@/lib/tour/tour-data';
import { HUB_WELCOME_KEY } from '../onboarding/HubWelcomeModal';
import { Globe, Layers, Sparkles, Compass } from 'lucide-react';
import { NavbarInstallButton } from '../desktop/NavbarInstallButton';

/**
 * V8.0 Header - Fort Knox Edition
 * Implements Layer Isolation, Strict Typing, and Sharded Navigation State.
 */
export function Header() {
    const pathname = usePathname();
    const { theme, themeMode, setThemeMode } = useTheme();
    const { institution, setInstitution, initiativeTheme, setInitiativeTheme } = usePersonalizacaoStore();
    const [isAppearanceMenuOpen, setAppearanceMenuOpen] = useState(false);
    const [isHelpMenuOpen, setHelpMenuOpen] = useState(false);
    const [isNotificationsExpanded, setNotificationsExpanded] = useState(false);
    const [unreadNotifCount, setUnreadNotifCount] = useState(0);
    const { userCategory } = useUserRoleNavigation();
    const [memberInitiatives, setMemberInitiatives] = useState<string[]>([]);
    const [userRole, setUserRole] = useState<string | null>(null);

    const INSTITUTES_MENU = [
        { id: 'ifusp', label: 'IFUSP' },
        { id: 'ime', label: 'IME' },
        { id: 'iag', label: 'IAG' },
        { id: 'igc', label: 'IGC' },
        { id: 'io', label: 'IO' },
    ] as const;

    const INITIATIVES_MENU: { id: ThemeInitiative; label: string }[] = [
        { id: 'hub', label: 'HUB' },
        { id: 'labdiv', label: 'LabDiv' },
        { id: 'show-da-fisica', label: 'Show' },
        { id: 'hs', label: 'Hackerspace' },
        { id: 'profis', label: 'PROFIS' },
    ];

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
    const [isCacheModalOpen, setCacheModalOpen] = useState(false);

    const handleShareHub = async () => {
        const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.hublabdiv.com.br';
        try {
            if (typeof navigator !== 'undefined' && navigator.share) {
                await navigator.share({
                    title: 'HUB LabDiv — IFUSP',
                    text: 'Conheça o Hub de Comunicação Científica do IFUSP!',
                    url: shareUrl,
                });
            } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(shareUrl);
                toast.success('Link do HUB copiado!');
            }
        } catch {
            // Usuário cancelou o compartilhamento nativo
        } finally {
            setProfileMenuOpen(false);
            setAppearanceMenuOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            setProfileMenuOpen(false);
            setUser(null);
            // 1. Desconecta o cliente Supabase no navegador (limpa sessão e cookies do cliente)
            await supabase.auth.signOut();
            // 2. Limpa cookies de sessão no navegador
            document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'admin_bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'admin_impersonating_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            // 3. Limpa sessão no servidor
            await signOut();
        } catch (e) {
            console.error('Erro ao sair:', e);
        } finally {
            window.location.href = '/';
        }
    };

    // Handle Clicks Outside (Profile & Appearance menus)
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('#profile-menu-container')) {
                setProfileMenuOpen(false);
                setNotificationsExpanded(false);
            }
            if (!target.closest('#appearance-menu-container')) {
                setAppearanceMenuOpen(false);
                setNotificationsExpanded(false);
            }
            if (!target.closest('#help-menu-container')) {
                setHelpMenuOpen(false);
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
            .select('xp, level, avatar_url, full_name, username, use_nickname, is_labdiv, member_initiatives, role')
            .eq('id', authUser.id)
            .single()
            .then(({ data: profile }) => {
                if (profile) {
                    setUserRole(profile.role || null);
                    const inits = Array.isArray(profile.member_initiatives)
                        ? profile.member_initiatives.map((s: string) => String(s).toLowerCase())
                        : [];
                    if (profile.is_labdiv && !inits.includes('labdiv')) {
                        inits.push('labdiv');
                    }
                    setMemberInitiatives(inits);
                    setUser(prev => prev ? {
                        ...prev,
                        full_name: getProfileDisplayName(profile),
                        avatar_url: profile.avatar_url || prev.avatar_url,
                        xp: profile.xp || 0,
                        level: profile.level || 1,
                        is_labdiv: profile.is_labdiv || false,
                    } : prev);
                }
            });
    }, [authUser]);

    // Sync unread notification count directly via client Supabase for instant badge render
    useEffect(() => {
        const uid = authUser?.id;
        if (!uid) {
            setUnreadNotifCount(0);
            return;
        }

        const refreshUnread = async () => {
            try {
                const { count } = await supabase
                    .from('notifications')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', uid)
                    .eq('is_read', false);
                if (typeof count === 'number') {
                    setUnreadNotifCount(count);
                }
            } catch {
                // fallback silencioso
            }
        };

        refreshUnread();

        const handleUnreadSync = (event: Event) => {
            const custom = event as CustomEvent<{ count?: number }>;
            if (typeof custom.detail?.count === 'number') {
                setUnreadNotifCount(custom.detail.count);
            }
        };
        window.addEventListener('hub:notifications-unread', handleUnreadSync);
        window.addEventListener('focus', refreshUnread);

        const channel = supabase
            .channel(`header-notifications-${uid}`)
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${uid}`
            }, () => {
                refreshUnread();
            })
            .subscribe();

        return () => {
            window.removeEventListener('hub:notifications-unread', handleUnreadSync);
            window.removeEventListener('focus', refreshUnread);
            supabase.removeChannel(channel);
        };
    }, [authUser?.id]);

    // Global Keyboard Shortcuts (Ctrl+K, Cmd+K, /)
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isTyping = activeElement instanceof HTMLInputElement || 
                             activeElement instanceof HTMLTextAreaElement || 
                             (activeElement as HTMLElement)?.isContentEditable;

            if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                setSearchOverlayOpen(true);
            } else if (e.key === '/' && !isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                setSearchOverlayOpen(true);
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    // Close all menus on route change
    useEffect(() => {
        closeAll();
    }, [pathname, closeAll]);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 bg-white/30 dark:bg-background-dark/30 backdrop-blur-md border-b border-white/20 dark:border-white/10 z-50 transition-colors pwa-header shadow-sm"
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
            >
                <div className="max-w-[1800px] mx-auto h-16 px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-4">
                    {/* Left: Branding */}
                    <Link href="/" data-tour="logo-home" className="flex items-center gap-1.5 sm:gap-3 group shrink-0" onClick={closeAll}>
                        <div className="flex items-center gap-1.5 sm:gap-3">
                            <div className="relative w-7 h-7 sm:w-9 sm:h-9 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <div className="absolute -inset-1 bg-gradient-brand rounded-lg blur opacity-0 group-hover:opacity-40 transition-opacity animate-premium-glow"></div>
                                <Image
                                    src="/icone-HUBLabDiv.svg"
                                    alt="HUB LabDiv Logo"
                                    width={36}
                                    height={36}
                                    className="relative w-full h-full object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col -space-y-1">
                                <div className="text-base sm:text-xl font-bukra font-bold tracking-tight flex items-baseline gap-1 sm:gap-1.5 leading-tight">
                                    <span className="text-gray-900 dark:text-white uppercase">HUB</span>
                                    <span className="text-gradient-brand font-black">LabDiv</span>
                                    <div className="hidden sm:flex items-center opacity-90">
                                        <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand-blue/10 dark:bg-white/10 text-brand-blue dark:text-gray-400 ml-1">BETA</span>
                                    </div>
                                </div>
                                <span className="text-[6px] sm:text-[9px] font-bukra font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                    {institution === 'ime' ? 'IME-USP' : institution === 'iag' ? 'IAG-USP' : institution === 'igc' ? 'IGC-USP' : institution === 'io' ? 'IO-USP' : 'IFUSP'}
                                </span>
                            </div>
                            <div className="hidden md:flex items-center gap-1.5 sm:gap-2.5 ml-0 sm:ml-1 scale-75 sm:scale-100 origin-left">
                                <div className="w-px h-5 sm:h-7 bg-gray-200 dark:bg-white/15"></div>
                                {institution === 'ime' ? (
                                    <Image 
                                        src="/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo.jpeg"
                                        alt="IME USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'iag' ? (
                                    <Image 
                                        src="/2oj0z6xd_400x400.jpg"
                                        alt="IAG USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'igc' ? (
                                    <Image 
                                        src="/unnamed.jpg"
                                        alt="IGC USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : institution === 'io' ? (
                                    <Image 
                                        src="/image.png"
                                        alt="IO USP Logo"
                                        width={42}
                                        height={42}
                                        className="object-contain rounded-lg border border-white/15"
                                        priority
                                    />
                                ) : (
                                    <IFUSPLogo size={42} className="text-brand-blue dark:text-brand-blue-accent transition-opacity" />
                                )}
                            </div>
                        </div>
                    </Link>

                    {/* Mobile: Search Bar compacta */}
                    <div className="flex md:hidden items-center justify-center flex-1 min-w-0 mx-1 sm:mx-2">
                        <button
                            type="button"
                            data-tour="global-search-mobile"
                            onClick={() => setSearchOverlayOpen(true)}
                            className="flex items-center justify-start gap-1 sm:gap-1.5 w-full max-w-[112px] sm:max-w-[180px] h-7 sm:h-8 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-gray-100/90 dark:bg-card-dark/80 border border-gray-200 dark:border-white/10 hover:border-brand-yellow/50 dark:hover:border-brand-yellow/50 hover:bg-white dark:hover:bg-card-dark/95 shadow-sm transition-all text-gray-500 dark:text-gray-400 group cursor-pointer min-w-0"
                            aria-label="Buscar no HUB LabDiv"
                        >
                            <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-gray-400 group-hover:text-brand-yellow transition-colors shrink-0">
                                search
                            </span>
                            <span className="text-[10.5px] sm:text-[11px] font-open-sans text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                                <span className="sm:hidden">Buscar</span>
                                <span className="hidden sm:inline">Buscar no HUB...</span>
                            </span>
                        </button>
                    </div>

                    {/* Middle: Global Search Spotlight / Command Bar */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-40">
                        <button
                            type="button"
                            data-tour="global-search"
                            onClick={() => setSearchOverlayOpen(true)}
                            className="flex items-center justify-between gap-3 w-56 lg:w-80 xl:w-[440px] px-4 py-2 rounded-2xl bg-gray-100/80 dark:bg-card-dark/70 border border-gray-200 dark:border-white/10 hover:border-brand-yellow/50 dark:hover:border-brand-yellow/50 hover:bg-white dark:hover:bg-card-dark/95 shadow-sm hover:shadow-md hover:shadow-brand-yellow/10 transition-all text-gray-500 dark:text-gray-400 group cursor-pointer backdrop-blur-md"
                            aria-label="Buscar no HUB LabDiv"
                        >
                            <div className="flex items-center gap-2.5 min-w-0">
                                <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-brand-yellow transition-colors">
                                    search
                                </span>
                                <span className="text-xs font-open-sans font-medium text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate">
                                    Buscar no HUB LabDiv...
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 bg-gray-200/80 dark:bg-white/10 group-hover:bg-brand-yellow/20 rounded-md text-[10px] font-mono text-gray-500 dark:text-gray-300 group-hover:text-brand-yellow transition-colors">
                                    <span>Ctrl</span>
                                    <span>K</span>
                                </span>
                                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-gray-200/80 dark:bg-white/10 group-hover:bg-brand-yellow/20 rounded-md text-[10px] font-mono text-gray-500 dark:text-gray-300 group-hover:text-brand-yellow transition-colors">
                                    /
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Right: Sharded Actions */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        <div className="flex items-center">


                            <div className="flex items-center gap-2 sm:gap-3">
                                <NavbarInstallButton />
                                <div className="relative" id="help-menu-container" data-tour="navbar-help">
                                    <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-tr from-[#0F4780] via-[#FFCC00] to-[#F14343] opacity-55 blur-[3px] animate-pulse pointer-events-none" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            let seen = false;
                                            try {
                                                seen = !!localStorage.getItem(HUB_WELCOME_KEY);
                                            } catch {}
                                            if (!seen) {
                                                window.dispatchEvent(new CustomEvent('hub:open-welcome'));
                                                return;
                                            }
                                            setProfileMenuOpen(false);
                                            setAppearanceMenuOpen(false);
                                            setHelpMenuOpen((prev) => !prev);
                                        }}
                                        aria-label="Tutoriais e Guia do HUB"
                                        title="Tutoriais e Guia do HUB (?)"
                                        className="group relative flex size-8 sm:size-10 p-[2px] rounded-xl bg-gradient-to-tr from-[#0F4780] via-[#FFCC00] to-[#F14343] shadow-sm shadow-[#0F4780]/25 hover:shadow-md hover:shadow-[#1F9FCF]/30 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <span className="flex w-full h-full items-center justify-center rounded-[10px] bg-white dark:bg-[#111827] text-gray-900 dark:text-white group-hover:bg-gray-50 dark:group-hover:bg-[#182235] font-bukra font-black text-base sm:text-xl leading-none transition-colors">
                                            ?
                                        </span>
                                    </button>

                                    <AnimatePresence>
                                        {isHelpMenuOpen && (() => {
                                            const currentPath = pathname || '/';
                                            const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
                                            const eixoTour = getEixoTourInfo(currentPath);
                                            const pageTour = getPageTourInfo(currentPath, searchParams);
                                            const isSocial = eixoTour.key === 'eixo-social';
                                            const isFerramentas = eixoTour.key === 'eixo-ferramentas' || eixoTour.key === 'eixo-observatorio' || eixoTour.key === 'eixo-ingresso';
                                            const eixoBadgeClass = isSocial
                                                ? 'bg-[#0F4780]/15 text-[#0F4780] dark:bg-[#0F4780]/30 dark:text-[#1F9FCF]'
                                                : isFerramentas
                                                ? 'bg-[#FFCC00]/20 text-amber-700 dark:text-[#FFCC00]'
                                                : 'bg-[#F14343]/15 text-[#F14343]';

                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    animate={{ opacity: 1, scale: 1, borderRadius: '16px', y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                                                    style={{ transformOrigin: 'top right' }}
                                                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden z-[60] flex flex-col"
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                                        <p className="text-xs font-bukra font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                                            Tutoriais & Guia
                                                        </p>
                                                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                            Escolha um tour guiado ponto a ponto
                                                        </p>
                                                    </div>

                                                    <div className="p-2 space-y-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setHelpMenuOpen(false);
                                                                runGlobalTour(userCategory);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer group"
                                                        >
                                                            <span className="size-8 rounded-lg bg-gradient-to-br from-[#0F4780] via-[#F14343] to-[#FFCC00] flex items-center justify-center text-white shrink-0 shadow-sm">
                                                                <Globe className="size-4" />
                                                            </span>
                                                            <div className="min-w-0">
                                                                <span className="block text-xs font-bukra font-bold text-gray-900 dark:text-white">
                                                                    Tutorial Global
                                                                </span>
                                                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                                    Navegação geral e os 3 eixos do HUB
                                                                </span>
                                                            </div>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setHelpMenuOpen(false);
                                                                runEixoTour(currentPath);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer group"
                                                        >
                                                            <span className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${eixoBadgeClass}`}>
                                                                <Layers className="size-4" />
                                                            </span>
                                                            <div className="min-w-0">
                                                                <span className="block text-xs font-bukra font-bold text-gray-900 dark:text-white truncate">
                                                                    {eixoTour.shortLabel}
                                                                </span>
                                                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                                    Guia completo deste eixo
                                                                </span>
                                                            </div>
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setHelpMenuOpen(false);
                                                                runPageTour(currentPath, searchParams);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 text-left transition-colors cursor-pointer group"
                                                        >
                                                            <span className="size-8 rounded-lg bg-[#1F9FCF]/15 text-[#1F9FCF] flex items-center justify-center shrink-0">
                                                                <Sparkles className="size-4" />
                                                            </span>
                                                            <div className="min-w-0">
                                                                <span className="block text-xs font-bukra font-bold text-gray-900 dark:text-white truncate">
                                                                    Aba {pageTour.shortLabel}
                                                                </span>
                                                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                                    Detalhes desta sub-aba atual
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>

                                                    <div className="p-2 border-t border-gray-100 dark:border-white/10">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setHelpMenuOpen(false);
                                                                window.dispatchEvent(new CustomEvent('hub:open-welcome'));
                                                            }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#0F4780]/10 dark:hover:bg-[#1F9FCF]/15 text-left transition-colors cursor-pointer"
                                                        >
                                                            <span className="size-8 rounded-lg bg-[#0F4780]/15 dark:bg-[#1F9FCF]/20 text-[#0F4780] dark:text-[#1F9FCF] flex items-center justify-center shrink-0">
                                                                <Compass className="size-4" />
                                                            </span>
                                                            <div className="min-w-0">
                                                                <span className="block text-xs font-bukra font-bold text-[#0F4780] dark:text-[#1F9FCF]">
                                                                    Apresentação da Plataforma
                                                                </span>
                                                                <span className="block text-[10px] text-gray-500 dark:text-gray-400 truncate">
                                                                    Rever resumo dos módulos e temas
                                                                </span>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            );
                                        })()}
                                    </AnimatePresence>
                                </div>

                                <button
                                    data-tour="report-button"
                                    onClick={() => setReportModalOpen(true)}
                                    aria-label="Reportar Erro ou Enviar Feedback"
                                    className="flex relative size-8 sm:size-10 items-center justify-center rounded-xl bg-[#F14343]/15 text-[#F14343] hover:bg-[#F14343]/25 transition-all border border-[#F14343]/30 group cursor-pointer shadow-sm shadow-[#F14343]/15"
                                    title="Reportar Erro / Feedback"
                                >
                                    <span className="material-symbols-outlined text-[16px] sm:text-[20px] animate-pulse group-hover:scale-110 transition-transform">report</span>
                                    <span className="absolute -top-0.5 -right-0.5 size-2.5 bg-[#F14343] rounded-full animate-ping opacity-75"></span>
                                    <span className="absolute -top-0.5 -right-0.5 size-2 bg-[#F14343] rounded-full ring-2 ring-background-dark"></span>
                                </button>

                                {user ? (
                                    <div className={`relative ${unreadNotifCount > 0 ? 'mr-1.5 sm:mr-2' : ''}`} id="profile-menu-container" data-tour="user-profile-menu">
                                        <button
                                            onClick={() => {
                                                setNotificationsExpanded(false);
                                                setProfileMenuOpen(!isProfileMenuOpen);
                                            }}
                                            className="relative flex items-center justify-center group cursor-pointer"
                                            aria-label="Menu do Perfil"
                                        >
                                            <Avatar
                                                src={user.avatar_url}
                                                name={user.full_name}
                                                size="md"
                                                customSize="w-9 h-9 sm:w-10 sm:h-10"
                                                xp={user.xp}
                                                level={user.level}
                                                isLabDiv={user.is_labdiv}
                                            />
                                            {unreadNotifCount > 0 && (
                                                <span
                                                    className="absolute -top-1 -right-2.5 z-20 inline-flex items-center gap-[1.5px] px-1 py-[1px] rounded-full bg-[#1F9FCF] text-white border-[1.5px] border-white dark:border-[#0B1120] shadow-sm shadow-[#1F9FCF]/40 shrink-0"
                                                    title={`${unreadNotifCount} ${unreadNotifCount === 1 ? 'notificação não lida' : 'notificações não lidas'}`}
                                                >
                                                    <motion.span
                                                        animate={{ rotate: [0, -18, 16, -12, 8, -4, 0] }}
                                                        transition={{ duration: 0.75, repeat: Infinity, repeatDelay: 2.4, ease: 'easeInOut' }}
                                                        style={{ transformOrigin: 'top center' }}
                                                        className="material-symbols-outlined text-[8.5px] sm:text-[9px] leading-none inline-block"
                                                    >
                                                        notifications
                                                    </motion.span>
                                                    <span className="text-[7.5px] sm:text-[8px] font-bukra font-black leading-none">
                                                        {unreadNotifCount > 9 ? '9+' : unreadNotifCount}
                                                    </span>
                                                </span>
                                            )}
                                        </button>

                                        {/* Menu Splash saindo da foto de perfil */}
                                        <AnimatePresence>
                                            {isProfileMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    animate={{ opacity: 1, scale: 1, borderRadius: '16px', y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                                                    style={{ transformOrigin: 'top right' }}
                                                    className="absolute right-0 mt-2 w-68 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden z-[60] flex flex-col"
                                                >
                                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10">
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                                            {user.full_name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                    </div>
                                                    {/* Modo Claro/Escuro Automático + Instituto + Iniciativa (oculta ao expandir Notificações) */}
                                                    {!isNotificationsExpanded && (
                                                    <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 space-y-2.5">
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                                                                Modo de Aparência
                                                            </span>
                                                            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-black/30">
                                                                {(['auto', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                                                                    <button
                                                                        key={mode}
                                                                        type="button"
                                                                        onClick={() => setThemeMode(mode)}
                                                                        className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                                            themeMode === mode
                                                                                ? 'bg-[#1F9FCF] text-white shadow-sm'
                                                                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                                        }`}
                                                                    >
                                                                        {mode === 'auto' ? 'Auto' : mode === 'light' ? 'Claro' : 'Escuro'}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                                                                Instituto
                                                            </span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {INSTITUTES_MENU.map((inst) => (
                                                                    <button
                                                                        key={inst.id}
                                                                        type="button"
                                                                        onClick={() => setInstitution(inst.id)}
                                                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                                            institution === inst.id
                                                                                ? 'bg-[#FFCC00] text-slate-950 font-black'
                                                                                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                                        }`}
                                                                    >
                                                                        {inst.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        {(() => {
                                                            const isStaff = userRole === 'admin' || userRole === 'moderator';
                                                            const available = INITIATIVES_MENU.filter((ini) => {
                                                                if (ini.id === 'hub') return true;
                                                                if (isStaff) return true;
                                                                if (ini.id === 'labdiv') return memberInitiatives.includes('labdiv');
                                                                if (ini.id === 'show-da-fisica') return memberInitiatives.some((s) => s.includes('show'));
                                                                if (ini.id === 'hs') return memberInitiatives.some((s) => s === 'hs' || s.includes('hacker'));
                                                                if (ini.id === 'profis') return memberInitiatives.some((s) => s.includes('profis'));
                                                                return false;
                                                            });
                                                            if (available.length <= 1) return null;
                                                            return (
                                                                <div>
                                                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                                                                        Tema da Organização
                                                                    </span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {available.map((ini) => (
                                                                            <button
                                                                                key={ini.id}
                                                                                type="button"
                                                                                onClick={() => setInitiativeTheme(ini.id)}
                                                                                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                                                    initiativeTheme === ini.id
                                                                                        ? 'bg-[#0F4780] text-white font-black'
                                                                                        : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                                                }`}
                                                                            >
                                                                                {ini.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })()}
                                                    </div>
                                                    )}
                                                    <div className="px-4 py-2">
                                                        <NotificationBell
                                                            userId={user?.id}
                                                            menuItemLabel="Notificações"
                                                            onOpenChange={setNotificationsExpanded}
                                                        />
                                                    </div>
                                                    {!isNotificationsExpanded && (
                                                        <>
                                                            <Link
                                                                href="/lab"
                                                                onClick={() => setProfileMenuOpen(false)}
                                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-[#0F4780] dark:text-[#1F9FCF]">science</span>
                                                                Meu Laboratório
                                                            </Link>
                                                            <Link
                                                                href="/configuracoes"
                                                                onClick={() => setProfileMenuOpen(false)}
                                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-[#0F4780] dark:text-[#1F9FCF]">settings</span>
                                                                Configurações
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={handleShareHub}
                                                                className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center gap-2 font-medium w-full text-left cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px] text-[#1F9FCF]">share</span>
                                                                Compartilhar o HUB
                                                            </button>
                                                            <div className="h-[1px] bg-gray-100 dark:bg-white/10 my-1"></div>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="px-4 py-3 text-sm text-[#F14343] hover:bg-[#F14343]/10 transition-colors flex items-center gap-2 font-bold w-full text-left cursor-pointer"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">logout</span>
                                                                Sair
                                                            </button>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <div className="relative" id="appearance-menu-container">
                                        {/* Split Button: Entrar + Setinha Expansível (a carga azul move para o menu ao expandir) */}
                                        <div
                                            className={`inline-flex items-stretch rounded-xl overflow-hidden transition-all duration-300 border ${
                                                isAppearanceMenuOpen
                                                    ? 'bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/15 shadow-none'
                                                    : 'bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] border-[#FFCC00]/50 shadow-md shadow-[#0F4780]/30'
                                            }`}
                                        >
                                            <Link
                                                href={`/login?next=${encodeURIComponent(pathname || '/')}`}
                                                data-tour="header-login"
                                                onClick={() => setAppearanceMenuOpen(false)}
                                                className={`relative flex items-center justify-center gap-1.5 font-bukra font-bold h-8 sm:h-9 px-2.5 sm:px-3.5 text-[10px] sm:text-xs transition-colors duration-300 uppercase tracking-wider ${
                                                    isAppearanceMenuOpen
                                                        ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200/70 dark:hover:bg-white/10'
                                                        : 'text-white hover:brightness-110'
                                                }`}
                                                title="Faça login para desbloquear todos os recursos"
                                            >
                                                {!isAppearanceMenuOpen && (
                                                    <span className="size-1.5 rounded-full bg-[#FFCC00] animate-ping shrink-0 hidden sm:inline-block" />
                                                )}
                                                <span className="material-symbols-outlined text-[16px]">login</span>
                                                <span className="hidden sm:inline">Entrar</span>
                                            </Link>

                                            <button
                                                type="button"
                                                data-tour="theme-toggle"
                                                onClick={() => {
                                                    setHelpMenuOpen(false);
                                                    setAppearanceMenuOpen((prev) => !prev);
                                                }}
                                                aria-label="Expandir menu de tema, notificações e configurações"
                                                aria-expanded={isAppearanceMenuOpen}
                                                className={`flex items-center justify-center w-7 sm:w-8 h-8 sm:h-9 border-l transition-colors duration-300 cursor-pointer ${
                                                    isAppearanceMenuOpen
                                                        ? 'border-gray-200 dark:border-white/15 text-gray-700 dark:text-white hover:bg-gray-200/70 dark:hover:bg-white/10'
                                                        : 'border-white/25 text-white hover:bg-white/10'
                                                }`}
                                                title="Tema, Notificações, Compartilhar e Configurações"
                                            >
                                                <span
                                                    className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
                                                        isAppearanceMenuOpen ? 'rotate-180' : ''
                                                    }`}
                                                >
                                                    expand_more
                                                </span>
                                            </button>
                                        </div>

                                        <AnimatePresence>
                                            {isAppearanceMenuOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    animate={{ opacity: 1, scale: 1, borderRadius: '16px', y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.25, borderRadius: '999px', y: -8 }}
                                                    transition={{ type: 'spring', stiffness: 420, damping: 26 }}
                                                    style={{ transformOrigin: 'top right' }}
                                                    className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E1E1E] border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden z-[60] p-3.5 space-y-3"
                                                >
                                                    {!isNotificationsExpanded && (
                                                        <>
                                                            <div>
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                                                                    Modo de Aparência
                                                                </span>
                                                                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-gray-100 dark:bg-black/30">
                                                                    {(['auto', 'light', 'dark'] as ThemeMode[]).map((mode) => (
                                                                        <button
                                                                            key={mode}
                                                                            type="button"
                                                                            onClick={() => setThemeMode(mode)}
                                                                            className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                                                themeMode === mode
                                                                                    ? 'bg-[#1F9FCF] text-white shadow-sm'
                                                                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                                            }`}
                                                                        >
                                                                            {mode === 'auto' ? 'Auto' : mode === 'light' ? 'Claro' : 'Escuro'}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1.5">
                                                                    Instituto
                                                                </span>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {INSTITUTES_MENU.map((inst) => (
                                                                        <button
                                                                            key={inst.id}
                                                                            type="button"
                                                                            onClick={() => setInstitution(inst.id)}
                                                                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                                                                institution === inst.id
                                                                                    ? 'bg-[#FFCC00] text-slate-950 font-black'
                                                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                                            }`}
                                                                        >
                                                                            {inst.label}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                    <div className={!isNotificationsExpanded ? 'pt-2 border-t border-gray-100 dark:border-white/10 space-y-1.5' : 'space-y-1.5'}>
                                                        <NotificationBell
                                                            userId={undefined}
                                                            menuItemLabel="Notificações"
                                                            onOpenChange={setNotificationsExpanded}
                                                        />
                                                        {!isNotificationsExpanded && (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleShareHub}
                                                                    className="w-full py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-[#1F9FCF]/15 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors cursor-pointer"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px] text-[#1F9FCF]">share</span>
                                                                    <span>Compartilhar o HUB</span>
                                                                </button>
                                                                <Link
                                                                    href="/configuracoes"
                                                                    onClick={() => setAppearanceMenuOpen(false)}
                                                                    className="w-full py-2 px-3 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-[#0F4780]/15 text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-[16px] text-[#0F4780] dark:text-[#1F9FCF]">settings</span>
                                                                    <span>Configurações</span>
                                                                </Link>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="pt-1">
                                                        <Link
                                                            href={`/login?next=${encodeURIComponent(pathname || '/')}`}
                                                            onClick={() => setAppearanceMenuOpen(false)}
                                                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] hover:brightness-110 text-xs font-bukra font-black uppercase tracking-wider text-white flex items-center justify-center gap-2 shadow-lg shadow-[#0F4780]/30 border border-[#FFCC00]/40 transition-all"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">login</span>
                                                            <span>Entrar com @usp.br</span>
                                                        </Link>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
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

            <CacheManagerModal
                isOpen={isCacheModalOpen}
                onClose={() => setCacheModalOpen(false)}
            />
        </>
    );
}
