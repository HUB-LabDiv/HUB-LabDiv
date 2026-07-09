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

import React from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { Plus, Trash2 } from 'lucide-react';

export default function ReflectionBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const question = block.content.question || '';
    const questionType = block.content.questionType || 'discursive';
    const options = block.content.options || [];

    const handleTypeChange = (type: 'discursive' | 'multiple_choice') => {
        updateBlock(block.id, { 
            questionType: type,
            // Only initialize options if switching to multiple choice and it's empty
            options: type === 'multiple_choice' && options.length === 0 ? ['', ''] : options
        });
    };

    const addOption = () => {
        updateBlock(block.id, { options: [...options, ''] });
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_: string, i: number) => i !== index);
        updateBlock(block.id, { options: newOptions });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        updateBlock(block.id, { options: newOptions });
    };

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-blue/30 bg-brand-blue/5 rounded-xl focus-within:border-brand-blue transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 opacity-70 text-gray-200">
                    <span className="material-symbols-outlined text-2xl">psychology</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Balão de Reflexão</span>
                </div>
                
                {/* Type Toggle */}
                <div className="flex bg-gray-900/50 rounded-lg p-1 border border-brand-blue/20 self-start sm:self-auto">
                    <button
                        onClick={() => handleTypeChange('discursive')}
                        className={`px-3 py-1.5 sm:py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            questionType === 'discursive' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Discursiva
                    </button>
                    <button
                        onClick={() => handleTypeChange('multiple_choice')}
                        className={`px-3 py-1.5 sm:py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                            questionType === 'multiple_choice' ? 'bg-brand-blue text-white shadow-md' : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                        Múltipla Escolha (Enquete)
                    </button>
                </div>
            </div>
            
            <textarea 
                value={question}
                onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                placeholder={questionType === 'discursive' ? "Insira provocações dissertativas ou perguntas para o leitor refletir..." : "Insira a pergunta da sua enquete reflexiva..."}
                className="w-full bg-transparent outline-none resize-y min-h-[80px] text-gray-200 placeholder-brand-blue/50 font-medium border-b border-brand-blue/30 pb-2 mb-4 focus:border-brand-blue transition-colors"
            />
            
            {questionType === 'multiple_choice' && (
                <div className="space-y-3 mt-2">
                    <label className="text-[10px] text-brand-blue uppercase tracking-widest font-bold">Opções de Voto/Reflexão</label>
                    <div className="space-y-2">
                        {options.map((opt: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 sm:gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-brand-blue/30 flex items-center justify-center shrink-0">
                                </div>
                                <input
                                    type="text"
                                    value={opt}
                                    onChange={(e) => updateOption(idx, e.target.value)}
                                    placeholder={`Opção ${idx + 1}`}
                                    className="flex-1 bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-brand-blue/50 transition-colors min-w-0"
                                />
                                <button
                                    onClick={() => removeOption(idx)}
                                    disabled={options.length <= 2}
                                    className={`p-2 rounded-lg transition-colors shrink-0 ${
                                        options.length <= 2 
                                            ? 'text-gray-600 cursor-not-allowed' 
                                            : 'text-gray-400 hover:text-brand-blue hover:bg-brand-blue/10'
                                    }`}
                                    title={options.length <= 2 ? "Mínimo de 2 opções" : "Remover opção"}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <button
                        onClick={addOption}
                        className="flex items-center gap-2 text-xs font-bold text-brand-blue hover:text-brand-blue/80 uppercase tracking-widest px-2 py-1 transition-colors mt-2"
                    >
                        <Plus size={14} /> Adicionar Opção
                    </button>
                </div>
            )}
            
            {questionType === 'discursive' && (
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-center opacity-50 min-h-[80px]">
                    <span className="material-symbols-outlined mb-1">edit_square</span>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">O usuário responderá em texto livre</p>
                </div>
            )}
        </div>
    );
}
