// TRAPOSA Supabase Client Configuration
// Replace with your actual Supabase credentials

(function() {
  const SUPABASE_URL = 'https://oqjovwqmuulduuxhcnkc.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xam92d3FtdXVsZHV1eGhjbmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjgzMTMsImV4cCI6MjA5MzQwNDMxM30.EoRywTWdX8k8ixYz6EmGcJFEwLpDft-LcjHnsgydnCc';

  // Initialize Supabase client
  let client = null;

  try {
    if (typeof window !== 'undefined') {
      // Try to use createClient from global scope (CDN)
      if (typeof window.createClient === 'function') {
        client = window.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      } else if (window.supabase && typeof window.supabase.createClient === 'function') {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
    }
  } catch (error) {
    console.warn('Supabase client not initialized:', error);
  }

  // Expose to global scope
  if (typeof window !== 'undefined') {
    window.supabase = client;
    window.SUPABASE_URL = SUPABASE_URL;
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
  }

  // Export for ES modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase: client, SUPABASE_URL, SUPABASE_ANON_KEY };
  }
})();
