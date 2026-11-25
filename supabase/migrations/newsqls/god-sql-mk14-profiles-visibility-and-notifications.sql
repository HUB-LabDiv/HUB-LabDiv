-- ==============================================================================
-- Hub de Comunicação Científica Lab-Div V3.0
-- Copyright (C) 2026 João Paulo Stangorlini de Carvalho
--
-- Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
-- sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
-- publicada pela Free Software Foundation.
--
-- Este programa é distribuído na esperança de que seja útil, mas SEM
-- QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
-- ou ADEQUAÇÃO A UM DETERMINADO FIM.
-- ==============================================================================
-- god-sql-mk14-profiles-visibility-and-notifications.sql
-- Visibilidade segura de contas pendentes (approved_at), trava BEFORE UPDATE,
-- estado atômico do monitor de fila e logs de entrega de notificações.
-- ==============================================================================

-- 1. Colunas de controle de primeira aprovação e notificação inicial de cadastro
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ DEFAULT NULL;

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS admin_notified_at TIMESTAMPTZ DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_approved_at
    ON public.profiles(approved_at)
    WHERE approved_at IS NOT NULL;

-- Backfill seguro:
-- (a) Contas já aprovadas mantêm visibilidade imediata e não disparam notificação retroativa
UPDATE public.profiles
SET approved_at = COALESCE(verified_at, created_at, NOW())
WHERE approved_at IS NULL
  AND review_status = 'approved';

UPDATE public.profiles
SET admin_notified_at = COALESCE(created_at, NOW())
WHERE admin_notified_at IS NULL
  AND approved_at IS NOT NULL;

-- (b) Contas que nunca foram aprovadas ficam ocultas de terceiros até aprovação
UPDATE public.profiles
SET is_public = false,
    is_visible = false
WHERE approved_at IS NULL
  AND (review_status = 'pending' OR review_status IS NULL);

-- 2. Trigger de criação de perfil: nasce oculto até primeira aprovação
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        avatar_url,
        is_public,
        is_visible,
        review_status
    )
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        false,
        false,
        'pending'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

-- 3. Trava Anti-Escalação e Visibilidade em public.profiles (BEFORE UPDATE)
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_is_privileged BOOLEAN;
BEGIN
    v_is_privileged := public.is_admin()
        OR COALESCE(auth.role(), '') = 'service_role'
        OR current_user IN ('postgres', 'supabase_admin', 'service_role');

    IF NOT v_is_privileged THEN
        IF NEW.persona IN ('professor', 'iniciativa') AND (OLD.persona IS DISTINCT FROM NEW.persona) THEN
            RAISE EXCEPTION 'Apenas administradores podem atribuir a persona professor ou iniciativa.';
        END IF;
        IF NEW.teacher_verification_status = 'approved' AND (OLD.teacher_verification_status IS DISTINCT FROM NEW.teacher_verification_status) THEN
            RAISE EXCEPTION 'Apenas administradores podem aprovar verificação docente.';
        END IF;
        IF (NEW.verified_at IS DISTINCT FROM OLD.verified_at) OR (NEW.verified_by IS DISTINCT FROM OLD.verified_by) THEN
            RAISE EXCEPTION 'Campos de auditoria não podem ser alterados por usuários comuns.';
        END IF;
        IF NEW.role IS DISTINCT FROM OLD.role THEN
            RAISE EXCEPTION 'Alteração de perfil de acesso restrita a administradores.';
        END IF;
        IF (NEW.approved_at IS DISTINCT FROM OLD.approved_at) OR (NEW.admin_notified_at IS DISTINCT FROM OLD.admin_notified_at) THEN
            RAISE EXCEPTION 'Campos de aprovação e notificação administrativa são restritos ao sistema.';
        END IF;
        IF NEW.review_status = 'approved' AND (OLD.review_status IS DISTINCT FROM 'approved') THEN
            RAISE EXCEPTION 'Apenas administradores podem aprovar um perfil.';
        END IF;
        IF OLD.approved_at IS NULL AND (COALESCE(NEW.is_public, false) = true OR COALESCE(NEW.is_visible, false) = true) THEN
            RAISE EXCEPTION 'Perfil só pode ficar público após a primeira aprovação da moderação.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_privileges();

