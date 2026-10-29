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
import { Clock, Terminal, Zap, Sparkles, GraduationCap } from 'lucide-react';
import { InitiativeId } from '@/types';

export interface InitiativeMeta {
    id: InitiativeId;
    label: string;
    shortLabel: string;
    subtitle: string;
    badgeClasses: string;
    chipSelectedClasses: string;
    chipUnselectedClasses: string;
    dotClasses: string;
}

export const INITIATIVES_CATALOG: Record<InitiativeId, InitiativeMeta> = {
    labdiv: {
        id: 'labdiv',
        label: 'LabDiv (Laboratório de Divulgação Científica)',
        shortLabel: 'LabDiv',
        subtitle: 'Paleta HUB (#0F4780 • #F14343 • #FFCC00)',
        // Paleta oficial do HUB: Azul Institucional + Amarelo Solar + detalhe Vermelho Lab
        badgeClasses:
            'bg-[#0F4780]/10 dark:bg-[#0F4780]/30 text-[#0F4780] dark:text-[#FFCC00] border-[#0F4780]/30 dark:border-[#FFCC00]/40 shadow-[0_0_10px_rgba(15,71,128,0.12)] dark:shadow-[0_0_12px_rgba(255,204,0,0.15)]',
        chipSelectedClasses:
            'bg-[#0F4780]/15 dark:bg-[#0F4780]/35 border-[#0F4780] dark:border-[#FFCC00] text-[#0F4780] dark:text-[#FFCC00] ring-2 ring-[#FFCC00]/40',
        chipUnselectedClasses:
            'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#0F4780]/50 dark:hover:border-[#FFCC00]/40',
        dotClasses: 'bg-gradient-to-tr from-[#0F4780] via-[#F14343] to-[#FFCC00]',
    },
    show_da_fisica: {
        id: 'show_da_fisica',
        label: 'Show da Física',
        shortLabel: 'Show da Física',
        subtitle: 'Paleta Neon Oficial (#002FFE • #F60011 • #01F300)',
        // Paleta Neon do Card do Show da Física
        badgeClasses:
            'bg-[#050510] dark:bg-[#050510] text-white border-[#002ffe] shadow-[0_0_12px_rgba(0,47,254,0.45),inset_0_0_8px_rgba(246,0,17,0.25)]',
        chipSelectedClasses:
            'bg-[#050510] text-white border-[#01f300] shadow-[0_0_15px_rgba(1,243,0,0.35),inset_0_0_10px_rgba(0,47,254,0.35)] ring-1 ring-[#01f300]/60',
        chipUnselectedClasses:
            'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#002ffe]/60',
        dotClasses: 'bg-[#01f300] shadow-[0_0_8px_#01f300]',
    },
    hs: {
        id: 'hs',
        label: 'HS (Hackerspace IFUSP)',
        shortLabel: 'HS',
        subtitle: 'Verde Hacker Matrix (#00FF66)',
        // Verde Hacker Matrix do Hackerspace
        badgeClasses:
            'bg-emerald-950/90 dark:bg-[#05150B] text-[#00FF66] border-[#00FF66]/60 font-mono shadow-[0_0_12px_rgba(0,255,102,0.25)]',
        chipSelectedClasses:
            'bg-emerald-950 dark:bg-[#05150B] text-[#00FF66] border-[#00FF66] font-mono shadow-[0_0_14px_rgba(0,255,102,0.3)] ring-1 ring-[#00FF66]/50',
        chipUnselectedClasses:
            'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#00FF66]/50',
        dotClasses: 'bg-[#00FF66] shadow-[0_0_8px_#00FF66]',
    },
    profis: {
        id: 'profis',
        label: 'Profis',
        shortLabel: 'Profis',
        subtitle: 'Bege Acadêmico (#D4B896 • #6B4F35)',
        // Paleta Bege solicitada pelo usuário
        badgeClasses:
            'bg-[#F5EBE1] dark:bg-[#2C241B] text-[#6B4F35] dark:text-[#E6D5B8] border-[#D4B896] dark:border-[#C2A685]/50 shadow-xs',
        chipSelectedClasses:
            'bg-[#F5EBE1] dark:bg-[#2C241B] text-[#5A4028] dark:text-[#E6D5B8] border-[#B89772] dark:border-[#D4B896] ring-2 ring-[#D4B896]/40',
        chipUnselectedClasses:
            'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-[#D4B896]',
        dotClasses: 'bg-[#C2A685] dark:bg-[#E6D5B8]',
    },
};

