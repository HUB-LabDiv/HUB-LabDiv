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

import { NextResponse } from 'next/server';
import { checkModerationQueueThresholds } from '@/lib/moderation-queue-monitor';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const cronSecret = process.env.CRON_SECRET;
        const authHeader = request.headers.get('authorization');

        // Se CRON_SECRET estiver configurado, exige validação do Bearer token
        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const result = await checkModerationQueueThresholds();

        return NextResponse.json({
            success: true,
            data: result
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error?.message || 'Erro interno no monitor de fila'
        }, { status: 500 });
    }
}
