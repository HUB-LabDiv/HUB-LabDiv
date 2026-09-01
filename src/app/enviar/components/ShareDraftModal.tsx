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
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ExternalLink, Share2, Eye, Sparkles, X, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ShareDraftModalProps {
    isOpen: boolean;
    onClose: () => void;
    draftId: string | null;
    title: string;
    onSaveAndGenerate?: () => Promise<string | null>;
}

export function ShareDraftModal({
    isOpen,
    onClose,
    draftId,
    title,
    onSaveAndGenerate
}: ShareDraftModalProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentDraftId, setCurrentDraftId] = useState<string | null>(draftId);
    const [copied, setCopied] = useState(false);

    React.useEffect(() => {
        if (draftId) {
            setCurrentDraftId(draftId);
        }
    }, [draftId]);

    if (!isOpen) return null;

    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://hublabdiv.usp.br';
    const previewUrl = currentDraftId ? `${origin}/preview/${currentDraftId}` : '';

    const handleGenerate = async () => {
        if (!onSaveAndGenerate) return;
        setIsGenerating(true);
        try {
            const newId = await onSaveAndGenerate();
            if (newId) {
                setCurrentDraftId(newId);
                toast.success('Link de prévia gerado com sucesso!');
            }
        } catch (err) {
            console.error('Erro ao gerar prévia:', err);
            toast.error('Erro ao salvar rascunho para prévia.');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        if (!previewUrl) return;
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(previewUrl);
            setCopied(true);
            toast.success('Link de pré-visualização copiado!');
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsAppShare = () => {
        if (!previewUrl) return;
        const text = `Confira a prévia do rascunho de divulgação científica "${title || 'Sem título'}" no HUB LabDiv:\n\n${previewUrl}`;
        const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-lg bg-[#181818] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6"
                >
                    {/* Glow de fundo */}
                    <div className="absolute -top-24 -right-24 w-56 h-56 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="size-12 rounded-2xl bg-brand-yellow/15 border border-brand-yellow/30 flex items-center justify-center text-brand-yellow shadow-lg shadow-brand-yellow/10">
                                <Eye className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bukra font-bold text-white tracking-tight flex items-center gap-2">
                                    Site de Prévia do Rascunho
                                </h3>
                                <p className="text-xs text-gray-400 font-sans mt-0.5">
                                    Envie para orientadores, colegas e revisores antes de publicar
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Conteúdo Principal */}
                    <div className="space-y-4 relative z-10">
                        {/* Caixa de Explicação */}
                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-3 text-xs text-gray-300 leading-relaxed">
                            <Sparkles className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                            <span>
                                O destinatário terá acesso a uma <strong>página exclusiva e completa</strong> com todos os blocos, fórmulas e mídias, exatamente como o post aparecerá após publicado, sem que ele apareça no feed público.
                            </span>
                        </div>

                        {previewUrl ? (
                            <div className="space-y-3">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400 pl-1 block">
                                    Link Único de Compartilhamento:
                                </label>
                                <div className="flex items-center gap-2 bg-[#121212] border border-white/10 rounded-2xl p-2 pl-4 focus-within:border-brand-yellow/50 transition-colors">
                                    <input
                                        type="text"
                                        readOnly
                                        value={previewUrl}
                                        className="w-full bg-transparent text-xs text-brand-yellow font-mono outline-none select-all truncate"
                                    />
                                    <button
                                        onClick={handleCopy}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 ${
                                            copied
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-brand-yellow text-gray-950 hover:bg-[#E5B800] shadow-md'
                                        }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Copiado!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>Copiar</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6 bg-brand-yellow/10 border border-brand-yellow/20 rounded-2xl text-center space-y-4">
                                <p className="text-xs text-gray-300">
                                    Clique abaixo para salvar o estado atual do seu rascunho na nuvem e gerar o link de compartilhamento.
                                </p>
                                <button
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="px-6 py-3 bg-brand-yellow hover:bg-[#E5B800] text-gray-950 font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="size-4 border-2 border-gray-950 border-t-transparent rounded-full animate-spin" />
                                            <span>Gerando Prévia...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Share2 className="w-4 h-4" />
                                            <span>Gerar Link de Prévia</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Ações Inferiores */}
                    {previewUrl && (
                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-white/5 relative z-10">
                            <a
                                href={previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-1/2 px-4 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/10 flex items-center justify-center gap-2 text-center"
                            >
                                <ExternalLink className="w-4 h-4 text-brand-blue" />
                                <span>Visualizar Agora</span>
                            </a>

                            <button
                                onClick={handleWhatsAppShare}
                                className="w-full sm:w-1/2 px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-bold rounded-xl transition-all border border-[#25D366]/40 flex items-center justify-center gap-2"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span>Enviar no WhatsApp</span>
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
