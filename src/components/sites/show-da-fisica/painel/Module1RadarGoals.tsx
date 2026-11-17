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
import { Target, CheckSquare, Plus, Clock, AlertCircle, ArrowUpRight, BarChart3 } from 'lucide-react';
import { getShowGoalsAndTasks, upsertGoalOrTask } from '@/app/actions/show-bastidores';
import { InitiativeGoalTask } from '@/types/show-da-fisica';
import toast from 'react-hot-toast';

export function Module1RadarGoals() {
    const [items, setItems] = useState<InitiativeGoalTask[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState<'roteiro_revisao' | 'roteiro_novo' | 'manutencao' | 'atendimento' | 'divulgacao' | 'geral'>('geral');
    const [newKind, setNewKind] = useState<'goal' | 'task'>('task');
    const [newPriority, setNewPriority] = useState<'baixa' | 'media' | 'alta' | 'critica'>('media');

    const loadData = async () => {
        setIsLoading(true);
        const res = await getShowGoalsAndTasks();
        if (res.success && res.data) {
            setItems(res.data as InitiativeGoalTask[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        const res = await upsertGoalOrTask({
            title: newTitle.trim(),
            category: newCategory,
            kind: newKind,
            priority: newPriority,
            status: 'todo',
            progress_percent: 0,
        });

        if (res.success) {
            toast.success('Meta/Tarefa cadastrada com sucesso!');
            setIsModalOpen(false);
            setNewTitle('');
            loadData();
        } else {
            toast.error(res.error || 'Erro ao salvar meta');
        }
    };

    const handleStatusChange = async (id: string, newStatus: 'todo' | 'in_progress' | 'review' | 'done') => {
        const item = items.find((i) => i.id === id);
        if (!item) return;

        const res = await upsertGoalOrTask({
            ...item,
            status: newStatus,
            progress_percent: newStatus === 'done' ? 100 : item.progress_percent,
        });

        if (res.success) {
            setItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, status: newStatus, progress_percent: newStatus === 'done' ? 100 : i.progress_percent } : i))
            );
            toast.success('Status atualizado');
        }
    };

    const goals = items.filter((i) => i.kind === 'goal');
    const tasks = items.filter((i) => i.kind === 'task');

    return (
        <div className="space-y-10">
            {/* Header do Módulo com Estilo Neon Vermelho */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-[#f60011]" />
                        <span>Radar de Objetivos & Atividades da Bancada</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Acompanhamento semestral de metas operacionais e kanban de melhorias nos roteiros do Show de Física.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white dark:bg-black neon-border-red text-[#f60011] hover:bg-[#f60011] hover:text-white dark:hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Nova Meta / Tarefa</span>
                </button>
            </div>

            {/* Metas Semestrais em Destaque (Progresso) com Borda Neon */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {goals.length === 0 ? (
                    <div className="md:col-span-3 p-8 rounded-none border border-dashed border-gray-300 dark:border-white/15 text-center text-xs font-mono text-gray-500">
                        Nenhuma meta semestral cadastrada ainda.
                    </div>
                ) : (
                    goals.map((goal) => (
                        <div key={goal.id} className="p-6 rounded-none bg-white dark:bg-black neon-border-red space-y-4 shadow-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#f60011] px-2 py-0.5 border border-[#f60011]">
                                    {goal.category}
                                </span>
                                <span className="text-sm font-mono font-black text-gray-900 dark:text-white">
                                    {goal.progress_percent}%
                                </span>
                            </div>
                            <h4 className="text-sm font-black uppercase tracking-wide text-gray-950 dark:text-white leading-snug">
                                {goal.title}
                            </h4>
                            <div className="w-full bg-gray-200 dark:bg-white/10 h-2.5 rounded-none overflow-hidden border border-current">
                                <div
                                    className="bg-[#f60011] h-full shadow-[0_0_10px_#f60011] transition-all duration-500"
                                    style={{ width: `${goal.progress_percent}%` }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Kanban de Tarefas Neon */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {(['todo', 'in_progress', 'review', 'done'] as const).map((colStatus) => {
                    const colTasks = tasks.filter((t) => t.status === colStatus);
                    const colLabels = {
                        todo: 'A Fazer',
                        in_progress: 'Em Andamento',
                        review: 'Em Revisão',
                        done: 'Concluído',
                    };
                    const colBorder =
                        colStatus === 'todo'
                            ? 'border-gray-300 dark:border-white/20'
                            : colStatus === 'in_progress'
                            ? 'border-[#002ffe]'
                            : colStatus === 'review'
                            ? 'border-[#FFCC00]'
                            : 'border-[#01f300]';

                    return (
                        <div key={colStatus} className={`rounded-none border ${colBorder} bg-white dark:bg-black p-4 flex flex-col justify-between min-h-[320px]`}>
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-white/10 mb-4">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                                    {colLabels[colStatus]}
                                </span>
                                <span className="px-2 py-0.5 rounded-none text-[10px] font-mono font-bold border border-current">
                                    {colTasks.length}
                                </span>
                            </div>

                            <div className="space-y-3 flex-1">
                                {colTasks.map((t) => (
                                    <div
                                        key={t.id}
                                        className="p-3.5 rounded-none border border-gray-200 dark:border-white/15 bg-white dark:bg-black space-y-2 group hover:border-[#f60011] transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-mono uppercase font-bold text-gray-500">
                                                {t.category}
                                            </span>
                                            <span
                                                className={`text-[9px] font-mono px-1.5 py-0.2 rounded-none font-bold uppercase border ${
                                                    t.priority === 'critica'
                                                        ? 'border-red-500 text-red-500'
                                                        : t.priority === 'alta'
                                                        ? 'border-yellow-500 text-yellow-500'
                                                        : 'border-blue-500 text-blue-500'
                                                }`}
                                            >
                                                {t.priority}
                                            </span>
                                        </div>

                                        <p className="text-xs font-bold text-gray-950 dark:text-white leading-snug">
                                            {t.title}
                                        </p>

                                        {/* Ações de Mudar Status */}
                                        <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-gray-400">
                                            {colStatus !== 'done' && (
                                                <button
                                                    onClick={() => handleStatusChange(t.id, colStatus === 'todo' ? 'in_progress' : colStatus === 'in_progress' ? 'review' : 'done')}
                                                    className="text-[#002ffe] dark:text-[#38bdf8] hover:underline font-bold uppercase tracking-wider"
                                                >
                                                    Avançar &rarr;
                                                </button>
                                            )}
                                            {colStatus === 'done' && (
                                                <span className="text-[#01f300] font-bold uppercase">&check; Finalizado</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal de Criação com Neon Red */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-white dark:bg-black rounded-none neon-border-red p-6 sm:p-8 shadow-2xl space-y-5">
                        <h3 className="text-base font-black uppercase tracking-wider text-gray-950 dark:text-white">
                            Nova Meta ou Tarefa // Show de Física
                        </h3>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Ex: Revisar roteiro da Bobina de Tesla"
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#f60011]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Tipo</label>
                                    <select
                                        value={newKind}
                                        onChange={(e) => setNewKind(e.target.value as any)}
                                        className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                    >
                                        <option value="task">Tarefa (Kanban)</option>
                                        <option value="goal">Meta Semestral</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Prioridade</label>
                                    <select
                                        value={newPriority}
                                        onChange={(e) => setNewPriority(e.target.value as any)}
                                        className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="critica">Crítica</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 dark:text-gray-400 mb-1">Categoria</label>
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value as any)}
                                    className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                >
                                    <option value="roteiro_revisao">Revisão de Roteiro</option>
                                    <option value="roteiro_novo">Novo Roteiro Pedagógico</option>
                                    <option value="manutencao">Oficina & Manutenção</option>
                                    <option value="atendimento">Atendimento a Escolas</option>
                                    <option value="divulgacao">Divulgação Científica</option>
                                    <option value="geral">Geral</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-2.5 rounded-none border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-xs font-mono font-bold uppercase"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 rounded-none bg-white dark:bg-black neon-border-red text-[#f60011] hover:bg-[#f60011] hover:text-white dark:hover:text-black text-xs font-mono font-bold uppercase tracking-wider transition-all"
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

