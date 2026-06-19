ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cultural_language TEXT DEFAULT 'jovem';
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS needs_moderation_help BOOLEAN DEFAULT false;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS language_register TEXT DEFAULT 'jovem';
