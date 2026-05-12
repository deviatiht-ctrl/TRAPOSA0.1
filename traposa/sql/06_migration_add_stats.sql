-- 06_migration_add_stats.sql
-- Migration to add stats columns to traposa_settings table
-- Run this after 01_schema.sql if the table already exists without stats columns

-- Add stats columns to traposa_settings if they don't exist
DO $$
BEGIN
  -- Check and add stat_beneficiaires
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_beneficiaires'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_beneficiaires integer DEFAULT 10000;
  END IF;

  -- Check and add stat_projets
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_projets'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_projets integer DEFAULT 3;
  END IF;

  -- Check and add stat_benevoles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_benevoles'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_benevoles integer DEFAULT 50;
  END IF;

  -- Check and add stat_departements
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_departements'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_departements integer DEFAULT 3;
  END IF;

  -- Check and add stat_experience
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_experience'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_experience integer DEFAULT 3;
  END IF;

  -- Check and add stat_komin
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_komin'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_komin integer DEFAULT 5;
  END IF;

  -- Check and add stat_dons_total
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'traposa_settings' AND column_name = 'stat_dons_total'
  ) THEN
    ALTER TABLE traposa_settings ADD COLUMN stat_dons_total numeric DEFAULT 450000;
  END IF;
END $$;

-- Update existing settings with values
UPDATE traposa_settings SET
  stat_beneficiaires = 10000,
  stat_projets = 3,
  stat_benevoles = 50,
  stat_departements = 3,
  stat_experience = 3,
  stat_komin = 5,
  stat_dons_total = 450000
WHERE stat_beneficiaires IS NULL;
