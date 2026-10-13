import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

let cachedClient: SupabaseClient | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (!isSupabaseConfigured) return null;
  if (!cachedClient) {
    const { createClient } = await import('@supabase/supabase-js');
    cachedClient = createClient(supabaseUrl!, supabaseAnonKey!);
    console.log('⚡ [TestBuddyLabs] Connected to Supabase Cloud PostgreSQL!');
  }
  return cachedClient;
}

