// TRAPOSA Supabase Client Configuration
// Replace with your actual Supabase credentials

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialize Supabase client
let supabase = null;

try {
  if (typeof createClient !== 'undefined') {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    // If using CDN, supabase will be available as window.supabase
    supabase = window.supabase?.createClient?.(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.warn('Supabase client not initialized. Some features may not work.');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };
}
