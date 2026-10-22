/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

export interface NewsItem {
  id: string;                     // Slug único da notícia
  titulo: string;                 // Título da manchete
  subtitulo?: string;             // Subtítulo ou lide
  data: string;                   // Data da publicação (ex: '30/10/2026')
  resumo: string;                 // Resumo ou primeiros parágrafos
  conteudo?: string;              // Conteúdo completo em texto
  categoria: string;              // 'Pesquisa' | 'Ensino' | 'Extensão' | 'Institucional' | 'Premiação'
  imagem?: string;                // URL da imagem de capa
  linkOficial: string;            // Link permanente no portal do IFUSP
  autor?: string;                 // Autor ou fonte (ex: 'Assessoria de Comunicação IFUSP')
  tags: string[];                 // Palavras-chave
}
