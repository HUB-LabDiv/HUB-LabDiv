'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import { AurtisticOrgEmbedFrame } from '@/components/aurtistic/AurtisticOrgEmbedFrame';

export default function PainelBastidoresPage() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] block">
                        [ SF-OPS // BASTIDORES INTEGRADOS NO AURTISTIC ]
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-gray-950 dark:text-white">
                        <span className="neon-text-red">Bastidores</span> &bull;{' '}
                        <span className="neon-text-blue">Gestão</span> &bull;{' '}
                        <span className="neon-text-green">Operação</span>
                    </h1>
                </div>
                <span className="text-xs font-mono font-bold uppercase px-3 py-1.5 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300]">
                    Sincronizado com Eixo 4 (Aurtistic)
                </span>
            </div>

            <AurtisticOrgEmbedFrame
                orgSlug="show-da-fisica"
                mode="org"
                allowOrgSwitch={false}
                heightClassName="h-[880px]"
            />
        </div>
    );
}
