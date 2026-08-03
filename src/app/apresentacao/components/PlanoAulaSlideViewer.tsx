'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  BookOpen, 
  GraduationCap,
  ExternalLink,
  Presentation,
  ZoomIn,
  X,
  FileText,
  Code,
  Layers,
  Clock,
  CheckCircle2,
  Send,
  Compass
} from 'lucide-react';

export interface SlideLink {
  label: string;
  url: string;
  variant?: 'yellow' | 'blue' | 'red' | 'outline';
}

export interface BookPageImage {
  src: string;
  title: string;
}

export interface SlideItem {
  id: number;
  title: string;
  category: string;
  subtitle?: string;
  description: string;
  bookImages?: BookPageImage[];
  highlights?: string[];
  timeline?: { time: string; phase: string; details: string }[];
  notes?: string[];
  links?: SlideLink[];
}

export const PLANO_AULA_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Processos Criativos: Fotografia, Webdesign e o HUB LabDiv',
    subtitle: 'Comunicação vs. Extensão na Prática do Caderno do Artista',
    category: 'Abertura',
    description: 'Apresentação da proposta pedagógica e do contexto do HUB LabDiv no IF-USP para o desenvolvimento do Caderno do Artista.',
    notes: [
      'Apresentar a proposta da aula e o contexto do HUB LabDiv no IF-USP.',
      'Contextualizar a prática do Caderno do Artista na divulgação científica.'
    ],
    links: [
      { label: 'Baixar Apresentação (.pptx)', url: '/Plano de Aula - HUB LabDiv.pptx', variant: 'yellow' },
      { label: 'Baixar Plano de Aula (.pdf)', url: '/Plano de Aula - HUB LabDiv.pdf', variant: 'blue' }
    ]
  },
  {
    id: 2,
    title: 'Objetivos da Aula (120 Minutos)',
    category: 'Diretrizes',
    description: 'Objetivo Geral e Objetivos Específicos para a oficina prática e teórica de 2 horas no IF-USP.',
    highlights: [
      'Objetivo Geral: Estimular a expressão criativa através da fotografia e do webdesign, abordar o dilema Comunicação x Extensão e apresentar o HUB LabDiv.',
      'Aplicar o questionário piloto de pesquisa (Mapeamento de perfil & Termo de Aceite).',
      'Diferenciar conceitualmente "Comunicação" de "Divulgação" com base em Paulo Freire.',
      'Demonstrar a aplicação prática da plataforma através de um post ao vivo.',
      'Garantir que os alunos acessem o sistema e submetam um "post teste" com sucesso.'
    ],
    notes: [
      'Destacar o questionário inicial e a reflexão teórica com Paulo Freire.',
      'Explicar o objetivo final: submissão do primeiro post teste por cada aluno.'
    ]
  },
  {
    id: 3,
    title: 'Cronograma Detalhado da Aula',
    category: 'Planejamento',
    description: 'Divisão estratégica das 5 fases dos 120 minutos da oficina prática.',
    timeline: [
      { time: '00:00 - 00:10 (10 min)', phase: 'Aplicação do Questionário', details: 'Projeção do QR Code e formulário de pesquisa para mapeamento de perfil e aceite.' },
      { time: '00:10 - 00:35 (25 min)', phase: 'Webdesign & Fotografia', details: 'Apresentação de portfólio autoral, celular como ferramenta e introdução ao HTML/CSS.' },
      { time: '00:35 - 01:00 (25 min)', phase: 'Base Teórica (Paulo Freire)', details: 'Leitura de 5 trechos do livro "Extensão ou Comunicação?" e fundamentação do HUB.' },
      { time: '01:00 - 01:15 (15 min)', phase: 'Demonstração ao Vivo', details: 'Navegação pela interface do HUB LabDiv e criação de um post do zero ao vivo.' },
      { time: '01:15 - 02:00 (45 min)', phase: 'Execução Hands-on', details: 'Alunos criam e enviam o primeiro post teste no sistema com mediação técnica.' }
    ],
    notes: [
      '10 min: Questionário | 25 min: Webdesign & Foto | 25 min: Teoria',
      '15 min: Demonstração ao vivo | 45 min: Hands-on prático'
    ]
  },
  {
    id: 4,
    title: 'Fotografia & Olhar Criativo no Celular',
    category: 'Expressão Visual',
    description: 'O smartphone como ferramenta de observação e portfólio autoral. Fotografia prática para encarar o mundo de outra forma.',
    bookImages: [
      { src: '/presentation/slides/image1.png', title: 'Fotografia no Celular (Exemplo 1)' },
      { src: '/presentation/slides/image2.png', title: 'Fotografia no Celular (Exemplo 2)' }
    ],
    notes: [
      'Eliminar a barreira do equipamento: focar na composição e narrativa.',
      'Apresentação da referência do portfólio autoral.',
      'Fotografia de celular como ponto de partida para o Caderno do Artista.'
    ],
    links: [
      { label: 'Acessar aurtistic.vercel.app', url: 'https://aurtistic.vercel.app', variant: 'yellow' }
    ]
  },
  {
    id: 5,
    title: 'Webdesign & Código Interativo',
    category: 'Design Programado',
    description: 'HTML & CSS no CodePen como pincel digital e atmosfera. Estruturar documento simples em HTML e transformá-lo com CSS.',
    highlights: [
      'Programação aplicada aos conceitos de design visual.',
      'Em vez de pincel digital tradicional, a atmosfera é construída com código.',
      'Prática no CodePen: alteração de estrutura HTML e aplicação de estilos CSS ao vivo.',
      'Visualização do documento de texto simples se transformando em interface atrativa.'
    ],
    notes: [
      'Diferença entre arte estática e código dinâmico.',
      'Prática rápida ao vivo alterando a estética com poucas linhas de CSS.'
    ],
    links: [
      { label: 'Abrir CodePen.io', url: 'https://codepen.io', variant: 'blue' }
    ]
  },
  {
    id: 6,
    title: 'Base Teórica: Paulo Freire',
    category: 'Fundamentação',
    description: 'Introdução do dilema entre Extensão e Comunicação na obra de Paulo Freire.',
    bookImages: [
      { src: '/presentation/slides/image3.png', title: 'Foto da Capa / Trechos do Livro' }
    ],
    notes: [
      'Leitura selecionada de 5 trechos do livro "Extensão ou Comunicação?".',
      'Como a visão de Freire fundamenta a arquitetura do HUB LabDiv.',
      'Download da obra em PDF via Google Drive.'
    ],
    links: [
      { label: 'Abrir Livro no Google Drive (PDF)', url: 'https://drive.google.com/file/d/174F6wwMh3Qlm4wNybR1y16VFcqnFaK6M/view?usp=sharing', variant: 'red' }
    ]
  },
  {
    id: 7,
    title: 'Paulo Freire: A Crítica à Extensão (Pág. 12)',
    category: 'Teoria Freiriana',
    description: 'Foto da Página 12 do Livro: A crítica à transmissão descontextualizada e à divulgação passiva. Análise do termo extensão.',
    bookImages: [
      { src: '/presentation/slides/image3.png', title: 'Foto da Página 12 do Livro' }
    ],
    notes: [
      'O pesquisador ou aluno apenas transmite aquele objeto a alguém fora da universidade, separando-o de seu contexto.',
      'Não deixa o público assumir um papel ativo.',
      'Priva o divulgador de saber como o conteúdo foi compreendido.'
    ],
    links: [
      { label: 'Abrir Livro no Google Drive (Pág. 12)', url: 'https://drive.google.com/file/d/174F6wwMh3Qlm4wNybR1y16VFcqnFaK6M/view?usp=sharing', variant: 'red' }
    ]
  },
  {
    id: 8,
    title: 'Paulo Freire: Divulgar vs. Comunicar (Pág. 35)',
    category: 'Teoria Freiriana',
    description: 'Foto da Página 35 do Livro: Quadro comparativo entre Divulgar (A SOBRE B) e Comunicar (COM A SOBRE B).',
    bookImages: [
      { src: '/presentation/slides/image4.png', title: 'Foto da Página 35 do Livro' }
    ],
    notes: [
      'Divulgar: relação depositária e unilateral.',
      'Comunicar: relação dialógica de co-construção de significado.',
      'Diferença fundamental entre estender um conteúdo e comunicar verdadeiramente.'
    ],
    links: [
      { label: 'Abrir Livro no Google Drive (Pág. 35)', url: 'https://drive.google.com/file/d/174F6wwMh3Qlm4wNybR1y16VFcqnFaK6M/view?usp=sharing', variant: 'red' }
    ]
  },
  {
    id: 9,
    title: 'Paulo Freire: Pensar a Realidade (Págs. 48 & 50)',
    category: 'Teoria Freiriana',
    description: 'Fotos das Páginas 48 e 50 do Livro: Pensar a realidade do objeto e a capacidade transformadora.',
    bookImages: [
      { src: '/presentation/slides/image5.png', title: 'Foto da Página 48' },
      { src: '/presentation/slides/image6.png', title: 'Foto da Página 50' }
    ],
    notes: [
      'Pág. 48: Pensar sobre aquele objeto é pensar na realidade daquele objeto em questão.',
      'Pág. 50: Aborda a capacidade transformadora da realidade quando entendido o conceito no contexto homem-homem ou homem-mundo.',
      'O conhecimento autêntico transforma a realidade dos sujeitos.'
    ],
    links: [
      { label: 'Abrir Livro no Google Drive (Págs. 48 & 50)', url: 'https://drive.google.com/file/d/174F6wwMh3Qlm4wNybR1y16VFcqnFaK6M/view?usp=sharing', variant: 'red' }
    ]
  },
  {
    id: 10,
    title: 'Paulo Freire: Práxis & Caderno do Artista (Pág. 52)',
    category: 'Teoria Freiriana',
    description: 'Foto da Página 52 do Livro: A importância da práxis e o Caderno do Artista.',
    bookImages: [
      { src: '/presentation/slides/image7.png', title: 'Foto da Página 52 do Livro' }
    ],
    notes: [
      'Por que a capacidade de transformação é fundamental.',
      'O aluno deixa de ser espectador para se tornar sujeito comunicador.',
      'O Caderno do Artista como registro vivo da caminhada científica e artística.'
    ],
    links: [
      { label: 'Abrir Livro no Google Drive (Pág. 52)', url: 'https://drive.google.com/file/d/174F6wwMh3Qlm4wNybR1y16VFcqnFaK6M/view?usp=sharing', variant: 'red' }
    ]
  },
  {
    id: 11,
    title: 'Demonstração ao Vivo da Plataforma HUB',
    category: 'Prática Guiada',
    description: 'Criação de uma postagem espontânea do zero ao vivo na plataforma HUB LabDiv.',
    highlights: [
      'Exibição da interface completa do HUB de Comunicação Científica.',
      'Upload de fotografia e estruturação do raciocínio criativo.',
      'Redação reflexiva do texto do Caderno do Artista.',
      'Publicação ao vivo e verificação do feed interativo.'
    ],
    notes: [
      'Exibir navegação, upload de foto, redação reflexiva e publicação ao vivo.'
    ],
    links: [
      { label: 'Criar Post no HUB', url: '/enviar', variant: 'yellow' }
    ]
  },
  {
    id: 12,
    title: 'Execução Hands-On pelos Alunos (45 min)',
    category: 'Prática Alunos',
    description: 'Momento prático onde todos os alunos acessam o HUB para criar e enviar seu primeiro post teste.',
    highlights: [
      'Acesso individual dos estudantes ao sistema HUB LabDiv.',
      'Seleção de imagem autoral ou registro do processo de aula.',
      'Redação de legenda reflexiva relacionando ciência e arte.',
      'Suporte técnico de interface e mediação pedagógica contínua em sala.'
    ],
    notes: [
      'Suporte técnico de interface e mediação pedagógica em sala.'
    ],
    links: [
      { label: 'Ir para Área de Envio', url: '/enviar', variant: 'yellow' }
    ]
  },
  {
    id: 13,
    title: 'Encerramento & Diálogo Reflexivo',
    category: 'Finalização',
    description: 'Discussão final, acolhimento de dúvidas e convite à continuidade dos Cadernos do Artista no HUB LabDiv.',
    highlights: [
      'Reflexão coletiva sobre a experiência de publicar na plataforma.',
      'Esclarecimento de dúvidas sobre webdesign, fotografia e teoria freiriana.',
      'Convite para manter postagens regulares durante o semestre letivo.'
    ],
    notes: [
      'Abertura para perguntas dos alunos e convite à continuidade dos cadernos.'
    ],
    links: [
      { label: 'Explorar Galeria HUB', url: '/explorar', variant: 'blue' }
    ]
  }
];

