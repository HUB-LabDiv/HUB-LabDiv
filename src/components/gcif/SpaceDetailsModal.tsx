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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    MapPin, 
    Clock, 
    Users, 
    Calendar, 
    ExternalLink, 
    Mail, 
    Phone, 
    Building2, 
    CheckCircle2, 
    ShieldCheck, 
    Share2 
} from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { SpaceItem } from '@/types/spaces';
import toast from 'react-hot-toast';

interface SpaceDetailsModalProps {
    space: SpaceItem | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SpaceDetailsModal({ space, isOpen, onClose }: SpaceDetailsModalProps) {
    if (!isOpen || !space) return null;

    const handleShare = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin + `/gcif/instituto#espaco-${space.id}`);
            toast.success('Link do espaço copiado para a área de transferência!');
        }
    };

    return (
        <ModalPortal>
            <AnimatePresence>
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
                    />

                    {/* Modal Window */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', duration: 0.35 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl p-6 sm:p-8 z-10 overflow-hidden my-8 max-h-[90vh] flex flex-col"
                    >
                        {/* Header bar */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1 rounded-full bg-brand-yellow/15 border border-brand-yellow/30 text-amber-700 dark:text-brand-yellow text-xs font-black uppercase tracking-wider font-bukra">
                                    {space.categoria.replace('-', ' ').toUpperCase()}
                                </span>
                                {space.sigla && (
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold">
                                        {space.sigla}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button 
                                    onClick={handleShare}
                                    title="Compartilhar"
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={onClose}
                                    className="p-2 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra leading-tight mb-3">
                            {space.nome}
                        </h2>

                        {/* Scrollable Content Body */}
                        <div className="overflow-y-auto space-y-5 pr-1 my-2">
                            {/* Location & Time Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Localização</div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                                            {space.predio}
                                        </p>
                                        {(space.andar || space.sala) && (
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                                {space.andar}{space.sala ? ` • ${space.sala}` : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Funcionamento</div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">
                                            {space.horario}
                                        </p>
                                        {space.capacidade && (
                                            <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                                                <Users className="w-3 h-3 text-brand-blue" />
                                                Capacidade: {space.capacidade}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bukra">
                                    Sobre o Espaço
                                </h4>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed">
                                    {space.descricao}
                                </div>
                            </div>

                            {/* Como Acessar */}
                            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bukra mb-1">
                                        Como Acessar / Normas de Uso
                                    </h4>
                                    <p className="text-xs text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed">
                                        {space.comoAcessar}
                                    </p>
                                </div>
                            </div>

                            {/* Recursos Disponíveis */}
                            {space.recursos.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bukra">
                                        Recursos & Infraestrutura
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {space.recursos.map((rec, idx) => (
                                            <span key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-bold">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-brand-blue" />
                                                {rec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contatos */}
                            {space.contato && (space.contato.email || space.contato.telefone || space.contato.ramal) && (
                                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-gray-600 dark:text-gray-400 font-open-sans">
                                    {space.contato.email && (
                                        <a href={`mailto:${space.contato.email}`} className="flex items-center gap-1.5 hover:text-brand-blue transition-colors">
                                            <Mail className="w-3.5 h-3.5 text-brand-blue" />
                                            {space.contato.email}
                                        </a>
                                    )}
                                    {space.contato.telefone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-brand-yellow" />
                                            {space.contato.telefone}
                                        </span>
                                    )}
                                    {space.contato.ramal && (
                                        <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-[10px] font-mono">
                                            Ramal: {space.contato.ramal}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Action CTAs */}
                        <div className="pt-4 mt-auto border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                            {/* Agendamento */}
                            {space.links.agendamento && (
                                <a 
                                    href={space.links.agendamento} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FFCC00] hover:bg-[#ffe066] text-[#0F4780] font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Agendar Espaço
                                </a>
                            )}

                            {/* Official Portal */}
                            {space.links.oficial && (
                                <a 
                                    href={space.links.oficial} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto sm:ml-auto px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Página Oficial
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </ModalPortal>
    );
}
