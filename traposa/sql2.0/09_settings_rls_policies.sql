-- 09_settings_rls_policies.sql
-- RLS policies for traposa_settings table

-- Enable RLS
ALTER TABLE traposa_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies (safe to re-run)
DROP POLICY IF EXISTS "Allow select settings public" ON traposa_settings;
DROP POLICY IF EXISTS "Allow select settings authenticated" ON traposa_settings;
DROP POLICY IF EXISTS "Allow insert settings authenticated" ON traposa_settings;
DROP POLICY IF EXISTS "Allow update settings authenticated" ON traposa_settings;

-- Public can read settings (for homepage stats display)
CREATE POLICY "Allow select settings public"
ON traposa_settings FOR SELECT
TO public
USING (true);

-- Authenticated users can read ALL settings (for admin)
CREATE POLICY "Allow select settings authenticated"
ON traposa_settings FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can insert
CREATE POLICY "Allow insert settings authenticated"
ON traposa_settings FOR INSERT
TO authenticated
WITH CHECK (true);

-- Authenticated users can update
CREATE POLICY "Allow update settings authenticated"
ON traposa_settings FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
