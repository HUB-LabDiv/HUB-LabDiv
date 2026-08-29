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
import { MessageSquareCode, Plus, ChevronDown } from 'lucide-react';
import { SacModal } from './SacModal';
import { getApprovedFAQs } from '@/app/actions/sac';

export function SacSection() {
    const [sacFaqs, setSacFaqs] = useState<any[]>([]);
    const [isSacModalOpen, setIsSacModalOpen] = useState(false);
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    useEffect(() => {
        const loadFaqs = async () => {
            const res = await getApprovedFAQs();
            if (res.success) {
                setSacFaqs(res.data || []);
            }
        };
        loadFaqs();
    }, []);

    return (
        <div id="sac-section" data-tour="cgif-section-sac" className="mt-24 mb-16 scroll-mt-32 w-full">
            <div className="flex flex-col md:flex-row gap-8 items-start justify-between mb-8">
                <div>
                    <h2 className="text-4xl font-black italic text-gray-900 dark:text-white uppercase tracking-tighter flex items-center gap-3">
                        <MessageSquareCode className="w-10 h-10 text-brand-blue" />
                        SAC <span className="text-brand-red">LabDiv</span>
                    </h2>
                    <p className="text-gray-500 text-lg font-medium mt-2 [text-shadow:var(--text-halo-strong)]">Dúvidas frequentes sobre o HUB e a Secão de Alunos.</p>
                </div>
                <button
                    onClick={() => setIsSacModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 bg-white/5 text-brand-red rounded-full font-black text-xs uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all shrink-0 border border-brand-red/20"
                >
                    <Plus className="w-4 h-4" />
                    Não achei minha dúvida
                </button>
            </div>

            <div className="space-y-4">
                {sacFaqs.length > 0 ? (
                    sacFaqs.map(faq => (
                        <div key={faq.id} className="border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden bg-gray-50 dark:bg-white/5">
                            <button
                                onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-background-dark/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
                            >
                                <span className="font-bold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-widest">{faq.pergunta}</span>
                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaqId === faq.id ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaqId === faq.id ? 'max-h-[500px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="pt-4 border-t border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                                    {faq.resposta || 'Resposta pendente...'}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-12 text-gray-500 text-sm uppercase tracking-widest font-bold bg-white/5 rounded-3xl border border-white/5">
                        Ainda não há dúvidas cadastradas.
                    </div>
                )}
            </div>

            <SacModal isOpen={isSacModalOpen} onClose={() => setIsSacModalOpen(false)} />
        </div>
    );
}
