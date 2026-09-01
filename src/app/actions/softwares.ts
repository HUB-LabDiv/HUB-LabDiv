'use server';

/*!
 * Hub de Comunicação Científica Lab-Div V3.0
 * Copyright (C) 2026 João Paulo Stangorlini de Carvalho
 *
 * Este programa é software livre: você pode redistribuí-lo e/ou modificá-lo
 * sob os termos da Licença Pública Geral Affero GNU (AGPLv3) conforme
 * publicada pela Free Software Foundation.
 *
 * Este programa é distribuído na esperança de que seja útil, mas SEM
 * QUALQUER GARANTIA; sem mesmo a garantia implícita de COMERCIALIZAÇÃO
 * ou ADEQUAÇÃO A UM DETERMINADO FIM.
 */

import { createServerSupabase } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { AcademicSoftware, SoftwareFeedback, SubmitSoftwareInput } from '@/types/softwares';
import { isUserAllowedSoftwaresTab } from '@/constants/softwares';

// Fallback curated seed data
const CURATED_SOFTWARES_SEED: AcademicSoftware[] = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        title: 'LumiFI',
        slug: 'lumifi',
        tagline: 'Luz • Matéria • Descoberta — Software didático para exploração visual e interativa de espectroscopia de raios X',
        description: 'O LumiFI é um software didático desenvolvido no IFUSP como projeto de Iniciação Científica voltado ao ensino e exploração de espectroscopia de raios X de forma visual, interativa e acessível para todos os níveis de formação física.',
        guide_markdown: `### 🌟 Bem-vindo ao LumiFI!

Desenvolvido no IFUSP pela aluna de Iniciação Científica **Mariana Bonkavan**, o LumiFI permite explorar espectros de emissão e absorção, linhas atômicas características e interações de radiação com a matéria de forma visual e intuitiva.

---

### 🎮 Modos de Experiência Adaptativos
O LumiFI adapta todas as ferramentas de acordo com a sua familiaridade:
- **Descoberta:** "Nunca utilizei espectroscopia" — Experiência visual simplificada focada na física qualitativa e conceitos centrais.
- **Exploração:** "Conheço gráficos e quero entender os conceitos" — Visualização detalhada de curvas espectrais e janelas de energia.
- **Físico:** "Sou estudante de Física" — Ajuste preciso de parâmetros teóricos, filtros e energias de transição.
- **Pesquisa:** "Quero utilizar todas as ferramentas" — Bancada completa de laboratório virtual e calibração de dados.

---

### 🔬 Módulos do Painel Central
1. **Laboratório Virtual:** Configuração de tubo de raios X, filtros de atenuação, tensão de aceleração e tempo de exposição.
2. **Biblioteca de Amostras:** Exploração de materiais e suas composições atômicas.
3. **Comparador de Espectros:** Comparação simultânea de elementos, picos característicos e bremsstrahlung.
4. **Tabela de Elementos:** Tabela periódica com linhas $K_\\alpha$, $K_\\beta$, $L_\\alpha$ e camadas eletrônicas.
5. **⭐ Museu das Linhas Características (Destaque da Mari):** Transições eletrônicas em tempo real com emissão de fótons e gráfico sincronizado!

---

### 📬 Programa de Testes da Mari
A Mari está convidando ativamente alunos e professores para testar o software e enviar impressões:
- Mexa em tudo sem medo de errar!
- Navegue pelos 4 modos e veja se tudo é intuitivo.
- Deixe seu feedback e sugestões na seção abaixo!`,
        author_name: 'Mariana Bonkavan',
        author_id: '67fa6cbf-db42-4d44-a5af-27d7d9086aad',
        category: 'Física & Simulação',
        software_type: 'comunitario',
        pricing_type: 'Gratuito / Projeto IFUSP',
        platforms: ['Web', 'Windows', 'Linux'],
        access_url: 'https://lumifi.if.usp.br',
        repository_url: 'https://github.com/Lab-Div/LumiFI',
        screenshots: [
            '/softwares/lumifi-intro.png',
            '/softwares/lumifi-museum.png',
            '/softwares/lumifi-panel.png'
        ],
        tags: ['raios-x', 'espectroscopia', 'física-experimental', 'simulação', 'ifusp', 'iniciação-científica'],
        target_audience: ['Graduação', 'Iniciação Científica', 'Ensino Médio', 'Pós-Graduação'],
        features_list: [
            { title: 'Museu das Linhas Características', description: 'Visualização de órbitas atômicas e emissão de fótons em tempo real.' },
            { title: '4 Modos Adaptativos', description: 'De Descoberta (iniciante) até Pesquisa (avançado).' },
            { title: 'Bancada de Laboratório Virtual', description: 'Ajuste filtros, tensão e feixes de radiação de amostras reais.' },
            { title: 'Comparador de Picos', description: 'Compare espectros e identifique elementos químicos desconhecidos.' }
        ],
        status: 'aprovado',
        is_featured: true,
        upvotes_count: 14,
        created_at: '2026-08-31T20:00:00.000Z',
        updated_at: '2026-08-31T20:00:00.000Z'
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        title: 'Aurtistic',
        slug: 'aurtistic',
        tagline: 'Creative Manager — Seu espaço pessoal isolado e livre de distrações para organização acadêmica e projetos',
        description: 'O Aurtistic é uma central de produtividade e gerenciador de foco projetado especialmente para estudantes e pesquisadores gerenciarem tarefas, conexões acadêmicas rápidas e projetos criativos sem sobrecarga cognitiva.',
        guide_markdown: `### 🎨 Bem-vindo ao Aurtistic!

Desenvolvido por **João Paulo Stangorlini (Andy)**, o Aurtistic é um espaço pensado para quem busca hiperfoco e clareza na rotina acadêmica e pessoal.

---

### 🚀 Recursos Principais
- **Gestão por Dimensões:** Separe USP, HUB, Saúde, Hobbys, Filmes/Séries, Fotografia e Projetos Urgentes em categorias isoladas.
- **Links Rápidos da Vida Universitária:** Acesse em 1 clique: JúpiterWeb, Moodle USP, Google Drive, Notion, Discord, Supabase, Cloudinary e Canva.
- **Visualização Flexível:** Alterne instantaneamente entre Lista Detalhada, Semanal e Mensal.
- **Filtros Ágeis:** Prioridade (Alta/Baixa), Prazos e Status detalhado (Rascunho, Em progresso, Falta testar, Completa).
- **Criação Rápida:** Adicione novos itens rapidamente com atalhos de teclado.`,
        author_name: 'João Paulo Stangorlini',
        author_id: '8a3e4272-010d-4479-94cb-26178d544ea2',
        category: 'Produtividade',
        software_type: 'comunitario',
        pricing_type: 'Gratuito / Software Livre',
        platforms: ['Web', 'PWA', 'Mobile'],
        access_url: 'https://aurtistic.vercel.app/aurtistic',
        repository_url: 'https://github.com/Lab-Div/aurtistic',
        screenshots: [
            '/softwares/aurtistic-dashboard.png'
        ],
        tags: ['produtividade', 'foco', 'gestão-de-tempo', 'tarefas', 'usp', 'planejamento'],
        target_audience: ['Graduação', 'Pós-Graduação', 'Pesquisadores', 'Desenvolvedores'],
        features_list: [
            { title: 'Gestor de Dimensões', description: 'Separe faculdade, pesquisa, projetos pessoais e saúde mental.' },
            { title: 'Links Rápidos Acadêmicos', description: 'Júpiter, Moodle e Drive a um clique de distância.' },
            { title: 'Filtros e Status Precisos', description: 'Acompanhe o ciclo de vida de cada atividade sem perder prazos.' },
            { title: 'Interface Zero Distração', description: 'Modo foco com visual escuro elegante e minimalista.' }
        ],
        status: 'aprovado',
        is_featured: true,
        upvotes_count: 19,
        created_at: '2026-08-31T20:00:00.000Z',
        updated_at: '2026-08-31T20:00:00.000Z'
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        title: 'GeoGebra',
        slug: 'geogebra',
        tagline: 'Calculadora gráfica dinâmica para geometria, álgebra, cálculo e estatística 2D e 3D',
        description: 'O GeoGebra é uma ferramenta matemática consagrada mundialmente para todos os níveis de educação que reúne geometria, álgebra, planilhas, gráficos, estatística e cálculo em um único pacote fácil de usar.',
        guide_markdown: `### 📐 Guia GeoGebra para Estudantes de Física e Exatas

- **Cálculo II & III:** Excelente para plotar superfícies $z = f(x, y)$, planos tangentes, cones e paraboloides em 3D.
- **Física Experimental:** Uso da planilha interna para ajuste de retas e regressões não lineares com cálculo de incertezas.
- **Geometria Dinâmica:** Simulação de colisões de partículas, vetores velocidade e campos de força.`,
        author_name: 'Equipe GeoGebra',
        category: 'Geometria & Álgebra',
        software_type: 'essencial',
        pricing_type: 'Gratuito',
        platforms: ['Web', 'Windows', 'Linux', 'macOS', 'Android', 'iOS'],
        access_url: 'https://www.geogebra.org/calculator',
        screenshots: [],
        tags: ['geometria', 'cálculo', 'álgebra', 'gráficos-3d', 'matemática', 'física'],
        target_audience: ['Graduação', 'Ensino Médio', 'Docentes'],
        features_list: [
            { title: 'Visualizador 3D Interativo', description: 'Gire gráficos tridimensionais com iluminação e vetores normais.' },
            { title: 'Cálculo Simbólico (CAS)', description: 'Resolva derivadas e integrais simbolicamente de forma visual.' },
            { title: 'Ajuste de Curvas', description: 'Ideal para gráficos de experimentos de laboratório de física.' }
        ],
        status: 'aprovado',
        is_featured: false,
        upvotes_count: 8,
        created_at: '2026-08-31T20:00:00.000Z',
        updated_at: '2026-08-31T20:00:00.000Z'
    },
    {
        id: '44444444-4444-4444-4444-444444444444',
        title: 'Wolfram|Alpha',
        slug: 'wolfram-alpha',
        tagline: 'Mecanismo de inteligência computacional para resolução analítica e passo a passo de física e matemática',
        description: 'O Wolfram|Alpha é uma engine de conhecimento e computação que calcula respostas com base em algoritmos matemáticos avançados e dados científicos com curadoria de especialistas.',
        guide_markdown: `### ⚡ Guia Wolfram|Alpha

- **Integrais Indefinidas e Definidas:** Resolva integrais de funções complexas com passos intermediários detalhados.
- **Equações Diferenciais (EDOs):** Obtenha a solução geral e particular fornecendo condições iniciais.
- **Física Quântica e Eletromagnetismo:** Consulte dados de seções de choque, distribuições de probabilidade e constantes físicas fundamentais.`,
        author_name: 'Wolfram Research',
        category: 'Cálculo & Matemática',
        software_type: 'essencial',
        pricing_type: 'Freemium',
        platforms: ['Web', 'Android', 'iOS'],
        access_url: 'https://www.wolframalpha.com',
        screenshots: [],
        tags: ['cálculo', 'física-teórica', 'edo', 'integrais', 'computação-simbólica'],
        target_audience: ['Graduação', 'Pós-Graduação', 'Pesquisadores'],
        features_list: [
            { title: 'Resoluções Passo a Passo', description: 'Demonstração detalhada de etapas de integração e álgebra.' },
            { title: 'Constantes & Fórmulas Físicas', description: 'Acesso rápido a propriedades de materiais e constantes universais.' },
            { title: 'Gráficos de Funções Complexas', description: 'Mapeamento conforme e superfícies de Riemann.' }
        ],
        status: 'aprovado',
        is_featured: false,
        upvotes_count: 12,
        created_at: '2026-08-31T20:00:00.000Z',
        updated_at: '2026-08-31T20:00:00.000Z'
    },
    {
        id: '55555555-5555-5555-5555-555555555555',
        title: 'Photomath',
        slug: 'photomath',
        tagline: 'Auxiliar de resolução matemática passo a passo e verificação de cálculos por câmera',
        description: 'O Photomath permite escanear problemas matemáticos impressos ou manuscritos usando a câmera do celular, fornecendo explicações passo a passo detalhadas para verificação de estudos.',
        guide_markdown: `### 📱 Guia Photomath

- **Reconhecimento Instantâneo:** Aponte a câmera para folhas de caderno e listas de exercícios.
- **Passos Interativos:** Acompanhe a simplificação algébrica e técnicas de fatoração.
- **Checagem Rápida:** Ideal para verificar cálculos aritméticos e de álgebra linear durante os estudos.`,
        author_name: 'Google LLC / Photomath',
        category: 'Cálculo & Matemática',
        software_type: 'essencial',
        pricing_type: 'Gratuito',
        platforms: ['Android', 'iOS', 'Web'],
        access_url: 'https://photomath.com',
        screenshots: [],
        tags: ['cálculo-básico', 'álgebra', 'matemática', 'mobile', 'estudos'],
        target_audience: ['Graduação', 'Ensino Médio'],
        features_list: [
            { title: 'Reconhecimento OCR de Fórmulas', description: 'Reconhece expressões manuscritas e impressas em cadernos.' },
            { title: 'Múltiplos Métodos de Resolução', description: 'Veja diferentes maneiras de resolver a mesma equação.' },
            { title: 'Gráficos das Soluções', description: 'Compreenda raízes e assíntotas graficamente.' }
        ],
        status: 'aprovado',
        is_featured: false,
        upvotes_count: 5,
        created_at: '2026-08-31T20:00:00.000Z',
        updated_at: '2026-08-31T20:00:00.000Z'
    }
];

