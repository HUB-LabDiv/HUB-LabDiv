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


import { useState, useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { toggleLike, toggleSave } from '@/app/actions/media';
import { useMutation } from '@tanstack/react-query';

interface UseMediaInteractionProps {
    id: string;
    initialLikes: number;
    initialSaves: number;
    initialLiked?: boolean;
    initialSaved?: boolean;
    userId?: string;
    setIsSyncing?: (val: boolean) => void;
}

export function useMediaInteraction({ id, initialLikes, initialSaves, initialLiked = false, initialSaved = false, userId, setIsSyncing }: UseMediaInteractionProps) {
    const router = useRouter();
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [saves, setSaves] = useState(initialSaves);
    const [saved, setSaved] = useState(initialSaved);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // V8.0 Sync: Keep internal state in sync with props
    useEffect(() => {
        setLikes(initialLikes);
        setLiked(initialLiked);
        setSaves(initialSaves);
        setSaved(initialSaved);
    }, [initialLikes, initialLiked, initialSaves, initialSaved]);

    const lastLikeClick = useRef<number>(0);

    const checkAuth = useCallback(() => {
        if (!userId) {
            toast.error("Faça login para interagir!");
            const currentPath = window.location.pathname + window.location.search;
            router.push(`/login?next=${encodeURIComponent(currentPath)}`);
            return false;
        }
        return true;
    }, [userId, router]);

    const likeMutation = useMutation({
        mutationFn: async () => {
            const result = await toggleLike({ submission_id: id });
            if (result.error) throw new Error(result.error);
            return result;
        },
        onError: (err, variables, context: any) => {
            if (context?.prevLiked !== undefined) {
                setLiked(context.prevLiked);
                setLikes(context.prevLikes);
            }
            if (navigator.onLine) toast.error(err.message || "Erro ao curtir");
        },
        onSuccess: (data, variables, context: any) => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([10]);
            if (!context?.prevLiked && navigator.onLine) {
                toast.success('Curtida sincronizada!', { icon: '❤️' });
            }
        },
        onMutate: () => {
            const prevLiked = liked;
            const prevLikes = likes;
            return { prevLiked, prevLikes };
        }
    });

    const saveMutation = useMutation({
        mutationFn: async () => {
            const result = await toggleSave({ submission_id: id });
            if (result.error) throw new Error(result.error);
            return result;
        },
        onError: (err, variables, context: any) => {
            if (context?.prevSaved !== undefined) {
                setSaved(context.prevSaved);
                setSaves(context.prevSaves);
            }
            if (navigator.onLine) toast.error(err.message || "Erro ao salvar");
        },
        onSuccess: (data, variables, context: any) => {
            if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([8]);
            if (!context?.prevSaved && navigator.onLine) {
                toast.success('Acervo atualizado!', { icon: '📂' });
            }
        },
        onMutate: () => {
            const prevSaved = saved;
            const prevSaves = saves;
            return { prevSaved, prevSaves };
        }
    });

    const handleLike = useCallback(async () => {
        if (!checkAuth()) return;

        const now = Date.now();
        if (now - lastLikeClick.current < 1000) return;
        lastLikeClick.current = now;

        if (likeMutation.isPending) return;

        // Optimistic UI imediata
        const prevLiked = liked;
        const prevLikes = likes;
        setLiked(!prevLiked);
        setLikes(prevLiked ? Math.max(0, prevLikes - 1) : prevLikes + 1);

        likeMutation.mutate();
    }, [liked, likes, checkAuth, likeMutation]);

    const handleSave = useCallback(async () => {
        if (!checkAuth()) return;

        if (saveMutation.isPending) return;

        // Optimistic UI imediata
        const prevSaved = saved;
        const prevSaves = saves;
        setSaved(!prevSaved);
        setSaves(!prevSaved ? prevSaves + 1 : Math.max(0, prevSaves - 1));

        saveMutation.mutate();
    }, [saved, saves, checkAuth, saveMutation]);

    return {
        likes,
        liked,
        saves,
        saved,
        isLiking: likeMutation.isPending,
        isSaving: saveMutation.isPending,
        handleLike,
        handleSave
    };
}
