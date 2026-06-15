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


import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

// Diagrammer
import { DiagrammerLayout } from './components/DiagrammerLayout';
import { ReportModal } from '@/components/feedback/ReportModal';
import { useNavigationStore } from '@/store/useNavigationStore';
import Link from 'next/link';

import { useAuth } from '@/providers/AuthProvider';

export default function SubmitPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { currentStep, reset, previewMode, setPreviewMode } = useSubmissionStore();
    const { isReportModalOpen, setReportModalOpen } = useNavigationStore();
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isInitializing) {
                console.warn('Submission initialization timeout');
                setIsInitializing(false);
            }
        }, 5000);

        if (!authLoading) {
            if (!user) {
                router.push('/lab');
                return;
            }
            setIsInitializing(false);
            clearTimeout(timeout);
        }

        return () => clearTimeout(timeout);
    }, [authLoading, user, router, isInitializing]);

    if (authLoading || isInitializing) {
        return (
            <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Iniciando plataforma de submissão...</p>
                </div>
            </div>
        );
    }

    return (
        <MainLayoutWrapper focusMode={true}>
            <div className="relative min-h-screen font-sans text-gray-900 dark:text-gray-100 overflow-x-hidden">
                {/* Background Decorative Elements */}
                <div className="fixed inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:32px_32px] opacity-30 -z-20"></div>

                {/* Custom Submit Header */}
                <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/60 dark:bg-background-dark/60 border-b border-gray-200/50 dark:border-gray-800/50">
                    <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-20 flex items-center justify-between">
                        <Link href="/lab" className="flex items-center gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-brand-blue">arrow_back</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="text-lg font-[900] tracking-tighter uppercase flex items-center gap-0.5">
                                    <span className="text-gray-900 dark:text-white">HUB</span>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-brand-blue to-brand-yellow">LAB-DIV</span>
                                </div>
                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Instituto de Física</span>
                            </div>
                        </Link>

                        <div className="flex items-center gap-6">
                            {/* Seletor de Preview */}
                            <div className="hidden lg:flex bg-gray-900/50 p-1 rounded-xl border border-gray-800">
                                <button 
                                    onClick={() => setPreviewMode('edit')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${previewMode === 'edit' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Edição
                                </button>
                                <button 
                                    onClick={() => setPreviewMode('preview')}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${previewMode === 'preview' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    Preview
                                </button>
                            </div>

                            <button
                                onClick={() => setReportModalOpen(true)}
                                className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red/10 text-brand-red hover:bg-brand-red/20 transition-all border border-brand-red/20 group"
                                title="Reportar Erro / Feedback"
                            >
                                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">report</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="relative pt-32 pb-24 z-10">
                    <div className="max-w-[1400px] mx-auto px-4">
                        {/* Removido o Wizard antigo e incluído o Diagramador */}
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key="diagrammer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <DiagrammerLayout />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
            <ReportModal
                isOpen={isReportModalOpen}
                onClose={() => setReportModalOpen(false)}
            />
        </MainLayoutWrapper>
    );
}


