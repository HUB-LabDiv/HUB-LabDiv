'use client';

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

import React from 'react';
import Link from 'next/link';
import { GraduationCap, Clock, CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

export function Block4PreShowBooking() {
    return (
        <section className="py-20 border-b-2 border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-bold uppercase tracking-wider neon-text-red mb-4">
                        Orientações para Escolas & Agendamento
                    </h2>
                    <p className="text-base sm:text-lg font-sans text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Regras essenciais para coordenadores e professores organizarem a visita da sua turma ao IFUSP.
                    </p>
                </div>

                {/* Os 3 Cards Idênticos à Vitrine */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {/* Público Alvo */}
                    <div className="bg-white dark:bg-black p-8 neon-border-green shadow-lg dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 rounded-none">
                        <GraduationCap className="w-16 h-16 text-[#009900] dark:text-[#01f300] mb-6 drop-shadow-[0_0_10px_rgba(1,243,0,0.4)] group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-4 uppercase text-[#009900] dark:text-[#01f300] tracking-wider">
                            Público Alvo
                        </h3>
                        <div className="font-sans text-sm text-gray-600 dark:text-gray-300 space-y-2">
                            <p>Do 1º ano do E.F. ao 3º ano do E.M.</p>
                            <p className="pt-2 font-bold text-gray-900 dark:text-white">Dividido em Faixas:</p>
                            <ul className="text-xs space-y-1">
                                <li>Faixa 1: 1º ao 4º ano (E.F.)</li>
                                <li>Faixa 2: 5º ao 7º ano (E.F.)</li>
                                <li>Faixa 3: 8º ano ao 3º ano (E.M.)</li>
                            </ul>
                        </div>
                    </div>

                    {/* Duração */}
                    <div className="bg-white dark:bg-black p-8 neon-border-blue shadow-lg dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 rounded-none">
                        <Clock className="w-16 h-16 text-[#002ffe] mb-6 drop-shadow-[0_0_10px_rgba(0,47,254,0.4)] group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-4 uppercase text-[#002ffe] dark:text-[#38bdf8] tracking-wider">
                            Duração
                        </h3>
                        <p className="font-sans text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Cada apresentação tem aproximadamente<br />
                            <span className="text-3xl font-black text-gray-950 dark:text-white block mt-4 drop-shadow-[0_0_5px_rgba(0,47,254,0.3)] dark:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]">
                                2 HORAS
                            </span>
                        </p>
                    </div>

                    {/* Dias e Horários */}
                    <div className="bg-white dark:bg-black p-8 neon-border-red shadow-lg dark:shadow-none flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 rounded-none">
                        <CalendarDays className="w-16 h-16 text-[#f60011] mb-6 drop-shadow-[0_0_10px_rgba(246,0,17,0.4)] group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-4 uppercase text-[#f60011] tracking-wider">
                            Dias e Horários
                        </h3>
                        <p className="font-sans text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Sessões regulares às<br />
                            <strong className="text-gray-950 dark:text-white">Terças, Quartas e Quintas-feiras</strong>
                        </p>
                        <div className="mt-4 flex gap-4 w-full justify-center">
                            <span className="px-4 py-1.5 bg-red-50 dark:bg-transparent border border-[#f60011] text-[#f60011] font-bold text-xs">
                                10:00
                            </span>
                            <span className="px-4 py-1.5 bg-red-50 dark:bg-transparent border border-[#f60011] text-[#f60011] font-bold text-xs">
                                14:00
                            </span>
                        </div>
                    </div>
                </div>

                {/* Banner de Ação Monte seu Show com Borda Neon Vermelha */}
                <div className="p-8 sm:p-12 bg-white dark:bg-black neon-border-red flex flex-col md:flex-row items-center justify-between gap-8 rounded-none">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#f60011] block">
                            Ferramenta de Agendamento do HUB
                        </span>
                        <h3 className="text-2xl sm:text-4xl font-black uppercase text-gray-950 dark:text-white tracking-wider">
                            Monte o Roteiro do Seu Show
                        </h3>
                        <p className="text-sm font-sans text-gray-600 dark:text-gray-300 max-w-2xl">
                            Escolha as experiências dos 4 Atos que melhor dialogam com o planejamento de aula da sua escola e receba a confirmação do protocolo com os códigos interativos da sua turma.
                        </p>
                    </div>

                    <Link
                        href="/monte-seu-show"
                        className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest text-sm hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_25px_#f60011] transition-all rounded-none shrink-0"
                    >
                        <span>Iniciar Agendamento</span>
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
