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


import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AcervoManager } from './moderacao/AcervoManager';
import { SubmissionsManager } from './moderacao/SubmissionsManager';
import { CommentsManager } from './moderacao/CommentsManager';
import { CorrectionsManager } from './moderacao/CorrectionsManager';
import { NarrationManager } from './moderacao/NarrationManager';

type ModerationTab = 'acervo' | 'submissoes' | 'arte' | 'comentarios' | 'correcoes' | 'narracao';

export function AdminModerationClient({ mode = 'fluxo' }: { mode?: 'fluxo' | 'arte' }) {
    const searchParams = useSearchParams();
    const initialTab = mode === 'arte' ? 'arte' : ((searchParams.get('tab') as ModerationTab) || 'submissoes');
    const [activeTab, setActiveTab] = useState<ModerationTab>(initialTab);

    const tabs = mode === 'arte' ? [
        { id: 'arte', label: 'Aprovação de Arte', icon: 'palette' }
    ] : [
        { id: 'submissoes', label: 'Submissões', icon: 'assignment' },
        { id: 'acervo', label: 'Acervo Hub', icon: 'collections_bookmark' },
        { id: 'comentarios', label: 'Comentários', icon: 'chat_bubble' },
        { id: 'narracao', label: 'Narração & TTS', icon: 'record_voice_over' },
        { id: 'correcoes', label: 'Peer Review', icon: 'spellcheck' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto min-h-screen pb-20">
            <header className="mb-12">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${mode === 'arte' ? 'bg-brand-red/10 border-brand-red/20 text-brand-red' : 'bg-brand-blue/10 border-brand-blue/20 text-brand-blue'} text-[10px] font-black uppercase tracking-widest mb-4`}>
                    <span className="material-symbols-outlined text-sm">verified_user</span>
                    Torre de Moderação
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    Moderação {mode === 'arte' ? 'de ' : 'do '}
                    <span className={mode === 'arte' ? 'text-brand-red' : 'text-brand-blue'}>
                        {mode === 'arte' ? 'Arte' : 'Fluxo'}
                    </span>
                </h1>
                <p className="text-gray-500 mt-4 text-sm font-medium max-w-2xl leading-relaxed">
                    {mode === 'arte' 
                        ? 'Central de controle para validação de expressões artísticas, desenhos, poesias e criatividade.'
                        : 'Central de controle para validação de conteúdo, gestão do acervo histórico e moderação da comunidade.'}
                </p>
            </header>

            {/* Custom Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] mb-12 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as ModerationTab)}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id
                                ? (mode === 'arte' ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' : 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20')
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeTab === 'acervo' && <AcervoManager />}
                {activeTab === 'submissoes' && <SubmissionsManager excludeCategory="Arte" />}
                {activeTab === 'arte' && <SubmissionsManager categoryFilter="Arte" />}
                {activeTab === 'comentarios' && <CommentsManager />}
                {activeTab === 'correcoes' && <CorrectionsManager />}
                {activeTab === 'narracao' && <NarrationManager />}
            </section>
        </div>
    );
}
