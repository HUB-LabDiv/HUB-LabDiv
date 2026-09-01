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

import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';
import { TourStepConfig, getPageTourInfo, getEixoTourInfo, getGlobalTourSteps, UserRoleCategory } from './tour-data';

function removeScreenGesture() {
    if (typeof document === 'undefined') return;
    const existing = document.getElementById('hub-tour-gesture-overlay');
    if (existing) {
        existing.remove();
    }
}

function showScreenGesture(type: 'horizontal' | 'vertical', targetElement: HTMLElement) {
    removeScreenGesture();
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const overlay = document.createElement('div');
    overlay.id = 'hub-tour-gesture-overlay';
    overlay.style.cssText = 'position:fixed;pointer-events:none;z-index:100005;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;';

    const updatePosition = () => {
        if (!targetElement || !document.body.contains(targetElement)) return;
        const rect = targetElement.getBoundingClientRect();
        const top = Math.max(0, rect.top);
        const bottom = Math.min(window.innerHeight, rect.bottom);
        const height = Math.max(100, bottom - top);
        const left = Math.max(0, rect.left);
        const width = Math.min(window.innerWidth - left, rect.width);

        overlay.style.top = `${top}px`;
        overlay.style.left = `${left}px`;
        overlay.style.width = `${width}px`;
        overlay.style.height = `${height}px`;
    };

    updatePosition();

    if (type === 'horizontal') {
        overlay.innerHTML = `
            <div style="pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px 24px;border-radius:24px;background:rgba(18, 18, 18, 0.94);border:1.5px solid rgba(255, 255, 255, 0.25);box-shadow:0 20px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(15, 71, 128, 0.35);backdrop-filter:blur(16px);">
                <div style="position:relative;width:130px;height:48px;display:flex;align-items:center;justify-content:center;overflow:visible;">
                    <!-- Trilha da Seta Direcional da Direita para a Esquerda -->
                    <svg width="110" height="32" viewBox="0 0 110 32" fill="none" style="position:absolute;color:rgba(255,255,255,0.45);">
                        <path d="M96 16H14M14 16L28 6M14 16L28 26" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <!-- Mão/Dedo Deslizando da Direita para a Esquerda -->
                    <div class="screen-gesture-hand-horizontal" style="position:absolute;z-index:10;filter:drop-shadow(0 6px 14px rgba(0,0,0,0.9));">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#0F4780" stroke-width="1.3">
                            <path d="M10 2a2 2 0 0 0-2 2v7.586l-1.707-1.707A2 2 0 0 0 3.464 12.7l4.243 4.243A6 6 0 0 0 11.95 18.7h2.1a6 6 0 0 0 6-6V8a2 2 0 0 0-2-2 2 2 0 0 0-1.8 1.13A2 2 0 0 0 14 6a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2z"/>
                        </svg>
                    </div>
                </div>
                <div style="margin-top:8px;text-align:center;">
                    <span style="display:block;font-family:var(--font-bukra),sans-serif;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;color:#FFFFFF;">Deslize para a Esquerda</span>
                    <span style="display:block;font-family:var(--font-open-sans),sans-serif;font-size:11px;font-weight:700;color:#FFCC00;margin-top:2px;">Gesto da direita para a esquerda</span>
                </div>
            </div>
        `;
    } else {
        overlay.innerHTML = `
            <div style="pointer-events:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px 24px;border-radius:24px;background:rgba(18, 18, 18, 0.94);border:1.5px solid rgba(255, 255, 255, 0.25);box-shadow:0 20px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 204, 0, 0.25);backdrop-filter:blur(16px);">
                <div style="position:relative;width:48px;height:120px;display:flex;align-items:center;justify-content:center;overflow:visible;">
                    <!-- Trilha da Seta Direcional de Cima para Baixo -->
                    <svg width="32" height="100" viewBox="0 0 32 100" fill="none" style="position:absolute;color:rgba(255,255,255,0.45);">
                        <path d="M16 14V86M16 86L6 72M16 86L26 72" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <!-- Mão/Dedo Deslizando de Cima para Baixo -->
                    <div class="screen-gesture-hand-vertical" style="position:absolute;z-index:10;filter:drop-shadow(0 6px 14px rgba(0,0,0,0.9));">
                        <svg width="42" height="42" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#0F4780" stroke-width="1.3">
                            <path d="M10 2a2 2 0 0 0-2 2v7.586l-1.707-1.707A2 2 0 0 0 3.464 12.7l4.243 4.243A6 6 0 0 0 11.95 18.7h2.1a6 6 0 0 0 6-6V8a2 2 0 0 0-2-2 2 2 0 0 0-1.8 1.13A2 2 0 0 0 14 6a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2z"/>
                        </svg>
                    </div>
                </div>
                <div style="margin-top:8px;text-align:center;">
                    <span style="display:block;font-family:var(--font-bukra),sans-serif;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.05em;color:#FFFFFF;">Deslize para Baixo</span>
                    <span style="display:block;font-family:var(--font-open-sans),sans-serif;font-size:11px;font-weight:700;color:#FFCC00;margin-top:2px;">Gesto de cima para baixo</span>
                </div>
            </div>
        `;
    }

    document.body.appendChild(overlay);

    const updateOnScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', updateOnScrollOrResize, { passive: true });
    window.addEventListener('resize', updateOnScrollOrResize, { passive: true });

    const observer = new MutationObserver(() => {
        if (!document.body.contains(overlay)) {
            window.removeEventListener('scroll', updateOnScrollOrResize);
            window.removeEventListener('resize', updateOnScrollOrResize);
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true });
}

export function runCustomTour(steps: TourStepConfig[], onFinish?: () => void) {
    if (typeof window === 'undefined') return;

    // Helper: Encontra o primeiro elemento que corresponda ao seletor e esteja visível na tela
    const getVisibleElement = (selector: string): HTMLElement | null => {
        const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
        for (const el of elements) {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            if (
                style.display !== 'none' &&
                style.visibility !== 'hidden' &&
                style.opacity !== '0' &&
                rect.width > 0 &&
                rect.height > 0
            ) {
                return el;
            }
        }
        return null;
    };

    // Filtra para garantir que apenas elementos com presença visível no viewport participem do tour
    const validSteps = steps
        .map(step => {
            const el = getVisibleElement(step.element);
            return el ? { step, element: el } : null;
        })
        .filter((item): item is { step: TourStepConfig; element: HTMLElement } => item !== null);

    if (validSteps.length === 0) return;

    let cleanupKeyHandler: (() => void) | null = null;

    const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: 'rgba(18, 18, 18, 0.88)',
        popoverClass: 'hub-driver-popover',
        progressText: 'Passo {{current}} de {{total}}',
        nextBtnText: 'Próximo →',
        prevBtnText: '← Anterior',
        doneBtnText: 'Concluir ✨',
        showButtons: ['next', 'previous', 'close'],
        allowClose: true,
        allowKeyboardControl: true,
        onHighlightStarted: () => {
            removeScreenGesture();
        },
        onDeselected: () => {
            removeScreenGesture();
        },
        onDestroyStarted: () => {
            removeScreenGesture();
            if (cleanupKeyHandler) cleanupKeyHandler();
            if (onFinish) onFinish();
            driverObj.destroy();
        },
        steps: validSteps.map(({ step, element }): DriveStep => ({
            element,
            popover: {
                title: step.popover.title,
                description: step.popover.description,
                side: step.popover.side,
                align: step.popover.align
            },
            onHighlightStarted: () => {
                removeScreenGesture();
            },
            onHighlighted: (el) => {
                removeScreenGesture();
                if (step.gesture && el instanceof HTMLElement) {
                    showScreenGesture(step.gesture, el);
                }
            },
            onDeselected: () => {
                removeScreenGesture();
            }
        }))
    });

    // Saída rápida com ESC (captura direta e imediata de teclado)
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' || e.code === 'Escape') {
            removeScreenGesture();
            if (cleanupKeyHandler) cleanupKeyHandler();
            driverObj.destroy();
            if (onFinish) onFinish();
        }
    };

    cleanupKeyHandler = () => {
        window.removeEventListener('keydown', handleKeyDown, true);
        cleanupKeyHandler = null;
    };

    window.addEventListener('keydown', handleKeyDown, true);

    driverObj.drive();
}

