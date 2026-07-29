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
import { useNavigationStore } from '@/store/useNavigationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, AlertTriangle, ExternalLink, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { registerBetaUser } from '@/app/actions/beta';

export function BetaRegistrationModal() {
    const isBetaModalOpen = useNavigationStore(state => state.isBetaModalOpen);
    const setBetaModalOpen = useNavigationStore(state => state.setBetaModalOpen);

    const [email, setEmail] = useState('');
    const [surveyCompleted, setSurveyCompleted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        setBetaModalOpen(false);
        setTimeout(() => {
            setEmail('');
            setSurveyCompleted(false);
        }, 300);
    };

    const validateEmail = (val: string) => {
        const lower = val.toLowerCase().trim();
        if (lower.endsWith('@usp.br') || lower.endsWith('@usp')) {
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateEmail(email)) {
            toast.error('Por favor, utilize seu e-mail pessoal da Play Store. E-mails corporativos @usp não são aceitos pelo Google Play Console.', { duration: 5000 });
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await registerBetaUser(email.trim(), surveyCompleted);
            if (result.success) {
                toast.success('Inscrição no Beta concluída! Assim que a Google aprovar seu acesso, notificaremos você.');
                handleClose();
            } else {
                toast.error(result.error || 'Erro ao registrar e-mail.');
            }
        } catch (error) {
            console.error('Beta registration error', error);
            toast.error('Erro de conexão ao tentar registrar.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isBetaModalOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] md:w-full max-w-lg bg-white dark:bg-[#1E1E1E] rounded-[32px] p-6 sm:p-8 shadow-2xl z-[10000] overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center shrink-0">
                                    <Smartphone className="w-6 h-6 text-brand-blue" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-tighter">App Beta</h2>
                                    <p className="text-xs font-medium text-gray-500">Programa de Testes (Android)</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar pr-2">
                            <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl p-5 mb-6">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-brand-blue" />
                                    Como funciona?
                                </h3>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                                    O Google Play Console exige que cadastremos o e-mail da sua conta da Play Store para liberar o acesso ao App LabDiv (Beta). Preencha seu e-mail abaixo e você receberá uma notificação quando a Google aprovar seu dispositivo.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* Email Input */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="play_email" className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest ml-1">
                                        E-mail da Play Store
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="play_email"
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="exemplo@gmail.com"
                                            className="w-full h-14 bg-gray-50 dark:bg-black/20 border-2 border-gray-200 dark:border-white/10 rounded-2xl px-5 text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:border-brand-blue dark:focus:border-brand-blue transition-colors"
                                        />
                                        {!validateEmail(email) && email.length > 0 && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-red flex items-center gap-1.5 bg-white dark:bg-[#1E1E1E] pl-2">
                                                <AlertTriangle className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase tracking-wider">Domínio Inválido</span>
                                            </div>
                                        )}
                                    </div>
                                    {!validateEmail(email) && email.length > 0 ? (
                                        <p className="text-[10px] font-bold text-brand-red ml-1 flex items-center gap-1">
                                            E-mails @usp ou @usp.br não são permitidos pelo Google Play. Use uma conta Google/Pessoal.
                                        </p>
                                    ) : (
                                        <p className="text-[10px] font-medium text-gray-500 ml-1">
                                            Deve ser a mesma conta Google logada no seu celular Android.
                                        </p>
                                    )}
                                </div>

                                {/* Survey Link & Checkbox */}
                                <div className="flex flex-col gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5">
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1">Pesquisa de UX (Opcional)</h4>
                                        <p className="text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                            Responda ao formulário rápido de experiência para nos ajudar a polir a interface do App antes do lançamento aberto. 
                                            <br /><br />
                                            <strong className="text-brand-blue">Dica:</strong> Você também pode deixar o seu e-mail de acesso na última pergunta do formulário. Assim, se preferir, não precisa preencher a caixa de e-mail acima e pode fechar esta janela após enviar o Forms.
                                        </p>
                                        <a 
                                            href="https://forms.gle/J1QMLah91TZcGJXY7" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center w-full gap-2 text-xs font-bold bg-brand-blue text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-brand-blue/20"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Abrir Formulário (Google Forms)
                                        </a>
                                    </div>
                                    <div className="h-px w-full bg-gray-200 dark:bg-white/10" />
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <div className="relative flex items-center justify-center w-5 h-5 mt-0.5 rounded flex-shrink-0">
                                            <input
                                                type="checkbox"
                                                checked={surveyCompleted}
                                                onChange={(e) => setSurveyCompleted(e.target.checked)}
                                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 dark:border-white/20 rounded cursor-pointer checked:bg-brand-blue checked:border-brand-blue transition-all"
                                            />
                                            <CheckCircle2 className="w-3.5 h-3.5 text-white absolute opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors mt-[2px]">
                                            Declaro que já preenchi e enviei o formulário de pesquisa vinculado. <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">(Opcional)</span>
                                        </span>
                                    </label>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 h-14 rounded-2xl border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !validateEmail(email) || !email}
                                        className="flex-[2] h-14 rounded-2xl bg-brand-blue text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors relative overflow-hidden"
                                    >
                                        {isSubmitting ? (
                                            <div className="absolute inset-0 flex items-center justify-center bg-brand-blue">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            </div>
                                        ) : (
                                            'Solicitar Acesso Beta'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
