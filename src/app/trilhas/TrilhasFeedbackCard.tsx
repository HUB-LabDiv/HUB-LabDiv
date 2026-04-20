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

export function TrilhasFeedbackCard({ className }: { className?: string }) {
    const setReportModalOpen = useNavigationStore(state => state.setReportModalOpen);
    
    return (
        <ContextFeedbackCard
            title="Trilhas de Aprendizado"
            description="Seu mapa de navegação acadêmica e profissional. Aqui você visualiza de forma clara a estrutura do seu curso. Explore a Árvore Curricular para entender o Ciclo Básico e descobrir os caminhos optativos (Ensino, Quântica, Médica, etc.), utilizando guias curados para planejar suas matrículas. Planeje seus próximos passos no Instituto com segurança. As Trilhas (Beta) guiam o seu futuro. Qual área de especialização deveríamos mapear com mais detalhes para você? Nos conte!"
            betaTag={true}
            onFeedbackClick={() => setReportModalOpen(true, 'sugestao')}
            className={className}
        />
    );
}
