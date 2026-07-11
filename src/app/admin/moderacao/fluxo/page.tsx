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

import React, { Suspense } from 'react';
import { AdminModerationClient } from "@/components/admin/AdminModerationClient";

export const dynamic = "force-dynamic";

export const metadata = {
    title: 'Moderação do Fluxo | Admin',
};

export default function ModerationPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-neutral-900 border border-white/5">
                <span className="material-symbols-outlined animate-spin text-brand-blue text-4xl">progress_activity</span>
            </div>
        }>
            <AdminModerationClient />
        </Suspense>
    );
}



