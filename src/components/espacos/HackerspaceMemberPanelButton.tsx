'use client';

import React, { useState } from 'react';
import { Terminal, LayoutDashboard, Palette, X, ShieldCheck } from 'lucide-react';
import { AurtisticOrgEmbedFrame } from '@/components/aurtistic/AurtisticOrgEmbedFrame';

export function HackerspaceMemberPanelButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'org' | 'studio'>('org');

  return (
    <div className="relative overflow-hidden rounded-[32px] bg-black/90 border border-[#00FF66]/40 p-6 md:p-8 shadow-[0_0_30px_rgba(0,255,102,0.12)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66] text-xs font-mono font-bold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5 text-[#00FF66]" />
            <span>[SYSTEM] ÁREA DO MEMBRO • HACKERSPACE</span>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white font-mono uppercase">
            Terminal de Gestão &amp; HUB Studio
          </h3>
          <p className="text-xs md:text-sm text-slate-300 font-mono leading-relaxed">
            Acesso reservado aos membros cadastrados pelo administrador no painel de gestão.
            Membros ativos entram diretamente via SSO do HUB; novos participantes utilizam a chave de acesso.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMode('org');
              setIsModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-[#00FF66] hover:bg-[#33ff85] text-slate-950 font-mono font-black text-xs md:text-sm shadow-lg hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
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
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#00FF66] font-mono font-bold text-xs md:text-sm border border-[#00FF66]/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Palette className="w-4 h-4 text-[#00FF66]" />
            <span>HUB Studio</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-6xl h-[92vh] bg-[#080c09] border border-[#00FF66]/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
            <div className="flex items-center justify-between px-5 py-3.5 bg-black/80 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#00FF66]/20 border border-[#00FF66]/30 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-[#00FF66]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <span>Hackerspace IFUSP • Painel de Gestão</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00FF66]/20 text-[#00FF66] border border-[#00FF66]/30">
                      {mode === 'studio' ? 'HUB Studio' : 'Aurtistic Gestão'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Acesso restrito à equipe credenciada pelo administrador
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
                orgSlug="hs"
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

