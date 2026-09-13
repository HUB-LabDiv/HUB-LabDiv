'use client';

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

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { fetchParticlePreview, fetchMessages, getCurrentUserId } from '@/app/actions/submissions';
import { 
    getEntanglementConnection, 
    sendEntanglementMessage, 
    respondEntanglementRequest, 
    EntanglementConnectionStatus 
} from '@/app/actions/entanglements';
import { ReportChatMessageModal } from './ReportChatMessageModal';
import { toast } from 'react-hot-toast';
import { 
    Loader2, 
    Flag, 
    Check, 
    X, 
    ShieldAlert, 
    UserCheck, 
    Lock, 
    Clock, 
    Sparkles, 
    AlertCircle 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ParticleReference {
    id: string;
    type: 'article' | 'particle';
    title: string;
    author: string;
    energy: number;
}

interface ParticleEntanglementProps {
    recipientId?: string;
    recipientProfile?: {
        id?: string;
        name?: string;
        full_name?: string;
        avatar?: string;
        avatar_url?: string;
    } | null;
}

export const ParticleEntanglement = ({ recipientId, recipientProfile }: ParticleEntanglementProps) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [attachment, setAttachment] = useState<ParticleReference | null>(null);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<EntanglementConnectionStatus>('none');
    const [isRespondingConnection, setIsRespondingConnection] = useState(false);
    
    // Modal de Denúncia de Mensagem
    const [reportingMessage, setReportingMessage] = useState<{
        id: string;
        content: string;
        senderId: string;
        senderName?: string;
    } | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);

    const peerName = recipientProfile?.name || recipientProfile?.full_name || 'Usuário';

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchUser = async () => {
            const id = await getCurrentUserId();
            setCurrentUserId(id);
        };
        fetchUser();
    }, []);

    // Carregar status da conexão e mensagens
    useEffect(() => {
        if (recipientId && currentUserId) {
            const loadConnectionAndMessages = async () => {
                setIsLoading(true);
                try {
                    const [conn, data] = await Promise.all([
                        getEntanglementConnection(recipientId),
                        fetchMessages(recipientId)
                    ]);
                    setConnectionStatus(conn.status);
                    setMessages(data || []);
                } catch (e) {
                    console.error('Error loading chat:', e);
                } finally {
                    setIsLoading(false);
                }
            };
            loadConnectionAndMessages();

            // Realtime para novas mensagens
            const chatChannel = supabase
                .channel(`chat:${recipientId}`)
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages'
                }, (payload) => {
                    const newMessage = payload.new;
                    const isRelevant =
                        (newMessage.sender_id === recipientId && newMessage.recipient_id === currentUserId) ||
                        (newMessage.sender_id === currentUserId && newMessage.recipient_id === recipientId);

                    if (isRelevant) {
                        setMessages((prev) => {
                            if (prev.find(m => m.id === newMessage.id)) return prev;
                            return [...prev, newMessage];
                        });
                        // Atualiza status se estava em primeiro contato
                        getEntanglementConnection(recipientId).then(res => setConnectionStatus(res.status));
                    }
                })
                .subscribe();

            // Realtime para conexão (aceite/recusa)
            const connChannel = supabase
                .channel(`entanglement_conn:${recipientId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'entanglement_connections'
                }, () => {
                    getEntanglementConnection(recipientId).then(res => setConnectionStatus(res.status));
                })
                .subscribe();

            return () => {
                supabase.removeChannel(chatChannel);
                supabase.removeChannel(connChannel);
            };
        }
    }, [recipientId, currentUserId]);

    const handleAttach = async (id: string, type: 'article' | 'particle' = 'particle') => {
        const preview = await fetchParticlePreview(id);
        if (preview) {
            setAttachment({
                id,
                type,
                title: preview.title,
                author: preview.author,
                energy: preview.energy
            });
            setIsSelectorOpen(false);
        } else {
            toast.error('Partícula não encontrada no Colisor.');
        }
    };

    const handleSend = async () => {
        if (!recipientId || (!message.trim() && !attachment)) return;

        setIsSending(true);
        const currentMessage = message;
        const currentAttachment = attachment;

        setMessage('');
        setAttachment(null);

        const res = await sendEntanglementMessage(recipientId, currentMessage, currentAttachment?.id);

        if (res.success) {
            if (res.connectionStatus) {
                setConnectionStatus(res.connectionStatus);
            }
            if (res.connectionStatus === 'pending_outgoing') {
                toast.success('Convite de emaranhamento enviado! Aguardando aprovação.', {
                    icon: '🛰️',
                });
            }
            // Recarrega mensagens
            const data = await fetchMessages(recipientId);
            setMessages(data || []);
        } else {
            toast.error(res.error || 'Falha na transmissão da mensagem.');
            setMessage(currentMessage);
            setAttachment(currentAttachment);
        }
        setIsSending(false);
    };

    const handleRespondConnection = async (action: 'accept' | 'reject') => {
        if (!recipientId) return;
        setIsRespondingConnection(true);

        try {
            const res = await respondEntanglementRequest(recipientId, action);
            if (res.success) {
                if (action === 'accept') {
                    setConnectionStatus('accepted');
                    toast.success('Conexão aceita! Chat liberado para conversas.', {
                        icon: '✨',
                    });
                } else {
                    setConnectionStatus('rejected');
                    toast('Solicitação de conexão recusada.', {
                        icon: '🚫',
                    });
                }
            } else {
                toast.error(res.error || 'Erro ao processar resposta.');
            }
        } catch {
            toast.error('Erro de conexão.');
        } finally {
            setIsRespondingConnection(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden relative">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand-blue text-sm">hub</span>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 font-bukra">
                        Emaranhamento
                    </h3>
                </div>

                {/* Badge de Status de Conexão */}
                <div>
                    {connectionStatus === 'accepted' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Canal Ativo
                        </span>
                    )}
                    {connectionStatus === 'pending_outgoing' && (
                        <span className="px-2.5 py-1 rounded-full bg-brand-yellow/10 border border-brand-yellow/30 text-brand-yellow text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Clock className="size-3" />
                            Aguardando Aceite
                        </span>
                    )}
                    {connectionStatus === 'pending_incoming' && (
                        <span className="px-2.5 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-brand-blue text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="size-3" />
                            Convite Recebido
                        </span>
                    )}
                    {connectionStatus === 'none' && (
                        <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gray-300 text-[9px] font-black uppercase tracking-wider">
                            1º Contato (Convite)
                        </span>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth">
                {isLoading ? (
                    <div className="flex items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 text-brand-blue animate-spin" />
                    </div>
                ) : messages.length > 0 ? (
                    messages.map((msg) => {
                        const isMine = msg.sender_id === currentUserId;
                        return (
                            <div
                                key={msg.id}
                                className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} group relative animate-in fade-in slide-in-from-bottom-2 duration-300`}
                            >
                                <div className="flex items-center gap-2 max-w-[90%]">
                                    {/* Botão de Denúncia (para mensagens do interlocutor ou qualquer mensagem) */}
                                    {!isMine && (
                                        <button
                                            onClick={() => setReportingMessage({
                                                id: msg.id,
                                                content: msg.content,
                                                senderId: msg.sender_id,
                                                senderName: peerName
                                            })}
                                            title="Denunciar esta mensagem aos moderadores"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-500 hover:text-brand-red hover:bg-brand-red/10 cursor-pointer order-last"
                                        >
                                            <Flag className="size-3.5" />
                                        </button>
                                    )}

                                    <div
                                        className={`p-3 rounded-2xl text-xs border ${
                                            isMine
                                                ? 'bg-brand-blue/20 border-brand-blue/30 text-white rounded-tr-none'
                                                : 'bg-white/5 border-white/5 text-gray-300 rounded-tl-none'
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>

                                        {msg.attachment_id && (
                                            <a
                                                href={`/arquivo/${msg.attachment_id}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="mt-2 p-2 bg-background-dark/20 rounded-lg flex items-center gap-2 border border-white/5 hover:bg-brand-blue/20 hover:border-brand-blue/30 transition-colors cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[10px] text-brand-blue">link</span>
                                                <span className="text-[10px] font-bold uppercase truncate">Artigo Anexado</span>
                                            </a>
                                        )}
                                    </div>

                                    {isMine && (
                                        <button
                                            onClick={() => setReportingMessage({
                                                id: msg.id,
                                                content: msg.content,
                                                senderId: msg.sender_id,
                                                senderName: 'Você'
                                            })}
                                            title="Denunciar ou registrar infração nesta mensagem"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-gray-500 hover:text-brand-red hover:bg-brand-red/10 cursor-pointer order-first"
                                        >
                                            <Flag className="size-3.5" />
                                        </button>
                                    )}
                                </div>

                                <span className="text-[8px] text-gray-600 mt-1 uppercase font-bold tracking-widest flex items-center gap-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center opacity-50 space-y-2">
                        <span className="material-symbols-outlined text-3xl text-brand-blue">bubble_chart</span>
                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-300">
                            Inicie o emaranhamento de ideias
                        </p>
                        <p className="text-[9px] text-gray-500 max-w-xs">
                            No 1º contato, envie uma mensagem de apresentação. A conversa contínua será liberada após o aceite.
                        </p>
                    </div>
                )}
            </div>

            {/* Attachment Preview */}
            <AnimatePresence>
                {attachment && (
                    <m.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 10, opacity: 0 }}
                        className="px-4 py-2"
                    >
                        <div className="bg-brand-blue/10 border border-brand-blue/30 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-1">
                                <button onClick={() => setAttachment(null)} className="material-symbols-outlined text-xs text-brand-blue/50 hover:text-brand-blue transition-colors">close</button>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                    <span className="material-symbols-outlined text-xl">
                                        {attachment.type === 'article' ? 'hub' : 'grain'}
                                    </span>
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                    <span className="text-[11px] font-black text-white uppercase truncate">
                                        {attachment.title}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest truncate max-w-[120px]">Autor: {attachment.author}</span>
                                        <div className="flex items-center gap-1 bg-brand-blue/20 px-1.5 py-0.5 rounded-full">
                                            <div className="w-1 h-1 rounded-full bg-brand-blue animate-pulse"></div>
                                            <span className="text-[8px] font-black text-brand-blue uppercase">{attachment.energy} EXCITAÇÃO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Barra de Consentimento no 1º Contato (Incoming Request) */}
            {connectionStatus === 'pending_incoming' && (
                <div className="p-4 bg-brand-blue/10 border-t border-brand-blue/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                                <UserCheck className="size-4" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-white font-bukra">
                                    {peerName} enviou um convite de emaranhamento.
                                </p>
                                <p className="text-[10px] text-gray-400 font-open-sans">
                                    Aceite para liberar a troca contínua de mensagens.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={() => handleRespondConnection('reject')}
                                disabled={isRespondingConnection}
                                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold border border-white/10 transition-all font-bukra flex items-center justify-center gap-1.5 disabled:opacity-50"
                            >
                                <X className="size-3.5 text-gray-400" />
                                Recusar
                            </button>
                            <button
                                onClick={() => handleRespondConnection('accept')}
                                disabled={isRespondingConnection}
                                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold shadow-lg shadow-brand-blue/20 transition-all font-bukra flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                            >
                                {isRespondingConnection ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                    <Check className="size-3.5" />
                                )}
                                Aceitar Conexão
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Aviso de Espera (Outgoing Pending) */}
            {connectionStatus === 'pending_outgoing' && (
                <div className="p-4 bg-brand-yellow/10 border-t border-brand-yellow/20 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand-yellow/20 flex items-center justify-center text-brand-yellow shrink-0">
                            <Clock className="size-4" />
                        </div>
                        <div className="text-left flex-1">
                            <p className="text-xs font-bold text-brand-yellow font-bukra">
                                Solicitação de Emaranhamento Enviada
                            </p>
                            <p className="text-[10px] text-gray-300 font-open-sans">
                                Aguardando {peerName} aceitar o convite para liberar o envio de novas mensagens.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Aviso de Recusado */}
            {connectionStatus === 'rejected' && (
                <div className="p-4 bg-brand-red/10 border-t border-brand-red/20 backdrop-blur-md">
                    <div className="flex items-center gap-3 text-brand-red">
                        <Lock className="size-5 shrink-0" />
                        <p className="text-xs font-bold font-bukra">
                            Conexão não disponível. A solicitação de emaranhamento foi recusada.
                        </p>
                    </div>
                </div>
            )}

            {/* Input Area (Disponível quando connectionStatus === 'none' ou 'accepted') */}
            {(connectionStatus === 'none' || connectionStatus === 'accepted') && (
                <div className="p-4 bg-background-dark/20 border-t border-white/5">
                    {connectionStatus === 'none' && (
                        <div className="mb-2 px-3 py-1.5 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center gap-2 text-[10px] text-brand-blue font-open-sans">
                            <Sparkles className="size-3 shrink-0" />
                            <span><strong>Primeiro contato:</strong> você pode enviar 1 mensagem de apresentação para solicitar o emaranhamento.</span>
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => setIsSelectorOpen(!isSelectorOpen)}
                            className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                            title="[🔗 Anexar Partícula] - Referenciar conteúdo técnico"
                        >
                            <span className="material-symbols-outlined text-gray-400 text-[20px]">link</span>
                        </button>

                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            placeholder={
                                connectionStatus === 'none'
                                    ? `Mensagem de apresentação para ${peerName}...`
                                    : 'Mensagem emaranhada...'
                            }
                            className="flex-1 bg-white/5 border border-white/5 rounded-2xl p-3 text-xs outline-none focus:border-brand-blue/30 transition-all resize-none max-h-24 h-10 text-white placeholder:text-gray-500"
                        />

                        <button
                            onClick={handleSend}
                            disabled={(!message.trim() && !attachment) || isSending}
                            className="p-2 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl shadow-lg shadow-brand-blue/20 disabled:opacity-50 min-w-[40px] flex items-center justify-center transition-all active:scale-95"
                            title="Enviar Mensagem"
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <span className="material-symbols-outlined text-[20px]">send</span>
                            )}
                        </button>
                    </div>

                    <p className="mt-2 text-[9px] text-gray-500 uppercase font-black tracking-widest text-center font-open-sans">
                        (Pressione Enter para enviar • Use o ícone de elo para anexar artigo)
                    </p>
                </div>
            )}

            {/* Attachment Selector */}
            <AnimatePresence>
                {isSelectorOpen && (
                    <m.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-24 left-4 right-4 bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl z-50"
                    >
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 font-bukra">
                            Selecionar Recurso
                        </h4>
                        <div className="space-y-2">
                            <button
                                onClick={() => handleAttach('1')}
                                className="w-full text-left p-2 bg-white/5 rounded-lg text-[10px] font-bold hover:bg-white/10 text-gray-300"
                            >
                                🔬 Grande Colisor: Artigo Exemplo
                            </button>
                            <button
                                onClick={() => handleAttach('2')}
                                className="w-full text-left p-2 bg-white/5 rounded-lg text-[10px] font-bold hover:bg-white/10 text-gray-300"
                            >
                                🌌 Fluxo: Partícula Exemplo
                            </button>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Modal de Denúncia de Mensagem Individual */}
            <ReportChatMessageModal
                isOpen={Boolean(reportingMessage)}
                onClose={() => setReportingMessage(null)}
                messageData={reportingMessage}
            />
        </div>
    );
};
