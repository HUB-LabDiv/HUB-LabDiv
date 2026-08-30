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

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    RefreshCw,
    Search,
    Plus,
    FileText,
    Image as ImageIcon,
    Video,
    FolderArchive,
    Edit3,
    ExternalLink,
    Sparkles,
    CheckCircle2,
    Calendar,
    Building2,
    ArrowRight,
    X,
    Filter,
    BookMarked,
    GraduationCap,
    Download,
    Eye,
    SlidersHorizontal,
    ChevronRight,
    Layers,
    Share2
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { JupiterSyncModal } from '@/app/ferramentas/JupiterSyncModal';
import {
    EnrolledSubject,
    SubjectCatalogItem,
    fetchSubjectNotes,
    fetchAllSubjectsCatalog
} from '@/app/actions/anotacoes';
import { PostDTO } from '@/dtos/media';
import { parseMediaUrl, getOptimizedUrl } from '@/lib/media-utils';
import { Avatar } from '@/components/ui/Avatar';

interface AnotacoesClientViewProps {
    initialEnrolledSubjects: EnrolledSubject[];
    hasJupiterCache: boolean;
    lastSyncedAt?: string;
    catalogSubjects: SubjectCatalogItem[];
    user: any;
    profile: any;
}

const INSTITUTE_TABS = ['Todos', 'IFUSP', 'IME', 'IAG', 'IQ', 'IO'];

