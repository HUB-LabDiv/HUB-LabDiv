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

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  BookOpen, 
  Presentation, 
  ExternalLink,
  Users,
  FileText,
  Wrench,
  CheckCircle2,
  Download,
  Smartphone,
  Globe,
  GraduationCap,
  Microscope,
  Compass
} from 'lucide-react';

export interface SlideLink {
  label: string;
  url: string;
  variant?: 'yellow' | 'blue' | 'red' | 'outline' | 'green';
}

export interface ReuniaoSlideItem {
  id: number;
  title: string;
  category: string;
  subtitle?: string;
  description: string;
  accentColor: 'blue' | 'yellow' | 'red' | 'tricolor';
  isLabDivIntro?: boolean;
  isThreeAxes?: boolean;
  isPersonasOverview?: boolean;
  highlights: string[];
  notes?: string[];
  links?: SlideLink[];
}

export const REUNIAO_SLIDES: ReuniaoSlideItem[] = [
  {
    id: 1,
    title: 'O que é o LabDiv?',
    subtitle: 'Laboratório de Divulgação Científica do Instituto de Física da USP',
    category: 'LABDIV • IFUSP | QUEM SOMOS',
    description: 'Apresentação institucional do laboratório de divulgação do IFUSP: origem, equipe e missão transformadora.',
    accentColor: 'blue',
    isLabDivIntro: true,
    highlights: [
      'Origem & Coordenação: Laboratório do IFUSP sob orientação e liderança do Prof. Caetano Miranda.',
      'Missão Central: Romper os muros da universidade e aproximar a sociedade do fazer científico real.',
      'Três Frentes de Atuação: Curadoria de conteúdo, pesquisa teórica em comunicação e produção multiformato.',
      'Infraestrutura Físico-Digital: DigitalLab, KitDiv, mentorias acadêmicas e a concepção do HUB como software livre.'
    ],
    notes: [
      'Iniciar a apresentação contextualizando que o HUB nasce de dentro do LabDiv no IFUSP.',
      'Destacar o papel orientador do Prof. Caetano Miranda e a equipe de alunos.',
      'Explicar que a meta é ir além da divulgação passiva de dados.'
    ],
    links: [
      { label: 'Página Sobre o LabDiv', url: '/sobre', variant: 'blue' },
      { label: 'Instituto de Física IFUSP', url: 'https://portal.if.usp.br', variant: 'outline' }
    ]
  },
  {
    id: 2,
    title: 'Visão Geral do HUB LabDiv',
    subtitle: 'O Super App de Comunicação Científica para romper os muros da Universidade',
    category: 'CONCEITO & PLATAFORMA | HUB LABDIV',
    description: 'Plataforma digital WebApp open source (AGPLv3) concebida para integrar a comunidade e transformar a divulgação.',
    accentColor: 'yellow',
    highlights: [
      'Super App Web: Centraliza utilitários em um só link (PWA no navegador, sem instalação obrigatória).',
      'Comunicação Dialógica: Fundamentação em Paulo Freire (Extensão ou Comunicação?) — co-construção de significado.',
      'Ciência como Processo: Foco no método e na reflexão crítica, superando o modelo de curiosidades superficiais.',
      'Código Aberto (AGPLv3): Projeto transparente no GitHub pronto para replicação em outras universidades.'
    ],
    notes: [
      'Explicar a diferença entre divulgação tradicional (unidirecional) e comunicação dialógica.',
      'Mencionar a portabilidade no celular sem precisar baixar nada pesado da loja.'
    ],
    links: [
      { label: 'Acessar WebApp', url: '/', variant: 'yellow' },
      { label: 'Google PlayStore', url: 'https://play.google.com/store/apps/details?id=br.usp.ifusp.hublabdiv', variant: 'blue' },
      { label: 'Repositório GitHub', url: 'https://github.com/JoaoStangorlini/HUB-LabDiv', variant: 'outline' }
    ]
  },
  {
    id: 3,
    title: 'Os 3 Eixos Principais do HUB',
    subtitle: 'Arquitetura modular organizada nas 3 cores oficiais da marca LabDiv',
    category: 'ESTRUTURA MATRIZ | 3 EIXOS',
    description: 'Divisão fundamental da plataforma nas 3 frentes de atuação para atender a comunidade acadêmica e externa.',
    accentColor: 'tricolor',
    isThreeAxes: true,
    highlights: [
      'Eixo Social (Azul #0F4780): Rede dialógica, feed de comunicação científica, vivências e galeria de expressões.',
      'Eixo Informativo (Vermelho #F14343): Central CGIF, Wiki institucional unificada, oportunidades e mapa físico.',
      'Eixo Ferramentas (Amarelo #FFCC00): Produtividade, grade 1h:1h, trilhas Júpiter e conexão direta para pesquisa.'
    ],
    notes: [
      'Apresentar o significado visual de cada cor da marca: Azul (Social), Vermelho (Informativo), Amarelo (Ferramentas).',
      'Ressaltar como cada eixo supre uma dor crônica de comunicação do instituto.'
    ],
    links: [
      { label: 'Eixo Social', url: '/', variant: 'blue' },
      { label: 'Eixo Informativo', url: '/gcif', variant: 'red' },
      { label: 'Eixo Ferramentas', url: '/ferramentas', variant: 'yellow' }
    ]
  },
  {
    id: 4,
    title: 'Eixo Social: 3 Sub-abas da Comunicação',
    subtitle: 'O espaço de comunicação dialógica e humanização da ciência',
    category: 'EIXO SOCIAL | COMUNICAÇÃO',
    description: 'Três ambientes integrados na tela inicial: Fluxo, Registros e Galeria de Arte.',
    accentColor: 'blue',
    highlights: [
      '1. Fluxo (Feed Científico): Postagens com balões freirianos de reflexão, quizzes interativos, áudio-narração e suporte a LaTeX.',
      '2. Registros (Logs Discentes): Espaço leve de micro-relatos diários, desabafos e acolhimento humano da comunidade.',
      '3. Galeria (Artes Visuais): Vitrine de ilustrações científicas, astrofotografia, poemas e produções artísticas autorais.'
    ],
    notes: [
      'Demonstrar que a ciência também é feita por pessoas reais através de arte e vivências.',
      'Destacar os balões de reflexão baseados em Paulo Freire como diferencial pedagógico.'
    ],
    links: [
      { label: 'Feed Fluxo', url: '/', variant: 'yellow' },
      { label: 'Ver Registros', url: '/?tab=logs', variant: 'blue' },
      { label: 'Ver Galeria', url: '/?tab=arte', variant: 'red' }
    ]
  },
  {
    id: 5,
    title: 'Interações & Laboratório Pessoal',
    subtitle: 'Diálogo direto, mentoria e identidade individual na plataforma',
    category: 'INTERAÇÕES & IDENTIDADE',
    description: 'Canais de comunicação direta, resolução de dúvidas com cientistas e o perfil customizável do usuário.',
    accentColor: 'blue',
    highlights: [
      'Sub-aba 1 — Emaranhamento Quântico: Mensagens privadas diretas (DMs) e criação de canais de grupos acadêmicos.',
      'Sub-aba 2 — Pergunte a um Cientista: Canal de dúvidas da sociedade respondidas por pesquisadores via curadoria do LabDiv.',
      'Laboratório Pessoal (Perfil do Usuário): Vitrine individual com biografia, distintivos/XP, projetos e portfólio.',
      'Constelações de Mundos: Escolha de afinidade cultural (Geek, Arte, Computação, Acadêmico) para adaptar os termos.'
    ],
    notes: [
      'Mostrar a união do contato pessoal (DMs e grupos) com a consultoria científica (Pergunte a um Cientista).',
      'Ressaltar o conceito de Constelações de Mundos para personalizar analogias e linguagem.'
    ],
    links: [
      { label: 'Central de Interação', url: '/interacao', variant: 'blue' },
      { label: 'Meu Laboratório Pessoal', url: '/interacao?tab=lab', variant: 'yellow' }
    ]
  },
  {
    id: 6,
    title: 'Eixo Informativo: 3 Sub-abas do CGIF',
    subtitle: 'Centralização do Conhecimento Institucional & Memória do IFUSP',
    category: 'EIXO INFORMATIVO | CGIF',
    description: 'Central de Gestão e Informação: Wiki unificada, catálogo de oportunidades e conexão com o espaço físico.',
    accentColor: 'red',
    highlights: [
      '1. Wiki CGIF (/gcif/wiki): Manuais do curso, Projetos Político-Pedagógicos (PPPs), regimentos e rotas de circulares organizadas.',
      '2. Oportunidades & Instituto (/gcif/instituto): Painel dinâmico com bolsas PUB, vagas de Iniciação Científica, estágios e eventos.',
      '3. Interativo (/gcif/interativo): Mapa do campus do IFUSP integrado a QR Codes nos laboratórios e Quiz Teste de Radiação.'
    ],
    notes: [
      'Explicar como a Wiki resolve a dispersão histórica de manuais e regulamentos do instituto.',
      'Mencionar a ponte física proporcionada pelos QR Codes no mapa do campus.'
    ],
    links: [
      { label: 'Wiki CGIF', url: '/gcif/wiki', variant: 'red' },
      { label: 'Mural de Oportunidades', url: '/gcif/instituto', variant: 'yellow' },
      { label: 'Mapa & Quiz Interativo', url: '/gcif/interativo', variant: 'blue' }
    ]
  },
  {
    id: 7,
    title: 'Ferramentas Adaptativas por Perfil',
    subtitle: 'O 3º eixo se transforma dinamicamente conforme a persona identificada',
    category: 'EIXO FERRAMENTAS | PERSONALIZAÇÃO',
    description: 'A navegação e a barra inferior se adaptam para entregar utilitários específicos para cada perfil.',
    accentColor: 'yellow',
    isPersonasOverview: true,
    highlights: [
      'Para o Professor / Pesquisador: O 3º eixo ativa o Observatório de Pesquisa / Arena (/arena).',
      'Para o Curioso / Sociedade: O 3º eixo ativa o Portal Como Ingressar na USP (/ingresso).',
      'Para o Aluno da Graduação/Pós: O 3º eixo ativa a Central de Ferramentas Acadêmicas (/ferramentas).',
      'Reconhecimento Inteligente: Detecção automática via domínio institucional (@usp.br) ou livre escolha pelo visitante.'
    ],
    notes: [
      'Explicar que o Super App se molda ao usuário: um calouro não precisa ver a mesma tela que um pós-doutorando.',
      'Esta adaptabilidade garante usabilidade sem sobrecarregar a interface.'
    ],
    links: [
      { label: 'Ver Arena (Professor)', url: '/arena', variant: 'red' },
      { label: 'Ver Como Ingressar (Curioso)', url: '/ingresso', variant: 'yellow' },
      { label: 'Ver Ferramentas (Aluno)', url: '/ferramentas', variant: 'blue' }
    ]
  },
  {
    id: 8,
    title: 'O HUB para o Professor / Pesquisador',
    subtitle: 'Ponte direta entre laboratórios de ponta e novos talentos acadêmicos',
    category: 'PERSONA | PROFESSOR & PESQUISADOR',
    description: 'Solução para a captação de orientandos, divulgação de linhas de pesquisa e mitigação do afastamento geracional.',
    accentColor: 'red',
    highlights: [
      'Captação de Iniciação Científica: Publicação de vagas no Match Acadêmico com recebimento estruturado de cartas de interesse.',
      'Vitrine de Linhas de Pesquisa: Divulgação acessível dos laboratórios do IFUSP para novos estudantes.',
      'Arena de Desafios & Anotações: Proposição de problemas científicos e desafios instigantes para a comunidade.',
      'Mitigação do Abismo Geracional: Canal moderno e aberto que aproxima pesquisadores seniores dos calouros.'
    ],
    notes: [
      'Destacar a dor real dos professores que não encontram alunos qualificados para IC.',
      'Explicar como o Match Acadêmico agiliza o primeiro contato sem burocracia.'
    ],
    links: [
      { label: 'Observatório de Pesquisa', url: '/arena', variant: 'red' },
      { label: 'Match Acadêmico', url: '/ferramentas/match', variant: 'yellow' }
    ]
  },
  {
    id: 9,
    title: 'O HUB para o Curioso (Sociedade)',
    subtitle: 'Democratização do saber e desmistificação da Universidade Pública',
    category: 'PERSONA | CURIOSO & SOCIEDADE',
    description: 'Porta de entrada acolhedora para vestibulandos, familiares e a comunidade externa.',
    accentColor: 'yellow',
    highlights: [
      'Porta de Entrada Desmistificada: Guias para vestibulares (FUVEST, ENEM-USP, Provão Paulista, Olimpíadas) e Dicas IFUSP 101.',
      'Constelações de Mundos: Tradução cultural de jargões usando analogias com Artes, Jogos, Pop e Computação.',
      'Acesso Livre sem Barreiras: Navegação aberta no conteúdo público sem necessidade de cadastro ou aplicativo instalado.',
      'Combate à Desinformação: Conexão humana e direta com cientistas e pesquisadores em formação.'
    ],
    notes: [
      'Mostrar que a universidade pública pertence à sociedade e deve ser compreensível para todos.',
      'Explicar que o curioso de hoje é o futuro aluno ou apoiador da ciência amanhã.'
    ],
    links: [
      { label: 'Guia de Ingresso', url: '/ingresso', variant: 'yellow' },
      { label: 'Pergunte a um Cientista', url: '/interacao?tab=perguntas', variant: 'blue' }
    ]
  },
  {
    id: 10,
    title: 'O HUB para o Aluno (Graduação e Pós)',
    subtitle: 'Suporte integral à permanência discente e combate à evasão acadêmica',
    category: 'PERSONA | ALUNO & PERMANÊNCIA',
    description: 'Ferramentas de gestão de tempo, acompanhamento curricular e integração comunitária.',
    accentColor: 'blue',
    highlights: [
      'Grade Horária Balanceada (1h:1h): Cronograma semanal que vincula 1h de estudo para cada 1h de aula e alerta sobre faltas.',
      'Trilhas de Aprendizagem: Visualização gráfica de matérias concluídas e pré-requisitos com sincronização JúpiterWeb.',
      'Match Acadêmico & Adoção: Localização de orientadores para IC e programa de acolhimento de calouros por veteranos.',
      'Ambiente Seguro & Humanizado: Troca de vivências nos Logs, grupos de estudo e apoio a alunos neurodivergentes (CIPs).'
    ],
    notes: [
      'Enfatizar o combate à evasão: o aluno que planeja seu estudo e se sente parte de uma rede não desiste do curso.',
      'Concluir a apresentação mostrando como o ecossistema fecha o ciclo completo de comunicação e permanência.'
    ],
    links: [
      { label: 'Grade Horária (1h:1h)', url: '/ferramentas', variant: 'yellow' },
      { label: 'Trilhas do Curso', url: '/ferramentas/trilhas', variant: 'blue' },
      { label: 'Match Acadêmico', url: '/ferramentas/match', variant: 'red' }
    ]
  }
];

