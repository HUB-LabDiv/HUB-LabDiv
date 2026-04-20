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
import NotificacoesManager from '@/components/admin/NotificacoesManager';

export const metadata = {
    title: 'Central de Notificações | Admin Panel',
    description: 'Gerenciamento de comunicados e notificações da plataforma.',
};

export default function NotificacoesPage() {
    return (
        <div className="p-4 md:p-8 lg:p-12 min-h-screen bg-transparent relative">
            {/* Background elements for premium look */}
            <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-brand-red/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto">
                <NotificacoesManager />
            </div>
        </div>
    );
}
