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

export type SpaceCategory = 
  | 'estudo-biblioteca'    // Biblioteca BIFUSP, salões de estudo, salas de leitura
  | 'auditorio'            // Abrahão de Moraes, Adma Jafet, Occhialini, Wataghin, etc.
  | 'maker-convivencia'    // Hackerspace, CEFISMA, Aquário, PROFIS, LabDiv
  | 'oficina-tecnica'      // Oficina Mecânica de Precisão, Vidraria, Instrumentação
  | 'servico-alimentacao'  // Restaurante Universitário, Lanchonete, Cafeteria
  | 'laboratorio-pesquisa'; // Acelerador Pelletron (LAFN), Laboratórios Didáticos

export interface SpaceContact {
  email?: string;
  telefone?: string;
  ramal?: string;
  responsavel?: string;
}

export interface SpaceLinks {
  oficial?: string;        // Página oficial no portal do IFUSP
  agendamento?: string;    // Sistema agenda.if.usp.br ou formulário
  mapaUrl?: string;        // Ponto no mapa ou fotos
}

export interface SpaceItem {
  id: string;              // Slug único (ex: 'biblioteca-bifusp', 'auditorio-abrahao-de-moraes')
  nome: string;            // Nome completo do espaço
  sigla?: string;          // Ex: 'BIFUSP', 'CEFISMA', 'OMP'
  categoria: SpaceCategory;
  predio: string;          // Ex: 'Edifício Principal', 'Edifício Novo Milênio'
  andar?: string;          // Ex: 'Térreo', '1º Andar', 'Subsolo'
  sala?: string;           // Ex: 'Sala 2011', 'Ala Central'
  capacidade?: string;     // Ex: '250 pessoas', '80 lugares'
  horario: string;         // Horário de funcionamento (ex: 'Seg a Sex das 08h às 21h')
  descricao: string;       // Descrição detalhada dos serviços e estrutura
  recursos: string[];      // ['Wi-Fi Eduroam', 'Tomadas', 'Ar-condicionado', 'Projetor']
  comoAcessar: string;     // Instruções de uso e acesso (livre ou agendado)
  contato?: SpaceContact;
  links: SpaceLinks;
  destaque?: boolean;
  icone: string;           // Nome do ícone Material Symbols ou Lucide
}
