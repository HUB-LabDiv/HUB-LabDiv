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

/**
 * Retorna o domínio compartilhado de cookies para sessões cross-subdomain.
 * Em produção (*.hublabdiv.com.br), retorna '.hublabdiv.com.br' para permitir
 * que sessões e tokens fluam livremente entre o HUB e subdomínios de iniciativas.
 * Em localhost ou ambientes de preview da Vercel, retorna undefined para respeitar o isolamento local.
 */
export function getSharedCookieDomain(host?: string | null): string | undefined {
    if (!host) {
        if (typeof window !== 'undefined') {
            host = window.location.host;
        } else {
            return undefined;
        }
    }

    const cleanHost = host.split(':')[0].toLowerCase();

    if (cleanHost === 'hublabdiv.com.br' || cleanHost.endsWith('.hublabdiv.com.br')) {
        return '.hublabdiv.com.br';
    }

    return undefined;
}

