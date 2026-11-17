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

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { getShowSiteHref } from '@/lib/subdomain-urls';

export default async function ProfessorSessionRedirectPage({ params }: { params: Promise<{ code: string }> }) {
    const resolvedParams = await params;
    const code = resolvedParams.code?.toUpperCase() || '';
    const headersList = await headers();
    const host = headersList.get('host');
    const targetUrl = getShowSiteHref(`/acompanhe/${code}`, host);
    redirect(targetUrl);
}
