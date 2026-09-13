'use server';

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


import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export async function fetchRecentEntanglements() {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return [];

    // 1. Busca mensagens para identificar conversas ativas
    const { data: messages, error: mError } = await supabaseServer
        .from('messages')
        .select('sender_id, recipient_id, content, created_at')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

    if (mError) return [];

    // 2. Busca usuários que o usuário atual segue
    const { data: follows, error: fError } = await supabaseServer
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

    if (fError) return [];

    // Agrupa por usuário para pegar a ÚLTIMA mensagem de cada conversa
    const conversationMap = new Map();
    messages?.forEach(m => {
        const peerId = m.sender_id === user.id ? m.recipient_id : m.sender_id;
        if (!conversationMap.has(peerId)) {
            conversationMap.set(peerId, {
                lastMessage: m.content,
                lastAt: m.created_at
            });
        }
    });

    // Pega IDs de seguidos que ainda não estão no mapa de conversas
    const followedIds = follows?.map(f => f.following_id) || [];

    // Lista final de IDs únicos (conversas + seguidos)
    const allPeerIds = Array.from(new Set([
        ...Array.from(conversationMap.keys()),
        ...followedIds
    ]));

    if (allPeerIds.length === 0) return [];

    // 3. Busca perfis para todos esses IDs
    const { data: profiles, error: pError } = await supabaseServer
        .from('profiles')
        .select('id, full_name, username, use_nickname, email, avatar_url, xp, level, is_labdiv')
        .in('id', allPeerIds);

    if (pError || !profiles) return [];

    // 4. Mapeia para o formato esperado pela UI
    return profiles.map(p => {
        const conv = conversationMap.get(p.id);
        const isFollowed = followedIds.includes(p.id);

        return {
            id: p.id,
            name: (p.use_nickname && p.username) ? p.username : (p.full_name || 'Usuário'),
            handle: p.email ? `@${p.email.split('@')[0]}` : '@usuario',
            avatar: p.avatar_url,
            xp: p.xp,
            level: p.level,
            is_labdiv: p.is_labdiv,
            lastMessage: conv?.lastMessage,
            lastAt: conv?.lastAt,
            isFollowed
        };
    }).sort((a, b) => {
        // Ordena por data da última mensagem, ou coloca seguidos sem conversa no final
        if (a.lastAt && b.lastAt) return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime();
        if (a.lastAt) return -1;
        if (b.lastAt) return 1;
        return 0;
    });
}

export type EntanglementConnectionStatus = 
    | 'none'              // Sem conexão prévia, pode enviar 1 mensagem de convite
    | 'pending_outgoing' // Você enviou o convite, aguardando o destinatário aceitar
    | 'pending_incoming' // Você recebeu o convite, pode aceitar ou recusar
    | 'accepted'         // Conexão aceita, chat livre
    | 'rejected';        // Conexão recusada

/**
 * Obtém o status da conexão entre o usuário atual e um interlocutor.
 * Aplica retrocompatibilidade automática com chats pré-existentes.
 */
export async function getEntanglementConnection(peerId: string): Promise<{
    status: EntanglementConnectionStatus;
    canSend: boolean;
    initialMessage?: string;
    requesterId?: string;
}> {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) {
        return { status: 'none', canSend: false };
    }

    try {
        // 1. Consulta tabela entanglement_connections
        const { data: conn } = await supabaseServer
            .from('entanglement_connections')
            .select('*')
            .or(`and(requester_id.eq.${user.id},recipient_id.eq.${peerId}),and(requester_id.eq.${peerId},recipient_id.eq.${user.id})`)
            .maybeSingle();

        if (conn) {
            if (conn.status === 'accepted') {
                return { status: 'accepted', canSend: true, requesterId: conn.requester_id };
            }
            if (conn.status === 'rejected') {
                return { status: 'rejected', canSend: false, requesterId: conn.requester_id };
            }
            if (conn.status === 'pending') {
                if (conn.requester_id === user.id) {
                    return { status: 'pending_outgoing', canSend: false, requesterId: conn.requester_id };
                } else {
                    return { status: 'pending_incoming', canSend: false, requesterId: conn.requester_id };
                }
            }
        }

        // 2. Retrocompatibilidade: verificar se já existem mensagens trocadas
        const { data: messages } = await supabaseServer
            .from('messages')
            .select('id, sender_id, content')
            .or(`and(sender_id.eq.${user.id},recipient_id.eq.${peerId}),and(sender_id.eq.${peerId},recipient_id.eq.${user.id})`)
            .order('created_at', { ascending: true })
            .limit(10);

        if (!messages || messages.length === 0) {
            return { status: 'none', canSend: true };
        }

        const senders = new Set(messages.map(m => m.sender_id));
        // Se ambos já trocaram mensagens ou se há mais de 1 mensagem
        if (senders.size > 1 || messages.length > 1) {
            return { status: 'accepted', canSend: true };
        }

        // Se há exatamente 1 mensagem enviada pelo usuário atual
        if (messages[0].sender_id === user.id) {
            return { status: 'pending_outgoing', canSend: false, initialMessage: messages[0].content };
        }

        // Se há exatamente 1 mensagem enviada pelo outro usuário
        return { status: 'pending_incoming', canSend: false, initialMessage: messages[0].content, requesterId: peerId };
    } catch (e) {
        console.error('[getEntanglementConnection] Error:', e);
        return { status: 'none', canSend: true };
    }
}

