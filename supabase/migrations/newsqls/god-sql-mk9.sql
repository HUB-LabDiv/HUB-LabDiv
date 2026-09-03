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

-- ==============================================================================
-- GOD-SQL-MK9 PATCH: Bucket 'submissions' para upload de arquivos de posts
-- ==============================================================================

-- 7. Storage bucket para uploads de submissões (imagens, vídeos, documentos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'submissions',
    'submissions',
    true,
    10485760, -- 10MB
    ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/quicktime',
        'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a',
        'application/pdf', 'application/zip', 'application/x-zip-compressed',
        'model/gltf-binary', 'model/gltf+json',
        'application/octet-stream'
    ]
) ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/quicktime',
        'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/m4a',
        'application/pdf', 'application/zip', 'application/x-zip-compressed',
        'model/gltf-binary', 'model/gltf+json',
        'application/octet-stream'
    ];

-- Política: qualquer usuário autenticado pode fazer upload
DROP POLICY IF EXISTS "Usuário autenticado pode fazer upload de submissões" ON storage.objects;
CREATE POLICY "Usuário autenticado pode fazer upload de submissões"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'submissions');

-- Política: usuário pode atualizar/deletar seus próprios uploads de submissão
DROP POLICY IF EXISTS "Usuário gerencia suas submissões" ON storage.objects;
CREATE POLICY "Usuário gerencia suas submissões"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'submissions');

DROP POLICY IF EXISTS "Usuário pode deletar suas submissões" ON storage.objects;
CREATE POLICY "Usuário pode deletar suas submissões"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'submissions');

-- Política: leitura pública das submissões
DROP POLICY IF EXISTS "Submissões são públicas" ON storage.objects;
CREATE POLICY "Submissões são públicas"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'submissions');

-- ==============================================================================
-- 8. Suporte a Identificação Institucional (IFUSP, IME, IAG, IGC, IO, etc.)
-- ==============================================================================

-- 8.1 Adicionar coluna institute na tabela submissions
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS institute TEXT DEFAULT 'ifusp';

-- 8.2 Garantir que todas as publicações existentes pertençam ao IFUSP
UPDATE public.submissions 
SET institute = 'ifusp' 
WHERE institute IS NULL OR institute = '';

-- 8.3 Índice de performance para consultas filtradas por instituto
CREATE INDEX IF NOT EXISTS idx_submissions_institute ON public.submissions(institute);

-- ==============================================================================
-- 9. Softwares Acadêmicos & Comunitários (Biblioteca LabDiv)
-- ==============================================================================

-- 9.1 Tabela de Softwares
CREATE TABLE IF NOT EXISTS public.academic_softwares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT NOT NULL,
    description TEXT NOT NULL,
    guide_markdown TEXT,
    author_name TEXT NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    category TEXT NOT NULL DEFAULT 'Física & Simulação',
    software_type TEXT NOT NULL DEFAULT 'comunitario', -- 'comunitario' ou 'essencial'
    pricing_type TEXT DEFAULT 'Gratuito / Open Source',
    platforms TEXT[] DEFAULT ARRAY['Web']::TEXT[],
    access_url TEXT NOT NULL,
    download_url TEXT,
    repository_url TEXT,
    docs_url TEXT,
    banner_url TEXT,
    logo_url TEXT,
    screenshots TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    target_audience TEXT[] DEFAULT ARRAY['Graduação', 'Iniciação Científica']::TEXT[],
    features_list JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'aprovado', -- 'pendente', 'aprovado', 'rejeitado'
    submitted_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_featured BOOLEAN DEFAULT false,
    upvotes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9.2 Tabela de Feedbacks e Relatos de Testes
