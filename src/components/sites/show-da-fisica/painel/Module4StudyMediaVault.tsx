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
import { FolderLock, Plus, FileText, ExternalLink, HardDrive } from 'lucide-react';
import { getStudyMaterials, addStudyMaterial } from '@/app/actions/show-bastidores';
import { InitiativeStudyMaterial } from '@/types/show-da-fisica';
import toast from 'react-hot-toast';

const DEFAULT_MATERIALS: InitiativeStudyMaterial[] = [
    {
        id: 'mat-1',
        initiative_slug: 'show_da_fisica',
        front: 'estudo_operacao',
        media_kind: 'roteiro_tecnico',
        title: 'Roteiro Técnico Operacional — Bobina de Tesla & Gaiola',
        description: 'Protocolos confidenciais de segurança, aterramento do auditório Alessandro Volta e sequência de acionamento.',
        experiment_slug: 'tesla',
        file_url: '#',
        backup_url: 'https://storage.hublabdiv.com.br/acervo/manual_tesla_2026.pdf',
        external_url: null,
        author_id: '00000000-0000-0000-0000-000000000001',
        tags: ['segurança', 'alta-tensão', 'operacional'],
        created_at: '2026-11-01T10:00:00Z',
    },
    {
        id: 'mat-2',
        initiative_slug: 'show_da_fisica',
        front: 'estudo_operacao',
        media_kind: 'manual_seguranca',
        title: 'Manual de Armazenamento e Uso de Nitrogênio Líquido (LN2)',
        description: 'Procedimento operacional padrão (POP) do IFUSP para enchimento de botijões criogênicos e proteção térmica.',
        experiment_slug: 'supercondutor',
        file_url: '#',
        backup_url: 'https://storage.hublabdiv.com.br/acervo/pop_ln2_ifusp.pdf',
        external_url: null,
        author_id: '00000000-0000-0000-0000-000000000001',
        tags: ['criogenia', 'ln2', 'segurança'],
        created_at: '2026-10-25T14:30:00Z',
    },
    {
        id: 'mat-3',
        initiative_slug: 'show_da_fisica',
        front: 'divulgacao_inspiracao',
        media_kind: 'midia_bruta',
        title: 'Gravação Bruta em 4K — Tubo de Rubens (Som & Chamas)',
        description: 'Take bruto registrado com microfone de contato para edição de reels e postagens de collab no HUB.',
        experiment_slug: 'rubens',
        file_url: '#',
        backup_url: 'https://storage.hublabdiv.com.br/videos/rubens_raw_4k.mp4',
        external_url: null,
        author_id: '00000000-0000-0000-0000-000000000001',
        tags: ['audiovisual', 'chamas', 'ondas'],
        created_at: '2026-10-18T16:00:00Z',
    },
];

