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


import { supabase } from '@/lib/supabase';
import { PostDTO, mapToPostDTO } from '@/dtos/media';

export interface Playlist {
    id: string;
    title: string;
    description: string;
    slug: string;
    created_at: string;
}

export async function fetchPlaylists(): Promise<Playlist[]> {
    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching playlists:', error);
        return [];
    }
    return data || [];
}

export async function fetchPlaylistBySlug(slug: string): Promise<Playlist | null> {
    const { data, error } = await supabase
        .from('playlists')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error(`Error fetching playlist ${slug}:`, error);
        return null;
    }
    return data;
}

export async function fetchPlaylistItems(playlistId: string): Promise<{ post: PostDTO }[]> {
    const { data, error } = await supabase
        .from('playlist_items')
        .select(`
            position,
            submissions (*)
        `)
        .eq('playlist_id', playlistId)
        .eq('submissions.status', 'aprovado')
        .order('position', { ascending: true });

    if (error) {
        console.error('Error fetching playlist items:', error);
        return [];
    }

    const submissions = data
        .map(item => item.submissions)
        .filter(sub => sub !== null) as any[];

    return submissions.map(sub => ({ post: mapToPostDTO(sub) }));
}
