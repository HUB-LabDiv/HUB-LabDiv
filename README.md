# 🌌 Hub de Comunicação Científica - Lab-Div (IF-USP)

> Da gaveta do laboratório para a palma da mão da sociedade. Onde o arquivo morto ganha vida.

O **Hub Lab-Div** não é apenas uma plataforma; é o novo sistema nervoso da comunicação científica do Instituto de Física da USP. Nascido da vontade de conectar a excelente pesquisa feira nos laboratórios com estudantes, pesquisadores e a esfera pública, o projeto centraliza, moderniza e distribui o conhecimento de forma viva e interativa.

---

## 🎯 Por Que Esse Hub Existe?
Atualmente, o Instituto de Física produz materiais visuais incríveis (fotos de instrumentos de ponta, experimentos, apostilas e registros históricos), mas eles estavam dispersos ou inacessíveis. 

Nós criamos o Hub para responder a uma simples pergunta: **"O que acontece de tão fascinante dentro do IF que nós não conseguimos ver?"**

A resposta é este ecossistema. Ele foi desenhado para:
- **Resgatar a Memória:** Preservar fotografias, vídeos e catálogos que contam a história das pesquisas.
- **Acelerar Pesquisas:** Ser uma biblioteca de referência rápida para estudantes que precisam de assets (recursos visuais) corretos e de alta qualidade para seus TCCs, mestrados e teses.
- **Democratizar a Ciência:** Transformar a "Caixa Preta" de um equipamento complexo em algo compreensível para toda a sociedade por meio da divulgação.

---

## ✨ O Que Você Encontra Aqui?

O Hub foi pensado para te dar o controle e a descoberta:

1. **Galeria Orbital (Descoberta)**
   Esqueça as pastas confusas de Drive. Nosso principal catálogo é uma linha do tempo envolvente onde você pode filtrar arquivos por:
   - Formato (Fotos, Vídeos, PDFs).
   - Ano de publicacao  
   - Categoria

2. **Seu Laboratório Pessoal (Engajamento)**
   O Hub não é passivo, é a sua ferramenta. 
   - Salve suas imagens favoritas para baixar depois numa pasta "Coleção Privada".
   - Deixe o seu *átomo* (Curtida) nos materiais que foram úteis. O algoritmo usará isso para mostrar aos próximos alunos os melhores arquivos primeiro!

3. **Submissão Colaborativa (O Futuro)**
   Nós construímos estradas, mas são vocês que trazem a carga. Seja você um monitor da Pós, um pesquisador titular, ou um aluno da graduação com uma bela foto do Acelerador Linear (Pelletron) ao pôr do sol, **você pode lançar os seus achados à órbita.** A Moderação garante o rigor científico, mas a autoria é 100% sua, acumulando *Pontos de Reputação (XP)* na plataforma.

## 🚀 Arquitetura Técnica (Monorepo)

O Hub Lab-Div foi construído utilizando tecnologias modernas visando performance, facilidade de manutenção e integração fluida entre as plataformas Web e Mobile.

**Stack Principal:**
- **Framework:** Next.js 14+ (App Router, Server Components).
- **Estilização:** Tailwind CSS v4.0.
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL com Row Level Security - RLS).
- **Mobile:** Capacitor v6 (Wrapper nativo).

### Como o App Mobile Funciona
Atualmente, o projeto utiliza uma arquitetura híbrida (Thin Client). O aplicativo Android (na pasta `android/`) é uma "casca" gerada pelo **Capacitor**, que aponta diretamente para o domínio hospedado na Vercel (via `capacitor.config.ts`).
Isso significa que:
1. Nenhuma alteração no código Web (React/Next.js) precisa ser recompilada no Android Studio para refletir no aplicativo.
2. Basta enviar o código para o GitHub (Push), a Vercel atualiza, e o aplicativo no celular é atualizado em tempo real.

---

## 🛠️ Como Executar o Projeto

### 1. Rodando a Aplicação Web (Localmente)
Para rodar o ambiente de desenvolvimento Next.js no seu computador:
```bash
# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev
```
O projeto estará disponível em `http://localhost:3000`.

### 2. Rodando o Aplicativo Android
Se você precisar alterar ícones, configurações nativas ou gerar um novo APK:
1. Abra a pasta `android/` no **Android Studio**.
2. Sincronize o Gradle.
3. Clique no botão "Play" verde para emular ou construir o APK.
*(Nota: O APK final será gerado na pasta `android/app/build/outputs/apk/debug/HUB-LabDiv-debug.apk`)*

---

## 📜 Licença

Este projeto é licenciado sob a **GNU Affero General Public License v3.0 (AGPLv3)**.

Você é livre para usar, modificar e distribuir este software. No entanto, qualquer versão modificada (mesmo que seja oferecida apenas como um serviço na rede) deve disponibilizar o código-fonte sob a mesma licença.

Para mais detalhes, consulte o arquivo [LICENSE](./LICENSE) fornecido com este repositório.
