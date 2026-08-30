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


/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Licença AGPLv3
 */

import { useState, useEffect } from 'react';
import { subscribeToWebPush, unsubscribeFromWebPush } from '@/app/actions/webpush';
import { toast } from 'react-hot-toast';

export function useWebPush() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            registerServiceWorker();
        }
    }, []);

    const urlBase64ToUint8Array = (base64String: string) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    };

    const registerServiceWorker = async () => {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            setRegistration(reg);

            const sub = await reg.pushManager.getSubscription();
            if (sub) {
                setIsSubscribed(true);
            }
        } catch (error) {
            console.error('Service Worker Error', error);
        }
    };

    const subscribe = async () => {
        if (!registration) {
            toast.error('Service Worker não registrado.');
            return;
        }

        try {
            const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
            if (!publicVapidKey) {
                toast.error('Chave pública VAPID não configurada.');
                return;
            }

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
            });

            const res = await subscribeToWebPush(subscription.toJSON());
            
            if (res.success) {
                setIsSubscribed(true);
                toast.success('Notificações Push ativadas com sucesso!');
            } else {
                toast.error('Erro ao salvar inscrição no banco de dados.');
                await subscription.unsubscribe();
            }
        } catch (error) {
            console.error('Erro ao inscrever:', error);
            if (Notification.permission === 'denied') {
                toast.error('Permissão para notificações foi negada. Altere nas configurações do navegador.');
            } else {
                toast.error('Falha ao ativar notificações Push.');
            }
        }
    };

    const unsubscribe = async () => {
        if (!registration) return;

        try {
            const subscription = await registration.pushManager.getSubscription();
            if (subscription) {
                await unsubscribeFromWebPush(subscription.endpoint);
                await subscription.unsubscribe();
                setIsSubscribed(false);
                toast.success('Notificações Push desativadas.');
            }
        } catch (error) {
            console.error('Erro ao cancelar inscrição:', error);
            toast.error('Erro ao desativar notificações Push.');
        }
    };

    return {
        isSupported,
        isSubscribed,
        subscribe,
        unsubscribe
    };
}
