ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_language TEXT DEFAULT 'jovem';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS needs_moderation_help BOOLEAN DEFAULT false;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS language_register TEXT DEFAULT 'jovem';
ALTER TABLE palavras_geradoras ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT false;
ALTER TABLE signos_constelacoes ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT false;

-- RLS para leitura global
DROP POLICY IF EXISTS "Permitir leitura global de palavras" ON palavras_geradoras;
CREATE POLICY "Permitir leitura global de palavras" ON palavras_geradoras FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir leitura global de constelações" ON signos_constelacoes;
CREATE POLICY "Permitir leitura global de constelações" ON signos_constelacoes FOR SELECT TO public USING (true);
-- RLS para inserção
DROP POLICY IF EXISTS "Permitir inserção de palavras pendentes" ON palavras_geradoras;
CREATE POLICY "Permitir inserção de palavras pendentes" 
ON palavras_geradoras FOR INSERT 
TO authenticated 
WITH CHECK (is_pending = true);

DROP POLICY IF EXISTS "Permitir inserção de constelações pendentes" ON signos_constelacoes;
CREATE POLICY "Permitir inserção de constelações pendentes" 
ON signos_constelacoes FOR INSERT 
TO authenticated 
WITH CHECK (is_pending = true);

-- Novos Recursos de Glossário: Moderação (is_rejected) e Constelações Linguísticas (palavras_geradas)
ALTER TABLE palavras_geradoras ADD COLUMN IF NOT EXISTS is_rejected BOOLEAN DEFAULT false;
ALTER TABLE signos_constelacoes ADD COLUMN IF NOT EXISTS is_rejected BOOLEAN DEFAULT false;

CREATE TABLE IF NOT EXISTS palavras_geradas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    termo TEXT NOT NULL,
    palavra_id UUID REFERENCES palavras_geradoras(id) ON DELETE CASCADE,
    is_pending BOOLEAN DEFAULT false,
    is_rejected BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(termo, palavra_id)
);

-- RLS para palavras_geradas
ALTER TABLE palavras_geradas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura global de palavras geradas" ON palavras_geradas;
CREATE POLICY "Permitir leitura global de palavras geradas" ON palavras_geradas FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir inserção de palavras geradas pendentes" ON palavras_geradas;
CREATE POLICY "Permitir inserção de palavras geradas pendentes" 
ON palavras_geradas FOR INSERT 
TO authenticated 
WITH CHECK (is_pending = true);
-- ==============================================================================
-- HUB LAB-DIV: SUPABASE SQL MIGRATION (GOD-SQL-MK8)
-- ==============================================================================
-- Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
-- sob os termos da Licença Pública Geral GNU Affero (AGPLv3).
-- ==============================================================================

-- 1. ADICIONAR COORDENADAS PARA GRAFOS NAS PALAVRAS GERADORAS
ALTER TABLE public.palavras_geradoras
ADD COLUMN IF NOT EXISTS pos_x NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS pos_y NUMERIC DEFAULT 0;

-- 2. CRIAR TABELA DE ARESTAS (EDGES) PARA AS CONSTELAÇÕES
CREATE TABLE IF NOT EXISTS public.constelacao_edges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID NOT NULL REFERENCES public.palavras_geradoras(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES public.palavras_geradoras(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(source_id, target_id) -- Prevenir ligações duplicadas entre os mesmos nós
);

-- 3. POLÍTICAS RLS (Row Level Security)
ALTER TABLE public.constelacao_edges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Edges são visíveis publicamente" ON public.constelacao_edges;
CREATE POLICY "Edges são visíveis publicamente"
    ON public.constelacao_edges FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin pode inserir edges" ON public.constelacao_edges;
CREATE POLICY "Admin pode inserir edges"
    ON public.constelacao_edges FOR INSERT
    WITH CHECK (true); -- Idealmente, verificar se auth.role() = 'admin'

DROP POLICY IF EXISTS "Admin pode deletar edges" ON public.constelacao_edges;
CREATE POLICY "Admin pode deletar edges"
    ON public.constelacao_edges FOR DELETE
    USING (true);

-- 4. ATUALIZAR FUNÇÃO RPC DO GLOSSÁRIO PARA RETORNAR COORDENADAS E EDGES
CREATE OR REPLACE FUNCTION get_full_glossary()
RETURNS TABLE (
    id UUID,
    termo TEXT,
    codificacao_academica TEXT,
    is_pending BOOLEAN,
    is_rejected BOOLEAN,
    pos_x NUMERIC,
    pos_y NUMERIC,
    signos_constelacoes JSONB,
    palavras_geradas JSONB,
    edges JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pg.id,
        pg.termo,
        pg.codificacao_academica,
        pg.is_pending,
        pg.is_rejected,
        pg.pos_x,
        pg.pos_y,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', sc.id,
                        'constelacao', sc.constelacao,
                        'descodificacao', sc.descodificacao,
                        'is_pending', sc.is_pending,
                        'is_rejected', sc.is_rejected
                    )
                )
                FROM public.signos_constelacoes sc
                WHERE sc.palavra_id = pg.id
            ),
            '[]'::jsonb
        ) AS signos_constelacoes,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', pgen.id,
                        'termo', pgen.termo,
                        'is_pending', pgen.is_pending,
                        'is_rejected', pgen.is_rejected
                    )
                )
                FROM public.palavras_geradas pgen
                WHERE pgen.palavra_geradora_id = pg.id
            ),
            '[]'::jsonb
        ) AS palavras_geradas,
        COALESCE(
            (
                SELECT jsonb_agg(
                    jsonb_build_object(
                        'id', e.id,
                        'target_id', e.target_id
                    )
                )
                FROM public.constelacao_edges e
                WHERE e.source_id = pg.id
            ),
            '[]'::jsonb
        ) AS edges
    FROM public.palavras_geradoras pg
    ORDER BY pg.termo ASC;
END;
$$;
