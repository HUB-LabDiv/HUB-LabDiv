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
import { Metadata } from 'next';
import { getAdminSessionRole } from '@/app/actions/admin';
import { MonteSeuShowClient } from './MonteSeuShowClient';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] });

export const metadata: Metadata = {
    title: 'Monte seu Show | Show de Física IFUSP',
    description: 'Monte o roteiro personalizado de experimentos do Show de Física e envie a solicitação de agendamento da sua escola.',
};

export default async function MonteSeuShowPage() {
    const adminSession = await getAdminSessionRole();
    const isAdmin = adminSession.role === 'admin' || adminSession.role === 'moderator';

    if (!isAdmin) {
        redirect('/iniciativas/show-da-fisica');
    }

    return <MonteSeuShowClient orbitronClassName={orbitron.className} />;
}