-- 4. Política RLS de SELECT em public.profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Perfis públicos visíveis" ON public.profiles;
DROP POLICY IF EXISTS "Perfis aprovados são públicos para leitura" ON public.profiles;
CREATE POLICY "Perfis aprovados são públicos para leitura"
    ON public.profiles FOR SELECT
    USING (
        (approved_at IS NOT NULL AND is_visible = true AND is_public = true)
        OR auth.uid() = id
        OR public.is_admin()
    );

-- 5. Atualizar RPC batch_moderate_queue para preservar is_public/is_visible após 1ª aprovação
CREATE OR REPLACE FUNCTION public.batch_moderate_queue(actions JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    item RECORD;
    v_success_count INT := 0;
    v_error_count INT := 0;
    v_admin_id UUID := auth.uid();
BEGIN
    IF NOT public.is_admin() AND COALESCE(auth.role(), '') <> 'service_role' THEN
        RAISE EXCEPTION 'Acesso negado: Requer privilégios de administrador.';
    END IF;

    FOR item IN SELECT * FROM jsonb_to_recordset(actions) AS x(
        item_id UUID,
        item_type TEXT,
        decision TEXT,
        feedback TEXT
    ) LOOP
        BEGIN
            IF item.item_type = 'submission' THEN
                UPDATE public.submissions
                SET status = CASE WHEN item.decision = 'approve' THEN 'aprovado' ELSE 'rejeitado' END,
                    admin_feedback = COALESCE(item.feedback, admin_feedback)
                WHERE id = item.item_id;

            ELSIF item.item_type = 'submission_edit' THEN
                IF item.decision = 'approve' THEN
                    UPDATE public.submissions
                    SET title = COALESCE(pending_edits->>'title', title),
                        description = COALESCE(pending_edits->>'description', description),
                        category = COALESCE(pending_edits->>'category', category),
                        institute = COALESCE(pending_edits->>'institute', institute),
                        media_type = COALESCE(pending_edits->>'media_type', media_type),
                        media_url = COALESCE(pending_edits->>'media_url', media_url),
                        pending_edits = NULL
                    WHERE id = item.item_id;
                ELSE
                    UPDATE public.submissions SET pending_edits = NULL WHERE id = item.item_id;
                END IF;

            ELSIF item.item_type = 'profile_edit' THEN
                IF item.decision = 'approve' THEN
                    UPDATE public.profiles
                    SET full_name = COALESCE(pending_edits->>'full_name', full_name),
                        username = COALESCE(pending_edits->>'username', username),
                        use_nickname = COALESCE(NULLIF(pending_edits->>'use_nickname', '')::boolean, use_nickname),
                        bio = COALESCE(pending_edits->>'bio', bio),
                        course = COALESCE(pending_edits->>'course', course),
                        institute = COALESCE(pending_edits->>'institute', institute),
                        entrance_year = COALESCE(NULLIF(pending_edits->>'entrance_year', '')::integer, entrance_year),
                        education_level = COALESCE(pending_edits->>'education_level', education_level),
                        external_institution = COALESCE(pending_edits->>'external_institution', external_institution),
                        whatsapp = COALESCE(pending_edits->>'whatsapp', whatsapp),
                        lattes_url = COALESCE(pending_edits->>'lattes_url', lattes_url),
                        linkedin_url = COALESCE(pending_edits->>'linkedin_url', linkedin_url),
                        github_url = COALESCE(pending_edits->>'github_url', github_url),
                        youtube_url = COALESCE(pending_edits->>'youtube_url', youtube_url),
                        tiktok_url = COALESCE(pending_edits->>'tiktok_url', tiktok_url),
                        instagram_url = COALESCE(pending_edits->>'instagram_url', instagram_url),
                        portfolio_url = COALESCE(pending_edits->>'portfolio_url', portfolio_url),
                        available_to_mentor = COALESCE(NULLIF(pending_edits->>'available_to_mentor', '')::boolean, available_to_mentor),
                        seeking_mentor = COALESCE(NULLIF(pending_edits->>'seeking_mentor', '')::boolean, seeking_mentor),
                        seeking_ic = COALESCE(NULLIF(pending_edits->>'seeking_ic', '')::boolean, seeking_ic),
                        seeking_assistant = COALESCE(NULLIF(pending_edits->>'seeking_assistant', '')::boolean, seeking_assistant),
                        research_line = COALESCE(pending_edits->>'research_line', research_line),
                        office_room = COALESCE(pending_edits->>'office_room', office_room),
                        laboratory_name = COALESCE(pending_edits->>'laboratory_name', laboratory_name),
                        department = COALESCE(pending_edits->>'department', department),
                        interest_area = COALESCE(pending_edits->>'interest_area', interest_area),
                        cultural_language = COALESCE(pending_edits->>'cultural_language', cultural_language),
                        user_category = COALESCE(pending_edits->>'user_category', user_category),
                        artistic_interests = CASE
                            WHEN pending_edits ? 'artistic_interests' AND jsonb_typeof(pending_edits->'artistic_interests') = 'array'
                            THEN ARRAY(SELECT jsonb_array_elements_text(pending_edits->'artistic_interests'))
                            ELSE artistic_interests
                        END,
                        member_initiatives = CASE
                            WHEN pending_edits ? 'member_initiatives' AND jsonb_typeof(pending_edits->'member_initiatives') = 'array'
                            THEN ARRAY(SELECT jsonb_array_elements_text(pending_edits->'member_initiatives'))
                            ELSE member_initiatives
                        END,
                        is_labdiv = CASE
                            WHEN pending_edits ? 'member_initiatives' AND jsonb_typeof(pending_edits->'member_initiatives') = 'array'
                            THEN (pending_edits->'member_initiatives') ? 'labdiv'
                            ELSE is_labdiv
                        END,
                        hobbies_gallery = CASE
                            WHEN pending_edits ? 'hobbies_gallery' THEN (pending_edits->'hobbies_gallery')
                            ELSE hobbies_gallery
                        END,
                        avatar_url = COALESCE(pending_edits->>'pending_avatar_url', pending_edits->>'avatar_url', avatar_url),
                        is_public = CASE WHEN approved_at IS NULL THEN true ELSE COALESCE(NULLIF(pending_edits->>'is_public', '')::boolean, is_public) END,
                        is_visible = CASE WHEN approved_at IS NULL THEN true ELSE COALESCE(NULLIF(pending_edits->>'is_visible', '')::boolean, is_visible) END,
                        approved_at = COALESCE(approved_at, timezone('utc'::text, now())),
                        pending_edits = NULL,
                        review_status = 'approved'
                    WHERE id = item.item_id;
                ELSE
                    UPDATE public.profiles
                    SET pending_edits = NULL,
                        review_status = CASE WHEN approved_at IS NOT NULL THEN 'approved' ELSE 'rejected' END
                    WHERE id = item.item_id;
                END IF;

            ELSIF item.item_type = 'initiative_request' THEN
                UPDATE public.initiative_requests
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END,
                    admin_feedback = COALESCE(item.feedback, admin_feedback),
                    reviewed_by = v_admin_id,
                    reviewed_at = timezone('utc'::text, now())
                WHERE id = item.item_id;

            ELSIF item.item_type = 'profile' THEN
                UPDATE public.profiles
                SET review_status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END,
                    approved_at = CASE WHEN item.decision = 'approve' THEN COALESCE(approved_at, timezone('utc'::text, now())) ELSE approved_at END,
                    is_public = CASE WHEN item.decision = 'approve' AND approved_at IS NULL THEN true ELSE is_public END,
                    is_visible = CASE WHEN item.decision = 'approve' AND approved_at IS NULL THEN true ELSE is_visible END,
                    pending_edits = NULL,
                    persona = CASE
                        WHEN item.decision = 'approve' AND (item.feedback = 'promote_professor' OR (pending_edits->>'promote_to_professor')::boolean = true) THEN 'professor'
                        ELSE persona
                    END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'teacher_verification' THEN
                UPDATE public.profiles
                SET persona = CASE WHEN item.decision = 'approve' THEN 'professor' ELSE persona END,
                    teacher_verification_status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END,
                    verified_at = timezone('utc'::text, now()),
                    verified_by = v_admin_id
                WHERE id = item.item_id;

            ELSIF item.item_type = 'comment' THEN
                UPDATE public.comments
                SET status = CASE WHEN item.decision = 'approve' THEN 'aprovado' ELSE 'rejeitado' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'software' THEN
                UPDATE public.academic_softwares
                SET status = CASE WHEN item.decision = 'approve' THEN 'aprovado' ELSE 'rejeitado' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'software_feedback' THEN
                UPDATE public.software_feedbacks
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'oportunidade' THEN
                UPDATE public.oportunidades
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'dica' THEN
                UPDATE public.dicas_veteranos
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'micro_article' THEN
                UPDATE public.micro_articles
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'pergunta' THEN
                UPDATE public.perguntas
                SET status = CASE WHEN item.decision = 'approve' THEN 'respondida' ELSE 'rejeitada' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'palavra_geradora' THEN
                IF item.decision = 'approve' THEN
                    UPDATE public.palavras_geradoras SET is_pending = false WHERE id = item.item_id;
                ELSE
                    DELETE FROM public.palavras_geradoras WHERE id = item.item_id;
                END IF;

            ELSIF item.item_type = 'constelacao_edge' THEN
                IF item.decision = 'approve' THEN
                    UPDATE public.constelacao_edges SET is_pending = false WHERE id = item.item_id;
                ELSE
                    DELETE FROM public.constelacao_edges WHERE id = item.item_id;
                END IF;

            ELSIF item.item_type = 'challenge_submission' THEN
                UPDATE public.challenge_submissions
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END
                WHERE id = item.item_id;

            ELSIF item.item_type = 'wiki_proposal' THEN
                UPDATE public.wiki_topic_proposals
                SET status = CASE WHEN item.decision = 'approve' THEN 'approved' ELSE 'rejected' END,
                    admin_feedback = COALESCE(item.feedback, admin_feedback)
                WHERE id = item.item_id;

            ELSIF item.item_type = 'report' THEN
                UPDATE public.reports
                SET status = CASE WHEN item.decision = 'approve' THEN 'resolved' ELSE 'dismissed' END
                WHERE id = item.item_id;

            ELSE
                RAISE EXCEPTION 'Tipo de item inválido na fila de moderação: %', item.item_type;
            END IF;

            v_success_count := v_success_count + 1;
        EXCEPTION WHEN OTHERS THEN
            v_error_count := v_error_count + 1;
        END;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'processed', v_success_count,
        'errors', v_error_count
    );
