# 🌌 Hub de Comunicação Científica — Lab-Div (IF-USP)

> **Aviso para a comunidade desenvolvedores com interesse no HUB, favor respeitar as regras e entender o projeto antes de contribuir. Em caso de dúvidas, pergunte e por favorrr leia tudo antes de codar, boa sorte e ansioso para suas contribuições :).**

O **Hub Lab-Div** é uma plataforma digital que foi desenvolvida como um webapp/app para ser/tentar ser o coração da comunicação científica do **Instituto de Física da Universidade de São Paulo (IFUSP)**. Projetado para conectar a pesquisa científica de fronteira, a vivência universitária e a sociedade, o Hub reúne uma rede social que visa possibilitar uma verdadeira comunicação cientifica dialógica, ferramentas para auxilio dos acadêmicos e por fim reunir todo tipo de informação util sobre o ambiente universitario que atualmente se encontra espalhada por toda a internet em editais/sites/portais/projetos...

Distribuído sob a licença livre **GNU Affero General Public License v3.0 (AGPLv3)**.

---

## 🎯 Por Que Esse Hub Existe?

Historicamente, o IFUSP produz um acervo riquíssimo de dados, imagens de experimentos, apostilas,contando com equipamentos de ponta (como o Acelerador Pelletron, o tokamak e muitos outros) que resultam em pesquisas científicas de impacto global. No entanto, grande parte desse patrimônio é ou permanecia dispersa em pastas inacessíveis ou confinada aos laboratórios.

O Hub Lab-Div foi concebido para resolver três missões centrais:
1. **Preservar a Memória & Acervo:** Digitalizar, categorizar e eternizar registros históricos, fotografias e documentações técnicas do instituto.
2. **Potencializar a Vida Acadêmica:** Centralizar a grade horária (sincronizada com o JúpiterWeb), trilhas de formação, catálogo de softwares científicos, editais e manuais curriculares na Wiki central.
3. **Democratizar a Ciência Pública:** Traduzir a complexidade do laboratório em narrativas didáticas para estudantes da educação básica, comunidade uspiana e o público geral.

---

## 🏛️ Os 3 Eixos da Plataforma

O ecossistema é estruturado em torno de três eixos temáticos com identidade visual própria (Material Design 3 + Cores Oficiais LabDiv):

- 🔵 **Eixo 01 — Social & Comunidade (`#0F4780`):** Feed vivo da comunidade universitária com publicações em **Fluxo** (mídias didáticas), **Logs** (relatos rápidos) e **Arte Científica**; central de interações com o chat em tempo real **Emaranhamento Quântico** e o canal tira-dúvidas **Pergunte a um Cientista**.
- 🔴 **Eixo 02 — Informativo & Dados (`#F14343`):** Central de Graduação (GCIF), editais, Wiki do IFUSP, mural de oportunidades para alunos e pesquisadores, colóquios, criadores de conteúdo e o **Grande Colisor de Ideias**.
- 🟡 **Eixo 03 — Ferramentas & Destaques (`#FFCC00`):** Simulador de Grade Horária 1h:1h com controle de faltas e exportação para PDF/Júpiter, Catálogo de Softwares Científicos, Match Acadêmico de Grupos de Estudo e a **Arena de Desafios Científicos**.

---

## 🛠️ Guia de Manutenção e Arquitetura

O projeto adota uma arquitetura monorepo moderna, com foco em tipagem estrita, performance de borda e paridade entre Web e Mobile:

- **Frontend Web:** Next.js 16+ (App Router, React Server Components como padrão, Client Components isolados nas folhas).
- **Design System:** Híbrido LabDiv IDV + Google Material Design 3 (M3), com Tailwind CSS v4, suporte estrito a **Dual-Theme** (Claro e Escuro `#121212`) e ergonomia tátil mínima de `48x48px` em dispositivos móveis (`375px`).
- **Backend & Banco de Dados:** Supabase (PostgreSQL 15+) com Row Level Security (RLS) habilitado em todas as tabelas e Storage Buckets.
- **App Android:** Capacitor v8 (arquitetura híbrida Thin Client conectada à Vercel e suporte a notificações push nativas e DayNight Theme).
- **Pipelines de Dados:** Scrapers em Python/TypeScript para sincronização periódica de disciplinas, docentes e colóquios via GitHub Actions.

### Comandos Essenciais

```bash
# 1. Instalar dependências
npm install

# 2. Executar servidor de desenvolvimento local
npm run dev

# 3. Validar tipagem TypeScript estrita (deve sempre compilar com 0 erros)
npx tsc --noEmit

# 4. Executar pipeline de scrapers e auditoria do JúpiterWeb/IFUSP
npm run scraper:pipeline
npm run scraper:audit

# 5. Build de produção
npm run build
```

### Regra de Ouro das Migrations SQL

Todas as novas migrações de banco de dados devem residir **obrigatoriamente** em:
```
supabase/migrations/newsqls/
```
Cada arquivo de migração é consolidado continuamente até atingir a trava estrita de **700 linhas**. Ao atingir esse limite, um novo arquivo sequencial (ex.: `god-sql-mk11.sql`) deve ser inaugurado, garantindo rastreabilidade e histórico limpo.
Para o caso de uma contribuição publica da comunidade, favor deixar em um arquivo separado na pasta supabase/migrations/newsqls/ com um nome que faça sentido (ex.: [DATA_EVENTO]-community-contribution.sql) e que não conflite com as migrações existentes.

---

## 🔒 Governança de Dados: O Que é Público vs. O Que é Privado

Em conformidade com a **Lei Geral de Proteção de Dados (LGPD)** e boas práticas de segurança defensiva:

