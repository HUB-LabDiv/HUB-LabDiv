/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

export const apresentacaoData = {
  title: "Apresentação do HUB LabDiv",
  subtitle: "O projeto em poucas palavras",
  intro: "O HUB é uma plataforma digital, um aplicativo que roda direto no navegador, construído por um aluno do IFUSP sob a orientação do Prof. Caetano Miranda para melhorar a comunicação do instituto. O projeto segue a filosofia de software livre (open source) e foi projetado para ser replicado facilmente em outras instituições, com todo o código-fonte disponível no repositório do GitHub (JoaoStangorlini/HUB-LabDiv).",
  sections: [
    {
      id: "guia-leitura",
      title: "Guia de leitura",
      content: [
        { subtitle: "Para usuários (alunos, pesquisadores e curiosos):", text: "Recomendamos a leitura dos capítulos 2, 6, 8 e 10." },
        { subtitle: "Para membros do LabDiv:", text: "Recomendamos a leitura dos capítulos 4, 8 (especialmente as seções 8.6 e 8.7) e 9." },
        { subtitle: "Para candidatos ao LabDiv:", text: "Recomendamos a leitura dos capítulos 4, 5, 6 e 8." },
        { subtitle: "Para programadores, desenvolvedores e entusiastas de tecnologia:", text: "Recomendamos a leitura dos capítulos 3, 7, 12 e 14." },
        { subtitle: "Para artistas e criativos:", text: "Recomendamos a leitura dos capítulos 6 (especialmente a seção 6.7 sobre expressão individual), 7 e 8." },
        { subtitle: "Para interessados em divulgação científica:", text: "Recomendamos a leitura dos capítulos 6, 9 e 11." },
        { subtitle: "Para interessados no aspecto jurídico da plataforma:", text: "Recomendamos a leitura dos capítulos 6 (especialmente a seção 6.13) e 15." },
        { subtitle: "Para interessados no aspecto de pesquisa acadêmica:", text: "Recomendamos a leitura dos capítulos 6, 9 e 13." },
        { subtitle: "Para interessados no aspecto educacional:", text: "Recomendamos a leitura dos capítulos 6, 8 e 9." }
      ]
    },
    {
      id: "sumario",
      title: "Sumário",
    },
    {
      id: "introducao",
      title: "1. Introdução",
      paragraphs: [
        "O HUB de comunicação científica LabDiv é uma das frentes do Laboratório de Divulgação do IFUSP. Seu objetivo é transformar a forma como a comunicação científica é realizada, tanto internamente (na relação aluno-professor/pesquisador) quanto na relação entre o instituto e a sociedade, buscando romper os muros acadêmicos da Universidade de São Paulo."
      ]
    },
    {
      id: "o-que-e",
      title: "2. O que é",
      paragraphs: [
        "O HUB LabDiv é uma plataforma digital do tipo WebApp (um site que funciona e se comporta como um aplicativo nativo). Essa arquitetura permite que o HUB concentre diversas funções. Ele não se limita a ser uma rede social guiada por métricas de vaidade (curtidas e visualizações) ou por dinâmicas de grupo...",
        "Trata-se de uma plataforma que não só estende o laboratório para o usuário, mas que haja uma comunicação entre quem divulga e quem consome a divulgação, sendo ambos incentivados pela plataforma a rever os seus conceitos sobre o objeto de divulgação, promovendo o entendimento do processo científico em si.",
        "A plataforma oferece ferramentas específicas para a comunidade acadêmica: acompanhamento de disciplinas, do andamento do curso, elaboração de cronogramas e facilitação de reuniões entre pesquisadores e alunos (através do 'Quero uma IC'). Em resumo, atua como um 'Super App'."
      ]
    },
    {
      id: "equipe",
      title: "3. Equipe",
      paragraphs: ["A governança da plataforma é conduzida pela equipe do LabDiv, estruturada nas seguintes frentes:"],
      content: [
        { subtitle: "Moderação e Curadoria:", text: "A equipe atua como moderadora do HUB, garantindo a qualidade e o rigor do conteúdo submetido." },
        { subtitle: "Orientação Acadêmica:", text: "Sob a coordenação do Professor Caetano Miranda, o laboratório define as diretrizes estratégicas para viabilizar e expandir o projeto." },
        { subtitle: "Produção de Conteúdo:", text: "A equipe também atua na linha de frente da comunicação científica, produzindo materiais multiformatos distribuídos através do HUB e de redes externas integradas (Instagram, YouTube, TikTok)." }
      ]
    },
    {
      id: "historia",
      title: "4. História",
      content: [
        { subtitle: "Evolução do Projeto:", text: "O projeto começou como uma iniciativa pessoal focada na produção fotográfica de material de divulgação. Evoluiu para a elaboração de um acervo digital para hospedar esse material e, posteriormente, passou a englobar produções já feitas por pesquisadores, e do próprio instituto. A expansão continuou com a aceitação de novos formatos e a abertura para contribuições de alunos." },
        { subtitle: "Super App:", text: "Com isso em mente evoluiu para uma espécie de rede social com foco em divulgação e por fim surgiu a concepção de um Super App: uma plataforma que reúne também uma Wiki, fornece ferramentas acadêmicas, mapas e um espaço seguro (logs)." }
      ]
    },
    {
      id: "abrangencia",
      title: "5. Abrangência",
      paragraphs: [
        "O HUB é uma iniciativa nativa do LabDiv. Embora o laboratório de divulgação possua vínculo com o Instituto de Física da USP (IFUSP), é fundamental destacar que a plataforma digital em si é independente e não possui vínculo institucional direto com a universidade.",
        "Essa arquitetura descentralizada é intencional. O objetivo é quebrar os muros da universidade e permitir que a plataforma seja escalada e adotada por outros institutos e universidades."
      ]
    },
    {
      id: "objetivos",
      title: "6. Objetivos e Como",
      content: [
        { subtitle: "6.1. Obras de Comunicação Científica:", text: "Através de formulários de envio estruturados e moderação da equipe do LabDiv, o material deixa de ser uma via de mão única." },
        { subtitle: "6.2. Educação continuada em divulgação científica:", text: "A plataforma disponibilizará conteúdos sobre como produzir divulgação em múltiplos formatos durante o processo de submissão." },
        { subtitle: "6.3. Wiki institucional centralizada:", text: "Na aba CGIF, o usuário acessa manuais, PPPs, editais, protocolos e informações de vivência de forma interativa." },
        { subtitle: "6.4. Mapa interativo do instituto:", text: "O mapa conectará o HUB ao espaço físico do IFUSP." },
        { subtitle: "6.5. Preservar a história do instituto:", text: "Em parceria com o acervo histórico, o HUB promoverá publicações focadas na trajetória do IFUSP." },
        { subtitle: "6.6. Ferramentas de apoio ao estudo e à pesquisa:", text: "O sistema permitirá a sincronização com o NUSP. O aluno poderá visualizar disciplinas cursadas, pendências e ferramentas como 'Match Acadêmico'." },
        { subtitle: "6.7. Permitir a expressão individual:", text: "O projeto utiliza 'constelações de mundos' para catalogar analogias e jargões. Isso permite que a comunicação científica seja adaptada à bagagem cultural do usuário." },
        { subtitle: "6.8. Humanizar a figura do cientista:", text: "A seção de logs visa capturar e reunir reflexões diárias, demonstrando que o ambiente acadêmico é composto por pessoas reais." },
        { subtitle: "6.9. Inclusão de pessoas neuro divergentes:", text: "O HUB trabalhará em contato com as CIPs para centralizar materiais de apoio e mapear queixas." },
        { subtitle: "6.10. Compreensão sistêmica do fazer científico:", text: "Educar o usuário sobre o que é a ciência e seu método." },
        { subtitle: "6.11. Diminuir a distância Pesquisador-Aluno:", text: "Através do Match Acadêmico, a plataforma mitiga o problema crônico de comunicação no IFUSP." },
        { subtitle: "6.12. Introduzir as frentes de pesquisa:", text: "Fornecer o básico de cada linha de pesquisa e a possibilidade de avanço nelas." },
        { subtitle: "6.13. Boas práticas no ambiente digital:", text: "O HUB possui termos de uso e políticas de cookies em linguagem clara e acessível." },
        { subtitle: "6.14. Base teórica sólida:", text: "O desenvolvimento contínuo de novas funcionalidades será fundamentada em teorias em divulgação científica." },
        { subtitle: "6.15. Moderação rigorosa:", text: "Todos os envios passarão por moderação para garantir conformidade legal e ética." },
        { subtitle: "6.16. Centralizar oportunidades:", text: "Atualização constante de cards informativos sobre Iniciações Científicas, bolsas, estágios." },
        { subtitle: "6.17. Espaços e Vivência:", text: "Catalogação de todos os centros e espaços de vivência do IFUSP." },
        { subtitle: "6.18. Influenciadores Científicos:", text: "Divulgação de criadores de conteúdo vinculados ao IFUSP." },
        { subtitle: "6.19. Página Oficial do LabDiv:", text: "Área dedicada à marcação de uso do espaço do DigitalLab, instruções do KitDiv e agendamento de mentorias." }
      ]
    },
    {
      id: "estrutura",
      title: "7. Estrutura de Abas",
      content: [
        { subtitle: "7.1. Comunidade:", text: "Reúne as funções de rede social do webapp (Fluxo e Logs)." },
        { subtitle: "7.2. CGIF:", text: "Reúne todas as funções de acesso a informação do webapp (Oportunidades, Iniciativas, Espaços, Wiki)." },
        { subtitle: "7.3. Formulário de envio:", text: "Dividido em 5 seções onde o usuário escolhe a categoria, formato, cria tags e quizzes." },
        { subtitle: "7.4. Ferramentas:", text: "Uma aba utilitária que contém ferramentas úteis (Grade Horária, Trilhas, Match Acadêmico)." },
        { subtitle: "7.5. Central de Interação:", text: "Emaranhamento, Laboratório pessoal, Configurações e Pergunte a um cientista." },
        { subtitle: "7.6. LabDiv:", text: "Página oficial do LabDiv onde o usuário pode ver as atividades e projetos." },
        { subtitle: "7.7. Admin:", text: "Painel de gestão para Moderadores e Administradores." }
      ]
    },
    {
      id: "organizacao",
      title: "8. Organização e Layout",
      paragraphs: [
        "A interface segue a Identidade Visual (IDV) do LabDiv. Em telas grandes (monitores/tablets), opera em um grid de 3 colunas e 3 linhas: Centro (Conteúdo), Topo (Nav), Rodapé (Footer), Esquerda (Menu) e Direita (Cards).",
        "Em dispositivos móveis (smartphones), o layout é responsivo (coluna única), e a navegação principal é realocada para uma barra inferior ergonômica (bottom navigation bar)."
      ]
    },
    {
      id: "base-teorica",
      title: "9. Base Teórica e Estudos de Caso",
      paragraphs: [
        "O desenvolvimento de features é fundamentado em bases teóricas da divulgação científica. Exemplo: 'Balões de reflexão' fundamentados em Paulo Freire (Extensão ou comunicação) para estimular a reflexão crítica.",
        "'Constelações de mundos' para adaptar a linguagem ao público, e apresentação de 'Contextos do conteúdo' baseados em Setlik (Circulação de conhecimentos)."
      ]
    },
    {
      id: "visao-perfis",
      title: "10. Visão do HUB por Perfil",
      content: [
        { subtitle: "Para o Pesquisador:", text: "O HUB atua como uma vitrine para suas linhas de pesquisa e uma ferramenta de captação de talentos (via Match Acadêmico)." },
        { subtitle: "Para o Aluno:", text: "Centraliza a burocracia e o planejamento da vida acadêmica. Oferece sincronização de grade horária, grupos de estudo e ambiente seguro (Logs)." },
        { subtitle: "Para o Curioso/Sociedade:", text: "Funciona como uma porta de entrada desmistificada para a universidade. Adapta a linguagem acadêmica através das 'Constelações de Mundos'." }
      ]
    },
    {
      id: "necessidade",
      title: "11. Por que o HUB é necessário?",
      content: [
        { subtitle: "Mitigação do Afastamento Geracional:", text: "As crescentes diferenças geracionais estão tornando a comunicação entre alunos e professores desafiadora. O HUB atua como ponte." },
        { subtitle: "Produtividade Acadêmica:", text: "A formação de novos pesquisadores depende de os alunos conseguirem Iniciações Científicas (ICs)." },
        { subtitle: "Combate ao Discurso Anticiência:", text: "Estabelecer uma plataforma robusta, acessível e engajadora para reconectar a população à ciência." }
      ]
    },
    {
      id: "replicabilidade",
      title: "12. Replicabilidade",
      paragraphs: [
        "A arquitetura de software e a estrutura conceitual do projeto foram desenvolvidas visando a fácil replicação por outros institutos e universidades. Baseado em: Código Aberto (Open Source), Licenciamento AGPL, e Arquitetura Descentralizada."
      ]
    },
    {
      id: "resultados",
      title: "13. Resultados e Impactos Esperados",
      content: [
        { subtitle: "Impactos Acadêmicos:", text: "Redução da evasão acadêmica, aumento nas Iniciações Científicas, melhor compreensão da burocracia e preservação do patrimônio histórico do IFUSP." },
        { subtitle: "Impactos Sociais:", text: "Aumento da socialização interdepartamental, inclusão da comunidade neurodivergente, humanização da ciência e combate à desinformação." }
      ]
    },
    {
      id: "tecnica",
      title: "14. Parte Técnica",
      content: [
        { subtitle: "Stack Tecnológico:", text: "A arquitetura do HUB foi projetada com rigor técnico, utilizando TypeScript estrito, Next.js (Frontend), Supabase (Backend/Auth), Cloudinary (Processamento Visual) e Vercel (CI/CD Edge Network)." }
      ]
    },
    {
      id: "juridico",
      title: "15. Jurídico",
      content: [
        { subtitle: "Conformidade e Filosofia Aberta:", text: "Adequação integral com a LGPD e Marco Civil da Internet. O acervo público usa licença Creative Commons (CC BY 4.0), e o software usa GNU AGPLv3." }
      ]
    },
    {
      id: "conclusao",
      title: "16. Conclusão",
      paragraphs: [
        "O HUB LabDiv representa um marco transformador na percepção pública da ciência e na relação estabelecida entre o IFUSP, sua comunidade acadêmica e a sociedade. Ao transcender a função de mero acervo para atuar como uma plataforma interativa (PWA), o projeto consolida a infraestrutura digital necessária para uma divulgação científica verdadeiramente acessível, inclusiva, tecnicamente robusta e replicável."
      ]
    }
  ]
};
