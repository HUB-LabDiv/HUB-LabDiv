// Este programa é um software livre (Licença AGPLv3)
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

const VALID_INVITE_CODES: Record<string, string> = {
  [(process.env.LABDIV_INVITE_CODE || 'LABDIV-IFUSP-2026').toUpperCase()]: 'labdiv',
  'LABDIV': 'labdiv',
  'LABDIV2026': 'labdiv',
  [(process.env.SHOW_INVITE_CODE || 'SHOW-FISICA-2026').toUpperCase()]: 'show-da-fisica',
  'SHOW': 'show-da-fisica',
  'SHOW-DA-FISICA': 'show-da-fisica',
  'SHOWFISICA2026': 'show-da-fisica',
  [(process.env.HS_INVITE_CODE || 'HACKERSPACE-IFUSP').toUpperCase()]: 'hs',
  'HS': 'hs',
  'HACKERSPACE': 'hs',
  'HACKERSPACE-2026': 'hs',
  [(process.env.PROFIS_INVITE_CODE || 'PROFIS-IFUSP-2026').toUpperCase()]: 'profis',
  'PROFIS': 'profis',
  'PROFIS2026': 'profis',
};

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: 'Faça login para ingressar com código.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const rawCode = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';

    if (!rawCode) {
      return NextResponse.json({ ok: false, error: 'Código de convite não fornecido.' }, { status: 400 });
    }

    const matchedOrgSlug = VALID_INVITE_CODES[rawCode];
    if (!matchedOrgSlug) {
      return NextResponse.json({ ok: false, error: 'Código de convite inválido ou expirado.' }, { status: 400 });
    }

    const canonicalSlug =
      matchedOrgSlug === 'show-da-fisica' ? 'show_da_fisica' : matchedOrgSlug;

    // Busca perfil atual do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, is_labdiv, member_initiatives')
      .eq('id', user.id)
      .maybeSingle();

    const currentInits: string[] = Array.isArray(profile?.member_initiatives)
      ? profile.member_initiatives
      : [];

    const nextInits = Array.from(new Set([...currentInits, canonicalSlug]));
    const nextIsLabdiv = matchedOrgSlug === 'labdiv' ? true : Boolean(profile?.is_labdiv);

    await supabase
      .from('profiles')
      .update({
        is_labdiv: nextIsLabdiv,
        member_initiatives: nextInits,
      })
      .eq('id', user.id);

    // Notifica o Aurtistic para garantir o registro imediato em organization_members
    try {
      const aurtisticBase = (
        process.env.NEXT_PUBLIC_AURTISTIC_URL || 'http://localhost:3000'
      ).replace(/\/+$/, '');
      const hubSecret = process.env.HUB_SSO_SECRET || process.env.ADMIN_SECRET_KEY || 'hub-default-sso-secret';

      // Cria um ticket temporário ou emite webhook para o Aurtistic
      await fetch(`${aurtisticBase}/api/auth/hub-embed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticket: 'SYNC_INTERNAL', // O Aurtistic pode sincronizar via SSO ticket no próximo embed
          orgSlug: matchedOrgSlug,
        }),
      }).catch(() => {});
    } catch {}

    const orgDisplayNames: Record<string, string> = {
      labdiv: 'LabDiv IFUSP',
      'show-da-fisica': 'Show de Física',
      hs: 'Hackerspace IFUSP',
      profis: 'Pró-Física (ProFis)',
    };

    return NextResponse.json({
      ok: true,
      orgSlug: matchedOrgSlug,
      orgName: orgDisplayNames[matchedOrgSlug] || matchedOrgSlug,
      member_initiatives: nextInits,
      message: `Você agora faz parte de ${orgDisplayNames[matchedOrgSlug] || matchedOrgSlug}!`,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao processar código.' },
      { status: 500 }
    );
  }
}

