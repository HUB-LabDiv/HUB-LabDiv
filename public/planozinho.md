# Plano de Implementação Unificado: HUB Lab-Div - Post Interativo & Letramento Científico

Este documento define a arquitetura definitiva para o ecossistema de postagens do HUB, aplicando os conceitos de metodologias ativas de aprendizagem e a epistemologia de Paulo Freire (Codificação, Descodificação, Ressignificação e Palavras Geradoras).

---

## 1. Arquitetura de Dados Definitiva (Supabase)

Para suportar o contexto sociocultural e a interatividade qualitativa, o banco de dados utilizará a seguinte estrutura relacional:

### A. Tabela de Postagem e Contexto
* **Tabela: `posts`**
  * Atualização: Adição da coluna `contexto_hsec` (JSONB) para armazenar os dados de background antes da leitura técnica. Exemplo de chaves: `{ "historico": "", "social": "", "economico": "" }`.

### B. O Novo Glossário (Signos Linguísticos)
Substitui o modelo de colunas fixas por uma relação 1:N escalável para suportar múltiplas "Constelações" de usuários.
* **Tabela: `palavras_geradoras`** (O núcleo do conceito)
  * `id` (UUID, PK)
  * `termo` (String): A palavra geradora (ex: Entropia, Vetor).
  * `codificacao_academica` (Text): O significado formal/acadêmico.
* **Tabela: `signos_constelacoes`** (As traduções de universo)
  * `id` (UUID, PK)
  * `palavra_id` (Fk -> palavras_geradoras.id)
  * `constelacao` (Enum/String): Identificador do grupo (ex: 'nerd', 'artistica', 'ifuspiana', 'geral').
  * `descodificacao` (Text): A tradução do termo acadêmico para os signos desta comunidade.

### C. Espaços de Reflexão e Coleta de Dados
Evolução do "Quiz" para capturar a ressignificação do leitor.
* **Tabela: `reflexoes_inline`**
  * `id` (UUID, PK)
  * `post_id` (Fk -> posts.id)
  * `ancora_paragrafo` (String): ID de rastreamento no texto.
  * `tipo_reflexao` (Enum): `fechada` (múltipla escolha) ou `aberta` (discursiva).
  * `pergunta_provocadora` (Text)
  * `resposta_esperada_ou_gabarito` (Text): Feedback para guiar o usuário pós-resposta.
* **Tabela: `respostas_usuarios`** (Crucial para métricas de aprendizagem)
  * `id` (UUID, PK)
  * `reflexao_id` (Fk -> reflexoes_inline.id)
  * `usuario_id` (Fk -> auth.users.id)
  * `significado_gerado` (Text): O texto digitado pelo usuário (a ressignificação real).

---

## 2. Componentização Front-end (Next.js + Tailwind)

A interface do leitor consumirá os dados acima através de três componentes dinâmicos principais:

### Componente A: `<ContextPanel />` (O Contexto do Post)
* **Localização:** Fixo no topo do post ou em uma *Sidebar* lateral fixa (estilo Wikipedia).
* **UI/UX:** Um sistema de abas (Tabs) ou Acordeão (Accordion).
* **Lógica:** Consome o JSON `contexto_hsec` da tabela `posts`. Apresenta o contexto histórico, social e econômico do objeto científico, criando o terreno para a leitura.

### Componente B: `<TranslationalTooltip />` (As Palavras Geradoras)
* **Localização:** Envolve palavras-chave dentro do texto (*Inline*).
* **UI/UX:** A palavra ganha um sublinhado pontilhado. Ao passar o mouse ou clicar, abre um `Popover` (balão flutuante).
* **Lógica:** Busca na tabela `signos_constelacoes` as traduções disponíveis para a palavra clicada, permitindo ao usuário alternar abas para ler a explicação no "dialeto" Nerd, Artístico, etc.

### Componente C: `<BalloonReflexao />` (A Pausa e Descodificação)
* **Integração:** Escuta a "Régua de Leitura" já existente no HUB via estado (props ou context). Exemplo: `<BalloonReflexao ancoraId="paragrafo-3" reguaAtivaId={estadoDaRegua} />`
* **Lógica de Expansão:** 1. Fica encolhido como um ícone de "Pausa" na lateral da tela.
  2. Quando a Régua de Leitura do usuário encosta na âncora, o balão desliza e se expande automaticamente.
  3. Apresenta a provocação e um input para o usuário digitar a sua ressignificação, enviando para `respostas_usuarios` e exibindo o feedback.

---

## 3. Refatoração de UX/UI: O Formulário de Criação (Passo 4 - Extras)

Para que o autor consiga criar essas reflexões de forma orgânica, o "Passo 4" do formulário de envio deixa de ser uma página isolada e passa a ser um **Motor de Preview Interativo**.

### A. O que sai do Formulário Atual:
* Remoção do textarea "Seu Depoimento de Sucesso".
* Remoção do bloco gigante isolado de "Mini Quiz" no fim da página.

### B. O que entra na Nova Arquitetura (*Split-Pane*):
| Componente | Comportamento Lógico |
| :--- | :--- |
| `<LivePostPreview />` | Renderiza o Markdown do autor em tempo real, exatamente como o leitor final verá (Apenas leitura). |
| `<ChapterDelimiter />` | Injetado automaticamente pelo sistema ao fim de cada parágrafo do Preview, exibindo um botão fantasma: `[ + Adicionar Reflexão Aqui ]`. |
| `<InlineReflexionBuilder />` | O formulário de criação da reflexão. Aparece *apenas* quando o autor clica no botão acima, fixando a pergunta exatamente àquela âncora do texto. Após salvo, vira um *preview* do balão. |

---

## 4. Checklist de Cumprimento das Tarefas (Notion)

| Tarefa Exigida | Solução Arquitetural Implementada |
| :--- | :--- |
| **Balões de reflexão (pausa e respostas)** | Componente `<BalloonReflexao>` escutando a Régua de Leitura e persistindo dados na tabela `respostas_usuarios`. |
| **Contexto do post (Histórico/Social/Econômico)** | Componente `<ContextPanel>` mapeado para a coluna JSONB `contexto_hsec` da tabela `posts`. |
| **Adaptar conteúdo (Universos/Constelações)** | Estrutura relacional escalável `signos_constelacoes` acoplada aos Tooltips para leitura multiversal. |
| **Glossário (Palavras Geradoras)** | Tabela central `palavras_geradoras` atuando como a âncora formal de todas as codificações acadêmicas da plataforma. |