// Zod Schemas
const SubmitSoftwareSchema = z.object({
    title: z.string().min(2, 'O título deve ter pelo menos 2 caracteres').max(100, 'Título muito longo'),
    tagline: z.string().min(5, 'A frase resumo deve ter pelo menos 5 caracteres').max(200, 'Frase resumo muito longa'),
    description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres').max(5000, 'Descrição muito longa'),
    author_name: z.string().min(2, 'Nome do autor obrigatório').max(100),
    category: z.string().min(2, 'Categoria é obrigatória'),
    software_type: z.enum(['comunitario', 'essencial']).default('comunitario'),
    pricing_type: z.string().optional().default('Gratuito'),
    platforms: z.array(z.string()).min(1, 'Selecione pelo menos uma plataforma'),
    access_url: z.string().url('URL de acesso inválida'),
    repository_url: z.string().url('URL do repositório inválida').optional().or(z.literal('')),
    docs_url: z.string().url('URL da documentação inválida').optional().or(z.literal('')),
    tags: z.array(z.string()).optional().default([]),
    target_audience: z.array(z.string()).optional().default(['Graduação']),
    guide_markdown: z.string().optional(),
    features_list: z.array(z.object({
        title: z.string(),
        description: z.string()
    })).optional().default([]),
    screenshots: z.array(z.string()).optional().default([])
});

