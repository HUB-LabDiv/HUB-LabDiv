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


import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function PwaManager() {
    const [isOffline, setIsOffline] = useState(false);

    useEffect(() => {
        // Handle native online/offline events
        const handleOffline = () => {
            setIsOffline(true);
            toast.error('Sem Internet. Você está offline.', {
                id: 'offline-status',
                duration: Infinity,
                icon: '📵'
            });
        };

        const handleOnline = () => {
            setIsOffline(false);
            toast.success('Conexão restabelecida!', {
                id: 'offline-status',
                duration: 4000,
                icon: '🟢'
            });
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Check initial state
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            handleOffline();
        }

        // Listen for Service Worker messages (Cache Used)
        const handleMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === 'OFFLINE_CACHE_USED') {
                toast('Conexão instável. Mostrando versão em cache.', {
                    id: 'cache-used',
                    icon: '⚡',
                    duration: 5000,
                    style: {
                        background: '#334155',
                        color: '#f8fafc',
                    }
                });
            }
        };

        navigator.serviceWorker?.addEventListener('message', handleMessage);

        return () => {
            window.removeEventListener('offline', handleOffline);
            window.removeEventListener('online', handleOnline);
            navigator.serviceWorker?.removeEventListener('message', handleMessage);
            toast.dismiss('offline-status');
        };
    }, []);

    return null;
}
