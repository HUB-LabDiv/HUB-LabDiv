'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { SwipeModerationFeed } from '@/components/admin/SwipeModerationFeed';

interface DashboardCounts {
    // Eixo 01 - Comunidade
    comentariosPendentes: number;
    dicasPendentes: number;
    microArticlesPendentes: number;
    palavrasPendentes: number;
    constelacoesPendentes: number;
    logsPendentes: number;
    totalAutores: number;
    autoresFrequentes: number;
    autoresMestres: number;

    // Eixo 02 - Informativo
    pendentes: number;
    subEditsPendentes: number;
    perguntasPendentes: number;
    perguntasRespondidas: number;
    oportunidadesPendentes: number;
    knowledgePendentes: number;
    reportsPendentes: number;

    // Eixo 03 - Ferramentas
    softwaresPendentes: number;
    softwareFeedbacksPendentes: number;
    arenaPendentes: number;
    trilhasTotal: number;
    tagsTotal: number;

    // Eixo 04 - Perfis & Governança
    pendentesPerfis: number;
    teacherVerifsPendentes: number;
    profileEditsPendentes: number;
    aprovados: number;
    rejeitados: number;
    tempoMedioAprovacao: string;
}

export default function AdminDashboardOverview() {
    const [counts, setCounts] = useState<DashboardCounts>({
        comentariosPendentes: 0,
        dicasPendentes: 0,
        microArticlesPendentes: 0,
        palavrasPendentes: 0,
        constelacoesPendentes: 0,
        logsPendentes: 0,
        totalAutores: 0,
        autoresFrequentes: 0,
        autoresMestres: 0,

        pendentes: 0,
        subEditsPendentes: 0,
        perguntasPendentes: 0,
        perguntasRespondidas: 0,
        oportunidadesPendentes: 0,
        knowledgePendentes: 0,
        reportsPendentes: 0,

        softwaresPendentes: 0,
        softwareFeedbacksPendentes: 0,
        arenaPendentes: 0,
        trilhasTotal: 0,
        tagsTotal: 0,

        pendentesPerfis: 0,
        teacherVerifsPendentes: 0,
        profileEditsPendentes: 0,
        aprovados: 0,
        rejeitados: 0,
        tempoMedioAprovacao: '-',
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isMetricsExpanded, setIsMetricsExpanded] = useState(false);

    useEffect(() => {
        async function fetchCounts() {
            setIsLoading(true);

            try {
                const [
                    pendentesRes, aprovadosRes, rejeitadosRes, subEditsRes,
                    comPendentesRes, dicasRes, microArticlesRes, palavrasRes, constelacoesRes, logsPendentesRes,
                    pergPendentesRes, pergRespondidasRes, oportunidadesRes, wikiPropostasRes, reportsPendentesRes,
                    softwaresRes, softwareFeedbacksRes, arenaRes, trilhasRes, tagsRes,
                    profilesPendentesRes, teacherVerifsRes, profileEditsRes,
                    tempoEsperaRes, subsWithAuthorsRes
                ] = await Promise.all([
                    // Submissões
                    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
                    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'aprovado'),
                    supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'rejeitado'),
                    supabase.from('submissions').select('*', { count: 'exact', head: true }).not('pending_edits', 'is', null),

                    // Comunidade
                    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
                    supabase.from('dicas_veteranos').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('micro_articles').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('palavras_geradoras').select('*', { count: 'exact', head: true }).eq('is_pending', true),
                    supabase.from('constelacao_edges').select('*', { count: 'exact', head: true }).eq('is_pending', true),
                    supabase.from('feedback_reports').select('*', { count: 'exact', head: true }).neq('status', 'closed'),

                    // Informativo
                    supabase.from('perguntas').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
                    supabase.from('perguntas').select('*', { count: 'exact', head: true }).eq('status', 'respondida'),
                    supabase.from('oportunidades').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('wiki_topic_proposals').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
                    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),

                    // Ferramentas
                    supabase.from('academic_softwares').select('*', { count: 'exact', head: true }).eq('status', 'pendente'),
                    supabase.from('software_feedbacks').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('challenge_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                    supabase.from('learning_trails').select('*', { count: 'exact', head: true }),
                    supabase.from('submissions').select('tags').eq('status', 'aprovado'),

                    // Perfis & Governança
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('review_status', 'pending'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('teacher_verification_status', 'pending'),
                    supabase.from('profiles').select('*', { count: 'exact', head: true }).not('pending_edits', 'is', null),

                    // Métricas
                    supabase.from('submissions').select('created_at, updated_at').eq('status', 'aprovado').limit(100),
                    supabase.from('submissions').select('user_id').eq('status', 'aprovado'),
                ]);

                // Tags únicas
                let uniqueTagCount = 0;
                if (tagsRes.data) {
                    const allTags = new Set<string>();
                    (tagsRes.data as { tags: string[] }[]).forEach(s => {
                        if (s.tags) s.tags.forEach(t => allTags.add(t));
                    });
                    uniqueTagCount = allTags.size;
                }

                // Métricas de autores
                let totalAutores = 0, autoresFrequentes = 0, autoresMestres = 0;
                const approvedSubs = (subsWithAuthorsRes.data as { user_id: string }[]) || [];
                if (approvedSubs.length > 0) {
                    const authorCounts: Record<string, number> = {};
                    approvedSubs.forEach(s => {
                        if (s.user_id) authorCounts[s.user_id] = (authorCounts[s.user_id] || 0) + 1;
                    });
                    totalAutores = Object.keys(authorCounts).length;
                    autoresFrequentes = Object.values(authorCounts).filter(c => c >= 3).length;
                    autoresMestres = Object.values(authorCounts).filter(c => c >= 10).length;
                }

                // Tempo Médio
                let tempoMedioStr = '-';
                if (tempoEsperaRes.data && tempoEsperaRes.data.length > 0) {
                    let totalDiff = 0;
                    let validCount = 0;
                    tempoEsperaRes.data.forEach((s: any) => {
                        const created = new Date(s.created_at).getTime();
                        const updated = new Date(s.updated_at).getTime();
                        if (updated > created) {
                            totalDiff += (updated - created);
                            validCount++;
                        }
                    });
                    if (validCount > 0) {
                        const avgMs = totalDiff / validCount;
                        const avgHours = avgMs / (1000 * 60 * 60);
                        tempoMedioStr = avgHours < 24 ? `${avgHours.toFixed(1)}h` : `${(avgHours / 24).toFixed(1)} dias`;
                    }
                }

                setCounts({
                    comentariosPendentes: comPendentesRes.count || 0,
                    dicasPendentes: dicasRes.count || 0,
                    microArticlesPendentes: microArticlesRes.count || 0,
                    palavrasPendentes: palavrasRes.count || 0,
                    constelacoesPendentes: constelacoesRes.count || 0,
                    logsPendentes: logsPendentesRes.count || 0,
                    totalAutores,
                    autoresFrequentes,
                    autoresMestres,

                    pendentes: pendentesRes.count || 0,
                    subEditsPendentes: subEditsRes.count || 0,
                    perguntasPendentes: pergPendentesRes.count || 0,
                    perguntasRespondidas: pergRespondidasRes.count || 0,
                    oportunidadesPendentes: oportunidadesRes.count || 0,
                    knowledgePendentes: wikiPropostasRes.count || 0,
                    reportsPendentes: reportsPendentesRes.count || 0,

                    softwaresPendentes: softwaresRes.count || 0,
                    softwareFeedbacksPendentes: softwareFeedbacksRes.count || 0,
                    arenaPendentes: arenaRes.count || 0,
                    trilhasTotal: trilhasRes.count || 0,
                    tagsTotal: uniqueTagCount,

                    pendentesPerfis: profilesPendentesRes.count || 0,
                    teacherVerifsPendentes: teacherVerifsRes.count || 0,
                    profileEditsPendentes: profileEditsRes.count || 0,
                    aprovados: aprovadosRes.count || 0,
                    rejeitados: rejeitadosRes.count || 0,
                    tempoMedioAprovacao: tempoMedioStr,
                });
            } catch (err) {
                console.error("Erro ao carregar métricas da Torre:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCounts();
    }, []);

    const totalComunidade = counts.comentariosPendentes + counts.dicasPendentes + counts.microArticlesPendentes + counts.palavrasPendentes + counts.constelacoesPendentes + counts.logsPendentes;
    const totalInformativo = counts.pendentes + counts.subEditsPendentes + counts.perguntasPendentes + counts.oportunidadesPendentes + counts.knowledgePendentes + counts.reportsPendentes;
    const totalFerramentas = counts.softwaresPendentes + counts.softwareFeedbacksPendentes + counts.arenaPendentes;
    const totalPerfis = counts.pendentesPerfis + counts.teacherVerifsPendentes + counts.profileEditsPendentes;
    const totalPendenciasGerais = totalComunidade + totalInformativo + totalFerramentas + totalPerfis;

    const axisGroups = [
        {
            id: 'eixo1',
            title: 'Eixo 01 — Comunidade (Social & Interação)',
            color: '#0F4780',
            borderColor: 'border-[#0F4780]/30',
            bgBadge: 'bg-[#0F4780]/20 text-[#0F4780] dark:text-blue-300 border-[#0F4780]/40',
            icon: 'diversity_3',
            cards: [
                { title: 'Comentários', subtitle: 'Aguardando Moderação', count: counts.comentariosPendentes, icon: 'chat_bubble', href: '/admin/moderacao?tab=comentarios', urgent: counts.comentariosPendentes > 0 },
                { title: 'Dicas de Veteranos', subtitle: 'USP 101 Pendentes', count: counts.dicasPendentes, icon: 'school', href: '/admin/moderacao?tab=dicas', urgent: counts.dicasPendentes > 0 },
                { title: 'Drops da Comunidade', subtitle: 'Micro Artigos', count: counts.microArticlesPendentes, icon: 'bolt', href: '/admin/comunidade', urgent: counts.microArticlesPendentes > 0 },
                { title: 'Palavras Geradoras', subtitle: 'Glossário Científico', count: counts.palavrasPendentes, icon: 'translate', href: '/admin/moderacao?tab=palavras', urgent: counts.palavrasPendentes > 0 },
                { title: 'Constelações', subtitle: 'Conexões Conceituais', count: counts.constelacoesPendentes, icon: 'hub', href: '/admin/moderacao?tab=constelacoes', urgent: counts.constelacoesPendentes > 0 },
                { title: 'Denúncias Chat/Feed', subtitle: 'Reports de Interação', count: counts.logsPendentes, icon: 'report', href: '/admin/comunidade', urgent: counts.logsPendentes > 0 },
            ]
        },
        {
            id: 'eixo2',
            title: 'Eixo 02 — Informativo (Publicações & Ciência)',
            color: '#F14343',
            borderColor: 'border-[#F14343]/30',
            bgBadge: 'bg-[#F14343]/20 text-[#F14343] border-[#F14343]/40',
            icon: 'menu_book',
            cards: [
                { title: 'Novas Submissões', subtitle: 'Posts Aguardando', count: counts.pendentes, icon: 'article', href: '/admin/moderacao?tab=submissoes', urgent: counts.pendentes > 0 },
                { title: 'Edições de Post', subtitle: 'Diffs Propostos', count: counts.subEditsPendentes, icon: 'edit_note', href: '/admin/moderacao?tab=submissoes', urgent: counts.subEditsPendentes > 0 },
                { title: 'Pergunte a um Cientista', subtitle: 'Dúvidas da Comunidade', count: counts.perguntasPendentes, icon: 'forum', href: '/admin/perguntas', urgent: counts.perguntasPendentes > 0 },
                { title: 'Mural de Oportunidades', subtitle: 'Bolsas & Estágios', count: counts.oportunidadesPendentes, icon: 'campaign', href: '/admin/moderacao?tab=oportunidades', urgent: counts.oportunidadesPendentes > 0 },
                { title: 'Wiki / Conhecimento', subtitle: 'Propostas de Artigos', count: counts.knowledgePendentes, icon: 'auto_stories', href: '/admin/wiki', urgent: counts.knowledgePendentes > 0 },
                { title: 'Denúncias de Posts', subtitle: 'Conteúdo Reportado', count: counts.reportsPendentes, icon: 'flag', href: '/admin/reports', urgent: counts.reportsPendentes > 0 },
            ]
        },
        {
            id: 'eixo3',
            title: 'Eixo 03 — Ferramentas (Recursos & Softwares)',
            color: '#FFCC00',
            borderColor: 'border-[#FFCC00]/30',
            bgBadge: 'bg-[#FFCC00]/20 text-yellow-600 dark:text-brand-yellow border-[#FFCC00]/40',
            icon: 'terminal',
            cards: [
                { title: 'Softwares Acadêmicos', subtitle: 'Submissão de Ferramentas', count: counts.softwaresPendentes, icon: 'terminal', href: '/admin/moderacao?tab=softwares', urgent: counts.softwaresPendentes > 0 },
                { title: 'Feedbacks de Software', subtitle: 'Avaliações Técnicas', count: counts.softwareFeedbacksPendentes, icon: 'rate_review', href: '/admin/moderacao?tab=softwares', urgent: counts.softwareFeedbacksPendentes > 0 },
                { title: 'Desafios da Arena', subtitle: 'Submissões de Códigos', count: counts.arenaPendentes, icon: 'emoji_events', href: '/admin/moderacao?tab=desafios', urgent: counts.arenaPendentes > 0 },
                { title: 'Trilhas de Estudo', subtitle: 'Roteiros de Aprendizagem', count: counts.trilhasTotal, icon: 'route', href: '/admin/trilhas', urgent: false },
                { title: 'Acervo & Tags', subtitle: 'Termos Catalogados', count: counts.tagsTotal, icon: 'sell', href: '/admin/moderacao?tab=acervo', urgent: false },
            ]
        },
        {
            id: 'eixo4',
            title: 'Eixo 04 — Perfis, Personas & Governança',
            color: '#8B5CF6',
            borderColor: 'border-purple-500/30',
            bgBadge: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
            icon: 'manage_accounts',
            cards: [
                { title: 'Novos Cadastros USP', subtitle: 'Aprovação de Perfis', count: counts.pendentesPerfis, icon: 'how_to_reg', href: '/admin/profiles', urgent: counts.pendentesPerfis > 0 },
                { title: 'Validações Docentes', subtitle: 'Comprovantes IFUSP', count: counts.teacherVerifsPendentes, icon: 'badge', href: '/admin/profiles', urgent: counts.teacherVerifsPendentes > 0 },
                { title: 'Edições de Perfil', subtitle: 'Mudança de Dados/Hobbies', count: counts.profileEditsPendentes, icon: 'person_edit', href: '/admin/profiles', urgent: counts.profileEditsPendentes > 0 },
                { title: 'Submissões Aprovadas', subtitle: 'Acervo Público Ativo', count: counts.aprovados, icon: 'verified', href: '/admin/moderacao?tab=submissoes', urgent: false },
                { title: 'Submissões Arquivadas', subtitle: 'Rejeitadas no Fluxo', count: counts.rejeitados, icon: 'block', href: '/admin/moderacao?tab=submissoes', urgent: false },
                { title: 'Tempo Médio', subtitle: 'Resposta de Moderação', count: counts.tempoMedioAprovacao, icon: 'timer', href: '#', urgent: false },
            ]
        }
    ];

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    <span className="material-symbols-outlined text-[18px]">dashboard</span>
                    <span>Dashboard</span>
                    <span className="text-gray-300 dark:text-gray-600">/</span>
                    <span className="text-[#0055ff]">Torre de Controle</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                            Torre de <span className="text-[#0055ff]">Controle</span>
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Centro de comando e governança do Hub Lab-Div v3.1.5</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/5 dark:bg-card-dark/5 backdrop-blur-md px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
                        <div className="w-2 h-2 rounded-full bg-[#0055ff] animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-brand-yellow animate-pulse delay-150"></div>
                        <span className="text-xs font-semibold text-gray-400 ml-2 uppercase tracking-wider">Status: Online</span>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400 bg-white/5 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <span className="material-symbols-outlined text-4xl animate-spin text-[#0055ff] mb-4">progress_activity</span>
                    <p className="font-medium animate-pulse">Carregando a Torre de Controle...</p>
                </div>
            ) : (
                <>
                    {/* ─── PAINEL DE CARDS SEPARADOS POR EIXO (EXPANSÍVEL VERTICALMENTE NA SETINHA) ─── */}
                    <div className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden transition-all">
                        {/* Botão de Toggle da Barra */}
                        <button
                            onClick={() => setIsMetricsExpanded(prev => !prev)}
                            className="w-full p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-11 h-11 rounded-2xl bg-[#0055ff]/10 text-[#0055ff] flex items-center justify-center shrink-0 border border-[#0055ff]/20">
                                    <span className="material-symbols-outlined text-2xl">account_tree</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-base font-black font-bukra text-gray-900 dark:text-white uppercase tracking-tight">
                                            Métricas & Moderações por Eixo da Marca
                                        </h2>
                                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-brand-yellow/15 text-brand-yellow font-black border border-brand-yellow/30 uppercase">
                                            {totalPendenciasGerais} Pendências Totais
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-open-sans mt-0.5">
                                        {isMetricsExpanded
                                            ? 'Clique na seta para recolher os cards e focar na moderação direta.'
                                            : 'Clique na seta para expandir os cards separados por Comunidade, Informativo, Ferramentas e Governança.'}
                                    </p>
                                </div>
                            </div>

                            {/* Resumo visual rápido por Eixo + Botão com setinha animada */}
                            <div className="flex items-center gap-3 self-end sm:self-center">
                                <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono font-bold">
                                    <span className="px-2.5 py-1 rounded-xl bg-[#0F4780]/20 text-[#0F4780] dark:text-blue-300 border border-[#0F4780]/30">
                                        Eixo 1: {totalComunidade}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-xl bg-[#F14343]/20 text-[#F14343] border border-[#F14343]/30">
                                        Eixo 2: {totalInformativo}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-xl bg-[#FFCC00]/20 text-yellow-600 dark:text-brand-yellow border border-[#FFCC00]/30">
                                        Eixo 3: {totalFerramentas}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                                        Eixo 4: {totalPerfis}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                                    <span>{isMetricsExpanded ? 'Ocultar' : 'Expandir'}</span>
                                    <motion.span
                                        animate={{ rotate: isMetricsExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="material-symbols-outlined text-[20px]"
                                    >
                                        keyboard_arrow_down
                                    </motion.span>
                                </div>
                            </div>
                        </button>

                        {/* Conteúdo expansível verticalmente */}
                        <AnimatePresence>
                            {isMetricsExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                                    className="overflow-hidden border-t border-gray-100 dark:border-white/5 p-6 sm:p-8 space-y-10"
                                >
                                    {axisGroups.map(group => (
                                        <div key={group.id} className="space-y-4">
                                            {/* Cabeçalho do Eixo */}
                                            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/5">
                                                <div className="flex items-center gap-2.5">
                                                    <span
                                                        className="w-3 h-3 rounded-full shrink-0"
                                                        style={{ backgroundColor: group.color }}
                                                    />
                                                    <h3 className="text-sm font-black font-bukra uppercase tracking-wider text-gray-900 dark:text-white">
                                                        {group.title}
                                                    </h3>
                                                </div>
                                                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold border ${group.bgBadge}`}>
                                                    {group.cards.reduce((acc, c) => acc + (typeof c.count === 'number' ? c.count : 0), 0)} itens
                                                </span>
                                            </div>

                                            {/* Cards do Eixo */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {group.cards.map(card => (
                                                    <Link
                                                        key={card.title}
                                                        href={card.href}
                                                        className={`relative group bg-white/60 dark:bg-[#1E1E1E]/40 backdrop-blur-md rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer hover:${group.borderColor}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-3">
                                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                                                {card.subtitle}
                                                            </span>
                                                            <div
                                                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.urgent ? 'animate-pulse' : ''}`}
                                                                style={{
                                                                    backgroundColor: `${group.color}20`,
                                                                    color: group.color
                                                                }}
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-baseline justify-between gap-2">
                                                            <span className="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight">
                                                                {card.count}
                                                            </span>
                                                            {card.urgent && (
                                                                <span
                                                                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                                                                    style={{
                                                                        backgroundColor: `${group.color}25`,
                                                                        color: group.color
                                                                    }}
                                                                >
                                                                    ⚡ Ação
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 mt-1 block">
                                                            {card.title}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* ─── FILA UNIFICADA DE MODERAÇÃO (SWIPE & BATCH QUEUE) ─── */}
                    <div className="pt-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                            <div>
                                <h2 className="text-xl font-black font-bukra text-gray-900 dark:text-white flex items-center gap-2.5">
                                    <span className="material-symbols-outlined text-[#0055ff] text-2xl">swipe</span>
                                    Fila Unificada de Moderação
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-open-sans">
                                    Avalie novos cadastros, validações docentes, submissões, edições e denúncias com gestos rápidos ou teclado.
                                </p>
                            </div>
                        </div>

                        <SwipeModerationFeed />
                    </div>

                    {/* ─── Engajamento Section ─── */}
                    <div className="pt-4">
                        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                            <span className="material-symbols-outlined text-brand-red text-2xl">diversity_3</span>
                            Engajamento da Comunidade
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Autores</span>
                                <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">{counts.totalAutores}</div>
                                <div className="text-[10px] font-bold text-[#0055ff] mt-1">PESQUISADORES ATIVOS</div>
                            </div>
                            <div className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Frequentes (3+)</span>
                                <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">{counts.autoresFrequentes}</div>
                                <div className="text-[10px] font-bold text-brand-yellow mt-1">RUMO À MAESTRIA</div>
                            </div>
                            <div className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Mestres (10+)</span>
                                <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">{counts.autoresMestres}</div>
                                <div className="text-[10px] font-bold text-brand-red mt-1">LÍDERES DE DIVULGAÇÃO</div>
                            </div>
                            <div className="bg-white/40 dark:bg-card-dark/5 backdrop-blur-md rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Oportunidades</span>
                                <div className="text-3xl font-black text-gray-900 dark:text-white mt-1">{counts.oportunidadesPendentes}</div>
                                <div className="text-[10px] font-bold text-[#0055ff] mt-1">MURAL ATIVO</div>
                            </div>
                        </div>
                    </div>

                    {/* Footer da Torre */}
                    <div className="pt-8 mb-8 border-t border-gray-800 flex justify-center text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold">
                        Sistema Lab-Div v3.1.5 • Torre de Controle
                    </div>
                </>
            )}
        </div>
    );
}
