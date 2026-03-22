-- Migration: Add official and public flags to entangled groups
-- Path: ./supabase/migrations/newsqls/20260321_focal_groups.sql

ALTER TABLE entangled_groups 
ADD COLUMN IF NOT EXISTS is_official BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS focal_isotope TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Seed some official focal groups
INSERT INTO entangled_groups (name, is_official, is_public, focal_isotope, description)
VALUES 
('Física de Partículas', true, true, 'Física de Partículas', 'Grupo dedicado ao estudo e discussões sobre o modelo padrão e física subatômica.'),
('Astrofísica & Cosmologia', true, true, 'Astrofísica', 'Explorando as fronteiras do universo, de buracos negros à expansão cósmica.'),
('Fotografia Científica', true, true, 'Fotografia', 'Unindo técnica fotográfica e visualização de dados na ciência.'),
('Educação e Extensão', true, true, 'Educação', 'Debates sobre métodos de ensino de física e divulgação científica.');
