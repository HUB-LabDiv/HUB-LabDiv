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
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { ArrowRight, Zap, GraduationCap, Users } from 'lucide-react';

export const metadata = {
    title: 'Show da Física | Iniciativas IFUSP',
    description: 'Levando demonstrações de fenômenos físicos ao público em geral.',
};

export default function ShowDaFisicaPage() {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">Show da Física</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
                        O Show da Física visa levar demonstrações de fenômenos físicos ao público em geral, de maneira lúdica e interativa, despertando o interesse pela ciência.
                    </p>
                    
                    <a 
                        href="https://portal.if.usp.br/showdefisica/pt-br" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red text-white rounded-3xl font-bold shadow-xl shadow-brand-red/20 hover:scale-105 transition-transform"
                    >
                        Acessar Portal Oficial
                        <ArrowRight className="w-5 h-5" />
                    </a>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <div className="glass-card rounded-3xl p-8 hover:border-brand-red/20 transition-all flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mb-6">
                            <Zap className="w-8 h-8 text-brand-red" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Experimentos</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Demonstrações práticas e visuais de conceitos de mecânica, eletromagnetismo, termodinâmica e ótica.
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-8 hover:border-brand-blue/20 transition-all flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-6">
                            <GraduationCap className="w-8 h-8 text-brand-blue" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Escolas</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Atendemos escolas públicas e privadas, oferecendo uma experiência educacional única para alunos do ensino básico.
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-8 hover:border-brand-yellow/20 transition-all flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-6">
                            <Users className="w-8 h-8 text-brand-yellow" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Público Geral</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Eventos abertos à comunidade com o objetivo de popularizar a física e a ciência.
                        </p>
                    </div>
                </div>

            </div>
        </MainLayoutWrapper>
    );
}
