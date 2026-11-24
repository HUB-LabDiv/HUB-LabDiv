-- ============================================================================
-- HUB LabDiv V3.0 (IFUSP) - Licenca GNU AGPLv3
-- Modulo: Hub Data Pipeline (Fila de Moderacao no /admin + Snapshots Oficiais)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.data_pipeline_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    github_run_id TEXT,
    trigger_source TEXT NOT NULL DEFAULT 'schedule'
        CHECK (trigger_source IN ('schedule', 'workflow_dispatch', 'manual_cli')),
    status TEXT NOT NULL DEFAULT 'success'
        CHECK (status IN ('success', 'partial_failure', 'failed')),
    modules_report JSONB NOT NULL DEFAULT '[]'::jsonb,
    proposals_created INTEGER NOT NULL DEFAULT 0,
    proposals_skipped INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.data_pipeline_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_id UUID REFERENCES public.data_pipeline_runs(id) ON DELETE SET NULL,
    module TEXT NOT NULL
        CHECK (module IN ('departments', 'initiatives', 'events', 'news', 'spaces', 'disciplines', 'courses')),
    entity_key TEXT NOT NULL,
    entity_title TEXT NOT NULL,
    source_url TEXT,
    change_type TEXT NOT NULL
        CHECK (change_type IN ('added', 'updated', 'removed')),
    before_data JSONB,
    after_data JSONB,
    changed_fields TEXT[] NOT NULL DEFAULT '{}',
    content_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected', 'superseded')),
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    review_note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_pipeline_proposals_active
    ON public.data_pipeline_proposals (module, entity_key, content_hash)
    WHERE status IN ('pending', 'rejected');

CREATE INDEX IF NOT EXISTS idx_pipeline_proposals_status_module
    ON public.data_pipeline_proposals (status, module, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pipeline_proposals_entity
    ON public.data_pipeline_proposals (module, entity_key);

CREATE TABLE IF NOT EXISTS public.official_data_snapshots (
    module TEXT PRIMARY KEY
        CHECK (module IN ('departments', 'initiatives', 'events', 'news', 'spaces', 'disciplines', 'courses')),
    payload JSONB NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.official_data_snapshot_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module TEXT NOT NULL
        CHECK (module IN ('departments', 'initiatives', 'events', 'news', 'spaces', 'disciplines', 'courses')),
    version INTEGER NOT NULL,
    payload JSONB NOT NULL,
    reason TEXT NOT NULL DEFAULT 'pipeline_approval',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (module, version)
);

CREATE INDEX IF NOT EXISTS idx_official_snapshot_history_mod_ver
    ON public.official_data_snapshot_history (module, version DESC);

ALTER TABLE public.data_pipeline_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_pipeline_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_data_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_data_snapshot_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins leem runs do pipeline" ON public.data_pipeline_runs;
CREATE POLICY "Admins leem runs do pipeline"
    ON public.data_pipeline_runs FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Admins gerenciam propostas do pipeline" ON public.data_pipeline_proposals;
CREATE POLICY "Admins gerenciam propostas do pipeline"
    ON public.data_pipeline_proposals FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

DROP POLICY IF EXISTS "Leitura publica dos snapshots oficiais" ON public.official_data_snapshots;
CREATE POLICY "Leitura publica dos snapshots oficiais"
    ON public.official_data_snapshots FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admins leem historico de snapshots" ON public.official_data_snapshot_history;
CREATE POLICY "Admins leem historico de snapshots"
    ON public.official_data_snapshot_history FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));

