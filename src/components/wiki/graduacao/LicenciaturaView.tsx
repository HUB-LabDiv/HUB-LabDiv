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
import {
    GraduationCap,
    School,
    BookOpenCheck,
    Users,
    Clock,
    Award,
    Sparkles,
    Calendar,
    Layers,
    HeartHandshake
} from 'lucide-react';
import {
    CourseMetricsGrid,
    SemestersAccordion,
    CalloutRule,
    DownloadCard,
    CourseMetric,
    SemesterBlock
} from './GraduacaoComponents';

const LIC_METRICS: CourseMetric[] = [
    {
        label: 'Carga Horária Total',
        value: '3.480h',
        sub: '2.400h Obrigatórias + 1.080h Opt./Estágio',
        icon: <Clock className="w-5 h-5" />,
        color: 'brand-yellow'
    },
    {
        label: 'Duração Ideal',
        value: '8 a 10 Sem.',
        sub: 'Diurno (4 anos) • Noturno (5 anos)',
        icon: <Calendar className="w-5 h-5" />,
        color: 'brand-blue'
    },
    {
        label: 'Vagas Anuais',
        value: '110 Vagas',
        sub: '50 Diurno • 60 Noturno',
        icon: <GraduationCap className="w-5 h-5" />,
        color: 'brand-yellow'
    },
    {
        label: 'Estágio Docente',
        value: '400 Horas',
        sub: 'Em Escolas Públicas + 400h PCC',
        icon: <School className="w-5 h-5" />,
        color: 'brand-red'
    }
];

