-- 11_donations_stripe_column.sql
-- Add stripe_payment_intent_id to traposa_donations
-- Also relax the payment_method CHECK to allow dynamic payment types

-- Add Stripe PaymentIntent ID column (safe if already exists)
ALTER TABLE traposa_donations
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- Drop old restrictive CHECK constraint on payment_method
-- (now supports any string since methods are managed dynamically)
ALTER TABLE traposa_donations
  DROP CONSTRAINT IF EXISTS traposa_donations_payment_method_check;
