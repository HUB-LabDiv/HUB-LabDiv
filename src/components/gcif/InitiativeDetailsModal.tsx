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
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, 
    ExternalLink, 
    Mail, 
    Globe, 
    Instagram, 
    Youtube, 
    MapPin, 
    Users, 
    Award, 
    GraduationCap, 
    ArrowRight 
} from 'lucide-react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { Initiative } from '@/types/initiatives';

interface InitiativeDetailsModalProps {
    initiative: Initiative | null;
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    divulgacao: { label: 'Divulgação Científica', color: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' },
    escolar: { label: 'Extensão Escolar', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    maker: { label: 'Cultura Maker & Hardware', color: 'bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30' },
    inclusao: { label: 'Ações Afirmativas & Inclusão', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    academica: { label: 'Extensão Acadêmica', color: 'bg-brand-red/20 text-brand-red border-brand-red/30' }
};

export function InitiativeDetailsModal({ initiative, isOpen, onClose }: InitiativeDetailsModalProps) {
    if (!isOpen || !initiative) return null;

    const catInfo = CATEGORY_LABELS[initiative.categoria] || CATEGORY_LABELS.divulgacao;

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        {/* Close button */}
                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Badges Header */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${catInfo.color}`}>
                                {catInfo.label}
                            </span>
                            {initiative.sigla && (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/5 text-gray-300 border border-white/10">
                                    {initiative.sigla}
                                </span>
                            )}
                            {initiative.modalidadeBolsa && initiative.modalidadeBolsa.map((bolsa, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20">
                                    Bolsa {bolsa}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl sm:text-3xl font-black text-white font-bukra tracking-tight mb-4">
                            {initiative.nome}
                        </h3>

                        {/* Summary */}
                        <p className="text-sm sm:text-base text-gray-300 font-open-sans leading-relaxed mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                            {initiative.descricao || initiative.resumo}
                        </p>

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {initiative.coordenacao && (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                                    <GraduationCap className="w-5 h-5 text-brand-yellow shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Coordenação</div>
                                        <div className="text-xs font-bold text-white mt-0.5">{initiative.coordenacao}</div>
                                    </div>
                                </div>
                            )}

                            {initiative.publicoAlvo && (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                                    <Users className="w-5 h-5 text-brand-blue shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Público-Alvo</div>
                                        <div className="text-xs font-bold text-white mt-0.5">{initiative.publicoAlvo}</div>
                                    </div>
                                </div>
                            )}

                            {initiative.contatos.localizacao && (
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3 sm:col-span-2">
                                    <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Localização no IFUSP</div>
                                        <div className="text-xs font-bold text-white mt-0.5">{initiative.contatos.localizacao}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Como Participar */}
                        {initiative.comoParticipar && (
                            <div className="mb-6 p-4 rounded-2xl bg-brand-yellow/5 border border-brand-yellow/20">
                                <div className="text-[10px] font-black uppercase tracking-wider text-brand-yellow flex items-center gap-1.5 mb-1">
                                    <Award className="w-4 h-4" /> Como Participar
                                </div>
                                <p className="text-xs text-gray-300 font-open-sans leading-relaxed">
                                    {initiative.comoParticipar}
                                </p>
                            </div>
                        )}

                        {/* Contacts & Socials */}
                        <div className="flex flex-wrap items-center gap-2 mb-8">
                            {initiative.contatos.email && (
                                <a 
                                    href={`mailto:${initiative.contatos.email}`}
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-2 transition-colors"
                                >
                                    <Mail className="w-3.5 h-3.5 text-brand-blue" /> {initiative.contatos.email}
                                </a>
                            )}
                            {initiative.contatos.website && (
                                <a 
                                    href={initiative.contatos.website} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-2 transition-colors"
                                >
                                    <Globe className="w-3.5 h-3.5 text-emerald-400" /> Website
                                </a>
                            )}
                            {initiative.contatos.instagram && (
                                <a 
                                    href={initiative.contatos.instagram} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-2 transition-colors"
                                >
                                    <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram
                                </a>
                            )}
                            {initiative.contatos.youtube && (
                                <a 
                                    href={initiative.contatos.youtube} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-2 transition-colors"
                                >
                                    <Youtube className="w-3.5 h-3.5 text-brand-red" /> YouTube
                                </a>
                            )}
                        </div>

                        {/* CTA Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                            {initiative.links.interno ? (
                                <Link
                                    href={initiative.links.interno}
                                    onClick={onClose}
                                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#FFCC00] hover:bg-[#ffe066] text-[#0F4780] font-black uppercase tracking-widest text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                                >
                                    Acessar no HUB <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : initiative.links.oficial ? (
                                <a
                                    href={initiative.links.oficial}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 py-3.5 px-6 rounded-2xl bg-[#0F4780] hover:bg-[#1359a0] text-white font-black uppercase tracking-widest text-xs text-center flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02]"
                                >
                                    Portal Oficial CCEx <ExternalLink className="w-4 h-4" />
                                </a>
                            ) : null}

                            {initiative.links.formulario && (
                                <a
                                    href={initiative.links.formulario}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="py-3.5 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black uppercase tracking-widest text-xs text-center flex items-center justify-center gap-2 border border-white/10 transition-colors"
                                >
                                    Agendar / Inscrever-se <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            </AnimatePresence>
        </ModalPortal>
    );
}
