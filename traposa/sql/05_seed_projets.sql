-- 05_seed_projets.sql
-- Seed data for initial content

-- Insert causes/funding categories
INSERT INTO traposa_causes (name, description, icon, goal_amount, raised_amount, display_order) VALUES
('Ijans Imanitè', 'Repon rapid pou kriz imanitè yo', 'AlertTriangle', 500000, 125000, 1),
('Edikasyon Timoun', 'Asire aksè edikasyon pou tout timoun yo', 'BookOpen', 300000, 87000, 2),
('Agrikilti Dirab', 'Sipòte agrikiltè yo ak teknik modèn', 'Sprout', 200000, 45000, 3),
('Sante Kominote', 'Sèvis sante debaz pou kominote vilnerab', 'Heart', 400000, 156000, 4),
('Jeneral TRAPOSA', 'Fonksyònman jeneral òganizasyon an', null, null, 12000, 5);

-- Insert sample projects
INSERT INTO traposa_projets (title, slug, description, category, location, department, beneficiaires, goal_amount, raised_amount, status, is_featured, is_published, display_order) VALUES
('Lekòl Pou Tout — Depatman Nò', 'lekol-pou-tout-no', 'Yon pwogram pou asire 500 timoun nan depatman Nò jwenn aksè a edikasyon de kalite.', 'Edikasyon', 'Cap-Haïtien', 'Nò', 500, 150000, 67000, 'active', true, true, 1),
('Jaden Kominote — Latibonit', 'jaden-kominote-latibonit', 'Kreye jaden kominote pou 200 fanmi nan Latibonit pou asire sekirite alimantè.', 'Agrikilti', 'Gonaïves', 'Atibonit', 200, 80000, 34000, 'active', true, true, 2),
('Klinik Mobil — Sid', 'klinik-mobil-sid', 'Yon klinik mobil ki bay sèvis sante pou 1000+ moun nan zòn izole depatman Sid.', 'Sante', 'Les Cayes', 'Sid', 1200, 200000, 156000, 'active', true, true, 3),
('Pwogram Ijans — Tranbleman Tè', 'pwogram-ijans-tranble', 'Distribisyon manje, dlo, ak materyèl abri pou 3000 fanmi viktim yo.', 'Ijans', 'Pòtoprens', 'Lwès', 3000, 500000, 125000, 'active', false, true, 4),
('Reboisement Grandans', 'reboisement-grandans', 'Pwogram pou plante 50,000 pye bwa nan depatman Grandans pou konbat degradasyon anviwonman an.', 'Anviwonman', 'Jérémie', 'Grandans', 1500, 120000, 45000, 'active', false, true, 5),
('Sant Teknik Pwofesyonèl', 'sant-teknik-pwofesyonel', 'Konstrwi yon sant pou fòmasyon teknik jèn nan zafè konstwiksyon, elektrik, ak enfòmatik.', 'Edikasyon', 'Hinche', 'Centre', 800, 250000, 89000, 'planning', false, true, 6);

-- Insert sample news articles
INSERT INTO traposa_actualites (title, slug, content, excerpt, cover_image_url, category, is_published, published_at) VALUES
('TRAPOSA rive bay 1000 timoun manje chak jou nan Pòtoprens', 'traposa-manje-timoun', 
'<p>Gras ak sipò partenè nou yo, TRAPOSA rive bay 1000 timoun manje chak jou nan 5 kominote Pòtoprens.</p>
<p>Pwogram "Manje pou Lavi" lanse an 2024 kounye a rive nan 5 kominote diferan nan kapital la, kote nou bay plis pase 1000 timoun yon manje nwitrisyonèl chak jou lekòl.</p>
<p>"Sa chanje lavi mwen," di Marie-Claire, yon manman ki gen twa timoun nan pwogram nan. "Mwen pa konn kijan pou m ta te fè san èd sa a."</p>
<p>Pwogram nan kontinye grandi ak sipò donatè nou yo. Chak dola bay dirèkteman nan achte manje lokal ak anboche kizinyè kominotè.</p>',
'TRAPOSA rive bay 1000 timoun manje chak jou nan 5 kominote Pòtoprens.', 
null, 'siksè', true, now() - interval '2 days'),

('Ijans: TRAPOSA repon a inondasyon nan Depatman Sid la', 'traposa-inondasyon-sid', 
'<p>Ekip TRAPOSA yo deplwaye nan Depatman Sid la pou ede fanmi yo ki pèdi kay yo akoz inondasyon.</p>
<p>Apre lapli ki te tonbe pandan twa jou, plis pase 500 kay endomaje nan kominote Sid. Ekip nou yo deplwaye ak materyèl dijans: dlo pwòp, manje, matla, ak twal.</p>
<p>Nou bezwen sipò ou pou ede plis fanmi. Fè yon don kounye a pou ede nou achte plis materyèl ijans.</p>',
'Ekip TRAPOSA yo deplwaye nan Depatman Sid pou ede fanmi ki pèdi kay yo.', 
null, 'ijan', true, now() - interval '5 days'),

('Nouvo partenariat ak UNESCO pou edikasyon an Ayiti', 'partenariat-unesco', 
'<p>TRAPOSA ak UNESCO siyen yon akò kolaborasyon pou amelyore kalite edikasyon nan 20 lekòl.</p>
<p>Patenarya sa a pral pèmèt nou:</p>
<ul>
<li>Rekrite ak fòme 100 pwofesè ankò</li>
<li>Biblikotek nan 20 lekòl</li>
<li>Sal òdinatè ak aksè entènèt</li>
<li>Pwogram alfabetizasyon pou granmoun</li>
</ul>
<p>Prezidan Direktwa TRAPOSA a di: "Se yon etap enpòtan nan misyon nou pou transfòme edikasyon an Ayiti."</p>',
'TRAPOSA ak UNESCO siyen akò kolaborasyon pou amelyore kalite edikasyon.', 
null, 'partenariat', true, now() - interval '10 days'),

