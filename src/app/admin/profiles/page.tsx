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


import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { approveProfile, getEnrollmentProofUrl, enableAutoApprove, disableAutoApprove, getAutoApproveStatus, updateProfileCategory } from '@/app/actions/profiles';
import { Loader2, Check, X, AlertCircle, Info, ExternalLink, Edit } from 'lucide-react';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

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
    usp_proof_url?: string;
    pending_edits?: any;
    hobbies_gallery?: any[];
}

export default function ProfileApprovalPage() {
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

    const fetchProfiles = async () => {
        setIsLoading(true);
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

    const handleApprove = async (id: string) => {
        setIsProcessing(id);
        const res = await approveProfile(id);
        if (res.success) {
            toast.success("Perfil aprovado!");
            setProfiles(profiles.filter(p => p.id !== id));
        } else {
            toast.error(res.error || "Erro ao rejeitar perfil.");
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
        const { error } = await supabase
            .from('profiles')
            .update({
                review_status: 'rejected',
                pending_edits: null
            })
            .eq('id', id);

        if (error) {
            toast.error("Erro ao rejeitar perfil.");
        } else {
            toast.success("Perfil rejeitado.");
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
                            className="group px-4 py-2 bg-brand-yellow/10 border border-brand-yellow/40 hover:bg-red-500/10 hover:border-red-500/40 rounded-full flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            <span className="text-[10px] font-black text-brand-yellow group-hover:text-red-400 uppercase tracking-widest">
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
                <div className="grid grid-cols-1 gap-6">
                    {filteredProfiles.map(profile => (
                        <div key={profile.id} className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-[32px] overflow-hidden group hover:border-brand-blue/30 transition-all duration-300">
                            <div className="p-8 flex flex-col lg:flex-row gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-blue/10 rounded-2xl flex items-center justify-center">
                                            <span className="text-xl font-black text-brand-blue uppercase">{profile.full_name?.charAt(0) || 'U'}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-none mb-1">{profile.full_name || 'Usuário Sem Nome'}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{profile.email}</span>
                                                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${profile.is_usp_member ? 'bg-brand-blue/20 text-brand-blue' : 'bg-gray-800 text-gray-500'}`}>
                                                    {profile.is_usp_member ? 'Membro USP' : 'Curioso'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {profile.pending_edits ? (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                <p className="text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <Info className="w-3 h-3" /> Mudanças Propostas
                                                </p>
                                                <span className="text-[8px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded uppercase">Revisão Necessária</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {renderDiff(profile.bio, profile.pending_edits.bio, 'Biografia')}
                                                {renderDiff(profile.username, profile.pending_edits.username, 'Apelido (Nickname)')}
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
                                    ) : (
                                        <div className="p-6 bg-brand-blue/5 rounded-[24px] border border-brand-blue/10 border-dashed text-center">
                                            <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.3em]">Novo Cadastro Detectado</p>
                                            <p className="text-[9px] text-gray-500 mt-1 uppercase">Revise as informações básicas acima antes de aprovar.</p>
                                        </div>
                                    )}

                                </div>

                                <div className="flex flex-col gap-6 shrink-0 lg:w-64 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 pb-4 border-b border-white/5">
                                            <span className="material-symbols-outlined text-brand-yellow text-[20px]">admin_panel_settings</span>
                                            <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-yellow">Moderação Completa</h4>
                                        </div>
                                        <button
                                            onClick={() => handleEditProfile(profile.id)}
                                            className="w-full bg-[#121212] hover:bg-brand-yellow/10 border border-white/10 hover:border-brand-yellow/50 rounded-xl p-3 text-sm text-brand-yellow font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Editar Perfil
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Ações (apenas se for pending) */}
                            {profile.review_status === 'pending' && (
                                <div className="p-6 bg-[#0055ff]/5 border-t border-[#0055ff]/20 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                                    <button
                                        disabled={isProcessing === profile.id}
                                        onClick={() => handleReject(profile.id)}
                                        className="px-6 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <X className="w-4 h-4" />
                                        Rejeitar
                                    </button>
                                    <button
                                        disabled={isProcessing === profile.id}
                                        onClick={() => handleApprove(profile.id)}
                                        className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/90 text-white font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
                                    >
                                        {isProcessing === profile.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Aprovar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-2">Confirmação de Segurança</h3>
                        <p className="text-xs text-gray-400 mb-6">Insira a senha de Administrador ou Moderador para ativar a auto-aprovação.</p>
                        
                        <input
                            type="password"
                            placeholder="Senha"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && confirmAutoApprove()}
                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-yellow mb-6"
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
