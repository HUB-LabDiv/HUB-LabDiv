/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

export interface InitiativeIdvDefinition {
  id: 'hub' | 'labdiv' | 'show-da-fisica' | 'hs' | 'profis';
  name: string;
  shortLabel: string;
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    tertiary: string;
    bgApp: string;
    bgSurface: string;
    /** Variantes cromáticas extras oficiais da própria iniciativa/tema */
    brandVariants?: string[];
  };
  lightColors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    tertiary: string;
    bgApp: string;
    bgSurface: string;
  };
  fonts: {
    display: string;
    body: string;
  };
  shape: 'm3-rounded' | 'neon-sharp';
  backdropPattern: 'default' | 'labdiv-aura' | 'show-svg' | 'matrix-rain' | 'profis-formulas';
  assets?: {
    logoSvg?: string;
    faviconSvg?: string;
    bgPatternSvg?: string;
  };
}

export const LABDIV_OFFICIAL_PALETTE = {
  yellow: '#FFCC00',
  red: '#F14343',
  blueDeep: '#0F4780',
  blueCyan: '#1F9FCF',
} as const;
