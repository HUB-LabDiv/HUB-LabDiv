import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, MapPin, Clock, ArrowRight, Layers } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Conheça o Espetáculo',
    description: 'História, objetivos pedagógicos, infraestrutura e tradição do Show de Física do Instituto de Física da USP.',
};

export default function ConhecaPage() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-20">
            {/* Header da Página */}
            <div className="text-center space-y-6 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-black text-xs font-mono uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Tradição & Divulgação Científica no IFUSP</span>
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest text-gray-950 dark:text-white">
                    <span className="neon-text-blue">Nossa Trajetória</span> &{' '}
                    <span className="neon-text-green">Proposta</span>
                </h1>
                <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 font-sans leading-relaxed tracking-wide">
                    Mais de três décadas aproximando a física do cotidiano através de experimentos cênicos, rigor científico e diálogo direto com alunos e educadores de todo o país.
                </p>
            </div>

            {/* Seção 1: Origem e História */}
            <section className="p-8 sm:p-14 bg-white dark:bg-black neon-border-blue space-y-6 rounded-none shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black neon-border-red flex items-center justify-center font-mono font-black text-sm text-[#f60011]">
                        93
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider neon-text-red">
                            Origens no Instituto de Física da USP
                        </h2>
                        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">Tradição desde 1993</span>
                    </div>
                </div>

                <div className="space-y-4 text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-sans">
                    <p>
                        O <strong>Show de Física</strong> nasceu no início dos anos 1990 com a missão de transformar a percepção pública sobre o ensino de ciências. Ao invés de fórmulas isoladas no quadro-negro desprovidas de contexto empírico, o show propôs uma abordagem imersiva: trazer os aparatos de demonstração para um palco teatral com iluminação, fumaça, efeitos ópticos e participação ativa da plateia.
                    </p>
                    <p>
                        Ao longo de mais de 30 anos ininterruptos de atividades, o espetáculo já recebeu centenas de milhares de estudantes de escolas municipais, estaduais e particulares de todas as regiões de São Paulo e de outros estados, consolidando-se como uma das mais longevas ações de cultura e extensão da Universidade de São Paulo.
                    </p>
                </div>
            </section>

            {/* Seção 2: Os 4 Atos com Cores Neon */}
            <section className="space-y-10">
                <div className="text-center sm:text-left">
                    <h2 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider neon-text-green">
                        A Curva Dramática dos 4 Atos
                    </h2>
                    <p className="text-sm font-sans text-gray-600 dark:text-gray-400 mt-2">
                        Cada apresentação é estruturada para envolver a plateia do acolhimento interativo ao clímax sensorial.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="p-8 bg-white dark:bg-black neon-border-green space-y-4 rounded-none">
                        <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-[#01f300] text-[#009900] dark:text-[#01f300]">
                            Ato 01 &bull; Pré-Show
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-wider neon-text-green">Recepção e Desafio</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                            Experimentos interativos de mecânica e pressão enquanto a plateia se acomoda no auditório, quebrando a barreira inicial e estimulando o pensamento investigativo dos alunos.
                        </p>
                    </div>

                    <div className="p-8 bg-white dark:bg-black neon-border-blue space-y-4 rounded-none">
                        <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-[#002ffe] text-[#002ffe] dark:text-[#38bdf8]">
                            Ato 02 &bull; Abertura Histórica
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-wider neon-text-blue">Personagens da Ciência</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                            Encenação teatral em homenagem a personalidades icônicas como Marie Curie e Albert Einstein, resgatando a história humana por trás das maiores revoluções científicas.
                        </p>
                    </div>

                    <div className="p-8 bg-white dark:bg-black neon-border-blue space-y-4 rounded-none">
                        <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-[#002ffe] text-[#002ffe] dark:text-[#38bdf8]">
                            Ato 03 &bull; Núcleo de Fenômenos
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-wider neon-text-blue">Eletromagnetismo & Fluidos</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                            O coração do espetáculo: Bobina de Tesla gerando raios audíveis, Máquina de Wimshurst e Canhão de Vórtices Toroidais disparando anéis de fumaça pela plateia.
                        </p>
                    </div>

                    <div className="p-8 bg-white dark:bg-black neon-border-red space-y-4 rounded-none">
                        <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-[#f60011] text-[#f60011]">
                            Ato 04 &bull; Encerramento
                        </span>
                        <h3 className="text-xl font-bold uppercase tracking-wider neon-text-red">Criogenia Extrema (-196°C)</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                            O ápice térmico: nuvens colossais de vapor com nitrogênio líquido em ebulição, transição vítrea de materiais orgânicos e efeitos desenhados para redes sociais.
                        </p>
                    </div>
                </div>
            </section>

            {/* Seção 3: Infraestrutura no IFUSP */}
            <section className="p-8 sm:p-12 bg-white dark:bg-black neon-border-red space-y-8 rounded-none">
                <div className="flex items-center gap-3">
                    <MapPin className="w-7 h-7 text-[#f60011]" />
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider neon-text-red">
                        Auditório Alessandro Volta & Instalações
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-base text-gray-700 dark:text-gray-300 font-sans">
                    <div className="space-y-4">
                        <p className="font-bold text-gray-950 dark:text-white uppercase font-display text-sm tracking-wider">
                            Residência Oficial no IFUSP
                        </p>
                        <p className="leading-relaxed">
                            Instalado permanentemente no Auditório Alessandro Volta, o espaço dispõe de arquibancada escalonada para até 120 pessoas, bancada cenográfica de experimentos com aterramento dedicado de radiofrequência e sistema de exaustão para segurança dos gases.
                        </p>
                        <p className="text-xs font-mono text-[#002ffe] dark:text-[#38bdf8] uppercase tracking-wider">
                            Rua do Matão, Travessa R, 187 &bull; Cidade Universitária, Butantã - SP
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-black neon-border-green space-y-4 flex flex-col justify-between">
                        <div>
                            <h4 className="font-bold uppercase text-xs tracking-widest neon-text-green font-mono">
                                Pronto para agendar sua escola?
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-300 font-sans mt-2 leading-relaxed">
                                As sessões são gratuitas e ocorrem às terças, quartas e quintas-feiras nos turnos manhã e tarde.
                            </p>
                        </div>
                        <Link
                            href="/monte-seu-show"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] font-black text-xs uppercase tracking-widest hover:bg-[#01f300] hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all rounded-none"
                        >
                            <span>Monte seu Show</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
