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
    Microscope,
    Activity,
    ShieldAlert,
    Building2,
    Calendar,
    Clock,
    Award,
    CheckCircle2,
    Radio,
    BrainCircuit,
    Crosshair
} from 'lucide-react';
import {
    CourseMetricsGrid,
    SemestersAccordion,
    CalloutRule,
    DownloadCard,
    CourseMetric,
    SemesterBlock
} from './GraduacaoComponents';

const FISMED_METRICS: CourseMetric[] = [
    {
        label: 'Carga Horária Total',
        value: '3.210h',
        sub: '192 Créditos (174 CA + 18 CT)',
        icon: <Clock className="w-5 h-5" />,
        color: 'brand-red'
    },
    {
        label: 'Duração do Curso',
        value: '10 Semestres',
        sub: '5 Anos • Turno Noturno & Integral Final',
        icon: <Calendar className="w-5 h-5" />,
        color: 'brand-yellow'
    },
    {
        label: 'Vagas Anuais',
        value: '25 Vagas',
        sub: 'Vestibular FUVEST + ENEM-USP',
        icon: <Microscope className="w-5 h-5" />,
        color: 'brand-red'
    },
    {
        label: 'Extensão & TCC',
        value: '321h + TCC',
        sub: 'MDR0660 e MDR0661 com Extensão',
        icon: <Award className="w-5 h-5" />,
        color: 'brand-yellow'
    }
];

