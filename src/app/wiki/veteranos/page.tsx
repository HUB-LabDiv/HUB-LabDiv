'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ThumbsUp, Send, Loader2, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getApprovedTips, submitTip, upvoteTip } from '@/app/actions/veterans';

const CATEGORIAS = [
    { id: 'comunicacao', label: 'Comunicação', color: 'brand-blue' },
    { id: 'permanencia', label: 'Permanência', color: 'brand-yellow' },
    { id: 'academica', label: 'Acadêmica', color: 'brand-red' }
];

export default function VeteranosPage() {
    const [tips, setTips] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<string>('todas');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newTip, setNewTip] = useState({ titulo: '', conteudo: '', categoria: 'comunicacao' });
    const [upvotedTips, setUpvotedTips] = useState<string[]>([]);

    useEffect(() => {
        loadTips();
    }, []);

    const loadTips = async () => {
        setIsLoading(true);
        const res = await getApprovedTips();
        if (res.success) {
            setTips(res.data || []);
        } else {
            toast.error('Erro ao carregar dicas');
        }
        setIsLoading(false);
    };

    const handleUpvote = async (id: string) => {
        if (upvotedTips.includes(id)) return;

        const originalTips = [...tips];
        setTips(tips.map(t => t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t));
        setUpvotedTips([...upvotedTips, id]);

        const res = await upvoteTip(id);
        if (!res.success) {
            setTips(originalTips);
            setUpvotedTips(upvotedTips.filter(t => t !== id));
            toast.error(res.error || 'Erro ao curtir. Você está logado?');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const res = await submitTip(newTip);
        if (res.success) {
            toast.success('Dica enviada! Ela será analisada pelos moderadores.');
            setIsModalOpen(false);
            setNewTip({ titulo: '', conteudo: '', categoria: 'comunicacao' });
        } else {
            toast.error(res.error || 'Erro ao enviar dica. Você está logado?');
        }
        setIsSubmitting(false);
    };

    const filteredTips = activeFilter === 'todas' 
        ? tips 
        : tips.filter(t => t.categoria === activeFilter);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-brand-blue selection:text-white pb-20">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/wiki" className="p-2 hover:bg-white/10 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-400" />
                        </Link>
                        <h1 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-white" />
                            Sábios do Síncrotron
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-2 bg-white text-black font-bold uppercase text-xs tracking-widest rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        Transmitir Conselho
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-6 pt-32">
                <div className="mb-12">
                    <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
                        Conhecimento<br />Transgeracional
                    </h2>
                    <p className="text-gray-400 max-w-xl text-lg">
                        Dicas testadas e validadas por veteranos para você sobreviver e prosperar no IFUSP.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-10">
                    <button
                        onClick={() => setActiveFilter('todas')}
                        className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${activeFilter === 'todas' ? 'bg-white text-black border-white' : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-600'}`}
                    >
                        Todas
                    </button>
                    {CATEGORIAS.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors border ${activeFilter === cat.id ? \`bg-\${cat.color} text-white border-\${cat.color}\` : 'bg-transparent text-gray-400 border-gray-800 hover:border-gray-600'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Feed */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
                    </div>
                ) : filteredTips.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/5">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4 opacity-50" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhum conselho encontrado nesta categoria.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTips.map((tip, idx) => {
                            const cat = CATEGORIAS.find(c => c.id === tip.categoria) || CATEGORIAS[0];
                            const isUpvoted = upvotedTips.includes(tip.id);

                            return (
                                <motion.div
                                    key={tip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-[#111] border border-white/10 rounded-3xl p-6 flex flex-col hover:border-white/30 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={\`text-[10px] font-black uppercase tracking-widest text-\${cat.color} bg-\${cat.color}/10 px-3 py-1 rounded-full\`}>
                                            {cat.label}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                                            <ThumbsUp className={\`w-4 h-4 \${isUpvoted ? 'text-brand-blue fill-brand-blue' : ''}\`} />
                                            <span className={isUpvoted ? 'text-brand-blue' : ''}>{tip.upvotes}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">{tip.titulo}</h3>
                                    <p className="text-gray-400 text-sm mb-6 flex-grow">{tip.conteudo}</p>
                                    
                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="text-xs text-gray-500 font-medium">— {tip.autor_nome}</span>
                                        <button 
                                            onClick={() => handleUpvote(tip.id)}
                                            disabled={isUpvoted}
                                            className={\`p-2 rounded-full transition-colors \${isUpvoted ? 'bg-brand-blue/20 text-brand-blue cursor-default' : 'bg-white/5 text-white hover:bg-white/20'}\`}
                                        >
                                            <ThumbsUp className={\`w-4 h-4 \${isUpvoted ? 'fill-current' : ''}\`} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* Modal de Transmissão */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#1a1a1a] border border-white/10 p-8 rounded-[32px] w-full max-w-md relative z-10 shadow-2xl"
                    >
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-500 hover:text-white"
                            disabled={isSubmitting}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Transmitir Conselho</h2>
                        <p className="text-gray-400 text-sm mb-6">Sua experiência pode salvar o semestre de alguém. Compartilhe um conselho valioso.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Categoria</label>
                                <select 
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors"
                                    value={newTip.categoria}
                                    onChange={e => setNewTip({...newTip, categoria: e.target.value})}
                                    disabled={isSubmitting}
                                >
                                    {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Título do Conselho</label>
                                <input 
                                    type="text" 
                                    required
                                    maxLength={80}
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors"
                                    placeholder="Ex: Como sobreviver a Física 1"
                                    value={newTip.titulo}
                                    onChange={e => setNewTip({...newTip, titulo: e.target.value})}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Conselho / Dica</label>
                                <textarea 
                                    required
                                    maxLength={500}
                                    rows={4}
                                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors resize-none"
                                    placeholder="Escreva sua dica detalhada aqui..."
                                    value={newTip.conteudo}
                                    onChange={e => setNewTip({...newTip, conteudo: e.target.value})}
                                    disabled={isSubmitting}
                                />
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-4 bg-white text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                {isSubmitting ? 'Enviando...' : 'Publicar Conselho'}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
