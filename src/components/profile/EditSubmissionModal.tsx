'use client';

import { useState } from 'react';
import { PostDTO } from '@/dtos/media';
import { X, Save, AlertCircle } from 'lucide-react';
import { requestPostModeration } from '@/app/actions/submissions';
import toast from 'react-hot-toast';

interface EditSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: PostDTO | null;
}

export function EditSubmissionModal({ isOpen, onClose, post }: EditSubmissionModalProps) {
    const [title, setTitle] = useState(post?.title || '');
    const [authors, setAuthors] = useState(post?.authors || '');
    const [description, setDescription] = useState(post?.description || '');
    const [isSaving, setIsSaving] = useState(false);

    if (!isOpen || !post) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            title,
            authors,
            description
        };

        const res = await requestPostModeration(post.id, 'edit', payload);

        if (res.success) {
            toast.success('Solicitação de edição enviada ao Admin!');
            onClose();
        } else {
            toast.error(res.error || 'Erro ao solicitar edição');
        }
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-[#121212] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]">
                <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Solicitar Edição</h2>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Seu pedido será revisado por um admin</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <form id="edit-post-form" onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                Título do Trabalho
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                Autor Principal
                            </label>
                            <input
                                type="text"
                                required
                                value={authors}
                                onChange={e => setAuthors(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest">
                                Descrição / Resumo
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-blue/20 transition-all font-medium resize-none"
                            />
                        </div>

                        <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10 flex gap-3">
                            <AlertCircle className="w-5 h-5 text-brand-blue shrink-0" />
                            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                Esta é uma versão simplificada da edição. O conteúdo original permanecerá no ar até que um administrador aprove as suas alterações.
                            </p>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-5 bg-gray-50 dark:bg-white/5 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-gray-700 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="edit-post-form"
                        disabled={isSaving}
                        className="bg-brand-blue text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-lg shadow-brand-blue/20 flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? 'Enviando...' : 'Enviar Pedido'}
                        <Save className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
