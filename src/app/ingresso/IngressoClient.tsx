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


import React, { useState } from 'react';
import { BookOpen, GraduationCap, Globe, HelpCircle, ArrowRight, Sparkles, Zap, Compass, Clock, FlaskConical, Bell, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const IngressOption = ({ title, icon, description, items, color }: any) => (
    <div className="glass-card rounded-[40px] border border-white/5 overflow-hidden hover:border-white/20 transition-all duration-500 group bg-[#1E1E1E]">
        <div className="p-8 space-y-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} shadow-lg transition-transform group-hover:scale-110 duration-500`}>
                {icon}
            </div>
            <div className="space-y-2">
                <h3 className="text-2xl font-bukra font-bold text-white uppercase tracking-tight">{title}</h3>
                <p className="text-sm text-gray-400 font-open-sans font-medium italic">{description}</p>
            </div>
            <ul className="space-y-3 font-open-sans">
                {items.map((item: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                        <ArrowRight className="w-3 h-3 text-brand-blue shrink-0" />
                        {item}
                    </li>
                ))}
            </ul>
            <button className="w-full py-4 bg-white/5 text-white/70 border border-white/10 rounded-2xl text-[10px] font-bukra font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all">
                Mais detalhes
            </button>
        </div>
    </div>
);

export default function IngressoClient({ profile }: { profile: any }) {
    const [activeTab, setActiveTab] = useState<'ingresso' | 'visitar'>('ingresso');
    const [notifyEmail, setNotifyEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleSubscribeNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if (!notifyEmail || !notifyEmail.includes('@')) {
            toast.error('Por favor, informe um e-mail válido.');
            return;
        }
        setIsSubscribed(true);
        toast.success('Inscrição confirmada! Você será notificado quando os agendamentos forem abertos.');
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Switch Superior: Ingresso vs Visitas & Extensão */}
            <div className="flex justify-center pt-2">
                <div className="inline-flex p-1.5 rounded-2xl bg-[#1E1E1E] border border-white/10 shadow-2xl backdrop-blur-md w-full sm:w-auto max-w-md">
                    <button
                        type="button"
                        onClick={() => setActiveTab('ingresso')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bukra text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'ingresso'
                                ? 'bg-[#FFCC00] text-gray-950 shadow-md shadow-[#FFCC00]/25'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <GraduationCap className="w-4 h-4 shrink-0" />
                        <span>Como Ingressar</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('visitar')}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bukra text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                            activeTab === 'visitar'
                                ? 'bg-[#0F4780] text-white shadow-md shadow-[#0F4780]/30'
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        <Compass className="w-4 h-4 shrink-0" />
                        <span>Visitas &amp; Extensão</span>
                    </button>
                </div>
            </div>

            {/* ABA 1: COMO INGRESSAR */}
            {activeTab === 'ingresso' && (
                <div className="space-y-16 animate-in fade-in duration-500">
                    <header data-tour="ingresso-header" className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/10 rounded-full border border-brand-blue/20 mb-2 scale-90">
                            <Sparkles className="w-3 h-3 text-brand-blue" />
                            <span className="text-[9px] font-black text-brand-blue uppercase tracking-widest font-bukra">Portal do Curioso</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bukra font-black text-white uppercase tracking-tighter leading-none">
                            Sua Jornada no <span className="text-brand-blue">IFUSP</span> Começa Aqui.
                        </h1>
                        <p className="text-gray-400 text-lg font-open-sans font-medium italic">
                            Descubra os caminhos para ingressar em um dos maiores centros de física da América Latina.
                        </p>
                    </header>

                    <div data-tour="ingresso-portas" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <IngressOption 
                            title="Graduação"
                            icon={<BookOpen className="w-8 h-8 text-brand-blue" />}
                            description="Para quem está começando a carreira científica."
                            items={["FUVEST (Vestibular)", "ENEM-USP", "Provão Paulista", "Olimpíadas Científicas", "Transferência Interna/Externa"]}
                            color="bg-brand-blue/10"
                        />
                        <IngressOption 
                            title="Pós-Graduação"
                            icon={<GraduationCap className="w-8 h-8 text-brand-yellow" />}
                            description="Para quem busca o mestrado ou doutorado."
                            items={["EUF (Exame Unificado de Física)", "Mestrado e Doutorado (Física)", "PIEC (Ensino de Ciências)", "Mestrado Profissional (MNPEF)"]}
                            color="bg-brand-yellow/10"
                        />
                        <IngressOption 
                            title="Outros / Visitas"
                            icon={<Globe className="w-8 h-8 text-green-500" />}
                            description="Oportunidades internacionais e complementares."
                            items={["Mobilidade Internacional", "Pré-Iniciação Científica (EM)", "Pesquisador Visitante", "Aluno Especial"]}
                            color="bg-green-500/10"
                        />
                    </div>

                    <div data-tour="ingresso-faq" className="glass-card rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden group bg-[#1E1E1E]">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all group-hover:bg-brand-blue/10 duration-700 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col items-center gap-12 w-full">
                            <div className="w-full space-y-6">
                                <h2 className="text-3xl font-bukra font-bold text-white uppercase tracking-tight flex items-center gap-3">
                                    <Zap className="w-8 h-8 text-brand-yellow fill-current" />
                                    Dúvidas Frequentes sobre Ingresso
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { q: "Como faço para conhecer os laboratórios?", a: "O IFUSP promove o 'Portas Abertas' e visitas guiadas coordenadas pelo LabDiv e pela Comissão de Cultura e Extensão." },
                                        { q: "Existem bolsas de permanência para alunos?", a: "Sim, a USP oferece o programa PAPFE de auxílio permanência com bolsas financeiras e auxílio-moradia para discentes elegíveis." },
                                        { q: "Posso fazer pesquisa sem ser aluno oficial?", a: "Sim, através de programas como Pré-Iniciação Científica para Ensino Médio ou como pesquisador visitante sob supervisão de um docente." }
                                    ].map((faq, i) => (
                                        <details key={i} className="group cursor-pointer">
                                            <summary className="text-[11px] font-bukra font-black uppercase tracking-widest text-white/60 hover:text-white py-4 border-b border-white/5 list-none flex items-center justify-between">
                                                {faq.q}
                                                <ArrowRight className="w-4 h-4 text-brand-blue group-open:rotate-90 transition-transform shrink-0" />
                                            </summary>
                                            <p className="py-4 text-sm font-open-sans text-gray-400 italic leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ABA 2: VISITAS & EXTENSÃO */}
            {activeTab === 'visitar' && (
                <div className="space-y-12 animate-in fade-in duration-500">
                    <header className="max-w-3xl mx-auto text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20 mb-2 scale-90">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest font-bukra">Cultura &amp; Extensão</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bukra font-black text-white uppercase tracking-tighter leading-none">
                            Visitas &amp; <span className="text-[#FFCC00]">Extensão</span> no IFUSP
                        </h1>
                        <p className="text-gray-400 text-lg font-open-sans font-medium italic">
                            Portas abertas para escolas, estudantes e a comunidade conhecerem nossos experimentos, telescópios e laboratórios.
                        </p>
                    </header>

                    {/* Banner Em Desenvolvimento */}
                    <div className="glass-card rounded-[32px] border border-amber-500/30 bg-[#1E1E1E]/90 p-6 md:p-8 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-lg">
                                <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                            </div>
                            <div className="space-y-2 flex-1">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider font-bukra border border-amber-500/30">
                                    Módulo em Desenvolvimento
                                </div>
                                <h3 className="text-2xl font-bukra font-bold text-white uppercase tracking-tight">
                                    Sistema Integrado de Agendamento em Breve
                                </h3>
                                <p className="text-sm text-gray-300 font-open-sans leading-relaxed max-w-2xl">
                                    Estamos finalizando a plataforma automatizada para agendamento de caravanas escolares, confirmação de vagas no <strong>Show da Física</strong> e reservas em roteiros temáticos pelos laboratórios do IFUSP.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Atividades de Extensão */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Show da Física */}
                        <div className="glass-card rounded-[40px] border border-white/5 overflow-hidden hover:border-[#FFCC00]/40 transition-all duration-500 group bg-[#1E1E1E]">
                            <div className="p-8 space-y-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#FFCC00]/10 text-[#FFCC00] shadow-lg transition-transform group-hover:scale-110 duration-500">
                                    <Zap className="w-8 h-8 fill-current" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bukra font-bold text-white uppercase tracking-tight">Show da Física</h3>
                                        <span className="text-[9px] font-bukra font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">Em Breve</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-open-sans font-medium italic">Demonstrações lúdicas e eletrizantes.</p>
                                </div>
                                <ul className="space-y-3 font-open-sans">
                                    {["Eletromagnetismo & Bobina de Tesla", "Mecânica, Acústica e Termodinâmica", "Sessões para escolas e público geral", "Atividade 100% gratuita no campus"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-3 h-3 text-[#FFCC00] shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => toast('O agendamento do Show da Física será integrado diretamente nesta tela!')}
                                    className="w-full py-4 bg-white/5 text-white/70 border border-white/10 rounded-2xl text-[10px] font-bukra font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Saber Mais
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Laboratórios de Pesquisa */}
                        <div className="glass-card rounded-[40px] border border-white/5 overflow-hidden hover:border-[#0F4780]/60 transition-all duration-500 group bg-[#1E1E1E]">
                            <div className="p-8 space-y-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-[#0F4780]/20 text-brand-blue shadow-lg transition-transform group-hover:scale-110 duration-500">
                                    <FlaskConical className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bukra font-bold text-white uppercase tracking-tight">Laboratórios</h3>
                                        <span className="text-[9px] font-bukra font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">Em Preparação</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-open-sans font-medium italic">Visitas guiadas à infraestrutura de ponta.</p>
                                </div>
                                <ul className="space-y-3 font-open-sans">
                                    {["Acelerador Linear Pelletron", "Laboratório de Novos Semicondutores", "Pesquisas em Física Médica e Nuclear", "Roteiros didáticos acompanhados"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-3 h-3 text-brand-blue shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => toast('Roteiros laboratoriais em fase final de homologação!')}
                                    className="w-full py-4 bg-white/5 text-white/70 border border-white/10 rounded-2xl text-[10px] font-bukra font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Ver Roteiros
                                </button>
                            </div>
                        </div>

                        {/* Card 3: Extensão Universitária */}
                        <div className="glass-card rounded-[40px] border border-white/5 overflow-hidden hover:border-green-500/40 transition-all duration-500 group bg-[#1E1E1E]">
                            <div className="p-8 space-y-6">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-500/10 text-green-400 shadow-lg transition-transform group-hover:scale-110 duration-500">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-bukra font-bold text-white uppercase tracking-tight">Céu Aberto</h3>
                                        <span className="text-[9px] font-bukra font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">Comunidade</span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-open-sans font-medium italic">Astronomia e divulgação para todos.</p>
                                </div>
                                <ul className="space-y-3 font-open-sans">
                                    {["Observação noturna com telescópios", "Ciclo de palestras 'Física para Todos'", "Semana de Recepção aos Calouros", "Feiras e oficinas de ciências"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-3 h-3 text-green-400 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    onClick={() => toast('Calendário de noites de observação estará disponível com o lançamento do módulo!')}
                                    className="w-full py-4 bg-white/5 text-white/70 border border-white/10 rounded-2xl text-[10px] font-bukra font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Programação
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formulário Avise-me Quando Abrir */}
                    <div className="glass-card rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden bg-[#1E1E1E]">
                        <div className="max-w-2xl mx-auto text-center space-y-6">
                            <div className="w-14 h-14 rounded-2xl bg-[#FFCC00]/10 border border-[#FFCC00]/20 flex items-center justify-center mx-auto text-[#FFCC00]">
                                <Bell className="w-7 h-7" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-3xl font-bukra font-bold text-white uppercase tracking-tight">
                                    Deseja ser notificado no lançamento?
                                </h2>
                                <p className="text-sm text-gray-400 font-open-sans">
                                    Receba um aviso direto no seu e-mail assim que o formulário de reserva de visitas escolares e sessões for aberto ao público.
                                </p>
                            </div>

                            {isSubscribed ? (
                                <div className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-500/10 border border-green-500/30 text-green-400 font-open-sans text-sm font-semibold">
                                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                                    <span>Inscrição confirmada! Avisaremos você no e-mail informado.</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribeNotification} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        value={notifyEmail}
                                        onChange={(e) => setNotifyEmail(e.target.value)}
                                        placeholder="seu.email@exemplo.com"
                                        className="flex-1 px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 font-open-sans text-sm focus:outline-none focus:border-[#FFCC00]/50 transition-colors"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="px-7 py-3.5 bg-[#FFCC00] hover:bg-[#E5B800] text-gray-950 font-bukra text-xs font-bold uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-[#FFCC00]/20 active:scale-95 shrink-0"
                                    >
                                        Avise-me
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* FAQ Visitas */}
                    <div className="glass-card rounded-[40px] border border-white/5 p-8 md:p-12 relative overflow-hidden bg-[#1E1E1E]">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bukra font-bold text-white uppercase tracking-tight flex items-center gap-3">
                                <HelpCircle className="w-8 h-8 text-amber-400" />
                                Informações Úteis para Visitantes
                            </h2>
                            <div className="space-y-4">
                                {[
                                    { q: "Qual o custo da visitação ao IFUSP?", a: "Todas as atividades, palestras e demonstrações são 100% gratuitas e abertas à sociedade, em conformidade com o compromisso de extensão pública da USP." },
                                    { q: "Como funciona para grupos escolares e caravanas?", a: "Escolas do ensino fundamental e médio têm atendimento especial com monitores. O agendamento é feito por turmas para garantir a segurança e a melhor experiência nos laboratórios." },
                                    { q: "Onde fica localizado o Instituto de Física?", a: "Na Rua do Matão, 1371 - Cidade Universitária, Butantã, São Paulo - SP. O campus conta com linhas de ônibus circulares e fácil acesso pela estação Butantã do Metrô." }
                                ].map((faq, i) => (
                                    <details key={i} className="group cursor-pointer">
                                        <summary className="text-[11px] font-bukra font-black uppercase tracking-widest text-white/60 hover:text-white py-4 border-b border-white/5 list-none flex items-center justify-between">
                                            {faq.q}
                                            <ArrowRight className="w-4 h-4 text-amber-400 group-open:rotate-90 transition-transform shrink-0" />
                                        </summary>
                                        <p className="py-4 text-sm font-open-sans text-gray-400 italic leading-relaxed">
                                            {faq.a}
                                        </p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
