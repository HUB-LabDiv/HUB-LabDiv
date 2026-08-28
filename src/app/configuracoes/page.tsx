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

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { exportUserData } from '@/app/actions/account';
import { DeleteAccountModal } from '@/components/modals/DeleteAccountModal';
import { DeleteSpecificDataModal } from '@/components/modals/DeleteSpecificDataModal';
import { EditProfileModal } from '@/components/profile/EditProfileModal';
import { toast } from 'react-hot-toast';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';
import { useAuth } from '@/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Share2, User, Download, Trash2, ShieldCheck, Database, Palette, BellRing, BellOff, Sparkles, SlidersHorizontal } from 'lucide-react';
import { CacheManager } from '@/components/cache/CacheManager';
import { useWebPush } from '@/hooks/useWebPush';
import { useSwipe } from '@/hooks/useSwipe';
import { usePersonalizacaoStore } from '@/store/usePersonalizacaoStore';
import { IFUSPLogo } from '@/components/icons/IFUSPLogo';
import { getNotificationPreferences, updateNotificationPreferences, NotificationPreferences } from '@/app/actions/webpush';
import { runOnboardingTour } from '@/lib/tour/tour-runner';
import { useOnboarding } from '@/hooks/useOnboarding';

type ConfigTab = 'gerais' | 'armazenamento' | 'conta';

