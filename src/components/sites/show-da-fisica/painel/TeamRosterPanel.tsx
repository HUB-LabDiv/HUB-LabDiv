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

import React, { useState, useEffect } from 'react';
import { Users, UserPlus, GraduationCap } from 'lucide-react';
import { getInitiativeTeamMembers, addMemberToInitiative } from '@/app/actions/show-bastidores';
import { InitiativeTeamRole } from '@/types/show-da-fisica';
import toast from 'react-hot-toast';

export function TeamRosterPanel() {
    const [team, setTeam] = useState<InitiativeTeamRole[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetProfileId, setTargetProfileId] = useState('');
    const [subRole, setSubRole] = useState<'coordenador' | 'apresentador' | 'apoio_palco' | 'oficina_manutencao' | 'divulgacao'>('apresentador');
    const [roleTitle, setRoleTitle] = useState('');

    const loadData = async () => {
        setIsLoading(true);
        const res = await getInitiativeTeamMembers();
        if (res.success && res.data) {
            setTeam(res.data as InitiativeTeamRole[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetProfileId.trim()) return;

        const res = await addMemberToInitiative(targetProfileId.trim(), subRole, roleTitle.trim() || undefined);
        if (res.success) {
            toast.success('Membro adicionado à equipe com sucesso!');
            setIsModalOpen(false);
            setTargetProfileId('');
            setRoleTitle('');
            loadData();
        } else {
            toast.error(res.error || 'Erro ao adicionar membro');
        }
    };

    const roleLabels = {
        coordenador: 'Coordenação Docente',
        apresentador: 'Apresentador de Palco',
        apoio_palco: 'Apoio de Palco / Mediador',
        oficina_manutencao: 'Técnico de Oficina & Manutenção',
        divulgacao: 'Comunicação & Mídia',
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#01f300]" />
                        <span>Equipe & Credenciamento de Monitores</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Corpo docente, monitores bolsistas e técnicos com permissão de acesso aos bastidores e vitrine pública.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] hover:bg-[#01f300] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Adicionar Membro</span>
                </button>
            </div>

            {/* Lista dos Membros da Equipe */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {team.map((member) => (
                    <div
                        key={member.id}
                        className="p-6 rounded-none bg-white dark:bg-black neon-border-green flex items-start gap-4 shadow-lg"
                    >
                        <div className="w-12 h-12 rounded-none bg-black neon-border-green text-[#01f300] flex items-center justify-center font-bold shrink-0">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase border border-[#01f300] text-[#009900] dark:text-[#01f300]">
                                {roleLabels[member.sub_role]}
                            </span>
                            <h4 className="text-sm font-black uppercase text-gray-950 dark:text-white">
                                {member.profile?.name || 'Membro do Show'}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-sans">
                                {member.role_title || member.profile?.email}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Adicionar Membro */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-black rounded-none neon-border-green p-6 sm:p-8 shadow-2xl space-y-5">
                        <h3 className="text-base font-black uppercase tracking-wider text-gray-950 dark:text-white">
                            Credenciar Novo Membro da Equipe
                        </h3>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">ID do Perfil no HUB (UUID)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="UUID do usuário cadastrado"
                                    value={targetProfileId}
                                    onChange={(e) => setTargetProfileId(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#01f300]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Função no Show</label>
                                <select
                                    value={subRole}
                                    onChange={(e: any) => setSubRole(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                >
                                    <option value="coordenador">Coordenador Docente</option>
                                    <option value="apresentador">Apresentador de Palco</option>
                                    <option value="apoio_palco">Apoio de Palco / Mediador</option>
                                    <option value="oficina_manutencao">Técnico de Oficina & Manutenção</option>
                                    <option value="divulgacao">Comunicação & Divulgação</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Título Personalizado (Opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: Monitor Chefe / Bolsista PUB"
                                    value={roleTitle}
                                    onChange={(e) => setRoleTitle(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#01f300]"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-xs font-mono font-bold uppercase text-gray-500 hover:text-white"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-none bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] hover:bg-[#01f300] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    Credenciar Membro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
