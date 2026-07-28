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
import { X, Save, Trash2, Clock, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getSubjectAbsences, updateSubjectAbsences } from '@/app/actions/absences';

export interface BlockFormData {
    id?: string;
    title: string;
    type: string;
    sourceId?: string;
    daysOfWeek: number[]; // 0=Dom, 1=Seg, ..., 6=Sab
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    color: string;
}

interface BlockDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BlockFormData) => void;
    onDelete?: (id: string) => void;
    initialData?: BlockFormData | null;
}

const DAYS = [
    { value: 1, label: 'Segunda' },
    { value: 2, label: 'Terça' },
    { value: 3, label: 'Quarta' },
    { value: 4, label: 'Quinta' },
    { value: 5, label: 'Sexta' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
];

const COLORS = ['#3B82F6', '#06B6D4', '#10B981', '#EAB308', '#F97316', '#EF4444', '#8B5CF6', '#EC4899'];

export function BlockDetailsModal({ isOpen, onClose, onSave, onDelete, initialData }: BlockDetailsModalProps) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('custom');
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('10:00');
    const [color, setColor] = useState(COLORS[0]);

    // Absences
    const [absences, setAbsences] = useState(0);
    const [maxAbsences, setMaxAbsences] = useState(15);
    const [isLoadingAbsences, setIsLoadingAbsences] = useState(false);
    const [isSavingAbsences, setIsSavingAbsences] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            setType(initialData.type || 'custom');
            setDaysOfWeek(initialData.daysOfWeek || []);
            setStartTime(initialData.startTime || '08:00');
            setEndTime(initialData.endTime || '10:00');
            setColor(initialData.color || COLORS[0]);

            // Load absences if it's an official subject
            if (initialData.sourceId && (initialData.type === 'aula' || initialData.type === 'estudo')) {
                loadAbsences(initialData.sourceId);
            }
        } else if (isOpen) {
            // Reset for new
            setTitle('');
            setType('custom');
            setDaysOfWeek([]);
            setStartTime('08:00');
            setEndTime('10:00');
            setColor(COLORS[0]);
            setAbsences(0);
            setMaxAbsences(15);
        }
    }, [isOpen, initialData]);

    const loadAbsences = async (subjectCode: string) => {
        setIsLoadingAbsences(true);
        const res = await getSubjectAbsences(subjectCode);
        if (res.success && res.data) {
            setAbsences(res.data.absences || 0);
            setMaxAbsences(res.data.max_absences || 15);
        }
        setIsLoadingAbsences(false);
    };

    const handleSaveAbsences = async () => {
        if (!initialData?.sourceId) return;
        setIsSavingAbsences(true);
        const res = await updateSubjectAbsences(initialData.sourceId, absences, maxAbsences);
        if (res.success) {
            toast.success('Faltas atualizadas!');
        } else {
            toast.error('Erro ao atualizar faltas.');
        }
        setIsSavingAbsences(false);
    };

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (daysOfWeek.length === 0) {
            toast.error('Selecione pelo menos um dia da semana.');
            return;
        }
        if (!title.trim()) {
            toast.error('O título é obrigatório.');
            return;
        }
        
        onSave({
            id: initialData?.id,
            title,
            type,
            sourceId: initialData?.sourceId,
            daysOfWeek,
            startTime,
            endTime,
            color
        });
    };

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-md">
            <div className="bg-background-dark w-full max-w-lg rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue/30 text-brand-blue">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">
                                {initialData ? 'Detalhes do Bloco' : 'Novo Bloco'}
                            </h2>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10 text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <form id="block-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em] ml-1">Título</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ex: Cálculo I"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em] ml-1">Dias da Semana</label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS.map(day => (
                                    <button
                                        key={day.value}
                                        type="button"
                                        onClick={() => toggleDay(day.value)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                                            daysOfWeek.includes(day.value) 
                                                ? 'bg-brand-blue text-white border-brand-blue shadow-lg shadow-brand-blue/20' 
                                                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {day.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em] ml-1">Início</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em] ml-1">Fim</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.1em] ml-1">Cor</label>
                            <div className="flex flex-wrap gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                                {COLORS.map(c => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setColor(c)}
                                        className={`w-8 h-8 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-background-dark' : 'hover:scale-110'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>

                    {initialData?.sourceId && (initialData.type === 'aula' || initialData.type === 'estudo') && (
                        <div className="p-5 bg-brand-red/5 border border-brand-red/10 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 text-brand-red">
                                <AlertCircle className="w-5 h-5" />
                                <h3 className="font-black uppercase tracking-widest text-xs">Controle de Faltas</h3>
                            </div>
                            
                            {isLoadingAbsences ? (
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-xs">Carregando...</span>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-brand-red/70 tracking-[0.1em] ml-1">Faltas Atuais</label>
                                            <div className="flex items-center gap-2">
                                                <button type="button" onClick={() => setAbsences(Math.max(0, absences - 1))} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10">-</button>
                                                <input
                                                    type="number"
                                                    value={absences}
                                                    onChange={(e) => setAbsences(parseInt(e.target.value) || 0)}
                                                    className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-white focus:outline-none"
                                                />
                                                <button type="button" onClick={() => setAbsences(absences + 1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10">+</button>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-brand-red/70 tracking-[0.1em] ml-1">Máximo Permitido</label>
                                            <input
                                                type="number"
                                                value={maxAbsences}
                                                onChange={(e) => setMaxAbsences(parseInt(e.target.value) || 15)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center text-sm font-bold text-white focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs">
                                            <span className="text-gray-400">Você ainda pode faltar: </span>
                                            <span className={`font-bold ${maxAbsences - absences <= 2 ? 'text-brand-red' : 'text-[#00A3FF]'}`}>
                                                {Math.max(0, maxAbsences - absences)} vezes
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSaveAbsences}
                                            disabled={isSavingAbsences}
                                            className="px-4 py-2 bg-brand-red text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                                        >
                                            {isSavingAbsences ? 'Salvando...' : 'Salvar Faltas'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
                    {initialData?.id && onDelete ? (
                        <button
                            type="button"
                            onClick={() => {
                                if (confirm('Tem certeza que deseja excluir este bloco?')) {
                                    onDelete(initialData.id!);
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-3 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-xl transition-colors text-[11px] font-black uppercase tracking-widest"
                        >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                        </button>
                    ) : (
                        <div />
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors text-[11px] font-black uppercase tracking-widest"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="block-form"
                            className="flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-xl transition-all hover:scale-105 active:scale-95 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-blue/20"
                        >
                            <Save className="w-4 h-4" />
                            Salvar Bloco
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
