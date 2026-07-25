'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import { useState, useEffect } from 'react';
import { HardDrive, Trash2, Database, AlertTriangle, Loader2, Wifi, WifiOff, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CacheInfo {
    name: string;
    size?: number;
    itemsCount?: number;
}

export type CacheMode = 'full' | 'restricted' | 'off';

export function CacheManager() {
    const [cachesList, setCachesList] = useState<CacheInfo[]>([]);
    const [storageUsage, setStorageUsage] = useState<number | null>(null);
    const [storageQuota, setStorageQuota] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [cacheMode, setCacheMode] = useState<CacheMode>('full');

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
                const detailedCaches: CacheInfo[] = await Promise.all(
                    cacheNames.map(async (name) => {
                        let size = 0;
                        let itemsCount = 0;
                        try {
                            const cache = await caches.open(name);
                            const keys = await cache.keys();
                            itemsCount = keys.length;
                            for (const request of keys) {
                                const response = await cache.match(request);
                                if (response) {
                                    const blob = await response.clone().blob();
                                    size += blob.size;
                                }
                            }
                        } catch (e) {
                            console.error(`Error calculating size for cache ${name}:`, e);
                        }
                        return { name, size, itemsCount };
                    })
                );
                setCachesList(detailedCaches);
            }

            if (typeof window !== 'undefined') {
                const savedMode = localStorage.getItem('hub_cache_mode') as CacheMode | null;
                if (savedMode && ['full', 'restricted', 'off'].includes(savedMode)) {
                    setCacheMode(savedMode);
                } else {
                    const legacyAuto = localStorage.getItem('hub_auto_cache_enabled');
                    setCacheMode(legacyAuto === 'false' ? 'off' : 'full');
                }
            }
        } catch (error) {
            console.error('Error loading cache data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectMode = async (mode: CacheMode) => {
        setCacheMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('hub_cache_mode', mode);
            localStorage.setItem('hub_auto_cache_enabled', mode === 'full' ? 'true' : 'false');
        }

        if (mode === 'restricted') {
            await handleClearAllButAuth();
            toast.success('Modo Restrito ativado! Caches de mídias e páginas limpos, apenas logins e rascunhos mantidos.');
        } else if (mode === 'full') {
            toast.success('Modo Offline-First Total ativado!');
        } else {
            toast('Cache automático desativado.', { icon: '📵' });
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
                    // Preserva os dados essenciais mantendo a autenticação, sessão e rascunhos salvos intactos
                    if (!name.toLowerCase().includes('auth') && !name.toLowerCase().includes('session') && !name.toLowerCase().includes('draft')) {
                        await caches.delete(name);
                    }
                }
            }
            toast.success('Caches limpos! Sua sessão de login e rascunhos foram mantidos.');
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
            {/* Seletor de Modo de Cache & Privacidade de Armazenamento */}
            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 transition-all space-y-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                        <Database className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Política de Cache & Offline-First</h2>
                        <p className="text-xs text-gray-400">Escolha o nível de armazenamento local que deseja permitir neste dispositivo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Opção 1: Full */}
                    <div
                        onClick={() => handleSelectMode('full')}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                            cacheMode === 'full' 
                                ? 'bg-brand-blue/10 border-brand-blue text-white shadow-lg shadow-brand-blue/10' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm flex items-center gap-2">
                                    <Wifi className="w-4 h-4 text-brand-blue" /> Offline-First Total
                                </span>
                                {cacheMode === 'full' && <CheckCircle2 className="w-4 h-4 text-brand-blue" />}
                            </div>
                            <p className="text-xs leading-relaxed text-gray-400">
                                Salva automaticamente páginas navegadas, mídias, login e rascunhos para uso contínuo sem internet.
                            </p>
                        </div>
                    </div>

                    {/* Opção 2: Restricted (Apenas Login & Rascunhos) */}
                    <div
                        onClick={() => handleSelectMode('restricted')}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                            cacheMode === 'restricted' 
                                ? 'bg-brand-yellow/10 border-brand-yellow text-white shadow-lg shadow-brand-yellow/10' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm flex items-center gap-2 text-brand-yellow">
                                    <ShieldCheck className="w-4 h-4" /> Restrito (Login & Rascunhos)
                                </span>
                                {cacheMode === 'restricted' && <CheckCircle2 className="w-4 h-4 text-brand-yellow" />}
                            </div>
                            <p className="text-xs leading-relaxed text-gray-400">
                                Desativa o cache de páginas e mídias. Mantém estritamente sua **sessão de login** e **rascunhos salvos**.
                            </p>
                        </div>
                    </div>

                    {/* Opção 3: Off */}
                    <div
                        onClick={() => handleSelectMode('off')}
                        className={`cursor-pointer rounded-xl p-4 border transition-all flex flex-col justify-between ${
                            cacheMode === 'off' 
                                ? 'bg-brand-red/10 border-brand-red text-white shadow-lg shadow-brand-red/10' 
                                : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-sm flex items-center gap-2 text-gray-300">
                                    <WifiOff className="w-4 h-4" /> Desativado
                                </span>
                                {cacheMode === 'off' && <CheckCircle2 className="w-4 h-4 text-brand-red" />}
                            </div>
                            <p className="text-xs leading-relaxed text-gray-400">
                                Nenhum pré-carregamento de páginas em segundo plano. Economiza todo o espaço local.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                        <p className="text-sm text-brand-yellow font-medium">Você pode liberar espaço removendo dados offline (sua sessão e rascunhos salvos serão preservados).</p>
                    </div>
                    <button 
                        onClick={handleClearAllButAuth}
                        className="px-4 py-2 bg-brand-yellow text-black text-xs font-bold rounded-lg uppercase hover:bg-brand-yellow/90 transition-colors whitespace-nowrap"
                    >
                        Limpar (Manter Sessão e Rascunhos)
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                <h3 className="text-lg font-bold text-white mb-4">Caches Detalhados</h3>
                {cachesList.length === 0 ? (
                    <p className="text-gray-500 text-sm">Nenhum cache encontrado.</p>
                ) : (
                    cachesList.map((cache) => {
                        let description = 'Cache temporário de sessão.';
                        if (cache.name.includes('labdiv-hub') || cache.name.includes('workbox-precache')) {
                            description = 'Recursos de interface, componentes offline e assets estruturais do sistema.';
                        } else if (cache.name.includes('images') || cache.name.includes('imagens')) {
                            description = 'Imagens, fotos e ilustrações cacheadas para carregamento mais rápido.';
                        } else if (cache.name.includes('fonts')) {
                            description = 'Tipografias e iconografias do sistema.';
                        } else if (cache.name.includes('data')) {
                            description = 'Dados estáticos de páginas pré-carregadas.';
                        }

                        return (
                            <div key={cache.name} className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <Database className="w-5 h-5 text-brand-blue shrink-0 mt-1" />
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-white font-bold text-sm">{cache.name}</span>
                                            {cache.size !== undefined && (
                                                <span className="text-brand-yellow font-mono font-bold text-xs bg-brand-yellow/10 border border-brand-yellow/20 px-2 py-0.5 rounded-md">
                                                    ({formatBytes(cache.size)}{cache.itemsCount ? ` — ${cache.itemsCount} arquivos` : ''})
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400 mt-1">{description}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteCache(cache.name)}
                                    className="p-2 text-gray-400 hover:text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors shrink-0"
                                    title="Excluir este cache"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
