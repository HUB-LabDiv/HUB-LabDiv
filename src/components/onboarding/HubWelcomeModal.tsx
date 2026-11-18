'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme, type ThemeMode } from '@/hooks/useTheme';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { useAuth } from '@/providers/AuthProvider';
import { useUserRoleNavigation } from '@/hooks/useUserRoleNavigation';
import { runGlobalTour } from '@/lib/tour/tour-runner';
import type { ThemeInitiative } from '@/types';

export const HUB_WELCOME_KEY = 'hub_labdiv_welcome_seen_v1';

const HUB_MODULES_GUIDE = [
  {
    icon: 'groups',
    accent: '#1F9FCF',
    badge: 'Comunidade & Conexão',
    title: 'Social & Interações',
    desc: 'Feed científico com Fluxo, Arte e Logs — e dentro dele as Interações de Emaranhamento Acadêmico e Pergunte a um Cientista.',
    tags: ['Fluxo', 'Arte', 'Emaranhamento', 'Pergunte'],
  },
  {
    icon: 'menu_book',
    accent: '#F14343',
    badge: 'Conhecimento IFUSP',
    title: 'Informativo',
    desc: 'O Grande Colisor com a Wiki viva do IFUSP, mapa de espaços, entidades estudantis e oportunidades interativas.',
    tags: ['Wiki', 'Instituto', 'Interativo'],
  },
  {
    icon: 'calendar_month',
    accent: '#FFCC00',
    badge: 'Rotina & Pesquisa',
    title: 'Ferramentas, Ingresso & Arena',
    desc: 'Grade horária com JúpiterSync para estudantes, guia prático de ingresso na USP e Observatório de Pesquisa.',
    tags: ['Grade Júpiter', 'Ingresso', 'Arena'],
  },
  {
    icon: 'diversity_3',
    accent: '#1F9FCF',
    badge: 'Suporte LabDiv',
    title: 'Gestão & Apoio a Iniciativas',
    desc: 'Espaço do LabDiv para dar suporte operacional e fortalecer a divulgação científica das iniciativas do instituto, para além de produzir ou dar mentorias.',
    tags: ['Apoio Técnico', 'Iniciativas', 'HUB Studio'],
  },
];

const INITIATIVE_THEMES: { id: ThemeInitiative; label: string }[] = [
  { id: 'hub', label: 'Padrão HUB' },
  { id: 'labdiv', label: 'LabDiv' },
  { id: 'show-da-fisica', label: 'Show de Física' },
  { id: 'hs', label: 'Hackerspace' },
  { id: 'profis', label: 'Pró-Física' },
];

