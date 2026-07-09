import React, { useEffect } from 'react';
import { Block } from '@/app/enviar/schema';
import { useSubmissionStore } from '@/store/useSubmissionStore';
import { Plus, Trash2 } from 'lucide-react';

export default function QuizBlock({ block, isActive }: { block: Block; isActive: boolean }) {
    const { updateBlock } = useSubmissionStore();
    const question = block.content.question || '';
    
    // Quiz only supports multiple choice
    const options = block.content.options || ['', ''];
    const correctAnswer = block.content.correctAnswer ?? 0;

    // Ensure it always has multiple choice type if it somehow had discursive
    useEffect(() => {
        if (block.content.questionType !== 'multiple_choice') {
            updateBlock(block.id, { questionType: 'multiple_choice', options: options.length >= 2 ? options : ['', ''] });
        }
    }, [block.id, block.content.questionType, options, updateBlock]);

    const addOption = () => {
        updateBlock(block.id, { options: [...options, ''] });
    };

    const removeOption = (index: number) => {
        if (options.length <= 2) return;
        const newOptions = options.filter((_: string, i: number) => i !== index);
        let newCorrect = correctAnswer;
        if (index === correctAnswer) {
            newCorrect = 0;
        } else if (index < correctAnswer) {
            newCorrect = correctAnswer - 1;
        }
        updateBlock(block.id, { options: newOptions, correctAnswer: newCorrect });
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        updateBlock(block.id, { options: newOptions });
    };

    return (
        <div className="flex flex-col p-4 border-2 border-dashed border-brand-red/30 bg-brand-red/5 rounded-xl focus-within:border-brand-red transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <div className="flex items-center gap-2 opacity-70 text-gray-200">
                    <span className="material-symbols-outlined text-2xl">quiz</span>
                    <span className="text-sm font-bold uppercase tracking-wider">Bloco de Quiz</span>
                </div>
            </div>
            
            <input 
                type="text"
                value={question}
                onChange={(e) => updateBlock(block.id, { question: e.target.value })}
                placeholder="Digite a pergunta do quiz..."
                className="w-full bg-transparent outline-none border-b border-brand-red/30 pb-2 mb-4 text-white placeholder-gray-500 focus:border-brand-red font-bold transition-colors"
            />
            
            <div className="space-y-3 mt-2">
                <label className="text-[10px] text-brand-red uppercase tracking-widest font-bold">Respostas (Selecione a correta)</label>
                <div className="space-y-2">
                    {options.map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                            <button 
                                onClick={() => updateBlock(block.id, { correctAnswer: idx })}
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    correctAnswer === idx 
                                        ? 'border-brand-red bg-brand-red' 
                                        : 'border-gray-500 hover:border-brand-red/50'
                                }`}
                            >
                                {correctAnswer === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                            </button>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => updateOption(idx, e.target.value)}
                                placeholder={`Opção ${idx + 1}`}
                                className="flex-1 bg-gray-900/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-brand-red/50 transition-colors min-w-0"
                            />
                            <button
                                onClick={() => removeOption(idx)}
                                disabled={options.length <= 2}
                                className={`p-2 rounded-lg transition-colors shrink-0 ${
                                    options.length <= 2 
                                        ? 'text-gray-600 cursor-not-allowed' 
                                        : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/10'
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
                    className="flex items-center gap-2 text-xs font-bold text-brand-red hover:text-brand-red/80 uppercase tracking-widest px-2 py-1 transition-colors mt-2"
                >
                    <Plus size={14} /> Adicionar Opção
                </button>
            </div>
        </div>
    );
}
