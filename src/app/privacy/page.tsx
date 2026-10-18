'use client';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é um software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import React from 'react';
import Link from 'next/link';
import { MainLayoutWrapper } from '@/components/layout/MainLayoutWrapper';

export default function PrivacyPolicyPage() {
    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <header className="mb-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-blue/20">
                        <span className="material-symbols-outlined text-4xl text-brand-blue">shield_person</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3">
                        Política e Aviso de <span className="text-brand-yellow drop-shadow-sm">Privacidade</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Transparência integral sobre o tratamento de dados pessoais no HUB LabDiv em estrita conformidade com a LGPD (Lei nº 13.709/2018), o Marco Civil da Internet (Lei nº 12.965/2014) e as diretrizes do Google Play.
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-xs font-semibold text-brand-blue">
                        <span>Versão 6.6.0 • Atualizado em 2026</span>
                    </div>
                </header>

                <main className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {/* Seção 1: Identificação do Controlador e DPO */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-black">1</span>
                            Identificação do Controlador e Encarregado (DPO)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-background-dark/40 p-5 rounded-xl border border-gray-200 dark:border-white/10">
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">Controlador Institucional</span>
                                <p className="font-bold text-gray-900 dark:text-white">HUB LabDiv / Instituto de Física da USP (IFUSP)</p>
                                <p className="text-xs text-gray-500 mt-1">R. do Matão, 1371 - Butantã, São Paulo - SP, CEP 05508-090</p>
                            </div>
                            <div>
                                <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">Encarregado pelo Tratamento de Dados (DPO)</span>
                                <p className="font-bold text-brand-blue">Governança Digital e Privacidade do HUB LabDiv</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Canal Direto: <a href="mailto:hublabdiv@gmail.com" className="text-brand-blue hover:underline font-bold">hublabdiv@gmail.com</a>
                                </p>
                            </div>
                        </div>
                        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Em cumprimento ao Art. 9º e Art. 41 da Lei Geral de Proteção de Dados (LGPD), qualquer titular pode contatar nosso Encarregado para exercer seus direitos, solicitar esclarecimentos ou requerer a exclusão de dados.
                        </p>
                    </section>

                    {/* Seção 2: Matriz de Operações de Tratamento e Bases Legais */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center text-sm font-black">2</span>
                            Operações de Tratamento e Bases Legais (LGPD)
                        </h2>
                        <p className="mb-4">
                            Não realizamos qualquer tratamento de dados sem base legal legítima e proporcional. Segue o mapeamento exaustivo das atividades do HUB:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs sm:text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-white/10 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                                        <th className="py-3 px-3">Finalidade</th>
                                        <th className="py-3 px-3">Dados Coletados</th>
                                        <th className="py-3 px-3">Base Legal (LGPD)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    <tr>
                                        <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Cadastro & Autenticação</td>
                                        <td className="py-3 px-3 text-gray-500">Nome, e-mail institucional ou social, avatar e credencial USP.</td>
                                        <td className="py-3 px-3 text-brand-blue font-medium">Execução de Contrato (Art. 7º, V) e Consentimento (Art. 7º, I).</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Divulgação Científica</td>
                                        <td className="py-3 px-3 text-gray-500">Pôsteres, artigos, resumos, dúvidas e comentários acadêmicos.</td>
                                        <td className="py-3 px-3 text-brand-yellow font-medium">Realização de Estudos por Órgão de Pesquisa (Art. 7º, IV) e LDA.</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Segurança & Conformidade Legal</td>
                                        <td className="py-3 px-3 text-gray-500">Logs de acesso com endereço IP, data, hora e porta lógica de conexão.</td>
                                        <td className="py-3 px-3 text-emerald-500 font-medium">Obrigação Legal (Art. 7º, II c/c Art. 15 da Lei nº 12.965/2014).</td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 px-3 font-semibold text-gray-900 dark:text-white">Telemetria de Usabilidade (Opcional)</td>
                                        <td className="py-3 px-3 text-gray-500">Cliques e tempo de carregamento de páginas (exclusivo para maiores).</td>
                                        <td className="py-3 px-3 text-purple-400 font-medium">Consentimento Expresso e Específico (Art. 7º, I - Opt-In Real).</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Seção 3: Permissões de Hardware no Aplicativo Android */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center text-sm font-black">3</span>
                            Permissões de Hardware no Aplicativo Android
                        </h2>
                        <p className="mb-4">
                            Em estrita obediência às políticas de Segurança de Dados da Google Play Store (Google Play Data Safety), nosso aplicativo móvel solicita exclusivamente as permissões estritamente necessárias para as funcionalidades explicitadas:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10">
                                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-2">
                                    <span className="material-symbols-outlined text-brand-yellow">photo_library</span>
                                    <span>Fotos, Mídia e Armazenamento</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Utilizada pontualmente apenas quando você decide anexar imagens, capturas de tela ou arquivos PDF de pesquisas. O aplicativo <strong>jamais</strong> realiza varreduras em sua galeria nem acessa fotos sem sua seleção deliberada.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10">
                                <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-2">
                                    <span className="material-symbols-outlined text-brand-blue">notifications_active</span>
                                    <span>Notificações Push</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                    Utilizada para avisar sobre respostas dos pesquisadores às suas perguntas científicas ou comunicados de segurança. Você pode desativar essa permissão a qualquer momento diretamente nas configurações do seu sistema operacional.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Seção 4: Proteção Especial a Crianças e Adolescentes (ECA) */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center text-sm font-black">4</span>
                            Proteção Especial a Menores (ECA e Enunciado ANPD nº 1/2023)
                        </h2>
                        <p className="mb-3">
                            Nos termos do Art. 14 da LGPD e do <strong>Enunciado CD/ANPD nº 1/2023</strong>, o tratamento de dados de crianças e adolescentes deve ser realizado em seu melhor interesse. No HUB LabDiv:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Não condicionamos a participação de adolescentes à entrega de dados pessoais além do mínimo essencial para acesso educativo.</li>
                            <li><strong>Bloqueio de Rastreamento Comportamental:</strong> Ferramentas analíticas e gravações de navegação de terceiros são terminantemente desativadas para usuários identificados como menores de 18 anos.</li>
                            <li><strong>Curadoria e Moderação Preventiva:</strong> Materiais submetidos por adolescentes passam por análise prévia antes da veiculação pública para prevenir exposição indevida ou assédio.</li>
                        </ul>
                    </section>

                    {/* Seção 5: Tabela de Retenção, Descarte e Regime Dual */}
                    <section className="bg-white dark:bg-white/5 border-2 border-brand-yellow/30 rounded-2xl p-6 sm:p-8 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center text-sm font-black">5</span>
                            <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white">
                                Tabela de Retenção, Descarte e Regime Dual
                            </h2>
                        </div>
                        <p className="mb-4">
                            Conforme o princípio da necessidade e da limitação do armazenamento, definimos prazos específicos para a eliminação e desidentificação de registros:
                        </p>
                        <div className="space-y-3">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Dados Cadastrais, Perfil e Rascunhos</h3>
                                    <p className="text-xs text-gray-500">Nome, e-mail, biografia, foto de perfil, curtidas e preferências.</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-red/10 text-brand-red border border-brand-red/20 shrink-0">
                                    Exclusão Total em até 30 dias
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Artigos e Obras em Creative Commons (CC BY 4.0)</h3>
                                    <p className="text-xs text-gray-500">Artigos científicos publicados, dúvidas acadêmicas e pôsteres abertos.</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 shrink-0">
                                    Anonimização Irreversível (Art. 5º LDA)
                                </span>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Logs Técnicos de Conexão (Art. 15 Marco Civil)</h3>
                                    <p className="text-xs text-gray-500">Endereço IP de conexão, data, hora, fuso horário e porta lógica.</p>
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                                    Retidos por 6 meses (Obrigação Legal)
                                </span>
                            </div>
                        </div>
                    </section>

                    {/* Seção 6: Transferência Internacional de Dados */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-black">6</span>
                            Transferência Internacional de Dados (Resolução CD/ANPD nº 19/2024)
                        </h2>
                        <p className="mb-3">
                            Para operacionalizar a infraestrutura distribuída de alta disponibilidade, o HUB LabDiv utiliza servidores em nuvem fornecidos por empresas líderes de tecnologia com centros de dados globais (Supabase Inc. e Vercel Inc.).
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Em total conformidade com os artigos 33 a 36 da LGPD e a <strong>Resolução CD/ANPD nº 19/2024</strong> (Cláusulas Padrão Contratuais), os provedores signatários mantêm certificações de segurança internacionais (SOC 2 Tipo II, ISO 27001) e cláusulas contratuais de proteção equivalentes aos padrões exigidos pela legislação brasileira.
                        </p>
                    </section>

                    {/* Seção 7: Seus Direitos (Art. 18 LGPD) e Exclusão */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-black">7</span>
                            Exercício dos Seus Direitos (Art. 18 da LGPD)
                        </h2>
                        <p className="mb-3">
                            Você é o titular soberano de suas informações. A qualquer tempo, mediante solicitação simples, você pode exercer:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>Confirmação e Acesso:</strong> Obter a confirmação da existência de tratamento e acessar os dados.</li>
                            <li><strong>Correção:</strong> Solicitar a retificação de dados incorretos ou desatualizados.</li>
                            <li><strong>Portabilidade:</strong> Exportar suas informações em formato interoperável (JSON/Takeout).</li>
                            <li><strong>Eliminação de Conta:</strong> Solicitar o cancelamento do registro e destruição dos dados pessoais.</li>
                        </ul>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <Link
                                href="/delete-account"
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-red hover:bg-brand-red/90 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-brand-red/20"
                            >
                                <span className="material-symbols-outlined text-sm">person_remove</span>
                                Solicitar Exclusão de Conta e Dados
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('cookie_consent');
                                    window.location.reload();
                                }}
                                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-300 dark:border-white/20 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/5 font-bold text-xs uppercase tracking-wider transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">cookie</span>
                                Reconfigurar Preferências de Cookies
                            </button>
                        </div>
                    </section>
                </main>

                <footer className="mt-12 text-center border-t border-gray-200 dark:border-white/10 pt-8 pb-4">
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 mb-6">
                        <Link href="/terms" className="hover:text-brand-yellow transition-colors">Termos de Serviço</Link>
                        <Link href="/delete-account" className="hover:text-brand-yellow transition-colors">Exclusão de Conta</Link>
                        <Link href="/" className="hover:text-brand-yellow transition-colors">Página Inicial</Link>
                    </div>
                    <p className="text-xs text-gray-400">
                        © 2026 HUB LabDiv • Instituto de Física da Universidade de São Paulo (IFUSP) • Licença AGPLv3
                    </p>
                </footer>
            </div>
        </MainLayoutWrapper>
    );
}
