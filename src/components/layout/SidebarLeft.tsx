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


import React, { Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
    Megaphone,
    Network,
    BookOpen,
    Route,
    HelpCircle,
    UserSearch,
    ShieldAlert,
    MessageSquare,
    MessageCircle,
    Mail,
    Sparkles,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Search,
    Settings
} from 'lucide-react';
import { AppRoutes } from '@/types/navigation';
import { fetchRecentEntanglements } from '@/app/actions/entanglements';
import { Avatar } from "@/components/ui/Avatar";
import { supabase } from '@/lib/supabase';
import { useTelemetry } from '@/hooks/useTelemetry';
import { ColisorIcon } from '../icons/ColisorIcon';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';

const mainLinks = [
    { name: 'Social', href: '/', icon: <span className="material-symbols-outlined text-2xl">groups</span>, color: 'brand-blue', dataTour: 'sidebar-eixo-comunidade' },
    { name: 'Informativo', href: '/gcif', icon: <ColisorIcon className="w-6 h-6" />, color: 'brand-red', dataTour: 'sidebar-eixo-cgif' },
];

const secondaryLinks = [
    { name: 'Configurações', href: '/configuracoes', icon: <Settings className="w-5 h-5" /> },
    { name: 'Painel Admin', href: '/admin', icon: <ShieldAlert className="w-5 h-5" /> },
];

type SubColorKey = 'brand-yellow' | 'brand-blue' | 'brand-red';

interface TreeItem {
    label: string;
    href: string;
    tab?: string;
    group?: string;
    color?: SubColorKey;
}

const subColorStyles: Record<SubColorKey, {
    active: string;
    activeBullet: string;
    hover: string;
    hoverBullet: string;
}> = {
    'brand-yellow': {
        active: 'text-brand-yellow font-bold bg-brand-yellow/15 shadow-sm',
        activeBullet: 'bg-brand-yellow scale-125 shadow-[0_0_8px_rgba(255,204,0,0.8)]',
        hover: 'hover:text-brand-yellow hover:bg-brand-yellow/10 dark:hover:bg-brand-yellow/15',
        hoverBullet: 'group-hover:bg-brand-yellow group-hover:scale-125 group-hover:shadow-[0_0_6px_rgba(255,204,0,0.6)]',
    },
    'brand-blue': {
        active: 'text-brand-blue font-bold bg-brand-blue/15 shadow-sm',
        activeBullet: 'bg-brand-blue scale-125 shadow-[0_0_8px_rgba(15,71,128,0.8)]',
        hover: 'hover:text-brand-blue hover:bg-brand-blue/10 dark:hover:bg-brand-blue/15',
        hoverBullet: 'group-hover:bg-brand-blue group-hover:scale-125 group-hover:shadow-[0_0_6px_rgba(15,71,128,0.6)]',
    },
    'brand-red': {
        active: 'text-brand-red font-bold bg-brand-red/15 shadow-sm',
        activeBullet: 'bg-brand-red scale-125 shadow-[0_0_8px_rgba(241,67,67,0.8)]',
        hover: 'hover:text-brand-red hover:bg-brand-red/10 dark:hover:bg-brand-red/15',
        hoverBullet: 'group-hover:bg-brand-red group-hover:scale-125 group-hover:shadow-[0_0_6px_rgba(241,67,67,0.6)]',
    },
};

const socialTreeItems: TreeItem[] = [
    { label: 'Fluxo', href: '/?tab=fluxo', tab: 'fluxo', color: 'brand-blue' },
    { label: 'Arte', href: '/?tab=artes', tab: 'artes', color: 'brand-yellow' },
    { label: 'Logs', href: '/?tab=logs', tab: 'logs', color: 'brand-red' },
];

const informativoTreeItems: TreeItem[] = [
    { label: 'Instituto', href: '/gcif/instituto', color: 'brand-blue' },
    { label: 'Wiki', href: '/gcif/wiki', color: 'brand-red' },
    { label: 'Interativo', href: '/gcif/interativo', color: 'brand-yellow' },
];

