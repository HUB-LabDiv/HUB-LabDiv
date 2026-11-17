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

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Search,
  Copy,
  Check,
  KeyRound,
  ExternalLink,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/providers/AuthProvider';
import { AurtisticOrgEmbedFrame } from '@/components/aurtistic/AurtisticOrgEmbedFrame';


export type GestaoTab = 'moderacao' | 'studio' | 'admin';
export type OrgSlug = 'labdiv' | 'show-da-fisica' | 'profis' | 'hs';
export type AdminSubModule = 'escolha' | 'orgs';

interface ProfileRow {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  role: string | null;
  is_labdiv: boolean | null;
  member_initiatives: string[] | null;
}

export interface OrgCardDefinition {
  slug: OrgSlug;
  label: string;
  badge: string;
  subtitle: string;
  primaryColor: string;
  accentColor: string;
  badgeStyle: string;
  activeRing: string;
  glowOverlay: string;
}

export const ORG_OPTIONS: OrgCardDefinition[] = [
  {
    slug: 'labdiv',
    label: 'LabDiv IFUSP',
    badge: '•• LABDIV',
    subtitle: 'Comunicação Científica & Divulgação',
    primaryColor: '#1F9FCF',
    accentColor: '#0F4780',
    badgeStyle: 'border-[#1F9FCF]/40 bg-[#1F9FCF]/10 text-[#1F9FCF]',
    activeRing: 'ring-2 ring-[#1F9FCF] shadow-[0_0_25px_rgba(31,159,207,0.28)] border-[#1F9FCF]/60',
    glowOverlay: 'from-[#1F9FCF]/10 via-[#0F4780]/20 to-transparent',
  },
  {
    slug: 'show-da-fisica',
    label: 'Show da Física',
    badge: '⚡ SHOW DA FÍSICA',
    subtitle: 'Bastidores, Aparatos & Telão Ao Vivo',
    primaryColor: '#01F300',
    accentColor: '#002FFE',
    badgeStyle: 'border-[#01f300]/40 bg-[#01f300]/10 text-[#01f300]',
    activeRing: 'ring-2 ring-[#01f300] shadow-[0_0_25px_rgba(1,243,0,0.25)] border-[#01f300]/60',
    glowOverlay: 'from-[#01f300]/10 via-[#002ffe]/10 to-transparent',
  },
  {
    slug: 'profis',
    label: 'Pró-Física (ProFis)',
    badge: '🔬 PROFIS',
    subtitle: 'Ensino, Nivelamento & Pesquisa',
    primaryColor: '#FFCC00',
    accentColor: '#F59E0B',
    badgeStyle: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
    activeRing: 'ring-2 ring-amber-400 shadow-[0_0_25px_rgba(255,204,0,0.25)] border-amber-400/60',
    glowOverlay: 'from-amber-500/10 via-orange-950/20 to-transparent',
  },
  {
    slug: 'hs',
    label: 'Hackerspace IFUSP',
    badge: '>_ HS',
    subtitle: 'Cultura Maker, Eletrônica & Oficina',
    primaryColor: '#00FF66',
    accentColor: '#06B6D4',
    badgeStyle: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-400',
    activeRing: 'ring-2 ring-emerald-400 shadow-[0_0_25px_rgba(0,255,102,0.25)] border-emerald-400/60',
    glowOverlay: 'from-emerald-500/10 via-teal-950/20 to-transparent',
  },
];

function normalizeTab(raw: string | null): GestaoTab {
  if (raw === 'admin') return 'admin';
  if (raw === 'studio') return 'studio';
  return 'moderacao';
}

function normalizeOrg(raw: string | null): OrgSlug {
  if (raw === 'show-da-fisica' || raw === 'show_da_fisica') return 'show-da-fisica';
  if (raw === 'profis' || raw === 'pro-fis' || raw === 'pro_fis') return 'profis';
  if (raw === 'hs' || raw === 'hackerspace') return 'hs';
  return 'labdiv';
}

