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
import { ContextFeedbackCard } from '@/components/ui/ContextFeedbackCard';
import { useNavigationStore } from '@/store/useNavigationStore';

export function MapaFeedbackCard({ className }: { className?: string }) {
    const setReportModalOpen = useNavigationStore(state => state.setReportModalOpen);
    
    return (
        <ContextFeedbackCard
            title="Aba Mapa"
            description={'A ponte entre o Hub e o mundo real. O Mapa conecta os espaços físicos do IFUSP ao digital: no futuro, navegue pelos laboratórios do instituto e utilize QR codes espalhados pelo campus para escanear e descobrir instantaneamente o que é produzido em cada local. Transforme sua caminhada pelo IF em uma jornada de descoberta científica. O mapeamento (Beta) está em expansão. Qual laboratório você quer ver mapeado com prioridade? Nos conte!'}
            betaTag={true}
            onFeedbackClick={() => setReportModalOpen(true, 'sugestao')}
            className={className}
        />
    );
}
