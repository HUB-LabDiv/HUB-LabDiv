// Este programa é um software livre (Licença AGPLv3)
// ARQUIVO: src/app/auth/sso/authorize/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/providers/AuthProvider';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import type { ThemeInstitution } from '@/types';
import { ShieldCheck, CheckCircle2, ArrowRight, X, Lock, Building2 } from 'lucide-react';

const INSTITUTION_CONFIG: Record<
  ThemeInstitution,
  { name: string; bg: string; badge: string; color: string }
> = {
  ifusp: {
    name: 'Física USP (IFUSP)',
    bg: '/bg-if.svg',
    badge: 'Física',
    color: '#0F4780',
  },
  ime: {
    name: 'IME-USP',
    bg: '/bg-ime.svg',
    badge: 'IME',
    color: '#1F9FCF',
  },
  io: {
    name: 'Instituto Oceanográfico (IO)',
    bg: '/bg-io.svg',
    badge: 'IO-USP',
    color: '#0F4780',
  },
  iag: {
    name: 'IAG-USP',
    bg: '/bg-iag.svg',
    badge: 'IAG',
    color: '#F14343',
  },
  igc: {
    name: 'IGc-USP',
    bg: '/bg-igc.svg',
    badge: 'IGc',
    color: '#FFCC00',
  },
};

