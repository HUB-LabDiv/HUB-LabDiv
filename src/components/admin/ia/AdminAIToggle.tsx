'use client';

import React, { useState } from 'react';
import { Bot, RotateCcw, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function AdminAIToggle() {
    const [isEnabled, setIsEnabled] = useState(true);
    // Mock actions
    const [logs, setLogs] = useState([
        {
            id: 'mock-1',
            title: 'Desvendando o Emaranhamento Quântico',
            author: 'João Aluno',
            action: 'Auto-Aprovado',
            time: 'Há 10 minutos',
            reason: '+30 min sem revisão humana. Score de confiança: 98% (Gemini)'
        }
    ]);

    const handleRevert = (id: string, title: string) => {
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 800)),
            {
                loading: 'Revertendo ação da IA...',
                success: `Ação revertida: "${title}" voltou para aprovação manual.`,
                error: 'Erro.'
            }
        ).then(() => {
            setLogs(prev => prev.filter(log => log.id !== id));
        });
    };

    return (
        <div className="bg-gradient-to-br from-brand-blue/5 to-purple-600/5 rounded-3xl border border-brand-blue/10 p-6 mb-10 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                        <Bot className="w-6 h-6 text-brand-blue" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Auto-Moderador IAMAI</span>
                        <span className="px-2 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow text-[10px] font-black uppercase tracking-widest ml-2">Mock</span>
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1 w-full md:max-w-xl">
                        A inteligência artificial (Gemini) analisa submissões esquecidas (+30 minutos na fila). O algoritmo de processamento de linguagem natural avalia diretrizes éticas e científicas para aprovar ou sinalizar conteúdo automaticamente.
                    </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white dark:bg-[#121212] py-2 px-4 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Status:</span>
                    <button 
                        onClick={() => setIsEnabled(!isEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${isEnabled ? 'bg-gradient-to-r from-brand-blue to-purple-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-md ${isEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                    <span className={`text-xs font-black uppercase tracking-widest ${isEnabled ? 'text-brand-blue' : 'text-gray-400'}`}>
                        {isEnabled ? 'Ativo' : 'Pausado'}
                    </span>
                </div>
            </div>

            {/* Painel de Logs de Ação */}
            {isEnabled ? (
                <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2 mb-4">
                        <ShieldAlert className="w-4 h-4" />
                        Registros de Decisão (Ações da IA)
                    </h3>
                    
                    {logs.length === 0 ? (
                        <div className="text-center py-6 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20 dark:border-gray-800 backdrop-blur-sm">
                            <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-500">Nenhuma intervenção recente da inteligência artificial.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {logs.map(log => (
                                <div key={log.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white/60 dark:bg-black/30 backdrop-blur-sm p-4 rounded-2xl border border-brand-blue/10 hover:border-brand-blue/30 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 dark:text-white">{log.title}</h4>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-500">Autor: {log.author}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-xs text-purple-600 dark:text-purple-400 font-bold">{log.reason}</span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 block">{log.time}</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => handleRevert(log.id, log.title)}
                                        className="shrink-0 w-full sm:w-auto px-4 py-2 bg-gray-100 dark:bg-white/5 hover:bg-brand-red/10 hover:text-brand-red text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 hover:border-brand-red/20"
                                    >
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Reverter Ação
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl text-brand-red text-sm font-medium flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5" />
                    O moderador automático está pausado. Submissões esquecidas ficarão presas na fila.
                </div>
            )}
        </div>
    );
}