export const INITIATIVE_LIST: InitiativeMeta[] = [
    INITIATIVES_CATALOG.labdiv,
    INITIATIVES_CATALOG.show_da_fisica,
    INITIATIVES_CATALOG.hs,
    INITIATIVES_CATALOG.profis,
];

interface InitiativeBadgesProps {
    initiatives?: string[] | null;
    isLabdivLegacy?: boolean;
    pendingInitiatives?: string[] | null;
    isOwnerView?: boolean;
    size?: 'sm' | 'md';
    className?: string;
}

export function InitiativeBadges({
    initiatives,
    isLabdivLegacy = false,
    pendingInitiatives,
    isOwnerView = false,
    size = 'md',
    className = '',
}: InitiativeBadgesProps) {
    const normalized = new Set<string>(Array.isArray(initiatives) ? initiatives : []);
    if (isLabdivLegacy) {
        normalized.add('labdiv');
    }

    const pendingSet = new Set<string>(Array.isArray(pendingInitiatives) ? pendingInitiatives : []);

    if (normalized.size === 0) return null;

    const sizeClasses =
        size === 'sm'
            ? 'px-2 py-0.5 text-[9px] gap-1 rounded-md'
            : 'px-2.5 py-1 text-[10px] gap-1.5 rounded-lg';

    return (
        <div className={`inline-flex flex-wrap items-center gap-1.5 ${className}`}>
            {Array.from(normalized).map((rawId) => {
                const meta = INITIATIVES_CATALOG[rawId as InitiativeId];
                if (!meta) return null;

                const isPendingItem = isOwnerView && pendingSet.has(rawId);

                return (
                    <span
                        key={meta.id}
                        title={
                            isPendingItem
                                ? `${meta.label} — Vínculo em revisão pela moderação (Visível só para você)`
                                : meta.label
                        }
                        className={`inline-flex items-center font-black uppercase tracking-wider border transition-all ${sizeClasses} ${meta.badgeClasses}`}
                    >
                        {meta.id === 'labdiv' && (
                            <span className="inline-flex items-center gap-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4780] dark:bg-[#3B82F6]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#F14343]" />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]" />
                            </span>
                        )}
                        {meta.id === 'show_da_fisica' && (
                            <Zap className="w-3 h-3 text-[#01f300] drop-shadow-[0_0_5px_#f60011] shrink-0" />
                        )}
                        {meta.id === 'hs' && (
                            <Terminal className="w-3 h-3 text-[#00FF66] shrink-0" />
                        )}
                        {meta.id === 'profis' && (
                            <GraduationCap className="w-3 h-3 text-[#6B4F35] dark:text-[#E6D5B8] shrink-0" />
                        )}

                        <span
                            className={
                                meta.id === 'show_da_fisica'
                                    ? 'text-white drop-shadow-[0_0_4px_#002ffe]'
                                    : ''
                            }
                        >
                            {meta.shortLabel}
                        </span>

                        {isPendingItem && (
                            <span className="ml-1 inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-[#FFCC00]/20 text-[#B45309] dark:text-[#FFCC00] border border-[#FFCC00]/40 text-[8px] font-black tracking-tight">
                                <Clock className="w-2.5 h-2.5" />
                                Pendente
                            </span>
                        )}
                    </span>
                );
            })}
        </div>
    );
}

