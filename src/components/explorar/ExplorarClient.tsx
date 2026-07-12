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
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { motion } from 'framer-motion';
import { GrandeColisorView } from './GrandeColisorView';
import { ColisorFeedbackCard } from '@/app/colisor/ColisorFeedbackCard';
import { FluxoFeedbackCard } from '@/components/feedback/FluxoFeedbackCard';
import { Atom } from 'lucide-react';

interface ExplorarClientProps {
    mapItems: any[];
    oportunidades: any[];
    glossario: any[];
}

export function ExplorarClient({ mapItems, oportunidades, glossario }: ExplorarClientProps) {
    return (
        <MainLayoutWrapper 
            rightSidebar={<ColisorFeedbackCard />}
            fullWidth={true}
        >
            <div className="min-h-screen py-6 px-4 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="max-w-4xl mx-auto mb-12">
                        <FluxoFeedbackCard 
                            title="Aba GCIF - Grande Colisor do IF" 
                            description="Esta é a aba onde ficam reunidas todo tipo de informações sobre o instituto de física da USP." 
                            icon={<Atom className="w-5 h-5 text-brand-blue" />}
                        />
                    </div>

                    <GrandeColisorView 
                        oportunidades={oportunidades} 
                        mapItems={mapItems} 
                        glossario={glossario}
                    />
                </motion.div>
            </div>
        </MainLayoutWrapper>
    );
}
