import React from 'react';
import { Metadata } from 'next';
import { MonteSeuShowClient } from '@/app/iniciativas/show-da-fisica/monte-seu-show/MonteSeuShowClient';

export const metadata: Metadata = {
    title: 'Monte seu Show | Agendamento Escolar',
    description: 'Personalize o roteiro de 60 minutos do Show de Física para a sua turma e envie a solicitação de agendamento da sua escola.',
};

export default function SubdomainMonteSeuShowPage() {
    return (
        <div className="w-full">
            <MonteSeuShowClient />
        </div>
    );
}

