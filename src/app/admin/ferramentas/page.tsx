'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React from 'react';
import Link from 'next/link';
import { Construction, Laptop, Route, HeartHandshake, Telescope, ArrowRight } from 'lucide-react';

export default function AdminFerramentasHubPage() {
    return (
        <div className="p-8">
            <div className="mb-12">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                    <Construction className="w-8 h-8 text-brand-yellow" />
                    Moderação do Eixo de Ferramentas
                </h1>
                <p className="text-gray-500 mt-2">Hub centralizado de moderação para utilitários, plataformas e conexões práticas da comunidade.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Aprovação de Softwares */}
                <Link href="/admin/softwares" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-yellow transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Laptop className="w-32 h-32 text-brand-yellow" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-yellow/10 rounded-2xl w-max mb-6">
                            <Laptop className="w-8 h-8 text-brand-yellow" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Aprovação de Softwares</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Aprove ou rejeite envios de softwares didáticos e utilitários da comunidade.</p>
                        <div className="flex items-center gap-2 text-brand-yellow font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

                {/* Trilhas de Aprendizagem */}
                <Link href="/admin/trilhas" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-blue transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Route className="w-32 h-32 text-brand-blue" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-blue/10 rounded-2xl w-max mb-6">
                            <Route className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Trilhas de Aprendizagem</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Moderação e estruturação de guias de estudo colaborativos.</p>
                        <div className="flex items-center gap-2 text-brand-blue font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
                
                {/* Validação do Match */}
                <Link href="/admin/adocoes" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-brand-red transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <HeartHandshake className="w-32 h-32 text-brand-red" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-brand-red/10 rounded-2xl w-max mb-6">
                            <HeartHandshake className="w-8 h-8 text-brand-red" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Validação do Match</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Aprove processos de adoção e mentoria de calouros/veteranos no IFUSP.</p>
                        <div className="flex items-center gap-2 text-brand-red font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
                
                {/* Moderação do Observatório */}
                <Link href="/admin/observatorio" className="group p-8 rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-white/5 hover:border-teal-500 transition-all shadow-sm hover:shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all">
                        <Telescope className="w-32 h-32 text-teal-500" />
                    </div>
                    <div className="flex flex-col h-full relative z-10">
                        <div className="p-4 bg-teal-500/10 rounded-2xl w-max mb-6">
                            <Telescope className="w-8 h-8 text-teal-500" />
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-2">Moderação do Observatório</h2>
                        <p className="text-sm text-gray-500 mb-8 flex-grow">Gerencie telescópios virtuais, eventos celestes e submissões do Observatório.</p>
                        <div className="flex items-center gap-2 text-teal-500 font-bold text-xs uppercase tracking-widest">
                            Acessar Painel <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>

            </div>
        </div>
    );
}
