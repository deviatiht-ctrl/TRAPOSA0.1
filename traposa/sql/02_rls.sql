-- 02_rls.sql
-- Row Level Security policies for TRAPOSA tables

-- Enable RLS on all tables
ALTER TABLE traposa_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_projets ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_actualites ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_equipe ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_causes ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_benevoles ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE traposa_newsletter ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_traposa_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM traposa_admins WHERE email = auth.email());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Settings policies
CREATE POLICY "traposa_settings_read" ON traposa_settings FOR SELECT USING (true);
CREATE POLICY "traposa_settings_admin" ON traposa_settings FOR ALL USING (is_traposa_admin());

-- Admins policies - only admins can manage admins
CREATE POLICY "traposa_admins_only" ON traposa_admins FOR ALL USING (is_traposa_admin());

-- Projects policies
CREATE POLICY "traposa_projets_public" ON traposa_projets FOR SELECT
  USING (is_published = true OR is_traposa_admin());
CREATE POLICY "traposa_projets_admin" ON traposa_projets FOR ALL USING (is_traposa_admin());

-- News/Articles policies
CREATE POLICY "traposa_actualites_public" ON traposa_actualites FOR SELECT
  USING (is_published = true OR is_traposa_admin());
CREATE POLICY "traposa_actualites_admin" ON traposa_actualites FOR ALL USING (is_traposa_admin());

-- Team policies - public read for active members
CREATE POLICY "traposa_equipe_public" ON traposa_equipe FOR SELECT 
  USING (is_active = true OR is_traposa_admin());
CREATE POLICY "traposa_equipe_admin" ON traposa_equipe FOR ALL USING (is_traposa_admin());

-- Causes policies - public read for active causes
CREATE POLICY "traposa_causes_public" ON traposa_causes FOR SELECT 
  USING (is_active = true OR is_traposa_admin());
CREATE POLICY "traposa_causes_admin" ON traposa_causes FOR ALL USING (is_traposa_admin());

-- Donations policies
-- Users can see their own donations, admins can see all
CREATE POLICY "traposa_donations_own" ON traposa_donations FOR SELECT
  USING (auth.uid() = user_id OR is_traposa_admin());
-- Anyone can insert donations (for guest donations)
CREATE POLICY "traposa_donations_insert" ON traposa_donations FOR INSERT WITH CHECK (true);
-- Only admins can update donation status
CREATE POLICY "traposa_donations_admin_update" ON traposa_donations FOR UPDATE USING (is_traposa_admin());

-- Volunteers policies
-- Users can see their own volunteer record, admins can see all
CREATE POLICY "traposa_benevoles_own" ON traposa_benevoles FOR SELECT
  USING (auth.uid() = user_id OR is_traposa_admin());
-- Anyone can apply as volunteer
CREATE POLICY "traposa_benevoles_insert" ON traposa_benevoles FOR INSERT WITH CHECK (true);
-- Only admins can manage volunteers
CREATE POLICY "traposa_benevoles_admin" ON traposa_benevoles FOR ALL USING (is_traposa_admin());

-- Partners policies - public read for active partners
CREATE POLICY "traposa_partenaires_public" ON traposa_partenaires FOR SELECT 
  USING (is_active = true OR is_traposa_admin());
CREATE POLICY "traposa_partenaires_admin" ON traposa_partenaires FOR ALL USING (is_traposa_admin());

-- Newsletter policies
-- Anyone can subscribe
CREATE POLICY "traposa_newsletter_insert" ON traposa_newsletter FOR INSERT WITH CHECK (true);
-- Only admins can manage subscribers
CREATE POLICY "traposa_newsletter_admin" ON traposa_newsletter FOR ALL USING (is_traposa_admin());
