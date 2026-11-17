/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre (Licença AGPLv3)
 */

import React from 'react';
import { ProfisClient } from './ProfisClient';

export const metadata = {
  title: 'Pró-Física (ProFis) | Iniciativas IFUSP',
  description: 'Incentivo à formação acadêmica, nivelamento e pesquisa científica no IFUSP.',
};

export const dynamic = 'force-dynamic';

export default function ProfisPage() {
  return <ProfisClient />;
}

