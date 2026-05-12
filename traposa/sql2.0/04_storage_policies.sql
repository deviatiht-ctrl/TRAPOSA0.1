-- 04_storage_policies.sql
-- Storage policies for TRAPOSA image uploads
-- NOTE: Buckets must be created in Supabase Dashboard first
-- Instructions: Go to Dashboard → Storage → Create buckets, then run this

-- Create buckets in Dashboard:
-- - project-images (public, 10MB)
-- - team-photos (public, 5MB)
-- - news-images (public, 10MB)
-- - partner-logos (public, 2MB)
-- - gallery-images (public, 10MB)

-- Drop policies if they exist (safe to run multiple times)
DROP POLICY IF EXISTS "Public Read project-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read team-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public Read news-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read partner-logos" ON storage.objects;
DROP POLICY IF EXISTS "Public Read gallery-images" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated Upload project-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload team-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload news-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload partner-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload gallery-images" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated Delete project-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete team-photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete news-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete partner-logos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete gallery-images" ON storage.objects;

-- Public read policies
CREATE POLICY "Public Read project-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY "Public Read team-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team-photos');

CREATE POLICY "Public Read news-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY "Public Read partner-logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'partner-logos');

CREATE POLICY "Public Read gallery-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery-images');

-- Authenticated upload policies
CREATE POLICY "Authenticated Upload project-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated Upload team-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "Authenticated Upload news-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY "Authenticated Upload partner-logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated Upload gallery-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery-images');

-- Authenticated delete policies
CREATE POLICY "Authenticated Delete project-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated Delete team-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-photos');

CREATE POLICY "Authenticated Delete news-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');

CREATE POLICY "Authenticated Delete partner-logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'partner-logos');

CREATE POLICY "Authenticated Delete gallery-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery-images');