export function GestaoClient({
  isAdmin,
  initialTab,
  initialOrg,
}: {
  isAdmin: boolean;
  initialTab: GestaoTab;
  initialOrg: OrgSlug;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { profile } = useAuth();
  const [extraUserInits, setExtraUserInits] = useState<string[]>([]);

  const [fallbackTab, setFallbackTab] = useState<GestaoTab>(() => {
    if (typeof window !== 'undefined' && !searchParams.get('tab')) {
      try {
        const stored = localStorage.getItem('hub_last_gestao_tab');
        if (stored) return normalizeTab(stored);
      } catch {}
    }
    return initialTab;
  });
  const [fallbackOrg, setFallbackOrg] = useState<OrgSlug>(() => {
    if (typeof window !== 'undefined' && !searchParams.get('org')) {
      try {
        const stored = localStorage.getItem('hub_last_gestao_org');
        if (stored) return normalizeOrg(stored);
      } catch {}
    }
    return initialOrg;
  });
  const paramTab = searchParams.get('tab');
  const paramOrg = searchParams.get('org');
  const activeTab: GestaoTab = paramTab ? normalizeTab(paramTab) : fallbackTab;
  const selectedOrg: OrgSlug = paramOrg ? normalizeOrg(paramOrg) : fallbackOrg;
  const [adminSubModule, setAdminSubModule] = useState<AdminSubModule>('escolha');

  // Modal para entrar com código
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [isSubmittingCode, setIsSubmittingCode] = useState(false);

  // Matriz de Credenciamento
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [inviteCodes, setInviteCodes] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleTabChange = (nextTab: GestaoTab) => {
    setFallbackTab(nextTab);
    try {
      localStorage.setItem('hub_last_gestao_tab', nextTab);
    } catch {}
    router.replace(`/gestao?tab=${nextTab}&org=${selectedOrg}`, { scroll: false });
  };

  const handleOrgChange = (nextOrg: OrgSlug) => {
    setFallbackOrg(nextOrg);
    try {
      localStorage.setItem('hub_last_gestao_org', nextOrg);
    } catch {}
    router.replace(`/gestao?tab=${activeTab}&org=${nextOrg}`, { scroll: false });
  };

  // Verifica se o usuário logado pertence à organização
  const isMemberOfOrg = useCallback(
    (slug: OrgSlug): boolean => {
      if (isAdmin) return true;
      const role = profile?.role;
      if (role === 'admin' || role === 'moderator') return true;
      const inits = [
        ...(Array.isArray(profile?.member_initiatives) ? profile.member_initiatives : []),
        ...extraUserInits,
      ];
      if (slug === 'labdiv') return Boolean(profile?.is_labdiv || inits.includes('labdiv'));
      if (slug === 'show-da-fisica')
        return inits.includes('show_da_fisica') || inits.includes('show-da-fisica');
      if (slug === 'profis')
        return inits.includes('profis') || inits.includes('pro-fis') || inits.includes('pro_fis');
      if (slug === 'hs') return inits.includes('hs') || inits.includes('hackerspace');
      return false;
    },
    [isAdmin, profile, extraUserInits]
  );

  const fetchMemberships = useCallback(
    async (query: string) => {
      if (!isAdmin) return;
      setLoadingProfiles(true);
      try {
        const res = await fetch(`/api/admin/org-memberships?q=${encodeURIComponent(query)}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (data?.ok) {
          setProfiles(data.profiles || []);
          setInviteCodes(data.inviteCodes || {});
        }
      } catch {
        // ignora erro transitório
      } finally {
        setLoadingProfiles(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    if (activeTab !== 'admin' || !isAdmin) return;
    const timer = setTimeout(() => {
      void fetchMemberships('');
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab, isAdmin, fetchMemberships]);

  const handleToggleMembership = async (
    profileId: string,
    orgSlug: OrgSlug,
    currentVal: boolean
  ) => {
    const nextVal = !currentVal;
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id !== profileId) return p;
        const inits = Array.isArray(p.member_initiatives) ? p.member_initiatives : [];
        if (orgSlug === 'labdiv') {
          return {
            ...p,
            is_labdiv: nextVal,
            member_initiatives: nextVal
              ? Array.from(new Set([...inits, 'labdiv']))
              : inits.filter((i) => i !== 'labdiv'),
          };
        }
        const key =
          orgSlug === 'show-da-fisica'
            ? 'show_da_fisica'
            : orgSlug === 'profis'
              ? 'profis'
              : orgSlug;
        return {
          ...p,
          member_initiatives: nextVal
            ? Array.from(new Set([...inits, key]))
            : inits.filter((i) => i !== key && i !== orgSlug),
        };
      })
    );

    const res = await fetch('/api/admin/org-memberships', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileId, orgSlug, enabled: nextVal }),
    });
    const data = await res.json();
    if (data?.ok) {
      toast.success('Credenciamento atualizado!');
    } else {
      toast.error(data?.error || 'Erro ao atualizar vínculo.');
      fetchMemberships(searchQuery);
    }
  };

  const handleCopyCode = (slug: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(slug);
    toast.success(`Código de convite copiado: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleOpenJoinCode = (_slug: OrgSlug, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setInviteCodeInput('');
    setIsCodeModalOpen(true);
  };

  const handleSubmitJoinCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) {
      toast.error('Informe o código de acesso.');
      return;
    }

    setIsSubmittingCode(true);
    try {
      const res = await fetch('/api/iniciativas/join-by-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inviteCodeInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || 'Código inválido ou expirado.');
      }

      toast.success(data?.message || 'Acesso credenciado com sucesso!');
      setIsCodeModalOpen(false);
      setInviteCodeInput('');
      if (data?.orgSlug) {
        const canonical = data.orgSlug as OrgSlug;
        setFallbackOrg(canonical);
        router.replace(`/gestao?tab=${activeTab}&org=${canonical}`, { scroll: false });
        setExtraUserInits((prev) => [
          ...prev,
          canonical,
          canonical === 'show-da-fisica' ? 'show_da_fisica' : canonical,
        ]);
      }
      router.refresh();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Falha ao validar código.');
    } finally {
      setIsSubmittingCode(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Cabeçalho Eixo 4 — Governança & Bastidores */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c101d] via-[#080b14] to-[#04060b] border border-white/10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1F9FCF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#0F4780]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-open-sans font-bold tracking-widest text-[#1F9FCF] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>Eixo 4 • Governança, Bastidores & Operações</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bukra font-black uppercase tracking-tight text-white mt-2">
              Central de Gestão
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-1 leading-relaxed">
              Moderação das 4 organizações institucionais integradas ao Ecossistema Aurtistic e Painel
              Administrativo com controle de membros e credenciais.
            </p>
          </div>

          {/* Seletor Principal de Abas do Eixo 4 */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl">
            <button
              type="button"
              onClick={() => handleTabChange('moderacao')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bukra font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'moderacao'
                  ? 'bg-gradient-to-r from-[#0F4780] to-[#1F9FCF] text-white shadow-lg shadow-[#0F4780]/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Bastidores Operacionais
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('studio')}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bukra font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'studio'
                  ? 'bg-[#1F9FCF] text-slate-950 font-black shadow-lg shadow-[#1F9FCF]/25'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Palette className="w-4 h-4" />
              HUB Studio — Comunicação & Posts
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleTabChange('admin')}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bukra font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-[#FFCC00] text-slate-950 font-black shadow-lg shadow-[#FFCC00]/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Painel Adm
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Aba 1 / Aba Studio: Organizações & HUB Studio */}
      {(activeTab === 'moderacao' || activeTab === 'studio') && (
        <div className="space-y-6">
          {/* Barra Compacta das 4 Organizações com IDV */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-2">
              {ORG_OPTIONS.map((org) => {
                const isSelected = selectedOrg === org.slug;
                const isMember = isMemberOfOrg(org.slug);

                return (
                  <button
                    key={org.slug}
                    type="button"
                    onClick={() => handleOrgChange(org.slug)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? `${org.activeRing} bg-white/10 text-white font-black`
                        : 'border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                    title={`${org.label} — ${org.subtitle}`}
                  >
                    <span
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: org.primaryColor }}
                    />
                    <span>{org.badge}</span>
                    {isMember && (
                      <span className="text-[10px] text-emerald-400 font-bold ml-0.5">✓</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handleOpenJoinCode(selectedOrg)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold text-[#1F9FCF] hover:text-white hover:bg-[#1F9FCF]/15 border border-[#1F9FCF]/25 transition-all cursor-pointer ml-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Código de Acesso</span>
            </button>
          </div>

          {/* Moldura Iframe Integrada ao Aurtistic (com suporte a Studio e Org) */}
          <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-black">
            <AurtisticOrgEmbedFrame
              orgSlug={selectedOrg}
              mode={activeTab === 'studio' ? 'studio' : 'org'}
              allowOrgSwitch={false}
              heightClassName="h-[880px]"
              hideInternalBar={true}
            />
          </div>
        </div>
      )}

      {/* Aba 2: Escolha entre moderar organizações ou atalho p/ o painel ADM oficial (/admin) */}
      {activeTab === 'admin' && isAdmin && (
        <div className="space-y-6">
          {adminSubModule === 'escolha' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdminSubModule('orgs')}
                className="text-left p-6 rounded-3xl bg-[#121724] border border-white/10 hover:border-[#1F9FCF]/60 transition-all cursor-pointer space-y-3 shadow-xl"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1F9FCF] uppercase">
                  <KeyRound className="w-4 h-4" />
                  Moderar organizações
                </div>
                <p className="text-sm text-gray-300">
                  Códigos de convite, credenciamento e cargos dos membros das organizações institucionais.
                </p>
                <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-lg bg-white/5 text-gray-400">
                  Mais ferramentas de moderação • em breve
                </span>
              </button>

              <Link
                href="/admin"
                className="block p-6 rounded-3xl bg-[#121724] border border-white/10 hover:border-[#FFCC00]/60 transition-all space-y-3 shadow-xl"
              >
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#FFCC00] uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  Acesso Moderador / ADM do HUB
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </div>
                <p className="text-sm text-gray-300">
                  Abre o painel administrativo oficial do HUB, com autenticação e restrições de acesso próprias.
                </p>
              </Link>
            </div>
          )}

          {adminSubModule === 'orgs' && (
            <button
              type="button"
              onClick={() => setAdminSubModule('escolha')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 text-gray-300 hover:bg-white/10 cursor-pointer"
            >
              ← Voltar
            </button>
          )}

          {adminSubModule === 'orgs' && (
            <div className="space-y-5">
              {/* Códigos de Convite das 4 Organizações */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {ORG_OPTIONS.map((org) => {
                  const fallbackCode =
                    org.slug === 'labdiv'
                      ? 'LABDIV-IFUSP-2026'
                      : org.slug === 'show-da-fisica'
                        ? 'SHOW-FISICA-2026'
                        : org.slug === 'profis'
                          ? 'PROFIS-IFUSP-2026'
                          : 'HACKERSPACE-IFUSP';
                  const code = inviteCodes[org.slug] || fallbackCode;

                  return (
                    <div
                      key={org.slug}
                      className="p-4 rounded-2xl bg-[#141A28] border border-white/10 flex items-center justify-between gap-3 shadow-lg"
                    >
                      <div>
                        <span className="text-[10px] font-mono uppercase text-gray-400 flex items-center gap-1">
                          <KeyRound className="w-3 h-3 text-[#1F9FCF]" />
                          {org.badge}
                        </span>
                        <p className="font-mono font-black text-sm text-white mt-1">{code}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(org.slug, code)}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 cursor-pointer transition-colors"
                        title="Copiar código de acesso"
                      >
                        {copiedCode === org.slug ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Busca e Tabela de Membros com as 4 Organizações */}
              <div className="p-6 rounded-3xl bg-[#121724] border border-white/10 space-y-4 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-brand-blue/20 text-[#1F9FCF]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bukra font-black text-white">
                        Matriz de Credenciamento de Organizações
                      </h2>
                      <p className="text-xs text-gray-400">
                        Defina com 1 clique quais usuários têm acesso direto aos Bastidores e Studio de
                        cada organização.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      fetchMemberships(searchQuery);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar nome ou e-mail..."
                        className="pl-9 pr-3 py-2 text-xs rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#1F9FCF]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#1F9FCF] hover:bg-[#198BB5] text-slate-950 text-xs font-black cursor-pointer transition-colors"
                    >
                      Buscar
                    </button>
                  </form>
                </div>

                {loadingProfiles ? (
                  <div className="py-12 flex flex-col items-center justify-center text-gray-400 gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1F9FCF]" />
                    <span className="text-xs font-mono">Carregando usuários do HUB...</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/10 text-gray-400 uppercase font-mono text-[10px]">
                          <th className="py-3 pr-4">Usuário</th>
                          <th className="py-3 px-3 text-center">LabDiv</th>
                          <th className="py-3 px-3 text-center">Show da Física</th>
                          <th className="py-3 px-3 text-center">Pró-Física</th>
                          <th className="py-3 px-3 text-center">Hackerspace</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {profiles.map((p) => {
                          const inits = Array.isArray(p.member_initiatives)
                            ? p.member_initiatives
                            : [];
                          const isLabdiv = Boolean(p.is_labdiv || inits.includes('labdiv'));
                          const isShow =
                            inits.includes('show_da_fisica') || inits.includes('show-da-fisica');
                          const isProfis =
                            inits.includes('profis') ||
                            inits.includes('pro-fis') ||
                            inits.includes('pro_fis');
                          const isHs = inits.includes('hs') || inits.includes('hackerspace');

                          return (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 pr-4">
                                <p className="font-bold text-white">
                                  {p.full_name || p.username || 'Sem Nome'}
                                </p>
                                <p className="text-[11px] text-gray-500">{p.email}</p>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMembership(p.id, 'labdiv', isLabdiv)}
                                  className={`px-3 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-colors ${
                                    isLabdiv
                                      ? 'bg-[#1F9FCF]/20 border-[#1F9FCF] text-[#1F9FCF]'
                                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                                  }`}
                                >
                                  {isLabdiv ? 'Membro' : 'Liberar'}
                                </button>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleMembership(p.id, 'show-da-fisica', isShow)
                                  }
                                  className={`px-3 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-colors ${
                                    isShow
                                      ? 'bg-[#01f300]/20 border-[#01f300] text-[#01f300]'
                                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                                  }`}
                                >
                                  {isShow ? 'Membro' : 'Liberar'}
                                </button>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMembership(p.id, 'profis', isProfis)}
                                  className={`px-3 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-colors ${
                                    isProfis
                                      ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                                  }`}
                                >
                                  {isProfis ? 'Membro' : 'Liberar'}
                                </button>
                              </td>
                              <td className="py-3.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleMembership(p.id, 'hs', isHs)}
                                  className={`px-3 py-1 rounded-lg font-bold text-[11px] border cursor-pointer transition-colors ${
                                    isHs
                                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white'
                                  }`}
                                >
                                  {isHs ? 'Membro' : 'Liberar'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Modal / Dialog para Entrar com Código de Acesso */}
      {isCodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0c1220] border border-white/15 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#1F9FCF] uppercase">
                <KeyRound className="w-4 h-4" />
                <span>Credenciamento Institucional</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCodeModalOpen(false)}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bukra font-black text-white">
                Ingressar em Organização
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Insira o código de acesso da equipe fornecido pelo administrador ou monitor
                responsável para liberar os Bastidores e o Studio.
              </p>
            </div>

            <form onSubmit={handleSubmitJoinCode} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono font-bold text-gray-300 block mb-1.5">
                  CÓDIGO DE CONVITE:
                </label>
                <input
                  type="text"
                  value={inviteCodeInput}
                  onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
                  placeholder="EX: SHOW-FISICA-2026"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white font-mono font-bold text-sm tracking-wider focus:outline-none focus:border-[#1F9FCF]"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCodeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCode}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-[#1F9FCF] to-[#0F4780] hover:from-[#198BB5] hover:to-[#0C3A68] text-white shadow-lg shadow-[#1F9FCF]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingCode ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmar Acesso</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