export function Module4StudyMediaVault() {
    const [front, setFront] = useState<'estudo_operacao' | 'divulgacao_inspiracao'>('estudo_operacao');
    const [materials, setMaterials] = useState<InitiativeStudyMaterial[]>(DEFAULT_MATERIALS);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mediaKind, setMediaKind] = useState('roteiro_tecnico');
    const [fileUrl, setFileUrl] = useState('');

    const loadData = async () => {
        setIsLoading(true);
        const res = await getStudyMaterials(front);
        if (res.success && res.data && (res.data as any[]).length > 0) {
            setMaterials(res.data as InitiativeStudyMaterial[]);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [front]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const res = await addStudyMaterial({
            front,
            media_kind: mediaKind,
            title: title.trim(),
            description: description.trim() || undefined,
            file_url: fileUrl.trim() || undefined,
        });

        if (res.success) {
            toast.success('Material adicionado ao acervo!');
            setIsModalOpen(false);
            setTitle('');
            setDescription('');
            setFileUrl('');
            loadData();
        } else {
            toast.error(res.error || 'Erro ao adicionar item');
        }
    };

    const filteredMaterials = materials.filter((m) => m.front === front);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-white/10 pb-6">
                <div>
                    <h2 className="text-xl sm:text-2xl font-black uppercase text-gray-950 dark:text-white flex items-center gap-2">
                        <FolderLock className="w-5 h-5 text-[#002ffe] dark:text-[#38bdf8]" />
                        <span>Acervo & Materiais Confidenciais da Bancada</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-0.5">
                        Roteiros técnicos, manuais de segurança com proteção RLS e arquivos de mídia em alta definição.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFront('estudo_operacao')}
                        className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-none border ${
                            front === 'estudo_operacao'
                                ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe] border-transparent'
                                : 'bg-white dark:bg-black border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/50'
                        }`}
                    >
                        Estudo & Operação
                    </button>
                    <button
                        onClick={() => setFront('divulgacao_inspiracao')}
                        className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all rounded-none border ${
                            front === 'divulgacao_inspiracao'
                                ? 'bg-[#002ffe] text-white shadow-[0_0_15px_#002ffe] border-transparent'
                                : 'bg-white dark:bg-black border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-white/50'
                        }`}
                    >
                        Mídias & Divulgação
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="p-2.5 rounded-none bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] hover:bg-[#002ffe] hover:text-white transition-colors"
                        title="Adicionar item"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Aviso de Storage Híbrido Fire Stick */}
            {front === 'divulgacao_inspiracao' && (
                <div className="p-4 rounded-none bg-white dark:bg-black neon-border-yellow text-xs text-gray-800 dark:text-gray-200 flex items-center gap-3">
                    <HardDrive className="w-4 h-4 shrink-0 text-[#FFCC00]" />
                    <span>
                        Arquivos pesados utilizam espelhamento duplo: Cloudinary para preview web e servidor físico local Fire Stick Storage (<code>storage.hublabdiv.com.br</code>) para preservação de masters no IFUSP.
                    </span>
                </div>
            )}

            {/* Lista dos Materiais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMaterials.map((m) => (
                    <div
                        key={m.id}
                        className="p-6 rounded-none bg-white dark:bg-black neon-border-blue flex flex-col justify-between space-y-4 shadow-lg"
                    >
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase border border-[#002ffe] text-[#002ffe] dark:text-[#38bdf8]">
                                    {m.media_kind}
                                </span>
                                {m.backup_url && (
                                    <span className="text-[9px] font-mono text-[#01f300] flex items-center gap-1 font-bold">
                                        <HardDrive className="w-3 h-3" />
                                        FireStick OK
                                    </span>
                                )}
                            </div>
                            <h4 className="text-sm font-black uppercase text-gray-950 dark:text-white leading-snug">
                                {m.title}
                            </h4>
                            {m.description && (
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-sans leading-relaxed line-clamp-3">
                                    {m.description}
                                </p>
                            )}
                        </div>

                        <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                            <span className="text-[10px] text-gray-500">
                                {new Date(m.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            <span className="text-[#002ffe] dark:text-[#38bdf8] font-bold flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" />
                                Confidencial
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Novo Item */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
                    <div className="w-full max-w-md bg-white dark:bg-black rounded-none neon-border-blue p-6 sm:p-8 shadow-2xl space-y-5">
                        <h3 className="text-base font-black uppercase tracking-wider text-gray-950 dark:text-white">
                            Adicionar ao Acervo Técnico
                        </h3>

                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ex: Manual de Segurança - Manuseio de LN2"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#002ffe]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Tipo de Documento</label>
                                <select
                                    value={mediaKind}
                                    onChange={(e) => setMediaKind(e.target.value)}
                                    className="w-full px-3 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white"
                                >
                                    <option value="roteiro_tecnico">Roteiro Técnico Confidencial</option>
                                    <option value="manual_seguranca">Manual de Segurança & POP</option>
                                    <option value="esquema_eletrico">Esquema Elétrico / Montagem</option>
                                    <option value="video_aula">Vídeo Interno de Treinamento</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold uppercase text-gray-500 mb-1">Descrição</label>
                                <textarea
                                    rows={2}
                                    placeholder="Resumo das orientações..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3.5 py-2 text-xs rounded-none border border-gray-300 dark:border-white/20 bg-white dark:bg-black font-mono text-gray-900 dark:text-white focus:outline-none focus:border-[#002ffe]"
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
                                    className="px-6 py-2.5 rounded-none bg-white dark:bg-black neon-border-blue text-[#002ffe] dark:text-[#38bdf8] hover:bg-[#002ffe] hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    Salvar Documento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
