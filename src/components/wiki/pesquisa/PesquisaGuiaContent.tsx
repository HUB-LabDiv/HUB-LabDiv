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

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Microscope,
    Mail,
    Copy,
    Check,
    BookOpen,
    Download,
    ExternalLink,
    Sparkles,
    Atom,
    CheckCircle2,
    Brain,
    Search,
    Award,
    TrendingUp,
    AlertTriangle,
    ShieldCheck,
    Scale,
    Landmark,
    Lightbulb
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// --- DEPARTAMENTOS DO IFUSP ---
interface DepartmentInfo {
    id: string;
    sigla: string;
    nome: string;
    badge: string;
    descricao: string;
    linhas: string[];
    labsDestaque: string[];
    perfil: 'Teórico' | 'Experimental' | 'Teórico & Experimental' | 'Aplicado';
    link: string;
}

const DEPARTAMENTOS_IFUSP: DepartmentInfo[] = [
    {
        id: 'fma',
        sigla: 'FMA',
        nome: 'Física Matemática',
        badge: 'Teórico & Fundamental',
        descricao: 'Dedicado à investigação dos fundamentos teóricos e matemáticos do universo físico, utilizando formalismos rigorosos em física quântica, gravitação e relatividade.',
        linhas: [
            'Teoria Quântica de Campos e Teoria de Cordas',
            'Relatividade Geral, Buracos Negros e Cosmologia Teórica',
            'Mecânica Estatística Rigorosa e Sistemas Integráveis',
            'Dinâmica Não-Linear e Caos Quântico'
        ],
        labsDestaque: [
            'Grupo de Física Teórica de Altas Energias',
            'Laboratório de Computação Científica (LCC)',
            'Grupo de Teoria de Campos e Gravitação'
        ],
        perfil: 'Teórico',
        link: 'https://portal.if.usp.br/fma/'
    },
    {
        id: 'fmt',
        sigla: 'FMT',
        nome: 'Física dos Materiais e Mecânica',
        badge: 'Matéria Condensada',
        descricao: 'Estuda as propriedades eletrônicas, magnéticas e estruturais de materiais clássicos e quânticos em escala atômica e nanométrica.',
        linhas: [
            'Nanomateriais, Grafeno e Materiais 2D',
            'Supercondutividade e Isolantes Topológicos',
            'Spintrônica, Filmes Finos e Magnetismo Experimental',
            'Cristalografia e Difração de Raios-X'
        ],
        labsDestaque: [
            'Laboratório de Novos Materiais Semicondutores (LNMS)',
            'Laboratório de Cristalografia e Raios-X',
            'Laboratório de Filmes Finos e Superfícies (LFF)'
        ],
        perfil: 'Teórico & Experimental',
        link: 'https://portal.if.usp.br/fmt/'
    },
    {
        id: 'fap',
        sigla: 'FAP',
        nome: 'Física Aplicada',
        badge: 'Interdisciplinar & Inovação',
        descricao: 'Aplica os conceitos da física na fronteira com a biologia, a medicina e a engenharia de materiais, desenvolvendo sensores, lasers e métodos diagnósticos.',
        linhas: [
            'Física Médica, Radioterapia e Dosimetria',
            'Biofísica Molecular e Ressonância Magnética Nuclear',
            'Óptica Quântica, Fotônica e Lasers Não-Lineares',
            'Espectroscopia Raman e Física Ambiental'
        ],
        labsDestaque: [
            'Laboratório de Dosimetria das Radiações (LDR)',
            'Laboratório de Ressonância Magnética (LRM)',
            'Laboratório de Biofísica e Óptica Biomédica'
        ],
        perfil: 'Aplicado',
        link: 'https://portal.if.usp.br/fap/'
    },
    {
        id: 'fna',
        sigla: 'FNA',
        nome: 'Física Nuclear',
        badge: 'Aceleradores & Partículas',
        descricao: 'Abriga infraestrutura de grande porte única na América Latina para o estudo da estrutura nuclear, reações de baixa energia e física de hádrons.',
        linhas: [
            'Estrutura Nuclear e Reações com Íons Pesados',
            'Física Nuclear Aplicada a Materiais e Arqueometria',
            'Física de Hádrons e Colaborações Internacionais (ALICE/CERN)',
            'Física de Radiações e Instrumentação Nuclear'
        ],
        labsDestaque: [
            'Acelerador Eletrostático Pelletron (8UD)',
            'Laboratório de Análise de Materiais por Feixes Iônicos (LAMFI)',
            'Laboratório Aberto de Física Nuclear (LAFN)'
        ],
        perfil: 'Experimental',
        link: 'https://portal.if.usp.br/fna/'
    },
    {
        id: 'fge',
        sigla: 'FGE',
        nome: 'Física Geral',
        badge: 'Plasmas & Sistemas Complexos',
        descricao: 'Engloba a pesquisa fundamental e aplicada em física de plasmas termonucleares, complexidade, turbulência e ensino de física experimental.',
        linhas: [
            'Física de Plasmas e Fusão Termonuclear (Tokamak TCABR)',
            'Física Estatística e Fenômenos Críticos',
            'Sistemas Complexos, Neurofísica e Redes Neurais',
            'Instrumentação e Metodologia de Ensino de Física'
        ],
        labsDestaque: [
            'Laboratório de Física de Plasmas (Tokamak TCABR)',
            'Laboratório de Instrumentação e Demonstrações (LID)',
            'Grupo de Dinâmica Não-Linear e Fluidos'
        ],
        perfil: 'Teórico & Experimental',
        link: 'https://portal.if.usp.br/fge/'
    }
];

