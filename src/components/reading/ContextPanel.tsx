'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V4.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import { History, Users, TrendingUp, ChevronDown } from 'lucide-react';
import * as Accordion from '@radix-ui/react-accordion';

interface HSECContext {
    historico?: string;
    social?: string;
    economico?: string;
}

interface ContextPanelProps {
    context: HSECContext;
}

export function ContextPanel({ context }: ContextPanelProps) {
    if (!context || (!context.historico && !context.social && !context.economico)) {
        return null;
    }

    const items = [
        { id: 'hist', label: 'Contexto Histórico', content: context.historico, icon: History, color: 'text-brand-blue' },
        { id: 'soc', label: 'Impacto Social', content: context.social, icon: Users, color: 'text-brand-yellow' },
        { id: 'econ', label: 'Dimensão Econômica', content: context.economico, icon: TrendingUp, color: 'text-brand-red' },
    ].filter(i => i.content);

    return (
        <section className="mb-12 bg-white dark:bg-card-dark rounded-3xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                    Contexto e Background (HSEC)
                </h2>
            </div>
            
            <Accordion.Root type="single" collapsible className="divide-y divide-gray-100 dark:divide-white/5">
                {items.map((item) => (
                    <Accordion.Item key={item.id} value={item.id} className="overflow-hidden">
                        <Accordion.Header>
                            <Accordion.Trigger className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors group">
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{item.label}</span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-data-[state=open]:rotate-180 transition-transform" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-6 pb-6 pt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                            {item.content}
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </section>
    );
}
