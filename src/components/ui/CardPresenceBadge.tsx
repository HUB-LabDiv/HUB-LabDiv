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


import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Lightweight presence badge for cards.
 * Subscribes to the same Supabase Realtime channel as PresenceIndicator
 * but renders as a compact badge suitable for grid cards.
 */
export function CardPresenceBadge({ submissionId }: { submissionId: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const channel = supabase.channel(`reading:${submissionId}`, {
            config: { presence: { key: 'user' } },
        });

        // Supabase throws an error if we call .on() after .subscribe() has been called by another component.
        // We check the channel state. If it's 'closed', we are the first to create/configure it.
        if (channel.state === 'closed') {
            channel
                .on('presence', { event: 'sync' }, () => {
                    setCount(Object.keys(channel.presenceState()).length);
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        } else {
            // Channel is already joining/joined by a duplicate card (e.g. Destaques vs Feed)
            // We can safely read the presence state directly without adding a new listener
            setCount(Object.keys(channel.presenceState()).length);
            
            // Poll the local state occasionally to keep the badge updated
            const interval = setInterval(() => {
                setCount(Object.keys(channel.presenceState()).length);
            }, 2000);
            
            return () => clearInterval(interval);
        }
    }, [submissionId, isVisible]);

    return (
        <div ref={containerRef} className="absolute top-2 left-2 z-30 min-w-[20px] min-h-[20px]">
            {count > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-background-dark/70 backdrop-blur-sm rounded-full text-white text-[10px] font-bold shadow-lg">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-red"></span>
                    </span>
                    🔥 {count}
                </div>
            )}
        </div>
    );
}
