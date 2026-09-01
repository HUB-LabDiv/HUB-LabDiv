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

export const ALLOWED_SOFTWARES_TAB_UIDS: string[] = [
    '67fa6cbf-db42-4d44-a5af-27d7d9086aad', // Mariana Bonkavan (Mari IF)
    '8a3e4272-010d-4479-94cb-26178d544ea2', // João Paulo Stangorlini (Andy)
];

export function isUserAllowedSoftwaresTab(userId?: string | null): boolean {
    if (!userId) return false;
    return ALLOWED_SOFTWARES_TAB_UIDS.includes(userId);
}

export const SOFTWARE_CATEGORIES = [
    'Todos',
    'Feitos por Alunos/USP',
    'Física & Simulação',
    'Produtividade',
    'Cálculo & Matemática',
    'Geometria & Álgebra',
    'Utilidades'
] as const;

export const SOFTWARE_PLATFORMS = [
    'Web',
    'Windows',
    'Linux',
    'macOS',
    'Android',
    'iOS',
    'PWA'
] as const;

export const SOFTWARE_AUDIENCES = [
    'Graduação',
    'Iniciação Científica',
    'Pós-Graduação',
    'Ensino Médio',
    'Docentes & Pesquisadores'
] as const;
