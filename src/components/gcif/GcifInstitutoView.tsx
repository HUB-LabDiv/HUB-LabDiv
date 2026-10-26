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

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    Landmark,
    Workflow,
    Info,
    Sparkles,
    ArrowRight,
    ChevronRight,
    MapPin,
    Building2,
    Users,
    Clock,
    Calendar,
    Newspaper,
    Search,
    X
} from 'lucide-react';
import { NetflixFeed } from '@/components/shared/NetflixFeed';
import { ColisorIcon } from '@/components/icons/ColisorIcon';
import dynamic from 'next/dynamic';
import { DepartmentGrid } from '@/components/wiki/instituto/DepartmentGrid';
import { InstitutoTimeline } from '@/components/wiki/instituto/InstitutoTimeline';
import { HistoricalPosts } from '@/components/wiki/instituto/HistoricalPosts';
import { HackerspaceCard } from '@/components/espacos/HackerspaceCard';
import { initiativesData } from '@/data/initiativesData';
import { Initiative } from '@/types/initiatives';
import { InitiativeCard } from '@/components/gcif/InitiativeCard';
import { InitiativeDetailsModal } from '@/components/gcif/InitiativeDetailsModal';
import { eventsData } from '@/data/eventsData';
import { newsData } from '@/data/newsData';
import { EventItem } from '@/types/events';
import { NewsItem } from '@/types/news';
import { EventCard } from '@/components/gcif/EventCard';
import { EventDetailsModal } from '@/components/gcif/EventDetailsModal';
import { NewsCard } from '@/components/gcif/NewsCard';
import { NewsDetailsModal } from '@/components/gcif/NewsDetailsModal';
import { spacesData } from '@/data/spacesData';
import { SpaceItem } from '@/types/spaces';
import { SpaceCard } from '@/components/gcif/SpaceCard';
import { SpaceDetailsModal } from '@/components/gcif/SpaceDetailsModal';

const CampusMap = dynamic(() => import('@/components/map/CampusMap').then(mod => mod.CampusMap), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-square rounded-3xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-800" />
    )
});

interface GcifInstitutoViewProps {
    mapItems: any[];
}

const influencers = [
    {
        name: 'Canoa Da Lagoa',
        role: 'Divulgação Científica',
        bio: 'Canal do YouTube com conteúdo de física e ciência para todos.',
        imagePlaceholder: 'CL',
        color: 'brand-red',
        platform: 'youtube',
        link: 'https://www.youtube.com/@CanoadaLagoa/featured'
    },
    {
        name: 'Saficada Física',
        role: '@saficadafisica',
        bio: 'Física com humor e acessibilidade no TikTok.',
        imagePlaceholder: 'SF',
        color: 'brand-blue',
        platform: 'tiktok',
        link: 'https://www.tiktok.com/@saficadafisica'
    },
    {
        name: 'Gustavo Alves',
        role: 'Física e Vida Acadêmica',
        bio: 'Rotina de estudos, dicas de graduação e vida acadêmica na física.',
        imagePlaceholder: 'GA',
        color: 'brand-blue',
        platform: 'youtube',
        link: 'https://www.youtube.com/@ViverComoFisico'
    },
    {
        name: 'Alexandria 21',
        role: 'Agnessa',
        bio: 'Ciência, história e cultura científica no YouTube.',
        imagePlaceholder: 'A21',
        color: 'brand-red',
        platform: 'youtube',
        link: 'https://www.youtube.com/@Alexandria21'
    },
    {
        name: 'Ana Pleiade',
        role: '@a_pleiade',
        bio: 'Astronomia, astrofísica e inspiração científica no Instagram.',
        imagePlaceholder: 'AP',
        color: 'brand-blue',
        platform: 'instagram',
        link: 'https://www.instagram.com/a_pleiade'
    },
    {
        name: 'Levitang',
        role: '@levitang',
        bio: 'Física e divulgação científica no TikTok.',
        imagePlaceholder: 'LV',
        color: 'brand-blue',
        platform: 'tiktok',
        link: 'https://www.tiktok.com/@levitang'
    },
];

