// Este programa é um software livre (Licença AGPLv3)
// ARQUIVO: src/app/api/auth/sso/issue-ticket/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { signHubSsoTicket } from '@/lib/auth/sso-ticket';
import { getAdminSessionRole } from '@/app/actions/admin';

function normalizeOrgSlug(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/_/g, '-');
  if (s === 'hackerspace' || s === 'hs') return 'hs';
  if (s === 'show-da-fisica' || s === 'showdefisica') return 'show-da-fisica';
  if (s === 'profis' || s === 'pro-fis' || s === 'pro_fis') return 'profis';
  return s;
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const adminSession = await getAdminSessionRole();
    const isStaffBypass = adminSession.role === 'admin' || adminSession.role === 'moderator';

    if (!user && !isStaffBypass) {
      return NextResponse.json({ error: 'Usuário não autenticado no HUB.' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const redirectUri = body.redirectUri;
    const rawNext = body.next || '/labdiv';

    if (!redirectUri) {
      return NextResponse.json({ error: 'redirectUri ausente.' }, { status: 400 });
    }

    // Busca perfil completo no HUB (quando há usuário Supabase autenticado)
    const { data: profile } = user
      ? await supabase
          .from('profiles')
          .select('id, email, username, full_name, avatar_url, role, is_labdiv, member_initiatives')
          .eq('id', user.id)
          .maybeSingle()
      : { data: null };

    const orgsSet = new Set<string>();
    if (profile?.is_labdiv) {
      orgsSet.add('labdiv');
    }
    if (Array.isArray(profile?.member_initiatives)) {
      profile.member_initiatives.forEach((init: string) => {
        if (typeof init === 'string' && init.trim()) {
          orgsSet.add(normalizeOrgSlug(init));
        }
      });
    }

    const effectiveRole = isStaffBypass ? adminSession.role || 'admin' : profile?.role || 'user';
    if (effectiveRole === 'admin' || effectiveRole === 'moderator') {
      orgsSet.add('labdiv');
      orgsSet.add('show-da-fisica');
      orgsSet.add('hs');
      orgsSet.add('profis');
    }

    const organizations = Array.from(orgsSet);
    const secret = process.env.HUB_SSO_SECRET || process.env.ADMIN_SECRET_KEY || 'hub-default-sso-secret';

    const fallbackAdminEmail = process.env.ADMIN_EMAIL || 'admin@hublabdiv.com.br';
    const resolvedEmail = profile?.email || user?.email || (isStaffBypass ? fallbackAdminEmail : '');
    const rawUsername =
      profile?.username?.trim() ||
      profile?.full_name?.split(' ')[0] ||
      resolvedEmail.split('@')[0] ||
      'membro';

    const ticket = signHubSsoTicket(
      {
        hubUserId: user?.id || 'hub-admin-session',
        email: resolvedEmail,
        username: rawUsername,
        fullName: profile?.full_name || (isStaffBypass ? 'Admin HUB LabDiv' : rawUsername),
        avatarUrl: profile?.avatar_url || null,
        isLabdiv: Boolean(profile?.is_labdiv || orgsSet.has('labdiv')),
        organizations,
        role: effectiveRole,
      },
      secret,
      300 // 5 minutos de validade
    );

    const targetUrl = new URL(redirectUri);
    targetUrl.searchParams.set('ticket', ticket);
    targetUrl.searchParams.set('next', rawNext);

    return NextResponse.json({
      success: true,
      ticket,
      targetUrl: targetUrl.toString(),
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao emitir autorização SSO.' },
      { status: 500 }
    );
  }
}
