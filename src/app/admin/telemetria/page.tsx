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
import { TelemetryManager } from '@/components/admin/settings/TelemetryManager';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Telemetria do Sistema | AdminPanel',
    description: 'Acompanhamento de acessos, eventos e telemetria.',
};

export default function AdminTelemetryPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                    <span className="material-symbols-outlined text-brand-blue text-4xl">query_stats</span>
                    Telemetria do Sistema
                </h1>
                <p className="text-gray-500 mt-2">Acompanhe estatísticas, eventos e acesso de usuários em tempo real.</p>
            </div>
            
            <TelemetryManager />
        </div>
    );
}
