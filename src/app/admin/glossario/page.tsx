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

import { createServerSupabase } from '@/lib/supabase/server';
import React from 'react';
import { AdminGlossaryCard } from './AdminGlossaryCard';
import Link from 'next/link';

export const metadata = {
    title: 'Admin - Glossário Translacional | HUB Lab-Div',
};

export default async function AdminGlossarioPage() {
    const supabase = await createServerSupabase();

    const { data: palavras, error } = await supabase
        .from('palavras_geradoras')
        .select(`
            *,
            signos_constelacoes (*),
            palavras_geradas (*)
        `)
        .order('termo', { ascending: true });

    if (error) {
        console.error("Error fetching glossary:", error);
    }

    return (
        <div className="p-8 pb-24 md:pb-8 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#0055ff] text-4xl">menu_book</span>
                        Glossário Translacional
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-2xl">
                        Gerencie as Palavras Geradoras (método de alfabetização científica de Paulo Freire) e suas constelações de significado. Estas palavras geram Tooltips automáticos quando detectadas nos textos.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
                    <Link href="/admin/glossario/mapa" className="px-4 py-2 bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">hub</span>
                        Montar Mapa de Constelações
                    </Link>
                    <button className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044cc] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 cursor-not-allowed opacity-50" title="Em breve">
                        <span className="material-symbols-outlined text-sm">add</span>
                        Nova Palavra Geradora
                    </button>
                </div>
            </div>

            <div className="grid gap-6">
                {palavras?.length === 0 && (
                    <div className="text-center py-12 border border-gray-800 border-dashed rounded-2xl bg-neutral-900/50">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-3">auto_stories</span>
                        <h3 className="text-lg font-medium text-gray-300">Nenhuma palavra cadastrada</h3>
                        <p className="text-gray-500 mt-1">O glossário translacional está vazio.</p>
                    </div>
                )}

                {palavras?.map((palavra: any) => {
                    const dynamicConstellations = palavras.flatMap((p: any) => p.signos_constelacoes?.map((c: any) => c.constelacao) || []);
                    const predefinedConstellations = ['NERD', 'IFUSPIANA', 'ARTÍSTICA', 'JOVEM', 'COTIDIANA'];
                    const allConstellations = Array.from(new Set([...predefinedConstellations, ...dynamicConstellations])).filter(Boolean) as string[];

                    return (
                        <AdminGlossaryCard 
                            key={palavra.id} 
                            palavra={palavra} 
                            allConstellations={allConstellations}
                        />
                    );
                })}
            </div>
        </div>
    );
}
