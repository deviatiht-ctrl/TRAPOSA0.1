-- 08_donations_rls_policies.sql
-- RLS policies for traposa_donations table

-- Enable RLS
ALTER TABLE traposa_donations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow insert donations public" ON traposa_donations;
DROP POLICY IF EXISTS "Allow select donations authenticated" ON traposa_donations;
DROP POLICY IF EXISTS "Allow update donations authenticated" ON traposa_donations;

-- Public can insert donations (when making a donation)
CREATE POLICY "Allow insert donations public"
ON traposa_donations FOR INSERT
TO public
WITH CHECK (true);

-- Authenticated users can read ALL donations (for admin)
CREATE POLICY "Allow select donations authenticated"
ON traposa_donations FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can update
CREATE POLICY "Allow update donations authenticated"
ON traposa_donations FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