/**
 * Envia uma mensagem no Emaranhamento Quântico, gerenciando a criação
 * automática de solicitação de conexão no primeiro contato.
 */
export async function sendEntanglementMessage(recipientId: string, content: string, attachmentId?: string) {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const trimmed = content.trim();
    if (!trimmed && !attachmentId) {
        return { success: false, error: 'Mensagem vazia.' };
    }

    try {
        const connection = await getEntanglementConnection(recipientId);

        if (connection.status === 'pending_outgoing') {
            return { success: false, error: 'Aguarde o destinatário aceitar seu convite anterior antes de enviar novas mensagens.' };
        }

        if (connection.status === 'rejected') {
            return { success: false, error: 'A solicitação de emaranhamento foi recusada.' };
        }

        // Insere a mensagem
        const { error: msgError } = await supabaseServer
            .from('messages')
            .insert([{
                sender_id: user.id,
                recipient_id: recipientId,
                content: trimmed,
                attachment_id: attachmentId || null,
                status: 'sent'
            }]);

        if (msgError) {
            return { success: false, error: msgError.message };
        }

        // Se era o primeiro contato ('none'), cria o pedido pendente em entanglement_connections
        if (connection.status === 'none') {
            await supabaseServer
                .from('entanglement_connections')
                .upsert([{
                    requester_id: user.id,
                    recipient_id: recipientId,
                    status: 'pending',
                    updated_at: new Date().toISOString()
                }], { onConflict: 'requester_id,recipient_id' });

            revalidatePath('/interacao');
            revalidatePath('/emaranhamento');
            return { success: true, connectionStatus: 'pending_outgoing' as EntanglementConnectionStatus };
        }

        revalidatePath('/interacao');
        revalidatePath('/emaranhamento');
        return { success: true, connectionStatus: 'accepted' as EntanglementConnectionStatus };
    } catch (e: any) {
        console.error('[sendEntanglementMessage] Exception:', e);
        return { success: false, error: e.message || 'Falha ao transmitir mensagem.' };
    }
}

/**
 * Responde a uma solicitação de emaranhamento (aceitar ou recusar).
 */
export async function respondEntanglementRequest(requesterId: string, action: 'accept' | 'reject') {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return { success: false, error: 'Não autorizado' };

    const targetStatus = action === 'accept' ? 'accepted' : 'rejected';

    try {
        const { error } = await supabaseServer
            .from('entanglement_connections')
            .upsert([{
                requester_id: requesterId,
                recipient_id: user.id,
                status: targetStatus,
                updated_at: new Date().toISOString()
            }], { onConflict: 'requester_id,recipient_id' });

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/interacao');
        revalidatePath('/emaranhamento');
        return { success: true, status: targetStatus };
    } catch (e: any) {
        console.error('[respondEntanglementRequest] Error:', e);
        return { success: false, error: e.message || 'Erro ao processar resposta da conexão.' };
    }
}

/**
 * Busca estatísticas e histórico para o painel de moderação /admin/emaranhamento.
 */
export async function getEntanglementAdminData() {
    const supabaseServer = await createServerSupabase();
    const { data: { user } } = await supabaseServer.auth.getUser();

    if (!user) return { success: false, error: 'Não autenticado' };

    const { data: profile } = await supabaseServer.from('profiles').select('role').eq('id', user.id).single();
    if (!['admin', 'moderator', 'labdiv', 'labdiv adm'].includes(profile?.role || '')) {
        return { success: false, error: 'Acesso negado.' };
    }

    try {
        const { createAdminSupabase } = await import('@/lib/supabase/admin');
        const adminSupabase = createAdminSupabase();

        // 1. Total de conexões ativas
        const { count: activeCount } = await adminSupabase
            .from('entanglement_connections')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'accepted');

        // 2. Total de conexões pendentes
        const { count: pendingCount } = await adminSupabase
            .from('entanglement_connections')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        // 3. Denúncias de mensagens do chat
        const { data: chatReports, error: rError } = await adminSupabase
            .from('reports')
            .select('*, profiles:reporter_id(full_name, username, avatar_url)')
            .eq('item_type', 'emaranhamento_message')
            .order('created_at', { ascending: false });

        return {
            success: true,
            data: {
                activeConnections: activeCount || 0,
                pendingConnections: pendingCount || 0,
                chatReports: chatReports || []
            }
        };
    } catch (e: any) {
        return { success: false, error: e.message || 'Falha ao buscar dados administrativos.' };
    }
}