export function PlanoAulaSlideViewer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [activeSubImageIndex, setActiveSubImageIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const currentSlide = PLANO_AULA_SLIDES[currentIndex];

  useEffect(() => {
    setActiveSubImageIndex(0);
  }, [currentIndex]);

  const activeImageSrc = currentSlide.bookImages && currentSlide.bookImages.length > 0
    ? currentSlide.bookImages[activeSubImageIndex]?.src
    : null;

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < PLANO_AULA_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && lightboxImage) {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, lightboxImage]);

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
      yellow: 'bg-[#FFCC00] text-black hover:bg-[#e6b800] shadow-md shadow-brand-yellow/30',
      blue: 'bg-[#0F4780] text-white hover:bg-[#0c3866] shadow-md shadow-brand-blue/40 border border-brand-blue/50',
      red: 'bg-[#F14343] text-white hover:bg-[#d63838] shadow-md shadow-brand-red/40 border border-brand-red/50',
      outline: 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
    }[link.variant || 'yellow'];

    return (
      <a
        key={index}
        href={link.url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : ''}
        className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 ${colorClasses}`}
      >
        {link.url.includes('drive.google.com') ? (
          <FileText className="w-4 h-4 shrink-0" />
        ) : link.url.includes('codepen') ? (
          <Code className="w-4 h-4 shrink-0" />
        ) : (
          <ExternalLink className="w-4 h-4 shrink-0" />
        )}
        <span>{link.label}</span>
      </a>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Info - Standard site glass-card */}
      <div className="glass-card p-6 rounded-3xl border-brand-yellow/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2 border border-brand-yellow/30">
            <GraduationCap className="w-4 h-4" />
            Plano de Aula: Processos Criativos & Paulo Freire
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Apresentação Interativa em Slides (16:9)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Fotografia, Webdesign, Fotos das Páginas do Livro & Plataforma HUB LabDiv
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/Plano de Aula - HUB LabDiv.pptx"
            download="Plano de Aula - HUB LabDiv.pptx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-blue/30 hover:bg-brand-blue/60 text-brand-yellow font-bold text-xs uppercase tracking-wider border border-brand-yellow/30 transition-all hover:scale-105 active:scale-95 shadow-lg"
            title="Baixar arquivo PowerPoint (.pptx)"
          >
            <Download className="w-4 h-4" />
            Baixar PPTX
          </a>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Apresentar em Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-brand-yellow" /> : <Maximize2 className="w-4 h-4 text-brand-yellow" />}
            {isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
          </button>
        </div>
      </div>

      {/* Main Slide Canvas - Transparent background allowing bg-if.svg site background to shine through */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden bg-transparent border border-white/15 shadow-2xl flex flex-col items-center justify-center group ${
          isFullscreen ? 'h-screen p-4 rounded-none border-none bg-black/90' : 'aspect-video max-h-[750px]'
        }`}
      >
        {/* Slide Canvas Inner Area */}
        <div className="relative z-10 w-full h-full p-6 sm:p-10 flex flex-col justify-between overflow-y-auto">
          
          {/* Top Bar inside Slide Frame */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-brand-blue/80 text-brand-yellow font-black text-xs uppercase tracking-wider border border-brand-yellow/30 shadow-md">
                {currentSlide.category}
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-gray-400 hidden sm:inline-block">
                HUB LabDiv • IFUSP
              </span>
            </div>

            {/* Slide Counter */}
            <div className="px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 text-xs font-black text-brand-yellow tracking-wider shadow-lg">
              SLIDE {currentSlide.id} / {PLANO_AULA_SLIDES.length}
            </div>
          </div>

          {/* SLIDE CONTENT RENDERER */}
          <div className="my-auto w-full max-w-4xl mx-auto py-2">
            
            {/* If slide has Book Page Photos (Slides 4, 6, 7, 8, 9, 10) */}
            {activeImageSrc ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <h3 className="text-2xl md:text-3xl font-extrabold text-white text-center tracking-tight mb-1">
                  {currentSlide.title}
                </h3>
                
                {/* Book Page Selector Tabs (if multiple images) */}
                {currentSlide.bookImages && currentSlide.bookImages.length > 1 && (
                  <div className="glass-card flex items-center gap-2 p-1.5 rounded-2xl border border-brand-yellow/40 shadow-xl">
                    <span className="text-[11px] font-black uppercase text-brand-yellow px-2 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5" />
                      Páginas:
                    </span>
                    {currentSlide.bookImages.map((img, subIdx) => (
                      <button
                        key={subIdx}
                        onClick={() => setActiveSubImageIndex(subIdx)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          activeSubImageIndex === subIdx
                            ? 'bg-brand-yellow text-black shadow'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {img.title}
                      </button>
                    ))}
                  </div>
                )}

                {/* Framed Image Display Card */}
                <div className="glass-card relative w-full max-w-2xl h-[320px] md:h-[380px] rounded-2xl overflow-hidden border-2 border-brand-yellow/40 shadow-2xl p-2 group/img">
                  <Image
                    src={activeImageSrc}
                    alt={currentSlide.title}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 800px"
                    className="object-contain p-2"
                  />
                  <button
                    onClick={() => setLightboxImage({
                      src: activeImageSrc,
                      title: currentSlide.bookImages && currentSlide.bookImages.length > 0
                        ? currentSlide.bookImages[activeSubImageIndex]?.title || currentSlide.title
                        : currentSlide.title
                    })}
                    className="absolute top-3 right-3 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 hover:bg-brand-yellow hover:text-black border border-white/20 text-xs font-bold text-white transition-all hover:scale-105 shadow-xl"
                    title="Ampliar foto da página em alta resolução"
                  >
                    <ZoomIn className="w-4 h-4" />
                    <span>Ampliar Foto</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Native Dynamic Slide Layouts (Slides 1, 2, 3, 5, 11, 12, 13) */
              <div className="flex flex-col gap-6 text-left">
                <div>
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight uppercase italic mb-3">
                    {currentSlide.title}
                  </h3>
                  {currentSlide.subtitle && (
                    <p className="text-lg md:text-xl font-bold text-brand-yellow">
                      {currentSlide.subtitle}
                    </p>
                  )}
                </div>

                {/* Highlight Bullet List - Standard glass-cards inside slide */}
                {currentSlide.highlights && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
                    {currentSlide.highlights.map((item, idx) => (
                      <div key={idx} className="glass-card p-4 md:p-5 rounded-2xl border border-white/15 shadow-lg flex items-start gap-3.5 hover:border-brand-yellow/30 transition-all">
                        <CheckCircle2 className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                        <span className="text-sm font-semibold text-gray-200 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Timeline Layout for Cronograma - Standard glass-cards inside slide */}
                {currentSlide.timeline && (
                  <div className="space-y-3.5 my-2">
                    {currentSlide.timeline.map((step, idx) => (
                      <div key={idx} className="glass-card p-4 rounded-2xl border border-white/15 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand-yellow/40 transition-all">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1.5 rounded-xl bg-brand-yellow/15 text-brand-yellow font-black text-xs shrink-0 flex items-center gap-1.5 border border-brand-yellow/30">
                            <Clock className="w-3.5 h-3.5" />
                            {step.time}
                          </span>
                          <span className="text-white font-extrabold text-sm">{step.phase}</span>
                        </div>
                        <span className="text-xs text-gray-300 font-medium sm:text-right">{step.details}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Bottom Action Bar inside Slide Frame */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/15">
            <p className="text-xs text-gray-300 font-medium max-w-xl line-clamp-2 text-left">
              {currentSlide.description}
            </p>

            {/* Clickable Action Link Buttons */}
            {currentSlide.links && currentSlide.links.length > 0 && (
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            )}
          </div>

        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={goToNext}
          disabled={currentIndex === PLANO_AULA_SLIDES.length - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all ${
            currentIndex === PLANO_AULA_SLIDES.length - 1 
              ? 'opacity-20 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100 shadow-xl'
          }`}
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails Carousel Bar - Standard site glass-card */}
      <div className="glass-card p-4 rounded-3xl border-white/10">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Presentation className="w-4 h-4 text-brand-yellow" />
            Navegação por Miniaturas
          </span>
          <span className="text-xs text-brand-yellow font-bold">
            {currentIndex + 1} de {PLANO_AULA_SLIDES.length} selecionado
          </span>
        </div>

        <div 
          ref={thumbsRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-yellow/30"
        >
          {PLANO_AULA_SLIDES.map((slide, idx) => {
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
                {/* Thumbnail Preview */}
                {slide.bookImages && slide.bookImages.length > 0 ? (
                  <Image
                    src={slide.bookImages[0].src}
                    alt={slide.title}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-blue/80 to-black p-2 flex flex-col justify-between text-left">
                    <span className="text-[10px] font-black text-brand-yellow uppercase tracking-wider line-clamp-1">{slide.category}</span>
                    <span className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{slide.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                <div className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-bold ${isActive ? 'text-brand-yellow' : 'text-white'}`}>
                  {slide.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Details, Interactive Links & Teaching Notes - Standard site glass-cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description & Links Card */}
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-yellow mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Resumo do Slide & Fotos do Livro
          </h3>
          <p className="text-gray-200 font-medium text-base leading-relaxed mb-6">
            {currentSlide.description}
          </p>

          {/* Render Clickable Buttons */}
          {currentSlide.links && currentSlide.links.length > 0 && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">
                Links e Recursos Clicáveis:
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            </div>
          )}
        </div>

        {/* Teaching Notes Card */}
        <div className="glass-card p-6 rounded-3xl border-white/10">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue-accent mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            Notas de Aula
          </h3>
          {currentSlide.notes && currentSlide.notes.length > 0 ? (
            <ul className="space-y-2.5">
              {currentSlide.notes.map((note, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 leading-relaxed">
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

      {/* Lightbox / Zoom Modal for Book Page Photos */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center">
            {/* Modal Header */}
            <div className="w-full flex items-center justify-between p-4 bg-black/70 rounded-t-2xl border-b border-white/10">
              <span className="text-white font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-yellow" />
                {lightboxImage.title}
              </span>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Fechar visualização"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative w-full flex-1 bg-black/50 rounded-b-2xl overflow-hidden p-2 flex items-center justify-center">
              <Image
                src={lightboxImage.src}
                alt={lightboxImage.title}
                fill
                className="object-contain"
                sizes="(max-width: 1920px) 100vw, 1920px"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


