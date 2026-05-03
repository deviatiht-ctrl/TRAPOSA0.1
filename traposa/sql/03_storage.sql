-- 03_storage.sql
-- Storage buckets and policies for file uploads

-- Create storage buckets for different content types
INSERT INTO storage.buckets (id, name, public) VALUES
  ('traposa-projets', 'traposa-projets', true),
  ('traposa-actualites', 'traposa-actualites', true),
  ('traposa-equipe', 'traposa-equipe', true),
  ('traposa-partenaires', 'traposa-partenaires', true),
  ('traposa-settings', 'traposa-settings', true);

-- Storage policies for projects bucket
CREATE POLICY "traposa_projets_read" ON storage.objects FOR SELECT 
  USING (bucket_id = 'traposa-projets');

CREATE POLICY "traposa_projets_admin_write" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'traposa-projets' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

CREATE POLICY "traposa_projets_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'traposa-projets' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

-- Storage policies for news/articles bucket
CREATE POLICY "traposa_actualites_read" ON storage.objects FOR SELECT 
  USING (bucket_id = 'traposa-actualites');

CREATE POLICY "traposa_actualites_admin_write" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'traposa-actualites' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

CREATE POLICY "traposa_actualites_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'traposa-actualites' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

-- Storage policies for team bucket
CREATE POLICY "traposa_equipe_read" ON storage.objects FOR SELECT 
  USING (bucket_id = 'traposa-equipe');

CREATE POLICY "traposa_equipe_admin_write" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'traposa-equipe' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

CREATE POLICY "traposa_equipe_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'traposa-equipe' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

-- Storage policies for partners bucket
CREATE POLICY "traposa_partenaires_read" ON storage.objects FOR SELECT 
  USING (bucket_id = 'traposa-partenaires');

CREATE POLICY "traposa_partenaires_admin_write" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'traposa-partenaires' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

CREATE POLICY "traposa_partenaires_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'traposa-partenaires' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

-- Storage policies for settings bucket
CREATE POLICY "traposa_settings_read" ON storage.objects FOR SELECT 
  USING (bucket_id = 'traposa-settings');

CREATE POLICY "traposa_settings_admin_write" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'traposa-settings' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));

CREATE POLICY "traposa_settings_admin_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'traposa-settings' AND EXISTS (
    SELECT 1 FROM traposa_admins WHERE email = auth.email()
  ));
