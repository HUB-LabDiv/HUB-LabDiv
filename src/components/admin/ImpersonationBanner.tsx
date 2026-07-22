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


import { useState, useEffect } from 'react';
import { ShieldAlert, UserCheck, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { stopImpersonation } from '@/app/actions/profiles';
import { toast } from 'react-hot-toast';

interface ImpersonationBannerProps {
    impersonatedName?: string;
}

export function ImpersonationBanner({ impersonatedName }: ImpersonationBannerProps) {
    const [isStopping, setIsStopping] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a small delay for dramatic effect
        const timer = setTimeout(() => setIsVisible(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleStop = async () => {
        setIsStopping(true);
        try {
            const result = await stopImpersonation();
            if ('error' in result && result.error) throw new Error(result.error as string);

            toast.success('Retornando ao modo Administrador', {
                icon: '🛡️',
                style: { background: '#121212', color: '#fff', border: '1px solid #FFD700' }
            });

            // Force a full reload to reset all state/client
            window.location.href = '/admin/papeis';
        } catch (error: any) {
            toast.error('Erro ao encerrar sessão: ' + error.message);
            setIsStopping(false);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                exit={{ y: -100 }}
                className="fixed top-0 left-0 right-0 z-[9999] flex justify-center p-4 pointer-events-none"
            >
                <div className="bg-background-dark/90 backdrop-blur-md border border-brand-yellow/30 shadow-[0_0_30px_rgba(255,215,0,0.1)] rounded-full px-6 py-2 flex items-center gap-4 pointer-events-auto transition-all hover:border-brand-yellow/50">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <ShieldAlert className="text-brand-yellow w-5 h-5 animate-pulse" />
                            <div className="absolute inset-0 bg-brand-yellow/20 blur-md rounded-full -z-10" />
                        </div>
                        <p className="font-mono text-[10px] font-black uppercase text-brand-yellow tracking-widest hidden sm:block">
                            Modo_Impersonate_Ativo
                        </p>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <div className="flex items-center gap-2">
                        <UserCheck className="text-brand-blue w-4 h-4" />
                        <span className="text-xs font-bold text-white max-w-[150px] truncate">
                            {impersonatedName || 'Usuário'}
                        </span>
                    </div>

                    <button
                        onClick={handleStop}
                        disabled={isStopping}
                        className="flex items-center gap-2 bg-brand-yellow/10 hover:bg-brand-yellow text-brand-yellow hover:text-black px-3 py-1 rounded-full transition-all group disabled:opacity-50"
                    >
                        {isStopping ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                            <XCircle className="w-3 h-3 group-hover:rotate-90 transition-transform" />
                        )}
                        <span className="font-mono text-[9px] font-black uppercase tracking-tighter">
                            Encerrar
                        </span>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
