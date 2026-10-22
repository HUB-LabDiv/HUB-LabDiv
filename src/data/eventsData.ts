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

import { EventItem } from "@/types/events";

export const eventsData: Record<string, EventItem> = {
  "i-encontro-de-saude-e-bem-estar-no-trabalho-do-ifusp": {
    id: "i-encontro-de-saude-e-bem-estar-no-trabalho-do-ifusp",
    titulo: "I ENCONTRO DE SAÚDE E BEM-ESTAR NO TRABALHO DO IFUSP",
    tipo: "workshop",
    data: "17/11/2026",
    horario: "17:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "muita satisfação",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Com muita satisfação, o Instituto de Física da USP realizará, pela primeira vez, oI Encontro de Saúde e Bem-Estar no Trabalho, nos dias17 e 18 de novembro de 2026, no Auditório Abrahão de Moraes.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/i-encontro-de-sa%C3%BAde-e-bem-estar-no-trabalho-do-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Workshop", "Física"],
  },
  "the-international-union-of-pure-and-applied-physics-its-new": {
    id: "the-international-union-of-pure-and-applied-physics-its-new",
    titulo:
      "The International Union of Pure and Applied Physics. Its new vision and its future in Latin America and the Caribbean | Colóquio IFUSP",
    tipo: "coloquio",
    data: "29/10/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: null,
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: The International Union of Pure and Applied Physics. Its new vision and its future in Latin America and the Caribbean | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/international-union-pure-and-applied-physics-its-new-vision-and-its-future-latin",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "fisica-do-cotidiano-ciclo-de-palestras": {
    id: "fisica-do-cotidiano-ciclo-de-palestras",
    titulo: "FÍSICA DO COTIDIANO - Ciclo de Palestras",
    tipo: "institucional",
    data: "27/10/2026",
    horario: "14:00",
    local: {
      nome: "Auditório Adma Jafet",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Otaviano Helene",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Balanço de energia no corpo humano.Eficiência dos nossos músculos para a produção de trabalho mecânico.Quantos quilômetros podemos andar usando a energia de uma barrinha de cereal?Como refrigeramos nosso corpo? Precisamos eliminar perto de 100 W para refrigerar nosso corpo. Fazemos isso por meio da irradiação, da condução e da evaporação da água. Quanta energia dissipamos por meio de cada um desses mecanismos?Temperatura e sensação térmica: quanto mais úmido, maior é a sensação térmica. Por que?E por onde sai quase tudo o que comemos?",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/f%C3%ADsica-do-cotidiano-ciclo-de-palestras",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Física", "Institucional"],
  },
  "2-dimensional-conformal-field-theories-an-axiomatic-approach": {
    id: "2-dimensional-conformal-field-theories-an-axiomatic-approach",
    titulo:
      "2-dimensional conformal field theories: an axiomatic approach | Colóquio do DFMA",
    tipo: "coloquio",
    data: "terça-feira, 20 Outubro, 2026 - 16:00",
    horario: "16:00",
    local: {
      nome: "Sala Jayme",
      formato: "hibrido",
    },
    palestrante: null,
    resumo:
      "Quantum field theory is a branch of theoretical physics that regards subatomic particles and their interactions. Despite its remarkable experimental success, the theory still lacks a fully rigorous mathematical foundation. One of the earliest attempts to axiomatize quantum field theory was made by Wightman in the 1950s, taking quantum fields as the fundamental objects. In the 1960s, Araki, Haag and Kastler introduced a different approach, known as Algebraic Quantum Field Theory. In this framework, rather than working directly with quantum fields, one considers families of algebras of bounded o",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/2-dimensional-conformal-field-theories-axiomatic-approach-col%C3%B3quio-do-dfma",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "altermagnetism-an-unconventional-quantum-state-of-matter-col": {
    id: "altermagnetism-an-unconventional-quantum-state-of-matter-col",
    titulo:
      "Altermagnetism: an unconventional quantum state of matter | Colóquio Gleb Wataghin",
    tipo: "coloquio",
    data: "segunda-feira, 19 Outubro, 2026 - 11:00",
    horario: "11:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Rafael Fernandes",
      afiliacao: "Universidade de Illinois Urbana-Champaign",
      titulacao: "Prof.",
    },
    resumo:
      "Magnetism is the posterchild of how the interplay between electron-electron interactions and quantum physics promotes novel macroscopic phenomena. Historically, the evolution of our understanding of magnetism has been related to the discovery of new paradigms in condensed-matter physics, as exemplified by the connections between antiferromagnetism and Mott insulators, spin glasses and non-ergodic states, and spin liquids and fractionalized excitations. Recently, a new framework proposed to classify magnetic phases brought renewed interest in unconventional magnetic states, which are qualitativ",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/altermagnetism-unconventional-quantum-state-matter-col%C3%B3quio-gleb-wataghin",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf:
        "https://portal.if.usp.br/ifusp/sites/portal.if.usp.br.ifusp/files/Convite-Coloquio-GW-1.pdf",
    },
    destaque: true,
    tags: ["Física", "Gleb Wataghin", "Coloquio"],
  },
  "semana-da-fisica-2026-ifusp": {
    id: "semana-da-fisica-2026-ifusp",
    titulo: "Semana da Física 2026 - IFUSP",
    tipo: "workshop",
    data: "segunda-feira, 19 Outubro, 2026 - 09:00",
    horario: "15:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "a programação",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Organização:Comissão de Graduação e Comissão de Pesquisa e Inovação do IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/semana-da-f%C3%ADsica-2026-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Workshop", "Física", "Física Médica"],
  },
  "estudo-da-dinamica-do-efeito-malter-em-multiplicadores-gasos": {
    id: "estudo-da-dinamica-do-efeito-malter-em-multiplicadores-gasos",
    titulo:
      "Estudo da Dinâmica do Efeito Malter em Multiplicadores Gasosos de Elétrons via Simulações Computacionais | Ciclo de seminários de física aplicada: da teoria à inovação",
    tipo: "seminario",
    data: "16/10/2026",
    horario: "14:00",
    local: {
      nome: "Sala De",
      formato: "hibrido",
    },
    palestrante: null,
    resumo:
      "Detectores GEM são essenciais na física de altas energias, mas sofrem degradação em operações prolongadas. Contaminantes no gás formam camadas isolantes que induzem o Efeito Malter, causando a extração contínua de elétrons e descargas elétricas que podem inutilizar o dispositivo. Para investigar esse problema, modelamos o Efeito Malter e o incorporamos em simulações computacionais de transporte de elétrons. Os resultados revelam as regiões críticas de acúmulo de carga, auxiliando na compreensão do fenômeno e no desenvolvimento de estratégias para mitigar falhas nesses detectores. ​Data e horár",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/estudo-da-din%C3%A2mica-do-efeito-malter-em-multiplicadores-gasosos-de-el%C3%A9trons",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Seminario", "Física"],
  },
  "relatividade-teoria-e-realidade-continuacao-convite-a-fisica": {
    id: "relatividade-teoria-e-realidade-continuacao-convite-a-fisica",
    titulo: "Relatividade: Teoria e Realidade (Continuação) | Convite à Física",
    tipo: "convite-fisica",
    data: "14/10/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Daniel Vanzella",
      afiliacao: "IFSC-USP",
      titulacao: "Prof.",
    },
    resumo:
      "No primeiro quarto do século XX, nossa compreensão da Natureza passou por algumas das maiores revoluções na história do pensamento humano. Duas dessas revoluções, condensadas nas teorias da Relatividade Restrita e Relatividade Geral, mudaram para sempre nosso entendimento acerca dos conceitos básicos de tempo e espaço. Nesta palestra, faremos uma breve excursão por algumas das previsões nada intuitivas dessas teorias e vamos acompanhar mais de 100 anos de testes experimentais e observacionais que as puseram à prova. Até hoje, essas teorias representam nosso melhor entendimento da arena na qual",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/relatividade-teoria-e-realidade-continua%C3%A7%C3%A3o-convite-%C3%A0-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Relatividade", "Física", "Convite Fisica"],
  },
  "a-victorian-theory-in-a-quantum-world-thermodynamic-uncertai": {
    id: "a-victorian-theory-in-a-quantum-world-thermodynamic-uncertai",
    titulo:
      "A Victorian Theory in a Quantum World: Thermodynamic Uncertainty Relations, Quantum Chaos, and Symmetry | Seminário de Física Estatística",
    tipo: "seminario",
    data: "14/10/2026",
    horario: "15:00",
    local: {
      nome: "Sala De",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Ivana Ribeiro A",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Abstract:Thermodynamics was forged alongside the industrial transformations of the nineteenth century. Questions about steam engines and their efficiency gave rise to fundamental concepts — heat, work, entropy, irreversibility — that together describe a macroscopic world in which relative fluctuations are negligible and the collective motion of countless particles is captured by just a few variables.Modern electronic devices take us far beyond this macroscopic limit. At mesoscopic scales, when the device size becomes comparable to the phase-coherence length, the quantum nature of electrons can",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/victorian-theory-quantum-world-thermodynamic-uncertainty-relations-quantum-chaos-and",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Seminario", "Física"],
  },
  "gaussian-generally-covariant-hydrodynamics-coloquio-do-dfma": {
    id: "gaussian-generally-covariant-hydrodynamics-coloquio-do-dfma",
    titulo: "Gaussian generally covariant hydrodynamics | Colóquio do DFMA",
    tipo: "coloquio",
    data: "terça-feira, 13 Outubro, 2026 - 16:00",
    horario: "16:00",
    local: {
      nome: "Sala Jayme",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Giorgio Torrieri",
      afiliacao: "Unicamp",
      titulacao: "Prof.",
    },
    resumo:
      "We review the evidence of the applicability of hydrodynamics in small systems and argue that it poses a challenge to the microscopic theories from which relativistic hydrodynamics is usually derived. We then argue that Gibbsian statistical mechanics, together with local Lorentz symmetry, could yield to a formulation of fluctuating hydrodynamics as a stochastic process rather than the usual gradient expansion of conservation equations. We outline the derivation, and show that in this approach the applicability of hydrodynamics is not constrained by usual requirements of many degrees of freedom ",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/gaussian-generally-covariant-hydrodynamics-col%C3%B3quio-do-dfma",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "withstanding-the-extreme-advanced-materials-for-nasa-s-next": {
    id: "withstanding-the-extreme-advanced-materials-for-nasa-s-next",
    titulo:
      "Withstanding the Extreme: Advanced Materials for NASA's Next Missions | Colóquio IFUSP",
    tipo: "coloquio",
    data: "09/10/2026",
    horario: "14:00",
    local: {
      nome: "Auditório Adma Jafet",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Dr. Gustavo Costa",
      afiliacao: "",
      titulacao: "Dr.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Withstanding the Extreme: Advanced Materials for NASA's Next Missions | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/withstanding-extreme-advanced-materials-nasas-next-missions-col%C3%B3quio-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "cruzando-fronteiras-uma-historia-do-brasil-no-cern-coloquio": {
    id: "cruzando-fronteiras-uma-historia-do-brasil-no-cern-coloquio",
    titulo:
      "Cruzando Fronteiras: Uma História do Brasil no CERN | Colóquio IFUSP",
    tipo: "coloquio",
    data: "08/10/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Adma Jafet",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Ivã Gurgel",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Cruzando Fronteiras: Uma História do Brasil no CERN | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/cruzando-fronteiras-uma-hist%C3%B3ria-do-brasil-no-cern-col%C3%B3quio-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "relatividade-teoria-e-realidade-convite-a-fisica": {
    id: "relatividade-teoria-e-realidade-convite-a-fisica",
    titulo: "Relatividade: Teoria e Realidade | Convite à Física",
    tipo: "convite-fisica",
    data: "07/10/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Daniel Vanzella",
      afiliacao: "IFSC-USP",
      titulacao: "Prof.",
    },
    resumo:
      "No primeiro quarto do século XX, nossa compreensão da Natureza passou por algumas das maiores revoluções na história do pensamento humano. Duas dessas revoluções, condensadas nas teorias da Relatividade Restrita e Relatividade Geral, mudaram para sempre nosso entendimento acerca dos conceitos básicos de tempo e espaço. Nesta palestra, faremos uma breve excursão por algumas das previsões nada intuitivas dessas teorias e vamos acompanhar mais de 100 anos de testes experimentais e observacionais que as puseram à prova. Até hoje, essas teorias representam nosso melhor entendimento da arena na qual",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/relatividade-teoria-e-realidade-convite-%C3%A0-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Relatividade", "Física", "Convite Fisica"],
  },
  "opinion-distrust-and-discrimination-in-interacting-neural-ne": {
    id: "opinion-distrust-and-discrimination-in-interacting-neural-ne",
    titulo:
      "Opinion, Distrust and Discrimination in Interacting Neural Networks | Seminário de Física Estatística",
    tipo: "seminario",
    data: "07/10/2026",
    horario: "15:00",
    local: {
      nome: "Sala De",
      formato: "hibrido",
    },
    palestrante: null,
    resumo:
      "Abstract:Models of opinion dynamics often represent individuals as simple agents with no internal structure. Here, we consider a society of agents in which each individual is an adaptive neural network to form binary opinions about public issues and maintains an evolving estimate of how much it distrusts every other agent.During pairwise interactions, agents update both their opinions and their trust relations using a learning rule derived from a Maximum Entropy approximation to Bayesian learning. The rule is optimal in the limit of high-dimensional issues and small societies. Learning occurs ",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/opinion-distrust-and-discrimination-interacting-neural-networks-semin%C3%A1rio-de-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Seminario", "Física"],
  },
  "iii-congresso-latinoamericano-de-arqueometria-e-conservacao": {
    id: "iii-congresso-latinoamericano-de-arqueometria-e-conservacao",
    titulo:
      "III Congresso Latinoamericano de Arqueometria e Conservação do Patrimônio Cultural | CLASMAC 2026",
    tipo: "workshop",
    data: "05/10/2026",
    horario: "09:00",
    local: {
      nome: "Auditório Adma Jafet",
      formato: "hibrido",
    },
    palestrante: {
      nome: "cursos pré",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: III Congresso Latinoamericano de Arqueometria e Conservação do Patrimônio Cultural | CLASMAC 2026.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/iii-congresso-latinoamericano-de-arqueometria-e-conserva%C3%A7%C3%A3o-do-patrim%C3%B4nio-cultural-clasmac",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Workshop", "Física"],
  },
  "non-equilibrium-cybernetics-of-chemical-reaction-networks-co": {
    id: "non-equilibrium-cybernetics-of-chemical-reaction-networks-co",
    titulo:
      "Non-equilibrium Cybernetics of Chemical Reaction Networks | Colóquio IFUSP",
    tipo: "coloquio",
    data: "01/10/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Jonas Berx",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Non-equilibrium Cybernetics of Chemical Reaction Networks | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/non-equilibrium-cybernetics-chemical-reaction-networks-col%C3%B3quio-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "emaranhamento-para-o-bem-ou-para-o-mal-seguranca-e-privacida": {
    id: "emaranhamento-para-o-bem-ou-para-o-mal-seguranca-e-privacida",
    titulo:
      "Emaranhamento, para o bem ou para o mal: segurança e privacidade na era da computação quântica | Convite à Física",
    tipo: "convite-fisica",
    data: "30/09/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Adma Jafet",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Rafael Ferreira",
      afiliacao: "IFUSP",
      titulacao: "Prof.",
    },
    resumo:
      "Nesse seminário, apresentaremos os fundamentos da computação quântica e explicaremos o risco que ela põe à segurança da informação na era moderna. Discutiremos o algoritmo de Shor e sua aplicação à quebra da criptografia de chaves públicas convencional e apresentaremos as soluções que a física quântica nos fornece como recurso de defesa. Veremos que o mesmo emaranhamento que faz dos computadores quânticos uma ameaça torna as redes quânticas modernas incondicionalmente seguras, através da criptografia quântica. Finalizaremos apresentando um pouco do que temos feito na USP nesta direção. Confira",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/emaranhamento-para-o-bem-ou-para-o-mal-seguran%C3%A7a-e-privacidade-na-era-da-computa%C3%A7%C3%A3o",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Física Quântica", "Física", "Convite Fisica"],
  },
  "multi-neutron-clusters-in-neutron-rich-nuclei-coloquio-ifusp": {
    id: "multi-neutron-clusters-in-neutron-rich-nuclei-coloquio-ifusp",
    titulo: "Multi-neutron clusters in neutron-rich nuclei | Colóquio IFUSP",
    tipo: "coloquio",
    data: "24/09/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Takashi Nakamura",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Multi-neutron clusters in neutron-rich nuclei | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/multi-neutron-clusters-neutron-rich-nuclei-col%C3%B3quio-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "poisson-electrodynamics-coloquio-do-dfma": {
    id: "poisson-electrodynamics-coloquio-do-dfma",
    titulo: "Poisson electrodynamics | Colóquio do DFMA",
    tipo: "coloquio",
    data: "quinta-feira, 24 Setembro, 2026 - 14:00",
    horario: "14:00",
    local: {
      nome: "Sala Jayme",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Vladislav Kupriyanov",
      afiliacao: "UFABC",
      titulacao: "Prof.",
    },
    resumo:
      "Gauge theories on noncommutative spaces with a position-dependent noncommutativity tensor $\\Theta^{ab}(x)$ present a fundamental difficulty: ordinary derivatives do not satisfy the Leibniz rule with respect to the corresponding Poisson bracket. Consequently, the standard construction of gauge transformations, field strengths, and gauge-invariant actions must be deformed. In this talk, I will describe a geometric construction of Poisson electrodynamics, a semiclassical approximation to noncommutative gauge theory that is first order in $\\hbar$ but exact to all orders in $\\Theta$. Using symplect",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/poisson-electrodynamics-col%C3%B3quio-do-dfma",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "as-redes-neurais-que-impulsionam-a-ia-convite-a-fisica": {
    id: "as-redes-neurais-que-impulsionam-a-ia-convite-a-fisica",
    titulo: "As redes neurais que impulsionam a IA | Convite à Física",
    tipo: "convite-fisica",
    data: "23/09/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Nestor Caticha",
      afiliacao: "DFGE",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: As redes neurais que impulsionam a IA | Convite à Física.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/redes-neurais-que-impulsionam-ia-convite-%C3%A0-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Física", "Convite Fisica"],
  },
  "ajustando-estados-quanticos-com-pressao-de-semimetais-de-wey": {
    id: "ajustando-estados-quanticos-com-pressao-de-semimetais-de-wey",
    titulo:
      "Ajustando Estados Quânticos com Pressão: de Semimetais de Weyl a Supercondutores Correlacionados",
    tipo: "seminario",
    data: "quarta-feira, 23 Setembro, 2026 - 16:00",
    horario: "16:00",
    local: {
      nome: "Sala De",
      formato: "hibrido",
    },
    palestrante: {
      nome: "a Prof",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Ajustando Estados Quânticos com Pressão: de Semimetais de Weyl a Supercondutores Correlacionados.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/ajustando-estados-qu%C3%A2nticos-com-press%C3%A3o-de-semimetais-de-weyl-supercondutores-correlacionados",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Seminario", "Física", "Física Quântica"],
  },
  "exact-thermodynamic-inference-in-classical-and-quantum-syste": {
    id: "exact-thermodynamic-inference-in-classical-and-quantum-syste",
    titulo:
      "Exact thermodynamic inference in classical and quantum systems | Seminário de Física Estatística",
    tipo: "seminario",
    data: "23/09/2026",
    horario: "15:00",
    local: {
      nome: "Sala De",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Gustavo A",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Resumo:Classical and quantum thermodynamics share a problem: the quantities theory speaks of are rarely the ones an experiment can reach. Hidden transitions in a Markov network and coherences inside a working medium are inaccessible for different reasons, but both leave the same gap between prediction and measurement, and both are usually addressed by bounding what cannot be seen. We show that the gap closes exactly. A system relaxing after a perturbation of arbitrary strength obeys a single closed equation, fixed by the network itself and indifferent to how hard the system is driven. The argu",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/exact-thermodynamic-inference-classical-and-quantum-systems-semin%C3%A1rio-de-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Seminario", "Física"],
  },
  "criacao-de-materia-no-nucleo-do-atomo-decaimento-duplo-beta": {
    id: "criacao-de-materia-no-nucleo-do-atomo-decaimento-duplo-beta",
    titulo:
      "Criação de matéria no núcleo do átomo: decaimento duplo beta sem neutrinos e a natureza do neutrino | Colóquio IFUSP",
    tipo: "coloquio",
    data: "17/09/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Ubirajara van Kolck",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Criação de matéria no núcleo do átomo: decaimento duplo beta sem neutrinos e a natureza do neutrino | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/cria%C3%A7%C3%A3o-de-mat%C3%A9ria-no-n%C3%BAcleo-do-%C3%A1tomo-decaimento-duplo-beta-sem-neutrinos-e-natureza",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "little-bangs-o-principio-do-universo-no-laboratorio-convite": {
    id: "little-bangs-o-principio-do-universo-no-laboratorio-convite",
    titulo:
      "Little Bangs: o princípio do universo no laboratório | Convite à Física",
    tipo: "convite-fisica",
    data: "16/09/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Profa. Ana Júlia Mizher",
      afiliacao: "DFNC",
      titulacao: "Profa.",
    },
    resumo:
      "Ao longo do último século, construímos, a partir de evidências observadas nos dias de hoje, uma descrição dos primeiros instantes da história do Universo. Mas como se comportava a matéria nesse Universo primordial? Quais eram suas semelhanças e diferenças em relação à matéria que observamos hoje? Essas questões são investigadas em experimentos realizados em grandes colisores de partículas, nos quais é possível criar, por instantes extremamente breves, condições semelhantes às que existiram nos primeiros microssegundos após o Big Bang. Nessas condições forma-se o chamado plasma de quarks e glúo",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/little-bangs-o-princ%C3%ADpio-do-universo-no-laborat%C3%B3rio-convite-%C3%A0-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Física", "Convite Fisica"],
  },
  "mathematical-quantum-field-theory-from-principles-to-the-con": {
    id: "mathematical-quantum-field-theory-from-principles-to-the-con",
    titulo:
      "Mathematical Quantum Field Theory: From Principles to the Construction and Understanding of Models | Colóquio IFUSP",
    tipo: "coloquio",
    data: "03/09/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Gandalf Lechner",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Mathematical Quantum Field Theory: From Principles to the Construction and Understanding of Models | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/mathematical-quantum-field-theory-principles-construction-and-understanding-models",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "beyond-n-point-functions-renormalized-eft-for-galaxy-cluster": {
    id: "beyond-n-point-functions-renormalized-eft-for-galaxy-cluster",
    titulo:
      "Beyond n-Point Functions: Renormalized EFT for Galaxy Clustering and Field-Level Cosmology | Colóquio do DFMA",
    tipo: "coloquio",
    data: "03/09/2026",
    horario: "14:00",
    local: {
      nome: "Sala Jayme",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Fabian Schmidt",
      afiliacao: "Max Planck Institute for Astrophysics",
      titulacao: "Prof.",
    },
    resumo:
      "Abstract: The distribution of galaxies encodes a wealth of information on dark energy, dark matter, gravity, and inflation. However, extraction of robust cosmological constraints requires us to abstract from the highly uncertain physics of galaxy formation. The unique well-controlled, symmetry-based approach to this problem is the effective field theory of large-scale structure. I will discuss a new Wilson-Polchinski-like approach to renormalize this EFT. This approach has allowed us to clarify a key component of the EFT, namely the stochastic, effective-noise contributions. Moreover, it enabl",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/beyond-n-point-functions-renormalized-eft-galaxy-clustering-and-field-level",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "gps-geometria-tempo-e-relatividade-no-bolso-convite-a-fisica": {
    id: "gps-geometria-tempo-e-relatividade-no-bolso-convite-a-fisica",
    titulo: "GPS: geometria, tempo e relatividade no bolso | Convite à Física",
    tipo: "convite-fisica",
    data: "02/09/2026",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Alberto Saa",
      afiliacao: "UNICAMP",
      titulacao: "Prof.",
    },
    resumo:
      "Como um celular consegue saber onde estamos, quase instantaneamente, usando sinais enviados por satélites a mais de 20 mil quilômetros de altitude? Nesta palestra, vamos apresentar o funcionamento do sistema GPS como uma saga científica que combina geometria, tecnologia espacial e física fundamental. Partiremos de uma ideia clássica: determinar uma posição a partir de distâncias a pontos conhecidos. Esse problema, que pode ser formulado em termos de esferas e remete aos antigos problemas de Apolônio, está no coração da localização por satélite. Veremos como o GPS transforma medidas de tempo em",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/gps-geometria-tempo-e-relatividade-no-bolso-convite-%C3%A0-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Relatividade", "Física", "Convite Fisica"],
  },
  "the-standard-model-gauge-group-and-the-exceptional-jordan-al": {
    id: "the-standard-model-gauge-group-and-the-exceptional-jordan-al",
    titulo: "The Standard Model gauge group and the exceptional Jordan algebra",
    tipo: "coloquio",
    data: "01/09/2026",
    horario: "16:00",
    local: {
      nome: "Sala Jayme",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Dr. Paul Schwahn",
      afiliacao: "Unicamp",
      titulacao: "Dr.",
    },
    resumo:
      'Abstract: Recently, Todorov and Dubois-Violette have realized the gauge group of the Standard Model of particle physics as the intersection of two maximal connected subgroups in the exceptional Lie group F_4, which is the automorphism group of the exceptional Jordan algebra of octonionic Hermitian 3x3-matrices. We show how two understand this inclusion of groups in terms of substructures on the Jordan algebra: in fancy language, the gauge group is the group of symmetries of an "octonionic qutrit" that restrict to act as unitary operators on a complex qutrit and, within that, a qubit. This resu',
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/standard-model-gauge-group-and-exceptional-jordan-algebra",
      transmissao: "https://www.youtube.com/@dfmaifusp/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "mecanica-quantica-macroscopica-coloquio-ifusp": {
    id: "mecanica-quantica-macroscopica-coloquio-ifusp",
    titulo: "Mecânica Quântica Macroscópica | Colóquio IFUSP",
    tipo: "coloquio",
    data: "27/08/2026",
    horario: "16:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "Prof. Thiago Guerreiro",
      afiliacao: "",
      titulacao: "Prof.",
    },
    resumo:
      "Palestra e apresentação científica oficial do Instituto de Física da USP: Mecânica Quântica Macroscópica | Colóquio IFUSP.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento-agregado/mec%C3%A2nica-qu%C3%A2ntica-macrosc%C3%B3pica-col%C3%B3quio-ifusp",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: true,
    tags: ["Física", "Coloquio"],
  },
  "60-anos-da-sociedade-brasileira-de-fisica": {
    id: "60-anos-da-sociedade-brasileira-de-fisica",
    titulo: "60 anos da Sociedade Brasileira de Física",
    tipo: "institucional",
    data: "quinta-feira, 20 Agosto, 2026 - 08:30",
    horario: "18:00",
    local: {
      nome: "Auditório Abrahão de Moraes",
      formato: "hibrido",
    },
    palestrante: {
      nome: "sua presença nesta celebração",
      afiliacao: "",
      titulacao: "",
    },
    resumo:
      "Em nome da Sociedade Brasileira de Física (SBF), tenho o prazer de convidá-lo(a)s para participar da comemoração dos 60 anos da Sociedade Brasileira de Física.",
    links: {
      oficial:
        "https://portal.if.usp.br/ifusp/pt-br/evento/60-anos-da-sociedade-brasileira-de-f%C3%ADsica",
      transmissao: "https://www.youtube.com/@ifusp_oficial/streams",
      anexoPdf: "",
    },
    destaque: false,
    tags: ["Física", "Institucional"],
  },
};
