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
import { motion, AnimatePresence } from 'framer-motion';
import { fetchTargetProfileStats } from '@/app/actions/profiles';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TargetProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TargetProfileModal({ isOpen, onClose }: TargetProfileModalProps) {
    const [stats, setStats] = useState<{
        language: { name: string; value: number }[];
        education: { name: string; value: number }[];
        course: { name: string; value: number }[];
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchTargetProfileStats().then((res) => {
                if (res.success && res.data) {
                    setStats(res.data);
                }
                setLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const COLORS = ['#0F4780', '#FFCC00', '#F14343', '#1E1E1E', '#4B5563', '#9CA3AF'];

    const formatLanguage = (lang: string) => {
        const map: Record<string, string> = {
            'jovem': 'Jovem',
            'nerd_geek': 'Nerd/Geek',
            'artistica': 'Artística',
            'academica': 'Acadêmica'
        };
        return map[lang] || lang;
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center pt-24 pb-8 px-4 bg-background-dark/60 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-background-dark border border-brand-blue/30 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[80vh]"
                >
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#1E1E1E]/50">
                        <div>
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">Público do HUB</h3>
                            <p className="text-xs text-gray-400">Conheça para quem você está escrevendo</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-background-dark">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Analisando Dados...</span>
                            </div>
                        ) : stats ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                
                                {/* Gráfico de Linguagem */}
                                <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-2xl p-6 flex flex-col">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Linguagem Preferida</h4>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={stats.language.map(d => ({ ...d, name: formatLanguage(d.name) }))}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                >
                                                    {stats.language.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                                    itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center mt-4">
                                        Isso ajuda a definir se o post deve ser mais formal ou descontraído.
                                    </p>
                                </div>

                                {/* Gráfico de Escolaridade */}
                                <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-2xl p-6 flex flex-col">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Escolaridade</h4>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.education} layout="vertical" margin={{ top: 0, right: 0, left: 40, bottom: 0 }}>
                                                <XAxis type="number" hide />
                                                <YAxis dataKey="name" type="category" tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
                                                <Tooltip 
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                />
                                                <Bar dataKey="value" fill="#0F4780" radius={[0, 4, 4, 0]}>
                                                    {stats.education.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Gráfico de Cursos (Span full width) */}
                                <div className="bg-[#1E1E1E]/50 border border-white/5 rounded-2xl p-6 flex flex-col lg:col-span-2">
                                    <h4 className="text-sm font-black text-white uppercase tracking-widest mb-6">Cursos em Destaque</h4>
                                    <div className="h-[250px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={stats.course.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 0, left: 120, bottom: 0 }}>
                                                <XAxis type="number" hide />
                                                <YAxis 
                                                    dataKey="name" 
                                                    type="category" 
                                                    tick={{ fill: '#9CA3AF', fontSize: 10 }} 
                                                    axisLine={false} 
                                                    tickLine={false}
                                                />
                                                <Tooltip 
                                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    contentStyle={{ backgroundColor: '#1E1E1E', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                                                />
                                                <Bar dataKey="value" fill="#FFCC00" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="text-center text-gray-500 py-12">Nenhum dado encontrado.</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
