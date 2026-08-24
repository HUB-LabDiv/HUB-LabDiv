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

interface ExplorarClientProps {
    mapItems: any[];
    oportunidades: any[];
    glossario: any[];
}

export function ExplorarClient({ mapItems, oportunidades, glossario }: ExplorarClientProps) {
    return (
        <MainLayoutWrapper 
            fullWidth={true}
        >
            <div className="min-h-screen py-6 px-4 max-w-7xl mx-auto overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
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
