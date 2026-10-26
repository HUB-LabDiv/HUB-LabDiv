---
description: Gera migrations em supabase/migrations/newsqls/ respeitando a trava de 700 linhas por arquivo, valida políticas RLS e sincroniza src/types.
---

# WORKFLOW: MIGRAÇÃO SQL & TIPAGEM SUPABASE (/sql-mig)

Sempre que este workflow for acionado para criar ou alterar estruturas do banco de dados, siga estritamente este protocolo:

## 1. Verificação da Regra de 700 Linhas
1. Liste os arquivos dentro de `supabase/migrations/newsqls/` e verifique a contagem exata de linhas do arquivo mais recente (usando `wc -l`).
2. **Cálculo de Capacidade:**
   - Se `linhas_atuais + linhas_novo_sql <= 700`: adicione o novo bloco SQL ao final do arquivo atual com um comentário separador datado.
   - Se `linhas_atuais + linhas_novo_sql > 700`: crie um novo arquivo sequencial em `supabase/migrations/newsqls/` (incluindo o aviso da licença AGPLv3 no topo).

## 2. Checklist Obrigatório de Segurança SQL
- Toda nova tabela ou Storage Bucket **DEVE** conter `ENABLE ROW LEVEL SECURITY` e suas respectivas políticas (`SELECT`, `INSERT`, `UPDATE`, `DELETE`).
- Use `IF NOT EXISTS` ou `CREATE OR REPLACE` para garantir idempotência.
- Se a tabela receber conteúdo gerado por usuário comum, inclua o suporte ao fluxo de moderação da Torre de Controle (`status` / fila de aprovação).

## 3. Sincronização Full-Stack (`src/types` + Zod)
1. Atualize imediatamente as interfaces correspondentes em `src/types`.
2. Crie ou atualize os schemas **Zod** nas Server Actions que consumirão essa tabela/RPC.