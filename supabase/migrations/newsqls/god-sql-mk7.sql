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

-- 5. CRIAR TABELA PARA SAC/FAQ
CREATE TABLE IF NOT EXISTS public.sac_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pergunta TEXT NOT NULL,
    resposta TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    nome TEXT,
    num_usp TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS para sac_faq
ALTER TABLE public.sac_faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qualquer um pode ler FAQs aprovados" ON public.sac_faq;
CREATE POLICY "Qualquer um pode ler FAQs aprovados"
    ON public.sac_faq FOR SELECT
    USING (status = 'approved');

DROP POLICY IF EXISTS "Autenticados podem inserir FAQs" ON public.sac_faq;
CREATE POLICY "Autenticados podem inserir FAQs"
    ON public.sac_faq FOR INSERT
    WITH CHECK (status = 'pending');

DROP POLICY IF EXISTS "Admin tem acesso total ao SAC" ON public.sac_faq;
CREATE POLICY "Admin tem acesso total ao SAC"
    ON public.sac_faq FOR ALL
    USING (true)
    WITH CHECK (true);
-- Migration for Dicas de Veteranos (Sábios do Síncrotron)

CREATE TABLE IF NOT EXISTS public.dicas_veteranos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    conteudo TEXT NOT NULL,
    categoria TEXT NOT NULL,
    autor_nome TEXT NOT NULL,
    autor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    upvotes INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.dicas_veteranos ENABLE ROW LEVEL SECURITY;

-- Select (Leitura Pública apenas para dicas aprovadas)
DROP POLICY IF EXISTS "Dicas aprovadas são públicas" ON public.dicas_veteranos;
CREATE POLICY "Dicas aprovadas são públicas"
    ON public.dicas_veteranos FOR SELECT
    USING (status = 'approved');

-- Insert (Qualquer usuário autenticado pode enviar)
DROP POLICY IF EXISTS "Usuários autenticados podem enviar dicas" ON public.dicas_veteranos;
CREATE POLICY "Usuários autenticados podem enviar dicas"
    ON public.dicas_veteranos FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Admin tem acesso total (Leitura de pendentes, Update, Delete)
DROP POLICY IF EXISTS "Admin acesso total dicas" ON public.dicas_veteranos;
CREATE POLICY "Admin acesso total dicas"
    ON public.dicas_veteranos FOR ALL
    USING (true)
    WITH CHECK (true);

-- Upvotes: Permitir que qualquer usuário faça o UPDATE apenas do campo upvotes
-- Para simplificar por enquanto, deixaremos o update de upvotes liberado se a dica for aprovada
-- e se o auth.uid() não for nulo (ou seja, logado)
DROP POLICY IF EXISTS "Usuários logados podem curtir dicas aprovadas" ON public.dicas_veteranos;
CREATE POLICY "Usuários logados podem curtir dicas aprovadas"
    ON public.dicas_veteranos FOR UPDATE
    USING (status = 'approved' AND auth.uid() IS NOT NULL);

-- ==============================================================================
-- HUB LAB-DIV: SUPABASE SQL MIGRATION (GOD-SQL-MK8 - PEDAGOGICAL ANALYTICS)
-- ==============================================================================

-- 1. ADD NEW PEDAGOGICAL FIELDS TO SUBMISSIONS
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS complexity_level TEXT,
ADD COLUMN IF NOT EXISTS biggest_learning TEXT;

-- 2. CREATE POST ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS public.post_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    scroll_depth_avg NUMERIC DEFAULT 0,
    time_spent_avg NUMERIC DEFAULT 0,
    total_reads INTEGER DEFAULT 0,
    block_interactions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(submission_id)
);

-- RLS FOR POST ANALYTICS
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view analytics" ON public.post_analytics;
CREATE POLICY "Public can view analytics"
    ON public.post_analytics FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "System can update analytics" ON public.post_analytics;
CREATE POLICY "System can update analytics"
    ON public.post_analytics FOR ALL
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- ADD NEW VALUES TO user_category ENUM
-- ==============================================================================
ALTER TYPE public.user_category ADD VALUE IF NOT EXISTS 'licenciatura';
ALTER TYPE public.user_category ADD VALUE IF NOT EXISTS 'bacharelado';
ALTER TYPE public.user_category ADD VALUE IF NOT EXISTS 'pos_graduacao';
ALTER TYPE public.user_category ADD VALUE IF NOT EXISTS 'docente_pesquisador';

-- ==============================================================================
-- SYSTEM SETTINGS FOR AUTO APPROVAL
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    auto_approve_profiles_until TIMESTAMP WITH TIME ZONE
);

INSERT INTO public.system_settings (id) VALUES ('default') ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view settings" ON public.system_settings;
CREATE POLICY "Public can view settings"
    ON public.system_settings FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "System can update settings" ON public.system_settings;
CREATE POLICY "System can update settings"
    USING (true)
    WITH CHECK (true);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_token TEXT;

-- ==============================================================================
-- HUB ADOPTIONS (ADOÇÃO EM DISCIPLINAS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.hub_adoptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    discipline_name TEXT NOT NULL,
    summary TEXT,
    usage_intent TEXT,
    requested_features TEXT,
    status TEXT DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.hub_adoptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin tem acesso total às adoções" ON public.hub_adoptions;
CREATE POLICY "Admin tem acesso total às adoções"
    ON public.hub_adoptions FOR ALL
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Usuários autenticados podem inserir adoções" ON public.hub_adoptions;
CREATE POLICY "Usuários autenticados podem inserir adoções"
    ON public.hub_adoptions FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Usuários podem ler suas próprias adoções" ON public.hub_adoptions;
CREATE POLICY "Usuários podem ler suas próprias adoções"
    ON public.hub_adoptions FOR SELECT
    USING (auth.uid() = user_id);
