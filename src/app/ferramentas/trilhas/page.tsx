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
import TrilhasClient from '@/components/trilhas/TrilhasClient';

export const revalidate = 0;

export const metadata = {
    title: 'Trilhas de Aprendizado | IFUSP',
    description: 'Painel de Controle de Trilhas Curriculares do IFUSP.',
};

async function getTrails() {
    const supabase = await createServerSupabase();
    const { data: trails } = await supabase
        .from('learning_trails')
        .select('*')
        .order('id', { ascending: true });

    if (!trails) return [];

    const { data: allSubmissions } = await supabase
        .from('trail_submissions')
        .select('trail_id');

    const countsByTrail: Record<string, number> = {};
    if (allSubmissions) {
        allSubmissions.forEach(sub => {
            countsByTrail[sub.trail_id] = (countsByTrail[sub.trail_id] || 0) + 1;
        });
    }

    return trails.map((trail) => ({
        ...trail,
        submissionCount: countsByTrail[trail.id] || 0,
    }));
}

export default async function FerramentasTrilhasPage() {
    const trails = await getTrails();
    const supabase = await createServerSupabase();

    const { data: { user } } = await supabase.auth.getUser();
    let cursandoTrails: any[] = [];
    let completedTrailIds: string[] = [];
    let userProfile: any = null;

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        userProfile = profile;

        const { data: progress } = await supabase
            .from('user_trail_progress')
            .select('trail_id')
            .eq('user_id', user.id)
            .eq('status', 'cursando');

        if (progress && progress.length > 0) {
            const trailIds = progress.map(p => p.trail_id);
            cursandoTrails = trails.filter(t => trailIds.includes(t.id));
        }

        const { data: completed } = await supabase
            .from('user_completed_trails')
            .select('trail_id')
            .eq('user_id', user.id);

        if (completed) {
            completedTrailIds = completed.map(c => c.trail_id);
        }
    }

    return (
        <TrilhasClient
            initialTrails={trails}
            cursandoTrails={cursandoTrails}
            completedTrailIds={completedTrailIds}
            userProfile={userProfile}
        />
    );
}
