-- migration god-sql-mk10.sql
-- Hub de Comunicação Científica Lab-Div
-- Este programa é software livre: licença AGPLv3

-- 1. Controle de Disponibilidade de Atrações (Admin)
CREATE TABLE IF NOT EXISTS public.show_experiment_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id VARCHAR(50) NOT NULL,
    unavailable_date DATE,            
    unavailable_weekday INTEGER,      
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_experiment_availability ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.show_experiment_availability;
CREATE POLICY "Enable read access for all users" ON public.show_experiment_availability FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.show_experiment_availability;
DROP POLICY IF EXISTS "Admins can manage show experiment availability" ON public.show_experiment_availability;
CREATE POLICY "Admins can manage show experiment availability" ON public.show_experiment_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

-- 2. Agendamentos e Sessões
CREATE TABLE IF NOT EXISTS public.show_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code VARCHAR(50) NOT NULL,
    school_name TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    teacher_email TEXT NOT NULL,
    show_number SERIAL,
    teacher_code VARCHAR(20) UNIQUE NOT NULL,      
    student_code VARCHAR(20) UNIQUE NOT NULL,      
    scheduled_date DATE,          
    scheduled_time TIME,          
    status VARCHAR(20) DEFAULT 'scheduled', 
    selected_experiments JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.show_sessions;
CREATE POLICY "Enable read access for all users" ON public.show_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.show_sessions;
CREATE POLICY "Enable insert access for all users" ON public.show_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.show_sessions;
DROP POLICY IF EXISTS "Admins can manage show sessions" ON public.show_sessions;
CREATE POLICY "Admins can manage show sessions" ON public.show_sessions FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);
DROP POLICY IF EXISTS "Admins can delete show sessions" ON public.show_sessions;
CREATE POLICY "Admins can delete show sessions" ON public.show_sessions FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

-- 3. Tabela de Percepções Comuns (Por experimento)
CREATE TABLE IF NOT EXISTS public.show_experiment_misconceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    experiment_id VARCHAR(50) NOT NULL, 
    stage VARCHAR(20) NOT NULL,         
    misconception_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_experiment_misconceptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.show_experiment_misconceptions;
CREATE POLICY "Enable read access for all users" ON public.show_experiment_misconceptions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.show_experiment_misconceptions;
DROP POLICY IF EXISTS "Admins can manage show misconceptions" ON public.show_experiment_misconceptions;
CREATE POLICY "Admins can manage show misconceptions" ON public.show_experiment_misconceptions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

-- 4. Respostas dos Alunos
CREATE TABLE IF NOT EXISTS public.show_student_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES public.show_sessions(id) ON DELETE CASCADE,
    experiment_id VARCHAR(50), 
    stage VARCHAR(20), 
    free_text_answer TEXT, 
    selected_misconception_id UUID REFERENCES public.show_experiment_misconceptions(id) ON DELETE SET NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.show_student_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.show_student_responses;
CREATE POLICY "Enable read access for all users" ON public.show_student_responses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert access for all users" ON public.show_student_responses;
CREATE POLICY "Enable insert access for all users" ON public.show_student_responses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.show_student_responses;
DROP POLICY IF EXISTS "Admins can manage show student responses" ON public.show_student_responses;
CREATE POLICY "Admins can manage show student responses" ON public.show_student_responses FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);
DROP POLICY IF EXISTS "Admins can delete show student responses" ON public.show_student_responses;
CREATE POLICY "Admins can delete show student responses" ON public.show_student_responses FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

-- 5. RPC Atômica para Aceite de Sugestões de IA em Massa (Admin)
CREATE OR REPLACE FUNCTION public.accept_ai_suggestions_bulk(submission_ids UUID[])
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.submissions
    SET 
        tags = CASE 
            WHEN ai_suggested_tags IS NOT NULL THEN 
                ARRAY(SELECT DISTINCT unnest(array_cat(COALESCE(tags, ARRAY[]::text[]), ai_suggested_tags)))
            ELSE tags
        END,
        alt_text = COALESCE(ai_suggested_alt, alt_text),
        ai_status = 'applied'
    WHERE id = ANY(submission_ids);
END;
$$;