END;
$$;

-- 6. Estado Atômico do Monitor da Fila de Moderação (Cooldown Serverless-Safe)
CREATE TABLE IF NOT EXISTS public.moderation_monitor_state (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    last_digest_sent_at TIMESTAMPTZ DEFAULT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.moderation_monitor_state (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.moderation_monitor_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin gerencia estado monitor moderacao" ON public.moderation_monitor_state;
CREATE POLICY "Admin gerencia estado monitor moderacao"
    ON public.moderation_monitor_state FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.try_claim_moderation_digest_slot(cooldown_minutes INT DEFAULT 30)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_claimed_id INT;
BEGIN
    INSERT INTO public.moderation_monitor_state (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;

    UPDATE public.moderation_monitor_state
    SET last_digest_sent_at = NOW(),
        updated_at = NOW()
    WHERE id = 1
      AND (
          last_digest_sent_at IS NULL
          OR last_digest_sent_at <= NOW() - make_interval(mins => GREATEST(cooldown_minutes, 0))
      )
    RETURNING id INTO v_claimed_id;

    RETURN v_claimed_id IS NOT NULL;
END;
$$;

-- 7. Logs de Entrega de Notificações (Observabilidade Admin)
CREATE TABLE IF NOT EXISTS public.notification_delivery_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel TEXT NOT NULL CHECK (channel IN ('email', 'in_app', 'push')),
    provider TEXT NOT NULL CHECK (provider IN ('resend', 'gmail', 'supabase', 'webpush')),
    event_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
    recipients_count INT NOT NULL DEFAULT 0,
    message_id TEXT,
    error_message TEXT,
    latency_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notif_delivery_logs_created_at
    ON public.notification_delivery_logs(created_at DESC);

ALTER TABLE public.notification_delivery_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin visualiza logs de entrega" ON public.notification_delivery_logs;
CREATE POLICY "Admin visualiza logs de entrega"
    ON public.notification_delivery_logs FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
