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


import React from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

/**
 * 🏛️ Transparency Panel V3.0 (WCAG 2.1 & Transparency Act)
 * Página centralizadora de normas, licenciamento e governança do HUB.
 */
export default function TransparenciaPage() {
    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-yellow/10 rounded-2xl flex items-center justify-center mb-6 border border-brand-yellow/20">
                        <span className="material-symbols-outlined text-4xl text-brand-yellow">gavel</span>
                    </div>
                    <h1 
                        tabIndex={-1}
                        className="text-4xl font-bukra font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-4 outline-none focus:ring-2 focus:ring-brand-yellow rounded-lg px-2"
                    >
                        Painel de <span className="text-brand-yellow">Transparência</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                        Compromisso do Laboratório de Divulgação (IFUSP) com a acessibilidade plena, 
                        o direito à informação e a ética científica digital.
                    </p>
                </header>

                <nav className="mb-10 flex flex-wrap justify-center gap-3 sm:gap-4" aria-label="Navegação rápida">
                    {[
                        { id: 'documentos', label: 'Políticas & Termos', icon: 'gavel' },
                        { id: 'termos', label: 'Termos de Uso', icon: 'description' },
                        { id: 'privacidade', label: 'Privacidade (LGPD)', icon: 'shield_person' },
                        { id: 'exclusao', label: 'Exclusão de Conta', icon: 'person_remove' },
                        { id: 'moderacao', label: 'Moderação', icon: 'security' },
                        { id: 'contato', label: 'SLA & Contato', icon: 'contact_support' }
                    ].map(item => (
                        <a 
                            key={item.id}
                            href={`#${item.id}`}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-xs sm:text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-brand-blue hover:text-white transition-all"
                        >
                            <span className="material-symbols-outlined text-base">{item.icon}</span>
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* Banner de Acesso Rápido aos Documentos Legais Oficiais */}
                <section id="documentos" className="scroll-mt-24 mb-10 p-6 sm:p-8 bg-gradient-to-br from-brand-blue/10 via-brand-yellow/5 to-transparent border-2 border-brand-blue/30 rounded-[32px] shadow-lg">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-2xl text-brand-yellow">verified</span>
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-tight">
                            Documentos Oficiais &amp; Termos Legais em Vigor
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                        Acesse as páginas normativas integrais do ecossistema HUB LabDiv (IFUSP). Toda a plataforma opera sob estrita conformidade com a LGPD (Lei nº 13.709/2018), Marco Civil da Internet (Lei nº 12.965/2014) e as diretrizes de transparência do Google Play.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/terms"
                            className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-blue/50 hover:shadow-md transition-all group"
                        >
                            <div className="space-y-1 mb-4">
                                <span className="material-symbols-outlined text-brand-blue text-2xl group-hover:scale-110 transition-transform">description</span>
                                <h3 className="font-bukra font-bold text-sm text-gray-900 dark:text-white">Termos de Serviço e Uso</h3>
                                <p className="text-[11px] text-gray-500 leading-tight">Regime Dual de Feeds, direitos autorais e código de conduta comunitária.</p>
                            </div>
                            <span className="text-xs font-bold text-brand-blue inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Acessar Termos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </Link>

                        <Link
                            href="/privacy"
                            className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-yellow/50 hover:shadow-md transition-all group"
                        >
                            <div className="space-y-1 mb-4">
                                <span className="material-symbols-outlined text-brand-yellow text-2xl group-hover:scale-110 transition-transform">shield_person</span>
                                <h3 className="font-bukra font-bold text-sm text-gray-900 dark:text-white">Política de Privacidade</h3>
                                <p className="text-[11px] text-gray-500 leading-tight">Bases legais da LGPD, permissões Android, proteção ao ECA e dados do DPO.</p>
                            </div>
                            <span className="text-xs font-bold text-brand-yellow inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Acessar Privacidade <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </Link>

                        <Link
                            href="/delete-account"
                            className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:border-brand-red/50 hover:shadow-md transition-all group"
                        >
                            <div className="space-y-1 mb-4">
                                <span className="material-symbols-outlined text-brand-red text-2xl group-hover:scale-110 transition-transform">person_remove</span>
                                <h3 className="font-bukra font-bold text-sm text-gray-900 dark:text-white">Exclusão de Conta</h3>
                                <p className="text-[11px] text-gray-500 leading-tight">Portal público para expurgo definitivo de conta e eliminação de dados.</p>
                            </div>
                            <span className="text-xs font-bold text-brand-red inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                Solicitar Exclusão <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </span>
                        </Link>
                    </div>
                </section>

                <main className="space-y-8">
                    {/* Seção 1: Termos de Uso e Licenciamento */}
                    <section id="termos" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                            <div className="flex items-center gap-4">
                                <span className="p-3 bg-brand-blue/10 rounded-xl">
                                    <span className="material-symbols-outlined text-brand-blue">description</span>
                                </span>
                                <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Termos de Uso &amp; Licenciamento</h2>
                            </div>
                            <Link 
                                href="/terms"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-blue/90 transition-all shadow-md shadow-brand-blue/20"
                            >
                                Ler Contrato Completo
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>
                        </div>
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <p>
                                Todo conteúdo científico e interações de comunidade submetidos ao HUB Lab-Div V3.0 (artigos, wikis, quizzes, artes, dicas de veteranos e softwares) são regidos pela licença 
                                <strong> Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>.
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                                <li className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-background-dark/20 rounded-2xl">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <span className="text-sm"><strong>Compartilhar:</strong> Copiar e redistribuir o material em qualquer suporte ou formato.</span>
                                </li>
                                <li className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-background-dark/20 rounded-2xl">
                                    <span className="material-symbols-outlined text-green-500">check_circle</span>
                                    <span className="text-sm"><strong>Adaptar:</strong> Remixar, transformar e criar a partir do material para qualquer fim.</span>
                                </li>
                            </ul>
                            <div className="mt-4 p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/15 text-xs text-gray-700 dark:text-gray-300">
                                <strong className="text-brand-blue block mb-1">Licença do Software (AGPLv3):</strong>
                                O código-fonte da aplicação é software livre licenciado sob a <strong>GNU Affero General Public License v3 (AGPLv3)</strong>. Conforme a Seção 13 da AGPLv3, qualquer usuário que interaja remotamente com a plataforma tem o direito de acessar o código-fonte correspondente completo no repositório oficial:{' '}
                                <a 
                                    href="https://github.com/JoaoStangorlini/HUB-LabDiv" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-brand-blue dark:text-brand-yellow font-bold underline inline-flex items-center gap-1"
                                >
                                    github.com/JoaoStangorlini/HUB-LabDiv
                                    <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                                </a>.
                            </div>
                            <p className="mt-4 text-sm opacity-80 italic">
                                * É obrigatório dar o crédito apropriado ao HUB Lab-Div e ao autor original, provendo um link para a licença.
                            </p>
                        </div>
                    </section>

                    {/* Seção 2: Regras de Moderação */}
                    <section id="moderacao" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-brand-red/10 rounded-xl">
                                <span className="material-symbols-outlined text-brand-red">security</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Regras de Moderação Ética</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="p-6 bg-brand-red/5 border border-brand-red/10 rounded-2xl">
                                <h3 className="flex items-center gap-2 text-brand-red font-bold mb-2">
                                    <span className="material-symbols-outlined text-lg">policy</span>
                                    Código Penal e Denúncia Falsa
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Conforme o <strong>Art. 340 do Código Penal Brasileiro</strong>, provocar a ação de autoridade, comunicando-lhe a ocorrência de crime ou de contravenção que sabe não se ter verificado, é crime. Denúncias falsas ou uso abusivo do sistema de <em>Report</em> resultarão em suspensão imediata da conta.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">O que moderamos:</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-5 opacity-90">
                                        <li>Discurso de ódio ou assédio.</li>
                                        <li>Plágio acadêmico nítido.</li>
                                        <li>Desinformação anticientífica.</li>
                                        <li>Conteúdo inapropriado para menores.</li>
                                        <li>Interações não construtivas (em comentários ou avaliações).</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">Fluxo de Análise:</h4>
                                    <ol className="text-sm space-y-2 list-decimal pl-5 opacity-90">
                                        <li>Denúncia recebida via HUB.</li>
                                        <li>Revisão humana por curadores do IFUSP.</li>
                                        <li>Veredito final (Manter, Editar ou Excluir).</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Seção 3: Políticas de Privacidade */}
                    <section id="privacidade" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-[32px]">
                        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                            <div className="flex items-center gap-4">
                                <span className="p-3 bg-brand-yellow/10 rounded-xl">
                                    <span className="material-symbols-outlined text-brand-yellow">policy</span>
                                </span>
                                <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Políticas de Privacidade</h2>
                            </div>
                            <Link 
                                href="/privacy"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-yellow text-black text-xs font-bold uppercase tracking-wider hover:bg-brand-yellow/90 transition-all shadow-md shadow-brand-yellow/20"
                            >
                                Ver Política Completa
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300">
                            <p className="leading-relaxed">
                                A sua privacidade é levada a sério no HUB Lab-Div. Estamos em conformidade com as diretrizes da LGPD (Lei Geral de Proteção de Dados) para garantir a segurança das suas informações.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">Coleta de Dados:</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-5 opacity-90">
                                        <li>Armazenamos apenas os dados essenciais para o funcionamento da plataforma.</li>
                                        <li>Cookies são usados exclusivamente para manter a sua sessão ativa e preferências de uso.</li>
                                        <li>Não vendemos nem compartilhamos seus dados com empresas terceiras para fins publicitários.</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 italic">Seus Direitos:</h4>
                                    <ul className="text-sm space-y-2 list-disc pl-5 opacity-90">
                                        <li>Você pode exportar todos os seus dados pela página de Configurações (Portabilidade/Takeout).</li>
                                        <li>É possível apagar o seu histórico ou encerrar a sua conta a qualquer momento na Zona de Risco.</li>
                                        <li>Você decide se deseja ou não receber notificações no seu dispositivo.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Seção 4: Exclusão de Conta e Eliminação de Registros (Google Play Requirement) */}
                    <section id="exclusao" className="scroll-mt-24 p-8 bg-white dark:bg-white/5 border border-brand-red/30 rounded-[32px] shadow-sm">
                        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                            <div className="flex items-center gap-4">
                                <span className="p-3 bg-brand-red/10 rounded-xl">
                                    <span className="material-symbols-outlined text-brand-red">person_remove</span>
                                </span>
                                <h2 className="text-2xl font-bukra font-bold text-gray-900 dark:text-white">Exclusão de Conta &amp; Dados</h2>
                            </div>
                            <Link 
                                href="/delete-account"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-red text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-red/90 transition-all shadow-md shadow-brand-red/20"
                            >
                                Solicitar Exclusão
                                <span className="material-symbols-outlined text-sm">open_in_new</span>
                            </Link>
                        </div>
                        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                            <p>
                                O usuário pode requisitar o cancelamento do registro e o expurgo total de seus dados pessoais a qualquer momento, diretamente pelo navegador web ou pelo aplicativo móvel, sem barreiras contratuais.
                            </p>
                            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-background-dark/30 border border-gray-200 dark:border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                <div>
                                    <strong className="text-brand-red block mb-1">Dados Pessoais:</strong>
                                    Exclusão permanente de nome, e-mail, biografia e foto em até 30 dias.
                                </div>
                                <div>
                                    <strong className="text-brand-yellow block mb-1">Artigos Científicos:</strong>
                                    Mantidos sob licença aberta (CC BY 4.0) com desidentificação irreversível.
                                </div>
                                <div>
                                    <strong className="text-emerald-500 block mb-1">Logs de Conexão:</strong>
                                    Isolados e guardados por 6 meses por obrigação do Art. 15 do Marco Civil.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Seção 5: SLA e Contato */}
                    <section id="contato" className="scroll-mt-24 p-8 bg-brand-blue text-white rounded-[32px] shadow-xl shadow-brand-blue/20">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="p-3 bg-white/10 rounded-xl">
                                <span className="material-symbols-outlined text-white">contact_support</span>
                            </span>
                            <h2 className="text-2xl font-bukra font-bold">Governança, SLA &amp; Contato</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <p className="opacity-90 leading-relaxed text-sm">
                                    Dúvidas sobre o funcionamento técnico, remoção de dados, requisições de titulares da LGPD ou parcerias institucionais?
                                </p>
                                <div className="space-y-2">
                                    <p className="flex items-center gap-3 font-bold text-sm">
                                        <span className="material-symbols-outlined">mail</span>
                                        hublabdiv@gmail.com
                                    </p>
                                    <p className="flex items-center gap-3 text-xs opacity-75">
                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                        Tempo médio de resposta do DPO: até 48 horas úteis (requisições de exclusão atendidas em até 15 dias conforme Art. 19 da LGPD).
                                    </p>
                                </div>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                                <h4 className="font-bold mb-3 uppercase text-xs tracking-widest text-brand-yellow">Documentação Geral</h4>
                                <div className="space-y-2.5">
                                    <Link href="/terms" className="flex items-center justify-between group text-xs sm:text-sm">
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Termos de Serviço e Uso</span>
                                        <span className="material-symbols-outlined text-brand-yellow group-hover:translate-x-1 transition-transform text-base">arrow_forward</span>
                                    </Link>
                                    <Link href="/privacy" className="flex items-center justify-between group text-xs sm:text-sm">
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Política de Privacidade (LGPD)</span>
                                        <span className="material-symbols-outlined text-brand-yellow group-hover:translate-x-1 transition-transform text-base">arrow_forward</span>
                                    </Link>
                                    <Link href="/delete-account" className="flex items-center justify-between group text-xs sm:text-sm">
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Exclusão de Conta e Dados</span>
                                        <span className="material-symbols-outlined text-brand-yellow group-hover:translate-x-1 transition-transform text-base">arrow_forward</span>
                                    </Link>
                                    <a href="https://github.com/JoaoStangorlini/HUB-LabDiv" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group text-xs sm:text-sm">
                                        <span className="opacity-80 group-hover:opacity-100 transition-opacity">Código-Fonte Aberto (AGPLv3)</span>
                                        <span className="material-symbols-outlined text-brand-yellow group-hover:translate-x-1 transition-transform text-base">open_in_new</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="mt-16 text-center border-t border-gray-200 dark:border-white/10 pt-10">
                    <Link href="/" className="inline-flex items-center gap-3 text-brand-blue dark:text-white font-black uppercase tracking-tighter hover:text-brand-yellow transition-colors group">
                        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        VOLTAR PARA O INÍCIO DO HUB
                    </Link>
                </footer>
            </div>
        </MainLayoutWrapper>
    );
}
