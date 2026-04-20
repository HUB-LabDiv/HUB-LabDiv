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

import { AdminUnifiedClient } from '@/components/admin/AdminUnifiedClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gerência Administrativa | AdminPanel',
    description: 'Controle de papéis e segurança do sistema.',
};

export default function AdminConfigPage() {
    return <AdminUnifiedClient />;
}
