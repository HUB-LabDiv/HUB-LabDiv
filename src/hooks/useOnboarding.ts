/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { runOnboardingTour } from '@/lib/tour/tour-runner';

export const ONBOARDING_STORAGE_KEY = '@hub:onboarding_dismissed';
export const ONBOARDING_EVENT = 'hub:onboarding_change';

export function useOnboarding() {
    const [isDismissed, setIsDismissed] = useState<boolean>(true); // Inicia como true para evitar flash no SSR
    const [mounted, setMounted] = useState(false);

    const checkState = useCallback(() => {
        try {
            const dismissed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
            setIsDismissed(dismissed === 'true');
        } catch {
            setIsDismissed(false);
        }
    }, []);

    useEffect(() => {
        setMounted(true);
        checkState();

        const handleCustomEvent = (event: Event) => {
            const customEvent = event as CustomEvent<{ isDismissed: boolean }>;
            if (customEvent.detail && typeof customEvent.detail.isDismissed === 'boolean') {
                setIsDismissed(customEvent.detail.isDismissed);
            } else {
                checkState();
            }
        };

        window.addEventListener(ONBOARDING_EVENT, handleCustomEvent);
        window.addEventListener('storage', checkState);

        return () => {
            window.removeEventListener(ONBOARDING_EVENT, handleCustomEvent);
            window.removeEventListener('storage', checkState);
        };
    }, [checkState]);

    const setOnboardingVisibility = useCallback((visible: boolean, showFeedback = true) => {
        const dismissed = !visible;
        try {
            if (dismissed) {
                localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
            } else {
                localStorage.removeItem(ONBOARDING_STORAGE_KEY);
            }
            window.dispatchEvent(new CustomEvent(ONBOARDING_EVENT, { detail: { isDismissed: dismissed } }));
        } catch (e) {
            console.error('[Onboarding] Erro ao salvar estado:', e);
        }
        setIsDismissed(dismissed);

        if (showFeedback) {
            if (dismissed) {
                toast('Tutorial ocultado. Você poderá ativá-lo novamente nas Configurações.', {
                    icon: 'ℹ️',
                    duration: 4000,
                    style: {
                        background: '#1E1E1E',
                        color: '#FFFFFF',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        fontFamily: 'var(--font-open-sans), sans-serif',
                        fontSize: '13px'
                    }
                });
            } else {
                toast.success('Aviso de tutorial reativado no HUB!');
            }
        }
    }, []);

    const dismissOnboarding = useCallback((showFeedback = true) => {
        setOnboardingVisibility(false, showFeedback);
    }, [setOnboardingVisibility]);

    const startTour = useCallback(() => {
        runOnboardingTour();
    }, []);

    return {
        isDismissed: mounted ? isDismissed : true,
        dismissOnboarding,
        setOnboardingVisibility,
        startTour
    };
}
