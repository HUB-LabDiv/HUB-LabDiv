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


import { useEffect, useState, useMemo, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { approveProfile, rejectProfile, impersonateUser, getProfileMiniLabData, getEnrollmentProofUrl, enableAutoApprove, disableAutoApprove, getAutoApproveStatus, updateProfileCategory } from '@/app/actions/profiles';
import { getAdminSessionRole } from '@/app/actions/admin';
import { Loader2, Check, X, AlertCircle, Info, ExternalLink, Edit, GraduationCap, Sparkles, Building2, PhoneCall, ChevronDown, UserCheck } from 'lucide-react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { detectFacultyMember, FacultyMatch } from '@/lib/facultyDetector';
import { AdminProfileMiniLab, MiniLabLoadedData } from '@/components/admin/AdminProfileMiniLab';
import { InitiativeBadges } from '@/components/ui/InitiativeBadges';
import { Avatar } from '@/components/ui/Avatar';
import { getProfileDisplayName } from '@/lib/profile-visibility';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    institute: string;
    role: string;
    review_status: string;
    bio: string;
    is_usp_member: boolean;
    user_category?: string;
    created_at: string;
    username?: string;
    use_nickname?: boolean;
    lattes_url?: string;
    linkedin_url?: string;
    github_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    tiktok_url?: string;
    portfolio_url?: string;
    usp_status?: string;
    entrance_year?: number;
    course?: string;
    whatsapp?: string;
    artistic_interests?: string[];
    education_level?: string;
    major?: string;
    available_to_mentor: boolean;
    seeking_mentor: boolean;
    avatar_url?: string;
    pending_edits?: any;
    hobbies_gallery?: any[];
    member_initiatives?: string[];
    is_labdiv?: boolean;
    xp?: number;
    level?: number;
    persona?: any;
    cultural_language?: any;
    external_institution?: string;
    interest_area?: string;
}

