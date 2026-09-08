import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return null or dummy client placeholder when credentials are not yet configured
    console.warn("Supabase credentials not set. Connect Supabase in .env.local to enable backend persistence.");
    return null;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
