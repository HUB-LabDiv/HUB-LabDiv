// Este programa é um software livre (Licença AGPLv3)
import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

async function getHubServiceSupabase() {
  const cookieStore = await cookies();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://127.0.0.1:54321',
    serviceKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
}

function normalizeOrgSlug(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/_/g, '-');
  if (s === 'show-da-fisica' || s === 'showdefisica') return 'show-da-fisica';
  if (s === 'hs' || s === 'hackerspace') return 'hs';
  if (s === 'profis' || s === 'pro-fis') return 'profis';
  if (s === 'labdiv') return 'labdiv';
  return s;
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const expectedSecret =
      process.env.HUB_SSO_SECRET ||
      process.env.ADMIN_SECRET_KEY ||
      'hub-default-sso-secret';

    const url = new URL(request.url);
    const secretQuery = url.searchParams.get('secret') || '';
    const isSecretAuthorized = Boolean(
      (token && token === expectedSecret) ||
      (secretQuery && secretQuery === expectedSecret)
    );

    const email = (url.searchParams.get('email') || '').trim().toLowerCase();
    const userId = (url.searchParams.get('userId') || url.searchParams.get('hubUserId') || '').trim();

    const supabase = await getHubServiceSupabase();

    // Se não tiver secret administrativo de serviço, tenta obter usuário da sessão de cookie
    let searchEmail = email;
    let searchId = userId;
    if (!isSecretAuthorized) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 });
      }
      searchId = user.id;
      searchEmail = (user.email || '').toLowerCase().trim();
    }

    if (!searchEmail && !searchId) {
      return NextResponse.json(
        { ok: false, error: 'Parâmetro email ou userId obrigatório para consulta.' },
        { status: 400 }
      );
    }

    interface HubSyncProfileRow {
      id: string;
      full_name: string | null;
      username: string | null;
      email: string | null;
      role: string | null;
      is_labdiv: boolean | null;
      member_initiatives: string[] | null;
    }

    let profile: HubSyncProfileRow | null = null;
    if (searchId) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, username, email, role, is_labdiv, member_initiatives')
        .eq('id', searchId)
        .maybeSingle();
      profile = data as HubSyncProfileRow | null;
    }

    if (!profile && searchEmail) {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, username, email, role, is_labdiv, member_initiatives')
        .ilike('email', searchEmail)
        .maybeSingle();
      profile = data as HubSyncProfileRow | null;
    }

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: 'Perfil de usuário não encontrado no HUB.' },
        { status: 404 }
      );
    }

    const orgsSet = new Set<string>();
    if (profile.is_labdiv) {
      orgsSet.add('labdiv');
    }
    if (Array.isArray(profile.member_initiatives)) {
      profile.member_initiatives.forEach((init: string) => {
        if (typeof init === 'string' && init.trim()) {
          orgsSet.add(normalizeOrgSlug(init));
        }
      });
    }

    const isStaff = profile.role === 'admin' || profile.role === 'moderator';
    if (isStaff) {
      orgsSet.add('labdiv');
      orgsSet.add('show-da-fisica');
      orgsSet.add('hs');
      orgsSet.add('profis');
    }

    return NextResponse.json({
      ok: true,
      profileId: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      username: profile.username,
      role: profile.role,
      isLabdiv: Boolean(profile.is_labdiv || orgsSet.has('labdiv')),
      memberInitiatives: profile.member_initiatives || [],
      organizations: Array.from(orgsSet),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro na consulta de organizações.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    const expectedSecret =
      process.env.HUB_SSO_SECRET ||
      process.env.ADMIN_SECRET_KEY ||
      'hub-default-sso-secret';

    if (!token || token !== expectedSecret) {
      return NextResponse.json({ ok: false, error: 'Não autorizado.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const hubUserId = typeof body.hubUserId === 'string' ? body.hubUserId.trim() : '';
    const rawOrgSlug = typeof body.orgSlug === 'string' ? body.orgSlug.trim().toLowerCase() : '';
    const action = body.action === 'remove' ? 'remove' : 'add';

    if (!rawOrgSlug || (!email && !hubUserId)) {
      return NextResponse.json(
        { ok: false, error: 'Parâmetros insuficientes (email/hubUserId e orgSlug).' },
        { status: 400 }
      );
    }

    const canonicalSlug =
      rawOrgSlug === 'show-da-fisica' || rawOrgSlug === 'showdefisica'
        ? 'show_da_fisica'
        : rawOrgSlug === 'hackerspace' || rawOrgSlug === 'hs'
          ? 'hs'
          : rawOrgSlug === 'profis' || rawOrgSlug === 'pro-fis'
            ? 'profis'
            : rawOrgSlug;

    const supabase = await getHubServiceSupabase();

    // Localiza o perfil do usuário pelo id ou pelo email
    let query = supabase.from('profiles').select('id, is_labdiv, member_initiatives, email');
    if (hubUserId) {
      query = query.eq('id', hubUserId);
    } else {
      query = query.eq('email', email);
    }

    const { data: profile, error: findErr } = await query.maybeSingle();
    if (findErr || !profile) {
      return NextResponse.json(
        { ok: false, error: findErr?.message || 'Perfil de usuário não encontrado no HUB.' },
        { status: 404 }
      );
    }

    const currentInits: string[] = Array.isArray(profile.member_initiatives)
      ? profile.member_initiatives
      : [];

    let nextInits = [...currentInits];
    let nextIsLabdiv = profile.is_labdiv;

    if (action === 'add') {
      if (!nextInits.includes(canonicalSlug)) {
        nextInits.push(canonicalSlug);
      }
      if (canonicalSlug === 'labdiv') {
        nextIsLabdiv = true;
      }
    } else {
      nextInits = nextInits.filter((s) => s !== canonicalSlug && s !== rawOrgSlug);
      if (canonicalSlug === 'labdiv') {
        nextIsLabdiv = false;
      }
    }

    const { error: updErr } = await supabase
      .from('profiles')
      .update({
        is_labdiv: nextIsLabdiv,
        member_initiatives: nextInits,
      })
      .eq('id', profile.id);

    if (updErr) {
      return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      profileId: profile.id,
      member_initiatives: nextInits,
      is_labdiv: nextIsLabdiv,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro na sincronização de membro.' },
      { status: 500 }
    );
  }
}
