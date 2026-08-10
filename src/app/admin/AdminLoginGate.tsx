'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { loginAdminBypass } from '@/app/actions/admin';
import { toast } from 'react-hot-toast';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre sob os termos da AGPLv3.
 */

export default function AdminLoginGate() {
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBypass, setShowBypass] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const res = await loginAdminBypass(login, senha);
        if (res.success) {
            toast.success('Acesso liberado!');
            window.location.href = '/admin';
        } else {
            toast.error(res.error || 'Credenciais inválidas');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-4">
            <div className="bg-[#1a1a1a] border border-gray-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
                {/* Logo / Ícone */}
                <div className="flex flex-col items-center mb-8">
                    <div className="size-16 bg-brand-blue/10 border border-brand-blue/20 rounded-2xl flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-brand-blue text-4xl">shield_lock</span>
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tight">Acesso Restrito</h1>
                    <p className="text-gray-500 text-sm mt-1 text-center">Painel Administrativo LabDiv</p>
                </div>

                {/* Botão login Supabase */}
                <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-3 bg-brand-blue hover:bg-brand-blue/90 text-white px-6 py-3.5 rounded-2xl transition-colors font-black uppercase tracking-widest text-sm shadow-lg shadow-brand-blue/20 mb-4"
                >
                    <span className="material-symbols-outlined text-[20px]">login</span>
                    Entrar com conta LabDiv
                </Link>

                {/* Divisor */}
                <div className="relative flex items-center gap-4 my-6">
                    <div className="flex-1 border-t border-gray-800" />
                    <button
                        type="button"
                        onClick={() => setShowBypass(!showBypass)}
                        className="text-[10px] font-black text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors whitespace-nowrap"
                    >
                        acesso manual
                    </button>
                    <div className="flex-1 border-t border-gray-800" />
                </div>

                {/* Formulário de bypass — expansível */}
                {showBypass && (
                    <form onSubmit={handleLogin} className="space-y-3">
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Login</label>
                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                className="w-full bg-neutral-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue/50 transition-colors text-sm"
                                placeholder="Digite seu login..."
                                required
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Senha</label>
                            <input
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="w-full bg-neutral-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand-blue/50 transition-colors text-sm"
                                placeholder="Digite sua senha..."
                                required
                                autoComplete="current-password"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
                        >
                            {loading ? (
                                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                            ) : (
                                <span className="material-symbols-outlined text-[18px]">key</span>
                            )}
                            {loading ? 'Autenticando...' : 'Autenticar'}
                        </button>
                    </form>
                )}

                <p className="text-gray-700 text-[10px] uppercase tracking-widest text-center mt-6">
                    Apenas administradores têm acesso.
                </p>
            </div>
        </div>
    );
}
