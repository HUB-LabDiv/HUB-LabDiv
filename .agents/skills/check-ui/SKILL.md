---
name: check-ui
description: Valida conformidade visual com Material Design 3 (M3), Identidade LabDiv, Dual-Theme (Claro/Escuro), Mobile-First (375px), Skeletons e Toasts.
---

# WORKFLOW: INSPETOR DE UI — LABDIV IDV + MATERIAL DESIGN 3 (/check-ui)

Inspecione os componentes e páginas alvo contra o checklist rigoroso de UI/UX do HUB LabDiv e corrija qualquer desvio:

1. **Dual-Theme (Modo Escuro & Modo Claro):**
   - Verifique se não existem cores fixas que quebrem o contraste ao alternar entre o Modo Escuro (Base `#121212`, Surfaces `#1E1E1E`) e o Modo Claro.
2. **Material Design 3 (`https://m3.material.io`) + Paleta LabDiv:**
   - Cores semânticas por eixo: Azul `#0F4780` (01 Comunidade), Vermelho `#F14343` (02 Informativo), Amarelo `#FFCC00` (03 Ferramentas).
   - Anatomia M3: cantos arredondados adequados (`rounded-xl` a `rounded-3xl` / `rounded-full`), *State Layers* em hover/press e alvos de toque mínimos de `48x48px`.
3. **Tipografia Oficial:**
   - Títulos/Headlines usando **29LT Bukra Semi Wide Bold**.
   - Corpo, subtítulos, labels e CTAs usando **Open Sans**.
4. **UX & Mobile-First (`375px`):**
   - Verifique se não há *overflow* horizontal ou textos truncados em larguras de `375px`.
   - Confirme a presença obrigatória de **Skeletons** durante carregamentos e **Toasts/Snackbars** para feedback de todas as ações.