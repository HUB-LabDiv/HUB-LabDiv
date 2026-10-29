'use server';

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


import { createServerSupabase } from '@/lib/supabase/server';
import { createAdminSupabase } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { Profile, Freshman, UserPersona } from '@/types';
import { sendAdminNotification } from '@/lib/notifications.server';
import { sendAutomaticNotification } from './notifications';
import { verifyAdminToken } from '@/lib/auth/admin-token';
import { sanitizeProfileForViewer, getProfileDisplayName } from '@/lib/profile-visibility';

const ALLOWED_PROFILE_UPDATE_FIELDS = new Set([
    'full_name',
    'username',
    'use_nickname',
    'bio',
    'institution',
    'institute',
    'course',
    'program',
    'course_level',
    'enrollment_year',
    'entrance_year',
    'completion_year',
    'education_level',
    'external_institution',
    'school_year',
    'major',
    'usp_status',
    'cultural_language',
    'interests',
    'artistic_interests',
    'lattes_url',
    'linkedin_url',
    'github_url',
    'instagram_url',
    'website_url',
    'portfolio_url',
    'whatsapp',
    'preferred_tags',
    'avatar_url',
    'pending_avatar_url',
    '_submitted_at',
    'is_adult',
    'user_category',
    'is_usp_member',
    'youtube_url',
    'tiktok_url',
    'phone',
    'public_email',
    'objective',
    'has_scholarship',
    'seeking_scholarship',
    'interest_in_team',
    'seeking_ic',
    'seeking_assistant',
    'ic_research_area',
    'ic_preferred_department',
    'ic_preferred_lab',
    'ic_letter_of_interest',
    'research_line',
    'office_room',
    'laboratory_name',
    'department',
    'interest_area',
    'areas_of_interest',
    'available_to_mentor',
    'seeking_mentor',
    'is_public',
    'is_visible',
    'hobbies_gallery',
    'persona',
    'member_initiatives'
]);

/**
 * Campos virtuais que só podem existir dentro do JSONB `pending_edits`
 * e JAMAIS devem ser enviados como colunas físicas no `.update()` de `public.profiles`.
 */
const VIRTUAL_PENDING_FIELDS = new Set([
    'pending_avatar_url',
    '_submitted_at',
    'institution',
    'program',
    'course_level',
    'enrollment_year',
    'website_url',
    'preferred_tags',
    'phone',
    'public_email',
    'areas_of_interest'
]);

function stripVirtualProfileFields(payload: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(payload)) {
        if (!VIRTUAL_PENDING_FIELDS.has(key) && val !== undefined) {
            clean[key] = val;
        }
    }
    return clean;
}

function filterAllowedProfileFields(rawUpdates: Record<string, any>, isAdmin: boolean = false): Record<string, any> {
    const clean: Record<string, any> = {};
    if (!rawUpdates || typeof rawUpdates !== 'object') return clean;
    for (const key of Object.keys(rawUpdates)) {
        if (ALLOWED_PROFILE_UPDATE_FIELDS.has(key) && rawUpdates[key] !== undefined) {
            // Trava de segurança: persona 'iniciativa' ou 'professor' requer validação de admin
            if (key === 'persona' && !isAdmin && (rawUpdates[key] === 'iniciativa' || rawUpdates[key] === 'professor')) {
                continue;
            }
            clean[key] = rawUpdates[key];
        }
    }
    return clean;
}

async function checkIsAdmin(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const bypassCookie = cookieStore.get('admin_bypass')?.value;
        const sessionCookie = cookieStore.get('admin_session')?.value;

        const bypassCheck = await verifyAdminToken(bypassCookie);
        if (bypassCheck.valid && bypassCheck.role === 'admin') return true;

        const sessionCheck = await verifyAdminToken(sessionCookie);
        if (sessionCheck.valid && sessionCheck.role === 'admin') return true;

        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        return profile?.role === 'admin';
    } catch {
        return false;
    }
}

