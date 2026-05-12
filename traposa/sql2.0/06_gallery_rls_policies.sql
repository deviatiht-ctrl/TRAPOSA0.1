-- 06_gallery_rls_policies.sql
-- RLS policies for traposa_gallery table

-- Enable RLS
ALTER TABLE traposa_gallery ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow select gallery" ON traposa_gallery;
DROP POLICY IF EXISTS "Allow insert gallery" ON traposa_gallery;
DROP POLICY IF EXISTS "Allow delete gallery" ON traposa_gallery;
DROP POLICY IF EXISTS "Allow update gallery" ON traposa_gallery;

-- Public can read published gallery items
CREATE POLICY "Allow select gallery"
ON traposa_gallery FOR SELECT
TO public
USING (is_published = true);

-- Authenticated users can insert
CREATE POLICY "Allow insert gallery"
ON traposa_gallery FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Allow delete gallery"
ON traposa_gallery FOR DELETE
TO authenticated
USING (true);

-- Authenticated users can update
CREATE POLICY "Allow update gallery"
ON traposa_gallery FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
