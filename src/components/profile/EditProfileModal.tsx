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


import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Loader2, X, User, FileText, Globe, Link as LinkIcon, Building2, ShieldCheck, Star, Mail, Phone, FileUp, Info, Users, Microscope, Briefcase, Zap, Github, Linkedin, Youtube, Instagram, MessageSquare, GraduationCap, CheckCircle2, Clock, AlertTriangle, ChevronDown, Send, Sparkles, Terminal, Eye } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/TikTokIcon';
import { updateProfile, getProfileWithPseudonyms, uploadEnrollmentProof, updateProfileAsAdmin, submitTeacherVerification, submitInitiativeRequest } from '@/app/actions/profiles';
import { getUserPseudonyms, createPseudonym } from '@/app/actions/submissions';
import { createServerSupabase } from '@/lib/supabase/server';
import { supabase } from '@/lib/supabase';
import { Profile, UserPersona, InitiativeId } from '@/types';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { INITIATIVE_LIST, INITIATIVES_CATALOG } from '@/components/ui/InitiativeBadges';
import { hasActivePendingEdits, getProfileDisplayName } from '@/lib/profile-visibility';

const profileSchema = z.object({
    email: z.string().optional(),
    full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
    persona: z.enum(['aluno', 'professor', 'curioso', 'iniciativa']).optional(),
    bio: z.string().max(200, "Bio muito longa (máx 200)").default(''),
    username: z.string().max(30, "Apelido muito longo").default(''),
    use_nickname: z.boolean().default(false),
    institute: z.string().optional(),
    other_institute: z.string().optional(),
    course: z.string().optional(),
    education_level: z.string().optional(),
    external_institution: z.string().optional(),
    whatsapp: z.string().optional(),
    entrance_year: z.string().optional(),
    artistic_interests_str: z.string().default(''),
    lattes_url: z.string().url("Link do Lattes inválido").or(z.literal("")).default(''),
    linkedin_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    github_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    youtube_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    tiktok_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    instagram_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    portfolio_url: z.string().url("Link inválido").or(z.literal("")).default(''),
    new_nickname: z.string().max(30).default(''),
    available_to_mentor: z.boolean().default(false),
    seeking_mentor: z.boolean().default(false),
    research_line: z.string().max(100).optional(),
    office_room: z.string().max(100).optional(),
    laboratory_name: z.string().max(100).optional(),
    department: z.string().max(100).optional(),
    is_labdiv: z.boolean().optional(),
    is_visible: z.boolean().optional(),
    user_category: z.enum(['curioso', 'licenciatura', 'bacharelado', 'pos_graduacao', 'docente_pesquisador', 'aluno_usp', 'pesquisador', 'fisica_medica', 'outro_instituto']).default('curioso'),
    seeking_assistant: z.boolean().default(false),
    interest_area: z.string().max(100).optional(),
    cultural_language: z.enum(['nerd_geek', 'artistica', 'jovem', 'academica']).default('jovem'),
    member_initiatives: z.array(z.string()).default([]),
}).superRefine((data, ctx) => {
    const isUsp = data.email?.endsWith('@usp.br') || data.email?.endsWith('@if.usp.br');
    const isResearcher = data.user_category === 'pesquisador' || data.user_category === 'docente_pesquisador';

    if (isResearcher) {
        return; // specific validations for researcher can be added here if needed
    }

    if (isUsp) {
        if (!data.institute || data.institute.trim() === '') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Selecione um instituto", path: ["institute"] });
        } else if (data.institute === 'Outros' && (!data.other_institute || data.other_institute.trim() === '')) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe o nome do instituto", path: ["other_institute"] });
        }
        if (!data.course || data.course.trim() === '') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe seu curso", path: ["course"] });
        }
    } else {
        if (!data.education_level || data.education_level.trim() === '') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Selecione sua escolaridade", path: ["education_level"] });
        }
        if (!data.external_institution || data.external_institution.trim() === '') {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Informe sua instituição de origem", path: ["external_institution"] });
        }
    }
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    adminMode?: boolean;
    adminUserId?: string;
}