-- 6. Tabela e Políticas RLS de Anotações Privadas (private_notes)
CREATE TABLE IF NOT EXISTS public.private_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    selection_hash TEXT,
    note_text TEXT,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.private_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own private notes" ON public.private_notes;
CREATE POLICY "Users can read own private notes" ON public.private_notes FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own private notes" ON public.private_notes;
CREATE POLICY "Users can insert own private notes" ON public.private_notes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own private notes" ON public.private_notes;
CREATE POLICY "Users can update own private notes" ON public.private_notes FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own private notes" ON public.private_notes;
CREATE POLICY "Users can delete own private notes" ON public.private_notes FOR DELETE USING (auth.uid() = user_id);

-- 7. Tabela e Políticas RLS de Sugestões da Comunidade (corrections)
CREATE TABLE IF NOT EXISTS public.corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    original_text TEXT NOT NULL,
    suggested_text TEXT NOT NULL,
    comment TEXT,
    status VARCHAR(20) DEFAULT 'pendente',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users and admins can view corrections" ON public.corrections;
CREATE POLICY "Users and admins can view corrections" ON public.corrections FOR SELECT USING (
    auth.uid() = user_id OR 
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

DROP POLICY IF EXISTS "Authenticated users can submit corrections" ON public.corrections;
CREATE POLICY "Authenticated users can submit corrections" ON public.corrections FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update corrections" ON public.corrections;
CREATE POLICY "Admins can update corrections" ON public.corrections FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

DROP POLICY IF EXISTS "Admins can delete corrections" ON public.corrections;
CREATE POLICY "Admins can delete corrections" ON public.corrections FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator', 'labdiv'))
);

-- 8. Índices de Otimização e Performance
CREATE INDEX IF NOT EXISTS idx_corrections_submission_status ON public.corrections(submission_id, status);
CREATE INDEX IF NOT EXISTS idx_private_notes_user_submission ON public.private_notes(user_id, submission_id);

-- ==============================================================================
-- 9. SISTEMA DE 4 PERSONAS, VALIDAÇÃO DOCENTE & TORRE DE CONTROLE (HUB LAB-DIV)
-- Licença: GNU AGPLv3 | Instituto de Física da USP (IFUSP)
-- ==============================================================================

-- 9.1 Colunas de Personas, Verificação Docente e Moderação em profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS persona TEXT DEFAULT 'curioso' 
    CHECK (persona IN ('aluno', 'professor', 'curioso', 'iniciativa')),
