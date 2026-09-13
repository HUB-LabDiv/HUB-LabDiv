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

import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Flag, X, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { reportChatMessage } from '@/app/actions/reports';
import { toast } from 'react-hot-toast';

interface ReportChatMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    messageData: {
        id: string;
        content: string;
        senderId: string;
        senderName?: string;
    } | null;
}

const REPORT_CATEGORIES = [
    { id: 'assedio', label: 'Assédio / Ofensa', desc: 'Ameaças, perseguição ou linguagem ofensiva direcionada.' },
    { id: 'discurso_odio', label: 'Discurso de Ódio', desc: 'Ataques a grupos, preconceito ou discriminação.' },
    { id: 'desinformacao', label: 'Desinformação Científica', desc: 'Alegações deliberadamente falsas ou fraudulentas.' },
    { id: 'spam', label: 'Spam / Divulgação Indevida', desc: 'Links suspeitos, propaganda não solicitada ou repetição excessiva.' },
    { id: 'outro', label: 'Outro Motivo', desc: 'Violação geral das diretrizes da comunidade acadêmica.' },
] as const;

export function ReportChatMessageModal({ isOpen, onClose, messageData }: ReportChatMessageModalProps) {
    const [category, setCategory] = useState<'assedio' | 'discurso_odio' | 'desinformacao' | 'spam' | 'outro'>('assedio');
    const [justification, setJustification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !messageData) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await reportChatMessage({
                messageId: messageData.id,
                messageContent: messageData.content,
                senderId: messageData.senderId,
                senderName: messageData.senderName,
                category,
                justification: justification.trim() || undefined,
            });

            if (res.success) {
                toast.success('Denúncia registrada e enviada à moderação.');
                onClose();
                setJustification('');
            } else {
                toast.error(res.error || 'Falha ao enviar denúncia.');
            }
        } catch {
            toast.error('Erro de conexão ao enviar denúncia.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <m.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="w-full max-w-lg bg-[#181818] border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-2xl relative overflow-hidden"
                >
                    {/* Glow de fundo */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-brand-red/15 border border-brand-red/30 flex items-center justify-center text-brand-red shadow-lg shadow-brand-red/10">
                                <Flag className="size-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-black uppercase text-white tracking-wider font-bukra">
                                    Denunciar Mensagem
                                </h3>
                                <p className="text-[10px] text-gray-400 font-open-sans uppercase tracking-wider">
                                    Moderação e Segurança do Emaranhamento
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Preview da Mensagem Citada */}
                    <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 relative z-10">
                        <div className="flex items-center justify-between text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                            <span>Mensagem de: <strong className="text-brand-blue">{messageData.senderName || 'Usuário'}</strong></span>
                            <span className="text-[8px] text-gray-500">Prova Forense</span>
                        </div>
                        <p className="text-xs text-gray-200 italic line-clamp-3 bg-black/30 p-2.5 rounded-xl border border-white/5 font-mono">
                            "{messageData.content}"
                        </p>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="mt-5 space-y-5 relative z-10">
                        {/* Seletor de Categoria */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 font-bukra">
                                Categoria da Infração
                            </label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                                {REPORT_CATEGORIES.map((cat) => {
                                    const isSelected = category === cat.id;
                                    return (
                                        <button
                                            type="button"
                                            key={cat.id}
                                            onClick={() => setCategory(cat.id as any)}
                                            className={`p-3 rounded-xl text-left border transition-all flex flex-col gap-0.5 ${
                                                isSelected
                                                    ? 'bg-brand-red/15 border-brand-red/60 text-white'
                                                    : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-xs font-bold text-white flex items-center justify-between">
                                                {cat.label}
                                                {isSelected && <CheckCircle2 className="size-4 text-brand-red" />}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-open-sans">
                                                {cat.desc}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Justificativa Opcional */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-300 font-bukra flex items-center justify-between">
                                <span>Detalhes adicionais (opcional)</span>
                                <span className="text-[9px] text-gray-500 font-normal">Máx 500 caracteres</span>
                            </label>
                            <textarea
                                value={justification}
                                onChange={(e) => setJustification(e.target.value)}
                                maxLength={500}
                                placeholder="Descreva brevemente o contexto que os moderadores devem analisar..."
                                rows={3}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-red/50 transition-colors resize-none font-open-sans"
                            />
                        </div>

                        {/* Botões de Ação */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-bukra"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bukra text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-red/20 disabled:opacity-50 transition-all active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <ShieldAlert className="size-4" />
                                        Confirmar Denúncia
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </m.div>
            </div>
        </AnimatePresence>
    );
}
