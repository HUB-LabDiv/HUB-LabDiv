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
import { motion } from 'framer-motion';
import { toggleTagFollow, checkTagFollow } from '@/app/actions/follows';

interface FollowTagButtonProps {
    tagName: string;
    userId: string | undefined;
}

export const FollowTagButton = ({ tagName, userId }: FollowTagButtonProps) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            checkTagFollow(userId, tagName).then(followed => {
                setIsFollowing(followed);
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [userId, tagName]);

    const handleFollow = async () => {
        if (!userId || isLoading) return;

        setIsLoading(true);
        // Optimistic
        setIsFollowing(!isFollowing);

        const result = await toggleTagFollow(userId, tagName);
        if (result.action === 'followed') setIsFollowing(true);
        else setIsFollowing(false);

        setIsLoading(false);
    };

    if (!userId) return null;

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFollow}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${isFollowing
                ? 'bg-brand-yellow text-gray-900 border-brand-yellow shadow-lg shadow-brand-yellow/20'
                : 'bg-white dark:bg-gray-800 text-brand-yellow border-brand-yellow/30 hover:bg-brand-yellow/5'
                }`}
        >
            <span className="material-symbols-outlined text-[14px]">
                {isFollowing ? 'check' : 'add'}
            </span>
            {isFollowing ? 'Seguindo' : 'Seguir Tag'}
        </motion.button>
    );
};
