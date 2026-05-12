-- 07_storage_bucket.sql
-- NOTE: Supabase Storage buckets must be created through the Dashboard, not SQL
-- This file contains the storage policies that can be applied after buckets are created

-- Instructions:
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create these buckets:
--    - project-images (public, 10MB limit)
--    - team-photos (public, 5MB limit)
--    - news-images (public, 10MB limit)
--    - partner-logos (public, 2MB limit)
-- 3. After creating buckets, run the policies below in SQL Editor

-- Grant public access for reading
CREATE POLICY IF NOT EXISTS "Public Read project-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project-images');

CREATE POLICY IF NOT EXISTS "Public Read team-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'team-photos');

CREATE POLICY IF NOT EXISTS "Public Read news-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'news-images');

CREATE POLICY IF NOT EXISTS "Public Read partner-logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'partner-logos');

-- Grant authenticated users upload access
CREATE POLICY IF NOT EXISTS "Authenticated Upload project-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY IF NOT EXISTS "Authenticated Upload team-photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY IF NOT EXISTS "Authenticated Upload news-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'news-images');

CREATE POLICY IF NOT EXISTS "Authenticated Upload partner-logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'partner-logos');

-- Grant authenticated users delete access
CREATE POLICY IF NOT EXISTS "Authenticated Delete project-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project-images');

CREATE POLICY IF NOT EXISTS "Authenticated Delete team-photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'team-photos');

CREATE POLICY IF NOT EXISTS "Authenticated Delete news-images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'news-images');

CREATE POLICY IF NOT EXISTS "Authenticated Delete partner-logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'partner-logos');