const SoftwareFeedbackSchema = z.object({
    softwareId: z.string().uuid('ID de software inválido'),
    rating: z.number().min(1).max(5).optional(),
    experienceLevel: z.string().optional(),
    comment: z.string().min(3, 'O feedback deve ter no mínimo 3 caracteres').max(3000, 'Feedback muito longo'),
    feedbackType: z.enum(['review', 'bug_report', 'suggestion', 'test_feedback']).default('test_feedback')
});

/**
 * Fetch all softwares with optional filters
 */
export async function fetchAcademicSoftwares(params?: {
    category?: string;
    softwareType?: string;
    query?: string;
    userId?: string;
}): Promise<AcademicSoftware[]> {
    try {
        const supabase = await createServerSupabase();
        
        let queryBuilder = supabase
            .from('academic_softwares')
            .select(`
                *,
                author_profile:profiles!academic_softwares_author_id_fkey(avatar_url, username, full_name, institute)
            `)
            .eq('status', 'aprovado')
            .order('is_featured', { ascending: false })
            .order('upvotes_count', { ascending: false })
            .order('created_at', { ascending: false });

        if (params?.category && params.category !== 'Todos' && params.category !== 'Feitos por Alunos/USP') {
            queryBuilder = queryBuilder.eq('category', params.category);
        }

        if (params?.category === 'Feitos por Alunos/USP' || params?.softwareType === 'comunitario') {
            queryBuilder = queryBuilder.eq('software_type', 'comunitario');
        }

        if (params?.softwareType === 'essencial') {
            queryBuilder = queryBuilder.eq('software_type', 'essencial');
        }

        if (params?.query) {
            queryBuilder = queryBuilder.or(`title.ilike.%${params.query}%,tagline.ilike.%${params.query}%,description.ilike.%${params.query}%,author_name.ilike.%${params.query}%`);
        }

        const { data, error } = await queryBuilder;

        if (error || !data || data.length === 0) {
            // Apply in-memory filtering on curated seed data
            let result = [...CURATED_SOFTWARES_SEED];
            if (params?.category && params.category !== 'Todos' && params.category !== 'Feitos por Alunos/USP') {
                result = result.filter(s => s.category.toLowerCase() === params.category!.toLowerCase());
            }
            if (params?.category === 'Feitos por Alunos/USP' || params?.softwareType === 'comunitario') {
                result = result.filter(s => s.software_type === 'comunitario');
            }
            if (params?.softwareType === 'essencial') {
                result = result.filter(s => s.software_type === 'essencial');
            }
            if (params?.query) {
                const q = params.query.toLowerCase();
                result = result.filter(s => 
                    s.title.toLowerCase().includes(q) ||
                    s.tagline.toLowerCase().includes(q) ||
                    s.description.toLowerCase().includes(q) ||
                    s.author_name.toLowerCase().includes(q) ||
                    s.tags.some(t => t.toLowerCase().includes(q))
                );
            }
            return result;
        }

        // If user logged in, check upvotes
        let userUpvotedIds = new Set<string>();
        if (params?.userId) {
            const { data: upvotes } = await supabase
                .from('software_upvotes')
                .select('software_id')
                .eq('user_id', params.userId);
            if (upvotes) {
                upvotes.forEach(u => userUpvotedIds.add(u.software_id));
            }
        }

        return data.map(item => ({
            ...item,
            has_upvoted: userUpvotedIds.has(item.id)
        }));
    } catch (err) {
        console.error('Erro ao buscar softwares acadêmicos:', err);
        return CURATED_SOFTWARES_SEED;
    }
}

