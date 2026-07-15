import React, { useRef } from 'react';
import { useDraftsStore, Draft } from '@/store/useDraftsStore';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import toast from 'react-hot-toast';

export function DraftsMenu() {
    const { drafts, deleteDraft, importDraft } = useDraftsStore();
    const { loadState, reset } = useSubmissionStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLoad = (draft: Draft) => {
        if (window.confirm('Atenção: Carregar este rascunho irá substituir todo o conteúdo atual da prancheta. Deseja continuar?')) {
            loadState(draft.stateSnapshot);
            toast.success('Rascunho carregado!');
        }
    };



    const handleExport = (draft: Draft) => {
        const jsonString = JSON.stringify(draft, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", url);
        downloadAnchorNode.setAttribute("download", `rascunho_${draft.title.replace(/\s+/g, '_') || 'sem_titulo'}.labdiv`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        // Libera URL da memória
        URL.revokeObjectURL(url);
        
        toast.success('Rascunho exportado!');
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string) as Draft;
                if (!parsed.stateSnapshot || !parsed.id) {
                    throw new Error("Formato inválido");
                }
                
                parsed.id = crypto.randomUUID();
                
                const success = importDraft(parsed);
                if (success) {
                    toast.success('Rascunho importado com sucesso!');
                    loadState(parsed.stateSnapshot);
                } else {
                    toast.error('Você já possui 3 rascunhos. Exclua um antes de importar.');
                }
            } catch (error) {
                toast.error('Falha ao ler o arquivo. Certifique-se de que é um .labdiv válido.');
            }
        };
        reader.readAsText(file);
        
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full flex flex-col gap-4 mt-8 mb-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImport} 
                className="hidden" 
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-500">inventory_2</span>
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Meus Rascunhos ({drafts.length}/3)</h3>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 text-[10px] font-bold uppercase text-gray-400 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined text-[14px]">upload</span>
                        Importar Rascunho
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {drafts.length === 0 ? (
                    <div className="col-span-1 md:col-span-3 p-8 rounded-[24px] border border-dashed border-white/10 bg-[#121212]/50 flex flex-col items-center justify-center gap-2 text-gray-500 backdrop-blur-md">
                        <span className="material-symbols-outlined text-3xl opacity-30">draft</span>
                        <p className="text-sm">Nenhum rascunho salvo.</p>
                    </div>
                ) : (
                    drafts.map(draft => (
                        <div key={draft.id} className="p-4 rounded-[24px] bg-gradient-to-br from-[#1E1E1E] to-[#121212] border border-white/5 hover:border-brand-blue/50 transition-colors flex flex-col justify-between min-h-[140px] shadow-lg">
                            <div 
                                className="flex-1 cursor-pointer flex flex-col justify-start mb-4"
                                onClick={() => handleLoad(draft)}
                            >
                                <p className="text-sm font-bold text-white mb-2 line-clamp-2 leading-tight">{draft.title}</p>
                                <p className="text-[10px] font-mono text-gray-500">Editado em: {new Date(draft.updatedAt).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="flex gap-2 w-full pt-3 border-t border-white/5">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleExport(draft); }}
                                    className="flex-1 py-1.5 flex items-center justify-center gap-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <span className="material-symbols-outlined text-[14px]">download</span>
                                    Exportar
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteDraft(draft.id); }}
                                    className="flex-1 py-1.5 flex items-center justify-center gap-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider"
                                >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
