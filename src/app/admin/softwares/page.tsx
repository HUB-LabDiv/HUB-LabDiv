'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState, useEffect } from 'react';
import { getPendingSoftwares, approveSoftware, rejectSoftware } from '@/app/actions/softwares';
import { AcademicSoftware } from '@/types/softwares';
import { toast } from 'react-hot-toast';
import { Laptop, CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminSoftwaresApprovalPage() {
    const [softwares, setSoftwares] = useState<AcademicSoftware[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

    const loadSoftwares = async () => {
        setIsLoading(true);
        const data = await getPendingSoftwares();
        setSoftwares(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadSoftwares();
    }, []);

    const handleApprove = async (id: string) => {
        if (!confirm('Deseja realmente aprovar este software para ser exibido publicamente?')) return;
        setIsActionLoading(id);
        const res = await approveSoftware(id);
        if (res.success) {
            toast.success('Software aprovado com sucesso!');
            setSoftwares(prev => prev.filter(s => s.id !== id));
        } else {
            toast.error(res.error || 'Erro ao aprovar software');
        }
        setIsActionLoading(null);
    };

    const handleReject = async (id: string) => {
        if (!confirm('Deseja realmente rejeitar esta submissão? O software não será exibido, mas ficará no histórico.')) return;
        setIsActionLoading(id);
        const res = await rejectSoftware(id);
        if (res.success) {
            toast.success('Software rejeitado!');
            setSoftwares(prev => prev.filter(s => s.id !== id));
        } else {
            toast.error(res.error || 'Erro ao rejeitar software');
        }
        setIsActionLoading(null);
    };

    return (
        <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                        <Laptop className="w-8 h-8 text-brand-yellow" />
                        Aprovação de Softwares
                    </h1>
                    <p className="text-gray-500 mt-2">Revise os softwares enviados pela comunidade antes de publicá-los no Hub.</p>
                </div>
                <button 
                    onClick={loadSoftwares}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Atualizar Lista
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white/5 border border-white/10 rounded-3xl h-64"></div>
                    ))}
                </div>
            ) : softwares.length === 0 ? (
                <div className="py-24 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-3xl">
                    <CheckCircle className="w-16 h-16 text-gray-600 mb-4" />
                    <h2 className="text-xl font-bold text-gray-300">Tudo em dia!</h2>
                    <p className="text-gray-500 mt-2 max-w-sm">
                        Nenhum software pendente de aprovação no momento.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {softwares.map(software => (
                        <div key={software.id} className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col">
                            {/* Images Gallery */}
                            {software.screenshots && software.screenshots.length > 0 && (
                                <div className="w-full h-48 bg-black/50 border-b border-white/10 flex overflow-x-auto snap-x snap-mandatory">
                                    {software.screenshots.map((img, i) => (
                                        <div key={i} className="w-full shrink-0 h-full relative snap-center">
                                            <Image 
                                                src={img} 
                                                alt={`Screenshot ${i}`} 
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{software.title}</h3>
                                        <p className="text-sm text-brand-yellow font-medium mt-1">Por {software.author_name}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {software.category}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-300 italic mb-4">"{software.tagline}"</p>
                                <p className="text-xs text-gray-400 mb-6 flex-1 line-clamp-3">{software.description}</p>

                                {/* Links */}
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {software.access_url && (
                                        <a href={software.access_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-brand-blue hover:underline bg-brand-blue/10 px-3 py-1.5 rounded-lg border border-brand-blue/20">
                                            <ExternalLink className="w-3 h-3" /> URL de Acesso
                                        </a>
                                    )}
                                    {software.repository_url && (
                                        <a href={software.repository_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[11px] text-purple-400 hover:underline bg-purple-400/10 px-3 py-1.5 rounded-lg border border-purple-400/20">
                                            <ExternalLink className="w-3 h-3" /> Repositório / Drive
                                        </a>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button 
                                        onClick={() => handleApprove(software.id)}
                                        disabled={isActionLoading !== null}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors border border-emerald-500/30 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        {isActionLoading === software.id ? 'Aprovando...' : 'Aprovar'}
                                    </button>
                                    <button 
                                        onClick={() => handleReject(software.id)}
                                        disabled={isActionLoading !== null}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-red/20 text-brand-red hover:bg-brand-red/30 transition-colors border border-brand-red/30 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        {isActionLoading === software.id ? 'Rejeitando...' : 'Rejeitar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
