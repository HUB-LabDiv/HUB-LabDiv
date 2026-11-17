// Este programa é um software livre (Licença AGPLv3)
import { NextResponse } from 'next/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminSessionRole } from '@/app/actions/admin';

async function requireHubAdmin() {
  const adminSession = await getAdminSessionRole();
  const isStaffToken = adminSession.role === 'admin' || adminSession.role === 'moderator';

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  let isProfileAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (profile?.role === 'admin' || profile?.role === 'moderator') {
      isProfileAdmin = true;
    }
  }

  if (!isStaffToken && !isProfileAdmin) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    return createAdminClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return supabase;
}

export async function GET(request: Request) {
  try {
    const db = await requireHubAdmin();
    if (!db) {
      return NextResponse.json({ ok: false, error: 'Acesso restrito a administradores.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();

    let req = db
      .from('profiles')
      .select('id, full_name, username, email, role, is_labdiv, member_initiatives')
      .order('full_name', { ascending: true })
      .limit(40);

    if (query) {
      req = req.or(`full_name.ilike.%${query}%,email.ilike.%${query}%,username.ilike.%${query}%`);
    }

    const { data, error } = await req;
    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      profiles: data || [],
      inviteCodes: {
        labdiv: process.env.LABDIV_INVITE_CODE || 'LABDIV-IFUSP-2026',
        'show-da-fisica': process.env.SHOW_INVITE_CODE || 'SHOW-FISICA-2026',
        hs: process.env.HS_INVITE_CODE || 'HACKERSPACE-IFUSP',
        profis: process.env.PROFIS_INVITE_CODE || 'PROFIS-IFUSP-2026',
      },
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao listar membros.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const db = await requireHubAdmin();
    if (!db) {
      return NextResponse.json({ ok: false, error: 'Acesso restrito a administradores.' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const profileId = typeof body.profileId === 'string' ? body.profileId : '';
    const orgSlug = typeof body.orgSlug === 'string' ? body.orgSlug : '';
    const enabled = Boolean(body.enabled);

    if (!profileId || !orgSlug) {
      return NextResponse.json({ ok: false, error: 'Parâmetros inválidos.' }, { status: 400 });
    }

    const { data: currentProfile, error: fetchErr } = await db
      .from('profiles')
      .select('is_labdiv, member_initiatives, email, full_name, username')
      .eq('id', profileId)
      .single();

    if (fetchErr || !currentProfile) {
      return NextResponse.json({ ok: false, error: 'Perfil não encontrado.' }, { status: 404 });
    }

    const currentInits: string[] = Array.isArray(currentProfile.member_initiatives)
      ? currentProfile.member_initiatives
      : [];

    if (orgSlug === 'labdiv') {
      const nextInits = enabled
        ? Array.from(new Set([...currentInits, 'labdiv']))
        : currentInits.filter((i) => i !== 'labdiv');

      const { error: updErr } = await db
        .from('profiles')
        .update({ is_labdiv: enabled, member_initiatives: nextInits })
        .eq('id', profileId);

      if (updErr) {
        return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, is_labdiv: enabled, member_initiatives: nextInits });
    }

    const canonicalKey =
      orgSlug === 'show-da-fisica'
        ? 'show_da_fisica'
        : orgSlug === 'hs' || orgSlug === 'hackerspace'
          ? 'hs'
          : orgSlug === 'profis'
            ? 'profis'
            : orgSlug;

    const nextInits = enabled
      ? Array.from(new Set([...currentInits, canonicalKey]))
      : currentInits.filter((i) => i !== canonicalKey && i !== orgSlug);

    const { error: updErr } = await db
      .from('profiles')
      .update({ member_initiatives: nextInits })
      .eq('id', profileId);

    if (updErr) {
      return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });
    }

    // Sincroniza deterministamente com o Aurtistic server-to-server
    try {
      const aurtisticUrl = (
        process.env.AURTISTIC_URL ||
        process.env.NEXT_PUBLIC_AURTISTIC_URL ||
        'http://localhost:3000'
      ).replace(/\/+$/, '');
      const secret = process.env.HUB_SSO_SECRET || process.env.ADMIN_SECRET_KEY || 'hub-default-sso-secret';
      const crypto = await import('crypto');
      const syncBody = JSON.stringify({
        action: enabled ? 'sync_membership' : 'remove',
        hubUserId: profileId,
        email: currentProfile.email || undefined,
        fullName: currentProfile.full_name || currentProfile.username || undefined,
        orgSlug,
        enabled,
      });
      const hmac = crypto.createHmac('sha256', secret).update(syncBody).digest('hex');

      await fetch(`${aurtisticUrl}/api/auth/hub-embed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`,
          'x-hub-signature': hmac,
        },
        body: syncBody,
      }).catch(() => {});
    } catch {
      // Ignora falha de rede silenciosamente
    }

    return NextResponse.json({ ok: true, member_initiatives: nextInits });
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Erro ao atualizar vínculo.' },
      { status: 500 }
    );
  }
}

