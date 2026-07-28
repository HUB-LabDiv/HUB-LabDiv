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
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { App } from '@capacitor/app';
import { flushOfflineQueueToSupabase } from '@/lib/offlineQueueManager';

export function PwaManager() {
    const [isOffline, setIsOffline] = useState(false);

    // Inicializa os listeners de Push Notifications nativas via Capacitor
    usePushNotifications();

    useEffect(() => {
        // Intercepta Deep Links do Widget (ex: hublabdiv://trilhas)
        const listener = App.addListener('appUrlOpen', (event) => {
            const urlString = event.url;
            if (urlString.startsWith('hublabdiv://')) {
                const path = urlString.replace('hublabdiv://', '');
                
                // Mapeia os caminhos
                if (path === 'lab-pessoal') window.location.href = '/lab-pessoal';
                else if (path === 'trilhas') window.location.href = '/ferramentas/trilhas';
            }
        });

        // --- INÍCIO: CACHE WARMER (Primeiro uso - Baixa Grade/Trilhas/Rascunho) ---
        const warmerTimer = setTimeout(() => {
            if (typeof window !== 'undefined' && 'caches' in window) {
                const cacheMode = localStorage.getItem('hub_cache_mode') || 'full';
                if (cacheMode !== 'full') {
                    console.log(`⚡ [Cache Warmer] Modo de cache [${cacheMode}]: pré-carregamento suspenso.`);
                    return;
                }

                const rotasCriticas = [
                    '/ferramentas', 
                    '/ferramentas/trilhas', 
                    '/lab-pessoal', 
                    '/arquivo-labdiv',
                    '/interacao',
                    '/offline'
                ];
                const rotasSecundarias = [
                    '/',
                    '/admin',
                    '/admin/perguntas',
                    '/admin/reports',
                    '/admin/profiles',
                    '/admin/drops',
                    '/gcif',
                    '/drops',
                    '/perguntas'
                ];
                
                console.log('🔥 [Cache Warmer] Baixando Grade Horária, Trilhas e Rascunho para uso offline...');
                rotasCriticas.forEach(rota => {
                    fetch(rota, { priority: 'low' }).catch(() => {}); 
                });

                setTimeout(() => {
                    rotasSecundarias.forEach(rota => {
                        fetch(rota, { priority: 'low' }).catch(() => {}); 
                    });
                }, 10000);
            }
        }, 3000);

        return () => {
            listener.then(l => l.remove());
            clearTimeout(warmerTimer);
        };
    }, []);

    useEffect(() => {
        // Handle native online/offline events
        const handleOffline = () => {
            setIsOffline(true);
            toast.error('Sem internet. Suas alterações serão salvas na fila offline (IndexedDB) e enviadas ao reconectar.', {
                id: 'offline-status',
                duration: Infinity,
                icon: '📵'
            });
        };

        const handleOnline = async () => {
            setIsOffline(false);
            toast.success('Conexão restabelecida! Sincronizando fila offline...', {
                id: 'offline-status',
                duration: 4000,
                icon: '🟢'
            });

            // Processa a fila offline com limite estrito de 57 itens por batch
            try {
                const { processed, errors } = await flushOfflineQueueToSupabase();
                if (processed > 0) {
                    toast.success(`Fila offline sincronizada com o Supabase: ${processed} item(ns) salvos!`);
                }
                if (errors > 0) {
                    toast.error(`Falha ao sincronizar ${errors} item(ns) da fila offline.`);
                }
            } catch (err) {
                console.error('[PWA Manager] Erro ao sincronizar fila offline:', err);
            }
        };

        window.addEventListener('offline', handleOffline);
        window.addEventListener('online', handleOnline);

        // Initial check
        if (typeof navigator !== 'undefined' && !navigator.onLine) {
            handleOffline();
        } else if (typeof navigator !== 'undefined' && navigator.onLine) {
            // Tenta processar qualquer item que sobrou da sessão anterior
            flushOfflineQueueToSupabase().catch(() => {});
        }

        // Listen for Service Worker messages
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
        };
    }, []);

    return null;
}
