# 📋 HUB Lab-Div — Histórico de Versões & Patch Notes

---

## 🚀 Versão 6.5.0 (Build 16) — *Conformidade Jurídica Integral & Blindagem Regulatória*
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
Versão 6.5.0:
• Conformidade plena com a LGPD e Marco Civil da Internet.
• Atualização do fluxo de exclusão de conta e dados pessoais (in-app e web).
• Regime Dual de Feeds com licença aberta Creative Commons (CC BY 4.0).
• Proteção aprimorada para menores de idade e consentimento parental.
• Validação local e segura de documentos com criptografia Argon2id.
• Link para código aberto conforme a licença AGPLv3.
• Melhorias de desempenho, estabilidade e correções de interface.
```
