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

interface LabPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LabPage({ searchParams }: LabPageProps) {
    const supabase = await createServerSupabase();
    
    // Auth Check
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect('/login');
    }
    const currentUser = session.user;
    
    // Parse search parameters
    const params = await searchParams;
    const queryUserId = typeof params.user === 'string' ? params.user : undefined;
    const targetUserId = queryUserId || currentUser.id;
    const initialTab = typeof params.tab === 'string' ? params.tab : 'fluxo';

    // 1. Fetch primary profiles (Wait concurrently)
    const [
        { data: currProfile },
        { data: profileData }
    ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
        supabase.from('profiles').select('*').eq('id', targetUserId).maybeSingle()
    ]);
    
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

    return (
        <LabClientView
            currentUser={currentUser}
            initialCurrentUserProfile={currProfile}
            initialViewedProfile={profileData}
            submissions={userSubs || []}
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
