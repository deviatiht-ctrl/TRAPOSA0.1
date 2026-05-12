-- 07_projets_rls_policies.sql
-- RLS policies for traposa_projets table

-- Enable RLS
ALTER TABLE traposa_projets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow select projets public" ON traposa_projets;
DROP POLICY IF EXISTS "Allow select projets authenticated" ON traposa_projets;
DROP POLICY IF EXISTS "Allow insert projets authenticated" ON traposa_projets;
DROP POLICY IF EXISTS "Allow update projets authenticated" ON traposa_projets;
DROP POLICY IF EXISTS "Allow delete projets authenticated" ON traposa_projets;

-- Public can read published projects
CREATE POLICY "Allow select projets public"
ON traposa_projets FOR SELECT
TO public
USING (is_published = true);

-- Authenticated users can read ALL projects (for admin)
CREATE POLICY "Allow select projets authenticated"
ON traposa_projets FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow insert projets authenticated"
ON traposa_projets FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow update projets authenticated"
ON traposa_projets FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Authenticated users can delete
CREATE POLICY "Allow delete projets authenticated"
ON traposa_projets FOR DELETE
TO authenticated
USING (true);
