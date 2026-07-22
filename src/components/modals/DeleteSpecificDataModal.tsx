import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { deleteSpecificUserData } from '@/app/actions/account';

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
        { id: 'submissions', label: 'Minhas Submissões (Auditório Hub)', description: 'Remove permanentemente seus posts e acervo submetido.' },
        { id: 'comments', label: 'Meus Comentários', description: 'Exclui todos os comentários que você fez na plataforma.' },
        { id: 'articles', label: 'Meus Micro Artigos (Drops)', description: 'Apaga todos os seus micro artigos e logs do IFUSP.' },
        { id: 'questions', label: 'Minhas Perguntas', description: 'Remove perguntas enviadas ao Cientista.' },
        { id: 'interactions', label: 'Minhas Interações', description: 'Desfaz suas curtidas, itens salvos e conexões (seguidores/seguindo).' }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background-dark/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-neutral-900 border border-gray-800 p-6 md:p-8 rounded-2xl w-full max-w-lg shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-brand-red text-3xl">delete_sweep</span>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Excluir Dados</h2>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                    Selecione quais tipos de dados você deseja remover permanentemente da plataforma. Esta ação <strong className="text-brand-red">não tem volta</strong>.
                </p>

                <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex gap-4 p-4 rounded-xl border border-gray-800 bg-background-dark/20 cursor-pointer hover:border-gray-600 transition-colors">
                            <input 
                                type="checkbox"
                                className="mt-1 w-5 h-5 accent-brand-red cursor-pointer"
                                checked={selectedCategories.includes(cat.id)}
                                onChange={() => toggleCategory(cat.id)}
                            />
                            <div>
                                <h3 className="text-white font-bold text-sm">{cat.label}</h3>
                                <p className="text-gray-500 text-xs mt-1">{cat.description}</p>
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
                        className="w-full bg-background-dark/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red transition-colors"
                        placeholder="APAGAR"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting || confirmWord !== 'APAGAR' || selectedCategories.length === 0}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-red text-white hover:bg-brand-red disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-brand-red/20"
                    >
                        {isDeleting ? 'Apagando...' : 'Confirmar Exclusão'}
                    </button>
                </div>
            </div>
        </div>
    );
}
