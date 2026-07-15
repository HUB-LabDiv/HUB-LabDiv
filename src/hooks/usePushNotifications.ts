import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import toast from 'react-hot-toast';

export function usePushNotifications() {
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        let isMounted = true;

        const registerPush = async () => {
            try {
                // Solicita permissão para exibir notificações
                const { receive } = await PushNotifications.requestPermissions();
                
                if (receive !== 'granted') {
                    console.log('Permissão para Push Notifications negada.');
                    return;
                }

                // Registra-se para receber push notifications do Firebase
                await PushNotifications.register();

                if (!isMounted) return;

                // Eventos de Push Notifications
                PushNotifications.addListener('registration', (token) => {
                    console.log('Push registration success, token: ' + token.value);
                    // Opcional: Salvar token no banco de dados para enviar pushes específicos
                });

                PushNotifications.addListener('registrationError', (error: any) => {
                    console.error('Erro de registro no Push: ' + JSON.stringify(error));
                });

                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    // Quando a notificação chega e o app está em foreground, podemos mostrar um toast amigável
                    toast.success(`Aviso: ${notification.title} - ${notification.body}`, {
                        icon: '🔔',
                        duration: 6000
                    });
                });

                PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
                    // O que acontece quando o usuário clica na notificação fora do app
                    console.log('Push action performed: ' + JSON.stringify(notification));
                });
                
            } catch (error) {
                console.error("Erro ao configurar Push Notifications:", error);
            }
        };

        registerPush();

        return () => {
            isMounted = false;
            if (Capacitor.isNativePlatform()) {
                PushNotifications.removeAllListeners();
            }
        };
    }, []);
}