export default function ProfileApprovalPage() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'tudo' | 'basico' | 'artes'>('tudo');
    const [autoApproveActive, setAutoApproveActive] = useState(false);
    const [autoApproveExpiresAt, setAutoApproveExpiresAt] = useState<Date | null>(null);
    const [isAutoApproveLoading, setIsAutoApproveLoading] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [viewMode, setViewMode] = useState<'pending' | 'all'>('pending');
    
    // Modal states
    const [editingProfileId, setEditingProfileId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Accordion & Mini-Lab states (Zero useEffect for data fetching)
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
    const [miniLabCache, setMiniLabCache] = useState<Record<string, MiniLabLoadedData>>({});
    const [loadingMiniLabId, setLoadingMiniLabId] = useState<string | null>(null);
    const [, startTransition] = useTransition();

    const [isAdminRole, setIsAdminRole] = useState(false);

    const handleToggleExpand = (profileId: string) => {
        const nextOpen = !expandedIds[profileId];
        setExpandedIds(prev => ({ ...prev, [profileId]: nextOpen }));

        if (nextOpen && !miniLabCache[profileId]) {
            setLoadingMiniLabId(profileId);
            startTransition(async () => {
                const res = await getProfileMiniLabData(profileId);
                if ('success' in res && res.success) {
                    setMiniLabCache(prev => ({
                        ...prev,
                        [profileId]: {
                            submissions: res.submissions as any[],
                            followersCount: res.followersCount || 0,
                            followingCount: res.followingCount || 0,
                            pseudonyms: res.pseudonyms as any[]
                        }
                    }));
                } else {
                    toast.error('Erro ao carregar miniatura do Lab.');
                }
                setLoadingMiniLabId(null);
            });
        }
    };

    const handleImpersonate = async (profile: Profile) => {
        const loadingToast = toast.loading(`Iniciando sessão como ${profile.full_name || profile.email}...`);
        const res = await impersonateUser(profile.id);
        toast.dismiss(loadingToast);
        if ('success' in res && res.success) {
            toast.success(`Impersonando ${profile.full_name || profile.email}! Redirecionando para o Lab...`);
            router.push('/lab');
        } else {
            toast.error(('error' in res && res.error) ? res.error : 'Erro ao impersonar usuário');
        }
    };

    const fetchProfiles = async () => {
        setIsLoading(true);

        const sessionRole = await getAdminSessionRole();
        setIsAdminRole(sessionRole.role === 'admin');

        const status = await getAutoApproveStatus();
        if (status.active) {
            setAutoApproveActive(true);
            setAutoApproveExpiresAt(new Date(status.expiresAt!));
        }

        const query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (viewMode === 'pending') {
            query.eq('review_status', 'pending');
        }

        const { data, error } = await query;

        if (error) {
            toast.error("Erro ao carregar perfis.");
        } else {
            setProfiles(data || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchProfiles();
    }, [viewMode]);

    const handleAutoApproveClick = () => {
        setShowPasswordModal(true);
    };

    const confirmAutoApprove = async () => {
        if (!adminPassword) return;
        setShowPasswordModal(false);
        setIsAutoApproveLoading(true);
        const res = await enableAutoApprove(1, adminPassword);
        if (res.success) {
            toast.success("Aprovação Automática ativada por 1 hora!");
            setAutoApproveActive(true);
            setAutoApproveExpiresAt(new Date(res.expiresAt!));
            setProfiles([]);
            setAdminPassword('');
        } else {
            toast.error(res.error || "Erro ao ativar auto-aprovação.");
        }
        setIsAutoApproveLoading(false);
    };

    const handleCancelAutoApprove = async () => {
        setIsAutoApproveLoading(true);
        const res = await disableAutoApprove();
        if (res.success) {
            toast.success("Auto-Aprovação desativada.");
            setAutoApproveActive(false);
            setAutoApproveExpiresAt(null);
        } else {
            toast.error(res.error || "Erro ao desativar.");
        }
        setIsAutoApproveLoading(false);
    };

    const handleApprove = async (id: string, assignedPersona?: any) => {
        setIsProcessing(id);
        const res = await approveProfile(id, assignedPersona);
        if (res.success) {
            toast.success(assignedPersona === 'professor' ? "Perfil aprovado e promovido a Professor!" : "Perfil aprovado com sucesso!");
            setProfiles(profiles.filter(p => p.id !== id));
        } else {
            toast.error(res.error || "Erro ao aprovar perfil.");
        }
        setIsProcessing(null);
    };

    const handleEditProfile = (id: string) => {
        setEditingProfileId(id);
        setIsEditModalOpen(true);
    };

    const handleCategoryChange = async (id: string, newCategory: string) => {
        setIsProcessing(id);
        const res = await updateProfileCategory(id, newCategory);
        if (res.success) {
            toast.success("Categoria atualizada com sucesso.");
            setProfiles(profiles.map(p => p.id === id ? { ...p, user_category: newCategory } : p));
        } else {
            toast.error(res.error || "Erro ao atualizar categoria.");
        }
        setIsProcessing(null);
    };

    const handleReject = async (id: string) => {
        setIsProcessing(id);
        const res = await rejectProfile(id);

        if ('error' in res && res.error) {
            toast.error(res.error || "Erro ao rejeitar perfil.");
        } else {
            toast.success("Edições pendentes rejeitadas.");
            setProfiles(prev => prev.filter(p => p.id !== id));
        }
        setIsProcessing(null);
    };

    const handleViewProof = async (path: string) => {
        const loadingToast = toast.loading('Gerando link seguro...');
        const res = await getEnrollmentProofUrl(path);
        if (res.success && res.url) {
            toast.dismiss(loadingToast);
            window.open(res.url, '_blank', 'noopener,noreferrer');
        } else {
            toast.dismiss(loadingToast);
            toast.error(res.error || 'Erro ao carregar comprovante');
        }
    };

    const renderDiff = (current: any, pending: any, label: string) => {
        const normalize = (val: any) => {
            if (val === true) return 'SIM';
            if (val === false) return 'NÃO';
            return val || '';
        };

        const normalizedCurrent = normalize(current);
        const normalizedPending = pending === undefined ? normalizedCurrent : normalize(pending);

        if (normalizedCurrent === normalizedPending) return null;

        const isLongText = typeof normalizedPending === 'string' && normalizedPending.length > 50;
        const isRemoval = normalizedPending === '' && normalizedCurrent !== '';

        return (
            <div className={`space-y-2 bg-white/5 p-4 rounded-2xl border ${isRemoval ? 'border-brand-red/20' : 'border-brand-green/20'} ${isLongText ? 'col-span-full' : ''}`}>
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0055ff]">{label}</p>
                    {isRemoval && (
                        <span className="text-[8px] font-black bg-brand-red/20 text-brand-red px-2 py-0.5 rounded uppercase">Removendo Content</span>
                    )}
                </div>

                <div className={`grid ${isLongText ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
                    <div className="space-y-1">
                        <span className="text-[8px] uppercase text-gray-500 font-bold block">Valor Atual</span>
                        <div className="text-xs text-gray-400 bg-white/[0.02] p-2 rounded-lg border border-white/5 min-h-[1.5rem] break-words">
                            {normalizedCurrent || <span className="italic opacity-40">(vazio)</span>}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[8px] uppercase text-brand-green font-bold block">Novo Valor</span>
                        <div className="text-xs text-white bg-brand-green/5 p-2 rounded-lg border border-brand-green/20 min-h-[1.5rem] break-words font-medium">
                            {normalizedPending || <span className="text-brand-red italic opacity-60">(vazio/remover)</span>}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderHobbiesDiff = (current: any, pending: any) => {
        if (!pending) return null;
        
        return (
            <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-[#0055ff]/20 col-span-full">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0055ff]">Artes & Hobbies (Galeria)</p>
                    <span className="text-[8px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded uppercase">{pending.length} Itens</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {pending.map((item: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden text-center flex flex-col items-center p-4">
                            <h5 className="text-xs font-bold text-white mb-2">{item.title}</h5>
                            <span className="text-[8px] uppercase tracking-widest text-gray-500 mb-2 bg-white/5 px-2 py-1 rounded">Tipo: {item.type}</span>
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-brand-blue hover:underline break-all block mb-2">{item.url}</a>}
                            {item.description && <p className="text-[10px] text-gray-400 italic mt-auto">"{item.description}"</p>}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const filteredProfiles = profiles.filter(p => {
        if (activeFilter === 'tudo') return true;
        if (activeFilter === 'artes') return p.pending_edits?.hobbies_gallery !== undefined;
        if (activeFilter === 'basico') {
            if (!p.pending_edits) return true;
            const keys = Object.keys(p.pending_edits).filter(k => k !== 'hobbies_gallery');
            return keys.length > 0;
        }
        return true;
    });

    const profilesWithFaculty = useMemo(() => {
        return filteredProfiles.map(p => ({
            profile: p,
            facultyMatch: detectFacultyMember(p.email, p.full_name)
        }));
    }, [filteredProfiles]);

    const suggestedFacultyProfiles = useMemo(() => {
        return profilesWithFaculty.filter(item => item.facultyMatch !== null);
    }, [profilesWithFaculty]);

    const regularProfiles = useMemo(() => {
        return profilesWithFaculty.filter(item => item.facultyMatch === null);
    }, [profilesWithFaculty]);

    const renderProfileCard = (profile: Profile, facultyMatch: FacultyMatch | null) => {
        const isExpanded = Boolean(expandedIds[profile.id]);
        const pendingAvatar = profile.pending_edits?.pending_avatar_url || profile.pending_edits?.avatar_url;

        return (
        <div key={profile.id} className={`backdrop-blur-md rounded-[28px] overflow-hidden group transition-all duration-300 ${
            facultyMatch 
                ? 'bg-amber-500/5 dark:bg-amber-500/[0.03] border-2 border-amber-500/40 shadow-xl shadow-amber-500/5' 
                : 'bg-white/60 dark:bg-card-dark/10 border border-gray-200 dark:border-white/10 hover:border-brand-blue/40'
        }`}>
            {/* Banner Inteligente se houver match com docente IFUSP */}
            {facultyMatch && (
                <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-b border-amber-500/20 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/30">
                            <GraduationCap className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" /> Sugestão Inteligente: Docente IFUSP
                                </span>
                                <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
                                    facultyMatch.confidence === 'high' 
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                                }`}>
                                    Confiança {facultyMatch.confidence === 'high' ? 'Alta' : 'Média'}
                                </span>
                            </div>
                            <p className="text-xs font-black text-gray-900 dark:text-white mt-0.5">
                                {facultyMatch.title} — {facultyMatch.departmentName} ({facultyMatch.departmentCode})
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-[10px] text-gray-500 dark:text-gray-400 flex-wrap">
                                {facultyMatch.building && (
                                    <span className="flex items-center gap-1 font-semibold">
                                        <Building2 className="w-3.5 h-3.5 text-amber-400" /> {facultyMatch.building} {facultyMatch.room ? `• Sala ${facultyMatch.room}` : ''}
                                    </span>
                                )}
                                {facultyMatch.phone && (
                                    <span className="flex items-center gap-1 font-semibold">
                                        <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> Ramal: {facultyMatch.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-5 sm:p-6">
                {/* Accordion Summary Header */}
                <div
                    onClick={() => handleToggleExpand(profile.id)}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative shrink-0">
                            <Avatar
                                src={pendingAvatar || profile.avatar_url}
                                name={getProfileDisplayName(profile)}
                                size="custom"
                                customSize="w-12 h-12"
                                xp={profile.xp}
                                level={profile.level}
                                isLabDiv={profile.is_labdiv}
                            />
                            {pendingAvatar && (
                                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-brand-green border-2 border-[#1E1E1E]" title="Nova foto pendente" />
                            )}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight truncate">
                                    {getProfileDisplayName(profile)}
                                </h3>
                                <InitiativeBadges
                                    initiatives={profile.pending_edits?.member_initiatives ?? profile.member_initiatives}
                                    isLabdivLegacy={profile.is_labdiv}
                                    size="sm"
                                />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{profile.email}</span>
                                {(() => {
                                    const effectiveUsername = profile.pending_edits?.username || profile.username;
                                    const effectiveUseNickname = profile.pending_edits?.use_nickname ?? profile.use_nickname;
                                    const realName = profile.pending_edits?.full_name || profile.full_name;

                                    if (effectiveUsername && (effectiveUseNickname || effectiveUseNickname !== false)) {
                                        return (
                                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-brand-yellow/15 text-[#B45309] dark:text-brand-yellow border border-brand-yellow/30">
                                                @ {effectiveUsername} • Nome Real: {realName || 'N/A'} (Protegido)
                                            </span>
                                        );
                                    }
                                    if (effectiveUsername) {
                                        return (
                                            <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10">
                                                Nome Real Visível • Apelido @{effectiveUsername} inativo
                                            </span>
                                        );
                                    }
                                    return (
                                        <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-gray-100 dark:bg-white/5 text-gray-400 border border-gray-200 dark:border-white/10">
                                            Nome Completo Visível
                                        </span>
                                    );
                                })()}
                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${profile.is_usp_member ? 'bg-brand-blue/20 text-brand-blue' : 'bg-gray-800 text-gray-400'}`}>
                                    {profile.is_usp_member ? 'Membro USP' : 'Curioso'}
                                </span>
                                {profile.review_status === 'pending' && (
                                    <span className="px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                        ⏳ Pendente
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Action Buttons + Expand Chevron */}
                    <div className="flex items-center justify-end gap-2 shrink-0 flex-wrap">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleImpersonate(profile);
                            }}
                            className="px-3 py-2 rounded-xl bg-[#FFCC00]/15 hover:bg-[#FFCC00]/25 text-[#B45309] dark:text-[#FFCC00] border border-[#FFCC00]/40 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Entrar na conta deste usuário (Impersonar)"
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Impersonar</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleEditProfile(profile.id);
                            }}
                            className="px-3 py-2 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Editar perfil como Admin"
                        >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Editar</span>
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleToggleExpand(profile.id);
                            }}
                            className={`px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpanded
                                    ? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20'
                                    : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10'
                            }`}
                            title="Expandir Miniatura do Lab Pessoal"
                        >
                            <span>{isExpanded ? 'Fechar Lab' : 'Ver Lab'}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Diffs Pendentes (sempre visíveis quando houver pending_edits) */}
                {profile.pending_edits && Object.keys(profile.pending_edits).filter(k => k !== '_submitted_at').length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <Info className="w-3 h-3" /> Mudanças Propostas
                            </p>
                            <span className="text-[8px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded uppercase">Revisão Necessária</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {(profile.pending_edits.pending_avatar_url || profile.pending_edits.avatar_url) && (
                                <div className="col-span-full bg-white/5 p-4 rounded-2xl border border-brand-green/20 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#0055ff] flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                                        Foto de Perfil
                                    </p>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2 flex flex-col items-center">
                                            <span className="text-[8px] uppercase text-gray-500 font-bold">Foto Atual</span>
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-white/5 flex items-center justify-center">
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="Avatar atual" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-3xl font-black text-gray-500 uppercase">{profile.full_name?.charAt(0) || '?'}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2 flex flex-col items-center">
                                            <span className="text-[8px] uppercase text-brand-green font-bold">Nova Foto</span>
                                            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-green/40 bg-brand-green/5 flex items-center justify-center">
                                                <img src={profile.pending_edits.pending_avatar_url || profile.pending_edits.avatar_url} alt="Nova foto" className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {renderDiff(profile.full_name, profile.pending_edits.full_name, 'Nome Completo')}
                            {renderDiff(profile.bio, profile.pending_edits.bio, 'Biografia')}
                            {renderDiff(profile.username, profile.pending_edits.username, 'Apelido (Nickname)')}
                            {renderDiff(profile.member_initiatives?.join(', '), profile.pending_edits.member_initiatives?.join(', '), 'Vínculos com Iniciativas')}
                            {renderDiff(profile.cultural_language, profile.pending_edits.cultural_language, 'Signo Linguístico')}
                            {renderDiff(profile.institute, profile.pending_edits.institute, 'Instituto / Afiliação')}
                            {renderDiff(profile.course, profile.pending_edits.course, 'Curso / Habilitação')}
                            {renderDiff(profile.whatsapp, profile.pending_edits.whatsapp, 'WhatsApp')}
                            {renderDiff(profile.entrance_year, profile.pending_edits.entrance_year, 'Ano de Ingresso')}
                            {renderDiff(profile.artistic_interests?.join(', '), profile.pending_edits.artistic_interests?.join(', '), 'Hobbies e Artes')}
                            {renderDiff(profile.lattes_url, profile.pending_edits.lattes_url, 'URL Lattes')}
                            {renderDiff(profile.linkedin_url, profile.pending_edits.linkedin_url, 'LinkedIn')}
                            {renderDiff(profile.github_url, profile.pending_edits.github_url, 'GitHub')}
                            {renderDiff(profile.youtube_url, profile.pending_edits.youtube_url, 'YouTube')}
                            {renderDiff(profile.instagram_url, profile.pending_edits.instagram_url, 'Instagram')}
                            {renderDiff(profile.tiktok_url, profile.pending_edits.tiktok_url, 'TikTok')}
                            {renderDiff(profile.portfolio_url, profile.pending_edits.portfolio_url, 'Site Pessoal / Portfólio')}
                            {renderDiff(profile.available_to_mentor, profile.pending_edits.available_to_mentor, 'Quero Adotar Bixo')}
                            {renderDiff(profile.seeking_mentor, profile.pending_edits.seeking_mentor, 'Bixo querendo Adoção')}
                            
                            {profile.pending_edits.hobbies_gallery && renderHobbiesDiff(profile.hobbies_gallery, profile.pending_edits.hobbies_gallery)}

                            {profile.pending_edits.use_nickname !== undefined && profile.pending_edits.use_nickname !== profile.use_nickname && (
                                <div className="bg-white/5 p-4 rounded-2xl border border-brand-blue/20 col-span-full flex items-center justify-between group/toggle">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Visibilidade do Apelido</span>
                                        <span className="text-[9px] text-gray-500 font-medium">Define se o nome real ou apelido aparece nos posts</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-bold text-gray-500 uppercase">De: {profile.use_nickname ? 'SIM' : 'NÃO'}</span>
                                        <span className="material-symbols-outlined text-sm text-gray-600">arrow_forward</span>
                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${profile.pending_edits.use_nickname ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'bg-gray-800 text-gray-400'}`}>
                                            Para: {profile.pending_edits.use_nickname ? 'SIM' : 'NÃO'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Expansão Accordion: Miniatura do Lab Pessoal */}
                {isExpanded && (
                    <AdminProfileMiniLab
                        profile={profile as any}
                        isLoading={loadingMiniLabId === profile.id}
                        data={miniLabCache[profile.id]}
                        onImpersonate={(p) => handleImpersonate(p as any)}
                        onEditProfile={(p) => handleEditProfile(p.id)}
                    />
                )}
            </div>

            {/* Ações (apenas se for pending) */}
            {profile.review_status === 'pending' && (
                <div className="px-6 py-4 bg-[#0055ff]/5 border-t border-[#0055ff]/20 flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 shrink-0">
                    <button
                        disabled={isProcessing === profile.id}
                        onClick={() => handleReject(profile.id)}
                        className="px-5 py-2.5 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                        Rejeitar Edição
                    </button>
                    <button
                        disabled={isProcessing === profile.id}
                        onClick={() => handleApprove(profile.id)}
                        className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isProcessing === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Aprovar Alterações
                    </button>
                    {facultyMatch && (
                        <button
                            disabled={isProcessing === profile.id}
                            onClick={() => handleApprove(profile.id, 'professor')}
                            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isProcessing === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <GraduationCap className="w-4 h-4" />}
                            Aprovar & Promover a Professor
                        </button>
                    )}
                </div>
            )}
        </div>
        );
    };

    return (
        <div className="p-8 max-w-6xl mx-auto min-h-screen bg-transparent">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        Moderação de Perfis
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm font-medium uppercase tracking-tight">Gerencie os perfis e categorias da comunidade.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mr-2">
                        <button
                            onClick={() => setViewMode('pending')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'pending' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            Pendentes
                        </button>
                        <button
                            onClick={() => setViewMode('all')}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                viewMode === 'all' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-500 hover:text-white'
                            }`}
                        >
                            Todos
                        </button>
                    </div>
                    {viewMode === 'pending' && (
                        <div className="px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full flex items-center gap-2">
                            <Info className="w-4 h-4 text-brand-blue" />
                            <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest">{profiles.length} Pendentes</span>
                        </div>
                    )}
                    {autoApproveActive ? (
                        <button 
                            onClick={handleCancelAutoApprove}
                            disabled={isAutoApproveLoading}
                            className="group px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/40 hover:bg-brand-red/10 hover:border-brand-red/40 rounded-full flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <span className="text-[10px] font-black text-brand-yellow group-hover:text-brand-red uppercase tracking-widest">
                                <span className="group-hover:hidden">⚡ Auto-Aprovação Ativa (até {autoApproveExpiresAt?.toLocaleTimeString()})</span>
                                <span className="hidden group-hover:inline">Desativar Auto-Aprovação</span>
                            </span>
                        </button>
                    ) : (
                        <button 
                            onClick={handleAutoApproveClick}
                            disabled={isAutoApproveLoading}
                            className="px-4 py-2 bg-white/5 border border-white/10 hover:border-brand-yellow/50 hover:bg-brand-yellow/10 rounded-full flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isAutoApproveLoading ? <Loader2 className="w-4 h-4 text-brand-yellow animate-spin" /> : <span className="material-symbols-outlined text-[14px] text-brand-yellow">bolt</span>}
                            <span className="text-[10px] font-black text-brand-yellow uppercase tracking-widest">Aprovar Todos (1h)</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="flex items-center gap-2 mb-8 bg-white/5 p-1 rounded-2xl w-fit border border-white/10">
                {[
                    { id: 'tudo', label: 'Tudo' },
                    { id: 'basico', label: 'Dados Básicos' },
                    { id: 'artes', label: 'Artes & Hobbies' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id as any)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeFilter === tab.id 
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-brand-blue" />
                </div>
            ) : filteredProfiles.length === 0 ? (
                <div className="text-center py-20 bg-white/40 dark:bg-card-dark/5 backdrop-blur-md border border-dashed border-gray-200 dark:border-white/10 rounded-[32px]">
                    <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Nenhum perfil aguardando revisão nesta categoria</p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Seção 1: Sugestão Inteligente de Docência */}
                    {suggestedFacultyProfiles.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
                                <GraduationCap className="w-5 h-5 text-amber-400" />
                                <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest">
                                    Sugestão Inteligente: Validação Docente ({suggestedFacultyProfiles.length})
                                </h2>
                                <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase ml-auto">
                                    Eixo Informativo / IFUSP
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-6">
                                {suggestedFacultyProfiles.map(({ profile, facultyMatch }) => renderProfileCard(profile, facultyMatch))}
                            </div>
                        </div>
                    )}

                    {/* Seção 2: Demais Perfis */}
                    {regularProfiles.length > 0 && (
                        <div className="space-y-4">
                            {suggestedFacultyProfiles.length > 0 && (
                                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                        Demais Cadastros Pendentes ({regularProfiles.length})
                                    </h2>
                                </div>
                            )}
                            <div className="grid grid-cols-1 gap-6">
                                {regularProfiles.map(({ profile, facultyMatch }) => renderProfileCard(profile, facultyMatch))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-dark/60 backdrop-blur-sm">
                    <div className="bg-background-dark border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Confirmação de Segurança</h3>
                        <p className="text-xs text-gray-400 mb-6">Insira a senha de Administrador ou Moderador para ativar a auto-aprovação.</p>
                        
                        <input
                            type="password"
                            placeholder="Senha"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmAutoApprove()}
                            className="w-full bg-background-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow mb-6"
                            autoFocus
                        />
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={confirmAutoApprove}
                                disabled={!adminPassword}
                                className="px-6 py-2 bg-brand-yellow text-gray-900 font-black text-xs rounded-lg hover:bg-[#E5B800] transition-colors disabled:opacity-50"
                            >
                                ATIVAR
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEditModalOpen && editingProfileId && (
                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setEditingProfileId(null);
                    }}
                    onSuccess={() => {
                        fetchProfiles();
                        setIsEditModalOpen(false);
                        setEditingProfileId(null);
                    }}
                    adminMode={true}
                    adminUserId={editingProfileId}
                />
            )}
        </div>
    );
}
