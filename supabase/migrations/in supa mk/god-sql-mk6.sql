/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 * * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 * * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

-- =========================================================================================
-- [2026-05-02] Interactive Posts V4.0: HSEC Context & Literacy Framework

-- Update submissions table
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS contexto_hsec JSONB DEFAULT '{}'::jsonb;

-- New Table: palavras_geradoras (Freirean Kernels)
CREATE TABLE IF NOT EXISTS public.palavras_geradoras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    termo TEXT NOT NULL UNIQUE,
    codificacao_academica TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- New Table: signos_constelacoes (Translational Literacy)
CREATE TABLE IF NOT EXISTS public.signos_constelacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    palavra_id UUID NOT NULL REFERENCES public.palavras_geradoras(id) ON DELETE CASCADE,
    constelacao TEXT NOT NULL, -- 'nerd', 'artistica', 'ifuspiana', 'geral'
    descodificacao TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(palavra_id, constelacao)
);

-- New Table: reflexoes_inline (Active Learning Pauses)
CREATE TABLE IF NOT EXISTS public.reflexoes_inline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    ancora_paragrafo TEXT NOT NULL,
    tipo_reflexao TEXT NOT NULL CHECK (tipo_reflexao IN ('fechada', 'aberta')),
    pergunta_provocadora TEXT NOT NULL,
    resposta_esperada_ou_gabarito TEXT,
    opcoes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- New Table: respostas_usuarios (Ressignificação Real)
CREATE TABLE IF NOT EXISTS public.respostas_usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reflexao_id UUID NOT NULL REFERENCES public.reflexoes_inline(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    significado_gerado TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(reflexao_id, usuario_id)
);

-- RLS Policies (Mandatory)
ALTER TABLE public.palavras_geradoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signos_constelacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reflexoes_inline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas_usuarios ENABLE ROW LEVEL SECURITY;

-- Read policies: Everyone can read literacy data
DROP POLICY IF EXISTS "Public Read: palavras_geradoras" ON public.palavras_geradoras;
CREATE POLICY "Public Read: palavras_geradoras" ON public.palavras_geradoras FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read: signos_constelacoes" ON public.signos_constelacoes;
CREATE POLICY "Public Read: signos_constelacoes" ON public.signos_constelacoes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read: reflexoes_inline" ON public.reflexoes_inline;
CREATE POLICY "Public Read: reflexoes_inline" ON public.reflexoes_inline FOR SELECT USING (true);

-- Responses: Users can manage their own responses, Authors can read responses to their posts
DROP POLICY IF EXISTS "Users manage own responses" ON public.respostas_usuarios;
CREATE POLICY "Users manage own responses" ON public.respostas_usuarios
    FOR ALL USING (
        auth.uid() = usuario_id OR
        EXISTS (
            SELECT 1 FROM public.reflexoes_inline r
            JOIN public.submissions s ON s.id = r.post_id
            WHERE r.id = reflexao_id AND s.user_id = auth.uid()
        )
    );

-- Admin policies: Only admins/moderators can manage literacy data
DROP POLICY IF EXISTS "Admins manage palavras_geradoras" ON public.palavras_geradoras;
CREATE POLICY "Admins manage palavras_geradoras" ON public.palavras_geradoras
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role IN ('admin', 'moderator') OR is_labdiv = true)));

DROP POLICY IF EXISTS "Admins manage signos_constelacoes" ON public.signos_constelacoes;
CREATE POLICY "Admins manage signos_constelacoes" ON public.signos_constelacoes
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role IN ('admin', 'moderator') OR is_labdiv = true)));

DROP POLICY IF EXISTS "Authors/Admins manage reflexoes_inline" ON public.reflexoes_inline;
CREATE POLICY "Authors/Admins manage reflexoes_inline" ON public.reflexoes_inline
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND (role IN ('admin', 'moderator') OR is_labdiv = true)) OR 
                   EXISTS (SELECT 1 FROM public.submissions WHERE id = post_id AND user_id = auth.uid()));

-- =========================================================================================
-- [2026-05-02] Seed Data: Exemplos de Palavras Geradoras (Alfabetização Científica)

DO $$
DECLARE
    entropia_id UUID;
    emaranhamento_id UUID;
BEGIN
    -- Entropia
    INSERT INTO public.palavras_geradoras (termo, codificacao_academica)
    VALUES ('Entropia', 'Grandeza termodinâmica que mede a desordem ou a aleatoriedade de um sistema físico.')
    ON CONFLICT (termo) DO UPDATE SET codificacao_academica = EXCLUDED.codificacao_academica
    RETURNING id INTO entropia_id;

    INSERT INTO public.signos_constelacoes (palavra_id, constelacao, descodificacao)
    VALUES 
    (entropia_id, 'nerd', 'É o boss final do universo: quanto mais tempo passa, mais bagunçado tudo fica até o fim térmico.'),
    (entropia_id, 'artistica', 'A beleza do caos que se desdobra em formas imprevisíveis.')
    ON CONFLICT (palavra_id, constelacao) DO UPDATE SET descodificacao = EXCLUDED.descodificacao;

    -- Emaranhamento
    INSERT INTO public.palavras_geradoras (termo, codificacao_academica)
    VALUES ('Emaranhamento', 'Fenômeno da mecânica quântica onde partículas compartilham o mesmo estado quântico, independentemente da distância.')
    ON CONFLICT (termo) DO UPDATE SET codificacao_academica = EXCLUDED.codificacao_academica
    RETURNING id INTO emaranhamento_id;

    INSERT INTO public.signos_constelacoes (palavra_id, constelacao, descodificacao)
    VALUES 
    (emaranhamento_id, 'nerd', 'Conexão Wi-Fi instantânea entre partículas, hackeando a velocidade da luz.'),
    (emaranhamento_id, 'ifuspiana', 'Como o café do IF: uma vez que você entra no fluxo, seu estado está ligado ao de todo o instituto.')
    ON CONFLICT (palavra_id, constelacao) DO UPDATE SET descodificacao = EXCLUDED.descodificacao;
END $$;

