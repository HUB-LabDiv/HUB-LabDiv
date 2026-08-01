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
  Presentation
} from 'lucide-react';

export interface SlideItem {
  id: number;
  title: string;
  category: string;
  imageSrc: string;
  description: string;
  notes?: string[];
  link?: { label: string; url: string };
}

export const PLANO_AULA_SLIDES: SlideItem[] = [
  {
    id: 1,
    title: 'Capa da Apresentação',
    category: 'Abertura',
    imageSrc: '/presentation/slides/slide-01-capa.png',
    description: 'Processos Criativos: Fotografia, Webdesign e a Plataforma HUB LabDiv',
    notes: [
      'Apresentar a proposta da aula e o contexto do HUB LabDiv no IF-USP.',
      'Contextualizar a prática do Caderno do Artista na divulgação científica.'
    ]
  },
  {
    id: 2,
    title: 'Objetivos da Aula',
    category: 'Diretrizes',
    imageSrc: '/presentation/slides/slide-02-objetivos.png',
    description: 'Objetivo Geral e Objetivos Específicos para as 2 horas de aula',
    notes: [
      'Destacar o questionário inicial e a reflexão teórica com Paulo Freire.',
      'Explicar o objetivo final: submissão do primeiro post teste por cada aluno.'
    ]
  },
  {
    id: 3,
    title: 'Cronograma Detalhado',
    category: 'Planejamento',
    imageSrc: '/presentation/slides/slide-03-cronograma.png',
    description: 'Divisão em 5 fases dos 120 minutos da aula',
    notes: [
      '10 min: Questionário | 25 min: Webdesign & Foto | 25 min: Teoria',
      '15 min: Demonstração ao vivo | 45 min: Hands-on prático'
    ]
  },
  {
    id: 4,
    title: 'Fotografia & Olhar Criativo',
    category: 'Expressão Visual',
    imageSrc: '/presentation/slides/slide-04-fotografia.png',
    description: 'O smartphone como ferramenta de observação e portfólio autoral',
    notes: [
      'Eliminar a barreira do equipamento: focar na composição e narrativa.',
      'Apresentação da referência do portfólio autoral.'
    ],
    link: { label: 'Acessar aurtistic.vercel.app', url: 'https://aurtistic.vercel.app' }
  },
  {
    id: 5,
    title: 'Webdesign & Código Interativo',
    category: 'Design Programado',
    imageSrc: '/presentation/slides/slide-05-webdesign.png',
    description: 'HTML & CSS no CodePen como pincel digital e atmosfera',
    notes: [
      'Diferença entre arte estática e código dinâmico.',
      'Prática rápida ao vivo alterando a estética com poucas linhas de CSS.'
    ],
    link: { label: 'Abrir CodePen.io', url: 'https://codepen.io' }
  },
  {
    id: 6,
    title: 'Base Teórica: Paulo Freire',
    category: 'Fundamentação',
    imageSrc: '/presentation/slides/slide-06-teoria.png',
    description: 'Introdução do dilema entre Extensão e Comunicação',
    notes: [
      'Leitura selecionada de 5 trechos do livro "Extensão ou Comunicação?".',
      'Como a visão de Freire fundamenta a arquitetura do HUB LabDiv.'
    ]
  },
  {
    id: 7,
    title: 'Paulo Freire (Pág. 12)',
    category: 'Teoria Freiriana',
    imageSrc: '/presentation/slides/slide-07-freire-p12.png',
    description: 'A crítica à transmissão descontextualizada e divulgação passiva',
    notes: [
      'Quando o divulgador apenas "estende" o conteúdo sem escuta ativa.',
      'A falta de acompanhamento sobre como o público ressignifica o objeto.'
    ]
  },
  {
    id: 8,
    title: 'Paulo Freire (Pág. 35)',
    category: 'Teoria Freiriana',
    imageSrc: '/presentation/slides/slide-08-freire-p35.png',
    description: 'Quadro comparativo: Divulgar (A SOBRE B) vs. Comunicar (COM A SOBRE B)',
    notes: [
      'Divulgar: relação depositária e unilateral.',
      'Comunicar: relação dialógica de co-construção de significado.'
    ]
  },
  {
    id: 9,
    title: 'Paulo Freire (Págs. 48 & 50)',
    category: 'Teoria Freiriana',
    imageSrc: '/presentation/slides/slide-09-freire-p48-50.png',
    description: 'Pensar a realidade do objeto e a capacidade transformadora',
    notes: [
      'Pensar o objeto é entender seu contexto Homem-Homem e Homem-Mundo.',
      'O conhecimento autêntico transforma a realidade dos sujeitos.'
    ]
  },
  {
    id: 10,
    title: 'Paulo Freire (Pág. 52)',
    category: 'Teoria Freiriana',
    imageSrc: '/presentation/slides/slide-10-freire-p52.png',
    description: 'A importância da práxis e o Caderno do Artista',
    notes: [
      'O aluno deixa de ser espectador para se tornar sujeito comunicador.',
      'O Caderno do Artista como registro vivo da caminhada científica e artística.'
    ]
  },
  {
    id: 11,
    title: 'Demonstração ao Vivo',
    category: 'Prática Guiada',
    imageSrc: '/presentation/slides/slide-11-demonstracao.png',
    description: 'Criação de um post do zero ao vivo na plataforma HUB',
    notes: [
      'Exibir navegação, upload de foto, redação reflexiva e publicação ao vivo.'
    ]
  },
  {
    id: 12,
    title: 'Execução Hands-On (45 min)',
    category: 'Prática Alunos',
    imageSrc: '/presentation/slides/slide-12-handson.png',
    description: 'Alunos criam e enviam seu primeiro post no sistema',
    notes: [
      'Suporte técnico de interface e mediação pedagógica em sala.'
    ]
  },
  {
    id: 13,
    title: 'Encerramento & Diálogo',
    category: 'Finalização',
    imageSrc: '/presentation/slides/slide-13-encerramento.png',
    description: 'Discussão final, dúvidas e próximos passos no HUB LabDiv',
    notes: [
      'Abertura para perguntas dos alunos e convite à continuidade dos cadernos.'
    ]
  }
];

