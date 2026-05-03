-- 06_seed_donations.sql
-- Seed sample donations for testing

INSERT INTO traposa_donations (donor_name, donor_email, donor_phone, amount, currency, payment_method, cause_name, status, is_anonymous, created_at) VALUES
('Marie-Claire Baptiste', 'marieclaire@email.com', '+509 34 12 34 56', 1000, 'HTG', 'moncash', 'Edikasyon Timoun', 'confirmed', false, now() - interval '1 hour'),
('Robert Destine', 'robert@email.com', '+509 31 56 78 90', 50, 'USD', 'paypal', 'Ijans Imanitè', 'confirmed', false, now() - interval '3 hours'),
(null, null, '+509 37 89 01 23', 500, 'HTG', 'natcash', 'Jeneral TRAPOSA', 'confirmed', true, now() - interval '5 hours'),
('Anne-Marie Jolicoeur', 'annemarie@email.com', null, 25, 'USD', 'stripe', 'Agrikilti Dirab', 'confirmed', false, now() - interval '8 hours'),
('Jean-Pierre Louis', 'jplouis@email.com', '+509 38 45 67 89', 2000, 'HTG', 'moncash', 'Sante Kominote', 'confirmed', false, now() - interval '12 hours'),
(null, 'anonymous@email.com', null, 100, 'USD', 'stripe', 'Edikasyon Timoun', 'confirmed', true, now() - interval '1 day'),
('Marie Michelle', 'mmichelle@email.com', '+509 36 78 90 12', 1500, 'HTG', 'moncash', 'Ijans Imanitè', 'confirmed', false, now() - interval '1 day' - interval '2 hours'),
('Daniel Charles', 'daniel@email.com', null, 75, 'USD', 'paypal', 'Jeneral TRAPOSA', 'confirmed', false, now() - interval '2 days'),
('Françoise Duvalier', 'francoise@email.com', '+509 32 34 56 78', 3000, 'HTG', 'natcash', 'Sante Kominote', 'pending', false, now() - interval '2 days' - interval '4 hours'),
(null, null, '+509 39 12 34 56', 800, 'HTG', 'moncash', 'Agrikilti Dirab', 'confirmed', true, now() - interval '3 days'),
('Luc Pierre', 'lucpierre@email.com', '+509 35 67 89 01', 40, 'USD', 'stripe', 'Edikasyon Timoun', 'confirmed', false, now() - interval '3 days' - interval '6 hours'),
('Catherine Moïse', 'catherine@email.com', null, 5000, 'HTG', 'moncash', 'Ijans Imanitè', 'confirmed', false, now() - interval '4 days'),
('Patrick Alexis', 'patrick@email.com', '+509 33 45 67 89', 20, 'USD', 'paypal', 'Sante Kominote', 'confirmed', false, now() - interval '4 days' - interval '3 hours'),
(null, 'donor@email.com', null, 1200, 'HTG', 'natcash', 'Jeneral TRAPOSA', 'confirmed', true, now() - interval '5 days'),
('Sophie Bernard', 'sophieb@email.com', '+509 38 90 12 34', 60, 'USD', 'stripe', 'Agrikilti Dirab', 'confirmed', false, now() - interval '5 days' - interval '5 hours');
