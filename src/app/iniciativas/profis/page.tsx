/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre (Licença AGPLv3)
 */

import React from 'react';
import { ProfisClient } from './ProfisClient';

export const metadata = {
  title: 'PROFIS (Espaço de Apoio, Pesquisa e Cooperação de Professores de Física) | Iniciativas IFUSP',
  description: 'Espaço de apoio, pesquisa e cooperação de professores e estudantes de física no IFUSP.',
};

export const dynamic = 'force-dynamic';

export default function ProfisPage() {
  return <ProfisClient />;
}

