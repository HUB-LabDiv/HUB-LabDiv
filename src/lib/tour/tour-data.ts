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

export interface TourStepConfig {
    element: string;
    gesture?: 'horizontal' | 'vertical';
    popover: {
        title: string;
        description: string;
        side?: 'top' | 'bottom' | 'left' | 'right';
        align?: 'start' | 'center' | 'end';
    };
}

export type UserRoleCategory = 'aluno_usp' | 'pesquisador' | 'curioso';

/**
 * Detecta reativamente o perfil do usuário a partir dos elementos renderizados no DOM.
 * Isso garante total sincronia com o estado visual da navbar, sidebar e menu em pílula.
 */
export function detectUserRoleFromDOM(): UserRoleCategory {
    if (typeof document === 'undefined') return 'curioso';
    const el = document.querySelector('[data-tour="navbar-eixo-ferramentas"]') ||
               document.querySelector('[data-tour="mobile-eixo-ferramentas"]') ||
               document.querySelector('[data-tour="sidebar-eixo-ferramentas"]');
    if (!el) return 'curioso';
    const href = el.getAttribute('href') || '';
    if (href.startsWith('/arena')) return 'pesquisador';
    if (href.startsWith('/ferramentas')) return 'aluno_usp';
    return 'curioso';
}

// -----------------------------------------------------------------------------
// 1. TUTORIAL GERAL - DESKTOP
// Consiste em:
// 1 - Início (Home)
// 2 - Busca Global
// 3 - Eixo Comunidade (com a aba Interações também na barra e no painel lateral)
// 4 - Eixo de Informação & Wiki (CGIF)
// 5 - Eixo Ferramentas / Adaptativo (Variável: Não Logado / Aluno / Pesquisador)
// -----------------------------------------------------------------------------
export function getDesktopGlobalTourSteps(role: UserRoleCategory = detectUserRoleFromDOM()): TourStepConfig[] {
    const steps: TourStepConfig[] = [
        // 1. Início (Home)
        {
            element: '[data-tour="logo-home"]',
            popover: {
                title: '1. Início (Home)',
                description: 'Clique na logo do HUB Lab-Div a qualquer momento para retornar à raiz do site e ao feed principal.',
                side: 'bottom',
                align: 'start',
            }
        },
        // 2. Busca Global
        {
            element: '[data-tour="global-search"], [data-tour="global-search-mobile"]',
            popover: {
                title: '2. Busca Global',
                description: 'Pesquise por publicações científicas, materiais didáticos, membros da comunidade acadêmica, disciplinas e núcleos em toda a plataforma.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 3. Reportar Erro & Feedback
        {
            element: '[data-tour="report-button"], [data-tour="report-button-mobile"]',
            popover: {
                title: '3. Reportar Erro & Feedback',
                description: 'Encontrou algum bug, inconsistência visual ou tem uma ideia? Abra o formulário de reporte para enviar detalhes técnicos e capturas diretamente à equipe de desenvolvimento.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 4. Central de Notificações
        {
            element: '[data-tour="notifications-bell"]',
            popover: {
                title: '4. Central de Notificações',
                description: 'Receba avisos em tempo real sobre interações nas suas postagens, mensagens diretas no Emaranhamento Quântico e comunicados acadêmicos.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 5. Modo Claro / Escuro
        {
            element: '[data-tour="theme-toggle"], [data-tour="theme-toggle-mobile"]',
            popover: {
                title: '5. Modo Claro / Escuro',
                description: 'Alterne instantaneamente entre o tema escuro imersivo (#121212) e o tema claro com contraste otimizado para leitura diurna.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 6. Configurações & Perfil
        {
            element: '[data-tour="user-profile-menu"], [data-tour="header-settings"]',
            popover: {
                title: '6. Configurações & Perfil',
                description: 'Personalize seu instituto de destaque (IFUSP, IME, IAG...), ajuste preferências do sistema e, ao fazer login, acesse seu Laboratório pessoal e menu de perfil.',
                side: 'bottom',
                align: 'end',
            }
        },
        // 7. Eixo Social: Feed da Comunidade — Barra Superior
        {
            element: '[data-tour="navbar-eixo-comunidade"]',
            popover: {
                title: '7. Eixo Social: Feed da Comunidade — Barra Superior',
                description: '<b>EIXO SOCIAL:</b> O coração da vida acadêmica do IFUSP. Acompanhe publicações em três formatos: <b>Fluxo</b> (mídias e resumos didáticos), <b>Logs</b> (relatos e vivência acadêmica) e mural de <b>Arte</b>.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 8. Eixo Social: Central de Interações — Barra Superior
        {
            element: '[data-tour="navbar-eixo-interacoes"]',
            popover: {
                title: '8. Eixo Social: Central de Interações — Barra Superior',
                description: 'Integrada ao Eixo Social, a <b>Central de Interações</b> conecta você por chat em tempo real no <b>Emaranhamento Quântico</b> e ao canal tira-dúvidas público <b>Pergunte a um Cientista</b>.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 9. Eixo Social — Painel Lateral
        {
            element: '[data-tour="sidebar-eixo-comunidade"]',
            popover: {
                title: '9. Eixo Social — Painel Lateral',
                description: 'No painel lateral você tem atalhos diretos para o feed da <b>Comunidade</b>, para a <b>Central de Interações</b>, conversas nas Partículas Emaranhadas e para o seu Laboratório pessoal.',
                side: 'right',
                align: 'start',
            }
        },
        // 10. Eixo CGIF (Informação & Wiki — Barra Superior)
        {
            element: '[data-tour="navbar-eixo-cgif"]',
            popover: {
                title: '10. Eixo CGIF (Informação & Wiki) — Barra Superior',
                description: '<b>INFORMAÇÃO & WIKI:</b> A central oficial do Centro de Graduação do IFUSP. Espaços, iniciativas discentes, criadores de conteúdo científico, mapa interativo e a <b>Wiki centralizada</b> com manuais de cursos, editais e portais acadêmicos.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 11. Eixo CGIF — Painel Lateral
        {
            element: '[data-tour="sidebar-eixo-cgif"]',
            popover: {
                title: '11. Eixo CGIF — Painel Lateral',
                description: 'No painel lateral você navega rapidamente para a central <b>GCIF</b>, mantendo consultas curriculares, editais e avisos acadêmicos sempre a um clique de distância.',
                side: 'right',
                align: 'start',
            }
        }
    ];

    // 12. Eixo Ferramentas / Adaptativo (Barra Superior e Painel Lateral)
    if (role === 'aluno_usp') {
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Ferramentas: Apoio ao Estudo & Pesquisa — Barra Superior',
                    description: '<b>ESTUDO & PESQUISA:</b> Seu kit universitário completo! Organize sua <b>Grade Horária 1h:1h</b>, monitore o limite de <b>faltas</b> por disciplina, acompanhe sua evolução nas <b>Trilhas</b> de formação e conecte-se a grupos de estudo e Iniciação Científica no <b>Match Acadêmico</b>.<br/><br/><i>Nota: Este eixo é adaptativo — pesquisadores veem o Observatório de Pesquisa e visitantes veem o guia Como Ingressar.</i>',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Ferramentas: Apoio ao Estudo & Pesquisa — Painel Lateral',
                    description: 'No painel lateral você acessa instantaneamente suas <b>Ferramentas Acadêmicas</b> para simular horários, sincronizar com o Júpiter e organizar seu semestre com flexibilidade.',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    } else if (role === 'pesquisador') {
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Pesquisa: Observatório de Pesquisa — Barra Superior',
                    description: '<b>OBSERVATÓRIO DE PESQUISA:</b> Espaço dedicado aos docentes e pesquisadores do IFUSP. Divulgue linhas de investigação ativas, lance desafios científicos e capte novos talentos discentes para Iniciação Científica através do <b>Match Acadêmico</b>.<br/><br/><i>Nota: Este eixo é adaptativo — alunos veem Ferramentas e visitantes veem o guia Como Ingressar.</i>',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Pesquisa: Observatório de Pesquisa — Painel Lateral',
                    description: 'Acesse o <b>Observatório de Pesquisa</b> pelo menu lateral para conectar-se aos departamentos, gerenciar orientações e acompanhar a produção científica do instituto.',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    } else {
        // Visitante / Não Logado ('curioso')
        steps.push(
            {
                element: '[data-tour="navbar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Adaptativo: Ingressar — Barra Superior',
                    description: '<b>EIXO VARIÁVEL:</b> O 3º eixo da plataforma se molda ao seu perfil em toda a plataforma!<br/><br/>• <b>Para você (Visitante / Não Logado):</b> Exibe a aba <b>Ingressar</b> com o guia completo de como entrar no IFUSP (Fuvest, ENEM-USP, Provão Paulista, Olimpíadas) e dicas de preparação.<br/><br/>• <b>Para Alunos USP:</b> O botão e o ícone mudam para <b>Ferramentas</b> (Grade Horária 1h:1h, Faltas e Match Acadêmico).<br/><br/>• <b>Para Pesquisadores:</b> Mudam para <b>Pesquisa</b> (Observatório e conexão com alunos).',
                    side: 'bottom',
                    align: 'center',
                }
            },
            {
                element: '[data-tour="sidebar-eixo-ferramentas"]',
                popover: {
                    title: '12. Eixo Adaptativo: Como Ingressar — Painel Lateral',
                    description: 'No painel lateral, o botão <b>Como Ingressar</b> traz atalhos diretos para vestibulares, transferências e editais. Assim que você fizer login com seu perfil USP, este menu lateral e a barra superior se atualizarão automaticamente para suas ferramentas universitárias!',
                    side: 'right',
                    align: 'start',
                }
            }
        );
    }

    return steps;
}

// -----------------------------------------------------------------------------
// 2. TUTORIAL GERAL - MOBILE
// Destaca os controles superiores e os botões no Menu em Pílula
// -----------------------------------------------------------------------------
export function getMobileGlobalTourSteps(role: UserRoleCategory = detectUserRoleFromDOM()): TourStepConfig[] {
    const steps: TourStepConfig[] = [
        // 1. Início (Home)
        {
            element: '[data-tour="logo-home"]',
            popover: {
                title: '1. Início (Home)',
                description: 'Toque na logo do HUB Lab-Div a qualquer momento para retornar à raiz do site e ao feed principal.',
                side: 'bottom',
                align: 'start',
            }
        },
        // 2. Busca Global
        {
            element: '[data-tour="global-search-mobile"], [data-tour="global-search"]',
            popover: {
                title: '2. Busca Global',
                description: 'Pesquise por publicações, materiais didáticos, pessoas e matérias em toda a plataforma.',
                side: 'bottom',
                align: 'end',
            }
        },
        // 3. Reportar Erro & Feedback
        {
            element: '[data-tour="report-button"], [data-tour="report-button-mobile"]',
            popover: {
                title: '3. Reportar Erro & Feedback',
                description: 'Toque aqui para reportar qualquer falha, bug visual ou enviar sugestões de melhoria diretamente para a equipe técnica do HUB.',
                side: 'bottom',
                align: 'end',
            }
        },
        // 4. Central de Notificações
        {
            element: '[data-tour="notifications-bell"]',
            popover: {
                title: '4. Central de Notificações',
                description: 'Acompanhe interações em publicações, mensagens no Emaranhamento e avisos acadêmicos em tempo real.',
                side: 'bottom',
                align: 'center',
            }
        },
        // 5. Modo Claro / Escuro
        {
            element: '[data-tour="theme-toggle"], [data-tour="theme-toggle-mobile"]',
            popover: {
                title: '5. Modo Claro / Escuro',
                description: 'Alterne entre o tema escuro imersivo e o tema claro com visual confortável para leitura diurna.',
                side: 'bottom',
                align: 'start',
            }
        },
        // 6. Configurações & Perfil
        {
            element: '[data-tour="user-profile-menu"], [data-tour="header-settings"]',
            popover: {
                title: '6. Configurações & Perfil',
                description: 'Personalize seu instituto de destaque (IFUSP, IME, IAG...), gerencie preferências e acesse seu perfil ou faça login na plataforma.',
                side: 'bottom',
                align: 'end',
            }
        },
        // 7. Eixo Social: Comunidade — Menu em Pílula
        {
            element: '[data-tour="mobile-eixo-comunidade"]',
            popover: {
                title: '7. Eixo Social: Feed da Comunidade',
                description: '<b>EIXO SOCIAL:</b> O feed vivo da faculdade. Acompanhe publicações científicas e acadêmicas em <b>Fluxo</b> (mídias), <b>Logs</b> (relatos) e <b>Arte</b>.',
                side: 'top',
                align: 'center',
            }
        },
        // 8. Eixo Social: Central de Interações — Menu em Pílula
        {
            element: '[data-tour="mobile-eixo-interacoes"]',
            popover: {
                title: '8. Eixo Social: Central de Interações',
                description: 'A segunda aba do Eixo Social reúne canais diretos de conexão: converse no <b>Emaranhamento Quântico</b> e tire dúvidas no <b>Pergunte a um Cientista</b>.',
                side: 'top',
                align: 'center',
            }
        },
        // 9. Eixo de Informação & Wiki (CGIF)
        {
            element: '[data-tour="mobile-eixo-cgif"]',
            popover: {
                title: '9. Eixo CGIF (Informação & Wiki)',
                description: '<b>INFORMAÇÃO & WIKI:</b> Conheça espaços do IFUSP, iniciativas discentes, criadores de conteúdo e a Wiki oficial centralizada com manuais e editais.',
                side: 'top',
                align: 'center',
            }
        }
    ];

    // 10. Eixo Ferramentas / Adaptativo (Menu em Pílula)
    if (role === 'aluno_usp') {
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Ferramentas: Apoio ao Estudo & Pesquisa',
                description: '<b>ESTUDO & PESQUISA:</b> Seu kit universitário na palma da mão! Acesse o planejador de Grade 1h:1h, acompanhe faltas, trilhas curriculares e o Match Acadêmico para grupos de estudo e ICs.<br/><br/><i>Nota: Este botão adapta seu ícone e destino dependendo se você é aluno, pesquisador ou visitante.</i>',
                side: 'top',
                align: 'center',
            }
        });
    } else if (role === 'pesquisador') {
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Pesquisa: Observatório de Pesquisa',
                description: '<b>OBSERVATÓRIO DE PESQUISA:</b> Mapeie laboratórios, divulgue projetos científicos e recrute alunos para Iniciação Científica através do Match Acadêmico.<br/><br/><i>Nota: Este botão adapta seu ícone e destino dependendo se você é pesquisador, aluno ou visitante.</i>',
                side: 'top',
                align: 'center',
            }
        });
    } else {
        // Visitante / Não Logado ('curioso')
        steps.push({
            element: '[data-tour="mobile-eixo-ferramentas"]',
            popover: {
                title: '10. Eixo Adaptativo: Como Ingressar',
                description: '<b>EIXO VARIÁVEL:</b> O ícone e o destino deste 3º botão no menu em pílula mudam para cada usuário!<br/><br/>• <b>Para você (Não Logado):</b> Exibe o ícone de capelo acadêmico com <b>Ingressar</b> (guia completo de portas de entrada no IFUSP).<br/><br/>• <b>Para Alunos USP:</b> Muda para o ícone de ferramentas com <b>Ferramentas</b> (Grade 1h:1h e Faltas).<br/><br/>• <b>Para Pesquisadores:</b> Muda para o ícone de observatório com <b>Pesquisa</b>.',
                side: 'top',
                align: 'center',
            }
        });
    }

    return steps;
}

// Fallback estático para compatibilidade retroativa
export const DESKTOP_GLOBAL_TOUR_STEPS = getDesktopGlobalTourSteps('curioso');
export const MOBILE_GLOBAL_TOUR_STEPS = getMobileGlobalTourSteps('curioso');
export const GLOBAL_TOUR_STEPS = [...DESKTOP_GLOBAL_TOUR_STEPS, ...MOBILE_GLOBAL_TOUR_STEPS];

export function getGlobalTourSteps(role?: UserRoleCategory): TourStepConfig[] {
    const userRole = role || detectUserRoleFromDOM();
    const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1280 : true;
    return isDesktop ? getDesktopGlobalTourSteps(userRole) : getMobileGlobalTourSteps(userRole);
}

// -----------------------------------------------------------------------------
// 3. TUTORIAIS ESPECÍFICOS DE PÁGINAS
// -----------------------------------------------------------------------------

// Tutorial da Comunidade
export const COMUNIDADE_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="comunidade-subnav"]',
        popover: {
            title: '1. Formatos de Publicação (Logs, Fluxo e Arte)',
            description: 'Alterne entre os 3 formatos de conteúdo da comunidade:<br/><br/>• <b>Fluxo:</b> Mídias, resumos científicos visuais e PDFs didáticos.<br/>• <b>Logs:</b> Relatos, reflexões e vivências acadêmicas compartilhadas.<br/>• <b>Arte:</b> Mural cultural com ilustrações, charges e criações da comunidade.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-filtros"]',
        popover: {
            title: '2. Filtros Multidimensionais',
            description: 'Refine sua navegação combinando filtros por <b>Formato</b> (Imagens, Vídeos, Documentos, Notes), <b>Categorias</b> (Lab-Div, Laboratórios, Pesquisadores), <b>Institutos</b> (IFUSP, IME, IAG...) e <b>Ano</b> de publicação.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-em-orbita"]',
        gesture: 'horizontal',
        popover: {
            title: '3. Em Órbita (Destaques por Instituto)',
            description: '<b>SINCRONIA COM SEU PERFIL:</b> Este carrossel horizontal filtra automaticamente as publicações em destaque do <b>seu instituto</b> de preferência (definido na personalização da sua conta).',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"]',
        gesture: 'vertical',
        popover: {
            title: '4. Feed Principal (Navegação Contínua)',
            description: 'Linha do tempo contínua com todas as publicações da comunidade universitária, atualizada em tempo real conforme você explora o ecossistema.',
            side: 'top',
            align: 'center',
        }
    },
    {
        element: '[data-tour="comunidade-feed-vertical"] [data-tour="media-card-interactions"]',
        popover: {
            title: '5. Interações na Publicação',
            description: 'Em cada publicação do <b>feed vertical</b>, você pode interagir diretamente:<br/><br/>• ❤️ <b>Curtir (Like):</b> Registre sua reação acadêmica ao conteúdo.<br/>• 💬 <b>Comentar:</b> Abra a discussão e tire dúvidas científicas.<br/>• 🚀 <b>Compartilhar:</b> Gere links diretos para enviar aos colegas.<br/>• 🚩 <b>Denunciar:</b> Reporte conteúdos que violem as diretrizes para moderação rápida.<br/>• ⭐ <b>Salvar na Constelação:</b> Guarde o post nos seus favoritos para consultar quando quiser!',
            side: 'top',
            align: 'center',
        }
    }
];

// Tutorial do CGIF (Os 9 Módulos do Grande Colisor)
export const CGIF_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="cgif-nav-oportunidades"], #oportunidades',
        popover: {
            title: '1. Oportunidades Ativas',
            description: 'Mural atualizado de bolsas de estudo (PUB, IC, monitoria), estágios, simpósios, colóquios e vagas acadêmicas no IFUSP.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="cgif-nav-iniciativas"], #iniciativas',
        popover: {
            title: '2. Iniciativas Acadêmicas',
            description: 'Conheça coletivos, entidades estudantis, o Centro de Estudos de Física (CEF), empresas juniores e projetos de extensão.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="cgif-nav-mapa"], #mapa',
        popover: {
            title: '3. Mapa Interativo do IFUSP',
            description: 'Navegue geograficamente pelos edifícios, blocos de aula, laboratórios didáticos, oficinas e auditórios do Instituto de Física.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="cgif-nav-espacos"], [data-tour="cgif-nav-espaços"], #espaços',
        popover: {
            title: '4. Espaços do Instituto',
            description: 'Catálogo detalhado dos locais de estudo, biblioteca, laboratórios de pesquisa, secretarias e ambientes de vivência.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="cgif-nav-influenciadores"], #influenciadores',
        popover: {
            title: '5. Influenciadores & Divulgadores',
            description: 'Descubra canais no YouTube, perfis no Instagram e criadores de conteúdo que divulgam a física e a ciência da USP.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="cgif-nav-wiki-hub-section"], #wiki-hub-section',
        popover: {
            title: '6. Wiki Centralizada',
            description: 'A enciclopédia oficial do curso: manuais de formação (Bacharelado e Licenciatura), guias curriculares, editais e portais da USP.',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="cgif-nav-constelacoes"], #constelacoes',
        popover: {
            title: '7. Glossário & Constelações',
            description: 'Dicionário interativo de termos científicos, jargões universitários e conceitos fundamentais para facilitar os estudos.',
            side: 'bottom',
            align: 'end',
        }
    },
    {
        element: '[data-tour="cgif-nav-teste-radiacao"], #teste-radiacao',
        popover: {
            title: '8. Teste Interativo de Radiação',
            description: 'Quizzes dinâmicos para testar conhecimentos de física com perguntas práticas e pontuação imediata.',
            side: 'bottom',
            align: 'end',
        }
    },
    {
        element: '[data-tour="cgif-nav-sac-section"], #sac-section',
        popover: {
            title: '9. SAC & Ouvidoria Discente',
            description: 'Central de atendimento: tire dúvidas frequentes, envie feedback institucional e acerte contatos com os canais oficiais do CGIF.',
            side: 'bottom',
            align: 'end',
        }
    }
];

// Tutorial de Ferramentas
export const FERRAMENTAS_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="ferramentas-actions"]',
        popover: {
            title: '🛠️ Ferramentas & Sincronização',
            description: 'Sincronize automaticamente seus horários do JúpiterWeb, adicione matérias avulsas, crie blocos customizados de estudo e exporte sua grade.',
            side: 'bottom',
            align: 'start',
        }
    },
    {
        element: '[data-tour="ferramentas-grade"]',
        popover: {
            title: '📅 Grade Horária Inteligente',
            description: 'Visualize sua grade semanal com detecção instantânea de choques de horário, horários livres e faltas registradas.',
            side: 'top',
            align: 'center',
        }
    }
];

// Tutorial de Interações
export const INTERACOES_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="interacao-subnav"]',
        popover: {
            title: '🔀 Canais de Interação',
            description: 'Alterne entre <b>Emaranhamento Quântico</b> (mensagens diretas e conexões) e <b>Pergunte a um Cientista</b> (canal direto de dúvidas científicas).',
            side: 'bottom',
            align: 'center',
        }
    },
    {
        element: '[data-tour="interacao-content"]',
        popover: {
            title: '💬 Colaboração Científica',
            description: 'Envie suas perguntas diretamente para pós-graduandos, pesquisadores e docentes ou participe das discussões científicas abertas.',
            side: 'top',
            align: 'center',
        }
    }
];

// Tutorial do Observatório
export const OBSERVATORIO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="arena-content"]',
        popover: {
            title: '🔭 Observatório de Pesquisa',
            description: 'Mapeamento de grupos de pesquisa, laboratórios ativos e iniciativas científicas de ponta em andamento no Instituto de Física.',
            side: 'top',
            align: 'center',
        }
    }
];

