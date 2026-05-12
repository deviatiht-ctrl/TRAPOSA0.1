-- 03_seed_data_safe.sql
-- Insert TRAPOSA seed data safely (handles duplicates)
-- This script will not fail if data already exists

-- Insert causes (safe)
INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order)
SELECT 'Ijans Imanitè', 'Repon rapid pou kriz imanitè yo', 'AlertTriangle', 500000, 125000, 1
WHERE NOT EXISTS (SELECT 1 FROM traposa_causes WHERE name = 'Ijans Imanitè');

INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order)
SELECT 'Edikasyon Timoun', 'Asire aksè edikasyon pou tout timoun yo', 'BookOpen', 300000, 87000, 2
WHERE NOT EXISTS (SELECT 1 FROM traposa_causes WHERE name = 'Edikasyon Timoun');

INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order)
SELECT 'Agrikilti Dirab', 'Sipòte agrikiltè yo ak teknik modèn', 'Sprout', 200000, 45000, 3
WHERE NOT EXISTS (SELECT 1 FROM traposa_causes WHERE name = 'Agrikilti Dirab');

INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order)
SELECT 'Sante Kominote', 'Sèvis sante debaz pou kominote vilnerab', 'Heart', 400000, 156000, 4
WHERE NOT EXISTS (SELECT 1 FROM traposa_causes WHERE name = 'Sante Kominote');

INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order)
SELECT 'Jeneral TRAPOSA', 'Fonksyònman jeneral òganizasyon an', null, null, 12000, 5
WHERE NOT EXISTS (SELECT 1 FROM traposa_causes WHERE name = 'Jeneral TRAPOSA');

-- Insert projects (safe)
INSERT INTO traposa_projets (title, slug, description, category, location, department, beneficiaires, goal_amount, raised_amount, status, is_featured, is_published, display_order)
SELECT 'Restriktirasyion Lekòl Nasyonal Bè-de-En', 'restriktirasyion-lekol-be-de-en', 'Restriktire lekòl nasyonal Bè-de-En pou bay plis timoun aksè a edikasyon nan depatman Nòdwès.', 'Edikasyon', 'Baie-de-Henne', 'Nòdwès', 850, 1000000, 700000, 'active', true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM traposa_projets WHERE slug = 'restriktirasyion-lekol-be-de-en');

INSERT INTO traposa_projets (title, slug, description, category, location, department, beneficiaires, goal_amount, raised_amount, status, is_featured, is_published, display_order)
SELECT 'Sipò Timoun Vilnerab — Nòdwès', 'sipo-timoun-vilnerab-nodwes', 'Pwogram sipò pou timoun vilnerab nan depatman Nòdwès: manje, rad, ak founiti lekòl.', 'Edikasyon', 'Depatman Nòdwès', 'Nòdwès', 1200, 300000, 180000, 'active', true, true, 2
WHERE NOT EXISTS (SELECT 1 FROM traposa_projets WHERE slug = 'sipo-timoun-vilnerab-nodwes');

INSERT INTO traposa_projets (title, slug, description, category, location, department, beneficiares, goal_amount, raised_amount, status, is_featured, is_published, display_order)
SELECT 'Pwogram Edikasyon Pou Tout', 'pwogram-edikasyon-pou-tout', 'Elaji aksè a edikasyon pou timoun vilnerab nan plizyè depatman Ayiti.', 'Edikasyon', 'Plizyè Depatman', 'Nasyonal', 8000, 200000, 85000, 'active', true, true, 3
WHERE NOT EXISTS (SELECT 1 FROM traposa_projets WHERE slug = 'pwogram-edikasyon-pou-tout');

-- Insert articles (safe)
INSERT INTO traposa_actualites (title, slug, content, excerpt, cover_image_url, category, is_published, published_at)
SELECT 'Lekòl nasyonal Bè-de-En restriktire grasa TRAPOSA', 'lekol-be-de-en-restriktire', 
'<p>TRAPOSA reyisi restriktire lekòl nasyonal Bè-de-En nan depatman Nòdwès, ki bay plis timoun aksè a edikasyon de kalite.</p>',
'TRAPOSA reyisi restriktire lekòl nasyonal Bè-de-En nan depatman Nòdwès.', 
null, 'siksè', true, now() - interval '2 days'
WHERE NOT EXISTS (SELECT 1 FROM traposa_actualites WHERE slug = 'lekol-be-de-en-restriktire');

