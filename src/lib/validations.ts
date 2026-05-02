/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { z } from 'zod';

export const SubmissionSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    authors: z.string().min(1, 'Autor é obrigatório'),
    category: z.string().min(1, 'Categoria é obrigatória'),
    description: z.string().min(1, 'Descrição é obrigatória'),
    media_type: z.enum(['image', 'video', 'pdf', 'text', 'link', 'zip', 'sdocx']),
    media_url: z.string().optional(),
    external_link: z.string().url().optional().or(z.literal('')),
    tags: z.array(z.string()).optional(),
    event_year: z.number().optional().nullable(),
    pseudonym_id: z.string().optional().nullable(),
    new_pseudonym: z.string().optional().nullable(),
    quiz: z.any().optional(),
    is_historical: z.boolean().default(false),
    is_golden_standard: z.boolean().default(false),
    co_authors: z.array(z.string()).optional(),
    read_guide: z.boolean().optional(),
    accepted_cc: z.boolean().optional(),
    selected_departments: z.array(z.string()).optional(),
    selected_laboratories: z.array(z.string()).optional(),
    selected_researchers: z.array(z.string()).optional(),
    selected_research_lines: z.array(z.string()).optional(),
});