// Tutorial de Ingresso
export const INGRESSO_TOUR_STEPS: TourStepConfig[] = [
    {
        element: '[data-tour="ingresso-content"]',
        popover: {
            title: '🎓 Guia de Ingresso na USP',
            description: 'Informações completas e detalhadas sobre as portas de entrada: Fuvest, ENEM-USP, Provão Paulista, Olimpíadas Científicas e Transferência.',
            side: 'top',
            align: 'center',
        }
    }
];

// Alias para compatibilidade anterior
export const ONBOARDING_STEPS = GLOBAL_TOUR_STEPS;

export interface PageTourInfo {
    key: string;
    title: string;
    shortLabel: string;
    steps: TourStepConfig[];
}

export function getPageTourInfo(pathname: string): PageTourInfo {
    if (pathname === '/' || pathname.startsWith('/fluxo') || pathname.startsWith('/drops') || pathname.startsWith('/arquivo') || pathname.startsWith('/comunidade')) {
        return {
            key: 'comunidade',
            title: 'Tutorial da Comunidade',
            shortLabel: 'Comunidade',
            steps: COMUNIDADE_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/gcif') || pathname.startsWith('/colisor')) {
        return {
            key: 'cgif',
            title: 'Tutorial do CGIF',
            shortLabel: 'CGIF',
            steps: CGIF_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/ferramentas') || pathname.startsWith('/grade') || pathname.startsWith('/trilhas')) {
        return {
            key: 'ferramentas',
            title: 'Tutorial de Ferramentas',
            shortLabel: 'Ferramentas',
            steps: FERRAMENTAS_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/interacao') || pathname.startsWith('/perguntas') || pathname.startsWith('/emaranhamento')) {
        return {
            key: 'interacoes',
            title: 'Tutorial de Interações',
            shortLabel: 'Interações',
            steps: INTERACOES_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/arena')) {
        return {
            key: 'observatorio',
            title: 'Tutorial do Observatório',
            shortLabel: 'Observatório',
            steps: OBSERVATORIO_TOUR_STEPS
        };
    }
    if (pathname.startsWith('/ingresso')) {
        return {
            key: 'ingresso',
            title: 'Tutorial de Ingresso',
            shortLabel: 'Ingresso',
            steps: INGRESSO_TOUR_STEPS
        };
    }
    // Fallback: Rota sem tutorial específico
    return {
        key: 'global',
        title: 'Tutorial Geral',
        shortLabel: 'Geral',
        steps: getGlobalTourSteps()
    };
}
