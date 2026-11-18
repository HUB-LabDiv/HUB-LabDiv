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
import { useTheme } from '@/hooks/useTheme';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Sparkles,
  BookOpen,
  Presentation,
  ExternalLink,
  Users,
  Info,
  Wrench,
  Star,
  Eye,
  Settings,
  Clock,
  Target,
  Lightbulb,
  Film,
  ClipboardList,
  Package,
  MessageSquare,
  AlignLeft,
  Newspaper,
  Calendar,
  PieChart,
  Sliders,
  Layers,
  Globe,
  Smartphone,
  Code2,
  Database,
  Megaphone,
  Rocket,
  ArrowRight,
  FileText,
  CheckCircle2,
  Server,
  Mic,
  Palette,
  Lock,
  Compass,
  MapPin,
  HelpCircle,
} from 'lucide-react';

export interface IniciativaSlideLink {
  label: string;
  url: string;
  variant?: 'yellow' | 'blue' | 'red' | 'outline' | 'green';
}

export interface IniciativaSlideItem {
  id: number;
  title: string;
  category: string;
  subtitle?: string;
  description: string;
  idv: 'labdiv' | 'show' | 'hibrido';
  idvBadge: string;
  accentColor: 'blue' | 'yellow' | 'red' | 'tricolor' | 'neon-blue' | 'neon-red' | 'neon-green';
  notes?: string[];
  links?: IniciativaSlideLink[];
}

export const INICIATIVAS_SLIDES: IniciativaSlideItem[] = [
  {
    id: 1,
    title: 'Relembrando o LabDiv',
    subtitle: 'Laboratório de Divulgação Científica e Expressão do IFUSP',
    category: '01 • IDENTIDADE LABDIV',
    description: 'KitDiv, Mentorias, Produção de Divulgação e DigitalLab na identidade visual do LabDiv.',
    idv: 'labdiv',
    idvBadge: 'IDV do LabDiv',
    accentColor: 'tricolor',
    notes: [
      'Apresentar a logo oficial do LabDiv (/Logo_Labdiv.png) e destacar as 4 frentes coloridas na identidade visual da marca.',
    ],
    links: [{ label: 'Sobre o LabDiv', url: '/sobre', variant: 'blue' }],
  },
  {
    id: 2,
    title: 'Relembrando o HUB',
    subtitle: 'Super App Open Source criado pelo LabDiv para o IFUSP',
    category: '02 • PLATAFORMA HUB LABDIV',
    description: 'Super App (Navegador e Play Store), Open Source, feito pelo LabDiv e focado em Comunicação Dialógica.',
    idv: 'labdiv',
    idvBadge: 'IDV do LabDiv',
    accentColor: 'yellow',
    notes: [
      'Sem elementos fora da IDV: Super App + Play Store unificados, Open Source, Feito pelo LabDiv e Comunicação Dialógica.',
    ],
    links: [{ label: 'Acessar o HUB', url: '/', variant: 'yellow' }],
  },
  {
    id: 3,
    title: 'Como funciona o HUB?',
    subtitle: 'Divisão dos 3 Eixos originais com seus ícones e abas oficiais',
    category: '03 • ARQUITETURA DOS 3 EIXOS',
    description: 'Social (Logs, Fluxo, Arte), Informativo (Wiki, Instituto, Interativo) e Ferramentas (Acompanhamento, Estudos, Integração).',
    idv: 'labdiv',
    idvBadge: 'IDV do LabDiv',
    accentColor: 'blue',
    notes: [
      'Social: Logs, Fluxo e Arte. Informativo: Wiki, Instituto e Interativo. Ferramentas: Acompanhamento, Estudos e Integração.',
    ],
  },
  {
    id: 4,
    title: 'Criação de um quarto eixo',
    subtitle: 'Iniciativas do IFUSP na sua própria IDV conectadas pelos 3 Eixos',
    category: '04 • O 4º EIXO • INICIATIVAS',
    description: 'Show de Física (azul/neon oficial), Hackerspace, PROFIS e LabDiv com os ícones de Social, Informativo e Ferramentas.',
    idv: 'labdiv',
    idvBadge: 'IDV das Iniciativas',
    accentColor: 'tricolor',
    notes: [
      'Cada iniciativa na sua IDV real (Show de Física com azul e barras neon da página oficial; LabDiv na sua marca tricolor) e os 3 ícones (Social, Informativo, Ferramentas) saindo de cada uma.',
    ],
    links: [{ label: 'Vitrine Show de Física', url: '/iniciativas/show-da-fisica', variant: 'yellow' }],
  },
  {
    id: 5,
    title: 'E como vai funcionar?',
    subtitle: 'Fluxo de navegação do HUB até o Site Dedicado da Iniciativa',
    category: '05 • NAVEGAÇÃO HUB ➔ INICIATIVA',
    description: 'HUB LabDiv (IDV forte) ➔ Card da Iniciativa (Show) ➔ Vitrine Preview ➔ Site Dedicado.',
    idv: 'hibrido',
    idvBadge: 'IDV HUB ➔ IDV Show',
    accentColor: 'tricolor',
    notes: [
      'Simbolizar a navegação visual do HUB até a iniciativa com o Show de Física usando exatamente as cores da página oficial do Show.',
    ],
    links: [
      { label: 'Vitrine no HUB', url: '/iniciativas/show-da-fisica', variant: 'blue' },
      { label: 'Site Show de Física', url: '/sites/show-da-fisica', variant: 'green' },
    ],
  },
  {
    id: 6,
    title: 'Por motores do sistema',
    subtitle: 'União entre HUB LabDiv, Aurtistic e Show de Física',
    category: '06 • MOTORES DO ECOSSISTEMA',
    description: 'Ícone oficial do HUB de um lado, ícone oficial do Aurtistic do outro e Show de Física no centro inferior.',
    idv: 'hibrido',
    idvBadge: 'HUB + Aurtistic + Show',
    accentColor: 'tricolor',
    notes: [
      'Destacar visualmente o ícone do HUB, o ícone do Aurtistic e o Show de Física abaixo com as cores reais da página do Show.',
    ],
  },
  {
    id: 7,
    title: 'Divisão de experiências',
    subtitle: 'Preview Público em destaque vs Bastidores Restrito na IDV do Show',
    category: '07 • PREVIEW vs BASTIDORES',
    description: 'Separação clara entre a camada aberta ao público e a área restrita da equipe.',
    idv: 'show',
    idvBadge: 'IDV Show de Física',
    accentColor: 'neon-blue',
    notes: [
      'Neste primeiro momento o foco está no Preview Público (destacado) enquanto Bastidores aparece escurecido.',
    ],
  },
  {
    id: 8,
    title: 'Interação Pública',
    subtitle: 'Introdução (4 linhas), Informações Essenciais e Feed Horizontal de Posts',
    category: '08 • PREVIEW PÚBLICO (1/4)',
    description: 'Header + texto simples (4 linhas), informações sobre o show e feed horizontal explicando cada experiência.',
    idv: 'show',
    idvBadge: 'Preview Público • 1/4',
    accentColor: 'neon-red',
    notes: [
      'Barra de progresso 1/4: Introdução simples, informações essenciais do show e feed horizontal com posts explicando cada experiência.',
    ],
    links: [{ label: 'Abrir Site Público', url: '/sites/show-da-fisica', variant: 'green' }],
  },
  {
    id: 9,
    title: 'Interação Pública',
    subtitle: 'Monte seu Show — Planejamento e Agendamento para Escolas',
    category: '09 • PREVIEW PÚBLICO (2/4)',
    description: 'Professores montam seu roteiro e agendam a experiência do Show de Física.',
    idv: 'show',
    idvBadge: 'Preview Público • 2/4',
    accentColor: 'neon-green',
    notes: [
      'Barra de progresso 2/4: Monte seu Show para seleção personalizada de experimentos e agendamento.',
    ],
    links: [{ label: 'Monte seu Show', url: '/sites/show-da-fisica/monte-seu-show', variant: 'green' }],
  },
  {
    id: 10,
    title: 'Interação Pública',
    subtitle: 'Converse com o Show & Acompanhe o Show (AS)',
    category: '10 • PREVIEW PÚBLICO (3/4)',
    description: 'Perguntas ao vivo e sondagem do aprendizado e utilidade para o professor durante e após o processo.',
    idv: 'show',
    idvBadge: 'Preview Público • 3/4',
    accentColor: 'neon-blue',
    notes: [
      'Barra de progresso 3/4: Converse com o Show e Acompanhe o Show (sondando aprendizado e utilidade pedagógica durante e após o processo).',
    ],
    links: [{ label: 'Acompanhe o Show', url: '/sites/show-da-fisica/acompanhe', variant: 'yellow' }],
  },
  {
    id: 11,
    title: 'Interação Pública',
    subtitle: 'Notícias, Oportunidades e Eventos + Síntese de Objetivos',
    category: '11 • PREVIEW PÚBLICO (4/4)',
    description: 'Onde o Show foi e vai estar, consolidando Informações, Divulgação, Agendamento e Acompanhamento.',
    idv: 'show',
    idvBadge: 'Preview Público • 4/4',
    accentColor: 'neon-green',
    notes: [
      'Barra de progresso 4/4: Notícias e oportunidades mostrando onde o Show foi e vai + objetivos públicos completos.',
    ],
  },
  {
    id: 12,
    title: 'Divisão de experiências: Bastidores',
    subtitle: 'Retomando a divisão — destacando Gestão, HUB Studio e Cofre',
    category: '12 • RETOMADA • FOCO NOS BASTIDORES',
    description: 'Preview Público escurecido para detalhar os 3 pilares dos Bastidores: Gestão Organização ➔ HUB Studio ➔ Cofre.',
    idv: 'show',
    idvBadge: 'Bastidores em Destaque',
    accentColor: 'neon-blue',
    notes: [
      'Mostrar o fluxo dos Bastidores: Gestão da Organização ➔ HUB Studio ➔ Cofre (Servidor Drive).',
    ],
  },
  {
    id: 13,
    title: 'Bastidores • Gestão da Organização',
    subtitle: 'Pessoas, Operação de Bancada, Metas e Demandas da Equipe',
    category: '13 • BASTIDORES • 1/3 GESTÃO',
    description: 'Perguntas, sugestões, pedidos, ideias, estoque, presença, horários, escalas, tarefas, metas, progresso e equipes.',
    idv: 'show',
    idvBadge: 'Bastidores • Gestão',
    accentColor: 'neon-blue',
    notes: [
      'Detalhar todos os módulos da Gestão da Organização: perguntas, sugestões, pedidos, ideias, estoque, presença, horários, escalas, tarefas, metas, progresso e equipes.',
    ],
  },
  {
    id: 14,
    title: 'Bastidores • HUB Studio',
    subtitle: 'Criação de posts no HUB com acesso direto aos arquivos do servidor',
    category: '14 • BASTIDORES • 2/3 HUB STUDIO',
    description: 'Estúdio de design integrado na IDV oficial para criar e publicar posts buscando fotos direto do Cofre.',
    idv: 'show',
    idvBadge: 'Bastidores • HUB Studio',
    accentColor: 'neon-red',
    notes: [
      'Explicar como o HUB Studio cria posts e carrosséis na identidade visual do Show com acesso direto às fotos do servidor.',
    ],
  },
  {
    id: 15,
    title: 'Bastidores • Cofre (Servidor)',
    subtitle: 'O "Drive" da Organização para todo o acervo e arquivos internos',
    category: '15 • BASTIDORES • 3/3 COFRE',
    description: 'Servidor próprio (Drive) da organização armazenando anotações, fotos, vídeos e roteiros.',
    idv: 'show',
    idvBadge: 'Bastidores • Cofre / Drive',
    accentColor: 'neon-green',
    notes: [
      'Apresentar o Cofre como o servidor "Drive" da organização para guardar anotações, fotos, vídeos e roteiros.',
    ],
  },
];

