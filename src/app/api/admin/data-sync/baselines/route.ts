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

import { NextRequest, NextResponse } from 'next/server';
import { verifyDataPipelineSecret } from '@/lib/data-sync-auth.server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import type { PipelineBaselinesResponse, PipelineModule } from '@/types/data-pipeline';

export async function GET(request: NextRequest) {
  if (!verifyDataPipelineSecret(request)) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin = createAdminSupabase();
    const { data, error } = await admin
      .from('official_data_snapshots')
      .select('module, version, payload');

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    const snapshots: PipelineBaselinesResponse['snapshots'] = {};
    for (const row of data || []) {
      snapshots[row.module as PipelineModule] = {
        version: row.version,
        payload: row.payload,
      };
    }

    return NextResponse.json({ ok: true, snapshots } satisfies PipelineBaselinesResponse);
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Internal error' },
      { status: 500 }
    );
  }
}