export function PlanoAulaSlideViewer() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const currentSlide = PLANO_AULA_SLIDES[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < PLANO_AULA_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Handle Fullscreen toggle
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

  // Scroll thumbnail into view when slide changes
  useEffect(() => {
    if (thumbsRef.current) {
      const activeThumb = thumbsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border-brand-yellow/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/10 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            Plano de Aula: Processos Criativos
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Apresentação Interativa em Slides (16:9)
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Fotografia, Webdesign, Paulo Freire & Plataforma HUB LabDiv
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="/Plano de Aula - HUB LabDiv.pptx"
            download="Plano de Aula - HUB LabDiv.pptx"
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-blue/30 hover:bg-brand-blue/50 text-brand-yellow font-bold text-xs uppercase tracking-wider border border-brand-blue/50 transition-all hover:scale-105 active:scale-95"
            title="Baixar arquivo PowerPoint (.pptx)"
          >
            <Download className="w-4 h-4" />
            Baixar PPTX
          </a>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-all hover:scale-105 active:scale-95"
            title="Apresentar em Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-brand-yellow" /> : <Maximize2 className="w-4 h-4 text-brand-yellow" />}
            {isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
          </button>
        </div>
      </div>

      {/* Main Slide Viewer Frame */}
      <div 
        ref={containerRef}
        className={`relative w-full rounded-3xl overflow-hidden bg-[#0A0A0A] border border-white/10 shadow-2xl flex flex-col items-center justify-center group ${
          isFullscreen ? 'h-screen p-4 rounded-none border-none' : 'aspect-video max-h-[750px]'
        }`}
      >
        {/* Current Slide Image */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          <Image
            src={currentSlide.imageSrc}
            alt={currentSlide.title}
            fill
            priority
            sizes="(max-width: 1920px) 100vw, 1920px"
            className="object-contain transition-opacity duration-300"
          />
        </div>

        {/* Left Arrow Navigation */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all ${
            currentIndex === 0 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100'
          }`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Navigation */}
        <button
          onClick={goToNext}
          disabled={currentIndex === PLANO_AULA_SLIDES.length - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-all ${
            currentIndex === PLANO_AULA_SLIDES.length - 1 
              ? 'opacity-30 cursor-not-allowed' 
              : 'hover:bg-brand-yellow hover:text-black hover:scale-110 opacity-80 group-hover:opacity-100'
          }`}
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Floating Slide Counter Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-xs font-black text-brand-yellow tracking-wider">
          SLIDE {currentSlide.id} / {PLANO_AULA_SLIDES.length}
        </div>

        {/* Floating Slide Title Overlay (bottom) */}
        <div className="absolute bottom-4 left-4 right-4 px-6 py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-blue/50 text-brand-yellow font-bold text-[11px] uppercase">
              {currentSlide.category}
            </span>
            <span className="text-white text-sm font-bold truncate">
              {currentSlide.title}
            </span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline-block">
            Use as setas &larr; &rarr; do teclado para navegar
          </span>
        </div>
      </div>

      {/* Thumbnails Carousel Bar */}
      <div className="glass-card p-4 rounded-3xl border-white/5">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
            <Presentation className="w-3.5 h-3.5 text-brand-yellow" />
            Navegação por Miniaturas
          </span>
          <span className="text-xs text-brand-yellow font-bold">
            {currentIndex + 1} de {PLANO_AULA_SLIDES.length} selecionado
          </span>
        </div>

        <div 
          ref={thumbsRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10"
        >
          {PLANO_AULA_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border-2 transition-all group ${
                  isActive 
                    ? 'border-brand-yellow scale-105 shadow-lg shadow-brand-yellow/20' 
                    : 'border-white/10 hover:border-white/40 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={slide.imageSrc}
                  alt={slide.title}
                  fill
                  sizes="144px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                <div className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-bold ${isActive ? 'text-brand-yellow' : 'text-white'}`}>
                  {slide.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Slide Details & Teaching Notes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Description Card */}
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-yellow mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Resumo do Slide
          </h3>
          <p className="text-gray-200 font-medium text-base leading-relaxed mb-4">
            {currentSlide.description}
          </p>

          {currentSlide.link && (
            <a
              href={currentSlide.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow/10 hover:bg-brand-yellow/20 text-brand-yellow text-xs font-bold border border-brand-yellow/30 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              {currentSlide.link.label}
            </a>
          )}
        </div>

        {/* Teaching Notes Card */}
        <div className="glass-card p-6 rounded-3xl border-white/5">
          <h3 className="text-xs font-black uppercase tracking-widest text-brand-blue mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Notas de Aula
          </h3>
          {currentSlide.notes && currentSlide.notes.length > 0 ? (
            <ul className="space-y-2">
              {currentSlide.notes.map((note, i) => (
                <li key={i} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-brand-yellow font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 italic">Sem notas adicionais para este slide.</p>
          )}
        </div>
      </div>

    </div>
  );
}
