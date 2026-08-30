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
import { PostDTO, mapToPostDTO } from '@/dtos/media';
import { postMatchesMediaTypes } from '@/lib/media-utils';

export interface EnrolledSubject {
    code: string;
    title: string;
    trailId?: string;
    institute?: string;
    axis?: string;
    notesCount: number;
    isFromJupiter: boolean;
}

export interface SubjectCatalogItem {
    id: string;
    code: string;
    title: string;
    description?: string | null;
    axis?: string;
    category?: string;
    institute?: string;
    notesCount: number;
}

/**
 * Busca as matérias que o usuário está cursando atualmente (via Júpiter e/ou Trilhas em andamento)
 */
export async function fetchUserEnrolledSubjects(userId?: string): Promise<{
    enrolledSubjects: EnrolledSubject[];
    hasJupiterCache: boolean;
    lastSyncedAt?: string;
}> {
    const supabase = await createServerSupabase();
    let targetUserId = userId;

    if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { enrolledSubjects: [], hasJupiterCache: false };
        targetUserId = user.id;
    }

    // 1. Buscar perfil para verificar cache do Júpiter
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, jupiter_subjects_cache, updated_at')
        .eq('id', targetUserId)
        .single();

    // 2. Buscar progresso ativo em trilhas (status = 'cursando')
    const { data: progress } = await supabase
        .from('user_trail_progress')
        .select('trail_id, learning_trails(*)')
        .eq('user_id', targetUserId)
        .eq('status', 'cursando');

    // 3. Buscar catálogo de trilhas para cruzar códigos
    const { data: allTrails } = await supabase
        .from('learning_trails')
        .select('id, course_code, title, axis, category');

    // 4. Buscar contagem de anotações por trilha
    const { data: trailSubmissions } = await supabase
        .from('trail_submissions')
        .select('trail_id');

    const countsMap: Record<string, number> = {};
    if (trailSubmissions) {
        trailSubmissions.forEach(sub => {
            countsMap[sub.trail_id] = (countsMap[sub.trail_id] || 0) + 1;
        });
    }

    const subjectsMap = new Map<string, EnrolledSubject>();

    // A) Processar matérias do Júpiter
    const jupiterCache = profile?.jupiter_subjects_cache;
    const hasJupiterCache = Boolean(jupiterCache && Array.isArray(jupiterCache.subjects) && jupiterCache.subjects.length > 0);

    if (hasJupiterCache) {
        const courseNames = jupiterCache.courseNames || {};
        const seenCodes = new Set<string>();

        jupiterCache.subjects.forEach((sub: any) => {
            const code = (sub.code || '').trim().toUpperCase();
            if (!code || seenCodes.has(code)) return;
            seenCodes.add(code);

            const matchedTrail = allTrails?.find(t => t.course_code?.toUpperCase() === code);
            const title = courseNames[code] || matchedTrail?.title || code;
            const trailId = matchedTrail?.id;
            const notesCount = trailId ? (countsMap[trailId] || 0) : 0;

            // Determinar Instituto pelo prefixo do código da matéria USP
            let institute = 'IFUSP';
            if (code.startsWith('MAT') || code.startsWith('MAP') || code.startsWith('MAE') || code.startsWith('MAC')) {
                institute = 'IME';
            } else if (code.startsWith('AGA') || code.startsWith('GEO')) {
                institute = 'IAG';
            } else if (code.startsWith('IOF') || code.startsWith('IOB')) {
                institute = 'IO';
            } else if (code.startsWith('QFL') || code.startsWith('QBQ')) {
                institute = 'IQ';
            } else if (code.startsWith('FAP') || code.startsWith('FEP') || code.startsWith('FNC') || code.startsWith('FMA') || code.startsWith('FGE') || code.startsWith('430')) {
                institute = 'IFUSP';
            }

            subjectsMap.set(code, {
                code,
                title,
                trailId,
                institute,
                axis: matchedTrail?.axis || 'comum',
                notesCount,
                isFromJupiter: true
            });
        });
    }

    // B) Processar matérias marcadas como "Cursando" nas Trilhas
    if (progress && progress.length > 0) {
        progress.forEach((p: any) => {
            const trail = p.learning_trails;
            if (!trail) return;
            const code = (trail.course_code || trail.title || trail.id).toUpperCase();

            if (!subjectsMap.has(code)) {
                let institute = 'IFUSP';
                if (code.startsWith('MAT') || code.startsWith('MAP') || code.startsWith('MAC')) institute = 'IME';
                else if (code.startsWith('AGA')) institute = 'IAG';

                subjectsMap.set(code, {
                    code: trail.course_code || code,
                    title: trail.title,
                    trailId: trail.id,
                    institute,
                    axis: trail.axis || 'comum',
                    notesCount: countsMap[trail.id] || 0,
                    isFromJupiter: false
                });
            } else {
                // Atualizar com o trailId caso tenha vindo do Júpiter sem ID
                const existing = subjectsMap.get(code)!;
                if (!existing.trailId) {
                    existing.trailId = trail.id;
                    existing.notesCount = countsMap[trail.id] || 0;
                }
            }
        });
    }

    return {
        enrolledSubjects: Array.from(subjectsMap.values()),
        hasJupiterCache,
        lastSyncedAt: profile?.updated_at
    };
}

