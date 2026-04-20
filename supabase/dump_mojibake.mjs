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

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    const { data: trails } = await supabase.from('learning_trails').select('id, title, course_code').limit(200);

    const badNames = trails.filter(t => t.title && (t.title.includes('Ã') || t.title.includes('') || /[\x80-\xFF]/.test(t.title)));
    console.log(`Found ${badNames.length} potentially bad titles.`);
    for (const t of badNames.slice(0, 10)) {
        console.log(`[${t.course_code}] ${t.title}`);
        for (let i = 0; i < t.title.length; i++) {
            console.log(`  Char: ${t.title[i]} (Code: ${t.title.charCodeAt(i)})`);
        }
    }
}
run();
