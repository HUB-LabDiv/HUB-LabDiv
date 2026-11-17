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


import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { LabTabContent } from './LabTabContent';
import { PerguntasTabContent } from './PerguntasTabContent';
import { EmaranhamentoTabContent } from './EmaranhamentoTabContent';
import { useSwipe } from '@/hooks/useSwipe';
import { SegmentedPillSwitch } from '@/components/ui/SegmentedPillSwitch';

export default function InteracaoClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'emaranhamento';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && (tab === 'emaranhamento' || tab === 'perguntas') && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams, activeTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.replace(`/interacao?tab=${tab}`, { scroll: false });
    };

    const tabs = ['emaranhamento', 'perguntas'];
    const swipeHandlers = useSwipe({
        onSwipedLeft: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
                handleTabChange(tabs[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
                handleTabChange(tabs[currentIndex - 1]);
            }
        },
        minDistance: 40,
        wheelThreshold: 75
    });

    const tabConfig = [
        { id: 'emaranhamento', label: 'Emaranhamento', icon: 'hub' },
        { id: 'perguntas', label: 'Pergunte a um Cientista', icon: 'quiz' },
    ];

    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-[calc(100vh-80px)] flex flex-col flex-1 pb-16" {...swipeHandlers}>
                {/* Top Navigation Pill Bar */}
                <div 
                    className="sticky z-40 flex justify-center mb-6 pointer-events-none"
                    style={{ top: 'calc(4.5rem + env(safe-area-inset-top, 0px))' }}
                >
                    <SegmentedPillSwitch
                        dataTour="interacao-subnav"
                        layoutId="activeTabInteracao"
                        activeId={activeTab}
                        onChange={(tab) => handleTabChange(tab)}
                        options={tabConfig.map((tab) => ({
                            id: tab.id,
                            label: tab.label,
                            icon: (
                                <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">
                                    {tab.icon}
                                </span>
                            ),
                            activeBgClass: 'bg-[#1F9FCF] shadow-lg shadow-[#1F9FCF]/25',
                            hoverTextClass: 'hover:text-[#1F9FCF]',
                        }))}
                    />
                </div>

                <header className="mb-12 pt-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-sm">hub</span>
                        Central de Colaboração
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black font-bukra text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                        Central de <span className="text-brand-blue">Interações</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm font-medium max-w-2xl leading-relaxed">
                        Pesquisa pessoal, conexão neural entre membros e canal direto com a equipe científica do Instituto de Física.
                    </p>
                </header>

                <div data-tour="interacao-content" className="flex-1 w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>}>
                                {activeTab === 'perguntas' && <PerguntasTabContent />}
                                {activeTab === 'emaranhamento' && <EmaranhamentoTabContent />}
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