CREATE TABLE IF NOT EXISTS public.software_feedbacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    software_id UUID NOT NULL REFERENCES public.academic_softwares(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    experience_level TEXT,
    comment TEXT NOT NULL,
    feedback_type TEXT DEFAULT 'test_feedback', -- 'review', 'bug_report', 'suggestion', 'test_feedback'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9.3 Tabela de Upvotes (Curtidas / Favoritos)
CREATE TABLE IF NOT EXISTS public.software_upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    software_id UUID NOT NULL REFERENCES public.academic_softwares(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(software_id, user_id)
);

-- 9.4 Índices de Performance
CREATE INDEX IF NOT EXISTS idx_academic_softwares_slug ON public.academic_softwares(slug);
CREATE INDEX IF NOT EXISTS idx_academic_softwares_category ON public.academic_softwares(category);
CREATE INDEX IF NOT EXISTS idx_academic_softwares_type ON public.academic_softwares(software_type);
CREATE INDEX IF NOT EXISTS idx_academic_softwares_status ON public.academic_softwares(status);
CREATE INDEX IF NOT EXISTS idx_software_feedbacks_software_id ON public.software_feedbacks(software_id);
CREATE INDEX IF NOT EXISTS idx_software_upvotes_software_id ON public.software_upvotes(software_id);

-- 9.5 RLS nas Tabelas
ALTER TABLE public.academic_softwares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.software_upvotes ENABLE ROW LEVEL SECURITY;

-- Políticas para academic_softwares
DROP POLICY IF EXISTS "Leitura de softwares aprovados ou próprios" ON public.academic_softwares;
CREATE POLICY "Leitura de softwares aprovados ou próprios"
    ON public.academic_softwares FOR SELECT
    USING (
        status = 'aprovado' 
        OR (auth.uid() IS NOT NULL AND submitted_by = auth.uid())
        OR (auth.uid() IS NOT NULL AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')))
    );

DROP POLICY IF EXISTS "Usuários autenticados podem enviar softwares" ON public.academic_softwares;
CREATE POLICY "Usuários autenticados podem enviar softwares"
    ON public.academic_softwares FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = submitted_by);

DROP POLICY IF EXISTS "Autores e administradores podem atualizar seus softwares" ON public.academic_softwares;
CREATE POLICY "Autores e administradores podem atualizar seus softwares"
    ON public.academic_softwares FOR UPDATE
    TO authenticated
    USING (
        submitted_by = auth.uid() 
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

-- Políticas para software_feedbacks
DROP POLICY IF EXISTS "Feedbacks são públicos para leitura" ON public.software_feedbacks;
CREATE POLICY "Feedbacks são públicos para leitura"
    ON public.software_feedbacks FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem enviar feedback" ON public.software_feedbacks;
CREATE POLICY "Usuários autenticados podem enviar feedback"
    ON public.software_feedbacks FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários gerenciam seus próprios feedbacks" ON public.software_feedbacks;
CREATE POLICY "Usuários gerenciam seus próprios feedbacks"
    ON public.software_feedbacks FOR DELETE
    TO authenticated
    USING (
        user_id = auth.uid() 
        OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
    );

-- Políticas para software_upvotes
DROP POLICY IF EXISTS "Upvotes são públicos para leitura" ON public.software_upvotes;
CREATE POLICY "Upvotes são públicos para leitura"
    ON public.software_upvotes FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Usuários podem dar upvote" ON public.software_upvotes;
CREATE POLICY "Usuários podem dar upvote"
    ON public.software_upvotes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem remover upvote" ON public.software_upvotes;
CREATE POLICY "Usuários podem remover upvote"
    ON public.software_upvotes FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 9.6 Seed Inicial dos Softwares
INSERT INTO public.academic_softwares (
    title,
    slug,
    tagline,
    description,
    guide_markdown,
    author_name,
    category,
    software_type,
    pricing_type,
    platforms,
    access_url,
    repository_url,
    screenshots,
    tags,
    target_audience,
    features_list,
    is_featured
) VALUES
(
    'LumiFI',
    'lumifi',
    'Luz • Matéria • Descoberta — Software didático para exploração visual e interativa de espectroscopia de raios X',
    'O LumiFI é um software didático desenvolvido no IFUSP como projeto de Iniciação Científica voltado ao ensino e exploração de espectroscopia de raios X de forma visual, interativa e acessível para todos os níveis de formação física.',
    '# Guia de Uso: LumiFI\n\nO LumiFI adapta a experiência ao nível de conhecimento do usuário com 4 modos fundamentais:\n\n### 1. Modos de Experiência\n- **Descoberta:** Ideal para quem nunca utilizou espectroscopia. Interface simplificada e intuitiva.\n- **Exploração:** Para quem já conhece gráficos e quer entender os conceitos fundamentais de física de radiação.\n- **Físico:** Adaptado para estudantes de graduação em Física com controles de parâmetros teóricos.\n- **Pesquisa:** Acesso irrestrito a todas as ferramentas de bancada virtual e cálculo.\n\n### 2. Módulos Principais\n- **Laboratório Virtual:** Configuração de tubo de raios X, filtros, tensão e tempo de exposição.\n- **Biblioteca de Amostras:** Exploração de materiais e suas composições atômicas.\n- **Comparador:** Análise de elementos, dados espectrais, picos e janelas de absorção.\n- **Tabela de Elementos:** Tabela periódica com linhas características e espectros de emissão.\n- **⭐ Museu das Linhas Características (Destaque):** Aprenda sobre transições atômicas, emissão de fótons e gráficos espectrais interativos em tempo real!\n\n### 3. Programa de Testes da Mari\nA Mari está ativamente coletando feedback de alunos e professores para aprimorar o LumiFI. Teste tudo sem medo e deixe sua avaliação na aba de Feedback!',
    'Mariana Bonkavan',
    'Física & Simulação',
    'comunitario',
    'Gratuito / Projeto IFUSP',
    ARRAY['Web', 'Windows', 'Linux']::TEXT[],
    'https://lumifi.if.usp.br',
    'https://github.com/Lab-Div/LumiFI',
    ARRAY['/softwares/lumifi-intro.png', '/softwares/lumifi-museum.png', '/softwares/lumifi-panel.png']::TEXT[],
    ARRAY['raios-x', 'espectroscopia', 'física-experimental', 'simulação', 'ifusp', 'iniciação-científica']::TEXT[],
    ARRAY['Graduação', 'Iniciação Científica', 'Ensino Médio', 'Pós-Graduação']::TEXT[],
    '[
        {"title": "Museu das Linhas Características", "description": "Visualização de órbitas atômicas e emissão de fótons em tempo real."},
        {"title": "4 Modos Adaptativos", "description": "De Descoberta (iniciante) até Pesquisa (avançado)."},
        {"title": "Bancada de Laboratório Virtual", "description": "Ajuste filtros, tensão e feixes de radiação de amostras reais."},
        {"title": "Comparador de Picos", "description": "Compare espectros e identifique elementos químicos desconhecidos."}
    ]'::jsonb,
    true
),
(
    'Aurtistic',
    'aurtistic',
    'Creative Manager — Seu espaço pessoal isolado e livre de distrações para organização acadêmica e projetos',
    'O Aurtistic é uma central de produtividade e gerenciador de foco projetado especialmente para estudantes e pesquisadores gerenciarem tarefas, conexões acadêmicas rápidas e projetos criativos sem sobrecarga cognitiva.',
    '# Guia de Uso: Aurtistic\n\n### 1. Gestão por Dimensões & Contextos\nOrganize suas atividades em dimensões claras (USP, HUB, Pesquisa, Saúde, Hobbys, Filmes/Séries, Fotografia, etc.).\n\n### 2. Links Rápidos da Vida Acadêmica\nAcesse em um clique todos os seus hubs: JúpiterWeb, Moodle USP, Google Drive, Notion, Discord, Supabase, Cloudinary e Canva.\n\n### 3. Modos de Visualização Flexíveis\n- **Lista Detalhada:** Filtros rápidos por prioridade (Alta/Baixa), prazos e status (Não iniciada, Em progresso, Falta testar, Completa).\n- **Visão Semanal & Mensal:** Para planejamento estratégico de semestres e entregas de relatórios.\n- **Criação Rápida:** Adicione ideias e tarefas com atalhos de teclado ágeis.',
    'João Paulo Stangorlini',
    'Produtividade',
    'comunitario',
    'Gratuito / Software Livre',
    ARRAY['Web', 'PWA', 'Mobile']::TEXT[],
    'https://aurtistic.vercel.app/aurtistic',
    'https://github.com/Lab-Div/aurtistic',
    ARRAY['/softwares/aurtistic-dashboard.png']::TEXT[],
    ARRAY['produtividade', 'foco', 'gestão-de-tempo', 'tarefas', 'usp', 'planejamento']::TEXT[],
    ARRAY['Graduação', 'Pós-Graduação', 'Pesquisadores', 'Desenvolvedores']::TEXT[],
    '[
        {"title": "Gestor de Dimensões", "description": "Separe faculdade, pesquisa, projetos pessoais e saúde mental."},
        {"title": "Links Rápidos Acadêmicos", "description": "Júpiter, Moodle e Drive a um clique de distância."},
        {"title": "Filtros e Status Precisos", "description": "Acompanhe o ciclo de vida de cada atividade sem perder prazos."},
        {"title": "Interface Zero Distração", "description": "Modo foco com visual escuro elegante e minimalista."}
    ]'::jsonb,
    true
),
(
    'GeoGebra',
    'geogebra',
    'Calculadora gráfica dinâmica para geometria, álgebra, cálculo e estatística 2D e 3D',
    'O GeoGebra é uma ferramenta matemática consagrada mundialmente para todos os níveis de educação que reúne geometria, álgebra, planilhas, gráficos, estatística e cálculo em um único pacote fácil de usar.',
    '# Guia de Uso: GeoGebra\n\n### 1. Geometria Dinâmica\nConstrua figuras com pontos, vetores, segmentos, linhas, cônicas e funções que podem ser alterados dinamicamente.\n\n### 2. Gráficos 2D e 3D\nVisualize superfícies de revolução, planos tangentes, curvas de nível e funções de múltiplas variáveis fundamentais para Cálculo II e III.\n\n### 3. Planilha & Estatística\nFaça regressões lineares, ajustes de curvas experimentais e cálculo de incertezas para relatórios de Física Experimental.',
    'Equipe GeoGebra',
    'Geometria & Álgebra',
    'essencial',
    'Gratuito',
    ARRAY['Web', 'Windows', 'Linux', 'macOS', 'Android', 'iOS']::TEXT[],
    'https://www.geogebra.org/calculator',
    NULL,
    ARRAY[]::TEXT[],
    ARRAY['geometria', 'cálculo', 'álgebra', 'gráficos-3d', 'matemática', 'física']::TEXT[],
    ARRAY['Graduação', 'Ensino Médio', 'Docentes']::TEXT[],
    '[
        {"title": "Visualizador 3D Interativo", "description": "Gire gráficos tridimensionais com iluminação e vetores normais."},
        {"title": "Cálculo Simbólico (CAS)", "description": "Resolva derivadas e integrais simbolicamente de forma visual."},
        {"title": "Ajuste de Curvas", "description": "Ideal para gráficos de experimentos de laboratório de física."}
    ]'::jsonb,
    false
),
(
    'Wolfram|Alpha',
    'wolfram-alpha',
    'Mecanismo de inteligência computacional para resolução analítica e passo a passo de física e matemática',
    'O Wolfram|Alpha é uma engine de conhecimento e computação que calcula respostas com base em algoritmos matemáticos avançados e dados científicos com curadoria de especialistas.',
    '# Guia de Uso: Wolfram|Alpha\n\n### 1. Solução de Equações Diferenciais & Integrais\nDigite equações diferenciais ordinárias (EDOs) e parciais (EDPs) com condições de contorno para obter soluções exatas e gráficos de campos de direções.\n\n### 2. Física Teórica & Mecânica Quântica\nConsulte constantes fundamentais da física, soluções de poços de potencial, transformadas de Fourier e distribuições estatísticas.\n\n### 3. Sintaxe em Linguagem Natural\nVocê pode digitar fórmulas matemáticas em sintaxe natural ou em LaTeX.',
    'Wolfram Research',
    'Cálculo & Matemática',
    'essencial',
    'Freemium',
    ARRAY['Web', 'Android', 'iOS']::TEXT[],
    'https://www.wolframalpha.com',
    NULL,
    ARRAY[]::TEXT[],
    ARRAY['cálculo', 'física-teórica', 'edo', 'integrais', 'computação-simbólica']::TEXT[],
    ARRAY['Graduação', 'Pós-Graduação', 'Pesquisadores']::TEXT[],
    '[
        {"title": "Resoluções Passo a Passo", "description": "Demonstração detalhada de etapas de integração e álgebra."},
        {"title": "Constantes & Fórmulas Físicas", "description": "Acesso rápido a propriedades de materiais e constantes universais."},
        {"title": "Gráficos de Funções Complexas", "description": "Mapeamento conforme e superfícies de Riemann."}
    ]'::jsonb,
    false
),
(
    'Photomath',
    'photomath',
    'Auxiliar de resolução matemática passo a passo e verificação de cálculos por câmera',
    'O Photomath permite escanear problemas matemáticos impressos ou manuscritos usando a câmera do celular, fornecendo explicações passo a passo detalhadas para verificação de estudos.',
    '# Guia de Uso: Photomath\n\n### 1. Escaneamento com Câmera\nAponte a câmera para exercícios de listas ou notas de aula para reconhecer fórmulas matemáticas instantaneamente.\n\n### 2. Passos Interativos de Resolução\nEntenda as etapas detalhadas de manipulação algébrica, fatoração, limites e sistemas lineares.\n\n### 3. Calculadora Científica Integrada\nEdite expressões complexas diretamente no teclado matemático especializado.',
    'Google LLC / Photomath',
    'Cálculo & Matemática',
    'essencial',
    'Gratuito',
    ARRAY['Android', 'iOS', 'Web']::TEXT[],
    'https://photomath.com',
    NULL,
    ARRAY[]::TEXT[],
    ARRAY['cálculo-básico', 'álgebra', 'matemática', 'mobile', 'estudos']::TEXT[],
    ARRAY['Graduação', 'Ensino Médio']::TEXT[],
    '[
        {"title": "Reconhecimento OCR de Fórmulas", "description": "Reconhece expressões manuscritas e impressas em cadernos."},
        {"title": "Múltiplos Métodos de Resolução", "description": "Veja diferentes maneiras de resolver a mesma equação."},
        {"title": "Gráficos das Soluções", "description": "Compreenda raízes e assíntotas graficamente."}
    ]'::jsonb,
    false
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    tagline = EXCLUDED.tagline,
    description = EXCLUDED.description,
    guide_markdown = EXCLUDED.guide_markdown,
    author_name = EXCLUDED.author_name,
    category = EXCLUDED.category,
    software_type = EXCLUDED.software_type,
    pricing_type = EXCLUDED.pricing_type,
    platforms = EXCLUDED.platforms,
    access_url = EXCLUDED.access_url,
    repository_url = EXCLUDED.repository_url,
    screenshots = EXCLUDED.screenshots,
    tags = EXCLUDED.tags,
    target_audience = EXCLUDED.target_audience,
    features_list = EXCLUDED.features_list,
    is_featured = EXCLUDED.is_featured,
    updated_at = timezone('utc'::text, now());

