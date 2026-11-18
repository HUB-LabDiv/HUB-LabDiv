'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre (Licença AGPLv3)
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from "@/components/layout/MainLayoutWrapper";
import {
  GraduationCap,
  BookOpen,
  Users,
  Calendar,
  Sparkles,
  LayoutDashboard,
  Palette,
  ShieldCheck,
  X,
  ExternalLink,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Breadcrumbs } from '@/components/wiki/WikiComponents';
import { AurtisticOrgEmbedFrame } from '@/components/aurtistic/AurtisticOrgEmbedFrame';

export function ProfisClient() {
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [embedMode, setEmbedMode] = useState<'org' | 'studio'>('org');

  return (
    <MainLayoutWrapper fullWidth={true}>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
        <Breadcrumbs
          title="PROFIS (Espaço de Apoio, Pesquisa e Cooperação de Professores de Física)"
          section="Iniciativas de Impacto"
          sectionHref="/gcif/instituto"
          backHref="/gcif/instituto"
        />

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#131a2e] via-[#0d1322] to-[#070b14] border border-amber-500/30 p-8 md:p-12 mb-12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Ensino • Apoio, Pesquisa &amp; Cooperação</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-bukra text-white tracking-tight uppercase">
              PROFIS <span className="text-amber-400 text-xl sm:text-2xl font-normal normal-case block sm:inline">(Espaço de Apoio, Pesquisa e Cooperação)</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              O PROFIS (Espaço de Apoio, Pesquisa e Cooperação de Professores de Física) apoia professores, calouros e graduandos na transição e cooperação acadêmica, oferecendo plantões de dúvidas, monitorias temáticas de Cálculo e Física Básica, além de seminários e nivelamento conceitual.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#eixo4"
                className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Área do Membro (Eixo 4)</span>
              </a>

              <a
                href="https://fep.if.usp.br/~profis/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs md:text-sm border border-white/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <span>Site Oficial ProFis</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Pilares do ProFis */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-[#0b101d] border border-amber-500/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-bukra">Plantões de Cálculo</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitorias semanais para Cálculo Diferencial e Integral I e II, com resolução de listas e reforço pré-provas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b101d] border border-sky-500/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-bukra">Física Básica I a IV</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nivelamento de Mecânica, Termodinâmica, Eletromagnetismo e Óptica para os cursos de Física e engenharias.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b101d] border border-emerald-500/20 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-bukra">Mentoria entre Pares</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acolhimento aos ingressantes, dicas de organização de estudos e integração com a comunidade acadêmica do IFUSP.
            </p>
          </div>
        </section>
      </div>
    </MainLayoutWrapper>
  );
}
