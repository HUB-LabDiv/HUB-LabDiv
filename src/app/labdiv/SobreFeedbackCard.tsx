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


import { ContextFeedbackCard } from "@/components/ui/ContextFeedbackCard";
import { useNavigationStore } from "@/store/useNavigationStore";

export function SobreFeedbackCard({ className }: { className?: string }) {
  const { setReportModalOpen } = useNavigationStore();

  const handleFeedbackClick = () => {
    setReportModalOpen(true, 'sugestao');
  };

  return (
    <ContextFeedbackCard
      title="Sobre"
      description={'A engenharia e a filosofia por trás do Hub-LabDiv. Aqui contamos como saímos da prancheta e da observação de um "gap" visual para a criação deste código. Entenda nossa evolução de um repositório para um ecossistema interativo focado em UX Inclusiva, construído com arquitetura de ponta e inspirado no MIT Comm Lab. Conheça a nossa visão para o futuro da divulgação. Como um projeto (Beta), sua percepção é vital. O que achou da nossa arquitetura e proposta? Nos conte!'}
      betaTag={true}
      onFeedbackClick={handleFeedbackClick}
      className={className}
    />
  );
}
