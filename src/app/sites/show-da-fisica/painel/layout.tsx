import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { createServerSupabase } from '@/lib/supabase/server';
import { getAdminSessionRole } from '@/app/actions/admin';
import { Shield, ArrowLeft, Radio, Lock, LogIn, Sparkles, Terminal } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Bastidores & Gestão | Show de Física IFUSP',
    description: 'Painel operacional restrito para monitores, coordenadores e técnicos do Show de Física.',
};

export default async function PainelBastidoresLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const host = headersList.get('host') || '';

    // 1. Checa autenticação administrativa HMAC (Torre de Controle)
    const adminSession = await getAdminSessionRole();
    let isStaff = adminSession.role === 'admin' || adminSession.role === 'moderator';

    // 2. Checa sessão do Supabase e permissão de iniciativa
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    let isMember = false;
    let userName = 'Monitor IFUSP';

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('name, role, member_initiatives')
            .eq('id', user.id)
            .single();

        if (profile?.name) userName = profile.name;
        if (profile?.role === 'admin' || profile?.role === 'moderator') isStaff = true;
        if (Array.isArray(profile?.member_initiatives) && profile.member_initiatives.includes('show_da_fisica')) {
            isMember = true;
        }
    }

    const isDev = process.env.NODE_ENV !== 'production';
    const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
    const isAuthorized = isStaff || isMember || isDev || isLocal;

    // Se não estiver autorizado (em produção), exibe o Gatekeeper Neon em vez de redirecionar silenciosamente
    if (!isAuthorized) {
        const loginOrigin = host.includes('localhost')
            ? `http://localhost:${host.split(':')[1] || '3000'}`
            : 'https://hublabdiv.com.br';
        const targetNext = host.startsWith('showdefisica.')
            ? `https://showdefisica.hublabdiv.com.br/painel`
            : `/sites/show-da-fisica/painel`;
        const loginUrl = `${loginOrigin}/login?next=${encodeURIComponent(targetNext)}`;

        return (
            <div className="w-full min-h-[calc(100vh-140px)] bg-white dark:bg-black flex items-center justify-center p-4 sm:p-8">
                <div className="max-w-xl w-full p-8 sm:p-12 bg-white dark:bg-black neon-border-red rounded-none space-y-8 shadow-2xl text-center">
                    <div className="w-16 h-16 mx-auto bg-black neon-border-red flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#f60011]" />
                    </div>

                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#f60011] block">
                            [ ACESSO RESTRITO // CREDENCIAL NECESSÁRIA ]
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-gray-950 dark:text-white">
                            Bastidores do Show de Física
                        </h1>
                        <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                            Este painel é de uso exclusivo dos monitores, bolsistas, equipe técnica e coordenação do Show de Física IFUSP para gestão de escalas, frequências, objetivos e estoque da bancada.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-white/10">
                        <a
                            href={loginUrl}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] font-black text-xs uppercase tracking-widest hover:bg-[#01f300] hover:text-black hover:shadow-[0_0_20px_#01f300] transition-all rounded-none"
                        >
                            <LogIn className="w-4 h-4" />
                            <span>Entrar com Conta do HUB</span>
                        </a>

                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] font-bold text-xs uppercase tracking-widest hover:bg-[#002ffe] hover:text-white transition-all rounded-none"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Voltar ao Início</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-[calc(100vh-140px)] bg-white dark:bg-black text-gray-900 dark:text-white">
            {/* Top Bar de Status Operacional Neon dos Bastidores */}
            <div className="bg-white dark:bg-black border-b-2 neon-border-green px-4 sm:px-6 py-3">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#01f300] animate-pulse shadow-[0_0_8px_#01f300]" />
                        <div className="flex items-center gap-2">
                            <span className="font-black uppercase tracking-wider text-gray-950 dark:text-white">
                                <span className="neon-text-green">SF-OPS</span> // Bastidores do Show
                            </span>
                            <span className="hidden md:inline text-gray-500 font-mono text-[11px]">
                                &bull; Auditório Alessandro Volta &bull; IFUSP
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                        {isDev && (
                            <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-[#FFCC00] border border-yellow-500/30 font-bold uppercase tracking-wider text-[10px]">
                                Preview de Desenvolvimento
                            </span>
                        )}

                        <span className="hidden sm:inline text-gray-600 dark:text-gray-400 font-mono">
                            Operador: <strong className="text-gray-900 dark:text-white">{userName}</strong>
                        </span>

                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] font-bold text-[10px] uppercase tracking-wider hover:bg-[#002ffe] hover:text-white transition-all rounded-none"
                        >
                            <ArrowLeft className="w-3 h-3" />
                            <span>Site Público</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {children}
            </div>
        </div>
    );
}

