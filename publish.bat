@echo off
cd /d "C:\Users\HACKER\Music\TRAPOSA"
git add traposa/assets/js/supabase-client.js
git commit -m "fix: wrap supabase client in IIFE to prevent redeclaration error"
git push origin main
pause
