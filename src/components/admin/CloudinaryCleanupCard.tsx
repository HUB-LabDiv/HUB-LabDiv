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
import { scanOrphanedCloudinaryMedia, deleteOrphanedCloudinaryMedia, CloudinaryScanResult } from '@/app/actions/cloudinary-cleanup';
import toast from 'react-hot-toast';

export function CloudinaryCleanupCard() {
    const [isScanning, setIsScanning] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [scanResult, setScanResult] = useState<CloudinaryScanResult | null>(null);

    const handleScan = async () => {
        setIsScanning(true);
        const toastId = toast.loading('Escaneando Cloudinary e cruzando com o banco de dados...');
        try {
            const res = await scanOrphanedCloudinaryMedia();
            if (!res.success) {
                toast.error(res.error || 'Falha ao escanear o Cloudinary.', { id: toastId });
            } else {
                setScanResult(res);
                toast.success(`Escaner concluído! ${res.orphanedCount} mídias órfãs encontradas.`, { id: toastId });
            }
        } catch (e: any) {
            toast.error(e.message || 'Erro inesperado ao escanear.', { id: toastId });
        } finally {
            setIsScanning(false);
        }
    };

    const handleDeleteAllOrphans = async () => {
        if (!scanResult || scanResult.orphanedItems.length === 0) return;

        const count = scanResult.orphanedItems.length;
        const confirmMsg = `Tem certeza que deseja excluir permanentemente ${count} mídias órfãs do Cloudinary? Esta ação liberará ${(scanResult.totalOrphanedBytes / (1024 * 1024)).toFixed(2)} MB de espaço.`;

        if (!window.confirm(confirmMsg)) return;

        setIsDeleting(true);
        const toastId = toast.loading(`Excluindo ${count} mídias do Cloudinary...`);
        try {
            const publicIds = scanResult.orphanedItems.map(item => item.public_id);
            const res = await deleteOrphanedCloudinaryMedia(publicIds);
            if (res.error) {
                toast.error(res.error, { id: toastId });
            } else {
                toast.success(`✅ ${res.deletedCount} mídias órfãs excluídas com sucesso!`, { id: toastId });
                // Re-scan após exclusão
                handleScan();
            }
        } catch (e: any) {
            toast.error(e.message || 'Erro ao excluir mídias.', { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
            {/* Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-2xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center text-brand-blue-accent shrink-0">
                        <span className="material-symbols-outlined text-2xl">cloud_sync</span>
                    </div>
                    <div>
                        <h3 className="text-base sm:text-lg font-bukra font-bold text-white uppercase tracking-wider">
                            Limpeza de Armazenamento Cloudinary
                        </h3>
                        <p className="text-xs text-gray-400 font-sans mt-0.5">
                            Identifique e exclua imagens, vídeos e PDFs órfãos de posts deletados para economizar quota
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleScan}
                    disabled={isScanning || isDeleting}
                    className="px-5 py-2.5 bg-brand-blue hover:bg-brand-blue/80 text-white font-bukra font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                >
                    <span className={`material-symbols-outlined text-[16px] ${isScanning ? 'animate-spin' : ''}`}>
                        {isScanning ? 'progress_activity' : 'radar'}
                    </span>
                    <span>{isScanning ? 'Escaneando...' : 'Escanear Mídias'}</span>
                </button>
            </div>

            {/* Painel de Resultados */}
            {scanResult && (
                <div className="space-y-6 pt-4 border-t border-white/10 relative z-10 animate-fade-in">
                    {/* Cards de Métricas */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-bukra">Total no Cloudinary</span>
                            <span className="text-2xl font-bukra font-black text-white mt-1">{scanResult.totalInCloudinary}</span>
                        </div>
                        <div className="p-4 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue-accent font-bukra">Em Uso no HUB</span>
                            <span className="text-2xl font-bukra font-black text-white mt-1">{scanResult.inUseCount}</span>
                        </div>
                        <div className="p-4 bg-brand-red/10 border border-brand-red/30 rounded-2xl flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red font-bukra">Mídias Órfãs</span>
                            <span className="text-2xl font-bukra font-black text-brand-red mt-1">{scanResult.orphanedCount}</span>
                        </div>
                        <div className="p-4 bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl flex flex-col">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-yellow font-bukra">Espaço Recuperável</span>
                            <span className="text-2xl font-bukra font-black text-brand-yellow mt-1">
                                {(scanResult.totalOrphanedBytes / (1024 * 1024)).toFixed(1)} MB
                            </span>
                        </div>
                    </div>

                    {/* Ação de Exclusão */}
                    {scanResult.orphanedCount > 0 ? (
                        <div className="p-5 bg-brand-red/10 border border-brand-red/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-brand-red text-3xl shrink-0">delete_sweep</span>
                                <div>
                                    <h4 className="text-xs font-bukra font-bold text-white uppercase tracking-wide">
                                        {scanResult.orphanedCount} Mídias sem vínculo detectadas
                                    </h4>
                                    <p className="text-[11px] text-gray-300 font-sans mt-0.5">
                                        Estas mídias pertenciam a rascunhos ou posts que não existem mais no banco de dados.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDeleteAllOrphans}
                                disabled={isDeleting}
                                className="w-full sm:w-auto px-6 py-2.5 bg-brand-red hover:bg-[#D93B3B] text-white font-bukra font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">
                                    {isDeleting ? 'progress_activity' : 'delete_forever'}
                                </span>
                                <span>{isDeleting ? 'Excluindo...' : 'Excluir Todas as Órfãs'}</span>
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-medium">
                            <span className="material-symbols-outlined text-xl">verified</span>
                            <span>Excelente! Não foram encontradas mídias órfãs no Cloudinary. Todo o armazenamento está em uso ativo.</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
