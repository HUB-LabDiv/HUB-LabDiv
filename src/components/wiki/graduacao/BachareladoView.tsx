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
    Atom,
    Clock,
    Award,
    Layers,
    Binary,
    ShieldCheck,
    Cpu,
    Sparkles,
    CheckCircle2,
    Calendar,
    Compass,
    Database,
    LineChart
} from 'lucide-react';
import {
    CourseMetricsGrid,
    SemestersAccordion,
    CalloutRule,
    DownloadCard,
    CourseMetric,
    SemesterBlock
} from './GraduacaoComponents';

const BACH_METRICS: CourseMetric[] = [
    {
        label: 'Carga Horária Total',
        value: '2.600h',
        sub: '136 CA + 8 CT + AEx',
        icon: <Clock className="w-5 h-5" />,
        color: 'brand-blue'
    },
    {
        label: 'Duração Ideal',
        value: '8 a 10 Sem.',
        sub: 'Integral (4a) • Noturno (5a)',
        icon: <Calendar className="w-5 h-5" />,
        color: 'brand-yellow'
    },
    {
        label: 'Vagas Anuais',
        value: '135 Vagas',
        sub: '60 Integral • 75 Noturno',
        icon: <Atom className="w-5 h-5" />,
        color: 'brand-blue'
    },
    {
        label: 'Extensão (AEx)',
        value: '260 Horas',
        sub: '10% Mínimo Curricular',
        icon: <Award className="w-5 h-5" />,
        color: 'brand-red'
    }
];

