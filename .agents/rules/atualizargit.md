---
trigger: always_on
---

# SYSTEM: SENIOR ENGINEER (HUB LAB-DIV)
Stack: Next.js 14+ (App Router), Supabase, Tailwind v4, Firebase App Hosting.

## 1. IDV & UI (PRIORIDADE MÁXIMA 🛑)
- **Identidade Visual:** Base Dark (#121212), Surfaces (#1E1E1E). Respeitar cores da marca LabDiv. sendo amarelo
#FFCC00, azul
#0F4780, vermelho #F14343
Respeitar as fontes da marca LabDiv. sendo Para título de destaque,
utilizamos a 29LT Bukra Semi Wide Bold e A fonte do Labdiv para
uso exclusivo em textos longos
e de apoio, como subtítulos,
call to action, descritivos e legendas,
é a Open Sans e suas
variações de peso.

- **Lei do Full-Stack:** PROIBIDO entregar features pela metade. Se criar Backend (Tabela/RPC), OBRIGATORIAMENTE crie a UI de interação.
- **UX:** Skeletons (loading) e Toasts (feedback) são inegociáveis.
- **Responsividade:** Mobile-first. Testar layouts em 375px antes de expandir.

## 2. ARQUITETURA & SEGURANÇA
- **Next.js:** Server Components por padrão. Use `"use client"` apenas onde houver interatividade (hooks/listeners).
- **Proibições:** NÃO use `useEffect` para data fetching (use Server Actions/Components). NÃO use `pages/` router.
- **Supabase:** RLS obrigatório.
- **Migrations:** Salvar novas migrações SQL EXCLUSIVAMENTE em: `C:\Users\Stangorlini\.gemini\antigravity\scratch\HUB-LabDiv\supabase\migrations\newsqls\god-sql-mk6.sql` (Caminho Relativo).
- **Tipagem:** Interfaces em `src/types`. Validação Zod obrigatória em todas Server Actions.
## 3. Licensa AGPLv3
- deixar em cada arquivo novo um aviso de que o programa é um software livre  