ADD COLUMN IF NOT EXISTS teacher_proof_path TEXT,
ADD COLUMN IF NOT EXISTS teacher_verification_status TEXT DEFAULT 'none'
    CHECK (teacher_verification_status IN ('none', 'pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS pending_edits JSONB DEFAULT NULL,
ADD COLUMN IF NOT EXISTS review_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS member_initiatives TEXT[] DEFAULT '{}';

-- 9.1.1 Tabela de Solicitações de Novas Iniciativas (Eixo 04 — Governança)
CREATE TABLE IF NOT EXISTS public.initiative_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    initiative_name TEXT NOT NULL,
    acronym TEXT,
    description TEXT NOT NULL,
    responsible_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_feedback TEXT,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.initiative_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert initiative requests" ON public.initiative_requests;
CREATE POLICY "Users can insert initiative requests" ON public.initiative_requests
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users view own or admin views all initiative requests" ON public.initiative_requests;
CREATE POLICY "Users view own or admin views all initiative requests" ON public.initiative_requests
    FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins manage initiative requests" ON public.initiative_requests;
CREATE POLICY "Admins manage initiative requests" ON public.initiative_requests
    FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 9.2 Migração de Dados Legados (user_category -> persona)
UPDATE public.profiles
SET persona = CASE
    WHEN user_category::text IN ('aluno_usp', 'licenciatura', 'bacharelado', 'pos_graduacao') THEN 'aluno'
    WHEN user_category::text IN ('docente_pesquisador', 'pesquisador') THEN 'professor'
    WHEN user_category::text = 'outro_instituto' THEN 'curioso'
    ELSE COALESCE(persona, 'curioso')
END
WHERE persona IS NULL OR persona = 'curioso';

-- 9.3 Trava Anti-Escalação de Privilégio em public.profiles
CREATE OR REPLACE FUNCTION public.protect_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NOT public.is_admin() THEN
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
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_privileges ON public.profiles;
CREATE TRIGGER trg_protect_profile_privileges
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.protect_profile_privileges();

-- 9.4 Coluna de Rascunho de Edições em submissions
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS pending_edits JSONB DEFAULT NULL;

-- 9.5 Interceptação e Moderação de Tabelas Públicas
-- (a) software_feedbacks
ALTER TABLE public.software_feedbacks 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected'));

DROP POLICY IF EXISTS "Feedbacks são públicos para leitura" ON public.software_feedbacks;
CREATE POLICY "Feedbacks são públicos para leitura"
ON public.software_feedbacks FOR SELECT
USING (status = 'approved' OR public.is_admin() OR auth.uid() = user_id);

-- (b) challenge_submissions
ALTER TABLE public.challenge_submissions 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected'));

DROP POLICY IF EXISTS "Public can view challenge submissions" ON public.challenge_submissions;
CREATE POLICY "Public can view challenge submissions"
ON public.challenge_submissions FOR SELECT
USING (status = 'approved' OR public.is_admin() OR auth.uid() = researcher_id);

-- (c) constelacao_edges
ALTER TABLE public.constelacao_edges 
ADD COLUMN IF NOT EXISTS is_pending BOOLEAN DEFAULT true;

DROP POLICY IF EXISTS "Edges são visíveis publicamente" ON public.constelacao_edges;
CREATE POLICY "Edges são visíveis publicamente"
ON public.constelacao_edges FOR SELECT
USING (is_pending = false OR public.is_admin());

-- (d) oportunidades
ALTER TABLE public.oportunidades 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS target_persona TEXT DEFAULT 'geral' 
    CHECK (target_persona IN ('curioso', 'aluno', 'professor', 'geral'));

DROP POLICY IF EXISTS "Oportunidades são públicas para leitura" ON public.oportunidades;
CREATE POLICY "Oportunidades são públicas para leitura"
ON public.oportunidades FOR SELECT
USING (status = 'approved' OR public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Qualquer usuário pode submeter oportunidades" ON public.oportunidades;
DROP POLICY IF EXISTS "Usuários autenticados submetem oportunidades" ON public.oportunidades;
CREATE POLICY "Usuários autenticados submetem oportunidades"
ON public.oportunidades FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- 9.6 Bucket Privado Criptografado para Comprovantes Docentes (LGPD)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'teacher-verifications',
    'teacher-verifications',
    false,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760;

DROP POLICY IF EXISTS "Usuários autenticados enviam seu próprio comprovante" ON storage.objects;
CREATE POLICY "Usuários autenticados enviam seu próprio comprovante"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'teacher-verifications' AND 
    (auth.uid())::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Apenas admins visualizam comprovantes" ON storage.objects;
CREATE POLICY "Apenas admins visualizam comprovantes"
ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'teacher-verifications' AND 
    public.is_admin()
);

DROP POLICY IF EXISTS "Admins podem deletar comprovantes pós-verificação" ON storage.objects;
CREATE POLICY "Admins podem deletar comprovantes pós-verificação"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'teacher-verifications' AND 
    public.is_admin()
);

-- 9.7 RPC Atômica Completa da Torre de Controle (batch_moderate_queue)
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
    IF NOT public.is_admin() THEN
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
                        pending_edits = NULL,
                        review_status = 'approved'
                    WHERE id = item.item_id;
                ELSE
                    UPDATE public.profiles
                    SET pending_edits = NULL,
                        review_status = 'approved'
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

-- ==============================================================================
-- 9.8 CORREÇÃO DE SEGURANÇA RLS: DICAS VETERANOS & ACADEMIC SOFTWARES
-- ==============================================================================
DROP POLICY IF EXISTS "Admin acesso total dicas" ON public.dicas_veteranos;
CREATE POLICY "Admin acesso total dicas"
    ON public.dicas_veteranos FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin gerencia softwares academicos" ON public.academic_softwares;
CREATE POLICY "Admin gerencia softwares academicos"
    ON public.academic_softwares FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