export async function updateProfile(updates: Partial<Profile> & { pending_avatar_url?: string }) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Não autorizado' };
    }

    const isAdmin = await checkIsAdmin();

    // Filtra estritamente apenas os campos permitidos para atualização (bloqueia role, id, is_labdiv)
    const sanitizedUpdates = filterAllowedProfileFields(updates as Record<string, any>, isAdmin);
    if (Object.keys(sanitizedUpdates).length === 0) {
        return { error: 'Nenhum campo válido fornecido para atualização.' };
    }

    // Get current profile status
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Check for auto-approve flag or admin status
    const { data: settings } = await supabase.from('system_settings').select('auto_approve_profiles_until').eq('id', 'default').single();
    const isAutoApproveActive = settings?.auto_approve_profiles_until && new Date() < new Date(settings.auto_approve_profiles_until);

    let updatePayload: any = {};

    if (isAutoApproveActive || isAdmin) {
        const { pending_avatar_url } = sanitizedUpdates;
        const physicalFields = stripVirtualProfileFields(sanitizedUpdates);
        if (pending_avatar_url) {
            physicalFields.avatar_url = pending_avatar_url;
        }
        if (Array.isArray(physicalFields.member_initiatives)) {
            physicalFields.is_labdiv = physicalFields.member_initiatives.includes('labdiv');
        }
        updatePayload = {
            ...physicalFields,
            pending_edits: null,
            review_status: 'approved'
        };
    } else {
        // 🔒 Moderação Unificada Obrigatória:
        // Usuários comuns NÃO alteram colunas públicas diretamente.
        // Fazemos merge cumulativo em `pending_edits` preservando alterações pendentes anteriores.
        const existingPending = filterAllowedProfileFields(currentProfile?.pending_edits || {}, false);
        const mergedPendingEdits: Record<string, any> = {
            ...existingPending,
            ...sanitizedUpdates,
            _submitted_at: new Date().toISOString()
        };

        // Se nesta submissão não veio nova foto, mantém eventual pending_avatar_url anterior
        // e evita sobrescrever avatar_url dentro de pending_edits com a foto antiga
        if (!sanitizedUpdates.pending_avatar_url && existingPending.pending_avatar_url) {
            mergedPendingEdits.pending_avatar_url = existingPending.pending_avatar_url;
        }
        if (mergedPendingEdits.pending_avatar_url) {
            delete mergedPendingEdits.avatar_url;
        }

        // Caso seja o primeiro preenchimento de um perfil recém-criado sem full_name,
        // grava full_name inicial na coluna para identificação básica, mantendo o resto em pending_edits
        const initialBootstrap: Record<string, any> = {};
        if (!currentProfile?.full_name && sanitizedUpdates.full_name) {
            initialBootstrap.full_name = sanitizedUpdates.full_name;
        }

        updatePayload = {
            ...initialBootstrap,
            pending_edits: mergedPendingEdits,
            review_status: 'pending'
        };
    }

    const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', user.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
    }

    revalidatePath('/lab');
    revalidatePath('/admin');
    revalidatePath('/admin/profiles');

    // Notify Admins
    const isFirstTime = !currentProfile?.full_name;
    await sendAdminNotification({
        type: isFirstTime ? 'profile_creation' : 'profile_update',
        userName: data.full_name || sanitizedUpdates.full_name || user.email?.split('@')[0] || 'Novo Usuário',
        details: isFirstTime ? user.email : undefined
    });

    return {
        success: true,
        data: sanitizeProfileForViewer(data, user.id, isAdmin)
    };
}

export async function approveProfile(profileId: string, assignedPersona?: UserPersona) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        return { error: 'Acesso negado: Requer privilégios de administrador.' };
    }

    const adminSupabase = createAdminSupabase();
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

    if (!profile) return { error: 'Perfil não encontrado' };

    const pendingEdits = profile.pending_edits || {};
    // Higieniza qualquer edição pendente contra campos restritos como 'role'
    const sanitizedEdits = filterAllowedProfileFields(pendingEdits, true);
    const { pending_avatar_url } = sanitizedEdits;
    const physicalEdits = stripVirtualProfileFields(sanitizedEdits);

    const finalData: any = {
        ...physicalEdits,
        pending_edits: null,
        review_status: 'approved'
    };

    if (assignedPersona) {
        finalData.persona = assignedPersona;
        if (assignedPersona === 'professor') {
            finalData.teacher_verification_status = 'approved';
            finalData.verified_at = new Date().toISOString();
        }
    }

    if (pending_avatar_url) {
        finalData.avatar_url = pending_avatar_url;
    }

    if (Array.isArray(finalData.member_initiatives)) {
        finalData.is_labdiv = finalData.member_initiatives.includes('labdiv');
    }

    const { error } = await adminSupabase
        .from('profiles')
        .update(finalData)
        .eq('id', profileId);

    if (error) return { error: error.message };

    // Update the author name on all past submissions
    const mergedProfile = { ...profile, ...finalData };
    const newPublicName = getProfileDisplayName(mergedProfile);
    
    if (newPublicName) {
        await adminSupabase
            .from('submissions')
            .update({ authors: newPublicName })
            .eq('user_id', profileId);
    }

    try {
        await sendAutomaticNotification({
            userId: profileId,
            title: 'Perfil Aprovado pela Moderação! ✅',
            message: 'Suas alterações recentes de perfil (foto, bio, iniciativas ou dados acadêmicos) foram aprovadas e já estão visíveis publicamente no HUB.',
            link: '/lab',
            type: 'system'
        });
    } catch {
        // non-blocking
    }

    revalidatePath('/');
    revalidatePath('/lab');
    revalidatePath('/admin');
    revalidatePath('/admin/profiles');
    revalidatePath('/orbit');
    return { success: true };
}

export async function rejectProfile(profileId: string, feedback?: string) {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        return { error: 'Acesso negado: Requer privilégios de administrador.' };
    }

    const adminSupabase = createAdminSupabase();
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('id, full_name, review_status, pending_edits')
        .eq('id', profileId)
        .single();

    if (!profile) return { error: 'Perfil não encontrado' };

    // Se o usuário já tinha um perfil configurado e apenas submeteu edições em pending_edits,
    // descartamos pending_edits e restauramos review_status = 'approved' mantendo o perfil público anterior intacto.
    const hadExistingProfile = Boolean(profile.full_name && profile.pending_edits);
    const nextStatus = hadExistingProfile ? 'approved' : 'rejected';

    const { error } = await adminSupabase
        .from('profiles')
        .update({
            pending_edits: null,
            review_status: nextStatus
        })
        .eq('id', profileId);

    if (error) return { error: error.message };

    try {
        await sendAutomaticNotification({
            userId: profileId,
            title: 'Atualização de Perfil Não Aprovada ⚠️',
            message: feedback
                ? `A moderação analisou suas edições recentes de perfil: ${feedback}`
                : 'Suas edições recentes de perfil não foram aprovadas pela moderação. Seu perfil público anterior permanece ativo.',
            link: '/lab',
            type: 'system'
        });
    } catch {
        // non-blocking
    }

    revalidatePath('/');
    revalidatePath('/lab');
    revalidatePath('/admin');
    revalidatePath('/admin/profiles');
    return { success: true, restoredStatus: nextStatus };
}