/**
 * Fetch a single software by its unique slug
 */
export async function fetchSoftwareBySlug(slug: string, userId?: string): Promise<AcademicSoftware | null> {
    try {
        const supabase = await createServerSupabase();

        const { data, error } = await supabase
            .from('academic_softwares')
            .select(`
                *,
                author_profile:profiles!academic_softwares_author_id_fkey(avatar_url, username, full_name, institute)
            `)
            .eq('slug', slug)
            .single();

        if (error || !data) {
            const fallback = CURATED_SOFTWARES_SEED.find(s => s.slug === slug);
            return fallback || null;
        }

        let hasUpvoted = false;
        if (userId) {
            const { data: upvote } = await supabase
                .from('software_upvotes')
                .select('id')
                .eq('software_id', data.id)
                .eq('user_id', userId)
                .maybeSingle();
            hasUpvoted = !!upvote;
        }

        return {
            ...data,
            has_upvoted: hasUpvoted
        };
    } catch (err) {
        console.error('Erro ao buscar software por slug:', err);
        const fallback = CURATED_SOFTWARES_SEED.find(s => s.slug === slug);
        return fallback || null;
    }
}

/**
 * Fetch feedbacks/test reports for a given software
 */
export async function fetchSoftwareFeedbacks(softwareId: string): Promise<SoftwareFeedback[]> {
    try {
        const supabase = await createServerSupabase();

        const { data, error } = await supabase
            .from('software_feedbacks')
            .select(`
                *,
                user_profile:profiles!software_feedbacks_user_id_fkey(full_name, username, avatar_url, user_category, institute)
            `)
            .eq('software_id', softwareId)
            .order('created_at', { ascending: false });

        if (error || !data) {
            return [];
        }

        return data;
    } catch (err) {
        console.error('Erro ao buscar feedbacks do software:', err);
        return [];
    }
}

