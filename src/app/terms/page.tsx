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
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Serviço e Uso | HUB LabDiv (IFUSP)',
    description: 'Termos de Serviço, Propriedade Intelectual, Regime Dual de Feeds e Código de Conduta do HUB LabDiv (Instituto de Física da USP).',
};

export default function TermsOfServicePage() {
    return (
        <MainLayoutWrapper>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <header className="mb-10 text-center">
                    <div className="w-16 h-16 mx-auto bg-brand-blue/10 rounded-2xl flex items-center justify-center mb-4 border border-brand-blue/20">
                        <span className="material-symbols-outlined text-4xl text-brand-blue">description</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bukra font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-3">
                        Termos de <span className="text-brand-yellow drop-shadow-sm">Serviço e Uso</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                        Contrato de Adesão, Propriedade Intelectual, Código de Conduta Comunitária e Governança do Ecossistema HUB LabDiv (IFUSP).
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-xs font-semibold text-brand-blue">
                        <span>Versão 6.6.2 • Atualizado em 2026</span>
                    </div>
                </header>

                <main className="space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    {/* Seção 1: Objeto e Partes */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-black">1</span>
                            Objeto, Partes e Escopo da Aplicação
                        </h2>
                        <p className="mb-3">
                            O presente instrumento estabelece as cláusulas contratuais de adesão entre o <strong>HUB LabDiv</strong> — iniciativa do Laboratório de Expressão e Divulgação Científica do <strong>Instituto de Física da Universidade de São Paulo (IFUSP)</strong> — e você, usuário da plataforma em suas versões Web (<code>hub-lab-div.vercel.app</code>) e aplicativo móvel para Android.
                        </p>
                        <p>
                            A plataforma é um ecossistema acadêmico-colaborativo destinado a promover competências de comunicação científica, repositório de mídias e ferramentas de apoio à pesquisa. O acesso e o uso dos serviços condicionam-se à aceitação expressa e integral destes Termos de Serviço e da nossa <Link href="/privacy" className="text-brand-blue hover:underline font-bold">Política e Aviso de Privacidade</Link>.
                        </p>
                    </section>

                    {/* Seção 2: Elegibilidade e Tutela de Menores */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-yellow/10 text-brand-yellow flex items-center justify-center text-sm font-black">2</span>
                            Elegibilidade e Tutela de Menores (ECA e LGPD)
                        </h2>
                        <p className="mb-3">
                            O HUB LabDiv é aberto tanto à comunidade universitária (alunos, docentes e servidores) quanto a membros externos e estudantes da educação básica interessados em ciência:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li><strong>Maiores de 18 anos:</strong> Possuem plena capacidade para publicar, comentar e utilizar todas as funcionalidades da plataforma.</li>
                            <li><strong>Adolescentes (12 a 17 anos):</strong> Em observância estrita ao <strong>Estatuto da Criança e do Adolescente (Lei nº 8.069/1990)</strong> e ao <strong>Enunciado CD/ANPD nº 1/2023</strong>, o tratamento de dados de menores é regido prioritariamente pelo seu melhor interesse educacional. Publicações abertas exigem moderação pedagógica prévia ou consentimento assistido, e ferramentas de rastreamento comportamental de terceiros são bloqueadas por padrão.</li>
                        </ul>
                    </section>

                    {/* Seção 3: Código de Conduta e Ética Científica */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center text-sm font-black">3</span>
                            Código de Conduta Ética e Vedações Estritas
                        </h2>
                        <p className="mb-3">
                            Ao interagir no HUB LabDiv, o usuário compromete-se com a integridade científica e o respeito mútuo. É expressamente proibido:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Plágio e Violação Autoral:</strong> Submeter textos, pôsteres, imagens ou pesquisas sem titularidade legítima ou sem a devida atribuição da fonte e coautores (Lei nº 9.610/1998).</li>
                            <li><strong>Fraude Científica:</strong> Divulgar dados empíricos deliberadamente fabricados, adulterados ou fraudulentos.</li>
                            <li><strong>Discurso Ilícito:</strong> Propagar discursos de ódio, racismo, assédio, discriminação ou violações a direitos fundamentais.</li>
                            <li><strong>Abuso Técnico:</strong> Executar engenharia reversa, mineração automatizada não autorizada (scraping), ataques de negação de serviço (DoS) ou tentativas de burlar mecanismos de controle de acesso (RBAC).</li>
                        </ul>
                    </section>

                    {/* Seção 4: Regime Dual de Feeds (CLÁUSULA CRÍTICA) */}
                    <section className="bg-white dark:bg-white/5 border-2 border-brand-yellow/30 rounded-2xl p-6 sm:p-8 shadow-md">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-8 rounded-lg bg-brand-yellow/20 text-brand-yellow flex items-center justify-center text-sm font-black">4</span>
                            <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white">
                                Regime Dual de Feeds e Propriedade Intelectual
                            </h2>
                        </div>
                        <p className="mb-4">
                            Em observância ao Art. 4º da Lei de Direitos Autorais (Lei nº 9.610/1998) e às diretrizes da Google Play Store, o HUB LabDiv adota um <strong>Regime Dual formal de ciclo de vida e licenciamento de conteúdo</strong>:
                        </p>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-gray-200 dark:border-white/10">
                                <h3 className="font-bold text-brand-blue flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-lg">delete_forever</span>
                                    1. Postagens Comuns, Rascunhos e Dados de Perfil (Exclusão Total)
                                </h3>
                                <p className="text-sm leading-relaxed">
                                    Para postagens comuns, comentários cotidianos, dados biográficos, fotos de perfil e mídias não depositadas sob licença pública, a licença concedida ao HUB LabDiv é estritamente vinculada à vigência da sua conta. Caso você exclua sua conta ou apague essas postagens, elas serão <strong>definitivamente eliminadas (hard delete)</strong> de nossos servidores e backups ativos em até 30 dias.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-background-dark/40 border border-brand-yellow/30">
                                <h3 className="font-bold text-brand-yellow flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-lg">public</span>
                                    2. Feeds sob Licença Creative Commons (Permanência e Anonimização Irreversível)
                                </h3>
                                <p className="text-sm leading-relaxed mb-2">
                                    Materiais submetidos explicitamente aos feeds de acervo aberto e divulgação científica são licenciados sob a licença pública <strong>Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)</strong> ou CC BY-NC 4.0. Conforme a natureza jurídica dessa licença mundial e irrevogável, as obras permanecem no acervo público para assegurar a continuidade da cadeia científica.
                                </p>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                    <strong>Desatribuição por Vontade do Autor:</strong> Ao solicitar a exclusão de sua conta, o usuário manifesta sua vontade expressa de converter suas obras CC em <em>obras anônimas</em> (Art. 5º, VIII, &quot;b&quot; da Lei nº 9.610/1998). O sistema apaga permanentemente todos os metadados identificadores (ID do usuário, nome, e-mail e foto), substituindo a autoria pelo identificador genérico <em>&quot;Autor Anônimo (Comunidade LabDiv)&quot;</em>, sem qualquer mapeamento reverso.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Seção 5: Notice and Takedown */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-red/10 text-brand-red flex items-center justify-center text-sm font-black">5</span>
                            Procedimento de Notificação e Retirada (Notice and Takedown)
                        </h2>
                        <p className="mb-3">
                            O HUB LabDiv respeita rigorosamente os direitos autorais de terceiros. Caso qualquer titular de direitos identifique material em nossa plataforma que constitua violação autoral (plágio/contrafação) ou conteúdo ilícito, disponibilizamos canal célere para solicitação de remoção:
                        </p>
                        <p className="mb-3">
                            As notificações fundamentadas devem ser encaminhadas através do canal de reportes integrado na aplicação ou diretamente ao e-mail institucional: <a href="mailto:hublabdiv@gmail.com" className="text-brand-blue font-bold hover:underline">hublabdiv@gmail.com</a>, contendo a identificação da obra violada, a localização do conteúdo (URL) e a comprovação da titularidade. Comprovada a irregularidade, o conteúdo será suspenso cautelarmente de imediato.
                        </p>
                    </section>

                    {/* Seção 6: Disponibilidade e Limitação de Responsabilidade */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-brand-blue/10 text-brand-blue flex items-center justify-center text-sm font-black">6</span>
                            SLA, Disponibilidade e Limitação de Responsabilidade
                        </h2>
                        <p className="mb-3">
                            Empregamos todos os esforços técnicos e de segurança para manter o ecossistema acessível 24/7. Não obstante, os serviços podem ser pontualmente interrompidos para manutenções programadas, atualizações de versão ou instabilidades em provedores de infraestrutura em nuvem.
                        </p>
                        <p>
                            As opiniões, metodologias teóricas e conclusões expressas em artigos e pôsteres submetidos por usuários refletem exclusivamente a posição de seus autores, não vinculando institucionalmente a Universidade de São Paulo ou a coordenação do LabDiv.
                        </p>
                    </section>

                    {/* Seção 7: Exclusão de Contas */}
                    <section className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
                        <h2 className="text-xl font-bukra font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-black">7</span>
                            Exclusão de Conta e Direitos do Usuário
                        </h2>
                        <p className="mb-3">
                            Em conformidade com as regras do Google Play Console e com o Art. 18 da LGPD, o usuário pode solicitar a exclusão de sua conta a qualquer momento por dois caminhos:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-3">
                            <li><strong>No aplicativo móvel:</strong> Acessando <em>Configurações &gt; Conta &gt; Excluir Conta</em>.</li>
                            <li><strong>Pela Web:</strong> Acessando diretamente a nossa página pública de exclusão em <Link href="/delete-account" className="text-brand-blue font-bold hover:underline">hub-lab-div.vercel.app/delete-account</Link> sem necessidade de ter o app instalado.</li>
                        </ul>
                    </section>
                </main>

                <footer className="mt-12 text-center border-t border-gray-200 dark:border-white/10 pt-8 pb-4">
                    <div className="flex flex-wrap justify-center gap-6 text-sm font-bold text-gray-500 mb-6">
                        <Link href="/privacy" className="hover:text-brand-yellow transition-colors">Política de Privacidade</Link>
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
