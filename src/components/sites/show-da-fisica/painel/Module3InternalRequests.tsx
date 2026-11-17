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
import { MessageSquarePlus, Plus, Clock, AlertTriangle } from 'lucide-react';
import { getInternalRequests, submitInternalRequest, updateInternalRequestStatus } from '@/app/actions/show-bastidores';
import { InitiativeInternalRequest } from '@/types/show-da-fisica';
import toast from 'react-hot-toast';

export function Module3InternalRequests() {
    const [requests, setRequests] = useState<InitiativeInternalRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [category, setCategory] = useState<'compra_insumo' | 'reparo_oficina' | 'novo_experimento' | 'melhoria_dinamica'>('compra_insumo');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [urgency, setUrgency] = useState<'baixa' | 'media' | 'alta' | 'critica'>('media');
    const [estimatedCost, setEstimatedCost] = useState<string>('');

    const loadData = async () => {
        setIsLoading(true);
        const res = await getInternalRequests();
        if (res.success && res.data) {
            setRequests(res.data as InitiativeInternalRequest[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error('Preencha os campos obrigatórios');
            return;
        }

        const res = await submitInternalRequest({
            category,
            title: title.trim(),
            description: description.trim(),
            urgency,
            estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        });

        if (res.success) {
            toast.success('Demanda enviada com sucesso!');
            setIsModalOpen(false);
            setTitle('');
            setDescription('');
            setEstimatedCost('');
            loadData();
        } else {
            toast.error(res.error || 'Erro ao registrar');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        const res = await updateInternalRequestStatus(id, newStatus);
        if (res.success) {
            setRequests((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: newStatus as any } : r))
            );
            toast.success('Status da demanda atualizado');
        } else {
            toast.error(res.error || 'Erro ao atualizar');
        }
    };

    const categoryLabels = {
        compra_insumo: 'Compra de Insumo',
        reparo_oficina: 'Reparo na Oficina',
        novo_experimento: 'Novo Experimento',
        melhoria_dinamica: 'Melhoria no Palco',
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <MessageSquarePlus className="w-5 h-5 text-[#FFCC00]" />
                        <span>Demandas, Insumos & Oficina Mecânica</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Canal interno para reposição de gases (nitrogênio líquido), pedidos de usinagem e reparos de bancada.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white dark:bg-black neon-border-yellow text-[#b45309] dark:text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Novo Pedido Interno</span>
                </button>
            </div>

            {/* Lista de Pedidos */}
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="p-8 text-center rounded-none border border-dashed border-gray-300 dark:border-white/15 text-xs font-mono text-gray-500">
                        Nenhum pedido ou demanda registrada no momento.
                    </div>
                ) : (
                    requests.map((r) => (
                        <div
                            key={r.id}
                            className="p-6 rounded-none bg-white dark:bg-black neon-border-yellow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-lg"
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2 font-mono">
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase border border-current text-[#b45309] dark:text-[#FFCC00]">
                                        {categoryLabels[r.category]}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                                            r.urgency === 'critica'
                                                ? 'border-red-500 text-red-500'
                                                : r.urgency === 'alta'
                                                ? 'border-amber-500 text-amber-500'
                                                : 'border-blue-500 text-blue-500'
                                        }`}
                                    >
                                        Urgência {r.urgency}
                                    </span>
                                    {r.estimated_cost && (
                                        <span className="text-[10px] font-bold text-[#01f300]">
                                            R$ {r.estimated_cost.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-black uppercase text-gray-950 dark:text-white">
                                    {r.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-300 font-sans leading-relaxed">
                                    {r.description}
                                </p>
                                <span className="text-[10px] font-mono text-gray-500 block">
                                    Solicitante: {r.author?.name || 'Monitor IFUSP'} &bull; {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <select
                                    value={r.status}
                                    onChange={(e) => handleStatusChange(r.id, e.target.value)}
                                    className="px-3 py-2 rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black text-xs font-mono font-bold uppercase text-gray-900 dark:text-white"
                                >
                                    <option value="aberto">Aberto</option>
                                    <option value="em_analise">Em Análise</option>
                                    <option value="aprovado">Aprovado</option>
                                    <option value="concluido">Concluído</option>
                                    <option value="arquivado">Arquivado</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal Novo Pedido */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="w-full max-w-lg bg-white dark:bg-black rounded-none neon-border-yellow p-6 sm:p-8 shadow-2xl space-y-5">
                        <h3 className="text-base font-black uppercase tracking-wider text-gray-950 dark:text-white">
                            Registrar Pedido de Insumo / Oficina
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e: any) => setCategory(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                >
                                    <option value="compra_insumo">Compra de Insumo (Gases, vidrarias, peças)</option>
                                    <option value="reparo_oficina">Reparo na Oficina Mecânica IFUSP</option>
                                    <option value="novo_experimento">Sugestão de Novo Experimento</option>
                                    <option value="melhoria_dinamica">Melhoria no Palco do Show</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Aquisição de luvas térmicas de criogenia"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#FFCC00]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Descrição Detalhada</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Explique o motivo, aparato envolvido ou impacto no show..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#FFCC00]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Urgência</label>
                                    <select
                                        value={urgency}
                                        onChange={(e: any) => setUrgency(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="critica">Crítica (Interfere na Apresentação)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Custo Estimado (R$)</label>
                                    <input
                                        type="number"
                                        placeholder="Opcional"
                                        value={estimatedCost}
                                        onChange={(e) => setEstimatedCost(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                    />
                                </div>
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
                                    className="px-6 py-2.5 rounded-none bg-white dark:bg-black neon-border-yellow text-[#b45309] dark:text-[#FFCC00] hover:bg-[#FFCC00] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    Enviar Demanda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
