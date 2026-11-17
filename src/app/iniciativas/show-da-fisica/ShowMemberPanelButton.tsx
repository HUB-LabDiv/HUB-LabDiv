'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState } from 'react';
import { Zap, LayoutDashboard, Palette, X, ShieldCheck } from 'lucide-react';
import { AurtisticOrgEmbedFrame } from '@/components/aurtistic/AurtisticOrgEmbedFrame';

export function ShowMemberPanelButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'org' | 'studio'>('org');

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#050512] via-[#090b1e] to-[#04040a] border border-[#002ffe]/40 p-6 md:p-8 shadow-[0_0_30px_rgba(0,47,254,0.15)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#002ffe]/10 border border-[#002ffe]/30 text-blue-300 text-xs font-mono font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-[#01f300]" />
            <span>SF-OPS • ÁREA DO MEMBRO • SHOW DA FÍSICA</span>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white font-bukra uppercase tracking-wider">
            Painel de Gestão &amp; HUB Studio
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-sans">
            Acesso reservado aos membros ativos do Show da Física credenciados pelo administrador.
            Membros entram diretamente via SSO do HUB; novos integrantes utilizam o código de convite da equipe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('org');
              setIsModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#01f300] hover:bg-[#33ff33] text-black font-black text-xs md:text-sm shadow-[0_0_20px_rgba(1,243,0,0.3)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer font-sans"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Acessar Painel do Membro</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('studio');
              setIsModalOpen(true);
            }}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-cyan-300 font-bold text-xs md:text-sm border border-cyan-400/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer font-sans"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>HUB Studio</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] bg-[#050510] border border-[#002ffe]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between px-5 py-3.5 bg-black/80 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#002ffe]/20 border border-[#002ffe]/30 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#01f300]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 font-sans">
                    <span>Painel de Membro Show da Física</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#002ffe]/20 text-blue-300 border border-[#002ffe]/30">
                      {mode === 'studio' ? 'HUB Studio' : 'Aurtistic Gestão'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Equipe credenciada pelo administrador • Auditório Alessandro Volta
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                title="Fechar Painel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <AurtisticOrgEmbedFrame
                orgSlug="show-da-fisica"
                mode={mode}
                heightClassName="h-full"
                allowOrgSwitch={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

