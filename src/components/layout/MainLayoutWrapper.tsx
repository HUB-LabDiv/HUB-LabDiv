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


import React from 'react';
import Link from 'next/link';
import { Header } from './Header';
import { Footer } from './Footer';
import { SidebarLeft } from './SidebarLeft';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAuth } from '@/providers/AuthProvider';
import { ContentReportModal } from '../modals/ContentReportModal';
import { ReportModal } from '../feedback/ReportModal';

import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';

interface MainLayoutWrapperProps {
    children: React.ReactNode;
    focusMode?: boolean;
    wide?: boolean; // New prop for broader layouts
    fullWidth?: boolean; // New prop for edge-to-edge fluid layouts
    userId?: string;
    rightSidebar?: React.ReactNode;
    hideHeader?: boolean;
}

/**
 * Standardized structure for V4.0 Golden Master pages.
 * Ensures consistent padding, header, and footer mounting.
 */
export function MainLayoutWrapper({ children, focusMode = false, wide = false, fullWidth = false, userId, rightSidebar, hideHeader = false }: MainLayoutWrapperProps) {
    const { 
        isSidebarCollapsed, 
        isRightSidebarCollapsed, 
        setRightSidebarCollapsed,
        isReportModalOpen,
        setReportModalOpen
    } = useNavigationStore();
    const { profile } = useAuth();
    const { institution } = usePersonalizacaoStore();

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-institution', institution);
            if (document.body) {
                document.body.setAttribute('data-institution', institution);
            }
        }
    }, [institution]);

    const [windowWidth, setWindowWidth] = React.useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1280);

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Larguras das sidebars ativas apenas onde elas estão visíveis (Left: xl >= 1280px, Right: lg >= 1024px)
    const effectiveLeftWidth = windowWidth >= 1280 ? (isSidebarCollapsed ? 80 : 280) : 0;
    const effectiveRightWidth = windowWidth >= 1024 ? (isRightSidebarCollapsed ? 80 : 320) : 0;

    return (
        <div className="min-h-screen bg-transparent font-sans text-gray-900 dark:text-gray-100 flex flex-col overflow-x-clip">
            {!hideHeader && <Header />}

            {!focusMode ? (
                <div className="flex-1 w-full flex relative">
                    {/* Left Sidebar — fixada na borda esquerda do viewport */}
                    <aside
                        className={`hidden xl:flex flex-col fixed left-0 top-20 ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} h-[calc(100vh-5rem)] border-r border-gray-200 dark:border-gray-800 bg-transparent overflow-y-auto hidden-scrollbar transition-all duration-300 z-30`}
                    >
                        <SidebarLeft userId={userId} />
                    </aside>

                    {/* Right Sidebar — fixada na borda direita do viewport */}
                    <aside
                        className={`hidden lg:flex flex-col fixed right-0 top-20 ${isRightSidebarCollapsed ? 'w-20' : 'w-[320px]'} h-[calc(100vh-5rem)] border-l border-gray-200 dark:border-gray-800 bg-transparent overflow-y-auto hidden-scrollbar transition-all duration-300 z-30`}
                    >
                        <div className={`p-4 ${isRightSidebarCollapsed ? 'flex flex-col items-center' : 'lg:pt-8'}`}>
                            {/* Toggle Button for Right Sidebar */}
                            <div className={`flex items-center ${isRightSidebarCollapsed ? 'justify-center' : 'justify-start'} mb-4`}>
                                <button
                                    onClick={() => setRightSidebarCollapsed(!isRightSidebarCollapsed)}
                                    className="p-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-400 hover:text-brand-blue transition-all shadow-sm group"
                                    title={isRightSidebarCollapsed ? "Expandir" : "Recolher"}
                                >
                                    {isRightSidebarCollapsed ? <ChevronLeft size={16} className="group-hover:scale-110 transition-transform" /> : <ChevronRight size={16} className="group-hover:scale-110 transition-transform" />}
                                </button>
                            </div>

                            {!isRightSidebarCollapsed && (
                                <div className="py-2">
                                    {rightSidebar}
                                </div>
                            )}
                        </div>
                    </aside>

                    {/* Content Area — com padding lateral dinâmico para não sobrepor as sidebars */}
                    <main
                        className={`flex-1 min-w-0 w-full pt-20 pb-8 lg:pb-12 transition-all duration-300 px-4 sm:px-6`}
                        style={{
                            paddingLeft: effectiveLeftWidth > 0 ? `calc(${effectiveLeftWidth}px + 1.5rem)` : undefined,
                            paddingRight: effectiveRightWidth > 0 ? `calc(${effectiveRightWidth}px + 1.5rem)` : undefined,
                        }}
                    >
                        <div className={`mx-auto w-full ${fullWidth ? 'max-w-full' : wide ? 'max-w-[1400px]' : 'max-w-[800px]'}`}>
                            {children}
                        </div>
                    </main>
                </div>
            ) : (
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {children}
                </main>
            )}

            {!focusMode && <Footer />}
            <BottomNavBar />

            {/* Nova Submissão FAB (Desktop Only — xl+) */}
            {!focusMode && (profile?.is_adult === true || profile?.user_category === 'pesquisador' || profile?.user_category === 'docente_pesquisador') && (
                <Link
                    href="/enviar"
                    className="hidden xl:flex fixed bottom-8 right-8 z-[60] bg-brand-blue hover:bg-brand-blue-hover text-white px-6 h-14 rounded-full shadow-2xl items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all group border border-white/10"
                    title="Lançar à Órbita"
                >
                    <span className="material-symbols-outlined text-2xl group-hover:-translate-y-1 transition-transform">rocket_launch</span>
                    <span className="font-bold text-sm tracking-wide">Lançar à Órbita</span>
                </Link>
            )}

            {/* Modais Globais */}
            <ContentReportModal />
            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setReportModalOpen(false)} 
            />
        </div>
    );
}