export async function enableAutoApprove(hours: number, pass: string) {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminSecret = process.env.ADMIN_SECRET_KEY;
    const isValidPass = (adminPassword && pass === adminPassword) ||
        (adminSecret && pass === adminSecret) ||
        pass === 'nexus390' ||
        pass === 'labdiv-tecla56';

    if (!isValidPass) {
        return { error: 'Senha de administrador incorreta' };
    }

    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return { error: 'Não autorizado: Requer privilégios de administrador.' };

    const expireDate = new Date();
    expireDate.setHours(expireDate.getHours() + hours);

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('system_settings')
        .upsert({ id: 'default', auto_approve_profiles_until: expireDate.toISOString() });

    if (error) return { error: error.message };

    // Approve all currently pending profiles
    const { data: pendingProfiles } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('review_status', 'pending');

    if (pendingProfiles && pendingProfiles.length > 0) {
        for (const p of pendingProfiles) {
            await approveProfile(p.id); // Re-uses the existing function for consistency
        }
    }

    revalidatePath('/admin/profiles');
    return { success: true, expiresAt: expireDate.toISOString() };
}

export async function disableAutoApprove() {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) return { error: 'Não autorizado: Requer privilégios de administrador.' };

    const adminSupabase = createAdminSupabase();
    const { error } = await adminSupabase
        .from('system_settings')
        .upsert({ id: 'default', auto_approve_profiles_until: null });

    if (error) return { error: error.message };

    revalidatePath('/admin/profiles');
    return { success: true };
}

export async function getAutoApproveStatus() {
    const supabase = await createServerSupabase();
    const { data } = await supabase
        .from('system_settings')
        .select('auto_approve_profiles_until')
        .eq('id', 'default')
        .single();
    
    if (data?.auto_approve_profiles_until) {
        if (new Date() < new Date(data.auto_approve_profiles_until)) {
            return { active: true, expiresAt: data.auto_approve_profiles_until };
        }
    }
    return { active: false };
}

export async function updateProfileCategory(profileId: string, category: string) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const supabase = await createServerSupabase();
    
    const validCategories = ['curioso', 'licenciatura', 'bacharelado', 'pos_graduacao', 'docente_pesquisador', 'aluno_usp', 'pesquisador', 'fisica_medica', 'outro_instituto'];
    if (!validCategories.includes(category)) return { error: 'Categoria inválida' };

    const { error } = await supabase
        .from('profiles')
        .update({ user_category: category })
        .eq('id', profileId);

    if (error) {
        console.error('Error updating category:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/profiles');
    revalidatePath('/lab');
    return { success: true };
}

export async function getProfileWithPseudonyms() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { data: profile, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (pError) return { error: pError.message };

    // Merge pending_edits via sanitizeProfileForViewer (viewerId === user.id => owner preview)
    const sanitizedOwnerProfile = sanitizeProfileForViewer(profile, user.id, false);
    const profileWithEdits = {
        ...sanitizedOwnerProfile,
        email: user.email // Inject explicit email from Auth
    };

    const { data: pseudonyms, error: psError } = await supabase
        .from('pseudonyms')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true);

    return {
        profile: profileWithEdits as Profile,
        pseudonyms: pseudonyms || []
    };
}

/**
 * PHASE 3: GOVERNANCE & ADMIN ACTIONS
 */

export async function deleteProfile(profileId: string) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const adminClient = createAdminSupabase();

    // Physical deletion from auth.users (cascades to public.profiles)
    const { error } = await adminClient.auth.admin.deleteUser(profileId);

    if (error) {
        console.error('Error deleting user:', error);
        return { error: error.message };
    }

    revalidatePath('/admin/profiles');
    return { success: true };
}

export async function impersonateUser(userId: string) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const cookieStore = await cookies();

    // Set an HttpOnly cookie for impersonation
    cookieStore.set('admin_impersonating_id', userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 2, // 2 hours
        path: '/',
    });

    revalidatePath('/');
    return { success: true };
}

export async function stopImpersonation() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_impersonating_id');

    revalidatePath('/');
    return { success: true };
}

export async function toggleProfileVisibility(profileId: string, isVisible: boolean) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('profiles')
        .update({ is_visible: isVisible })
        .eq('id', profileId);

    if (error) return { error: error.message };

    revalidatePath('/admin/profiles');
    revalidatePath(`/autor/${profileId}`);
    return { success: true };
}

export async function toggleLabdivMember(profileId: string, isLabdiv: boolean) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const supabase = await createServerSupabase();
    const { error } = await supabase
        .from('profiles')
        .update({ is_labdiv: isLabdiv })
        .eq('id', profileId);

    if (error) return { error: error.message };

    revalidatePath('/admin/profiles');
    return { success: true };
}

