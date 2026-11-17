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
import Link from 'next/link';
import { Radio, MessageSquare, Star, ExternalLink, Monitor, RefreshCw, Layers } from 'lucide-react';
import { getLiveModerationQuestions, toggleQuestionHighlight, markQuestionAnswered, setLiveCurrentExperiment } from '@/app/actions/show-bastidores';
import { EXPERIMENTS_CATALOG } from '@/app/iniciativas/show-da-fisica/data/experiments';
import toast from 'react-hot-toast';

interface QuestionItem {
    id: string;
    student_name: string | null;
    school_origin: string | null;
    free_text_answer: string | null;
    is_highlighted: boolean;
    is_answered: boolean;
    monitor_reply: string | null;
    created_at: string;
}

const SAMPLE_LIVE_QUESTIONS: QuestionItem[] = [
    {
        id: 'q-sample-1',
        student_name: 'Guilherme Mendes (3º Ano)',
        school_origin: 'E.E. Raul Brasil',
        free_text_answer: 'Por que o arco elétrico da Bobina de Tesla não atinge quem está dentro da Gaiola de Faraday?',
        is_highlighted: true,
        is_answered: false,
        monitor_reply: null,
        created_at: 'Há 2 minutos',
    },
    {
        id: 'q-sample-2',
        student_name: 'Beatriz Vasconcelos',
        school_origin: 'Colégio Estadual São Paulo',
        free_text_answer: 'A frequência do som no Tubo de Rubens muda a altura das chamas por causa dos nós da onda estacionária?',
        is_highlighted: false,
        is_answered: false,
        monitor_reply: null,
        created_at: 'Há 5 minutos',
    },
    {
        id: 'q-sample-3',
        student_name: 'Enzo Gabriel (1º Ano)',
        school_origin: 'Instituto Federal SP',
        free_text_answer: 'O giroscópio resiste a mudar de inclinação por causa da conservação do momento angular?',
        is_highlighted: false,
        is_answered: true,
        monitor_reply: 'Exato, Enzo! Quanto maior a rotação do volante, maior o torque necessário para alterar o eixo.',
        created_at: 'Há 12 minutos',
    },
];

export function Module5LiveQAModeration({ initialSessionCode }: { initialSessionCode?: string }) {
    const [sessionCode, setSessionCode] = useState(initialSessionCode || 'SHW-8821');
    const [questions, setQuestions] = useState<QuestionItem[]>(SAMPLE_LIVE_QUESTIONS);
    const [isLoading, setIsLoading] = useState(false);
    const [currentExperiment, setCurrentExperiment] = useState<string>('tesla');

    const loadQuestions = async () => {
        setIsLoading(true);
        const res = await getLiveModerationQuestions(sessionCode);
        if (res.success && res.data && (res.data as any[]).length > 0) {
            setQuestions(res.data as QuestionItem[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadQuestions();
        const interval = setInterval(loadQuestions, 5000);
        return () => clearInterval(interval);
    }, [sessionCode]);

    const handleToggleHighlight = async (id: string, currentState: boolean) => {
        const nextState = !currentState;
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, is_highlighted: nextState } : q))
        );
        const res = await toggleQuestionHighlight(id, nextState);
        if (res.success) {
            toast.success(nextState ? 'Pergunta enviada ao telão!' : 'Pergunta removida do telão');
        } else {
            toast.error(res.error || 'Erro ao alterar destaque');
        }
    };

    const handleMarkAnswered = async (id: string) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, is_answered: true } : q))
        );
        const res = await markQuestionAnswered(id);
        if (res.success) {
            toast.success('Marcada como respondida');
        } else {
            toast.error(res.error || 'Erro ao registrar resposta');
        }
    };

    const handleExperimentChange = async (slug: string) => {
        setCurrentExperiment(slug);
        const res = await setLiveCurrentExperiment(sessionCode, slug);
        if (res.success) {
            toast.success(`Palco sincronizado: ${slug}`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header da Moderação em Neon Verde */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <Radio className="w-5 h-5 text-[#01f300] animate-pulse" />
                        <span>Moderação ao Vivo & Telão de Palco</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Controle do experimento em cena, perguntas recebidas da plateia e projeção limpa para o telão do auditório.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/painel/palco/${sessionCode}`}
                        target="_blank"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300] hover:bg-[#01f300] hover:text-black font-mono font-bold text-xs uppercase tracking-wider transition-all"
                    >
                        <Monitor className="w-4 h-4" />
                        <span>Lançar Telão do Palco</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* Barra de Controle de Palco: Experimento Atual */}
            <div className="p-6 rounded-none bg-white dark:bg-black neon-border-blue flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-none bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] flex items-center justify-center font-bold shrink-0">
                        <Layers className="w-6 h-6" />
                    </div>
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8] block">
                            [ APARATO EM CENA NO PALCO ]
                        </span>
                        <h4 className="text-base font-black uppercase text-gray-950 dark:text-white">
                            {EXPERIMENTS_CATALOG.find((e) => e.id === currentExperiment)?.title || currentExperiment}
                        </h4>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <label className="text-xs font-mono font-bold uppercase text-gray-500 shrink-0">Mudar no Telão:</label>
                    <select
                        value={currentExperiment}
                        onChange={(e) => handleExperimentChange(e.target.value)}
                        className="px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black text-gray-900 dark:text-white font-mono font-bold uppercase"
                    >
                        {EXPERIMENTS_CATALOG.map((exp) => (
                            <option key={exp.id} value={exp.id}>
                                {exp.title} ({exp.concept})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Lista das Perguntas da Plateia */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-wider text-gray-950 dark:text-white flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-[#01f300]" />
                        <span>Perguntas Enviadas pela Plateia ({questions.length})</span>
                    </h3>
                    <button
                        onClick={loadQuestions}
                        className="p-1.5 rounded-none text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors border border-current"
                        title="Atualizar perguntas"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>

                <div className="space-y-4">
                    {questions.map((q) => (
                        <div
                            key={q.id}
                            className={`p-5 rounded-none border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-black ${
                                q.is_highlighted
                                    ? 'neon-border-green shadow-lg'
                                    : 'border-gray-200 dark:border-white/15'
                            }`}
                        >
                            <div className="space-y-1.5 flex-1">
                                <div className="flex items-center gap-2 font-mono">
                                    <span className="font-bold text-xs text-gray-900 dark:text-white">
                                        {q.student_name || 'Estudante da Plateia'}
                                    </span>
                                    {q.school_origin && (
                                        <span className="text-[10px] text-gray-500">
                                            &bull; {q.school_origin}
                                        </span>
                                    )}
                                    {q.is_highlighted && (
                                        <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#01f300] text-black">
                                            No Telão
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm font-sans text-gray-800 dark:text-gray-200 italic">
                                    "{q.free_text_answer}"
                                </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => handleToggleHighlight(q.id, q.is_highlighted)}
                                    className={`px-3 py-2 rounded-none text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors border ${
                                        q.is_highlighted
                                            ? 'bg-white dark:bg-black neon-border-green text-[#009900] dark:text-[#01f300]'
                                            : 'bg-white dark:bg-black border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/50'
                                    }`}
                                >
                                    <Star className="w-3.5 h-3.5" />
                                    <span>{q.is_highlighted ? 'No Telão' : 'Destacar'}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