/**
 * Submit a community software
 */
export async function submitSoftware(rawInput: SubmitSoftwareInput) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Você precisa estar conectado para sugerir um software.' };
        }

        const validated = SubmitSoftwareSchema.parse(rawInput);

        const slug = validated.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Math.random().toString(36).substring(2, 6);

        const { data, error } = await supabase
            .from('academic_softwares')
            .insert({
                title: validated.title,
                slug,
                tagline: validated.tagline,
                description: validated.description,
                guide_markdown: validated.guide_markdown || null,
                author_name: validated.author_name,
                author_id: user.id,
                category: validated.category,
                software_type: validated.software_type,
                pricing_type: validated.pricing_type || 'Gratuito',
                platforms: validated.platforms,
                access_url: validated.access_url,
                repository_url: validated.repository_url || null,
                docs_url: validated.docs_url || null,
                screenshots: validated.screenshots || [],
                tags: validated.tags,
                target_audience: validated.target_audience,
                features_list: validated.features_list || [],
                submitted_by: user.id,
                status: 'aprovado' // Publicado diretamente ou pronto para testes
            })
            .select()
            .single();

        if (error) {
            console.error('Erro no insert de software:', error);
            return { success: false, error: 'Erro ao salvar no banco de dados: ' + error.message };
        }

        revalidatePath('/ferramentas/softwares');
        return { success: true, software: data };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return { success: false, error: err.issues?.[0]?.message || 'Dados inválidos.' };
        }
        console.error('Erro inesperado ao enviar software:', err);
        return { success: false, error: 'Erro interno ao processar submissão.' };
    }
}