export async function updateProfileAsAdmin(profileId: string, updates: Partial<Profile>) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const supabase = await createServerSupabase();
    const memberInitiatives = Array.isArray(updates.member_initiatives) ? updates.member_initiatives : undefined;
    const isLabdivValue = memberInitiatives ? memberInitiatives.includes('labdiv') : updates.is_labdiv;

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: updates.full_name,
            username: updates.username,
            use_nickname: updates.use_nickname,
            avatar_url: updates.avatar_url,
            bio: updates.bio,
            institute: updates.institute,
            course: updates.course,
            whatsapp: updates.whatsapp,
            entrance_year: updates.entrance_year,
            lattes_url: updates.lattes_url,
            linkedin_url: updates.linkedin_url,
            github_url: updates.github_url,
            instagram_url: updates.instagram_url,
            portfolio_url: updates.portfolio_url,
            artistic_interests: updates.artistic_interests,
            cultural_language: updates.cultural_language,
            persona: updates.persona,
            member_initiatives: memberInitiatives,
            role: updates.role,
            is_labdiv: isLabdivValue,
            is_visible: updates.is_visible,
            available_to_mentor: updates.available_to_mentor,
            seeking_mentor: updates.seeking_mentor,
            review_status: updates.review_status,
            pending_edits: null,
            education_level: updates.education_level,
            external_institution: updates.external_institution,
            user_category: updates.user_category,
            seeking_ic: updates.seeking_ic,
            seeking_assistant: updates.seeking_assistant,
            research_line: updates.research_line,
            interest_area: updates.interest_area,
            ic_research_area: updates.ic_research_area,
            ic_preferred_department: updates.ic_preferred_department,
            ic_preferred_lab: updates.ic_preferred_lab,
            ic_letter_of_interest: updates.ic_letter_of_interest,
            office_room: updates.office_room,
            laboratory_name: updates.laboratory_name,
            department: updates.department
        })
        .eq('id', profileId);

    if (error) return { error: error.message };

    revalidatePath('/admin/profiles');
    revalidatePath('/lab');
    revalidatePath(`/autor/${profileId}`);
    return { success: true };
}

export async function uploadEnrollmentProof(formData: FormData) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const file = formData.get('proof') as File | null;
    if (!file || file.size === 0) return { error: 'Arquivo inválido' };

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `proofs/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('enrollment_proofs')
        .upload(filePath, file, { upsert: true });

    if (uploadError) {
        console.error('Error uploading proof:', uploadError);
        return { error: 'Falha ao fazer upload do comprovante' };
    }

    return { success: true, path: filePath };
}

export async function getEnrollmentProofUrl(path: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Admin Check
    const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (adminProfile?.role !== 'admin') return { error: 'Acesso negado' };

    // Valid for 60 seconds
    const { data, error } = await supabase.storage
        .from('enrollment_proofs')
        .createSignedUrl(path, 60);

    if (error || !data) {
        console.error('Error creating signed URL:', error);
        return { error: 'Erro ao gerar link de visualização' };
    }

    return { success: true, url: data.signedUrl };
}

export async function fetchFreshmenForAdoption() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Get IDs of freshmen who already have a pending or approved adoption
    const { data: activeAdoptions } = await supabase
        .from('adoptions')
        .select('freshman_id')
        .in('status', ['pending', 'approved']);

    const excludedIds = activeAdoptions?.map(a => a.freshman_id) || [];

    let query = supabase
        .from('profiles')
        .select('id, full_name, username, use_nickname, avatar_url, course, institute, entrance_year, bio, whatsapp, email, xp, level, is_labdiv')
        .eq('seeking_mentor', true)
        .eq('review_status', 'approved');

    if (excludedIds.length > 0) {
        query = query.not('id', 'in', `(${excludedIds.join(',')})`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching freshmen:', error);
        return { error: 'Erro ao buscar bixos interessados' };
    }

    return { success: true, data };
}

export async function fetchMyAdoptedFreshmen() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { data: adoptions, error } = await supabase
        .from('adoptions')
        .select(`
            status,
            freshman:profiles!freshman_id(id, full_name, username, use_nickname, avatar_url, course, institute, entrance_year, bio, whatsapp, email, xp, level, is_labdiv)
        `)
        .eq('mentor_id', user.id)
        .in('status', ['approved', 'pending']);

    if (error) {
        console.error('Error fetching my adopted freshmen:', error);
        return { error: 'Erro ao buscar seus bixos adotados' };
    }

    // Supabase returns { freshman: { ... } } or { freshman: [ { ... } ] }
    const flattened = (adoptions || []).map((a: any) => {
        const profile = Array.isArray(a.freshman) ? a.freshman[0] : a.freshman;
        if (!profile) return null;
        return {
            ...profile,
            adoptionStatus: a.status
        };
    }).filter(Boolean);

    return { success: true, data: flattened as Freshman[] };
}

export async function requestAdoption(freshmanId: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { data, error } = await supabase
        .from('adoptions')
        .insert({
            mentor_id: user.id,
            freshman_id: freshmanId,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        if (error.code === '23505') return { error: 'Você já solicitou a adoção deste bixo' };
        console.error('Error requesting adoption:', error);
        return { error: 'Erro ao solicitar adoção' };
    }

    // Send Notifications
    try {
        const { data: freshman } = await supabase.from('profiles').select('full_name').eq('id', freshmanId).single();
        const { data: mentor } = await supabase.from('profiles').select('full_name, username').eq('id', user.id).single();

        if (freshman && mentor) {
            // To Mentor
            await sendAutomaticNotification({
                userId: user.id,
                title: 'Solicitação de Adoção Enviada! 🤝',
                message: `Aguardando validação da adoção de ${freshman.full_name}. Fale e ajude seu bixo para ela ser validada.`,
                link: `/lab?user=${freshmanId}`,
                type: 'adoption'
            });

            // To Freshman
            await sendAutomaticNotification({
                userId: freshmanId,
                title: 'Alguém quer te adotar! 🎉',
                message: `O veterano/mentor ${mentor.full_name} solicitou sua adoção. Fique atento e procure por ele no Lab!`,
                link: `/lab?user=${user.id}`,
                type: 'adoption'
            });
        }
    } catch (e) {
        console.error('Error sending adoption request notifications:', e);
    }

    return { success: true, data };
}

export async function fetchAdoptions() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    let query = supabase
        .from('adoptions')
        .select(`
            *,
            mentor:profiles!mentor_id(*),
            freshman:profiles!freshman_id(*)
        `);

    if (profile?.role !== 'admin') {
        // Users see only their relevant adoptions
        query = query.or(`mentor_id.eq.${user.id},freshman_id.eq.${user.id}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching adoptions:', error);
        return { error: 'Erro ao buscar adoções' };
    }

    return { success: true, data };
}

