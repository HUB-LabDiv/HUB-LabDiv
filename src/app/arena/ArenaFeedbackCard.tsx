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

export const ArenaFeedbackCard = ({ className }: { className?: string }) => {
    const { setReportModalOpen } = useNavigationStore();

    return (
        <ContextFeedbackCard
            title="Aba Observatório de Pesquisa"
            description="O radar da vanguarda científica do IFUSP. Aqui você acompanha a produção de excelência dos nossos laboratórios. Descubra grupos de pesquisa ativos, leia seus papers recém-publicados e encontre as oportunidades ideais para iniciar sua carreira acadêmica na Iniciação Científica ou no Mestrado. Conecte-se com a ciência de ponta feita no Instituto. O Observatório (Beta) é a sua ponte para os orientadores. Como podemos facilitar sua busca por projetos de pesquisa? Nos conte!"
            betaTag={true}
            onFeedbackClick={() => setReportModalOpen(true, 'sugestao')}
            className={className}
        />
    );
};
