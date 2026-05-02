import { createServerSupabase } from '@/lib/supabase/server';
import React from 'react';

export const metadata = {
    title: 'Admin - Glossário Translacional | HUB Lab-Div',
};

export default async function AdminGlossarioPage() {
    const supabase = await createServerSupabase();

    const { data: palavras, error } = await supabase
        .from('palavras_geradoras')
        .select(`
            *,
            signos_constelacoes (*)
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
                <button className="px-4 py-2 bg-[#0055ff] hover:bg-[#0044cc] text-white rounded-lg font-medium transition-colors flex items-center gap-2 self-start md:self-auto cursor-not-allowed opacity-50" title="Em breve">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Nova Palavra Geradora
                </button>
            </div>

            <div className="grid gap-6">
                {palavras?.length === 0 && (
                    <div className="text-center py-12 border border-gray-800 border-dashed rounded-2xl bg-neutral-900/50">
                        <span className="material-symbols-outlined text-4xl text-gray-600 mb-3">auto_stories</span>
                        <h3 className="text-lg font-medium text-gray-300">Nenhuma palavra cadastrada</h3>
                        <p className="text-gray-500 mt-1">O glossário translacional está vazio.</p>
                    </div>
                )}

                {palavras?.map((palavra: any) => (
                    <div key={palavra.id} className="bg-neutral-900 border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0055ff] to-brand-yellow opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Academic Core */}
                            <div className="md:w-1/3 flex flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-800 pb-4 md:pb-0 md:pr-6">
                                <div className="flex items-center gap-2 justify-between">
                                    <h2 className="text-xl font-bold text-white">{palavra.termo}</h2>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 text-gray-500 hover:text-[#0055ff] hover:bg-gray-800 rounded-lg transition-colors cursor-not-allowed opacity-50" title="Em breve">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button className="p-1.5 text-gray-500 hover:text-brand-red hover:bg-gray-800 rounded-lg transition-colors cursor-not-allowed opacity-50" title="Em breve">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-[#0055ff]">Codificação Acadêmica</span>
                                <p className="text-sm text-gray-300 leading-relaxed mt-1">
                                    {palavra.codificacao_academica}
                                </p>
                            </div>

                            {/* Constellations */}
                            <div className="md:w-2/3">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined text-brand-yellow text-sm">stars</span>
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Constelações de Significado</h3>
                                </div>
                                
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {palavra.signos_constelacoes?.map((constelacao: any) => (
                                        <div key={constelacao.id} className="bg-neutral-800/50 p-4 rounded-xl border border-gray-700/50 flex flex-col gap-2">
                                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-widest bg-gray-800 text-gray-300 w-fit">
                                                {constelacao.constelacao}
                                            </span>
                                            <p className="text-sm text-gray-400 italic">
                                                "{constelacao.descodificacao}"
                                            </p>
                                        </div>
                                    ))}
                                    {(!palavra.signos_constelacoes || palavra.signos_constelacoes.length === 0) && (
                                        <div className="col-span-2 text-sm text-gray-500 italic py-2">
                                            Nenhuma constelação cadastrada. Apenas o sentido acadêmico será exibido.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
