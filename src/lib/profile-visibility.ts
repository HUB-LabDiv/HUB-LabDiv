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

import { Profile } from '@/types';

/**
 * 🔒 Sanitizador Central de Visibilidade de Perfil (Owner & Admin Only)
 *
 * Regra de Segurança:
 * 1. Se `viewerId === rawProfile.id` (Próprio Dono):
 *    - Aplica o merge em memória de `pending_edits` sobre os dados aprovados (incluindo `pending_avatar_url -> avatar_url`
 *      e `pending_edits.member_initiatives -> member_initiatives`), preservando `pending_edits` no objeto para ativar os
 *      avisos visuais M3 ("⏳ Alterações em análise • Visível só para você").
 * 2. Se `isAdmin === true` (Moderador/Admin):
 *    - Mantém as colunas oficiais aprovadas intactas e preserva `pending_edits` separado para comparação (Diff Antes/Depois).
 * 3. Se Terceiro / Visitante Anônimo (`viewerId !== rawProfile.id && !isAdmin`):
 *    - NUNCA aplica merge de `pending_edits` e expurga `pending_edits: null` do payload retornado.
 */
export function sanitizeProfileForViewer(
    rawProfile: any,
    viewerId?: string | null,
    isAdmin: boolean = false
): Profile | null {
    if (!rawProfile) return null;

    const isOwner = Boolean(viewerId && rawProfile.id === viewerId);
    const pending = rawProfile.pending_edits;
    const hasPending = pending && typeof pending === 'object' && Object.keys(pending).filter(k => k !== '_submitted_at').length > 0;

    if (isOwner && hasPending) {
        const { _submitted_at, pending_avatar_url, ...restPending } = pending;
        return {
            ...rawProfile,
            ...restPending,
            avatar_url: pending_avatar_url || restPending.avatar_url || rawProfile.avatar_url,
            member_initiatives: Array.isArray(restPending.member_initiatives)
                ? restPending.member_initiatives
                : (rawProfile.member_initiatives || (rawProfile.is_labdiv ? ['labdiv'] : [])),
            pending_edits: rawProfile.pending_edits,
        } as Profile;
    }

    if (isAdmin) {
        return {
            ...rawProfile,
            member_initiatives: Array.isArray(rawProfile.member_initiatives) && rawProfile.member_initiatives.length > 0
                ? rawProfile.member_initiatives
                : (rawProfile.is_labdiv ? ['labdiv'] : []),
        } as Profile;
    }

    // Visitante / Terceiro: retorna apenas dados oficiais aprovados, omitindo pending_edits
    return {
        ...rawProfile,
        member_initiatives: Array.isArray(rawProfile.member_initiatives) && rawProfile.member_initiatives.length > 0
            ? rawProfile.member_initiatives
            : (rawProfile.is_labdiv ? ['labdiv'] : []),
        pending_edits: null,
    } as Profile;
}

/**
 * Verifica se o perfil possui edições reais pendentes (ignorando metadados internos como `_submitted_at`).
 */
export function hasActivePendingEdits(pendingEdits: any): boolean {
    if (!pendingEdits || typeof pendingEdits !== 'object') return false;
    return Object.keys(pendingEdits).some(k => k !== '_submitted_at' && pendingEdits[k] !== undefined);
}

/**
 * 🔬 Identifica se um perfil é de Pesquisador / Docente / Orientador
 */
export function isResearcherProfile(profile: any): boolean {
    if (!profile) return false;
    const category = profile.user_category;
    const role = profile.role;
    return (
        category === 'pesquisador' ||
        category === 'docente_pesquisador' ||
        category === 'professor' ||
        role === 'professor' ||
        Boolean(profile.seeking_assistant)
    );
}

/**
 * 🏷️ Nome Público Oficial do Perfil (Mediação de Identidade e Privacidade)
 *
 * Regra do HUB:
 * 1. Caso a pessoa tenha um apelido e opte por usá-lo (ou se tiver apelido cadastrado
 *    e use_nickname não estiver explicitamente false), deve aparecer SEMPRE o apelido
 *    e NÃO o nome da pessoa.
 * 2. O nome real fica protegido e restrito ao próprio usuário e à administração.
 * 3. Exceção Acadêmica Obrigatória: Para pesquisadores no Match Acadêmico
 *    (ou quando forceRealName for true), DEVE APARECER O NOME REAL civil completo para
 *    garantir credibilidade científica, validação do orientador e busca no Lattes.
 */
export function getProfileDisplayName(
    profile: {
        full_name?: string | null;
        username?: string | null;
        use_nickname?: boolean | null;
        pending_edits?: any;
        user_category?: string | null;
        role?: string | null;
        seeking_assistant?: boolean | null;
    } | null | undefined,
    options?: { forceRealName?: boolean }
): string {
    if (!profile) return 'Usuário';

    const pending = profile.pending_edits;
    const effectiveUsername = (pending?.username ?? profile.username)?.trim();
    const effectiveFullName = (pending?.full_name ?? profile.full_name)?.trim();
    const effectiveUseNickname = pending?.use_nickname ?? profile.use_nickname;

    // Se for exigido nome real (ex: pesquisadores no Match Acadêmico)
    if (options?.forceRealName && effectiveFullName) {
        return effectiveFullName;
    }

    const hasNickname = Boolean(effectiveUsername && effectiveUsername.length > 0);

    if (hasNickname) {
        // Se optou por apelido, ou se tem apelido e não optou explicitamente por nome real, ou não tem nome real
        if (effectiveUseNickname === true || effectiveUseNickname === undefined || !effectiveFullName) {
            return effectiveUsername!;
        }
        return effectiveFullName || effectiveUsername!;
    }

    return effectiveFullName || 'Usuário';
}