function SsoAuthorizeContent() {
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  const { institution, setInstitution } = usePersonalizacaoStore();

  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const redirectUri = searchParams.get('redirect_uri') || 'http://localhost:3000/auth/hub-callback';
  const nextTarget = searchParams.get('next') || '/labdiv';

  // Sincroniza com a preferência de instituição do perfil se disponível
  useEffect(() => {
    const userInst = profile?.institution;
    if (userInst && ['ime', 'ifusp', 'io', 'iag', 'igc'].includes(userInst)) {
      if (institution !== userInst) {
        setInstitution(userInst as ThemeInstitution);
      }
    }
  }, [profile?.institution, institution, setInstitution]);

  // Garante os atributos data-institution no html e body para aplicar as regras do globals.css
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-institution', institution);
      if (document.body) {
        document.body.setAttribute('data-institution', institution);
      }
    }
  }, [institution]);

  // Se não estiver logado no HUB, salva o destino e redireciona para a página de login do HUB
  useEffect(() => {
    if (!loading && !user) {
      const currentUrl = window.location.pathname + window.location.search;
      if (typeof document !== 'undefined') {
        document.cookie = `hub_sso_return_url=${encodeURIComponent(currentUrl)}; path=/; max-age=600; SameSite=Lax`;
      }
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem('hub_sso_return_url', currentUrl);
        } catch {}
      }
      window.location.href = `/login?next=${encodeURIComponent(currentUrl)}`;
    }
  }, [loading, user]);

  const handleAuthorize = async () => {
    try {
      setIsAuthorizing(true);
      setErrorMsg(null);

      const res = await fetch('/api/auth/sso/issue-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redirectUri,
          next: nextTarget,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.targetUrl) {
        throw new Error(data.error || 'Falha ao autorizar no servidor.');
      }

      // Redireciona com sucesso de volta para o Aurtistic com o ticket assinado
      window.location.href = data.targetUrl;
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro ao processar autorização.');
      setIsAuthorizing(false);
    }
  };

  const handleCancel = () => {
    try {
      const cancelUrl = new URL(redirectUri);
      cancelUrl.searchParams.set('error', 'access_denied');
      window.location.href = cancelUrl.toString();
    } catch {
      window.location.href = 'http://localhost:3000/login?error=access_denied';
    }
  };

  const activeBg = INSTITUTION_CONFIG[institution]?.bg || '/bg-if.svg';

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div
          className="fixed inset-0 pointer-events-none opacity-40 transition-all duration-700 -z-10"
          style={{
            backgroundImage: `url(${activeBg})`,
            backgroundSize: '1200px 1200px',
            backgroundRepeat: 'repeat',
            backgroundAttachment: 'fixed',
          }}
        />
        <div className="fixed inset-0 bg-[#0A0E17]/75 backdrop-blur-[2px] pointer-events-none -z-10" />
        <div className="w-12 h-12 border-3 border-[#FFCC00] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-white/80">Verificando sessão no HUB LabDiv...</p>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || user.email?.split('@')[0] || 'Pesquisador';
  const userRole = profile?.role === 'admin' ? 'Coordenador / Admin' : 'Pesquisador LabDiv';
  const isLabdivMember = Boolean(profile?.is_labdiv);

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Padrão Científico Dinâmico por Instituição (Física / IME / IO / IAG / IGc) */}
      <div
        key={institution}
        className="fixed inset-0 pointer-events-none opacity-40 dark:opacity-45 transition-all duration-700 -z-10"
        style={{
          backgroundImage: `url(${activeBg})`,
          backgroundSize: '1200px 1200px',
          backgroundRepeat: 'repeat',
          backgroundAttachment: 'fixed',
        }}
      />

      {/* Camada Suave de Profundidade */}
      <div className="fixed inset-0 bg-[#0A0E17]/65 dark:bg-[#0A0E17]/80 backdrop-blur-[2px] pointer-events-none -z-10" />

      {/* Luzes de Fundo com IDV LabDiv */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0F4780]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#F14343]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Seletor Rápido de Fundo / Instituição (Física, IME, IO...) */}
      <div className="mb-4 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-xl shadow-2xl text-xs">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] px-2.5">
          Fundo do HUB:
        </span>
        {(['ifusp', 'ime', 'io', 'iag', 'igc'] as ThemeInstitution[]).map((instKey) => {
          const isSelected = institution === instKey;
          const conf = INSTITUTION_CONFIG[instKey];
          return (
            <button
              key={instKey}
              type="button"
              onClick={() => setInstitution(instKey)}
              className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] text-white shadow-md shadow-[#1F9FCF]/30 scale-105'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {conf.badge}
            </button>
          );
        })}
      </div>

      <div className="relative w-full max-w-lg bg-[#0E1522]/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Barra Superior com Gradiente Tricolor Oficial LabDiv */}
        <div className="h-2 w-full bg-gradient-to-r from-[#0F4780] via-[#F14343] to-[#FFCC00]" />

        <div className="p-6 md:p-8">
          {/* Conexão Visual de Aplicações: HUB ➔ Aurtistic */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 rounded-2xl bg-black/50 border border-white/10 shadow-lg flex items-center justify-center">
              <img src="/icone-HUBLabDiv.svg" alt="HUB LabDiv" className="w-10 h-10 object-contain drop-shadow" />
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#FFCC00]">
              <Lock className="w-3.5 h-3.5" />
              <span>SSO Seguro</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>

            {/* Logo Aurtistic Oficial com Identidade Autêntica */}
            <div className="p-2.5 rounded-2xl bg-black/60 border border-purple-500/40 shadow-[0_0_25px_rgba(157,78,221,0.35)] flex items-center justify-center">
              <img
                src="/aurtistic/icon.png"
                alt="Aurtistic Creative Manager"
                className="w-11 h-11 object-contain drop-shadow-[0_2px_10px_rgba(157,78,221,0.7)]"
              />
            </div>
          </div>

          {/* Título & Descrição */}
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFCC00] bg-[#FFCC00]/10 px-2.5 py-1 rounded-full border border-[#FFCC00]/20">
              Autorização de Acesso Cross-App
            </span>
            <h1 className="text-xl md:text-2xl font-black text-white mt-2.5 tracking-tight flex items-center justify-center gap-2">
              <span>Autorizar</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8E24AA] via-[#1E3D9E] to-[#C7940E]">
                Aurtistic
              </span>
            </h1>
            <p className="text-xs text-white/70 mt-1.5 leading-relaxed max-w-sm mx-auto">
              O aplicativo <strong className="text-white">Aurtistic Creative Manager</strong> está solicitando permissão para sincronizar sua identidade do HUB e suas organizações ativas.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#F14343]/10 border border-[#F14343]/30 text-[#F14343] text-xs flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-[#F14343]" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Card do Usuário Logado */}
          <div className="mb-5 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-black/60 border border-[#FFCC00]/40 shrink-0 flex items-center justify-center">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-white">{displayName.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-white truncate">{displayName}</p>
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0F4780]/80 text-white border border-[#1F9FCF]/40">
                  {userRole}
                </span>
              </div>
              <p className="text-xs text-white/60 truncate mt-0.5">{profile?.email || user.email}</p>
            </div>
          </div>

          {/* Dados que Serão Enviados ao Aurtistic */}
          <div className="mb-6 space-y-2.5">
            <p className="text-[11px] font-bold text-white/80 uppercase tracking-wider mb-2">
              Permissões e Dados Compartilhados:
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white">Identidade e Perfil: </span>
                <span className="text-white/70">Nome, e-mail institucional e avatar para seu perfil no Aurtistic.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <Building2 className="w-4 h-4 text-[#60A5FA] shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white">Organizações e Iniciativas: </span>
                <span className="text-white/70">
                  Acesso confirmado ao <strong className="text-white">Laboratório de Diversidade (LabDiv)</strong>
                  {isLabdivMember ? ' (Membro Confirmado no HUB)' : ''} e sincronização de pautas e tarefas.
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-white">Criptografia e Validade: </span>
                <span className="text-white/70">Ticket assinado via HMAC-SHA256 com validade única de 5 minutos.</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              disabled={isAuthorizing}
              onClick={handleAuthorize}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider text-[#121212] bg-gradient-to-r from-[#FFCC00] to-[#F14343] hover:opacity-95 active:scale-[0.99] transition-all shadow-lg hover:shadow-[0_8px_25px_rgba(255,204,0,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isAuthorizing ? (
                <>
                  <span className="w-4 h-4 border-2 border-transparent border-t-[#121212] rounded-full animate-spin" />
                  <span>Autorizando...</span>
                </>
              ) : (
                <>
                  <span>Autorizar e Ir para o Aurtistic</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isAuthorizing}
              onClick={handleCancel}
              className="w-full sm:w-auto py-3 px-5 rounded-xl text-xs font-bold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SsoAuthorizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-transparent flex items-center justify-center p-4">
          <div className="w-10 h-10 border-2 border-[#FFCC00] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SsoAuthorizeContent />
    </Suspense>
  );
}
