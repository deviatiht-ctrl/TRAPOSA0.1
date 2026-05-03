-- 04_admin_email.sql
-- Add initial admin user
-- ⚠️ REPLACE admin@traposa.ht WITH YOUR REAL EMAIL BEFORE RUNNING

INSERT INTO traposa_admins (email) VALUES ('admin@traposa.ht');

-- To add more admins later, use:
-- INSERT INTO traposa_admins (email) VALUES ('another@email.com');
