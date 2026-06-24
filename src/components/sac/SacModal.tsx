'use client';

import React, { useState } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitFAQ } from '@/app/actions/sac';

interface SacModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SacModal({ isOpen, onClose }: SacModalProps) {
    const [pergunta, setPergunta] = useState('');
    const [nome, setNome] = useState('');
    const [numUsp, setNumUsp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!pergunta.trim() || !nome.trim() || !numUsp.trim()) {
            toast.error('Preencha todos os campos.');
            return;
        }

        setIsSubmitting(true);
        
        // Simulação do email do usuário logado (pode ser obtido globalmente, mas usaremos um fixo para simplificar)
        // No contexto real, você pegaria o email do profile, mas aqui deixaremos opcional ou fixo caso falte
        const userEmail = ''; 

        const res = await submitFAQ({
            pergunta,
            nome,
            num_usp: numUsp,
            email: userEmail
        });

        setIsSubmitting(false);

        if (res.success) {
            // Abre o cliente de e-mail do aluno
            const subject = encodeURIComponent(`Dúvida SAC - ${nome}`);
            const body = encodeURIComponent(
                `Saudação,\n\n${pergunta}\n\nAtenciosamente,\n${nome}\nNº USP: ${numUsp}`
            );
            window.location.href = `mailto:salunosif@usp.br?subject=${subject}&body=${body}`;
            
            toast.success('Dúvida enviada com sucesso!');
            setPergunta('');
            setNome('');
            setNumUsp('');
            onClose();
        } else {
            toast.error(res.error || 'Erro ao enviar dúvida.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-[#1e1e1e] border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">Enviar Dúvida</h2>
                <p className="text-sm text-gray-400 mb-6">Sua dúvida será enviada para a Seção de Alunos e poderá aparecer no nosso painel de dúvidas frequentes.</p>

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