const getPlatformIcon = (platform: string) => {
    if (platform === 'youtube') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>;
    if (platform === 'instagram') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
    if (platform === 'tiktok') return <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.8-5.46-.4-2.51.36-5.17 2.05-7.11 1.57-1.79 4.11-2.9 6.55-2.73 0 1.34.02 2.69 0 4.03-1.07-.15-2.18.06-3.12.63-1.08.66-1.85 1.83-2.02 3.1-.15 1.14.07 2.34.61 3.32.78 1.45 2.58 2.36 4.19 2.03 2.15-.46 3.65-2.42 3.65-4.66.01-4.8.01-9.61 0-14.41-.01-.57-.01-1.14-.01-1.71h.01z" /></svg>;
    return <span className="material-symbols-outlined text-[18px]">open_in_new</span>;
};

export function GcifInstitutoView({ mapItems }: GcifInstitutoViewProps) {
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
    const [selectedSpace, setSelectedSpace] = useState<SpaceItem | null>(null);
    const [eventFilter, setEventFilter] = useState<string>('todos');
    const [spaceFilter, setSpaceFilter] = useState<string>('todos');
    const [newsFilter, setNewsFilter] = useState<string>('todas');
    const [newsSearch, setNewsSearch] = useState<string>('');

    const eventsList = Object.values(eventsData);
    const filteredEvents = eventFilter === 'todos' 
        ? eventsList 
        : eventsList.filter(evt => evt.tipo === eventFilter);

    const spacesList = Object.values(spacesData);
    const filteredSpaces = spaceFilter === 'todos'
        ? spacesList
        : spacesList.filter(sp => sp.categoria === spaceFilter);

    const filteredNews = newsData.filter(item => {
        const matchesCategory = newsFilter === 'todas' || item.categoria?.toLowerCase() === newsFilter.toLowerCase();
        const matchesSearch = !newsSearch.trim() || 
            item.titulo.toLowerCase().includes(newsSearch.toLowerCase()) ||
            item.resumo.toLowerCase().includes(newsSearch.toLowerCase()) ||
            (item.autor && item.autor.toLowerCase().includes(newsSearch.toLowerCase())) ||
            item.tags.some(tag => tag.toLowerCase().includes(newsSearch.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const newsCategories = [
        { id: 'todas', label: 'Todas' },
        { id: 'Institucional', label: 'Institucional' },
        { id: 'Pesquisa', label: 'Pesquisa' },
        { id: 'Premiação', label: 'Premiação' },
        { id: 'Extensão', label: 'Extensão' },
        { id: 'Ensino', label: 'Ensino' },
    ];

    return (
        <div className="w-full space-y-16 pb-16">
            {/* Header Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-blue-50/20 dark:from-[#1E1E1E] dark:via-[#161616] dark:to-[#0f0f0f] border border-gray-200 dark:border-white/10 p-6 sm:p-10 shadow-xl dark:shadow-2xl flex flex-col xl:flex-row justify-between items-start gap-8">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-blue-ifusp/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue-ifusp/15 border border-brand-blue-ifusp/30 text-brand-blue dark:text-blue-300 text-xs font-black uppercase tracking-wider mb-3">
                        <Landmark className="w-3.5 h-3.5" />
                        Instituto de Física da Universidade de São Paulo
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white font-bukra tracking-tight">
                        O Instituto, Iniciativas & Espaços
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 font-open-sans mt-3 leading-relaxed">
                        Conheça a estrutura, história, departamentos, laboratórios, entidades estudantis e a comunidade de divulgadores que constroem a ciência no IFUSP.
                    </p>
                </div>

                <div className="relative z-10 w-full xl:w-auto">
                    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-lg w-full xl:min-w-[340px]">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-blue-ifusp to-brand-blue-ifusp/20 flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(31,159,207,0.3)] shrink-0">
                                <Landmark className="text-white w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-[9px] font-mono font-black uppercase text-brand-blue-ifusp tracking-widest flex items-center gap-1.5 mb-0.5">
                                    Instituto_Identificado
                                    <span className="px-1.5 py-0.5 bg-brand-blue-ifusp/10 text-brand-blue-ifusp border border-brand-blue-ifusp/30 rounded text-[7px] font-black uppercase tracking-widest">PADRÃO DO HUB</span>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-gray-200 font-bukra uppercase">
                                    IFUSP
                                </div>
                            </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex flex-col gap-2.5">
                            <div className="flex items-start gap-2">
                                <Info className="w-3.5 h-3.5 text-amber-600 dark:text-brand-yellow shrink-0 mt-0.5" />
                                <p className="text-[10px] font-open-sans text-gray-600 dark:text-gray-400 leading-snug">
                                    Não é do IF? As informações de outros institutos estão em construção.
                                </p>
                            </div>
                            <button onClick={() => toast.success('Recurso em desenvolvimento! Em breve você poderá favoritar outros institutos.', { icon: '🚧' })} className="w-full bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 text-gray-800 dark:text-white border border-gray-200 dark:border-white/10 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 hover:border-gray-300 dark:hover:border-white/30 cursor-pointer">
                                Explorar Outro Instituto
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Departamentos */}
            <div id="estrutura-departamentos" data-tour="gcif-instituto-departamentos" className="scroll-mt-24">
                <DepartmentGrid />
            </div>

            {/* 2. Agenda de Eventos & Colóquios */}
            <div id="agenda-eventos" data-tour="gcif-instituto-eventos" className="space-y-4">
                <NetflixFeed 
                    title="Agenda & Colóquios" 
                    icon={<div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 dark:text-brand-yellow"><Calendar className="w-5 h-5" /></div>}
                    filterBar={
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { id: 'todos', label: 'Todos', count: eventsList.length },
                                { id: 'coloquio', label: 'Colóquios', count: eventsList.filter(e => e.tipo === 'coloquio').length },
                                { id: 'convite-fisica', label: 'Convite à Física', count: eventsList.filter(e => e.tipo === 'convite-fisica').length },
                                { id: 'seminario', label: 'Seminários', count: eventsList.filter(e => e.tipo === 'seminario').length },
                                { id: 'workshop', label: 'Workshops', count: eventsList.filter(e => e.tipo === 'workshop').length },
                                { id: 'institucional', label: 'Institucional', count: eventsList.filter(e => e.tipo === 'institucional').length },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setEventFilter(f.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider font-bukra transition-all shrink-0 cursor-pointer ${
                                        eventFilter === f.id
                                            ? 'bg-[#FFCC00] text-[#0F4780] shadow-md scale-105'
                                            : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30'
                                    }`}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    }
                >
                    {filteredEvents.map(event => (
                        <EventCard 
                            key={event.id}
                            event={event}
                            onOpenDetails={setSelectedEvent}
                        />
                    ))}
                </NetflixFeed>
            </div>

            {/* 3. Notícias & Destaques Institucionais */}
            <div id="noticias-ifusp" data-tour="gcif-instituto-noticias" className="space-y-4">
                <NetflixFeed 
                    title="Notícias & Destaques" 
                    icon={<div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue"><Newspaper className="w-5 h-5" /></div>}
                    filterBar={
                        <div className="space-y-3 pb-2">
                            {/* Barra de Busca de Notícias */}
                            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text"
                                        value={newsSearch}
                                        onChange={(e) => setNewsSearch(e.target.value)}
                                        placeholder="Buscar notícias por título, resumo ou palavra-chave..."
                                        className="w-full pl-10 pr-9 py-2 rounded-2xl bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-white/10 text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0F4780]/30 dark:focus:ring-[#FFCC00]/30 transition-all font-open-sans"
                                    />
                                    {newsSearch && (
                                        <button
                                            onClick={() => setNewsSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white cursor-pointer"
                                            title="Limpar busca"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                                <div className="text-[11px] font-mono font-bold text-gray-500 dark:text-gray-400 shrink-0">
                                    Exibindo {filteredNews.length} de {newsData.length} notícias
                                </div>
                            </div>

                            {/* Categorias */}
                            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                                {newsCategories.map(cat => {
                                    const count = cat.id === 'todas' 
                                        ? newsData.length 
                                        : newsData.filter(n => n.categoria?.toLowerCase() === cat.id.toLowerCase()).length;
                                    if (count === 0 && cat.id !== 'todas') return null;
                                    const isActive = newsFilter.toLowerCase() === cat.id.toLowerCase();
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => setNewsFilter(cat.id)}
                                            className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider font-bukra transition-all shrink-0 cursor-pointer ${
                                                isActive
                                                    ? 'bg-[#0F4780] text-white dark:bg-[#FFCC00] dark:text-[#0F4780] shadow-md scale-105'
                                                    : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30'
                                            }`}
                                        >
                                            {cat.label} ({count})
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    }
                >
                    {filteredNews.length > 0 ? (
                        filteredNews.map(item => (
                            <NewsCard 
                                key={item.id}
                                news={item}
                                onOpenDetails={setSelectedNews}
                            />
                        ))
                    ) : (
                        <div className="w-full py-10 flex flex-col items-center justify-center text-center p-6 bg-white dark:bg-[#1E1E1E] rounded-3xl border border-dashed border-gray-300 dark:border-white/10 shrink-0 min-w-full">
                            <Newspaper className="w-10 h-10 text-gray-400 mb-2 stroke-[1.5]" />
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 font-bukra">
                                Nenhuma notícia encontrada para sua busca
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-open-sans mt-1">
                                Tente usar termos mais amplos ou limpe os filtros aplicados.
                            </p>
                            <button
                                onClick={() => { setNewsSearch(''); setNewsFilter('todas'); }}
                                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-bold text-gray-700 dark:text-gray-200 transition-all cursor-pointer font-bukra uppercase"
                            >
                                Limpar Busca e Filtros
                            </button>
                        </div>
                    )}
                </NetflixFeed>
            </div>

            {/* 4. Iniciativas de Impacto */}
            <div id="iniciativas-impacto" data-tour="gcif-instituto-iniciativas" className="space-y-6">
                <NetflixFeed 
                    title="Iniciativas de Impacto" 
                    icon={<div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue"><ColisorIcon size={20} animate={false} /></div>}
                >
                    {Object.values(initiativesData).map((initiative) => (
                        <InitiativeCard 
                            key={initiative.id} 
                            initiative={initiative} 
                            onOpenDetails={setSelectedInitiative} 
                        />
                    ))}
                </NetflixFeed>
            </div>

            {/* Canais de Divulgação (Influenciadores e Criadores do IF) */}
            <div id="canais-divulgacao" data-tour="gcif-instituto-influenciadores" className="space-y-6">
                <NetflixFeed 
                    title="Canais de Divulgação" 
                    icon={<div className="p-2 bg-brand-red/10 rounded-xl text-brand-red"><Sparkles className="w-5 h-5" /></div>}
                >
                    {influencers.map((influencer, index) => (
                        <div key={index} className="flex flex-col items-center text-center group snap-center shrink-0 w-[280px] p-8 bg-white dark:bg-[#1E1E1E] rounded-[40px] border border-gray-200 dark:border-white/10 shadow-md hover:shadow-xl dark:shadow-xl hover:border-brand-yellow/40 transition-all">
                            <div className={`relative w-20 h-20 rounded-full mb-4 flex items-center justify-center text-xl font-bold text-white bg-${influencer.color} ring-4 ring-black/10 dark:ring-black/20 group-hover:scale-105 transition-transform shadow-md`}>
                                {influencer.imagePlaceholder}
                            </div>
                            <h3 className="text-base font-black uppercase tracking-tight mb-1 text-gray-900 dark:text-white font-bukra">{influencer.name}</h3>
                            <p className={`text-[10px] font-black uppercase tracking-wider text-${influencer.color} mb-3`}>{influencer.role}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-open-sans line-clamp-3 mb-6">{influencer.bio}</p>
                            <div className="mt-auto w-full pt-2">
                                <a 
                                    href={influencer.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white border border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-brand-yellow/30 transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                                >
                                    {getPlatformIcon(influencer.platform)}
                                    <span className="font-open-sans font-bold text-xs tracking-wider">Conhecer</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </NetflixFeed>
            </div>

            {/* 3. Campus Interativo & Mapa */}
            <div id="mapa-campus" data-tour="gcif-instituto-mapa" className="space-y-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-brand-blue/10 rounded-2xl text-brand-blue">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white font-bukra italic uppercase tracking-tighter">
                            Campus Interativo & Mapa
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans">
                            Navegue pelas descobertas e registros através da geografia do Instituto.
                        </p>
                    </div>
                </div>

                <div className="w-full max-w-4xl mx-auto aspect-square rounded-3xl overflow-hidden relative shadow-2xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#1B2B1B]/40">
                    <CampusMap items={mapItems} />
                </div>
            </div>

            {/* 6. Espaços Físicos & Infraestrutura do IFUSP */}
            <div id="espacos-convivencia" data-tour="gcif-instituto-espacos" className="space-y-4">
                <NetflixFeed 
                    title="Espaços Físicos & Infraestrutura" 
                    icon={<div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400"><Building2 className="w-5 h-5" /></div>}
                    filterBar={
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
                            {[
                                { id: 'todos', label: 'Todos', count: spacesList.length },
                                { id: 'estudo-biblioteca', label: 'Estudo & Biblioteca', count: spacesList.filter(s => s.categoria === 'estudo-biblioteca').length },
                                { id: 'auditorio', label: 'Auditórios', count: spacesList.filter(s => s.categoria === 'auditorio').length },
                                { id: 'maker-convivencia', label: 'Maker & Convivência', count: spacesList.filter(s => s.categoria === 'maker-convivencia').length },
                                { id: 'oficina-tecnica', label: 'Oficinas Técnicas', count: spacesList.filter(s => s.categoria === 'oficina-tecnica').length },
                                { id: 'laboratorio-pesquisa', label: 'Pesquisa & Pelletron', count: spacesList.filter(s => s.categoria === 'laboratorio-pesquisa').length },
                                { id: 'servico-alimentacao', label: 'Alimentação', count: spacesList.filter(s => s.categoria === 'servico-alimentacao').length },
                            ].map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setSpaceFilter(f.id)}
                                    className={`px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider font-bukra transition-all shrink-0 cursor-pointer ${
                                        spaceFilter === f.id
                                            ? 'bg-[#FFCC00] text-[#0F4780] shadow-md scale-105'
                                            : 'bg-white dark:bg-[#1E1E1E] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/30'
                                    }`}
                                >
                                    {f.label} ({f.count})
                                </button>
                            ))}
                        </div>
                    }
                >
                    {/* Hackerspace Themed Card como Primeiro Espaço de Destaque */}
                    {(spaceFilter === 'todos' || spaceFilter === 'maker-convivencia') && (
                        <HackerspaceCard />
                    )}

                    {filteredSpaces
                        .filter(space => space.id !== 'hackerspace-ifusp')
                        .map(space => (
                            <SpaceCard 
                                key={space.id}
                                space={space}
                                onOpenDetails={setSelectedSpace}
                            />
                        ))}
                </NetflixFeed>
            </div>

            {/* 5. Linha do Tempo & Marcos Históricos (Último lugar da página com aviso de Em Desenvolvimento) */}
            <div id="historico-instituto" className="space-y-12 border-t border-gray-200 dark:border-white/10 pt-16">
                {/* Banner / Aviso de Em Desenvolvimento */}
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#1E1E1E] border border-brand-yellow/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-brand-yellow/10 dark:bg-brand-yellow/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="flex items-start sm:items-center gap-4 relative z-10">
                        <div className="size-14 rounded-2xl bg-brand-yellow/10 border border-brand-yellow/30 flex items-center justify-center shrink-0 text-brand-yellow">
                            <Clock className="w-7 h-7" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-[10px] font-black uppercase tracking-wider font-bukra">
                                    Em Desenvolvimento
                                </span>
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-open-sans">Acervo em Curadoria</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-bukra italic uppercase tracking-tight">
                                Linha do Tempo & Marcos Históricos
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-open-sans mt-1 max-w-2xl leading-relaxed">
                                A reconstrução cronológica e os registros históricos do IFUSP estão em fase de validação e catalogação pelo Lab-Div. Novos marcos, documentos e depoimentos serão integrados em breve.
                            </p>
                        </div>
                    </div>
                </div>

            </div>

            {/* Modal de Detalhes do Evento */}
            <EventDetailsModal 
                event={selectedEvent}
                isOpen={!!selectedEvent}
                onClose={() => setSelectedEvent(null)}
            />

            {/* Modal de Detalhes da Notícia */}
            <NewsDetailsModal 
                news={selectedNews}
                isOpen={!!selectedNews}
                onClose={() => setSelectedNews(null)}
            />

            {/* Modal de Detalhes da Iniciativa */}
            <InitiativeDetailsModal 
                initiative={selectedInitiative}
                isOpen={!!selectedInitiative}
                onClose={() => setSelectedInitiative(null)}
            />

            {/* Modal de Detalhes do Espaço Físico */}
            <SpaceDetailsModal 
                space={selectedSpace}
                isOpen={!!selectedSpace}
                onClose={() => setSelectedSpace(null)}
            />
        </div>
    );
}