INSERT INTO traposa_actualites (title, slug, content, excerpt, cover_image_url, category, is_published, published_at)
SELECT 'Plis pase 10,000 timoun benefisye pwogram TRAPOSA an', 'dis-mil-timoun-traposa', 
'<p>Depi 2022-2023, TRAPOSA rive ede plis pase 10,000 timoun vilnerab nan plizyè depatman Ayiti.</p>',
'Depi 2022-2023, TRAPOSA rive ede plis pase 10,000 timoun vilnerab nan plizyè depatman Ayiti.', 
null, 'rapò', true, now() - interval '7 days'
WHERE NOT EXISTS (SELECT 1 FROM traposa_actualites WHERE slug = 'dis-mil-timoun-traposa');

INSERT INTO traposa_actualites (title, slug, content, excerpt, cover_image_url, category, is_published, published_at)
SELECT 'Djina Guillet Delatour apiye TRAPOSA ak don espesyal', 'djina-guillet-delatour-don', 
'<p>Otè Djina Guillet Delatour voye yon pati nan resèt liv li bay TRAPOSA pou soutni timoun ki nan bezwen ann Ayiti.</p>',
'Otè Djina Guillet Delatour voye yon pati nan resèt liv li bay TRAPOSA pou soutni timoun ki nan bezwen.', 
null, 'partenariat', true, now() - interval '14 days'
WHERE NOT EXISTS (SELECT 1 FROM traposa_actualites WHERE slug = 'djina-guillet-delatour-don');

-- Insert team members (safe)
INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order)
SELECT 'Dr. Claire Beaumont', 'Direktris Egzekitif', 'Ekspè sante piblik ak 15 an eksperyans nan sektè imanitè a.', 'Direksyon', 'claire.beaumont@traposa.ht', true, 1
WHERE NOT EXISTS (SELECT 1 FROM traposa_equipe WHERE email = 'claire.beaumont@traposa.ht');

INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order)
SELECT 'Jean-Michel Toussaint', 'Direktè Pwogram', 'Spesyalis devlopman kominote ak fòmasyon an agrikilti dirab. 10 zan eksperyans.', 'Pwogram', 'jmtoussaint@traposa.ht', true, 2
WHERE NOT EXISTS (SELECT 1 FROM traposa_equipe WHERE email = 'jmtoussaint@traposa.ht');

INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order)
SELECT 'Sophie Laroche', 'Kòdinatris Kominikasyon', 'Jounalis ak ekspè kominikasyon pou òganizasyon sosyal.', 'Kominikasyon', 'sophie.laroche@traposa.ht', true, 3
WHERE NOT EXISTS (SELECT 1 FROM traposa_equipe WHERE email = 'sophie.laroche@traposa.ht');

INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order)
SELECT 'Marc-Antoine Jean', 'Koòdonatè Finans', 'Ekspè kontablite ak jesyon fon. Sètifiye CPA.', 'Finans', 'ma.jean@traposa.ht', true, 4
WHERE NOT EXISTS (SELECT 1 FROM traposa_equipe WHERE email = 'ma.jean@traposa.ht');

INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order)
SELECT 'Dr. Rose-Marie Joseph', 'Direktris Sante', 'Doktè ak espesyalis sante kominotè.', 'Sante', 'rm.joseph@traposa.ht', true, 5
WHERE NOT EXISTS (SELECT 1 FROM traposa_equipe WHERE email = 'rm.joseph@traposa.ht');

-- Insert partners (safe)
INSERT INTO traposa_partenaires (name, logo_url, website_url, category, description, is_active, display_order)
SELECT 'Djina Guillet Delatour', null, null, 'Donatè', 'Otè ki apiye TRAPOSA — yon pati nan resèt liv li ale dirèkteman bay timoun ki nan bezwen.', true, 1
WHERE NOT EXISTS (SELECT 1 FROM traposa_partenaires WHERE name = 'Djina Guillet Delatour');

INSERT INTO traposa_partenaires (name, logo_url, website_url, category, description, is_active, display_order)
SELECT 'Kominote Bè-de-En', null, null, 'Kominote', 'Kominote lokal ki travay ansanm ak TRAPOSA pou amelyore edikasyon nan zòn nan.', true, 2
WHERE NOT EXISTS (SELECT 1 FROM traposa_partenaires WHERE name = 'Kominote Bè-de-En');

INSERT INTO traposa_partenaires (name, logo_url, website_url, category, description, is_active, display_order)
SELECT 'Inisyativ Solidè', null, null, 'Finansye', 'Patnè ki kontribye nan finanse pwogram sipò timoun vilnerab yo.', true, 3
WHERE NOT EXISTS (SELECT 1 FROM traposa_partenaires WHERE name = 'Inisyativ Solidè');
