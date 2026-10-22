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
import { toast } from 'react-hot-toast';
import { deleteSpecificUserData } from '@/app/actions/account';
import { ModalPortal } from '@/components/ui/ModalPortal';

interface DeleteSpecificDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function DeleteSpecificDataModal({ isOpen, onClose }: DeleteSpecificDataModalProps) {
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [confirmWord, setConfirmWord] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    if (!isOpen) return null;

    const categories = [
        { id: 'submissions', label: 'Minhas Submissões (Fluxo/Auditório)', description: 'Seus posts são obrigatoriamente CC e serão apenas anonimizados, preservando o acervo IFUSP.' },
        { id: 'comments', label: 'Meus Comentários', description: 'Seus comentários fazem parte do fluxo e também serão anonimizados (CC).' },
        { id: 'articles', label: 'Meus Micro Artigos (Arte/Drops)', description: 'Remove permanentemente todos os seus artigos de arte, já que o CC é opcional.' },
        { id: 'questions', label: 'Minhas Perguntas', description: 'Remove permanentemente perguntas enviadas ao Cientista.' },
        { id: 'interactions', label: 'Minhas Interações', description: 'Desfaz permanentemente suas curtidas, itens salvos e conexões (seguidores/seguindo).' }
    ];

    const toggleCategory = (id: string) => {
        setSelectedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const handleDelete = async () => {
        if (selectedCategories.length === 0) {
            toast.error('Selecione ao menos um tipo de dado para apagar.');
            return;
        }
        if (confirmWord !== 'APAGAR') {
            toast.error('Digite APAGAR para confirmar.');
            return;
        }

        setIsDeleting(true);
        try {
            const res = await deleteSpecificUserData(selectedCategories);
            if (res.success) {
                toast.success('Dados apagados com sucesso!');
                onClose();
                window.location.reload();
            } else {
                toast.error(res.error || 'Erro ao apagar dados.');
            }
        } catch (error) {
            toast.error('Erro de conexão ao tentar apagar os dados.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100] flex min-h-full items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
                <div className="m-auto bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-brand-red text-3xl">delete_sweep</span>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Excluir Dados</h2>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        Selecione quais tipos de dados você deseja remover permanentemente da plataforma. Esta ação <strong className="text-brand-red">não tem volta</strong>.
                    </p>

                    <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {categories.map(cat => (
                            <label key={cat.id} className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-colors">
                                <input 
                                    type="checkbox"
                                    className="mt-1 w-5 h-5 accent-brand-red cursor-pointer"
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={() => toggleCategory(cat.id)}
                                />
                                <div>
                                    <h3 className="text-gray-900 dark:text-white font-bold text-sm">{cat.label}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{cat.description}</p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="mb-6">
                        <label className="block text-xs font-bold text-brand-red uppercase tracking-wider mb-2">
                            Digite APAGAR para confirmar
                        </label>
                        <input
                            type="text"
                            value={confirmWord}
                            onChange={(e) => setConfirmWord(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-black/50 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:border-brand-red transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-600"
                            placeholder="APAGAR"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-100 dark:border-white/10">
                        <button
                            onClick={onClose}
                            disabled={isDeleting}
                            className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting || confirmWord !== 'APAGAR' || selectedCategories.length === 0}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-red text-white hover:bg-brand-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-red/20"
                        >
                            {isDeleting ? 'Apagando...' : 'Confirmar Exclusão'}
                        </button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
}