export function AnotacoesClientView({
    initialEnrolledSubjects,
    hasJupiterCache,
    lastSyncedAt,
    catalogSubjects,
    user,
    profile
}: AnotacoesClientViewProps) {
    const router = useRouter();
    const [enrolledSubjects, setEnrolledSubjects] = useState<EnrolledSubject[]>(initialEnrolledSubjects);
    const [selectedSubject, setSelectedSubject] = useState<EnrolledSubject | SubjectCatalogItem | null>(
        initialEnrolledSubjects[0] || catalogSubjects[0] || null
    );
    const [subjectNotes, setSubjectNotes] = useState<{ post: PostDTO; topicIndex?: number }[]>([]);
    const [isLoadingNotes, setIsLoadingNotes] = useState(false);
    const [isJupiterModalOpen, setIsJupiterModalOpen] = useState(false);
    const [notesSearchQuery, setNotesSearchQuery] = useState('');
    const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
    const [selectedInstituteTab, setSelectedInstituteTab] = useState('Todos');
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    // Carregar anotações da matéria selecionada
    useEffect(() => {
        if (!selectedSubject) {
            setSubjectNotes([]);
            return;
        }

        let isMounted = true;
        setIsLoadingNotes(true);

        fetchSubjectNotes({
            trailId: (selectedSubject as any).trailId || (selectedSubject as any).id,
            courseCode: selectedSubject.code,
            mediaTypes: selectedFormat ? [selectedFormat] : undefined,
            query: notesSearchQuery
        })
            .then(res => {
                if (isMounted) {
                    setSubjectNotes(res.items);
                }
            })
            .catch(err => {
                console.error('Erro ao buscar anotações:', err);
                toast.error('Não foi possível carregar as anotações desta disciplina.');
            })
            .finally(() => {
                if (isMounted) setIsLoadingNotes(false);
            });

        return () => {
            isMounted = false;
        };
    }, [selectedSubject, selectedFormat, notesSearchQuery]);

    // Filtragem do catálogo geral de matérias
    const filteredCatalog = useMemo(() => {
        return catalogSubjects.filter(sub => {
            const matchesInstitute =
                selectedInstituteTab === 'Todos' ||
                (sub.institute && sub.institute.toLowerCase() === selectedInstituteTab.toLowerCase());

            const matchesSearch =
                !catalogSearchQuery.trim() ||
                sub.code.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
                sub.title.toLowerCase().includes(catalogSearchQuery.toLowerCase());

            return matchesInstitute && matchesSearch;
        });
    }, [catalogSubjects, selectedInstituteTab, catalogSearchQuery]);

    const handleJupiterSyncSuccess = () => {
        setIsJupiterModalOpen(false);
        toast.success('Disciplinas sincronizadas com sucesso! Atualizando painel...');
        startTransition(() => {
            router.refresh();
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 pb-16">
            {/* ─── 1. BANNER TOPO & SINCRONIZAÇÃO JÚPITER ─── */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1E1E] via-[#161616] to-[#121212] border border-white/10 p-6 sm:p-8 shadow-2xl">
                {/* Glow decorativo de fundo */}
                <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-brand-blue/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30 text-[10px] font-black font-bukra uppercase tracking-widest">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Acervo Acadêmico Coletivo</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black font-bukra uppercase tracking-wider text-white">
                            Central de <span className="text-brand-yellow">Anotações</span> & Cadernos
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
                            Acesse resumos de aulas, cadernos digitalizados, listas resolvidas e notas de monitoria catalogadas por matéria. Sincronize com o Júpiter para carregar sua grade atual.
                        </p>
                    </div>

                    {/* Bloco de Ação Júpiter */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
                        <button
                            onClick={() => setIsJupiterModalOpen(true)}
                            className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-black font-bukra uppercase tracking-wider shadow-lg shadow-brand-blue/25 hover:shadow-brand-blue/40 transition-all border border-brand-blue/40 cursor-pointer active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4 animate-spin-slow" />
                            <span>{hasJupiterCache ? 'Atualizar Júpiter' : 'Sincronizar Júpiter'}</span>
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className={`size-2 rounded-full ${hasJupiterCache ? 'bg-emerald-400 animate-pulse' : 'bg-brand-yellow'}`} />
                        <span>
                            {hasJupiterCache
                                ? `JúpiterWeb ativo • ${enrolledSubjects.length} matérias em curso identificadas`
                                : 'Sincronize com o Júpiter para listar automaticamente as disciplinas do seu semestre'}
                        </span>
                    </div>
                    {lastSyncedAt && (
                        <span className="text-[11px] text-gray-500">
                            Última atualização: {new Date(lastSyncedAt).toLocaleDateString('pt-BR')}
                        </span>
                    )}
                </div>
            </section>

            {/* ─── 2. MINHAS MATÉRIAS EM CURSO (SEMESTRE ATUAL) ─── */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <GraduationCap className="w-5 h-5 text-brand-yellow" />
                        <h2 className="text-lg sm:text-xl font-black font-bukra uppercase tracking-wider text-white">
                            Minhas Disciplinas em Curso
                        </h2>
                    </div>
                    <span className="text-xs text-gray-400 font-sans">
                        {enrolledSubjects.length} {enrolledSubjects.length === 1 ? 'matéria' : 'matérias'}
                    </span>
                </div>

                {enrolledSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                        {enrolledSubjects.map(sub => {
                            const isSelected = selectedSubject?.code === sub.code;
                            return (
                                <motion.div
                                    key={sub.code}
                                    whileHover={{ scale: 1.015 }}
                                    whileTap={{ scale: 0.985 }}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                                        isSelected
                                            ? 'bg-brand-blue/15 border-brand-blue shadow-lg shadow-brand-blue/15 ring-2 ring-brand-blue/30'
                                            : 'bg-[#1E1E1E]/90 hover:bg-[#252525] border-white/10 hover:border-brand-blue/40 shadow-sm'
                                    }`}
                                >
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-0.5 rounded-lg bg-white/10 text-brand-yellow font-bukra font-black text-[10px] tracking-wider uppercase">
                                                {sub.code}
                                            </span>
                                            <span className="text-[10px] font-bukra font-bold text-gray-400 uppercase">
                                                {sub.institute || 'IFUSP'}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-bold font-sans text-white line-clamp-2 leading-snug">
                                            {sub.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-sans">
                                        <span className="text-gray-400 flex items-center gap-1.5">
                                            <BookMarked className="w-3.5 h-3.5 text-brand-blue" />
                                            <strong className="text-white">{sub.notesCount}</strong> {sub.notesCount === 1 ? 'anotação' : 'anotações'}
                                        </span>
                                        <span className={`text-[10px] font-bukra font-bold uppercase tracking-wider flex items-center gap-1 ${isSelected ? 'text-brand-yellow' : 'text-gray-500'}`}>
                                            {isSelected ? 'Ativa' : 'Abrir'} <ChevronRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-6 rounded-2xl bg-[#1E1E1E]/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-white font-sans">
                                Nenhuma disciplina em curso configurada ainda
                            </p>
                            <p className="text-xs text-gray-400 font-sans">
                                Sincronize com o JúpiterWeb para carregar suas matérias automaticamente ou explore o catálogo abaixo.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsJupiterModalOpen(true)}
                            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-black font-bukra uppercase tracking-wider transition-all shrink-0 cursor-pointer"
                        >
                            Conectar Júpiter
                        </button>
                    </div>
                )}
            </section>

            {/* ─── 3. PAINEL DE ANOTAÇÕES DA MATÉRIA SELECIONADA ─── */}
            {selectedSubject && (
                <section className="rounded-3xl bg-[#1E1E1E] border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl">
                    {/* Header da Disciplina Selecionada */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 rounded-xl bg-brand-yellow/20 text-brand-yellow text-xs font-black font-bukra uppercase tracking-wider border border-brand-yellow/30">
                                    {selectedSubject.code}
                                </span>
                                <span className="text-xs text-gray-400 font-bukra font-bold uppercase">
                                    {selectedSubject.institute || 'IFUSP'}
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black font-bukra uppercase tracking-wide text-white">
                                {selectedSubject.title}
                            </h2>
                            <p className="text-xs text-gray-400 font-sans">
                                Cadernos de aula, resumos teóricos, resoluções de listas e notas compartilhadas pela comunidade.
                            </p>
                        </div>

                        {/* Botão de Enviar Nova Anotação */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Link
                                href={`/enviar?courseCode=${encodeURIComponent(selectedSubject.code)}&title=${encodeURIComponent(`Anotações de ${selectedSubject.title}`)}&category=Anotações`}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-yellow hover:bg-yellow-400 text-gray-950 text-xs font-black font-bukra uppercase tracking-wider shadow-lg shadow-brand-yellow/20 transition-all cursor-pointer w-full md:w-auto"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Contribuir Anotação</span>
                            </Link>
                        </div>
                    </div>

                    {/* Filtros e Barra de Busca Interna */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        {/* Filtros de Formato */}
                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { label: 'Todos', value: null },
                                { label: 'PDFs', value: 'pdf', icon: FolderArchive },
                                { label: 'Imagens', value: 'image', icon: ImageIcon },
                                { label: 'Notes', value: 'sdocx', icon: Edit3 },
                                { label: 'Vídeos', value: 'video', icon: Video },
                                { label: 'Texto', value: 'text', icon: FileText }
                            ].map(fmt => {
                                const isActive = selectedFormat === fmt.value;
                                const Icon = fmt.icon;
                                return (
                                    <button
                                        key={fmt.label}
                                        onClick={() => setSelectedFormat(fmt.value)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bukra font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                                            isActive
                                                ? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20'
                                                : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border-white/5'
                                        }`}
                                    >
                                        {Icon && <Icon className="w-3 h-3" />}
                                        <span>{fmt.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Campo de Busca Rápida */}
                        <div className="relative w-full sm:w-64">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={notesSearchQuery}
                                onChange={e => setNotesSearchQuery(e.target.value)}
                                placeholder="Buscar anotação..."
                                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-all"
                            />
                            {notesSearchQuery && (
                                <button
                                    onClick={() => setNotesSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Lista / Grid de Anotações */}
                    {isLoadingNotes ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
                            {[1, 2, 3].map(n => (
                                <div key={n} className="h-44 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
                            ))}
                        </div>
                    ) : subjectNotes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {subjectNotes.map(({ post, topicIndex }) => {
                                const urls = parseMediaUrl(post.mediaUrl);
                                const previewUrl = urls[0] ? getOptimizedUrl(urls[0], 400, 70, post.category, post.mediaType) : null;

                                return (
                                    <motion.article
                                        key={post.id}
                                        whileHover={{ y: -3 }}
                                        className="group rounded-2xl bg-[#171717] border border-white/10 hover:border-brand-blue/50 overflow-hidden flex flex-col justify-between transition-all shadow-md"
                                    >
                                        <div className="p-4 space-y-3">
                                            {/* Top info */}
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="px-2.5 py-0.5 rounded-lg bg-brand-blue/15 text-brand-blue text-[9px] font-black font-bukra uppercase tracking-wider">
                                                    {post.mediaType === 'sdocx' ? 'Notes' : post.mediaType.toUpperCase()}
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-sans">
                                                    {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>

                                            {/* Título & Descrição */}
                                            <div>
                                                <Link
                                                    href={`/arquivo/${post.id}`}
                                                    className="text-sm font-black font-bukra text-white group-hover:text-brand-blue transition-colors line-clamp-2 leading-tight"
                                                >
                                                    {post.title}
                                                </Link>
                                                {post.description && (
                                                    <p className="text-xs text-gray-400 font-sans line-clamp-2 mt-1.5 leading-relaxed">
                                                        {post.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Footer do Card */}
                                        <div className="p-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={post.avatarUrl}
                                                    name={post.authors || 'Colaborador'}
                                                    size="xs"
                                                />
                                                <span className="text-[11px] font-sans text-gray-300 font-medium truncate max-w-[120px]">
                                                    {post.authors || 'Anônimo'}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/arquivo/${post.id}`}
                                                className="inline-flex items-center gap-1 text-[11px] font-bukra font-bold text-brand-yellow hover:underline uppercase tracking-wider"
                                            >
                                                <span>Acessar</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 px-6 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center space-y-3">
                            <BookOpen className="w-10 h-10 text-gray-600 mx-auto" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white font-sans">
                                    Nenhuma anotação encontrada para esta matéria ainda
                                </p>
                                <p className="text-xs text-gray-400 font-sans max-w-md mx-auto">
                                    Seja o primeiro a compartilhar seu caderno, resumo de aula ou lista de exercícios resolvida!
                                </p>
                            </div>
                            <Link
                                href={`/enviar?courseCode=${encodeURIComponent(selectedSubject.code)}&title=${encodeURIComponent(`Anotações de ${selectedSubject.title}`)}&category=Anotações`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-black font-bukra uppercase tracking-wider transition-all cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Enviar Caderno / Anotação</span>
                            </Link>
                        </div>
                    )}
                </section>
            )}

            {/* ─── 4. EXPLORADOR GERAL DE DISCIPLINAS (ACERVO COMPLETO USP) ─── */}
            <section className="space-y-4 pt-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <Building2 className="w-5 h-5 text-brand-blue" />
                        <h2 className="text-lg sm:text-xl font-black font-bukra uppercase tracking-wider text-white">
                            Explorador de Matérias da USP
                        </h2>
                    </div>

                    {/* Busca no Catálogo */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={catalogSearchQuery}
                            onChange={e => setCatalogSearchQuery(e.target.value)}
                            placeholder="Buscar código ou matéria..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1E1E1E] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-blue transition-all"
                        />
                    </div>
                </div>

                {/* Abas de Institutos */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {INSTITUTE_TABS.map(inst => {
                        const isActive = selectedInstituteTab === inst;
                        return (
                            <button
                                key={inst}
                                onClick={() => setSelectedInstituteTab(inst)}
                                className={`px-4 py-2 rounded-xl text-xs font-bukra font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer border ${
                                    isActive
                                        ? 'bg-brand-blue text-white border-brand-blue shadow-md shadow-brand-blue/20'
                                        : 'bg-[#1E1E1E] hover:bg-[#252525] text-gray-400 hover:text-white border-white/10'
                                }`}
                            >
                                {inst}
                            </button>
                        );
                    })}
                </div>

                {/* Grid do Catálogo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {filteredCatalog.map(item => {
                        const isSelected = selectedSubject?.code === item.code;
                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ scale: 1.01 }}
                                onClick={() => {
                                    setSelectedSubject(item);
                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                }}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                                    isSelected
                                        ? 'bg-brand-blue/15 border-brand-blue'
                                        : 'bg-[#1E1E1E] hover:bg-[#252525] border-white/10'
                                }`}
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="px-2 py-0.5 rounded-lg bg-white/10 text-brand-yellow font-bukra font-black text-[10px] tracking-wider uppercase">
                                            {item.code}
                                        </span>
                                        <span className="text-[10px] font-bukra font-bold text-gray-400 uppercase">
                                            {item.institute || 'IFUSP'}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold font-sans text-white line-clamp-2">
                                        {item.title}
                                    </h4>
                                </div>

                                <div className="flex items-center justify-between text-[10px] text-gray-400 pt-2 border-t border-white/5">
                                    <span>
                                        <strong className="text-white">{item.notesCount}</strong> {item.notesCount === 1 ? 'material' : 'materiais'}
                                    </span>
                                    <span className="text-brand-yellow font-bukra font-bold uppercase">
                                        Ver Acervo →
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ─── 5. MODAL DE SINCRONIZAÇÃO COM JÚPITER ─── */}
            <JupiterSyncModal
                isOpen={isJupiterModalOpen}
                onClose={() => setIsJupiterModalOpen(false)}
                onSuccess={handleJupiterSyncSuccess}
                user={user}
                profile={profile}
            />
        </div>
    );
}
