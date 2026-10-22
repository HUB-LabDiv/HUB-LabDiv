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

export type EventType = 
  | 'coloquio'          // Colóquios Gerais e Colóquio Gleb Wataghin
  | 'convite-fisica'    // Ciclo Convite à Física (palestras para graduação e comunidade)
  | 'seminario'         // Seminários departamentais (DFMA, FEP, FNC, Física Estatística, etc.)
  | 'workshop'          // Escolas temáticas, conferências e cursos de extensão
  | 'institucional';    // Sessões solenes, congregação, recepções e efemérides

export interface EventSpeaker {
  nome: string;
  afiliacao?: string;
  titulacao?: string;
  lattes?: string;
}

export interface EventLocation {
  nome: string;                            // Ex: 'Auditório Abrahão de Moraes'
  sala?: string;                           // Ex: 'Edifício Principal, Ala Central'
  formato: 'presencial' | 'hibrido' | 'online';
}

export interface EventLinks {
  oficial: string;                         // Link do portal IFUSP
  transmissao?: string;                   // Link do YouTube / IPTV USP
  anexoPdf?: string;                      // Convite oficial em PDF
  inscricao?: string;                     // Formulário de presença/certificado
}

export interface EventItem {
  id: string;                              // Slug único
  titulo: string;                          // Título da apresentação ou evento
  tipo: EventType;                         // Classificação temática
  data: string;                            // Formato 'DD/MM/YYYY' ou 'YYYY-MM-DD'
  horario?: string;                        // Ex: '16:00'
  dataFim?: string;
  horarioFim?: string;
  local: EventLocation;
  palestrante?: EventSpeaker | null;
  resumo: string;                          // Abstract da palestra / descrição detalhada
  links: EventLinks;
  destaque?: boolean;                      // Se ganha badge especial no carrossel
  tags: string[];                          // ['Física Teórica', 'Astrofísica', etc.]
}
