'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import Link from 'next/link';
import {
    User,
    GraduationCap,
    BookOpen,
    Globe,
    Phone,
    Link as LinkIcon,
    ExternalLink,
    Sparkles,
    Eye,
    Edit,
    UserCheck,
    FileText,
    Image as ImageIcon,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import { Profile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { RadiationBadge } from '@/components/gamification/RadiationBadge';
import { InitiativeBadges } from '@/components/ui/InitiativeBadges';
import { getProfileDisplayName } from '@/lib/profile-visibility';

export interface MiniLabLoadedData {
    submissions: {
        id: string;
        title: string;
        status: string;
        media_type?: string;
        media_url?: string;
        created_at: string;
        views?: number;
        category?: string;
    }[];
    followersCount: number;
    followingCount: number;
    pseudonyms: { id: string; name: string; is_active: boolean }[];
}

interface AdminProfileMiniLabProps {
    profile: Profile;
    isLoading: boolean;
    data?: MiniLabLoadedData;
    onImpersonate: (profile: Profile) => void;
    onEditProfile: (profile: Profile) => void;
}

export function AdminProfileMiniLab({
    profile,
    isLoading,
    data,
    onImpersonate,
    onEditProfile,
}: AdminProfileMiniLabProps) {
    // Preview merged with pending_edits for Admin comparison
    const pending = profile.pending_edits || {};
    const effectiveAvatar = pending.pending_avatar_url || pending.avatar_url || profile.avatar_url;
    const effectiveBio = pending.bio ?? profile.bio;
    const effectiveCourse = pending.course ?? profile.course;
    const effectiveInstitute = pending.institute ?? profile.institute;
    const effectiveEntranceYear = pending.entrance_year ?? profile.entrance_year;
    const effectiveEducation = pending.education_level ?? profile.education_level;
    const effectiveExternalInst = pending.external_institution ?? profile.external_institution;
    const effectiveLanguage = pending.cultural_language ?? profile.cultural_language;
    const effectiveInterests = pending.artistic_interests ?? profile.artistic_interests ?? [];
    const effectiveInitiatives = pending.member_initiatives ?? profile.member_initiatives ?? [];
    const effectiveGallery: string[] = Array.isArray(pending.hobbies_gallery)
        ? pending.hobbies_gallery
        : Array.isArray(profile.hobbies_gallery)
            ? profile.hobbies_gallery
            : [];

    if (isLoading && !data) {
        return (
            <div className="mt-4 pt-5 border-t border-gray-200 dark:border-white/10 space-y-4 animate-pulse">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-white/10 shrink-0" />
                    <div className="flex-1 space-y-2 w-full">
                        <div className="h-4 w-48 bg-gray-200 dark:bg-white/10 rounded" />
                        <div className="h-3 w-72 bg-gray-200 dark:bg-white/10 rounded" />
                        <div className="h-3 w-36 bg-gray-200 dark:bg-white/10 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                    <div className="h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                    <div className="h-24 bg-gray-200 dark:bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="mt-4 pt-5 border-t border-gray-200 dark:border-white/10 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* Top Bar: Mini Lab Header + Quick Actions */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50/90 dark:bg-[#141414] border border-gray-200/80 dark:border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 w-full">
                    <div className="relative shrink-0">
                        <Avatar
                            src={effectiveAvatar}
                            name={getProfileDisplayName(profile)}
                            size="custom"
                            customSize="w-20 h-20"
                            xp={profile.xp}
                            level={profile.level}
                            isLabDiv={profile.is_labdiv}
                        />
                        {(pending.pending_avatar_url || pending.avatar_url) && (
                            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-[#FFCC00] text-[#1E1E1E] text-[8px] font-black uppercase whitespace-nowrap shadow">
                                Nova Foto
                            </span>
                        )}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-base font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                {getProfileDisplayName(profile)}
                            </h4>
                            <RadiationBadge xp={profile.xp || 0} level={profile.level || 1} size="sm" showTierName />
                            <InitiativeBadges
                                initiatives={effectiveInitiatives}
                                isLabdivLegacy={profile.is_labdiv}
                                size="sm"
                            />
                        </div>

                        {(profile.username || pending.username) && (
                            <p className="text-[11px] text-gray-500 font-mono">
                                Nome Real: <strong className="text-gray-700 dark:text-gray-300">{pending.full_name || profile.full_name || 'N/A'}</strong> <span className="text-emerald-600 dark:text-emerald-400 font-bold">(Oculto na comunidade • Exibindo apelido @{pending.username || profile.username})</span>
                            </p>
                        )}

                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                            {effectiveBio || <span className="italic text-gray-400">Nenhuma bio informada.</span>}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-1 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            <span>
                                <strong className="text-gray-900 dark:text-white">{data?.submissions?.length || 0}</strong> publicações
                            </span>
                            <span>
                                <strong className="text-gray-900 dark:text-white">{data?.followersCount || 0}</strong> seguidores
                            </span>
                            <span>
                                <strong className="text-gray-900 dark:text-white">{data?.followingCount || 0}</strong> seguindo
                            </span>
                            <span>
                                Linguagem: <strong className="text-[#0F4780] dark:text-[#FFCC00]">{effectiveLanguage || 'jovem'}</strong>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Admin Actions inside Mini-Lab */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full lg:w-auto justify-end">
                    <button
                        type="button"
                        onClick={() => onImpersonate(profile)}
                        className="px-3.5 py-2 rounded-xl bg-[#FFCC00]/15 hover:bg-[#FFCC00]/25 text-[#B45309] dark:text-[#FFCC00] border border-[#FFCC00]/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <UserCheck className="w-3.5 h-3.5" />
                        Impersonar
                    </button>
                    <button
                        type="button"
                        onClick={() => onEditProfile(profile)}
                        className="px-3.5 py-2 rounded-xl bg-[#0F4780]/10 hover:bg-[#0F4780]/20 text-[#0F4780] dark:text-blue-400 border border-[#0F4780]/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Edit className="w-3.5 h-3.5" />
                        Editar Tudo
                    </button>
                    <Link
                        href={`/lab?user=${profile.id}`}
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl bg-gray-200/70 dark:bg-white/5 hover:bg-gray-300/70 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Abrir /lab
                    </Link>
                </div>
            </div>

            {/* 3-Column Details Grid: Acadêmico / Conectividade / Hobbies & Pseudônimos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Coluna 1: Dados Acadêmicos & Pesquisa */}
                <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5" /> Dados Acadêmicos
                    </span>
                    <div className="space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        <p>
                            <span className="text-gray-400 font-bold">Persona:</span>{' '}
                            <span className="font-black uppercase">{profile.persona || profile.user_category || 'curioso'}</span>
                        </p>
                        {effectiveInstitute && (
                            <p>
                                <span className="text-gray-400 font-bold">Instituto:</span> {effectiveInstitute}
                            </p>
                        )}
                        {effectiveCourse && (
                            <p>
                                <span className="text-gray-400 font-bold">Curso:</span> {effectiveCourse}
                            </p>
                        )}
                        {effectiveEntranceYear && (
                            <p>
                                <span className="text-gray-400 font-bold">Ingresso:</span> {effectiveEntranceYear}
                            </p>
                        )}
                        {effectiveEducation && (
                            <p>
                                <span className="text-gray-400 font-bold">Escolaridade:</span> {effectiveEducation}
                            </p>
                        )}
                        {effectiveExternalInst && (
                            <p>
                                <span className="text-gray-400 font-bold">Instituição:</span> {effectiveExternalInst}
                            </p>
                        )}
                        {(pending.interest_area || profile.interest_area) && (
                            <p>
                                <span className="text-gray-400 font-bold">Área de Interesse:</span>{' '}
                                {pending.interest_area || profile.interest_area}
                            </p>
                        )}
                    </div>
                </div>

                {/* Coluna 2: Conectividade & Redes */}
                <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" /> Contato & Links
                    </span>
                    <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 break-all">
                        <p>
                            <span className="text-gray-400 font-bold">E-mail:</span> {profile.email || 'N/A'}
                        </p>
                        {(pending.whatsapp || profile.whatsapp) && (
                            <p>
                                <span className="text-gray-400 font-bold">WhatsApp:</span> {pending.whatsapp || profile.whatsapp}
                            </p>
                        )}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {[
                                { label: 'Lattes', url: pending.lattes_url ?? profile.lattes_url },
                                { label: 'LinkedIn', url: pending.linkedin_url ?? profile.linkedin_url },
                                { label: 'GitHub', url: pending.github_url ?? profile.github_url },
                                { label: 'Instagram', url: pending.instagram_url ?? profile.instagram_url },
                                { label: 'Portfólio', url: pending.portfolio_url ?? profile.portfolio_url },
                            ]
                                .filter((item) => Boolean(item.url))
                                .map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-2 py-1 rounded-lg bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 text-[10px] font-black uppercase flex items-center gap-1"
                                    >
                                        <LinkIcon className="w-2.5 h-2.5" />
                                        {item.label}
                                    </a>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Coluna 3: Hobbies, Artes & Pseudônimos */}
                <div className="p-4 rounded-2xl bg-gray-50/70 dark:bg-white/[0.02] border border-gray-200/60 dark:border-white/5 space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Hobbies & Pseudônimos
                    </span>
                    {Array.isArray(effectiveInterests) && effectiveInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {effectiveInterests.map((hobby: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded-lg bg-brand-yellow/15 text-[#B45309] dark:text-[#FFCC00] border border-brand-yellow/30 text-[10px] font-bold"
                                >
                                    {hobby}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs italic text-gray-400">Sem hobbies cadastrados.</p>
                    )}

                    {data?.pseudonyms && data.pseudonyms.length > 0 && (
                        <div className="pt-2 border-t border-gray-200/50 dark:border-white/5">
                            <span className="block text-[9px] font-black uppercase text-gray-400 mb-1">
                                Apelidos / Pseudônimos:
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {data.pseudonyms.map((ps) => (
                                    <span
                                        key={ps.id}
                                        className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-[10px] font-bold text-gray-800 dark:text-gray-200"
                                    >
                                        @{ps.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Galeria de Hobbies (se houver fotos) */}
            {effectiveGallery.length > 0 && (
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-brand-yellow" /> Galeria de Fotos & Hobbies ({effectiveGallery.length})
                    </span>
                    <div className="flex gap-2.5 overflow-x-auto pb-1">
                        {effectiveGallery.map((imgUrl, idx) => (
                            <a
                                key={idx}
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shrink-0 hover:scale-105 transition-transform"
                            >
                                <img src={imgUrl} alt={`Hobby ${idx + 1}`} className="w-full h-full object-cover" />
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Publicações / Submissões do Usuário */}
            <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-blue" /> Publicações no HUB ({data?.submissions?.length || 0})
                </span>
                {data?.submissions && data.submissions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {data.submissions.map((sub) => (
                            <div
                                key={sub.id}
                                className="p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200/70 dark:border-white/10 flex items-center justify-between gap-2"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{sub.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5 text-[9px] font-bold uppercase text-gray-400">
                                        <span>{sub.category || sub.media_type || 'Post'}</span>
                                        <span>•</span>
                                        <span
                                            className={
                                                sub.status === 'aprovado'
                                                    ? 'text-emerald-500'
                                                    : sub.status === 'pendente'
                                                        ? 'text-brand-yellow'
                                                        : 'text-brand-red'
                                            }
                                        >
                                            {sub.status}
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    href={`/arquivo/${sub.id}`}
                                    target="_blank"
                                    className="p-1.5 rounded-lg bg-white dark:bg-white/5 hover:bg-brand-blue/10 text-gray-400 hover:text-brand-blue transition-colors shrink-0"
                                    title="Ver publicação"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 italic">Nenhuma publicação submetida até o momento.</p>
                )}
            </div>
        </div>
    );
}

