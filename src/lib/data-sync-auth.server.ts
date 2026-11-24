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

import 'server-only';
import crypto from 'crypto';
import type { NextRequest } from 'next/server';

/**
 * Valida Bearer token machine-to-machine contra DATA_PIPELINE_SECRET
 * comparando digests SHA-256 (32 bytes fixos) em tempo constante.
 */
export function verifyDataPipelineSecret(request: NextRequest): boolean {
  const expected = process.env.DATA_PIPELINE_SECRET;
  if (!expected || expected.length < 16) {
    return false;
  }

  const authHeader = request.headers.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return false;
  }

  const provided = match[1].trim();
  const expectedDigest = crypto.createHash('sha256').update(expected, 'utf8').digest();
  const providedDigest = crypto.createHash('sha256').update(provided, 'utf8').digest();

  return crypto.timingSafeEqual(expectedDigest, providedDigest);
}
