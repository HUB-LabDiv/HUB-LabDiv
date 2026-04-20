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


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

type SearchScope = 'GLOBAL' | 'WIKI' | 'MAPA';

interface SearchContextType {
    query: string;
    setQuery: (q: string) => void;
    scope: SearchScope;
    placeholder: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * 🧠 SearchProvider: O Cérebro da Busca Contextual (V3.1.0)
 * Detecta automaticamente o escopo via Regex Routing.
 */
export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [query, setQuery] = useState('');
    const [scope, setScope] = useState<SearchScope>('GLOBAL');
    const pathname = usePathname();

    useEffect(() => {
        // Regex Routing Engine
        if (pathname.match(/^\/colisor/)) {
            setScope('WIKI');
        } else if (pathname.match(/^\/mapa/)) {
            setScope('MAPA');
        } else {
            setScope('GLOBAL');
        }
    }, [pathname]);

    const getPlaceholder = useCallback(() => {
        switch (scope) {
            case 'WIKI': return 'Pesquisar documentação técnica...';
            case 'MAPA': return 'Pesquisar locais e mídias...';
            default: return 'Pesquisar no Hub Lab-Div...';
        }
    }, [scope]);

    return (
        <SearchContext.Provider value={{ query, setQuery, scope, placeholder: getPlaceholder() }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        // Fallback for SSR or accidental outside usage to prevent crash
        return {
            query: '',
            setQuery: () => {},
            scope: 'GLOBAL' as SearchScope,
            placeholder: 'Pesquisar no Hub Lab-Div...'
        };
    }
    return context;
};
