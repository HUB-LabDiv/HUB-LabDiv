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
import { Block } from '@/app/enviar/schema';

export default function WebGameBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    return (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 border-2 border-dashed border-brand-red/30 bg-brand-red/5 rounded-xl">
            <span className="material-symbols-outlined text-3xl mb-1 text-gray-200">sports_esports</span>
            <span className="text-sm font-bold text-gray-200">Jogo Web</span>
            <p className="text-xs mt-1 text-gray-500">Incorpore um jogo web ou simulação interativa via link.</p>
        </div>
    );
}
