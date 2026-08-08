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


-- 4. Perfil LabDiv — será criado manualmente pelo fluxo de cadastro normal.
-- (Seções 4.1, 4.2, 4.3 removidas)

-- 5. Atualizações em Profiles (Novas Preferências de Notificação)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_follows_posts BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notify_dms BOOLEAN DEFAULT true;

-- 6. Storage bucket para avatars de perfil
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    5242880, -- 5MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Política: usuário autenticado pode fazer upload na sua própria pasta
DROP POLICY IF EXISTS "Usuário faz upload do próprio avatar" ON storage.objects;
CREATE POLICY "Usuário faz upload do próprio avatar"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: usuário pode atualizar/deletar o próprio avatar
DROP POLICY IF EXISTS "Usuário gerencia o próprio avatar" ON storage.objects;
CREATE POLICY "Usuário gerencia o próprio avatar"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'avatars' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Política: leitura pública dos avatars
DROP POLICY IF EXISTS "Avatars são públicos" ON storage.objects;
CREATE POLICY "Avatars são públicos"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'avatars');
