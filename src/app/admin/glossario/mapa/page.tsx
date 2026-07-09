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

import React from 'react';
import MapaClient from './MapaClient';
import { getGlossary } from '@/app/enviar/actions/glossaryActions';
import Link from 'next/link';

export const metadata = {
    title: 'HUB LabDiv | Construtor de Constelações',
};

export default async function MapaConstelacoesPage() {
    const { data: glossario, success } = await getGlossary();

    return (
        <div className="p-8 pb-32">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold uppercase tracking-widest text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-brand-yellow text-4xl">hub</span>
                        Constelações
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-2xl">
                        Construa a visualização das constelações linguísticas. Arraste as palavras e crie as conexões que formarão o universo semântico no Grande Colisor.
                    </p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/glossario" className="bg-gray-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">menu_book</span>
                        Aprovar Palavras
                    </Link>
                    <Link href="/gcif" target="_blank" className="bg-brand-blue/20 text-brand-blue border border-brand-blue/30 font-bold py-2 px-6 rounded-lg hover:bg-brand-blue/30 transition-colors uppercase tracking-widest text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                        Ver no GCIF
                    </Link>
                </div>
            </div>

            {!success ? (
                <div className="p-8 text-center text-brand-red bg-brand-red/10 border border-brand-red/30 rounded-xl">
                    Falha ao carregar o glossário. Verifique o console.
                </div>
            ) : (
                <MapaClient glossario={glossario || []} />
            )}
        </div>
    );
}
