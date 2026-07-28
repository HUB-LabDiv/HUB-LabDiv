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
import { X, CalendarX, Loader2, Save, AlertTriangle, CheckCircle2, Minus, Plus, Search, BookOpen, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getAllUserAbsences, updateSubjectAbsences } from '@/app/actions/absences';

// USP Formula: 1 crédito aula = 15h. 75% frequência -> máx faltas = Math.floor(Créditos Aula * 1.5)
export const calcMaxAbsencesFromCredits = (credits: number): number => {
    const validCredits = isNaN(credits) || credits < 1 ? 4 : credits;
    return Math.floor(validCredits * 1.5);
};

interface SubjectAbsenceState {
    subjectCode: string;
    title: string;
    creditsAula: number;
    absences: number;
    maxAbsences: number;
    isSaving?: boolean;
}

interface AbsencesModalProps {
    isOpen: boolean;
    onClose: () => void;
    events: any[];
}

export function AbsencesModal({ isOpen, onClose, events }: AbsencesModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectsList, setSubjectsList] = useState<SubjectAbsenceState[]>([]);
    const [savingAll, setSavingAll] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;

        async function loadData() {
            setIsLoading(true);
            try {
                // 1. Fetch DB absences and credits map
                const res = await getAllUserAbsences();
                const dbAbsencesMap = new Map<string, { absences: number; max_absences: number }>();
                const creditsMap = res.creditsMap || {};

                if (res.success && Array.isArray(res.data)) {
                    res.data.forEach((item: any) => {
                        dbAbsencesMap.set(item.subject_code, {
                            absences: item.absences ?? 0,
                            max_absences: item.max_absences ?? 6,
                        });
                    });
                }

                // 2. Extract unique subjects from events
                const subjectsMap = new Map<string, string>(); // code -> title

                events.forEach(e => {
                    const code = e.extendedProps?.sourceId || e.id;
                    const rawTitle = (e.title || '').replace('📚 Estudo: ', '').trim();
                    if (code && rawTitle) {
                        if (!subjectsMap.has(code)) {
                            subjectsMap.set(code, rawTitle);
                        }
                    }
                });

                // Include DB entries that might not be in active events array
                dbAbsencesMap.forEach((_, code) => {
                    if (!subjectsMap.has(code)) {
                        subjectsMap.set(code, code);
                    }
                });

                // 3. Assemble list
                const list: SubjectAbsenceState[] = [];
                subjectsMap.forEach((title, code) => {
                    const dbData = dbAbsencesMap.get(code);
                    const cleanCode = String(code).trim();
                    const knownCredits = creditsMap[cleanCode] || creditsMap[cleanCode.toUpperCase()];

                    let defaultCredits = 4;
                    if (knownCredits && knownCredits > 0) {
                        defaultCredits = knownCredits;
                    } else if (dbData && dbData.max_absences && dbData.max_absences !== 15) {
                        defaultCredits = Math.max(1, Math.floor(dbData.max_absences / 1.5));
                    }

                    // If max_absences is legacy 15 or not set, compute via credits
                    let computedMaxAbsences = calcMaxAbsencesFromCredits(defaultCredits);
                    if (dbData && dbData.max_absences && dbData.max_absences !== 15) {
                        computedMaxAbsences = dbData.max_absences;
                    }

                    list.push({
                        subjectCode: code,
                        title: title === code ? code : (title.startsWith(code) ? title : `${code} - ${title}`),
                        creditsAula: defaultCredits,
                        absences: dbData?.absences ?? 0,
                        maxAbsences: computedMaxAbsences,
                    });
                });

                if (isMounted) {
                    setSubjectsList(list);
                }
            } catch (error) {
                console.error('Erro ao carregar faltas:', error);
                toast.error('Erro ao carregar dados de faltas');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        }

        loadData();

        return () => {
            isMounted = false;
        };
    }, [isOpen, events]);

    if (!isOpen) return null;

    const handleCreditsChange = (index: number, delta: number) => {
        setSubjectsList(prev => {
            const next = [...prev];
            const currentCreds = isNaN(next[index].creditsAula) ? 4 : next[index].creditsAula;
            const newCredits = Math.max(1, currentCreds + delta);
            next[index] = {
                ...next[index],
                creditsAula: newCredits,
                maxAbsences: calcMaxAbsencesFromCredits(newCredits)
            };
            return next;
        });
    };

    const handleCreditsInputChange = (index: number, val: number) => {
        setSubjectsList(prev => {
            const next = [...prev];
            const newCredits = Math.max(1, isNaN(val) ? 1 : val);
            next[index] = {
                ...next[index],
                creditsAula: newCredits,
                maxAbsences: calcMaxAbsencesFromCredits(newCredits)
            };
            return next;
        });
    };

    const handleAbsenceChange = (index: number, delta: number) => {
        setSubjectsList(prev => {
            const next = [...prev];
            const currentAbs = isNaN(next[index].absences) ? 0 : next[index].absences;
            next[index] = {
                ...next[index],
                absences: Math.max(0, currentAbs + delta)
            };
            return next;
        });
    };

    const handleAbsenceInputChange = (index: number, val: number) => {
        setSubjectsList(prev => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                absences: Math.max(0, isNaN(val) ? 0 : val)
            };
            return next;
        });
    };

    const handleMaxAbsenceInputChange = (index: number, val: number) => {
        setSubjectsList(prev => {
            const next = [...prev];
            next[index] = {
                ...next[index],
                maxAbsences: Math.max(1, isNaN(val) ? 1 : val)
            };
            return next;
        });
    };

    const handleSaveSingle = async (index: number) => {
        const item = subjectsList[index];
        setSubjectsList(prev => {
            const next = [...prev];
            next[index] = { ...next[index], isSaving: true };
            return next;
        });

        const isOfflineMode = typeof navigator !== 'undefined' && !navigator.onLine;

        if (isOfflineMode) {
            const { enqueueOfflineAction } = await import('@/lib/offlineQueueManager');
            await enqueueOfflineAction('UPDATE_ABSENCES', {
                subjectCode: item.subjectCode,
                absences: item.absences,
                maxAbsences: item.maxAbsences,
            });
            toast.success(`[Offline] Alteração gravada na fila (${item.subjectCode})`);
        } else {
            try {
                const res = await updateSubjectAbsences(item.subjectCode, item.absences, item.maxAbsences);
                if (res.success) {
                    toast.success(`Faltas de ${item.subjectCode} salvas!`);
                } else {
                    const { enqueueOfflineAction } = await import('@/lib/offlineQueueManager');
                    await enqueueOfflineAction('UPDATE_ABSENCES', {
                        subjectCode: item.subjectCode,
                        absences: item.absences,
                        maxAbsences: item.maxAbsences,
                    });
                    toast.success(`[Fila Offline] Guardado para sincronização (${item.subjectCode})`);
                }
            } catch (_) {
                const { enqueueOfflineAction } = await import('@/lib/offlineQueueManager');
                await enqueueOfflineAction('UPDATE_ABSENCES', {
                    subjectCode: item.subjectCode,
                    absences: item.absences,
                    maxAbsences: item.maxAbsences,
                });
                toast.success(`[Fila Offline] Guardado para sincronização (${item.subjectCode})`);
            }
        }

        setSubjectsList(prev => {
            const next = [...prev];
            next[index] = { ...next[index], isSaving: false };
            return next;
        });
    };

    const handleSaveAll = async () => {
        setSavingAll(true);
        try {
            const isOfflineMode = typeof navigator !== 'undefined' && !navigator.onLine;

            if (isOfflineMode) {
                const { enqueueOfflineAction } = await import('@/lib/offlineQueueManager');
                for (const item of subjectsList) {
                    await enqueueOfflineAction('UPDATE_ABSENCES', {
                        subjectCode: item.subjectCode,
                        absences: item.absences,
                        maxAbsences: item.maxAbsences,
                    });
                }
                toast.success('Todas as alterações foram salvas na fila offline!');
                onClose();
            } else {
                const results = await Promise.all(
                    subjectsList.map(item =>
                        updateSubjectAbsences(item.subjectCode, item.absences, item.maxAbsences)
                    )
                );
                const errors = results.filter(r => !r.success);
                if (errors.length === 0) {
                    toast.success('Todas as faltas foram salvas com sucesso!');
                    onClose();
                } else {
                    toast.error(`Salvo com ${errors.length} erro(s).`);
                }
            }
        } catch (e) {
            toast.error('Erro ao salvar faltas.');
        } finally {
            setSavingAll(false);
        }
    };

    const filteredList = subjectsList.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#1E1E1E] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#121212]">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-brand-red/10 border border-brand-red/20 rounded-2xl text-brand-red">
                            <CalendarX className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-black text-white uppercase tracking-tight">
                                Controle de <span className="text-brand-red">Faltas</span>
                            </h2>
                            <p className="text-xs text-gray-400 font-medium">
                                Créditos integrados ao catálogo USP: <span className="text-white font-bold">Máx. Faltas = ⌊Créditos × 1,5⌋</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formula Explanation Banner */}
                <div className="px-6 py-2.5 bg-brand-blue/10 border-b border-brand-blue/20 flex items-center gap-2 text-[11px] text-[#00A3FF]">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>
                        Os <strong>Créditos Aula</strong> são carregados automaticamente das disciplinas cadastradas no Hub USP.
                    </span>
                </div>

                {/* Search Bar & Stats Header */}
                <div className="p-4 border-b border-white/5 bg-[#181818] flex flex-col sm:flex-row items-center gap-3 justify-between">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Buscar disciplina..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#121212] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white placeholder-gray-500 focus:outline-none focus:border-[#00A3FF]/50 transition-colors"
                        />
                    </div>
                    <div className="text-[11px] font-bold text-gray-400 self-end sm:self-center">
                        Total de disciplinas: <span className="text-white font-black">{subjectsList.length}</span>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="space-y-4 py-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl animate-pulse space-y-3">
                                    <div className="h-4 bg-white/10 rounded w-1/2"></div>
                                    <div className="h-10 bg-white/5 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : filteredList.length === 0 ? (
                        <div className="text-center py-12 space-y-3">
                            <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
                            <p className="text-sm font-bold text-gray-400">
                                {subjectsList.length === 0
                                    ? 'Nenhuma disciplina encontrada na sua grade.'
                                    : 'Nenhuma disciplina encontrada para essa busca.'}
                            </p>
                            <p className="text-xs text-gray-500">
                                Adicione matérias na sua grade ou sincronize com o Júpiter Web para controlar suas faltas.
                            </p>
                        </div>
                    ) : (
                        filteredList.map((item) => {
                            const originalIndex = subjectsList.findIndex(s => s.subjectCode === item.subjectCode);
                            const remaining = item.maxAbsences - item.absences;

                            let statusColor = 'bg-[#00A3FF]/10 text-[#00A3FF] border-[#00A3FF]/20';
                            let statusText = `${remaining} faltas restantes`;
                            let StatusIcon = CheckCircle2;

                            if (remaining <= 0) {
                                statusColor = 'bg-brand-red/10 text-brand-red border-brand-red/20';
                                statusText = 'Limite excedido!';
                                StatusIcon = AlertTriangle;
                            } else if (remaining <= 2) {
                                statusColor = 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20';
                                statusText = `Atenção: ${remaining} restantes`;
                                StatusIcon = AlertTriangle;
                            }

                            return (
                                <div
                                    key={item.subjectCode}
                                    className="p-5 bg-[#121212] border border-white/10 rounded-2xl space-y-4 hover:border-white/20 transition-all shadow-sm"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                                        <div>
                                            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-brand-yellow bg-brand-yellow/10 px-2.5 py-1 rounded-lg border border-brand-yellow/20">
                                                {item.subjectCode}
                                            </span>
                                            <h3 className="text-sm font-bold text-white mt-1.5 line-clamp-1">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${statusColor} text-[10px] font-black uppercase tracking-wider shrink-0 self-start sm:self-center`}>
                                            <StatusIcon className="w-3.5 h-3.5" />
                                            <span>{statusText}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                        {/* Créditos Aula */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                                Créditos Aula
                                            </label>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCreditsChange(originalIndex, -1)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={isNaN(item.creditsAula) ? '' : item.creditsAula}
                                                    onChange={(e) => handleCreditsInputChange(originalIndex, parseInt(e.target.value))}
                                                    className="w-14 bg-white/5 border border-white/10 rounded-xl py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-[#00A3FF]/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleCreditsChange(originalIndex, 1)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Faltas Atuais */}
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                                Faltas Atuais
                                            </label>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAbsenceChange(originalIndex, -1)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <Minus className="w-3.5 h-3.5" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={isNaN(item.absences) ? 0 : item.absences}
                                                    onChange={(e) => handleAbsenceInputChange(originalIndex, parseInt(e.target.value))}
                                                    className="w-14 bg-white/5 border border-white/10 rounded-xl py-2 text-center text-sm font-bold text-white focus:outline-none focus:border-[#00A3FF]/50"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleAbsenceChange(originalIndex, 1)}
                                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Limite de Faltas & Save */}
                                        <div className="flex items-center gap-3">
                                            <div className="space-y-1.5 flex-1">
                                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-wider">
                                                    Limite (Faltas)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={isNaN(item.maxAbsences) ? '' : item.maxAbsences}
                                                    onChange={(e) => handleMaxAbsenceInputChange(originalIndex, parseInt(e.target.value))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-center text-sm font-bold text-white focus:outline-none focus:border-[#00A3FF]/50"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleSaveSingle(originalIndex)}
                                                disabled={item.isSaving}
                                                className="px-4 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-red hover:border-brand-red hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer h-9"
                                            >
                                                {item.isSaving ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <Save className="w-3.5 h-3.5" />
                                                )}
                                                <span>Salvar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-white/10 bg-[#121212] flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-3 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all cursor-pointer"
                    >
                        Fechar
                    </button>
                    {subjectsList.length > 0 && (
                        <button
                            type="button"
                            onClick={handleSaveAll}
                            disabled={savingAll || isLoading}
                            className="px-6 py-3 bg-brand-red text-white hover:bg-red-600 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-brand-red/20 disabled:opacity-50 cursor-pointer"
                        >
                            {savingAll ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            <span>Salvar Todas</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