export function EditProfileModal({ isOpen, onClose, onSuccess, adminMode = false, adminUserId }: EditProfileModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [pseudonyms, setPseudonyms] = useState<any[]>([]);
    const [isCreatingNickname, setIsCreatingNickname] = useState(false);
    const [currentStatus, setCurrentStatus] = useState<'pending' | 'approved' | 'rejected'>('approved');
    const [showHobbiesHelp, setShowHobbiesHelp] = useState(false);

    const [isAddingNetwork, setIsAddingNetwork] = useState(false);
    const [selectedNetworkToAdd, setSelectedNetworkToAdd] = useState('');
    const [activeNetworks, setActiveNetworks] = useState<string[]>([]);

    // Avatar upload state
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const avatarInputRef = React.useRef<HTMLInputElement>(null);

    // Teacher verification state
    const [isUploadingTeacherProof, setIsUploadingTeacherProof] = useState(false);
    const teacherProofInputRef = React.useRef<HTMLInputElement>(null);

    // Nova Iniciativa request box state (Eixo 04 — Governança)
    const [showInitiativeRequestBox, setShowInitiativeRequestBox] = useState(false);
    const [isSubmittingInitiativeReq, setIsSubmittingInitiativeReq] = useState(false);
    const [initiativeReqForm, setInitiativeReqForm] = useState({
        initiative_name: '',
        acronym: '',
        description: '',
        responsible_name: '',
        contact_info: '',
    });

    const handleInitiativeRequestSubmit = async () => {
        if (!initiativeReqForm.initiative_name.trim() || !initiativeReqForm.description.trim() || !initiativeReqForm.responsible_name.trim() || !initiativeReqForm.contact_info.trim()) {
            toast.error('Preencha todos os campos obrigatórios da iniciativa.');
            return;
        }
        setIsSubmittingInitiativeReq(true);
        try {
            const res = await submitInitiativeRequest(initiativeReqForm);
            if ('error' in res && res.error) {
                toast.error(res.error);
            } else {
                toast.success('Solicitação enviada para a Governança (Eixo 04)!');
                setInitiativeReqForm({
                    initiative_name: '',
                    acronym: '',
                    description: '',
                    responsible_name: '',
                    contact_info: '',
                });
                setShowInitiativeRequestBox(false);
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro ao enviar solicitação.');
        } finally {
            setIsSubmittingInitiativeReq(false);
        }
    };

    const handleTeacherProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 10 * 1024 * 1024) {
            toast.error('O arquivo de comprovante não pode exceder 10MB.');
            return;
        }

        setIsUploadingTeacherProof(true);
        try {
            const formData = new FormData();
            formData.append('proof', file);

            const res = await submitTeacherVerification(formData);
            if (res.success) {
                toast.success('Comprovante docente enviado para análise com sucesso!');
                setProfileData((prev: any) => ({
                    ...prev,
                    teacher_verification_status: 'pending'
                }));
            } else {
                toast.error(res.error || 'Erro ao enviar comprovante docente.');
            }
        } catch (err: any) {
            toast.error(err.message || 'Erro inesperado ao enviar arquivo.');
        } finally {
            setIsUploadingTeacherProof(false);
            if (teacherProofInputRef.current) teacherProofInputRef.current.value = '';
        }
    };

    // Comprime a imagem no browser via Canvas API antes do upload
    const compressImage = (file: File, maxSizePx = 512, quality = 0.8): Promise<File> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const objectUrl = URL.createObjectURL(file);
            img.onload = () => {
                URL.revokeObjectURL(objectUrl);
                const scale = Math.min(1, maxSizePx / Math.max(img.width, img.height));
                const w = Math.round(img.width * scale);
                const h = Math.round(img.height * scale);
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Canvas context unavailable'));
                ctx.drawImage(img, 0, 0, w, h);
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Falha ao comprimir imagem'));
                        resolve(new File([blob], 'avatar.webp', { type: 'image/webp' }));
                    },
                    'image/webp',
                    quality
                );
            };
            img.onerror = reject;
            img.src = objectUrl;
        });
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Imagem muito grande. Máximo: 10MB');
            return;
        }
        try {
            const compressed = await compressImage(file);
            setAvatarFile(compressed);
            setAvatarPreview(URL.createObjectURL(compressed));
        } catch {
            // Fallback sem compressão
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const SOCIAL_NETWORKS = [
        { id: 'linkedin_url', label: 'LinkedIn', icon: Linkedin },
        { id: 'github_url', label: 'GitHub', icon: Github },
        { id: 'youtube_url', label: 'YouTube', icon: Youtube },
        { id: 'instagram_url', label: 'Instagram', icon: Instagram },
        { id: 'tiktok_url', label: 'TikTok', icon: TikTokIcon },
    ];

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema) as any,
        defaultValues: {
            email: '',
            full_name: '',
            bio: '',
            username: '',
            use_nickname: false,
            institute: '',
            other_institute: '',
            course: '',
            education_level: '',
            external_institution: '',
            whatsapp: '',
            entrance_year: '',
            artistic_interests_str: '',
            lattes_url: '',
            linkedin_url: '',
            github_url: '',
            youtube_url: '',
            tiktok_url: '',
            instagram_url: '',
            new_nickname: '',
            available_to_mentor: false,
            seeking_mentor: false,
            research_line: '',
            office_room: '',
            laboratory_name: '',
            department: '',
            is_labdiv: false,
            is_visible: true,
            user_category: 'curioso',
            seeking_assistant: false,
            interest_area: '',
            member_initiatives: [],
        }
    });

    const [profileData, setProfileData] = useState<Profile | null>(null);

    const useNickname = watch('use_nickname');
    const seekingMentor = watch('seeking_mentor');
    const availableToMentor = watch('available_to_mentor');
    const selectedInstitute = watch('institute');

    const formEmail = watch('email');
    const isUspUser = formEmail ? (formEmail.endsWith('@usp.br') || formEmail.endsWith('@if.usp.br')) : false;

    const institutes = ['IF-USP', 'IME-USP', 'IQ-USP', 'FFLCH-USP', 'Outros'];
    const ifCourses = ['Bacharelado', 'Licenciatura', 'Física Médica'];

    useEffect(() => {
        if (isOpen) {
            loadInitialData();
        }
    }, [isOpen]);

    useEffect(() => {
        if (seekingMentor) {
            setValue('available_to_mentor', false);
        }
    }, [seekingMentor, setValue]);

    useEffect(() => {
        if (availableToMentor) {
            setValue('seeking_mentor', false);
        }
    }, [availableToMentor, setValue]);

    const loadInitialData = async () => {
        setIsLoading(true);

        // If admin mode, we might need a different way to fetch the profile since 
        // getProfileWithPseudonyms is for the "current" user.
        let profile: any;
        let pNames: any[] = [];

        if (adminMode && adminUserId) {
            const { data } = await supabase.from('profiles').select('*').eq('id', adminUserId).single();
            profile = data;
            const { data: ps } = await supabase.from('pseudonyms').select('*').eq('user_id', adminUserId);
            pNames = ps || [];
        } else {
            const res = await getProfileWithPseudonyms();
            if ('error' in res) {
                toast.error(res.error || 'Erro ao carregar dados');
                onClose();
                return;
            }
            profile = res.profile;
            pNames = res.pseudonyms || [];
        }

        if (profile) {
            setCurrentStatus(profile.review_status);
            setValue('email', profile.email || '');
            setValue('full_name', profile.full_name || '');
            setValue('bio', profile.bio || '');
            const hasUsername = Boolean(profile.username && profile.username.trim().length > 0);
            setValue('username', profile.username || '');
            // Se a pessoa possui apelido, o padrão é sempre ativá-lo como identidade pública (nome real protegido)
            setValue('use_nickname', hasUsername ? (profile.use_nickname ?? true) : false);

            setValue('education_level', profile.education_level || '');
            setValue('external_institution', profile.external_institution || '');

            if (profile.institute && ['IF-USP', 'IME-USP', 'IQ-USP', 'FFLCH-USP'].includes(profile.institute)) {
                setValue('institute', profile.institute);
                setValue('other_institute', '');
            } else if (profile.institute) {
                setValue('institute', 'Outros');
                setValue('other_institute', profile.institute);
            }

            setValue('course', profile.course || '');
            setValue('whatsapp', profile.whatsapp || '');
            setValue('entrance_year', profile.entrance_year?.toString() || new Date().getFullYear().toString());
            setValue('artistic_interests_str', profile.artistic_interests?.join(', ') || '');
            setValue('lattes_url', profile.lattes_url || '');
            setValue('linkedin_url', profile.linkedin_url || '');
            setValue('github_url', profile.github_url || '');
            setValue('youtube_url', profile.youtube_url || '');
            setValue('tiktok_url', profile.tiktok_url || '');
            setValue('instagram_url', profile.instagram_url || '');
            setValue('portfolio_url', profile.portfolio_url || '');

            const pNetworks = [];
            if (profile.linkedin_url) pNetworks.push('linkedin_url');
            if (profile.github_url) pNetworks.push('github_url');
            if (profile.youtube_url) pNetworks.push('youtube_url');
            if (profile.instagram_url) pNetworks.push('instagram_url');
            if (profile.tiktok_url) pNetworks.push('tiktok_url');
            setActiveNetworks(pNetworks);

            setValue('available_to_mentor', profile.available_to_mentor || false);
            setValue('seeking_mentor', profile.seeking_mentor || false);
            setValue('is_labdiv', profile.is_labdiv || false);
            const initList: string[] = Array.isArray(profile.member_initiatives) ? [...profile.member_initiatives] : [];
            if (profile.is_labdiv && !initList.includes('labdiv')) {
                initList.push('labdiv');
            }
            setValue('member_initiatives', initList);
            setValue('is_visible', profile.is_visible ?? true);
            setValue('persona', (profile.persona as any) || (profile.is_usp_member ? 'aluno' : 'curioso'));
            setValue('user_category', profile.user_category || 'curioso');
            setValue('cultural_language', profile.cultural_language || 'jovem');
            setValue('seeking_assistant', profile.seeking_assistant || false);
            setValue('research_line', profile.research_line || '');
            setValue('office_room', profile.office_room || '');
            setValue('laboratory_name', profile.laboratory_name || '');
            setValue('department', profile.department || '');
            setValue('interest_area', profile.interest_area || profile.ic_research_area || '');
            setProfileData(profile);
            setPseudonyms(pNames);
        }
        setIsLoading(false);
    };

    const handleCreateNickname = async () => {
        const name = watch('new_nickname')?.trim();
        if (!name || name.length < 3) {
            toast.error("Apelido muito curto");
            return;
        }

        setIsCreatingNickname(true);
        const res = await createPseudonym(name);
        if (res.success && res.data) {
            toast.success("Apelido cadastrado e definido como seu nome público!");
            setPseudonyms(prev => [...prev, res.data]);
            setValue('username', res.data.name, { shouldDirty: true });
            setValue('use_nickname', true, { shouldDirty: true });
            setValue('new_nickname', '');
            
            // Auto-save the new nickname to profile so it goes to admin approval immediately
            if (!adminMode) {
                await updateProfile({
                    username: res.data.name,
                    use_nickname: true
                });
            }
        } else {
            toast.error(res.error || "Erro ao criar apelido");
        }
        setIsCreatingNickname(false);
    };

    const onSubmit = async (data: ProfileFormValues) => {
        setIsSaving(true);

        let avatarUrl = profileData?.avatar_url || null;

        // Upload do novo avatar se houver
        if (avatarFile) {
            setIsUploadingAvatar(true);
            const targetUserId = adminUserId || profileData?.id;
            const ext = avatarFile.name.split('.').pop();
            const filePath = `${targetUserId}/avatar-${Date.now()}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, avatarFile, { upsert: true });
            if (uploadError) {
                toast.error('Erro ao enviar a foto: ' + uploadError.message);
                setIsUploadingAvatar(false);
                setIsSaving(false);
                return;
            }
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            avatarUrl = urlData.publicUrl;
            setIsUploadingAvatar(false);
        }

        // Remove new_nickname and email (read-only) and map fields to profileData
        const { new_nickname, email, artistic_interests_str, entrance_year, other_institute, education_level, external_institution, research_line, interest_area, office_room, laboratory_name, department, ...restData } = data;

        const typedNickname = new_nickname?.trim();
        const finalUsername = typedNickname || data.username?.trim() || '';
        const finalUseNickname = finalUsername ? (data.use_nickname !== false) : false;

        const updatedProfileData: any = {
            ...restData,
            username: finalUsername,
            use_nickname: finalUseNickname,
            member_initiatives: Array.isArray(data.member_initiatives) ? data.member_initiatives : [],
            is_labdiv: Array.isArray(data.member_initiatives)
                ? data.member_initiatives.includes('labdiv')
                : Boolean(data.is_labdiv),
            research_line,
            interest_area,
            office_room,
            laboratory_name,
            department,
            institute: data.institute === 'Outros' ? other_institute : data.institute,
            // Em modo admin, aplica o avatar direto. Para usuários, mantém o avatar atual —
            // a nova URL vai para pending_edits.pending_avatar_url via campo separado abaixo.
            avatar_url: adminMode ? avatarUrl : (profileData?.avatar_url || null),
            usp_proof_url: profileData?.usp_proof_url || null,
            entrance_year: entrance_year ? parseInt(entrance_year, 10) : null,
            artistic_interests: artistic_interests_str
                ? artistic_interests_str.split(',').map((s: string) => s.trim()).filter(Boolean)
                : [],
            education_level: education_level,
            external_institution: external_institution
        };

        // Para usuários normais: se tiver nova foto, incluir pending_avatar_url para review
        if (!adminMode && avatarUrl && avatarUrl !== profileData?.avatar_url) {
            updatedProfileData.pending_avatar_url = avatarUrl;
        }

        if (adminMode && adminUserId) {
            const res = await updateProfileAsAdmin(adminUserId, updatedProfileData);
            if (res.success) {
                toast.success('Perfil atualizado pelo admin!');
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || 'Erro ao salvar alterações');
            }
        } else {
            const res = await updateProfile(updatedProfileData as any);
            if (res.success) {
                toast.success('Alterações enviadas para aprovação!');
                onSuccess();
                onClose();
            } else {
                toast.error(res.error || 'Erro ao salvar alterações');
            }
        }
        setIsSaving(false);
    };

    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-background-dark/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white dark:bg-[#1E1E1E] w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 dark:border-white/5 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-widest">Editar Perfil</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">Personalize seu Laboratório Pessoal</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto hidden-scrollbar">
                        {(currentStatus === 'pending' || hasActivePendingEdits(profileData?.pending_edits)) && !adminMode && (
                            <div className="p-4 bg-[#FFCC00]/15 dark:bg-[#FFCC00]/10 border border-[#FFCC00]/40 rounded-2xl flex items-start gap-3">
                                <Clock className="w-5 h-5 text-[#B45309] dark:text-[#FFCC00] shrink-0 mt-0.5" />
                                <p className="text-[11px] font-bold text-[#92400E] dark:text-[#FFCC00] leading-relaxed">
                                    ⏳ <span className="font-black uppercase">Alterações em análise:</span> Suas edições recentes (foto, nome, bio, iniciativas ou dados) estão aguardando aprovação da moderação. <span className="underline">Esta prévia atualizada está visível apenas para você</span> — os demais usuários continuam vendo a última versão aprovada do seu perfil.
                                </p>
                            </div>
                        )}

                        {/* Avatar Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-brand-blue/30 bg-white/5 flex items-center justify-center">
                                    {avatarPreview || profileData?.avatar_url ? (
                                        <img
                                            src={avatarPreview || profileData?.avatar_url || ''}
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <User className="w-10 h-10 text-gray-500" />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                >
                                    <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
                                </button>
                            </div>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => avatarInputRef.current?.click()}
                                className="text-[10px] font-black uppercase tracking-widest text-brand-blue hover:underline flex items-center gap-1"
                            >
                                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                                {avatarPreview ? 'Trocar foto' : 'Adicionar foto de perfil'}
                            </button>
                            {avatarPreview && (
                                <button
                                    type="button"
                                    onClick={() => { setAvatarFile(null); setAvatarPreview(null); }}
                                    className="text-[9px] font-bold uppercase tracking-widest text-brand-red hover:underline"
                                >
                                    Cancelar alteração
                                </button>
                            )}
                        </div>

                        {adminMode && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-brand-red/5 border border-brand-red/10 rounded-2xl">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">Membro Lab-Div</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('is_labdiv')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                                    </label>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-red">Visibilidade</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            {...register('is_visible')}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* 1. INFORMAÇÕES BÁSICAS (Locked for non-admin) */}
                        <div className="space-y-4">
                            <div className={`space-y-2 ${!adminMode && 'opacity-70'}`}>
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <Mail className="w-3 h-3" /> E-mail {!adminMode && '(Bloqueado)'}
                                </label>
                                <input
                                    {...register('email')}
                                    readOnly={!adminMode}
                                    className={`w-full bg-gray-100 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm outline-none ${!adminMode ? 'cursor-not-allowed text-gray-400' : 'focus:border-brand-blue/50 text-gray-900 dark:text-white font-bold'}`}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center justify-between gap-2">
                                    <span className="flex items-center gap-2">
                                        <User className="w-3 h-3" /> Nome Completo
                                    </span>
                                    {!adminMode && (
                                        <span className="text-[9px] font-bold text-[#B45309] dark:text-[#FFCC00] uppercase">
                                            Sujeito à aprovação
                                        </span>
                                    )}
                                </label>
                                <input
                                    {...register('full_name')}
                                    className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all text-gray-900 dark:text-white font-bold"
                                />
                                {errors.full_name && <p className="text-[10px] text-brand-red font-bold uppercase ml-1">{errors.full_name.message}</p>}
                            </div>

                            {/* IDENTIDADE PÚBLICA & NOME DE EXIBIÇÃO NO HUB */}
                            <div className="p-4 bg-brand-blue/5 dark:bg-white/[0.02] border border-brand-blue/20 dark:border-white/10 rounded-2xl space-y-3.5">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-brand-blue/15 text-brand-blue rounded-lg flex items-center justify-center">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                                Nome Público no HUB (Identidade & Privacidade)
                                            </span>
                                        </div>
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-blue/15 text-brand-blue font-mono">
                                            Privacidade
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Você decide como quer aparecer na comunidade. Caso opte por um <strong>Apelido</strong>, ele será exibido <strong>sempre no lugar do seu nome</strong> em todos os posts, comentários e perfil. Seu nome real ficará <strong>protegido</strong> e visível apenas para você e a administração.
                                    </p>
                                </div>

                                {/* Opções de Seleção: Apelido vs Nome Completo */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setValue('use_nickname', true, { shouldDirty: true })}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                            watch('use_nickname')
                                                ? 'bg-brand-blue/15 dark:bg-brand-blue/25 border-brand-blue text-brand-blue dark:text-white ring-2 ring-brand-blue/30'
                                                : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:border-brand-blue/40'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                                                🛡️ Usar Meu Apelido
                                            </span>
                                            {watch('use_nickname') && (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                                            )}
                                        </div>
                                        <p className="text-[10px] leading-snug opacity-80 font-medium">
                                            {watch('username')
                                                ? `Aparecerá como @${watch('username')}. Nome real 100% oculto.`
                                                : 'Defina seu apelido abaixo. Seu nome real ficará 100% oculto.'}
                                        </p>
                                        <span className="text-[8px] font-black uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 rounded w-fit">
                                            Recomendado
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setValue('use_nickname', false, { shouldDirty: true })}
                                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                            !watch('use_nickname')
                                                ? 'bg-brand-yellow/15 dark:bg-brand-yellow/20 border-brand-yellow text-gray-900 dark:text-white ring-2 ring-brand-yellow/30'
                                                : 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-400 hover:border-gray-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black uppercase tracking-tight flex items-center gap-1.5">
                                                👤 Usar Nome Real
                                            </span>
                                            {!watch('use_nickname') && (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-yellow" />
                                            )}
                                        </div>
                                        <p className="text-[10px] leading-snug opacity-80 font-medium">
                                            Seu nome completo ({watch('full_name') || 'Nome'}) ficará público para todos.
                                        </p>
                                        <span className="text-[8px] font-black uppercase bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-1.5 py-0.2 rounded w-fit">
                                            Sem anonimato
                                        </span>
                                    </button>
                                </div>

                                {/* Campo para cadastrar / alterar apelido */}
                                <div className="space-y-2 pt-2 border-t border-gray-200/60 dark:border-white/10">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                            {watch('username') ? `Apelido Atual: @${watch('username')}` : 'Cadastrar Apelido:'}
                                        </label>
                                        {watch('username') && (
                                            <span className="text-[9px] font-bold text-brand-blue uppercase">
                                                {watch('use_nickname') ? '✓ Ativo e público' : 'Inativo (usando nome real)'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            {...register('new_nickname')}
                                            placeholder={watch('username') ? 'Digitar outro apelido...' : 'Digite o apelido desejado...'}
                                            className="flex-1 bg-white dark:bg-background-dark/40 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue transition-all font-bold text-gray-900 dark:text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCreateNickname}
                                            disabled={isCreatingNickname || !watch('new_nickname')}
                                            className="px-4 py-2 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase hover:bg-brand-blue/80 disabled:opacity-50 transition-all cursor-pointer"
                                        >
                                            {isCreatingNickname ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Salvar Apelido'}
                                        </button>
                                    </div>
                                    <input type="hidden" {...register('username')} />
                                </div>

                                {/* Banner de Prévia em Tempo Real (O que a comunidade vê vs O que é privado) */}
                                <div className="p-3 rounded-xl bg-gray-100 dark:bg-black/30 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Eye className="w-4 h-4 text-brand-blue shrink-0" />
                                        <div className="min-w-0">
                                            <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">
                                                Visível para a comunidade:
                                            </span>
                                            <span className="font-black text-gray-900 dark:text-white truncate block">
                                                {watch('use_nickname') && (watch('username') || watch('new_nickname'))
                                                    ? `@${watch('username') || watch('new_nickname')}`
                                                    : watch('full_name') || 'Nome Completo'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="sm:text-right border-t sm:border-t-0 pt-1 sm:pt-0 border-gray-200 dark:border-white/5">
                                        <span className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">
                                            Nome Real Registrado:
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">
                                            {watch('full_name')} {watch('use_nickname') ? '(🔒 Oculto para terceiros)' : '(Público)'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <FileText className="w-3 h-3" /> Bio
                                </label>
                                <textarea
                                    {...register('bio')}
                                    rows={3}
                                    className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all placeholder:text-gray-400 resize-none"
                                    placeholder="Conte um pouco sobre você..."
                                />
                                {errors.bio && <p className="text-[10px] text-brand-red font-bold uppercase ml-1">{errors.bio.message}</p>}
                            </div>
                        </div>

                        {/* 2. IDENTIDADE PROTEGIDA, INICIATIVAS & SISTEMA DE SIGNOS LINGUÍSTICOS */}
                        <div className="space-y-5">
                            {/* BLOCO 1 & 2: VÍNCULO COM INICIATIVAS & ESPAÇOS + SOLICITAÇÃO */}
                            <div className="p-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/70 dark:border-white/10 rounded-2xl space-y-3.5">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-brand-blue" /> Vínculo com Iniciativas & Espaços
                                        </label>
                                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                                            Selecione os grupos de extensão, espaços ou projetos dos quais você faz parte.
                                            {!adminMode && ' Novos vínculos passam por validação no Eixo 04 (Governança).'}
                                        </p>
                                    </div>
                                    {!adminMode && Array.isArray(profileData?.pending_edits?.member_initiatives) && (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFCC00]/20 text-[#B45309] dark:text-[#FFCC00] border border-[#FFCC00]/40 text-[9px] font-black uppercase">
                                            <Clock className="w-2.5 h-2.5" /> Em revisão
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {INITIATIVE_LIST.map((initMeta) => {
                                        const currentInits: string[] = watch('member_initiatives') || [];
                                        const isSelected = currentInits.includes(initMeta.id);

                                        return (
                                            <button
                                                key={initMeta.id}
                                                type="button"
                                                onClick={() => {
                                                    const next = isSelected
                                                        ? currentInits.filter((i) => i !== initMeta.id)
                                                        : [...currentInits, initMeta.id];
                                                    setValue('member_initiatives', next, { shouldDirty: true });
                                                    if (initMeta.id === 'labdiv') {
                                                        setValue('is_labdiv', !isSelected, { shouldDirty: true });
                                                    }
                                                }}
                                                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                                    isSelected ? initMeta.chipSelectedClasses : initMeta.chipUnselectedClasses
                                                }`}
                                            >
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${initMeta.dotClasses}`} />
                                                    <div className="min-w-0">
                                                        <span className="block text-xs font-black uppercase tracking-tight truncate">
                                                            {initMeta.shortLabel}
                                                        </span>
                                                        <span className="block text-[9px] opacity-75 font-medium truncate">
                                                            {initMeta.id === 'labdiv' && 'Divulgação Científica IFUSP'}
                                                            {initMeta.id === 'show_da_fisica' && 'Demonstrações & Experimentos'}
                                                            {initMeta.id === 'hs' && 'Hackerspace • Hardware & Código'}
                                                            {initMeta.id === 'profis' && 'Programa de Ensino Superior'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                                    isSelected ? 'border-current bg-current/15' : 'border-gray-300 dark:border-white/20'
                                                }`}>
                                                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Caixinha Retrátil: Solicitar Inclusão de Nova Iniciativa */}
                                <div className="pt-2 border-t border-gray-200/60 dark:border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setShowInitiativeRequestBox((prev) => !prev)}
                                        className="w-full flex items-center justify-between text-left py-1.5 px-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-blue dark:text-[#FFCC00] flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            Faz parte de outra iniciativa ou espaço que ainda não está no HUB? Envie para a Governança
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showInitiativeRequestBox ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                        {showInitiativeRequestBox && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mt-3 p-3.5 bg-white dark:bg-[#161616] border border-gray-200 dark:border-white/10 rounded-2xl space-y-3">
                                                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                                        Sua solicitação irá direto para o <strong className="text-gray-900 dark:text-white">Eixo 04 (Perfis, Personas & Governança)</strong> na Torre de Controle para que a equipe valide e cadastre o selo oficial.
                                                    </p>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                                        <div className="sm:col-span-2">
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Nome da Iniciativa / Espaço *</label>
                                                            <input
                                                                type="text"
                                                                value={initiativeReqForm.initiative_name}
                                                                onChange={(e) => setInitiativeReqForm((s) => ({ ...s, initiative_name: e.target.value }))}
                                                                placeholder="Ex: Grupo de Astronomia Amadora"
                                                                className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-blue"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Sigla (Opcional)</label>
                                                            <input
                                                                type="text"
                                                                value={initiativeReqForm.acronym}
                                                                onChange={(e) => setInitiativeReqForm((s) => ({ ...s, acronym: e.target.value }))}
                                                                placeholder="Ex: GAA"
                                                                className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-blue"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">O que a iniciativa faz / onde atua? *</label>
                                                        <textarea
                                                            rows={2}
                                                            value={initiativeReqForm.description}
                                                            onChange={(e) => setInitiativeReqForm((s) => ({ ...s, description: e.target.value }))}
                                                            placeholder="Descreva as atividades, instituto de origem e objetivo..."
                                                            className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs outline-none focus:border-brand-blue resize-none"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Responsável / Coordenador(a) *</label>
                                                            <input
                                                                type="text"
                                                                value={initiativeReqForm.responsible_name}
                                                                onChange={(e) => setInitiativeReqForm((s) => ({ ...s, responsible_name: e.target.value }))}
                                                                placeholder="Nome completo"
                                                                className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-blue"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-1">Contato (E-mail USP / WhatsApp / @Insta) *</label>
                                                            <input
                                                                type="text"
                                                                value={initiativeReqForm.contact_info}
                                                                onChange={(e) => setInitiativeReqForm((s) => ({ ...s, contact_info: e.target.value }))}
                                                                placeholder="email@usp.br ou (11) 99999-9999"
                                                                className="w-full mt-1 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-brand-blue"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-end pt-1">
                                                        <button
                                                            type="button"
                                                            disabled={isSubmittingInitiativeReq}
                                                            onClick={handleInitiativeRequestSubmit}
                                                            className="px-4 py-2 bg-[#0F4780] hover:bg-[#0F4780]/90 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {isSubmittingInitiativeReq ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                                            Enviar para Governança (Eixo 04)
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* BLOCO 3: SISTEMA DE SIGNOS LINGUÍSTICOS E MEDIAÇÃO SEMIÓTICA */}
                            <div className="p-4 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200/70 dark:border-white/10 rounded-2xl space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white flex items-center gap-1.5">
                                            <MessageSquare className="w-3.5 h-3.5 text-[#F14343]" /> Sistema de Signos Linguísticos & Mediação Semiótica
                                        </label>
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-[#0F4780]/10 dark:bg-[#FFCC00]/15 text-[#0F4780] dark:text-[#FFCC00] font-mono">
                                            Semiótica LabDiv
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">
                                        Esta escolha alimenta o motor de <strong>Mediação Semiótica do HUB</strong>: adaptamos o vocabulário, os signos e as metáforas científicas cruzando o seu <strong>repertório cultural</strong> com a sua <strong>área de interesse</strong>.
                                    </p>
                                </div>

                                {/* 4 Cards Interativos M3 */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {[
                                        {
                                            id: 'jovem',
                                            icon: '⚡',
                                            title: 'Jovem / Dinâmica',
                                            tone: 'Direto, visual, cotidiano e conectado ao agora',
                                            example: '"Entropia é tipo o seu quarto: sem energia extra pra arrumar, o caos só cresce."',
                                            activeRing: 'border-[#FFCC00] bg-[#FFCC00]/10 dark:bg-[#FFCC00]/10 ring-2 ring-[#FFCC00]/30',
                                        },
                                        {
                                            id: 'nerd_geek',
                                            icon: '🎮',
                                            title: 'Nerd / Geek',
                                            tone: 'Referências de Sci-Fi, Games, RPG, Fantasia e Pop Tech',
                                            example: '"O tunelamento quântico é basicamente atravessar a parede da dungeon com 1% de chance no dado."',
                                            activeRing: 'border-[#0F4780] dark:border-[#3B82F6] bg-[#0F4780]/10 dark:bg-[#3B82F6]/15 ring-2 ring-[#3B82F6]/30',
                                        },
                                        {
                                            id: 'artistica',
                                            icon: '🎨',
                                            title: 'Artística / Sensível',
                                            tone: 'Estética, sinestesia, música, cinema e poesia visual',
                                            example: '"Ondas gravitacionais são acordes silenciosos vibrando no tecido do espaço-tempo."',
                                            activeRing: 'border-[#F14343] bg-[#F14343]/10 dark:bg-[#F14343]/15 ring-2 ring-[#F14343]/30',
                                        },
                                        {
                                            id: 'academica',
                                            icon: '🏛️',
                                            title: 'Acadêmica / Formal',
                                            tone: 'Rigor conceitual, nomenclatura técnica e precisão analítica',
                                            example: '"A evolução temporal do estado quântico obedece estritamente à equação unitária de Schrödinger."',
                                            activeRing: 'border-emerald-600 dark:border-emerald-400 bg-emerald-500/10 ring-2 ring-emerald-500/30',
                                        },
                                    ].map((card) => {
                                        const isSelected = watch('cultural_language') === card.id;
                                        return (
                                            <button
                                                key={card.id}
                                                type="button"
                                                onClick={() => setValue('cultural_language', card.id as any, { shouldDirty: true })}
                                                className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                                                    isSelected
                                                        ? card.activeRing
                                                        : 'bg-white dark:bg-[#181818] border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/25'
                                                }`}
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                                                            <span>{card.icon}</span> {card.title}
                                                        </span>
                                                        {isSelected && (
                                                            <CheckCircle2 className="w-4 h-4 text-brand-blue dark:text-[#FFCC00] shrink-0" />
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 leading-snug">
                                                        {card.tone}
                                                    </p>
                                                </div>
                                                <p className="text-[10px] italic text-gray-600 dark:text-gray-300 bg-black/[0.03] dark:bg-white/[0.04] p-2 rounded-xl border border-black/5 dark:border-white/5 leading-snug">
                                                    {card.example}
                                                </p>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Campo rápido de Área de Interesse sincronizado + Emulador de Analogia ao vivo */}
                                <div className="pt-1 space-y-2.5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                            Cruzar signo com sua Área de Interesse / Hobby:
                                        </label>
                                        <input
                                            {...register('interest_area')}
                                            placeholder="Ex: Astrofísica, Música, RPG, Robótica..."
                                            className="sm:w-64 bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-brand-blue"
                                        />
                                    </div>

                                    {(() => {
                                        const lang = watch('cultural_language') || 'jovem';
                                        const rawInterest = (watch('interest_area') || watch('artistic_interests_str') || 'Física & Universo').split(',')[0].trim() || 'Física & Universo';

                                        const analogyMap: Record<string, string> = {
                                            jovem: `Quando você ler sobre um fenômeno complexo, o HUB vai conectar o conceito direto com "${rawInterest}" de um jeito descomplicado, visual e sem enrolação.`,
                                            nerd_geek: `Conceitos densos serão traduzidos usando mecânicas de mundo, lore e sistemas inspirados em "${rawInterest}" — como uma skill tree científica.`,
                                            artistica: `A ciência será apresentada pela lente estética e sensorial de "${rawInterest}", traduzindo equações em ritmo, contraste, forma e movimento.`,
                                            academica: `Os conteúdos priorizarão o formalismo teórico, referências primárias e conexões interdisciplinares diretas com a pesquisa em "${rawInterest}".`,
                                        };

                                        return (
                                            <div className="p-3 rounded-xl bg-gradient-to-r from-[#0F4780]/10 via-[#F14343]/5 to-[#FFCC00]/10 border border-[#0F4780]/20 dark:border-white/10 flex items-start gap-2.5">
                                                <Sparkles className="w-4 h-4 text-[#0F4780] dark:text-[#FFCC00] shrink-0 mt-0.5" />
                                                <div className="text-[11px] leading-snug">
                                                    <span className="font-black uppercase text-gray-900 dark:text-white">
                                                        Emulador Semiótico ({lang.replace('_', '/').toUpperCase()} × {rawInterest}):{' '}
                                                    </span>
                                                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                        {analogyMap[lang] || analogyMap.jovem}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* 4 PERSONAS LABDIV */}
                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <GraduationCap className="w-3.5 h-3.5 text-brand-blue" /> Sua Persona Oficial no HUB
                                </label>

                                {adminMode ? (
                                    <div className="flex items-center gap-2">
                                        <select
                                            {...register('persona')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-brand-red/30 rounded-2xl px-4 py-3 text-sm focus:border-brand-red outline-none transition-all cursor-pointer font-black text-gray-900 dark:text-white uppercase tracking-tight"
                                        >
                                            <option value="aluno">Aluno USP</option>
                                            <option value="professor">Professor / Docente</option>
                                            <option value="curioso">Curioso / Visitante</option>
                                            <option value="iniciativa">Iniciativa Institucional</option>
                                        </select>
                                        <span className="text-[8px] font-black bg-brand-red/10 text-brand-red px-2 py-0.5 rounded uppercase font-mono h-fit shrink-0">Admin Persona</span>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="p-4 bg-gray-50 dark:bg-background-dark/30 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2.5">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${
                                                        watch('persona') === 'professor' ? 'bg-[#FFCC00]' :
                                                        watch('persona') === 'aluno' ? 'bg-[#0F4780]' :
                                                        watch('persona') === 'iniciativa' ? 'bg-[#F14343]' :
                                                        'bg-gray-400'
                                                    }`} />
                                                    <span className="text-sm font-black uppercase tracking-tight text-gray-900 dark:text-white font-bukra">
                                                        {watch('persona') === 'professor' ? 'Docente / Professor USP' :
                                                         watch('persona') === 'aluno' ? 'Aluno USP' :
                                                         watch('persona') === 'iniciativa' ? 'Iniciativa Institucional' :
                                                         'Curioso / Visitante'}
                                                    </span>
                                                </div>
                                                <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase font-mono border ${
                                                    watch('persona') === 'professor' ? 'bg-[#FFCC00]/15 text-[#FFCC00] border-[#FFCC00]/30' :
                                                    watch('persona') === 'aluno' ? 'bg-[#0F4780]/15 text-[#0F4780] border-[#0F4780]/30' :
                                                    watch('persona') === 'iniciativa' ? 'bg-[#F14343]/15 text-[#F14343] border-[#F14343]/30' :
                                                    'bg-gray-500/15 text-gray-400 border-gray-500/30'
                                                }`}>
                                                    Persona Ativa
                                                </span>
                                            </div>

                                            {/* Alternância Aluno/Curioso para quem tem e-mail USP */}
                                            {isUspUser && watch('persona') !== 'professor' && watch('persona') !== 'iniciativa' && (
                                                <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-400 font-bold">Alternar:</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('persona', 'aluno')}
                                                        className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase transition-all ${
                                                            watch('persona') === 'aluno'
                                                                ? 'bg-[#0F4780] text-white shadow-sm'
                                                                : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-white/5'
                                                        }`}
                                                    >
                                                        Aluno USP
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setValue('persona', 'curioso')}
                                                        className={`px-3 py-1 rounded-xl text-[11px] font-black uppercase transition-all ${
                                                            watch('persona') === 'curioso'
                                                                ? 'bg-gray-700 text-white shadow-sm'
                                                                : 'bg-white dark:bg-white/5 text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-white/5'
                                                        }`}
                                                    >
                                                        Curioso
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Status de Verificação Docente */}
                                        {profileData?.persona === 'professor' ? (
                                            <div className="p-3 bg-[#FFCC00]/10 border border-[#FFCC00]/25 rounded-2xl flex items-center gap-2.5">
                                                <CheckCircle2 className="w-4 h-4 text-[#FFCC00] shrink-0" />
                                                <p className="text-[11px] font-bold text-[#FFCC00] uppercase tracking-tight">
                                                    Docente Verificado IFUSP/USP com acesso a recursos acadêmicos exclusivos.
                                                </p>
                                            </div>
                                        ) : profileData?.teacher_verification_status === 'pending' ? (
                                            <div className="p-3 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl flex items-center gap-2.5 animate-pulse">
                                                <Clock className="w-4 h-4 text-brand-yellow shrink-0" />
                                                <p className="text-[11px] font-bold text-brand-yellow uppercase tracking-tight">
                                                    Comprovante docente em análise pela moderação do HUB.
                                                </p>
                                            </div>
                                        ) : isUspUser ? (
                                            <div className="p-3.5 bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl space-y-2.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                                                            <GraduationCap className="w-3.5 h-3.5 text-brand-yellow" /> É Docente da USP?
                                                        </p>
                                                        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                                                            Envie holerite, ata de posse ou declaração funcional para receber o selo oficial de Professor.
                                                        </p>
                                                    </div>
                                                    {profileData?.teacher_verification_status === 'rejected' && (
                                                        <span className="text-[8px] font-bold bg-brand-red/15 text-brand-red px-2 py-0.5 rounded-full uppercase shrink-0">
                                                            Recusado
                                                        </span>
                                                    )}
                                                </div>

                                                <input
                                                    type="file"
                                                    ref={teacherProofInputRef}
                                                    onChange={handleTeacherProofUpload}
                                                    accept=".pdf,image/png,image/jpeg,image/webp"
                                                    className="hidden"
                                                />

                                                <button
                                                    type="button"
                                                    disabled={isUploadingTeacherProof}
                                                    onClick={() => teacherProofInputRef.current?.click()}
                                                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#FFCC00]/50 hover:border-[#FFCC00] bg-[#FFCC00]/5 hover:bg-[#FFCC00]/10 text-xs font-black text-[#FFCC00] uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                                                >
                                                    {isUploadingTeacherProof ? (
                                                        <>
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                            Enviando Comprovante...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FileUp className="w-3.5 h-3.5" />
                                                            {profileData?.teacher_verification_status === 'rejected' ? 'Reenviar Comprovante Docente' : 'Enviar Comprovante de Docência'}
                                                        </>
                                                    )}
                                                </button>
                                                <p className="text-[9px] text-gray-400 text-center font-mono">
                                                    LGPD: O arquivo é expurgado do servidor imediatamente após a avaliação da moderação.
                                                </p>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            {/* Categoria Acadêmica Detalhada */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                    <Users className="w-3 h-3" /> Categoria Acadêmica
                                </label>
                                {adminMode ? (
                                    <div className="flex items-center gap-2">
                                        <select
                                            {...register('user_category')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-brand-red/30 rounded-2xl px-4 py-3 text-sm focus:border-brand-red outline-none transition-all cursor-pointer font-black text-gray-900 dark:text-white uppercase tracking-tight"
                                        >
                                            <option value="bacharelado">Aluno Bacharelado</option>
                                            <option value="fisica_medica">Aluno Física Médica</option>
                                            <option value="licenciatura">Aluno Licenciatura</option>
                                            <option value="pos_graduacao">Aluno Pós</option>
                                            <option value="pesquisador">Professor/Pesquisador</option>
                                            <option value="outro_instituto">Outro Instituto</option>
                                            <option value="curioso">Curioso / Visitante</option>
                                        </select>
                                        <span className="text-[8px] font-black bg-brand-red/10 text-brand-red px-2 py-0.5 rounded uppercase font-mono h-fit shrink-0">Admin Edit</span>
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-between">
                                        <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                            {watch('user_category')?.replace('_', ' ') || 'Curioso'}
                                        </span>
                                        <span className="text-[8px] font-black bg-brand-blue/10 text-brand-blue px-2 py-0.5 rounded uppercase font-mono">ID LabDiv</span>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* 3. CONECTIVIDADE E INTERESSES */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> WhatsApp
                                    </label>
                                    <input
                                        {...register('whatsapp')}
                                        className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all"
                                        placeholder="(11) 98765-4321"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <LinkIcon className="w-3 h-3" /> Currículo Lattes
                                    </label>
                                    <input
                                        {...register('lattes_url')}
                                        className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all"
                                        placeholder="https://lattes.cnpq.br/..."
                                    />
                                    {errors.lattes_url && <p className="text-[10px] text-brand-red font-bold ml-1 uppercase">{errors.lattes_url.message}</p>}
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                        <Globe className="w-3 h-3" /> Site Pessoal / Portfólio
                                    </label>
                                    <input
                                        {...register('portfolio_url')}
                                        className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all"
                                        placeholder="https://seu-site.com..."
                                    />
                                    {errors.portfolio_url && <p className="text-[10px] text-brand-red font-bold ml-1 uppercase">{errors.portfolio_url.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                                    Redes Sociais
                                </label>

                                {activeNetworks.map(netId => {
                                    const network = SOCIAL_NETWORKS.find(n => n.id === netId)!;
                                    const Icon = network.icon;
                                    const errorMsg = (errors as any)[netId]?.message;

                                    return (
                                        <div key={netId} className="flex flex-col gap-1 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl shrink-0">
                                                    <Icon className="w-4 h-4 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <input
                                                        {...register(netId as any)}
                                                        className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all placeholder:text-gray-400 font-bold text-gray-900 dark:text-white"
                                                        placeholder={`Link do seu ${network.label}...`}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveNetworks(prev => prev.filter(id => id !== netId));
                                                        setValue(netId as any, '');
                                                    }}
                                                    className="p-3 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-2xl transition-colors"
                                                    title={`Remover ${network.label}`}
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            {errorMsg && <p className="text-[10px] text-brand-red font-bold ml-[52px] uppercase tracking-tight">{errorMsg as React.ReactNode}</p>}
                                        </div>
                                    );
                                })}

                                {/* Add Network Flow */}
                                {SOCIAL_NETWORKS.filter(n => !activeNetworks.includes(n.id)).length > 0 && (
                                    <div className="mt-2">
                                        {!isAddingNetwork ? (
                                            <button
                                                type="button"
                                                onClick={() => setIsAddingNetwork(true)}
                                                className="w-full py-4 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-blue hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2"
                                            >
                                                + Vincular Rede Social
                                            </button>
                                        ) : (
                                            <div className="p-3 bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                                <select
                                                    value={selectedNetworkToAdd}
                                                    onChange={(e) => setSelectedNetworkToAdd(e.target.value)}
                                                    className="flex-1 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-3 text-xs focus:border-brand-blue/50 outline-none font-bold cursor-pointer transition-all uppercase tracking-tight"
                                                >
                                                    <option value="" disabled>Escolha a rede...</option>
                                                    {SOCIAL_NETWORKS.filter(n => !activeNetworks.includes(n.id)).map(net => (
                                                        <option key={net.id} value={net.id}>{net.label}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (selectedNetworkToAdd) {
                                                            setActiveNetworks(prev => [...prev, selectedNetworkToAdd]);
                                                            setSelectedNetworkToAdd('');
                                                            setIsAddingNetwork(false);
                                                        }
                                                    }}
                                                    disabled={!selectedNetworkToAdd}
                                                    className="px-5 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue/80 disabled:opacity-50 transition-all border border-brand-blue shadow-lg shadow-brand-blue/20"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsAddingNetwork(false);
                                                        setSelectedNetworkToAdd('');
                                                    }}
                                                    className="p-3 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Star className="w-3 h-3" /> Hobbies e Artes
                                </div>
                                <button
                                    type="button"
                                    onMouseEnter={() => setShowHobbiesHelp(true)}
                                    onMouseLeave={() => setShowHobbiesHelp(false)}
                                    className="p-1 hover:bg-brand-blue/10 rounded-full transition-colors text-brand-blue"
                                >
                                    <Info className="w-3.5 h-3.5 transition-transform" />
                                </button>
                            </label>
                            <input
                                {...register('artistic_interests_str')}
                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all placeholder:text-gray-400"
                                placeholder="O que você faz nas horas vagas?"
                            />

                            <AnimatePresence>
                                {showHobbiesHelp && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                                        className="absolute left-0 right-0 z-50 mt-2 p-5 bg-white dark:bg-[#252525] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl"
                                    >
                                        <div className="space-y-3">
                                            <p className="text-[10px] text-gray-900 dark:text-white leading-relaxed font-bold uppercase tracking-tight">
                                                Inspiração para o Perfil:
                                            </p>
                                            <ul className="space-y-2 text-[9px] text-gray-500 font-mono">
                                                <li>• <span className="text-brand-blue font-black">Artes:</span> Fotografia, Desenho, Música, Cinema.</li>
                                                <li>• <span className="text-brand-blue font-black">Jogos:</span> RPG, Boardgames, Videogames, Xadrez.</li>
                                                <li>• <span className="text-brand-blue font-black">Maker:</span> Arduino, Impressão 3D, Game Dev.</li>
                                                <li>• <span className="text-brand-blue font-black">Outros:</span> Trilhas, Astronomia, Culinária.</li>
                                            </ul>
                                        </div>
                                        <div className="absolute -top-1 right-6 w-2 h-2 bg-white dark:bg-[#252525] rotate-45 border-l border-t border-gray-200 dark:border-white/10" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 4. SEÇÕES CONDICIONAIS POR CATEGORIA */}
                        <div className="space-y-6 pt-6 border-t border-gray-100 dark:border-white/5">
                            {!isUspUser && watch('user_category') !== 'pesquisador' && watch('user_category') !== 'docente_pesquisador' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Briefcase className="w-3 h-3" /> Formação Acadêmica
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Escolaridade</label>
                                            <select
                                                {...register('education_level')}
                                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                                            >
                                                <option value="" disabled>Selecione</option>
                                                <option value="Ensino Médio">Ensino Médio</option>
                                                <option value="Graduação (Em andamento)">Graduação (Em andamento)</option>
                                                <option value="Graduação (Concluída)">Graduação (Concluída)</option>
                                                <option value="Pós-graduação / Pesquisa">Pós-graduação / Pesquisa</option>
                                                <option value="Entusiasta / Autodidata">Entusiasta / Autodidata</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instituição</label>
                                            <input
                                                {...register('external_institution')}
                                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all"
                                                placeholder="Sua escola ou faculdade"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Área de Interesse</label>
                                        <input
                                            {...register('interest_area')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all font-bold"
                                            placeholder="Ex: Astrofísica, Robótica, IA..."
                                        />
                                    </div>
                                </div>
                            )}

                            {isUspUser && watch('user_category') !== 'pesquisador' && watch('user_category') !== 'docente_pesquisador' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h3 className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Zap className="w-3 h-3" /> Protocolos USP
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instituto</label>
                                            <select
                                                {...register('institute')}
                                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                                            >
                                                <option value="" disabled>Selecione</option>
                                                {institutes.map(inst => <option key={inst} value={inst}>{inst}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Curso</label>
                                            {selectedInstitute === 'IF-USP' ? (
                                                <select
                                                    {...register('course')}
                                                    className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all appearance-none cursor-pointer font-bold"
                                                >
                                                    <option value="" disabled>Selecione seu curso</option>
                                                    <option value="Bacharelado em Física">Bacharelado em Física</option>
                                                    <option value="Licenciatura em Física">Licenciatura em Física</option>
                                                    <option value="Física Médica">Física Médica</option>
                                                </select>
                                            ) : (
                                                <input
                                                    {...register('course')}
                                                    className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all font-bold"
                                                    placeholder="Ex: Bacharelado em Matemática"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Ano de Ingresso
                                        </label>
                                        <input
                                            type="number"
                                            {...register('entrance_year')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-blue/50 outline-none transition-all"
                                            placeholder="Ex: 2022"
                                        />
                                    </div>

                                    {(() => {
                                        const entranceYear = parseInt(watch('entrance_year') || '0');
                                        const currentYear = new Date().getFullYear();
                                        const canMentor = currentYear - entranceYear >= 2;
                                        const isMentor = watch('available_to_mentor');
                                        const isBixo = watch('seeking_mentor');
                                        return (
                                            <div className="grid grid-cols-2 gap-3">
                                                {/* Bloco Mentor */}
                                                <button
                                                    type="button"
                                                    disabled={!canMentor}
                                                    onClick={() => { if (canMentor) { setValue('available_to_mentor', !isMentor); if (!isMentor) setValue('seeking_mentor', false); } }}
                                                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all text-left ${!canMentor
                                                        ? 'opacity-40 cursor-not-allowed border-gray-700 bg-gray-900/30'
                                                        : isMentor
                                                            ? 'border-brand-blue bg-brand-blue/10 shadow-lg shadow-brand-blue/20 scale-[1.02]'
                                                            : 'border-gray-700 hover:border-brand-blue/50 bg-white/[0.02] hover:bg-brand-blue/5 cursor-pointer'
                                                        }`}
                                                >
                                                    {isMentor && <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-transparent pointer-events-none" />}
                                                    <div className="relative z-10 space-y-2">
                                                        <div className="text-2xl">🎓</div>
                                                        <div className="text-xs font-black uppercase tracking-tight text-brand-blue">Mentor</div>
                                                        <p className="text-[9px] text-gray-400 leading-relaxed">
                                                            {canMentor ? 'Adote um bixo e guie-o pelo IFUSP' : 'Requer 2+ anos de curso'}
                                                        </p>
                                                        <div className={`mt-2 w-full h-1 rounded-full ${isMentor ? 'bg-brand-blue' : 'bg-gray-700'} transition-all`} />
                                                    </div>
                                                    <input type="checkbox" {...register('available_to_mentor')} className="sr-only" disabled={!canMentor} />
                                                </button>

                                                {/* Bloco Bixo */}
                                                <button
                                                    type="button"
                                                    onClick={() => { setValue('seeking_mentor', !isBixo); if (!isBixo) setValue('available_to_mentor', false); }}
                                                    className={`relative overflow-hidden p-4 rounded-2xl border-2 transition-all text-left ${isBixo
                                                        ? 'border-brand-red bg-brand-red/10 shadow-lg shadow-brand-red/20 scale-[1.02]'
                                                        : 'border-gray-700 hover:border-brand-red/50 bg-white/[0.02] hover:bg-brand-red/5 cursor-pointer'
                                                        }`}
                                                >
                                                    {isBixo && <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-transparent pointer-events-none" />}
                                                    <div className="relative z-10 space-y-2">
                                                        <div className="text-2xl">💛</div>
                                                        <div className="text-xs font-black uppercase tracking-tight text-brand-red">Sou Bixo</div>
                                                        <p className="text-[9px] text-gray-400 leading-relaxed">Quero ser adotado por um veterano</p>
                                                        <div className={`mt-2 w-full h-1 rounded-full ${isBixo ? 'bg-brand-red' : 'bg-gray-700'} transition-all`} />
                                                    </div>
                                                    <input type="checkbox" {...register('seeking_mentor')} className="sr-only" />
                                                </button>
                                            </div>
                                        );
                                    })()}
                                </div>
                            )}

                            {(watch('user_category') === 'pesquisador' || watch('user_category') === 'docente_pesquisador') && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h3 className="text-[10px] font-black text-brand-yellow uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Microscope className="w-3 h-3" /> Configuração de Laboratório
                                    </h3>

                                    <div className="p-4 bg-brand-yellow/5 border border-brand-yellow/10 rounded-2xl flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-xs font-black uppercase tracking-tight text-gray-900 dark:text-white">Buscando Ajudantes / ICs</span>
                                            <span className="text-[9px] text-gray-500 font-medium italic">Sinaliza recrutamento no Match Acadêmico</span>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" {...register('seeking_assistant')} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-yellow"></div>
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Linha de Pesquisa</label>
                                        <input
                                            {...register('research_line')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-yellow/50 outline-none transition-all font-bold"
                                            placeholder="Ex: Física de Partículas..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Departamento</label>
                                            <input
                                                {...register('department')}
                                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-yellow/50 outline-none transition-all font-bold"
                                                placeholder="Ex: DFMA"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Sala / Lab</label>
                                            <input
                                                {...register('office_room')}
                                                className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-yellow/50 outline-none transition-all font-bold"
                                                placeholder="Ex: 201"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Instituição / Laboratório</label>
                                        <input
                                            {...register('laboratory_name')}
                                            className="w-full bg-gray-50 dark:bg-background-dark/20 border border-gray-100 dark:border-white/5 rounded-2xl px-4 py-3 text-sm focus:border-brand-yellow/50 outline-none transition-all"
                                            placeholder="Ex: Lab de Cristalografia"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="flex-[2] px-6 py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-brand-blue/20 flex items-center justify-center gap-2"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            </div>
        </ModalPortal>
    );
}
