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

export interface InitiativeSubdomainConfig {
    subdomain: string;
    folder: string;
    dbSlug: string;
    showcasePath: string;
    title: string;
}

export const INITIATIVE_SUBDOMAIN_MAP: Record<string, InitiativeSubdomainConfig> = {
    showdefisica: {
        subdomain: 'showdefisica',
        folder: 'show-da-fisica',
        dbSlug: 'show_da_fisica',
        showcasePath: '/iniciativas/show-da-fisica',
        title: 'Show de Física',
    },
};

/**
 * Identifica se a requisição provém de um subdomínio de iniciativa mapeado.
 */
export function getInitiativeConfigByHost(host?: string | null): InitiativeSubdomainConfig | null {
    if (!host) return null;
    const cleanHost = host.split(':')[0].toLowerCase();
    
    // Verifica subdomínio inicial (ex: showdefisica.hublabdiv.com.br ou showdefisica.localhost)
    const parts = cleanHost.split('.');
    if (parts.length >= 2) {
        const potentialSub = parts[0];
        if (INITIATIVE_SUBDOMAIN_MAP[potentialSub]) {
            return INITIATIVE_SUBDOMAIN_MAP[potentialSub];
        }
    }

    return null;
}

/**
 * Valida o parâmetro 'next' no fluxo de autenticação contra Open Redirects,
 * permitindo rotas internas e URLs absolutas seguras sob a whitelist oficial.
 */
export function resolveSafeNextUrl(rawNext: string | null | undefined, defaultTarget: string = '/lab'): string {
    if (!rawNext) {
        return defaultTarget;
    }

    let trimmed = rawNext.trim();

    // Se a URL ou caminho foi codificado como componente (ex: %2Fauth%2Fsso%2Fauthorize...),
    // decodifica iterativamente até obter o formato limpo.
    for (let i = 0; i < 3; i++) {
        if (
            trimmed.startsWith('%2F') ||
            trimmed.startsWith('%2f') ||
            trimmed.startsWith('%252F') ||
            trimmed.startsWith('%252f')
        ) {
            try {
                const decoded = decodeURIComponent(trimmed);
                if (decoded === trimmed) break;
                trimmed = decoded.trim();
            } catch {
                break;
            }
        } else {
            break;
        }
    }

    if (
        trimmed === '/' ||
        trimmed === '/login' ||
        trimmed.startsWith('/login?') ||
        trimmed.startsWith('/login/')
    ) {
        return defaultTarget;
    }

    // Caminho relativo seguro (ex: '/lab', '/painel', '/auth/sso/authorize?redirect_uri=...')
    if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.startsWith('/\\')) {
        return trimmed;
    }

    // URL absoluta: validar contra whitelist oficial
    try {
        const parsed = new URL(trimmed);
        const host = parsed.hostname.toLowerCase();

        const isAllowedDomain =
            host === 'hublabdiv.com.br' ||
            host.endsWith('.hublabdiv.com.br') ||
            host === 'localhost' ||
            host.endsWith('.localhost');

        if (isAllowedDomain) {
            return trimmed;
        }
    } catch {
        // Formato de URL inválido
    }

    return defaultTarget;
}

/**
 * Constrói o link correto para o site do Show de Física considerando o ambiente atual.
 */
export function getShowSiteHref(path: string = '', currentHost?: string | null): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    if (!currentHost && typeof window !== 'undefined') {
        currentHost = window.location.host;
    }

    const host = (currentHost || '').toLowerCase();

    // Se já estiver no subdomínio, link relativo
    if (host.startsWith('showdefisica.')) {
        return cleanPath;
    }

    // Se estiver em localhost em desenvolvimento
    if (host.includes('localhost')) {
        const port = host.split(':')[1] || '3000';
        return `http://showdefisica.localhost:${port}${cleanPath}`;
    }

    // Produção / Vercel
    if (host.endsWith('hublabdiv.com.br')) {
        return `https://showdefisica.hublabdiv.com.br${cleanPath}`;
    }

    // Fallback de caminho direto para previews da Vercel ou Capacitor
    return `/sites/show-da-fisica${cleanPath}`;
}

/**
 * Constrói o link interno relativo seguro para páginas dentro do Show de Física.
 * Se o usuário estiver navegando em /sites/show-da-fisica/* (modo fallback preview/Capacitor),
 * os links internos mantêm o prefixo /sites/show-da-fisica para evitar 404.
 * Se estiver no subdomínio oficial (showdefisica.*), mantém o link limpo (ex: /painel).
 */
export function getShowInternalHref(path: string = '', currentPathname?: string | null): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    let curPath = currentPathname;
    if (!curPath && typeof window !== 'undefined') {
        curPath = window.location.pathname;
    }

    if (curPath && curPath.startsWith('/sites/show-da-fisica')) {
        const sub = cleanPath === '/' ? '' : cleanPath;
        return `/sites/show-da-fisica${sub}`;
    }

    return cleanPath;
}