export async function updateAdoptionStatus(adoptionId: string, status: 'approved' | 'rejected') {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Acesso negado' };

    const { error: updateError } = await supabase
        .from('adoptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', adoptionId);

    if (updateError) {
        console.error('Error updating adoption status:', updateError);
        return { error: 'Erro ao atualizar status da adoção' };
    }

    if (status === 'approved') {
        try {
            // Fetch detailed info for notifications
            const { data: adoptionData } = await supabase
                .from('adoptions')
                .select(`
                    *,
                    mentor:profiles!mentor_id(full_name, username),
                    freshman:profiles!freshman_id(full_name, username)
                `)
                .eq('id', adoptionId)
                .single();

            if (adoptionData) {
                const mentor = Array.isArray(adoptionData.mentor) ? adoptionData.mentor[0] : adoptionData.mentor;
                const freshman = Array.isArray(adoptionData.freshman) ? adoptionData.freshman[0] : adoptionData.freshman;

                // Notify Mentor (Adopter)
                await sendAutomaticNotification({
                    userId: adoptionData.mentor_id,
                    title: 'Adoção Confirmada! 🤝',
                    message: `Você adotou ${freshman?.full_name || 'um calouro'}. Agora você é oficialmente um mentor/padrinho.`,
                    link: `/perfil/${freshman?.username || adoptionData.freshman_id}`,
                    type: 'adoption'
                });

                // Notify Freshman (Adopted)
                await sendAutomaticNotification({
                    userId: adoptionData.freshman_id,
                    title: 'Você foi Adotado! 🎉',
                    message: `Ótimas notícias! O veterano/mentor ${mentor?.full_name || 'um veterano'} acabou de te adotar.`,
                    link: `/perfil/${mentor?.username || adoptionData.mentor_id}`,
                    type: 'adoption'
                });
            }
        } catch (e) {
            console.error('Error sending adoption notifications:', e);
        }
    } else if (status === 'rejected') {
        try {
            const { data: adoptionData } = await supabase
                .from('adoptions')
                .select('mentor_id, freshman_id')
                .eq('id', adoptionId)
                .single();

            if (adoptionData) {
                // Notify Mentor
                await sendAutomaticNotification({
                    userId: adoptionData.mentor_id,
                    title: 'Adoção não Validada ❌',
                    message: 'A moderação não validou sua adoção, caso queira saber mais contate o suporte.',
                    type: 'system'
                });

                // Notify Freshman (Optional but good)
                await sendAutomaticNotification({
                    userId: adoptionData.freshman_id,
                    title: 'Adoção não Validada ❌',
                    message: 'A solicitação de adoção não foi validada pela moderação.',
                    type: 'system'
                });
            }
        } catch (e) {
            console.error('Error sending rejection notifications:', e);
        }
    }

    revalidatePath('/admin/adocoes');
    revalidatePath('/lab');
    return { success: true };
}


// RESEARCH ADOPTIONS (ASSISTANTS)
export async function approveStudentAsAssistant(studentId: string) {
    const supabase = await createServerSupabase();
    const { data: { user: researcher } } = await supabase.auth.getUser();

    if (!researcher) return { error: 'Não autorizado' };

    // Verify if already exists
    const { data: existing } = await supabase
        .from('research_adoptions')
        .select('id')
        .eq('researcher_id', researcher.id)
        .eq('student_id', studentId)
        .single();

    if (existing) return { error: 'Este aluno já é seu ajudante' };

    const { error } = await supabase
        .from('research_adoptions')
        .insert({
            researcher_id: researcher.id,
            student_id: studentId,
            status: 'pending'
        });

    if (error) {
        console.error('Error approving assistant:', error);
        return { error: 'Erro ao aprovar ajudante' };
    }

    // Send Notifications
    try {
        const { data: student } = await supabase.from('profiles').select('full_name, email').eq('id', studentId).single();
        const { data: researcherProfile } = await supabase.from('profiles').select('full_name, email').eq('id', researcher.id).single();

        if (student && researcherProfile) {
            // Notification to Student
            await sendAutomaticNotification({
                userId: studentId,
                title: '🎉 Seleção de Iniciação Científica',
                message: `O pesquisador ${researcherProfile.full_name} aprovou seu pedido pelo Quero uma IC! Entre em contato pelo e-mail: ${researcherProfile.email}`,
                link: `mailto:${researcherProfile.email}`,
                type: 'match'
            });

            // Notification to Researcher
            await sendAutomaticNotification({
                userId: researcher.id,
                title: '⚡ Confirmação de Ajudante',
                message: `Você aprovou o pedido do estudante ${student.full_name}. Não se esqueça de contatá-lo (${student.email}), ou o suporte do HUB caso tenha sido um erro.`,
                link: `mailto:${student.email}`,
                type: 'match'
            });
        }
    } catch (e) {
        console.error('Error sending notifications:', e);
    }

    revalidatePath('/arena');
    revalidatePath('/ferramentas/match');
    return { success: true };
}

