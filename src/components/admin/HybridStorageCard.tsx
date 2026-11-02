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

import React, { useState, useEffect, useCallback } from 'react';
import { getHybridStorageOverview, syncLegacyBatchToFirestick } from '@/app/actions/storage-sync';
import { HybridStorageOverview } from '@/types/storage';
import toast from 'react-hot-toast';

export function HybridStorageCard() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [overview, setOverview] = useState<HybridStorageOverview | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getHybridStorageOverview();
            setOverview(data);
        } catch {
            toast.error('Erro ao consultar status do storage híbrido.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSyncBatch = async () => {
        if (!overview?.firestickHealth.online) {
            toast.error('O Fire Stick está offline. Verifique a conexão do servidor antes de sincronizar.');
            return;
        }

        setIsSyncing(true);
        const toastId = toast.loading('Espelhando lote de 10 mídias no HD do Fire Stick...');
        try {
            const result = await syncLegacyBatchToFirestick(10);
            if (result.success) {
                if (result.syncedCount > 0) {
                    toast.success(result.message, { id: toastId });
                } else {
                    toast(result.message, { id: toastId, icon: 'ℹ️' });
                }
                loadData();
            } else {
                toast.error(result.message, { id: toastId });
            }
        } catch (e: any) {
            toast.error(e?.message || 'Falha ao sincronizar lote.', { id: toastId });
        } finally {
            setIsSyncing(false);
        }
    };

    const isOnline = overview?.firestickHealth.online;

    return (
        <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg dark:shadow-2xl transition-colors">
            {/* Glows LabDiv */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F4780]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFCC00]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Cabeçalho */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-2xl bg-[#0F4780]/20 border border-[#0F4780]/30 flex items-center justify-center text-[#0F4780] dark:text-[#FFCC00] shrink-0">
                        <span className="material-symbols-outlined text-2xl">hard_drive_2</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                Storage Híbrido (Fire Stick + Cloudinary)
                            </h3>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bukra font-bold uppercase tracking-wider ${
                                isOnline 
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-[#F14343]/10 text-[#F14343] border border-[#F14343]/20'
                            }`}>
                                <span className={`size-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-[#F14343]'}`} />
                                {isLoading ? 'Verificando...' : isOnline ? 'Online (Ativo)' : 'Offline'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-sans mt-0.5">
                            Espelhamento físico no HD do Fire TV Stick com CDN primário do Cloudinary e failover automático
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={loadData}
                        disabled={isLoading || isSyncing}
                        aria-label="Atualizar status"
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl transition-all disabled:opacity-50"
                    >
                        <span className={`material-symbols-outlined text-lg ${isLoading ? 'animate-spin' : ''}`}>
                            refresh
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handleSyncBatch}
                        disabled={isLoading || isSyncing || !isOnline}
                        className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#0F4780] hover:bg-[#0F4780]/90 text-white font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        <span className={`material-symbols-outlined text-[16px] ${isSyncing ? 'animate-spin' : ''}`}>
                            {isSyncing ? 'progress_activity' : 'cloud_sync'}
                        </span>
                        <span>{isSyncing ? 'Espelhando...' : 'Espelhar Lote (10)'}</span>
                    </button>
                    <a
                        href="/storage"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-gradient-to-r from-amber-500/15 to-purple-600/15 hover:from-amber-500/25 hover:to-purple-600/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-xl font-bukra font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-sm"
                        title="Abrir Portal Web do Fire Stick em nova aba"
                    >
                        <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                        <span>Abrir Portal</span>
                    </a>
                </div>
            </div>

            {/* Painel de Métricas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 relative z-10">
                <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bukra">
                        Mídias Rastreadas
                    </span>
                    {isLoading ? (
                        <div className="h-8 w-16 bg-gray-200 dark:bg-white/10 animate-pulse rounded mt-1" />
                    ) : (
                        <span className="text-2xl font-bukra font-black text-gray-900 dark:text-white mt-1">
                            {overview?.totalTracked ?? 0}
                        </span>
                    )}
                </div>

                <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bukra">
                        Espelhadas no HD
                    </span>
                    {isLoading ? (
                        <div className="h-8 w-16 bg-emerald-500/20 animate-pulse rounded mt-1" />
                    ) : (
                        <span className="text-2xl font-bukra font-black text-emerald-600 dark:text-emerald-400 mt-1">
                            {overview?.syncedCount ?? 0}
                        </span>
                    )}
                </div>

                <div className="p-4 bg-[#FFCC00]/10 border border-[#FFCC00]/30 rounded-2xl flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-yellow-700 dark:text-[#FFCC00] font-bukra">
                        Sincronização Pendente
                    </span>
                    {isLoading ? (
                        <div className="h-8 w-16 bg-[#FFCC00]/20 animate-pulse rounded mt-1" />
                    ) : (
                        <span className="text-2xl font-bukra font-black text-yellow-700 dark:text-[#FFCC00] mt-1">
                            {overview?.pendingCount ?? 0}
                        </span>
                    )}
                </div>

                <div className="p-4 bg-[#0F4780]/10 border border-[#0F4780]/30 rounded-2xl flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F4780] dark:text-blue-300 font-bukra">
                        Dispositivo Host
                    </span>
                    {isLoading ? (
                        <div className="h-8 w-24 bg-[#0F4780]/20 animate-pulse rounded mt-1" />
                    ) : (
                        <span className="text-sm font-bukra font-bold text-[#0F4780] dark:text-white mt-2 truncate">
                            {overview?.firestickHealth.device || 'FireTV-Termux'}
                        </span>
                    )}
                </div>
            </div>

            {/* Aviso de Failover */}
            <div className="text-[11px] font-sans text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-white/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span>
                    Endpoint Ativo: <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 font-mono text-[10px]">https://storage.hublabdiv.com.br</code>
                </span>
                <span className="text-gray-400 dark:text-gray-500 text-[10px]">
                    Timeout de proteção: 8 segundos por arquivo
                </span>
            </div>
        </div>
    );
}