// Matriz oficial de 10 semestres do PPP Março de 2025 (Tabela III do documento)
const FISMED_SEMESTRES: SemesterBlock[] = [
    {
        semestre: 1,
        titulo: '1º Semestre: Fundamentos da Física, Geometria e Nivelamento',
        subtitulo: 'Introdução ao cálculo e bases da mecânica e vetores',
        disciplinas: [
            { codigo: '4302111', nome: 'Física I', creditosAula: 6, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Cinemática, dinâmica newtoniana e leis de conservação' },
            { codigo: '4302113', nome: 'Física Experimental I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Medidas físicas e tratamento de incertezas experimentais' },
            { codigo: 'MAT2453', nome: 'Cálculo Diferencial e Integral I', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Derivadas, limites e integrais de uma variável' },
            { codigo: 'MAT0112', nome: 'Vetores e Geometria Analítica', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Cálculo vetorial básico e geometria espacial' },
            { codigo: '4300207', nome: 'Integração dos Conceitos Básicos de Matemática e Física', creditosAula: 2, unidade: 'IFUSP', tipo: 'optativa', observacao: 'Disciplina de nivelamento do 1º semestre sugerida pela CoC' }
        ]
    },
    {
        semestre: 2,
        titulo: '2º Semestre: Introdução à Física Médica, Anatomia e Fisiologia',
        subtitulo: 'Início da interface biomédica direta com a Faculdade de Medicina (FMUSP)',
        disciplinas: [
            { codigo: '4302112', nome: 'Física II', creditosAula: 6, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Fluidos, ondas mecânicas e termodinâmica básica' },
            { codigo: '4302114', nome: 'Física Experimental II', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Experimentos de oscilações, acústica e termometria' },
            { codigo: 'MAT2454', nome: 'Cálculo Diferencial e Integral II', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Funções de várias variáveis e derivadas direcionais' },
            { codigo: 'MDR0632', nome: 'Introdução à Física Médica', creditosAula: 2, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Visão panorâmica da atuação clínica em radioterapia e diagnóstico' },
            { codigo: 'MDR0633', nome: 'Elementos de Anatomia e Fisiologia Humana', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Sistemas cardiovascular, respiratório, nervoso e esquelético' }
        ]
    },
    {
        semestre: 3,
        titulo: '3º Semestre: Eletricidade, Magnetismo e Estatística Médica',
        subtitulo: 'Domínio do eletromagnetismo e bioestatística aplicada à saúde',
        disciplinas: [
            { codigo: '4302211', nome: 'Física III', creditosAula: 6, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Campos elétricos e magnéticos, lei de Gauss e Ampère' },
            { codigo: '4302213', nome: 'Física Experimental III', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Medidas em corrente contínua, circuitos resistivos e capacitivos' },
            { codigo: 'MAT0216', nome: 'Cálculo Diferencial e Integral III', creditosAula: 6, unidade: 'IME', tipo: 'obrigatória', observacao: 'Campos vetoriais, integrais de superfície e teoremas integrais' },
            { codigo: 'MDR0635', nome: 'Estatística Médica I', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Probabilidade, testes de hipóteses e bioestatística clínica' }
        ]
    },
    {
        semestre: 4,
        titulo: '4º Semestre: Ondas Eletromagnéticas e Informática Médica',
        subtitulo: 'Equações de Maxwell, ótica e sistemas digitais em saúde',
        disciplinas: [
            { codigo: '4302212', nome: 'Física IV', creditosAula: 6, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Radiação eletromagnética, ótica geométrica e ondulatória' },
            { codigo: '4302214', nome: 'Física Experimental IV', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Espectroscopia, difração da luz e interferometria' },
            { codigo: 'MAC0115', nome: 'Introdução à Computação para Ciências Exatas e Tecnologia', creditosAula: 4, creditosTrab: 2, unidade: 'IME', tipo: 'obrigatória', observacao: 'Lógica algorítmica, programação em Python/C e estruturas de dados' },
            { codigo: 'MDR0634', nome: 'Informática Médica I', creditosAula: 4, creditosTrab: 2, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Sistemas PACS, padrão DICOM e prontuário eletrônico' }
        ]
    },
    {
        semestre: 5,
        titulo: '5º Semestre: Física do Corpo Humano e Diagnóstico por Imagem',
        subtitulo: 'Transição aprofundada para os princípios físicos de formação de imagem',
        disciplinas: [
            { codigo: '4300325', nome: 'Física do Corpo Humano', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Biomecânica, biofísica de membranas, potenciais de ação e hemodinâmica' },
            { codigo: 'MDR0639', nome: 'Física do Diagnóstico por Imagens I', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Produção de raios X, atenuação em tecidos, contraste e detectores' },
            { codigo: '4302204', nome: 'Física Matemática I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Variáveis complexas e séries de Fourier aplicadas a sinais' },
            { codigo: 'MDR0637', nome: 'Diagnóstico por Imagens Médicas', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Semiótica radiológica e interpretação anatômica de exames' }
        ]
    },
    {
        semestre: 6,
        titulo: '6º Semestre: Radiação Ionizante, Efeitos Biológicos e Instrumentação',
        subtitulo: 'Radiobiologia e tecnologia dos equipamentos médico-hospitalares',
        disciplinas: [
            { codigo: 'MDR0636', nome: 'Equipamentos Médico-Hospitalares I', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Transdutores biomédicos, monitores cardíacos e segurança elétrica' },
            { codigo: '4300436', nome: 'Efeitos Biológicos das Radiações Ionizantes e Não-Ionizantes', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Danos ao DNA celular, curvas de sobrevivência celular e efeitos estocásticos' },
            { codigo: '4302311', nome: 'Física Quântica', creditosAula: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Postulados quânticos e física atômica fundamental' },
            { codigo: '4302305', nome: 'Mecânica I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Mecânica analítica formal e sistemas de partículas' },
            { codigo: 'MAP0214', nome: 'Cálculo Numérico com Aplicações em Física', creditosAula: 4, unidade: 'IME', tipo: 'obrigatória', observacao: 'Algoritmos iterativos e interpolação para modelagem biomédica' }
        ]
    },
    {
        semestre: 7,
        titulo: '7º Semestre: Física das Radiações e Proteção Radiológica',
        subtitulo: 'Interação da radiação com a matéria e normas regulatórias da CNEN/Anvisa',
        disciplinas: [
            { codigo: '4300437', nome: 'Física das Radiações I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Efeito fotoelétrico, espalhamento Compton, produção de pares e frenamento' },
            { codigo: 'MDR0640', nome: 'Proteção Radiológica I', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Blindagens, dosimetria individual, normas CNEN-NN-3.01 e RDC Anvisa' },
            { codigo: '4302403', nome: 'Mecânica Quântica I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Operadores, comutadores e modelos moleculares' },
            { codigo: '4302303', nome: 'Eletromagnetismo I', creditosAula: 4, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Eletrodinâmica avançada e potenciais de Lienard-Wiechert' }
        ]
    },
    {
        semestre: 8,
        titulo: '8º Semestre: Dosimetria Clínica, Radioterapia e Medicina Nuclear',
        subtitulo: 'Aceleradores lineares de alta energia, radiofármacos e PET-CT',
        disciplinas: [
            { codigo: '4300439', nome: 'Laboratório de Dosimetria das Radiações', creditosAula: 2, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Câmaras de ionização, termoluminescência (TLD) e dosimetria de feixe' },
            { codigo: 'MDR0641', nome: 'Medicina Nuclear', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Câmaras gama, tomografia por emissão de pósitrons (PET) e SPECT' },
            { codigo: 'MDR0642', nome: 'Radioterapia', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Aceleradores lineares, sistemas de planejamento 3D, IMRT e braquiterapia' },
            { codigo: 'MDR0643', nome: 'Física do Diagnóstico por Imagens II', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Tomografia computadorizada helicoidal, mamografia e fluoroscopia' },
            { codigo: 'MDR0644', nome: 'Introdução ao Ambiente Hospitalar', creditosAula: 2, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Rotinas clínicas, biossegurança e convivência com equipes médicas' }
        ]
    },
    {
        semestre: 9,
        titulo: '9º Semestre: Estágio Hospitalar Supervisionado no Complexo HC',
        subtitulo: '120 horas de imersão clínica obrigatória no InRad, ICESP e InCor',
        disciplinas: [
            { codigo: 'MDR0647', nome: 'Estágio Hospitalar Geral', creditosAula: 0, creditosTrab: 4, unidade: 'FMUSP', tipo: 'estágio', observacao: '120 horas práticas supervisionadas (inclui 35h de extensão) em hospitais parceiros' },
            { codigo: 'MDR0645', nome: 'Introdução à Saúde Ocupacional, Medicina Legal e Ética da Física Médica', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Legislação trabalhista, responsabilidade civil e bioética do paciente' },
            { codigo: 'MDR0646', nome: 'Tópicos Avançados de Matemática e Física em Medicina', creditosAula: 4, unidade: 'FMUSP', tipo: 'obrigatória', observacao: 'Reconstrução tomográfica por transformada de Radon e redes neurais' },
            { codigo: 'OPT-MED', nome: 'Disciplinas Optativas Avançadas', creditosAula: 4, unidade: 'USP', tipo: 'optativa', observacao: 'Ressonância magnética avançada (7 Tesla) ou radiofarmácia' }
        ]
    },
    {
        semestre: 10,
        titulo: '10º Semestre: Práticas Profissionais Avançadas, Extensão e TCC',
        subtitulo: 'Regime integral de imersão com 286 horas de extensão dialógica e TCC',
        disciplinas: [
            { codigo: 'MDR0660', nome: 'Prática Profissional em Imagens Médicas', creditosAula: 0, creditosTrab: 5, unidade: 'FMUSP', tipo: 'extensão', observacao: '150 horas totais (143h de extensão). Controle de qualidade e calibração de TC/RM/Mamografia' },
            { codigo: 'MDR0661', nome: 'Prática Profissional em Radioterapia', creditosAula: 0, creditosTrab: 5, unidade: 'FMUSP', tipo: 'extensão', observacao: '150 horas totais (143h de extensão). Calibração de feixes, dosimetria e controle em aceleradores' },
            { codigo: 'TCC-FISMED', nome: 'Trabalho de Conclusão de Curso (TCC Obrigatório)', creditosAula: 0, creditosTrab: 0, unidade: 'FMUSP/IF', tipo: 'obrigatória', observacao: 'Revisão bibliográfica crítica aplicada vinculada a MDR0660 ou MDR0661' },
            { codigo: 'AAC-MED', nome: 'Atividades Acadêmicas Complementares (60h)', creditosAula: 0, creditosTrab: 2, unidade: 'IFUSP', tipo: 'obrigatória', observacao: 'Seminários, congressos da ABFM, monitoria e visitas ao InRad' }
        ]
    }
];

export default function FisicaMedicaView() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header de Identificação do Curso */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#1A1414] to-[#121212] border border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-brand-red/15 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-red/20 text-brand-red border border-brand-red/40 font-bukra">
                                Habilitação: Física Médica
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-400 border border-white/10 font-mono">
                                PPP Março/2025 • Interunidades
                            </span>
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/30 font-open-sans">
                                CoC-FM • IFUSP & FMUSP
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-white font-bukra italic uppercase tracking-tight">
                            Bacharelado em Física Médica
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-open-sans mt-2 leading-relaxed">
                            Curso interunidades pioneiro criado em parceria pelo <strong>Instituto de Física (sede)</strong> e a <strong>Faculdade de Medicina da USP (FMUSP)</strong>, com participação do IME. Habilita o profissional a atuar na fronteira da física das radiações, radioterapia de ponta, medicina nuclear, dosimetria e imagens médicas avançadas no maior complexo hospitalar da América Latina.
                        </p>
                        <div className="mt-4 text-[11px] text-gray-400 font-open-sans flex flex-wrap items-center gap-y-1 gap-x-4">
                            <span><strong>Coordenador:</strong> Prof. Dr. Paulo Roberto Costa (IFUSP - DFN)</span>
                            <span><strong>Vice-Coordenador:</strong> Prof. Dr. Marcelo Tatit Sapienza (FMUSP)</span>
                            <span><strong>Contato Oficial:</strong> cocfismd@if.usp.br</span>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 shrink-0 text-center w-full md:w-auto">
                        <span className="text-[10px] uppercase font-bold text-gray-400 font-open-sans block mb-1">
                            Carreira na FUVEST
                        </span>
                        <div className="text-xl font-black text-white font-bukra">
                            Física Médica
                        </div>
                        <span className="text-[11px] text-brand-red font-open-sans">
                            Diploma Conjunto IFUSP & FMUSP
                        </span>
                    </div>
                </div>
            </div>

            {/* Grid de Métricas Oficiais */}
            <CourseMetricsGrid metrics={FISMED_METRICS} />

            {/* Divisão Interunidades dos 192 Créditos */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-red font-open-sans">
                        Arranjo Interinstitucional Oficial
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Distribuição dos 192 Créditos (3.210 Horas Totais)
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 font-open-sans mt-1">
                        Integração das infraestruturas de excelência das unidades da USP na Cidade Universitária e no Quadrilátero da Saúde.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-[#0F4780]/40 transition-colors">
                        <span className="text-[10px] font-mono text-brand-blue-accent block mb-1">SEDE ADMINISTRATIVA</span>
                        <div className="text-2xl font-black text-white font-bukra">43% IFUSP</div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">82 Créditos • 1.290h</div>
                        <p className="text-[11px] text-gray-400 font-open-sans mt-2 leading-relaxed">
                            Física Geral e Experimental I a IV, Física Matemática, Física Quântica, Eletromagnetismo, Física das Radiações e Lab de Dosimetria.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-red/40 transition-colors">
                        <span className="text-[10px] font-mono text-brand-red block mb-1">COMPLEXO CLÍNICO</span>
                        <div className="text-2xl font-black text-white font-bukra">34% FMUSP</div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">66 Créditos • 1.200h</div>
                        <p className="text-[11px] text-gray-400 font-open-sans mt-2 leading-relaxed">
                            Anatomia, Radioterapia, Medicina Nuclear, Radiodiagnóstico, Informática Médica, Estágio Hospitalar Geral e Práticas MDR0660/661.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-brand-yellow/40 transition-colors">
                        <span className="text-[10px] font-mono text-brand-yellow block mb-1">BASE MATEMÁTICA</span>
                        <div className="text-2xl font-black text-white font-bukra">16% IME-USP</div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">30 Créditos • 420h</div>
                        <p className="text-[11px] text-gray-400 font-open-sans mt-2 leading-relaxed">
                            Cálculo I a III, Vetores e Geometria, Introdução à Computação (MAC0115) e Cálculo Numérico aplicado à física (MAP0214).
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/30 border border-white/5 hover:border-white/20 transition-colors">
                        <span className="text-[10px] font-mono text-gray-400 block mb-1">PERSONALIZAÇÃO</span>
                        <div className="text-2xl font-black text-white font-bukra">7% Optativas</div>
                        <div className="text-xs text-gray-300 font-semibold mt-1">14 Créditos • 240h + AAC</div>
                        <p className="text-[11px] text-gray-400 font-open-sans mt-2 leading-relaxed">
                            Disciplinas eletivas avançadas no IF e na FMUSP (ressonância de alto campo 7T, radiofarmácia) e 60h de Atividades Complementares.
                        </p>
                    </div>
                </div>
            </div>

            {/* Alerta de Regulamentação e Estágio */}
            <CalloutRule
                tag="REGULAMENTAÇÃO PROFISSIONAL & RECONHECIMENTO"
                title="Profissão da Área da Saúde • ABFM & CNEN"
                description="O Físico Médico é reconhecido pela Organização Internacional do Trabalho (OIT - ISCO-08) e pela Classificação Brasileira de Ocupações (CBO 2131-50: Físico Médico / Hospitalar) como profissional de saúde. A atuação clínica é habilitada pela Associação Brasileira de Física Médica (ABFM) e pela Comissão Nacional de Energia Nuclear (CNEN), essencial na calibração de aceleradores lineares, dosimetria e proteção radiológica."
                color="brand-red"
            />

            {/* Matriz Curricular Semestral (10 Semestres) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-red font-open-sans">
                            Grade Curricular Integralizada
                        </span>
                        <h3 className="text-xl font-bold text-white font-bukra mt-1">
                            Matriz Semestral Completa (PPP Março/2025)
                        </h3>
                        <p className="text-xs text-gray-400 font-open-sans mt-0.5">
                            39 disciplinas obrigatórias integradas entre salas do IFUSP e laboratórios/clínicas da FMUSP.
                        </p>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 shrink-0">
                        Total Geral: 192 Créditos (3.210 Horas)
                    </span>
                </div>

                <SemestersAccordion semestres={FISMED_SEMESTRES} accentColor="brand-red" />
            </div>

            {/* Curricularização da Extensão, Estágio e TCC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-brand-red/20 text-brand-red">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            Extensão Hospitalar & TCC (321 Horas)
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-4">
                        A extensão é cumprida em três frentes dialógicas diretamente ligadas ao atendimento hospitalar e segurança da população:
                    </p>
                    <ul className="space-y-2.5 text-xs text-gray-300 font-open-sans">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                            <span><strong>MDR0660 (143h Extensão):</strong> Prática Profissional em Imagens Médicas — controle de qualidade e calibração de tomógrafos e mamógrafos.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                            <span><strong>MDR0661 (143h Extensão):</strong> Prática Profissional em Radioterapia — dosimetria tridimensional e testes de aceitação em aceleradores lineares.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                            <span><strong>Trabalho de Conclusão de Curso (TCC):</strong> Obrigatório, realizado sob a forma de revisão bibliográfica e estudo de caso vinculado a MDR0660 ou MDR0661.</span>
                        </li>
                    </ul>
                </div>

                <div className="p-6 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-[#0F4780]/30 text-brand-blue-accent">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <h4 className="text-base font-bold text-white font-bukra">
                            Estágio Clínico Supervisionado (120h)
                        </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 font-open-sans leading-relaxed mb-4">
                        O estágio obrigatório (<strong>MDR0647 • Estágio Hospitalar Geral</strong>) é realizado em regime de imersão nos principais centros hospitalares de referência:
                    </p>
                    <div className="space-y-2 text-xs text-gray-300 font-open-sans">
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">InRad (Instituto de Radiologia do HCFMUSP):</strong>
                            Referência nacional em tomografia, medicina nuclear e radiologia intervencionista.
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">ICESP (Instituto do Câncer de SP):</strong>
                            Maior centro de radioterapia de alta complexidade do país com aceleradores lineares modernos.
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
                            <strong className="text-white font-bukra text-[11px] block">Plataforma PISA (FMUSP):</strong>
                            Parque de imagens de pesquisa com Ressonância Magnética de 7 Tesla e tomografia de alta resolução.
                        </div>
                    </div>
                </div>
            </div>

            {/* Áreas de Atuação & Mercado */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <div className="mb-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-red font-open-sans">
                        Campos de Especialização Clínica
                    </span>
                    <h3 className="text-xl font-bold text-white font-bukra mt-1">
                        Áreas de Atuação do Físico Médico Formado
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-open-sans">
                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-red font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Crosshair className="w-4 h-4" /> Radioterapia
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Cálculo de dose, planejamento IMRT/VMAT, radiocirurgia estereotáxica e controle de feixe em aceleradores lineares.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <Radio className="w-4 h-4" /> Medicina Nuclear
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Câmaras gama, tomografia por emissão de pósitrons (PET-CT, SPECT), dosimetria de radiofármacos e controle de rejeitos.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-blue-accent font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <BrainCircuit className="w-4 h-4" /> Imagens Médicas & IA
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Ressonância magnética (RM), tomografia computadorizada (TC), ultrassonografia e processamento de imagem em saúde.
                        </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-black/30 border border-white/5">
                        <div className="text-brand-yellow font-bukra font-bold mb-1 flex items-center gap-1.5">
                            <ShieldAlert className="w-4 h-4" /> Radioproteção & CNEN
                        </div>
                        <p className="text-gray-400 text-[11px] leading-relaxed">
                            Supervisão de proteção radiológica hospitalar e industrial, cálculo de blindagens e vigilância sanitária.
                        </p>
                    </div>
                </div>
            </div>

            {/* Documentos Oficiais & Download */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#1E1E1E] border border-white/5 shadow-xl">
                <h3 className="text-lg font-bold text-white font-bukra mb-4">
                    Documentos Oficiais & Manuais de Física Médica
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <DownloadCard
                        title="PPP Física Médica 2025"
                        subtitle="Projeto Político-Pedagógico Completo (PDF Oficial)"
                        href="https://portal.if.usp.br/cocfismed/sites/portal.if.usp.br.ifusp/files/cocfismed/PPPFisMedMarco2025.pdf"
                    />
                    <DownloadCard
                        title="Relatório de Atividades CoC-FM"
                        subtitle="Gestão Elisabeth Yoshimura & Marcelo Sapienza"
                        href="https://portal.if.usp.br/cocfismed/sites/portal.if.usp.br.ifusp/files/cocfismed/SoRelatorio.pdf"
                    />
                    <DownloadCard
                        title="Página Oficial na CG-IFUSP"
                        subtitle="Informações da Comissão de Graduação e Contatos"
                        href="https://portal.if.usp.br/cg/fisica-medica"
                        isExternal
                    />
                </div>
            </div>
        </div>
    );
}
