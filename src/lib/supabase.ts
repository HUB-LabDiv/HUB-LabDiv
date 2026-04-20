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

/**
 * Backward-compatible re-export.
 * All existing `import { supabase } from '@/lib/supabase'` continue to work.
 * For server-side (Route Handlers, Server Actions), use:
 *   import { createServerSupabase } from '@/lib/supabase/server';
 */
export { supabase, createClientSupabase } from './supabase/client';
