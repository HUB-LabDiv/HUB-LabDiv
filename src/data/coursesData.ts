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

import { CourseCurriculum, CourseId } from "@/types/curriculum";

export const coursesData: Record<CourseId, CourseCurriculum> = {
  bacharelado: {
    id: "bacharelado",
    nome: "Bacharelado em Física",
    codigoCurso: "43011 / 43012",
    turnosDisponiveis: ["integral", "noturno"],
    vagasAnuais: {
      total: 135,
      integral: 60,
      noturno: 75,
    },
    horasExtensaoAEx: 260,
    descricaoPedagogica:
      "Formação científica de excelência voltada ao desenvolvimento da autonomia intelectual e domínio das teorias fundamentais da física clássica, quântica, estatística e relativística, instrumental matemático refinado, física computacional e sólida prática laboratorial.",
    gradesPorTurno: {
      integral: {
        turno: "integral",
        nomeTurno: "Integral (4 Anos)",
        codigoHabilitacao: "43011",
        duracaoSemestres: 8,
        semestres: [
          {
            semestre: 1,
            titulo:
              "1º Semestre: Fundamentos de Mecânica e Linguagem Matemática",
            subtitulo:
              "Aclimatação ao rigor conceitual e ferramental de cálculo diferencial",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302111", "4302113", "MAT2453", "MAT0112"],
          },
          {
            semestre: 2,
            titulo:
              "2º Semestre: Gravitação, Fluidos, Ondas e Cálculo em Múltiplas Dimensões",
            subtitulo:
              "Aprofundamento fenomenológico e ampliação do aparato matemático",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302112", "4302114", "MAT2454", "MAT0122"],
          },
          {
            semestre: 3,
            titulo:
              "3º Semestre: Eletrostática, Magnetostática e Análise Vetorial",
            subtitulo:
              "Entrada no eletromagnetismo clássico e campos vetoriais",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302211", "4302213", "MAT0216", "4300218"],
          },
          {
            semestre: 4,
            titulo:
              "4º Semestre: Equações de Maxwell, Ótica Ondulatória e Métodos Numéricos",
            subtitulo:
              "Conclusão da física clássica básica e ferramentas computacionais avançadas",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302212", "4302214", "MAT0220", "MAP0214"],
          },
          {
            semestre: 5,
            titulo:
              "5º Semestre: Mecânica Analítica, Métodos Matemáticos e Termodinâmica",
            subtitulo:
              "Início do ciclo formal avançado: formulação lagrangiana e hamiltoniana",
            totalCreditosAula: 14,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302305", "4302204", "4300208", "4302313"],
          },
          {
            semestre: 6,
            titulo:
              "6º Semestre: Teoria Eletromagnética e Introdução à Física Quântica",
            subtitulo:
              "Formulações fundamentais e primeiros passos no mundo microscópico",
            totalCreditosAula: 6,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302303", "4302311"],
          },
          {
            semestre: 7,
            titulo:
              "7º Semestre: Mecânica Quântica Formal e Mecânica Estatística",
            subtitulo:
              "Estruturação quântica rigorosa e conexão microscópico-macroscópico",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302403", "4302401"],
          },
          {
            semestre: 8,
            titulo:
              "8º Semestre: Eletivas Avançadas, Iniciação Científica e Conclusão",
            subtitulo:
              "Personalização do currículo para inserção em pós-graduação ou mercado de ponta",
            totalCreditosAula: 0,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: [],
          },
        ],
      },
      noturno: {
        turno: "noturno",
        nomeTurno: "Noturno (5 Anos)",
        codigoHabilitacao: "43012",
        duracaoSemestres: 10,
        semestres: [
          {
            semestre: 1,
            titulo:
              "1º Semestre: Introdução ao Cálculo e Mecânica Newtoniana (Noturno)",
            subtitulo:
              "Entrada noturna: cálculo fundamental e física do movimento",
            totalCreditosAula: 14,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302111", "MAT2453", "MAT0112"],
          },
          {
            semestre: 2,
            titulo:
              "2º Semestre: Métodos Experimentais e Álgebra Matricial (Noturno)",
            subtitulo: "Prática laboratorial inicial e espaços vetoriais",
            totalCreditosAula: 12,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302113", "MAT2454", "MAT0122"],
          },
          {
            semestre: 3,
            titulo: "3º Semestre: Fluidos, Ondas e Cálculo Vetorial (Noturno)",
            subtitulo: "Mecânica contínua e análise vetorial de campos",
            totalCreditosAula: 14,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302112", "4302114", "MAT0216"],
          },
          {
            semestre: 4,
            titulo:
              "4º Semestre: Eletrostática e Modelagem Computacional (Noturno)",
            subtitulo: "Campos elétricos e introdução à programação científica",
            totalCreditosAula: 12,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302211", "4302213", "4300218"],
          },
          {
            semestre: 5,
            titulo:
              "5º Semestre: Eletromagnetismo Dinâmico e Equações Diferenciais (Noturno)",
            subtitulo:
              "Indução de Faraday e métodos analíticos de equações diferenciais",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302212", "MAT0220"],
          },
          {
            semestre: 6,
            titulo:
              "6º Semestre: Ótica Experimental, Cálculo Numérico e Termodinâmica (Noturno)",
            subtitulo: "Laboratório de ondas/ótica e fundamentos térmicos",
            totalCreditosAula: 10,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302214", "MAP0214", "4300208"],
          },
          {
            semestre: 7,
            titulo:
              "7º Semestre: Mecânica Analítica e Métodos da Física Teórica (Noturno)",
            subtitulo: "Formalismo lagrangiano e funções de variável complexa",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302305", "4302204"],
          },
          {
            semestre: 8,
            titulo:
              "8º Semestre: Eletrodinâmica e Início da Física Quântica (Noturno)",
            subtitulo:
              "Teoria de potenciais eletromagnéticos e dualidade quântica",
            totalCreditosAula: 10,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302303", "4302311", "4302313"],
          },
          {
            semestre: 9,
            titulo:
              "9º Semestre: Mecânica Quântica nos Espaços de Hilbert (Noturno)",
            subtitulo: "Operadores de Dirac, spin e momento angular",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302403"],
          },
          {
            semestre: 10,
            titulo:
              "10º Semestre: Mecânica Estatística e Conclusão Noturna (Noturno)",
            subtitulo:
              "Ensembles quânticos e consolidação das 260h de AEx e optativas",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302401"],
          },
        ],
      },
    },
  },
  licenciatura: {
    id: "licenciatura",
    nome: "Licenciatura em Física",
    codigoCurso: "43021 / 43022",
    turnosDisponiveis: ["diurno", "noturno"],
    vagasAnuais: {
      total: 100,
      diurno: 40,
      noturno: 60,
    },
    horasExtensaoAEx: 260,
    descricaoPedagogica:
      "Curso dedicado a formar o Educador em Física do Século XXI, articulando conteúdos conceituais rigorosos com teorias pedagógicas contemporâneas, metodologias ativas, inclusão, Libras, história da ciência e 400h de imersão docente supervisionada em escolas públicas.",
    gradesPorTurno: {
      diurno: {
        turno: "diurno",
        nomeTurno: "Diurno (4 Anos)",
        codigoHabilitacao: "43021",
        duracaoSemestres: 8,
        semestres: [
          {
            semestre: 1,
            titulo: "1º Semestre: Fundamentos de Mecânica, Ótica e Linguagem",
            subtitulo:
              "Início da articulação entre física fundamental, cálculo e reflexão pedagógica",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: [
              "4300151",
              "4300160",
              "MAT1351",
              "MAT0105",
              "4300157",
            ],
          },
          {
            semestre: 2,
            titulo:
              "2º Semestre: Mecânica Intermediária, Medidas Físicas e Didática Geral",
            subtitulo:
              "Experimentos didáticos e imersão na teoria educacional da FEUSP",
            totalCreditosAula: 20,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: [
              "4300153",
              "4300152",
              "MAT1352",
              "4300156",
              "EDM0402",
            ],
          },
          {
            semestre: 3,
            titulo:
              "3º Semestre: Corpos Rígidos, Física do Calor e Psicologia da Educação",
            subtitulo:
              "Desenvolvimento cognitivo do estudante e laboratório de mecânica",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["EDF0290"],
          },
          {
            semestre: 4,
            titulo:
              "4º Semestre: Eletromagnetismo Básico, Termo-Estatística e Políticas Públicas",
            subtitulo: "POEB na FEUSP e Estrutura do Ensino de Física",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: ["EDA0463", "4300356"],
          },
          {
            semestre: 5,
            titulo:
              "5º Semestre: Ondas, Eletromagnetismo II, Inclusão, Libras e Práticas",
            subtitulo:
              "Propostas de ensino inclusivas e 50h de estágio de regência supervisionada",
            totalCreditosAula: 6,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300458", "4300390"],
          },
          {
            semestre: 6,
            titulo:
              "6º Semestre: Física Moderna, Metodologia de Ensino e Estágio Aprofundado",
            subtitulo:
              "A passagem para o século XX e regência ativa de turmas de Ensino Médio",
            totalCreditosAula: 6,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["EDM0425", "4300391"],
          },
          {
            semestre: 7,
            titulo:
              "7º Semestre: Quântica para o Ensino, Evolução Conceitual e Estágio Final",
            subtitulo:
              "História e Filosofia da Física e fechamento das horas de regência escolar",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300474", "EDM0426"],
          },
          {
            semestre: 8,
            titulo:
              "8º Semestre: Integralização, Validação de Portfólio ATPA e Formatura",
            subtitulo:
              "Consolidação das 400h de estágio, 400h de PCC e 200h de atividades complementares",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300490"],
          },
        ],
      },
      noturno: {
        turno: "noturno",
        nomeTurno: "Noturno (5 Anos)",
        codigoHabilitacao: "43022",
        duracaoSemestres: 10,
        semestres: [
          {
            semestre: 1,
            titulo:
              "1º Semestre: Mecânica Básica e Linguagem Científica (Noturno)",
            subtitulo: "Início da trajetória formativa no período noturno",
            totalCreditosAula: 12,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300151", "MAT1351", "4300157"],
          },
          {
            semestre: 2,
            titulo:
              "2º Semestre: Geometria Analítica e Medidas de Laboratório (Noturno)",
            subtitulo: "Álgebra vetorial e metodologia experimental didática",
            totalCreditosAula: 10,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300152", "MAT0105", "4300160"],
          },
          {
            semestre: 3,
            titulo:
              "3º Semestre: Dinâmica Avançada e Cálculo Integral (Noturno)",
            subtitulo: "Sistemas de partículas e cálculo em uma variável",
            totalCreditosAula: 12,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300153", "MAT1352", "4300156"],
          },
          {
            semestre: 4,
            titulo:
              "4º Semestre: Didática Geral e Planejamento Escolar (Noturno)",
            subtitulo: "Imersão na Faculdade de Educação e primeiros estágios",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["EDM0402"],
          },
          {
            semestre: 5,
            titulo:
              "5º Semestre: Psicologia do Desenvolvimento e Ensino de Ciências (Noturno)",
            subtitulo: "Teorias de aprendizagem e transposição didática",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: ["EDF0290", "4300356"],
          },
          {
            semestre: 6,
            titulo:
              "6º Semestre: Estrutura Escolar (POEB) e Regência Inicial (Noturno)",
            subtitulo: "Legislação e primeiras 50h de regência em sala",
            totalCreditosAula: 6,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["EDA0463", "4300390"],
          },
          {
            semestre: 7,
            titulo: "7º Semestre: Inclusão, Libras e Metodologia I (Noturno)",
            subtitulo: "Sequências didáticas acessíveis e estágio escolar",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: ["4300458", "EDM0425"],
          },
          {
            semestre: 8,
            titulo:
              "8º Semestre: Práticas II e Regência em Ensino Médio (Noturno)",
            subtitulo: "Supervisão docente compartilhada na CoCLic",
            totalCreditosAula: 2,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4300391"],
          },
          {
            semestre: 9,
            titulo: "9º Semestre: Epistemologia e Metodologia II (Noturno)",
            subtitulo: "História da ciência e estágio com física contemporânea",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300474", "EDM0426"],
          },
          {
            semestre: 10,
            titulo:
              "10º Semestre: Laboratório de Ensino e Integralização das 400h (Noturno)",
            subtitulo: "Construção de experimentos de baixo custo e conclusão",
            totalCreditosAula: 4,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: ["4300490"],
          },
        ],
      },
    },
    horasEstagio: 400,
  },
  "fisica-medica": {
    id: "fisica-medica",
    nome: "Bacharelado em Física Médica",
    codigoCurso: "43031",
    turnosDisponiveis: ["integral"],
    vagasAnuais: {
      total: 35,
      integral: 35,
    },
    horasExtensaoAEx: 321,
    descricaoPedagogica:
      "Formação multidisciplinar pioneira entre o IFUSP e a Faculdade de Medicina (FMUSP), integrando física nuclear, atômica e molecular às aplicações médicas em radioterapia, medicina nuclear, proteção radiológica, controle de qualidade hospitalar e diagnóstico por imagem.",
    gradesPorTurno: {
      integral: {
        turno: "integral",
        nomeTurno: "Integral (5 Anos)",
        codigoHabilitacao: "43031",
        duracaoSemestres: 10,
        semestres: [
          {
            semestre: 1,
            titulo:
              "1º Semestre: Fundamentos da Física, Geometria e Nivelamento",
            subtitulo: "Introdução ao cálculo e bases da mecânica e vetores",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302111", "4302113", "MAT2453", "MAT0112"],
          },
          {
            semestre: 2,
            titulo:
              "2º Semestre: Introdução à Física Médica, Anatomia e Fisiologia",
            subtitulo:
              "Início da interface biomédica direta com a Faculdade de Medicina (FMUSP)",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: [
              "4302112",
              "4302114",
              "MAT2454",
              "MDR0632",
              "MDR0633",
            ],
          },
          {
            semestre: 3,
            titulo:
              "3º Semestre: Eletricidade, Magnetismo e Estatística Médica",
            subtitulo:
              "Domínio do eletromagnetismo e bioestatística aplicada à saúde",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4302211", "4302213", "MAT0216", "MDR0635"],
          },
          {
            semestre: 4,
            titulo: "4º Semestre: Ondas Eletromagnéticas e Informática Médica",
            subtitulo:
              "Equações de Maxwell, ótica e sistemas digitais em saúde",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: ["4302212", "4302214", "MAC0115", "MDR0634"],
          },
          {
            semestre: 5,
            titulo:
              "5º Semestre: Física do Corpo Humano e Diagnóstico por Imagem",
            subtitulo:
              "Transição aprofundada para os princípios físicos de formação de imagem",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4300325", "MDR0639", "4302204", "MDR0637"],
          },
          {
            semestre: 6,
            titulo:
              "6º Semestre: Radiação Ionizante, Efeitos Biológicos e Instrumentação",
            subtitulo:
              "Radiobiologia e tecnologia dos equipamentos médico-hospitalares",
            totalCreditosAula: 18,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: [
              "MDR0636",
              "4300436",
              "4302311",
              "4302305",
              "MAP0214",
            ],
          },
          {
            semestre: 7,
            titulo: "7º Semestre: Física das Radiações e Proteção Radiológica",
            subtitulo:
              "Interação da radiação com a matéria e normas regulatórias da CNEN/Anvisa",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 0,
            disciplinasCodigos: ["4300437", "MDR0640", "4302403", "4302303"],
          },
          {
            semestre: 8,
            titulo:
              "8º Semestre: Dosimetria Clínica, Radioterapia e Medicina Nuclear",
            subtitulo:
              "Aceleradores lineares de alta energia, radiofármacos e PET-CT",
            totalCreditosAula: 16,
            totalCreditosTrabalho: 2,
            disciplinasCodigos: [
              "4300439",
              "MDR0641",
              "MDR0642",
              "MDR0643",
              "MDR0644",
            ],
          },
          {
            semestre: 9,
            titulo:
              "9º Semestre: Estágio Hospitalar Supervisionado no Complexo HC",
            subtitulo:
              "120 horas de imersão clínica obrigatória no InRad, ICESP e InCor",
            totalCreditosAula: 8,
            totalCreditosTrabalho: 4,
            disciplinasCodigos: ["MDR0647", "MDR0645", "MDR0646"],
          },
          {
            semestre: 10,
            titulo:
              "10º Semestre: Práticas Profissionais Avançadas, Extensão e TCC",
            subtitulo:
              "Regime integral de imersão com 286 horas de extensão dialógica e TCC",
            totalCreditosAula: 0,
            totalCreditosTrabalho: 10,
            disciplinasCodigos: ["MDR0660", "MDR0661"],
          },
        ],
      },
    },
  },
};
