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

/**
 * V8.0 Apocalypse Protocol - Navigation Types
 * Strictly typed interfaces to eliminate 'any' and enforce PII protection.
 */

export enum AppRoutes {
    HOME = '/',
    ENVAR = '/enviar',
    LAB = '/lab',
    COLISOR = '/colisor',
    MAPA = '/mapa',
    ADMIN = '/admin',
    PERGUNTAS = '/perguntas',
    ARQUIVO_LABDIV = '/arquivo-labdiv',
    WIKI = '/wiki',
    EMARANHAMENTO = '/emaranhamento',
    COMUNIDADE = '/',
}

export interface UserMinimalDTO {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
    xp?: number;
    level?: number;
    is_labdiv?: boolean;
}

export interface SearchSuggestion {
    id: string;
    title: string;
}

export interface NavItem {
    name: string;
    href: string | AppRoutes;
    icon: string;
    isAction?: boolean;
    isDrawerTrigger?: boolean;
    isPrimary?: boolean;
}
