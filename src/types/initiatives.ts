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

export type InitiativeCategory = 
  | 'divulgacao'   // Divulgação científica e palestras públicas
  | 'escolar'      // Interação com escolas, olimpíadas e visitas
  | 'maker'        // Fabricação digital, tecnologia aberta e hardware
  | 'inclusao'     // Coletivos, ações afirmativas e permanência
  | 'academica';   // Cursos de difusão, escolas de verão e workshops

export type InitiativeVisualTheme = 
  | 'default'
  | 'labdiv'
  | 'show-da-fisica'
  | 'hackerspace';

export interface InitiativeContact {
  email?: string;
  website?: string;
  instagram?: string;
  youtube?: string;
  localizacao?: string; // Ex: "Edifício Principal, Ala Central, Sala 102"
}

export interface InitiativeLinks {
  interno?: string;       // Rota relativa no Next.js (ex: "/iniciativas/labdiv")
  oficial?: string;       // URL externa no portal da USP/IFUSP
  formulario?: string;    // Formulário de agendamento ou inscrição
}

export interface Initiative {
  id: string;                      // Slug único (ex: "show-da-fisica", "fisica-para-todos")
  nome: string;                    // Nome oficial da iniciativa
  sigla?: string;                  // Sigla institucional (ex: "LD", "GMF", "CCEx")
  categoria: InitiativeCategory;   // Categoria temática principal
  resumo: string;                  // Descrição curta (1-2 frases para cards da grade)
  descricao: string;               // Descrição detalhada da iniciativa e histórico
  publicoAlvo: string;             // Ex: "Escolas públicas", "Comunidade externa", "Graduandos"
  coordenacao?: string;            // Docente responsável ou liderança discente
  comoParticipar?: string;         // Orientações sobre monitoria, voluntariado ou ingresso
  modalidadeBolsa?: string[];      // Bolsas vinculadas (ex: ["PUB", "AEx", "Voluntariado"])
  temaVisual?: InitiativeVisualTheme; // Identidade visual para estilização de cards
  contatos: InitiativeContact;     // Canais de comunicação e localização
  links: InitiativeLinks;          // Rotas internas e links externos
  destaque: boolean;               // Exibir em posição privilegiada no carrossel
  tags: string[];                  // Termos de indexação para busca global
}
