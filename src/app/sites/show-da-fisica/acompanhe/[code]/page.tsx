import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Radio } from 'lucide-react';
import { validateShowPin, getSessionData, getMisconceptions } from '@/app/actions/show-da-fisica';
import { StudentSessionClient } from '@/app/iniciativas/show-da-fisica/sessao/aluno/[code]/StudentSessionClient';
import { TeacherSessionClient } from '@/app/iniciativas/show-da-fisica/sessao/professor/[code]/TeacherSessionClient';

interface LiveSessionPageProps {
    params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: LiveSessionPageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const code = resolvedParams.code?.toUpperCase() || '';
    return {
        title: `Sessão ${code} | Acompanhe seu Show`,
        description: `Ambiente interativo ao vivo do Show de Física IFUSP para a sessão ${code}.`,
    };
}

export default async function LiveSessionPage({ params }: LiveSessionPageProps) {
    const resolvedParams = await params;
    const code = resolvedParams.code?.toUpperCase() || '';

    const validation = await validateShowPin(code);

    if (!validation.success || !validation.sessionId) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
                    <AlertCircle className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-black uppercase text-gray-950 dark:text-white">
                    Código Inválido ou Sessão Não Encontrada
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-sans">
                    Não encontramos uma apresentação ativa com o código <strong>{code}</strong>.
                    Confira se o código foi digitado corretamente ou solicite um novo aos monitores.
                </p>
                <div>
                    <Link
                        href="/acompanhe"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-950 font-bold text-xs uppercase tracking-wider"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Tentar Outro Código</span>
                    </Link>
                </div>
            </div>
        );
    }

    const sessionId = validation.sessionId;
    const sessionRes = await getSessionData(sessionId);
    const sessionData = sessionRes.data;

    // Se a validação identificou o papel de professor
    if (validation.role === 'teacher') {
        return (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/acompanhe"
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Sair da Sessão</span>
                    </Link>
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                        Painel do Professor &bull; {code}
                    </span>
                </div>
                <TeacherSessionClient sessionCode={code} sessionId={sessionId} sessionData={sessionData} />
            </div>
        );
    }

    // Visão do Aluno
    let misconceptions: any[] = [];
    if (sessionData && sessionData.selected_experiments) {
        const sel = sessionData.selected_experiments;
        const experimentIds = [
            ...(sel.preShow || []),
            ...(sel.abertura || []),
            ...(sel.principal || []),
            ...(sel.encerramento || []),
        ];

        const miscRes = await getMisconceptions(experimentIds);
        if (miscRes.success && miscRes.data) {
            misconceptions = miscRes.data;
        }
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href="/acompanhe"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Sair da Sessão</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Turma Conectada &bull; {code}
                    </span>
                </div>
            </div>
            <StudentSessionClient sessionCode={code} sessionId={sessionId} misconceptions={misconceptions} />
        </div>
    );
}

