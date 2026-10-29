# 📋 HUB Lab-Div — Histórico de Versões & Patch Notes

---

## 🚀 Versão 6.7.1 (Build 22) — *Privacidade de Apelidos, Moderação V3 de Perfis, Badges de Iniciativas & Skills Antigravity*
**Data de Lançamento:** 28 de Outubro de 2026  
**Ambiente:** Web (Next.js 16+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 🛡️ 1. Proteção de Identidade e Privacidade de Apelidos
* **Prioridade Absoluta do Apelido (`username`):**
  - Quando o usuário define um apelido, este é exibido universalmente em todo o HUB (Cards, Feed, Lab Pessoal, Comentários, Busca e Moderação), mantendo o nome civil protegido e restrito a auditorias administrativas.
  - Eliminado o vazamento de prefixos de e-mail como `@handle` nas barras laterais e no componente *Usuários em Órbita*.
* **Identidade & Privacidade M3 no Perfil (`EditProfileModal`):**
  - Módulo interativo com cards de escolha clara (*Usar Meu Apelido* vs *Usar Nome Real*) e Live Preview em tempo real do que a comunidade vê versus o que é privado.
* **Exceção Acadêmica no Match Acadêmico (`MatchAcademicoTab`):**
  - Pesquisadores e orientadores exibem obrigatoriamente o nome real civil completo para validação institucional e busca no currículo Lattes.
* **Correção de Sessão / Impersonate:**
  - Encerramento de impersonação corrigido para redirecionar para `/admin/profiles`, eliminando rota 404 legada.

---

### 🔬 2. Moderação de Perfis V3 & Badges de Iniciativas
* **Isolamento Estrito de Visibilidade:**
  - Implementação de `sanitizeProfileForViewer` para que dados em análise (`pending_edits`) sejam visíveis apenas ao próprio autor e aos moderadores.
  - Banner M3 no Lab Pessoal informando quando há rascunho sob revisão.
* **Badges de Vínculo com Iniciativas & Espaços:**
  - Suporte visual aos selos de *LabDiv*, *Show da Física*, *HS (Hackerspace)* e *Profis*, com aprovação obrigatória pela Torre de Controle.
* **Miniatura do Lab (`AdminProfileMiniLab`):**
  - Inspeção rápida de dados, métricas e publicações de usuários no painel de moderação sem `useEffect` de data fetching.
* **Aprovações Rápidas por E-mail:**
  - Suporte a tokens HMAC assinados com chave efêmera para decisões diretas da caixa de entrada de moderação.

---

### ⚡ 3. Atualização Arquitetural Antigravity
* **Migração de Workflows para Skills:**
  - Atualização completa dos fluxos legados para o formato moderno `.agents/skills/*/SKILL.md` com suporte nativo aos slash commands `/att-git`, `/att-teste`, `/audit-sec`, `/check-ui`, `/fix-android`, `/plan` e `/sql-mig`.

---

## 🚀 Versão 6.7.0 (Build 21) — *Torre de Controle em Lote (Swipe M3), 4 Personas, Validação Docente LGPD & Seção Interativa*
**Data de Lançamento:** 26 de Outubro de 2026  
**Ambiente:** Web (Next.js 16+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 🛡️ 1. Nova Torre de Controle `/admin` com Fila de Moderação em Swipe (M3)
* **Gestos Móveis & Atalhos de Teclado:**
  - Fila unificada de aprovação com suporte a gestos touch em `375px` via Framer Motion (Swipe Right para Aprovar, Swipe Left para Rejeitar).
  - Atalhos no desktop: <kbd>A</kbd> (Aprovar), <kbd>R</kbd> (Rejeitar com justificativa opcional), <kbd>S</kbd> (Pular/Mover ao fim), <kbd>Ctrl+Z</kbd> (Desfazer).
* **Staging Queue & Execução Atômica em Lote:**
  - Persistência das marcações em `localStorage` (`hub_admin_swipe_staging_queue`) protegendo contra recarregamento acidental.
  - Barra de ações flutuante M3 com botão "⚡ Executar Ações em Lote" via RPC PostgreSQL `batch_moderate_queue`.
  - Interceptação de edições de postagens (`pending_edits`), denúncias, palavras geradoras, arestas de constelação, feedbacks de softwares e oportunidades.
* **Expurgo Imediato de Arquivos (LGPD):**
  - Remoção física definitiva do arquivo de comprovante docente no bucket `teacher-verifications` no exato momento da aprovação ou rejeição, preservando apenas metadados de auditoria no perfil.

---

### 🎓 2. Arquitetura de 4 Personas & Validação Docente
* **4 Personas Oficiais LabDiv:**
  - `aluno` (estudantes com e-mail `@usp.br` / subdomínios).
  - `professor` (docentes IFUSP/USP validados com documento comprobatório).
  - `curioso` (visitantes, comunidade externa e interessados em ciência).
  - `iniciativa` (coletivos e projetos institucionais, restrito à Torre de Controle).
* **Trava Anti-Escalação de Privilégios (PostgreSQL):**
  - Trigger `protect_profile_privileges` impedindo que usuários sem papel de admin alterem diretamente sua persona para `professor` ou `iniciativa`, ou aprovem status docente.
* **Interface de Perfil & Upload Seguro:**
  - Redesenho do seletor de persona e categoria em `EditProfileModal.tsx`.
  - Envio de comprovante oficial (PDF/JPG/PNG até 10MB) direcionado ao bucket privado criptografado `teacher-verifications`.

---

### 📑 3. Eixo 02 Informativo (`#F14343`) — Subseção "Interativo" Segmentada
* **Navegação Adaptativa M3 (Segmented Buttons):**
  - Aba **Curiosos:** Ações de extensão CCEx, cursos livres, visitas guiadas e Show da Física.
  - Aba **Alunos:** Bolsas PUB, PIBIC, monitorias e oportunidades acadêmicas.
  - Aba **Professores:** Editais de fomento e **Central de Formulários Operacionais do IFUSP** (Manutenção Predial/Cadeiras, Almoxarifado/Compras, Reserva de Salas Didáticas e DTI).
* **Design System & Acessibilidade:**
  - Padrões M3 Dual-Theme (Modo Claro `#F8FAFC`, Modo Escuro `#121212`), tipografia oficial `29LT Bukra Semi Wide Bold` e `Open Sans`, e skeletons para trocas fluidas de contexto.

---

### 🤖 4. Scraper Automático & Pipeline Unificado de Dados
* **CLI Runner & Comandos NPM:**
  - Criação do script `scripts/scrapers/run_pipeline.ts` com suporte a `--mode=audit` (dry-run) e `--mode=apply`.
  - Novos atalhos `npm run scraper:audit` e `npm run scraper:pipeline`.
  - Validação estrita via Zod para 100% dos dados de Departamentos, Docentes, Eventos, Iniciativas, Espaços e JúpiterWeb.

---

### 🎨 5. UI/UX: Cards Horizontais com Snap & Banners com Micro-Animações
* **Restauração de Feeds Horizontais:**
  - Tópicos de Conhecimento, Espaços Físicos, Canais de Divulgação, Iniciativas, Notícias, Agenda e Oportunidades restaurados para o formato horizontal com `snap-x snap-mandatory`, navegação lateral suave e compatibilidade mobile `375px`.
* **Banners Dinâmicos:**
  - "Como Usar o HUB" com borda gradiente cônica animada periódica (~7s) mapeando as cores oficiais dos 3 eixos (Azul `#0F4780`, Vermelho `#F14343`, Amarelo `#FFCC00`).
  - "Aviso de Revisão Comunitária" com micro-animação pulsante e gradiente puro.
* **Departamentos no Mobile:**
  - Grid compacto de 2 colunas por 3 linhas em telas de `375px`.
* **USP 101 (Dicas de Veteranos):**
  - Feed vertical de dicas rápidas com filtro por instituto, contadores de upvote e preservação dos acervos históricos (Google Scholar e Sci-Hub).

---

### 🔒 6. Auditoria de Segurança Full-Stack (/audit-sec) & Notificações de Fila
* **Blindagem RBAC & RLS:**
  - Bloqueio de aprovação/rejeição de dicas e softwares acadêmicos exclusivamente para administradores/moderadores validados via `requireAdminOrModerator()` e `createAdminSupabase()`.
  - Reforço de RLS nas tabelas `dicas_veteranos` e `academic_softwares` com `public.is_admin()`.
  - Cabeçalhos de licença GNU AGPLv3 adicionados aos componentes pendentes.
* **Sistema de Notificações de Moderação:**
  - Monitoramento contínuo da fila com alertas por e-mail ao acumular > 5 itens, disparo duplo aos 10 itens e alarmes temporais para itens represados há mais de 10 e 30 minutos.

---

### 📱 7. Android Capacitor & Dual-Theme Nativo
* **Splash Screen DayNight:**
  - Criação de `values-night/colors.xml` e ajuste de `values/colors.xml` para transição nativa perfeita entre modo claro e escuro.
  - Sincronização Capacitor (`npx cap sync android`) e validação completa no Gradle 9.6.1 / AGP 9.4.1.

---

## 🚀 Versão 6.6.2 (Build 20) — *Governança de Acesso do Show de Física & Redirecionamento Oficial*
**Data de Lançamento:** 19 de Outubro de 2026  
**Ambiente:** Web (Next.js 14+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 🎭 1. Show de Física & Governança de Agendamentos
* **Bloqueio de Acesso para Não-Administradores:**
  - Botões de ação do Show de Física bloqueados para usuários comuns, com avisos informativos em toast sobre a fase de homologação.
  - Inserção de botão de alta visibilidade direcionando para o portal oficial do Show de Física no IFUSP (`https://portal.if.usp.br/showdefisica/pt-br/node/323`).
* **Inativação Temporária do "Monte seu Show":**
  - O recurso de montagem customizada de roteiro foi colocado em modo "Em Breve" com proteção de rota via redirecionamento de servidor para `/iniciativas/show-da-fisica`.
  - Acompanhamento de sessões interativas liberado estritamente para administradores autenticados.

---

## 🚀 Versão 6.6.1 (Build 19) — *Correção de Interface Mobile & Estabilidade Android 15+*
**Data de Lançamento:** 18 de Outubro de 2026  
**Ambiente:** Web (Next.js 14+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 📱 1. Correções Críticas de Layout Android & Edge-to-Edge
* **Eliminação de ActionBar Nativa Duplicada:**
  - Correção no tema da aplicação (`AppTheme.NoActionBar`) eliminando a barra superior nativa do Android que causava sobreposição ("H...") e duplicava o cabeçalho no aplicativo móvel.
  - Configuração do `postSplashScreenTheme` na Splash Screen nativa para transição direta sem barras indesejadas.
* **Ajuste Fino de Insets da Barra de Status:**
  - Implementação de `ViewCompat.setOnApplyWindowInsetsListener` em `MainActivity.java` para cálculo exato da área de recorte (notch/câmera) e status bar no Android 15 (SDK 35/36), garantindo visual idêntico ao navegador mobile.
* **Paleta de Cores Nativas do Sistema:**
  - Criação de `colors.xml` no Android alinhando `windowBackground`, `colorPrimary` e `colorPrimaryDark` ao padrão Base Dark (`#121212`) e amarelo LabDiv (`#FFCC00`).

---

## 🚀 Versão 6.6.0 (Build 18) — *Navegação em Árvore, Busca Global Spotlight & Eixos Acadêmicos*
**Data de Lançamento:** 18 de Outubro de 2026  
**Ambiente:** Web (Next.js 14+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 🌟 1. Navegação Central & Busca Global (Spotlight / Command Bar)
* **Busca Global Centralizada (`Ctrl + K` / `Cmd + K` e `/`):**
  - Implementação de barra de busca central estilo Spotlight/Command Bar no topo, com captura e atalhos de teclado globais.
  - Otimização para Mobile: barra responsiva expandida e atalho `/` ocultado automaticamente em interfaces touch.
  - Normalização algorítmica de diacríticos e acentos (`NFD`) em queries e títulos.
  - Cobertura completa de rotas, ferramentas, iniciativas e páginas institucionais com palavras-chave dedicadas.

---

### 🌳 2. Menu em Árvore Lateral (Tree View / Accordion)
* **Estrutura Hierárquica por Eixos:**
  - Menu vertical estilo árvore na Sidebar esquerda permitindo acesso direto às sub-abas:
    - *Social:* Fluxo, Arte e Logs.
    - *Informativo:* Instituto, Wiki e Interativo.
    - *Ferramentas Acadêmicas:* Acompanhamento, Estudos e Integração.
    - *Como Ingressar:* Visitas & Extensão, Vestibular & Matrícula e Perguntas Frequentes.
  - Destaque dinâmico e cores oficiais da marca LabDiv (`#FFCC00`, `#0F4780`, `#F14343`) no hover e estado ativo.
  - Sincronização em tempo real de parâmetros de URL (`?tab=fluxo`, `?tab=artes`, `?tab=logs`).

---

### 🎓 3. Ferramentas Acadêmicas Reestruturadas
* **Navegação em Dois Níveis:**
  - *Acompanhamento:* Segmentado semanticamente em **Semestre** (Grade Horária) e **Curso** (Trilhas Curriculares).
  - *Estudos:* Segmentado em **Central de Anotações** e **Softwares da Comunidade**.
  - *Integração:* Direcionamento imediato para o **Match Acadêmico** entre estudantes.

---

### 🔬 4. Perfil Científico (Lab Pessoal) & Preenchimento Direto
* **Interatividade Inline e Chips 'Não Informados (NI)':**
  - Eliminação de modais intermediários para dados rápidos: badges e chips interativos para preenchimento imediato de Curso, Hobbies, Expressões Culturais, Apelido e Bio.
  - Atualização otimista imediata com persistência segura no Supabase e suporte a atalhos `Enter` (salvar) e `Esc` (cancelar).
  - Botão de edição atualizado com ícone semântico de lápis (`Pencil`).

---

### 🔭 5. Observatório Científico & Parcerias
* **Seção "Como o LabDiv Pode Ajudar":**
  - Apresentação estruturada dos 4 pilares de apoio à divulgação científica: Mentoria Pedagógica, Design & Identidade Visual, Infraestrutura & TI e Cobertura Audiovisual.
  - Case de sucesso integrado do **Show da Física**.
  - Formulário interativo e Server Action com validação Zod para solicitação oficial de parcerias com o LabDiv.
  - Integração do Show da Física no portal "Como Ingressar" (visitas de escolas e vestibulandos).

---

## 🚀 Versão 6.5.1 (Build 17) — *Conformidade Jurídica Integral & Blindagem Regulatória*
**Data de Lançamento:** 16 de Outubro de 2026  
**Ambiente:** Web (Next.js 14+) & Android Mobile (Capacitor / Google Play Store)  
**Licença:** GNU Affero General Public License v3 (AGPLv3)

---

### 🛡️ 1. Governança Regulatória & Proteção de Dados (LGPD, ECA e ANPD)
* **Trava de Consentimento em Telemetria (LGPD Art. 7º, I):**
  - O sistema de eventos e telemetria (`useTelemetry`) e a análise de leitura (`ViewTracker`) agora exigem consentimento prévio e explícito via banner de cookies (`cookie_consent === 'true'`).
  - Nenhum evento comportamental é transmitido ou gravado caso o usuário rejeite os cookies analíticos.
* **Blindagem Total para Menores de 18 Anos (ECA & Enunciado CD/ANPD nº 1/2023):**
  - Desativação automática e incondicional de telemetria comportamental e profiling para perfis identificados como menores (`is_adult === false`).
  - Reformulação do fluxo de consentimento parental (`/auth/parental-consent`): eliminada requisição a serviços externos terceiros (`ipify.org`), adotando derivação criptográfica de semente baseada no token e captura legítima de IP nos cabeçalhos seguros do servidor.
* **Minimização da Coleta e Proteção da Área de Transferência (LGPD Art. 6º, III):**
  - Removido o registro de pré-visualização de texto copiado (`preview`) no sensor de clipboard (`useOmniscientMatrix`), retendo estritamente metadados técnicos agnósticos (`length` e `path`) para evitar vazamento acidental de CPFs, senhas ou e-mails privados.
* **Validação Algorítmica Local de CPF com Hash Argon2id (LGPD Art. 6º, VII):**
  - Substituída a chamada externa a endpoint obsoleto de terceiros por validação matemática local de dígitos verificadores (Módulo 11 da Receita Federal) e geração imediata de hash criptográfico unidirecional via Argon2id.

---

### ⚖️ 2. Ciclo de Vida de Conteúdo & Direitos Autorais (LDA 9.610/98)
* **Formalização do Regime Dual de Feeds:**
  - **Feeds Padrão / Posts Comuns:** Licença vinculada à existência da conta, submetida a exclusão definitiva (*hard delete*) em caso de encerramento pelo usuário.
  - **Feeds de Acervo Aberto (Creative Commons CC BY 4.0):** Preservação do conteúdo científico comunitário sob conversão em obra anônima por vontade do autor (Art. 5º, VIII, "b" da Lei 9.610/1998), com destruição permanente do vínculo com dados pessoais (`user_id = NULL`, nome e avatar anonimizados).
* **Declaração Expressa de Autoria e Anuência de Coautores:**
  - Inserida garantia legal no fluxo de submissão do Diagramador (`/enviar`): o pesquisador atesta formalmente a autoria legítima ou posse de autorização dos coautores antes de publicar, blindando o ecossistema contra infrações de plágio/contrafação (Arts. 22 e 29 da LDA).
* **Canal Ativo de Denúncia e Moderação (*Notice-and-Takedown*):**
  - Formulário estruturado de denúncia autoral e conteúdo ilícito no modal de feedback (`ReportModal`), com análise prioritária humana por curadores do IFUSP (Marco Civil da Internet, Art. 19/20).

---

### 📱 3. Políticas da Google Play Store (Data Safety & Exclusão de Contas)
* **Duplo Caminho Obrigatório de Exclusão:**
  - **Caminho Interno (In-App):** Botão nativo em *Configurações > Conta & Privacidade > Zona de Risco*, com modal transparente de consequências e limpeza profunda no cliente (`handleDeepCleanup` com `supabase.auth.signOut()`).
  - **Recurso Web Público (`/delete-account`):** Página web pública acessível diretamente pelo navegador sem exigir o aplicativo instalado, com formulário de solicitação manual para usuários que desinstalaram o app e expurgo em até 30 dias.
* **Exclusão de Fotos e Mídias no Storage:**
  - A rota de exclusão do backend (`/api/account/delete`) agora expurga em lote todos os arquivos de avatar e imagens de perfil armazenados no bucket Supabase Storage (`avatars/${userId}/*`), garantindo eliminação física dos arquivos.
* **Exclusão Granular de Dados Específicos:**
  - Modal dedicado que permite ao pesquisador apagar individualmente submissões, comentários, microartigos, perguntas ou interações sem encerrar a conta principal.
* **Portabilidade Completa de Dados (Takeout LGPD):**
  - Exportação de todo o histórico do usuário (perfil, publicações, interações, histórico de leitura) em arquivo JSON estruturado.

---

### 🌐 4. Licenciamento Copyleft AGPLv3 (Seção 13) & Transparência
* **Acesso Prominente ao Código-Fonte Correspondente:**
  - Em estrito cumprimento à Seção 13 da licença AGPLv3 para aplicações em rede, foram inseridos links públicos e permanentes para o repositório oficial do projeto (`github.com/JoaoStangorlini/HUB-LabDiv`) no rodapé global (`Footer.tsx`) e nas seções de governança do Portal de Transparência (`/transparencia`).
* **Navegação Legal Irrestrita:**
  - Ajustadas as regras do middleware (`proxy.ts`) para assegurar que as páginas legais (`/terms`, `/privacy`, `/transparencia`, `/delete-account`) sejam acessíveis por qualquer visitante, mesmo deslogado ou durante a etapa de verificação cadastral.

---

### 🎨 5. Identidade Visual (IDV) e Melhorias de Interface
* **Ajuste Proporcional do Gradiente Institucional:**
  - Cores da marca LabDiv ajustadas: amarelo (`#FFCC00`), azul (`#0F4780`) e vermelho (`#F14343`), mantendo a hierarquia tipográfica oficial (29LT Bukra para títulos e Open Sans para textos de apoio).
  - Atualização do link de teste oficial do aplicativo direcionado diretamente para a página na Google Play Store.

---

## 📝 Texto para o Google Play Console (Release Notes / Patch Notes)
*(Limite de 500 caracteres para o campo "Novidades desta versão" no Play Console)*

```text
Versão 6.6.1:
• Correção de sobreposição no cabeçalho e suporte aprimorado ao Android 15.
• Nova busca global rápida com design Spotlight e atalho Ctrl+K.
• Menu em árvore vertical com acesso direto a todas as sub-abas.
• Ferramentas acadêmicas reorganizadas: Acompanhamento, Estudos e Integração.
• Edição inline no Lab Pessoal (curso, hobbies e apelido).
• Seção de parcerias do LabDiv e Show da Física no Como Ingressar.
• Melhorias de desempenho e estabilidade geral.
```
