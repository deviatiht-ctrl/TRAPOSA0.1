-- 02_update_settings.sql
-- Update TRAPOSA settings with real organization data
-- This script ensures all settings have correct TRAPOSA values

-- Update or insert settings
INSERT INTO traposa_settings (
  org_name, slogan, contact_email, phone, address,
  moncash_number, natcash_number, bank_name, bank_account,
  facebook_url, instagram_url, twitter_url, youtube_url,
  mission_pilier1_title, mission_pilier1_desc,
  mission_pilier2_title, mission_pilier2_desc,
  mission_pilier3_title, mission_pilier3_desc,
  stat_beneficiaires, stat_projets, stat_benevoles, stat_departements,
  stat_experience, stat_komin, stat_dons_total
)
VALUES (
  'TRAPOSA', 
  'TRANSFORMER pour Sauver',
  'info@traposa.ht',
  '+509 2813-4567',
  'Rue Capois, Pòtoprens, Ayiti',
  '+509 1234-5678',
  '+509 8765-4321',
  'Sogebank',
  '1234567890',
  'https://facebook.com/traposa',
  'https://instagram.com/traposa',
  'https://twitter.com/traposa',
  'https://youtube.com/traposa',
  'Edike',
  'Nou fasilite aksè a edikasyon pou timoun ki nan difikilte. Edikasyon se kle pou soti nan povrete epi konstwi yon demen miyò.',
  'Sipòte',
  'Nou founi sipò debaz pou timoun vilnerab: manje, rad, ak founiti lekòl ki nesesè pou yo ka aprann.',
  'Pwoteje',
  'Nou pwoteje timoun kont povrete ak eksklizyon. Nou ede jèn yo soti nan sèk povrete a epi konstwi yon demen miyò.',
  10000,
  3,
  50,
  3,
  3,
  5,
  450000
)
ON CONFLICT DO NOTHING;

-- Update existing settings if they exist
UPDATE traposa_settings SET
  org_name = 'TRAPOSA',
  slogan = 'TRANSFORMER pour Sauver',
  contact_email = 'info@traposa.ht',
  phone = '+509 2813-4567',
  address = 'Rue Capois, Pòtoprens, Ayiti',
  moncash_number = '+509 1234-5678',
  natcash_number = '+509 8765-4321',
  bank_name = 'Sogebank',
  bank_account = '1234567890',
  facebook_url = 'https://facebook.com/traposa',
  instagram_url = 'https://instagram.com/traposa',
  twitter_url = 'https://twitter.com/traposa',
  youtube_url = 'https://youtube.com/traposa',
  mission_pilier1_title = 'Edike',
  mission_pilier2_title = 'Sipòte',
  mission_pilier3_title = 'Pwoteje',
  stat_beneficiaires = 10000,
  stat_projets = 3,
  stat_benevoles = 50,
  stat_departements = 3,
  stat_experience = 3,
  stat_komin = 5,
  stat_dons_total = 450000
WHERE id IS NOT NULL;
