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

/**
 * Deep Linking Utility for Lab-Div Scientific Hub
 * Implements modern Web Text Fragments and specific media anchors.
 */

export const generateDeepLink = (baseUrl: string, options: {
    timestamp?: number;
    textSelection?: string;
    paragraphId?: string
}) => {
    let url = baseUrl;

    if (options.timestamp) {
        url += `#t=${Math.floor(options.timestamp)}`;
    } else if (options.textSelection) {
        // Web Text Fragments: https://web.dev/text-fragments/
        // Syntax: #:~:text=start_text,end_text
        const encodedText = encodeURIComponent(options.textSelection);
        url += `#:~:text=${encodedText}`;
    } else if (options.paragraphId) {
        url += `#${options.paragraphId}`;
    }

    return url;
};

export const handleDeepLinkScroll = () => {
    if (typeof window === 'undefined') return;

    // Browser handles #:~:text automatically in most modern browsers.
    // We add fallback for manual paragraph ID scroll if needed.
    const hash = window.location.hash;
    if (hash && hash.startsWith('#p-')) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
            setTimeout(() => {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.classList.add('bg-brand-blue/10', 'transition-colors', 'duration-1000');
                setTimeout(() => element.classList.remove('bg-brand-blue/10'), 3000);
            }, 500);
        }
    }
};