/**
 * Toggle Upvote for a software
 */
export async function toggleSoftwareUpvote(softwareId: string) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Faça login para curtir softwares.' };
        }

        const { data: existing } = await supabase
            .from('software_upvotes')
            .select('id')
            .eq('software_id', softwareId)
            .eq('user_id', user.id)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('software_upvotes')
                .delete()
                .eq('id', existing.id);

            try {
                await supabase.rpc('decrement_software_upvote', { target_software_id: softwareId });
            } catch {
                // Ignore if RPC does not exist
            }

            revalidatePath('/ferramentas/softwares');
            return { success: true, upvoted: false };
        } else {
            await supabase
                .from('software_upvotes')
                .insert({
                    software_id: softwareId,
                    user_id: user.id
                });

            try {
                await supabase.rpc('increment_software_upvote', { target_software_id: softwareId });
            } catch {
                // Ignore if RPC does not exist
            }

            revalidatePath('/ferramentas/softwares');
            return { success: true, upvoted: true };
        }
    } catch (err) {
        console.error('Erro ao alternar upvote:', err);
        return { success: false, error: 'Não foi possível registrar seu upvote.' };
    }
}

/**
 * Submit feedback or test report for a software
 */
export async function submitSoftwareFeedback(input: {
    softwareId: string;
    rating?: number;
    experienceLevel?: string;
    comment: string;
    feedbackType?: 'review' | 'bug_report' | 'suggestion' | 'test_feedback';
}) {
    try {
        const supabase = await createServerSupabase();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Conecte-se para enviar seu feedback.' };
        }

        const validated = SoftwareFeedbackSchema.parse(input);

        const { data, error } = await supabase
            .from('software_feedbacks')
            .insert({
                software_id: validated.softwareId,
                user_id: user.id,
                rating: validated.rating || null,
                experience_level: validated.experienceLevel || null,
                comment: validated.comment,
                feedback_type: validated.feedbackType
            })
            .select(`
                *,
                user_profile:profiles!software_feedbacks_user_id_fkey(full_name, username, avatar_url, user_category, institute)
            `)
            .single();

        if (error) {
            console.error('Erro ao inserir feedback de software:', error);
            return { success: false, error: 'Erro ao registrar feedback: ' + error.message };
        }

        revalidatePath('/ferramentas/softwares');
        return { success: true, feedback: data };
    } catch (err: any) {
        if (err instanceof z.ZodError) {
            return { success: false, error: err.issues?.[0]?.message || 'Dados inválidos.' };
        }
        console.error('Erro inesperado ao enviar feedback:', err);
        return { success: false, error: 'Erro interno ao salvar feedback.' };
    }
}