('Rapò Anyèl 2024: Yon Lane Pwogrè', 'rapò-anyel-2024', 
'<p>Gade rezilta nou yo pou ane 2024 ak objektif nou pou 2025.</p>
<p>Lane 2024 te yon lane pwogrè pou TRAPOSA. Men kèk chif kle:</p>
<ul>
<li>12,450 moun resevwa èd dirèkteman</li>
<li>48 pwogram aktif nan 10 depatman</li>
<li>500+ bénévòl angaje nan teren</li>
<li>2.5 milyon goud kolekte nan don</li>
</ul>
<p>Mèsi a tout donatè, patnè, ak bénévòl nou yo ki fè sa posib!</p>',
'Gade rezilta nou yo pou ane 2024 ak objektif nou pou 2025.', 
null, 'rapò', true, now() - interval '15 days');

-- Insert sample team members
INSERT INTO traposa_equipe (full_name, role, bio, department, email, is_active, display_order) VALUES
('Dr. Claire Beaumont', 'Direktris Egzekitif', 'Ekspè sante piblik ak 15 an eksperyans nan sektè imanitè a. Ancienn Direktris Pwogram pou Oganizasyon Entènasyonal Sante.', 'Direksyon', 'claire.beaumont@traposa.ht', true, 1),
('Jean-Michel Toussaint', 'Direktè Pwogram', 'Spesyalis devlopman kominote ak fòmasyon an agrikilti dirab. 10 zan eksperyans nan jesyon pwofe rural.', 'Pwogram', 'jmtoussaint@traposa.ht', true, 2),
('Sophie Laroche', 'Kòdinatris Kominikasyon', 'Jounalis ak ekspè kominikasyon pou òganizasyon sosyal. Ancienn korespondan pou radyo entènasyonal.', 'Kominikasyon', 'sophie.laroche@traposa.ht', true, 3),
('Marc-Antoine Jean', 'Koòdonatè Finans', 'Ekspè kontablite ak jesyon fon. Sètifiye CPA ak eksperyans nan òganizasyon san bi likratif.', 'Finans', 'ma.jean@traposa.ht', true, 4),
('Dr. Rose-Marie Joseph', 'Direktris Sante', 'Doktè ak espesyalis sante kominotè. 8 ane eksperyans nan klinik mobil ak pwogram sante prevantif.', 'Sante', 'rm.joseph@traposa.ht', true, 5);

-- Insert sample partners
INSERT INTO traposa_partenaires (name, logo_url, website_url, category, description, is_active, display_order) VALUES
('UNICEF Ayiti', null, 'https://www.unicef.org/haiti', 'Entènasyonal', 'Patnè estratejik pou pwogram edikasyon ak sante timoun.', true, 1),
('Ministè Edikasyon Ayiti', null, 'https://www.menfp.gouv.ht', 'Gouvènman', 'Kolaborasyon pou amelyore enfrastrikti lekòl ak fòmasyon pwofesè.', true, 2),
('Fondasyon Ayiti Demen', null, 'https://example.com', 'Fondasyon', 'Sipò finansye pou pwogram agrikilti ak developman kominote.', true, 3),
('Digicel Fondasyon', null, 'https://www.digicelfoundation.com', 'Koperativ', 'Patnè teknik pou konektivite nan lekòl yo.', true, 4),
('USAID Ayiti', null, 'https://www.usaid.gov/haiti', 'Entènasyonal', 'Sipò pou pwogram ijans imanitè ak rekonstriksyon.', true, 5);

-- Insert default settings (admin-managed statistics)
INSERT INTO traposa_settings (key, value, description) VALUES
('stat_beneficiaires', '12450', 'Kantite total moun ki benefisye sèvis TRAPOSA'),
('stat_projets', '48', 'Kantite pwojè aktif kounye a'),
('stat_benevoles', '500', 'Kantite bénévòl aktif'),
('stat_dons_total', '450000', 'Kantite total lajan kolekte (an goud)'),
('stat_komin', '23', 'Kantite komin kote TRAPOSA ap travay'),
('stat_experience', '10', 'Lane eksperyans TRAPOSA'),
('org_name', 'TRAPOSA', 'Non òganizasyon an'),
('org_tagline', 'TRANSFORMER pour Sauver', 'Slogan òganizasyon an'),
('contact_email', 'info@traposa.ht', 'Imèl kontak prensipal'),
('contact_phone', '+509 2813-4567', 'Telefòn kontak'),
('contact_address', 'Rue Capois, Pòtoprens, Ayiti', 'Adrès fizik'),
('moncash_number', '+509 1234-5678', 'Nimewo MonCash pou don'),
('natcash_number', '+509 8765-4321', 'Nimewo NatCash pou don'),
('bank_name', 'Sogebank', 'Non bank'),
('bank_account', '1234567890', 'Kont bank'),
('social_facebook', 'https://facebook.com/traposa', 'Facebook URL'),
('social_instagram', 'https://instagram.com/traposa', 'Instagram URL'),
('social_twitter', 'https://twitter.com/traposa', 'Twitter URL'),
('social_youtube', 'https://youtube.com/traposa', 'YouTube URL');
