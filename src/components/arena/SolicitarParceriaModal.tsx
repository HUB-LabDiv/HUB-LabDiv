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
import { X, Sparkles, Loader2, CheckCircle2, Send, Palette, Laptop, MessageSquare, Users2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { submitLabdivPartnershipRequest } from '@/app/actions/arena';

interface SolicitarParceriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export function SolicitarParceriaModal({ isOpen, onClose, userEmail }: SolicitarParceriaModalProps) {
    const [projectName, setProjectName] = useState('');
    const [category, setCategory] = useState('Extensão Universitária');
    const [description, setDescription] = useState('');
    const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
        'Identidade Visual & Design',
        'Plataforma Web / Software'
    ]);
    const [contactEmail, setContactEmail] = useState(userEmail || '');
    const [contactPhone, setContactPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const availableNeeds = [
        { id: 'Identidade Visual & Design', label: 'Identidade Visual & Design' },
        { id: 'Plataforma Web / Software', label: 'Plataforma Web / Software' },
        { id: 'Tradução & Divulgação Científica', label: 'Tradução & Divulgação Científica' },
        { id: 'Captação de Monitores / Bolsistas', label: 'Captação de Monitores / Bolsistas' },
    ];

    const toggleNeed = (needId: string) => {
        if (selectedNeeds.includes(needId)) {
            setSelectedNeeds(selectedNeeds.filter(n => n !== needId));
        } else {
            setSelectedNeeds([...selectedNeeds, needId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName.trim() || projectName.length < 3) {
            toast.error('Informe o nome do seu projeto ou iniciativa.');
            return;
        }

        if (!description.trim() || description.length < 10) {
            toast.error('Descreva o projeto com ao menos 10 caracteres.');
            return;
        }

        if (selectedNeeds.length === 0) {
            toast.error('Selecione ao menos uma área em que o LabDiv pode ajudar.');
            return;
        }

        if (!contactEmail.includes('@')) {
            toast.error('Informe um e-mail de contato válido.');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await submitLabdivPartnershipRequest({
                project_name: projectName.trim(),
                category,
                description: description.trim(),
                needs: selectedNeeds,
                contact_email: contactEmail.trim(),
                contact_phone: contactPhone.trim() || undefined
            });

            if (res.error) {
                toast.error(res.error);
            } else {
                toast.success('Proposta de parceria enviada com sucesso! A equipe do LabDiv entrará em contato.');
                onClose();
                setProjectName('');
                setDescription('');
                setContactPhone('');
            }
        } catch {
            toast.error('Erro de conexão ao enviar proposta.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-[#1E1E1E] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FFCC00]/10 text-[#FFCC00] flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bukra font-bold text-white uppercase tracking-tight">
                                Solicitar Parceria LabDiv
                            </h3>
                            <p className="text-xs text-gray-400 font-open-sans">
                                Conte-nos sobre sua iniciativa e como podemos somar forças
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Nome do Projeto */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra">
                            Nome do Projeto / Laboratório / Iniciativa *
                        </label>
                        <input
                            type="text"
                            required
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="Ex: Grupo de Óptica Quântica, Semana da Física, Projeto Astronomia..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-yellow font-open-sans transition-colors placeholder:text-gray-600"
                        />
                    </div>

                    {/* Categoria */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra">
                            Tipo de Iniciativa
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 bg-[#121212] border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-yellow font-open-sans transition-colors cursor-pointer"
                        >
                            <option value="Extensão Universitária">Extensão Universitária</option>
                            <option value="Laboratório de Pesquisa">Laboratório de Pesquisa</option>
                            <option value="Disciplina de Graduação / Pós">Disciplina de Graduação / Pós</option>
                            <option value="Evento / Simpósio">Evento / Simpósio</option>
                            <option value="Coletivo / Entidade Estudantil">Coletivo / Entidade Estudantil</option>
                            <option value="Outro">Outro</option>
                        </select>
                    </div>

                    {/* Áreas em que o LabDiv pode apoiar */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra block">
                            Áreas de Apoio Desejadas (Selecione ao menos uma) *
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {availableNeeds.map((need) => {
                                const isChecked = selectedNeeds.includes(need.id);
                                return (
                                    <button
                                        type="button"
                                        key={need.id}
                                        onClick={() => toggleNeed(need.id)}
                                        className={`p-3 rounded-xl border text-left text-xs font-open-sans font-bold flex items-center justify-between transition-all ${
                                            isChecked
                                                ? 'bg-brand-yellow/15 border-brand-yellow text-brand-yellow'
                                                : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                                        }`}
                                    >
                                        <span>{need.label}</span>
                                        {isChecked && <CheckCircle2 className="w-4 h-4 text-brand-yellow shrink-0" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Descrição */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra">
                            Descrição e Objetivos *
                        </label>
                        <textarea
                            required
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Descreva brevemente sua iniciativa, o público-alvo e o que gostaria de construir junto ao LabDiv..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-yellow font-open-sans resize-none transition-colors placeholder:text-gray-600"
                        />
                    </div>

                    {/* Contatos */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra">
                                E-mail de Contato *
                            </label>
                            <input
                                type="email"
                                required
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                placeholder="seu-email@usp.br"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-yellow font-open-sans transition-colors placeholder:text-gray-600"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-300 font-bukra">
                                Telefone / WhatsApp (Opcional)
                            </label>
                            <input
                                type="tel"
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                placeholder="(11) 99999-9999"
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none focus:border-brand-yellow font-open-sans transition-colors placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 rounded-xl bg-white/5 text-gray-300 text-xs font-bukra font-bold hover:bg-white/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 rounded-xl bg-brand-yellow text-black text-xs font-bukra font-black uppercase tracking-wider hover:bg-brand-yellow/90 transition-all flex items-center gap-2 shadow-lg shadow-brand-yellow/20"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Enviar Proposta</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