CREATE OR REPLACE FUNCTION public.commit_pipeline_review(
    p_module TEXT,
    p_expected_version INTEGER,
    p_proposal_ids UUID[],
    p_decision TEXT,
    p_next_payload JSONB DEFAULT NULL,
    p_review_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_is_admin BOOLEAN;
    v_new_version INTEGER := p_expected_version;
    v_updated_count INTEGER := 0;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT COALESCE(v_is_admin, false) THEN
        RAISE EXCEPTION 'FORBIDDEN_ADMIN_ONLY';
    END IF;

    IF p_decision NOT IN ('approved', 'rejected', 'reopen') THEN
        RAISE EXCEPTION 'INVALID_DECISION';
    END IF;

    IF p_decision = 'approved' THEN
        IF p_next_payload IS NULL THEN
            RAISE EXCEPTION 'MISSING_NEXT_PAYLOAD';
        END IF;

        IF p_expected_version = 0 THEN
            INSERT INTO public.official_data_snapshots (module, payload, version, updated_at, updated_by)
            VALUES (p_module, p_next_payload, 1, now(), v_uid)
            ON CONFLICT (module) DO NOTHING
            RETURNING version INTO v_new_version;

            IF v_new_version IS NULL THEN
                RAISE EXCEPTION 'CONFLICT_OPTIMISTIC_LOCK';
            END IF;
        ELSE
            UPDATE public.official_data_snapshots
            SET payload = p_next_payload,
                version = version + 1,
                updated_at = now(),
                updated_by = v_uid
            WHERE module = p_module
              AND version = p_expected_version
            RETURNING version INTO v_new_version;

            IF v_new_version IS NULL THEN
                RAISE EXCEPTION 'CONFLICT_OPTIMISTIC_LOCK';
            END IF;
        END IF;

        INSERT INTO public.official_data_snapshot_history (module, version, payload, reason, created_by)
        VALUES (p_module, v_new_version, p_next_payload, COALESCE(NULLIF(trim(p_review_note), ''), 'pipeline_approval'), v_uid)
        ON CONFLICT (module, version) DO NOTHING;

        DELETE FROM public.official_data_snapshot_history
        WHERE module = p_module
          AND id NOT IN (
              SELECT id FROM public.official_data_snapshot_history
              WHERE module = p_module
              ORDER BY version DESC
              LIMIT 15
          );

        UPDATE public.data_pipeline_proposals
        SET status = 'approved',
            reviewed_by = v_uid,
            reviewed_at = now(),
            review_note = p_review_note
        WHERE id = ANY(p_proposal_ids)
          AND module = p_module
          AND status = 'pending';

        GET DIAGNOSTICS v_updated_count = ROW_COUNT;

        UPDATE public.data_pipeline_proposals AS other
        SET status = 'superseded',
            reviewed_by = v_uid,
            reviewed_at = now(),
            review_note = 'Superseded by approved batch'
        WHERE other.module = p_module
          AND other.status = 'pending'
          AND other.id <> ALL(p_proposal_ids)
          AND other.entity_key IN (
              SELECT DISTINCT entity_key
              FROM public.data_pipeline_proposals
              WHERE id = ANY(p_proposal_ids)
          );
    ELSIF p_decision = 'rejected' THEN
        UPDATE public.data_pipeline_proposals
        SET status = 'rejected',
            reviewed_by = v_uid,
            reviewed_at = now(),
            review_note = p_review_note
        WHERE id = ANY(p_proposal_ids)
          AND module = p_module
          AND status = 'pending';

        GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    ELSE
        UPDATE public.data_pipeline_proposals
        SET status = 'pending',
            reviewed_by = NULL,
            reviewed_at = NULL,
            review_note = NULL
        WHERE id = ANY(p_proposal_ids)
          AND module = p_module
          AND status = 'rejected';

        GET DIAGNOSTICS v_updated_count = ROW_COUNT;
    END IF;

    RETURN jsonb_build_object(
        'ok', true,
        'module', p_module,
        'version', v_new_version,
        'updated_count', v_updated_count
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.rollback_official_snapshot(
    p_module TEXT,
    p_target_version INTEGER,
    p_expected_version INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_is_admin BOOLEAN;
    v_target_payload JSONB;
    v_new_version INTEGER;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = v_uid AND role = 'admin'
    ) INTO v_is_admin;

    IF NOT COALESCE(v_is_admin, false) THEN
        RAISE EXCEPTION 'FORBIDDEN_ADMIN_ONLY';
    END IF;

    SELECT payload INTO v_target_payload
    FROM public.official_data_snapshot_history
    WHERE module = p_module AND version = p_target_version;

    IF v_target_payload IS NULL THEN
        RAISE EXCEPTION 'TARGET_VERSION_NOT_FOUND';
    END IF;

    UPDATE public.official_data_snapshots
    SET payload = v_target_payload,
        version = version + 1,
        updated_at = now(),
        updated_by = v_uid
    WHERE module = p_module
      AND version = p_expected_version
    RETURNING version INTO v_new_version;

    IF v_new_version IS NULL THEN
        RAISE EXCEPTION 'CONFLICT_OPTIMISTIC_LOCK';
    END IF;

    INSERT INTO public.official_data_snapshot_history (module, version, payload, reason, created_by)
    VALUES (p_module, v_new_version, v_target_payload, 'rollback_to_v' || p_target_version::text, v_uid)
    ON CONFLICT (module, version) DO NOTHING;

    RETURN jsonb_build_object('ok', true, 'module', p_module, 'version', v_new_version);
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_pipeline_data(
    p_retention_days INTEGER DEFAULT 120
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_cutoff TIMESTAMPTZ := now() - make_interval(days => GREATEST(p_retention_days, 30));
    v_deleted_runs INTEGER := 0;
    v_deleted_proposals INTEGER := 0;
    v_pruned_rejected INTEGER := 0;
BEGIN
    DELETE FROM public.data_pipeline_proposals
    WHERE status IN ('approved', 'superseded')
      AND created_at < v_cutoff;
    GET DIAGNOSTICS v_deleted_proposals = ROW_COUNT;

    UPDATE public.data_pipeline_proposals
    SET before_data = NULL,
        after_data = NULL
    WHERE status = 'rejected'
      AND created_at < v_cutoff
      AND (before_data IS NOT NULL OR after_data IS NOT NULL);
    GET DIAGNOSTICS v_pruned_rejected = ROW_COUNT;

    DELETE FROM public.data_pipeline_runs
    WHERE started_at < v_cutoff;
    GET DIAGNOSTICS v_deleted_runs = ROW_COUNT;

    RETURN jsonb_build_object(
        'deleted_runs', v_deleted_runs,
        'deleted_proposals', v_deleted_proposals,
        'pruned_rejected', v_pruned_rejected
    );
END;
$$;
