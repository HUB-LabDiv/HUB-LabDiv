/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_option: number;
    explanation?: string;
    points: number;
    category?: string;
}

export interface QuizAttempt {
    id: string;
    user_id: string;
    score: number;
    xp_awarded: number;
    created_at: string;
}

export interface SubmissionQuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct_option: number; // 0-3
}

export type SubmissionQuiz = SubmissionQuizQuestion[];
