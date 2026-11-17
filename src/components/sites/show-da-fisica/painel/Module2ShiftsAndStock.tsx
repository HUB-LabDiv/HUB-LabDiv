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
import { Calendar, Users, Wrench, CheckCircle2, AlertTriangle, Clock, RefreshCw, Save } from 'lucide-react';
import { getShowShiftsAndAttendance, recordAttendance, updateExperimentMaintenance } from '@/app/actions/show-bastidores';
import { EXPERIMENTS_CATALOG } from '@/app/iniciativas/show-da-fisica/data/experiments';
import { MaintenanceStatus } from '@/types/show-da-fisica';
import toast from 'react-hot-toast';

export function Module2ShiftsAndStock() {
    const [subTab, setSubTab] = useState<'escalas' | 'estoque'>('estoque');
    const [isLoading, setIsLoading] = useState(true);
    const [shifts, setShifts] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any[]>([]);
    const [sessions, setSessions] = useState<any[]>([]);

    // Estados locais de manutenção dos experimentos
    const [maintenanceStates, setMaintenanceStates] = useState<Record<string, MaintenanceStatus>>({});
    const [maintenanceNotes, setMaintenanceNotes] = useState<Record<string, string>>({});
    const [savingSlug, setSavingSlug] = useState<string | null>(null);

    const loadData = async () => {
        setIsLoading(true);
        const res = await getShowShiftsAndAttendance();
        if (res.success) {
            setShifts(res.shifts || []);
            setAttendance(res.attendance || []);
            setSessions(res.sessions || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
        // Inicializa status dos experimentos
        const initialStatus: Record<string, MaintenanceStatus> = {};
        EXPERIMENTS_CATALOG.forEach((exp) => {
            initialStatus[exp.id] = 'disponivel';
        });
        setMaintenanceStates(initialStatus);
    }, []);

    const handleCheckIn = async (shiftSlot: string) => {
        const res = await recordAttendance(shiftSlot, 'presente');
        if (res.success) {
            toast.success('Presença registrada com sucesso!');
            loadData();
        } else {
            toast.error(res.error || 'Erro ao registrar presença');
        }
    };

    const handleSaveExperimentStatus = async (slug: string) => {
        setSavingSlug(slug);
        const status = maintenanceStates[slug] || 'disponivel';
        const notes = maintenanceNotes[slug] || '';
        const res = await updateExperimentMaintenance(slug, status, notes);
        if (res.success) {
            toast.success(`Status de "${slug}" atualizado!`);
        } else {
            toast.error(res.error || 'Erro ao salvar status');
        }
        setSavingSlug(null);
    };

    const weekdayLabels = ['', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

    return (
        <div className="space-y-8">
            {/* Header com Abas Internas em Neon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-[#002ffe] dark:text-[#38bdf8]" />
                        <span>Escalas, Frequência & Estoque de Bancada</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Coordenação das equipes de plantão, registro de presença para bolsas e status dos 24 experimentos.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSubTab('estoque')}
                        className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-none border ${
                            subTab === 'estoque'
                                ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe] border-transparent'
                                : 'bg-white dark:bg-black border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/50'
                        }`}
                    >
                        Estoque & Manutenção
                    </button>
                    <button
                        onClick={() => setSubTab('escalas')}
                        className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-none border ${
                            subTab === 'escalas'
                                ? 'bg-[#01f300] text-black shadow-[0_0_15px_#01f300] border-transparent'
                                : 'bg-white dark:bg-black border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/50'
                        }`}
                    >
                        Escalas & Frequência
                    </button>
                </div>
            </div>

            {/* ABA 1: CONTROLE DE ESTOQUE E MANUTENÇÃO DOS EXPERIMENTOS */}
            {subTab === 'estoque' && (
                <div className="space-y-6">
                    <div className="p-4 bg-white dark:bg-black neon-border-blue text-xs text-gray-800 dark:text-gray-200 flex items-center gap-3 rounded-none">
                        <Wrench className="w-4 h-4 shrink-0 text-[#002ffe] dark:text-[#38bdf8]" />
                        <span>
                            Aparatos marcados como <strong className="neon-text-yellow">Manutenção</strong> ou <strong className="neon-text-red">Indisponível</strong> são sinalizados automaticamente na ferramenta pública <code className="font-mono text-[#01f300]">Monte seu Show</code>, evitando escolhas conflitantes no agendamento das escolas.
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {EXPERIMENTS_CATALOG.map((exp) => {
                            const currentStatus = maintenanceStates[exp.id] || 'disponivel';
                            const isSaving = savingSlug === exp.id;
                            const cardBorder =
                                currentStatus === 'disponivel'
                                    ? 'neon-border-green'
                                    : currentStatus === 'manutencao'
                                    ? 'neon-border-yellow'
                                    : 'neon-border-red';

                            return (
                                <div
                                    key={exp.id}
                                    className={`p-5 bg-white dark:bg-black ${cardBorder} rounded-none space-y-3 flex flex-col justify-between`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h4 className="text-sm font-black uppercase text-gray-950 dark:text-white leading-tight">
                                                    {exp.title}
                                                </h4>
                                                <span className="text-[10px] font-mono text-gray-500 dark:text-gray-400 block mt-0.5">
                                                    {exp.concept}
                                                </span>
                                            </div>

                                            <select
                                                value={currentStatus}
                                                onChange={(e) =>
                                                    setMaintenanceStates((prev) => ({
                                                        ...prev,
                                                        [exp.id]: e.target.value as MaintenanceStatus,
                                                    }))
                                                }
                                                className={`text-[10px] font-mono font-bold px-2 py-1 border uppercase rounded-none focus:outline-none bg-white dark:bg-black ${
                                                    currentStatus === 'disponivel'
                                                        ? 'border-[#01f300] text-[#009900] dark:text-[#01f300]'
                                                        : currentStatus === 'manutencao'
                                                        ? 'border-[#FFCC00] text-[#b45309] dark:text-[#FFCC00]'
                                                        : 'border-[#f60011] text-[#f60011]'
                                                }`}
                                            >
                                                <option value="disponivel">Disponível</option>
                                                <option value="manutencao">Manutenção</option>
                                                <option value="indisponivel">Indisponível</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[9px] font-mono font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                                                Notas da Oficina / Reparo
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ex: Troca de fusível / aguardando insumo"
                                                value={maintenanceNotes[exp.id] || ''}
                                                onChange={(e) =>
                                                    setMaintenanceNotes((prev) => ({
                                                        ...prev,
                                                        [exp.id]: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-2.5 py-1.5 rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-xs text-gray-900 dark:text-white focus:outline-none focus:border-[#002ffe]"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleSaveExperimentStatus(exp.id)}
                                        disabled={isSaving}
                                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-none bg-white dark:bg-black border border-current text-[#002ffe] dark:text-[#38bdf8] hover:bg-[#002ffe] hover:text-white font-mono font-bold text-[10px] uppercase tracking-wider transition-colors disabled:opacity-50"
                                    >
                                        <Save className="w-3.5 h-3.5" />
                                        <span>{isSaving ? 'Gravando...' : 'Salvar Aparato'}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ABA 2: ESCALAS SEMANAIS, REGISTRO DE PRESENÇA E PRÓXIMAS SESSÕES */}
            {subTab === 'escalas' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Coluna 1: Check-in de Plantão & Histórico de Frequência */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Caixa de Check-in em Neon Verde */}
                        <div className="p-6 bg-white dark:bg-black neon-border-green rounded-none space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-[#01f300]" />
                                    <span>Check-in de Plantão // Registro de Presença</span>
                                </h3>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#01f300] px-2 py-0.5 border border-[#01f300]">
                                    Auditório Volta
                                </span>
                            </div>

                            <p className="text-xs text-gray-600 dark:text-gray-300 font-sans">
                                Registre a sua presença no show de hoje para alimentar o controle de frequência de bolsas da USP (PRCEU / PUB).
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <button
                                    onClick={() => handleCheckIn('manha')}
                                    className="py-3 px-4 bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] hover:bg-[#01f300] hover:text-black font-mono font-black text-xs uppercase tracking-wider transition-all rounded-none"
                                >
                                    Check-in Manhã (10h)
                                </button>
                                <button
                                    onClick={() => handleCheckIn('tarde')}
                                    className="py-3 px-4 bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] hover:bg-[#002ffe] hover:text-white font-mono font-black text-xs uppercase tracking-wider transition-all rounded-none"
                                >
                                    Check-in Tarde (14h)
                                </button>
                            </div>
                        </div>

                        {/* Histórico Recente de Frequência */}
                        <div className="p-6 bg-white dark:bg-black neon-border-blue rounded-none space-y-4">
                            <h3 className="text-sm font-black uppercase text-gray-950 dark:text-white flex items-center justify-between">
                                <span>Frequência dos Bolsistas // Registros Recentes</span>
                                <Users className="w-4 h-4 text-[#002ffe] dark:text-[#38bdf8]" />
                            </h3>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                {attendance.map((att) => (
                                    <div
                                        key={att.id}
                                        className="p-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono"
                                    >
                                        <div className="space-y-0.5">
                                            <span className="font-bold text-gray-900 dark:text-white block">
                                                {att.monitor?.name || 'Monitor IFUSP'}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {att.shift_date} &bull; {att.shift_slot?.toUpperCase()} &bull; {att.notes || 'Sem observações'}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-[#01f300]">
                                            Presente
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quadro de Escalas Semanais */}
                        <div className="p-6 bg-white dark:bg-black neon-border-yellow rounded-none space-y-4">
                            <h3 className="text-sm font-black uppercase text-gray-950 dark:text-white">
                                Quadro de Escalas Semanais da Equipe
                            </h3>
                            <div className="space-y-2">
                                {shifts.map((s) => (
                                    <div
                                        key={s.id}
                                        className="p-3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono"
                                    >
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {weekdayLabels[s.weekday]} &bull; {s.shift_slot?.toUpperCase()}
                                        </span>
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {s.monitor?.name || 'Monitor'} <span className="text-[#FFCC00]">({s.role_in_shift})</span>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2: Agenda de Escolas Agendadas */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="p-6 bg-white dark:bg-black neon-border-red rounded-none space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-black uppercase text-gray-950 dark:text-white">
                                    Próximas Sessões Agendadas
                                </h3>
                                <span className="text-[10px] font-mono font-bold uppercase text-[#f60011]">
                                    Ao Vivo
                                </span>
                            </div>

                            <div className="space-y-3">
                                {sessions.map((sess) => (
                                    <div
                                        key={sess.id}
                                        className="p-4 bg-white dark:bg-black border border-gray-200 dark:border-white/15 space-y-2 text-xs"
                                    >
                                        <div className="flex items-center justify-between font-mono">
                                            <span className="font-bold text-[#f60011]">
                                                #{sess.booking_code}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                                {sess.scheduled_date || 'Data a confirmar'}
                                            </span>
                                        </div>
                                        <p className="font-black text-gray-950 dark:text-white uppercase">
                                            {sess.school_name}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400 text-[11px] font-mono">
                                            Responsável: {sess.teacher_name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

