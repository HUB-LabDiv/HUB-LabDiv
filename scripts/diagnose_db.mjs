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

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnostic() {
  console.log('--- Supabase Diagnostic ---')
  console.log('URL:', supabaseUrl)
  
  const { data: tables, error: tableError } = await supabase
    .from('departments')
    .select('count', { count: 'exact', head: true })
  
  if (tableError) {
    console.error('Error fetching departments count:', tableError)
  } else {
    console.log('Departments count:', tables)
  }

  const { data: deptData, error: deptError } = await supabase
    .from('departments')
    .select('*')
    .limit(5)

  if (deptError) {
    console.error('Error fetching departments data:', deptError)
  } else {
    console.log('Departments sample:', deptData)
  }
}

diagnostic()
