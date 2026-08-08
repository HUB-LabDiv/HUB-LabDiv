'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { loginAdminBypass } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AdminLoginGate() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await loginAdminBypass(login, senha);
        if (res.success) {
            toast.success('Acesso liberado!');
            window.location.href = '/admin';
        } else {
            toast.error(res.error || 'Erro ao validar credenciais');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
            <div className="bg-background-dark/50 border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl backdrop-blur-sm">
                <div className="text-center mb-8">
                    <div className="flex justify-center items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-[#0055ff] text-4xl">security</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h1>
                    <p className="text-gray-400 text-sm">Painel Administrativo do Lab-Div</p>
                </div>

                <div className="space-y-4 mb-8">
                    <Link href="/login" className="w-full flex items-center justify-center gap-2 bg-[#0055ff] hover:bg-brand-blue text-white p-3 rounded-xl transition-colors font-medium">
                        <span className="material-symbols-outlined text-[20px]">login</span>
                        Ir para Página de Login Padrão
                    </Link>
                </div>

                <div className="relative flex py-4 items-center mb-6">
                    <div className="flex-grow border-t border-gray-800"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-500 text-xs font-semibold uppercase">Ou acesso manual</span>
                    <div className="flex-grow border-t border-gray-800"></div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Login</label>
                        <input
                            type="text"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full bg-neutral-900 border border-gray-800 text-white p-3 rounded-xl focus:outline-none focus:border-[#0055ff] transition-colors"
                            placeholder="Digite seu login..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Senha</label>
                        <input
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full bg-neutral-900 border border-gray-800 text-white p-3 rounded-xl focus:outline-none focus:border-[#0055ff] transition-colors"
                            placeholder="Digite sua senha..."
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">key</span>
                        )}
                        Autenticar
                    </button>
                </form>
            </div>
        </div>
    );
}
