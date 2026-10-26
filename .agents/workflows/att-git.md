---
description: Atualiza versão, roda build de teste (Vercel/Android), atualiza PATCHNOTES, faz commit seguro e sincroniza os repositórios de Teste e Produção.
---

# WORKFLOW: ATUALIZAÇÃO SEGURA & BUILD VERIFICATION (/att-git)

Execute os passos abaixo rigorosamente na ordem para atualizar a versão do app, testar a compilação e sincronizar os repositórios:
- **Repositório de Testes:** `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-`
- **Repositório Principal:** `https://github.com/HUB-LabDiv/HUB-LabDiv`

## PASSO 1: Atualização de Versão
1. Pergunte ao usuário qual é a **nova versão** semântica (ex: `3.0.1` ou `v3.1.0`) e o número de build do Android (`versionCode`, ex: `30`, `31`).
2. Atualize os arquivos de versão do projeto:
   - `package.json` (`version`)
   - `capacitor.config.ts` (se aplicável)
   - `android/app/build.gradle` (`versionName` e `versionCode`)

## PASSO 2: Auditoria de Segurança & Compilação (Build Test)
1. Execute `git status` e `git diff --stat` para listar as alterações.
2. **Trava de Segurança:** Confirme que nenhum arquivo sensível ou temporário (`.env*`, `*.keystore`, `*.jks`, `tmp/`) está no stage.
3. **Teste de Build Web (Vercel):**
   - Execute no terminal: `npm run build`
   - Se houver qualquer erro de TypeScript ou falha de compilação do Next.js, interrompa o processo imediatamente e reporte ao usuário para correção.
4. **Teste de Build Android (Play Console):**
   - Execute a verificação ou sincronização do Gradle (ex: `npx cap sync android` ou build de validação) para garantir que o projeto compila sem erros nativos.

## PASSO 3: Patchnotes e Commit Semântico
1. Pergunte ao usuário se deseja registrar as mudanças no `PATCHNOTES.md`.
2. Crie um commit claro e estruturado (ex: `chore(release): v3.0.1 - update build and mobile configs`).

## PASSO 4: Push Sincronizado nos Remotes
1. Verifique os remotes com `git remote -v`.
2. Faça o push para o repositório de testes: `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-`.
3. Faça o push para o repositório principal: `https://github.com/HUB-LabDiv/HUB-LabDiv`.
4. Exiba o resumo da conclusão com sucesso.# WORKFLOW: ATUALIZAÇÃO SEGURA & BUILD VERIFICATION (/att-git)

Execute os passos abaixo rigorosamente na ordem para atualizar a versão do app, testar a compilação e sincronizar os repositórios:
- **Repositório de Testes:** `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-`
- **Repositório Principal:** `https://github.com/HUB-LabDiv/HUB-LabDiv`

## PASSO 1: Atualização de Versão
1. Pergunte ao usuário qual é a **nova versão** semântica (ex: `3.0.1` ou `v3.1.0`) e o número de build do Android (`versionCode`, ex: `30`, `31`).
2. Atualize os arquivos de versão do projeto:
   - `package.json` (`version`)
   - `capacitor.config.ts` (se aplicável)
   - `android/app/build.gradle` (`versionName` e `versionCode`)

## PASSO 2: Auditoria de Segurança & Compilação (Build Test)
1. Execute `git status` e `git diff --stat` para listar as alterações.
2. **Trava de Segurança:** Confirme que nenhum arquivo sensível ou temporário (`.env*`, `*.keystore`, `*.jks`, `tmp/`) está no stage.
3. **Teste de Build Web (Vercel):**
   - Execute no terminal: `npm run build`
   - Se houver qualquer erro de TypeScript ou falha de compilação do Next.js, interrompa o processo imediatamente e reporte ao usuário para correção.
4. **Teste de Build Android (Play Console):**
   - Execute a verificação ou sincronização do Gradle (ex: `npx cap sync android` ou build de validação) para garantir que o projeto compila sem erros nativos.

## PASSO 3: Patchnotes e Commit Semântico
1. Pergunte ao usuário se deseja registrar as mudanças no `PATCHNOTES.md`.
2. Crie um commit claro e estruturado (ex: `chore(release): v3.0.1 - update build and mobile configs`).

## PASSO 4: Push Sincronizado nos Remotes
1. Verifique os remotes com `git remote -v`.
2. Faça o push para o repositório de testes: `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-`.
3. Faça o push para o repositório principal: `https://github.com/HUB-LabDiv/HUB-LabDiv`.
4. Exiba o resumo da conclusão com sucesso.