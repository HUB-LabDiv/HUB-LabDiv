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

import { institutoData, Department, Researcher } from '@/data/institutoData';

export interface FacultyMatch {
    researcher: Researcher;
    department: {
        id: string;
        sigla: string;
        nome: string;
    };
    title: string;
    departmentName: string;
    departmentCode: string;
    building?: string;
    room?: string;
    phone?: string;
    matchType: 'exact_email' | 'username_match' | 'name_match';
    confidence: 'high' | 'medium';
}

function normalizeStr(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

/**
 * 🧠 Detector inteligente de docentes do IFUSP a partir de e-mail ou nome cadastrado
 */
export function detectFacultyMember(email?: string | null, name?: string | null): FacultyMatch | null {
    if (!email && !name) return null;

    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const emailUser = cleanEmail ? cleanEmail.split('@')[0] : '';
    const cleanName = name ? normalizeStr(name) : '';

    const departments = Object.values(institutoData);

    const buildMatch = (res: Researcher, dept: Department, matchType: FacultyMatch['matchType'], confidence: FacultyMatch['confidence']): FacultyMatch => ({
        researcher: res,
        department: {
            id: dept.id,
            sigla: dept.sigla,
            nome: dept.nome
        },
        title: res.role,
        departmentName: dept.nome,
        departmentCode: dept.sigla,
        building: res.predio,
        room: res.sala,
        phone: res.telefone,
        matchType,
        confidence
    });

    for (const dept of departments) {
        for (const res of dept.pesquisadores) {
            const resEmail = res.email ? res.email.toLowerCase().trim() : '';
            const resEmailUser = resEmail ? resEmail.split('@')[0] : '';
            const resCleanName = normalizeStr(res.nome);

            // 1. Coincidência Exata de E-mail
            if (cleanEmail && resEmail && cleanEmail === resEmail) {
                return buildMatch(res, dept, 'exact_email', 'high');
            }

            // 2. Coincidência de Usuário de E-mail (ex: nome.sobrenome@usp.br vs nome.sobrenome@if.usp.br)
            if (emailUser && resEmailUser && emailUser === resEmailUser) {
                return buildMatch(res, dept, 'username_match', 'high');
            }

            // 3. Coincidência Exata de Nome Completo
            if (cleanName && cleanName.length >= 8 && cleanName === resCleanName) {
                return buildMatch(res, dept, 'name_match', 'medium');
            }
        }
    }

    return null;
}
