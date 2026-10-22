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
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import { Breadcrumbs } from '@/components/wiki/WikiComponents';
import { ChromeDino } from '@/components/espacos/ChromeDino';
import { MatrixCodeRain } from '@/components/espacos/MatrixCodeRain';
import { DinoMiniGame } from '@/components/espacos/DinoMiniGame';
import { 
    ExternalLink, 
    Calendar, 
    Cpu, 
    CloudRain, 
    Printer, 
    Terminal, 
    Users, 
    Share2, 
    MapPin, 
    Sparkles, 
    ArrowRight,
    Radio,
    Code,
    Compass
} from 'lucide-react';

export const metadata = {
    title: 'Hackerspace IFUSP | Espaço Maker & Colaborativo',
    description: 'Conheça o Hackerspace do Instituto de Física da USP: cultura maker, eletrônica, impressão 3D, estação meteorológica e agenda de cursos.',
};

export default function HackerspacePage() {
    return (
        <MainLayoutWrapper fullWidth={true}>
            <div className="relative min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden font-open-sans transition-colors duration-200">
                {/* Background Matrix Digital Rain effect: Green codes on white (light mode) and green codes on black (dark mode) */}
                <MatrixCodeRain opacity={1} speed={33} />

                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-24">
                    {/* Breadcrumbs Navigation */}
                    <div className="mb-6">
                        <Breadcrumbs 
                            title="Hackerspace IFUSP" 
                            section="Espaços do IF" 
                            sectionHref="/gcif/instituto#espacos-convivencia" 
                            backHref="/gcif/instituto" 
                        />
                    </div>

                    {/* HERO SECTION */}
                    <header className="relative bg-white/95 dark:bg-[#080808]/95 border border-emerald-500/20 dark:border-[#00FF66]/30 rounded-[36px] sm:rounded-[48px] p-6 sm:p-12 shadow-xl dark:shadow-[0_0_50px_rgba(0,255,102,0.1)] backdrop-blur-md mb-16 overflow-hidden transition-colors">
                        {/* Top Terminal Status Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-emerald-500/20 dark:border-[#00FF66]/20 font-mono text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 dark:bg-[#00FF66] animate-pulse"></span>
                                <span className="text-emerald-700 dark:text-[#00FF66] font-black uppercase tracking-wider">
                                    [SYSTEM: ONLINE] // NÚCLEO HACKER &amp; MAKER IFUSP
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-emerald-700/80 dark:text-[#00FF66]/70 text-[11px]">
                                <span>IFUSP_EDIFICIO_PRINCIPAL</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="hidden sm:inline">BAUD_9600_CONNECTED</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-6">
                                <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-emerald-100/90 dark:bg-[#00FF66]/15 border border-emerald-500/30 dark:border-[#00FF66]/40 text-emerald-800 dark:text-[#00FF66] text-xs font-mono font-bold tracking-wider">
                                    <ChromeDino size={20} className="text-emerald-700 dark:text-[#00FF66]" />
                                    <span>CULTURA MAKER &bull; SOFTWARE &bull; HARDWARE LIVRE</span>
                                </div>

                                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white font-bukra tracking-tight uppercase leading-none">
                                    Hackerspace{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-[#FFCC00] dark:from-[#00FF66] dark:via-[#66ff99] dark:to-[#FFCC00]">
                                        IFUSP
                                    </span>
                                </h1>

                                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed font-open-sans">
                                    O laboratório comunitário de inovação autônoma, prototipagem eletrônica, manufatura digital e ciência aberta do Instituto de Física da Universidade de São Paulo. Aberto a toda a comunidade para criar, experimentar e hackear livremente.
                                </p>

                                {/* Action Buttons Grid */}
                                <div className="pt-4 flex flex-wrap gap-3 sm:gap-4">
                                    {/* Primary HS Website Button */}
                                    <a
                                        href="https://hackerspaceifusp.com.br"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00FF66] dark:text-black dark:hover:bg-[#33ff85] font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2.5 shadow-lg shadow-emerald-600/20 dark:shadow-[0_0_25px_rgba(0,255,102,0.4)] hover:scale-105 transition-all"
                                    >
                                        <Compass className="w-4 h-4" />
                                        <span>Site Oficial do HS</span>
                                        <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
                                    </a>

                                    {/* Instagram Button */}
                                    <a
                                        href="https://www.instagram.com/hackerspace.ifusp/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 dark:bg-[#1E1E1E] dark:hover:bg-[#252525] dark:text-white dark:border-white/20 hover:border-[#FFCC00]/50 font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2.5 transition-all hover:scale-105 shadow-sm"
                                    >
                                        <Share2 className="w-4 h-4 text-[#FFCC00]" />
                                        <span>Instagram @hackerspace.ifusp</span>
                                        <ExternalLink className="w-4 h-4 ml-1 opacity-70" />
                                    </a>

                                    {/* Projects Direct Link */}
                                    <a
                                        href="https://hackerspaceifusp.com.br/projects"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-[#00FF66]/10 dark:hover:bg-[#00FF66]/20 dark:text-[#00FF66] dark:border-[#00FF66]/40 font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <Cpu className="w-4 h-4" />
                                        <span>Projetos Maker</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                    </a>

                                    {/* Agenda Direct Link */}
                                    <a
                                        href="https://hackerspaceifusp.com.br/agenda"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-5 py-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#0F4780] border border-[#0F4780]/30 dark:bg-[#0F4780]/40 dark:hover:bg-[#0F4780]/70 dark:text-blue-300 dark:border-[#0F4780] font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2 transition-all shadow-sm"
                                    >
                                        <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        <span>Agenda &amp; Cursos</span>
                                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                                    </a>
                                </div>
                            </div>

                            {/* Pixel Dino Mascot Hero Badge */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-emerald-50/70 dark:bg-[#070e09]/80 rounded-3xl border border-emerald-500/20 dark:border-[#00FF66]/30 text-center relative shadow-sm">
                                <div className="size-28 sm:size-32 rounded-3xl bg-white dark:bg-[#00FF66]/10 border-2 border-emerald-500/30 dark:border-[#00FF66]/40 flex items-center justify-center text-emerald-700 dark:text-[#00FF66] shadow-md dark:shadow-[0_0_35px_rgba(0,255,102,0.25)] mb-4 hover:scale-105 transition-transform">
                                    <ChromeDino size={72} className="text-emerald-700 dark:text-[#00FF66]" animate={true} />
                                </div>
                                <h3 className="font-mono text-sm font-black text-emerald-800 dark:text-[#00FF66] tracking-widest uppercase mb-1">
                                    CHROME DINO PROTOCOL
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans max-w-xs leading-relaxed">
                                    Sem internet? A criatividade nunca fica offline no Hackerspace. Pegue um ferro de solda e construa.
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* INTERACTIVE MINI-GAME: GOOGLE OFFLINE DINO (MATRIX GREEN EDITION) */}
                    <section className="mb-20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-[#00FF66]/10 rounded-xl text-emerald-700 dark:text-[#00FF66] border border-emerald-500/30 dark:border-[#00FF66]/30">
                                    <Terminal className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra uppercase tracking-tight flex items-center gap-2">
                                        Zona Interativa: Jogo Offline do Google Dino
                                    </h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans">
                                        Pressione espaço ou clique para pular os obstáculos no simulador do HS
                                    </p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 dark:bg-[#00FF66]/10 border border-emerald-500/30 dark:border-[#00FF66]/30 text-emerald-800 dark:text-[#00FF66] text-[10px] font-mono font-bold uppercase rounded-full">
                                MATRIX_EDITION v1.0
                            </span>
                        </div>

                        <DinoMiniGame />
                    </section>

                    {/* SECTION: CONHEÇA O ESPAÇO */}
                    <section className="mb-20 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-[#0F4780]/30 border border-blue-200 dark:border-[#0F4780] rounded-2xl text-blue-700 dark:text-blue-400">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-bukra uppercase italic tracking-tight">
                                    Conheça o Espaço
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                                    Um ambiente colaborativo para transformar teoria em projetos reais
                                </p>
                            </div>
                        </div>

                        {/* Overview Text Box */}
                        <div className="p-8 sm:p-10 rounded-[36px] bg-white/95 dark:bg-[#0a0a0a]/95 border border-gray-200 dark:border-[#00FF66]/30 shadow-md dark:shadow-xl space-y-4">
                            <h3 className="text-lg sm:text-xl font-black text-emerald-800 dark:text-[#00FF66] font-bukra uppercase">
                                O que é o Hackerspace IFUSP?
                            </h3>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-open-sans">
                                O <strong>Hackerspace IFUSP</strong> é um espaço autogerido por alunos, pesquisadores e entusiastas da física e da tecnologia. Nosso lema é a ética hacker: aprender fazendo, compartilhar ferramentas e conhecimentos, e transformar ideias em protótipos reais sem burocracia.
                            </p>
                            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-open-sans">
                                Não há barreiras ou pré-requisitos para participar. Se você nunca mexeu com eletrônica, programação ou impressão 3D, o espaço é o lugar ideal para aprender do zero com o apoio mútuo da comunidade maker do IF.
                            </p>
                        </div>

                        {/* Four Pillars Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Pillar 1 */}
                            <div className="bg-white/95 dark:bg-[#080808]/95 border border-gray-200 dark:border-[#00FF66]/30 rounded-[32px] p-6 hover:border-emerald-500 dark:hover:border-[#00FF66] transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md dark:shadow-none">
                                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-[#00FF66]/10 border border-emerald-300 dark:border-[#00FF66]/30 flex items-center justify-center text-emerald-700 dark:text-[#00FF66] mb-5 group-hover:scale-110 transition-transform">
                                    <Cpu className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white font-bukra uppercase mb-2">
                                    Eletrônica &amp; Hardware
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                    Bancadas equipadas com Arduinos, ESP32, sensores físicos, osciloscópios, fontes estabilizadas e estações de solda prontas para uso.
                                </p>
                            </div>

                            {/* Pillar 2 */}
                            <div className="bg-white/95 dark:bg-[#080808]/95 border border-gray-200 dark:border-[#00FF66]/30 rounded-[32px] p-6 hover:border-emerald-500 dark:hover:border-[#00FF66] transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md dark:shadow-none">
                                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-[#00FF66]/10 border border-emerald-300 dark:border-[#00FF66]/30 flex items-center justify-center text-emerald-700 dark:text-[#00FF66] mb-5 group-hover:scale-110 transition-transform">
                                    <Printer className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white font-bukra uppercase mb-2">
                                    Impressão 3D &amp; Manufatura
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                    Impressoras 3D FDM para materializar peças de laboratório, peças de pesquisa científica, cases e projetos pessoais.
                                </p>
                            </div>

                            {/* Pillar 3 */}
                            <div className="bg-white/95 dark:bg-[#080808]/95 border border-gray-200 dark:border-[#00FF66]/30 rounded-[32px] p-6 hover:border-emerald-500 dark:hover:border-[#00FF66] transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md dark:shadow-none">
                                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-[#00FF66]/10 border border-emerald-300 dark:border-[#00FF66]/30 flex items-center justify-center text-emerald-700 dark:text-[#00FF66] mb-5 group-hover:scale-110 transition-transform">
                                    <Code className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white font-bukra uppercase mb-2">
                                    Software Livre &amp; Redes
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                    Servidores comunitários Linux, desenvolvimento open-source, IoT, servidores web e compartilhamento descentralizado de conhecimento.
                                </p>
                            </div>

                            {/* Pillar 4 */}
                            <div className="bg-white/95 dark:bg-[#080808]/95 border border-gray-200 dark:border-[#00FF66]/30 rounded-[32px] p-6 hover:border-emerald-500 dark:hover:border-[#00FF66] transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md dark:shadow-none">
                                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-[#00FF66]/10 border border-emerald-300 dark:border-[#00FF66]/30 flex items-center justify-center text-emerald-700 dark:text-[#00FF66] mb-5 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h4 className="text-base font-black text-gray-900 dark:text-white font-bukra uppercase mb-2">
                                    Colaboração Radical
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                    Tutoria mútua entre estudantes. Traga sua ideia de TCC, dúvida ou vontade de criar e desenvolva ao lado de colegas experientes.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: PROJETOS EM DESTAQUE (ESTAÇÃO METEOROLÓGICA) */}
                    <section className="mb-20 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-100 dark:bg-[#FFCC00]/15 border border-amber-300 dark:border-[#FFCC00]/30 rounded-2xl text-amber-700 dark:text-[#FFCC00]">
                                <Radio className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-bukra uppercase italic tracking-tight">
                                    Projetos em Destaque
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                                    Inovações criadas dentro do espaço com dados abertos
                                </p>
                            </div>
                        </div>

                        {/* BIG SPOTLIGHT CARD: ESTAÇÃO METEOROLÓGICA */}
                        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 dark:from-[#0a140d] dark:via-black dark:to-black border-2 border-emerald-500/30 dark:border-[#00FF66]/50 p-8 sm:p-12 shadow-xl dark:shadow-[0_0_40px_rgba(0,255,102,0.15)] group">
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 dark:bg-[#00FF66]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-400/20 dark:group-hover:bg-[#00FF66]/20 transition-all duration-700" />
                            <div className="absolute bottom-4 right-10 opacity-5 pointer-events-none select-none font-mono text-8xl font-black text-emerald-900 dark:text-[#00FF66]">
                                WEATHER
                            </div>

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                                <div className="lg:col-span-8 space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-[#00FF66]/20 border border-emerald-500/30 dark:border-[#00FF66]/40 text-emerald-800 dark:text-[#00FF66] font-mono text-xs font-bold uppercase">
                                        <CloudRain className="w-3.5 h-3.5" />
                                        <span>PROJETO EMBLEMÁTICO &bull; TELEMETRIA EM TEMPO REAL</span>
                                    </div>

                                    <h3 className="text-2xl sm:text-4xl font-black text-gray-900 dark:text-white font-bukra uppercase tracking-tight">
                                        Estação Meteorológica do IFUSP
                                    </h3>

                                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-open-sans">
                                        Um dos maiores projetos desenvolvidos pelos membros do Hackerspace. A estação realiza a medição contínua e em tempo real de variáveis climáticas do campus da USP, incluindo <strong>temperatura, pressão barométrica, radiação solar, velocidade e direção do vento e umidade</strong>.
                                    </p>

                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-open-sans">
                                        Toda a instrumentação, calibração dos sensores e disponibilização dos dados via API aberta foi concebida por estudantes, integrando física experimental, telecomunicações e programação.
                                    </p>

                                    <div className="pt-4 flex flex-wrap gap-4">
                                        <a
                                            href="https://hackerspaceifusp.com.br/projects"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00FF66] dark:text-black dark:hover:bg-[#33ff85] font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2 shadow-lg shadow-emerald-600/20 dark:shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:scale-105 transition-all"
                                        >
                                            <CloudRain className="w-4 h-4" />
                                            <span>Ver Estação Meteorológica &amp; Projetos</span>
                                            <ExternalLink className="w-4 h-4 ml-1" />
                                        </a>

                                        <a
                                            href="https://hackerspaceifusp.com.br/projects"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3.5 rounded-2xl bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white dark:border-white/20 font-black uppercase tracking-wider text-xs sm:text-sm font-mono flex items-center gap-2 transition-all shadow-sm"
                                        >
                                            <span>Repositório de Projetos</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>

                                {/* Weather Stats Mockup Card */}
                                <div className="lg:col-span-4 bg-white/90 dark:bg-[#08120b] border border-emerald-500/20 dark:border-[#00FF66]/30 rounded-3xl p-6 space-y-4 font-mono text-xs shadow-md dark:shadow-inner">
                                    <div className="text-emerald-800 dark:text-[#00FF66] font-black uppercase text-[11px] pb-2 border-b border-emerald-500/20 dark:border-[#00FF66]/20 flex items-center justify-between">
                                        <span>METEO_TELEMETRY.LIVE</span>
                                        <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-[#00FF66] animate-pulse"></span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-emerald-50/70 dark:bg-[#00FF66]/5 border border-emerald-500/20 dark:border-[#00FF66]/20 p-3 rounded-xl">
                                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">TEMP_EXTERNA</div>
                                            <div className="text-lg font-black text-gray-900 dark:text-white mt-1">23.4 °C</div>
                                        </div>
                                        <div className="bg-emerald-50/70 dark:bg-[#00FF66]/5 border border-emerald-500/20 dark:border-[#00FF66]/20 p-3 rounded-xl">
                                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">PRESSÃO_ATM</div>
                                            <div className="text-lg font-black text-gray-900 dark:text-white mt-1">1013 hPa</div>
                                        </div>
                                        <div className="bg-emerald-50/70 dark:bg-[#00FF66]/5 border border-emerald-500/20 dark:border-[#00FF66]/20 p-3 rounded-xl">
                                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">UMIDADE_REL</div>
                                            <div className="text-lg font-black text-gray-900 dark:text-white mt-1">68 %</div>
                                        </div>
                                        <div className="bg-emerald-50/70 dark:bg-[#00FF66]/5 border border-emerald-500/20 dark:border-[#00FF66]/20 p-3 rounded-xl">
                                            <div className="text-gray-500 dark:text-gray-400 text-[10px]">VENTO_SPEED</div>
                                            <div className="text-lg font-black text-gray-900 dark:text-white mt-1">12 km/h</div>
                                        </div>
                                    </div>

                                    <div className="text-[10px] text-gray-500 dark:text-gray-400 text-center pt-2">
                                        Dados abertos processados no IFUSP
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* SECTION: AGENDA, CURSOS & EVENTOS */}
                    <section className="mb-20 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-brand-blue/20 border border-blue-300 dark:border-brand-blue/40 rounded-2xl text-blue-700 dark:text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-bukra uppercase italic tracking-tight">
                                    Agenda &amp; Cursos do Espaço
                                </h2>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                                    Capacitação aberta, oficinas práticas e maratonas hacker
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Course 1 */}
                            <div className="bg-white/95 dark:bg-[#0a0a0a]/95 border border-gray-200 dark:border-[#00FF66]/20 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-[#00FF66]/50 shadow-sm hover:shadow-md dark:shadow-none transition-all">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-400/40 dark:bg-[#00FF66]/10 dark:text-[#00FF66] dark:border-[#00FF66]/30 text-[10px] font-mono font-bold uppercase">
                                        Oficina Prática
                                    </span>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white font-bukra uppercase mt-4 mb-2">
                                        Introdução ao Arduino &amp; IoT
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed mb-6">
                                        Aprenda os conceitos fundamentais de leitura de sensores analógicos/digitais, controle de atuadores e programação de microcontroladores para ciência.
                                    </p>
                                </div>
                                <div className="text-xs font-mono text-emerald-700 dark:text-[#00FF66] font-bold">
                                    Presencial no IFUSP
                                </div>
                            </div>

                            {/* Course 2 */}
                            <div className="bg-white/95 dark:bg-[#0a0a0a]/95 border border-gray-200 dark:border-[#00FF66]/20 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-[#00FF66]/50 shadow-sm hover:shadow-md dark:shadow-none transition-all">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-400/40 dark:bg-[#FFCC00]/10 dark:text-[#FFCC00] dark:border-[#FFCC00]/30 text-[10px] font-mono font-bold uppercase">
                                        Fabricação Digital
                                    </span>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white font-bukra uppercase mt-4 mb-2">
                                        Modelagem &amp; Impressão 3D
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed mb-6">
                                        Do software CAD à peça final: parâmetros de fatiamento, nivelamento de mesa e tipos de filamentos (PLA, PETG, ABS) para projetos mecânicos.
                                    </p>
                                </div>
                                <div className="text-xs font-mono text-amber-600 dark:text-[#FFCC00] font-bold">
                                    Aberto à comunidade
                                </div>
                            </div>

                            {/* Course 3 */}
                            <div className="bg-white/95 dark:bg-[#0a0a0a]/95 border border-gray-200 dark:border-[#00FF66]/20 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/50 dark:hover:border-[#00FF66]/50 shadow-sm hover:shadow-md dark:shadow-none transition-all">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0F4780] border border-[#0F4780]/30 dark:bg-[#0F4780]/40 dark:text-blue-300 dark:border-[#0F4780] text-[10px] font-mono font-bold uppercase">
                                        Cultura Livre
                                    </span>
                                    <h4 className="text-lg font-black text-gray-900 dark:text-white font-bukra uppercase mt-4 mb-2">
                                        Install Fest &amp; Linux Nights
                                    </h4>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed mb-6">
                                        Traga seu computador para instalar sistemas operacionais livres, configurar ambientes de programação e aprender sobre privacidade digital.
                                    </p>
                                </div>
                                <div className="text-xs font-mono text-blue-600 dark:text-blue-300 font-bold">
                                    Reuniões periódicas
                                </div>
                            </div>
                        </div>

                        {/* CTA Banner for Agenda */}
                        <div className="p-8 sm:p-10 rounded-[32px] bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50/50 dark:from-[#0c1810] dark:via-[#08120b] dark:to-[#0F4780]/30 border border-emerald-500/30 dark:border-[#00FF66]/40 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md dark:shadow-xl">
                            <div className="space-y-2 text-center sm:text-left">
                                <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra uppercase">
                                    Confira o Calendário Completo
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans max-w-xl">
                                    Acesse a agenda oficial no portal do Hackerspace para ver datas de oficinas, reuniões de recepção e próximos eventos no campus.
                                </p>
                            </div>
                            <a
                                href="https://hackerspaceifusp.com.br/agenda"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-[#00FF66] dark:text-black font-black uppercase tracking-wider text-xs font-mono flex items-center gap-2.5 shadow-lg shadow-emerald-600/20 dark:shadow-[0_0_20px_rgba(0,255,102,0.4)] hover:scale-105 transition-all shrink-0"
                            >
                                <Calendar className="w-4 h-4" />
                                <span>Acessar Agenda Oficial</span>
                                <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                        </div>
                    </section>

                    {/* SECTION: LOCALIZAÇÃO & COMO PARTICIPAR */}
                    <section className="p-8 sm:p-12 rounded-[40px] bg-white/95 dark:bg-black/95 border border-gray-200 dark:border-[#00FF66]/30 shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-[#00FF66] text-xs font-mono uppercase font-black">
                                    <MapPin className="w-4 h-4" /> Localização no IFUSP
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-bukra uppercase">
                                    Como Chegar &amp; Participar
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed">
                                    O Hackerspace fica localizado no <strong>Edifício Principal do IFUSP</strong>, Cidade Universitária, Butantã, São Paulo.
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                    Qualquer estudante da USP pode comparecer durante os horários abertos ou entrar em contato através das redes sociais para tirar dúvidas e propor projetos conjuntos.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <a
                                    href="https://www.instagram.com/hackerspace.ifusp/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-[#FFCC00] dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:hover:border-[#FFCC00]/50 text-gray-900 dark:text-white flex flex-col justify-between transition-all group shadow-sm"
                                >
                                    <Share2 className="w-6 h-6 text-[#FFCC00] mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-mono text-xs font-black uppercase">Seguir no Instagram</span>
                                    <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">@hackerspace.ifusp</span>
                                </a>

                                <a
                                    href="https://hackerspaceifusp.com.br"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 hover:border-emerald-500 dark:bg-[#00FF66]/10 dark:hover:bg-[#00FF66]/20 dark:border-[#00FF66]/40 text-emerald-900 dark:text-[#00FF66] flex flex-col justify-between transition-all group shadow-sm"
                                >
                                    <Terminal className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
                                    <span className="font-mono text-xs font-black uppercase">Visitar Portal Oficial</span>
                                    <span className="text-[11px] text-emerald-700 dark:text-[#00FF66]/70 mt-1">hackerspaceifusp.com.br</span>
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </MainLayoutWrapper>
    );
}