export function runGlobalTour(
    roleOrOnFinish?: UserRoleCategory | (() => void),
    onFinish?: () => void
) {
    let role: UserRoleCategory | undefined;
    let finishCallback: (() => void) | undefined = onFinish;

    if (typeof roleOrOnFinish === 'function') {
        finishCallback = roleOrOnFinish;
    } else {
        role = roleOrOnFinish;
    }

    const steps = getGlobalTourSteps(role);
    runCustomTour(steps, finishCallback);
}

export function runEixoTour(pathname: string, onFinish?: () => void) {
    const eixoTour = getEixoTourInfo(pathname);
    runCustomTour(eixoTour.steps, onFinish);
}

export function runPageTour(
    pathname: string,
    searchParamsOrOnFinish?: URLSearchParams | null | (() => void),
    onFinish?: () => void
) {
    let searchParams: URLSearchParams | null | undefined;
    let finishCallback: (() => void) | undefined = onFinish;

    if (typeof searchParamsOrOnFinish === 'function') {
        finishCallback = searchParamsOrOnFinish;
    } else {
        searchParams = searchParamsOrOnFinish;
    }

    const pageTour = getPageTourInfo(pathname, searchParams);
    runCustomTour(pageTour.steps, finishCallback);
}

// Compatibilidade retroativa
export function runOnboardingTour(onFinish?: () => void) {
    runGlobalTour(onFinish);
}
