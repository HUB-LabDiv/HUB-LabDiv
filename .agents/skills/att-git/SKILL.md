---
name: att-git
description: Atualiza versão, roda build de teste (Vercel/Android), atualiza PATCHNOTES, faz commit seguro e sincroniza os 3 repositórios (Testes, Principal da Organização e Perfil Pessoal de João Stangorlini).
---

# WORKFLOW: ATUALIZAÇÃO SEGURA & BUILD VERIFICATION (/att-git)

Execute os passos abaixo rigorosamente na ordem para atualizar a versão do app, testar a compilação e sincronizar os 3 repositórios:
- **1. Repositório de Testes:** `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-` (remote `testes`)
- **2. Repositório Principal (Organização):** `https://github.com/HUB-LabDiv/HUB-LabDiv` (remote `principal`)
- **3. Repositório Pessoal (Clone / João Stangorlini):** `https://github.com/JoaoStangorlini/HUB-LabDiv` (remote `pessoal`)

> **Nota:** O remote `origin` está configurado com múltiplos push URLs para sincronizar simultaneamente os 3 repositórios com um único comando (`git push origin <branch>`).

---

## PASSO 1: Atualização de Versão
1. Pergunte ao usuário qual é a **nova versão** semântica (ex: `3.0.1` ou `v3.1.0`) e o número de build do Android (`versionCode`, ex: `30`, `31`).
2. Atualize os arquivos de versão do projeto:
   - `package.json` (`version`)
   - `capacitor.config.ts` (se aplicável)
   - `android/app/build.gradle` (`versionName` e `versionCode`)

---

## PASSO 2: Auditoria de Segurança & Compilação (Build Test)
1. Execute `git status` e `git diff --stat` para listar as alterações.
2. **Trava de Segurança:** Confirme que nenhum arquivo sensível ou temporário (`.env*`, `*.keystore`, `*.jks`, `tmp/`) está no stage ou versionado.
3. **Teste de Build Web (Vercel):**
   - Execute no terminal: `npm run build`
   - Se houver qualquer erro de TypeScript ou falha de compilação do Next.js, interrompa o processo imediatamente e reporte ao usuário para correção.
4. **Teste de Build Android (Play Console):**
   - Execute a verificação ou sincronização do Gradle (ex: `npx cap sync android` ou build de validação) para garantir que o projeto compila sem erros nativos.

---

## PASSO 3: Patchnotes e Commit Semântico
1. Pergunte ao usuário se deseja registrar as mudanças no `PATCHNOTES.md`.
2. Crie um commit claro e estruturado seguindo Conventional Commits (ex: `chore(release): v3.0.1 - update build and mobile configs`).

---

## PASSO 4: Push Sincronizado nos 3 Remotes
1. Verifique os remotes com `git remote -v`.
   - Confirme que os remotes `origin`, `testes`, `principal` e `pessoal` estão presentes e apontando para os 3 destinos:
     - `testes` -> `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-.git`
     - `principal` -> `https://github.com/HUB-LabDiv/HUB-LabDiv.git`
     - `pessoal` -> `https://github.com/JoaoStangorlini/HUB-LabDiv.git`
2. Execute o push sincronizado:
   - **Opção A (Múltiplo automático via `origin`):**
     ```bash
     git push origin <branch> --tags
     ```
     *(O remote `origin` já envia simultaneamente para os 3 repositórios: Testes, Principal da Org e Pessoal).*
   - **Opção B (Push explícito nos 3 remotes individuais):**
     ```bash
     git push testes <branch> --tags
     git push principal <branch> --tags
     git push pessoal <branch> --tags
     ```
3. Exiba o resumo da conclusão com os links diretos para conferência:
   - [HUB-LabDiv-TESTES- (Testes)](https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-)
   - [HUB-LabDiv (Organização LabDiv)](https://github.com/HUB-LabDiv/HUB-LabDiv)
   - [HUB-LabDiv (Perfil Pessoal - JoaoStangorlini)](https://github.com/JoaoStangorlini/HUB-LabDiv)
