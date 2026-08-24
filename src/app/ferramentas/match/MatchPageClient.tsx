'use client';

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

import { MatchAcademicoTab } from '@/components/profile/MatchAcademicoTab';
import { Profile } from '@/types';

export function MatchPageClient({ profile }: { profile: Profile }) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Título e descrição */}
            <header className="space-y-2 text-center md:text-left">
                <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">
                    Match <span className="text-brand-yellow">Acadêmico</span>
                </h1>
                <p className="text-gray-400 font-medium italic">
                    Conecte-se com colegas, orientadores e oportunidades de pesquisa no IFUSP.
                </p>
            </header>

            {/* Conteúdo principal */}
            <MatchAcademicoTab profile={profile} />
        </div>
    );
}
