-- ==============================================================================
-- HUB LAB-DIV: SUPABASE SQL MIGRATION (GOD-SQL-MK9) - WEB PUSH NOTIFICATIONS
-- ==============================================================================
-- Este programa é um software livre; você pode redistribuí-lo e/ou modificá-lo
-- sob os termos da Licença Pública Geral GNU Affero (AGPLv3).
-- ==============================================================================

-- 1. Web Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.web_push_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, endpoint)
);

ALTER TABLE public.web_push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários gerenciam suas próprias inscrições push" ON public.web_push_subscriptions;
CREATE POLICY "Usuários gerenciam suas próprias inscrições push"
    ON public.web_push_subscriptions FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 2. Atualizações em Profiles (Preferências)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS enable_push_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS default_reminder_minutes INTEGER DEFAULT 1440,
ADD COLUMN IF NOT EXISTS notify_classes BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_exams BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_reminders BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_tips BOOLEAN DEFAULT true;

-- 3. Atualizações em user_calendar_events
ALTER TABLE public.user_calendar_events 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS reminder_minutes INTEGER DEFAULT 1440,
ADD COLUMN IF NOT EXISTS is_notified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS days_of_week INTEGER[];

-- 4. Perfil Oficial do LabDiv e Posts Iniciais do KitDiv

-- 4.1 Criação do Usuário LabDiv na tabela auth.users (ID fixo gerado para consistência)
INSERT INTO auth.users (id, email, raw_user_meta_data, raw_app_meta_data, aud, role, encrypted_password)
VALUES (
    '1a8d1b11-d1b1-4f11-9a11-1a8d1b11d1b1',
    'hublabdiv@gmail.com',
    '{"name": "LabDiv"}',
    '{"provider": "email", "providers": ["email"]}',
    'authenticated',
    'authenticated',
    crypt('labdiv-tecla56', gen_salt('bf'))
) ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password;

-- 4.2 Criação do Perfil LabDiv
INSERT INTO public.profiles (id, email, username, full_name, avatar_url, bio, role, is_public)
VALUES (
    '1a8d1b11-d1b1-4f11-9a11-1a8d1b11d1b1',
    'hublabdiv@gmail.com',
    'LabDiv',
    'LabDiv',
    '/labdiv-logo.png',
    'Perfil oficial do LabDiv. Acompanhe nossas dicas de comunicação científica, atividades e materiais de apoio. Acesse nosso site: https://sites.google.com/usp.br/labdiv/início?authuser=0',
    'admin',
    true
) ON CONFLICT (id) DO UPDATE SET
    avatar_url = EXCLUDED.avatar_url,
    bio = EXCLUDED.bio,
    role = EXCLUDED.role,
    username = EXCLUDED.username;


