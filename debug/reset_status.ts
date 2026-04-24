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
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching user...');
    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .ilike('full_name', '%Joao Paulo%');

    if (pError || !profiles || profiles.length === 0) {
        console.error('Could not find Joao Paulo');
        return;
    }

    const joaoId = profiles[0].id;
    console.log('Found Joao:', joaoId);

    const { data, error } = await supabase
        .from('research_adoptions')
        .update({ status: 'pending' })
        .eq('student_id', joaoId)
        .select();

    console.log('Update result:', data, error);
}

main();
