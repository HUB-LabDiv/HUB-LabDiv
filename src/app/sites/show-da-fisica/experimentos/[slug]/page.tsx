import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, CheckCircle2, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { EXPERIMENTS_CATALOG, SHOW_ACTS } from '@/app/iniciativas/show-da-fisica/data/experiments';

interface ExperimentDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ExperimentDetailPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const exp = EXPERIMENTS_CATALOG.find((e) => e.id === resolvedParams.slug);
    if (!exp) return { title: 'Experimento Não Encontrado' };

    return {
        title: `${exp.title} | Experimentos Show de Física`,
        description: `${exp.subtitle} - ${exp.concept}. ${exp.description}`,
    };
}

export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
    const resolvedParams = await params;
    const exp = EXPERIMENTS_CATALOG.find((e) => e.id === resolvedParams.slug);

    if (!exp) {
        notFound();
    }

    const actInfo = SHOW_ACTS.find((a) => a.id === exp.act);
    const borderClass =
        exp.themeColor === 'green'
            ? 'neon-border-green'
            : exp.themeColor === 'red'
            ? 'neon-border-red'
            : 'neon-border-blue';

    const textClass =
        exp.themeColor === 'green'
            ? 'neon-text-green'
            : exp.themeColor === 'red'
            ? 'neon-text-red'
            : 'neon-text-blue';

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-16">
            {/* Topo / Voltar */}
            <div className="flex items-center justify-between">
                <Link
                    href="/experimentos"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:text-[#002ffe] dark:hover:text-[#38bdf8] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar ao Catálogo</span>
                </Link>

                {actInfo && (
                    <span className="px-3 py-1 text-xs font-mono font-bold uppercase tracking-widest border border-current text-[#002ffe] dark:text-[#38bdf8]">
                        {actInfo.badgeText} &bull; {actInfo.title}
                    </span>
                )}
            </div>

            {/* Grid Principal do Experimento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                <div className={`md:col-span-6 relative aspect-square bg-black ${borderClass} overflow-hidden rounded-none shadow-2xl`}>
                    <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

                <div className="md:col-span-6 space-y-6">
                    <div>
                        <span className="text-xs font-mono uppercase font-bold tracking-widest text-gray-400 block mb-2">
                            {exp.concept}
                        </span>
                        <h1 className={`text-4xl sm:text-5xl font-black uppercase tracking-wider ${textClass} mb-2`}>
                            {exp.title}
                        </h1>
                        <p className="text-sm font-mono uppercase tracking-widest text-[#002ffe] dark:text-[#38bdf8]">
                            {exp.subtitle}
                        </p>
                    </div>

                    <div className="p-6 bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 text-base text-gray-700 dark:text-gray-300 font-sans leading-relaxed">
                        {exp.description}
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-white dark:bg-black neon-border-green text-xs font-mono uppercase tracking-wider text-emerald-700 dark:text-[#01f300]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Aparato revisado e ativo para as sessões regulares no auditório.</span>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/monte-seu-show"
                            className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white dark:bg-black neon-border-red text-[#f60011] font-bold uppercase tracking-widest text-sm hover:bg-[#f60011] hover:text-white dark:hover:text-black hover:shadow-[0_0_25px_#f60011] transition-all rounded-none"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span>Agendar Este Experimento</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Blocos Didáticos e Curiosidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 bg-white dark:bg-black neon-border-blue space-y-4 rounded-none">
                    <div className="flex items-center gap-2 text-[#002ffe] dark:text-[#38bdf8]">
                        <BookOpen className="w-5 h-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">A Física em Cena</h3>
                    </div>
                    <p className="text-sm font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                        Durante a apresentação no palco, os monitores decompõem o fenômeno em etapas visíveis e instigantes. O objetivo não é apenas gerar espanto visual, mas conectar a observação imediata aos princípios de conservação de energia, termodinâmica ou eletromagnetismo previstos nos currículos escolares.
                    </p>
                </div>

                <div className="p-8 bg-white dark:bg-black neon-border-green space-y-4 rounded-none">
                    <div className="flex items-center gap-2 text-[#009900] dark:text-[#01f300]">
                        <Lightbulb className="w-5 h-5" />
                        <h3 className="text-lg font-bold uppercase tracking-wider">Você Sabia?</h3>
                    </div>
                    <ul className="space-y-3 text-xs font-sans text-gray-700 dark:text-gray-300 leading-relaxed">
                        <li className="flex items-start gap-2">
                            <span className="text-[#01f300] font-bold">&bull;</span>
                            <span>Este aparato foi construído ou adaptado na oficina mecânica e técnica do Instituto de Física da USP especialmente para apresentações públicas.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#01f300] font-bold">&bull;</span>
                            <span>Todas as medidas de segurança são inspecionadas semanalmente pela equipe técnica para garantir segurança absoluta à plateia.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
