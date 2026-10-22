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

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Network, 
  ChevronRight, 
  Users, 
  FileText, 
  ExternalLink, 
  Sparkles, 
  MessageSquare, 
  Zap, 
  Compass, 
  GraduationCap, 
  Microscope, 
  Layers, 
  ArrowRight
} from 'lucide-react';

type PersonaFilter = 'todos' | 'aluno' | 'professor' | 'curioso';

interface FlowNode {
  id: string;
  name: string;
  category: string;
  color: 'blue' | 'yellow' | 'red' | 'purple';
  route: string;
  shortDesc: string;
  canLeadTo: {
    title: string;
    description: string;
    url?: string;
    badge?: string;
  }[];
  visibleFor: PersonaFilter[];
}

export function HubFlowchartViewer() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaFilter>('todos');
  const [activeBranch, setActiveBranch] = useState<string>('social');

  const branches: FlowNode[] = [
    {
      id: 'social',
      name: 'Eixo Social & Comunicação',
      category: 'Eixo Principal (Azul #0F4780)',
      color: 'blue',
      route: '/',
      shortDesc: 'A porta de entrada do HUB. Foco em comunicação científica dialógica e humanização dos cientistas.',
      visibleFor: ['todos', 'aluno', 'professor', 'curioso'],
      canLeadTo: [
        {
          title: '1. Sub-aba: Fluxo (Feed Principal)',
          description: 'Feed de posts dialógicos. Ao abrir qualquer post, o usuário encontra balões de reflexão (Paulo Freire), quizzes de fixação, narração em áudio, modo foco e fórmulas em LaTeX.',
          url: '/',
          badge: 'Comunicação Científica'
        },
        {
          title: '2. Sub-aba: Registros (Logs Discentes)',
          description: 'Espaço de acolhimento e micro-relatos diários da vida acadêmica. Usuários podem criar desabafos e fazer emendas nos fios de conversa de outros colegas.',
          url: '/?tab=logs',
          badge: 'Vivência Discente'
        },
        {
          title: '3. Sub-aba: Galeria (Artes da Comunidade)',
          description: 'Mural de expressões visuais e artísticas dos cientistas: ilustrações, astrofotografia, modelos 3D e poemas científicos autorais.',
          url: '/?tab=arte',
          badge: 'Expressão Artística'
        }
      ]
    },
    {
      id: 'informativo',
      name: 'Eixo Informativo (CGIF)',
      category: 'Eixo Principal (Vermelho #F14343)',
      color: 'red',
      route: '/gcif',
      shortDesc: 'Central de Gestão e Informação do IFUSP. Desburocratiza e centraliza todo o conhecimento do instituto.',
      visibleFor: ['todos', 'aluno', 'professor', 'curioso'],
      canLeadTo: [
        {
          title: '1. Sub-aba: Wiki CGIF (/gcif/wiki)',
          description: 'Busca rápida de manuais dos cursos, Projetos Político-Pedagógicos (PPPs), editais, regimentos de matrícula e rotas de circulares do campus.',
          url: '/gcif/wiki',
          badge: 'Wiki Unificada'
        },
        {
          title: '2. Sub-aba: Oportunidades & Instituto (/gcif/instituto)',
          description: 'Catálogo dinâmico de bolsas PUB, Iniciação Científica, estágios externos, simpósios, colóquios e iniciativas de extensão do IFUSP.',
          url: '/gcif/instituto',
          badge: 'Mural de Vagas'
        },
        {
          title: '3. Sub-aba: Interativo (/gcif/interativo)',
          description: 'Mapa do campus físico integrado com escaneamento de QR Codes nas portas dos laboratórios do IFUSP, além do Quiz "Teste de Radiação".',
          url: '/gcif/interativo',
          badge: 'Espaço Físico & Quiz'
        }
      ]
    },
    {
      id: 'interacoes',
      name: 'Eixo Interações & Lab Pessoal',
      category: 'Eixo de Conexão (Azul/Amarelo)',
      color: 'purple',
      route: '/interacao',
      shortDesc: 'Espaço para mensagens privadas, consultoria com pesquisadores e personalização da identidade individual.',
      visibleFor: ['todos', 'aluno', 'professor', 'curioso'],
      canLeadTo: [
        {
          title: '1. Sub-aba: Emaranhamento Quântico',
          description: 'Sistema de mensagens privadas diretas (DMs criptografadas) e criação de canais de grupos para estudos ou projetos.',
          url: '/interacao?tab=emaranhamento',
          badge: 'Chat & DMs'
        },
        {
          title: '2. Sub-aba: Pergunte a um Cientista',
          description: 'Formulário onde qualquer pessoa pode enviar dúvidas científicas. A equipe do LabDiv faz a curadoria e encaminha aos pesquisadores especialistas.',
          url: '/interacao?tab=perguntas',
          badge: 'Mentoria & Dúvidas'
        },
        {
          title: '3. Seção: Laboratório Pessoal (Perfil)',
          description: 'Vitrine individual onde o usuário customiza sua bio, links, insígnias de XP, projetos e seleciona sua Constelação de Mundos (Geek, Arte, Computação ou Acadêmico).',
          url: '/interacao?tab=lab',
          badge: 'Identidade & XP'
        }
      ]
    },
    {
      id: 'ferramentas-aluno',
      name: 'Eixo Ferramentas: Aluno',
      category: 'Eixo Ferramentas (Amarelo #FFCC00)',
      color: 'yellow',
      route: '/ferramentas',
      shortDesc: 'Utilitários para a permanência discente: gestão de tempo, acompanhamento curricular e Iniciação Científica.',
      visibleFor: ['todos', 'aluno'],
      canLeadTo: [
        {
          title: '1. Grade Horária Balanceada (1h:1h)',
          description: 'Planejador semanal que calcula automaticamente 1h de estudo individual para cada 1h de aula assistida e gerencia o teto de faltas.',
          url: '/ferramentas',
          badge: 'Cronograma Semestral'
        },
        {
          title: '2. Trilhas de Aprendizagem do Curso',
          description: 'Visualização gráfica do fluxo de disciplinas, pré-requisitos e evolução percentual do curso com sincronização ao JúpiterWeb.',
          url: '/ferramentas/trilhas',
          badge: 'JúpiterWeb Sync'
        },
        {
          title: '3. Match Acadêmico ("Quero uma IC")',
          description: 'Conexão direta de alunos a pesquisadores que oferecem bolsas de IC, além do programa de adoção onde veteranos mentoram calouros.',
          url: '/ferramentas/match',
          badge: 'Match & Mentoria'
        }
      ]
    },
    {
      id: 'ferramentas-professor',
      name: 'Eixo Ferramentas: Professor / Pesquisador',
      category: 'Eixo Ferramentas (/arena)',
      color: 'red',
      route: '/arena',
      shortDesc: 'Aba exclusiva para docentes e pesquisadores divulgarem suas pesquisas e captarem novos alunos.',
      visibleFor: ['todos', 'professor'],
      canLeadTo: [
        {
          title: '1. Observatório de Linhas de Pesquisa',
          description: 'Vitrine pública onde o pesquisador cadastra seus temas de estudo, laboratórios associados e publicações recentes do IFUSP.',
          url: '/arena',
          badge: 'Vitrine Científica'
        },
        {
          title: '2. Gestão de Vagas no Match Acadêmico',
          description: 'Área onde orientadores publicam ofertas de IC e avaliam cartas de interesse e perfis de alunos candidatos.',
          url: '/ferramentas/match',
          badge: 'Captação de Talentos'
        },
        {
          title: '3. Arena de Desafios & Problemas',
          description: 'Espaço para professores proporem problemas científicos abertos ou desafios matemáticos para estimular a reflexão discente.',
          url: '/arena',
          badge: 'Desafios Acadêmicos'
        }
      ]
    },
    {
      id: 'ferramentas-curioso',
      name: 'Eixo Ferramentas: Curioso / Sociedade',
      category: 'Eixo Ferramentas (/ingresso)',
      color: 'yellow',
      route: '/ingresso',
      shortDesc: 'Aba de acolhimento para vestibulandos e a sociedade civil compreenderem e acessarem a universidade.',
      visibleFor: ['todos', 'curioso'],
      canLeadTo: [
        {
          title: '1. Portal Como Ingressar na USP',
          description: 'Guia consolidado de todas as vias de acesso: FUVEST, ENEM-USP, Provão Paulista Seriado e Olimpíadas Científicas.',
          url: '/ingresso',
          badge: 'Vias de Ingresso'
        },
        {
          title: '2. Dicas IFUSP 101 & Desmistificação',
          description: 'Orientação de vivência no campus, acolhimento de calouros, desmistificação de notas de corte e benefícios de permanência estudantil.',
          url: '/ingresso',
          badge: 'Guia do Calouro'
        },
        {
          title: '3. Constelações de Mundos',
          description: 'Mecanismo que adapta termos técnicos para o repertório do leitor, utilizando analogias de Games, Artes ou Tecnologia.',
          url: '/interacao?tab=lab',
          badge: 'Tradução Cultural'
        }
      ]
    },
    {
      id: 'transversal',
      name: 'Ações Globais Transversais',
      category: 'Ações Sistêmicas',
      color: 'blue',
      route: '/enviar',
      shortDesc: 'Funcionalidades acessíveis a partir de qualquer página da plataforma através da barra de navegação.',
      visibleFor: ['todos', 'aluno', 'professor', 'curioso'],
      canLeadTo: [
        {
          title: '🚀 Lançar à Órbita (/enviar)',
          description: 'Formulário em 5 etapas para submissão de postagens científicas com balões de Paulo Freire, tags e quizzes de fixação.',
          url: '/enviar',
          badge: 'Submissão'
        },
        {
          title: '🔍 Busca Global Rápida (Ctrl + K)',
          description: 'Buscador instantâneo que pesquisa posts, termos da Wiki, manuais, professores e ferramentas de uma só vez.',
          url: '/',
          badge: 'Omnisearch'
        },
        {
          title: '📊 Apresentação do HUB (/apresentacao)',
          description: 'Acesso aos slides institucionais (Reunião), slides de aula prática e documentação completa em texto.',
          url: '/apresentacao',
          badge: 'Slides Institucionais'
        }
      ]
    }
  ];

  const filteredBranches = branches.filter((branch) =>
    selectedPersona === 'todos' ? true : branch.visibleFor.includes(selectedPersona)
  );

  const currentActiveBranch = branches.find((b) => b.id === activeBranch) || branches[0];

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* Top Banner do Fluxograma */}
      <div className="glass-card p-6 rounded-3xl border border-white/15 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden bg-[#1E1E1E]/90">
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="w-1/3 bg-[#FFCC00]"></div>
          <div className="w-1/3 bg-[#0F4780]"></div>
          <div className="w-1/3 bg-[#F14343]"></div>
        </div>

        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-yellow/15 text-brand-yellow text-xs font-black uppercase tracking-wider mb-2 border border-brand-yellow/30 font-bukra">
            <Network className="w-4 h-4" />
            Fluxograma Interativo de Interações do HUB
          </div>
          <h2 className="text-2xl md:text-3xl font-black font-bukra text-white tracking-tight uppercase">
            Mapa de Navegação &amp; Rotas da Plataforma
          </h2>
          <p className="text-xs md:text-sm text-gray-300 mt-1 font-medium">
            Entro no HUB e posso ir até X: se clico em X, posso navegar para Y, Z e acionar interações profundas.
          </p>
        </div>

        {/* Persona Filter Switches */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10 shrink-0 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-2 font-bukra hidden sm:inline-block">
            Filtrar Persona:
          </span>
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'aluno', label: 'Aluno' },
            { id: 'professor', label: 'Professor' },
            { id: 'curioso', label: 'Curioso' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedPersona(item.id as PersonaFilter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all font-bukra ${
                selectedPersona === item.id
                  ? 'bg-brand-yellow text-black shadow-md shadow-brand-yellow/30 scale-105'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Simulator Path Breadcrumb Box */}
      <div className="glass-card p-4 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 flex items-center gap-3 flex-wrap text-xs font-medium">
        <span className="px-2.5 py-1 rounded-lg bg-white/10 text-brand-yellow font-black uppercase font-bukra text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
          Simulador de Rota:
        </span>
        <div className="flex items-center gap-2 text-gray-300 flex-wrap">
          <span className="text-white font-bold">1. Entrada no HUB (/)</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span className="text-brand-blue-accent font-bold">2. Escolho {currentActiveBranch.name}</span>
          <ArrowRight className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
          <span className="text-gray-200 font-semibold">3. Posso navegar por {currentActiveBranch.canLeadTo.length} sub-níveis de ação</span>
        </div>
      </div>

      {/* Main Grid: Interactive Branches List & Detailed Exploration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Branch Selectors */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-2 font-bukra">
            Selecione uma Aba / Eixo de Entrada:
          </h3>

          <div className="flex flex-col gap-2.5">
            {filteredBranches.map((branch) => {
              const isSelected = branch.id === currentActiveBranch.id;
              const colorClasses = {
                blue: 'border-brand-blue/50 bg-brand-blue/15 text-brand-blue-accent',
                red: 'border-brand-red/50 bg-brand-red/15 text-brand-red',
                yellow: 'border-brand-yellow/50 bg-brand-yellow/15 text-brand-yellow',
                purple: 'border-indigo-500/50 bg-indigo-500/15 text-indigo-300'
              }[branch.color];

              return (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between gap-4 group ${
                    isSelected
                      ? `border-brand-yellow bg-[#1E1E1E] shadow-xl shadow-brand-yellow/15 scale-102 ring-1 ring-brand-yellow`
                      : 'border-white/10 bg-[#161616]/80 hover:bg-[#1E1E1E] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${colorClasses}`}>
                      {branch.id.includes('social') && <Users className="w-4 h-4" />}
                      {branch.id.includes('informativo') && <FileText className="w-4 h-4" />}
                      {branch.id.includes('interacoes') && <MessageSquare className="w-4 h-4" />}
                      {branch.id.includes('aluno') && <GraduationCap className="w-4 h-4" />}
                      {branch.id.includes('professor') && <Microscope className="w-4 h-4" />}
                      {branch.id.includes('curioso') && <Compass className="w-4 h-4" />}
                      {branch.id.includes('transversal') && <Zap className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block font-bukra">
                        {branch.category}
                      </span>
                      <h4 className="text-sm font-black text-white font-bukra leading-tight group-hover:text-brand-yellow transition-colors">
                        {branch.name}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                        {branch.shortDesc}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
                    isSelected ? 'text-brand-yellow translate-x-1' : 'text-gray-500 group-hover:text-white'
                  }`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Interaction Map of the Active Branch */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="glass-card p-6 rounded-3xl border border-white/15 bg-[#1E1E1E]/95 shadow-2xl">
            
            {/* Header of Active Branch */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-brand-yellow font-bukra">
                  {currentActiveBranch.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-bukra text-white uppercase italic tracking-tight mt-1">
                  Se clico em: {currentActiveBranch.name}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  {currentActiveBranch.shortDesc}
                </p>
              </div>

              {currentActiveBranch.route && (
                <Link
                  href={currentActiveBranch.route}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-black font-black text-xs uppercase tracking-wider hover:bg-[#e6b800] transition-all hover:scale-105 active:scale-95 shadow-lg shrink-0 font-bukra"
                >
                  <span>Abrir na Plataforma</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* List of sub-interactions */}
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 font-bukra flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-blue-accent" />
              Sub-rotas e Ações Disponíveis a partir desta aba:
            </h4>

            <div className="space-y-3.5">
              {currentActiveBranch.canLeadTo.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4.5 rounded-2xl bg-black/60 border border-white/10 hover:border-brand-yellow/40 transition-all p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="w-5 h-5 rounded-full bg-brand-yellow/20 text-brand-yellow text-[11px] font-black flex items-center justify-center shrink-0 font-bukra">
                        {idx + 1}
                      </span>
                      <h5 className="text-sm font-bold text-white font-bukra group-hover:text-brand-yellow transition-colors">
                        {item.title}
                      </h5>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue-accent text-[10px] font-black uppercase border border-brand-blue/40 font-bukra">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed font-sans pl-7">
                      {item.description}
                    </p>
                  </div>

                  {item.url && (
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-semibold shrink-0 transition-colors self-end sm:self-center border border-white/10"
                    >
                      <span>Acessar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Micro Explanatory Footer */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <span>Navegação PWA com persistência de estado e roteamento instantâneo.</span>
              <span className="text-brand-yellow font-bold">LabDiv IFUSP</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
