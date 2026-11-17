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

import { InteractivePamphlet } from '@/components/divulgacao/InteractivePamphlet';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Já testou o HUB? | HUB LabDiv',
  description: 'Conheça o Hub de Comunicação Científica do Lab-Div e o ecossistema integrado do IFUSP.',
};

const HIGHLIGHTS = [
  {
    icon: 'code',
    color: 'text-[#1F9FCF] bg-[#1F9FCF]/15 border-[#1F9FCF]/30',
    title: '100% Open Source (AGPLv3)',
    desc: 'Código aberto, auditável pela comunidade, sem anúncios, sem rastreadores comerciais e sem venda de dados.',
  },
  {
    icon: 'verified_user',
    color: 'text-[#FFCC00] bg-[#FFCC00]/15 border-[#FFCC00]/30',
    title: 'Feito na USP, para a USP',
    desc: 'Construído por estudantes e divulgadores do IFUSP com login oficial Google Workspace @usp.br.',
  },
  {
    icon: 'smartphone',
    color: 'text-[#F14343] bg-[#F14343]/15 border-[#F14343]/30',
    title: 'Web + App na Play Store',
    desc: 'Use no navegador ou instale no Android com notificações, modo offline e acesso instantâneo.',
  },
  {
    icon: 'hub',
    color: 'text-[#1F9FCF] bg-[#0F4780]/30 border-[#1F9FCF]/30',
    title: 'Ecossistema Integrado',
    desc: 'Conectado ao Aurtistic, Show da Física, Hackerspace e Pró-Física em uma única conta.',
  },
];

export default function DivulgacaoPage() {
  return (
    <main className="min-h-screen bg-[#070b14] text-white relative overflow-hidden font-open-sans">
      {/* Background Decorativo + Padrão Científico Oficial */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          aria-hidden="true"
          style={{
            backgroundImage: "url('/bg-if.svg')",
            backgroundSize: '840px 840px',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
          }}
          className="absolute inset-0 opacity-[0.22]"
        />
        <div className="absolute -top-24 -left-24 w-[440px] h-[440px] bg-[#1F9FCF]/24 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-24 w-[400px] h-[400px] bg-[#F14343]/18 rounded-full blur-[130px]" />
        <div className="absolute -bottom-24 left-1/3 w-[380px] h-[380px] bg-[#FFCC00]/14 rounded-full blur-[130px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-5 sm:space-y-8">
        {/* Topo com Logo à esquerda e Botão Entrar à direita */}
        <header className="flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0">
              <Image
                src="/icone-HUBLabDiv.svg"
                alt="Logo HUB LabDiv"
                fill
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <span className="font-bukra font-black text-base sm:text-xl tracking-tight block leading-none">
                HUB{' '}
                <span className="bg-gradient-to-r from-[#1F9FCF] via-[#FFCC00] to-[#F14343] bg-clip-text text-transparent">
                  LabDiv
                </span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-gray-400 block mt-1 leading-snug">
                Plataforma Oficial de Divulgação &amp; Vida Acadêmica • IFUSP
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] hover:brightness-110 active:scale-[0.98] text-white font-bukra font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-lg shadow-[#1F9FCF]/25 transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[15px] sm:text-[17px] shrink-0">login</span>
            <span className="sm:hidden">Entrar</span>
            <span className="hidden sm:inline">Entrar @usp.br</span>
          </Link>
        </header>

        {/* Hero + Panfleto Interativo */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-12 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <h1 className="text-2xl sm:text-4xl font-bukra font-black tracking-tight leading-tight">
              Tudo do <span className="text-[#1F9FCF]">IFUSP</span> e da{' '}
              <span className="text-[#FFCC00]">Comunicação Científica</span> em um só lugar.
            </h1>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl">
              O <strong>HUB LabDiv</strong> conecta estudantes, pesquisadores, eventos e projetos de extensão
              em um ecossistema aberto, gratuito e feito pela comunidade da Física USP.
            </p>

            {/* CTAs Principais (Explorar + Play Store; Entrar no topo e Sobre no rodapé) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-[#FFCC00] hover:brightness-105 active:scale-[0.98] text-slate-950 font-bukra font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-lg transition-all text-center"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">explore</span>
                <span className="truncate">Explorar</span>
              </Link>

              <a
                href="https://play.google.com/store/apps/details?id=br.usp.ifusp.hublabdiv&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 sm:py-3.5 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 active:scale-[0.98] text-emerald-300 font-bukra font-black text-[11px] sm:text-sm uppercase tracking-wider shadow-lg transition-all text-center"
              >
                <span className="material-symbols-outlined text-[16px] sm:text-[18px] shrink-0">shop</span>
                <span className="truncate">Play Store</span>
              </a>
            </div>

            {/* Bento Grid Compacto dos 4 Diferenciais */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-2">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="p-3 sm:p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-white/20 transition-colors space-y-1.5 sm:space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">{item.icon}</span>
                    </div>
                    <h2 className="text-xs sm:text-sm font-bukra font-bold text-white leading-tight">{item.title}</h2>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-400 leading-snug line-clamp-3 sm:line-clamp-none">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <InteractivePamphlet />
          </div>
        </section>

        {/* Rodapé de Confiança e Saiba Mais */}
        <section className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#FFCC00]">verified_user</span>
            <div>
              <h3 className="text-sm font-bold text-white">Login seguro via Google Workspace USP</h3>
              <p className="text-xs text-gray-400">
                Código aberto (AGPLv3). Seus dados e senha USP nunca são armazenados por nós.
              </p>
            </div>
          </div>
          <Link
            href="/sobre"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white shrink-0 transition-colors"
          >
            <span>Saiba mais</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