-- ==============================================================================
-- 10. Mural Comunitário de Oportunidades (GCIF Interativo)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.oportunidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo TEXT NOT NULL DEFAULT 'vaga', -- 'vaga', 'palestra', 'evento', 'bolsa'
    data TEXT,
    local TEXT,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Oportunidades são públicas para leitura" ON public.oportunidades;
CREATE POLICY "Oportunidades são públicas para leitura"
    ON public.oportunidades FOR SELECT
    TO public
    USING (true);

DROP POLICY IF EXISTS "Qualquer usuário pode submeter oportunidades" ON public.oportunidades;
CREATE POLICY "Qualquer usuário pode submeter oportunidades"
    ON public.oportunidades FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Admins podem gerenciar oportunidades" ON public.oportunidades;
CREATE POLICY "Admins podem gerenciar oportunidades"
    ON public.oportunidades FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));

-- ==============================================================================
-- 11. Rascunhos Compartilhados para Pré-Visualização Pública
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.shared_drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    authors TEXT,
    category TEXT,
    institute TEXT DEFAULT 'ifusp',
    description TEXT,
    media_type TEXT DEFAULT 'sdocx',
    media_url TEXT NOT NULL,
    quiz JSONB,
    reflexoes JSONB,
    docs_link TEXT,
    drive_link TEXT,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '15 days') NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garante a coluna expires_at caso a tabela já tenha sido criada anteriormente sem ela
ALTER TABLE public.shared_drafts ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + INTERVAL '15 days') NOT NULL;

ALTER TABLE public.shared_drafts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Qualquer um pode visualizar rascunhos compartilhados" ON public.shared_drafts;
CREATE POLICY "Qualquer um pode visualizar rascunhos compartilhados"
    ON public.shared_drafts FOR SELECT
    TO public
    USING (expires_at > timezone('utc'::text, now()));

DROP POLICY IF EXISTS "Qualquer um pode criar ou atualizar rascunhos compartilhados" ON public.shared_drafts;
CREATE POLICY "Qualquer um pode criar ou atualizar rascunhos compartilhados"
    ON public.shared_drafts FOR ALL
    TO public
    USING (true)
    WITH CHECK (true);
