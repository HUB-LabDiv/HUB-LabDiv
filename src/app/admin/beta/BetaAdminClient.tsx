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
import { approveBetaAccess } from '@/app/actions/beta';
import { toast } from 'react-hot-toast';
import { Smartphone, Check, CheckCircle2, User, Mail, Search } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BetaAdminClientProps {
    initialUsers: any[];
}

export function BetaAdminClient({ initialUsers }: BetaAdminClientProps) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [processingId, setProcessingId] = useState<string | null>(null);

    const filteredUsers = users.filter(u => 
        u.play_store_email.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (u.profiles?.name && u.profiles.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleApprove = async (id: string, email: string) => {
        setProcessingId(id);
        const res = await approveBetaAccess(id, email);
        if (res.success) {
            toast.success('Acesso aprovado e e-mail enviado!');
            setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'approved', invited_at: new Date().toISOString() } : u));
        } else {
            toast.error(res.error || 'Erro ao aprovar.');
        }
        setProcessingId(null);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-white/10">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-xs font-bold uppercase tracking-wide mb-4">
                        <Smartphone className="w-4 h-4" />
                        App Beta Program
                    </div>
                    <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-2 text-gray-900 dark:text-white">
                        Acessos <span className="text-brand-blue">Beta</span>
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 font-medium">
                        Gerencie as inscrições do aplicativo Android e notifique os usuários após adicioná-los no Google Play Console.
                    </p>
                </div>
                
                <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Buscar por e-mail ou nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80 pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm font-medium focus:outline-none focus:border-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-[#121212] border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Usuário</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">E-mail Play Store</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Pesquisa UX</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Data</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-zinc-400">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-sm font-medium text-gray-500">
                                        Nenhuma inscrição encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.profiles?.avatar_url ? (
                                                    <img src={user.profiles.avatar_url} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                                        {user.profiles?.name || 'Sem Nome'}
                                                    </div>
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                        {user.profiles?.user_category || 'Desconhecido'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {user.play_store_email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.survey_completed ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    Sim
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs font-bold">
                                                    Não
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.status === 'pending' ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
                                                    Pendente
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded bg-brand-blue/10 text-brand-blue text-[10px] font-black uppercase tracking-widest border border-brand-blue/20">
                                                    Aprovado
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-xs font-medium text-gray-500">
                                            {format(new Date(user.created_at), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.status === 'pending' ? (
                                                <button
                                                    onClick={() => handleApprove(user.id, user.play_store_email)}
                                                    disabled={processingId === user.id}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === user.id ? (
                                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Notificar
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400">
                                                    Enviado em {format(new Date(user.invited_at!), "dd/MM/yy")}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
