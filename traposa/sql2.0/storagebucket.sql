-- storagebucket.sql
-- TRAPOSA Storage Setup
-- This file contains SQL for storage policies. Buckets must be created in Dashboard first.

-- ========================================================================
-- IMPORTANT: Create these buckets in Supabase Dashboard FIRST
-- ========================================================================
-- Go to: Dashboard → Storage → Create buckets
-- ========================================================================

-- Bucket 1: project-images
-- Name: project-images
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- Bucket 2: team-photos
-- Name: team-photos
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/*

-- Bucket 3: news-images
-- Name: news-images
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- Bucket 4: partner-logos
-- Name: partner-logos
-- Public: Yes
-- File size limit: 2MB
-- Allowed MIME types: image/*

-- Bucket 5: gallery-images
-- Name: gallery-images
-- Public: Yes
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- ========================================================================
-- After creating buckets, run the SQL below to create policies
-- ========================================================================

-- Drop existing policies (safe to re-run)
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

-- Public read policies (anyone can view images)
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

-- Authenticated upload policies (logged-in users can upload)
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

-- Authenticated delete policies (logged-in users can delete)
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
