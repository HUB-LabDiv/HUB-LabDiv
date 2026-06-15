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

                <main className="relative pt-8 pb-24 z-10">
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


