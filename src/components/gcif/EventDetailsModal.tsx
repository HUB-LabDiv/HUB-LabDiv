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
    Calendar, 
    Clock, 
    MapPin, 
    User, 
    ExternalLink, 
    Video, 
    FileText, 
    CalendarPlus, 
    Share2 
} from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { EventItem } from '@/types/events';
import toast from 'react-hot-toast';

interface EventDetailsModalProps {
    event: EventItem | null;
    isOpen: boolean;
    onClose: () => void;
}

function generateGoogleCalendarUrl(event: EventItem): string {
    const title = encodeURIComponent(event.titulo);
    const details = encodeURIComponent(
        `${event.resumo}\n\nPalestrante: ${event.palestrante?.nome || 'N/A'}\nLocal: ${event.local.nome}\nLink Oficial: ${event.links.oficial}`
    );
    const location = encodeURIComponent(`${event.local.nome}, Instituto de Física da USP, São Paulo`);

    // Parse date (DD/MM/YYYY or YYYY-MM-DD)
    let year = 2026, month = 10, day = 29;
    const parts = event.data.split(/[\/\-]/);
    if (parts.length === 3) {
        if (parts[0].length === 4) {
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            day = parseInt(parts[2], 10);
        } else {
            day = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10);
            year = parseInt(parts[2], 10);
        }
    }

    let startHour = 16, startMin = 0;
    if (event.horario && event.horario.includes(':')) {
        const hp = event.horario.split(':');
        startHour = parseInt(hp[0], 10);
        startMin = parseInt(hp[1], 10);
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    // Format YYYYMMDDTHHMMSS
    const startIso = `${year}${pad(month)}${pad(day)}T${pad(startHour)}${pad(startMin)}00`;
    const endIso = `${year}${pad(month)}${pad(day)}T${pad(startHour + 2)}${pad(startMin)}00`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
    if (!isOpen || !event) return null;

    const handleShare = () => {
        if (typeof window !== 'undefined' && navigator.clipboard) {
            navigator.clipboard.writeText(window.location.origin + `/gcif/instituto#evento-${event.id}`);
            toast.success('Link do evento copiado para a área de transferência!');
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
                                    {event.tipo.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold">
                                    <Calendar className="w-3.5 h-3.5 text-brand-blue" />
                                    {event.data}
                                    {event.horario && ` às ${event.horario}`}
                                </span>
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
                        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra leading-tight mb-4">
                            {event.titulo}
                        </h2>

                        {/* Scrollable Content Body */}
                        <div className="overflow-y-auto space-y-5 pr-1 my-2">
                            {/* Speaker Card */}
                            {event.palestrante && (
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-start gap-3">
                                    <div className="size-11 rounded-xl bg-brand-blue/15 text-brand-blue flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-brand-blue font-bukra mb-0.5">
                                            Palestrante Convidado
                                        </div>
                                        <h4 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                            {event.palestrante.nome}
                                        </h4>
                                        {event.palestrante.afiliacao && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 font-open-sans mt-0.5">
                                                {event.palestrante.afiliacao}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Location & Format */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-brand-red shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Local</div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                            {event.local.nome}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/5 flex items-center gap-3">
                                    <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                                    <div className="min-w-0">
                                        <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider">Horário</div>
                                        <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                                            {event.horario ? `${event.horario} (Brasília)` : 'A confirmar'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumo / Abstract */}
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2 font-bukra">
                                    Resumo da Palestra
                                </h4>
                                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-200 dark:border-white/5 text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-open-sans leading-relaxed whitespace-pre-line">
                                    {event.resumo}
                                </div>
                            </div>

                            {/* Tags */}
                            {event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {event.tags.map((tag, idx) => (
                                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer Action CTAs */}
                        <div className="pt-4 mt-auto border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                            {/* Google Calendar */}
                            <a 
                                href={generateGoogleCalendarUrl(event)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#FFCC00] hover:bg-[#ffe066] text-[#0F4780] font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02]"
                            >
                                <CalendarPlus className="w-4 h-4" />
                                Adicionar à Agenda
                            </a>

                            {/* YouTube live/recording */}
                            {event.links.transmissao && (
                                <a 
                                    href={event.links.transmissao} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-4 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all"
                                >
                                    <Video className="w-4 h-4" />
                                    Transmissão YouTube
                                </a>
                            )}

                            {/* Official Portal */}
                            <a 
                                href={event.links.oficial} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto sm:ml-auto px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-colors"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                                Página no Portal
                            </a>
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </ModalPortal>
    );
}
