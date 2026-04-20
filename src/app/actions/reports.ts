'use server';

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


import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * Taxonomic Reporting System - Safe Harbor Implementation
 * Handles both standard and "Gravíssima" categories with automatic moderation triggers via DB.
 */
export async function submitContentReport(formData: FormData) {
    const supabase = await createServerSupabase();
    
    const submission_id = formData.get('submission_id') as string;
    const category = formData.get('category') as string;
    const reason = formData.get('reason') as string;
    const url = formData.get('url') as string;

    if (!submission_id || !category) {
        return { success: false, error: 'Campos obrigatórios ausentes.' };
    }

    // Get current user if any
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase
        .from('reports')
        .insert([
            {
                submission_id,
                reporter_id: user?.id || null,
                category,
                reason: reason || `Denúncia por ${category}`,
                status: 'pendente',
                metadata: {
                    url,
                    user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server Action',
                    timestamp: new Date().toISOString()
                }
            }
        ]);

    if (error) {
        console.error('Error submitting content report:', error);
        return { success: false, error: error.message };
    }

    // Revalidate paths
    revalidatePath(`/arquivo/${submission_id}`);
    revalidatePath('/admin/reports');

    // Notify Admins about potential suspension or high volume
    // (Wait for trigger to handle DB state first)

    return { success: true };
}