// --- LIVROS CLÁSSICOS RECOMENDADOS PARA TRANSIÇÃO DE IC ---
const LIVROS_RECOMENDADOS = [
    {
        area: 'Mecânica Clássica Avançada',
        titulo: 'Classical Mechanics',
        autores: 'Herbert Goldstein / Keith R. Symon',
        descricao: 'Formalismo Lagrangiano e Hamiltoniano, equações de movimento, dinâmica de corpos rígidos e transformações canônicas.',
        importancia: 'Base obrigatória para transição da física básica para física teórica ou quântica.'
    },
    {
        area: 'Eletromagnetismo',
        titulo: 'Introduction to Electrodynamics',
        autores: 'David J. Griffiths',
        descricao: 'Equações de Maxwell na forma diferencial, potenciais eletromagnéticos, radiação e teoria da relatividade restrita.',
        importancia: 'O manual de cabeceira mais lido no IFUSP para quem busca IC experimental ou aplicada.'
    },
    {
        area: 'Mecânica Quântica',
        titulo: 'Introduction to Quantum Mechanics / Modern Quantum Mechanics',
        autores: 'David J. Griffiths / J. J. Sakurai',
        descricao: 'Equação de Schrödinger, operadores lineares, momento angular quântico e métodos perturbativos.',
        importancia: 'Indispensável para entender pesquisas em estado sólido, materiais quânticos e física nuclear.'
    },
    {
        area: 'Física da Matéria Condensada',
        titulo: 'Introduction to Solid State Physics',
        autores: 'Charles Kittel',
        descricao: 'Redes cristalinas, fônons, elétrons em redes periódicas, teoria de bandas e semicondutores.',
        importancia: 'Leitura sugerida pela maioria dos orientadores do departamento FMT ao ingressar em laboratório.'
    },
    {
        area: 'Métodos Matemáticos da Física',
        titulo: 'Mathematical Methods for Physicists',
        autores: 'George B. Arfken & Hans J. Weber',
        descricao: 'Equações diferenciais parciais, análise de Fourier, funções especiais (Bessel, Legendre) e variáveis complexas.',
        importancia: 'A ferramenta diária para resolver problemas de pesquisa teórica e modelagem computacional.'
    },
    {
        area: 'Computação Científica',
        titulo: 'Python para Físicos / Scientific Computing with Python',
        autores: 'NumPy, SciPy & Matplotlib Docs',
        descricao: 'Manipulação de matrizes, resolução numérica de EDOs, ajuste não-linear de curvas e simulações Monte Carlo.',
        importancia: 'O maior diferencial prático para qualquer estudante que queira atuar em laboratório experimental.'
    }
];

