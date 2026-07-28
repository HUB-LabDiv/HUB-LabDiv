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

import React, { useState, useEffect } from 'react';
import { X, HardDrive, Trash2, ShieldAlert, WifiOff, RefreshCw, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CacheItemDetails {
    name: string;
    description: string;
    sizeFormatted: string;
    entriesCount: number;
}

interface CacheManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CacheManagerModal({ isOpen, onClose }: CacheManagerModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [cachesList, setCachesList] = useState<CacheItemDetails[]>([]);
    const [totalSizeFormatted, setTotalSizeFormatted] = useState('0 KB');
    const [isSwEnabled, setIsSwEnabled] = useState(true);
    const [isClearing, setIsClearing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // Verifica estado atual do Service Worker / Modo de Cache
        const currentMode = localStorage.getItem('hub_cache_mode') || 'full';
        setIsSwEnabled(currentMode === 'full');

        loadCacheDetails();
    }, [isOpen]);

    const loadCacheDetails = async () => {
        setIsLoading(true);
        try {
            if (typeof window === 'undefined' || !('caches' in window)) {
                setIsLoading(false);
                return;
            }

            const cacheKeys = await caches.keys();
            let totalBytes = 0;
            const items: CacheItemDetails[] = [];

            for (const key of cacheKeys) {
                const cache = await caches.open(key);
                const requests = await cache.keys();
                let cacheBytes = 0;

                // Estima tamanho lendo headers / blobs
                for (const req of requests) {
                    try {
                        const res = await cache.match(req);
                        if (res) {
                            const blob = await res.clone().blob();
                            cacheBytes += blob.size;
                        }
                    } catch (_) {}
                }

                totalBytes += cacheBytes;

                let desc = 'Respostas de rotas e dados em cache.';
                if (key.includes('static') || key.includes('pages')) {
                    desc = 'Páginas HTML, estilos CSS e scripts JS baixados.';
                } else if (key.includes('media') || key.includes('images')) {
                    desc = 'Imagens, logos e arquivos de mídia.';
                } else if (key.includes('api') || key.includes('data')) {
                    desc = 'Dados da grade horária, trilhas e perfil.';
                }

                items.push({
                    name: key,
                    description: desc,
                    sizeFormatted: formatBytes(cacheBytes),
                    entriesCount: requests.length,
                });
            }

            setCachesList(items);
            setTotalSizeFormatted(formatBytes(totalBytes));
        } catch (e) {
            console.error('Erro ao listar caches:', e);
        } finally {
            setIsLoading(false);
        }
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleClearSingleCache = async (cacheName: string) => {
        try {
            await caches.delete(cacheName);
            toast.success(`Cache "${cacheName}" limpo com sucesso!`);
            await loadCacheDetails();
        } catch (e) {
            toast.error('Erro ao limpar cache.');
        }
    };

    const handleClearAllCaches = async () => {
        setIsClearing(true);
        try {
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
            toast.success('Todo o cache do HUB foi limpo!');
            await loadCacheDetails();
        } catch (e) {
            toast.error('Erro ao limpar caches.');
        } finally {
            setIsClearing(false);
        }
    };

    const handleToggleServiceWorker = async (enabled: boolean) => {
        setIsSwEnabled(enabled);
        if (!enabled) {
            localStorage.setItem('hub_cache_mode', 'off');
            // Desregistra os Service Workers ativos
            if ('serviceWorker' in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (const reg of registrations) {
                    await reg.unregister();
                }
            }
            // Purga caches ativos
            const keys = await caches.keys();
            await Promise.all(keys.map(k => caches.delete(k)));
            await loadCacheDetails();
            toast.success('Service Worker desativado. Economia de dados ativada!');
        } else {
            localStorage.setItem('hub_cache_mode', 'full');
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js');
            }
            toast.success('Service Worker ativado para navegação offline!');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#121212]">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#00A3FF]/10 border border-[#00A3FF]/20 rounded-2xl text-[#00A3FF]">
                            <HardDrive className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
                                Gerenciador de <span className="text-[#00A3FF]">Arquivos & Cache</span>
                            </h2>
                            <p className="text-xs text-gray-400 font-medium">
                                Monitore o espaço utilizado offline e ajuste a economia de dados.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Storage Overview Banner */}
                <div className="p-5 border-b border-white/5 bg-[#181818] flex items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Tamanho Total em Cache</span>
                        <div className="text-2xl font-display font-black text-white mt-0.5">{totalSizeFormatted}</div>
                    </div>
                    <button
                        onClick={handleClearAllCaches}
                        disabled={isClearing || isLoading}
                        className="px-4 py-2.5 bg-brand-red/10 border border-brand-red/20 text-brand-red rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isClearing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Limpar Tudo</span>
                    </button>
                </div>

                {/* Service Worker Data Saver Toggle */}
                <div className="p-5 border-b border-white/10 bg-[#121212] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <WifiOff className="w-5 h-5 text-brand-yellow shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Economia de Dados / Service Worker</h4>
                            <p className="text-[11px] text-gray-400">
                                Desative para evitar downloads em segundo plano e economizar dados móveis.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleToggleServiceWorker(!isSwEnabled)}
                        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                            isSwEnabled ? 'bg-[#00A3FF] justify-end' : 'bg-white/20 justify-start'
                        }`}
                    >
                        <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                    </button>
                </div>

                {/* Body Content - Caches List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-3">
                    {isLoading ? (
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="p-4 bg-white/5 rounded-2xl animate-pulse h-16"></div>
                            ))}
                        </div>
                    ) : cachesList.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-xs font-bold">
                            Nenhum arquivo ou cache armazenado no navegador.
                        </div>
                    ) : (
                        cachesList.map((item) => (
                            <div
                                key={item.name}
                                className="p-4 bg-[#121212] border border-white/10 rounded-2xl flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                            >
                                <div className="space-y-1 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-white font-mono">{item.name}</span>
                                        <span className="text-[9px] font-black text-brand-yellow bg-brand-yellow/10 px-2 py-0.5 rounded border border-brand-yellow/20">
                                            {item.entriesCount} itens
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-gray-400">{item.description}</p>
                                    <div className="text-[10px] font-mono text-[#00A3FF] font-bold">Tamanho: {item.sizeFormatted}</div>
                                </div>
                                <button
                                    onClick={() => handleClearSingleCache(item.name)}
                                    className="p-2.5 bg-white/5 hover:bg-brand-red/20 text-gray-400 hover:text-brand-red border border-white/10 hover:border-brand-red/30 rounded-xl transition-all cursor-pointer shrink-0"
                                    title="Limpar este cache"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-[#121212] flex items-center justify-between">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
