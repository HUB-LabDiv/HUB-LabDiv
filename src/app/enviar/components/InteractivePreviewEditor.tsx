'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V4.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 */

import React, { useState } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { Sparkles, MessageSquarePlus, History, Users, TrendingUp, X, Check, Eye, PenTool } from 'lucide-react';
import { SubmissionFormData } from '../schema';

export function InteractivePreviewEditor() {
    const { watch, setValue, register } = useFormContext<SubmissionFormData>();
    const { fields, append, remove } = useFieldArray({
        name: 'reflexoes'
    });

    const description = watch('description');
    const contexto_hsec = watch('contexto_hsec');
    const reflexoes = watch('reflexoes') || [];

    const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
    const [editingReflectionIndex, setEditingReflectionIndex] = useState<number | null>(null);

    // Split text into paragraphs to inject "add reflection" buttons
    const paragraphs = description.split('\n\n').filter(p => p.trim());

    const addReflectionAt = (paraId: string) => {
        append({
            ancora_paragrafo: paraId,
            tipo_reflexao: 'aberta',
            pergunta_provocadora: '',
            resposta_esperada_ou_gabarito: ''
        });
        setEditingReflectionIndex(fields.length);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header: Contexto HSEC */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[32px] p-8 border border-gray-100 dark:border-white/5 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-brand-blue/10 text-brand-blue rounded-xl">
                        <History className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Arquitetura de Contexto (HSEC)</h2>
                        <p className="text-xs text-gray-500 font-medium italic">Como Paulo Freire ensinou: ninguém aprende no vácuo. Dê o background social da sua pesquisa.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-blue flex items-center gap-2">
                            <History className="w-3 h-3" /> Histórico
                        </label>
                        <textarea 
                            {...register('contexto_hsec.historico')}
                            placeholder="Origem, marcos temporais..."
                            className="w-full h-24 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-yellow flex items-center gap-2">
                            <Users className="w-3 h-3" /> Social
                        </label>
                        <textarea 
                            {...register('contexto_hsec.social')}
                            placeholder="Impacto na comunidade, ética..."
                            className="w-full h-24 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-yellow/20 resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-brand-red flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" /> Econômico
                        </label>
                        <textarea 
                            {...register('contexto_hsec.economico')}
                            placeholder="Custos, benefícios práticos..."
                            className="w-full h-24 p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-brand-red/20 resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Main Preview/Editor Pane */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-[40px] border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between px-8 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-brand-blue" />
                        <span className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white">Motor de Preview Interativo</span>
                    </div>
                    <div className="flex bg-gray-200 dark:bg-white/10 p-1 rounded-xl">
                        <button 
                            onClick={() => setViewMode('editor')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'editor' ? 'bg-white dark:bg-brand-blue text-brand-blue dark:text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <PenTool className="w-3 h-3 inline mr-1" /> Injetar
                        </button>
                        <button 
                            onClick={() => setViewMode('preview')}
                            className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-brand-blue text-brand-blue dark:text-white shadow-sm' : 'text-gray-500'}`}
                        >
                            <Eye className="w-3 h-3 inline mr-1" /> Simular
                        </button>
                    </div>
                </div>

                <div className="p-8 md:p-12 min-h-[500px]">
                    {viewMode === 'editor' ? (
                        <div className="prose prose-lg dark:prose-invert max-w-none space-y-4">
                            {paragraphs.map((para, idx) => {
                                const paraId = `p-${idx + 1}`;
                                const activeReflections = reflexoes.filter(r => r.ancora_paragrafo === paraId);
                                
                                return (
                                    <div key={paraId} className="relative group/p-editor">
                                        <div className="p-4 rounded-2xl bg-gray-50/30 dark:bg-white/[0.01] border border-transparent hover:border-brand-blue/20 transition-all">
                                            <p className="m-0 opacity-70">{para}</p>
                                        </div>
                                        
                                        <div className="mt-2 flex flex-col gap-2">
                                            {activeReflections.map((ref, rIdx) => {
                                                const globalIndex = reflexoes.findIndex(r => r === ref);
                                                return (
                                                    <div key={rIdx} className="bg-brand-blue/10 dark:bg-brand-blue/20 p-4 rounded-2xl border border-brand-blue/30 flex items-start gap-4 animate-in slide-in-from-left-2 duration-300">
                                                        <div className="p-1.5 bg-brand-blue text-white rounded-lg">
                                                            <MessageSquarePlus className="w-3.5 h-3.5" />
                                                        </div>
                                                        <div className="flex-1 space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue">Reflexão Injetada</span>
                                                                <button onClick={() => remove(globalIndex)} className="text-brand-red hover:bg-brand-red/10 p-1 rounded-md">
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                            <input 
                                                                {...register(`reflexoes.${globalIndex}.pergunta_provocadora`)}
                                                                placeholder="Pergunta para pausar a leitura..."
                                                                className="w-full bg-white dark:bg-black/20 border border-brand-blue/20 rounded-xl px-4 py-2 text-xs outline-none"
                                                            />
                                                            <div className="flex items-center gap-4">
                                                                <select 
                                                                    {...register(`reflexoes.${globalIndex}.tipo_reflexao`)}
                                                                    className="bg-transparent text-[10px] font-bold uppercase text-brand-blue outline-none"
                                                                >
                                                                    <option value="aberta">Resposta Aberta</option>
                                                                    <option value="fechada">Pergunta Fechada (Quiz)</option>
                                                                </select>
                                                            </div>
                                                            {ref.tipo_reflexao === 'fechada' && (
                                                                <div className="mt-4 space-y-3 bg-black/5 dark:bg-black/20 p-4 rounded-xl border border-brand-blue/10">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Alternativas</span>
                                                                    <div className="grid gap-2">
                                                                        {[0, 1, 2, 3].map((optIdx) => (
                                                                            <input 
                                                                                key={optIdx}
                                                                                {...register(`reflexoes.${globalIndex}.opcoes.${optIdx}`)}
                                                                                placeholder={`Alternativa ${optIdx + 1}`}
                                                                                className="w-full bg-white dark:bg-black/40 border border-brand-blue/20 rounded-lg px-3 py-1.5 text-xs outline-none"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                    <div className="pt-2 border-t border-brand-blue/10">
                                                                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-blue block mb-2">Gabarito (Alternativa Correta)</span>
                                                                        <select 
                                                                            {...register(`reflexoes.${globalIndex}.resposta_esperada_ou_gabarito`)}
                                                                            className="w-full bg-white dark:bg-black/40 border border-brand-blue/20 rounded-lg px-3 py-1.5 text-xs outline-none"
                                                                        >
                                                                            <option value="">Selecione a alternativa correta...</option>
                                                                            {ref.opcoes?.filter(Boolean).map((opt, i) => (
                                                                                <option key={i} value={opt}>{opt}</option>
                                                                            ))}
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            <button 
                                                onClick={() => addReflectionAt(paraId)}
                                                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-blue hover:bg-brand-blue/10 rounded-xl opacity-0 group-hover/p-editor:opacity-100 transition-all border border-dashed border-brand-blue/30"
                                            >
                                                <MessageSquarePlus className="w-4 h-4" />
                                                Injetar Pausa Freireana aqui
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <ReactMarkdown>
                                {description}
                            </ReactMarkdown>
                            <div className="mt-12 p-6 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[32px] text-center">
                                <p className="text-xs text-gray-500 font-medium">As reflexões aparecerão como balões flutuantes durante o scroll.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
