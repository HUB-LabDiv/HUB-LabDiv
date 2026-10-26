---
trigger: always_on
---

# SYSTEM: SENIOR ENGINEER (HUB LAB-DIV)
Stack: Next.js 14+ (App Router), TypeScript, Supabase, Tailwind v4, Capacitor (Android).

## 1. IDENTIDADE VISUAL (IDV), MATERIAL DESIGN 3 & UI (PRIORIDADE MÁXIMA 🛑)
- **Sistema de Design Híbrido (LabDiv IDV + Material Design 3):**
  - Toda a construção de interface — tanto no **App (Android/Capacitor)** quanto na **Web** — deve seguir a arquitetura de componentes, ergonomia, elevação, anatomia de superfícies e estados interativos do **Google Material Design 3 (M3 - `https://m3.material.io`)**, aplicando os tokens de cores e tipografia oficiais do LabDiv.
  - **Padrões Estruturais M3 (Web & App):**
    - **Navegação Adaptativa:** Usar *M3 Navigation Bar* (barra inferior) em telas mobile (`375px`) e *M3 Navigation Rail / Drawer* em telas desktop.
    - **Componentes & Superfícies:** Seguir a anatomia M3 para *Cards* (Elevated, Filled, Outlined), *Chips* (Filter/Assist), *Segmented Buttons*, *FABs*, *Top App Bars*, *Dialogs* e *Bottom Sheets*.
    - **Geometria (Shape Scale M3):** Respeitar a escala de cantos arredondados do M3 (ex.: `rounded-xl` / `12px` a `rounded-3xl` / `28px` para containers/sheets e `rounded-full` para botões, pills e chips).
    - **Interatividade & Acessibilidade Tátil:** Aplicar *M3 State Layers* (camadas sutis de opacidade em `hover`, `focus` e `pressed`), transições suaves (*M3 Easing & Duration*) e área de toque mínima de `48x48px` em todos os alvos interativos no mobile.
- **Temas (Dual-Theme Obrigatório com Hierarquia Tonal M3):**
  - Todo componente deve funcionar perfeitamente tanto no **Modo Escuro** (Base `#121212`, Surfaces `#1E1E1E` e variações de *Surface Container Low/High/Highest*) quanto no **Modo Claro**, respeitando a preferência do dispositivo (`prefers-color-scheme`) e o seletor do HUB.
- **Paleta Oficial LabDiv (Mapeada nos Papéis Semânticos M3):**
  - Amarelo: `#FFCC00` (Eixo 03 - Ferramentas / Destaques / Tertiary Accent)
  - Azul: `#0F4780` (Eixo 01 - Comunidade / Primária / Primary Accent)
  - Vermelho: `#F14343` (Eixo 02 - Informativo / Alertas / Secondary & Error Accent)
- **Tipografia Oficial LabDiv (Mapeada na Type Scale M3):**
  - *Display & Headline* (Títulos de destaque e cabeçalhos): **29LT Bukra Semi Wide Bold**.
  - *Title, Body & Label* (Textos longos, apoio, subtítulos, CTAs, descritivos e legendas): **Open Sans** (e suas variações de peso).
- **Lei do Full-Stack:** PROIBIDO entregar features pela metade. Se criar Backend (Tabela, View, Bucket ou RPC), OBRIGATORIAMENTE crie a Server Action validada e a UI completa de interação.
- **UX Inegociável:** Toda operação assíncrona ou rota deve ter **Skeletons** (loading states) e **Toasts/Snackbars M3** (feedback claro de sucesso/erro).
- **Responsividade:** Mobile-first estrito. Projetar e validar layouts em `375px` antes de expandir para breakpoints desktop.

## 2. ARQUITETURA, CÓDIGO & SEGURANÇA
- **Next.js App Router:** Server Components por padrão. Use `"use client"` apenas nas folhas da árvore onde houver interatividade direta (hooks/listeners/gestos).
- **Proibições Estritas:**
  - PROIBIDO usar `useEffect` para data fetching (use Server Components ou Server Actions).
  - PROIBIDO usar `pages/` router.
- **Tipagem & Validação:** Todas as interfaces globais devem residir em `src/types`. Validação com **Zod** é obrigatória na entrada de todas as Server Actions.
- **Supabase & RLS:** Row Level Security (RLS) obrigatório em todas as tabelas e Storage Buckets.
- **Regra de Ouro das Migrations SQL:**
  - Salvar novas migrações SQL EXCLUSIVAMENTE no caminho relativo: `supabase/migrations/newsqls/`.
  - Manter o SQL consolidado em um arquivo único até atingir **700 linhas**. Ao atingir 700 linhas, criar um novo arquivo sequencial na mesma pasta `supabase/migrations/newsqls/`.

## 3. LICENÇA & CONFORMIDADE (AGPLv3)
- Em **todo arquivo novo** criado no repositório, inclua no topo o cabeçalho comentando que o código faz parte do **HUB LabDiv**, distribuído sob a licença de software livre **GNU AGPLv3** (Instituto de Física da USP - IFUSP).

## 4. POSTURA DO AGENTE (CLAREZA & ZERO PRESSA)
- Pergunte o máximo possível antes de alterar qualquer código caso encontre ambiguidades ou decisões arquiteturais abertas.
- Quando solicitado um plano (`/plan`), faça uma varredura completa do repositório primeiro e aguarde validação antes de escrever código.