const ferramentasTreeItems: TreeItem[] = [
    { label: 'Acompanhamento', href: '/ferramentas', color: 'brand-blue' },
    { label: 'Estudos', href: '/ferramentas/anotacoes', color: 'brand-yellow' },
    { label: 'Integração', href: '/ferramentas/match', color: 'brand-red' },
];

const ingressoTreeItems: TreeItem[] = [
    { label: 'Formas de Ingresso', href: '/ingresso', color: 'brand-yellow' },
    { label: 'Visitas & Extensão', href: '/ingresso?tab=visitar', tab: 'visitar', color: 'brand-blue' },
    { label: 'Show da Física', href: '/iniciativas/show-da-fisica', color: 'brand-red' },
];

const arenaTreeItems: TreeItem[] = [
    { label: 'Observatório Geral', href: '/arena', color: 'brand-blue' },
    { label: 'Como o LabDiv Ajuda', href: '/arena?tab=como-ajudar', tab: 'como-ajudar', color: 'brand-yellow' },
    { label: 'Desafios Ativos', href: '/arena?tab=challenges', tab: 'challenges', color: 'brand-red' },
    { label: 'Match Acadêmico', href: '/arena?tab=match', tab: 'match', color: 'brand-red' },
];

function SidebarLeftInner({ userId }: { userId?: string }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get('tab');
    const { isSidebarCollapsed, setSidebarCollapsed } = useNavigationStore();
    const { sidebarThirdAxis, userCategory, isLoading: isRoleLoading, isLoggedIn, isAdult } = useUserRoleNavigation();
    const [recentEntanglements, setRecentEntanglements] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const { trackEvent } = useTelemetry();
    const [mounted, setMounted] = React.useState(false);

    // Accordion state
    const [expandedAxes, setExpandedAxes] = React.useState<Record<string, boolean>>({
        social: false,
        informativo: false,
        thirdAxis: false,
    });

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Auto-expand active axis based on current route
    React.useEffect(() => {
        if (pathname === '/') {
            setExpandedAxes(prev => ({ ...prev, social: true }));
        } else if (pathname.startsWith('/gcif') || pathname.startsWith('/wiki')) {
            setExpandedAxes(prev => ({ ...prev, informativo: true }));
        } else if (
            pathname.startsWith('/ferramentas') || 
            pathname.startsWith('/ingresso') || 
            pathname.startsWith('/arena') ||
            pathname.startsWith('/iniciativas')
        ) {
            setExpandedAxes(prev => ({ ...prev, thirdAxis: true }));
        }
    }, [pathname]);

    const toggleAxis = (axisKey: string) => {
        setExpandedAxes(prev => ({ ...prev, [axisKey]: !prev[axisKey] }));
    };

    const isSubItemActive = (item: TreeItem) => {
        if (item.tab) {
            if (pathname === '/' && (item.tab === 'artes' || item.tab === 'arte')) {
                return tabParam === 'artes' || tabParam === 'arte';
            }
            if (pathname === '/' && item.tab === 'fluxo') {
                return !tabParam || tabParam === 'fluxo';
            }
            if (pathname === '/' && item.tab === 'logs') {
                return tabParam === 'logs';
            }
            if (pathname === '/ingresso') {
                return tabParam === item.tab;
            }
            if (pathname === '/arena') {
                return tabParam === item.tab;
            }
        }
        if (item.href === '/ingresso') {
            return pathname === '/ingresso' && !tabParam;
        }
        if (item.href === '/arena') {
            return pathname === '/arena' && !tabParam;
        }
        if (item.href === '/iniciativas/show-da-fisica') {
            return pathname.startsWith('/iniciativas/show-da-fisica');
        }

        // Informativo: Instituto, Wiki, Interativo
        if (item.href === '/gcif/instituto') {
            return pathname.startsWith('/gcif/instituto');
        }
        if (item.href === '/gcif/wiki') {
            return pathname === '/gcif' || pathname.startsWith('/gcif/wiki') || pathname.startsWith('/wiki');
        }
        if (item.href === '/gcif/interativo') {
            return pathname.startsWith('/gcif/interativo');
        }

        // Ferramentas: Acompanhamento, Estudos, Integração
        if (item.href === '/ferramentas') {
            return pathname === '/ferramentas' || pathname.startsWith('/ferramentas/trilhas');
        }
        if (item.href === '/ferramentas/anotacoes') {
            return pathname.startsWith('/ferramentas/anotacoes') || pathname.startsWith('/ferramentas/softwares');
        }
        if (item.href === '/ferramentas/match') {
            return pathname.startsWith('/ferramentas/match');
        }

        return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && !item.tab);
    };

    const loadSidebarData = async () => {
        setIsLoading(true);
        try {
            const entanglements = await fetchRecentEntanglements();
            setRecentEntanglements(entanglements);
        } catch (error) {
            console.error('[Sidebar] Failed to load data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        loadSidebarData();

        const channel = supabase
            .channel('sidebar_entanglements')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => {
                loadSidebarData();
            })
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'group_messages' }, () => {
                loadSidebarData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const colorMap: Record<string, { bg: string; text: string; border: string; hoverBorder: string }> = {
        'brand-blue': { bg: 'bg-brand-blue/10', text: 'text-brand-blue', border: 'border-l-brand-blue', hoverBorder: 'hover:border-l-brand-blue' },
        'brand-red': { bg: 'bg-brand-red/10', text: 'text-brand-red', border: 'border-l-brand-red', hoverBorder: 'hover:border-l-brand-red' },
        'brand-yellow': { bg: 'bg-brand-yellow/10', text: 'text-brand-yellow', border: 'border-l-brand-yellow', hoverBorder: 'hover:border-l-brand-yellow' },
    };

    if (!mounted) return null;

    const thirdAxisSubItems: TreeItem[] = userCategory === 'aluno_usp'
        ? ferramentasTreeItems
        : userCategory === 'pesquisador'
        ? arenaTreeItems
        : ingressoTreeItems;

    const renderTreeSubItem = (sub: TreeItem) => {
        const isSubActive = isSubItemActive(sub);
        const colorKey = sub.color || 'brand-yellow';
        const styles = subColorStyles[colorKey];

        return (
            <Link
                key={sub.href}
                href={sub.href}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-open-sans transition-all duration-200 group ${
                    isSubActive 
                        ? styles.active
                        : `text-gray-400 dark:text-gray-400 ${styles.hover}`
                }`}
            >
                <span 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 shrink-0 ${
                        isSubActive 
                            ? styles.activeBullet 
                            : `bg-white/20 dark:bg-white/10 ${styles.hoverBullet}`
                    }`} 
                />
                <span className="truncate">{sub.label}</span>
            </Link>
        );
    };

    return (
        <div className={`w-full h-full flex flex-col gap-2 py-6 ${isSidebarCollapsed ? 'px-2' : 'px-4'} overflow-x-hidden relative transition-all duration-300`}>
            {/* Header / Collapse Controls */}
            {!isSidebarCollapsed ? (
                <div className="flex items-center justify-between px-4 pb-2 mb-1 border-b border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Navegação</span>
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed(true)}
                        className="p-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm group"
                        title="Recolher menu lateral"
                        aria-label="Recolher menu lateral"
                    >
                        <ChevronLeft size={14} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center mb-2 px-2">
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed(false)}
                        className="p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-brand-blue hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm group"
                        title="Expandir menu lateral"
                        aria-label="Expandir menu lateral"
                    >
                        <ChevronRight size={16} className="group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}

            {/* Primary Navigation Tree View */}
            <nav className={`flex flex-col gap-1 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                {/* 1. Eixo Social */}
                {(() => {
                    const isActive = pathname === '/';
                    const isExpanded = expandedAxes['social'];
                    const c = colorMap['brand-blue'];

                    return (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center w-full">
                                <Link
                                    href="/"
                                    data-tour="sidebar-eixo-comunidade"
                                    onClick={() => {
                                        trackEvent('TAB_CHANGE', { tab: 'Social', href: '/' });
                                        setExpandedAxes(prev => ({ ...prev, social: true }));
                                    }}
                                    className={`flex items-center flex-1 ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-3.5 px-4'} py-2.5 transition-all group border-l-[3px] rounded-r-xl ${isActive
                                        ? `${c.bg} ${c.text} ${c.border}`
                                        : `border-l-transparent ${c.hoverBorder} text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white`
                                    }`}
                                >
                                    <span className={`transition-transform group-hover:scale-110 ${isActive ? c.text : ''}`}>
                                        <span className="material-symbols-outlined text-2xl">groups</span>
                                    </span>
                                    {!isSidebarCollapsed && (
                                        <span className={`font-bold text-sm ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                                            Social
                                        </span>
                                    )}
                                </Link>
                                {!isSidebarCollapsed && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleAxis('social');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all mr-1 cursor-pointer"
                                        title={isExpanded ? "Recolher sub-itens" : "Expandir sub-itens"}
                                        aria-label="Expandir ou recolher sub-itens"
                                    >
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-blue' : ''}`} />
                                    </button>
                                )}
                            </div>

                            {/* Sub-tree branches */}
                            {!isSidebarCollapsed && isExpanded && (
                                <div className="border-l border-white/10 ml-6 pl-2.5 space-y-1 my-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {socialTreeItems.map(renderTreeSubItem)}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* 2. Eixo Informativo */}
                {(() => {
                    const isActive = pathname.startsWith('/gcif') || pathname.startsWith('/wiki');
                    const isExpanded = expandedAxes['informativo'];
                    const c = colorMap['brand-red'];

                    return (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center w-full">
                                <Link
                                    href="/gcif"
                                    data-tour="sidebar-eixo-cgif"
                                    onClick={() => {
                                        trackEvent('TAB_CHANGE', { tab: 'Informativo', href: '/gcif' });
                                        setExpandedAxes(prev => ({ ...prev, informativo: true }));
                                    }}
                                    className={`flex items-center flex-1 ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-3.5 px-4'} py-2.5 transition-all group border-l-[3px] rounded-r-xl ${isActive
                                        ? `${c.bg} ${c.text} ${c.border}`
                                        : `border-l-transparent ${c.hoverBorder} text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white`
                                    }`}
                                >
                                    <span className={`transition-transform group-hover:scale-110 ${isActive ? c.text : ''}`}>
                                        <ColisorIcon className="w-6 h-6" />
                                    </span>
                                    {!isSidebarCollapsed && (
                                        <span className={`font-bold text-sm ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                                            Informativo
                                        </span>
                                    )}
                                </Link>
                                {!isSidebarCollapsed && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleAxis('informativo');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all mr-1 cursor-pointer"
                                        title={isExpanded ? "Recolher sub-itens" : "Expandir sub-itens"}
                                        aria-label="Expandir ou recolher sub-itens"
                                    >
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-red' : ''}`} />
                                    </button>
                                )}
                            </div>

                            {/* Sub-tree branches */}
                            {!isSidebarCollapsed && isExpanded && (
                                <div className="border-l border-white/10 ml-6 pl-2.5 space-y-1 my-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {informativoTreeItems.map(renderTreeSubItem)}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* 3. 3º Eixo Dinâmico (Ferramentas Acadêmicas / Como Ingressar / Observatório) */}
                {(() => {
                    const isActive = pathname === sidebarThirdAxis.href || (sidebarThirdAxis.href !== '/' && pathname.startsWith(sidebarThirdAxis.href)) || (sidebarThirdAxis.href === '/ingresso' && pathname.startsWith('/iniciativas'));
                    const isExpanded = expandedAxes['thirdAxis'];
                    const c = colorMap[sidebarThirdAxis.color] || colorMap['brand-yellow'];

                    return (
                        <div className="flex flex-col w-full">
                            <div className="flex items-center w-full">
                                <Link
                                    key={sidebarThirdAxis.href}
                                    href={sidebarThirdAxis.href}
                                    data-tour={sidebarThirdAxis.dataTour}
                                    onClick={() => {
                                        trackEvent('TAB_CHANGE', { tab: sidebarThirdAxis.name, href: sidebarThirdAxis.href });
                                        setExpandedAxes(prev => ({ ...prev, thirdAxis: true }));
                                    }}
                                    className={`flex items-center flex-1 ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-3.5 px-4'} py-2.5 transition-all group border-l-[3px] rounded-r-xl ${isActive
                                        ? `${c.bg} ${c.text} ${c.border}`
                                        : `border-l-transparent ${c.hoverBorder} text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white`
                                    }`}
                                >
                                    <span className={`transition-transform group-hover:scale-110 ${isActive ? c.text : ''}`}>
                                        <span className="material-symbols-outlined text-2xl">
                                            {sidebarThirdAxis.iconName === 'capelo' ? 'school' : sidebarThirdAxis.iconName}
                                        </span>
                                    </span>
                                    {!isSidebarCollapsed && (
                                        <span className={`font-bold text-sm ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                                            {sidebarThirdAxis.name}
                                        </span>
                                    )}
                                </Link>
                                {!isSidebarCollapsed && (
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleAxis('thirdAxis');
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all mr-1 cursor-pointer"
                                        title={isExpanded ? "Recolher sub-itens" : "Expandir sub-itens"}
                                        aria-label="Expandir ou recolher sub-itens"
                                    >
                                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-brand-yellow' : ''}`} />
                                    </button>
                                )}
                            </div>

                            {/* Sub-tree branches */}
                            {!isSidebarCollapsed && isExpanded && (
                                <div className="border-l border-white/10 ml-6 pl-2.5 space-y-1 my-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                    {thirdAxisSubItems.map((sub, sIdx) => (
                                        <React.Fragment key={sub.href}>
                                            {sub.group && (sIdx === 0 || thirdAxisSubItems[sIdx - 1]?.group !== sub.group) && (
                                                <div className="pt-2 pb-0.5 px-2 text-[9px] font-black uppercase text-gray-500 tracking-wider">
                                                    {sub.group}
                                                </div>
                                            )}
                                            {renderTreeSubItem(sub)}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Loading Skeleton if role is still being determined */}
                {isRoleLoading && (
                    <div className={`flex flex-col gap-1 mt-1 ${isSidebarCollapsed ? 'px-0' : 'px-4'}`}>
                        <div className={`${isSidebarCollapsed ? 'h-10 w-10' : 'h-10 w-full'} bg-gray-200 dark:bg-white/5 rounded-xl animate-pulse`} />
                    </div>
                )}

                <div className={`h-px bg-gray-100 dark:bg-white/5 my-2 ${isSidebarCollapsed ? 'mx-0 w-8' : 'mx-4'}`} />
            </nav>

            {/* Interaction Section */}
            <div className={`mt-4 flex flex-col gap-1 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                <Link
                    href="/interacao?tab=emaranhamento"
                    data-tour="sidebar-interacoes"
                    onClick={() => trackEvent('TAB_CHANGE', { tab: 'Central de Interações', hub: 'sidebar' })}
                    className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-4 px-6'} py-3 transition-all group border-l-[3px] rounded-r-xl ${pathname.startsWith('/interacao') 
                        ? 'bg-brand-blue/10 text-brand-blue border-l-brand-blue' 
                        : 'border-l-transparent hover:border-l-brand-blue text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
                >
                    <span className={`material-symbols-outlined text-2xl group-hover:scale-110 transition-transform ${pathname.startsWith('/interacao') ? 'text-brand-blue' : ''}`}>hub</span>
                    {!isSidebarCollapsed && (
                        <div className="flex flex-col overflow-hidden">
                            <span className={`font-bold text-sm ${pathname.startsWith('/interacao') ? 'text-gray-900 dark:text-white' : ''}`}>Central de Interações</span>
                            <span className="text-[9px] opacity-60 uppercase tracking-wider font-bold truncate">Nexus de Conexões</span>
                        </div>
                    )}
                </Link>

                {/* Quick Access Buttons */}
                {!isSidebarCollapsed && (
                    <div className="px-6 my-2">
                        <div className="grid grid-cols-2 gap-2">
                            <Link
                                href="/lab"
                                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/5 hover:border-brand-blue/30 transition-all text-center group shadow-sm dark:shadow-none"
                            >
                                <span className="material-symbols-outlined text-lg text-brand-blue mb-1">person</span>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white">Laboratório</span>
                            </Link>
                            <Link
                                href="/perguntas"
                                className="flex flex-col items-center justify-center p-2 rounded-xl bg-white dark:bg-white/5 border border-gray-300 dark:border-white/5 hover:border-brand-blue/30 transition-all text-center group shadow-sm dark:shadow-none"
                            >
                                <span className="material-symbols-outlined text-lg text-brand-blue mb-1">quiz</span>
                                <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white">Pergunte</span>
                            </Link>
                        </div>
                    </div>
                )}

                <div className={`flex flex-col mt-2 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                    <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ${isSidebarCollapsed ? 'hidden' : 'px-5'}`}>Partículas Emaranhadas</h2>
                    <div className="space-y-1">
                        {isLoading && recentEntanglements.length === 0 ? (
                            // Robust Profile Skeleton as requested by user
                            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-3 px-6'} py-3 animate-pulse`}>
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 shrink-0" />
                                {!isSidebarCollapsed && (
                                    <div className="flex flex-col gap-2 flex-1 overflow-hidden">
                                        <div className="h-3 w-3/4 bg-gray-200 dark:bg-white/5 rounded-full" />
                                        <div className="h-2 w-1/2 bg-gray-100 dark:bg-white/5 rounded-full opacity-60" />
                                    </div>
                                )}
                            </div>
                        ) : recentEntanglements.length > 0 ? (
                            <>
                                {recentEntanglements.map((profile) => (
                                    <Link
                                        key={profile.id}
                                        href={`/emaranhamento?userId=${profile.id}`}
                                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-3 px-6'} py-2 transition-all group relative border-l-[3px] border-l-transparent rounded-r-xl hover:border-white/5 ${pathname === '/emaranhamento' && userId === profile.id ? 'bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                    >
                                        <Avatar
                                            src={profile.avatar}
                                            name={profile.name}
                                            size="md"
                                            className="border border-white/10 shrink-0"
                                            xp={profile.xp}
                                            level={profile.level}
                                        />
                                        <div className={`absolute ${isSidebarCollapsed ? 'bottom-2 right-2' : 'bottom-2 left-12'} size-3 bg-brand-blue border-2 border-white dark:border-[#121212] rounded-full`} />
                                        {!isSidebarCollapsed && (
                                            <div className="flex flex-col overflow-hidden min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-xs font-bold text-gray-900 dark:text-white truncate">{profile.name}</span>
                                                    {profile.lastAt && (
                                                        <span className="text-[8px] text-gray-500 font-bold shrink-0">
                                                            {new Date(profile.lastAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    )}
                                                </div>
                                                {profile.lastMessage && (
                                                    <span className="text-[10px] text-gray-400 font-medium truncate italic opacity-80 group-hover:opacity-100">
                                                        {profile.lastMessage}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </Link>
                                ))}
                                {!isSidebarCollapsed && (
                                    <Link href="/emaranhamento" className="mx-6 mt-3 flex items-center justify-center gap-2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-brand-blue/10 text-gray-500 hover:text-brand-blue transition-colors text-xs font-bold">
                                        <span className="material-symbols-outlined text-[16px]">forum</span>
                                        Ir para o Emaranhamento
                                    </Link>
                                )}
                            </>
                        ) : isAdult ? (
                            <Link href="/emaranhamento" className={`mx-auto flex flex-col items-center gap-1.5 ${isSidebarCollapsed ? 'w-12 h-12 justify-center border-0 p-0' : 'mx-5 px-4 py-4 border border-dashed border-gray-300 dark:border-white/10 rounded-2xl'} hover:border-brand-blue/40 hover:bg-brand-blue/5 transition-all text-center cursor-pointer group`}>
                                <MessageSquare className={`w-4 h-4 text-gray-400 group-hover:text-brand-blue transition-colors ${isSidebarCollapsed ? 'w-5 h-5' : ''}`} />
                                {!isSidebarCollapsed && (
                                    <>
                                        <span className="text-[10px] font-bold text-gray-500 group-hover:text-gray-300 uppercase tracking-widest transition-colors">Sem conexões ativas</span>
                                        <span className="text-[10px] text-brand-blue font-medium opacity-70 group-hover:opacity-100 transition-opacity">Iniciar emaranhamento →</span>
                                    </>
                                )}
                            </Link>
                        ) : (
                            <div className={`mx-auto flex flex-col items-center gap-1.5 ${isSidebarCollapsed ? 'w-12 h-12 justify-center border-0 p-0' : 'mx-5 px-4 py-4 border border-dashed border-gray-200 dark:border-white/5 rounded-2xl'} opacity-50`}>
                                <MessageSquare className={`w-4 h-4 text-gray-400 ${isSidebarCollapsed ? 'w-5 h-5' : ''}`} />
                                {!isSidebarCollapsed && (
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center leading-tight">Conexão Pública Desativada</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Suporte e Dúvidas */}
            <div className={`mt-auto mb-2 flex flex-col pt-4 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 ${isSidebarCollapsed ? 'hidden' : 'px-5'}`}>Suporte do hub</h2>
                <div className="flex flex-col gap-1">
                    <a href="https://wa.me/5511968401823" target="_blank" rel="noopener noreferrer" className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-4 px-6'} py-3 text-sm text-gray-500 hover:bg-brand-yellow/10 hover:text-[#FFCC00] transition-colors group border-l-[3px] border-l-transparent rounded-r-xl`}>
                        <MessageCircle className="w-5 h-5 opacity-60 group-hover:opacity-100 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold">WhatsApp Direto</span>}
                    </a>
                    <a href="mailto:joaopaulostangorlini@usp.br" className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-4 px-6'} py-3 text-sm text-gray-500 hover:bg-brand-red/10 hover:text-brand-red transition-colors group border-l-[3px] border-l-transparent rounded-r-xl`}>
                        <MessageSquare className="w-5 h-5 opacity-60 group-hover:opacity-100 shrink-0" />
                        {!isSidebarCollapsed && <span className="font-bold">Enviar e-mail</span>}
                    </a>
                </div>
            </div>

            {/* Secondary/Institutional Links */}
            <nav className={`border-t border-gray-100 dark:border-gray-800 pt-6 flex flex-col gap-1 relative z-20 ${isSidebarCollapsed ? 'items-center' : ''}`}>
                {secondaryLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-12 h-12 px-0' : 'gap-4 px-6'} py-3 text-sm text-gray-500 hover:text-brand-blue transition-colors group border-l-[3px] border-l-transparent rounded-r-xl`}
                    >
                        <span className="opacity-60 group-hover:opacity-100 shrink-0">
                            {link.icon}
                        </span>
                        {!isSidebarCollapsed && <span className="font-medium">{link.name}</span>}
                    </Link>
                ))}
            </nav>
        </div>
    );
}

export const SidebarLeft = ({ userId }: { userId?: string }) => {
    return (
        <Suspense fallback={null}>
            <SidebarLeftInner userId={userId} />
        </Suspense>
    );
};