export default function ConfigPage() {
    const { user, profile, loading } = useAuth();
    const router = useRouter();
    const { institution, setInstitution } = usePersonalizacaoStore();
    const { isSupported, isSubscribed, subscribe, unsubscribe } = useWebPush();
    const [activeTab, setActiveTab] = useState<ConfigTab>('gerais');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeletingData, setIsDeletingData] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Onboarding Banner Reactive State
    const { isDismissed: isOnboardingDismissed, setOnboardingVisibility } = useOnboarding();
    const showOnboarding = !isOnboardingDismissed;

    const handleToggleOnboarding = (enabled: boolean) => {
        setOnboardingVisibility(enabled);
    };

    const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>({
        notify_classes: true,
        notify_exams: true,
        notify_reminders: true,
        notify_tips: true,
        notify_follows_posts: true,
        notify_dms: true
    });

    useEffect(() => {
        async function loadPrefs() {
            const res = await getNotificationPreferences();
            if (res.success && res.data) {
                setNotifPrefs(res.data);
            }
        }
        if (user) {
            loadPrefs();
        }
    }, [user]);

    const handleTogglePref = async (key: keyof NotificationPreferences) => {
        const newValue = !notifPrefs[key];
        setNotifPrefs(prev => ({ ...prev, [key]: newValue }));
        
        const res = await updateNotificationPreferences({ [key]: newValue });
        if (res.success) {
            toast.success('Preferência salva!');
        } else {
            toast.error('Erro ao atualizar preferência.');
            setNotifPrefs(prev => ({ ...prev, [key]: !newValue }));
        }
    };

    const tabs: ConfigTab[] = ['gerais', 'armazenamento', 'conta'];
    const swipeHandlers = useSwipe({
        onSwipedLeft: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1]);
            }
        },
        onSwipedRight: () => {
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1]);
            }
        }
    });

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await exportUserData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `hub-labdiv-takeout-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success('Seus dados foram exportados com sucesso!');
        } catch (error) {
            toast.error('Erro ao exportar dados. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleShare = async () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        const url = `${origin}/lab?user=${user?.id}`;
        const title = profile?.full_name ? `Laboratório de ${profile.full_name} | HUB Lab-Div` : 'Meu Laboratório | HUB Lab-Div';

        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text: `Confira o laboratório de ${profile?.full_name || 'pesquisa'} no HUB Lab-Div!`,
                    url
                });
                toast.success('Link compartilhado!');
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copiado para a área de transferência!');
            } catch (err) {
                console.error('Failed to copy text:', err);
                toast.error('Não foi possível copiar o link.');
            }
        }
    };

    if (loading) {
        return (
            <MainLayoutWrapper userId={user?.id}>
                <div className="max-w-3xl mx-auto p-4 md:p-8 space-y-12 animate-pulse">
                    <div className="h-8 w-64 bg-gray-200 dark:bg-white/5 rounded-lg mb-4" />
                    <div className="h-4 w-full bg-gray-200 dark:bg-white/5 rounded-lg mb-12" />
                    <div className="h-40 w-full bg-gray-100 dark:bg-white/5 rounded-2xl" />
                </div>
            </MainLayoutWrapper>
        );
    }

    return (
        <MainLayoutWrapper userId={user?.id}>
            <div {...swipeHandlers} className="max-w-3xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
                {/* 1. SWITCH DE ABA */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] mb-6 w-fit mx-auto sm:mx-0">
                    <button
                        onClick={() => setActiveTab('gerais')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === 'gerais'
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Gerais
                    </button>
                    <button
                        onClick={() => setActiveTab('armazenamento')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === 'armazenamento'
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Database className="w-4 h-4" /> Armazenamento & Cache
                    </button>
                    <button
                        onClick={() => setActiveTab('conta')}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                            activeTab === 'conta'
                                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20'
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <ShieldCheck className="w-4 h-4" /> Conta & Privacidade
                    </button>
                </div>

                {/* TÍTULO DA PÁGINA */}
                <header className="space-y-3">
                    <h1 className="text-3xl font-bukra font-black tracking-tight text-white flex items-center gap-3 outline-none focus:outline-none">
                        <span className="material-symbols-outlined text-brand-blue text-4xl">
                            {activeTab === 'gerais' ? 'tune' : activeTab === 'armazenamento' ? 'database' : 'manage_accounts'}
                        </span>
                        {activeTab === 'gerais' && 'Configurações Gerais'}
                        {activeTab === 'armazenamento' && 'Armazenamento & Cache'}
                        {activeTab === 'conta' && 'Conta & Privacidade'}
                    </h1>
                    <p className="text-gray-400 font-medium">
                        {activeTab === 'gerais' && 'Personalize a interface de usuário, avisos de tutorial, notificações e identidade institucional do HUB.'}
                        {activeTab === 'armazenamento' && 'Gerencie o uso de armazenamento local, mídias offline e caches do dispositivo.'}
                        {activeTab === 'conta' && 'Gerencie sua identidade, privacidade e conformidade com a LGPD no HUB.'}
                    </p>
                </header>

                {/* 4. CONTEÚDO */}

                {/* ABA 1: GERAIS */}
                {activeTab === 'gerais' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* SEÇÃO 1: INTERFACE DO USUÁRIO */}
                        <section className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl overflow-hidden p-6 md:p-8 space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-brand-blue">
                                    <Sparkles size={22} className="text-brand-blue animate-pulse" />
                                    <h2 className="text-xl font-bold uppercase tracking-tight font-bukra">Interface do Usuário</h2>
                                </div>
                                <p className="text-sm text-gray-400 font-sans">
                                    Ajuste avisos de navegação, tutoriais interativos e alertas de notificações no seu dispositivo.
                                </p>
                            </div>

                            {/* 1.1 TUTORIAL INAUGURAL & COACH MARKS */}
                            <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1 max-w-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🧭</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-wide font-bukra">Aviso de Como Usar o HUB</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                                        Exibe a barra no topo da tela com atalho para o tutorial interativo pelos 3 eixos e menus da plataforma.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3 self-end sm:self-center">
                                    <button
                                        type="button"
                                        onClick={() => runOnboardingTour()}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bukra text-[10px] font-black uppercase tracking-wider border border-white/10 transition-all active:scale-95 whitespace-nowrap"
                                        title="Iniciar o tutorial interativo agora"
                                    >
                                        Iniciar Agora
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleToggleOnboarding(!showOnboarding)}
                                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                            showOnboarding ? 'bg-brand-blue' : 'bg-gray-700'
                                        }`}
                                        title={showOnboarding ? "Desativar aviso" : "Ativar aviso"}
                                    >
                                        <span
                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                showOnboarding ? 'translate-x-5' : 'translate-x-0'
                                            }`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* 1.2 NOTIFICAÇÕES PUSH */}
                            <div className="p-5 rounded-2xl bg-[#1E1E1E] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-1 max-w-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg">🔔</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-wide font-bukra">Notificações Push no Dispositivo</span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                                        Receba alertas em tempo real sobre mensagens, provas, aulas e eventos acadêmicos.
                                    </p>
                                </div>

                                <div className="self-end sm:self-center">
                                    {isSupported ? (
                                        <button
                                            onClick={isSubscribed ? unsubscribe : subscribe}
                                            className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bukra text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md ${
                                                isSubscribed
                                                    ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                                    : 'bg-brand-blue text-white shadow-brand-blue/20 hover:bg-brand-blue-hover border border-white/10'
                                            }`}
                                        >
                                            {isSubscribed ? <BellOff size={16} /> : <BellRing size={16} />}
                                            {isSubscribed ? 'Desativar Dispositivo' : 'Ativar Dispositivo'}
                                        </button>
                                    ) : (
                                        <div className="text-xs text-gray-500 font-bold bg-[#181818] px-3.5 py-2 rounded-xl border border-white/5 font-bukra uppercase tracking-wider text-[10px]">
                                            Não Suportado
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CATEGORIAS ESPECÍFICAS DE NOTIFICAÇÃO */}
                            <div className="border-t border-brand-blue/10 pt-4 space-y-3">
                                <div>
                                    <h3 className="text-xs font-black uppercase text-brand-blue tracking-widest mb-1 font-bukra">Categorias de Notificação Específicas</h3>
                                    <p className="text-xs text-gray-400 font-sans">Marque apenas os tipos de alertas que você deseja receber.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                                    {/* 1. AULAS & DISCIPLINAS */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">🎓</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Aulas & Cronograma</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Alertas de início de aulas e horários de disciplinas da grade.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_classes')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_classes ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_classes ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* 2. PROVAS & EXAMES */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">📝</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Provas & Avaliações</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Alertas e lembretes de provas e entregas acadêmicas.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_exams')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_exams ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_exams ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* 3. LEMBRETES & EVENTOS */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">🔔</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Lembretes & Eventos</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Alertas de eventos importantes, requerimentos e prazos.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_reminders')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_reminders ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_reminders ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* 4. DICAS & AVISOS */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">💡</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Dicas & Avisos (IFUSP)</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Dicas da graduação, bolsas, pesquisas e avisos do IFUSP.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_tips')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_tips ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_tips ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* 5. POSTS DE QUEM VOCÊ SEGUE */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">👥</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Publicações de Seguidos</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Notificações quando seus amigos postarem novos logs e mídias.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_follows_posts')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_follows_posts ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_follows_posts ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* 6. MENSAGENS E INTERAÇÕES */}
                                    <div className="p-4 rounded-2xl bg-[#1E1E1E] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">💬</span>
                                                <span className="text-xs font-bold text-white uppercase tracking-wide">Mensagens e DMs</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400">Alertas para mensagens diretas e interações em tempo real.</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleTogglePref('notify_dms')}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                notifPrefs.notify_dms ? 'bg-brand-blue' : 'bg-gray-700'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    notifPrefs.notify_dms ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SEÇÃO 2: IDENTIDADE INSTITUCIONAL */}
                        <section className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-brand-blue">
                                    <Palette size={22} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight font-bukra">Identidade Institucional</h2>
                                </div>
                                <p className="text-sm text-gray-400 font-sans">
                                    Selecione o tema da sua instituição de ensino. Isso alterará o símbolo de identificação na barra superior e as cores do notch/rodapé do HUB.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Option 1: IFUSP */}
                                <button
                                    onClick={() => {
                                        setInstitution('ifusp');
                                        toast.success('Tema alterado para Física USP (IFUSP)!');
                                    }}
                                    className={`relative flex items-center gap-5 p-6 rounded-2xl border text-left transition-all hover:bg-white/5 ${
                                        institution === 'ifusp'
                                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(15,71,128,0.2)]'
                                            : 'border-white/5 bg-transparent'
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                        <IFUSPLogo size={40} className="text-brand-blue" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white text-base font-bukra">Física USP (IFUSP)</h3>
                                        <p className="text-xs text-gray-400 font-sans">Logotipo oficial do IFUSP (Átomo Azul) e elementos no tom clássico azul espacial.</p>
                                    </div>
                                    {institution === 'ifusp' && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                    )}
                                </button>

                                {/* Option 2: IME-USP */}
                                <button
                                    onClick={() => {
                                        setInstitution('ime');
                                        toast.success('Tema alterado para IME-USP!');
                                    }}
                                    className={`relative flex items-center gap-5 p-6 rounded-2xl border text-left transition-all hover:bg-white/5 ${
                                        institution === 'ime'
                                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(15,71,128,0.2)]'
                                            : 'border-white/5 bg-transparent'
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                                        <Image
                                            src="/instituto_de_matemtica_e_estatstica_universidade_de_so_paulo_ime_usp_logo.jpeg"
                                            alt="IME USP Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white text-base font-bukra">Matemática e Estatística (IME-USP)</h3>
                                        <p className="text-xs text-gray-400 font-sans">Logotipo oficial do IME-USP no topo e rodapé do HUB.</p>
                                    </div>
                                    {institution === 'ime' && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                    )}
                                </button>

                                {/* Option 3: IAG-USP */}
                                <button
                                    onClick={() => {
                                        setInstitution('iag');
                                        toast.success('Tema alterado para IAG-USP!');
                                    }}
                                    className={`relative flex items-center gap-5 p-6 rounded-2xl border text-left transition-all hover:bg-white/5 ${
                                        institution === 'iag'
                                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(15,71,128,0.2)]'
                                            : 'border-white/5 bg-transparent'
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                                        <Image
                                            src="/2oj0z6xd_400x400.jpg"
                                            alt="IAG USP Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white text-base font-bukra">Astronomia e Geofísica (IAG-USP)</h3>
                                        <p className="text-xs text-gray-400 font-sans">Logotipo oficial do IAG-USP com o padrão de cores azul espacial.</p>
                                    </div>
                                    {institution === 'iag' && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                    )}
                                </button>

                                {/* Option 4: IGC-USP */}
                                <button
                                    onClick={() => {
                                        setInstitution('igc');
                                        toast.success('Tema alterado para IGC-USP!');
                                    }}
                                    className={`relative flex items-center gap-5 p-6 rounded-2xl border text-left transition-all hover:bg-white/5 ${
                                        institution === 'igc'
                                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(15,71,128,0.2)]'
                                            : 'border-white/5 bg-transparent'
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                                        <Image
                                            src="/unnamed.jpg"
                                            alt="IGC USP Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white text-base font-bukra">Geociências (IGC-USP)</h3>
                                        <p className="text-xs text-gray-400 font-sans">Logotipo oficial do Instituto de Geociências da USP.</p>
                                    </div>
                                    {institution === 'igc' && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                    )}
                                </button>

                                {/* Option 5: IO-USP */}
                                <button
                                    onClick={() => {
                                        setInstitution('io');
                                        toast.success('Tema alterado para Oceanografia (IO-USP)!');
                                    }}
                                    className={`relative flex items-center gap-5 p-6 rounded-2xl border text-left transition-all hover:bg-white/5 ${
                                        institution === 'io'
                                            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(15,71,128,0.2)]'
                                            : 'border-white/5 bg-transparent'
                                    }`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex items-center justify-center border border-white/10 shrink-0">
                                        <Image
                                            src="/image.png"
                                            alt="IO USP Logo"
                                            width={64}
                                            height={64}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white text-base font-bukra">Oceanografia (IO-USP)</h3>
                                        <p className="text-xs text-gray-400 font-sans">Logotipo oficial do Instituto Oceanográfico da USP.</p>
                                    </div>
                                    {institution === 'io' && (
                                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-brand-blue flex items-center justify-center text-white">
                                            <span className="material-symbols-outlined text-xs">check</span>
                                        </div>
                                    )}
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                {/* ABA 2: ARMAZENAMENTO & CACHE */}
                {activeTab === 'armazenamento' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        <CacheManager />
                    </div>
                )}

                {/* ABA 3: CONTA & PRIVACIDADE */}
                {activeTab === 'conta' && (
                    <div className="space-y-10 animate-in fade-in duration-500">
                        {/* SEÇÃO 0: PERFIL E COMPARTILHAMENTO */}
                        <section className="bg-brand-blue/5 border border-brand-blue/10 rounded-2xl overflow-hidden p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20">
                                        <User className="w-8 h-8 text-brand-blue" />
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold text-white font-bukra">Seu Laboratório</h2>
                                        <p className="text-sm text-gray-400 font-sans">
                                            {user 
                                                ? ((profile?.use_nickname && profile?.username) ? profile.username : (profile?.full_name || user.email))
                                                : 'Visitante (Não conectado)'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {user ? (
                                        <>
                                            <button
                                                onClick={() => setIsEditModalOpen(true)}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest font-bukra"
                                                id="btn-edit-profile"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                                Editar Perfil
                                            </button>
                                            <button
                                                onClick={handleShare}
                                                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-hover shadow-lg shadow-brand-blue/20 transition-all active:scale-95 text-xs uppercase tracking-widest border border-white/10 font-bukra"
                                                id="btn-share-profile"
                                            >
                                                <Share2 size={16} />
                                                Compartilhar
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/login"
                                            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-blue-hover shadow-lg shadow-brand-blue/20 transition-all active:scale-95 text-xs uppercase tracking-widest border border-white/10 font-bukra"
                                        >
                                            <span className="material-symbols-outlined text-sm">login</span>
                                            Entrar na Conta
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* SEÇÃO 1: PORTABILIDADE DE DADOS */}
                        <section className="bg-[#1E1E1E] border border-white/5 rounded-2xl overflow-hidden">
                            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2 max-w-md">
                                    <div className="flex items-center gap-2 text-brand-yellow">
                                        <Download size={20} />
                                        <h2 className="text-xl font-bold uppercase tracking-tight font-bukra">Portabilidade (Takeout)</h2>
                                    </div>
                                    <p className="text-sm text-gray-400 font-sans">
                                        Baixe uma cópia de todos os seus dados coletados pela plataforma HUB Lab-Div em formato JSON estruturado.
                                    </p>
                                </div>
                                <button
                                    onClick={handleExport}
                                    disabled={!user || isExporting}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-white/90 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap shadow-xl font-bukra text-xs uppercase tracking-wider"
                                >
                                    <Download size={18} />
                                    {isExporting ? 'Exportando...' : 'Exportar Meus Dados'}
                                </button>
                            </div>
                        </section>

                        {/* SEÇÃO 2: GERENCIAMENTO DE DADOS E CONTA */}
                        <section className="bg-red-500/5 border border-red-500/10 rounded-2xl overflow-hidden p-6 md:p-8 space-y-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-brand-red">
                                    <Trash2 size={20} />
                                    <h2 className="text-xl font-bold uppercase tracking-tight font-bukra">Zona de Risco & Dados</h2>
                                </div>
                                <p className="text-sm text-gray-400 font-sans">
                                    Você tem controle total sobre os seus dados. Exclua categorias específicas de atividade ou encerre sua conta permanentemente.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <button
                                    onClick={() => setIsDeletingData(true)}
                                    disabled={!user}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50 font-bukra"
                                >
                                    <Trash2 size={16} className="text-brand-red" />
                                    Limpar Dados Específicos
                                </button>
                                <button
                                    onClick={() => setIsDeleting(true)}
                                    disabled={!user}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-red-600/20 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white font-bold rounded-xl transition-all active:scale-95 text-xs uppercase tracking-widest disabled:opacity-50 font-bukra"
                                >
                                    <Trash2 size={16} />
                                    Excluir Minha Conta
                                </button>
                            </div>
                        </section>
                    </div>
                )}

                <DeleteAccountModal
                    isOpen={isDeleting}
                    onClose={() => setIsDeleting(false)}
                />

                <DeleteSpecificDataModal
                    isOpen={isDeletingData}
                    onClose={() => setIsDeletingData(false)}
                />

                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={() => {
                        window.location.reload();
                    }}
                />
            </div>
        </MainLayoutWrapper>
    );
}
