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
import { useSearchParams } from 'next/navigation';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { LabTabContent } from './LabTabContent';
import { PerguntasTabContent } from './PerguntasTabContent';
import { EmaranhamentoTabContent } from './EmaranhamentoTabContent';
import { FluxoFeedbackCard } from '@/components/feedback/FluxoFeedbackCard';
import { Users, HelpCircle } from 'lucide-react';
import { useSwipe } from '@/hooks/useSwipe';

export default function InteracaoClient() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'emaranhamento';
    const [activeTab, setActiveTab ] = useState(initialTab);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams, activeTab]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        window.history.replaceState(null, '', `/interacao?tab=${tab}`);
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
        }
    });

    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="py-8 w-full px-4" {...swipeHandlers}>
                <div 
                    className="sticky -mt-5 z-40 flex justify-center mb-8 w-full pointer-events-none"
                    style={{ top: 'calc(76px + env(safe-area-inset-top, 0px))' }}
                >
                    <div className="flex gap-0.5 sm:gap-2 p-1 bg-white/90 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-lg rounded-[20px] w-fit overflow-hidden max-w-[calc(100vw-6rem)] pointer-events-auto">
                        {[
                            { id: 'emaranhamento', label: 'Emaranhamento', icon: 'hub' },
                            { id: 'perguntas', label: 'Pergunte a um Cientista', icon: 'quiz' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`flex items-center justify-center gap-1 sm:gap-3 px-1.5 py-1 sm:px-6 sm:py-3 rounded-[16px] text-[7px] sm:text-[10px] font-black tracking-[0.1em] transition-all whitespace-nowrap overflow-hidden text-ellipsis ${activeTab === tab.id
                                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[12px] sm:text-[18px] shrink-0">{tab.icon}</span>
                                <span className="truncate">{tab.label.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-4xl mb-8">
                    <FluxoFeedbackCard 
                        title={activeTab === 'emaranhamento' ? "Emaranhamento" : "Pergunte a um Cientista"} 
                        description={
                            activeTab === 'emaranhamento'
                                ? "Onde a física individual se torna inteligência coletiva. Aqui você constrói sua rede de contatos no Instituto, navega pelo diretório para encontrar alunos, professores e técnicos com interesses similares e cria grupos de estudo."
                                : "Sua linha direta com a ciência. Faça perguntas sobre física ou sobre a vida acadêmica e conte com a equipe do LabDiv e pesquisadores parceiros para responder."
                        } 
                        icon={activeTab === 'emaranhamento' ? <Users className="w-5 h-5 text-brand-blue" /> : <HelpCircle className="w-5 h-5 text-brand-blue" />}
                    />
                </div>

                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest mb-4">
                        <span className="material-symbols-outlined text-sm">hub</span>
                        Central de Colaboração
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                        Central de <span className="text-brand-blue">Interações</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 text-sm font-medium max-w-2xl leading-relaxed">
                        Pesquisa pessoal, conexão neural entre membros e canal direto com a equipe científica do Instituto de Física.
                    </p>
                </header>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>}>
                        {activeTab === 'perguntas' && <PerguntasTabContent />}
                        {activeTab === 'emaranhamento' && <EmaranhamentoTabContent />}
                    </Suspense>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
