---
description: Executa checagem rápida de build e sincroniza as alterações exclusivamente com o repositório de testes.
---

# WORKFLOW: ATUALIZAÇÃO RÁPIDA DE TESTES (/att-teste)

Este fluxo é restrito à homologação rápida, enviando código **apenas** para o repositório de testes: `https://github.com/HUB-LabDiv/HUB-LabDiv-TESTES-`.

## PASSO 1: Validação de Build Local
1. Rode uma verificação rápida de compilação (`npm run build` ou `npx tsc --noEmit`) para garantir que o código não quebrou a tipagem ou a Vercel.

## PASSO 2: Verificação de Segurança
1. Certifique-se de que nenhum segredo (`.env`, `keystore`) está sendo adicionado.

## PASSO 3: Commit e Push Exclusivo para Testes
1. Crie um commit descritivo com as alterações atuais (ex: `test: quick fix for staging evaluation`).
2. Envie as alterações **apenas** para o remote/repositório de testes (`HUB-LabDiv-TESTES-`).
3. Avise o usuário que o ambiente de testes foi atualizado com sucesso.