export function HubWelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const { themeMode, setThemeMode } = useTheme();
  const { initiativeTheme, setInitiativeTheme } = usePersonalizacaoStore();
  const { profile } = useAuth();
  const { userCategory } = useUserRoleNavigation();

  const allowedInitiatives = useMemo(() => {
    if (!profile) return ['hub'] as ThemeInitiative[];
    if (profile.role === 'admin' || profile.role === 'moderator') {
      return INITIATIVE_THEMES.map((i) => i.id);
    }
    const list: ThemeInitiative[] = ['hub'];
    const memberInits = Array.isArray(profile.member_initiatives)
      ? profile.member_initiatives.map((s: string) => String(s).toLowerCase())
      : [];
    if (profile.is_labdiv || memberInits.includes('labdiv')) list.push('labdiv');
    if (memberInits.some((s: string) => s.includes('show'))) list.push('show-da-fisica');
    if (memberInits.some((s: string) => s === 'hs' || s.includes('hacker'))) list.push('hs');
    if (memberInits.some((s: string) => s.includes('profis'))) list.push('profis');
    return list;
  }, [profile]);

  const visibleInitiatives = INITIATIVE_THEMES.filter((t) => allowedInitiatives.includes(t.id));

  useEffect(() => {
    try {
      const seen = localStorage.getItem(HUB_WELCOME_KEY);
      if (!seen) {
        setIsFirstTime(true);
        setIsOpen(true);
      }
    } catch {}

    const handleOpen = () => {
      setIsFirstTime(false);
      setIsOpen(true);
    };
    window.addEventListener('hub:open-welcome', handleOpen);
    return () => window.removeEventListener('hub:open-welcome', handleOpen);
  }, []);

  const handleClose = (launchTour = isFirstTime) => {
    try {
      localStorage.setItem(HUB_WELCOME_KEY, '1');
    } catch {}
    setIsOpen(false);
    setIsFirstTime(false);
    if (launchTour) {
      setTimeout(() => {
        runGlobalTour(userCategory);
      }, 260);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-black/45 backdrop-blur-[2px] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            className="w-full max-w-3xl bg-white/95 dark:bg-[#0F172A]/95 border border-gray-200 dark:border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="h-1.5 w-full flex">
              <div className="flex-1 bg-[#1F9FCF]" />
              <div className="flex-1 bg-[#FFCC00]" />
              <div className="flex-1 bg-[#F14343]" />
            </div>

            <div className="p-3.5 sm:p-7 space-y-3 sm:space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1F9FCF]/15 border border-[#1F9FCF]/30 text-[#1F9FCF] text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">
                    Guia Rápido • HUB LabDiv
                  </span>
                  <h2 className="text-base sm:text-2xl font-bukra font-black text-gray-900 dark:text-white leading-tight">
                    Como o HUB funciona?
                  </h2>
                  <p className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5 leading-snug">
                    Conheça cada eixo da plataforma antes de explorar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className="p-1.5 sm:p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer shrink-0"
                  aria-label="Fechar"
                >
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
                </button>
              </div>

              {/* Cards M3 refinados e compactos no mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3.5">
                {HUB_MODULES_GUIDE.map((mod) => (
                  <div
                    key={mod.title}
                    style={{
                      background: `linear-gradient(145deg, ${mod.accent}14 0%, transparent 65%)`,
                      borderColor: `${mod.accent}35`,
                    }}
                    className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border flex flex-col justify-between gap-1.5 sm:gap-3 transition-colors"
                  >
                    <div className="space-y-1 sm:space-y-2.5">
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <div
                          style={{
                            backgroundColor: `${mod.accent}20`,
                            borderColor: `${mod.accent}45`,
                            color: mod.accent,
                          }}
                          className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0"
                        >
                          <span className="material-symbols-outlined text-[16px] sm:text-[19px]">{mod.icon}</span>
                        </div>
                        <div className="min-w-0">
                          <span
                            style={{ color: mod.accent }}
                            className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest block leading-none mb-0.5"
                          >
                            {mod.badge}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bukra font-bold text-gray-900 dark:text-white leading-tight truncate">
                            {mod.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-snug sm:leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>

                    <div className="hidden sm:flex flex-wrap gap-1.5 pt-1">
                      {mod.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold text-gray-600 dark:text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Aparência (e Tema de Iniciativa apenas se pertencer à organização) */}
              <div className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 space-y-2 sm:space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Aparência (Automático / Claro / Escuro)
                  </span>
                  <div className="inline-flex gap-1 p-1 rounded-xl bg-gray-200/70 dark:bg-black/40">
                    {(['auto', 'light', 'dark'] as ThemeMode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setThemeMode(m)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                          themeMode === m
                            ? 'bg-[#1F9FCF] text-white'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {m === 'auto' ? 'Auto' : m === 'light' ? 'Claro' : 'Escuro'}
                      </button>
                    ))}
                  </div>
                </div>

                {visibleInitiatives.length > 1 && (
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-1.5">
                      Tema da sua Organização
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {visibleInitiatives.map((it) => (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => setInitiativeTheme(it.id)}
                          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold cursor-pointer border ${
                            initiativeTheme === it.id
                              ? 'bg-[#FFCC00] text-slate-950 border-transparent font-black'
                              : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {it.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
                {!isFirstTime && (
                  <button
                    type="button"
                    onClick={() => handleClose(true)}
                    className="px-4 py-3 rounded-2xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/15 text-gray-800 dark:text-white font-bukra font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
                  >
                    Iniciar Tour Guiado
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] hover:brightness-110 text-white font-bukra font-black text-xs uppercase tracking-wider shadow-lg cursor-pointer"
                >
                  {isFirstTime ? 'Começar Tour Guiado' : 'Continuar no HUB'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
