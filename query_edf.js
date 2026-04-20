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

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase
    .from('learning_trails')
    .select('id, course_code, title')
    .in('course_code', ['EDF029X', 'EDF029296', 'EDF0299']);

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  console.log('--- CURSOS EDF ---');
  console.log(data);
  
  const { data: data2 } = await supabase
    .from('learning_trails')
    .select('id, course_code, title, prerequisites')
    .ilike('title', '%Física Computacional II%');
    
  console.log('--- FÍSICA COMPUTACIONAL II ---');
  console.log(data2);
}

run();
