'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import { useState, useEffect } from 'react';
import { HardDrive, Trash2, Database, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CacheInfo {
    name: string;
    size?: number;
}

export function CacheManager() {
    const [cachesList, setCachesList] = useState<CacheInfo[]>([]);
    const [storageUsage, setStorageUsage] = useState<number | null>(null);
    const [storageQuota, setStorageQuota] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadCacheData = async () => {
        setIsLoading(true);
        try {
            if ('storage' in navigator && 'estimate' in navigator.storage) {
                const estimate = await navigator.storage.estimate();
                setStorageUsage(estimate.usage || 0);
                setStorageQuota(estimate.quota || 0);
            }

            if ('caches' in window) {
                const cacheNames = await caches.keys();
                setCachesList(cacheNames.map(name => ({ name })));
            }
        } catch (error) {
            console.error('Error loading cache data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCacheData();
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDeleteCache = async (cacheName: string) => {
        try {
            await caches.delete(cacheName);
            toast.success(`Cache ${cacheName} excluído.`);
            loadCacheData();
        } catch (error) {
            console.error('Error deleting cache:', error);
            toast.error('Erro ao excluir cache.');
        }
    };

    const handleClearAllButAuth = async () => {
        try {
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (const name of cacheNames) {
                    // Evitar deletar caches de sessão ou auth, se existirem
                    if (!name.toLowerCase().includes('auth') && !name.toLowerCase().includes('session')) {
                        await caches.delete(name);
                    }
                }
            }
            toast.success('Caches de mídia e offline limpos, autenticação mantida.');
            loadCacheData();
        } catch (error) {
            toast.error('Erro ao limpar caches.');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center">
                        <HardDrive className="w-6 h-6 text-brand-blue" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Uso de Armazenamento</h2>
                        <p className="text-sm text-gray-400">
                            {storageUsage !== null && storageQuota !== null 
                                ? `${formatBytes(storageUsage)} usados de ${formatBytes(storageQuota)}` 
                                : 'Dados não disponíveis'}
                        </p>
                    </div>
                </div>

                <div className="w-full bg-white/5 rounded-full h-3 mb-6 overflow-hidden">
                    <div 
                        className="bg-brand-blue h-full rounded-full transition-all duration-500" 
                        style={{ width: storageUsage && storageQuota ? `${(storageUsage / storageQuota) * 100}%` : '0%' }}
                    ></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-brand-yellow/10 border border-brand-yellow/20 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-brand-yellow shrink-0" />
                        <p className="text-sm text-brand-yellow font-medium">Você pode liberar espaço removendo dados armazenados offline.</p>
                    </div>
                    <button 
                        onClick={handleClearAllButAuth}
                        className="px-4 py-2 bg-brand-yellow text-black text-xs font-bold rounded-lg uppercase hover:bg-brand-yellow/90 transition-colors whitespace-nowrap"
                    >
                        Limpar (Manter Sessão)
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-4">Caches Detalhados</h3>
                {cachesList.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum cache encontrado.</p>
                ) : (
                    cachesList.map((cache) => (
                        <div key={cache.name} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <Database className="w-5 h-5 text-gray-400" />
                                <span className="text-white font-mono text-sm">{cache.name}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteCache(cache.name)}
                                className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors"
                                title="Excluir este cache"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
