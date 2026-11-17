/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import { LABDIV_IDV } from './labdiv';
import { SHOW_DA_FISICA_IDV } from './show-da-fisica';
import { HACKERSPACE_IDV } from './hackerspace';
import { PROFIS_IDV } from './profis';
import type { InitiativeIdvDefinition } from './types';

export * from './types';
export { LABDIV_IDV, SHOW_DA_FISICA_IDV, HACKERSPACE_IDV, PROFIS_IDV };

export const HUB_DEFAULT_IDV: InitiativeIdvDefinition = {
  id: 'hub',
  name: 'Padrão HUB',
  shortLabel: 'HUB',
  colors: LABDIV_IDV.colors,
  lightColors: LABDIV_IDV.lightColors,
  fonts: LABDIV_IDV.fonts,
  shape: 'm3-rounded',
  backdropPattern: 'default',
  assets: LABDIV_IDV.assets,
};

export const INITIATIVE_IDV_MAP: Record<InitiativeIdvDefinition['id'], InitiativeIdvDefinition> = {
  hub: HUB_DEFAULT_IDV,
  labdiv: LABDIV_IDV,
  'show-da-fisica': SHOW_DA_FISICA_IDV,
  hs: HACKERSPACE_IDV,
  profis: PROFIS_IDV,
};

export function getInitiativeIdv(id?: string | null): InitiativeIdvDefinition {
  const key = (id || 'hub').toLowerCase().trim() as InitiativeIdvDefinition['id'];
  return INITIATIVE_IDV_MAP[key] || HUB_DEFAULT_IDV;
}

