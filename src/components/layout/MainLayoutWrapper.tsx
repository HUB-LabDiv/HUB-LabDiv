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
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { m } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { SidebarLeft } from './SidebarLeft';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useAuth } from '@/providers/AuthProvider';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { EixoInformacaoDisclaimerBanner } from './EixoInformacaoDisclaimerBanner';
import { PullToRefreshWrapper } from '@/components/ui/PullToRefreshWrapper';
import { GlobalButtonEffects } from '@/components/ui/GlobalButtonEffects';
import { HubInitiativeBackdrop } from './HubInitiativeBackdrop';

const ContentReportModal = dynamic(
    () => import('../modals/ContentReportModal').then((mod) => mod.ContentReportModal),
    { ssr: false }
);
const ReportModal = dynamic(
    () => import('../feedback/ReportModal').then((mod) => mod.ReportModal),
    { ssr: false }
);
const HubWelcomeModal = dynamic(
    () => import('../onboarding/HubWelcomeModal').then((mod) => mod.HubWelcomeModal),
    { ssr: false }
);

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
export function MainLayoutWrapper({ children, focusMode = false, wide = true, fullWidth = false, userId, rightSidebar, hideHeader = false }: MainLayoutWrapperProps) {
    const pathname = usePathname();
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

    // Left Sidebar é oculta em < lg (1024px). Quando visível (lg+): 80px (recolhida) ou 280px (expandida)
    const leftPaddingClass = isSidebarCollapsed 
        ? 'lg:pl-[calc(80px+1.5rem)]' 
        : 'lg:pl-[calc(280px+1.5rem)]';

    // Right Sidebar é oculta em < lg (1024px). Quando presente e visível (lg+): 80px (recolhida) ou 320px (expandida)
    const rightPaddingClass = rightSidebar 
        ? (isRightSidebarCollapsed ? 'lg:pr-[calc(80px+1.5rem)]' : 'lg:pr-[calc(320px+1.5rem)]') 
        : '';

    return (
        <div className="min-h-screen bg-transparent font-sans text-gray-900 dark:text-gray-100 flex flex-col overflow-x-clip relative">
            <GlobalButtonEffects />
            <HubInitiativeBackdrop />
            {!hideHeader && <Header />}

            {!focusMode ? (
                <div className="flex-1 w-full flex relative">
                    {/* Left Sidebar — fixada na borda esquerda do viewport */}
                    <aside
                        className={`hidden lg:flex flex-col fixed left-0 top-20 ${isSidebarCollapsed ? 'w-20' : 'w-[280px]'} h-[calc(100vh-5rem)] border-r border-gray-200 dark:border-gray-800 bg-transparent overflow-y-auto hidden-scrollbar transition-all duration-300 z-30`}
                    >
                        <SidebarLeft userId={userId} />
                    </aside>

                    {/* Right Sidebar — fixada na borda direita do viewport apenas se rightSidebar for fornecido */}
                    {Boolean(rightSidebar) && (
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
                    )}

                    {/* Content Area — com padding lateral responsivo CSS para não sobrepor sidebars */}
                    <div className="flex-1 w-full flex flex-col">
                        <PullToRefreshWrapper>
                            <main
                                className={`flex-1 min-w-0 w-full pt-20 pb-28 xl:pb-12 transition-all duration-300 px-4 sm:px-6 ${leftPaddingClass} ${rightPaddingClass}`}
                                style={{
                                    paddingTop: 'calc(5rem + env(safe-area-inset-top, 0px))',
                                    paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))'
                                }}
                            >
                                <div className="w-full flex flex-col min-h-full">
                                    <EixoInformacaoDisclaimerBanner />
                                    <m.div
                                        key={pathname}
                                        initial={{ opacity: 0.4, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.14, ease: 'easeOut' }}
                                        className="flex-1 w-full"
                                    >
                                        {children}
                                    </m.div>
                                    <Footer />
                                </div>
                            </main>
                        </PullToRefreshWrapper>
                    </div>
                </div>
            ) : (
                <div className="flex-1 w-full flex flex-col">
                    <PullToRefreshWrapper>
                        <main 
                            className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-28 xl:pb-12"
                            style={{
                                paddingTop: 'calc(6rem + env(safe-area-inset-top, 0px))',
                                paddingBottom: 'calc(6.5rem + env(safe-area-inset-bottom, 0px))'
                            }}
                        >
                            <div className="w-full flex flex-col min-h-full">
                                <EixoInformacaoDisclaimerBanner />
                                <m.div
                                    key={pathname}
                                    initial={{ opacity: 0.4, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.14, ease: 'easeOut' }}
                                    className="flex-1 w-full"
                                >
                                    {children}
                                </m.div>
                            </div>
                        </main>
                    </PullToRefreshWrapper>
                </div>
            )}

            <BottomNavBar />
            <HubWelcomeModal />

            {/* Modais Globais */}
            <ContentReportModal />
            <ReportModal 
                isOpen={isReportModalOpen} 
                onClose={() => setReportModalOpen(false)} 
            />
        </div>
    );
}