### 🌐 Conteúdo Público (Acesso Livre)
- Acervo científico aprovado pela moderação (fotos, PDFs, artigos e vídeos).
- Verbetes e manuais da Wiki Central e do GCIF.
- Oportunidades acadêmicas e editais já homologados.
- Perguntas públicas aprovadas do *Pergunte a um Cientista*.
- Grafo de conhecimento e constelação semântica de tópicos da Física.

### 🔐 Conteúdo Privado e Protegido (Restrito)
- **Torre de Controle (`/admin`):** Painel administrativo centralizado com autenticação blindada (`requireAdminOrModerator`) e auditoria de ações de moderação.
- **Verificação Docente & Comprovantes:** Uploads de holerites/comprovantes docentes residem em bucket criptografado e são **deletados de forma definitiva e imediata** assim que a análise for concluída, mantendo no banco apenas metadados de auditoria.
- **Fila de Moderação:** Todo conteúdo gerado por usuários (novas submissões, edições de perfil, oportunidades, comentários e denúncias) cai em uma fila unificada isolada até decisão humana.
- **Segredos e Credenciais:** Variáveis de ambiente (`.env.local`), chaves de serviço do Supabase, senhas de aplicação SMTP e keystores Android (`.keystore` / `.jks`) jamais são expostas em commits ou logs públicos.

---

## 🤖 Declaração de Transparência sobre o Uso de IA Assistida

O ecossistema do Hub Lab-Div reúne uma densidade funcional extraordinária: aplicação web progressiva, aplicativo Android nativo, inteligência na detecção docente, três eixos com dezenas de utilitários, monitoramento automático de SLAs por e-mail e integração contínua com sistemas legados da universidade.

Para viabilizar o lançamento a tempo e garantir a entrega de uma plataforma dessa envergadura para o IFUSP, **ferramentas de inteligência artificial generativa foram empregadas ativamente como forma de ampliar a capacidade técnica e produtividade da equipe de desenvolvimento do HUB LabDiv**.

No entanto, **não há geração cega de código:**
- Cada linha de lógica de negócios, política RLS no banco de dados, componente de interface e rota de API foi **arquitetada, inspecionada, testada e validada manualmente** por desenvolvedores humanos.
- A IA operou como copiloto de implementação sob regras rígidas de engenharia; o discernimento técnico, a revisão de segurança e a coerência científica são inteiramente humanos.

---

## 🚫 Política de Tolerância Zero ao "Slop de IA" (Anti-Slop Policy)

Apoiamos o uso de inteligência artificial como acelerador do desenvolvimento e seu papel em tornar esse projeto viavel é inegavel. No entanto, **rejeitamos veementemente o "slop de IA"** — código descuidado, sem contexto e gerado sem supervisão. 

Pull Requests e solicitações que apresentem qualquer um dos comportamentos abaixo serão **rejeitados sumariamente sem revisão adicional**:

1. ❌ **Código Sem Anotações e Contexto:** Arquivos novos ou funções alteradas sem comentários claros explicando **o que o código faz, por que faz e qual problema resolve**.
2. ❌ **Código Não Testado:** PRs que não passem no `npx tsc --noEmit` ou que apresentem quebras em tempo de execução no navegador/app.
3. ❌ **Código Sem Sentido Arquitetural:** Injeção de pacotes desnecessários, reescrita descontextualizada de componentes existentes, violações do App Router do Next.js (como uso indevido de `useEffect` para busca de dados) ou fuga dos padrões Material Design 3 do Hub.
4. ❌ **Alucinações de Banco de Dados:** Migrations que não respeitem integridade referencial, que criem tabelas sem RLS ou que violem a convenção de migrations do repositório.

Se você utilizar IA para auxiliar na sua contribuição, **assuma a responsabilidade pelo que gerou**: revise cada linha, teste localmente e documente o propósito técnico.

---

## 🌟 Contribuições, Reconhecimento & Roadmap de Gamificação (XP)

Acreditamos na construção comunitária do conhecimento e valorizamos cada pessoa que dedica seu tempo para melhorar a plataforma do IFUSP.

### Como Tratamos as Solicitações (Issues e PRs)
- Todas as solicitações são analisadas individualmente pela equipe do Lab-Div.
- Sugestões pedagógicas e correções de bugs têm prioridade alta.
- Alterações em regras de negócio ou de segurança passam por double-check antes de qualquer merge na branch `main`.

### Reconhecimento Público
- **Mural de Contribuidores:** Todo desenvolvedor, designer ou cientista que tiver um PR aceito terá seu nome, perfil e contribuição divulgados publicamente na documentação e na seção de créditos do Hub.

### 🎮 Roadmap Futuro: Sistema de XP e Rankings
Para engajar ainda mais a comunidade acadêmica e de desenvolvedores, lançaremos no futuro:
- **Sistema de Reputação & XP:** Pontuação dinâmica atribuída a membros da comunidade por:
  - Submissão de materiais científicos aprovados no Acervo.
  - Revisão comunitária de conteúdos e reporte assertivo de inconsistências.
  - Contribuições aceitas no repositório de código aberto.
  - Respostas didáticas a dúvidas no *Pergunte a um Cientista*.
- **Rankings Gamificados:** Destaques periódicos no perfil de usuários (Átomo de Ouro, Guardião do Acervo, Mantenedor do Hub), valorizando publicamente quem constrói a divulgação científica da universidade.

---

## 📜 Licença

Este projeto é software livre, distribuído sob os termos da licença **GNU Affero General Public License v3.0 (AGPLv3)**.

Para ler a íntegra dos termos e condições, consulte o arquivo [LICENSE](./LICENSE).

---

*Hub de Comunicação Científica Lab-Div — Instituto de Física da Universidade de São Paulo (IFUSP).*
