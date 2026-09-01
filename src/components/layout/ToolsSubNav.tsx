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


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Route, UserSearch, BookOpen, Laptop, Sparkles } from 'lucide-react';

interface ToolsSubNavProps {
    hasSoftwaresAccess?: boolean;
}

const baseTools = [
    { name: 'Grade Horária', href: '/ferramentas', icon: Calendar, exact: true },
    { name: 'Trilhas', href: '/ferramentas/trilhas', icon: Route, exact: false },
    { name: 'Match Acadêmico', href: '/ferramentas/match', icon: UserSearch, exact: true },
    { name: 'Central de Anotações', href: '/ferramentas/anotacoes', icon: BookOpen, exact: false },
];

export function ToolsSubNav({ hasSoftwaresAccess = false }: ToolsSubNavProps) {
    const pathname = usePathname();

    const tools = hasSoftwaresAccess
        ? [
            ...baseTools,
            { name: 'Softwares', href: '/ferramentas/softwares', icon: Laptop, exact: false, badge: 'Beta' }
        ]
        : baseTools;

    const isActive = (href: string, exact: boolean) => {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    };

    return (
        <nav 
            className="w-full mb-6 sticky z-40 py-2"
            style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}
        >
            <div className="flex items-center justify-center">
                <div className="flex gap-1.5 sm:gap-2 p-1 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-[20px] w-fit overflow-x-auto scrollbar-hide max-w-full shadow-lg">
                    {tools.map((tool) => {
                        const active = isActive(tool.href, tool.exact);
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className={`
                                    flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-4 sm:py-2.5 rounded-[16px] text-[8px] sm:text-[9px] font-black uppercase tracking-widest
                                    transition-all duration-300 whitespace-nowrap relative
                                    ${active
                                        ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                        : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                    }
                                `}
                            >
                                <tool.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{tool.name}</span>
                                {'badge' in tool && tool.badge && (
                                    <span className="px-1 py-0.2 text-[7px] font-extrabold bg-[#FFCC00] text-black rounded-full uppercase tracking-tight shadow-sm animate-pulse">
                                        {tool.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}


