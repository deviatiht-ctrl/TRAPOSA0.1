-- 01_schema.sql
-- Run first. All TRAPOSA tables.

-- Settings table for organization configuration
CREATE TABLE traposa_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_name text DEFAULT 'TRAPOSA',
  slogan text DEFAULT 'TRANSFORMER pour Sauver',
  logo_url text,
  description text,
  address text,
  contact_email text,
  phone text,
  facebook_url text,
  instagram_url text,
  twitter_url text,
  youtube_url text,
  moncash_number text,
  natcash_number text,
  stripe_publishable_key text,
  paypal_client_id text,
  bank_name text,
  bank_account text,
  bank_owner text,
  mission_pilier1_title text DEFAULT 'Edike',
  mission_pilier1_desc text,
  mission_pilier2_title text DEFAULT 'Edike',
  mission_pilier2_desc text,
  mission_pilier3_title text DEFAULT 'Proteje',
  mission_pilier3_desc text,
  maintenance_mode boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO traposa_settings (org_name) VALUES ('TRAPOSA');

-- Admins table
CREATE TABLE traposa_admins (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Projects table
CREATE TABLE traposa_projets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  description text,
  full_content text,
  category text NOT NULL,
  location text,
  department text,
  cover_image_url text,
  gallery_urls text[],
  beneficiaires integer DEFAULT 0,
  goal_amount numeric,
  raised_amount numeric DEFAULT 0,
  start_date date,
  end_date date,
  status text DEFAULT 'active' CHECK (status IN ('active','completed','paused','planning')),
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- News/Articles table
CREATE TABLE traposa_actualites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  content text,
  excerpt text,
  cover_image_url text,
  category text DEFAULT 'general'
    CHECK (category IN ('ijan','siksè','rapò','nouvèl','partenariat')),
  author text DEFAULT 'Ekip TRAPOSA',
  is_published boolean DEFAULT false,
  published_at timestamptz,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE traposa_equipe (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name text NOT NULL,
  role text NOT NULL,
  bio text,
  photo_url text,
  department text,
  email text,
  linkedin_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Causes/Fundraising categories table
CREATE TABLE traposa_causes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  icon text,
  goal_amount numeric,
  raised_amount numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0
);

-- Donations table
CREATE TABLE traposa_donations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_name text,
  donor_email text,
  donor_phone text,
  amount numeric NOT NULL,
  currency text DEFAULT 'HTG' CHECK (currency IN ('HTG','USD','EUR')),
  payment_method text NOT NULL
    CHECK (payment_method IN ('moncash','natcash','stripe','paypal','bank_transfer')),
  payment_reference text,
  cause_id uuid REFERENCES traposa_causes(id),
  cause_name text,
  message text,
  is_anonymous boolean DEFAULT false,
  status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','failed','refunded')),
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Volunteers table
CREATE TABLE traposa_benevoles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  department text,
  skills text[],
  availability text,
  motivation text,
  status text DEFAULT 'pending' CHECK (status IN ('pending','active','inactive')),
  created_at timestamptz DEFAULT now()
);

-- Partners table
CREATE TABLE traposa_partenaires (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  logo_url text,
  website_url text,
  category text,
  description text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Newsletter subscribers table
CREATE TABLE traposa_newsletter (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Update triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION traposa_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.updated_at = now(); 
  RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_traposa_settings BEFORE UPDATE ON traposa_settings
  FOR EACH ROW EXECUTE FUNCTION traposa_update_updated_at();
CREATE TRIGGER trg_traposa_projets BEFORE UPDATE ON traposa_projets
  FOR EACH ROW EXECUTE FUNCTION traposa_update_updated_at();
CREATE TRIGGER trg_traposa_actualites BEFORE UPDATE ON traposa_actualites
  FOR EACH ROW EXECUTE FUNCTION traposa_update_updated_at();
