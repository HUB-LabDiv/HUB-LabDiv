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
