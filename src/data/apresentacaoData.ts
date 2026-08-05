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
  intro: "O HUB é uma plataforma digital, um aplicativo que roda direto no navegador, construído por João Stangorlini (aluno do IFUSP) sob a orientação do Prof. Caetano Miranda para melhorar a comunicação do instituto. O projeto segue a filosofia de software livre (open source) e foi projetado para ser replicado facilmente em outras instituições, com todo o código-fonte disponível no repositório do GitHub (JoaoStangorlini/HUB-LabDiv).",
  sections: [
    {
      id: "guia-leitura",
      title: "Guia de leitura",
      content: [
        { subtitle: "Para usuários (alunos, pesquisadores e curiosos):", text: "Recomendamos a leitura dos capítulos 2, 6, 7 e 10." },
        { subtitle: "Para membros do LabDiv:", text: "Recomendamos a leitura dos capítulos 4, 7 (especialmente as seções 7.6 e 7.7) e 9." },
        { subtitle: "Para candidatos ao LabDiv:", text: "Recomendamos a leitura dos capítulos 4, 5, 6 e 7." },
        { subtitle: "Para programadores, desenvolvedores e entusiastas de tecnologia:", text: "Recomendamos a leitura dos capítulos 3, 7, 12 e 14." },
        { subtitle: "Para artistas e criativos:", text: "Recomendamos a leitura dos capítulos 6 (especialmente a seção 6.7 sobre expressão individual) e 7." },
        { subtitle: "Para interessados em divulgação científica:", text: "Recomendamos a leitura dos capítulos 6, 9 e 11." },
        { subtitle: "Para interessados no aspecto jurídico da plataforma:", text: "Recomendamos a leitura dos capítulos 6 (especialmente a seção 6.13) e 15." },
        { subtitle: "Para interessados no aspecto de pesquisa acadêmica:", text: "Recomendamos a leitura dos capítulos 6, 9 e 13." },
        { subtitle: "Para interessados no aspecto educacional:", text: "Recomendamos a leitura dos capítulos 6, 7 e 9." }
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
        "O HUB LabDiv é uma plataforma digital do tipo WebApp (um site que funciona e se comporta como um aplicativo nativo). Essa arquitetura permite que o HUB concentre diversas funções. Ele não se limita a ser uma rede social guiada por métricas de vaidade (curtidas e visualizações) ou por dinâmicas de grupo... Trata-se de uma plataforma que não só estenda o laboratório para o usuário, mas que haja uma comunicação entre quem divulga e quem consome a divulgação sendo ambos incentivados pela plataforma a rever os seus conceitos sobre o objeto de divulgação, promovendo o entendimento do processo científico em si e promovendo um entendimento da ciência como um processo e não só do conteúdo do post em si.",
        "A plataforma oferece ferramentas específicas para a comunidade acadêmica: acompanhamento de disciplinas, do andamento do curso, elaboração de cronogramas e facilitação de reuniões entre pesquisadores e alunos (através do \\\"Quero uma IC\\\"). Além disso, reúne guias para calouros, manuais do curso e um mapa interativo. Em resumo, atua como um \\\"Super App\\\" (similar a WeChat, 99, Inter), centralizando múltiplas utilidades em um único link acessível via navegador, sem a necessidade de instalação, tornando a ciência mais acessível."
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
        { subtitle: "Início:", text: "O projeto começou como uma iniciativa pessoal focada na produção fotográfica de material de divulgação." },
        { subtitle: "Evolução:", text: "Evoluiu para a elaboração de um acervo digital para hospedar esse material e, posteriormente, passou a englobar produções já feitas por pesquisadores, e do próprio instituto. A expansão continuou com a aceitação de novos formatos (textos, objetos 3D, vídeos de realidade virtual) e a abertura para contribuições de alunos." },
        { subtitle: "Reflexão:", text: "A partir dessa evolução conceitual, iniciou-se uma reflexão sobre como transcender o modelo tradicional de divulgação onde a pessoa que a recebe não assume um papel ativo." },
        { subtitle: "Super App:", text: "Com isso em mente evoluiu para uma espécie de rede social com foco em divulgação e por fim surgiu a concepção de um Super App: uma plataforma que, além de rede social com obras de divulgação científicas, reúne também uma Wiki, fornece ferramentas acadêmicas, mapas e um espaço seguro (logs) para que os alunos possam conectar experiências, desabafar e trocar informações." }
      ]
    },
    {
      id: "abrangencia",
      title: "5. Abrangência",
      paragraphs: [
        "O HUB é uma iniciativa nativa do LabDiv. Embora o laboratório de divulgação possua vínculo com o Instituto de Física da USP (IFUSP), é fundamental destacar que a plataforma digital em si é independente e não possui vínculo institucional direto com a universidade. Essa arquitetura descentralizada é intencional. O objetivo é quebrar os muros da universidade e permitir que a plataforma seja escalada e adotada por outros institutos e universidades."
      ],
      content: [
        { subtitle: "Integração Colaborativa:", text: "Estudantes, desenvolvedores e pesquisadores de outras instituições podem entrar em contato e se integrar diretamente à equipe do LabDiv (seja de forma voluntária ou mediante editais de bolsas)." },
        { subtitle: "Replicação e Licenciamento Aberto:", text: "A base de código e a propriedade intelectual da plataforma operam sob uma licença aberta permissiva (com exigência de atribuição, modelo Open Source). Isso permite que qualquer pessoa ou instituição utilize, modifique e implemente sua própria instância do HUB livremente, sendo legalmente exigido apenas que os devidos créditos de autoria sejam dados ao criador original da arquitetura." }
      ]
    },
    {
      id: "objetivos",
      title: "6. Objetivos e Como",
      content: [
        { subtitle: "6.1. Criar um espaço digital para reunir obras de comunicação científica:", text: "Através de formulários de envio estruturados e moderação da equipe do LabDiv, o material deixa de ser uma via de mão única. O HUB traz ferramentas que incentivam tanto o criador quanto o espectador a refletirem sobre a ciência de forma crítica, considerando seu contexto histórico, cultural e social, indo além do simples domínio do conteúdo." },
        { subtitle: "6.2. Fornecer educação continuada em divulgação científica:", text: "A plataforma disponibilizará conteúdos sobre como produzir divulgação em múltiplos formatos durante o processo de submissão e também sobre quais são as bases teóricas na área para ele estruturar sua ideia com base nelas. O usuário receberá feedback qualitativo após a publicação, focado em como o material impactou a reflexão do público, ajudando-o a aprimorar suas habilidades de comunicação contextualizada." },
        { subtitle: "6.3. Prover uma Wiki institucional centralizada:", text: "Na aba CGIF, o usuário acessa manuais, Projetos Político-Pedagógicos (PPPs), editais, protocolos e informações de vivência de forma interativa. É possível navegar pela estrutura do instituto, explorando departamentos, pesquisadores e linhas de pesquisa, criando uma rede de conhecimento conectada e referenciável através dos posts." },
        { subtitle: "6.4. Elaborar um mapa interativo do instituto:", text: "O mapa conectará o HUB ao espaço físico do IFUSP. Ao escanear um QR code em um laboratório, o usuário é direcionado à página correspondente no HUB para obter mais informações, auxiliando também na localização espacial dentro do campus." },
        { subtitle: "6.5. Preservar a história do instituto:", text: "Em parceria com o acervo histórico, o HUB promoverá publicações focadas na trajetória do IFUSP, transformando o acervo de divulgação em um ambiente imersivo para o aprendizado do patrimônio histórico da instituição." },
        { subtitle: "6.6. Fornecer ferramentas de apoio ao estudo e à pesquisa:", text: "O sistema permitirá a sincronização com o Número USP (NUSP) e senha única. O aluno poderá visualizar disciplinas cursadas, pendências e pré-requisitos, gerando blocos de estudo automáticos (ex: 1h de aula = 1h de estudo). Inclui também a ferramenta \"Match Acadêmico\", conectando alunos para grupos de estudo e aproximando interessados em Iniciação Científica de pesquisadores." },
        { subtitle: "6.7. Permitir a expressão individual e a adaptação de signos linguísticos:", text: "O projeto utiliza \"constelações de mundos\" (Artes, Computação, Linguagem Acadêmica, Geek) para catalogar analogias e jargões. Isso permite que a comunicação científica seja adaptada à bagagem cultural do usuário, facilitando a compreensão. Além disso, o perfil do usuário (seu \"laboratório pessoal\") será altamente customizável com bio, currículo, hobbies, links, portfólio e qual constelação ele se identifica." },
        { subtitle: "6.8. Humanizar a figura do cientista:", text: "A seção de logs visa capturar e reunir reflexões diárias, desabafos e humor, demonstrando que o ambiente acadêmico é composto por pessoas reais com interesses cotidianos." },
        { subtitle: "6.9. Promover a inclusão de pessoas neuro divergentes:", text: "O HUB trabalhará em contato com as CIPs (Comissões de Inclusão e Pertencimento) e alunos neuroatípicos para centralizar materiais de apoio, políticas de inclusão e formas de acesso, além de mapear queixas não cobertas pelas estruturas de suporte atuais e fazer o possível para que esse público saiba de seus direitos e se sinta incluído no instituto." },
        { subtitle: "6.10. Fornecer uma compreensão sistêmica do fazer científico:", text: "O objetivo é educar o usuário sobre o que é a ciência e seu método, proporcionando uma formação científica real, visando o entendimento da ciência em seu contexto social, cultural, histórico da mesma e não apenas a transmissão passiva de curiosidades." },
        { subtitle: "6.11. Diminuir a distância Pesquisador-Aluno e Instituto-Sociedade:", text: "Através do \"Match Acadêmico\", a plataforma mitiga o problema crônico de comunicação no IFUSP, onde alunos pouco se comunicam entre si e se comunicam menos ainda com pesquisadores." },
        { subtitle: "6.12. Introduzir as frentes de pesquisa do instituto:", text: "Fornecer o básico de cada linha de pesquisa e a possibilidade de avanço nelas visando facilitar a escolha de caminhos acadêmicos, fornecendo clareza para alunos que buscam ICs, Mestrados ou Doutorados." },
        { subtitle: "6.13. Respeitar as boas práticas no ambiente digital:", text: "O HUB possui termos de uso e políticas de cookies em linguagem clara e acessível (sem jargões jurídicos complexos ou \"dark patterns\"). Garante a anonimização completa e criptografia de dados sensíveis." },
        { subtitle: "6.14. Estruturar o desenvolvimento com base teórica sólida:", text: "O desenvolvimento contínuo de novas funcionalidades (features) será fundamentada em teorias e com possibilidade de realização de estudos de caso através de pesquisas (qualitativas, quantitativas e aplicadas) em divulgação científica." },
        { subtitle: "6.15. Manter moderação rigorosa:", text: "Todos os envios passarão por moderação para garantir conformidade legal e ética. Contando também com um sistema global de denúncias (report) e derrubada automática, em casos de reports envolvendo crimes, para o improvável caso de algo acabar passando." },
        { subtitle: "6.16. Centralizar oportunidades, eventos, iniciativas e projetos de extensão:", text: "Atualização constante de cards informativos sobre iniciações científicas, PUB(s), estágios, simpósios, defesas, iniciativas, projetos de extensão, colóquios e etc com possibilidade de submissão comunitária. Facilitando o envolvimento da comunidade do instituto com os mesmos." },
        { subtitle: "6.17. Espaços e Vivência:", text: "Catalogação de todos os centros e espaços de vivência do IFUSP, assim como o seu funcionamento. Visando um aumento no uso dos espaços e o conhecimento deles por parte dos pesquisadores/alunos." },
        { subtitle: "6.18. Influenciadores Científicos:", text: "Divulgação de criadores de conteúdo (YouTube, Instagram, Blogs) vinculados ao IFUSP. Sejam ex alunos, alunos, sejam eles parte da equipe ou os influenciadores em si." },
        { subtitle: "6.19. Página Oficial do LabDiv:", text: "Área dedicada à marcação de uso do espaço do DigitalLab, instruções do KitDiv e agendamento de mentorias. Para além de ter as informações da iniciativa, os seus projetos e funcionamento." }
      ]
    },
    {
      id: "estrutura",
      title: "7. Estrutura de Abas",
      content: [
        { subtitle: "7.1. Comunidade:", text: "Reúne as funções de rede social do webapp. 7.1.1. Fluxo: Organiza os posts em um fluxo (similar ao Instagram) possibilitando uma interação maior ao abrir a página completa, tendo balões de reflexão, quizzes, seção de comentários, ver como apresentação de slides, modo foco, narração e muitas outras ferramentas que visam uma compreensão real não só do conteúdo mas de seu contexto. 7.1.2. Logs: Organiza aquelas interações/reflexões/informações que não são facilmente adequadas em um post completo reunindo elas em uma interface simples e amigável com um sistema de emendas nos fios que vão energizando a conversa e possibilitando interações entre a comunidade visando melhorar o convívio." },
        { subtitle: "7.2. CGIF:", text: "Reúne todas as funções de acesso a informação do webapp. 7.2.1. Oportunidades: Reúne as oportunidades do instituto. 7.2.2. Iniciativas: Reúne as iniciativas do instituto. 7.2.3. Espaços: Reúne os espaços do instituto. 7.2.4. Influenciadores: Reúne os influenciadores do instituto. 7.2.5. Wiki: Reúne as informações do instituto em uma Wiki, onde o usuário pode buscar por tudo, desde como os cursos funcionam, rotas de circulares, informações importantes para a matrícula… 7.2.6. Teste de radiação: Um quiz para testar os conhecimentos adquiridos na Wiki." },
        { subtitle: "7.3. Formulário de envio:", text: "Dividido em 5 seções onde o usuário escolhe a categoria, formato, cria tags e quizzes, elabora um título e uma descrição com suporte a LaTeX e markdown. É o local onde o usuário pode criar ou anexar o material de divulgação e ter formas de o transformar em uma comunicação." },
        { subtitle: "7.4. Ferramentas:", text: "Uma aba utilitária que contém ferramentas úteis para o usuário seja ele aluno/pesquisador/curioso. 7.4.1. Grade horária: Local para o aluno planejar o seu semestre, gerenciar limites de faltas e adequar o tempo de estudos (proporção 1h aula - 1h estudo), cadastrando Novos Eventos pontuais ou recorrentes por dia da semana (ex: Seg-Sex ou terças às 10h) com blocos gerados automaticamente. 7.4.2. Trilhas: Onde o aluno pode acompanhar o andamento do curso com sincronização com o júpiter. 7.4.3. Match acadêmico: Manifestar o interesse em uma IC com uma carta de interesse e o sistema de adoção onde um veterano pode adotar um calouro. 7.4.4. Como ingressar: Formas de ingresso do instituto e dicas para vestibulandos. 7.4.5. Observatório do pesquisador: Reúne a seção do match acadêmico e a arena dos pesquisadores." },
        { subtitle: "7.5. Central de Interação:", text: "Aqui é onde se reúne às funções que visam conectar a comunidade. 7.5.1. Emaranhamento: Mensagens privadas, criação de grupos. 7.5.2. Laboratório pessoal: Onde o usuário pode manifestar sua individualidade, colocar uma biografia, ter os seus distintivos, editar seus posts, ter um espaço como uma vitrine para suas artes, ver seu nível de XP na plataforma, deixar links para as suas redes seu site/blog e até currículo. 7.5.3. Configurações: Aba onde se pode gerenciar privacidade, exercer a portabilidade Takeout (LGPD) e configurar Notificações Push Granulares por Categoria (Aulas, Provas, Lembretes e Dicas IFUSP 101). 7.5.4. Pergunte a um cientista: Aba onde o usuário pode mandar uma mensagem e os moderadores do LabDiv irão correr atrás de pesquisadores parceiros para responder ela." },
        { subtitle: "7.6. LabDiv:", text: "Página oficial do LabDiv onde o usuário pode ver o kitdiv, marcar mentorias, agendar o uso do DigitalLab, ver as atividades e projetos do LabDiv e saber tudo sobre o laboratório de divulgação. 7.6.1. Sobre o HUB: Aqui o usuário que tiver alguma dúvida quanto ao HUB pode ter um resumo sobre a plataforma e também ver o impacto da mesma." },
        { subtitle: "7.7. Admin:", text: "O painel admin é uma seção não acessível para quem não é da equipe do LabDiv. É nele que podemos gerenciar o HUB. 7.7.1. Moderadores: Seção dos moderadores, a equipe do LabDiv que tem como pelo painel: Aprovar ou não todo conteúdo enviado pelo usuário, mandar notificações, ver e responder perguntas no pergunte a um cientista, validar matchs, lançar oportunidades, aprovar ou não mudanças de perfil. 7.7.2. Administradores: Ficando com os administradores a seção do painel que pode deletar conteúdos e gerenciar os papéis de usuários." }
      ]
    },
    {
      id: "organizacao",
      title: "8. Organização e Layout da Plataforma",
      paragraphs: [
        "A interface segue a Identidade Visual (IDV) do LabDiv. Em telas grandes (monitores/tablets), opera em um grid de 3 colunas e 3 linhas: Centro: Conteúdo principal da página (Aba ativa). Topo: Barra de navegação com buscador global, perfil, notificações, tema, logo e botão de report. Rodapé (Footer): Informações técnicas e institucionais. Coluna Esquerda: Menu de navegação. Coluna Direita: Cards para ações contextuais da aba atual.",
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
      paragraphs: ["A arquitetura do HUB foi projetada para resolver dores específicas de três personas fundamentais do ecossistema acadêmico:"],
      content: [
        { subtitle: "Para o pesquisador:", text: "O HUB atua como uma vitrine para suas linhas de pesquisa e uma ferramenta de captação de talentos (via Match Acadêmico). Permite gerenciar iniciativas de extensão e divulgar anotações ou desafios acadêmicos, aproximando-o da comunidade discente de forma estruturada." },
        { subtitle: "Para o Aluno:", text: "Centraliza a burocracia e o planejamento da vida acadêmica. Oferece sincronização de grade horária, acesso organizado aos editais e informações dos cursos/institutos (Wiki CGIF), grupos de estudo e um ambiente seguro e humanizado (Logs) para compartilhar as vivências do curso." },
        { subtitle: "Para o Curioso/Sociedade:", text: "Funciona como uma porta de entrada desmistificada para a universidade. Adapta a linguagem acadêmica através das \"Constelações de Mundos\", permitindo que o conhecimento científico seja consumido com base na bagagem cultural do visitante. E caso ele queira fazer parte do mesmo também oferece guias e informações para o ajudar a entrar nas universidades com ênfase no IFUSP." }
      ]
    },
    {
      id: "necessidade",
      title: "11. Por que o HUB é necessário?",
      paragraphs: ["Uma justificativa crítica: a divulgação científica já ocorre, mas os métodos atuais precisam de evolução estrutural e interativa para gerar uma comunicação real em vez de apenas uma transmissão de dados. Além desse aspecto técnico, o HUB responde a três necessidades urgentes do instituto:"],
      content: [
        { subtitle: "Mitigação do Afastamento Geracional:", text: "As crescentes diferenças geracionais estão tornando a comunicação entre alunos e professores cada vez mais desafiadora. O HUB atua como uma ponte digital projetada para restaurar e facilitar esse diálogo intra-institucional." },
        { subtitle: "Produtividade Acadêmica e Retenção Discente:", text: "O instituto necessita dessa troca contínua para manter sua produtividade, haja vista que a formação de novos pesquisadores depende diretamente de os alunos conseguirem Iniciações Científicas (ICs) e entenderem claramente o que é feito no IFUSP. O HUB organiza essas oportunidades e promove o senso de comunidade, sendo uma ferramenta ativa para incentivar a permanência dos alunos na faculdade e combater a evasão." },
        { subtitle: "Combate ao Discurso Anticiência:", text: "Frente ao avanço de visões negativas sobre o papel das universidades públicas e da proliferação de discursos anticientíficos na sociedade, é extremamente necessário estabelecer uma plataforma robusta, acessível e engajadora para reverter esse cenário e reconectar a população à ciência." }
      ]
    },
    {
      id: "replicabilidade",
      title: "12. Replicabilidade",
      paragraphs: [
        "A arquitetura de software e a estrutura conceitual do projeto foram desenvolvidas visando a fácil replicação por outros institutos e universidades, fomentando um ecossistema padronizado de comunicação acadêmica."
      ],
      content: [
        { subtitle: "Código Aberto (Open Source):", text: "O código-fonte integral está hospedado em um repositório público no GitHub, permitindo livre acesso, auditoria e colaboração por desenvolvedores de outras instituições." },
        { subtitle: "Licenciamento AGPL:", text: "A distribuição sob a licença AGPL (Affero General Public License) assegura que a plataforma permaneça livre e que qualquer modificação ou melhoria implementada por terceiros seja obrigatoriamente devolvida à comunidade com o mesmo código aberto." },
        { subtitle: "Arquitetura Descentralizada:", text: "Por não possuir dependência estrutural de um servidor central único gerido pelo IFUSP, o sistema pode ser facilmente instanciado, customizado e mantido de forma autônoma por qualquer outra universidade ou laboratório que deseje adotar o HUB." }
      ]
    },
    {
      id: "resultados",
      title: "13. Resultados e Impactos Esperados",
      content: [
        { subtitle: "Impactos Acadêmicos e Institucionais:", text: "Redução da evasão acadêmica (através do apoio das ferramentas de grade, trilhas, logs, wiki). Aumento quantitativo e qualitativo no número de Iniciações Científicas (via Match Acadêmico). Melhor compreensão sistêmica sobre a estrutura, burocracia e funcionamento do universo universitário. Preservação digital e ativa do patrimônio histórico do IFUSP, integrando o acervo ao fluxo diário dos estudantes. Geração contínua de dados primários (telemetria e questionários) para embasar futuras pesquisas acadêmicas na área de Ensino de Física e Comunicação Científica." },
        { subtitle: "Impactos Sociais e de Comunidade:", text: "Aumento da socialização inter e intradepartamental, rompendo bolhas acadêmicas. Maior engajamento da comunidade discente em eventos, simpósios e defesas. Acolhimento e suporte centralizado para a comunidade neurodivergente, diminuindo barreiras invisíveis de acessibilidade e permanência. Desmistificação da figura intocável do pesquisador (humanização da ciência) e melhora geral no bem-estar psicológico através das redes de apoio e Logs. Democratização e tradução cultural do conhecimento produzido no IFUSP para a sociedade civil, utilizando signos linguísticos adaptados (Constelações de mundos) para combater a desinformação e o discurso anticiência." }
      ]
    },
    {
      id: "tecnica",
      title: "14. Parte Técnica",
      paragraphs: ["A arquitetura do HUB LabDiv foi projetada com rigor técnico, focando em alta performance, estabilidade e escalabilidade institucional. Todo o código-fonte da aplicação tem versionamento aberto e está disponível publicamente no GitHub (JoaoStangorlini/HUB-LabDiv), garantindo transparência técnica e facilitando a colaboração contínua."],
      content: [
        { subtitle: "Linguagem Base (TypeScript):", text: "O código é estritamente tipado, garantindo segurança na alocação de dados, estruturação lógica rigorosa e a prevenção de erros críticos em tempo de compilação." },
        { subtitle: "Frontend e Estilização:", text: "A interface gráfica foi arquitetada para não depender de folhas de estilo (CSS) externas e pesadas. A estilização é implementada em escopo local e embutida diretamente na estrutura HTML dos componentes. Como framework utiliza-se o (Next.js/React)." },
        { subtitle: "Backend e Banco de Dados (Supabase):", text: "Toda a infraestrutura de dados, sistema de autenticação e rotas de backend são gerenciadas através da plataforma Supabase, fornecendo uma base de dados relacional robusta, segura e de fácil escalabilidade." },
        { subtitle: "Processamento de Mídia (Cloudinary):", text: "Para suportar a alta demanda de um acervo visual (fotos, gráficos, materiais 3D), o sistema integra o Cloudinary para realizar a compressão automática, o redimensionamento inteligente e a entrega otimizada de imagens." },
        { subtitle: "Infraestrutura e CI/CD (Vercel):", text: "O pipeline de Integração e Entrega Contínuas (CI/CD), bem como a hospedagem do ambiente de produção, são gerenciados pela plataforma Vercel. Essa escolha assegura deploys automatizados a cada atualização no GitHub e tempos de resposta ultrarrápidos através de sua infraestrutura de ponta (Edge Network)." }
      ]
    },
    {
      id: "juridico",
      title: "15. Jurídico",
      paragraphs: ["Conformidade Digital e Filosofia Aberta: O hub-Lab-Div foi arquitetado sob rigorosos padrões de segurança, inclusão e transparência, garantindo um ambiente acadêmico seguro para todos os usuários:"],
      content: [
        { subtitle: "Privacidade e Direitos:", text: "Conformidade integral com a Lei Geral de Proteção de Dados (LGPD) e o Marco Civil da Internet (MCI)." },
        { subtitle: "Proteção de Menores:", text: "Adequação estrita ao ECA Digital e aplicação das Boas Práticas do UNICEF para ambientes digitais seguros." },
        { subtitle: "Acessibilidade Plena:", text: "Infraestrutura desenvolvida para atender aos rigorosos critérios da Lei Brasileira de Inclusão (LBI) e diretrizes e-MAG/WCAG 2.1." },
        { subtitle: "Ciência Aberta (Acervo):", text: "Todo o conteúdo público e propriedade intelectual são distribuídos gratuitamente sob a licença Creative Commons (CC BY 4.0)." },
        { subtitle: "Código Aberto (Software):", text: "O código-fonte da plataforma é software livre, licenciado e protegido pela GNU AGPLv3." }
      ]
    },
    {
      id: "conclusao",
      title: "16. Conclusão",
      paragraphs: [
        "Diante do exposto, conclui-se que o hub-Lab-Div representa um marco transformador na percepção pública da ciência e na relação estabelecida entre o IFUSP, sua comunidade acadêmica e a sociedade. Ao transcender a função de mero acervo para atuar como uma plataforma interativa (PWA), o projeto consolida a infraestrutura digital necessária para uma divulgação científica verdadeiramente acessível, inclusiva, tecnicamente robusta e replicável."
      ]
    }
  ]
};
