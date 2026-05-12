-- 05_seed_projets.sql
-- Seed data for initial content

-- Insert causes/funding categories
INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order) VALUES
('Ijans Imanitè', 'Repon rapid pou kriz imanitè yo', 'AlertTriangle', 500000, 125000, 1),
('Edikasyon Timoun', 'Asire aksè edikasyon pou tout timoun yo', 'BookOpen', 300000, 87000, 2),
('Agrikilti Dirab', 'Sipòte agrikiltè yo ak teknik modèn', 'Sprout', 200000, 45000, 3),
('Sante Kominote', 'Sèvis sante debaz pou kominote vilnerab', 'Heart', 400000, 156000, 4),
('Jeneral TRAPOSA', 'Fonksyònman jeneral òganizasyon an', null, null, 12000, 5);

-- Insert real TRAPOSA projects (handle duplicates)
INSERT INTO traposa_projets (title, slug, description, category, location, department, beneficiaires, goal_amount, raised_amount, status, is_featured, is_published, display_order) VALUES
('Restriktirasyion Lekòl Nasyonal Bè-de-En', 'restriktirasyion-lekol-be-de-en', 'Restriktire lekòl nasyonal Bè-de-En pou bay plis timoun aksè a edikasyon nan depatman Nòdwès.', 'Edikasyon', 'Baie-de-Henne', 'Nòdwès', 850, 1000000, 700000, 'active', true, true, 1),
('Sipò Timoun Vilnerab — Nòdwès', 'sipo-timoun-vilnerab-nodwes', 'Pwogram sipò pou timoun vilnerab nan depatman Nòdwès: manje, rad, ak founiti lekòl.', 'Edikasyon', 'Depatman Nòdwès', 'Nòdwès', 1200, 300000, 180000, 'active', true, true, 2),
('Pwogram Edikasyon Pou Tout', 'pwogram-edikasyon-pou-tout', 'Elaji aksè a edikasyon pou timoun vilnerab nan plizyè depatman Ayiti.', 'Edikasyon', 'Plizyè Depatman', 'Nasyonal', 8000, 200000, 85000, 'active', true, true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert real TRAPOSA news articles (handle duplicates)
INSERT INTO traposa_actualites (title, slug, content, excerpt, cover_image_url, category, is_published, published_at) VALUES
('Lekòl nasyonal Bè-de-En restriktire grasa TRAPOSA', 'lekol-be-de-en-restriktire', 
'<p>TRAPOSA reyisi restriktire lekòl nasyonal Bè-de-En nan depatman Nòdwès, ki bay plis timoun aksè a edikasyon de kalite.</p>
<p>Pwojè sa a, youn nan pi enpòtan nou yo, te pèmèt nou amelyore enfrastrikti lekòl la epi asire yon anviwonman aprantisaj sekirize pou timoun nan zòn nan.</p>
<p>"Se yon moman istwa pou kominote nou an," di yon responsab lokal. "Kounye a timoun nou yo ka aprann nan yon espas ki diy."</p>
<p>Travay la te fèt ak sipò kominote Bè-de-En ak kontribisyon donatè nou yo.</p>',
'TRAPOSA reyisi restriktire lekòl nasyonal Bè-de-En nan depatman Nòdwès.', 
null, 'siksè', true, now() - interval '2 days'),

('Plis pase 10,000 timoun benefisye pwogram TRAPOSA an', 'dis-mil-timoun-traposa', 
'<p>Depi 2022-2023, TRAPOSA rive ede plis pase 10,000 timoun vilnerab nan plizyè depatman Ayiti.</p>
<p>Pwogram nou yo kouvri edikasyon, asistans sosyal, ak sipò debaz pou timoun ki nan difikilte. Rezilta sa yo posib grasa travay ekip nou yo ak jenerozite donatè nou yo.</p>
<p>Objektif nou pou ane pwochèn se elaji pwogram nan pou jwenn plis timoun toujou nan tout peyi a.</p>',
'Depi 2022-2023, TRAPOSA rive ede plis pase 10,000 timoun vilnerab nan plizyè depatman Ayiti.', 
null, 'rapò', true, now() - interval '7 days'),

('Djina Guillet Delatour apiye TRAPOSA ak don espesyal', 'djina-guillet-delatour-don', 
'<p>Otè Djina Guillet Delatour voye yon pati nan resèt liv li bay TRAPOSA pou soutni timoun ki nan bezwen ann Ayiti.</p>
<p>Jès jenere sa a pèmèt TRAPOSA kontinye travay li pou timoun vilnerab yo. Djina, ki se yon Ayisyen ki kwè nan pouvwa edikasyon, chwazi TRAPOSA kòm patnè pou enpak li.</p>
<p>"Chak timoun merite yon chans," di Djina. "M espere don sa a ka ede yo reyalize rèv yo."</p>',
'Otè Djina Guillet Delatour voye yon pati nan resèt liv li bay TRAPOSA pou soutni timoun ki nan bezwen.', 
null, 'partenariat', true, now() - interval '14 days')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample team members (handle duplicates)
INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order) VALUES
('Dr. Claire Beaumont', 'Direktris Egzekitif', 'Ekspè sante piblik ak 15 an eksperyans nan sektè imanitè a. Ancienn Direktris Pwogram pou Oganizasyon Entènasyonal Sante.', 'Direksyon', 'claire.beaumont@traposa.ht', true, 1),
('Jean-Michel Toussaint', 'Direktè Pwogram', 'Spesyalis devlopman kominote ak fòmasyon an agrikilti dirab. 10 zan eksperyans nan jesyon pwofe rural.', 'Pwogram', 'jmtoussaint@traposa.ht', true, 2),
('Sophie Laroche', 'Kòdinatris Kominikasyon', 'Jounalis ak ekspè kominikasyon pou òganizasyon sosyal. Ancienn korespondan pou radyo entènasyonal.', 'Kominikasyon', 'sophie.laroche@traposa.ht', true, 3),
('Marc-Antoine Jean', 'Koòdonatè Finans', 'Ekspè kontablite ak jesyon fon. Sètifiye CPA ak eksperyans nan òganizasyon san bi likratif.', 'Finans', 'ma.jean@traposa.ht', true, 4),
('Dr. Rose-Marie Joseph', 'Direktris Sante', 'Doktè ak espesyalis sante kominotè. 8 ane eksperyans nan klinik mobil ak pwogram sante prevantif.', 'Sante', 'rm.joseph@traposa.ht', true, 5)
ON CONFLICT (email) DO NOTHING;