// Grade representativa do Bacharelado conforme PPP 2026 (Integral / Noturno)
const BACH_SEMESTRES: SemesterBlock[] = [
    {
        semestre: 1,
        titulo: '1º Semestre: Fundamentos de Mecânica e Linguagem Matemática',
        subtitulo: 'Aclimatação ao rigor conceitual e ferramental de cálculo diferencial',
        disciplinas: [
            { codigo: '4302111', nome: 'Física I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Mecânica newtoniana, leis de conservação, oscilações' },
            { codigo: '4302113', nome: 'Física Experimental I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Tratamento de dados experimentais, incertezas e medidas' },
            { codigo: 'MAT2453', nome: 'Cálculo Diferencial e Integral I', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Limites, continuidade, derivadas e integrais de uma variável' },
            { codigo: 'MAT0112', nome: 'Vetores e Geometria', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Espaços euclidianos, vetores e geometria analítica' }
        ]
    },
    {
        semestre: 2,
        titulo: '2º Semestre: Gravitação, Fluidos, Ondas e Cálculo em Múltiplas Dimensões',
        subtitulo: 'Aprofundamento fenomenológico e ampliação do aparato matemático',
        disciplinas: [
            { codigo: '4302112', nome: 'Física II', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Fluidos, oscilações amortecidas, ondas e acústica' },
            { codigo: '4302114', nome: 'Física Experimental II', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Experimentos em oscilações mecânicas, ondas e ressonância' },
            { codigo: 'MAT2454', nome: 'Cálculo Diferencial e Integral II', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Funções de várias variáveis, derivadas parciais e extremos' },
            { codigo: 'MAT0122', nome: 'Álgebra Linear I', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Espaços vetoriais, transformações lineares, autovalores e autovetores' }
        ]
    },
    {
        semestre: 3,
        titulo: '3º Semestre: Eletrostática, Magnetostática e Análise Vetorial',
        subtitulo: 'Entrada no eletromagnetismo clássico e campos vetoriais',
        disciplinas: [
            { codigo: '4302211', nome: 'Física III', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Eletrostática, dielétricos, corrente elétrica e campos magnéticos' },
            { codigo: '4302213', nome: 'Física Experimental III', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Instrumentação elétrica, circuitos DC e mapeamento de campo' },
            { codigo: 'MAT0216', nome: 'Cálculo Diferencial e Integral III', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Integrais múltiplas, integrais de linha, teoremas de Green, Stokes e Gauss' },
            { codigo: '4300218', nome: 'Introdução à Física Computacional', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Modelagem computacional, programação e simulação de sistemas físicos' }
        ]
    },
    {
        semestre: 4,
        titulo: '4º Semestre: Equações de Maxwell, Ótica Ondulatória e Métodos Numéricos',
        subtitulo: 'Conclusão da física clássica básica e ferramentas computacionais avançadas',
        disciplinas: [
            { codigo: '4302212', nome: 'Física IV', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Indução de Faraday, equações de Maxwell, ondas EM e ótica' },
            { codigo: '4302214', nome: 'Física Experimental IV', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Circuitos AC, ressonância RLC, interferência e difração da luz' },
            { codigo: 'MAT0220', nome: 'Cálculo Diferencial e Integral IV', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Equações diferenciais ordinárias e séries de potências/Fourier' },
            { codigo: 'MAP0214', nome: 'Cálculo Numérico', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Resolução numérica de equações, interpolação e integração numérica' }
        ]
    },
    {
        semestre: 5,
        titulo: '5º Semestre: Mecânica Analítica, Métodos Matemáticos e Termodinâmica',
        subtitulo: 'Início do ciclo formal avançado: formulação lagrangiana e hamiltoniana',
        disciplinas: [
            { codigo: '4302305', nome: 'Mecânica I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Mecânica lagrangiana e hamiltoniana, movimento sob força central' },
            { codigo: '4302204', nome: 'Física Matemática I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Funções de variável complexa, resíduos e transformadas integrais' },
            { codigo: '4300208', nome: 'Introdução à Termodinâmica', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Potenciais termodinâmicos, leis da termodinâmica e transições de fase' },
            { codigo: '4302313', nome: 'Física Experimental V', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Experimentos em física moderna, radiação térmica, efeito fotoelétrico' }
        ]
    },
    {
        semestre: 6,
        titulo: '6º Semestre: Teoria Eletromagnética e Introdução à Física Quântica',
        subtitulo: 'Formulações fundamentais e primeiros passos no mundo microscópico',
        disciplinas: [
            { codigo: '4302303', nome: 'Eletromagnetismo I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Potenciais eletrostáticos, problemas de contorno, radiação dipolar' },
            { codigo: '4302311', nome: 'Física Quântica', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Dualidade onda-partícula, equação de Schrödinger unidimensional' },
            { codigo: 'OPT-01', nome: 'Optativa Eletiva IFUSP I', creditosAula: 4, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Escolha orientada entre as linhas departamentais do IFUSP' },
            { codigo: 'OPT-LIVRE', nome: 'Optativa Livre I', creditosAula: 4, unidade: 'USP', tipo: 'optativa', observacao: 'Vagas garantidas no IAG, IQ, IGc, IO ou IME' }
        ]
    },
    {
        semestre: 7,
        titulo: '7º Semestre: Mecânica Quântica Formal e Mecânica Estatística',
        subtitulo: 'Estruturação quântica rigorosa e conexão microscópico-macroscópico',
        disciplinas: [
            { codigo: '4302403', nome: 'Mecânica Quântica I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Notação de Dirac, operadores, átomo de hidrogênio, momento angular' },
            { codigo: '4302401', nome: 'Mecânica Estatística', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Ensembles microcanônico, canônico e grande-canônico, gases quânticos' },
            { codigo: 'OPT-02', nome: 'Optativa Eletiva IFUSP II', creditosAula: 4, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Ex: Teoria da Relatividade, Estrutura da Matéria, Física Nuclear' },
            { codigo: 'AEX-01', nome: 'Atividades Curriculares Extensionistas (ACE)', creditosAula: 4, unidade: 'IFUSP', tipo: 'extensão', observacao: 'Projetos de extensão universitária dialógica com a sociedade (260h totais)' }
        ]
    },
    {
        semestre: 8,
        titulo: '8º Semestre: Eletivas Avançadas, Iniciação Científica e Conclusão',
        subtitulo: 'Personalização do currículo para inserção em pós-graduação ou mercado de ponta',
        disciplinas: [
            { codigo: 'OPT-03', nome: 'Optativa Eletiva IFUSP III', creditosAula: 4, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Ex: Física de Partículas, Matéria Condensada, Óptica Quântica' },
            { codigo: 'OPT-04', nome: 'Optativa Eletiva IFUSP IV', creditosAula: 4, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Ex: Métodos Computacionais Avançados, Física de Plasmas' },
            { codigo: 'OPT-05', nome: 'Optativa Livre II', creditosAula: 4, unidade: 'USP', tipo: 'optativa', observacao: 'Disciplinas interdisciplinares ou aprofundamento específico' },
            { codigo: 'AAC-TOTAL', nome: 'Atividades Acadêmicas Complementares (AAC)', creditosAula: 0, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: '60 horas registradas nas modalidades AACG, AACCE ou AACPq' }
        ]
    }
];

export default function BachareladoView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de Identificação do Curso */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#181818] to-[#121212] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#0F4780]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0F4780]/30 text-brand-blue-accent border border-[#0F4780]/50 font-bukra">
                                Habilitação: Bacharelado
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10 font-mono">
                                PPP Ingressantes 2026+
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 font-open-sans">
                                CoC-B • CG-IFUSP
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tight">
                            Bacharelado em Física
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-2 leading-relaxed">
                            Formação científica rigorosa com foco em autonomia intelectual, domínio das teorias fundamentais da física (clássica, quântica, estatística e relativística), instrumental matemático refinado, modelagem computacional e sólida prática laboratorial.
                        </p>
                        <div className="mt-4 text-[11px] text-gray-400 font-open-sans flex flex-wrap items-center gap-y-1 gap-x-4">
                            <span><strong>Coordenador:</strong> Prof. Dr. Alexandre Lima Correia</span>
                            <span><strong>Vice-Coordenador:</strong> Prof. Dr. Renato Higa</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 shrink-0 text-center w-full md:w-auto">
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-open-sans block mb-1">
                            Carreira na FUVEST
                        </span>
                        <div className="text-xl font-black text-white font-bukra">
                            Física - Bacharelado
                        </div>
                        <span className="text-[11px] text-brand-blue-accent font-open-sans">
                            Código do Curso: 43011 / 43012
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid de Métricas Oficiais */}
            <CourseMetricsGrid metrics={BACH_METRICS} />

            {/* Os 4 Blocos de Disciplinas Obrigatórias (96 Créditos-Aula) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4780] dark:text-brand-blue-accent font-open-sans">
                        Estrutura Conceitual do PPP 2026
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Os 4 Blocos de Disciplinas Obrigatórias (96 CA + 8 CT)
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                        A base obrigatória foi desenhada para garantir o domínio conceitual completo sem lacunas formativas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-[#0F4780]/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-[#0F4780]/20 text-brand-blue-accent">
                                <Atom className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    1. Teóricas Básicas (6 Disciplinas • 20 CA)
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono">Física I a IV, Termodinâmica, Física Quântica</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Ênfase na fenomenologia clássica e moderna: mecânica newtoniana, fluidos, termodinâmica, ótica ondulatória, eletromagnetismo e dualidade quântica fundamental.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-yellow/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-brand-yellow/20 text-brand-yellow">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    2. Experimentais (5 Disciplinas • 20 CA)
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono">Física Experimental I a V</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Método científico, análise estatística rigorosa de medidas, instrumentação física, eletrônica básica e experimentos históricos de física moderna e radiação.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-yellow/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-brand-yellow/20 text-brand-yellow">
                                <Binary className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    3. Matemática & Computação (8 Disciplinas • 36 CA)
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono">Cálculo I-IV, Álgebra Linear, Fís. Matemática, Computação</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            A linguagem formal da física: cálculo de funções reais e complexas, vetores, equações diferenciais, álgebra matricial e física computacional com simulações.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-red/40 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-xl bg-brand-red/20 text-brand-red">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white font-bukra">
                                    4. Teóricas Avançadas (4 Disciplinas • 16 CA)
                                </h4>
                                <span className="text-[10px] text-gray-400 font-mono">Mecânica I, Eletromagnetismo I, Quântica I, Mec. Estatística</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                            Formulações modernas e rigorosas das grandes teorias da física contemporânea, integrando o formalismo lagrangiano/hamiltoniano e a mecânica estatística.
                        </p>
                    </div>
                </div>
            </div>

            {/* Alerta de Regra Oficial de Reoferecimento */}
            <CalloutRule
                tag="REGULAMENTO ESPECIAL DA GRADUAÇÃO"
                title="Reoferecimento Remoto no Semestre Subsequente"
                description="Conforme aprovado no novo PPP do Bacharelado em Física, alunos que forem reprovados nas disciplinas de Física I, II, III ou IV com nota entre 3,0 e 4,9 e com frequência mínima de 70% têm direito ao reoferecimento da respectiva disciplina em formato remoto no semestre imediatamente subsequente, garantindo continuidade nos fluxos de pré-requisitos sem trancamento ou atraso desnecessário na grade."
                color="brand-blue"
            />

            {/* Matriz Curricular Detalhada */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4780] dark:text-brand-blue-accent font-open-sans">
                            Grade Curricular Semestral
                        </span>
                        <h3 className="text-xl font-bold text-white font-bukra mt-1">
                            Progressão Semestral Recomendada (PPP 2026)
                        </h3>
                        <p className="text-xs text-gray-400 font-open-sans mt-0.5">
                            Clique em cada semestre para inspecionar os códigos do JúpiterWeb, unidades ministrantes e créditos.
                        </p>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shrink-0">
                        Total Mínimo: 136 CA (2040h) + 8 CT (240h)
                    </span>
                </div>

                <SemestersAccordion semestres={BACH_SEMESTRES} accentColor="brand-blue" />
            </div>

            {/* Curricularização da Extensão e AAC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-red/20 text-brand-red">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            Curricularização da Extensão (260h • 10%)
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-4">
                        Em atendimento à Resolução CNE/CES 07/2018 e Deliberação CEE 216/2023, todo estudante deve integralizar pelo menos 260 horas em <strong>Atividades Curriculares Extensionistas (ACE / AEX)</strong>.
                    </p>
                    <ul className="space-y-2 text-xs text-gray-400 font-open-sans">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                            <span>Disciplinas do IFUSP e de outras unidades com carga horária extensionista cadastrada.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                            <span>Projetos e programas de extensão dialógica registrados junto à CCEx do IFUSP.</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />
                            <span>Cursos, eventos científicos, feiras de ciências e prestação de serviços técnicos à comunidade.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-yellow/20 text-brand-yellow">
                            <Award className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            Atividades Complementares (AAC • 60h)
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-4">
                        Integralização obrigatória de <strong>2 créditos-trabalho (60 horas)</strong> divididos entre as três dimensões formativas avaliadas pelas comissões do IFUSP:
                    </p>
                    <div className="space-y-2.5 text-xs text-gray-300 font-open-sans">
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">AACG (Graduação):</strong>
                            Monitoria voluntária, representação discente em órgãos colegiados, semanas acadêmicas.
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">AACCE (Cultura e Extensão):</strong>
                            Organização de eventos culturais, mostras do Show da Física, visitas guiadas.
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">AACPq (Pesquisa):</strong>
                            Participação no SIICUSP, apresentação de pôsteres em conferências e artigos em periódicos.
                        </div>
                    </div>
                </div>
            </div>

            {/* Inserção no Mercado e Trajetórias */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0F4780] dark:text-brand-blue-accent font-open-sans">
                        Campos de Atuação & Carreira
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Onde Atuam os Bacharéis Formados pelo IFUSP
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-open-sans">
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-blue-accent font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Compass className="w-4 h-4" /> Pesquisa & Labs
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Mestrado/Doutorado no IFUSP ou exterior; atuação no CNPEM (Sirius), IPEN/CNEN, IPT e INMETRO.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Database className="w-4 h-4" /> Data Science & IA
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Algoritmos avançados, machine learning e modelagem de sistemas complexos em big techs e startups.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <LineChart className="w-4 h-4" /> Mercado Financeiro
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Quantitative finance, precificação de derivativos, gestão de risco e análise de volatilidade estocástica.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-red font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Cpu className="w-4 h-4" /> Indústria & P&D
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Semicondutores, fotônica, novos materiais, computação quântica e instrumentação metrológica.
                        </p>
                    </div>
                </div>
            </div>

            {/* Documentos Oficiais & Download */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white font-bukra mb-4">
                    Documentos Oficiais & Manuais do Bacharelado
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <DownloadCard
                        title="PPP Bacharelado 2026"
                        subtitle="Projeto Político-Pedagógico Completo (PDF Oficial)"
                        href="https://portal.if.usp.br/cocb/sites/portal.if.usp.br.cocb/files/PPP-Bacharelado-2026.pdf"
                    />
                    <DownloadCard
                        title="Portal da CoC-B"
                        subtitle="Comissão Coordenadora do Curso de Bacharelado"
                        href="https://portal.if.usp.br/cocb/"
                        isExternal
                    />
                    <DownloadCard
                        title="Matriz no JúpiterWeb"
                        subtitle="Consulta oficial de turmas, docentes e ementas"
                        href="https://uspdigital.usp.br/jupiterweb/jupCarreira.jsp?codmnu=4544"
                        isExternal
                    />
                </div>
            </div>
        </div>
    );
}
