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


import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { warmUpOfflineDatabase, flushDurableQueue } from '@/lib/offline-sync';
import { toast } from 'react-hot-toast';

// Performance: lazy-load PwaManager on client only
const PwaManagerLazy = dynamic(
    () => import('@/components/pwa/PwaManager').then(mod => mod.PwaManager)
);

export function ClientPwaManager() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        // Antigravity: Dispara a inicialização e warm-up do IndexedDB local
        warmUpOfflineDatabase();
        if (navigator.onLine) {
            flushDurableQueue();
        }
        
        // Antigravity: Aviso Global de Queda de Conexão
        const handleOffline = () => {
            toast.error('Sem internet. Não se preocupe, suas interações serão salvas localmente e enviadas automaticamente depois.', {
                icon: '📡',
                duration: 6000,
                style: {
                    background: '#1E1E1E',
                    color: '#fff',
                    border: '1px solid #333'
                }
            });
        };
        
        const handleOnline = () => {
            toast.success('Conexão restabelecida! Sincronizando fila...', {
                icon: '🚀',
                duration: 4000
            });
            flushDurableQueue();
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
        };
    }, []);

    if (!mounted) return null;
    return <PwaManagerLazy />;
}
