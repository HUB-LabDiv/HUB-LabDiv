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

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut } from '@/app/actions/auth';

export default function AdminLayoutClient({
    children,
    role
}: {
    children: React.ReactNode;
    role: string;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Apply admin-page class to body for special background styling
    useEffect(() => {
        document.body.classList.add('admin-page');
        return () => document.body.classList.remove('admin-page');
    }, []);

    const navLinks = [
        { name: 'Torre de Controle', href: '/admin', icon: 'security' },
        { name: 'Moderação do Eixo Social', href: '/admin/moderacao', icon: 'verified_user' },
        { name: 'Moderação do Eixo de Informação', href: '/admin/cgif', icon: 'admin_panel_settings' },
        { name: 'Moderação do Eixo de Ferramentas', href: '/admin/ferramentas', icon: 'construction' },
        { name: 'Central de Notificações', href: '/admin/notificacoes', icon: 'notifications' },
        { name: 'Aprovação de Perfis', href: '/admin/profiles', icon: 'manage_accounts' },
        { name: 'Central de Denúncias & Reports', href: '/admin/reports', icon: 'flag' },
        { name: 'Telemetria do Sistema', href: '/admin/telemetria', icon: 'query_stats' },
        { name: 'Configurações Admin', href: '/admin/config', icon: 'settings', adminOnly: true },
    ];

    const filteredLinks = navLinks.filter(link => !link.adminOnly || role === 'admin');


    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authLogin, setAuthLogin] = useState('');
    const [authSenha, setAuthSenha] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const handleManualAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        const { loginAdminBypass } = await import('@/app/actions/admin');
        const res = await loginAdminBypass(authLogin, authSenha);
        if (res.success) {
            const toast = (await import('react-hot-toast')).default;
            toast.success('Autenticação realizada! Redirecionando...');
            setIsAuthModalOpen(false);
            window.location.href = '/';
        } else {
            const toast = (await import('react-hot-toast')).default;
            toast.error(res.error || 'Erro ao autenticar');
        }
        setAuthLoading(false);
    };

    return (
        <div className="bg-transparent text-gray-900 dark:text-gray-100 font-sans antialiased min-h-screen flex flex-col md:flex-row overflow-hidden">
            {/* Mobile Header */}
            <div 
                className="md:hidden bg-white/95 dark:bg-background-dark/95 backdrop-blur-md text-gray-900 dark:text-white px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-white/10 sticky top-0 z-[60] transition-colors"
                style={{ paddingTop: 'calc(0.75rem + env(safe-area-inset-top, 0px))' }}
            >
                <div className="flex items-center gap-2">
                    <Link 
                        href="/"
                        className="size-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white transition-all active:scale-95"
                        aria-label="Sair do Admin"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                    </Link>
                    <div className="font-bold text-base flex items-center gap-2">
                        <Image
                            src="/icone-HUBLabDiv.svg"
                            alt="HUB LabDiv Logo"
                            width={24}
                            height={24}
                            className="w-6 h-6 object-contain"
                        />
                        Admin<span className="text-[#FFCC00]">Panel</span>
                    </div>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="size-9 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700/80 rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white transition-all active:scale-95 focus:outline-none"
                    aria-label="Toggle Menu"
                >
                    <span className="material-symbols-outlined text-[20px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
                </button>
            </div>

            {/* Quick Access Icon Scrollbar (Mobile Only) */}
            <div 
                className="md:hidden bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar flex gap-2 px-4 py-2 sticky z-40 transition-colors"
                style={{ top: 'calc(3.75rem + env(safe-area-inset-top, 0px))' }}
            >
                {filteredLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            prefetch={true}
                            className={`flex-shrink-0 size-9 flex items-center justify-center rounded-xl transition-all border ${
                                isActive 
                                    ? 'bg-[#0F4780] dark:bg-[#0055ff] border-[#0F4780]/50 dark:border-[#0055ff]/50 text-white shadow-lg shadow-[#0F4780]/20 dark:shadow-[#0055ff]/20' 
                                    : 'bg-gray-100 dark:bg-[#1e1e1e] border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                            }`}
                            title={link.name}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {link.icon}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <aside 
                className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex w-full md:w-72 bg-white dark:bg-[#1E1E1E] border-r border-gray-200 dark:border-white/10 flex-col justify-between shrink-0 fixed md:sticky inset-x-0 bottom-0 z-50 md:z-40 transition-all duration-300 shadow-xl dark:shadow-2xl overflow-hidden`}
                style={{ top: 'var(--admin-sidebar-top)', height: 'var(--admin-sidebar-height)' }}
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#0F4780]/10 dark:bg-[#0055ff]/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-brand-red/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

                <div className="flex flex-col gap-4 p-6 relative z-10 flex-1 overflow-hidden">
                    <div className="hidden md:flex items-center gap-3 pb-6 border-b border-gray-200 dark:border-white/10 transition-colors">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="relative w-10 h-10 flex-shrink-0">
                                <Image
                                    src="/icone-HUBLabDiv.svg"
                                    alt="HUB LabDiv Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <h1 className="text-gray-900 dark:text-white text-lg font-bold font-bukra leading-tight truncate">Admin<span className="text-[#FFCC00]">Panel</span></h1>
                                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-semibold mt-0.5 font-open-sans">Lab-Div (BETA)</p>
                            </div>
                        </Link>
                    </div>

                    <nav className="flex flex-col gap-1.5 overflow-y-auto flex-1 no-scrollbar py-2">
                        {filteredLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    prefetch={true}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all group ${isActive
                                        ? 'bg-[#0F4780] dark:bg-[#0055ff] border border-[#0F4780]/50 dark:border-[#0055ff]/50 text-white shadow-lg shadow-[#0F4780]/20 dark:shadow-[#0055ff]/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border border-transparent'
                                        }`}
                                >
                                    <span className={`material-symbols-outlined text-[20px] transition-colors ${isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
                                        {link.icon}
                                    </span>
                                    <span className="text-sm font-medium font-open-sans">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-white/10 transition-colors relative z-10 bg-white dark:bg-[#1E1E1E] flex flex-col gap-2">
                    <button
                        onClick={async () => {
                            try {
                                const { supabase } = await import('@/lib/supabase/client');
                                await supabase.auth.signOut();
                            } catch {}
                            document.cookie = 'admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            document.cookie = 'admin_bypass=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            document.cookie = 'admin_impersonating_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
                            await signOut();
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-medium text-gray-600 dark:text-gray-400 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-brand-red transition-colors border border-transparent group focus:outline-none cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[20px] text-gray-400 dark:text-gray-500 group-hover:text-red-600 dark:group-hover:text-brand-red transition-colors">logout</span>
                        <span className="font-open-sans">Sair do Painel</span>
                    </button>
                </div>
            </aside>

            {/* Modal Autenticar no Adm */}
            {isAuthModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
                        <button 
                            onClick={() => setIsAuthModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                <span className="material-symbols-outlined text-[#FFCC00] text-2xl">key</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-bukra">Autenticar no Adm</h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-open-sans">Entre por e-mail e senha ou pelas credenciais mestre de bypass</p>
                        </div>

                        <form onSubmit={handleManualAuth} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1 font-bukra">E-mail ou Login</label>
                                <input 
                                    type="text" 
                                    value={authLogin} 
                                    onChange={(e) => setAuthLogin(e.target.value)}
                                    placeholder="hublabdiv@gmail.com, adm ou labdiv"
                                    className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-[#0F4780] dark:focus:border-[#FFCC00] transition-colors text-sm font-open-sans"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1 font-bukra">Senha</label>
                                <input 
                                    type="password" 
                                    value={authSenha} 
                                    onChange={(e) => setAuthSenha(e.target.value)}
                                    placeholder="Sua senha..."
                                    className="w-full bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-[#0F4780] dark:focus:border-[#FFCC00] transition-colors text-sm font-open-sans"
                                    required
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={authLoading}
                                className="w-full py-3.5 bg-[#FFCC00] text-[#0F4780] font-black uppercase tracking-wider text-xs rounded-xl hover:brightness-105 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 font-bukra cursor-pointer shadow-md"
                            >
                                {authLoading ? (
                                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-[18px]">lock_open</span>
                                )}
                                Confirmar Autenticação
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <main 
                className="flex-1 overflow-y-auto relative bg-transparent"
                style={{ height: 'var(--admin-sidebar-height)' }}
            >
                {children}
            </main>
        </div>
    );
}
