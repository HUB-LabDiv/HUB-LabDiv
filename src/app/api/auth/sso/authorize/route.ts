// Este programa é um software livre (Licença AGPLv3)
// ARQUIVO: src/app/api/auth/sso/authorize/route.ts
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';
import { signHubSsoTicket } from '@/lib/auth/sso-ticket';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const redirectUri = searchParams.get('redirect_uri');
  const rawNext = searchParams.get('next') || '/labdiv';

  // Sanitização do redirect_uri para garantir que seja para o Aurtistic ou localhost
  if (!redirectUri) {
    return NextResponse.json({ error: 'redirect_uri ausente.' }, { status: 400 });
  }

  try {
    const parsedUri = new URL(redirectUri);
    const isAllowedHost =
      parsedUri.hostname === 'localhost' ||
      parsedUri.hostname === '127.0.0.1' ||
      parsedUri.hostname.endsWith('hublabdiv.com.br') ||
      parsedUri.hostname.endsWith('vercel.app');

    if (!isAllowedHost) {
      return NextResponse.json({ error: 'redirect_uri não autorizado.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'redirect_uri inválido.' }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Se o usuário NÃO estiver logado no HUB, redireciona para a tela de login do HUB
  if (!user) {
    const currentEndpoint = `/api/auth/sso/authorize?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&next=${encodeURIComponent(rawNext)}`;
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(currentEndpoint)}`, origin));
  }

  // Usuário autenticado no HUB: busca dados completos no perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, username, full_name, avatar_url, role, is_labdiv, member_initiatives')
    .eq('id', user.id)
    .maybeSingle();

  // Mapeia todas as organizações/iniciativas do usuário
  const orgsSet = new Set<string>();
  if (profile?.is_labdiv) {
    orgsSet.add('labdiv');
  }
  if (Array.isArray(profile?.member_initiatives)) {
    profile.member_initiatives.forEach((init: string) => {
      if (typeof init === 'string' && init.trim()) {
        const s = init.trim().toLowerCase().replace(/_/g, '-');
        if (s === 'hackerspace' || s === 'hs') orgsSet.add('hs');
        else if (s === 'show-da-fisica' || s === 'showdefisica') orgsSet.add('show-da-fisica');
        else if (s === 'profis' || s === 'pro-fis') orgsSet.add('profis');
        else orgsSet.add(s);
      }
    });
  }

  if (profile?.role === 'admin' || profile?.role === 'moderator') {
    orgsSet.add('labdiv');
    orgsSet.add('show-da-fisica');
    orgsSet.add('hs');
    orgsSet.add('profis');
  }

  const organizations = Array.from(orgsSet);
  const secret = process.env.HUB_SSO_SECRET || process.env.ADMIN_SECRET_KEY || 'hub-default-sso-secret';

  // Extrai nome de usuário ou deriva do nome completo
  const rawUsername =
    profile?.username?.trim() ||
    profile?.full_name?.split(' ')[0] ||
    user.email?.split('@')[0] ||
    'membro';

  const ticket = signHubSsoTicket(
    {
      hubUserId: user.id,
      email: profile?.email || user.email || '',
      username: rawUsername,
      fullName: profile?.full_name || rawUsername,
      avatarUrl: profile?.avatar_url || null,
      isLabdiv: Boolean(profile?.is_labdiv),
      organizations,
      role: profile?.role || 'user',
    },
    secret,
    300 // 5 minutos de validade
  );

  // Redireciona de volta para o Aurtistic com o ticket assinado
  const targetCallback = new URL(redirectUri);
  targetCallback.searchParams.set('ticket', ticket);
  targetCallback.searchParams.set('next', rawNext);

  return NextResponse.redirect(targetCallback.toString());
}

