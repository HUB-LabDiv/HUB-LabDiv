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

    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="py-8 max-w-7xl mx-auto px-4">
                <header className="mb-8">
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

                {/* Custom Premium Tabs */}
                <div className="flex gap-2 p-1 bg-white dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none rounded-[20px] mb-12 w-fit overflow-x-auto scrollbar-hide max-w-full">
                    {[
                        { id: 'emaranhamento', label: 'Emaranhamento', icon: 'hub' },
                        { id: 'lab', label: 'Laboratório Pessoal', icon: 'science' },
                        { id: 'perguntas', label: 'Pergunte a um Cientista', icon: 'quiz' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            className={`flex items-center gap-3 px-6 py-3 rounded-[16px] text-[10px] font-black tracking-[0.15em] transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            {tab.label.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" /></div>}>
                        {activeTab === 'lab' && <LabTabContent />}
                        {activeTab === 'perguntas' && <PerguntasTabContent />}
                        {activeTab === 'emaranhamento' && <EmaranhamentoTabContent />}
                    </Suspense>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
