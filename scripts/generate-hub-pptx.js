/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Script de Geração Automática da Apresentação em PowerPoint (16:9)
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Licença AGPLv3
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

async function buildHubPptx() {
  const pptx = new PptxGenJS();
  pptx.layout = 'LAYOUT_16x9';

  // Branding Palette
  const COLOR_BG = '09090B';
  const COLOR_CARD = '1E1E1E';
  const COLOR_YELLOW = 'FFCC00';
  const COLOR_BLUE = '0F4780';
  const COLOR_BLUE_ACCENT = '38BDF8';
  const COLOR_RED = 'F14343';
  const COLOR_WHITE = 'FFFFFF';
  const COLOR_GRAY = '9CA3AF';

  // Slide 1: Visão Geral & Conceito do HUB LabDiv
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    // Brand accent bar top
    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_YELLOW } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '33.3%', y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_BLUE } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '66.6%', y: 0, w: '33.4%', h: 0.1, fill: { color: COLOR_RED } });

    // Category Badge
    slide.addText('HUB LABDIV • IFUSP | ABERTURA & CONCEITO', {
      x: 0.8, y: 0.5, w: 8.0, h: 0.4,
      fontFace: 'Open Sans', fontSize: 11, bold: true, color: COLOR_YELLOW,
    });

    // Title
    slide.addText('Visão Geral & Conceito do HUB LabDiv', {
      x: 0.8, y: 0.9, w: 8.5, h: 0.8,
      fontFace: '29LT Bukra', fontSize: 26, bold: true, color: COLOR_WHITE,
    });

    // Subtitle
    slide.addText('O Super App de Comunicação Científica para romper os muros da Universidade', {
      x: 0.8, y: 1.7, w: 8.5, h: 0.5,
      fontFace: 'Open Sans', fontSize: 14, bold: true, color: COLOR_YELLOW,
    });

    // Logo Image
    const logoPath = path.join(__dirname, '../public/icone-HUBLabDiv-white.png');
    if (fs.existsSync(logoPath)) {
      slide.addImage({
        path: logoPath,
        x: 9.8, y: 0.8, w: 2.5, h: 2.5,
      });
    }

    // Bullet Cards Grid
    const bullets = [
      'Super App 100% WebApp: Acessível via navegador em qualquer dispositivo, sem necessidade de instalação.',
      'Comunicação Dialógica: Rompe a mera "divulgação passiva" promovendo a co-construção de significado com base em Paulo Freire.',
      'Integração Acadêmica: Une acompanhamento de disciplinas, diário discente (Logs), Wiki e Match Acadêmico.',
      'Código Aberto (AGPLv3): Projeto transparente hospedado no GitHub (JoaoStangorlini/HUB-LabDiv) pronto para ser replicado.'
    ];

    bullets.forEach((bullet, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 0.8 + col * 5.8;
      const by = 2.5 + row * 2.2;
      const cardColor = idx % 3 === 0 ? COLOR_YELLOW : idx % 3 === 1 ? COLOR_BLUE_ACCENT : COLOR_RED;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: by, w: 5.4, h: 1.9,
        fill: { color: COLOR_CARD },
        line: { color: cardColor, width: 1.5 },
      });

      slide.addText(bullet, {
        x: bx + 0.3, y: by + 0.2, w: 4.8, h: 1.5,
        fontFace: 'Open Sans', fontSize: 12, color: COLOR_WHITE,
      });
    });
  }

  // Slide 2: Divisão do HUB em 3 Eixos Principais
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_YELLOW } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '33.3%', y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_BLUE } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '66.6%', y: 0, w: '33.4%', h: 0.1, fill: { color: COLOR_RED } });

    slide.addText('ESTRUTURA DOS 3 EIXOS | HUB LABDIV', {
      x: 0.8, y: 0.5, w: 8.0, h: 0.4,
      fontFace: 'Open Sans', fontSize: 11, bold: true, color: COLOR_YELLOW,
    });

    slide.addText('Divisão do HUB em 3 Eixos Principais', {
      x: 0.8, y: 0.9, w: 11.5, h: 0.8,
      fontFace: '29LT Bukra', fontSize: 26, bold: true, color: COLOR_WHITE,
    });

    const axes = [
      { title: '1. Eixo Comunidade', tag: 'REDE SOCIAL & LOGS', desc: 'Feed de comunicação científica dialógica, quizzes, narração, galeria de Arte e Logs de vivência discente.', color: COLOR_YELLOW },
      { title: '2. Eixo CGIF', tag: 'INFORMAÇÃO & WIKI', desc: 'Wiki institucional centralizada do IFUSP, manuais do curso, oportunidades (PUB/IC), iniciativas e mapa interativo.', color: COLOR_BLUE_ACCENT },
      { title: '3. Eixo Ferramentas', tag: 'ESTUDO & PESQUISA', desc: 'Planejador de grade horária 1h:1h, acompanhamento de trilhas do curso e Match Acadêmico ("Quero uma IC").', color: COLOR_RED }
    ];

    axes.forEach((axis, idx) => {
      const bx = 0.8 + idx * 3.9;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: 2.0, w: 3.6, h: 4.8,
        fill: { color: COLOR_CARD },
        line: { color: axis.color, width: 2 },
      });

      slide.addText(axis.title, {
        x: bx + 0.3, y: 2.3, w: 3.0, h: 0.6,
        fontFace: '29LT Bukra', fontSize: 16, bold: true, color: COLOR_WHITE,
      });

      slide.addText(axis.tag, {
        x: bx + 0.3, y: 3.0, w: 3.0, h: 0.4,
        fontFace: 'Open Sans', fontSize: 10, bold: true, color: axis.color,
      });

      slide.addText(axis.desc, {
        x: bx + 0.3, y: 3.6, w: 3.0, h: 2.8,
        fontFace: 'Open Sans', fontSize: 12, color: COLOR_WHITE,
      });
    });
  }

  // Slide 3: Aba Comunidade: Fluxo, Logs & Arte
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_YELLOW } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '33.3%', y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_BLUE } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '66.6%', y: 0, w: '33.4%', h: 0.1, fill: { color: COLOR_RED } });

    slide.addText('EIXO 1 — COMUNIDADE | HUB LABDIV', {
      x: 0.8, y: 0.5, w: 8.0, h: 0.4,
      fontFace: 'Open Sans', fontSize: 11, bold: true, color: COLOR_YELLOW,
    });

    slide.addText('Aba Comunidade: Fluxo, Logs & Arte', {
      x: 0.8, y: 0.9, w: 11.5, h: 0.8,
      fontFace: '29LT Bukra', fontSize: 26, bold: true, color: COLOR_WHITE,
    });

    const sections = [
      { title: '1. Fluxo', tag: 'COMUNICAÇÃO DIALÓGICA', desc: 'Feed principal onde o conteúdo científico é compartilhado com balões de reflexão (baseados em Paulo Freire), quizzes interativos, modo foco e narração.', color: COLOR_YELLOW },
      { title: '2. Logs', tag: 'VIVÊNCIA DISCENTE', desc: 'Espaço humanizado para diários de vivência acadêmica, trocas cotidianas e desabafos entre alunos com sistema de fios energizados que conectam a comunidade.', color: COLOR_BLUE_ACCENT },
      { title: '3. Arte', tag: 'EXPRESSÃO ARTÍSTICA', desc: 'Galeria autoral de expressão visual, fotográfica e poética integrada à ciência, transformando registros e percepções em manifestações artísticas.', color: COLOR_RED }
    ];

    sections.forEach((sec, idx) => {
      const bx = 0.8 + idx * 3.9;
      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: 2.0, w: 3.6, h: 4.8,
        fill: { color: COLOR_CARD },
        line: { color: sec.color, width: 2 },
      });

      slide.addText(sec.title, {
        x: bx + 0.3, y: 2.3, w: 3.0, h: 0.6,
        fontFace: '29LT Bukra', fontSize: 16, bold: true, color: COLOR_WHITE,
      });

      slide.addText(sec.tag, {
        x: bx + 0.3, y: 3.0, w: 3.0, h: 0.4,
        fontFace: 'Open Sans', fontSize: 10, bold: true, color: sec.color,
      });

      slide.addText(sec.desc, {
        x: bx + 0.3, y: 3.6, w: 3.0, h: 2.8,
        fontFace: 'Open Sans', fontSize: 12, color: COLOR_WHITE,
      });
    });
  }

  // Slide 4: Aba CGIF
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_YELLOW } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '33.3%', y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_BLUE } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '66.6%', y: 0, w: '33.4%', h: 0.1, fill: { color: COLOR_RED } });

    slide.addText('EIXO 2 — CGIF | HUB LABDIV', {
      x: 0.8, y: 0.5, w: 8.0, h: 0.4,
      fontFace: 'Open Sans', fontSize: 11, bold: true, color: COLOR_BLUE_ACCENT,
    });

    slide.addText('Aba CGIF: Acesso à Informação & Wiki Institucional', {
      x: 0.8, y: 0.9, w: 11.5, h: 0.8,
      fontFace: '29LT Bukra', fontSize: 24, bold: true, color: COLOR_WHITE,
    });

    const cgifItems = [
      'Wiki CGIF: Manuais do curso, Projetos Político-Pedagógicos (PPPs), rotas de circulares e protocolos acadêmicos.',
      'Oportunidades & Iniciativas: Catálogo em tempo real de bolsas PUB, Iniciações Científicas, estágios e simpósios.',
      'Espaços & Mapa Interativo: Conexão direta dos laboratórios físicos do IFUSP via leitura de QR Codes.',
      'Influenciadores & Teste de Radiação: Divulgação de criadores do IFUSP e quiz interativo de fixação da Wiki.'
    ];

    cgifItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 0.8 + col * 5.8;
      const by = 2.2 + row * 2.3;
      const cardColor = idx % 3 === 0 ? COLOR_YELLOW : idx % 3 === 1 ? COLOR_BLUE_ACCENT : COLOR_RED;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: by, w: 5.4, h: 2.0,
        fill: { color: COLOR_CARD },
        line: { color: cardColor, width: 1.5 },
      });

      slide.addText(item, {
        x: bx + 0.3, y: by + 0.2, w: 4.8, h: 1.6,
        fontFace: 'Open Sans', fontSize: 12, color: COLOR_WHITE,
      });
    });
  }

  // Slide 5: Aba Ferramentas
  {
    const slide = pptx.addSlide();
    slide.background = { color: COLOR_BG };

    slide.addShape(pptx.shapes.RECTANGLE, { x: 0, y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_YELLOW } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '33.3%', y: 0, w: '33.3%', h: 0.1, fill: { color: COLOR_BLUE } });
    slide.addShape(pptx.shapes.RECTANGLE, { x: '66.6%', y: 0, w: '33.4%', h: 0.1, fill: { color: COLOR_RED } });

    slide.addText('EIXO 3 — FERRAMENTAS | HUB LABDIV', {
      x: 0.8, y: 0.5, w: 8.0, h: 0.4,
      fontFace: 'Open Sans', fontSize: 11, bold: true, color: COLOR_RED,
    });

    slide.addText('Aba Ferramentas: Apoio ao Estudo & Pesquisa', {
      x: 0.8, y: 0.9, w: 11.5, h: 0.8,
      fontFace: '29LT Bukra', fontSize: 24, bold: true, color: COLOR_WHITE,
    });

    const toolItems = [
      'Grade Horária (1h:1h): Planejador semanal de estudos que associa 1 hora de aula a 1 hora de estudo individual.',
      'Trilhas do Curso: Acompanhamento de disciplinas cursadas, pendências e pré-requisitos com sincronização.',
      'Match Acadêmico ("Quero uma IC"): Aproximação entre cartas de interesse de alunos e linhas de pesquisa do IFUSP.',
      'Como Ingressar & Observatório: Guia para vestibulandos, apoio à permanência e arena dos pesquisadores.'
    ];

    toolItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const bx = 0.8 + col * 5.8;
      const by = 2.2 + row * 2.3;
      const cardColor = idx % 3 === 0 ? COLOR_YELLOW : idx % 3 === 1 ? COLOR_BLUE_ACCENT : COLOR_RED;

      slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
        x: bx, y: by, w: 5.4, h: 2.0,
        fill: { color: COLOR_CARD },
        line: { color: cardColor, width: 1.5 },
      });

      slide.addText(item, {
        x: bx + 0.3, y: by + 0.2, w: 4.8, h: 1.6,
        fontFace: 'Open Sans', fontSize: 12, color: COLOR_WHITE,
      });
    });
  }

  const outputPath = path.join(__dirname, '../public/Apresentação - HUB LabDiv.pptx');
  await pptx.writeFile({ fileName: outputPath });
  console.log(`PPTX criado com sucesso em: ${outputPath}`);
}

buildHubPptx().catch((err) => {
  console.error('Erro ao gerar PPTX:', err);
});
