'use client';

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


import React, { useEffect, useState } from 'react';
import { getAdminTips, updateTipStatus } from '@/app/actions/veterans';
import { toast } from 'react-hot-toast';
import { Loader2, MessageSquare, Check, X, Edit3, Trash2 } from 'lucide-react';

export default function AdminDicasPage() {
    const [tips, setTips] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('pending'); // pending, approved, rejected
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        loadTips();
    }, [statusFilter]);

    const loadTips = async () => {
        setIsLoading(true);
        const res = await getAdminTips(statusFilter);
        if (res.success) {
            setTips(res.data || []);
        } else {
            toast.error('Erro ao carregar dicas');
        }
        setIsLoading(false);
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        setIsUpdating(true);
        const res = await updateTipStatus(id, status);
        if (res.success) {
            toast.success(`Status atualizado para ${status}`);
            loadTips(); // Reload to remove from current filter view
        } else {
            toast.error('Erro ao atualizar status');
        }
        setIsUpdating(false);
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black italic uppercase text-gray-900 dark:text-white flex items-center gap-3">
                    <MessageSquare className="w-8 h-8 text-brand-blue" />
                    Moderação IFUSP 101
                </h1>
                <p className="text-gray-500 mt-2">Aprove, rejeite e gerencie as dicas enviadas pelos veteranos.</p>
            </div>

            {/* Abas de Filtro */}
            <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-8">
                {['pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`pb-4 px-2 font-bold uppercase tracking-widest text-sm transition-colors border-b-2 ${
                            statusFilter === status 
                            ? 'border-brand-blue text-brand-blue' 
                            : 'border-transparent text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        {status === 'pending' ? 'Pendentes' : status === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
                    </button>
                ))}
            </div>

            {/* Conteúdo */}
            {isLoading ? (
                <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                </div>
            ) : tips.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-card-dark rounded-3xl border border-gray-100 dark:border-white/5 text-gray-500 font-medium">
                    Nenhuma dica encontrada nesta categoria.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {tips.map(tip => (
                        <div key={tip.id} className="bg-white dark:bg-card-dark p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-3 py-1 bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase rounded-full tracking-widest">
                                        {tip.categoria}
                                    </span>
                                    <span className="text-xs font-bold text-gray-500">Autor: {tip.autor_nome}</span>
                                    <span className="text-xs text-gray-400">{new Date(tip.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{tip.titulo}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">{tip.conteudo}</p>
                                {statusFilter === 'approved' && (
                                    <div className="mt-4 text-xs font-bold text-brand-blue">
                                        Upvotes: {tip.upvotes}
                                    </div>
                                )}
                            </div>

                            <div className="flex md:flex-col gap-2 shrink-0 md:w-48">
                                {statusFilter !== 'approved' && (
                                    <button
                                        onClick={() => handleUpdateStatus(tip.id, 'approved')}
                                        disabled={isUpdating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                                    >
                                        <Check className="w-4 h-4" /> Aprovar
                                    </button>
                                )}
                                {statusFilter !== 'rejected' && (
                                    <button
                                        onClick={() => handleUpdateStatus(tip.id, 'rejected')}
                                        disabled={isUpdating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                                    >
                                        <X className="w-4 h-4" /> Rejeitar
                                    </button>
                                )}
                                {statusFilter === 'rejected' && (
                                    <button
                                        onClick={() => handleUpdateStatus(tip.id, 'pending')}
                                        disabled={isUpdating}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-black rounded-xl font-bold text-xs uppercase tracking-widest transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" /> Revisar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
