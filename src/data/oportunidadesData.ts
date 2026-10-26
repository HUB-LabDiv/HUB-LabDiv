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

export interface OportunidadeCurada {
    id: string;
    titulo: string;
    descricao: string;
    tipo: 'bolsa' | 'vaga' | 'evento' | 'palestra';
    categoria: 'Bolsas & Auxílios' | 'Pesquisa & IC' | 'Eventos & Palestras' | 'Extensão & Cursos';
    data?: string;
    local?: string;
    link?: string;
    target_persona: 'geral' | 'aluno' | 'professor' | 'curioso';
    orgao_responsavel?: string;
    prazo?: string;
    remuneracao?: string;
}

export const oportunidadesCuradas: OportunidadeCurada[] = [
    {
        id: 'pub-edital-unificado',
        titulo: 'Programa Unificado de Bolsas (PUB USP)',
        descricao: 'Bolsas de fomento nas vertentes de Ensino de Graduação, Pesquisa e Extensão Universitária, com dedicação semanal de 10 horas e bolsa mensal paga pela Reitoria da USP.',
        tipo: 'bolsa',
        categoria: 'Bolsas & Auxílios',
        remuneracao: 'R$ 800/mês',
        prazo: 'Inscrições no início do semestre letivo',
        local: 'IFUSP / Toda a USP',
        orgao_responsavel: 'Pró-Reitorias de Graduação, Pesquisa e Cultura/Extensão',
        link: 'https://uspdigital.usp.br/apolo/',
        target_persona: 'geral'
    },
    {
        id: 'pibic-pibiti-cnpq',
        titulo: 'Iniciação Científica e Tecnológica (PIBIC / PIBITI - CNPq / USP)',
        descricao: 'Oportunidades de pesquisa científica de ponta em laboratórios de física teórica e aplicada, com bolsa financiada pelo CNPq sob orientação de docentes do IFUSP.',
        tipo: 'bolsa',
        categoria: 'Pesquisa & IC',
        remuneracao: 'R$ 700/mês',
        prazo: 'Edital anual via Comissão de Pesquisa (CPq-IFUSP)',
        local: 'Laboratórios do IFUSP (Pelletron, LSF, LAMFI, etc.)',
        orgao_responsavel: 'Comissão de Pesquisa (CPq-IFUSP)',
        link: 'https://portal.if.usp.br/pesquisa/',
        target_persona: 'geral'
    },
    {
        id: 'papfe-prip-permanencia',
        titulo: 'Programa de Apoio à Permanência e Formação Estudantil (PAPFE / PRIP)',
        descricao: 'Auxílios de moradia, transporte e alimentação direcionados a estudantes em situação de vulnerabilidade socioeconômica matriculados na graduação e pós-graduação.',
        tipo: 'bolsa',
        categoria: 'Bolsas & Auxílios',
        remuneracao: 'Até R$ 1.050/mês ou Moradia CRUSP',
        prazo: 'Inscrições abertas semestralmente',
        local: 'Campus Butantã / CRUSP',
        orgao_responsavel: 'Pró-Reitoria de Inclusão e Pertencimento (PRIP USP)',
        link: 'https://prip.usp.br/papfe/',
        target_persona: 'geral'
    },
    {
        id: 'monitoria-fisica-geral',
        titulo: 'Monitoria Remunerada e Voluntária de Física I, II, III e IV',
        descricao: 'Vagas semestrais de monitoria didática para atuação em salas de dúvidas, suporte em plantões e apoio aos laboratórios didáticos da Ala Central.',
        tipo: 'vaga',
        categoria: 'Pesquisa & IC',
        remuneracao: 'Bolsa de Apoio Pedagógico ou Créditos de Trabalho',
        prazo: 'Inscrições no início de cada semestre',
        local: 'Ala Didática / Laboratórios do IFUSP',
        orgao_responsavel: 'Comissão de Graduação (CoG-IFUSP)',
        link: 'https://portal.if.usp.br/graduacao/',
        target_persona: 'geral'
    },
    {
        id: 'coloquios-wataghin',
        titulo: 'Colóquios Gleb Wataghin de Física Contemporânea',
        descricao: 'Ciclo semanal de palestras magnas abertas a toda a comunidade científica, trazendo cientistas renomados do Brasil e do exterior para debater fronteiras da física moderna.',
        tipo: 'palestra',
        categoria: 'Eventos & Palestras',
        prazo: 'Toda quinta-feira às 16h',
        local: 'Auditório Abrahão de Moraes / Transmissão IPTV',
        orgao_responsavel: 'Comissão de Pós-Graduação (CPG-IFUSP)',
        link: 'https://portal.if.usp.br/ifusp/pt-br/eventos',
        target_persona: 'geral'
    },
    {
        id: 'efc-escola-contemporanea',
        titulo: 'Escola de Física Contemporânea (EFC) - Edição de Férias',
        descricao: 'Imersão científica de alto nível para estudantes do ensino médio de todo o Brasil, com visitas a aceleradores de partículas e palestras com pesquisadores do IFUSP.',
        tipo: 'evento',
        categoria: 'Extensão & Cursos',
        prazo: 'Edital aberto para seleção nacional',
        local: 'Instituto de Física da USP',
        orgao_responsavel: 'Comissão de Cultura e Extensão Universitária (CCEx)',
        link: 'https://portal.if.usp.br/ccex/',
        target_persona: 'geral'
    },
    {
        id: 'show-da-fisica-monitores',
        titulo: 'Show da Física: Seleção de Novos Monitores e Divulgadores',
        descricao: 'Processo seletivo contínuo para voluntários e bolsistas que queiram atuar diretamente em apresentações científicas interativas para escolas públicas e privadas.',
        tipo: 'vaga',
        categoria: 'Extensão & Cursos',
        prazo: 'Fluxo contínuo',
        local: 'Anfiteatro do Show da Física (IFUSP)',
        orgao_responsavel: 'Coordenação Show da Física / CCEx',
        link: '/iniciativas/show-da-fisica',
        target_persona: 'geral'
    },
    {
        id: 'fapesp-iniciacao-tematicos',
        titulo: 'Bolsas FAPESP vinculadas a Projetos Temáticos no IFUSP',
        descricao: 'Oportunidades de bolsas de Iniciação Científica (IC), Mestrado e Pós-Doutorado com cotas ativas em projetos temáticos FAPESP coordenados por docentes do instituto.',
        tipo: 'bolsa',
        categoria: 'Pesquisa & IC',
        remuneracao: 'Tabela FAPESP oficial (com Reserva Técnica)',
        prazo: 'Fluxo contínuo conforme vagas dos grupos',
        local: 'Departamentos do IFUSP (FMA, FEP, FNC, FGE, FMT, FAP)',
        orgao_responsavel: 'FAPESP / Grupos de Pesquisa IFUSP',
        link: 'https://fapesp.br/oportunidades/',
        target_persona: 'geral'
    }
];
