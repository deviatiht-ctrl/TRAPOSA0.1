-- 10_payment_methods.sql
-- Table for dynamic payment methods management

CREATE TABLE IF NOT EXISTS traposa_payment_methods (
  id            uuid    DEFAULT gen_random_uuid() PRIMARY KEY,
  name          text    NOT NULL,
  type          text    NOT NULL DEFAULT 'other',
  account_name  text,
  account_number text,
  instructions  text,
  logo_url      text,
  icon_name     text    DEFAULT 'credit-card',
  is_active     boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE traposa_payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active payment methods" ON traposa_payment_methods;
DROP POLICY IF EXISTS "Authenticated full access payment methods" ON traposa_payment_methods;

-- Anyone can read active methods (shown on donation page)
CREATE POLICY "Public can read active payment methods"
ON traposa_payment_methods FOR SELECT
TO public
USING (is_active = true);

-- Authenticated users (admins) have full control
CREATE POLICY "Authenticated full access payment methods"
ON traposa_payment_methods FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed default methods (safe to re-run)
INSERT INTO traposa_payment_methods (name, type, icon_name, display_order, is_active)
VALUES
  ('MonCash',      'moncash',  'smartphone',  1, true),
  ('NatCash',      'natcash',  'wallet',      2, true),
  ('Kat Kredi',    'stripe',   'credit-card', 3, true)
ON CONFLICT DO NOTHING;
