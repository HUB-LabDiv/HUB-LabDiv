-- [2026-03-26] Geração de Aluno de Teste: Bento Silva
-- 1. Criar Usuário em Auth
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES (
  'd475583b-e381-424a-93a1-1234567890ab', 
  'bento.teste@usp.br', 
  '{"full_name": "Bento Silva (Teste)", "avatar_url": "https://api.dicebear.com/7.x/avataaars/svg?seed=Bento"}'
) ON CONFLICT (id) DO NOTHING;

-- 2. Atualizar Perfil Público com Dados de IC
UPDATE public.profiles SET
  user_category = 'aluno_usp',
  course = 'Bacharelado em Física',
  institute = 'IFUSP',
  seeking_ic = true,
  ic_research_area = 'Física Teórica - Cosmologia',
  ic_preferred_department = 'FMA',
  ic_preferred_lab = 'Grupo de Teoria de Campo',
  ic_letter_of_interest = 'Tenho grande interesse em processamento de dados astronômicos e simulações de N-corpos. Busco minha primeira IC para aplicar conceitos de relatividade geral no estudo de buracos negros primordiais.',
  review_status = 'approved',
  is_visible = true,
  xp = 250,
  level = 5,
  is_usp_member = true
WHERE id = 'd475583b-e381-424a-93a1-1234567890ab';
