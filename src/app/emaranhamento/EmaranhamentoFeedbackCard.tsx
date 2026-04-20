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

export const EmaranhamentoFeedbackCard = ({ className }: { className?: string }) => {
    const { setReportModalOpen } = useNavigationStore();

    return (
        <ContextFeedbackCard
            title="Emaranhamento"
            description="Onde a física individual se torna inteligência coletiva. Aqui você constrói sua rede de contatos no Instituto. Navegue pelo diretório para encontrar alunos, professores e técnicos com interesses similares, e crie grupos de estudo para sobreviver às disciplinas complexas ou debater tópicos avançados de pesquisa. Forme equipes e fortaleça as conexões no campus. A rede de Emaranhamento (Beta) une a nossa comunidade. Qual funcionalidade facilitaria ainda mais seus encontros acadêmicos? Nos conte!"
            betaTag={true}
            onFeedbackClick={() => setReportModalOpen(true, 'sugestao')}
            className={className}
        />
    );
};
