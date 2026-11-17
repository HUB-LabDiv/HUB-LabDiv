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

import React, { Suspense } from 'react';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminSessionRole } from '@/app/actions/admin';
import { GestaoClient } from './GestaoClient';

export const dynamic = 'force-dynamic';

export default async function GestaoPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; org?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const adminSession = await getAdminSessionRole();

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

  const isAdmin =
    isProfileAdmin ||
    adminSession.role === 'admin' ||
    adminSession.role === 'moderator' ||
    process.env.NODE_ENV !== 'production';

  const initialTab =
    params.tab === 'admin' && isAdmin
      ? 'admin'
      : params.tab === 'studio'
        ? 'studio'
        : 'moderacao';
  const initialOrg =
    params.org === 'show-da-fisica' || params.org === 'show_da_fisica'
      ? 'show-da-fisica'
      : params.org === 'profis' || params.org === 'pro-fis' || params.org === 'pro_fis'
        ? 'profis'
        : params.org === 'hs' || params.org === 'hackerspace'
          ? 'hs'
          : 'labdiv';

  return (
    <MainLayoutWrapper userId={user?.id}>
      <Suspense fallback={<div className="p-8 text-xs font-mono text-gray-500">Carregando Eixo 4...</div>}>
        <GestaoClient isAdmin={isAdmin} initialTab={initialTab} initialOrg={initialOrg} />
      </Suspense>
    </MainLayoutWrapper>
  );
}

