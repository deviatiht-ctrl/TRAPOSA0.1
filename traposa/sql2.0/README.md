# TRAPOSA SQL 2.0 Migrations

## Overview
This folder contains safe migration scripts to update TRAPOSA database without demo data.

## Execution Order
Run these files in order in Supabase SQL Editor:

1. **01_add_stats_columns.sql** - Adds stats columns to traposa_settings table (safe, won't fail if columns exist)
2. **02_update_settings.sql** - Updates settings with TRAPOSA real values (10,000 beneficiaries, 3 projects, 50 volunteers, G450,000 donations)
3. **03_seed_data_safe.sql** - Inserts seed data safely (won't fail if data exists)
4. **05_gallery_table.sql** - Creates gallery table for photos
5. **06_gallery_rls_policies.sql** - Creates RLS policies for gallery table
6. **07_projets_rls_policies.sql** - Creates RLS policies for projects table
7. **08_donations_rls_policies.sql** - Creates RLS policies for donations table
8. **09_settings_rls_policies.sql** - Creates RLS policies for settings table
9. **storagebucket.sql** - Creates storage policies (after creating buckets in Dashboard)

## Storage Setup
Before running storagebucket.sql:
1. Go to Supabase Dashboard → Storage
2. Create these buckets:
   - project-images (public, 10MB limit)
   - team-photos (public, 5MB limit)
   - news-images (public, 10MB limit)
   - partner-logos (public, 2MB limit)
   - gallery-images (public, 10MB limit)
3. Then run storagebucket.sql

## What These Scripts Do
- **No demo data** - All values are real TRAPOSA statistics
- **Safe execution** - Uses DROP POLICY IF EXISTS to prevent errors
- **Database-driven admin** - Admin panel loads from database, not hardcoded values

## Expected Results After Execution
- Admin dashboard shows: G450,000 donations, 10,000 beneficiaries, 3 projects, 50+ volunteers
- All admin features work with database data
- Image upload functionality works via storage buckets
- Gallery system allows adding photos without titles
- No demo/hardcoded values anywhere