export function IniciativasSlideViewer({ orbitronClassName = '' }: { orbitronClassName?: string }) {
  const orbitron = { className: orbitronClassName };
  const { theme, toggleTheme } = useTheme();
  const isSlideDark = theme === 'dark';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const currentSlide = INICIATIVAS_SLIDES[currentIndex];
  const isShowIdv = currentSlide.idv === 'show';

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < INICIATIVAS_SLIDES.length - 1 ? prev + 1 : prev));
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape' && isFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    if (thumbsRef.current) {
      const activeBtn = thumbsRef.current.children[currentIndex] as HTMLElement | undefined;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const renderButtonLink = (link: IniciativaSlideLink, index: number) => {
    const isExternal = link.url.startsWith('http');
    const colorClasses = {
      yellow: 'bg-[#FFCC00] text-black hover:bg-[#e6b800] shadow-md font-black',
      blue: 'bg-[#0F4780] text-white hover:bg-[#0C3A68] shadow-md border border-[#1F9FCF]/30 font-black',
      red: 'bg-[#F14343] text-white hover:bg-[#D93838] shadow-md border border-[#F14343]/30 font-black',
      green: 'bg-[#01f300]/15 text-[#01f300] hover:bg-[#01f300]/25 border border-[#01f300]/60 shadow-[0_0_12px_rgba(1,243,0,0.25)] font-black',
      outline: 'bg-white/10 text-white hover:bg-white/20 border border-white/20 font-bold',
    }[link.variant || 'yellow'];

    return (
      <a
        key={index}
        href={link.url}
        target={isExternal ? '_blank' : '_self'}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 ${colorClasses}`}
      >
        {isExternal ? (
          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <Globe className="w-3.5 h-3.5 shrink-0" />
        )}
        <span>{link.label}</span>
      </a>
    );
  };

  const renderPublicProgressBar = (step: number) => {
    const steps = ['1. Intro & Feed', '2. Monte seu Show', '3. Converse & AS', '4. Notícias & Agenda'];
    return (
      <div className="mb-4 p-3.5 rounded-2xl bg-black/80 border border-white/15">
        <div className="flex items-center justify-between text-[10px] sm:text-xs font-black uppercase tracking-widest mb-2">
          <span className="text-[#01f300]">Progresso • Interação Pública</span>
          <span className="text-[#FFCC00]">Etapa {step} de 4</span>
        </div>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {steps.map((label, idx) => {
            const active = idx + 1 === step;
            const passed = idx + 1 < step;
            return (
              <div key={label} className="space-y-1">
                <div
                  className={`h-2.5 rounded-full transition-all ${
                    active
                      ? 'bg-[#01f300] shadow-[0_0_10px_#01f300]'
                      : passed
                        ? 'bg-[#002ffe]'
                        : 'bg-white/15'
                  }`}
                />
                <span
                  className={`block text-[9px] sm:text-[11px] font-bold truncate ${
                    active ? 'text-[#01f300]' : passed ? 'text-blue-300' : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderShowHeaderLogo = (size: 'sm' | 'md' = 'md') => (
    <div className={`flex items-center gap-1.5 font-black tracking-wider ${orbitron.className} ${size === 'sm' ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'}`}>
      <span className="text-white" style={{ textShadow: '0 0 8px #f60011' }}>SHOW</span>
      <span className="text-white" style={{ textShadow: '0 0 8px #002ffe' }}>DE</span>
      <span className="text-white" style={{ textShadow: '0 0 8px #01f300' }}>FÍSICA</span>
    </div>
  );

  const renderSlideBody = () => {
    switch (currentSlide.id) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center my-2 w-full">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-3xl overflow-hidden border-2 border-[#FFCC00]/70 shadow-[0_0_50px_rgba(15,71,128,0.55)] bg-gradient-to-br from-[#0F4780]/30 via-black to-[#F14343]/20 p-5">
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div className="w-1/3 bg-[#FFCC00]" />
                  <div className="w-1/3 bg-[#0F4780]" />
                  <div className="w-1/3 bg-[#F14343]" />
                </div>
                <Image
                  src="/Logo_Labdiv.png"
                  alt="Logo Oficial LabDiv"
                  fill
                  className="object-contain p-5"
                  priority
                />
              </div>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl border-l-4 border-[#0F4780] bg-gradient-to-r from-[#0F4780]/25 to-black/80 border border-white/15 shadow-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-[#FFCC00] text-black text-[10px] font-black uppercase tracking-widest font-bukra mb-2">
                  Laboratório de Divulgação e Expressão • IFUSP
                </span>
                <p className="text-sm sm:text-base xl:text-lg text-gray-100 leading-relaxed">
                  O <strong className="text-[#FFCC00]">LabDiv</strong> conecta a física acadêmica à sociedade através da experimentação, mentorias, comunicação científica e tecnologia aberta:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0F4780]/45 to-black/90 border-2 border-[#0F4780] shadow-xl flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#0F4780] border border-blue-300/40 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 text-[#FFCC00]" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white font-bukra">KitDiv</h4>
                    <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">Kits experimentais didáticos para escolas e oficinas.</p>
                  </div>
                </div>

                <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#FFCC00]/25 to-black/90 border-2 border-[#FFCC00] shadow-xl flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#FFCC00] flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-[#FFCC00] font-bukra">Mentorias</h4>
                    <p className="text-xs sm:text-sm text-amber-100/90 mt-0.5">Acompanhamento, acolhimento e formação de estudantes.</p>
                  </div>
                </div>

                <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F14343]/35 to-black/90 border-2 border-[#F14343] shadow-xl flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#F14343] flex items-center justify-center shrink-0">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-red-300 font-bukra">Produção de Divulgação</h4>
                    <p className="text-xs sm:text-sm text-red-100/90 mt-0.5">Mídia, vídeos, artes e comunicação científica acessível.</p>
                  </div>
                </div>

                <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#0F4780]/30 via-[#9D4EDD]/25 to-black/90 border-2 border-[#9D4EDD] shadow-xl flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#9D4EDD] flex items-center justify-center shrink-0">
                    <Code2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-purple-300 font-bukra">DigitalLab</h4>
                    <p className="text-xs sm:text-sm text-purple-100/90 mt-0.5">Engenharia de software, aplicativos e ferramentas livres.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center my-2 w-full">
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 xl:w-72 xl:h-72 rounded-3xl overflow-hidden border-2 border-[#FFCC00]/70 shadow-[0_0_45px_rgba(15,71,128,0.5)] bg-black p-3">
                <Image
                  src="/icone-HUBLabDiv-bgscience.png"
                  alt="Ícone HUB LabDiv"
                  fill
                  className="object-contain p-3"
                />
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFCC00]/20 to-black/85 border-2 border-[#FFCC00] space-y-2 shadow-xl">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-6 h-6 text-[#FFCC00]" />
                  <Rocket className="w-5 h-5 text-[#FFCC00]" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white font-bukra">Super App • Web &amp; Play Store</h4>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  Plataforma completa acessível direto pelo navegador e disponível como aplicativo na Google Play Store.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F4780]/35 to-black/85 border-2 border-[#0F4780] space-y-2 shadow-xl">
                <Code2 className="w-6 h-6 text-blue-300" />
                <h4 className="text-base sm:text-lg font-black text-white font-bukra">100% Open Source</h4>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  Código aberto (AGPLv3), auditável e construído de forma colaborativa para a comunidade acadêmica.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#F14343]/25 to-black/85 border-2 border-[#F14343] space-y-2 shadow-xl">
                <Star className="w-6 h-6 text-red-300" />
                <h4 className="text-base sm:text-lg font-black text-white font-bukra">Feito pelo LabDiv</h4>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  Idealizado e desenvolvido dentro do Instituto de Física da USP pelos estudantes e pesquisadores do LabDiv.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0F4780]/25 via-[#F14343]/15 to-[#FFCC00]/15 border-2 border-white/40 space-y-2 shadow-xl">
                <MessageSquare className="w-6 h-6 text-[#FFCC00]" />
                <h4 className="text-base sm:text-lg font-black text-white font-bukra">Comunicação Dialógica</h4>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  Troca horizontal entre ciência, estudantes e sociedade — sem via de mão única.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 my-2 w-full">
            {/* Eixo 1: Social */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#0F4780] bg-gradient-to-b from-[#0F4780]/35 to-black/85 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#0F4780]/40 border border-blue-400/50 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-blue-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 font-bukra">Eixo 01</span>
                <h4 className="text-xl sm:text-2xl font-black text-white font-bukra mt-0.5 mb-4">Social</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-100">
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-blue-400/30 font-bold">💬 Logs</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-blue-400/30 font-bold">⚡ Fluxo</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-blue-400/30 font-bold">🎨 Arte</li>
                </ul>
              </div>
              <div className="mt-5 h-1.5 w-full rounded-full bg-[#0F4780]" />
            </div>

            {/* Eixo 2: Informativo */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#F14343] bg-gradient-to-b from-[#F14343]/30 to-black/85 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F14343]/30 border border-red-400/50 flex items-center justify-center mb-3">
                  <Info className="w-6 h-6 text-red-300" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-300 font-bukra">Eixo 02</span>
                <h4 className="text-xl sm:text-2xl font-black text-white font-bukra mt-0.5 mb-4">Informativo</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-100">
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-red-400/30 font-bold">📘 Wiki</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-red-400/30 font-bold">🏛️ Instituto</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-red-400/30 font-bold">🧭 Interativo</li>
                </ul>
              </div>
              <div className="mt-5 h-1.5 w-full rounded-full bg-[#F14343]" />
            </div>

            {/* Eixo 3: Ferramentas */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 border-[#FFCC00] bg-gradient-to-b from-[#FFCC00]/25 to-black/85 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#FFCC00]/25 border border-[#FFCC00] flex items-center justify-center mb-3">
                  <Wrench className="w-6 h-6 text-[#FFCC00]" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] font-bukra">Eixo 03</span>
                <h4 className="text-xl sm:text-2xl font-black text-white font-bukra mt-0.5 mb-4">Ferramentas</h4>
                <ul className="space-y-2.5 text-xs sm:text-sm text-gray-100">
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-[#FFCC00]/30 font-bold">📈 Acompanhamento</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-[#FFCC00]/30 font-bold">📚 Estudos</li>
                  <li className="px-3.5 py-2 rounded-xl bg-white/5 border border-[#FFCC00]/30 font-bold">🔗 Integração</li>
                </ul>
              </div>
              <div className="mt-5 h-1.5 w-full rounded-full bg-[#FFCC00]" />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 my-2 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Show de Física: Azul oficial + barra neon da página do Show */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_24px_rgba(0,47,254,0.4)] flex flex-col justify-between gap-4">
                <div className="absolute top-0 left-0 right-0 h-1 flex">
                  <div className="w-1/3 bg-[#f60011]" />
                  <div className="w-1/3 bg-[#002ffe]" />
                  <div className="w-1/3 bg-[#01f300]" />
                </div>
                <div className="pt-1">
                  <span className={`text-[10px] font-black text-blue-300 tracking-widest uppercase ${orbitron.className}`}>Iniciativa 01</span>
                  <div className="mt-1.5">{renderShowHeaderLogo('sm')}</div>
                  <p className="text-xs text-gray-300 mt-2">Espetáculo experimental e atendimento escolar.</p>
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                  <span className="p-1.5 rounded-lg bg-[#0F4780]/40 border border-blue-400/50" title="Social"><Users className="w-4 h-4 text-blue-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#F14343]/30 border border-red-400/50" title="Informativo"><Info className="w-4 h-4 text-red-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#FFCC00]/25 border border-[#FFCC00]" title="Ferramentas"><Wrench className="w-4 h-4 text-[#FFCC00]" /></span>
                </div>
              </div>

              {/* Hackerspace */}
              <div className="p-5 rounded-2xl bg-black border-2 border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.2)] flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono font-black text-[#00ff66] tracking-widest uppercase">Iniciativa 02</span>
                  <h4 className="text-lg font-mono font-black text-white mt-1.5">HACKERSPACE IFUSP</h4>
                  <p className="text-xs text-gray-300 mt-2">Oficina aberta, eletrônica e hardware livre.</p>
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                  <span className="p-1.5 rounded-lg bg-[#0F4780]/40 border border-blue-400/50" title="Social"><Users className="w-4 h-4 text-blue-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#F14343]/30 border border-red-400/50" title="Informativo"><Info className="w-4 h-4 text-red-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#FFCC00]/25 border border-[#FFCC00]" title="Ferramentas"><Wrench className="w-4 h-4 text-[#FFCC00]" /></span>
                </div>
              </div>

              {/* PROFIS */}
              <div className="p-5 rounded-2xl bg-slate-950 border-2 border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black text-amber-400 tracking-widest uppercase">Iniciativa 03</span>
                  <h4 className="text-lg font-black text-white mt-1.5">PROFIS</h4>
                  <p className="text-xs text-gray-300 mt-2">Apoio, pesquisa e cooperação de professores de física.</p>
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/10">
                  <span className="p-1.5 rounded-lg bg-[#0F4780]/40 border border-blue-400/50" title="Social"><Users className="w-4 h-4 text-blue-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#F14343]/30 border border-red-400/50" title="Informativo"><Info className="w-4 h-4 text-red-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#FFCC00]/25 border border-[#FFCC00]" title="Ferramentas"><Wrench className="w-4 h-4 text-[#FFCC00]" /></span>
                </div>
              </div>

              {/* LabDiv na identidade real da marca */}
              <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-[#0F4780]/45 via-[#121212] to-[#F14343]/25 border-2 border-[#FFCC00] shadow-[0_0_24px_rgba(15,71,128,0.45)] flex flex-col justify-between gap-4">
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div className="w-1/3 bg-[#FFCC00]" />
                  <div className="w-1/3 bg-[#0F4780]" />
                  <div className="w-1/3 bg-[#F14343]" />
                </div>
                <div className="pt-1 flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black text-[#FFCC00] tracking-widest uppercase font-bukra">Iniciativa 04</span>
                    <h4 className="text-lg font-black text-white mt-1 font-bukra">LABDIV</h4>
                    <p className="text-xs text-gray-200 mt-1.5">KitDiv, Mentorias, Divulgação e DigitalLab.</p>
                  </div>
                  <div className="relative w-10 h-10 rounded-xl bg-black/50 border border-[#FFCC00]/40 shrink-0 overflow-hidden">
                    <Image src="/Logo_Labdiv.png" alt="LabDiv" fill className="object-contain p-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2.5 border-t border-white/15">
                  <span className="p-1.5 rounded-lg bg-[#0F4780]/50 border border-blue-400/60" title="Social"><Users className="w-4 h-4 text-blue-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#F14343]/40 border border-red-400/60" title="Informativo"><Info className="w-4 h-4 text-red-300" /></span>
                  <span className="p-1.5 rounded-lg bg-[#FFCC00]/30 border border-[#FFCC00]" title="Ferramentas"><Wrench className="w-4 h-4 text-[#FFCC00]" /></span>
                </div>
              </div>
            </div>

            {/* Legenda dos 3 Eixos em cada iniciativa */}
            <div className="flex flex-wrap items-center justify-center gap-6 p-3 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-gray-200">
              <span className="flex items-center gap-2 font-bold"><Users className="w-4 h-4 text-blue-300" /> Eixo Social</span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-2 font-bold"><Info className="w-4 h-4 text-red-300" /> Eixo Informativo</span>
              <span className="text-gray-500">•</span>
              <span className="flex items-center gap-2 font-bold"><Wrench className="w-4 h-4 text-[#FFCC00]" /> Eixo Ferramentas</span>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 items-stretch my-2 w-full">
            {/* Passo 1: HUB LabDiv (IDV forte) */}
            <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#0F4780] via-[#0C3A68] to-[#121212] border-2 border-[#FFCC00] shadow-[0_0_28px_rgba(15,71,128,0.65)] flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#FFCC00]" />
                <div className="w-1/3 bg-[#0F4780]" />
                <div className="w-1/3 bg-[#F14343]" />
              </div>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-0.5 rounded bg-[#FFCC00] text-black text-[10px] font-black uppercase font-bukra">
                  1. Dentro do HUB
                </span>
                <div className="flex items-center gap-2.5 mt-3">
                  <div className="relative w-10 h-10 rounded-xl bg-black/50 border border-[#FFCC00]/50 overflow-hidden shrink-0">
                    <Image src="/icone-HUBLabDiv-transparent.png" alt="HUB" fill className="object-contain p-1" />
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white font-bukra">HUB LabDiv</h4>
                </div>
                <p className="text-xs sm:text-sm text-blue-100 mt-3 leading-relaxed">
                  O usuário navega pela plataforma na IDV oficial do LabDiv e encontra o 4º Eixo.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[#FFCC00] text-xs font-black font-bukra">
                <span>Menu Lateral</span>
                <ChevronsRight className="w-5 h-5" />
              </div>
            </div>

            {/* Passo 2: Card da Iniciativa (Cores reais da página do Show) */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_24px_rgba(0,47,254,0.4)] flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <div className="pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded bg-[#002ffe]/25 border border-[#002ffe] text-blue-300 text-[10px] font-black uppercase ${orbitron.className}`}>
                  2. Card do Show
                </span>
                <div className="mt-3">{renderShowHeaderLogo('sm')}</div>
                <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                  Card da iniciativa já assumindo a identidade neon oficial da página do Show de Física.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-blue-400 text-xs font-black">
                <span>1 Clique</span>
                <ChevronsRight className="w-5 h-5" />
              </div>
            </div>

            {/* Passo 3: Vitrine da Iniciativa */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-black border-2 border-[#f60011] shadow-[0_0_24px_rgba(246,0,17,0.35)] flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <div className="pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded bg-[#f60011]/20 border border-[#f60011] text-red-300 text-[10px] font-black uppercase ${orbitron.className}`}>
                  3. Vitrine no HUB
                </span>
                <h4 className={`text-base sm:text-lg font-black text-white mt-3 ${orbitron.className}`}>
                  Preview Dedicado
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                  Apresentação rápida dentro do HUB com acesso direto ao site completo da iniciativa.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-red-400 text-xs font-black">
                <span>Abrir Site</span>
                <ChevronsRight className="w-5 h-5" />
              </div>
            </div>

            {/* Passo 4: Site da Iniciativa */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_24px_rgba(1,243,0,0.35)] flex flex-col justify-between">
              <div className="absolute top-0 left-0 right-0 h-1 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <div className="pt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded bg-[#01f300]/20 border border-[#01f300] text-[#01f300] text-[10px] font-black uppercase ${orbitron.className}`}>
                  4. Site Dedicado
                </span>
                <h4 className={`text-base sm:text-lg font-black text-white mt-3 ${orbitron.className}`} style={{ textShadow: '0 0 8px #01f300' }}>
                  Subdomínio Próprio
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 mt-3 leading-relaxed">
                  Experiência imersiva completa dividida em Preview Público e Bastidores Restrito.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-[#01f300] text-xs font-black">
                <span>Imersão Total</span>
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 my-2 w-full">
            {/* Topo: HUB de um lado + Aurtistic do outro com seus ícones oficiais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0F4780]/45 to-black border-2 border-[#0F4780] shadow-[0_0_28px_rgba(15,71,128,0.45)] flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border border-[#FFCC00]/50 overflow-hidden shrink-0">
                  <Image src="/icone-HUBLabDiv-transparent.png" alt="Ícone HUB" fill className="object-contain p-2" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 font-bukra">Motor 01 • Vitrine &amp; Público</span>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-bukra">HUB LabDiv</h4>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">
                    Portal aberto de divulgação, feed social, notícias e interação com escolas.
                  </p>
                </div>
              </div>

              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#9D4EDD]/35 to-black border-2 border-[#9D4EDD] shadow-[0_0_28px_rgba(157,78,221,0.45)] flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black/60 border border-[#9D4EDD]/60 overflow-hidden shrink-0">
                  <Image src="/aurtistic/icon.png" alt="Ícone Aurtistic" fill className="object-contain p-2" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-300 font-bukra">Motor 02 • Gestão &amp; Cofre</span>
                  <h4 className="text-xl sm:text-2xl font-black text-white font-bukra">Aurtistic</h4>
                  <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">
                    Tarefas, metas, escalas, servidor de arquivos (fotos, vídeos, roteiros) e HUB Studio.
                  </p>
                </div>
              </div>
            </div>

            {/* Conectores convergindo */}
            <div className="flex justify-center items-center gap-8 text-xs font-black uppercase tracking-widest">
              <span className="text-blue-300">↘ Integração Pública</span>
              <span className="text-purple-300">↙ Integração Interna</span>
            </div>

            {/* Meio Abaixo: Show de Física nas cores reais da página do Show */}
            <div className="relative overflow-hidden max-w-3xl mx-auto p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_32px_rgba(0,47,254,0.4)] text-center space-y-2">
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest text-blue-300 block pt-1 ${orbitron.className}`}>
                União do Ecossistema
              </span>
              <div className="flex justify-center">{renderShowHeaderLogo('md')}</div>
              <p className="text-xs sm:text-sm text-gray-300">
                Sustentado pelo alcance público do <strong className="text-blue-300">HUB</strong> e pela organização operacional do <strong className="text-purple-300">Aurtistic</strong>.
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 my-2 w-full ${orbitron.className}`}>
            {/* Card Preview Público — EM DESTAQUE */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_32px_rgba(1,243,0,0.4)] flex flex-col justify-between space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded bg-[#01f300] text-black text-[10px] font-black uppercase">
                    Em Destaque Agora • Público
                  </span>
                  <Eye className="w-6 h-6 text-[#01f300]" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ textShadow: '0 0 10px #01f300' }}>
                  PREVIEW PÚBLICO
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-100 font-sans">
                  <li>• Introdução: Header + texto simples (4 linhas)</li>
                  <li>• Informações essenciais do Show</li>
                  <li>• Feed horizontal dos posts</li>
                  <li>• Monte seu show / AS (acompanhamento)</li>
                  <li>• Converse com o show</li>
                  <li>• Notícias, oportunidades e eventos</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-[#01f300]/15 border border-[#01f300]/50 font-sans">
                <span className="text-[10px] font-black uppercase text-[#01f300] block">Objetivos:</span>
                <span className="text-xs sm:text-sm text-white font-bold">Informações, divulgação, agendamento e acompanhamento.</span>
              </div>
            </div>

            {/* Card Bastidores Restrito — ESCURECIDO */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/15 opacity-55 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded bg-white/10 text-gray-300 text-[10px] font-black uppercase">
                    Acesso Restrito • Equipe
                  </span>
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-gray-300 mb-3">
                  BASTIDORES
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-gray-400 font-sans">
                  <li>• Presença, horários e escala</li>
                  <li>• Metas, progresso e tarefas</li>
                  <li>• Sugestões, pedidos e ideias</li>
                  <li>• Fotos, vídeos, roteiros e conteúdo da org</li>
                  <li>• Perguntas, sugestões, anotações e entrevistas</li>
                  <li>• Estoque &amp; HUB Studio</li>
                </ul>
              </div>
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 font-sans">
                <span className="text-[10px] font-black uppercase text-gray-400 block">Objetivos:</span>
                <span className="text-xs sm:text-sm text-gray-300 font-semibold">HUB Studio (criação de posts) • Aurtistic (gestão e servidor).</span>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className={`space-y-4 my-1 w-full ${orbitron.className}`}>
            {renderPublicProgressBar(1)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#f60011] shadow-[0_0_20px_rgba(246,0,17,0.3)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <AlignLeft className="w-6 h-6 text-[#f60011]" />
                  <h4 className="text-lg sm:text-xl font-black text-white">Introdução &amp; Informações</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  <strong>Header + texto simples (4 linhas)</strong> apresentando o espetáculo de forma direta, seguido das <strong>informações essenciais</strong> (horários, local, público-alvo e orientações de visita).
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_20px_rgba(0,47,254,0.3)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Layers className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg sm:text-xl font-black text-white">Feed Horizontal de Posts</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  Carrossel horizontal com <strong>posts explicando cada experiência científica</strong> (mecânica, eletromagnetismo, óptica, termodinâmica) com fotos, vídeos e linguagem acessível.
                </p>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className={`space-y-4 my-1 w-full ${orbitron.className}`}>
            {renderPublicProgressBar(2)}
            <div className="p-6 sm:p-8 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_25px_rgba(1,243,0,0.3)] grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8 space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-7 h-7 text-[#01f300]" />
                  <h4 className="text-2xl sm:text-3xl font-black text-white">Monte seu Show</h4>
                </div>
                <p className="text-sm sm:text-base text-gray-200 font-sans leading-relaxed">
                  Ferramenta interativa onde professores e escolas selecionam os temas e experimentos desejados antes da visita, alinhando a apresentação ao conteúdo visto em sala de aula.
                </p>
              </div>
              <div className="md:col-span-4 p-4 rounded-xl bg-[#01f300]/10 border border-[#01f300]/40 font-sans space-y-1.5">
                <span className="text-[10px] font-black uppercase text-[#01f300] block">Objetivo Direto</span>
                <p className="text-xs sm:text-sm text-white font-bold">Agendamento e preparação personalizada do roteiro.</p>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className={`space-y-4 my-1 w-full ${orbitron.className}`}>
            {renderPublicProgressBar(3)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_20px_rgba(0,47,254,0.3)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  <h4 className="text-lg sm:text-xl font-black text-white">Converse com o Show</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  Canal interativo em tempo real para o público e estudantes enviarem perguntas, curiosidades e comentários durante a apresentação no auditório.
                </p>
              </div>
              <div className="p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.3)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <Compass className="w-6 h-6 text-[#FFCC00]" />
                  <h4 className="text-lg sm:text-xl font-black text-white">Acompanhe o Show (AS)</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  Sondagem estruturada para medir o <strong>aprendizado e a utilidade pedagógica para o professor durante e após todo o processo</strong> da visita.
                </p>
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className={`space-y-4 my-1 w-full ${orbitron.className}`}>
            {renderPublicProgressBar(4)}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              <div className="md:col-span-7 p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#f60011] shadow-[0_0_20px_rgba(246,0,17,0.3)] space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-6 h-6 text-[#f60011]" />
                  <h4 className="text-lg sm:text-xl font-black text-white">Notícias, Oportunidades &amp; Eventos</h4>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  Mural transparente onde escolas e público acompanham a trajetória do projeto — sabendo exatamente <strong>onde o Show já foi e onde vai se apresentar</strong>, além de editais e novidades.
                </p>
              </div>
              <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_20px_rgba(1,243,0,0.3)] space-y-2 font-sans">
                <span className={`text-[10px] font-black uppercase text-[#01f300] block ${orbitron.className}`}>
                  4 Objetivos Públicos
                </span>
                <div className="grid grid-cols-2 gap-2 pt-1 text-xs sm:text-sm font-bold text-white">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">1. Informações</div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">2. Divulgação</div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">3. Agendamento</div>
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">4. Acompanhamento</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 my-2 w-full ${orbitron.className}`}>
            {/* Card Preview Público — ESCURECIDO */}
            <div className="p-6 rounded-2xl bg-black/50 border border-white/15 opacity-45 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded bg-white/10 text-gray-300 text-[10px] font-black uppercase">
                    Camada Concluída • Externo
                  </span>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-gray-300 mb-3">
                  PREVIEW PÚBLICO
                </h4>
                <p className="text-xs sm:text-sm text-gray-400 font-sans leading-relaxed">
                  Introdução, Feed Horizontal, Monte seu Show, Converse com o Show, Acompanhe o Show e Notícias/Eventos.
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-sans text-xs text-gray-400">
                Foco: Informações, divulgação, agendamento e acompanhamento.
              </div>
            </div>

            {/* Card Bastidores Restrito — EM DESTAQUE COM OS 3 PILARES */}
            <div className="relative overflow-hidden p-6 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_32px_rgba(0,47,254,0.45)] flex flex-col justify-between space-y-4">
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#f60011]" />
                <div className="w-1/3 bg-[#002ffe]" />
                <div className="w-1/3 bg-[#01f300]" />
              </div>
              <div className="pt-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded bg-[#002ffe] text-white text-[10px] font-black uppercase slide-btn-keep-dark">
                    Em Destaque Agora • Equipe
                  </span>
                  <Lock className="w-6 h-6 text-blue-300" />
                </div>
                <h4 className="text-2xl sm:text-3xl font-black text-white mb-3" style={{ textShadow: '0 0 10px #002ffe' }}>
                  BASTIDORES
                </h4>
                <div className="space-y-2.5 font-sans text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-[#0F4780]/25 border border-blue-400/40 text-white font-bold flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><ClipboardList className="w-4 h-4 text-blue-300 shrink-0" /> 1. Gestão da Organização</span>
                    <ArrowRight className="w-4 h-4 text-blue-300 shrink-0" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#F14343]/20 border border-red-400/40 text-white font-bold flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><Palette className="w-4 h-4 text-red-300 shrink-0" /> 2. HUB Studio</span>
                    <ArrowRight className="w-4 h-4 text-red-300 shrink-0" />
                  </div>
                  <div className="p-3 rounded-xl bg-[#01f300]/15 border border-[#01f300]/40 text-white font-bold flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2"><Database className="w-4 h-4 text-[#01f300] shrink-0" /> 3. Cofre (Servidor / Drive)</span>
                    <CheckCircle2 className="w-4 h-4 text-[#01f300] shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 13:
        return (
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 my-2 w-full ${orbitron.className}`}>
            {/* Coluna 1: Perguntas, Sugestões, Pedidos, Ideias, Estoque */}
            <div className="p-5 rounded-2xl bg-black border-2 border-[#002ffe] shadow-[0_0_22px_rgba(0,47,254,0.35)] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#002ffe]/25 border border-[#002ffe] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-blue-300" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">Demandas &amp; Bancada</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {['Perguntas', 'Sugestões', 'Pedidos', 'Ideias', 'Estoque'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-blue-400/30 text-xs font-bold text-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Perguntas do público, sugestões, pedidos da oficina, ideias de experimentos e controle de estoque.
              </p>
            </div>

            {/* Coluna 2: Presença, Horários, Escalas */}
            <div className="p-5 rounded-2xl bg-black border-2 border-[#FFCC00] shadow-[0_0_22px_rgba(255,204,0,0.3)] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#FFCC00]/20 border border-[#FFCC00] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#FFCC00]" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">Pessoas &amp; Rotina</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {['Presença', 'Horários', 'Escalas'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-[#FFCC00]/30 text-xs font-bold text-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Disponibilidade da equipe, registro de presença em reuniões/ensaios, horários e escalas de apresentação.
              </p>
            </div>

            {/* Coluna 3: Tarefas, Metas, Progresso, Equipes */}
            <div className="p-5 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_22px_rgba(1,243,0,0.3)] space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#01f300]/15 border border-[#01f300] flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5 text-[#01f300]" />
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">Execução &amp; Equipes</h4>
              </div>
              <div className="flex flex-wrap gap-1.5 font-sans">
                {['Tarefas', 'Metas', 'Progresso', 'Equipes'].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg bg-white/5 border border-[#01f300]/30 text-xs font-bold text-gray-100">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Organização de tarefas, metas por sub-equipe e acompanhamento em tempo real do progresso via Aurtistic.
              </p>
            </div>
          </div>
        );

      case 14:
        return (
          <div className={`space-y-4 my-2 w-full ${orbitron.className}`}>
            <div className="p-6 rounded-2xl bg-black border-2 border-[#f60011] shadow-[0_0_26px_rgba(246,0,17,0.35)] grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#f60011]/20 border border-[#f60011] flex items-center justify-center shrink-0">
                    <Palette className="w-6 h-6 text-red-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-300 block">2º Pilar • Criação &amp; Divulgação</span>
                    <h4 className="text-xl sm:text-2xl font-black text-white">HUB Studio</h4>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
                  Ferramenta integrada para <strong>criação de posts e carrosséis diretamente no HUB</strong>, aplicando automaticamente a identidade visual da organização e <strong>com acesso direto aos arquivos e fotos armazenados no servidor (Cofre)</strong>.
                </p>
              </div>
              <div className="md:col-span-4 space-y-2 font-sans">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#FFCC00] shrink-0" /> Busca fotos direto no Servidor
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-300 shrink-0" /> Aplica IDV automática do Show
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-[#01f300] shrink-0" /> Publica direto no Feed do HUB
                </div>
              </div>
            </div>
          </div>
        );

      case 15:
        return (
          <div className={`space-y-4 my-2 w-full ${orbitron.className}`}>
            <div className="p-6 rounded-2xl bg-black border-2 border-[#01f300] shadow-[0_0_26px_rgba(1,243,0,0.35)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#01f300]/15 border border-[#01f300] flex items-center justify-center shrink-0">
                    <Database className="w-6 h-6 text-[#01f300]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-[#01f300] block">3º Pilar • Servidor &quot;Drive&quot; da Organização</span>
                    <h4 className="text-xl sm:text-2xl font-black text-white">Cofre Aurtistic</h4>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#01f300]/15 border border-[#01f300]/50 text-[#01f300] text-[10px] font-black uppercase">
                  Drive Próprio &amp; Integrado
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
                {[
                  { title: 'Anotações', desc: 'Registros e atas da equipe', icon: FileText, color: 'text-[#FFCC00]' },
                  { title: 'Fotos', desc: 'Acervo visual para posts e site', icon: Eye, color: 'text-blue-300' },
                  { title: 'Vídeos', desc: 'Gravações de experimentos', icon: Film, color: 'text-red-300' },
                  { title: 'Roteiros', desc: 'Guias de apresentação', icon: BookOpen, color: 'text-[#01f300]' },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div key={item.title} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
                      <IconComp className={`w-5 h-5 ${item.color}`} />
                      <h5 className="text-sm font-black text-white">{item.title}</h5>
                      <p className="text-[11px] text-gray-300">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      {/* CSS Scoped para garantir contraste impecável no Modo Claro dentro dos slides */}
      <style jsx global>{`
        .slide-light-canvas .text-white {
          color: #0f172a !important;
          text-shadow: none !important;
        }
        .slide-light-canvas .text-gray-100,
        .slide-light-canvas .text-gray-200,
        .slide-light-canvas .text-gray-300,
        .slide-light-canvas .text-gray-400,
        .slide-light-canvas .text-blue-100,
        .slide-light-canvas .text-amber-100,
        .slide-light-canvas .text-red-100,
        .slide-light-canvas .text-purple-100 {
          color: #334155 !important;
        }
        .slide-light-canvas .text-blue-300 {
          color: #0f4780 !important;
        }
        .slide-light-canvas .text-red-300 {
          color: #dc2626 !important;
        }
        .slide-light-canvas .text-purple-300 {
          color: #7e22ce !important;
        }
        .slide-light-canvas .text-\[\#01f300\] {
          color: #15803d !important;
        }
        .slide-light-canvas .text-\[\#FFCC00\] {
          color: #b45309 !important;
        }
        .slide-light-canvas .bg-black,
        .slide-light-canvas .bg-black\/85,
        .slide-light-canvas .bg-black\/80,
        .slide-light-canvas .bg-black\/75,
        .slide-light-canvas .bg-black\/60,
        .slide-light-canvas .bg-black\/50,
        .slide-light-canvas .bg-black\/40 {
          background-color: rgba(255, 255, 255, 0.94) !important;
        }
        .slide-light-canvas [class*="bg-gradient-to-"] {
          background-image: linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.92)) !important;
          background-color: #ffffff !important;
        }
        .slide-light-canvas .border-\[\#0F4780\][class*="bg-gradient-to-"] {
          background-image: linear-gradient(135deg, rgba(219, 234, 254, 0.95), rgba(255, 255, 255, 0.98)) !important;
        }
        .slide-light-canvas .border-\[\#FFCC00\][class*="bg-gradient-to-"] {
          background-image: linear-gradient(135deg, rgba(254, 249, 195, 0.92), rgba(255, 255, 255, 0.98)) !important;
        }
        .slide-light-canvas .border-\[\#F14343\][class*="bg-gradient-to-"] {
          background-image: linear-gradient(135deg, rgba(254, 226, 226, 0.92), rgba(255, 255, 255, 0.98)) !important;
        }
        .slide-light-canvas .border-\[\#9D4EDD\][class*="bg-gradient-to-"] {
          background-image: linear-gradient(135deg, rgba(243, 232, 255, 0.95), rgba(255, 255, 255, 0.98)) !important;
        }
        .slide-light-canvas .bg-slate-950 {
          background-color: rgba(255, 251, 235, 0.96) !important;
        }
        .slide-light-canvas .bg-white\/5 {
          background-color: rgba(15, 23, 42, 0.05) !important;
        }
        .slide-light-canvas .bg-white\/10 {
          background-color: rgba(15, 23, 42, 0.08) !important;
        }
        .slide-light-canvas .border-white\/10,
        .slide-light-canvas .border-white\/15,
        .slide-light-canvas .border-white\/20 {
          border-color: rgba(15, 23, 42, 0.14) !important;
        }
        .slide-light-canvas .slide-btn-keep-dark,
        .slide-light-canvas .slide-btn-keep-dark * {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
      `}</style>

      {/* Header Info */}
      <div className="glass-card p-5 sm:p-6 rounded-3xl border border-gray-200 dark:border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-white/95 dark:bg-[#1E1E1E]/90 shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-[#FFCC00]" />
          <div className="w-1/3 bg-[#0F4780]" />
          <div className="w-1/3 bg-[#F14343]" />
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F4780]/10 dark:bg-[#0F4780]/25 text-[#0F4780] dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-2 border border-[#0F4780]/30 dark:border-[#0F4780]/50">
            <Presentation className="w-4 h-4 text-[#0F4780] dark:text-[#FFCC00]" />
            Eixo 4 &amp; Iniciativas • Show de Física ({INICIATIVAS_SLIDES.length} Slides)
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-bukra text-gray-900 dark:text-white tracking-tight uppercase">
            HUB LabDiv • Arquitetura de Iniciativas
          </h2>
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
            Do 4º Eixo do HUB aos Subdomínios Dedicados (Piloto Show de Física: Preview &amp; Bastidores)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-2 shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white font-bold text-xs uppercase tracking-wider border border-gray-300 dark:border-white/20 transition-all shadow-sm font-bukra cursor-pointer"
            title={isSlideDark ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
          >
            {isSlideDark ? <Sun className="w-4 h-4 text-[#FFCC00]" /> : <Moon className="w-4 h-4 text-[#0F4780]" />}
            <span>{isSlideDark ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#0F4780] hover:bg-[#0C3A68] text-white font-bold text-xs uppercase tracking-wider border border-[#1F9FCF]/40 transition-all hover:scale-105 active:scale-95 shadow-md font-bukra cursor-pointer"
            title="Apresentar em Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FFCC00]" /> : <Maximize2 className="w-4 h-4 text-[#FFCC00]" />}
            <span>{isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}</span>
          </button>
        </div>
      </div>

      {/* Main Slide Canvas */}
      <div
        ref={containerRef}
        className={`relative w-full shadow-2xl flex flex-col justify-between group transition-colors duration-300 ${
          !isSlideDark
            ? `slide-light-canvas bg-gradient-to-br from-slate-50 via-white to-blue-50/40 ${isShowIdv ? 'bg-show' : 'bg-science'} text-slate-900`
            : isShowIdv
              ? 'bg-black bg-show text-white'
              : 'bg-[#121212] bg-science text-white'
        } ${
          isFullscreen
            ? 'w-screen h-screen p-6 sm:p-10 lg:p-14 rounded-none border-none overflow-y-auto'
            : 'rounded-3xl min-h-[480px] h-auto border border-gray-300 dark:border-white/15 overflow-hidden'
        }`}
      >
        {/* Top Accent Bar: LabDiv tricolor ou Show Neon */}
        {isShowIdv ? (
          <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
            <div className="w-1/3 bg-[#f60011] shadow-[0_0_10px_#f60011]" />
            <div className="w-1/3 bg-[#002ffe] shadow-[0_0_10px_#002ffe]" />
            <div className="w-1/3 bg-[#01f300] shadow-[0_0_10px_#01f300]" />
          </div>
        ) : (
          <div className="absolute top-0 left-0 right-0 h-1.5 flex z-20">
            <div className="w-1/3 bg-[#FFCC00]" />
            <div className="w-1/3 bg-[#0F4780]" />
            <div className="w-1/3 bg-[#F14343]" />
          </div>
        )}

        {/* Inner Slide Frame (Sem corte em modo reduzido e 100% expandido em Tela Cheia) */}
        <div className={`relative z-10 w-full flex-1 flex flex-col justify-between ${isFullscreen ? 'pt-4 gap-6' : 'p-5 sm:p-8 lg:p-10 pt-7 gap-5'}`}>
          {/* Top Bar dentro do espaço da apresentação (com Tema + Tela Cheia sempre acessíveis) */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`px-3 py-1 rounded-full font-black text-[11px] sm:text-xs uppercase tracking-wider border shadow-sm ${
                  isShowIdv ? orbitron.className : 'font-bukra'
                } ${
                  !isSlideDark
                    ? 'bg-[#0F4780]/10 text-[#0F4780] border-[#0F4780]/30'
                    : currentSlide.accentColor === 'neon-blue'
                      ? 'bg-[#002ffe]/20 text-blue-300 border-[#002ffe]'
                      : currentSlide.accentColor === 'neon-red'
                        ? 'bg-[#f60011]/20 text-red-300 border-[#f60011]'
                        : currentSlide.accentColor === 'neon-green'
                          ? 'bg-[#01f300]/15 text-[#01f300] border-[#01f300]'
                          : currentSlide.accentColor === 'red'
                            ? 'bg-[#F14343]/20 text-[#F14343] border-[#F14343]/40'
                            : currentSlide.accentColor === 'yellow'
                              ? 'bg-[#FFCC00]/20 text-[#FFCC00] border-[#FFCC00]/40'
                              : 'bg-[#0F4780]/30 text-blue-300 border-[#0F4780]/60'
                }`}
              >
                {currentSlide.category}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider border ${
                  !isSlideDark
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-bukra'
                    : isShowIdv
                      ? `bg-black text-white border-[#01f300] shadow-[0_0_8px_rgba(1,243,0,0.3)] ${orbitron.className}`
                      : 'bg-white/10 text-[#FFCC00] border-white/20 font-bukra'
                }`}
              >
                {currentSlide.idvBadge}
              </span>
            </div>

            {/* Controles diretos dentro da área do slide (Claro/Escuro + Tela Cheia + Contador) */}
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={`px-3 py-1.5 rounded-full border text-[11px] sm:text-xs font-black tracking-wider shadow-sm font-bukra ${
                  !isSlideDark
                    ? 'bg-slate-900 text-[#FFCC00] border-slate-700 slide-btn-keep-dark'
                    : 'bg-black/80 border-white/20 text-[#FFCC00]'
                }`}
              >
                SLIDE {currentSlide.id} / {INICIATIVAS_SLIDES.length}
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                  !isSlideDark
                    ? 'bg-white hover:bg-gray-100 text-slate-900 border-gray-300'
                    : 'bg-black/80 hover:bg-white/15 text-[#FFCC00] border-white/20'
                }`}
                title={isSlideDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
                aria-label="Alternar tema claro/escuro"
              >
                {isSlideDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-[#0F4780]" />}
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className={`p-2 rounded-full border transition-all cursor-pointer shadow-sm ${
                  !isSlideDark
                    ? 'bg-white hover:bg-gray-100 text-slate-900 border-gray-300'
                    : 'bg-black/80 hover:bg-white/15 text-white border-white/20'
                }`}
                title={isFullscreen ? 'Sair da Tela Cheia' : 'Expandir em Tela Cheia'}
                aria-label="Alternar tela cheia"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Slide Title & Content (Expande para toda a largura sem cortar o topo) */}
          <div className={`w-full flex-1 flex flex-col justify-center ${isFullscreen ? 'max-w-none px-2 sm:px-6' : 'max-w-full px-1 sm:px-2'}`}>
            <div className="mb-4 sm:mb-6">
              {isShowIdv && (
                <div className={`flex items-center gap-2 text-xs font-black tracking-widest mb-2 ${orbitron.className}`}>
                  <span className={!isSlideDark ? 'text-red-600' : 'text-white'} style={isSlideDark ? { textShadow: '0 0 8px #f60011' } : undefined}>SHOW</span>
                  <span className={!isSlideDark ? 'text-blue-700' : 'text-white'} style={isSlideDark ? { textShadow: '0 0 8px #002ffe' } : undefined}>DE</span>
                  <span className={!isSlideDark ? 'text-emerald-700' : 'text-white'} style={isSlideDark ? { textShadow: '0 0 8px #01f300' } : undefined}>FÍSICA</span>
                </div>
              )}

              <h3
                className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase mb-1.5 ${
                  !isSlideDark ? 'text-slate-900' : 'text-white'
                } ${isShowIdv ? orbitron.className : 'italic font-bukra'}`}
                style={
                  isShowIdv && isSlideDark
                    ? {
                        textShadow:
                          currentSlide.accentColor === 'neon-blue'
                            ? '0 0 12px #002ffe'
                            : currentSlide.accentColor === 'neon-red'
                              ? '0 0 12px #f60011'
                              : '0 0 12px #01f300',
                      }
                    : undefined
                }
              >
                {currentSlide.title}
              </h3>

              {currentSlide.subtitle && (
                <p
                  className={`text-sm sm:text-base lg:text-lg font-bold ${
                    !isSlideDark
                      ? 'text-[#0F4780]'
                      : isShowIdv
                        ? 'text-gray-200'
                        : 'text-[#FFCC00]'
                  }`}
                >
                  {currentSlide.subtitle}
                </p>
              )}
            </div>

            {/* Slide Interactive Content */}
            <div className="w-full">{renderSlideBody()}</div>

            {/* Bottom Links inside Fullscreen */}
            {isFullscreen && currentSlide.links && currentSlide.links.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-gray-300 dark:border-white/10">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            )}
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl backdrop-blur-md border flex items-center justify-center transition-all ${
            !isSlideDark
              ? 'bg-white/90 border-gray-300 text-slate-900'
              : 'bg-black/80 border-white/20 text-white'
          } ${
            currentIndex === 0
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:bg-[#FFCC00] hover:text-black hover:scale-110 opacity-85 group-hover:opacity-100 shadow-xl cursor-pointer'
          }`}
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          disabled={currentIndex === INICIATIVAS_SLIDES.length - 1}
          className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-2xl backdrop-blur-md border flex items-center justify-center transition-all ${
            !isSlideDark
              ? 'bg-white/90 border-gray-300 text-slate-900'
              : 'bg-black/80 border-white/20 text-white'
          } ${
            currentIndex === INICIATIVAS_SLIDES.length - 1
              ? 'opacity-20 cursor-not-allowed'
              : 'hover:bg-[#FFCC00] hover:text-black hover:scale-110 opacity-85 group-hover:opacity-100 shadow-xl cursor-pointer'
          }`}
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails Carousel */}
      <div className="glass-card p-4 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#1E1E1E]/80 shadow-lg">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-2 font-bukra">
            <Presentation className="w-4 h-4 text-[#0F4780] dark:text-[#FFCC00]" />
            Navegação Rápida ({INICIATIVAS_SLIDES.length} Slides • Eixo 4 &amp; Iniciativas)
          </span>
          <span className="text-xs text-[#0F4780] dark:text-[#FFCC00] font-bold font-bukra">
            Slide {currentIndex + 1} de {INICIATIVAS_SLIDES.length}
          </span>
        </div>

        <div
          ref={thumbsRef}
          className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FFCC00]/30"
        >
          {INICIATIVAS_SLIDES.map((slide, idx) => {
            const isActive = idx === currentIndex;
            const slideIsShow = slide.idv === 'show';
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-36 aspect-video rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                  isActive
                    ? slideIsShow
                      ? 'border-[#01f300] scale-105 shadow-[0_0_12px_rgba(1,243,0,0.35)]'
                      : 'border-[#FFCC00] scale-105 shadow-lg shadow-[#FFCC00]/30'
                    : 'border-gray-300 dark:border-white/15 hover:border-gray-400 dark:hover:border-white/40 opacity-75 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-full h-full p-2 flex flex-col justify-between text-left ${
                    !isSlideDark
                      ? slideIsShow
                        ? 'bg-blue-50/90'
                        : 'bg-white'
                      : slideIsShow
                        ? 'bg-black'
                        : 'bg-gradient-to-br from-[#1E1E1E] to-black'
                  }`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider line-clamp-1 ${
                      !isSlideDark
                        ? slideIsShow
                          ? 'text-[#002ffe]'
                          : 'text-[#0F4780] font-bukra'
                        : slideIsShow
                          ? 'text-[#01f300]'
                          : 'text-[#FFCC00] font-bukra'
                    }`}
                  >
                    {slide.idvBadge}
                  </span>
                  <span className={`text-[10px] font-bold line-clamp-2 leading-tight font-bukra ${!isSlideDark ? 'text-slate-900' : 'text-white'}`}>
                    {slide.title}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div
                  className={`absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-black/90 text-[10px] font-bold ${
                    isActive ? 'text-[#FFCC00]' : 'text-white'
                  }`}
                >
                  {slide.id}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Presenter Notes & Direct Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#1E1E1E]/80 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#0F4780] dark:text-[#FFCC00] mb-3 flex items-center gap-2 font-bukra">
            <BookOpen className="w-4 h-4" />
            Resumo do Slide
          </h3>
          <p className="text-gray-700 dark:text-gray-200 font-medium text-sm leading-relaxed mb-4">
            {currentSlide.description}
          </p>

          {currentSlide.links && currentSlide.links.length > 0 && (
            <div className="mt-4 border-t border-gray-200 dark:border-white/10 pt-4">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-bukra">
                Acessos Diretos Relacionados:
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                {currentSlide.links.map((link, idx) => renderButtonLink(link, idx))}
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-white/95 dark:bg-[#1E1E1E]/80 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest text-[#0F4780] dark:text-blue-300 mb-3 flex items-center gap-2 font-bukra">
            <Sparkles className="w-4 h-4 text-[#0F4780] dark:text-[#FFCC00]" />
            Notas de Apresentação
          </h3>
          {currentSlide.notes && currentSlide.notes.length > 0 ? (
            <ul className="space-y-2">
              {currentSlide.notes.map((note, i) => (
                <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 leading-relaxed">
                  <span className="text-[#0F4780] dark:text-[#FFCC00] font-bold text-sm">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">Sem notas adicionais para este slide.</p>
          )}
        </div>
      </div>
    </div>
  );
}
