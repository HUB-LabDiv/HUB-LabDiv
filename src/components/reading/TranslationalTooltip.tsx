'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V4.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Tabs from '@radix-ui/react-tabs';
import { Book, Sparkles, Palette, Zap, Info } from 'lucide-react';

interface ConstellationMeaning {
    constelacao: string;
    descodificacao: string;
}

interface TranslationalTooltipProps {
    term: string;
    academicDefinition: string;
    constellations: ConstellationMeaning[];
    children: React.ReactNode;
}

export function TranslationalTooltip({ term, academicDefinition, constellations, children }: TranslationalTooltipProps) {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button className="inline-flex items-center gap-0.5 border-b-2 border-dotted border-brand-blue hover:bg-brand-blue/5 transition-colors cursor-help outline-none focus:ring-2 focus:ring-brand-blue/20 rounded-sm">
                    {children}
                    <Info className="w-3 h-3 text-brand-blue opacity-50" />
                </button>
            </Popover.Trigger>
            
            <Popover.Portal>
                <Popover.Content 
                    className="z-[150] w-[320px] bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                    sideOffset={5}
                >
                    <div className="bg-brand-blue/5 dark:bg-brand-blue/10 px-4 py-3 border-b border-gray-100 dark:border-white/5">
                        <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue flex items-center gap-2">
                            <Zap className="w-3 h-3 fill-brand-blue" />
                            Signo Gerador: {term}
                        </h3>
                    </div>

                    <Tabs.Root defaultValue="academico" className="flex flex-col">
                        <Tabs.List className="flex border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                            <Tabs.Trigger 
                                value="academico"
                                className="flex-1 px-2 py-3 text-[10px] font-black uppercase tracking-tighter text-gray-400 data-[state=active]:text-brand-blue data-[state=active]:border-b-2 data-[state=active]:border-brand-blue transition-all"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <Book className="w-3.5 h-3.5" />
                                    <span>Acadêmico</span>
                                </div>
                            </Tabs.Trigger>
                            {constellations.map(c => (
                                <Tabs.Trigger 
                                    key={c.constelacao}
                                    value={c.constelacao}
                                    className="flex-1 px-2 py-3 text-[10px] font-black uppercase tracking-tighter text-gray-400 data-[state=active]:text-brand-yellow data-[state=active]:border-b-2 data-[state=active]:border-brand-yellow transition-all"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        {c.constelacao === 'nerd' && <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />}
                                        {c.constelacao === 'artistica' && <Palette className="w-3.5 h-3.5 text-brand-red" />}
                                        {c.constelacao !== 'nerd' && c.constelacao !== 'artistica' && <Zap className="w-3.5 h-3.5 text-brand-blue" />}
                                        <span className="capitalize">{c.constelacao}</span>
                                    </div>
                                </Tabs.Trigger>
                            ))}
                        </Tabs.List>

                        <div className="p-4 min-h-[120px]">
                            <Tabs.Content value="academico" className="animate-in fade-in duration-300">
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                    {academicDefinition}
                                </p>
                            </Tabs.Content>
                            {constellations.map(c => (
                                <Tabs.Content key={c.constelacao} value={c.constelacao} className="animate-in fade-in duration-300">
                                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium italic">
                                        "{c.descodificacao}"
                                    </p>
                                </Tabs.Content>
                            ))}
                        </div>
                    </Tabs.Root>

                    <Popover.Arrow className="fill-white dark:fill-[#1E1E1E]" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
