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
import { redirect } from 'next/navigation';
import { LabClientView } from './LabClientView';
import { fetchUserSubmissions, getFollowStats } from '@/app/actions/submissions';
import { fetchUserDrops } from '@/app/actions/drops';
import { getUserInterest } from '@/app/actions/recommendations';
import { fetchUserAcademicdata } from '@/app/actions/disciplines';
import { sanitizeProfileForViewer } from '@/lib/profile-visibility';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import Link from 'next/link';

interface LabPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LabPage({ searchParams }: LabPageProps) {
    const supabase = await createServerSupabase();
    
    // Auth Check (Secure Supabase Server Component pattern)
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) {
        redirect('/login');
    }
    
    // Parse search parameters
    const params = await searchParams;
    const queryUserId = typeof params.user === 'string' ? params.user : undefined;
    const targetUserId = queryUserId || currentUser.id;
    const initialTab = typeof params.tab === 'string' ? params.tab : 'fluxo';

    // 1. Fetch primary profiles (Wait concurrently)
    const [
        { data: rawCurrProfile },
        { data: rawProfileData }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', targetUserId).maybeSingle()
    ]);

    const isViewerAdmin = rawCurrProfile?.role === 'admin' || rawCurrProfile?.role === 'moderator';
    const isViewingOwn = targetUserId === currentUser.id;

    if (!isViewingOwn && !isViewerAdmin && (!rawProfileData || !rawProfileData.approved_at || !rawProfileData.is_visible || !rawProfileData.is_public)) {
        return (
            <MainLayoutWrapper userId={currentUser.id}>
                <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 shadow-sm text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFCC00]/15 text-[#FFCC00] flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">hourglass_top</span>
                    </div>
                    <h1 className="text-xl font-bukra font-black text-gray-900 dark:text-white tracking-tight">
                        Perfil em verificação
                    </h1>
                    <p className="text-sm font-open-sans text-gray-600 dark:text-gray-400 leading-relaxed">
                        Este perfil ainda está aguardando aprovação inicial da moderação ou está oculto no momento.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/lab"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#0F4780] text-white text-xs font-bukra font-bold uppercase tracking-wider hover:bg-[#0F4780]/90 transition-colors"
                        >
                            Ir para meu Lab
                        </Link>
                    </div>
                </div>
            </MainLayoutWrapper>
        );
    }

    const currProfile = sanitizeProfileForViewer(rawCurrProfile, currentUser.id, isViewerAdmin);
    const profileData = sanitizeProfileForViewer(rawProfileData, currentUser.id, isViewerAdmin);
    
    // 2. Fetch independent secondary data concurrently
    const [
        userSubs,
        stats,
        userLogs,
        savesRes,
        interest
    ] = await Promise.all([
        fetchUserSubmissions(targetUserId),
        getFollowStats(targetUserId),
        fetchUserDrops(targetUserId),
        supabase.from('saves').select('submission_id').eq('user_id', currentUser.id),
        getUserInterest(targetUserId)
    ]);

    // 3. Conditional fetching
    let savedPosts: any[] = [];
    let adoptionStatus: 'pending' | 'approved' | null = null;
    let academicData: any = null;

    const parallelTasks: Promise<any>[] = [];

    // Task A: Fetch actual saved posts
    if (savesRes.data && savesRes.data.length > 0) {
        const ids = savesRes.data.map(s => s.submission_id);
        parallelTasks.push(
            (async () => {
                const res = await supabase.from('submissions')
                    .select('id, title, authors, description, media_url, media_type, category, status, like_count, comment_count, save_count, view_count, created_at, is_featured, user_id')
                    .in('id', ids)
                    .eq('status', 'aprovado');
                if (res.data) {
                    savedPosts = res.data.map((s: any) => ({
                        id: s.id,
                        title: s.title,
                        authors: s.authors,
                        description: s.description || '',
                        mediaUrl: s.media_url,
                        mediaType: s.media_type,
                        category: s.category,
                        status: s.status,
                        likeCount: s.like_count || 0,
                        commentCount: s.comment_count || 0,
                        saveCount: s.save_count || 0,
                        viewCount: s.view_count || 0,
                        createdAt: s.created_at,
                        isFeatured: s.is_featured || false,
                        userId: s.user_id,
                    }));
                }
            })()
        );
    }

    // Task B: Adoption Status
    if (targetUserId !== currentUser.id) {
        parallelTasks.push(
            (async () => {
                const res = await supabase.from('adoptions')
                    .select('status')
                    .eq('mentor_id', currentUser.id)
                    .eq('freshman_id', targetUserId)
                    .maybeSingle();
                if (res.data) {
                    adoptionStatus = res.data.status as any;
                }
            })()
        );
    }

    // Task C: Academic Data if Aluno
    if (profileData?.user_category === 'aluno_usp') {
        parallelTasks.push(
            fetchUserAcademicdata(targetUserId).then(res => {
                if (res.success) academicData = res.data;
            })
        );
    }

    // Wait for conditional queries
    if (parallelTasks.length > 0) {
        await Promise.all(parallelTasks);
    }

    // Filter visible submissions (exclude deleted; if external visitor, show only approved)
    const visibleSubmissions = (userSubs || []).filter(sub => {
        if (sub.post.status === 'deleted' || sub.post.status === 'deletado') return false;
        if (targetUserId !== currentUser.id) {
            return sub.post.status === 'aprovado';
        }
        return true;
    });

    return (
        <LabClientView
            currentUser={currentUser}
            initialCurrentUserProfile={currProfile}
            initialViewedProfile={profileData}
            submissions={visibleSubmissions}
            savedPosts={savedPosts}
            followStats={stats}
            userLogs={userLogs || []}
            initialAdoptionStatus={adoptionStatus}
            academicData={academicData}
            topInterest={interest}
            initialTab={initialTab}
        />
    );
}
