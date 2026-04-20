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
import { Flag } from 'lucide-react';
import { useNavigationStore } from '@/store/useNavigationStore';

export function ReportButton({ submissionId }: { submissionId: string }) {
    const { openContentReport } = useNavigationStore();

    return (
        <button
            onClick={() => openContentReport(submissionId)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-red/10 text-brand-red border border-brand-red/20 rounded-xl font-bold text-xs hover:bg-brand-red/20 transition-all group"
            title="Reportar Erro ou Problema"
        >
            <Flag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline uppercase tracking-tight">Reportar</span>
        </button>
    );
}
