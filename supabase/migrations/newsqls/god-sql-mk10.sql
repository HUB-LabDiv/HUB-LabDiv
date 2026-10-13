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