/**
 * Busca todas as anotações, cadernos e materiais vinculados a uma disciplina
 */
export async function fetchSubjectNotes(params: {
    trailId?: string;
    courseCode?: string;
    mediaTypes?: string[];
    query?: string;
}): Promise<{ items: { post: PostDTO; topicIndex?: number }[] }> {
    const supabase = await createServerSupabase();
    const { trailId, courseCode, mediaTypes, query } = params;

    let items: { post: PostDTO; topicIndex?: number }[] = [];
    const seenIds = new Set<string>();

    // 1. Buscar anotações vinculadas diretamente via trail_submissions
    if (trailId) {
        let trailQuery = supabase
            .from('trail_submissions')
            .select(`
                trail_id,
                topic_index,
                sort_order,
                submissions!inner (
                    id,
                    title,
                    authors,
                    description,
                    category,
                    institute,
                    media_type,
                    media_url,
                    created_at,
                    views,
                    like_count,
                    status,
                    user_id,
                    tags,
                    is_featured,
                    is_historical,
                    is_golden_standard,
                    profiles(avatar_url, xp, level, is_labdiv)
                )
            `)
            .eq('trail_id', trailId)
            .eq('submissions.status', 'aprovado');

        const { data: trailData } = await trailQuery;

        if (trailData) {
            trailData.forEach((row: any) => {
                const sub = row.submissions;
                if (sub && !seenIds.has(sub.id)) {
                    seenIds.add(sub.id);
                    items.push({
                        post: mapToPostDTO(sub, undefined, sub.profiles?.avatar_url),
                        topicIndex: row.topic_index
                    });
                }
            });
        }
    }

    // 2. Buscar anotações vinculadas por tag do código da matéria (ex: #FAP0111, FAP0111)
    if (courseCode) {
        const cleanCode = courseCode.trim().toUpperCase();
        let subQuery = supabase
            .from('submissions')
            .select('*, profiles(avatar_url, xp, level, is_labdiv)')
            .eq('status', 'aprovado')
            .neq('moderation_status', 'suspended')
            .or(`tags.cs.{${cleanCode}},tags.cs.{#${cleanCode}},title.ilike.%${cleanCode}%,description.ilike.%${cleanCode}%`)
            .limit(20);

        const { data: taggedData } = await subQuery;

        if (taggedData) {
            taggedData.forEach((sub: any) => {
                if (!seenIds.has(sub.id)) {
                    seenIds.add(sub.id);
                    items.push({
                        post: mapToPostDTO(sub, undefined, sub.profiles?.avatar_url),
                        topicIndex: undefined
                    });
                }
            });
        }
    }

    // 3. Filtro por formato se especificado
    if (mediaTypes && mediaTypes.length > 0) {
        items = items.filter(item => postMatchesMediaTypes(item.post, mediaTypes));
    }

    // 4. Filtro por busca de texto se especificado
    if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        items = items.filter(item => {
            return (
                item.post.title.toLowerCase().includes(q) ||
                item.post.description.toLowerCase().includes(q) ||
                item.post.authors.toLowerCase().includes(q) ||
                item.post.tags?.some(t => t.toLowerCase().includes(q))
            );
        });
    }

    return { items };
}

/**
 * Busca todas as disciplinas catalogadas com contagem de anotações
 */
export async function fetchAllSubjectsCatalog(params?: {
    institute?: string;
    search?: string;
}): Promise<SubjectCatalogItem[]> {
    const supabase = await createServerSupabase();

    let query = supabase
        .from('learning_trails')
        .select('*')
        .order('course_code', { ascending: true });

    if (params?.search && params.search.trim()) {
        const s = params.search.trim();
        query = query.or(`title.ilike.%${s}%,course_code.ilike.%${s}%`);
    }

    const { data: trails } = await query;
    if (!trails) return [];

    // Buscar contagem de anotações por trilha
    const { data: allSubmissions } = await supabase
        .from('trail_submissions')
        .select('trail_id');

    const countsMap: Record<string, number> = {};
    if (allSubmissions) {
        allSubmissions.forEach(sub => {
            countsMap[sub.trail_id] = (countsMap[sub.trail_id] || 0) + 1;
        });
    }

    return trails.map(t => {
        const code = t.course_code || t.title;
        let institute = 'IFUSP';
        if (code.startsWith('MAT') || code.startsWith('MAP') || code.startsWith('MAC')) institute = 'IME';
        else if (code.startsWith('AGA')) institute = 'IAG';
        else if (code.startsWith('IOF')) institute = 'IO';
        else if (code.startsWith('QFL')) institute = 'IQ';

        return {
            id: t.id,
            code: t.course_code || 'S/C',
            title: t.title,
            description: t.description,
            axis: t.axis,
            category: t.category,
            institute,
            notesCount: countsMap[t.id] || 0
        };
    }).filter(t => {
        if (!params?.institute || params.institute === 'Todos') return true;
        return t.institute.toLowerCase() === params.institute.toLowerCase();
    });
}
