'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { supabase } from '@/lib/supabase/client';
import { handleDeepCleanup } from '@/utils/deepCleanup';
import { submitFeedback } from '@/app/actions/feedback';
import { toast } from 'react-hot-toast';
import {
    Trash2,
    ShieldAlert,
    CheckCircle2,
    AlertTriangle,
    Mail,
    Send,
    Loader2,
    Lock,
    ExternalLink,
    Info,
} from 'lucide-react';

export default function DeleteAccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Estado para exclusão autenticada
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

    // Estado para solicitação externa (não-logado ou app desinstalado)
    const [manualEmail, setManualEmail] = useState('');
    const [manualReason, setManualReason] = useState('');
    const [isSubmittingManual, setIsSubmittingManual] = useState(false);
    const [manualSubmitted, setManualSubmitted] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            if (data?.user) {
                setUser({ id: data.user.id, email: data.user.email });
            }
            setIsCheckingAuth(false);
        }).catch(() => {
            setIsCheckingAuth(false);
        });
    }, []);

    // Fluxo de exclusão autenticada (via API Route do backend)
    const handleAuthenticatedDelete = async () => {
        if (confirmText.trim() !== 'EXCLUIR') {
            toast.error('Por favor, digite EXCLUIR para confirmar a ação irreversível.');
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch('/api/account/delete', {
                method: 'POST',
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Falha ao processar exclusão no servidor.');
            }

            await handleDeepCleanup();
            setIsDeletedSuccess(true);
            toast.success('Conta e dados pessoais excluídos com sucesso.');
        } catch (err: any) {
            console.error('Erro na exclusão:', err);
            toast.error(err.message || 'Erro ao processar exclusão. Tente novamente ou use o formulário manual.');
        } finally {
            setIsDeleting(false);
        }
    };

    // Fluxo de solicitação externa para quem desinstalou o aplicativo
    const handleManualRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualEmail.trim()) {
            toast.error('Informe seu e-mail cadastrado na plataforma.');
            return;
        }

        setIsSubmittingManual(true);
        try {
            const res = await submitFeedback({
                type: 'account_deletion_request',
                email: manualEmail.trim(),
                description: `[SOLICITAÇÃO DE EXCLUSÃO DE CONTA - GOOGLE PLAY REQUIREMENT]\nO titular com e-mail "${manualEmail.trim()}" solicitou formalmente a exclusão permanente de sua conta e anonimização de seus registros.\nMotivo/Observação: ${manualReason.trim() || 'Não especificado'}.\nOrigem: Página Pública de Exclusão (/delete-account).`,
            });

            if (res.success) {
                setManualSubmitted(true);
                toast.success('Solicitação protocolada com sucesso junto ao DPO.');
            } else {
                throw new Error(res.error || 'Falha ao registrar requisição.');
            }
        } catch (err: any) {
            console.error('Erro ao enviar solicitação:', err);
            toast.error('Não foi possível registrar automaticamente. Por favor, envie e-mail direto para hublabdiv@gmail.com');
        } finally {
            setIsSubmittingManual(false);
        }
    };

    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-10">
                {/* Header Institucional Obrigatório */}
                <header className="mb-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-red/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-red/20">
                        <Trash2 className="text-brand-red w-8 h-8" />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-xs font-semibold text-brand-blue mb-3">
                        <span>Instituto de Física da Universidade de São Paulo (IFUSP)</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3">
                        Exclusão de Conta e <span className="text-brand-red drop-shadow-sm">Eliminação de Dados</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Página de exclusão pública e independente do aplicativo <strong>HUB LabDiv</strong>, desenvolvida para atendimento irrestrito às diretrizes de <em>Account Deletion</em> do Google Play e aos Artigos 16 e 18 da LGPD.
                    </p>
                </header>

                <main className="space-y-6">
                    {/* Quadro de Consequências da Exclusão (Obrigatório Google Play) */}
                    <section className="bg-white dark:bg-white/5 border-2 border-brand-red/30 rounded-2xl p-6 sm:p-8 shadow-md">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <AlertTriangle className="text-brand-red w-6 h-6 shrink-0" />
                            Quadro de Consequências e Regime de Retenção
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-6">
                            Antes de confirmar, compreenda exatamente como tratamos as diferentes categorias de dados em respeito simultâneo ao seu direito à privacidade e à preservação da pesquisa científica pública:
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Card 1: Excluídos */}
                            <div className="p-5 rounded-xl bg-brand-red/5 border border-brand-red/20 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-brand-red text-sm uppercase tracking-wider">
                                    <Trash2 className="w-4 h-4" />
                                    <span>Excluídos Definitivamente</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Seus dados pessoais diretos (nome completo, e-mail, biografia, foto de perfil, curtidas, históricos e tokens de autenticação) são <strong>destruídos permanentemente</strong> em até 30 dias de nossos bancos de dados e backups.
                                </p>
                            </div>

                            {/* Card 2: Anonimizados */}
                            <div className="p-5 rounded-xl bg-brand-yellow/5 border border-brand-yellow/20 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-brand-yellow text-sm uppercase tracking-wider">
                                    <Info className="w-4 h-4" />
                                    <span>Anonimizados (CC BY 4.0)</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Artigos científicos e contribuições ao acervo aberto não são apagados para resguardar a integridade acadêmica. Eles são <strong>irreversivelmente anonimizados</strong> (Art. 5º, VIII, &quot;b&quot; da Lei 9.610/98), desvinculando sua identidade para sempre.
                                </p>
                            </div>

                            {/* Card 3: Marco Civil */}
                            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                                <div className="flex items-center gap-2 font-bold text-emerald-500 text-sm uppercase tracking-wider">
                                    <Lock className="w-4 h-4" />
                                    <span>Retenção Legal (6 Meses)</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Conforme o Artigo 15 do Marco Civil da Internet (Lei nº 12.965/2014), os registros de conexão (IP, data, hora e porta lógica) são mantidos isolados e em sigilo estrito pelo prazo improrrogável de 6 meses para eventuais ordens judiciais criminais.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* MÉTODOS DE EXCLUSÃO */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* MÉTODO 1: Exclusão Autenticada Imediata */}
                        <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-blue mb-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                                    Método 1 (Instantâneo)
                                </div>
                                <h3 className="text-lg font-bukra font-bold text-gray-900 dark:text-white mb-2">
                                    Exclusão Autenticada no Navegador
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                    Se você está com sua sessão aberta ou lembra seus dados de login, efetue a exclusão imediata e automatizada da sua conta agora mesmo:
                                </p>

                                {isCheckingAuth ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                                    </div>
                                ) : user ? (
                                    isDeletedSuccess ? (
                                        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                                            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                            <h4 className="font-bold text-white text-base">Conta Excluída com Sucesso</h4>
                                            <p className="text-xs text-gray-300">
                                                Sua identidade foi desvinculada e todos os dados pessoais removidos.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    router.push('/');
                                                    setTimeout(() => window.location.reload(), 300);
                                                }}
                                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white uppercase tracking-wider transition-colors"
                                            >
                                                Voltar à Página Inicial
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                                                Conectado como: <strong className="text-white">{user.email || 'Usuário Autenticado'}</strong>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                                                    Digite &quot;EXCLUIR&quot; em maiúsculas para confirmar:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={confirmText}
                                                    onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                                    placeholder="EXCLUIR"
                                                    className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-red transition-colors"
                                                />
                                            </div>
                                            <button
                                                onClick={handleAuthenticatedDelete}
                                                disabled={confirmText !== 'EXCLUIR' || isDeleting}
                                                className="w-full py-3.5 px-6 rounded-xl bg-brand-red hover:bg-brand-red/90 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20"
                                            >
                                                {isDeleting ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Processando Exclusão...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Trash2 className="w-4 h-4" />
                                                        Confirmar e Excluir Minha Conta
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <div className="space-y-4 py-4 text-center">
                                        <p className="text-xs text-gray-400">
                                            Você não possui uma sessão ativa neste navegador. Faça login para excluir em um clique ou utilize o Método 2 ao lado.
                                        </p>
                                        <Link
                                            href="/login?redirect=/delete-account"
                                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-brand-blue/20"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Fazer Login para Excluir
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <p className="text-[10px] text-gray-400 mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
                                Este processo aciona a rotina segura de Soft &amp; Hard Delete com limpeza atômica de tokens de sessão.
                            </p>
                        </section>

                        {/* MÉTODO 2: Solicitação sem App / Sem Senha (Requisito Play Store) */}
                        <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-yellow mb-2">
                                    <span className="w-2 h-2 rounded-full bg-brand-yellow"></span>
                                    Método 2 (App Desinstalado / Sem Acesso)
                                </div>
                                <h3 className="text-lg font-bukra font-bold text-gray-900 dark:text-white mb-2">
                                    Solicitação Externa ao Encarregado (DPO)
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                    Se você desinstalou o app móvel, perdeu acesso à senha ou prefere atendimento direto por e-mail, preencha o formulário para exclusão manual em até 15 dias úteis (Art. 19 da LGPD):
                                </p>

                                {manualSubmitted ? (
                                    <div className="p-6 rounded-xl bg-brand-yellow/10 border border-brand-yellow/30 text-center space-y-3">
                                        <CheckCircle2 className="w-10 h-10 text-brand-yellow mx-auto" />
                                        <h4 className="font-bold text-white text-base">Solicitação Enviada com Sucesso</h4>
                                        <p className="text-xs text-gray-300">
                                            Nossa equipe de Governança de Dados recebeu sua requisição e enviará a confirmação formal de expurgo para o e-mail informado.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleManualRequest} className="space-y-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                E-mail da sua conta no HUB LabDiv *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={manualEmail}
                                                onChange={(e) => setManualEmail(e.target.value)}
                                                placeholder="exemplo@usp.br ou seu e-mail"
                                                className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-brand-yellow transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                                                Motivo da saída (opcional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={manualReason}
                                                onChange={(e) => setManualReason(e.target.value)}
                                                placeholder="Nos ajude a melhorar: por que decidiu excluir sua conta?"
                                                className="w-full bg-background-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-white text-xs outline-none focus:border-brand-yellow transition-colors resize-none"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingManual}
                                            className="w-full py-3.5 px-6 rounded-xl bg-brand-yellow hover:bg-brand-yellow/90 disabled:opacity-40 text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-yellow/20"
                                        >
                                            {isSubmittingManual ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Protocolando Requisição...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Protocolar Solicitação de Exclusão
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </div>

                            {/* Canal Direto de E-mail */}
                            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                                <span className="text-gray-400">Ou fale diretamente com o DPO:</span>
                                <a
                                    href="mailto:hublabdiv@gmail.com?subject=Solicita%C3%A7%C3%A3o%20de%20Exclus%C3%A3o%20de%20Conta%20-%20HUB%20LabDiv&body=Ol%C3%A1%20Equipe%20LabDiv%2C%0A%0ASolicito%20a%20exclus%C3%A3o%20definitiva%20da%20minha%20conta%20e%20elimina%C3%A7%C3%A3o%20dos%20meus%20dados%20pessoais%20cadastrados%20no%20HUB%20LabDiv.%0A%0AMeu%20e-mail%20de%20cadastro%20%C3%A9%3A%20"
                                    className="inline-flex items-center gap-1.5 font-bold text-brand-blue hover:underline"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    hublabdiv@gmail.com
                                </a>
                            </div>
                        </section>
                    </div>

                    {/* Dúvidas Frequentes e Garantias Legais */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-base font-bukra font-bold text-gray-900 dark:text-white mb-4">
                            Garantias Legais e Esclarecimentos
                        </h3>
                        <div className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                • <strong>Posso recuperar minha conta após a exclusão?</strong> Não. O processo é definitivo e destrói suas credenciais de acesso para assegurar a inviolabilidade do expurgo.
                            </p>
                            <p>
                                • <strong>Como fica a autoria de artigos científicos publicados?</strong> Respeitando o Direito Autoral e a licença aberta Creative Commons (CC BY 4.0), seus artigos continuam públicos, porém com sua identidade totalmente removida e substituída por autor anônimo coletivo.
                            </p>
                            <p>
                                • <strong>Quais dados continuam por lei?</strong> Somente os registros de conexão estabelecidos pelo Artigo 15 do Marco Civil da Internet (IP e carimbo de data/hora), armazenados em ambiente estanque por 6 meses para eventuais requisições judiciais.
                            </p>
                        </div>
                    </section>
                </main>

                <footer className="mt-12 text-center border-t border-gray-200 dark:border-white/10 pt-8 pb-4">
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 mb-6">
                        <Link href="/terms" className="hover:text-brand-yellow transition-colors">Termos de Serviço</Link>
                        <Link href="/privacy" className="hover:text-brand-yellow transition-colors">Política de Privacidade</Link>
                        <Link href="/" className="hover:text-brand-yellow transition-colors">Página Inicial</Link>
                    </div>
                    <p className="text-xs text-gray-400">
                        © 2026 HUB LabDiv • Instituto de Física da Universidade de São Paulo (IFUSP) • Licença AGPLv3
                    </p>
                </footer>
            </div>
        </MainLayoutWrapper>
    );
}
