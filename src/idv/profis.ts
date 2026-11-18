/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import type { InitiativeIdvDefinition } from './types';

export const PROFIS_IDV: InitiativeIdvDefinition = {
  id: 'profis',
  name: 'PROFIS (Espaço de Apoio, Pesquisa e Cooperação de Professores de Física)',
  shortLabel: 'PROFIS',
  colors: {
    primary: '#F59E0B',
    primaryContainer: '#78350F',
    secondary: '#FFCC00',
    tertiary: '#38BDF8',
    bgApp: '#080c16',
    bgSurface: '#0f172a',
    brandVariants: ['#F59E0B', '#FFCC00', '#38BDF8', '#D97706'],
  },
  lightColors: {
    primary: '#D97706',
    primaryContainer: '#B45309',
    secondary: '#FFCC00',
    tertiary: '#0284C7',
    bgApp: '#F8FAFC',
    bgSurface: '#FFFFFF',
  },
  fonts: {
    display: 'var(--font-bukra), "29LT Bukra Semi Wide Bold", sans-serif',
    body: 'var(--font-open-sans), "Open Sans", sans-serif',
  },
  shape: 'm3-rounded',
  backdropPattern: 'profis-formulas',
};