export function PesquisaGuiaContent() {
    // Estado de Departamento Selecionado
    const [selectedDept, setSelectedDept] = useState<string>('fma');

    // Estado do Gerador de E-mail
    const [emailType, setEmailType] = useState<'geral' | 'disciplina' | 'experimental'>('geral');
    const [profName, setProfName] = useState('Prof. Dr. [Nome do Docente]');
    const [studentName, setStudentName] = useState('[Seu Nome Completo]');
    const [studentSemester, setStudentSemester] = useState('3º semestre do Bacharelado em Física');
    const [researchTopic, setResearchTopic] = useState('sistemas dinâmicos e mecânica estatística');
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Geração dinâmica do texto do e-mail
    const getEmailContent = () => {
        if (emailType === 'disciplina') {
            return `Prezado(a) ${profName},

Espero que este e-mail o(a) encontre bem.

Meu nome é ${studentName}, sou aluno(a) regular do ${studentSemester} no Instituto de Física da USP (IFUSP). Fui seu(sua) aluno(a) na disciplina [Nome da Disciplina] e me interessei profundamente pelos conceitos discutidos em aula, em especial pelas abordagens conectadas a ${researchTopic}.

Gostaria de saber se o(a) senhor(a) teria um breve intervalo na sua agenda esta semana ou na próxima para que eu possa passar na sua sala/gabinete e conversar sobre a possibilidade de realizar uma Iniciação Científica (IC) sob sua orientação ou em colaboração com seu grupo de pesquisa.

Estou anexando a esta mensagem meu histórico escolar emitido pelo JúpiterWeb para consulta prévia.

Agradeço imensamente pela atenção e pelo tempo dedicado.

Atenciosamente,

${studentName}
Número USP: [Seu Nº USP]
Instituto de Física — Universidade de São Paulo
Currículo Lattes: [Link do seu Lattes]`;
        }

        if (emailType === 'experimental') {
            return `Prezado(a) ${profName},

Espero que este e-mail o(a) encontre bem.

Meu nome é ${studentName}, graduando(a) do ${studentSemester} no IFUSP. Venho acompanhando as publicações e a infraestrutura de pesquisa do seu laboratório na área de ${researchTopic}, e tenho grande interesse em me aprofundar na física experimental e no trabalho de bancada/caracterização científica.

Gostaria de consultá-lo(a) sobre a existência de projetos de Iniciação Científica (com ou sem bolsa) disponíveis no seu grupo e se seria possível agendarmos uma visita à sua sala ou ao laboratório para conversarmos brevemente sobre os pré-requisitos e rotina de pesquisa.

Estou disponível para uma dedicação de [10 a 20] horas semanais e anexo meu histórico escolar da graduação.

Muito obrigado pela atenção e consideração.

Atenciosamente,

${studentName}
Número USP: [Seu Nº USP]
Instituto de Física — Universidade de São Paulo
Currículo Lattes: [Link do seu Lattes]`;
        }

        // Modelo Geral
        return `Prezado(a) ${profName},

Espero que este e-mail o(a) encontre bem.

Meu nome é ${studentName} e sou aluno(a) do ${studentSemester} no Instituto de Física da USP. Tenho grande interesse na sua linha de pesquisa envolvendo ${researchTopic}, a qual conheci através do portal do IFUSP e de leituras recentes sobre o tema.

Gostaria de saber se o(a) senhor(a) teria disponibilidade para uma breve conversa presencial em sua sala/gabinete, no dia e horário que forem mais convenientes para sua rotina, para que eu possa apresentar meu interesse em Iniciação Científica e receber suas orientações sobre os passos necessários para me preparar para atuar nessa área.

Anexo a este e-mail meu histórico escolar recente para seu conhecimento.

Agradeço desde já pela atenção e disponibilidade.

Atenciosamente,

${studentName}
Número USP: [Seu Nº USP]
Instituto de Física — Universidade de São Paulo
Currículo Lattes: [Link do seu Lattes]`;
    };

    const handleCopyEmail = () => {
        const text = getEmailContent();
        navigator.clipboard.writeText(text).then(() => {
            setCopiedEmail(true);
            toast.success('Modelo de e-mail copiado! Personalize os dados antes de enviar.', {
                duration: 4000,
                icon: '✉️'
            });
            setTimeout(() => setCopiedEmail(false), 3000);
        }).catch(() => {
            toast.error('Não foi possível copiar automaticamente.');
        });
    };

    const currentDeptData = DEPARTAMENTOS_IFUSP.find(d => d.id === selectedDept) || DEPARTAMENTOS_IFUSP[0];

    return (
        <div className="space-y-16 w-full text-gray-800 dark:text-gray-200">

            {/* ========================================================= */}
            {/* 1. HERO MANIFESTO: A POSTURA PROATIVA DO PESQUISADOR     */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-10 rounded-[40px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-full bg-brand-red/10 text-brand-red border border-brand-red/20 text-[11px] font-black font-bukra uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Cultura Acadêmica & Proatividade
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-500 text-[10px] font-bold uppercase tracking-wider font-bukra">
                            Tradição IFUSP • Desde 1983
                        </span>
                    </div>

                    {/* Princípio em formato limpo e padronizado com o site */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 border-l-4 border-l-brand-red space-y-2">
                        <p className="text-base sm:text-lg font-bold font-open-sans text-gray-900 dark:text-gray-100 italic leading-relaxed">
                            &ldquo;Professores são pesquisadores. A melhor forma de conseguir uma Iniciação Científica é a proatividade: mande um e-mail formal, apresente seu interesse e pergunte quando pode ir à sala dele para conversar brevemente.&rdquo;
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            No ambiente universitário de pesquisa, os docentes valorizam a iniciativa direta, a seriedade acadêmica e a vontade genuína de aprender.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-brand-yellow font-black font-bukra text-xs uppercase tracking-wider">
                                <Search className="w-4 h-4" />
                                1. Conheça as Linhas
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                Entenda o que os 5 departamentos e os laboratórios do IFUSP produzem. Ache uma área com a qual você tenha afinidade genuína.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-brand-blue dark:text-brand-blue-accent font-black font-bukra text-xs uppercase tracking-wider">
                                <Brain className="w-4 h-4" />
                                2. Base Teórica Sólida
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                Conquiste uma boa base nas disciplinas fundamentais (Cálculos, Físicas e Álgebra Linear). É ela que sustenta o raciocínio científico.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-brand-red font-black font-bukra text-xs uppercase tracking-wider">
                                <TrendingUp className="w-4 h-4" />
                                3. Diálogo & Resiliência
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                                Se não houver vaga ou bolsa agora, peça indicações de livros e matérias. Prepare-se melhor e tente de novo um semestre depois.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 2. ENQUADRAMENTO INSTITUCIONAL & REGRAS OFICIAIS (PRPI/IF) */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-10 rounded-[40px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-2xl space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-blue text-xs font-black font-bukra uppercase tracking-wider">
                            <Scale className="w-4 h-4" />
                            Normas Oficiais da USP • Resolução CoPq nº 7.236/2016
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                            Como Funciona Institucionalmente a IC & IT na USP
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans mt-1">
                            Diretrizes oficiais da Pró-Reitoria de Pesquisa e Inovação (PRPI) e da Comissão de Pesquisa e Inovação (CPqI) do IFUSP.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href="https://prpi.usp.br/wp-content/uploads/sites/1239/2024/05/guia-programa-iniciacao-cientifica.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-gray-800 dark:text-white font-black text-xs font-bukra uppercase tracking-wider border border-black/10 dark:border-white/10 transition-all flex items-center gap-2"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Guia Oficial PRPI (PDF)</span>
                        </a>
                        <a
                            href="https://portal.if.usp.br/pesquisa/pt-br/node/328"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 rounded-2xl bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue dark:text-brand-blue-accent font-black text-xs font-bukra uppercase tracking-wider border border-brand-blue/30 transition-all flex items-center gap-2"
                        >
                            <Landmark className="w-3.5 h-3.5" />
                            <span>CPqI do IFUSP</span>
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Definição IC vs IT */}
                    <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-brand-red font-black font-bukra text-xs uppercase tracking-wider">
                            <Microscope className="w-4 h-4" />
                            Iniciação Científica (IC) vs. Tecnológica (IT)
                        </div>
                        <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <strong className="text-gray-900 dark:text-white font-bukra block mb-1">Iniciação Científica (IC):</strong>
                                Pesquisa básica ou aplicada, utilizando rigorosamente o método científico para produzir conhecimento na fronteira da física, com ou sem aplicação prática imediata.
                            </div>
                            <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                                <strong className="text-gray-900 dark:text-white font-bukra block mb-1">Iniciação Tecnológica (IT):</strong>
                                Desenvolvimento, aperfeiçoamento ou viabilização de produtos, protótipos, instrumentação experimental, processos ou softwares científicos, preferencialmente multidisciplinares.
                            </div>
                        </div>
                    </div>

                    {/* Regras do IFUSP e Sistema Atena */}
                    <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-4">
                        <div className="flex items-center gap-2 text-brand-yellow font-black font-bukra text-xs uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4" />
                            Quem Pode Orientar & Regras do Sistema Atena
                        </div>
                        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                            <li className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-brand-blue mt-0.5 shrink-0" />
                                <span><strong>Orientadores credenciados:</strong> Docentes do IFUSP, pós-doutorandos, pesquisadores colaboradores e professores colaboradores devidamente homologados pela PRPI.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-brand-blue mt-0.5 shrink-0" />
                                <span><strong>Cadastro no Sistema Atena:</strong> É feito exclusivamente pelo orientador. A Comissão de Pesquisa do IFUSP é notificada e faz a validação formal do projeto.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Check className="w-3.5 h-3.5 text-brand-blue mt-0.5 shrink-0" />
                                <span><strong>Duração:</strong> Duração mínima de 3 meses. Projetos com bolsa possuem vigência de 12 meses renováveis.</span>
                            </li>
                        </ul>

                        {/* Alerta de Calendário da CPqI IFUSP */}
                        <div className="p-4 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                            <div className="text-[11px] text-gray-800 dark:text-gray-200 leading-relaxed font-open-sans">
                                <strong>Alerta de Calendário da CPqI:</strong> Enquanto estiverem abertas as inscrições anuais dos programas PIBIC e PIBITI, o sistema Atena suspende temporariamente o cadastro de projetos de outras modalidades (com ou sem bolsa). Planeje com seu orientador!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 3. O CICLO PASSO A PASSO DA INICIAÇÃO CIENTÍFICA          */}
            {/* ========================================================= */}
            <div className="space-y-6">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-red font-bukra">
                        Fluxo Estruturado
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-bukra text-gray-900 dark:text-white uppercase italic tracking-tight mt-1">
                        O Ciclo da Iniciação Científica
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans max-w-2xl mt-1 leading-relaxed">
                        Do primeiro semestre até a apresentação de resultados no SIICUSP: as etapas recomendadas para construir uma trajetória sólida de pesquisa.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Passo 1 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-red uppercase">Etapa 01</span>
                            <span className="p-2 rounded-xl bg-brand-red/10 text-brand-red text-xs font-bold font-bukra">1º ao 3º Semestre</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            Consolidar a Base Teórica
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            Dedique-se a fundo em <strong>Cálculo I e II</strong>, <strong>Física I e II</strong> e <strong>Álgebra Linear</strong>. Os orientadores olham seu histórico JúpiterWeb para verificar disciplina, assiduidade e consistência de estudo.
                        </p>
                    </div>

                    {/* Passo 2 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-blue uppercase">Etapa 02</span>
                            <span className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-bold font-bukra">Mapeamento</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            Identificar a Linha & Lattes
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            Navegue pelas páginas dos departamentos do IFUSP. Abra o <strong>Currículo Lattes</strong> dos docentes para ver o que eles publicaram nos últimos 3 anos. Verifique se a pesquisa é teórica, computacional ou experimental.
                        </p>
                    </div>

                    {/* Passo 3 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-yellow uppercase">Etapa 03</span>
                            <span className="p-2 rounded-xl bg-brand-yellow/10 text-brand-yellow text-xs font-bold font-bukra">Primeiro Contato</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            O E-mail Formal Objetivo
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            Envie e-mail usando seu endereço institucional <code>@usp.br</code>. Apresente-se brevemente, mencione por que tem interesse no tema do professor e pergunte quando pode ir ao gabinete dele para uma conversa rápida de 15 minutos.
                        </p>
                    </div>

                    {/* Passo 4 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-red uppercase">Etapa 04</span>
                            <span className="p-2 rounded-xl bg-brand-red/10 text-brand-red text-xs font-bold font-bukra">No Gabinete</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            Diálogo Presencial & Escuta
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            Vá à sala no horário combinado. Demonstre curiosidade e honestidade sobre o que já sabe e o que ainda não aprendeu. Declare quantas horas semanais você pode dedicar (10h a 20h) e ouça as instruções com atenção.
                        </p>
                    </div>

                    {/* Passo 5 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-blue uppercase">Etapa 05</span>
                            <span className="p-2 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-bold font-bukra">Formalização</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            Sistema Atena & Bolsas
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            O orientador cadastra o projeto no <strong>Sistema Atena (PRPI)</strong>. Pode ser com bolsa (PIBIC/CNPq, PIBITI, FAPESP) ou voluntária (sem bolsa, mas com certificado oficial e validade acadêmica idêntica).
                        </p>
                    </div>

                    {/* Passo 6 */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-4 hover:-translate-y-1 transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black font-bukra text-brand-yellow uppercase">Etapa 06</span>
                            <span className="p-2 rounded-xl bg-brand-yellow/10 text-brand-yellow text-xs font-bold font-bukra">Resultados</span>
                        </div>
                        <h4 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            Relatórios & SIICUSP
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed">
                            Submissão do relatório semestral e do relatório final via Atena. Apresentação do pôster ou comunicação oral no <strong>SIICUSP</strong>, com chance de premiação e intercâmbio científico internacional.
                        </p>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 4. GERADOR DE E-MAIL FORMAL COM COPIAR E TOAST            */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-10 rounded-[40px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-2xl space-y-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/5 dark:border-white/10 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-brand-red text-xs font-black font-bukra uppercase tracking-wider">
                            <Mail className="w-4 h-4" />
                            Simulador Interativo
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                            Modelo de E-mail para Primeiro Contato
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-1">
                            Preencha os campos abaixo para personalizar e copie com um clique para seu cliente de e-mail.
                        </p>
                    </div>

                    {/* Botão de Copiar */}
                    <button
                        onClick={handleCopyEmail}
                        className="px-6 py-3.5 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs font-bukra uppercase tracking-wider shadow-lg shadow-brand-red/20 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
                    >
                        {copiedEmail ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copiedEmail ? 'Copiado para a Área de Transferência!' : 'Copiar Modelo de E-mail'}
                    </button>
                </div>

                {/* Seleção do Tipo de Abordagem */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        onClick={() => setEmailType('geral')}
                        className={`p-4 rounded-2xl border text-left transition-all ${emailType === 'geral'
                            ? 'bg-brand-red/10 border-brand-red text-brand-red'
                            : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:border-white/10'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase font-bukra block">Opção 1</span>
                        <span className="text-xs font-bold font-open-sans">Interesse Geral na Linha</span>
                        <p className="text-[11px] text-gray-500 font-open-sans mt-1">Quando você identificou a pesquisa pelo portal ou Lattes.</p>
                    </button>

                    <button
                        onClick={() => setEmailType('disciplina')}
                        className={`p-4 rounded-2xl border text-left transition-all ${emailType === 'disciplina'
                            ? 'bg-brand-blue/10 border-brand-blue text-brand-blue'
                            : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:border-white/10'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase font-bukra block">Opção 2</span>
                        <span className="text-xs font-bold font-open-sans">Após Cursar Disciplina</span>
                        <p className="text-[11px] text-gray-500 font-open-sans mt-1">Quando você foi aluno(a) do docente em alguma matéria.</p>
                    </button>

                    <button
                        onClick={() => setEmailType('experimental')}
                        className={`p-4 rounded-2xl border text-left transition-all ${emailType === 'experimental'
                            ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow'
                            : 'bg-black/5 dark:bg-white/5 border-transparent text-gray-600 dark:text-gray-400 hover:border-white/10'
                            }`}
                    >
                        <span className="text-[10px] font-black uppercase font-bukra block">Opção 3</span>
                        <span className="text-xs font-bold font-open-sans">Foco Experimental / Lab</span>
                        <p className="text-[11px] text-gray-500 font-open-sans mt-1">Interesse em bancada, instrumentação ou laboratório físico.</p>
                    </button>
                </div>

                {/* Campos de Customização Rápida */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1.5 font-bukra">Nome do(a) Docente</label>
                        <input
                            type="text"
                            value={profName}
                            onChange={(e) => setProfName(e.target.value)}
                            placeholder="Ex: Prof. Dr. Silva"
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-brand-red font-open-sans"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1.5 font-bukra">Seu Nome Completo</label>
                        <input
                            type="text"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            placeholder="Seu nome"
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-brand-red font-open-sans"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1.5 font-bukra">Semestre / Curso</label>
                        <input
                            type="text"
                            value={studentSemester}
                            onChange={(e) => setStudentSemester(e.target.value)}
                            placeholder="Ex: 3º semestre do Bacharelado"
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-brand-red font-open-sans"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-500 block mb-1.5 font-bukra">Tópico de Interesse</label>
                        <input
                            type="text"
                            value={researchTopic}
                            onChange={(e) => setResearchTopic(e.target.value)}
                            placeholder="Ex: física de plasmas"
                            className="w-full px-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#121212] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white focus:outline-none focus:border-brand-red font-open-sans"
                        />
                    </div>
                </div>

                {/* Caixa de Visualização do E-mail */}
                <div className="rounded-3xl bg-black/50 border border-black/10 dark:border-white/10 p-6 relative">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-xs text-gray-400 font-mono">
                        <div>
                            <span className="text-gray-500">Assunto: </span>
                            <span className="text-gray-200 font-bold">Interesse em Iniciação Científica — Aluno(a) IFUSP ({studentName})</span>
                        </div>
                        <span className="text-[10px] text-brand-yellow font-bold uppercase tracking-wider font-bukra">Prévia de Envio</span>
                    </div>
                    <pre className="text-xs sm:text-sm text-gray-200 font-mono whitespace-pre-wrap leading-relaxed select-all">
                        {getEmailContent()}
                    </pre>
                </div>

                {/* Dicas de Etiqueta Acadêmica */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-bold font-bukra block text-gray-900 dark:text-white">Use seu e-mail @usp.br</span>
                            <p className="text-[11px] text-gray-500 font-open-sans leading-relaxed mt-0.5">E-mails externos (como Gmail ou Yahoo) caem frequentemente na caixa de spam do docente.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-bold font-bukra block text-gray-900 dark:text-white">Seja Conciso e Respeitoso</span>
                            <p className="text-[11px] text-gray-500 font-open-sans leading-relaxed mt-0.5">Professores recebem centenas de mensagens diárias. 2 a 3 parágrafos são suficientes para marcar um encontro.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                        <CheckCircle2 className="w-4 h-4 text-brand-blue shrink-0 mt-0.5" />
                        <div>
                            <span className="text-xs font-bold font-bukra block text-gray-900 dark:text-white">Anexe o Histórico Júpiter</span>
                            <p className="text-[11px] text-gray-500 font-open-sans leading-relaxed mt-0.5">Anexar seu PDF limpo do JúpiterWeb poupa tempo e demonstra transparência e preparo.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 5. MAPA DOS DEPARTAMENTOS & LABORATÓRIOS DO IFUSP        */}
            {/* ========================================================= */}
            <div className="space-y-8">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-blue font-bukra">
                        Estrutura Científica
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-bukra text-gray-900 dark:text-white uppercase italic tracking-tight mt-1">
                        Departamentos & Laboratórios do IFUSP
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans max-w-2xl mt-1 leading-relaxed">
                        Conheça o foco de cada departamento, suas principais linhas de pesquisa e infraestrutura instalada para encontrar o docente que atua na sua área de interesse.
                    </p>
                </div>

                {/* Abas de Departamentos */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {DEPARTAMENTOS_IFUSP.map((dept) => (
                        <button
                            key={dept.id}
                            onClick={() => setSelectedDept(dept.id)}
                            className={`px-5 py-3 rounded-2xl font-black font-bukra text-xs uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2.5 ${selectedDept === dept.id
                                ? 'bg-brand-blue text-white shadow-xl shadow-brand-blue/20 scale-105'
                                : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-black/5 dark:border-white/10 hover:border-brand-blue/40'
                                }`}
                        >
                            <span className="text-[10px] opacity-70">[{dept.sigla}]</span>
                            <span>{dept.nome}</span>
                        </button>
                    ))}
                </div>

                {/* Card Detalhado do Departamento Selecionado */}
                <motion.div
                    key={currentDeptData.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-8 sm:p-10 rounded-[40px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-2xl space-y-8"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 dark:border-white/10 pb-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-black font-bukra uppercase tracking-wider">
                                    Departamento {currentDeptData.sigla}
                                </span>
                                <span className="px-3 py-1 rounded-xl bg-black/5 dark:bg-white/5 text-gray-500 text-xs font-bold font-bukra uppercase">
                                    Perfil: {currentDeptData.perfil}
                                </span>
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                                {currentDeptData.nome}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed max-w-3xl">
                                {currentDeptData.descricao}
                            </p>
                        </div>

                        <a
                            href={currentDeptData.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-brand-blue hover:text-white text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10 font-black text-xs font-bukra uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 self-start md:self-auto"
                        >
                            <span>Docentes do {currentDeptData.sigla}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Linhas de Pesquisa */}
                        <div className="space-y-4">
                            <h5 className="text-xs font-black font-bukra uppercase tracking-widest text-brand-blue flex items-center gap-2">
                                <Atom className="w-4 h-4" />
                                Linhas de Pesquisa Ativas
                            </h5>
                            <ul className="space-y-2.5">
                                {currentDeptData.linhas.map((linha, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans">
                                        <div className="size-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                                        <span>{linha}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Labs em Destaque */}
                        <div className="space-y-4">
                            <h5 className="text-xs font-black font-bukra uppercase tracking-widest text-brand-red flex items-center gap-2">
                                <Microscope className="w-4 h-4" />
                                Laboratórios & Grupos de Destaque
                            </h5>
                            <div className="space-y-2.5">
                                {currentDeptData.labsDestaque.map((lab, idx) => (
                                    <div key={idx} className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs font-bold font-open-sans text-gray-800 dark:text-gray-200 flex items-center justify-between">
                                        <span>{lab}</span>
                                        <span className="text-[10px] font-black font-bukra text-gray-400 uppercase">IFUSP</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ========================================================= */}
            {/* 6. RESILIÊNCIA ACADÊMICA: O VALOR DO "AINDA NÃO"         */}
            {/* ========================================================= */}
            <div className="p-6 sm:p-10 rounded-[40px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-2xl space-y-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-brand-yellow font-black font-bukra text-xs uppercase tracking-wider">
                        <Brain className="w-4 h-4" />
                        Mentoria & Amadurecimento
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black font-bukra text-gray-900 dark:text-white uppercase italic tracking-tight">
                        O Que Fazer Quando o Professor Diz &ldquo;Ainda Não&rdquo;?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed max-w-3xl">
                        Às vezes você pode não estar pronto ainda no momento, a cota de bolsas do laboratório pode estar esgotada ou você ainda não cursou matérias com pré-requisitos matemáticos necessários. <strong>Isso não é uma rejeição: é o início da sua mentoria.</strong>
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-brand-yellow text-xs font-black font-bukra uppercase">
                            <Sparkles className="w-4 h-4" />
                            A Pergunta que Transforma Portas Fechadas
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                            Se o docente disser que não pode orientar agora, nunca responda apenas com silêncio. Pergunte imediatamente:
                        </p>
                        <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs italic font-bold text-gray-900 dark:text-gray-100 font-open-sans">
                            &ldquo;Professor(a), compreendo perfeitamente. O(A) senhor(a) poderia me recomendar quais matérias cursar ou quais livros/artigos estudar neste semestre para me preparar melhor e tentar novamente?&rdquo;
                        </div>
                        <p className="text-[11px] text-gray-500 font-open-sans leading-relaxed">
                            Quase todos os docentes indicarão capítulos de livros clássicos ou sugerirão que você assista como ouvinte aos seminários do grupo.
                        </p>
                    </div>

                    <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                        <div className="flex items-center gap-2 text-brand-blue text-xs font-black font-bukra uppercase">
                            <TrendingUp className="w-4 h-4" />
                            A Força da Volta um Semestre Depois
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                            Estudar o material recomendado, ser aprovado com boas notas nas matérias indicadas e enviar um novo e-mail 6 meses depois dizendo: <em>&ldquo;Professor, estudei o material sugerido e fiz as disciplinas X e Y. Gostaria de conversar novamente&rdquo;</em> é o maior indicador de perseverança acadêmica que um estudante pode apresentar.
                        </p>
                        <p className="text-[11px] text-gray-500 font-open-sans leading-relaxed">
                            Essa atitude coloca você no topo de qualquer lista de candidatos a novos projetos e bolsas.
                        </p>
                    </div>
                </div>

                {/* Estante de Livros Recomendados */}
                <div className="space-y-4 pt-4">
                    <h4 className="text-xs font-black font-bukra uppercase tracking-widest text-brand-yellow flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Livros Clássicos de Transição Recomendados pelos Docentes do IFUSP
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LIVROS_RECOMENDADOS.map((livro, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:border-brand-yellow/40 transition-all flex flex-col justify-between group">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-brand-yellow font-bukra tracking-wider">
                                        {livro.area}
                                    </span>
                                    <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1 group-hover:text-brand-yellow transition-colors">
                                        {livro.titulo}
                                    </h5>
                                    <p className="text-[11px] text-gray-500 font-open-sans mt-0.5">
                                        {livro.autores}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-300 font-open-sans mt-3 leading-relaxed">
                                        {livro.descricao}
                                    </p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-gray-400 font-bold uppercase tracking-wider font-bukra">
                                    {livro.importancia}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 7. SISTEMA ATENA, EDITAIS OFICIAIS & BOLSAS DA PRPI      */}
            {/* ========================================================= */}
            <div className="space-y-8">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-brand-red font-bukra">
                        Sistemas Institucionais & Fomento
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black font-bukra text-gray-900 dark:text-white uppercase italic tracking-tight mt-1">
                        Sistema Atena, Editais & Bolsas
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans max-w-2xl mt-1 leading-relaxed">
                        Toda Iniciação Científica formal na USP passa pelo Sistema Atena da Pró-Reitoria de Pesquisa e Inovação (PRPI). Conheça as modalidades e acesse os editais vigentes para já ir lendo e ter noção exata do que esperar de requisitos, prazos e relatórios.
                    </p>
                </div>

                {/* Editais Oficiais Fornecidos pelo Usuário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Edital PIBIC */}
                    <div className="p-8 rounded-[36px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 hover:border-brand-red/40 shadow-2xl flex flex-col justify-between group transition-all">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="px-3.5 py-1.5 rounded-xl bg-brand-red/10 text-brand-red border border-brand-red/20 text-xs font-black font-bukra uppercase tracking-wider">
                                    Edital Oficial • PRPI / CNPq
                                </span>
                                <span className="text-xs font-bold text-gray-500 font-mono">2025/2026</span>
                            </div>

                            <h4 className="text-xl sm:text-2xl font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                                Edital PIBIC (Pesquisa Acadêmica)
                            </h4>

                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                                Programa Institucional de Bolsas de Iniciação Científica. Destinado a estudantes de graduação que atuam em projetos de pesquisa científica fundamental ou aplicada com dedicação semanal supervisionada.
                            </p>

                            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Valor da Bolsa:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">R$ 700,00 / mês</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Vigência:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">12 meses (renovável)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Avaliação:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">Mérito acadêmico & Projeto</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <a
                                href="https://prpi.usp.br/wp-content/uploads/sites/1239/2025/05/Edital-PIBIC-2025_2026.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs font-bukra uppercase tracking-wider shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span>Acessar Edital PIBIC (PDF)</span>
                            </a>
                            <span className="text-[11px] text-gray-500 text-center sm:text-right font-open-sans">
                                Leia os requisitos e prazos
                            </span>
                        </div>
                    </div>

                    {/* Edital PIBITI */}
                    <div className="p-8 rounded-[36px] bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 hover:border-brand-blue/40 shadow-2xl flex flex-col justify-between group transition-all">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="px-3.5 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-xs font-black font-bukra uppercase tracking-wider">
                                    Edital Oficial • PRPI / CNPq
                                </span>
                                <span className="text-xs font-bold text-gray-500 font-mono">2025/2026</span>
                            </div>

                            <h4 className="text-xl sm:text-2xl font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                                Edital PIBITI (Inovação Tecnológica)
                            </h4>

                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans leading-relaxed">
                                Programa de Bolsas em Desenvolvimento Tecnológico e Inovação. Focado na geração de patentes, protótipos, instrumentação, transferência de tecnologia e softwares de física aplicada.
                            </p>

                            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 bg-black/5 dark:bg-white/5 p-4 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Valor da Bolsa:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">R$ 700,00 / mês</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Foco:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">Inovação & Soluções Técnicas</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold">Submissão:</span>
                                    <span className="font-mono font-bold text-gray-900 dark:text-white">Via Atena PRPI</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                            <a
                                href="https://prpi.usp.br/wp-content/uploads/sites/1239/2025/05/Edital-PIBITI-2025_2026_PIBITI.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs font-bukra uppercase tracking-wider shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-2 group-hover:scale-105"
                            >
                                <Download className="w-4 h-4" />
                                <span>Acessar Edital PIBITI (PDF)</span>
                            </a>
                            <span className="text-[11px] text-gray-500 text-center sm:text-right font-open-sans">
                                Tecnologias & Protótipos
                            </span>
                        </div>
                    </div>
                </div>

                {/* Modalidades Adicionais: FAPESP, PUB, Bolsas DOW e Voluntária */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Bolsa FAPESP */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-3 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-brand-yellow font-black font-bukra text-xs uppercase tracking-wider">
                                <Award className="w-4 h-4" />
                                Bolsa FAPESP
                            </div>
                            <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                                Fluxo Contínuo (SAGe)
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-2 leading-relaxed">
                                Submetida em qualquer época do ano no sistema SAGe. Bolsa mensal de maior valor e <strong>Reserva Técnica</strong> (verba para livros, materiais e congressos).
                            </p>
                        </div>
                        <a
                            href="https://fapesp.br/bolsas/ic"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pt-3 border-t border-black/5 dark:border-white/5 inline-flex items-center justify-between text-xs font-black font-bukra text-brand-yellow hover:underline uppercase tracking-wider"
                        >
                            <span>Regras FAPESP</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Bolsa PUB - Pesquisa */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-3 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-brand-blue text-xs font-black font-bukra uppercase tracking-wider">
                                <Landmark className="w-4 h-4" />
                                PUB — Vertente Pesquisa
                            </div>
                            <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                                Edital PRG / USP
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-2 leading-relaxed">
                                O Programa Unificado de Bolsas da USP na vertente pesquisa é equivalente à IC formal e permite conciliar apoio com formação científica.
                            </p>
                        </div>
                        <a
                            href="https://prpi.usp.br/wp-content/uploads/sites/1239/2023/05/Edital-PUB-2023-2024.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pt-3 border-t border-black/5 dark:border-white/5 inline-flex items-center justify-between text-xs font-black font-bukra text-brand-blue hover:underline uppercase tracking-wider"
                        >
                            <span>Edital PUB USP</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* Bolsas Empresariais / DOW */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-3 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-brand-red text-xs font-black font-bukra uppercase tracking-wider">
                                <Lightbulb className="w-4 h-4" />
                                Bolsas DOW & Convênios
                            </div>
                            <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                                Parcerias Aplicadas
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-2 leading-relaxed">
                                Editais corporativos e convênios geridos pela PRPI para pesquisa em materiais, química, sustentabilidade e física ambiental.
                            </p>
                        </div>
                        <a
                            href="https://prpi.usp.br/wp-content/uploads/sites/1239/2024/07/Edital-DOW-2024_2025.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pt-3 border-t border-black/5 dark:border-white/5 inline-flex items-center justify-between text-xs font-black font-bukra text-brand-red hover:underline uppercase tracking-wider"
                        >
                            <span>Edital Bolsas DOW</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    {/* IC Voluntária (Sem Bolsa) */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl space-y-3 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-brand-blue font-black font-bukra text-xs uppercase tracking-wider">
                                <CheckCircle2 className="w-4 h-4" />
                                IC Sem Bolsa (Voluntária)
                            </div>
                            <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic mt-1">
                                Certificado Oficial USP
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-2 leading-relaxed">
                                Tem o mesmo valor acadêmico, gera certificado emitido pela PRPI, conta no Lattes e credita horas formativas. Aberto o ano todo no Atena!
                            </p>
                        </div>
                        <a
                            href="https://ateneu.usp.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pt-3 border-t border-black/5 dark:border-white/5 inline-flex items-center justify-between text-xs font-black font-bukra text-brand-blue hover:underline uppercase tracking-wider"
                        >
                            <span>Acessar Atena/Ateneu</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>

                {/* SIICUSP Banner Informativo */}
                <div className="p-6 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-brand-blue font-bukra tracking-wider">
                            Evento Obrigatório Anual • Apresentação de Resultados
                        </span>
                        <h5 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                            SIICUSP — Simpósio Internacional de Iniciação Científica e Tecnológica da USP
                        </h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans leading-relaxed max-w-2xl">
                            Todos os estudantes que concluem um projeto de IC/IT (PIBIC, PIBITI, FAPESP ou Voluntário) apresentam seus resultados na Etapa Internacional do SIICUSP. Os melhores trabalhos recebem menção honrosa e bolsas de intercâmbio científico no exterior.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-stretch md:self-auto">
                        <a
                            href="https://prpi.usp.br/wp-content/uploads/sites/1239/2024/06/SIICUSP-32-Edital.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-3 rounded-2xl bg-white dark:bg-[#1E1E1E] hover:bg-brand-blue hover:text-white text-gray-800 dark:text-gray-200 border border-black/10 dark:border-white/10 font-black text-xs font-bukra uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Edital SIICUSP (PDF)</span>
                        </a>
                        <a
                            href="https://prpi.usp.br/siicusp/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-3 rounded-2xl bg-brand-blue text-white font-black text-xs font-bukra uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20 hover:scale-105"
                        >
                            <span>Portal SIICUSP</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Central de Normas e Editais PRPI */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-black/5 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-2xl bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                            <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                            <h5 className="text-sm font-black font-bukra text-gray-900 dark:text-white uppercase italic">
                                Portal Geral de Editais & Normas da PRPI
                            </h5>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans">
                                Consulte todas as chamadas abertas, resoluções, retificações e resultados do ano letivo.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://prpi.usp.br/editais-e-normas/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs font-bukra uppercase tracking-wider shadow-lg shadow-brand-blue/20 transition-all flex items-center gap-2 shrink-0"
                    >
                        <span>Acessar Portal PRPI</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>
            </div>

        </div>
    );
}
