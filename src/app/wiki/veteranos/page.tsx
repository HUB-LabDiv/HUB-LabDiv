'use client';

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


import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageSquare, ThumbsUp, Send, Loader2, X, AlertCircle, Search, Compass, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { getApprovedTips, submitTip, upvoteTip } from '@/app/actions/veterans';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

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
        <MainLayoutWrapper>
            <div className="min-h-screen bg-transparent text-white selection:bg-brand-blue selection:text-white pb-20">
                {/* Header Substituto (abaixo da Navbar Global) */}
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/gcif" className="flex items-center gap-2 hover:bg-white/10 rounded-full transition-colors px-4 py-2 border border-white/10 bg-white/5">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-brand-blue">CGIF</span>
                        </Link>
                        <h1 className="text-xl font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-red flex items-center gap-2 hidden md:flex">
                            <MessageSquare className="w-5 h-5 text-white" />
                            IFUSP 101
                        </h1>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 md:px-6 md:py-3 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        <span className="hidden md:block">Transmitir Conselho</span>
                        <span className="md:hidden">Enviar</span>
                    </button>
                </div>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto px-6">
                    <div className="text-center md:text-left mb-16">
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 mb-6">
                            Acesso Rápido & <br className="hidden md:block" />Conhecimento Transgeracional
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl font-medium">
                            Não encontrou o que procurava? Use os links rápidos ou explore as dicas testadas e validadas por veteranos para sobreviver e prosperar no IFUSP.
                        </p>
                    </div>

                {/* Quick Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    <a href="https://scholar.google.com.br" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all text-center group">
                        <Search className="w-8 h-8 text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white">Google Scholar</span>
                    </a>
                    <a href="https://portal.if.usp.br" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all text-center group">
                        <Compass className="w-8 h-8 text-brand-blue-ifusp mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white">Portal do IFUSP</span>
                    </a>
                    <a href="https://sci-hub.se" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all text-center group">
                        <BookOpen className="w-8 h-8 text-brand-red mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white">Sci-Hub</span>
                    </a>
                    <a href="mailto:salunosif@usp.br?subject=Dúvida&body=Olá, saudações espero que esteja bem%0D%0A%0D%0ASou aluno do IFUSP meu curso é [] e eu tenho uma duvida%0D%0A%0D%0A[seu nome] [seu NUSP]" className="flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all text-center group">
                        <MessageSquare className="w-8 h-8 text-brand-yellow mb-3 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-widest text-white">Seção de Alunos</span>
                    </a>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-12 border-b border-white/10 pb-6">
                    <button 
                        onClick={() => setActiveFilter('todas')}
                        className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeFilter === 'todas' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                    >
                        Todas
                    </button>
                    {CATEGORIAS.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveFilter(cat.id)}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeFilter === cat.id ? `bg-${cat.color} text-white` : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Grid de Dicas */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
                    </div>
                ) : filteredTips.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {filteredTips.map((tip, idx) => {
                            const isUpvoted = upvotedTips.includes(tip.id);
                            const categoryColor = CATEGORIAS.find(c => c.id === tip.categoria)?.color || 'brand-blue';
                            
                            return (
                                <motion.div 
                                    key={tip.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="break-inside-avoid p-8 rounded-[32px] bg-card-dark border border-white/5 hover:border-white/10 transition-colors relative group"
                                >
                                    <div className="absolute top-8 right-8">
                                        <div className={`size-2 rounded-full bg-${categoryColor} shadow-[0_0_10px_currentColor]`} />
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest text-${categoryColor} bg-${categoryColor}/10 px-3 py-1 rounded-full`}>
                                            {tip.categoria}
                                        </span>
                                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold">
                                            <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'text-brand-blue fill-brand-blue' : ''}`} />
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
                                            className={`p-2 rounded-full transition-colors ${isUpvoted ? 'bg-brand-blue/20 text-brand-blue cursor-default' : 'bg-white/5 text-white hover:bg-white/20'}`}
                                        >
                                            <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-current' : ''}`} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-32 text-center bg-white/5 rounded-[40px] border border-white/5">
                        <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhum conselho encontrado nesta categoria.</p>
                    </div>
                )}
            </main>

            {/* Modal de Transmissão */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm" onClick={() => !isSubmitting && setIsModalOpen(false)} />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card-dark border border-white/10 p-8 rounded-[32px] w-full max-w-md relative z-10 shadow-2xl"
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
                                    className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors"
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
                                    className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors"
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
                                    className="w-full bg-background-dark border border-white/10 rounded-xl p-3 text-white focus:border-brand-blue outline-none transition-colors resize-none"
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
        </MainLayoutWrapper>
    );
}