// Matriz oficial da Licenciatura em Física conforme PPP 2018 (Diurno / Noturno)
const LIC_SEMESTRES: SemesterBlock[] = [
    {
        semestre: 1,
        titulo: '1º Semestre: Fundamentos de Mecânica, Ótica e Linguagem',
        subtitulo: 'Início da articulação entre física fundamental, cálculo e reflexão pedagógica',
        disciplinas: [
            { codigo: '4300151', nome: 'Fundamentos de Mecânica', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Mecânica newtoniana, conservação de energia e momento' },
            { codigo: '4300160', nome: 'Ótica', creditosAula: 2, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Ótica geométrica, ondulatória e Prática como Componente Curricular (PCC)' },
            { codigo: 'MAT1351', nome: 'Cálculo de Funções de Uma Variável Real I', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Limites, continuidade, derivadas e teoremas fundamentais' },
            { codigo: 'MAT0105', nome: 'Geometria Analítica', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Vetores no plano e no espaço, cônicas e quádricas' },
            { codigo: '4300157', nome: 'Ciência, Educação e Linguagem', creditosAula: 2, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Linguagem científica, textualidade e primeiras reflexões sobre o ensino' }
        ]
    },
    {
        semestre: 2,
        titulo: '2º Semestre: Mecânica Intermediária, Medidas Físicas e Didática Geral',
        subtitulo: 'Experimentos didáticos e imersão na teoria educacional da FEUSP',
        disciplinas: [
            { codigo: '4300153', nome: 'Mecânica', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Dinâmica de sistemas de partículas, colisões e PCC integrada' },
            { codigo: '4300152', nome: 'Introdução às Medidas Físicas', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Tratamento de dados, construção de gráficos e instrumentos didáticos' },
            { codigo: 'MAT1352', nome: 'Cálculo de Funções de Uma Variável Real II', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Técnicas de integração e séries numéricas' },
            { codigo: '4300156', nome: 'Gravitação', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Leis de Kepler, gravitação universal e modelos cosmológicos históricos' },
            { codigo: 'EDM0402', nome: 'Didática', creditosAula: 4, creditosTrab: 2, unidade: 'FEUSP', tipo: 'obrigatória', observacao: 'Processos de ensino-aprendizagem, planejamento escolar e início do estágio (30h)' }
        ]
    },
    {
        semestre: 3,
        titulo: '3º Semestre: Corpos Rígidos, Física do Calor e Psicologia da Educação',
        subtitulo: 'Desenvolvimento cognitivo do estudante e laboratório de mecânica',
        disciplinas: [
            { codigo: '4300255', nome: 'Mecânica dos Corpos Rígidos e Fluidos', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Rotação em torno de eixo fixo, hidrostática e hidrodinâmica com PCC' },
            { codigo: '4300159', nome: 'Física do Calor', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Temperatura, calorimetria, primeira e segunda leis da termodinâmica' },
            { codigo: 'MAT2351', nome: 'Cálculo de Funções de Múltiplas Variáveis I', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Derivadas parciais e extremos de funções de várias variáveis' },
            { codigo: '4300254', nome: 'Laboratório de Mecânica', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Projetos experimentais com sensores e montagens alternativas' },
            { codigo: 'EDF0290', nome: 'Psicologia da Educação', creditosAula: 4, creditosTrab: 2, unidade: 'FEUSP', tipo: 'obrigatória', observacao: 'Teorias da aprendizagem (Piaget, Vygotsky, Ausubel) e estágio (30h)' }
        ]
    },
    {
        semestre: 4,
        titulo: '4º Semestre: Eletromagnetismo Básico, Termo-Estatística e Políticas Públicas',
        subtitulo: 'POEB na FEUSP e Estrutura do Ensino de Física',
        disciplinas: [
            { codigo: '4300270', nome: 'Eletricidade e Magnetismo I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Campos elétricos e magnéticos, lei de Gauss e potencial' },
            { codigo: '4300259', nome: 'Termo-Estatística', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Fundamentos microscópicos da termodinâmica e PCC' },
            { codigo: 'MAT2352', nome: 'Cálculo de Funções de Múltiplas Variáveis II', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Integrais múltiplas, integrais de linha e de superfície' },
            { codigo: 'EDA0463', nome: 'Política e Organização da Educação Básica (POEB)', creditosAula: 4, creditosTrab: 2, unidade: 'FEUSP', tipo: 'obrigatória', observacao: 'Legislação educacional (LDB), gestão democrática e estágio escolar (60h)' },
            { codigo: '4300356', nome: 'Elementos e Estrutura do Ensino de Física', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'História das reformas curriculares e transposição didática' }
        ]
    },
    {
        semestre: 5,
        titulo: '5º Semestre: Ondas, Eletromagnetismo II, Inclusão, Libras e Práticas',
        subtitulo: 'Propostas de ensino inclusivas e 50h de estágio de regência supervisionada',
        disciplinas: [
            { codigo: '4300271', nome: 'Eletricidade e Magnetismo II', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Indução de Faraday, equações de Maxwell e PCC associada' },
            { codigo: '4300357', nome: 'Oscilações e Ondas', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Movimento harmônico, ondas em meios contínuos e dispersão' },
            { codigo: '4300458', nome: 'Propostas e Projetos no Ensino de Física', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Elaboração de sequências didáticas, Educação Especial Inclusiva e Libras' },
            { codigo: '4300390', nome: 'Práticas em Ensino de Física I', creditosAula: 2, creditosTrab: 0, unidade: 'IFUSP', tipo: 'estágio', observacao: 'Estágio Supervisionado em regência de sala de aula (50h de regência)' },
            { codigo: '4300373', nome: 'Laboratório de Eletromagnetismo', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Experimentos clássicos de campo elétrico e indução eletromagnética' }
        ]
    },
    {
        semestre: 6,
        titulo: '6º Semestre: Física Moderna, Metodologia de Ensino e Estágio Aprofundado',
        subtitulo: 'A passagem para o século XX e regência ativa de turmas de Ensino Médio',
        disciplinas: [
            { codigo: '4300372', nome: 'Física Moderna I', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Relatividade especial, radiação de corpo negro, efeito fotoelétrico e PCC' },
            { codigo: '4300377', nome: 'Laboratório de Física Moderna', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Experimentos com lasers, espectroscopia atômica e tubos de raios catódicos' },
            { codigo: 'EDM0425', nome: 'Metodologia do Ensino de Física I', creditosAula: 4, creditosTrab: 2, unidade: 'FEUSP', tipo: 'obrigatória', observacao: 'Análise de livros didáticos, concepções alternativas de estudantes e estágio (70h)' },
            { codigo: '4300391', nome: 'Práticas em Ensino de Física II', creditosAula: 2, creditosTrab: 0, unidade: 'IFUSP', tipo: 'estágio', observacao: 'Estágio supervisionado com acompanhamento coletivo na CoCLic (50h)' }
        ]
    },
    {
        semestre: 7,
        titulo: '7º Semestre: Quântica para o Ensino, Evolução Conceitual e Estágio Final',
        subtitulo: 'História e Filosofia da Física e fechamento das horas de regência escolar',
        disciplinas: [
            { codigo: '4300472', nome: 'Física Moderna II', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Física atômica, nuclear, estado sólido e PCC associada' },
            { codigo: '4300474', nome: 'Evolução dos Conceitos da Física', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Epistemologia e história da ciência de Galileu aos quanta' },
            { codigo: 'EDM0426', nome: 'Metodologia do Ensino de Física II', creditosAula: 4, creditosTrab: 2, unidade: 'FEUSP', tipo: 'obrigatória', observacao: 'Investigação pedagógica na escola e conclusão dos relatórios de estágio (80h)' },
            { codigo: 'OPT-LIC-01', nome: 'Optativa Eletiva em Ensino de Física', creditosAula: 4, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Ex: Tecnologias Digitais na Educação ou Divulgação Científica' }
        ]
    },
    {
        semestre: 8,
        titulo: '8º Semestre: Integralização, Validação de Portfólio ATPA e Formatura',
        subtitulo: 'Consolidação das 400h de estágio, 400h de PCC e 200h de atividades complementares',
        disciplinas: [
            { codigo: '4300490', nome: 'Laboratório de Ensino de Física', creditosAula: 4, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Desenvolvimento e prototipagem de kits e experimentos de baixo custo' },
            { codigo: 'ATPA-TOTAL', nome: 'Atividades Teórico-Práticas de Aprofundamento (ATPA)', creditosAula: 0, creditosTrab: 0, unidade: 'CoCLic', tipo: 'obrigatória', observacao: '200 horas em portfólio validado pela comissão de licenciatura' },
            { codigo: 'OPT-LIVRE-01', nome: 'Optativas Livres em Qualquer Unidade', creditosAula: 8, unidade: 'USP', tipo: 'optativa', observacao: 'Disciplinas interdisciplinares ou de aprofundamento cultural' },
            { codigo: 'EST-CONCL', nome: 'Validação Final das 400h de Estágio Supervisionado', creditosAula: 0, creditosTrab: 0, unidade: 'FEUSP/IF', tipo: 'estágio', observacao: 'Homologação oficial junto aos colegiados para concessão do grau de Licenciado' }
        ]
    }
];

export default function LicenciaturaView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de Identificação do Curso */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#1A1814] to-[#121212] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 font-bukra">
                                Habilitação: Licenciatura
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10 font-mono">
                                PPP Licenciatura 2018 / 2022
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0F4780]/30 text-brand-blue-accent border border-[#0F4780]/50 font-open-sans">
                                CoCLic • IFUSP & FEUSP
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tight">
                            Licenciatura em Física
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-2 leading-relaxed">
                            Curso pioneiro com ingresso independente desde 1993, dedicado a formar o <strong>Educador em Física do Século XXI</strong>. Integração de conteúdos conceituais sólidos de física clássica e moderna com as mais contemporâneas teorias didático-pedagógicas, metodologias ativas, inclusão, Libras, história da ciência e 400h de imersão docente em escolas públicas.
                        </p>
                        <div className="mt-4 text-[11px] text-gray-400 font-open-sans flex flex-wrap items-center gap-y-1 gap-x-4">
                            <span><strong>Comissão Responsável:</strong> Comissão Coordenadora do Curso de Licenciatura em Física (CoCLic)</span>
                            <span><strong>Parceria Interdepartamental:</strong> Instituto de Física (sede) e Faculdade de Educação da USP (FEUSP)</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 shrink-0 text-center w-full md:w-auto">
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-open-sans block mb-1">
                            Carreira na FUVEST
                        </span>
                        <div className="text-xl font-black text-white font-bukra">
                            Licenciatura em Física
                        </div>
                        <span className="text-[11px] text-brand-yellow font-open-sans">
                            Código do Curso: 43021 / 43022
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid de Métricas Oficiais */}
            <CourseMetricsGrid metrics={LIC_METRICS} />

            {/* Os 3 Eixos Formativos do PPP */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow font-open-sans">
                        Estrutura dos 3 Eixos Formativos
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Carga Horária e Distribuição de Créditos
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                        Distribuição harmônica que supera a mera justaposição entre conteúdo e pedagogia (Tabela I do PPP).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-yellow/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-brand-yellow/20 text-brand-yellow">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    Física & Ciências Afins
                                </h4>
                                <span className="text-[10px] text-brand-yellow font-mono">90 CA + 8 CT (+ 8 Opt)</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Mecânica, Física do Calor, Termo-Estatística, Eletricidade e Magnetismo I e II, Ótica, Física Moderna I e II, Cálculo I a IV e Geometria Analítica.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-blue/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-[#0F4780]/30 text-brand-blue-accent">
                                <School className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    Formação Pedagógica (FEUSP)
                                </h4>
                                <span className="text-[10px] text-brand-blue-accent font-mono">12 CA + 3 CT (+ 4 Opt)</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Didática Geral (EDM0402), Psicologia da Educação, Políticas e Organização da Educação Básica (POEB - EDA0463) e Sociologia da Educação.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-red/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-brand-red/20 text-brand-red">
                                <BookOpenCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    Ensino de Física (IFUSP)
                                </h4>
                                <span className="text-[10px] text-brand-red font-mono">22 CA + 7 CT (+ 8 Opt)</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Ciência, Educação e Linguagem; Elementos e Estruturas; Práticas de Ensino de Física; Propostas e Projetos (Libras/Inclusão); Evolução dos Conceitos.
                        </p>
                    </div>
                </div>
            </div>

            {/* As 3 Dimensões Formativas Especiais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-red/20 text-brand-red">
                            <School className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            400h de Estágio Escolar
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-3">
                        Vivência real da prática docente em escolas públicas de Ensino Fundamental e Médio:
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-400 font-open-sans">
                        <li>• Análise institucional e gestão da escola pública.</li>
                        <li>• Observação de aulas com professores experientes.</li>
                        <li>• Regência efetiva de aulas sob supervisão docente.</li>
                        <li>• Até 100h em museus de ciências e centros de ciência.</li>
                    </ul>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-yellow/20 text-brand-yellow">
                            <Layers className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            400h de PCC Integradas
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-3">
                        <strong>Práticas como Componente Curricular:</strong>
                    </p>
                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                        Evitam a fragmentação curricular inserindo exercícios de docência, transposição didática e concepção de kits pedagógicos diretamente nas matérias de Física (Ótica, Mecânica, Corpos Rígidos, Termo-Estatística, Eletromagnetismo II e Física Moderna).
                    </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-[#0F4780]/30 text-brand-blue-accent">
                            <Award className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            200h de ATPA (Portfólio)
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-3">
                        <strong>Atividades Teórico-Práticas:</strong>
                    </p>
                    <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                        Integralizadas por portfólio autônomo analisado pela CoCLic: iniciação científica no PIEC, projetos PIBID, Residência Pedagógica, monitoria voluntária, organização de eventos e mostras científicas.
                    </p>
                </div>
            </div>

            {/* Diretrizes de Estágio Supervisionado e Formação Docente */}
            <CalloutRule
                tag="DIRETRIZES CURRICULARES NACIONAIS (CNE/CP 02/2015 & CEE/SP)"
                title="Estágio Supervisionado em Escolas Públicas (400 Horas)"
                description="O curso de Licenciatura em Física do IFUSP cumpre com rigor as diretrizes nacionais para formação de professores da Educação Básica, exigindo 400 horas de Estágio Curricular Supervisionado em escolas públicas (observação e regência de turmas reais de Ensino Fundamental e Médio), 400 horas de Prática como Componente Curricular (PCC) articuladas aos conteúdos físicos e 200 horas de ATPA integralizadas por portfólio discente."
                color="brand-yellow"
            />

            {/* Matriz Curricular Semestral */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow font-open-sans">
                            Grade Curricular Semestral
                        </span>
                        <h3 className="text-xl font-bold text-white font-bukra mt-1">
                            Progressão Semestral da Licenciatura
                        </h3>
                        <p className="text-xs text-gray-400 font-open-sans mt-0.5">
                            Matriz curricular diurna (8 semestres) e noturna (10 semestres) com carga de estágio e PCC.
                        </p>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shrink-0">
                        Total Obrigatório: 124 CA + 18 CT (2.400 Horas)
                    </span>
                </div>

                <SemestersAccordion semestres={LIC_SEMESTRES} accentColor="brand-yellow" />
            </div>

            {/* Programas de Apoio e Bolsas */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow font-open-sans">
                        Espaços Formativos & Bolsas de Estudo
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Oportunidades Específicas para Licenciandos
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-open-sans">
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <HeartHandshake className="w-4 h-4" /> PIBID (CAPES)
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Iniciação à docência em escolas públicas desde o início do curso com bolsa remunerada mensal.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-blue-accent font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <School className="w-4 h-4" /> Residência Pedagógica
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Imersão intensiva de regência docente na segunda metade do curso sob tutoria na escola parceira.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> PUB - USP
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Programa Unificado de Bolsas da USP com projetos em pesquisa de ensino de física e extensão.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-red font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Users className="w-4 h-4" /> PEEG (Ensino USP)
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Monitoria de graduação orientada para o desenvolvimento de competências didáticas no IFUSP.
                        </p>
                    </div>
                </div>
            </div>

            {/* Documentos Oficiais & Download */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white font-bukra mb-4">
                    Documentos Oficiais da Licenciatura em Física
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <DownloadCard
                        title="PPP Licenciatura (PDF)"
                        subtitle="Projeto Político-Pedagógico Completo da Licenciatura"
                        href="http://portal.if.usp.br/coclic/sites/portal.if.usp.br.coclic/files/PPP-LIC-IFUSP-2018.pdf"
                    />
                    <DownloadCard
                        title="Portal Oficial da CoCLic"
                        subtitle="Comissão Coordenadora do Curso de Licenciatura"
                        href="https://portal.if.usp.br/coclic/"
                        isExternal
                    />
                    <DownloadCard
                        title="Página na CG-IFUSP"
                        subtitle="Informações da Comissão de Graduação e Manuais"
                        href="https://portal.if.usp.br/cg/licenciatura-em-fisica"
                        isExternal
                    />
                </div>
            </div>
        </div>
    );
}
