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
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

const ConfirmSchema = z.object({
  tokenId: z.string().uuid(),
  childId: z.string().uuid(),
  ipHash: z.string(),
  parentCpfHash: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tokenId, childId, ipHash } = ConfirmSchema.parse(body);

    // CRÍTICO: Usamos o SERVICE ROLE KEY para bypassar RLS em uma ação de sistema (verificação de anonimato)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // 1. Validar Token (Atomicamente via Service Role) - Mantemos 'pending' até o final
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('parental_consent_tokens')
      .select('id, guardian_email, status')
      .eq('id', tokenId)
      .eq('child_id', childId)
      .eq('status', 'pending')
      .single();

    if (tokenError || !tokenData) {
        console.error('[PARENTAL-CONSENT] Token Error:', tokenError);
        return NextResponse.json({ error: 'Link de consentimento inválido ou expirado.' }, { status: 400 });
    }

    // 2. Tentar encontrar o Perfil do Pai pelo e-mail
    let { data: parentProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', tokenData.guardian_email)
      .maybeSingle();

    // 3. Gravar o Vínculo Parental (Somente se o pai tiver conta no HUB)
    if (parentProfile?.id) {
        const { error: linkError } = await supabaseAdmin
        .from('parent_child_links')
        .upsert({
            parent_id: parentProfile.id,
            child_id: childId,
            status_consentimento: 'aprovado',
            consent_ip_encrypted: ipHash 
        }, { onConflict: 'parent_id,child_id' });

        if (linkError) {
            console.error('[PARENTAL-CONSENT] Link Insert Error:', linkError.message);
            // Non-fatal, just log it. The token usage is what matters for the child.
        }
    } else {
        console.log('[PARENTAL-CONSENT] Pai não possui conta no HUB. Vínculo na tabela parent_child_links ignorado.');
    }

    // 4. Liberar Perfil do Filho (Ponto Crítico da LGPD/ECA)
    const { error: childUpdateError } = await supabaseAdmin
      .from('profiles')
      .update({
        accepted_terms_version: 'v2.0',
        accepted_at: new Date().toISOString(),
        is_adult: false, 
        guardian_email: tokenData.guardian_email 
      })
      .eq('id', childId);

    if (childUpdateError) {
        console.error('[PARENTAL-CONSENT] Child Update Error:', childUpdateError.message);
        return NextResponse.json({ error: 'Erro ao liberar acesso do menor.' }, { status: 500 });
    }

    // 5. Marcar Token como Usado (SÓ AGORA)
    const { error: tokenFinalError } = await supabaseAdmin
      .from('parental_consent_tokens')
      .update({ status: 'used' })
      .eq('id', tokenId);

    if (tokenFinalError) {
        console.warn('[PARENTAL-CONSENT] Warning: Failed to mark token as used, but flow completed.');
    }

    console.log(`[PARENTAL-SUCCESS] Acesso liberado para Child:${childId} por Parent:${tokenData.guardian_email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Autorização concedida com sucesso. O perfil agora está ativo.' 
    });

  } catch (err: any) {
    console.error('[PARENTAL-CONSENT] Fatal error:', err);
    return NextResponse.json({ error: 'Falha crítica no processador de consentimento.' }, { status: 500 });
  }
}