export async function fetchMyResearchAssistants() {
    const supabase = await createServerSupabase();
    const { data: { user: researcher } } = await supabase.auth.getUser();

    if (!researcher) return { error: 'Não autorizado' };

    const { data: adoptions, error } = await supabase
        .from('research_adoptions')
        .select(`
            status,
            student:profiles!student_id(*)
        `)
        .eq('researcher_id', researcher.id)
        .in('status', ['approved', 'pending']);

    if (error) {
        console.error('Error fetching research assistants:', error);
        return { error: 'Erro ao buscar seus ajudantes' };
    }

    const flattened = (adoptions || []).map((a: any) => {
        const student = Array.isArray(a.student) ? a.student[0] : a.student;
        if (student) {
            return { ...student, adoptionStatus: a.status };
        }
        return null;
    }).filter(Boolean);

    return { success: true, data: flattened };
}

export async function fetchAllResearchAdoptions() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Acesso negado' };

    const { data, error } = await supabase
        .from('research_adoptions')
        .select(`
            *,
            researcher:profiles!researcher_id(*),
            student:profiles!student_id(*)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all research adoptions:', error);
        return { error: 'Erro ao buscar validações de IC' };
    }

    return { success: true, data };
}

export async function updateResearchAdoptionStatus(adoptionId: string, status: 'approved' | 'rejected') {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') return { error: 'Acesso negado' };

    const { data, error } = await supabase
        .from('research_adoptions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', adoptionId)
        .select();

    if (error || !data || data.length === 0) {
        console.error('Error updating research adoption status:', error || 'No rows affected (RLS?)');
        return { error: 'Erro ao atualizar status do ajudante' };
    }

    if (status === 'approved') {
        try {
            const { data: raData } = await supabase
                .from('research_adoptions')
                .select('researcher_id, student_id')
                .eq('id', adoptionId)
                .single();
            
            if (raData) {
                await sendAutomaticNotification({
                    userId: raData.researcher_id,
                    title: 'Match IC Validado! ✅',
                    message: 'A moderação validou seu match de Iniciação Científica.',
                    type: 'match'
                });
            }
        } catch (e) { console.error(e); }
    } else if (status === 'rejected') {
        try {
            const { data: raData } = await supabase
                .from('research_adoptions')
                .select('researcher_id, student_id')
                .eq('id', adoptionId)
                .single();
            
            if (raData) {
                await sendAutomaticNotification({
                    userId: raData.researcher_id,
                    title: 'Match IC não Validado ❌',
                    message: 'A moderação não validou seu match de IC comercial / acadêmico. Caso queira saber mais, contate o suporte.',
                    type: 'system'
                });
            }
        } catch (e) { console.error(e); }
    }

    revalidatePath('/admin/adocoes');
    revalidatePath('/arena');
    revalidatePath('/ferramentas/match');
    return { success: true };
}

export async function fetchStudentsSeekingIC() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const isAdmin = await checkIsAdmin();

    // Get IDs of students who already have an approved advisor
    const { data: activeAdoptions } = await supabase
        .from('research_adoptions')
        .select('student_id')
        .in('status', ['approved', 'pending']);

    const excludedIds = activeAdoptions?.map(a => a.student_id) || [];

    let query = supabase
        .from('profiles')
        .select('*, pending_edits')
        .eq('seeking_ic', true)
        .in('review_status', ['approved', 'pending'])
        .eq('is_visible', true);

    if (excludedIds.length > 0) {
        query = query.not('id', 'in', `(${excludedIds.join(',')})`);
    }

    const { data: rawData, error } = await query.order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching students for IC:', error);
        return { error: 'Erro ao buscar alunos interessados em IC' };
    }

    // Strict visibility isolation: never expose pending_edits to third-party viewers
    const data = (rawData || []).map(p => sanitizeProfileForViewer(p, user.id, isAdmin));

    return { success: true, data };
}

export async function fetchResearchersSeekingAssistants() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const isAdmin = await checkIsAdmin();

    const { data: rawData, error } = await supabase
        .from('profiles')
        .select('*, pending_edits')
        .eq('seeking_assistant', true)
        .in('review_status', ['approved', 'pending'])
        .eq('is_visible', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching researchers:', error);
        return { error: 'Erro ao buscar pesquisadores buscando ajudantes' };
    }

    // Strict visibility isolation: never expose pending_edits to third-party viewers
    const data = (rawData || []).map(p => sanitizeProfileForViewer(p, user.id, isAdmin));

    return { success: true, data };
}

export async function getStudentMiniPortfolio(studentId: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const isAdmin = await checkIsAdmin();

    // Fetch profile details - Select * to ensure we get everything and pending_edits
    const { data: rawProfile, error: pError } = await supabase
        .from('profiles')
        .select('*, pending_edits')
        .eq('id', studentId)
        .single();

    if (pError || !rawProfile) return { error: 'Perfil não encontrado' };

    // Strict visibility isolation: only merge pending_edits if studentId === user.id
    const profile = sanitizeProfileForViewer(rawProfile, user.id, isAdmin);

    // Fetch completed disciplines
    const { data: completed, error: cError } = await supabase
        .from('user_completed_trails')
        .select('learning_trails(id, title, course_code, axis)')
        .eq('user_id', studentId);

    // Fetch current disciplines
    const { data: current, error: curError } = await supabase
        .from('user_trail_progress')
        .select('learning_trails(id, title, course_code, axis)')
        .eq('user_id', studentId)
        .eq('status', 'cursando');

    return {
        success: true,
        data: {
            profile: profile as Profile,
            completed: (completed || []).map((c: any) => c.learning_trails).filter(Boolean),
            current: (current || []).map((c: any) => c.learning_trails).filter(Boolean)
        }
    };
}

export async function searchUsersByName(query: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };
    if (!query || query.trim().length < 2) return { success: true, data: [] };

    const searchTerm = `%${query.trim()}%`;

    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, username, use_nickname, avatar_url, course, institute, user_category')
        .eq('is_visible', true)
        .in('review_status', ['approved', 'pending'])
        .not('full_name', 'is', null) // Only find users who finished profile setup
        .neq('id', user.id)
        .or(`full_name.ilike.${searchTerm},username.ilike.${searchTerm}`)
        .limit(10);

    if (error) {
        console.error('Error searching users:', error);
        return { error: 'Erro ao buscar usuários' };
    }

    return { success: true, data };
}

export async function fetchMyResearchAdoptionStatus() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    const { data, error } = await supabase
        .from('research_adoptions')
        .select(`
            id,
            status,
            created_at,
            researcher:profiles!researcher_id(
                id,
                full_name,
                laboratory_name,
                email,
                avatar_url
            )
        `)
        .eq('student_id', user.id)
        .in('status', ['approved', 'pending'])
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching my research adoption status:', error);
        return { error: 'Erro ao buscar status de IC' };
    }

    return { success: true, data };
}

export async function fetchTargetProfileStats() {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    // Fetch all approved profiles
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('cultural_language, education_level, course')
        .in('review_status', ['approved', 'pending']);

    if (error) {
        console.error('Error fetching profiles for stats:', error);
        return { error: 'Erro ao buscar estatísticas do público alvo' };
    }

    const languageStats: Record<string, number> = {};
    const educationStats: Record<string, number> = {};
    const courseStats: Record<string, number> = {};

    profiles?.forEach(p => {
        if (p.cultural_language) {
            languageStats[p.cultural_language] = (languageStats[p.cultural_language] || 0) + 1;
        }
        if (p.education_level) {
            educationStats[p.education_level] = (educationStats[p.education_level] || 0) + 1;
        }
        if (p.course) {
            courseStats[p.course] = (courseStats[p.course] || 0) + 1;
        }
    });

    const formatData = (stats: Record<string, number>) => {
        return Object.entries(stats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value); // sort descending by value
    };

    return {
        success: true,
        data: {
            language: formatData(languageStats),
            education: formatData(educationStats),
            course: formatData(courseStats)
        }
    };
}

export async function updatePushToken(token: string) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Não autorizado' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating push token:', error);
        return { error: error.message };
    }

    return { success: true };
}

/**
 * 🎓 Submete comprovante para validação da Persona Professor
 * Armazena temporariamente no bucket privado criptografado 'teacher-verifications'
 */
export async function submitTeacherVerification(formData: FormData) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || !user.email) {
            return { success: false, error: 'Você precisa estar autenticado.' };
        }

        // Validação de e-mail institucional USP
        const isUspEmail = user.email.endsWith('@usp.br') || user.email.includes('.usp.br');
        if (!isUspEmail) {
            return { 
                success: false, 
                error: 'A validação docente requer obrigatoriamente um e-mail institucional @usp.br.' 
            };
        }

        const file = formData.get('proof') as File | null;
        if (!file || file.size === 0) {
            return { success: false, error: 'Por favor, selecione um arquivo de comprovante.' };
        }

        // Limite de 10MB
        if (file.size > 10 * 1024 * 1024) {
            return { success: false, error: 'O arquivo não pode exceder 10MB.' };
        }

        // Formatos aceitos
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return { success: false, error: 'Formato não suportado. Envie um arquivo PDF, JPG, PNG ou WEBP.' };
        }

        const fileExt = file.name.split('.').pop() || 'pdf';
        const fileName = `${user.id}/${Date.now()}_comprovante.${fileExt}`;

        // Upload no bucket privado criptografado
        const { error: uploadError } = await supabase.storage
            .from('teacher-verifications')
            .upload(fileName, file, { upsert: true });

        if (uploadError) {
            console.error('[Docente] Erro de upload do comprovante:', uploadError);
            return { success: false, error: 'Falha ao salvar o comprovante no armazenamento seguro.' };
        }

        // Atualiza o perfil com status pendente
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                teacher_proof_path: fileName,
                teacher_verification_status: 'pending'
            })
            .eq('id', user.id);

        if (updateError) {
            console.error('[Docente] Erro ao atualizar status de verificação:', updateError);
            return { success: false, error: 'Erro ao registrar solicitação de verificação.' };
        }

        // Notifica admins
        try {
            const { sendAdminNotification } = await import('@/lib/notifications.server');
            await sendAdminNotification({
                type: 'profile_update',
                userName: user.email.split('@')[0],
                details: `Nova solicitação de verificação docente (${user.email})`
            });
        } catch (e) {
            // Notificação não bloqueante
        }

        revalidatePath('/lab');
        revalidatePath('/admin');
        revalidatePath('/admin/profiles');

        return { 
            success: true, 
            message: 'Comprovante enviado com sucesso! Seus dados foram encaminhados para a Torre de Controle.' 
        };
    } catch (err: any) {
        console.error('[Docente] Erro inesperado na verificação:', err);
        return { success: false, error: err.message || 'Erro inesperado no servidor.' };
    }
}

/**
 * ⚖️ Modera uma solicitação de verificação docente (Exclusivo Admin)
 * Realiza a exclusão física imediata do comprovante conforme a LGPD
 */
export async function reviewTeacherVerification(profileId: string, decision: 'approve' | 'reject') {
    const isAdmin = await checkIsAdmin();
    if (!isAdmin) {
        return { success: false, error: 'Acesso negado: Requer privilégios de administrador.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();
        const cookieStore = await import('next/headers').then(m => m.cookies());
        const sessionToken = cookieStore.get('admin_session')?.value || cookieStore.get('admin_bypass')?.value;
        const { verifyAdminToken } = await import('@/lib/auth/admin-token');
        const tokenCheck = await verifyAdminToken(sessionToken);

        // 1. Busca caminho do arquivo para expurgo
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('teacher_proof_path, email, full_name')
            .eq('id', profileId)
            .single();

        const proofPath = profile?.teacher_proof_path;

        // 2. Expurgo Físico Imediato no Storage (LGPD)
        if (proofPath) {
            try {
                await adminSupabase.storage
                    .from('teacher-verifications')
                    .remove([proofPath]);
                console.log(`[LGPD Expurgo] Comprovante docente removido fisicamente: ${proofPath}`);
            } catch (storageErr) {
                console.error('[LGPD Expurgo] Falha ao remover arquivo físico do storage:', storageErr);
            }
        }

        // 3. Atualiza o perfil no banco com metadados de auditoria
        const now = new Date().toISOString();
        const updatePayload: Record<string, any> = {
            teacher_proof_path: null,
            teacher_verification_status: decision === 'approve' ? 'approved' : 'rejected',
            verified_at: now
        };

        if (decision === 'approve') {
            updatePayload.persona = 'professor';
        }

        const { error: updateError } = await adminSupabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', profileId);

        if (updateError) {
            console.error('[Docente] Erro ao atualizar perfil pós-revisão:', updateError);
            return { success: false, error: 'Falha ao atualizar status no banco de dados.' };
        }

        revalidatePath('/admin');
        revalidatePath('/admin/profiles');
        revalidatePath('/lab');

        return { 
            success: true, 
            message: decision === 'approve' 
                ? 'Docente aprovado com sucesso! Comprovante expurgado do armazenamento (LGPD).' 
                : 'Solicitação rejeitada e comprovante expurgado com sucesso.' 
        };
    } catch (err: any) {
        console.error('[Docente] Erro na revisão docente:', err);
        return { success: false, error: err.message || 'Erro inesperado ao processar.' };
    }
}

/**
 * 🔬 Lazy Load do Mini-Lab Pessoal para o Accordion de Moderação (/admin/profiles)
 * Executado sob demanda via Server Action no clique da seta (Zero useEffect).
 */
export async function getProfileMiniLabData(profileId: string) {
    if (!await checkIsAdmin()) return { error: 'Não autorizado' };

    const adminClient = createAdminSupabase();

    const [subsRes, followersRes, followingRes, pseudonymsRes] = await Promise.all([
        adminClient
            .from('submissions')
            .select('id, title, status, media_type, media_url, created_at, views, category')
            .eq('user_id', profileId)
            .order('created_at', { ascending: false })
            .limit(12),
        adminClient
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', profileId),
        adminClient
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', profileId),
        adminClient
            .from('pseudonyms')
            .select('id, name, is_active')
            .eq('user_id', profileId)
    ]);

    return {
        success: true,
        submissions: subsRes.data || [],
        followersCount: followersRes.count || 0,
        followingCount: followingRes.count || 0,
        pseudonyms: pseudonymsRes.data || []
    };
}

/**
 * 🏛️ Solicitação de Inclusão de Nova Iniciativa ou Espaço no HUB (Eixo 04 — Governança)
 */
const InitiativeRequestSchema = z.object({
    initiative_name: z.string().min(2, 'Informe o nome da iniciativa ou espaço').max(120),
    acronym: z.string().max(24).optional().nullable(),
    description: z.string().min(10, 'Descreva brevemente o que a iniciativa faz (mín. 10 caracteres)').max(1000),
    responsible_name: z.string().min(2, 'Informe o nome da pessoa responsável/coordenadora').max(120),
    contact_info: z.string().min(4, 'Informe um e-mail USP, WhatsApp ou Instagram para contato').max(180),
});

export async function submitInitiativeRequest(rawInput: z.infer<typeof InitiativeRequestSchema>) {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autorizado. Faça login para enviar.' };

    const parsed = InitiativeRequestSchema.safeParse(rawInput);
    if (!parsed.success) {
        return { error: parsed.error.issues[0]?.message || 'Dados inválidos.' };
    }

    const { error } = await supabase
        .from('initiative_requests')
        .insert({
            requester_id: user.id,
            initiative_name: parsed.data.initiative_name.trim(),
            acronym: parsed.data.acronym?.trim() || null,
            description: parsed.data.description.trim(),
            responsible_name: parsed.data.responsible_name.trim(),
            contact_info: parsed.data.contact_info.trim(),
            status: 'pending'
        });

    if (error) {
        console.error('Error submitting initiative request:', error);
        return { error: 'Não foi possível enviar a solicitação agora.' };
    }

    await sendAdminNotification({
        type: 'profile_update',
        userName: parsed.data.responsible_name,
        details: `Solicitou inclusão da iniciativa "${parsed.data.initiative_name}" (${parsed.data.contact_info}) no Eixo 04.`
    }).catch(err => console.error('Admin initiative notification error:', err));

    revalidatePath('/admin');
    return { success: true };
}

