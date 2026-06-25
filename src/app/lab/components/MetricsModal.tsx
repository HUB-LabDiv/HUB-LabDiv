import React, { useEffect, useState } from 'react';
import { PostDTO } from '@/dtos/media';
import { X, Clock, MousePointer2, Target, BarChart2 } from 'lucide-react';
import { getPostAnalytics } from '@/app/actions/analytics';
import { AnimatePresence, motion } from 'framer-motion';

interface MetricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: PostDTO;
}

interface AnalyticsData {
    id: string;
    submission_id: string;
    total_reads: number;
    scroll_depth_avg: number;
    time_spent_avg: number;
    block_interactions: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export function MetricsModal({ isOpen, onClose, post }: MetricsModalProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getPostAnalytics(post.id)
                .then(res => {
                    if (res.success && res.data) {
                        setAnalytics(res.data);
                    } else {
                        console.error('Failed to get analytics:', res.error);
                        setAnalytics(null);
                    }
                })
                .catch(err => {
                    console.error('Error loading analytics:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, post.id]);

    if (!isOpen) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-[#121212] border border-brand-blue/30 rounded-[32px] p-6 lg:p-10 w-full max-w-3xl shadow-[0_0_50px_rgba(15,71,128,0.2)] relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-brand-yellow/10 text-brand-yellow rounded-xl">
                                    <BarChart2 className="w-6 h-6" />
                                </div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Estatísticas Pedagógicas</h2>
                            </div>
                            <p className="text-gray-400 text-sm">Visão de aprendizado para a contribuição: <span className="text-white font-bold">{post.title}</span></p>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : !analytics ? (
                            <div className="bg-[#1E1E1E] border border-white/5 rounded-2xl p-8 text-center text-gray-400">
                                <p>Ainda não há dados pedagógicos capturados para esta postagem.</p>
                                <p className="text-sm mt-2">Assim que os usuários interagirem com o conteúdo, as estatísticas aparecerão aqui.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-[#1E1E1E] border border-brand-blue/20 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center text-center gap-2">
                                        <Target className="w-8 h-8 text-brand-blue opacity-80" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Leituras Totais</span>
                                        <span className="text-3xl font-black text-white">{analytics.total_reads}</span>
                                    </div>
                                    <div className="bg-[#1E1E1E] border border-brand-yellow/20 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center text-center gap-2">
                                        <MousePointer2 className="w-8 h-8 text-brand-yellow opacity-80" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Profundidade Média</span>
                                        <span className="text-3xl font-black text-white">{Math.round(analytics.scroll_depth_avg)}%</span>
                                    </div>
                                    <div className="bg-[#1E1E1E] border border-brand-red/20 rounded-2xl p-5 shadow-lg flex flex-col items-center justify-center text-center gap-2">
                                        <Clock className="w-8 h-8 text-brand-red opacity-80" />
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tempo Médio</span>
                                        <span className="text-3xl font-black text-white">{formatTime(analytics.time_spent_avg)}</span>
                                    </div>
                                </div>

                                <div className="bg-[#1E1E1E] border border-white/10 rounded-2xl p-6 shadow-lg">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-brand-yellow">lightbulb</span>
                                        Interações nos Blocos Pedagógicos
                                    </h3>
                                    
                                    {Object.keys(analytics.block_interactions).length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">Nenhuma interação registrada nos blocos ainda.</p>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {Object.entries(analytics.block_interactions).map(([blockId, blockData]: [string, any]) => (
                                                <div key={blockId} className="bg-black/40 rounded-xl p-4 border border-white/5">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-bold text-gray-300 uppercase">Bloco: {blockId.substring(0, 8)}...</span>
                                                        <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-400">{blockData.type || 'Interação'}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span className="text-gray-400">Cliques/Respostas:</span>
                                                            <span className="font-bold text-white">{blockData.count || 0}</span>
                                                        </div>
                                                        {blockData.answers && Object.keys(blockData.answers).length > 0 && (
                                                            <div className="mt-2">
                                                                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Distribuição de Respostas:</span>
                                                                {Object.entries(blockData.answers).map(([answer, count]: [string, any]) => (
                                                                    <div key={answer} className="flex justify-between text-xs py-1 border-b border-white/5 last:border-0">
                                                                        <span className="text-gray-300 line-clamp-1 flex-1 pr-2">{answer}</span>
                                                                        <span className="font-bold text-brand-blue">{count}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
