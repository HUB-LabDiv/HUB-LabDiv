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

export const FluxoFeedbackCard = ({ 
    className,
    title = "Aba comunidade",
    description = "Está é a aba onde dividida em fluxo/logs/arte você pode interagir e aprender com a comunidade do instituto sobre a ciencia e quem a faz. Alguma sugestão de como o HUB pode melhorar nisso?",
    icon = <span className="material-symbols-outlined text-2xl text-brand-blue font-bold">grain</span>
}: { 
    className?: string;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}) => {
    const { setReportModalOpen } = useNavigationStore();

    return (
        <ContextFeedbackCard
            title={title}
            icon={icon}
            description={description}
            betaTag={true}
            onFeedbackClick={() => setReportModalOpen(true, 'sugestao')}
            className={className}
        />
    );
};
