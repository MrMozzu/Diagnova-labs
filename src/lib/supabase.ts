import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log('⚡ [TestBuddyLabs] Connected to Supabase Cloud PostgreSQL!');
} else {
  console.info('ℹ️ [TestBuddyLabs] Supabase credentials not set yet. Running in high-speed local persistence mode. To connect live PostgreSQL, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}
