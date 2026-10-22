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

export type CourseId = 'bacharelado' | 'licenciatura' | 'fisica-medica';
export type ShiftType = 'integral' | 'diurno' | 'noturno';

export interface Prerequisite {
  tipo: 'forte' | 'fraco'; // 'forte' = ter aprovação; 'fraco' = ter cursado (frequência)
  disciplinas: string[];  // Códigos das disciplinas necessárias (ex: ['4302111', 'MAT2453'])
  descricao?: string;     // Ex: 'Aprovação em 4302111 ou 4300151'
}

export interface DisciplineItem {
  codigo: string;             // Código JúpiterWeb (ex: '4302111', 'MAT2453', 'MDR0632')
  nome: string;               // Nome da disciplina
  unidade: 'IFUSP' | 'IME' | 'FMUSP' | 'FEUSP' | 'IQ' | 'OUTRA';
  departamento?: string;      // Ex: 'FEP', 'DFMA', 'FNC', 'FGE', 'FMT', 'FAP'
  creditosAula: number;       // Créditos Aula (1 crédito = 15h)
  creditosTrabalho: number;   // Créditos Trabalho (1 crédito = 30h)
  cargaHorariaTotal: number;  // (creditosAula * 15) + (creditosTrabalho * 30)
  horasExtensao?: number;     // Horas de AEx (Atividades de Extensão) computadas
  tipo: 'obrigatoria' | 'optativa-eletiva' | 'optativa-livre';
  ementa: string;             // Texto da ementa oficial
  objetivos?: string;         // Objetivos pedagógicos da disciplina
  bibliografia?: string[];    // Bibliografia básica e complementar
  preRequisitos?: Prerequisite[]; // Requisitos formais para cursar
  coRequisitos?: string[];    // Disciplinas que devem ser cursadas simultaneamente
  liberaDisciplinas?: string[]; // Grafo reverso: disciplinas dos semestres seguintes desbloqueadas por esta
  linkJupiter?: string;       // URL direta da ementa no JúpiterWeb
  observacao?: string;        // Observações pedagógicas ou de equivalência
}

export interface SemesterGrid {
  semestre: number;           // Número do semestre (1 a 10)
  titulo: string;             // Ex: '1º Semestre: Fundamentos de Mecânica e Linguagem Matemática'
  subtitulo?: string;         // Ex: 'Aclimatação ao rigor conceitual e ferramental de cálculo diferencial'
  totalCreditosAula: number;
  totalCreditosTrabalho: number;
  disciplinasCodigos: string[]; // Códigos correspondentes em disciplinesData
}

export interface HabilitationGrid {
  turno: ShiftType;           // 'integral' | 'diurno' | 'noturno'
  nomeTurno: string;          // Ex: 'Integral (4 Anos)' ou 'Noturno (5 Anos)'
  codigoHabilitacao?: string; // Código JúpiterWeb (ex: '43011', '43012', '43021', '43022', '43031')
  duracaoSemestres: number;   // 8 (Integral/Diurno) ou 10 (Noturno)
  semestres: SemesterGrid[];  // Distribuição semestral específica deste turno
}

export interface ElectiveTrack {
  id: string;
  nome: string;               // Ex: 'Física Teórica e Matemática', 'Óptica e Fotônica'
  descricao: string;
  disciplinasCodigos: string[];
}

export interface CourseCurriculum {
  id: CourseId;
  nome: string;               // Nome completo do curso
  codigoCurso: string;        // Código JúpiterWeb (ex: '43011/43012')
  turnosDisponiveis: ShiftType[];
  vagasAnuais: {
    total: number;
    integral?: number;
    diurno?: number;
    noturno?: number;
  };
  horasExtensaoAEx: number;   // Carga horária mínima exigida em AEx (ex: 260h ou 400h)
  horasEstagio?: number;      // Carga horária de estágio obrigatório (Licenciatura)
  descricaoPedagogica: string;
  gradesPorTurno: Record<string, HabilitationGrid>; // Chave: 'integral', 'diurno' ou 'noturno'
  trilhasOptativas?: ElectiveTrack[];
}
