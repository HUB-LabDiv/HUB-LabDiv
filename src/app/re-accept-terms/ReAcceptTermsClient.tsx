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
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import { HubLogo } from '@/components/shared/HubLogo';
import { TermsOfUse } from '@/components/auth/TermsOfUse';
import { CURRENT_TERMS_VERSION } from '@/constants/terms';
import { acceptUpdatedTermsAction } from '@/app/actions/terms';

interface ReAcceptTermsClientProps {
    alreadyVerifiedAge: boolean;
    initialIsMinor: boolean;
}

export function ReAcceptTermsClient({
    alreadyVerifiedAge,
    initialIsMinor,
}: ReAcceptTermsClientProps) {
    const [cpf, setCpf] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [isMinor, setIsMinor] = useState(initialIsMinor);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showCookiesCard, setShowCookiesCard] = useState(false);
    const [loading, setLoading] = useState(false);
    const todayStr = new Date().toISOString().split('T')[0];

    const router = useRouter();

    const needsAgeInput = !alreadyVerifiedAge && !birthdate;

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        let masked = value;
        if (value.length > 9) {
            masked = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
        } else if (value.length > 6) {
            masked = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
        } else if (value.length > 3) {
            masked = `${value.slice(0, 3)}.${value.slice(3)}`;
        }
        setCpf(masked);
    };

    const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setBirthdate(date);

        if (date) {
            const birth = new Date(date);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            setIsMinor(age < 18);
        } else {
            setIsMinor(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error(`Você deve ler e aceitar os Termos de Uso e a Política de Privacidade (${CURRENT_TERMS_VERSION}).`);
            return;
        }

        if (alreadyVerifiedAge) {
            if (!isMinor && !privacyAccepted) {
                toast.error('Aceite a Política de Privacidade para continuar.');
                return;
            }
            setLoading(true);
            try {
                const res = await acceptUpdatedTermsAction({
                    termsAccepted: true,
                    privacyAccepted: isMinor ? false : privacyAccepted,
                });
                if (!res.success) {
                    toast.error(res.error || 'Falha ao confirmar novos termos.');
                    setLoading(false);
                    return;
                }
                toast.success(`Termos ${CURRENT_TERMS_VERSION} confirmados! Redirecionando...`);
                window.location.href = '/';
            } catch (err) {
                console.error(err);
                toast.error('Ocorreu um erro ao confirmar os novos termos.');
                setLoading(false);
            }
            return;
        }

        const rawCpf = cpf.replace(/\D/g, '');
        if (rawCpf.length < 11) {
            toast.error('CPF incompleto.');
            return;
        }

        if (!birthdate) {
            toast.error('Data de nascimento é obrigatória.');
            return;
        }

        setLoading(true);

        try {
            const cpfRes = await fetch('/api/auth/verify-cpf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cpf: rawCpf,
                    birthdate,
                    guardianEmail: isMinor ? guardianEmail : undefined,
                }),
            });

            const cpfData = await cpfRes.json();

            if (!cpfRes.ok) {
                toast.error(cpfData.error || 'Falha ao validar CPF.');
                setLoading(false);
                return;
            }

            if (isMinor) {
                toast.success('Dados enviados! Agora seu responsável deve autorizar o acesso via link enviado ao e-mail dele.');
                router.push('/auth/pending-consent');
            } else {
                toast.success('Regularização concluída! Redirecionando...');
                window.location.href = '/';
            }
        } catch (err) {
            console.error(err);
            toast.error('Ocorreu um erro na atualização do servidor.');
        } finally {
            setLoading(false);
        }
    };

    const submitDisabled = alreadyVerifiedAge
        ? loading || !termsAccepted || (!isMinor && !privacyAccepted)
        : loading || cpf.replace(/\D/g, '').length < 11 || !birthdate || !termsAccepted || (!isMinor && !privacyAccepted) || (isMinor && !guardianEmail);

    return (
        <main className="flex min-h-screen py-10 items-center justify-center p-4 bg-gray-50 dark:bg-[#121212] font-open-sans">
            <div className="w-full max-w-3xl space-y-8 bg-white dark:bg-[#1E1E1E] p-6 sm:p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex flex-col items-center text-center space-y-4">
                    <HubLogo size={64} className="mb-2" />

                    <h1 className="text-2xl sm:text-3xl font-bukra font-bold text-[#0F4780] dark:text-[#1F9FCF] tracking-tight leading-tight">
                        Termos e Política de Privacidade ({CURRENT_TERMS_VERSION})
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xl mx-auto leading-relaxed font-open-sans">
                        Para garantir total transparência e conformidade com a <strong>LGPD, ECA Digital e Marco Civil da Internet</strong>,{' '}
                        {alreadyVerifiedAge
                            ? `revise e confirme os novos Termos de Uso e a Política de Privacidade (${CURRENT_TERMS_VERSION}) com licença (CC BY 4.0).`
                            : `aceite os novos Termos de Uso e Política de Privacidade (${CURRENT_TERMS_VERSION}), incluindo a licença (CC BY 4.0), e conclua a verificação de idade.`}
                    </p>
                </div>

                {/* Termos de Uso */}
                <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-1">
                    <TermsOfUse
                        acceptedVersion={termsAccepted ? CURRENT_TERMS_VERSION : ''}
                        onAccept={() => {
                            setTermsAccepted(true);
                            toast.success('Termos aceitos!');
                        }}
                    />
                </div>

                {/* Botão de Cookies */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => setShowCookiesCard(!showCookiesCard)}
                        className={`w-full min-h-[48px] py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all text-xs border-2 border-dashed cursor-pointer ${
                            showCookiesCard
                                ? 'bg-[#1F9FCF]/10 border-[#1F9FCF] text-[#0F4780] dark:text-[#1F9FCF]'
                                : 'bg-white dark:bg-[#121212] border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                    >
                        <span className="material-symbols-outlined text-sm">{showCookiesCard ? 'visibility_off' : 'cookie'}</span>
                        {showCookiesCard ? 'Fechar Detalhes de Cookies' : 'Rever cookies aceitos'}
                    </button>

                    {showCookiesCard && (
                        <div className="bg-[#FFCC00]/10 border-2 border-[#FFCC00]/30 p-6 rounded-2xl animate-in zoom-in-95 duration-300">
                            <h5 className="text-xs font-black text-[#0F4780] dark:text-[#FFCC00] uppercase tracking-widest mb-5 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">verified_user</span>
                                O que guardamos no seu navegador?
                            </h5>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/70 dark:bg-[#121212]/50 p-3 rounded-xl border border-[#FFCC00]/20">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Chave de Acesso (Login)</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Serve para o site te reconhecer e não pedir sua senha toda hora.</p>
                                    </div>
                                    <span className="text-[10px] bg-[#FFCC00]/20 px-2 py-1 rounded-lg font-black text-[#0F4780] dark:text-[#FFCC00] uppercase">Essencial</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/70 dark:bg-[#121212]/50 p-3 rounded-xl border border-[#FFCC00]/20">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Suas Preferências</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Lembra se você aceitou os termos e desligou os rastreadores.</p>
                                    </div>
                                    <span className="text-[10px] bg-[#FFCC00]/20 px-2 py-1 rounded-lg font-black text-[#0F4780] dark:text-[#FFCC00] uppercase">Memória</span>
                                </div>
                                <div className="flex justify-between items-center bg-white/70 dark:bg-[#121212]/50 p-3 rounded-xl border border-[#FFCC00]/20">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">Tranca de Segurança</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Protege sua conta contra invasores e ataques digitais.</p>
                                    </div>
                                    <span className="text-[10px] bg-[#FFCC00]/20 px-2 py-1 rounded-lg font-black text-[#0F4780] dark:text-[#FFCC00] uppercase">Segurança</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Política de Privacidade e Telemetria */}
                <div
                    className={`rounded-2xl border-2 transition-all duration-500 overflow-hidden ${
                        needsAgeInput
                            ? 'bg-white dark:bg-[#1E1E1E] border-gray-200 dark:border-white/10 shadow-md'
                            : isMinor
                                ? 'bg-[#F14343]/5 border-[#F14343]/40'
                                : privacyAccepted
                                    ? 'bg-[#1F9FCF]/5 border-[#1F9FCF]/50 shadow-xl'
                                    : 'bg-white dark:bg-[#1E1E1E] border-[#FFCC00]/60 shadow-xl'
                    }`}
                >
                    <div className="p-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    needsAgeInput
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                        : isMinor
                                            ? 'bg-[#F14343] text-white'
                                            : 'bg-[#0F4780] text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-xl">
                                    {needsAgeInput ? 'lock' : isMinor ? 'child_care' : 'verified_user'}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">Política de Privacidade</h4>
                                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
                                    {isMinor ? 'Proteção Especial ECA Ativada' : 'Consentimento de Processamento de Dados'}
                                </p>
                            </div>
                        </div>
                        {isMinor && !needsAgeInput && (
                            <span className="px-2 py-0.5 bg-[#F14343] text-white text-[9px] font-black rounded uppercase">Blindagem Ativa</span>
                        )}
                        {!isMinor && !needsAgeInput && privacyAccepted && (
                            <span className="px-2 py-0.5 bg-[#1F9FCF] text-white text-[9px] font-black rounded uppercase">Validado</span>
                        )}
                    </div>

                    <div className="p-6 max-h-[350px] overflow-y-auto space-y-6 text-sm text-gray-700 dark:text-gray-300 leading-relaxed thin-scrollbar">
                        {isMinor ? (
                            <div className="space-y-4">
                                <section className="p-4 bg-[#F14343]/10 border border-[#F14343]/30 rounded-xl">
                                    <h5 className="text-[#F14343] font-bold mb-2 uppercase text-xs">Proteção de Menores (ECA Digital / LGPD)</h5>
                                    <p>Identificamos que você é menor de idade. Como o HUB Lab-Div prioriza a segurança total da criança e do adolescente, todos os sensores de telemetria comportamental externa (Microsoft Clarity) foram <strong>desativados permanentemente</strong> para o seu acesso.</p>
                                </section>
                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2">O que coletamos?</h5>
                                    <p>Apenas dados estritamente necessários para a autenticação técnica e registro de atividade acadêmica de forma anônima.</p>
                                </section>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2 text-base">1. Fluxo de Interação e Telemetria</h5>
                                    <p>Este consentimento autoriza a coleta de dados de navegação para otimizar nossa <strong>UX (Experiência do Usuário)</strong>. Os dados fluem para ferramentas de análise como o <strong>Microsoft Clarity</strong> e nosso banco de dados <strong>Supabase</strong>, permitindo identificar gargalos técnicos e melhorar a acessibilidade.</p>
                                </section>
                                <section>
                                    <h5 className="text-gray-900 dark:text-white font-bold mb-2 text-base">2. Direitos do Titular (LGPD)</h5>
                                    <p>Você tem total controle sobre seus dados. Usamos anonimização para que seu comportamento não seja vinculado à sua identidade real em relatórios de performance.</p>
                                </section>
                            </div>
                        )}
                    </div>

                    <div className="p-5 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#121212]/60">
                        {needsAgeInput ? (
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#0F4780] dark:text-[#FFCC00] bg-[#FFCC00]/15 border border-[#FFCC00]/40 rounded-xl py-3.5 px-4 text-center">
                                <span className="material-symbols-outlined text-base">lock</span>
                                <span>Preencha sua Data de Nascimento no formulário abaixo para liberar o botão de aceite</span>
                            </div>
                        ) : isMinor ? (
                            <div className="p-4 bg-[#F14343]/10 border-2 border-[#F14343]/40 rounded-xl flex items-center gap-3">
                                <span className="material-symbols-outlined text-[#F14343] text-2xl">verified_user</span>
                                <p className="text-xs text-[#F14343] font-bold leading-tight">
                                    Política de Proteção de Menores aplicada. Todos os sensores de telemetria externa estão desativados para sua conta.
                                </p>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    const nextState = !privacyAccepted;
                                    setPrivacyAccepted(nextState);
                                    if (nextState) {
                                        localStorage.setItem('cookie_consent', 'true');
                                        window.dispatchEvent(new Event('cookie_consent_changed'));
                                        toast.success('Política de Privacidade Aceita!');
                                    } else {
                                        localStorage.setItem('cookie_consent', 'false');
                                        window.dispatchEvent(new Event('cookie_consent_changed'));
                                        toast('Consentimento de telemetria desativado.', { icon: 'ℹ️' });
                                    }
                                }}
                                className={`w-full min-h-[48px] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-bukra font-bold text-sm tracking-wide cursor-pointer select-none ${
                                    privacyAccepted
                                        ? 'bg-[#1F9FCF] hover:bg-[#1F9FCF]/90 border-[#1F9FCF] text-white shadow-xl'
                                        : 'bg-[#FFCC00] hover:brightness-105 border-[#FFCC00] text-[#121212] shadow-xl'
                                }`}
                            >
                                <span className="material-symbols-outlined text-2xl font-black">
                                    {privacyAccepted ? 'check_circle' : 'check_box_outline_blank'}
                                </span>
                                <span className="font-bold">
                                    {privacyAccepted ? 'Privacidade e Telemetria Aceitas (Clique para alterar)' : 'Li e Aceito a Política de Privacidade'}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Formulário de Regularização / Confirmação */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-gray-50 dark:bg-[#121212]/60 p-6 rounded-2xl border border-gray-200 dark:border-white/10">
                    {alreadyVerifiedAge ? (
                        <div className="p-5 rounded-2xl bg-[#1F9FCF]/10 border-2 border-[#1F9FCF]/40 flex items-start gap-4">
                            <span className="material-symbols-outlined text-3xl text-[#0F4780] dark:text-[#1F9FCF] shrink-0">
                                verified_user
                            </span>
                            <div className="space-y-1">
                                <h3 className="text-base sm:text-lg font-bukra font-black text-[#0F4780] dark:text-[#1F9FCF]">
                                    Verificação de idade (ECA Digital) já concluída
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    Sua faixa etária já foi validada anteriormente — não é necessário informar CPF ou data de nascimento novamente. Basta aceitar os Termos de Uso ({CURRENT_TERMS_VERSION}) e a Política de Privacidade acima e confirmar abaixo.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[#0F4780] dark:text-[#FFCC00]">
                                    <span className="material-symbols-outlined text-2xl">security</span>
                                    <h3 className="font-bukra font-bold text-lg sm:text-xl">
                                        Proteção de Dados: Verificação de Idade
                                    </h3>
                                </div>

                                {/* Aviso de destaque ECA Digital */}
                                <div className="p-5 rounded-2xl bg-[#FFCC00]/15 dark:bg-[#FFCC00]/10 border-2 border-[#FFCC00] flex items-start gap-4 shadow-sm">
                                    <span className="material-symbols-outlined text-3xl text-[#0F4780] dark:text-[#FFCC00] shrink-0">
                                        gavel
                                    </span>
                                    <div className="space-y-1.5">
                                        <h4 className="text-base sm:text-lg font-bukra font-black text-[#0F4780] dark:text-[#FFCC00] uppercase tracking-tight">
                                            Aviso Legal — Cumprimento da Lei do ECA Digital
                                        </h4>
                                        <p className="text-sm sm:text-base font-open-sans text-gray-800 dark:text-gray-200 leading-relaxed">
                                            A verificação de idade é obrigatória para cumprir a <strong>Lei do ECA Digital</strong> (proteção de crianças e adolescentes em ambientes digitais), garantindo blindagem automática de privacidade e autorização parental quando necessário.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600 dark:text-gray-400">
                                        CPF (Apenas Consulta)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="000.000.000-00"
                                        value={cpf}
                                        onChange={handleCpfChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-white/15 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white focus:border-[#0F4780] outline-hidden"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-gray-600 dark:text-gray-400">
                                        Data de Nascimento
                                    </label>
                                    <input
                                        type="date"
                                        value={birthdate}
                                        onChange={handleBirthdateChange}
                                        max={todayStr}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-white/15 rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white focus:border-[#0F4780] outline-hidden"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {isMinor && (
                                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#F14343]">
                                        E-mail do Responsável Legal (Obrigatório para menores de 18 anos)
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="email@responsavel.com.br"
                                        value={guardianEmail}
                                        onChange={(e) => setGuardianEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 border-2 border-[#F14343] rounded-xl bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-white focus:border-[#F14343]"
                                        disabled={loading}
                                    />
                                    <p className="mt-2 text-xs text-gray-500 italic">
                                        * Em conformidade com o Estatuto da Criança e do Adolescente (ECA Digital), o acesso para menores requer validação parental.
                                    </p>
                                </div>
                            )}

                            <div className="bg-[#0F4780]/10 border-l-4 border-[#0F4780] p-4 rounded-r-xl text-sm text-gray-700 dark:text-gray-300">
                                <p>
                                    <strong>Transparência LGPD:</strong> Seu CPF é validado localmente e <strong>descartado de toda memória RAM (do seu dispositivo e de nossos servidores) instantaneamente</strong>. Não armazenamos números de documentos em bancos de dados, apenas um rastro criptografado irreversível (<strong>Argon2id</strong>).
                                </p>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full min-h-[48px] bg-[#0F4780] hover:bg-[#0F4780]/90 text-white py-4 rounded-full font-bukra font-bold text-base sm:text-lg transition-all transform hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest cursor-pointer"
                        disabled={submitDisabled}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Validando...
                            </span>
                        ) : alreadyVerifiedAge ? (
                            'Confirmar Novos Termos'
                        ) : (
                            'Concluir Regularização'
                        )}
                    </button>
                </form>

                {/* Botão de Saída */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={async () => {
                            await supabase.auth.signOut();
                            window.location.href = '/';
                        }}
                        className="min-h-[48px] px-4 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Continuar como convidado (Logar depois)
                    </button>
                </div>
            </div>
        </main>
    );
}
