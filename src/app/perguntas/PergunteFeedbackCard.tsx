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

export function PergunteFeedbackCard({ className }: { className?: string }) {
  const { setReportModalOpen } = useNavigationStore();

  const handleFeedbackClick = () => {
    setReportModalOpen(true, 'sugestao');
  };

  return (
    <ContextFeedbackCard
      title="Aba Pergunte"
      description="Sua linha direta com a ciência. Faça perguntas sobre física ou sobre a vida acadêmica e conte com a equipe do LabDiv e pesquisadores parceiros para responder. Quer saber como a força fraca funciona, como é trabalhar em um reator nuclear ou como é a rotina de pesquisa na USP? Explore curiosidades e tire suas dúvidas com quem faz a ciência acontecer. O que você sempre quis perguntar, mas não sabia onde? Nos conte!"
      betaTag={true}
      onFeedbackClick={handleFeedbackClick}
      className={className}
    />
  );
}
