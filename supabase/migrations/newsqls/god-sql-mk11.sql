-- SPDX-License-Identifier: AGPL-3.0-or-later
-- ==============================================================================
-- MIGRATION: god-sql-mk11.sql
-- Hub de Comunicacao Cientifica Lab-Div V3.0
-- Subdominios de Iniciativas (Multi-Tenant 4 Eixos + Piloto Show de Fisica)
-- ==============================================================================

-- 1. FUNCOES DE RBAC MULTI-INICIATIVA (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_initiative_member(p_initiative_slug TEXT DEFAULT 'show_da_fisica')
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
          AND (
              role IN ('admin', 'moderator')
              OR p_initiative_slug = ANY(COALESCE(member_initiatives, '{}'::text[]))
          )
    );
$$;

CREATE OR REPLACE FUNCTION public.is_show_member()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT public.is_initiative_member('show_da_fisica');
$$;

-- 2. CATALOGO PUBLICO DE EXPERIMENTOS DO SHOW DE FISICA + CONTROLE DE ESTOQUE
CREATE TABLE IF NOT EXISTS public.show_experiments (
    slug VARCHAR(80) PRIMARY KEY,
    legacy_id VARCHAR(20) UNIQUE NOT NULL,
    act SMALLINT NOT NULL CHECK (act BETWEEN 1 AND 5),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    concept TEXT NOT NULL,
    description TEXT NOT NULL,
    student_explanation TEXT,
    curiosities TEXT[] NOT NULL DEFAULT '{}',
    video_url TEXT,
    image_url TEXT,
    backup_image_url TEXT,
    theme_color VARCHAR(20) NOT NULL DEFAULT 'blue' CHECK (theme_color IN ('red', 'blue', 'green', 'amber')),
    maintenance_status VARCHAR(20) NOT NULL DEFAULT 'disponivel' CHECK (maintenance_status IN ('disponivel', 'manutencao', 'indisponivel')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_show_experiments_act ON public.show_experiments(act);
CREATE INDEX IF NOT EXISTS idx_show_experiments_status ON public.show_experiments(maintenance_status);

ALTER TABLE public.show_experiments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura publica do catalogo de experimentos" ON public.show_experiments;
CREATE POLICY "Leitura publica do catalogo de experimentos"
    ON public.show_experiments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Membros do Show gerenciam catalogo de experimentos" ON public.show_experiments;
CREATE POLICY "Membros do Show gerenciam catalogo de experimentos"
    ON public.show_experiments FOR ALL TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

-- 3. DADOS INTERNOS RESTRITOS DOS EXPERIMENTOS (1:1 PROTEGIDO POR RLS)
CREATE TABLE IF NOT EXISTS public.show_experiment_internals (
    experiment_slug VARCHAR(80) PRIMARY KEY REFERENCES public.show_experiments(slug) ON DELETE CASCADE,
    technical_script_md TEXT,
    safety_notes TEXT,
    setup_checklist TEXT[] NOT NULL DEFAULT '{}',
    maintenance_notes TEXT,
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.show_experiment_internals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Apenas membros do Show acessam dados internos de experimentos" ON public.show_experiment_internals;
CREATE POLICY "Apenas membros do Show acessam dados internos de experimentos"
    ON public.show_experiment_internals FOR ALL TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

-- 4. VINCULO DE SUBMISSOES (POSTS & COLLABS) COM INICIATIVAS E EXPERIMENTOS
ALTER TABLE public.submissions
    ADD COLUMN IF NOT EXISTS initiative_slug VARCHAR(50),
    ADD COLUMN IF NOT EXISTS experiment_slug VARCHAR(80) REFERENCES public.show_experiments(slug) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_submissions_initiative_slug ON public.submissions(initiative_slug);
CREATE INDEX IF NOT EXISTS idx_submissions_experiment_slug ON public.submissions(experiment_slug);

-- 5. EXTENSAO E HARDENING RLS DAS TABELAS SHOW_* EXISTENTES
ALTER TABLE public.show_sessions
    ADD COLUMN IF NOT EXISTS student_count INTEGER DEFAULT 40,
    ADD COLUMN IF NOT EXISTS school_grade VARCHAR(80),
    ADD COLUMN IF NOT EXISTS preferred_shift VARCHAR(30),
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS is_live BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS current_experiment_slug VARCHAR(80) REFERENCES public.show_experiments(slug) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS live_stage VARCHAR(20) NOT NULL DEFAULT 'pre' CHECK (live_stage IN ('pre', 'demo', 'post'));

CREATE INDEX IF NOT EXISTS idx_show_sessions_codes ON public.show_sessions(booking_code, teacher_code, student_code);
CREATE INDEX IF NOT EXISTS idx_show_sessions_is_live ON public.show_sessions(is_live);

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.show_sessions;
DROP POLICY IF EXISTS "Agendamento publico seguro show_sessions" ON public.show_sessions;
CREATE POLICY "Agendamento publico seguro show_sessions"
    ON public.show_sessions FOR INSERT
    WITH CHECK (
        COALESCE(status, 'scheduled') IN ('pending', 'scheduled')
        AND is_live = false
        AND live_stage = 'pre'
        AND current_experiment_slug IS NULL
    );

DROP POLICY IF EXISTS "Admins can manage show sessions" ON public.show_sessions;
DROP POLICY IF EXISTS "Membros do Show atualizam sessoes" ON public.show_sessions;
CREATE POLICY "Membros do Show atualizam sessoes"
    ON public.show_sessions FOR UPDATE TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

DROP POLICY IF EXISTS "Admins can delete show sessions" ON public.show_sessions;
DROP POLICY IF EXISTS "Membros do Show removem sessoes" ON public.show_sessions;
CREATE POLICY "Membros do Show removem sessoes"
    ON public.show_sessions FOR DELETE TO authenticated
    USING (public.is_show_member());

ALTER TABLE public.show_student_responses
    ADD COLUMN IF NOT EXISTS student_name VARCHAR(80),
    ADD COLUMN IF NOT EXISTS school_origin VARCHAR(120),
    ADD COLUMN IF NOT EXISTS response_kind VARCHAR(20) NOT NULL DEFAULT 'question' CHECK (response_kind IN ('question', 'conceptual')),
    ADD COLUMN IF NOT EXISTS is_answered BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS monitor_reply TEXT,
    ADD COLUMN IF NOT EXISTS answered_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_show_responses_session_highlight ON public.show_student_responses(session_id, is_highlighted, created_at DESC);

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.show_student_responses;
DROP POLICY IF EXISTS "Envio publico seguro de perguntas e percepcoes" ON public.show_student_responses;
CREATE POLICY "Envio publico seguro de perguntas e percepcoes"
    ON public.show_student_responses FOR INSERT
    WITH CHECK (
        is_answered = false
        AND is_highlighted = false
        AND monitor_reply IS NULL
        AND answered_by IS NULL
    );

DROP POLICY IF EXISTS "Admins can manage show student responses" ON public.show_student_responses;
DROP POLICY IF EXISTS "Membros do Show moderam perguntas da plateia" ON public.show_student_responses;
CREATE POLICY "Membros do Show moderam perguntas da plateia"
    ON public.show_student_responses FOR UPDATE TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

DROP POLICY IF EXISTS "Admins can delete show student responses" ON public.show_student_responses;
DROP POLICY IF EXISTS "Membros do Show excluem perguntas da plateia" ON public.show_student_responses;
CREATE POLICY "Membros do Show excluem perguntas da plateia"
    ON public.show_student_responses FOR DELETE TO authenticated
    USING (public.is_show_member());

DROP POLICY IF EXISTS "Admins can manage show experiment availability" ON public.show_experiment_availability;
CREATE POLICY "Membros do Show gerenciam disponibilidade de experimentos"
    ON public.show_experiment_availability FOR ALL TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

DROP POLICY IF EXISTS "Admins can manage show misconceptions" ON public.show_experiment_misconceptions;
CREATE POLICY "Membros do Show gerenciam percepcoes comuns"
    ON public.show_experiment_misconceptions FOR ALL TO authenticated
    USING (public.is_show_member())
    WITH CHECK (public.is_show_member());

-- 6. EIXO INFORMATIVO MULTI-INICIATIVA: NOTICIAS, EVENTOS, OPORTUNIDADES E EDITAIS
CREATE TABLE IF NOT EXISTS public.initiative_news_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    slug VARCHAR(120) NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    content_md TEXT NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'noticia' CHECK (category IN ('noticia', 'evento', 'oportunidade', 'edital')),
    cover_url TEXT,
    backup_cover_url TEXT,
    event_date TIMESTAMPTZ,
    registration_url TEXT,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(initiative_slug, slug)
);

CREATE INDEX IF NOT EXISTS idx_initiative_news_slug ON public.initiative_news_events(initiative_slug, is_published, created_at DESC);

ALTER TABLE public.initiative_news_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura publica de noticias e eventos publicados" ON public.initiative_news_events;
CREATE POLICY "Leitura publica de noticias e eventos publicados"
    ON public.initiative_news_events FOR SELECT
    USING (is_published = true OR public.is_initiative_member(initiative_slug));

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam noticias e eventos" ON public.initiative_news_events;
CREATE POLICY "Membros da iniciativa gerenciam noticias e eventos"
    ON public.initiative_news_events FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 7. BASTIDORES MODULO 1: RADAR DE OBJETIVOS, METAS E TAREFAS
CREATE TABLE IF NOT EXISTS public.initiative_goals_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    kind VARCHAR(20) NOT NULL DEFAULT 'task' CHECK (kind IN ('goal', 'task')),
    category VARCHAR(40) NOT NULL DEFAULT 'geral' CHECK (category IN ('roteiro_revisao', 'roteiro_novo', 'manutencao', 'atendimento', 'divulgacao', 'geral')),
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
    priority VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (priority IN ('baixa', 'media', 'alta', 'critica')),
    progress_percent SMALLINT NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    target_value INTEGER,
    current_value INTEGER DEFAULT 0,
    unit_label VARCHAR(30),
    experiment_slug VARCHAR(80) REFERENCES public.show_experiments(slug) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    due_date DATE,
    semester VARCHAR(20) DEFAULT '2026.2',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_initiative_goals_tasks_lookup ON public.initiative_goals_tasks(initiative_slug, kind, status);

ALTER TABLE public.initiative_goals_tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam radar de objetivos e tarefas" ON public.initiative_goals_tasks;
CREATE POLICY "Membros da iniciativa gerenciam radar de objetivos e tarefas"
    ON public.initiative_goals_tasks FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 8. BASTIDORES MODULO 2: ESCALAS SEMANAIS E REGISTRO DE PRESENCAS
CREATE TABLE IF NOT EXISTS public.initiative_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    monitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 1 AND 6),
    shift_slot VARCHAR(30) NOT NULL CHECK (shift_slot IN ('manha', 'tarde', 'noite')),
    role_in_shift VARCHAR(40) NOT NULL DEFAULT 'apresentador' CHECK (role_in_shift IN ('apresentador', 'apoio_palco', 'manutencao', 'coordenacao')),
    notes TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_initiative_shifts_lookup ON public.initiative_shifts(initiative_slug, weekday, shift_slot);

ALTER TABLE public.initiative_shifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam escalas" ON public.initiative_shifts;
CREATE POLICY "Membros da iniciativa gerenciam escalas"
    ON public.initiative_shifts FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

CREATE TABLE IF NOT EXISTS public.initiative_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    monitor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    session_id UUID REFERENCES public.show_sessions(id) ON DELETE SET NULL,
    shift_date DATE NOT NULL DEFAULT CURRENT_DATE,
    shift_slot VARCHAR(30) NOT NULL DEFAULT 'manha' CHECK (shift_slot IN ('manha', 'tarde', 'noite')),
    status VARCHAR(30) NOT NULL DEFAULT 'presente' CHECK (status IN ('escalado', 'presente', 'falta_justificada', 'substituido')),
    notes TEXT,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_initiative_attendance_date ON public.initiative_attendance(initiative_slug, shift_date DESC);

ALTER TABLE public.initiative_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam presencas" ON public.initiative_attendance;
CREATE POLICY "Membros da iniciativa gerenciam presencas"
    ON public.initiative_attendance FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 9. BASTIDORES MODULO 3: SUGESTOES E PEDIDOS INTERNOS (INSUMOS / OFICINA / DINAMICA)
CREATE TABLE IF NOT EXISTS public.initiative_internal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category VARCHAR(40) NOT NULL CHECK (category IN ('compra_insumo', 'reparo_oficina', 'novo_experimento', 'melhoria_dinamica')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    urgency VARCHAR(20) NOT NULL DEFAULT 'media' CHECK (urgency IN ('baixa', 'media', 'alta', 'critica')),
    experiment_slug VARCHAR(80) REFERENCES public.show_experiments(slug) ON DELETE SET NULL,
    estimated_cost NUMERIC(10, 2),
    status VARCHAR(30) NOT NULL DEFAULT 'aberto' CHECK (status IN ('aberto', 'em_analise', 'aprovado', 'concluido', 'arquivado')),
    coordinator_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_initiative_requests_status ON public.initiative_internal_requests(initiative_slug, status, created_at DESC);

ALTER TABLE public.initiative_internal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam pedidos internos" ON public.initiative_internal_requests;
CREATE POLICY "Membros da iniciativa gerenciam pedidos internos"
    ON public.initiative_internal_requests FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 10. BASTIDORES MODULO 4: ACERVO DE MATERIAIS DE ESTUDO E PRODUCAO DE DIVULGACAO
CREATE TABLE IF NOT EXISTS public.initiative_study_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    front VARCHAR(30) NOT NULL CHECK (front IN ('estudo_operacao', 'divulgacao_inspiracao')),
    media_kind VARCHAR(30) NOT NULL CHECK (media_kind IN ('roteiro_tecnico', 'manual_seguranca', 'demo_interna', 'midia_bruta', 'documentario_ref', 'inspiracao_post')),
    title TEXT NOT NULL,
    description TEXT,
    experiment_slug VARCHAR(80) REFERENCES public.show_experiments(slug) ON DELETE SET NULL,
    file_url TEXT,
    backup_url TEXT,
    external_url TEXT,
    tags TEXT[] NOT NULL DEFAULT '{}',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_initiative_materials_front ON public.initiative_study_materials(initiative_slug, front, created_at DESC);

ALTER TABLE public.initiative_study_materials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Membros da iniciativa gerenciam acervo de estudo e divulgacao" ON public.initiative_study_materials;
CREATE POLICY "Membros da iniciativa gerenciam acervo de estudo e divulgacao"
    ON public.initiative_study_materials FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 11. GERENCIA DE EQUIPE DA INICIATIVA (FUNCOES OPERACIONAIS + VITRINE BLOCO 7)
CREATE TABLE IF NOT EXISTS public.initiative_team_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    initiative_slug VARCHAR(50) NOT NULL DEFAULT 'show_da_fisica',
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sub_role VARCHAR(40) NOT NULL DEFAULT 'apresentador' CHECK (sub_role IN ('coordenador', 'apresentador', 'apoio_palco', 'oficina_manutencao', 'divulgacao')),
    role_title TEXT,
    custom_bio TEXT,
    is_public_showcase BOOLEAN NOT NULL DEFAULT true,
    display_order SMALLINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(initiative_slug, profile_id)
);

CREATE INDEX IF NOT EXISTS idx_initiative_team_roles_slug ON public.initiative_team_roles(initiative_slug, is_public_showcase, display_order);

ALTER TABLE public.initiative_team_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura publica da vitrine de equipe da iniciativa" ON public.initiative_team_roles;
CREATE POLICY "Leitura publica da vitrine de equipe da iniciativa"
    ON public.initiative_team_roles FOR SELECT
    USING (is_public_showcase = true OR public.is_initiative_member(initiative_slug));

DROP POLICY IF EXISTS "Membros gerenciam equipe da iniciativa" ON public.initiative_team_roles;
CREATE POLICY "Membros gerenciam equipe da iniciativa"
    ON public.initiative_team_roles FOR ALL TO authenticated
    USING (public.is_initiative_member(initiative_slug))
    WITH CHECK (public.is_initiative_member(initiative_slug));

-- 12. PUBLICACAO REALTIME PARA ACOMPANHE SEU SHOW E MODO PALCO
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.show_sessions;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.show_student_responses;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