-- Insert real TRAPOSA partners (handle duplicates)
INSERT INTO traposa_partenaires (name, logo_url, website_url, category, description, is_active, display_order) VALUES
('Djina Guillet Delatour', null, null, 'Donatè', 'Otè ki apiye TRAPOSA — yon pati nan resèt liv li ale dirèkteman bay timoun ki nan bezwen.', true, 1),
('Kominote Bè-de-En', null, null, 'Kominote', 'Kominote lokal ki travay ansanm ak TRAPOSA pou amelyore edikasyon nan zòn nan.', true, 2),
('Inisyativ Solidè', null, null, 'Finansye', 'Patnè ki kontribye nan finanse pwogram sipò timoun vilnerab yo.', true, 3)
ON CONFLICT (name) DO NOTHING;

-- Update default settings with real organization data
UPDATE traposa_settings SET
  org_name          = 'TRAPOSA',
  slogan            = 'TRANSFORMER pour Sauver',
  contact_email     = 'info@traposa.ht',
  phone             = '+509 2813-4567',
  address           = 'Rue Capois, Pòtoprens, Ayiti',
  moncash_number    = '+509 1234-5678',
  natcash_number    = '+509 8765-4321',
  bank_name         = 'Sogebank',
  bank_account      = '1234567890',
  facebook_url      = 'https://facebook.com/traposa',
  instagram_url     = 'https://instagram.com/traposa',
  twitter_url       = 'https://twitter.com/traposa',
  youtube_url       = 'https://youtube.com/traposa',
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
WHERE id = (SELECT id FROM traposa_settings LIMIT 1);

-- If no settings exist, insert with values
INSERT INTO traposa_settings (
  org_name, slogan, contact_email, phone, address,
  moncash_number, natcash_number, bank_name, bank_account,
  facebook_url, instagram_url, twitter_url, youtube_url,
  mission_pilier1_title, mission_pilier2_title, mission_pilier3_title,
  stat_beneficiaires, stat_projets, stat_benevoles, stat_departements,
  stat_experience, stat_komin, stat_dons_total
)
SELECT
  'TRAPOSA', 'TRANSFORMER pour Sauver', 'info@traposa.ht', '+509 2813-4567', 'Rue Capois, Pòtoprens, Ayiti',
  '+509 1234-5678', '+509 8765-4321', 'Sogebank', '1234567890',
  'https://facebook.com/traposa', 'https://instagram.com/traposa', 'https://twitter.com/traposa', 'https://youtube.com/traposa',
  'Edike', 'Sipòte', 'Pwoteje',
  10000, 3, 50, 3, 3, 5, 450000
WHERE NOT EXISTS (SELECT 1 FROM traposa_settings);
