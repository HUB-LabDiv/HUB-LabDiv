---
description: Audita o repositório em modo leitura, levanta dúvidas e gera um Plano de Implementação Full-Stack detalhado antes de alterar qualquer arquivo.
---

---
name: plan
description: Audita o repositório em modo somente-leitura, levanta dúvidas arquiteturais e gera um Plano de Implementação Full-Stack detalhado antes de alterar qualquer código.
---

# MODO DE PLANEJAMENTO ARQUITETURAL (/plan)

Quando este fluxo for ativado, você está **ESTRITAMENTE PROIBIDO** de criar, editar ou deletar arquivos de código até que o usuário aprove o plano explicitamente.

## PASSO 1: Auditoria Profunda (Read-Only)
1. Inspecione a árvore de arquivos relevante em `src/`, `supabase/`, `scripts/` e configurações na raiz.
2. Verifique os arquivos existentes em `supabase/migrations/newsqls/` para checar a contagem de linhas do arquivo atual (limite máximo de 700 linhas por arquivo).
3. Analise como as Server Actions, validações Zod, tipagens (`src/types`) e políticas RLS estão implementadas atualmente no módulo afetado.

## PASSO 2: Levantamento de Dúvidas (Prioridade)
- Se houver qualquer ambiguidade de regra de negócio, fluxo de UX ou permissão de banco de dados, **liste perguntas diretas e numeradas** logo no início da resposta.

## PASSO 3: Estrutura Obrigatória do Plano
Entregue o plano seguindo exatamente estas seções:

### 1. Diagnóstico & Auditoria do Estado Atual
- O que já existe no código vs. o que falta ou está vulnerável.
- Impacto em performance, segurança (RLS/Proxy) e compatibilidade Web + Android (Capacitor).

### 2. Modelagem de Dados & Supabase (`supabase/migrations/newsqls/`)
- Indique em qual arquivo SQL de `supabase/migrations/newsqls/` o código será inserido (respeitando o teto de 700 linhas; se ultrapassar, indique a criação do próximo arquivo sequencial).
- Rascunho de Tabelas, Enums, Views, Índices, Triggers, Buckets e Políticas RLS.
- Assinatura das funções RPC (quando houver operações em lote ou críticas).

### 3. Arquitetura Back-end & Tipagem (`src/types` + Server Actions)
- Interfaces TypeScript a criar/atualizar em `src/types`.
- Contratos das Server Actions e Schemas de validação **Zod** (proibido `useEffect` para data fetching).

### 4. Arquitetura Front-end, UI & Temas (Lei do Full-Stack)
- Árvore de Server Components vs. Client Components (`"use client"` restrito ao mínimo necessário).
- Especificação de **Skeletons** (loading states) e **Toasts** (feedback de sucesso/erro).
- **Dual-Theme & IDV LabDiv:** Como cada elemento se comportará no Modo Escuro (`#121212` / `#1E1E1E`) e no Modo Claro, aplicando as cores `#FFCC00` (Amarelo), `#0F4780` (Azul) e `#F14343` (Vermelho), tipografia **29LT Bukra Semi Wide Bold** (títulos) e **Open Sans** (corpo/apoio), e responsividade mobile-first (`375px`).

### 5. Plano de Execução Sequencial (Checklist)
- Lista ordenada de arquivos que serão criados (todos obrigatoriamente com cabeçalho de licença **AGPLv3**) ou modificados, divididos em fases testáveis.

---
Ao finalizar a entrega do plano, pare e pergunte: **"Aprova este plano para iniciarmos a Fase 1, ou deseja ajustar algum ponto?"**