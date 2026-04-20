/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { NextResponse } from 'next/server';
import { sendAdminNotification } from '@/lib/notifications.server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await sendAdminNotification({
      type: 'submission', // Default type for backward compatibility
      ...data
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Notification API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
