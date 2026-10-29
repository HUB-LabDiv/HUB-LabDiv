---
name: audit-sec
description: Audita segurança Full-Stack (RLS, Zod, Proxy, LGPD), performance de rotas e verifica se alguma mutação de usuário escapa da Torre de Controle.
---

# WORKFLOW: AUDITORIA DE SEGURANÇA, MODERAÇÃO & PERFORMANCE (/audit-sec)

Realize uma varredura técnica no módulo especificado (ou no repositório) verificando os 5 pilares abaixo e entregue um relatório em tabela:

1. **Interceptação de Moderação (Torre de Controle):**
   - Verifique todas as operações `INSERT`, `UPDATE` e `DELETE` acionadas por usuários não-admin. Nenhuma criação/edição pública deve ir ao ar sem passar pelo fluxo de aprovação do `/admin`.
2. **Validação de Entrada & Server Actions:**
   - Confirme que todas as Server Actions validam o payload com **Zod** e verificam a sessão/persona autenticada no servidor antes de chamar o Supabase.
   - Confirme que não há nenhum `useEffect` fazendo data fetching no client.
3. **Supabase RLS & Storage Privado:**
   - Verifique se tabelas e buckets possuem políticas RLS restritivas por persona (`aluno`, `professor`, `curioso`, `iniciativa`, `admin`) e se arquivos sensíveis (como comprovantes) possuem expurgo pós-validação (LGPD).
4. **Performance de Proxy/Middleware (`proxy.ts`):**
   - Analise se há chamadas redundantes de banco ou sessão em `proxy.ts` que estejam adicionando latência alta nas rotas (meta: reduzir tempos acima de 500ms).
5. **Conformidade AGPLv3:**
   - Verifique se todos os arquivos analisados possuem o cabeçalho de licença livre GNU AGPLv3.