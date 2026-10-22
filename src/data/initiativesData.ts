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

import { Initiative } from "@/types/initiatives";

export const initiativesData: Record<string, Initiative> = {
  labdiv: {
    id: "labdiv",
    nome: "Laboratório de Comunicação e Divulgação Científica",
    sigla: "LabDiv",
    categoria: "divulgacao",
    resumo:
      "Comunicação científica inspirada no MIT. Tutoria entre pares, escrita, design e articulação comunitária.",
    descricao:
      "O LabDiv é um espaço de experimentação, formação e produção em divulgação científica do Instituto de Física da USP. Inspirado no modelo de Communication Labs do MIT, oferece oficinas, tutoria entre pares, suporte para criação de materiais acadêmicos e desenvolvimento do HUB LabDiv.",
    publicoAlvo: "Comunidade discente, pesquisadores e público em geral",
    coordenacao: "Prof. Caetano Rodrigues Miranda & Equipe LabDiv",
    comoParticipar:
      "Participação voluntária, bolsas PUB de extensão e tutoria entre pares aberta a graduandos do IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "labdiv",
    contatos: {
      email: "labdiv@usp.br",
      instagram: "https://www.instagram.com/labdiv.ifusp/",
      localizacao: "Ed. Novo Milênio, Instituto de Física, USP",
    },
    links: {
      interno: "/iniciativas/labdiv",
      oficial: "https://portal.if.usp.br",
    },
    destaque: true,
    tags: ["divulgação científica", "comunicação", "design", "tutoria", "mit"],
  },
  "show-da-fisica": {
    id: "show-da-fisica",
    nome: "Show da Física",
    sigla: "SDF",
    categoria: "divulgacao",
    resumo:
      "Demonstrações teatrais e lúdicas de fenômenos físicos para escolas e público geral.",
    descricao:
      "O Show da Física é uma das mais tradicionais iniciativas de extensão universitária do Brasil. Por meio de apresentações interativas com experimentos de mecânica, termodinâmica, eletromagnetismo e óptica, aproxima conceitos complexos de física de estudantes do ensino fundamental e médio.",
    publicoAlvo:
      "Estudantes dos Ensinos Fundamental e Médio, professores e famílias",
    coordenacao: "Gelson & Equipe de Monitores do Show da Física",
    comoParticipar:
      "Seleção semestral de monitores bolsistas e voluntários entre graduandos do IFUSP.",
    modalidadeBolsa: ["PUB", "AEx", "Voluntariado"],
    temaVisual: "show-da-fisica",
    contatos: {
      email: "showdefisica@if.usp.br",
      website: "https://portal.if.usp.br/extensao/pt-br/node/607",
      localizacao:
        "Auditório Adma Jafet / Sala de Experimentos do Show da Física",
    },
    links: {
      oficial: "http://portal.if.usp.br/showdefisica/",
      formulario: "/iniciativas/show-da-fisica/monte-seu-show",
      interno: "/iniciativas/show-da-fisica",
    },
    destaque: true,
    tags: [
      "experimentos",
      "demonstrações",
      "escolas",
      "teatro científico",
      "lúdico",
      "show de física",
      "divulgacao",
      "extensão",
      "ifusp",
    ],
  },
  hackerspace: {
    id: "hackerspace",
    nome: "Hackerspace IFUSP",
    sigla: "HACK",
    categoria: "maker",
    resumo:
      "Espaço comunitário de fabricação digital, eletrônica aberta, impressão 3D e computação física.",
    descricao:
      "O Hackerspace do IFUSP é um laboratório mantido pela comunidade para promover o aprendizado prático e colaborativo. Dispõe de bancadas de eletrônica, impressoras 3D, ferramentas de prototipagem e computação para projetos autônomos e experimentais.",
    publicoAlvo:
      "Estudantes de graduação, pós-graduação e entusiastas da cultura maker",
    coordenacao: "Comunidade Hacker IFUSP & Docentes Colaboradores",
    comoParticipar:
      "Acesso livre para alunos do instituto, oficinas regulares e projetos de colaboração aberta.",
    modalidadeBolsa: ["Voluntariado"],
    temaVisual: "hackerspace",
    contatos: {
      localizacao: "Edifício Principal, Subsolo / Ala dos Estudantes",
    },
    links: {
      interno: "/espacos/hackerspace",
    },
    destaque: true,
    tags: ["maker", "impressão 3d", "arduino", "eletrônica", "hardware livre"],
  },
  "grupo-noether": {
    id: "grupo-noether",
    nome: "Grupo Emmy Noether",
    sigla: "Noether",
    categoria: "inclusao",
    resumo:
      "Coletivo de mulheres na Física do IFUSP: acolhimento, debates e promoção da equidade de gênero.",
    descricao:
      "Inspirado na célebre matemática e física teórica Emmy Noether, o grupo atua na promoção de acolhimento, visibilidade e debates para alunas e pesquisadoras do IFUSP, organizando rodas de conversa, seminários temáticos e ações pela permanência feminina nas ciências exatas.",
    publicoAlvo: "Mulheres estudantes, pesquisadoras e comunidade do IFUSP",
    coordenacao: "Comissão Discente de Mulheres do IFUSP",
    comoParticipar:
      "Reuniões abertas, rodas de acolhimento a calouras e participação nas redes do coletivo.",
    modalidadeBolsa: ["Voluntariado"],
    temaVisual: "default",
    contatos: {
      instagram: "https://www.instagram.com/gnoether_/",
    },
    links: {
      oficial: "https://www.instagram.com/gnoether_/",
    },
    destaque: true,
    tags: [
      "mulheres na física",
      "equidade",
      "diversidade",
      "acolhimento",
      "emmy noether",
    ],
  },
  supernova: {
    id: "supernova",
    nome: "Boletim Supernova",
    sigla: "Supernova",
    categoria: "divulgacao",
    resumo:
      "Boletim crítico, cultural e científico mantido pelo Centro de Estudos de Física (CEFISMA).",
    descricao:
      "O Supernova é a publicação impressa e digital histórica da comunidade discente do IFUSP. Reúne ensaios críticos sobre a universidade pública, divulgação de física moderna, resenhas literárias e arte visual produzida por estudantes.",
    publicoAlvo: "Corpo discente da USP e entusiastas da cultura universitária",
    coordenacao: "Gestão Ativa do CEFISMA",
    comoParticipar:
      "Envio aberto de textos, ilustrações, poemas e artigos de divulgação científica.",
    modalidadeBolsa: ["Voluntariado"],
    temaVisual: "default",
    contatos: {
      website: "https://cefisma.com.br",
      localizacao: "Centro Acadêmico CEFISMA - Edifício Principal",
    },
    links: {
      oficial: "https://cefisma.com.br",
    },
    destaque: true,
    tags: [
      "jornalismo discente",
      "cultura",
      "crítica",
      "cefisma",
      "literatura",
    ],
  },
  "cursinho-cuica": {
    id: "cursinho-cuica",
    nome: "Cursinho Popular Cuica",
    sigla: "Cuica",
    categoria: "escolar",
    resumo:
      "Cursinho pré-vestibular popular gratuito mantido por voluntários da USP para estudantes de baixa renda.",
    descricao:
      "O Cursinho Cuica é um projeto de extensão focado na democratização do acesso ao ensino superior. As aulas são ministradas por graduandos e pós-graduandos voluntários da USP, atendendo estudantes da rede pública de ensino de São Paulo.",
    publicoAlvo:
      "Estudantes e egressos do ensino público preparando-se para o vestibular",
    coordenacao: "Coordenação Pedagógica Voluntária Cuica",
    comoParticipar:
      "Processo seletivo semestral para professores e plantonistas voluntários entre os alunos da USP.",
    modalidadeBolsa: ["Voluntariado", "AEx"],
    temaVisual: "default",
    contatos: {
      website: "https://www.facebook.com/cursinhocuica/",
    },
    links: {
      oficial: "https://www.facebook.com/cursinhocuica/",
    },
    destaque: false,
    tags: [
      "educação popular",
      "cursinho",
      "vestibular",
      "inclusão social",
      "voluntariado",
    ],
  },
  "fisica-para-todos": {
    id: "fisica-para-todos",
    nome: "Física para Todos",
    categoria: "escolar",
    resumo:
      'Um dos mais tradicionais projetos de extensão do IFUSP, o "Física para Todos" é um ciclo de palestras voltado ao grande público de interessados em ciência. Os assuntos pretendem abranger e instigar desde estudantes do...',
    descricao:
      'Um dos mais tradicionais projetos de extensão do IFUSP, o "Física para Todos" é um ciclo de palestras voltado ao grande público de interessados em ciência. Os assuntos pretendem abranger e instigar desde estudantes do Ensino Médio, ou jovens graduandos, até o público geral, em diversas fases da vida, que acompanha e aprecia temas científicos.A cada ano, diferentes temas são tratados por alguns de nossos melhores professores e pesquisadores ou seus convidados. Os conteúdos abordam aspectos físicos de questões contemporâneas que dizem respeito à vida dos cidadãos e sua relação com o mundo natural. Desde suas origens, o IFUSP participa da produção e disseminação das ciências físicas. O Física para Todos é um dos braços desta atuação, e vem sendo realizado desde 2005, por meio da Comissão de C',
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Profa. Edilaine Hon",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram: "https://www.instagram.com/fisicausp/",
      youtube: "https://www.youtube.com/c/InstitutodeFísicaUSP",
      localizacao: "",
    },
    links: {
      oficial:
        "http://portal.if.usp.br/extensao/pt-br/fisica-para-todos-apresentacao",
      formulario:
        "http://portal.if.usp.br/extensao/pt-br/informa%C3%A7%C3%B5es-para-docentes-ifusp",
    },
    destaque: false,
    tags: ["física para todos", "escolar", "extensão", "ifusp"],
  },
  "feira-usp-e-as-profissoes": {
    id: "feira-usp-e-as-profissoes",
    nome: "Feira USP e as Profissões",
    categoria: "escolar",
    resumo:
      "DA Pró-Reitoria de Cultura e Extensão Universitária tem a alegria de convidá-lo(a) para a Feira USP e as Profissões, nos dias 1, 2 e 3 de outubro de 2024!!!!",
    descricao:
      "DA Pró-Reitoria de Cultura e Extensão Universitária tem a alegria de convidá-lo(a) para a Feira USP e as Profissões, nos dias 1, 2 e 3 de outubro de 2024!!!! Nossa Feira passou por uma transformação e agora é 100% online, mas continua a oferecer aos alunos do ensino médio um vasto conhecimento sobre nossos cursos, permanência estudantil e muito mais.E você também é parte essencial desse convite!Participe, compartilhe e interaja conosco através do site https://uspprofissoes.usp.br/. Seja um multiplicador deste evento encantador!Não esqueça de nos seguir nas redes sociais @culturanausp no Instagram e TikTok, ou inscreva-se em nosso canal no YouTube.Contamos com a sua participação e engajamento! Feira USP e as Profissões Links das palestras:Paulo Costa: 9h30 Bate Papo - Física Médica (IFUSP &",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram: "https://www.instagram.com/fisicausp/",
      youtube: "https://www.youtube.com/c/InstitutodeFísicaUSP",
      localizacao: "",
    },
    links: {
      oficial: "http://portal.if.usp.br/extensao/pt-br/node/598",
      formulario:
        "http://portal.if.usp.br/extensao/pt-br/informa%C3%A7%C3%B5es-para-docentes-ifusp",
    },
    destaque: false,
    tags: ["feira usp e as profissões", "escolar", "extensão", "ifusp"],
  },
  "acervo-historico": {
    id: "acervo-historico",
    nome: "Acervo Histórico",
    categoria: "divulgacao",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Acervo Histórico.",
    descricao:
      "Acervo Histórico é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      website: "http://www.fusp.org.br/",
      localizacao: "",
    },
    links: {
      oficial: "http://acervo.if.usp.br/",
      formulario:
        "http://acervo.if.usp.br/index.php/informationobject/browse?showAdvanced=1&topLod=0",
    },
    destaque: false,
    tags: ["acervo histórico", "divulgacao", "extensão", "ifusp"],
  },
  "drops-de-fisica": {
    id: "drops-de-fisica",
    nome: "Drops de Física",
    categoria: "divulgacao",
    resumo:
      "Os Drops de Física são os primeiros materiais resultantes do projeto 'Núcleo de Divulgação Científica do IFUSP'.A ideia dos drops é aproveitar os excelentes conteúdos promovidos em nossa programação de extensão - por ...",
    descricao:
      "Os Drops de Física são os primeiros materiais resultantes do projeto 'Núcleo de Divulgação Científica do IFUSP'.A ideia dos drops é aproveitar os excelentes conteúdos promovidos em nossa programação de extensão - por exemplo Física para Todos e Convite à Física - para a produção de pequenas e instigantes pílulas de conhecimento! Fique à vontade para compartilhar =) Este projeto é uma iniciativa do setor de Comunicação do Instituto, coordenado por Malu Tippi, e conta com o apoio de diversos docentes do IF, que oferecem palestras de divulgação e revisam os conteúdos finalizados. Por enquanto, os drops estão sendo elaborados em 3 formatos: vídeo, infográfico e thread para Twitter. Se você tem uma sugestão de tema para nós, escreva para comunica@if.usp.br. Aproveite e sigam-nos em nossos perfi",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Prof. Paulo Nussenzveig Arte",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "comunica@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram:
        "https://www.instagram.com/p/CZFkOuUFtUc/?utm_source=ig_web_copy_link",
      localizacao: "",
    },
    links: {
      oficial: "http://portal.if.usp.br/imprensa/pt-br/node/3334",
    },
    destaque: false,
    tags: ["drops de física", "divulgacao", "extensão", "ifusp"],
  },
  "visitas-monitoradas-ifusp": {
    id: "visitas-monitoradas-ifusp",
    nome: "Visitas Monitoradas - IFUSP",
    categoria: "escolar",
    resumo:
      'VEJA COMO CHEGAR AO IFUSP - https://portal.if.usp.br/extensao/pt-br/comochegaraoifusp Inscrições - encurtador.com.br/tOU25 Datas: 28 de julho 25 de agosto 29 de setembro Horário: das 13h às 17h"A Universidade e as Pro...',
    descricao:
      'VEJA COMO CHEGAR AO IFUSP - https://portal.if.usp.br/extensao/pt-br/comochegaraoifusp Inscrições - encurtador.com.br/tOU25 Datas: 28 de julho 25 de agosto 29 de setembro Horário: das 13h às 17h"A Universidade e as Profissões", programa criado pela Pró-Reitoria de Cultura e Extensão Universitária da USP, tem o objetivo de fornecer subsídios aos estudantes para que se orientem na importante tarefa de optar por uma profissão. O programa compreende um calendário de visitas de estudantes do Ensino Médio à USP e também a realização de Feiras de Profissões organizadas anualmente, no campus da capital e também nos do interior. O IFUSP recebe estudantes do ensino médio e demais interessados em saber detalhes sobre a profissão de Físico. VEJA COMO CHEGAR AO IFUSP - https://portal.if.usp.br/e',
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "pelo programa no IFUSP",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram: "https://www.instagram.com/fisicausp/",
      youtube: "https://www.youtube.com/c/InstitutodeFísicaUSP",
      localizacao: "auditório Abrahão de Moraes foram abertas às 8h30",
    },
    links: {
      oficial:
        "http://portal.if.usp.br/extensao/pt-br/usp-e-profissoes-visitas-monitoradas-no-ifusp",
      formulario:
        "http://portal.if.usp.br/extensao/pt-br/informa%C3%A7%C3%B5es-para-docentes-ifusp",
    },
    destaque: false,
    tags: ["visitas monitoradas - ifusp", "escolar", "extensão", "ifusp"],
  },
  "memorias-ifusp": {
    id: "memorias-ifusp",
    nome: "Memórias IFUSP",
    categoria: "academica",
    resumo:
      "Bem-vindo(a) ao projeto de Memórias do instituto de Física da Universidade de São Paulo. Este projeto tem como objetivo registrar para a posteridade a trajetória dos professores do instituto, contando a sua história a...",
    descricao:
      'Bem-vindo(a) ao projeto de Memórias do instituto de Física da Universidade de São Paulo. Este projeto tem como objetivo registrar para a posteridade a trajetória dos professores do instituto, contando a sua história acadêmica e profissional através de textos, fotos, entrevistas, vídeos e publicações direcionadas para o público geral. A ideia surgiu do curso "Tópicos Atuais em Física", ministrado pelo Prof. Alexandre Suaide em 2018, onde descobrimos as diferentes áreas de atuação de um físico através de palestras e apresentações dos seus projetos e resultados. Tínhamos uma ideia muito superficial das áreas de pesquisa disponíveis pois o contato com os professores era apenas com relação ao conteúdo dos cursos teóricos ou experimentais ministrados, não suas áreas de pesquisa em si. Disso mont',
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Prof. Alexandre Suaide em",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "lincon.ribeiro@usp.br",
      website: "http://correio.if.usp.br/",
      youtube:
        "https://www.youtube.com/playlist?list=PLxl8LfQGUUl9fGy_oaRFTgyzfZqDDqa1u",
      localizacao: "",
    },
    links: {
      oficial: "https://portal.if.usp.br/memoria/",
    },
    destaque: false,
    tags: ["memórias ifusp", "academica", "extensão", "ifusp"],
  },
  "lab-de-demonstracoes-ernst-w-hamburger": {
    id: "lab-de-demonstracoes-ernst-w-hamburger",
    nome: "Lab. de Demonstrações Ernst W. Hamburger",
    categoria: "divulgacao",
    resumo:
      "O Laboratório de Demonstrações é um espaço que oferece um grande acervo de equipamentos e experimentos de demonstrações que podem ser utilizados em sala de aula. A busca no acervo pode ser feita por temas ou pelas dis...",
    descricao:
      "O Laboratório de Demonstrações é um espaço que oferece um grande acervo de equipamentos e experimentos de demonstrações que podem ser utilizados em sala de aula. A busca no acervo pode ser feita por temas ou pelas disciplinas básicas dos cursos do IF. Também recebemos visitantes que queiram conhecer o espaço, mediante agendamento. Além do material existente, o Laboratório possui uma pequena oficina e experiência no desenvolvimento de experimentos de baixo custo. O Laboratório de Demonstrações é um espaço que oferece um grande acervo de equipamentos e experimentos de demonstrações que podem ser utilizados em sala de aula. A busca no acervo pode ser feita por temas ou pelas disciplinas básicas dos cursos do IF. Também recebemos visitantes que queiram conhecer o espaço, mediante agendamento.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      website: "http://labdemo.if.usp.br/",
      localizacao: "ala de aula",
    },
    links: {
      oficial: "http://labdemo.if.usp.br/",
    },
    destaque: false,
    tags: [
      "lab. de demonstrações ernst w. hamburger",
      "divulgacao",
      "extensão",
      "ifusp",
    ],
  },
  "physics-masterclasses": {
    id: "physics-masterclasses",
    nome: "Physics Masterclasses",
    categoria: "academica",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Physics Masterclasses.",
    descricao:
      "Physics Masterclasses é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      localizacao: "",
    },
    links: {
      oficial: "http://hepic.if.usp.br/?q=pt-br/projeto/masterclasses",
    },
    destaque: false,
    tags: ["physics masterclasses", "academica", "extensão", "ifusp"],
  },
  "laboratorio-virtual-de-mecanica": {
    id: "laboratorio-virtual-de-mecanica",
    nome: "Laboratório Virtual de Mecânica",
    categoria: "maker",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Laboratório Virtual de Mecânica.",
    descricao:
      "Laboratório Virtual de Mecânica é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      localizacao: "",
    },
    links: {
      oficial: "http://www.fep.if.usp.br/~fisfoto/",
    },
    destaque: false,
    tags: ["laboratório virtual de mecânica", "maker", "extensão", "ifusp"],
  },
  "arte-e-ciencia": {
    id: "arte-e-ciencia",
    nome: "Arte e Ciência",
    categoria: "academica",
    resumo:
      "Boas vindas Praça do Relógio – USP Butantã Ensinar não é transferir conhecimento, mas criar as possibilidades para sua própria produçãoPaulo Freire Projeto de Extensão do Instituto de Física da Universidade de São Pau...",
    descricao:
      "Boas vindas Praça do Relógio – USP Butantã Ensinar não é transferir conhecimento, mas criar as possibilidades para sua própria produçãoPaulo Freire Projeto de Extensão do Instituto de Física da Universidade de São Paulo (IFUSP) O Projeto AC teve como diretriz inicial atuar em espaços não formais, visando a melhoria da cultura científica da população em geral, mostrando o papel da ciência e tecnologia no mundo contemporâneo, além de demonstrar a pesquisa realizada na universidade. Dessa forma, a ação do projeto procura suprir lacunas da divulgação científica, que deveriam ser realizadas por museus e centros de Ciências oumesmo pela mídia. Ainda são poucos os cursos de nível superior, que se dedicam a comunicação daCiência e formação de mediadores, inclusive nos currículo",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "pela comunicação",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      website: "http://arteeciencia.if.usp.br/",
      instagram: "https://www.instagram.com/arteecienciausp/",
      youtube: "https://www.youtube.com/channel/UCEvgXBJ_m0oQvAzWQaMq9Yw",
      localizacao: "",
    },
    links: {
      oficial: "http://arteeciencia.if.usp.br/",
    },
    destaque: false,
    tags: ["arte e ciência", "academica", "extensão", "ifusp"],
  },
  "projeto-cri-tividade": {
    id: "projeto-cri-tividade",
    nome: "Projeto Cri@tividade",
    categoria: "divulgacao",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Projeto Cri@tividade.",
    descricao:
      "Projeto Cri@tividade é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      localizacao: "",
    },
    links: {
      oficial: "https://somifusp.wixsite.com/criatividade/",
    },
    destaque: false,
    tags: ["projeto cri@tividade", "divulgacao", "extensão", "ifusp"],
  },
  "encontro-usp-escola": {
    id: "encontro-usp-escola",
    nome: "Encontro USP-Escola",
    categoria: "escolar",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Encontro USP-Escola.",
    descricao:
      "Encontro USP-Escola é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram: "https://www.instagram.com/fisicausp/",
      youtube: "https://www.youtube.com/c/InstitutodeFísicaUSP",
      localizacao: "",
    },
    links: {
      oficial: "http://portal.if.usp.br/extensao/pt-br/encontro-usp-escola-0",
      formulario:
        "http://portal.if.usp.br/extensao/pt-br/informa%C3%A7%C3%B5es-para-docentes-ifusp",
    },
    destaque: false,
    tags: ["encontro usp-escola", "escolar", "extensão", "ifusp"],
  },
  "iv-escola-de-fisica-jayme-tiomno": {
    id: "iv-escola-de-fisica-jayme-tiomno",
    nome: "IV Escola de Física Jayme Tiomno",
    categoria: "escolar",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: IV Escola de Física Jayme Tiomno.",
    descricao:
      "IV Escola de Física Jayme Tiomno é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      instagram: "https://www.instagram.com/fisicausp/",
      youtube: "https://www.youtube.com/c/InstitutodeFísicaUSP",
      localizacao: "",
    },
    links: {
      oficial:
        "http://portal.if.usp.br/extensao/pt-br/evento/iv-escola-de-f%C3%ADsica-jayme-tiomno",
      formulario:
        "http://portal.if.usp.br/extensao/pt-br/informa%C3%A7%C3%B5es-para-docentes-ifusp",
    },
    destaque: false,
    tags: ["iv escola de física jayme tiomno", "escolar", "extensão", "ifusp"],
  },
  integrafisica: {
    id: "integrafisica",
    nome: "IntegraFísica",
    categoria: "escolar",
    resumo:
      "A escola Prof. Cyro de Barros Rezende, de Valinhos, participante do Programa de Ensino Integral do Estado de São Paulo, esteve no IFUSP esta semana para conhecer o Instituto e participar das atividades científicas e c...",
    descricao:
      "A escola Prof. Cyro de Barros Rezende, de Valinhos, participante do Programa de Ensino Integral do Estado de São Paulo, esteve no IFUSP esta semana para conhecer o Instituto e participar das atividades científicas e culturais oferecida pelo programa. A turma contou com 41 estudantes e 3 professores, incluindo uma intérprete de libras, em acompanhamento a um estudante com deficiência auditiva. A programação da visita incluiu: palestra de apresentação realizada pelo presidente da CCEx, Prof. Cristiano Olveira; visita com experimentação no Laboratório Demonstrações, organizada pelo físico Claudio Furukawa e bolsistas; e visita ao SAMPA com atividades do projeto de extensão MARIIAS, coordenado pelo Prof. Caetano Miranda. Mais do que aproveitar cada uma das atividades, os estudantes puderam viv",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Prof. Cyro de Barros Rezende",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      email: "ccex@if.usp.br",
      website: "http://correio.if.usp.br/",
      localizacao: "",
    },
    links: {
      oficial: "http://portal.if.usp.br/imprensa/pt-br/node/3633",
    },
    destaque: false,
    tags: ["integrafísica", "escolar", "extensão", "ifusp"],
  },
  "programa-usp-60": {
    id: "programa-usp-60",
    nome: "Programa USP 60+",
    categoria: "inclusao",
    resumo:
      "Iniciativa de extensão e difusão científica vinculada à CCEx-IFUSP: Programa USP 60+.",
    descricao:
      "Programa USP 60+ é uma iniciativa de cultura e extensão universitária do Instituto de Física da USP voltada à interação com a sociedade.",
    publicoAlvo: "Comunidade externa, escolas e universitários",
    coordenacao: "Comissão de Cultura e Extensão (CCEx-IFUSP)",
    comoParticipar:
      "Acesso aberto ou participação via projetos de extensão cadastrados na CCEx-IFUSP.",
    modalidadeBolsa: ["PUB", "Voluntariado"],
    temaVisual: "default",
    contatos: {
      website: "https://prceu.usp.br/usp60/pb/",
      instagram: "https://www.instagram.com/usp60mais/",
      youtube: "https://www.youtube.com/c/ProReitoriadeCulturaeExtensaodaUSP",
      localizacao: "",
    },
    links: {
      oficial: "https://prceu.usp.br/usp60/",
    },
    destaque: false,
    tags: ["programa usp 60+", "inclusao", "extensão", "ifusp"],
  },
};
