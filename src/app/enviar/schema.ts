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

import { z } from 'zod';

export const blockTypeSchema = z.enum([
    // Media
    'text', 'image', 'audio', '3d_object', 'video', 'web_game', 'web_page', 'pdf', 'notes', 'reference', 'drive',
    // Pedagogical
    'quiz', 'reflection', 'context_history', 'context_social', 'context_political', 'glossary'
]);

export const blockSchema = z.object({
    id: z.string().uuid(),
    type: blockTypeSchema,
    content: z.any(), // Pode ser tipado mais estritamente dependendo do bloco
});

export type BlockType = z.infer<typeof blockTypeSchema>;
export type Block = z.infer<typeof blockSchema>;

export const submissionSchema = z.object({
    title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(60, 'Título muito longo (máx 60)').default(''),
    authors: z.string().min(3, 'Informe os autores principais').max(60, 'Muito longo (máx 60)').default(''),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres').default(''),
    whatsapp: z.string().default(''),
    
    content_blocks: z.array(blockSchema).default([]),
    
    // Metadados
    read_guide: z.boolean().refine(v => v === true, 'Você deve ler o guia').default(false),
    accepted_cc: z.boolean().refine(v => v === true, 'Você deve aceitar a licença').default(false),
    tags: z.array(z.string()).default([]),
    isotopes: z.array(z.string()).default([]),
    reading_time: z.number().default(0),
    use_pseudonym: z.boolean().default(false),
    event_year: z.string().min(4, 'Selecione o ano').default(new Date().getFullYear().toString()),
    pseudonym_id: z.string().uuid().optional(),
    new_pseudonym: z.string().max(30, 'Apelido muito longo').optional(),
    co_authors: z.array(z.any()).default([]),
    
    language_register: z.enum(['nerd_geek', 'artistica', 'jovem', 'academica']).default('jovem'),
    needs_moderation_help: z.boolean().default(false),

    // Curator Fields
    is_historical: z.boolean().optional().default(false),
    is_golden_standard: z.boolean().optional().default(false),
    selected_departments: z.array(z.string()).optional().default([]),
    selected_laboratories: z.array(z.string()).optional().default([]),
    selected_researchers: z.array(z.string()).optional().default([]),
    selected_research_lines: z.array(z.string()).optional().default([]),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
