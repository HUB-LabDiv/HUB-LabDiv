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


import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitFAQ } from '@/app/actions/sac';
import { useMutation } from '@tanstack/react-query';
import { offlineCrud } from '@/lib/offline-sync';

interface SacModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SacModal({ isOpen, onClose }: SacModalProps) {
    const [pergunta, setPergunta] = useState('');
    const [nome, setNome] = useState('');
    const [numUsp, setNumUsp] = useState('');
    const sacMutation = useMutation({
        mutationFn: async (payload: any) => {
            try {
                const res = await submitFAQ(payload);
                if (!res.success) throw new Error(res.error || 'Erro ao enviar dúvida.');
                return res;
            } catch (err: any) {
                if (!navigator.onLine || err.message === 'Failed to fetch' || err.message.includes('Network') || err.message.includes('fetch')) {
                    await offlineCrud.enqueueMutation({
                        endpoint: '/api/sync',
                        method: 'POST',
                        payload: payload
                    });
                    return { success: true, offline: true };
                }
                throw err;
            }
        },
        onSuccess: (data: any, variables) => {
            if (data?.offline) {
                toast.success('Dúvida salva na fila local! Será enviada quando houver conexão.');
            } else {
                toast.success('Dúvida enviada com sucesso aos moderadores!');
            }
            setPergunta('');
            setNome('');
            setNumUsp('');
            onClose();
        },
        onError: (err) => {
            if (navigator.onLine) {
                toast.error(err.message || 'Erro ao enviar dúvida.');
            } else {
                setPergunta('');
                setNome('');
                setNumUsp('');
                onClose();
            }
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pergunta.trim() || !nome.trim() || !numUsp.trim()) {
            toast.error('Preencha todos os campos.');
            return;
        }

        const userEmail = ''; 

        sacMutation.mutate({
            pergunta,
            nome,
            num_usp: numUsp,
            email: userEmail
        });
    };
    
    const isSubmitting = sacMutation.isPending;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1e1e1e] border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Enviar Dúvida</h2>
                <p className="text-sm text-gray-400 mb-6">Sua dúvida será enviada aos moderadores e a resposta ficará aqui. Se necessário, encaminharemos para a Seção de Alunos (por isso a necessidade do Nº USP).</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Seu Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                            placeholder="Ex: João Silva"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Nº USP</label>
                        <input
                            type="text"
                            value={numUsp}
                            onChange={e => setNumUsp(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors"
                            placeholder="Ex: 12345678"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-500 mb-1 tracking-widest">Sua Dúvida</label>
                        <textarea
                            value={pergunta}
                            onChange={e => setPergunta(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue transition-colors resize-none h-32"
                            placeholder="Descreva sua dúvida com detalhes..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-blue text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:bg-brand-blue/90 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Enviar Dúvida
                    </button>
                </form>
            </div>
        </div>
    );
}
