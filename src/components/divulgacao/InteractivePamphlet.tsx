/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export function InteractivePamphlet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* CAPA FECHADA ESTILO FOLDER FÍSICO IMPRESSO */
          <motion.div
            key="trifold-cover"
            initial={{ opacity: 0, scale: 0.95, rotateY: -10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.95, rotateY: 16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            role="button"
            tabIndex={0}
            aria-label="Abrir panfleto trifold do HUB LabDiv"
            onClick={() => setIsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            className="relative w-full max-w-[330px] aspect-[1/1.414] rounded-r-2xl rounded-l-md shadow-[0_24px_60px_rgba(0,0,0,0.65)] overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0F172A] to-[#121212] border border-white/15 flex flex-col justify-between cursor-pointer group hover:border-[#FFCC00]/60 transition-all"
          >
            {/* Fundo gráfico bg-if.svg + brilhos sutis da IDV */}
            <div
              aria-hidden="true"
              style={{
                backgroundImage: "url('/bg-if.svg')",
                backgroundSize: '720px 720px',
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center',
              }}
              className="absolute inset-0 opacity-[0.26] pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#1F9FCF]/20 blur-2xl pointer-events-none"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-[#FFCC00]/15 blur-2xl pointer-events-none"
            />
            {/* Borda lateral esquerda simétrica à direita */}
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-[#1F9FCF]/30 to-transparent pointer-events-none" />
            {/* Efeito sutil de página dobrada à direita */}
            <div className="absolute inset-y-0 right-0 w-1.5 bg-gradient-to-l from-[#1F9FCF]/30 to-transparent pointer-events-none" />

            {/* Faixa tricolor superior estilo impresso LabDiv */}
            <div className="relative z-10 h-2 w-full flex">
              <div className="flex-1 bg-[#1F9FCF]" />
              <div className="flex-1 bg-[#F14343]" />
              <div className="flex-1 bg-[#FFCC00]" />
            </div>

            <div className="relative z-10 p-6 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7">
                    <Image src="/icone-HUBLabDiv.svg" alt="HUB" fill className="object-contain" />
                  </div>
                  <span className="text-[11px] font-bukra font-black tracking-wider text-white">
                    HUB{' '}
                    <span className="bg-gradient-to-r from-[#1F9FCF] via-[#FFCC00] to-[#F14343] bg-clip-text text-transparent">
                      LabDiv
                    </span>
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-mono uppercase tracking-widest text-[#FFCC00]">
                  IFUSP
                </span>
              </div>

              <div className="space-y-4 text-center my-auto py-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#1F9FCF]/15 border border-[#1F9FCF]/35 text-[10px] font-black uppercase tracking-widest text-[#1F9FCF]">
                  Comunicação Científica
                </span>
                <h2 className="font-bukra text-3xl sm:text-4xl text-white font-black leading-[1.08] tracking-tight">
                  Você entende <br />
                  <span className="text-[#FFCC00]">a USP?</span>
                </h2>
                <p className="font-open-sans text-xs text-gray-200 leading-relaxed max-w-[260px] mx-auto">
                  A aplicação do LabDiv que vai te ajudar a entender a academia e unir a arte com a ciência na{' '}
                  <span className="font-bukra font-black text-[#FFCC00] underline decoration-[#1F9FCF]/80 decoration-2 underline-offset-4 drop-shadow-[0_0_10px_rgba(255,204,0,0.35)]">
                    palma de sua mão
                  </span>
                  .
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-[#FFCC00] bg-[#FFCC00]/10 border border-[#FFCC00]/30 py-2.5 px-4 rounded-xl group-hover:bg-[#FFCC00]/20 transition-colors">
                  <span className="material-symbols-outlined text-[16px]">menu_open</span>
                  <span>Clique para abrir o folder</span>
                </div>
                <p className="text-[9px] text-center font-mono uppercase tracking-widest text-gray-500">
                  LabDiv • Instituto de Física da USP
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* TRIFOLD ABERTO COM 3 DOBRAS E VINCOS DE PAPEL */
          <motion.div
            key="trifold-open"
            initial={{ opacity: 0, scaleX: 0.45 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.45 }}
            transition={{ duration: 0.42, ease: 'easeOut' }}
            className="w-full space-y-4"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.65)] border border-white/15 bg-[#070C16]">
              <div
                aria-hidden="true"
                style={{
                  backgroundImage: "url('/bg-if.svg')",
                  backgroundSize: '720px 720px',
                  backgroundRepeat: 'repeat',
                  backgroundPosition: 'center',
                }}
                className="absolute inset-0 opacity-[0.22] pointer-events-none"
              />
              {/* Faixa tricolor contínua no topo das 3 dobras */}
              <div className="relative z-10 h-2 w-full flex">
                <div className="flex-1 bg-[#1F9FCF]" />
                <div className="flex-1 bg-[#F14343]" />
                <div className="flex-1 bg-[#FFCC00]" />
              </div>

              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-dashed divide-white/15">
                {/* Dobra 1: Social */}
                <div className="p-5 bg-gradient-to-b from-[#0F172A]/70 to-[#121212]/80 flex flex-col justify-between gap-4 relative">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1F9FCF]">
                        Dobra 01
                      </span>
                      <span className="material-symbols-outlined text-[#1F9FCF] text-[22px]">groups</span>
                    </div>
                    <h3 className="text-base font-bukra font-black text-white uppercase">
                      Eixo Social
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Compartilhe experimentos, divulgação científica, fotos e descobertas no <strong>Fluxo</strong> e na aba <strong>Arte</strong>.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-gray-400">
                      <li>• Publicações & Comentários</li>
                      <li>• Logs rápidos da comunidade</li>
                      <li>• Perfis de estudantes e docentes</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#1F9FCF]">
                    Fluxo • Arte • Logs
                  </div>
                </div>

                {/* Dobra 2: Informativo (Centro com sombra sutil de dobra) */}
                <div className="p-5 bg-gradient-to-b from-[#0F172A]/80 to-[#121212]/85 shadow-[inset_10px_0_20px_rgba(0,0,0,0.35),inset_-10px_0_20px_rgba(0,0,0,0.35)] flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F14343]">
                        Dobra 02
                      </span>
                      <span className="material-symbols-outlined text-[#F14343] text-[22px]">menu_book</span>
                    </div>
                    <h3 className="text-base font-bukra font-black text-white uppercase">
                      Grande Colisor
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      A <strong>Wiki oficial do IFUSP</strong> com tudo o que você precisa para se localizar no instituto.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-gray-400">
                      <li>• Guia do Ingressante e Veterano</li>
                      <li>• Mapa, Laboratórios & Entidades</li>
                      <li>• Show de Física & Hackerspace</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#F14343]">
                    Wiki • Instituto • Ingresso
                  </div>
                </div>

                {/* Dobra 3: Ferramentas */}
                <div className="p-5 bg-gradient-to-b from-[#0F172A]/70 to-[#121212]/80 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FFCC00]">
                        Dobra 03
                      </span>
                      <span className="material-symbols-outlined text-[#FFCC00] text-[22px]">construction</span>
                    </div>
                    <h3 className="text-base font-bukra font-black text-white uppercase">
                      Ferramentas
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      Recursos práticos para sua rotina acadêmica, pesquisa e extensão no IFUSP.
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-gray-400">
                      <li>• Grade Horária & JúpiterSync</li>
                      <li>• Arena & Match Acadêmico</li>
                      <li>• Pergunte a um Cientista</li>
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-white/10 text-[10px] font-bold uppercase tracking-wider text-[#FFCC00]">
                    Grade • Arena • Interações
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-gray-200 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">close_fullscreen</span>
                <span>Dobrar panfleto</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
