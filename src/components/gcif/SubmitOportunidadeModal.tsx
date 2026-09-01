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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Send, Calendar, MapPin, Link as LinkIcon, Briefcase, Loader2 } from 'lucide-react';
import { submitOportunidade } from '@/app/actions/oportunidades';
import { toast } from 'react-hot-toast';

interface SubmitOportunidadeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const tipoOptions = [
    { value: 'vaga', label: 'Vaga / IC', desc: 'Iniciação Científica, monitoria ou estágio' },
    { value: 'palestra', label: 'Palestra / Seminário', desc: 'Colóquio, workshop ou minicurso' },
    { value: 'evento', label: 'Evento Acadêmico', desc: 'Simpósio, feira de ciências ou semana acadêmica' },
    { value: 'bolsa', label: 'Bolsa / Auxílio', desc: 'Auxílio permanência, PAPFE ou edital de fomento' },
];

export function SubmitOportunidadeModal({ isOpen, onClose }: SubmitOportunidadeModalProps) {
    const [tipo, setTipo] = useState<'vaga' | 'palestra' | 'evento' | 'bolsa'>('vaga');
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [data, setData] = useState('');
    const [local, setLocal] = useState('');
    const [link, setLink] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!titulo.trim() || !descricao.trim()) {
            toast.error('Preencha pelo menos o título e a descrição.');
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await submitOportunidade({
                tipo,
                titulo,
                descricao,
                data,
                local,
                link,
            });

            if (res.success) {
                toast.success('Oportunidade enviada com sucesso!', {
                    icon: '🚀',
                    style: { background: '#121212', color: '#fff', border: '1px solid #FFCC00' }
                });
                setTitulo('');
                setDescricao('');
                setData('');
                setLocal('');
                setLink('');
                onClose();
            } else {
                toast.error(res.error || 'Erro ao enviar oportunidade.');
            }
        } catch {
            toast.error('Falha de conexão ao enviar oportunidade.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-white/10">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-red/15 text-brand-red border border-brand-red/30 text-[10px] font-black uppercase tracking-wider mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Divulgação Comunitária
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-white font-bukra tracking-tight">
                                    Divulgar Oportunidade
                                </h2>
                                <p className="text-xs text-gray-400 font-open-sans mt-1">
                                    Cadastre vagas de IC, palestras, bolsas e eventos para que outros alunos da USP descubram.
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors shrink-0"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Tipo Selector */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                    Tipo de Oportunidade *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {tipoOptions.map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setTipo(opt.value as any)}
                                            className={`p-3 rounded-2xl border text-left transition-all ${
                                                tipo === opt.value
                                                    ? 'bg-brand-red/15 border-brand-red/50 text-white shadow-lg'
                                                    : 'bg-black/30 border-white/10 text-gray-400 hover:bg-white/5 hover:text-gray-200'
                                            }`}
                                        >
                                            <div className="font-bold text-xs">{opt.label}</div>
                                            <div className="text-[10px] text-gray-400 mt-0.5">{opt.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Título */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                    Título da Oportunidade *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Ex: Bolsa de Iniciação Científica em Física Nuclear (DFN)"
                                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all"
                                />
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                    Descrição & Detalhes *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descreva o escopo do projeto, pré-requisitos, bolsa, carga horária e instruções para entrar em contato com o orientador ou organizadores."
                                    className="w-full px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all resize-none"
                                />
                            </div>

                            {/* Grid 2 colunas: Data e Local */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                        Data / Prazo de Inscrição
                                    </label>
                                    <div className="relative">
                                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={data}
                                            onChange={(e) => setData(e.target.value)}
                                            placeholder="Ex: Inscrições até 15/04"
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                        Local / Laboratório / Modalidade
                                    </label>
                                    <div className="relative">
                                        <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={local}
                                            onChange={(e) => setLocal(e.target.value)}
                                            placeholder="Ex: Ed. Principal, Sala 204 / Híbrido"
                                            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Link de Acesso / Inscrição */}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-gray-300 mb-2">
                                    Link Oficial de Acesso / Edital
                                </label>
                                <div className="relative">
                                    <LinkIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="url"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="https://..."
                                        className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-all"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-red/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Enviando...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Publicar Oportunidade</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
