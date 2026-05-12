-- 05_gallery_table.sql
-- Create table for gallery photos

CREATE TABLE IF NOT EXISTS traposa_gallery (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  image_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_gallery_display_order ON traposa_gallery(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON traposa_gallery(created_at DESC);