export function ReuniaoSlideViewer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const currentSlide = REUNIAO_SLIDES[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < REUNIAO_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const renderButtonLink = (link: SlideLink, index: number) => {
    const isExternal = link.url.startsWith('http');
    const colorClasses = {
      yellow: 'bg-[#FFCC00] text-black hover:bg-[#e6b800] shadow-md shadow-brand-yellow/30 font-black',
      blue: 'bg-[#0F4780] text-white hover:bg-[#0c3866] shadow-md shadow-brand-blue/40 border border-brand-blue/50 font-black',
      red: 'bg-[#F14343] text-white hover:bg-[#d63838] shadow-md shadow-brand-red/40 border border-brand-red/50 font-black',
      green: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md border border-emerald-500 font-black',
      outline: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 font-bold'
    }[link.variant || 'yellow'];

    return (
      <a
        key={index}
        href={link.url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : ''}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 ${colorClasses}`}
      >
        {link.label.includes('PlayStore') ? (
          <Smartphone className="w-3.5 h-3.5 shrink-0 text-brand-yellow" />
        ) : link.label.includes('WebApp') ? (
          <Globe className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{link.label}</span>
      </a>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Info - Standard IDV LabDiv Glass Card */}
      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-[#1E1E1E]/90">
        {/* Top 3 Brand Color Accent Lines */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-[#FFCC00]"></div>
          <div className="w-1/3 bg-[#0F4780]"></div>
          <div className="w-1/3 bg-[#F14343]"></div>
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-blue/20 text-brand-blue-accent text-xs font-black uppercase tracking-wider mb-2 border border-brand-blue/40">
            <Presentation className="w-4 h-4 text-brand-yellow" />
            Apresentação de Reunião (10 Slides em Tópicos)
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-bukra text-white tracking-tight uppercase">
            HUB LabDiv • Apresentação Institucional
          </h2>
          <p className="text-xs md:text-sm text-gray-300 mt-1 font-medium">
            Roteiro direto em tópicos: Do Laboratório de Divulgação (IFUSP) aos 3 Eixos e Perfis de Usuário
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="/presentation/Apresentação do HUB.pptx"
            download="Apresentação do HUB.pptx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-yellow hover:bg-[#e6b800] text-black font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg font-bukra"
            title="Baixar Apresentação em PowerPoint (.pptx)"
          >
            <Download className="w-4 h-4" />
            Baixar PPTX
          </a>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-blue/50 hover:bg-brand-blue/80 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all hover:scale-105 active:scale-95 shadow-md font-bukra"
            title="Apresentar em Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-brand-yellow" /> : <Maximize2 className="w-4 h-4 text-brand-yellow" />}
            {isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center group ${
          isFullscreen 
            ? 'h-screen p-6 rounded-none border-none bg-[#09090B] bg-[url("/bg-if.svg")] bg-repeat bg-center' 
            : 'aspect-video min-h-[460px] max-h-[750px] bg-[#121212] border border-white/15'
        }`}
      >
        {/* Top 3 Brand Colors Bar on Canvas Frame */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
          <div className="w-1/3 bg-[#FFCC00]"></div>
          <div className="w-1/3 bg-[#0F4780]"></div>
          <div className="w-1/3 bg-[#F14343]"></div>
        </div>

        {/* Slide Canvas Inner Area */}
        <div className="relative z-10 w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-y-auto pt-7">
          
          {/* Top Bar inside Slide Frame */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider border shadow-md font-bukra ${
                currentSlide.accentColor === 'red' 
                  ? 'bg-brand-red/20 text-brand-red border-brand-red/40' 
                  : currentSlide.accentColor === 'yellow' 
                  ? 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/40' 
                  : 'bg-brand-blue/30 text-brand-blue-accent border-brand-blue/50'
              }`}>
                {currentSlide.category}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-300 hidden sm:inline-block font-bukra">
                HUB LABDIV • IFUSP
              </span>
            </div>

            {/* 3 Brand Colors Dots Badge & Slide Counter */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]" title="Amarelo LabDiv"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F4780]" title="Azul LabDiv"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#F14343]" title="Vermelho LabDiv"></div>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-black/80 border border-white/20 text-xs font-black text-brand-yellow tracking-wider shadow-lg font-bukra">
                SLIDE {currentSlide.id} / {REUNIAO_SLIDES.length}
              </div>
            </div>
          </div>

          {/* SLIDE CONTENT RENDERER */}
          <div className="my-auto w-full max-w-5xl mx-auto py-2">
            
            {/* Header Area of the Slide */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex-1 text-left">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic font-bukra mb-2">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-base sm:text-lg font-bold text-brand-yellow">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Logo Badge on Slide 1: LabDiv Oficial */}
              {currentSlide.isLabDivIntro && (
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-brand-yellow/60 shadow-2xl shrink-0 flex items-center justify-center self-center md:self-auto bg-[#0F4780] p-1">
                  <Image
                    src="/bd_Labdiv.png"
                    alt="Logo Oficial LabDiv • IFUSP"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              )}

              {/* Logo Badge on Slide 2: Super App HUB */}
              {currentSlide.id === 2 && (
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-3xl bg-white p-3 border-2 border-brand-yellow/60 shadow-2xl shrink-0 flex items-center justify-center self-center md:self-auto">
                  <Image
                    src="/icone-HUBLabDiv-white.png"
                    alt="Logo Oficial HUB LabDiv"
                    fill
                    className="object-contain p-2"
                    priority
                  />
                </div>
              )}
            </div>

            {/* SLIDE 3: 3 Eixos Cards Tricolores */}
            {currentSlide.isThreeAxes ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left my-2">
                <div className="glass-card p-5 rounded-2xl border-2 border-brand-blue/60 bg-gradient-to-b from-brand-blue/20 to-black/80 shadow-xl flex flex-col justify-between hover:scale-102 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/30 border border-brand-blue/60 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-brand-blue-accent" />
                    </div>
                    <h4 className="text-lg font-black text-white font-bukra mb-1">1. Eixo Social</h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-blue/30 text-brand-blue-accent text-[11px] font-black uppercase mb-3 border border-brand-blue/50">
                      AZUL #0F4780
                    </span>
                    <ul className="text-xs text-gray-200 space-y-1.5 font-medium">
                      <li>• Feed Fluxo (dialógico)</li>
                      <li>• Registros (vivências)</li>
                      <li>• Galeria de Artes &amp; Poemas</li>
                    </ul>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border-2 border-brand-red/60 bg-gradient-to-b from-brand-red/20 to-black/80 shadow-xl flex flex-col justify-between hover:scale-102 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-red/20 border border-brand-red/50 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-brand-red" />
                    </div>
                    <h4 className="text-lg font-black text-white font-bukra mb-1">2. Eixo Informativo</h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red text-[11px] font-black uppercase mb-3 border border-brand-red/40">
                      VERMELHO #F14343
                    </span>
                    <ul className="text-xs text-gray-200 space-y-1.5 font-medium">
                      <li>• Wiki CGIF centralizada</li>
                      <li>• Mural de Oportunidades &amp; PUB</li>
                      <li>• Espaços, Mapa &amp; QR Codes</li>
                    </ul>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border-2 border-brand-yellow/60 bg-gradient-to-b from-brand-yellow/15 to-black/80 shadow-xl flex flex-col justify-between hover:scale-102 transition-all">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 border border-brand-yellow/50 flex items-center justify-center mb-3">
                      <Wrench className="w-5 h-5 text-brand-yellow" />
                    </div>
                    <h4 className="text-lg font-black text-white font-bukra mb-1">3. Eixo Ferramentas</h4>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-[11px] font-black uppercase mb-3 border border-brand-yellow/40">
                      AMARELO #FFCC00
                    </span>
                    <ul className="text-xs text-gray-200 space-y-1.5 font-medium">
                      <li>• Grade Horária 1h:1h</li>
                      <li>• Trilhas de disciplinas Júpiter</li>
                      <li>• Match Acadêmico &amp; Vagas IC</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : currentSlide.isPersonasOverview ? (
              /* SLIDE 7: 3 Separações de Ferramentas */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left my-2">
                <div className="glass-card p-5 rounded-2xl border-2 border-brand-red/60 bg-black/80 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Microscope className="w-5 h-5 text-brand-red" />
                      <h4 className="text-base font-black text-white font-bukra">Professor</h4>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-red/20 text-brand-red text-[10px] font-black uppercase mb-3 border border-brand-red/40">
                      /arena
                    </span>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      Observatório de pesquisa, arena de desafios científicos e captação de orientandos no Match.
                    </p>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border-2 border-brand-yellow/60 bg-black/80 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Compass className="w-5 h-5 text-brand-yellow" />
                      <h4 className="text-base font-black text-white font-bukra">Curioso</h4>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-[10px] font-black uppercase mb-3 border border-brand-yellow/40">
                      /ingresso
                    </span>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      Guia de vestibulares (FUVEST/ENEM/Provão), Dicas 101 e tradução por Constelações de Mundos.
                    </p>
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border-2 border-brand-blue/60 bg-black/80 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-brand-blue-accent" />
                      <h4 className="text-base font-black text-white font-bukra">Aluno</h4>
                    </div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-brand-blue/30 text-brand-blue-accent text-[10px] font-black uppercase mb-3 border border-brand-blue/50">
                      /ferramentas
                    </span>
                    <p className="text-xs text-gray-200 font-medium leading-relaxed">
                      Grade 1h:1h, controle de faltas, trilhas com JúpiterWeb e busca de IC ou grupos de estudo.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Topics / Bullet Points Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left my-2">
                {currentSlide.highlights.map((item, idx) => {
                  const colorBorder = idx % 3 === 0 
                    ? 'border-brand-yellow/50' 
                    : idx % 3 === 1 
                    ? 'border-brand-blue/50' 
                    : 'border-brand-red/50';
                  const colorIcon = idx % 3 === 0 
                    ? 'text-brand-yellow' 
                    : idx % 3 === 1 
                    ? 'text-brand-blue-accent' 
                    : 'text-brand-red';

                  return (
                    <div 
                      key={idx} 
                      className={`glass-card p-4 sm:p-5 rounded-2xl border ${colorBorder} bg-black/60 shadow-lg flex items-start gap-3.5 hover:scale-101 transition-all`}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${colorIcon} shrink-0 mt-0.5`} />
                      <span className="text-xs sm:text-sm font-semibold text-gray-200 leading-relaxed font-sans">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Bottom Action Bar inside Slide Frame */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/15">
            <p className="text-xs text-gray-400 font-medium max-w-xl line-clamp-1 text-left">
              {currentSlide.description}
            </p>

            {/* Clickable Action Link Buttons */}
            {currentSlide.links && currentSlide.links.length > 0 && (
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            )}
          </div>

        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`absolute left-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={goToNext}
          disabled={currentIndex === REUNIAO_SLIDES.length - 1}
          className={`absolute right-3 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === REUNIAO_SLIDES.length - 1 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails Carousel Bar */}
      <div className="glass-card p-4 rounded-3xl border-white/10 bg-[#1E1E1E]/80">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2 font-bukra">
            <Presentation className="w-4 h-4 text-brand-yellow" />
            Navegação Rápida (10 Slides da Reunião)
          </span>
          <span className="text-xs text-brand-yellow font-bold font-bukra">
            Slide {currentIndex + 1} de {REUNIAO_SLIDES.length}
          </span>
        </div>

        <div 
          ref={thumbsRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-yellow/30"
        >
          {REUNIAO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                  isActive 
                    ? 'border-brand-yellow scale-105 shadow-lg shadow-brand-yellow/30' 
                    : 'border-white/15 hover:border-white/40 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-[#1E1E1E] to-black p-2 flex flex-col justify-between text-left">
                  <span className="text-[9px] font-black text-brand-yellow uppercase tracking-wider line-clamp-1 font-bukra">
                    {slide.category.split('|')[0] || slide.category}
                  </span>
                  <span className="text-[10px] font-bold text-white line-clamp-2 leading-tight font-bukra">
                    {slide.title}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                <div className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-bold ${isActive ? 'text-brand-yellow' : 'text-white'}`}>
                  {slide.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Details & Presenter Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border-white/10 bg-[#1E1E1E]/80">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-yellow mb-3 flex items-center gap-2 font-bukra">
            <BookOpen className="w-4 h-4" />
            Resumo do Tópico de Fala
          </h3>
          <p className="text-gray-200 font-medium text-sm leading-relaxed mb-4">
            {currentSlide.description}
          </p>

          {currentSlide.links && currentSlide.links.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 font-bukra">
                Ações e Acessos Diretos no HUB:
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-3xl border-white/10 bg-[#1E1E1E]/80">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue-accent mb-3 flex items-center gap-2 font-bukra">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            Dicas para a Fala (Ao Vivo)
          </h3>
          {currentSlide.notes && currentSlide.notes.length > 0 ? (
            <ul className="space-y-2">
              {currentSlide.notes.map((note, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-brand-yellow font-bold text-sm">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400 italic">Sem notas adicionais para este slide.</p>
          )}
        </div>
      </div>

    </div>
  );
}
