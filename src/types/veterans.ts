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

export type TipCategory = 'comunicacao' | 'permanencia' | 'academica';
export type TipStatus = 'pending' | 'approved' | 'rejected';

export interface USPInstituteOption {
    id: string;
    name: string;
    shortLabel: string;
    color?: string;
}

export const USP_INSTITUTES: USPInstituteOption[] = [
    { id: 'geral', name: 'Geral (Toda a USP)', shortLabel: 'Geral • USP', color: 'brand-yellow' },
    { id: 'ifusp', name: 'IFUSP - Instituto de Física', shortLabel: 'IFUSP', color: 'brand-blue' },
    { id: 'poli', name: 'Poli - Escola Politécnica', shortLabel: 'Poli-USP', color: 'brand-yellow' },
    { id: 'ime', name: 'IME - Matemática & Estatística', shortLabel: 'IME-USP', color: 'brand-blue' },
    { id: 'iq', name: 'IQ - Instituto de Química', shortLabel: 'IQ-USP', color: 'brand-red' },
    { id: 'fflch', name: 'FFLCH - Filosofia, Letras e Humanas', shortLabel: 'FFLCH', color: 'brand-red' },
    { id: 'ib', name: 'IB - Instituto de Biociências', shortLabel: 'IB-USP', color: 'emerald-400' },
    { id: 'fea', name: 'FEA - Economia, Adm e Contabilidade', shortLabel: 'FEA-USP', color: 'brand-blue' },
    { id: 'fau', name: 'FAU - Arquitetura e Urbanismo', shortLabel: 'FAU-USP', color: 'purple-400' },
    { id: 'eesc_icmc', name: 'São Carlos (EESC / ICMC / IFSC / IQSC)', shortLabel: 'São Carlos', color: 'brand-yellow' },
    { id: 'outro', name: 'Outro Instituto / Unidade da USP', shortLabel: 'Outro Instituto', color: 'gray-400' },
];

export interface VeteransTip {
    id: string;
    titulo: string;
    conteudo: string;
    categoria: TipCategory | string;
    instituto: string;
    autor_nome: string;
    autor_id?: string | null;
    upvotes: number;
    status: TipStatus | string;
    created_at: string;
}

export interface CreateTipDTO {
    titulo: string;
    conteudo: string;
    categoria: TipCategory | string;
    instituto?: string;
}
